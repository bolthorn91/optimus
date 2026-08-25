import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import type { Plugin } from 'vite';

import { CHUNK_REPORT_PATH, type ChunkEntry, type ChunkReport } from './bundle-policy.js';

/**
 * Emite el mapa chunk → módulos e imports que `scripts/check-budget.mjs` necesita para auditar la
 * primera carga: Rollup no expone esa relación en el manifiesto normal. Se escribe fuera de
 * `dist/` porque expone rutas internas y no tiene por qué publicarse.
 *
 * El contrato del informe vive en `bundle-policy.js`, que es quien lo valida al leerlo.
 */
export function chunkReportPlugin(): Plugin {
  let root = process.cwd();

  return {
    name: 'optimvs-chunk-report',
    apply: 'build',
    configResolved(config) {
      root = config.root;
    },
    async writeBundle(_options, bundle) {
      const chunks: ChunkEntry[] = [];
      let entryFile: string | null = null;

      for (const item of Object.values(bundle)) {
        if (item.type !== 'chunk') continue;
        if (item.isEntry) entryFile = item.fileName;
        chunks.push({
          file: item.fileName,
          isEntry: item.isEntry,
          moduleIds: Object.keys(item.modules),
          imports: [...item.imports],
          dynamicImports: [...item.dynamicImports],
        });
      }

      if (entryFile === null) {
        this.error('la build no produjo ningún chunk de entrada: el informe sería inauditable.');
      }

      const report: ChunkReport = { entryFile, chunks };
      const target = path.resolve(root, CHUNK_REPORT_PATH);

      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    },
  };
}

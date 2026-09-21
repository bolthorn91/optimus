import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

import { describe, expect, it } from 'vitest';

import {
  CHUNK_REPORT_PATH,
  ENTRY_BUDGET_GZIP_BYTES,
  WEBGL_CHUNK_NAME,
  WEBGL_PACKAGES,
  WEBGL_SCOPES,
  WEBGL_SCENE_BUDGET_GZIP_BYTES,
  deferredWebglChunkFiles,
  findEagerWebglModules,
  isWebglModule,
  nodeModulePackage,
  parseChunkReport,
  staticImportClosure,
  type ChunkEntry,
} from './bundle-policy.js';

const REPORT = resolve(process.cwd(), CHUNK_REPORT_PATH);
const DIST = resolve(process.cwd(), 'dist');
const hasReport = existsSync(REPORT) && existsSync(DIST);

function deferredWebglFromReport(): string[] {
  if (!hasReport) return [];
  const report = parseChunkReport(JSON.parse(readFileSync(REPORT, 'utf8')));
  return deferredWebglChunkFiles(
    report.chunks,
    staticImportClosure(report.entryFile, report.chunks),
  );
}

const hasDeferredWebgl = deferredWebglFromReport().length > 0;

function chunk(file: string, over: Partial<ChunkEntry> = {}): ChunkEntry {
  return { file, isEntry: false, moduleIds: [], imports: [], dynamicImports: [], ...over };
}

const THREE = '/repo/node_modules/three/build/three.module.js';

describe('isWebglModule', () => {
  it.each([
    '/repo/node_modules/three/build/three.module.js',
    '/repo/node_modules/@react-three/fiber/dist/index.js',
    '/repo/node_modules/@react-three/drei/core/Html.js',
    '/repo/node_modules/postprocessing/build/index.js',
    '/repo/node_modules/three-stdlib/index.js',
  ])('reconoce %s como módulo WebGL', (id) => {
    expect(isWebglModule(id)).toBe(true);
  });

  it('reconoce rutas con separador de Windows', () => {
    expect(isWebglModule('C:\\repo\\node_modules\\three\\build\\three.module.js')).toBe(true);
  });

  it.each([
    '/repo/src/components/ThreeColumns.tsx',
    '/repo/src/lib/three-column-layout.ts',
    '/repo/node_modules/react/index.js',
    '/repo/node_modules/gsap/ScrollTrigger.js',
    '/repo/node_modules/three-mesh-bvh/index.js',
  ])('no marca %s como módulo WebGL', (id) => {
    expect(isWebglModule(id)).toBe(false);
  });

  it('no confunde un fichero propio cuyo nombre empieza por el patrón', () => {
    expect(isWebglModule('/repo/src/scenes/three-maps/Scene.tsx')).toBe(false);
    expect(isWebglModule('/repo/src/postprocessing-notes.ts')).toBe(false);
  });
});

describe('staticImportClosure', () => {
  it('incluye la propia entrada', () => {
    expect([...staticImportClosure('a.js', [chunk('a.js', { isEntry: true })])]).toEqual(['a.js']);
  });

  it('sigue los imports estáticos de forma transitiva', () => {
    const chunks = [
      chunk('a.js', { isEntry: true, imports: ['b.js'] }),
      chunk('b.js', { imports: ['c.js'] }),
      chunk('c.js'),
    ];
    expect(staticImportClosure('a.js', chunks)).toEqual(new Set(['a.js', 'b.js', 'c.js']));
  });

  it('NO sigue los imports dinámicos: son justamente los que I9 permite', () => {
    const chunks = [
      chunk('a.js', { isEntry: true, dynamicImports: ['webgl.js'] }),
      chunk('webgl.js'),
    ];
    expect(staticImportClosure('a.js', chunks)).toEqual(new Set(['a.js']));
  });

  it('no entra en bucle con imports circulares', () => {
    const chunks = [
      chunk('a.js', { isEntry: true, imports: ['b.js'] }),
      chunk('b.js', { imports: ['a.js'] }),
    ];
    expect(staticImportClosure('a.js', chunks)).toEqual(new Set(['a.js', 'b.js']));
  });

  it('tolera un import a un chunk que no está en el informe', () => {
    const chunks = [chunk('a.js', { isEntry: true, imports: ['fantasma.js'] })];
    expect(staticImportClosure('a.js', chunks)).toEqual(new Set(['a.js', 'fantasma.js']));
  });
});

describe('findEagerWebglModules', () => {
  it('delata WebGL importado ESTÁTICAMENTE aunque viva en otro chunk', () => {
    const chunks = [
      chunk('index.js', { isEntry: true, imports: ['webgl.js'] }),
      chunk('webgl.js', { moduleIds: [THREE] }),
    ];
    const offenders = findEagerWebglModules(chunks, staticImportClosure('index.js', chunks));

    expect(offenders).toEqual([{ file: 'webgl.js', moduleId: THREE }]);
  });

  it('aprueba WebGL importado dinámicamente', () => {
    const chunks = [
      chunk('index.js', { isEntry: true, dynamicImports: ['webgl.js'] }),
      chunk('webgl.js', { moduleIds: [THREE] }),
    ];
    const offenders = findEagerWebglModules(chunks, staticImportClosure('index.js', chunks));

    expect(offenders).toEqual([]);
  });

  // FND-15
  it('FND-15 · delata three, @react-three y postprocessing en el chunk de entrada', () => {
    const fiber = '/repo/node_modules/@react-three/fiber/dist/index.js';
    const post = '/repo/node_modules/postprocessing/build/index.js';
    const chunks = [chunk('index.js', { isEntry: true, moduleIds: [THREE, fiber, post] })];
    const offenders = findEagerWebglModules(chunks, staticImportClosure('index.js', chunks));

    expect(offenders.map((item) => item.moduleId)).toEqual([THREE, fiber, post]);
  });

  it('no delata nada cuando no hay WebGL en ninguna parte', () => {
    const chunks = [
      chunk('index.js', { isEntry: true, moduleIds: ['/repo/src/main.tsx'] }),
      chunk('vendor.js', { moduleIds: ['/repo/node_modules/react/index.js'] }),
    ];
    const offenders = findEagerWebglModules(chunks, staticImportClosure('index.js', chunks));

    expect(offenders).toEqual([]);
  });
});

describe('parseChunkReport', () => {
  const valid = {
    entryFile: 'index.js',
    chunks: [{ file: 'index.js', isEntry: true, moduleIds: [], imports: [], dynamicImports: [] }],
  };

  it('acepta un informe bien formado', () => {
    expect(parseChunkReport(valid)).toEqual(valid);
  });

  it.each([
    ['no es un objeto', 'texto suelto'],
    ['es null', null],
    ['no declara entrada', { entryFile: '', chunks: valid.chunks }],
    ['no tiene chunks', { entryFile: 'index.js', chunks: [] }],
    ['tiene un chunk con forma inesperada', { entryFile: 'index.js', chunks: [{ file: 1 }] }],
    ['le falta el chunk de entrada que declara', { entryFile: 'otro.js', chunks: valid.chunks }],
  ])('rechaza un informe que %s', (_caso, raw) => {
    expect(() => parseChunkReport(raw)).toThrow(TypeError);
  });

  it('rechaza un chunk al que le falta dynamicImports', () => {
    const sinDynamic = {
      entryFile: 'index.js',
      chunks: [{ file: 'index.js', isEntry: true, moduleIds: [], imports: [] }],
    };
    expect(() => parseChunkReport(sinDynamic)).toThrow(TypeError);
  });
});

describe('deferredWebglChunkFiles', () => {
  it('ignora WebGL en la primera carga y recoge el chunk nombrado y los módulos diferidos', () => {
    const chunks = [
      chunk('index.js', { isEntry: true, dynamicImports: ['assets/webgl-aa.js'] }),
      chunk('assets/webgl-aa.js', { moduleIds: [THREE] }),
      chunk('assets/other.js', { moduleIds: ['/repo/src/main.tsx'] }),
    ];
    const eager = staticImportClosure('index.js', chunks);
    expect(deferredWebglChunkFiles(chunks, eager)).toEqual(['assets/webgl-aa.js']);
  });
});

describe('constantes de la política', () => {
  it('declara el presupuesto exacto del perfil §5', () => {
    expect(ENTRY_BUDGET_GZIP_BYTES).toBe(250 * 1024);
  });

  it('declara el presupuesto de la escena WebGL del doc 03 F10', () => {
    expect(WEBGL_SCENE_BUDGET_GZIP_BYTES).toBe(400 * 1024);
  });

  it.skipIf(!hasReport)(
    'SAT-11 · el cierre estático de la entrada no contiene three ni R3F',
    () => {
      const report = parseChunkReport(JSON.parse(readFileSync(REPORT, 'utf8')));
      const eager = staticImportClosure(report.entryFile, report.chunks);
      expect(findEagerWebglModules(report.chunks, eager)).toEqual([]);
    },
  );

  it.skipIf(!hasDeferredWebgl)(
    'SAT-12 · el chunk diferido de la escena no supera 400 KB gzip',
    () => {
      const report = parseChunkReport(JSON.parse(readFileSync(REPORT, 'utf8')));
      const eager = staticImportClosure(report.entryFile, report.chunks);
      const files = deferredWebglChunkFiles(report.chunks, eager);
      expect(files.length).toBeGreaterThan(0);
      let bytes = 0;
      for (const file of files) {
        bytes += gzipSync(readFileSync(resolve(DIST, file)), { level: 9 }).byteLength;
      }
      expect(bytes).toBeLessThanOrEqual(WEBGL_SCENE_BUDGET_GZIP_BYTES);
    },
  );

  it('expone paquetes, scopes y el nombre del chunk diferido', () => {
    expect([...WEBGL_PACKAGES]).toEqual(['three', 'three-stdlib', 'postprocessing']);
    expect([...WEBGL_SCOPES]).toEqual(['@react-three']);
    expect(WEBGL_CHUNK_NAME).toBe('webgl');
  });

  it('extrae el paquete npm, no un prefijo de ruta', () => {
    expect(nodeModulePackage('/repo/node_modules/three/build/three.module.js')).toBe('three');
    expect(nodeModulePackage('/repo/node_modules/@react-three/fiber/dist/index.js')).toBe(
      '@react-three/fiber',
    );
    expect(nodeModulePackage('/repo/src/lib/three-column-layout.ts')).toBeNull();
  });
});

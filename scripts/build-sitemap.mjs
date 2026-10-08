#!/usr/bin/env node
/**
 * Genera dist/sitemap.xml desde el manifiesto `ROUTES` (G4, §3.3).
 * Sin VITE_SITE_URL absoluta no escribe y avisa (§3.6). Carga los módulos TypeScript
 * con el SSR de Vite para no duplicar el manifiesto ni el algoritmo.
 */
import { existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createServer } from 'vite';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const TARGET = path.join(DIST, 'sitemap.xml');

async function main() {
  if (!existsSync(DIST)) {
    console.warn('No se escribe sitemap: no existe dist/. Ejecute vite build primero.');
    return;
  }

  const server = await createServer({
    root: ROOT,
    mode: 'production',
    appType: 'custom',
    logLevel: 'error',
    server: { middlewareMode: true, hmr: false },
    optimizeDeps: { noDiscovery: true },
  });

  try {
    const routesModule = /** @type {{ ROUTES: readonly unknown[] }} */ (
      await server.ssrLoadModule('/src/app/routes.ts')
    );
    const sitemapModule =
      /** @type {{ buildSitemap: (routes: readonly unknown[], siteUrl: string) => string }} */ (
        await server.ssrLoadModule('/src/lib/sitemap.ts')
      );
    const siteUrl = String(server.config.env.VITE_SITE_URL ?? '').trim();
    try {
      const xml = sitemapModule.buildSitemap(routesModule.ROUTES, siteUrl);
      await writeFile(TARGET, xml, 'utf8');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(message);
    }
  } finally {
    await server.close();
  }
}

const invoked =
  process.argv[1] !== undefined && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (invoked) {
  await main();
}

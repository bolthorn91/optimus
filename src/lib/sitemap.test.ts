import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { ROUTES } from '@/app/routes';
import { buildSitemap, SITEMAP_MISSING_URL, SitemapError } from '@/lib/sitemap';

const SITE = 'https://example.test';
const SCRIPT = readFileSync(resolve(process.cwd(), 'scripts/build-sitemap.mjs'), 'utf8');

function indexable(routes: typeof ROUTES) {
  return routes.filter((route) => !(route.kind === 'legal' && route.hasPendingData));
}

describe('buildSitemap', () => {
  it('DET-12 · sin URL absoluta no genera sitemap y lanza un error claro', () => {
    expect(() => buildSitemap(ROUTES, '')).toThrow(SitemapError);
    expect(() => buildSitemap(ROUTES, '')).toThrow(SITEMAP_MISSING_URL);
    expect(() => buildSitemap(ROUTES, 'example.test')).toThrow(SitemapError);
    expect(() => buildSitemap(ROUTES, 'ftp://example.test')).toThrow(SitemapError);
  });

  it('DET-13 · excluye las páginas legales con datos pendientes', () => {
    const xml = buildSitemap(ROUTES, SITE);
    expect(xml).not.toContain('/aviso-legal');
    expect(xml).not.toContain('/politica-de-privacidad');
    expect(xml).not.toContain('/politica-de-cookies');
    for (const route of ROUTES.filter((entry) => entry.kind === 'legal')) {
      expect(route.hasPendingData).toBe(true);
    }
  });

  it('SEO-03 · XML bien formado, ordenado por prioridad, con las rutas indexables', () => {
    const xml = buildSitemap(ROUTES, SITE);
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    const expected = indexable(ROUTES)
      .map((route) => ({
        loc: route.path === '/' ? `${SITE}/` : `${SITE}${route.path}`,
        priority: route.priority,
      }))
      .sort((left, right) => right.priority - left.priority || left.loc.localeCompare(right.loc))
      .map((entry) => entry.loc);
    expect(locs).toEqual(expected);
    expect(locs[0]).toBe(`${SITE}/`);
  });

  it('el script Node carga ROUTES por Vite y no duplica el manifiesto', () => {
    expect(SCRIPT).toContain("ssrLoadModule('/src/app/routes.ts')");
    expect(SCRIPT).toContain("ssrLoadModule('/src/lib/sitemap.ts')");
    expect(SCRIPT).toContain("mode: 'production'");
    expect(SCRIPT).toContain('noDiscovery: true');
    expect(SCRIPT).toContain('server.config.env.VITE_SITE_URL');
    expect(SCRIPT).toContain('sitemapModule.buildSitemap(routesModule.ROUTES, siteUrl)');
    expect(SCRIPT).not.toContain('SITEMAP_ROUTES');
    expect(SCRIPT).not.toContain('process.env.VITE_SITE_URL');
    expect(SCRIPT).not.toContain(SITEMAP_MISSING_URL);
  });
});

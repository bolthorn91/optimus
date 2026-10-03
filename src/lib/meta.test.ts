import { describe, expect, it } from 'vitest';

import { ROUTES } from '@/app/routes';
import { joinUrl, metaFor, TITLE_SUFFIX } from '@/lib/meta';

const SITE = 'https://example.test';

describe('metaFor', () => {
  it('DET-11 · cada ruta del manifiesto tiene título, descripción y canónica', () => {
    for (const route of ROUTES) {
      const meta = metaFor(route, SITE);
      expect(meta.title.length).toBeGreaterThan(0);
      expect(meta.title.endsWith(`— ${TITLE_SUFFIX}`)).toBe(true);
      expect(meta.description.length).toBeGreaterThan(0);
      expect(meta.canonical).toBe(joinUrl(SITE, route.path));
    }
  });

  it('SEO-01 · títulos y descripciones no vacíos y distintos entre sí', () => {
    const titles = ROUTES.map((route) => route.title);
    const descriptions = ROUTES.map((route) => route.description);
    expect(titles.every((title) => title.trim().length > 0)).toBe(true);
    expect(descriptions.every((text) => text.trim().length > 0)).toBe(true);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it('las páginas legales con datos pendientes se sirven con noindex', () => {
    const legal = ROUTES.find((route) => route.path === '/aviso-legal');
    const home = ROUTES.find((route) => route.path === '/');
    const act = ROUTES.find((route) => route.path === '/escenario-europeo');
    expect(legal).toBeDefined();
    expect(home).toBeDefined();
    expect(act).toBeDefined();
    if (!legal || !home || !act) return;
    expect(metaFor(legal, SITE).robots).toBe('noindex');
    expect(metaFor(home, SITE).robots).toBe('index,follow');
    expect(metaFor(act, SITE).robots).toBe('index,follow');
  });

  it('joinUrl no duplica barras y la home termina en /', () => {
    expect(joinUrl('https://example.test/', '/escenario-europeo')).toBe(
      'https://example.test/escenario-europeo',
    );
    expect(joinUrl('https://example.test', '/')).toBe('https://example.test/');
  });
});

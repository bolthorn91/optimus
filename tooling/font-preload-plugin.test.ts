import { describe, expect, it } from 'vitest';

import { assetHref, fontPreloadTags, preloadableFonts } from './font-preload-plugin';

const BUNDLE = [
  'assets/index-abc.js',
  'assets/index-abc.css',
  'assets/inter-latin-wght-normal-xyz.woff2',
  'assets/cinzel-latin-600-normal-def.woff2',
  'assets/cinzel-latin-400-normal-ghi.woff2',
  'assets/cinzel-latin-400-normal-jkl.woff',
  'index.html',
];

describe('preloadableFonts', () => {
  it('selecciona solo woff2 y descarta el resto del bundle', () => {
    expect(preloadableFonts(BUNDLE)).toEqual([
      'assets/cinzel-latin-400-normal-ghi.woff2',
      'assets/cinzel-latin-600-normal-def.woff2',
      'assets/inter-latin-wght-normal-xyz.woff2',
    ]);
  });

  it('deja fuera el respaldo .woff, que ningún navegador soportado pide', () => {
    expect(preloadableFonts(BUNDLE)).not.toContain('assets/cinzel-latin-400-normal-jkl.woff');
  });

  it('devuelve orden estable para que la salida sea reproducible', () => {
    const desordenado = [...BUNDLE].reverse();
    expect(preloadableFonts(desordenado)).toEqual(preloadableFonts(BUNDLE));
  });

  it('con un bundle sin fuentes no devuelve nada', () => {
    expect(preloadableFonts(['assets/index.js', 'index.html'])).toEqual([]);
  });
});

describe('assetHref respeta la base pública', () => {
  it.each([
    ['/', 'assets/f.woff2', '/assets/f.woff2'],
    ['/sitio/', 'assets/f.woff2', '/sitio/assets/f.woff2'],
    ['/sitio', 'assets/f.woff2', '/sitio/assets/f.woff2'],
    ['https://cdn.test/x/', 'assets/f.woff2', 'https://cdn.test/x/assets/f.woff2'],
  ])('base %s + %s → %s', (base, file, esperado) => {
    expect(assetHref(base, file)).toBe(esperado);
  });

  it('no duplica la barra cuando el fichero ya la trae', () => {
    expect(assetHref('/sitio/', '/assets/f.woff2')).toBe('/sitio/assets/f.woff2');
  });
});

describe('fontPreloadTags', () => {
  it('genera un link por fuente, con los atributos que exige la precarga', () => {
    const tags = fontPreloadTags(BUNDLE, '/');

    expect(tags).toHaveLength(3);
    for (const tag of tags) {
      expect(tag.tag).toBe('link');
      expect(tag.injectTo).toBe('head-prepend');
      expect(tag.attrs).toMatchObject({
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        // Sin crossorigin el navegador descarga la fuente dos veces.
        crossorigin: '',
      });
    }
  });

  it('aplica la base a cada href', () => {
    const tags = fontPreloadTags(BUNDLE, '/sitio/');
    const hrefs = tags.map((t) => t.attrs?.href);

    expect(hrefs.every((h) => typeof h === 'string' && h.startsWith('/sitio/assets/'))).toBe(true);
  });
});

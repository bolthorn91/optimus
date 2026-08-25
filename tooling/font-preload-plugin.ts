import type { HtmlTagDescriptor, Plugin } from 'vite';

/**
 * Solo woff2: el respaldo `.woff` no lo pide ningún navegador de los que soporta el proyecto, y
 * precargarlo sería descargar peso que nadie usa. El `type` de los `<link>` va fijo a juego.
 */
const FONT_EXTENSION = '.woff2';
const FONT_MIME = 'font/woff2';

/** Une la base pública con el nombre del fichero sin duplicar ni perder barras. */
export function assetHref(base: string, file: string): string {
  const prefix = base.endsWith('/') ? base : `${base}/`;
  return `${prefix}${file.replace(/^\/+/, '')}`;
}

/** Los ficheros de fuente de un bundle, en orden estable. */
export function preloadableFonts(files: readonly string[]): string[] {
  return files.filter((file) => file.endsWith(FONT_EXTENSION)).sort();
}

export function fontPreloadTags(files: readonly string[], base: string): HtmlTagDescriptor[] {
  return preloadableFonts(files).map((file) => ({
    tag: 'link',
    attrs: {
      rel: 'preload',
      as: 'font',
      type: FONT_MIME,
      href: assetHref(base, file),
      // Obligatorio incluso en el mismo origen: las fuentes se piden en modo CORS.
      crossorigin: '',
    },
    injectTo: 'head-prepend',
  }));
}

/**
 * Inyecta `<link rel="preload">` para las fuentes emitidas (doc 00 §7 fase A punto 8).
 *
 * No puede escribirse a mano en `index.html`: Vite añade un hash al nombre de cada fichero, así
 * que la ruta solo se conoce al construir.
 */
export function fontPreloadPlugin(): Plugin {
  let base = '/';

  return {
    name: 'optimvs-font-preload',
    apply: 'build',
    configResolved(config) {
      base = config.base;
    },
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        return fontPreloadTags(Object.keys(ctx.bundle ?? {}), base);
      },
    },
  };
}

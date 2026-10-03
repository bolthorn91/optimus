export const TITLE_SUFFIX = 'OPTIMVS Capital Protegido';

export interface MetaSource {
  path: string;
  kind: string;
  title: string;
  description: string;
  hasPendingData: boolean;
}

export interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  robots: 'noindex' | 'index,follow';
}

export function joinUrl(base: string, path: string): string {
  const trimmed = base.replace(/\/+$/, '');
  if (path === '/') return `${trimmed}/`;
  return `${trimmed}${path.startsWith('/') ? path : `/${path}`}`;
}

export function metaFor(route: MetaSource, siteUrl: string): PageMeta {
  const robots: PageMeta['robots'] =
    route.hasPendingData && route.kind === 'legal' ? 'noindex' : 'index,follow';
  return {
    title: `${route.title} — ${TITLE_SUFFIX}`,
    description: route.description,
    canonical: joinUrl(siteUrl, route.path),
    ogImage: joinUrl(siteUrl, '/og.png'),
    robots,
  };
}

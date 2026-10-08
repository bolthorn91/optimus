import { joinUrl } from '@/lib/meta';

export const SITEMAP_MISSING_URL =
  'No se genera sitemap: VITE_SITE_URL debe ser una URL absoluta (https://… o http://…).';

export class SitemapError extends Error {
  constructor(message: string = SITEMAP_MISSING_URL) {
    super(message);
    this.name = 'SitemapError';
  }
}

export interface SitemapRoute {
  path: string;
  kind: string;
  hasPendingData: boolean;
  changefreq: 'monthly' | 'yearly';
  priority: number;
}

function isAbsoluteSiteUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function buildSitemap(routes: readonly SitemapRoute[], siteUrl: string): string {
  if (!isAbsoluteSiteUrl(siteUrl)) {
    throw new SitemapError();
  }
  const entries = routes
    .filter((route) => !(route.kind === 'legal' && route.hasPendingData))
    .map((route) => ({
      loc: joinUrl(siteUrl, route.path),
      changefreq: route.changefreq,
      priority: route.priority,
    }))
    .sort((left, right) => right.priority - left.priority || left.loc.localeCompare(right.loc));

  const urls = entries
    .map(
      (entry) =>
        `  <url>\n    <loc>${entry.loc}</loc>\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority.toFixed(1)}</priority>\n  </url>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

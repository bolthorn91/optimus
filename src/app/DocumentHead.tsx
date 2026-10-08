import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router';

import { homeRoute, routeByPath } from '@/app/routes';
import { readEnv } from '@/lib/env';
import { metaFor } from '@/lib/meta';
import { organizationSchema } from '@/lib/organization';

function siteUrl(): string {
  return readEnv('VITE_SITE_URL') ?? window.location.origin;
}

function upsertNamedMeta(name: string, content: string): void {
  const head = document.head;
  let node = head.querySelector(`meta[name="${name}"]`);
  if (!node) {
    node = document.createElement('meta');
    node.setAttribute('name', name);
    head.append(node);
  }
  node.setAttribute('content', content);
}

function upsertCanonical(href: string): void {
  const head = document.head;
  let node = head.querySelector('link[rel="canonical"]');
  if (!node) {
    node = document.createElement('link');
    node.setAttribute('rel', 'canonical');
    head.append(node);
  }
  node.setAttribute('href', href);
}

function upsertPropertyMeta(property: string, content: string): void {
  const head = document.head;
  let node = head.querySelector(`meta[property="${property}"]`);
  if (!node) {
    node = document.createElement('meta');
    node.setAttribute('property', property);
    head.append(node);
  }
  node.setAttribute('content', content);
}

function upsertJsonLd(json: unknown): void {
  const head = document.head;
  let node = head.querySelector('script[data-org-schema]');
  if (!node) {
    node = document.createElement('script');
    node.setAttribute('type', 'application/ld+json');
    node.setAttribute('data-org-schema', '');
    head.append(node);
  }
  node.textContent = JSON.stringify(json);
}

export function DocumentHead() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const known = routeByPath(pathname);
    if (!known && import.meta.env.DEV) {
      console.warn(`Ruta desconocida: ${pathname}`);
    }
    const meta = metaFor(known ?? homeRoute(), siteUrl());
    document.title = meta.title;
    upsertNamedMeta('description', meta.description);
    upsertNamedMeta('robots', meta.robots);
    upsertCanonical(meta.canonical);
    upsertPropertyMeta('og:title', meta.title);
    upsertPropertyMeta('og:description', meta.description);
    upsertPropertyMeta('og:image', meta.ogImage);
    upsertPropertyMeta('og:url', meta.canonical);
    upsertPropertyMeta('og:type', 'website');
    upsertNamedMeta('twitter:image', meta.ogImage);
    upsertJsonLd(organizationSchema(siteUrl()));
  }, [pathname]);

  return null;
}

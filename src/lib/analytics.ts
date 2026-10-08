import { readEnv } from '@/lib/env';

/** Eventos G7. Analítica sin cookies (G5): no hay consentimiento que esperar. */
export const ANALYTICS_EVENTS = [
  'form_submit',
  'cta_click',
  'dossier_download',
  'act_scroll_depth',
  'map_interaction',
  'simulator_interaction',
  'contact_link',
] as const;

export const DEPTH_MARKS = [0.25, 0.5, 0.75, 1] as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];

export type AnalyticsPayload = Readonly<Record<string, string | number | boolean>>;

export type AnalyticsSink = (name: AnalyticsEvent, payload?: AnalyticsPayload) => void;

export interface ClickAnalytics {
  name: AnalyticsEvent;
  payload: AnalyticsPayload;
}

export interface ClickAttrs {
  track: string | null;
  position: string | null;
}

function defaultSink(name: AnalyticsEvent, payload?: AnalyticsPayload): void {
  const endpoint = readEnv('VITE_ANALYTICS_ENDPOINT');
  if (endpoint === undefined) return;
  const body = JSON.stringify({ name, payload });
  if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    navigator.sendBeacon(endpoint, body);
    return;
  }
  if (typeof fetch === 'function') {
    void fetch(endpoint, {
      method: 'POST',
      body,
      keepalive: true,
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

let sink: AnalyticsSink = defaultSink;

/** El sitio no usa cookies no esenciales; el banner no aplica (G5, G6). */
export function analyticsRequiresConsent(): boolean {
  return false;
}

export function setAnalyticsSink(next?: AnalyticsSink): void {
  sink = next ?? defaultSink;
}

export function resetAnalytics(): void {
  sink = defaultSink;
}

export function trackEvent(name: AnalyticsEvent, payload?: AnalyticsPayload): void {
  if (analyticsRequiresConsent()) return;
  sink(name, payload);
}

export function eventFromClick(href: string, attrs: ClickAttrs): ClickAnalytics | undefined {
  if (href.includes('dossier.pdf')) return { name: 'dossier_download', payload: { href } };
  if (href.startsWith('tel:') || href.startsWith('mailto:')) {
    return { name: 'contact_link', payload: { href } };
  }
  if (attrs.track === 'cta') {
    return {
      name: 'cta_click',
      payload: { href, position: attrs.position ?? 'unknown' },
    };
  }
  return undefined;
}

export interface DepthSection {
  id: string;
  act: number | null;
  order: number;
}

export interface ActDepthEvent {
  act: number;
  section: string;
  depth: number;
}

/** Progreso local 0…1 de una sección. Tras salir de ella es 1, para que el umbral 100 % dispare. */
export function localProgress(progress: number, order: number, count: number): number {
  const scaled = progress * count;
  if (scaled <= order) return 0;
  if (scaled >= order + 1) return 1;
  return scaled - order;
}

export function actDepthMarks(
  previousProgress: number,
  nextProgress: number,
  sections: readonly DepthSection[],
): ActDepthEvent[] {
  const count = sections.length;
  const events: ActDepthEvent[] = [];
  for (const section of sections) {
    if (section.act === null) continue;
    const from = localProgress(previousProgress, section.order, count);
    const to = localProgress(nextProgress, section.order, count);
    for (const depth of DEPTH_MARKS) {
      if (from < depth && to >= depth) {
        events.push({ act: section.act, section: section.id, depth });
      }
    }
  }
  return events;
}

import { afterEach, describe, expect, it, vi } from 'vitest';

import { SECTIONS } from '@/app/sections';
import {
  ANALYTICS_EVENTS,
  actDepthMarks,
  analyticsRequiresConsent,
  eventFromClick,
  resetAnalytics,
  setAnalyticsSink,
  trackEvent,
} from '@/lib/analytics';
import { ENV_KEYS } from '@/lib/env';

const none = { track: null, position: null };

describe('analítica cookieless', () => {
  afterEach(() => {
    resetAnalytics();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('declara los siete eventos de G7', () => {
    expect([...ANALYTICS_EVENTS]).toEqual([
      'form_submit',
      'cta_click',
      'dossier_download',
      'act_scroll_depth',
      'map_interaction',
      'simulator_interaction',
      'contact_link',
    ]);
  });

  it('SEO-04 · el consentimiento no aplica: cookieless, los eventos se emiten', () => {
    const received: string[] = [];
    setAnalyticsSink((name) => {
      received.push(name);
    });
    expect(analyticsRequiresConsent()).toBe(false);
    trackEvent('cta_click', { href: '/#contacto' });
    expect(received).toEqual(['cta_click']);
  });

  it('el sink de producción no envía sin VITE_ANALYTICS_ENDPOINT', () => {
    const beacon = vi.fn();
    vi.stubEnv('VITE_ANALYTICS_ENDPOINT', '');
    vi.stubGlobal('navigator', { sendBeacon: beacon });
    resetAnalytics();
    trackEvent('form_submit');
    expect(beacon).not.toHaveBeenCalled();
  });

  it('el sink de producción usa sendBeacon cuando hay destino', () => {
    const beacon = vi.fn(() => true);
    vi.stubEnv('VITE_ANALYTICS_ENDPOINT', 'https://collect.example.test/e');
    vi.stubGlobal('navigator', { sendBeacon: beacon });
    resetAnalytics();
    trackEvent('form_submit');
    expect(beacon).toHaveBeenCalledWith('https://collect.example.test/e', expect.any(String));
  });

  it('clasifica clics de CTA, dossier y contacto', () => {
    expect(eventFromClick('/dossier.pdf', none)?.name).toBe('dossier_download');
    expect(eventFromClick('mailto:pendiente@example.test', none)?.name).toBe('contact_link');
    expect(eventFromClick('tel:+34000000000', none)?.name).toBe('contact_link');
    expect(eventFromClick('/#contacto', { track: 'cta', position: 'header' })).toEqual({
      name: 'cta_click',
      payload: { href: '/#contacto', position: 'header' },
    });
    expect(eventFromClick('/escenario-europeo', none)).toBeUndefined();
  });

  it('G7 · un barrido 0 → 1 emite profundidad 100 % de cada acto, incluido el I', () => {
    const events = actDepthMarks(0, 1, SECTIONS);
    expect(events.some((event) => event.act === 1 && event.depth === 1)).toBe(true);
    expect(events.some((event) => event.act === 7 && event.depth === 1)).toBe(true);
    expect(events.filter((event) => event.depth === 1)).toHaveLength(
      SECTIONS.filter((section) => section.act !== null).length,
    );
  });

  it('marca umbrales locales al cruzar cada acto, incluido el 100 % al salir', () => {
    const fixture = [
      { id: 'hero', act: null, order: 0 },
      { id: 'escenario', act: 1, order: 1 },
      { id: 'end', act: null, order: 2 },
    ];
    expect(actDepthMarks(0, (1 + 0.25) / 3, fixture)).toEqual([
      { act: 1, section: 'escenario', depth: 0.25 },
    ]);
    expect(actDepthMarks((1 + 0.25) / 3, 2 / 3, fixture)).toEqual([
      { act: 1, section: 'escenario', depth: 0.5 },
      { act: 1, section: 'escenario', depth: 0.75 },
      { act: 1, section: 'escenario', depth: 1 },
    ]);
  });

  it('SEO-08 · las claves de entorno son solo VITE_*', () => {
    expect(ENV_KEYS.every((key) => key.startsWith('VITE_'))).toBe(true);
    expect(ENV_KEYS).toContain('VITE_ANALYTICS_ENDPOINT');
  });
});

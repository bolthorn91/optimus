import { describe, expect, it } from 'vitest';

import { contactHref } from '@/scenes/05-activos-simulador/contactHref';
import { ACT5 } from '@/scenes/05-activos-simulador/content';
import { DEFAULT_SIMULATOR_INPUT } from '@/scenes/05-activos-simulador/useSimulator';

describe('contactHref', () => {
  it('sin vehículo ni contexto apunta al ancla de contacto', () => {
    expect(contactHref()).toBe(`/${ACT5.cta.href}`);
  });

  it('con vehículo preselecciona el query vehiculo', () => {
    expect(contactHref('equities')).toBe(`/?vehiculo=equities${ACT5.cta.href}`);
  });

  it('con contexto del simulador añade capital, horizonte y escenario (D2)', () => {
    const href = contactHref(DEFAULT_SIMULATOR_INPUT.vehicle, DEFAULT_SIMULATOR_INPUT);
    const url = new URL(href, 'https://optimvs.test');
    expect(url.pathname).toBe('/');
    expect(url.hash).toBe(ACT5.cta.href);
    expect(url.searchParams.get('vehiculo')).toBe(DEFAULT_SIMULATOR_INPUT.vehicle);
    expect(url.searchParams.get('capital')).toBe(String(DEFAULT_SIMULATOR_INPUT.capital));
    expect(url.searchParams.get('horizonte')).toBe(String(DEFAULT_SIMULATOR_INPUT.years));
    expect(url.searchParams.get('escenario')).toBe(DEFAULT_SIMULATOR_INPUT.scenario);
  });
});

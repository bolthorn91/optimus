import { describe, expect, it } from 'vitest';

import { HORIZON_MAX, HORIZON_MIN } from '@/lib/projection-assumptions';
import {
  contactHref,
  parseContactQuery,
  parseContactVehicle,
} from '@/scenes/05-activos-simulador/contactHref';
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

describe('parseContactVehicle', () => {
  it('solo acepta los tres vehículos', () => {
    expect(parseContactVehicle(new URLSearchParams({ vehiculo: 'equities' }))).toBe('equities');
    expect(parseContactVehicle(new URLSearchParams({ vehiculo: 'unspecified' }))).toBeUndefined();
    expect(parseContactVehicle(new URLSearchParams())).toBeUndefined();
  });
});

describe('parseContactQuery', () => {
  const complete = {
    capital: '150000',
    horizonte: '8',
    escenario: 'conservative',
    vehiculo: 'development',
  };

  it('exige capital, horizonte, escenario y vehículo canónicos', () => {
    expect(parseContactQuery(new URLSearchParams(complete))).toEqual({
      capital: 150000,
      years: 8,
      scenario: 'conservative',
      vehicle: 'development',
    });
    expect(parseContactQuery(new URLSearchParams({ vehiculo: 'equities' }))).toBeUndefined();
  });

  it('no corrige horizonte ni capital fuera de rango', () => {
    expect(parseContactQuery(new URLSearchParams({ ...complete, horizonte: '0' }))).toBeUndefined();
    expect(
      parseContactQuery(new URLSearchParams({ ...complete, horizonte: '99' })),
    ).toBeUndefined();
    expect(
      parseContactQuery(new URLSearchParams({ ...complete, horizonte: String(HORIZON_MIN - 1) })),
    ).toBeUndefined();
    expect(
      parseContactQuery(new URLSearchParams({ ...complete, horizonte: String(HORIZON_MAX + 1) })),
    ).toBeUndefined();
    expect(parseContactQuery(new URLSearchParams({ ...complete, capital: '0' }))).toBeUndefined();
  });

  it('rechaza escenario o vehículo inventados', () => {
    expect(
      parseContactQuery(new URLSearchParams({ ...complete, escenario: 'bull' })),
    ).toBeUndefined();
    expect(
      parseContactQuery(new URLSearchParams({ ...complete, vehiculo: 'crypto' })),
    ).toBeUndefined();
  });
});

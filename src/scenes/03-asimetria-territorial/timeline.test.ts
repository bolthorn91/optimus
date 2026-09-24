import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { CITY_LIGHTS } from '@/scenes/03-asimetria-territorial/cities';
import { ACT3 } from '@/scenes/03-asimetria-territorial/content';
import { choreographAct3 } from '@/scenes/03-asimetria-territorial/timeline';

const CANON = readFileSync(resolve(process.cwd(), 'content/03-datos-y-tablas.md'), 'utf8');

describe('choreographAct3', () => {
  // SAT-01
  it('SAT-01 · estados exactos y deterministas en 0, 0.25, 0.5, 0.75 y 1', () => {
    const start = choreographAct3(0);
    expect(start.nightAmount).toEqual({ es: 0, ar: 0 });
    expect(start.terminatorX).toEqual({ es: 1.15, ar: 1.15 });
    expect(start.cityGlow).toEqual({ es: 0, ar: 0 });
    expect(start.areaProgress).toBe(0);
    expect(start.popProgress).toBe(0);
    expect(start.densityProgress).toBe(0);
    expect(start.nightRelease).toBe(0);
    expect(start.chrome).toBe('day');
    expect(start.skyNight).toBe(0);

    const end = choreographAct3(1);
    expect(end.nightAmount).toEqual({ es: 1, ar: 1 });
    expect(end.terminatorX).toEqual({ es: -0.15, ar: -0.15 });
    expect(end.cityGlow).toEqual({ es: 1, ar: 1 });
    expect(end.areaProgress).toBe(1);
    expect(end.popProgress).toBe(1);
    expect(end.densityProgress).toBe(1);
    expect(end.nightRelease).toBe(1);
    expect(end.chrome).toBe('released');
    expect(end.skyNight).toBe(1);

    const midEarly = choreographAct3(0.25);
    expect(midEarly.densityProgress).toBe(0);
    expect(midEarly.nightAmount.es).toBeGreaterThan(midEarly.nightAmount.ar);
    expect(midEarly.nightAmount.ar).toBeGreaterThan(0);

    const mid = choreographAct3(0.5);
    expect(mid.densityProgress).toBe(0);
    expect(mid.areaProgress).toBe(1);
    expect(mid.popProgress).toBeGreaterThan(0);
    expect(mid.popProgress).toBeLessThan(1);
    expect(mid.nightRelease).toBe(0);
    expect(mid.nightAmount.es).toBeGreaterThan(mid.nightAmount.ar);
    expect(mid.chrome).toBe('night');

    const late = choreographAct3(0.75);
    expect(late.nightAmount).toEqual({ es: 1, ar: 1 });
    expect(late.densityProgress).toBeGreaterThan(0);
    expect(late.densityProgress).toBeLessThan(1);
    expect(late.nightRelease).toBe(0);
    expect(late.areaProgress).toBe(1);
    expect(late.popProgress).toBe(1);
  });

  // SAT-02
  it('SAT-02 · nightAmount es monótona creciente de 0 a 1 en ambos países', () => {
    let previousEs = choreographAct3(0).nightAmount.es;
    let previousAr = choreographAct3(0).nightAmount.ar;
    expect(previousEs).toBe(0);
    expect(previousAr).toBe(0);
    for (let i = 1; i <= 50; i += 1) {
      const state = choreographAct3(i / 50);
      expect(state.nightAmount.es).toBeGreaterThanOrEqual(previousEs);
      expect(state.nightAmount.ar).toBeGreaterThanOrEqual(previousAr);
      previousEs = state.nightAmount.es;
      previousAr = state.nightAmount.ar;
    }
    expect(previousEs).toBe(1);
    expect(previousAr).toBe(1);
  });

  // SAT-03
  it('SAT-03 · España anochece siempre antes o a la vez que Argentina', () => {
    for (let i = 0; i <= 100; i += 1) {
      const { nightAmount } = choreographAct3(i / 100);
      expect(nightAmount.es).toBeGreaterThanOrEqual(nightAmount.ar);
    }
    expect(choreographAct3(0.1936).nightAmount.ar).toBe(0);
    expect(choreographAct3(0.25).nightAmount.es).toBeGreaterThan(
      choreographAct3(0.25).nightAmount.ar,
    );
  });
});

describe('CITY_LIGHTS', () => {
  it('los pesos son visuales en (0, 1] y Buenos Aires es el nodo argentino', () => {
    for (const city of CITY_LIGHTS) {
      expect(city.weight).toBeGreaterThan(0);
      expect(city.weight).toBeLessThanOrEqual(1);
    }
    const spain = CITY_LIGHTS.filter((city) => city.country === 'es');
    const argentina = CITY_LIGHTS.filter((city) => city.country === 'ar');
    expect(spain.length).toBeGreaterThanOrEqual(6);
    expect(spain.filter((city) => city.weight >= 0.4).length).toBeGreaterThanOrEqual(3);
    const buenosAires = argentina.find((city) => city.name === 'Buenos Aires');
    expect(buenosAires?.weight).toBe(1);
    expect(
      argentina.filter((city) => city.name !== 'Buenos Aires').every((city) => city.weight < 0.5),
    ).toBe(true);
  });
});

describe('cifras del acto III', () => {
  // SAT-14
  it('SAT-14 · superficie, población y densidad coinciden con content/', () => {
    const [spain, argentina] = ACT3.countries;
    expect(CANON).toContain('505.990');
    expect(CANON).toContain('2.780.400');
    expect(CANON).toContain('48.600.000');
    expect(CANON).toContain('45.900.000');
    expect(CANON).toContain('96,05');
    expect(CANON).toContain('16,51');
    expect(spain.areaKm2).toBe(505990);
    expect(argentina.areaKm2).toBe(2780400);
    expect(spain.population).toBe(48600000);
    expect(argentina.population).toBe(45900000);
    expect(spain.densityPerKm2).toBe(96.05);
    expect(argentina.densityPerKm2).toBe(16.51);
  });
});

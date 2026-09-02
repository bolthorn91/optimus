import { describe, expect, it } from 'vitest';

import { clamp01, easeInOut, lerp } from './interpolate';

describe('clamp01', () => {
  it.each([
    [-3, 0],
    [0, 0],
    [0.5, 0.5],
    [1, 1],
    [7, 1],
  ])('acota %p en %p', (input, esperado) => {
    expect(clamp01(input)).toBe(esperado);
  });

  it('trata NaN como principio, no como final', () => {
    expect(clamp01(Number.NaN)).toBe(0);
  });

  it('acota los infinitos', () => {
    expect(clamp01(Number.POSITIVE_INFINITY)).toBe(1);
    expect(clamp01(Number.NEGATIVE_INFINITY)).toBe(0);
  });
});

describe('lerp', () => {
  it('devuelve los extremos sin tocarlos', () => {
    expect(lerp(0, 100, 0)).toBe(0);
    expect(lerp(0, 100, 1)).toBe(100);
  });

  it('interpola en el medio', () => {
    expect(lerp(0, 100, 0.5)).toBe(50);
    expect(lerp(20, 40, 0.25)).toBe(25);
  });

  it('cierra en el valor exacto, sin residuo de coma flotante', () => {
    expect(lerp(0, 96.05, 1)).toBe(96.05);
    expect(lerp(0, 16.51, 1)).toBe(16.51);
    expect(lerp(0, 13243219, 1)).toBe(13243219);
  });

  it('acota el progreso en vez de extrapolar', () => {
    expect(lerp(0, 100, -2)).toBe(0);
    expect(lerp(0, 100, 4)).toBe(100);
  });

  it('funciona hacia abajo', () => {
    expect(lerp(100, 0, 0.25)).toBe(75);
  });
});

describe('easeInOut', () => {
  it('cierra en 0 y 1', () => {
    expect(easeInOut(0)).toBe(0);
    expect(easeInOut(1)).toBe(1);
  });

  it('es estrictamente creciente en (0, 1)', () => {
    let previous = easeInOut(0);
    for (let i = 1; i <= 20; i += 1) {
      const current = easeInOut(i / 20);
      expect(current).toBeGreaterThan(previous);
      previous = current;
    }
  });
});

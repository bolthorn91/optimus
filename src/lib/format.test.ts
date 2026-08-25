import { describe, expect, it } from 'vitest';

import {
  NBSP,
  formatArea,
  formatCurrency,
  formatDensity,
  formatNumber,
  formatPercent,
} from './format';

describe('formato de cifras en convención española', () => {
  // FND-03
  it('FND-03 · formatNumber(2780400) usa el punto como separador de millares', () => {
    expect(formatNumber(2780400)).toBe('2.780.400');
  });

  it('FND-03 · formatDensity(96.05) usa la coma como separador decimal', () => {
    expect(formatDensity(96.05)).toBe(`96,05${NBSP}hab/km²`);
  });

  it('FND-03 · formatPercent(14) pospone el signo tras espacio duro', () => {
    expect(formatPercent(14)).toBe(`14${NBSP}%`);
  });

  // FND-04
  it('FND-04 · formatArea(13243219) rinde la superficie en hectáreas', () => {
    expect(formatArea(13243219)).toBe(`13.243.219${NBSP}ha`);
  });

  it('formatArea acepta kilómetros cuadrados', () => {
    expect(formatArea(505990, 'km²')).toBe(`505.990${NBSP}km²`);
  });

  it('formatNumber respeta los decimales pedidos y no añade ceros de relleno', () => {
    expect(formatNumber(16.51, 2)).toBe('16,51');
  });

  it('sigue la RAE: los números de cuatro cifras van sin separador de millar', () => {
    expect(formatNumber(1000)).toBe('1000');
    expect(formatNumber(9999)).toBe('9999');
    expect(formatNumber(10000)).toBe('10.000');
  });

  it('formatDensity conserva los dos decimales de las cifras del dossier', () => {
    expect(formatDensity(16.51)).toBe(`16,51${NBSP}hab/km²`);
  });

  it('formatCurrency explicita la divisa en lugar de un símbolo ambiguo', () => {
    expect(formatCurrency(250000)).toBe(`250.000${NBSP}US$`);
    expect(formatCurrency(250000, 'EUR')).toBe(`250.000${NBSP}€`);
  });

  it('formatCurrency no arrastra decimales', () => {
    expect(formatCurrency(250000)).not.toContain(',00');
  });

  it('separa cifra y unidad con espacio duro, no con espacio normal', () => {
    expect(formatPercent(14)).not.toContain(' %');
    expect(formatArea(1)).not.toContain(' ha');
  });

  it.each([
    ['formatNumber', formatNumber],
    ['formatArea', formatArea],
    ['formatDensity', formatDensity],
    ['formatPercent', formatPercent],
    ['formatCurrency', formatCurrency],
  ])('%s lanza RangeError ante un valor no finito', (_name, fn) => {
    expect(() => fn(Number.NaN)).toThrow(RangeError);
    expect(() => fn(Number.POSITIVE_INFINITY)).toThrow(RangeError);
  });
});

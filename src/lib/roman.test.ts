import { describe, expect, it } from 'vitest';

import { ROMAN_MAX, ROMAN_MIN, toRoman } from './roman';

describe('toRoman', () => {
  // FND-01
  it.each([
    [1, 'I'],
    [4, 'IV'],
    [9, 'IX'],
    [14, 'XIV'],
    [40, 'XL'],
    [90, 'XC'],
    [400, 'CD'],
    [1994, 'MCMXCIV'],
    [2024, 'MMXXIV'],
    [3999, 'MMMCMXCIX'],
  ])('FND-01 · convierte %i en %s', (input, expected) => {
    expect(toRoman(input)).toBe(expected);
  });

  // FND-02
  it.each([[0], [-1], [4000], [1.5], [Number.NaN]])('FND-02 · lanza RangeError con %p', (input) => {
    expect(() => toRoman(input)).toThrow(RangeError);
  });

  it('FND-02 · lanza RangeError con Infinity y -Infinity', () => {
    expect(() => toRoman(Number.POSITIVE_INFINITY)).toThrow(RangeError);
    expect(() => toRoman(Number.NEGATIVE_INFINITY)).toThrow(RangeError);
  });

  it('acepta los dos extremos del rango declarado', () => {
    expect(toRoman(ROMAN_MIN)).toBe('I');
    expect(toRoman(ROMAN_MAX)).toBe('MMMCMXCIX');
  });

  it('produce numerales que solo usan los siete símbolos romanos', () => {
    for (let n = ROMAN_MIN; n <= ROMAN_MAX; n += 7) {
      expect(toRoman(n)).toMatch(/^[MDCLXVI]+$/);
    }
  });

  it('nunca repite un símbolo más de tres veces seguidas', () => {
    for (let n = ROMAN_MIN; n <= ROMAN_MAX; n += 13) {
      expect(toRoman(n)).not.toMatch(/(.)\1{3}/);
    }
  });
});

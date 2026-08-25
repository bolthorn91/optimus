const NUMERALS: readonly (readonly [value: number, symbol: string])[] = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

export const ROMAN_MIN = 1;
export const ROMAN_MAX = 3999;

/**
 * Un acto número 0 es un error de programación, no un caso de usuario: por eso lanza en vez de
 * devolver una cadena vacía (doc 00 §3.6).
 */
export function toRoman(value: number): string {
  if (!Number.isInteger(value)) {
    throw new RangeError(`toRoman espera un entero, recibió ${String(value)}`);
  }
  if (value < ROMAN_MIN || value > ROMAN_MAX) {
    throw new RangeError(`toRoman admite ${ROMAN_MIN}–${ROMAN_MAX}, recibió ${value}`);
  }

  let remaining = value;
  let result = '';

  for (const [numeral, symbol] of NUMERALS) {
    while (remaining >= numeral) {
      result += symbol;
      remaining -= numeral;
    }
  }

  return result;
}

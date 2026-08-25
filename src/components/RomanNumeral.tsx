import { toRoman } from '@/lib/roman';

export interface RomanNumeralProps {
  value: number;
  /** Cuando es decorativo, el lector de pantalla lo ignora: el arábigo va aparte. */
  decorative?: boolean;
  className?: string;
}

/**
 * Un numeral romano nunca se escribe a mano en este proyecto (doc 00 S8). Lanza `RangeError`
 * fuera de 1–3999 y no lo captura: un acto número 0 es un error de programación.
 *
 * `role="img"` y no un `<span>` desnudo: un `aria-label` sobre un elemento sin rol no se anuncia
 * de forma fiable. El numeral es una representación simbólica de un número, que es exactamente
 * lo que ese rol describe.
 */
export function RomanNumeral({ value, decorative = false, className }: RomanNumeralProps) {
  const roman = toRoman(value);

  if (decorative) {
    return (
      <span aria-hidden="true" className={className} lang="la">
        {roman}
      </span>
    );
  }

  return (
    <span aria-label={String(value)} className={className} lang="la" role="img">
      {roman}
    </span>
  );
}

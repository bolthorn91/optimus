import type { ReactNode } from 'react';

import { RomanNumeral } from '@/components/RomanNumeral';
import { NBSP, formatNumber } from '@/lib/format';
import { ROMAN_MAX, ROMAN_MIN } from '@/lib/roman';

export interface DualFigureProps {
  value: number;
  /** Unidad o signo pospuesto: `%`, `ha`, `km²`. */
  suffix?: string;
  /** El romano solo cabe para enteros de 1 a 3999; fuera de ese rango se omite. */
  roman?: boolean;
  /** Si se pasa, sustituye el arábigo formateado (p. ej. un `<CountUp>`). */
  arabic?: ReactNode;
  className?: string;
}

function canRender(value: number): boolean {
  return Number.isInteger(value) && value >= ROMAN_MIN && value <= ROMAN_MAX;
}

/**
 * Cifra ancla con su doble numeral (doc 00 S9): el arábigo es el valor y el romano una marca
 * secundaria, más pequeña y encima. El romano va `aria-hidden` — nadie debería oír «catorce»
 * dos veces. La jerarquía visual la fija `[data-dual-figure-roman]`, no el atributo de a11y.
 */
export function DualFigure({ value, suffix, roman = true, arabic, className }: DualFigureProps) {
  const showRoman = roman && canRender(value);

  return (
    <span className={className} data-dual-figure data-tabular>
      {showRoman ? (
        <span data-dual-figure-roman>
          <RomanNumeral decorative value={value} />
        </span>
      ) : null}
      <span data-dual-figure-value>
        {arabic ?? (
          <>
            {formatNumber(value)}
            {suffix === undefined ? null : NBSP + suffix}
          </>
        )}
      </span>
    </span>
  );
}

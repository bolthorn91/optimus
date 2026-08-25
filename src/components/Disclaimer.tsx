export interface DisclaimerProps {
  /** `footer` va al pie del sitio; `inline` se adhiere a la cifra que matiza. */
  variant: 'footer' | 'inline';
  className?: string;
}

/**
 * Aviso financiero canónico (invariante I7). Texto único: toda superficie que muestre una
 * afirmación de rendimiento renderiza exactamente este, no una variante redactada al vuelo.
 *
 * Este texto corto es el que fija el doc 00 §6 (`disclaimer.short`). La versión larga sale de
 * `content/07-legal-y-disclaimers.md` y la monta el documento 07 en el aviso legal.
 */
export const DISCLAIMER_TEXT =
  'Toda inversión conlleva riesgo, incluida la pérdida del capital. Esta información no ' +
  'constituye asesoramiento de inversión.';

export function Disclaimer({ variant, className }: DisclaimerProps) {
  return (
    <p className={className} data-disclaimer={variant} role="note">
      {DISCLAIMER_TEXT}
    </p>
  );
}

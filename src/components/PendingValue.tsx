export interface PendingValueProps {
  /** Qué falta: «Teléfono España», «CIF», «Retrato del fundador». */
  label: string;
  /** Fila de `docs/debt/technical-debt.md` que lo registra: `B-01`, `B-05`… */
  debtId: string;
  className?: string;
}

export const PENDING_LABEL = 'Dato pendiente de confirmación';

/**
 * Marcador visible para un dato que el cliente aún no ha confirmado (invariante I2).
 *
 * Existe para que sea **imposible** rellenar un hueco con algo plausible: un teléfono inventado
 * en una web de captación patrimonial no es un marcador de trabajo pendiente, es un dato falso
 * publicado. Se ve, y dice de qué fila de la deuda viene.
 */
export function PendingValue({ label, debtId, className }: PendingValueProps) {
  return (
    <span className={className} data-debt-id={debtId} data-pending>
      {label}: {PENDING_LABEL}
    </span>
  );
}

export const LOCALE = 'es-ES';

/**
 * Espacio duro entre cifra y unidad: convención tipográfica española, y evita que la línea se
 * parta entre ambas. Escrito como escape y no como carácter literal a propósito: un NBSP invisible
 * en el fuente lo normaliza cualquier editor o formateador sin que nadie lo note.
 */
export const NBSP = '\u00A0';

function assertFinite(value: number, fn: string): void {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${fn} espera un número finito, recibió ${String(value)}`);
  }
}

/** Cifra y unidad, siempre separadas por espacio duro. La regla vive aquí y solo aquí. */
function withUnit(formatted: string, unit: string): string {
  return `${formatted}${NBSP}${unit}`;
}

/**
 * Millares con punto, decimales con coma. `formatNumber(2780400)` → `2.780.400`.
 *
 * La agrupación queda en el `auto` de la locale, que sigue a la RAE: los números de cuatro cifras
 * van sin separador (`1000`, no `1.000`). Ninguna cifra del canon tiene cuatro dígitos.
 */
export function formatNumber(value: number, maximumFractionDigits = 0): string {
  assertFinite(value, 'formatNumber');
  return new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(value);
}

/** `formatArea(13243219)` → `13.243.219 ha`. */
export function formatArea(value: number, unit: 'ha' | 'km²' = 'ha'): string {
  return withUnit(formatNumber(value), unit);
}

/** `formatDensity(96.05)` → `96,05 hab/km²`. */
export function formatDensity(value: number): string {
  return withUnit(formatNumber(value, 2), 'hab/km²');
}

/** `formatPercent(14)` → `14 %`. */
export function formatPercent(value: number, maximumFractionDigits = 0): string {
  return withUnit(formatNumber(value, maximumFractionDigits), '%');
}

/**
 * `formatCurrency(250000)` → `250.000 US$`.
 *
 * `symbol` y no `narrowSymbol`: este último rinde un `$` desnudo, que en una comparativa
 * España/Argentina se lee como peso. El canon exige explicitar siempre la divisa
 * (`content/01-identidad-y-tono.md`, reglas de escritura).
 */
export function formatCurrency(
  value: number,
  currency: 'USD' | 'EUR' = 'USD',
  maximumFractionDigits = 0,
): string {
  assertFinite(value, 'formatCurrency');
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
    minimumFractionDigits: maximumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}

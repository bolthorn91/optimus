/**
 * Interpolación por progreso. Vive en `src/lib/` y no dentro de un componente porque es lógica
 * pura y las coreografías de escena de la fase C necesitan exactamente la misma: sin este
 * fichero, cada una escribiría su propio `clamp`.
 */

/** Acota a [0, 1]. `NaN` cuenta como 0: un progreso indefinido es el principio, no el final. */
export function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

/**
 * Interpola de `from` a `to` según el progreso.
 *
 * Con progreso 1 devuelve `to` **exacto**, sin pasar por la aritmética: es lo que impide que la
 * densidad de España cierre en `96,04999` en vez de `96,05`.
 */
export function lerp(from: number, to: number, progress: number): number {
  const p = clamp01(progress);
  if (p >= 1) return to;
  if (p <= 0) return from;
  return from + (to - from) * p;
}

/** Smoothstep 0→1, estrictamente creciente en (0, 1). */
export function easeInOut(progress: number): number {
  const p = clamp01(progress);
  return p * p * (3 - 2 * p);
}

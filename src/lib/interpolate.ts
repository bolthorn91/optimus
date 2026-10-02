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

/** Ease-out cuadrático. Cierra en 0 y 1. */
export function easeOut(progress: number): number {
  const p = clamp01(progress);
  return 1 - (1 - p) * (1 - p);
}

/** Hermite smoothstep entre `edge0` y `edge1`. */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  return easeInOut((x - edge0) / (edge1 - edge0));
}

/**
 * Rampa 0→1 desde `start` durante `duration`. En `start + duration` y después, 1 exacto.
 */
export function ramp(progress: number, start: number, duration: number): number {
  if (duration <= 0) return progress >= start ? 1 : 0;
  const t = (progress - start) / duration;
  if (t >= 1 - 1e-12) return 1;
  return clamp01(t);
}

/**
 * Ventana con subida hasta `enter` y bajada desde `exit`. `x` ya va acotado a [0, 1] del tramo.
 */
export function peakWindow(x: number, enter: number, exit: number): number {
  if (x < enter) return x / enter;
  if (x > exit) return (1 - x) / (1 - exit);
  return 1;
}

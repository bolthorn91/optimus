import { easeOut, lerp } from '@/lib/interpolate';

/** Contador ligado al progreso: ease-out hasta el destino; en 1, el valor exacto. */
export function displayedValue(progress: number, destination: number): number {
  return lerp(0, destination, easeOut(progress));
}

import { lerp } from '@/lib/interpolate';

export interface CountUpProps {
  to: number;
  from?: number;
  /** El formateador canónico del valor. Siempre uno de `src/lib/format.ts`. */
  format: (value: number) => string;
  /** Progreso 0→1 que conduce el contador. Sin él, se muestra el valor final. */
  progress?: number;
  className?: string;
}

/**
 * Contador ligado al progreso de una escena.
 *
 * El valor **final** está siempre en el DOM, sea cual sea el progreso (invariante I4): lo que
 * cambia con el scroll es el número que se ve, no el que se lee. Sin esa separación, un lector
 * de pantalla o un buscador vería un cero donde hay un dato.
 */
export function CountUp({ to, from = 0, format, progress, className }: CountUpProps) {
  const shown = progress === undefined ? to : lerp(from, to, progress);

  return (
    <span aria-live="off" className={className} data-tabular>
      <span aria-hidden="true">{format(shown)}</span>
      <span className="visually-hidden">{format(to)}</span>
    </span>
  );
}

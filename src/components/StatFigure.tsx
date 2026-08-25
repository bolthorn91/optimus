import type { ReactNode } from 'react';

export interface StatFigureProps {
  value: ReactNode;
  label: string;
  /** Origen del dato. Lo exige el invariante I1: ninguna cifra sin procedencia. */
  source?: string;
  className?: string;
}

/**
 * Cifra destacada con su glosa (doc 00 S10). `<figure>` y no un `<div>`: la cifra es el
 * contenido y la etiqueta su pie, que es exactamente la semántica de `figcaption`.
 */
export function StatFigure({ value, label, source, className }: StatFigureProps) {
  return (
    <figure className={className} data-stat-figure>
      <div data-stat-value data-tabular>
        {value}
      </div>
      <figcaption>
        <span>{label}</span>
        {source === undefined ? null : <small>Fuente: {source}</small>}
      </figcaption>
    </figure>
  );
}

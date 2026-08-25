import type { ReactNode } from 'react';

export interface PullQuoteProps {
  children: ReactNode;
  /** A quién se atribuye. Se renderiza como `<cite>` dentro del pie. */
  cite?: string;
  className?: string;
}

/** Cita destacada con filete de oro y ancho reducido (doc 00 S10). */
export function PullQuote({ children, cite, className }: PullQuoteProps) {
  return (
    <figure className={className} data-pull-quote>
      <blockquote>{children}</blockquote>
      {cite === undefined ? null : (
        <figcaption>
          <cite>{cite}</cite>
        </figcaption>
      )}
    </figure>
  );
}

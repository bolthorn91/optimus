import type { ReactNode } from 'react';

import './disclosure.css';

export interface DisclosureProps {
  title: ReactNode;
  meta?: ReactNode;
  defaultOpen?: boolean;
  id?: string;
  className?: string;
  children: ReactNode;
}

/**
 * Sección plegable nativa: el resumen sigue siendo enfocable y el contenido permanece en el
 * DOM aunque esté cerrado. Se usa para compactar los actos sin esconder información a lectores
 * de pantalla (el contenido se anuncia como detalle del resumen).
 */
export function Disclosure({
  title,
  meta,
  defaultOpen = false,
  id,
  className,
  children,
}: DisclosureProps) {
  return (
    <details
      className={className === undefined ? 'disclosure' : `disclosure ${className}`}
      data-disclosure
      id={id}
      open={defaultOpen}
    >
      <summary className="disclosure__summary">
        <span className="disclosure__title">{title}</span>
        {meta === undefined ? null : <span className="disclosure__meta">{meta}</span>}
        <span aria-hidden="true" className="disclosure__mark" />
      </summary>
      <div className="disclosure__body">{children}</div>
    </details>
  );
}

import './act-cta.css';

export type ActCtaPosition = 'act' | 'vehicle';

export interface ActCtaProps {
  href: string;
  label: string;
  position?: ActCtaPosition;
  variant?: 'full' | 'compact';
}

/**
 * CTA editorial de cierre de acto. La micro-etiqueta es decorativa (`aria-hidden`): el nombre
 * accesible del enlace es exactamente la acción, para que lectores de pantalla y tests no
 * arrastren «Sesión privada» como parte del nombre.
 */
export function ActCta({ href, label, position = 'act', variant = 'full' }: ActCtaProps) {
  return (
    <a
      className={`act-cta${variant === 'compact' ? ' act-cta--compact' : ''}`}
      data-track="cta"
      data-track-position={position}
      href={href}
    >
      <span className="act-cta__copy">
        {variant === 'full' ? (
          <span aria-hidden="true" className="act-cta__eyebrow">
            Siguiente paso
          </span>
        ) : null}
        <span className="act-cta__label">{label}</span>
      </span>
      <span aria-hidden="true" className="act-cta__arrow">
        <svg focusable="false" viewBox="0 0 24 24">
          <path d="M4 12h15M13 6l6 6-6 6" />
        </svg>
      </span>
    </a>
  );
}

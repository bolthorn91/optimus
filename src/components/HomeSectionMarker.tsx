import { useEffect, useRef, useState } from 'react';

import { useReducedMotionSafe } from '@/motion/useReducedMotionSafe';

import './home-section-marker.css';

export type HomeSectionIconName = 'projects' | 'method' | 'trust' | 'calculator' | 'contact';

/*
 * Los iconos son trazo lineal de 24 px, el mismo lenguaje que las tarjetas de garantías y
 * vehículos. Se dibujan con pathLength=1 para que la animación no dependa de medir el SVG.
 */
const ICON_PATH: Record<HomeSectionIconName, string> = {
  projects: 'M3 20h18M5 20V5h8v15M13 20V10h6v10M8 9h2M8 13h2M8 17h2M16 14h1',
  method: 'M4 6h6l2 3h8M4 12h6l2 3h8M4 18h6l2-3h8',
  trust: 'M12 3l7 3v6c0 4-3 6.5-7 9-4-2.5-7-5-7-9V6l7-3zM9 12l2 2 4-4',
  calculator: 'M4 4h16v16H4zM8 8h8M8 12h2M8 16h2M14 12h2M14 16h2',
  contact: 'M4 12h15M13 6l6 6-6 6M4 5v14',
};

export function HomeSectionIcon({
  className,
  name,
}: {
  className?: string;
  name: HomeSectionIconName;
}) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d={ICON_PATH[name]}
        pathLength="1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/**
 * Marca de sección de la home. El icono se dibuja cuando entra en pantalla; sin JS, o con
 * movimiento reducido, queda visible y estático. Es decorativo: el nombre accesible de la
 * sección lo lleva el encabezado.
 */
export function HomeSectionMarker({ icon, index }: { icon: HomeSectionIconName; index: number }) {
  const markerRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotionSafe();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reducedMotion || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }

    const node = markerRef.current;
    if (node === null) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.35 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [reducedMotion]);

  return (
    <span
      aria-hidden="true"
      className="home-section-marker"
      data-visible={visible ? 'true' : 'false'}
      ref={markerRef}
    >
      <HomeSectionIcon className="home-section-marker__icon" name={icon} />
      <span className="home-section-marker__index">{String(index).padStart(2, '0')}</span>
    </span>
  );
}

import type { ReactNode } from 'react';
import { useLocation } from 'react-router';

import './route-transition.css';

/**
 * La navegación SPA no recarga el documento: este contenedor conserva un único punto de
 * entrada para que el cambio de ruta tenga una transición perceptible sin mover la cabecera.
 */
export function RouteTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className="route-stage" data-route-stage key={pathname}>
      {children}
    </div>
  );
}

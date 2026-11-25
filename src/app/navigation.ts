import { PROJECTS_PUBLISHED } from '@/content/projects';

export interface NavItem {
  label: string;
  href: string;
}

/**
 * Navegación principal de la web comercial. Los antiguos grupos del dossier ya no compiten
 * con la acción: la cabecera solo muestra las páginas de decisión y la reserva.
 */
const DECISION_NAV: readonly NavItem[] = [
  { label: 'Estrategia', href: '/estrategia' },
  { label: 'Calculadora', href: '/calculadora' },
  { label: 'Nosotros', href: '/nosotros' },
];

export const PRIMARY_NAV: readonly NavItem[] = PROJECTS_PUBLISHED
  ? [{ label: 'Proyectos', href: '/proyectos' }, ...DECISION_NAV]
  : DECISION_NAV;

export const FOOTER_NAV: readonly NavItem[] = [{ label: 'Inicio', href: '/' }, ...PRIMARY_NAV];

export interface NavItem {
  label: string;
  href: string;
}

/**
 * Navegación principal de la web comercial. Los antiguos grupos del dossier ya no compiten
 * con la acción: la cabecera solo muestra las cuatro páginas de decisión y la reserva.
 */
export const PRIMARY_NAV: readonly NavItem[] = [
  { label: 'Proyectos', href: '/proyectos' },
  { label: 'Estrategia', href: '/estrategia' },
  { label: 'Calculadora', href: '/calculadora' },
  { label: 'Nosotros', href: '/nosotros' },
];

export const FOOTER_NAV: readonly NavItem[] = [{ label: 'Inicio', href: '/' }, ...PRIMARY_NAV];

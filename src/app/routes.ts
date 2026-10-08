import type { LegalId } from '@/content/legal/types';
import type { VehicleId } from '@/lib/projection-assumptions';

export type RouteKind = 'home' | 'act' | 'vehicle' | 'legal';

export type ActNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface RouteEntry {
  path: string;
  kind: RouteKind;
  title: string;
  description: string;
  changefreq: 'monthly' | 'yearly';
  priority: number;
  hasPendingData: boolean;
  actNumber?: ActNumber;
  vehicleId?: VehicleId;
  legalId?: LegalId;
}

export interface RouteNav {
  href: string;
  title: string;
}

/** Literales de `content/secciones/` y `content/06-requisitos-funcionales.md` / `07-legal-y-disclaimers.md`. */
export const ROUTES: readonly RouteEntry[] = [
  {
    path: '/',
    kind: 'home',
    title: 'Inversión estratégica en Argentina',
    description:
      'Firma hispano-argentina de intermediación en activos inmobiliarios y financieros. Protección patrimonial bajo el Convenio de Doble Imposición España–Argentina.',
    changefreq: 'monthly',
    priority: 1,
    hasPendingData: false,
  },
  {
    path: '/escenario-europeo',
    kind: 'act',
    actNumber: 1,
    title: 'El nuevo escenario europeo',
    description:
      'Luego de la II Guerra Mundial y durante décadas, el continente europeo creó y robusteció un marco elevado de seguridad jurídica, crecimiento económico y estabilidad social.',
    changefreq: 'monthly',
    priority: 0.8,
    hasPendingData: false,
  },
  {
    path: '/seguridad-global',
    kind: 'act',
    actNumber: 2,
    title: 'Seguridad global',
    description:
      'Las estadísticas globales permiten observar un movimiento de conflictos extendido a lo largo de las últimas décadas hacia regiones de paz.',
    changefreq: 'monthly',
    priority: 0.8,
    hasPendingData: false,
  },
  {
    path: '/estado-de-derecho',
    kind: 'act',
    actNumber: 3,
    title: 'Estado de derecho',
    description:
      'Europa ha resignado parcialmente su estado de derecho y los efectos previstos la diferenciarán claramente del resto de Occidente.',
    changefreq: 'monthly',
    priority: 0.8,
    hasPendingData: false,
  },
  {
    path: '/estrategia-anticipatoria',
    kind: 'act',
    actNumber: 4,
    title: 'La necesidad de una estrategia anticipatoria',
    description:
      'Quienes conserven su capital íntegramente dentro del sistema europeo y mucho más en el español quedarán expuestos a mayores cargas, restricciones operativas y un paulatino deterioro en la economía y la calidad de vida.',
    changefreq: 'monthly',
    priority: 0.8,
    hasPendingData: false,
  },
  {
    path: '/nuestra-estrategia',
    kind: 'act',
    actNumber: 5,
    title: 'Nuestra estrategia',
    description:
      'Por ello en OPTIMVS Capital Protegido hemos desarrollado un programa de inversión que abarca a todo el público, en el cual el suelo de inversión es mínimo y no tiene techo.',
    changefreq: 'monthly',
    priority: 0.8,
    hasPendingData: false,
  },
  {
    path: '/estructura-operativa',
    kind: 'act',
    actNumber: 6,
    title: 'Nuestra estructura operativa España – Argentina',
    description:
      'OPTIMVS Capital Protegido es una firma hispano-argentina especializada en la facilitación y ejecución de inversiones internacionales.',
    changefreq: 'monthly',
    priority: 0.8,
    hasPendingData: false,
  },
  {
    path: '/asesoramiento-intermediacion',
    kind: 'act',
    actNumber: 7,
    title: 'Asesoramiento e intermediación transfronteriza',
    description:
      'Para la operativa de capitales y adquisición de activos entre España y Argentina disponemos del marco legal adecuado.',
    changefreq: 'monthly',
    priority: 0.8,
    hasPendingData: false,
  },
  {
    path: '/activos/bienes-raices',
    kind: 'vehicle',
    vehicleId: 'real-estate',
    title: 'Bienes raíces / inmuebles',
    description:
      'Ubicaciones prime con precios por metro cuadrado históricamente bajos respecto a Europa. Mercado cotizado y transaccionado en USD.',
    changefreq: 'monthly',
    priority: 0.6,
    hasPendingData: false,
  },
  {
    path: '/activos/acciones-y-titulos',
    kind: 'vehicle',
    vehicleId: 'equities',
    title: 'Acciones y títulos locales',
    description:
      'Empresas del sector energético, agroindustrial y tecnológico liderando la recuperación económica. Entrada en punto de inflexión.',
    changefreq: 'monthly',
    priority: 0.6,
    hasPendingData: false,
  },
  {
    path: '/activos/proyectos-al-pozo',
    kind: 'vehicle',
    vehicleId: 'development',
    title: 'Proyectos de desarrollo (al pozo)',
    description:
      'Ingreso directo en etapas tempranas de desarrollo urbano y residencial con estructura jurídico-fiscal optimizada (fideicomisos).',
    changefreq: 'monthly',
    priority: 0.6,
    hasPendingData: false,
  },
  {
    path: '/aviso-legal',
    kind: 'legal',
    legalId: 'notice',
    title: 'Aviso legal',
    description:
      'La información contenida en este sitio web tiene carácter exclusivamente informativo y comercial.',
    changefreq: 'yearly',
    priority: 0.3,
    hasPendingData: true,
  },
  {
    path: '/politica-de-privacidad',
    kind: 'legal',
    legalId: 'privacy',
    title: 'Política de privacidad',
    description:
      'El tratamiento implicará compartir datos con la firma argentina. Argentina cuenta con decisión de adecuación de la Comisión Europea.',
    changefreq: 'yearly',
    priority: 0.3,
    hasPendingData: true,
  },
  {
    path: '/politica-de-cookies',
    kind: 'legal',
    legalId: 'cookies',
    title: 'Política de cookies',
    description: 'Política de cookies con inventario, finalidad, titular y duración de cada una.',
    changefreq: 'yearly',
    priority: 0.3,
    hasPendingData: true,
  },
];

export function routeByPath(
  path: string,
  routes: readonly RouteEntry[] = ROUTES,
): RouteEntry | undefined {
  return routes.find((route) => route.path === path);
}

export function homeRoute(routes: readonly RouteEntry[] = ROUTES): RouteEntry {
  const home = routes.find((route) => route.kind === 'home');
  if (!home) throw new Error('El manifiesto de rutas no declara la home');
  return home;
}

export function isActRoute(
  route: RouteEntry,
): route is RouteEntry & { kind: 'act'; actNumber: ActNumber } {
  return route.kind === 'act' && route.actNumber !== undefined;
}

export function actRoute(
  actNumber: ActNumber,
  routes: readonly RouteEntry[] = ROUTES,
): RouteEntry & { kind: 'act'; actNumber: ActNumber } {
  const route = routes.find((entry) => isActRoute(entry) && entry.actNumber === actNumber);
  if (!route || !isActRoute(route)) {
    throw new Error(`El manifiesto no declara el acto ${String(actNumber)}`);
  }
  return route;
}

export function isVehicleRoute(
  route: RouteEntry,
): route is RouteEntry & { kind: 'vehicle'; vehicleId: VehicleId } {
  return route.kind === 'vehicle' && route.vehicleId !== undefined;
}

export function vehicleRoute(
  vehicleId: VehicleId,
  routes: readonly RouteEntry[] = ROUTES,
): RouteEntry & { kind: 'vehicle'; vehicleId: VehicleId } {
  const route = routes.find((entry) => isVehicleRoute(entry) && entry.vehicleId === vehicleId);
  if (!route || !isVehicleRoute(route)) {
    throw new Error(`El manifiesto no declara el vehículo ${vehicleId}`);
  }
  return route;
}

export function isLegalRoute(
  route: RouteEntry,
): route is RouteEntry & { kind: 'legal'; legalId: LegalId } {
  return route.kind === 'legal' && route.legalId !== undefined;
}

export function legalRoute(
  legalId: LegalId,
  routes: readonly RouteEntry[] = ROUTES,
): RouteEntry & { kind: 'legal'; legalId: LegalId } {
  const route = routes.find((entry) => isLegalRoute(entry) && entry.legalId === legalId);
  if (!route || !isLegalRoute(route)) {
    throw new Error(`El manifiesto no declara el documento legal ${legalId}`);
  }
  return route;
}

export function adjacentActs(
  actNumber: ActNumber,
  routes: readonly RouteEntry[] = ROUTES,
): { prev?: RouteNav; next?: RouteNav } {
  const acts = routes.filter(isActRoute);
  const index = acts.findIndex((route) => route.actNumber === actNumber);
  const prev = index > 0 ? acts[index - 1] : undefined;
  const next = index >= 0 ? acts[index + 1] : undefined;
  return {
    ...(prev ? { prev: { href: prev.path, title: prev.title } } : {}),
    ...(next ? { next: { href: next.path, title: next.title } } : {}),
  };
}

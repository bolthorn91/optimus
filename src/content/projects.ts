import type { VehicleId } from '@/lib/projection-assumptions';

export type ProjectStatus = 'open' | 'coming-soon';

export interface ProjectMetric {
  label: string;
  /** Valor confirmado por el cliente. Si falta, la ficha muestra el marcador visible. */
  value?: string;
  pending?: boolean;
  debtId?: string;
}

export interface Project {
  slug: string;
  name: string;
  status: ProjectStatus;
  vehicle: VehicleId;
  assetType: string;
  location: string;
  summary: string;
  minimumInvestment: ProjectMetric;
  targetReturn: ProjectMetric;
  term: ProjectMetric;
}

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  open: 'Abierto',
  'coming-soon': 'Próxima apertura',
};

/**
 * Fichas de oportunidad. La estructura está cerrada, pero las cifras siguen pendientes de la
 * información del cliente: se muestran como marcador, nunca como una estimación inventada.
 */
export const PROJECTS: readonly Project[] = [
  {
    slug: 'inmuebles',
    name: 'Oportunidad inmobiliaria',
    status: 'coming-soon',
    vehicle: 'real-estate',
    assetType: 'Bienes raíces',
    location: 'Argentina',
    summary:
      'Ubicaciones prime con precios por metro cuadrado históricamente bajos respecto a Europa y un mercado transaccionado en dólares.',
    minimumInvestment: { label: 'Inversión inicial', pending: true, debtId: 'PROY-01' },
    targetReturn: { label: 'Retorno estimado', pending: true, debtId: 'PROY-01' },
    term: { label: 'Plazo estimado', pending: true, debtId: 'PROY-01' },
  },
  {
    slug: 'acciones',
    name: 'Renta variable argentina',
    status: 'coming-soon',
    vehicle: 'equities',
    assetType: 'Acciones y títulos',
    location: 'Argentina',
    summary:
      'Compañías del sector energético, agroindustrial y tecnológico que participan de la recuperación económica del país.',
    minimumInvestment: { label: 'Inversión inicial', pending: true, debtId: 'PROY-01' },
    targetReturn: { label: 'Retorno estimado', pending: true, debtId: 'PROY-01' },
    term: { label: 'Plazo estimado', pending: true, debtId: 'PROY-01' },
  },
  {
    slug: 'desarrollo',
    name: 'Desarrollo al pozo',
    status: 'coming-soon',
    vehicle: 'development',
    assetType: 'Proyectos de desarrollo',
    location: 'Argentina',
    summary:
      'Entrada en etapas tempranas de desarrollo urbano y residencial con estructura jurídico-fiscal mediante fideicomisos.',
    minimumInvestment: { label: 'Inversión inicial', pending: true, debtId: 'PROY-01' },
    targetReturn: { label: 'Retorno estimado', pending: true, debtId: 'PROY-01' },
    term: { label: 'Plazo estimado', pending: true, debtId: 'PROY-01' },
  },
];

export const PROJECTS_COPY = {
  eyebrow: 'Proyectos abiertos',
  homeTitle: 'Oportunidades en preparación',
  homeIntro:
    'Estamos cerrando la información de las primeras oportunidades. Cada ficha mostrará el tipo de activo, la inversión inicial y el retorno estimado antes de abrir la reserva.',
  homeCta: 'Ver todos los proyectos',
  pageTitle: 'Proyectos abiertos',
  pageIntro:
    'Las oportunidades se publican con su ficha completa y sus cifras confirmadas. Mientras tanto, puede reservar una sesión para revisar qué encaja con su perfil.',
  pageCta: 'Reservar sesión privada',
  pendingNote:
    'Las cifras de cada ficha se publicarán cuando el cliente confirme la información del proyecto.',
  metricPending: 'Dato pendiente de confirmación',
} as const;

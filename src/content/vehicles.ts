import type { VehicleId } from '@/lib/projection-assumptions';
import { ACT4 } from '@/scenes/04-marco-legal/content';
import { contactHref } from '@/scenes/05-activos-simulador/contactHref';
import { ACT5, type Vehicle } from '@/scenes/05-activos-simulador/content';
import { ACT67 } from '@/scenes/06-firma/content';

import { ACT7_PROPERTY_BODY, ACT7_SECURITIES_BODY } from './acts/act-7';
import type { ActSection } from './acts/types';

export interface VehicleDetail {
  vehicleId: VehicleId;
  ctaHref: string;
  sections: readonly ActSection[];
  sources: readonly string[];
}

/** Desglose de `content/secciones/05-nuestra-estrategia.md` (no el resumen de la home). */
const BREAKDOWN: Record<VehicleId, readonly (readonly [string, string])[]> = {
  'real-estate': [
    [
      ACT5.copy.advantage,
      'Ubicaciones prime con precios por m² históricamente bajos respecto a Europa',
    ],
    ['Divisa', 'Mercado cotizado y transaccionado en USD'],
    [ACT5.copy.performance, 'Alta plusvalía a mediano plazo'],
    ['Renta', 'Excelente rentabilidad por alquiler temporario o comercial'],
    ['Horizonte', 'Medio plazo'],
  ],
  equities: [
    ['Sectores', 'Energético, agroindustrial y tecnológico'],
    ['Tesis', 'Empresas liderando la recuperación económica; entrada en punto de inflexión'],
    [ACT5.copy.performance, 'Crecimiento de capital sustancial'],
    ['Palanca', 'Cambio de ciclo macroeconómico'],
    ['Horizonte', 'Ciclo macro'],
  ],
  development: [
    ['Tipo de entrada', 'Ingreso directo en etapas tempranas de desarrollo urbano y residencial'],
    ['Estructura', 'Jurídico-fiscal optimizada mediante fideicomisos'],
    [ACT5.copy.performance, 'Retornos optimizados'],
    ['Resguardo', 'Patrimonial tangible'],
    ['Horizonte', 'Ciclo de obra'],
  ],
};

const SOURCES = [
  'dossier OPTIMVS, sección V',
  'dossier OPTIMVS, sección IV',
  'dossier OPTIMVS, sección VII',
] as const;

const GUARANTEE_BLOCKS = [
  {
    kind: 'table' as const,
    caption: ACT4.guarantees.heading,
    columns: ['#', 'Pilar', 'Mecanismo'],
    rows: ACT4.guarantees.pillars.map((pillar) => [
      String(pillar.index),
      pillar.pillar,
      pillar.mechanism,
    ]),
  },
  { kind: 'list' as const, items: [ACT4.capitalProtectionNote] },
];

const ENTRY_BLOCKS = [
  {
    kind: 'pending' as const,
    label: ACT5.copy.entryFloorLabel,
    debtId: ACT5.entryFloor.debtId,
    note: ACT5.entryFloor.note,
  },
  { kind: 'disclaimer' as const },
];

function act7Route(id: 'property' | 'securities') {
  const route = ACT67.routes.find((entry) => entry.id === id);
  if (!route) throw new Error(`El acto VII no declara la vía ${id}`);
  return route;
}

function mechanismSection(vehicleId: VehicleId): ActSection {
  const securities = vehicleId === 'equities';
  const via = act7Route(securities ? 'securities' : 'property');
  const caption = securities ? `Vía 2 · ${via.title}` : `Vía 1 · ${via.title}`;
  return {
    id: 'operativa',
    heading: via.title,
    paragraphs: securities
      ? [ACT7_SECURITIES_BODY, ACT67.introducingBrokerNote]
      : [ACT7_PROPERTY_BODY, ACT67.cdiDisambiguation],
    blocks: [
      {
        kind: 'table',
        caption,
        columns: [ACT67.copy.routesMetric, via.title],
        rows: via.steps.map((step, index) => [String(index + 1), step]),
      },
    ],
  };
}

function vehicleById(vehicleId: VehicleId): Vehicle {
  const vehicle = ACT5.vehicles.find((entry) => entry.id === vehicleId);
  if (!vehicle) throw new Error(`ACT5 no declara el vehículo ${vehicleId}`);
  return vehicle;
}

function vehicleDetail(vehicle: Vehicle): VehicleDetail {
  const glossary = vehicle.glossary
    ? [{ kind: 'list' as const, items: [`${ACT5.copy.pozoTerm}: ${vehicle.glossary}`] }]
    : [];
  return {
    vehicleId: vehicle.id,
    ctaHref: contactHref(vehicle.id),
    sources: SOURCES,
    sections: [
      {
        id: 'ventaja',
        heading: ACT5.copy.advantage,
        paragraphs: [vehicle.advantage],
        blocks: [
          {
            kind: 'table',
            caption: vehicle.name,
            columns: ['Campo', 'Contenido'],
            rows: BREAKDOWN[vehicle.id].map(([field, value]) => [field, value]),
          },
          ...glossary,
        ],
      },
      {
        id: 'rendimiento',
        heading: ACT5.copy.performance,
        paragraphs: [vehicle.performance],
      },
      mechanismSection(vehicle.id),
      {
        id: 'garantias',
        heading: ACT4.guarantees.heading,
        paragraphs: ACT4.guarantees.intro,
        blocks: GUARANTEE_BLOCKS,
      },
      {
        id: 'acceso',
        heading: ACT5.copy.entryFloorTitle,
        blocks: ENTRY_BLOCKS,
      },
    ],
  };
}

export const VEHICLE_DETAILS: Record<VehicleId, VehicleDetail> = {
  'real-estate': vehicleDetail(vehicleById('real-estate')),
  equities: vehicleDetail(vehicleById('equities')),
  development: vehicleDetail(vehicleById('development')),
};

export function vehicleToc(vehicleId: VehicleId): readonly { id: string; label: string }[] {
  return VEHICLE_DETAILS[vehicleId].sections.flatMap((section) =>
    section.heading ? [{ id: section.id, label: section.heading }] : [],
  );
}

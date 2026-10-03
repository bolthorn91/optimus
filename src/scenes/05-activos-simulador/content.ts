import type { Scenario, VehicleId } from '@/lib/projection-assumptions';

export const SCENARIO_LABELS: Record<Scenario, string> = {
  conservative: 'Conservador',
  base: 'Base',
  favourable: 'Favorable',
};

export const VEHICLE_LABELS: Record<VehicleId, string> = {
  'real-estate': 'Bienes raíces / inmuebles',
  equities: 'Acciones y títulos locales',
  development: 'Proyectos de desarrollo (al pozo)',
};

export type VehicleIcon = 'property' | 'equities' | 'crane';

export interface Vehicle {
  id: VehicleId;
  name: string;
  advantage: string;
  performance: string;
  glossary?: string;
  icon: VehicleIcon;
}

export interface Act5Content {
  act: 5;
  title: string;
  intro: string;
  vehicles: readonly [Vehicle, Vehicle, Vehicle];
  entryFloor: { note: string; debtId: 'E-05' };
  cta: { label: string; href: string };
  copy: {
    entryFloorTitle: string;
    entryFloorLabel: string;
    advantage: string;
    performance: string;
    pozoGloss: string;
    pozoTerm: string;
    simulatorTitle: string;
    capitalLabel: string;
    horizonLabel: string;
    horizonUnit: string;
    scenarioLabel: string;
    scenarioConservative: string;
    scenarioBase: string;
    scenarioFavourable: string;
    finalValue: string;
    totalGain: string;
    rentalIncome: string;
    assumptionsTitle: string;
    tableCaption: string;
    tableYear: string;
    tableValue: string;
    tableGain: string;
    tableRent: string;
    rateLabel: string;
    rentYieldLabel: string;
  };
}

/** Literales de `content/secciones/05-nuestra-estrategia.md` y `content/03-datos-y-tablas.md`. */
export const ACT5: Act5Content = {
  act: 5,
  title: 'Nuestra estrategia',
  intro:
    'Por ello en OPTIMVS Capital Protegido hemos desarrollado un programa de inversión que abarca a todo el público, en el cual el suelo de inversión es mínimo y no tiene techo:',
  vehicles: [
    {
      id: 'real-estate',
      name: VEHICLE_LABELS['real-estate'],
      advantage:
        'Ubicaciones prime con precios por metro cuadrado históricamente bajos respecto a Europa. Mercado cotizado y transaccionado en USD.',
      performance:
        'Alta plusvalía a mediano plazo y excelente rentabilidad por alquiler temporario o comercial.',
      icon: 'property',
    },
    {
      id: 'equities',
      name: VEHICLE_LABELS.equities,
      advantage:
        'Empresas del sector energético, agroindustrial y tecnológico liderando la recuperación económica. Entrada en punto de inflexión.',
      performance:
        'Crecimiento de capital sustancial aprovechando el cambio de ciclo macroeconómico.',
      icon: 'equities',
    },
    {
      id: 'development',
      name: VEHICLE_LABELS.development,
      advantage:
        'Ingreso directo en etapas tempranas de desarrollo urbano y residencial con estructura jurídico-fiscal optimizada (fideicomisos).',
      performance: 'Retornos optimizados y resguardo patrimonial tangible.',
      glossary: 'Compra en fase temprana de obra',
      icon: 'crane',
    },
  ],
  entryFloor: {
    note: 'El importe de entrada se determina en la sesión de diagnóstico según el activo.',
    debtId: 'E-05',
  },
  cta: { label: 'Reservar sesión privada', href: '#contacto' },
  copy: {
    entryFloorTitle: 'Suelo de inversión mínimo. Sin techo.',
    entryFloorLabel: 'Importe de entrada',
    advantage: 'Ventaja estratégica',
    performance: 'Perfil de rendimiento',
    pozoGloss: 'Compra en fase temprana de obra',
    pozoTerm: 'al pozo',
    simulatorTitle: 'Escenario ilustrativo',
    capitalLabel: 'Capital inicial',
    horizonLabel: 'Horizonte',
    horizonUnit: 'años',
    scenarioLabel: 'Escenario',
    scenarioConservative: SCENARIO_LABELS.conservative,
    scenarioBase: SCENARIO_LABELS.base,
    scenarioFavourable: SCENARIO_LABELS.favourable,
    finalValue: 'Valor proyectado',
    totalGain: 'Plusvalía acumulada',
    rentalIncome: 'Renta acumulada',
    assumptionsTitle: 'Supuestos aplicados',
    tableCaption: 'Evolución año a año del escenario ilustrativo',
    tableYear: 'Año',
    tableValue: 'Valor',
    tableGain: 'Plusvalía',
    tableRent: 'Renta',
    rateLabel: 'Tasa anual aplicada',
    rentYieldLabel: 'Renta anual sobre capital inicial',
  },
};

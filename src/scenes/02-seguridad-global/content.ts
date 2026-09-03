import {
  RISK_COPY,
  RISK_LEVELS,
  RISK_PERIODS,
  RISK_REGIONS,
  type RiskLevelMeta,
  type RiskRegionMeta,
  type RiskSeries,
} from '@/scenes/02-seguridad-global/risk-data';

export interface ClimateRegion {
  name: string;
  isPrimary: boolean;
}

export interface ClimateContent {
  intro: string;
  split: readonly [string, string];
  regions: readonly ClimateRegion[];
  southAmerica: string;
  sourceNote: string;
}

export interface Act2Content {
  act: 2;
  title: string;
  headingVulnerable: string;
  intro: readonly [string, string];
  periods: RiskSeries;
  levels: readonly RiskLevelMeta[];
  regions: readonly RiskRegionMeta[];
  southAmericaArgument: readonly [string, string, string, string];
  climate: ClimateContent;
  closingQuote: string;
  sources: readonly string[];
  copy: typeof RISK_COPY & {
    periodSelector: string;
    sourcesLabel: string;
    climateCounter: string;
  };
}

/** Literales de `content/secciones/02-seguridad-global.md` y `content/03-datos-y-tablas.md`. */
export const ACT2: Act2Content = {
  act: 2,
  title: 'Seguridad global',
  headingVulnerable: 'Regiones vulnerables',
  intro: [
    'Las estadísticas globales permiten observar un movimiento de conflictos extendido a lo largo de las últimas décadas hacia regiones de paz, previendo que América del Norte sufrirá mayor tensión cuando, en un futuro cercano, los recursos del Mar Ártico sean uno de los puntos de disputa de poder entre las grandes potencias, además del estrés hídrico previsto en la cuenca del Río Colorado y sus alrededores, sumado a los fenómenos climáticos que se incrementarán en el sur de EE.UU. desde el Golfo de México.',
    'Europa, que alcanzó niveles de bienestar muy por encima del resto del mundo gracias al Pacto Social y los servicios públicos universales tras la devastadora primera mitad del siglo XX, ha comenzado a dejar expuestas grietas estructurales producidas por un cambio en sus políticas, discusiones entre los integrantes de la UE, una migración descontrolada (principalmente magrebí), medidas extremas de control sobre los ciudadanos y la debilitación paulatina de sus industrias.',
  ],
  periods: RISK_PERIODS,
  levels: RISK_LEVELS,
  regions: RISK_REGIONS,
  southAmericaArgument: [
    'Alejada de zonas propensas a guerras',
    'Acuerdos de no proliferación de armas',
    'Masa continental enorme, difícil de ocupar o controlar militarmente',
    'Posición históricamente neutral',
  ],
  climate: {
    intro:
      'Hace algunos años las principales potencias mundiales dieron inicio a la etapa de ejecución de programas de modificación del clima en algunas regiones del planeta. Estos programas se dividen en modificación local del tiempo y modificación de la radiación solar.',
    split: ['modificación local del tiempo', 'modificación de la radiación solar'],
    regions: [
      { name: 'China', isPrimary: true },
      { name: 'Estados Unidos', isPrimary: false },
      { name: 'Europa occidental', isPrimary: false },
      { name: 'Emiratos Árabes', isPrimary: false },
      { name: 'Arabia Saudita', isPrimary: false },
      { name: 'México', isPrimary: false },
      { name: 'India', isPrimary: false },
      { name: 'Rusia', isPrimary: false },
      { name: 'Irán', isPrimary: false },
      { name: 'Tailandia', isPrimary: false },
      { name: 'Israel', isPrimary: false },
      { name: 'Australia', isPrimary: false },
    ],
    southAmerica:
      'América del Sur cuenta en la actualidad únicamente con políticas preventivas, manteniendo el valor natural de la región, sin riesgos de medianas o grandes modificaciones en el futuro, influyendo positivamente en su proyección de estabilidad.',
    sourceNote: 'Fuentes de esta sección',
  },
  closingQuote:
    '¿Por qué es tan importante destacar la «zona de paz» en la que se encuentra Argentina, el eje del Cono Sur? Porque, si bien el desafío de este país es alcanzar una estabilidad política interna que impacte en los aspectos socioeconómico y de seguridad ciudadana para afianzar su sistema de vida, es un reto mucho más alcanzable que el que le toca enfrentar a Europa, en el que consultores políticos, sociales y económicos vaticinan el fin de Occidente como lo conocemos, pronosticando como efecto una nueva ola migratoria hacia América del Sur durante los próximos años.',
  sources: ['ACLED', 'Global Guardian', 'Crisis24', 'NASA'],
  copy: {
    ...RISK_COPY,
    periodSelector: 'Seleccionar período',
    sourcesLabel: 'Fuentes de esta sección',
    climateCounter: '12 regiones · Sudamérica no figura',
  },
};

export type DeptIcon = 'analysis' | 'finance' | 'development';

export type RouteId = 'property' | 'securities';

export interface Department {
  id: string;
  name: string;
  role: string;
  output: string;
  icon: DeptIcon;
}

export interface OperationalRoute {
  id: RouteId;
  title: string;
  steps: readonly string[];
  entities: readonly string[];
}

export interface GlossaryEntry {
  id: string;
  term: string;
  definition: string;
}

export interface Founder {
  name: string;
  role: string;
  bio: readonly [string, string, string];
  quote: string;
  portraitPending: true;
}

export interface Act67Content {
  acts: readonly [6, 7];
  title: string;
  firmSummary: string;
  founder: Founder;
  differential: string;
  authorisationNote: { literal: string; label: string; debtId: string };
  accompaniment: string;
  intermediationChain: { conventional: readonly string[]; optimvs: readonly string[] };
  departments: readonly [Department, Department, Department];
  investorRange: { from: string; to: string; fromDetail: string; toDetail: string };
  routesTitle: string;
  routesIntro: string;
  routes: readonly [OperationalRoute, OperationalRoute];
  cdiDisambiguation: string;
  introducingBrokerNote: string;
  glossary: readonly GlossaryEntry[];
  organisations: readonly string[];
  alliedPending: { label: string; debtId: string };
  copy: {
    founderHeading: string;
    portraitPending: string;
    departmentsHeading: string;
    rangeHeading: string;
    organisationsLabel: string;
    glossaryHeading: string;
    routesCaption: string;
    routesMetric: string;
    chainConventional: string;
    chainOptimvs: string;
  };
}

/** Literales de `content/secciones/06-estructura-operativa.md` y `07-asesoramiento-intermediacion.md`. */
export const ACT67: Act67Content = {
  acts: [6, 7],
  title: 'Nuestra estructura operativa España – Argentina',
  firmSummary:
    'OPTIMVS Capital Protegido es una firma hispano-argentina especializada en la facilitación y ejecución de inversiones internacionales.',
  founder: {
    name: 'Carlos Carbajal',
    role: 'Fundador',
    bio: [
      'Carlos Carbajal, fundador de OPTIMVS Capital Protegido, es la primera generación nacida fuera de España durante la prolongada estancia de sus padres en Hispanoamérica, por lo que posee ambas nacionalidades desde temprana edad. Estudió Marketing e Inglés, se especializó en comercialización de bienes raíces y tecnologías modernas como energías renovables, tecnología LED, gestión documental e integración digital, habiendo trabajado en diferentes continentes a lo largo de su trayectoria.',
      'Con una clara visión de tendencia conservadora, emprendió el desafío de operar comercialmente con bienes raíces e inversiones en Argentina, basándose en su visión actual del mundo y su proyección en el corto, mediano y largo plazo.',
      'Así nació OPTIMVS Capital Protegido, una empresa cuya misión es ofrecer a inversores de toda escala en diferentes niveles, españoles y resto de europeos, la posibilidad de resguardar su capital en un mercado en ascenso y en el centro de lo que él llama el nuevo Occidente.',
    ],
    quote: 'el nuevo Occidente',
    portraitPending: true,
  },
  differential:
    'A diferencia de los brokers o sociedades de valor convencionales, OPTIMVS Capital Protegido es una firma con una estructura simplificada de trato directo con el cliente y sin más intermediarios ni intervenciones que las entidades bancarias o financieras integradas en el marco legal y destinadas a la regulación y custodia de títulos, permitiendo que la trazabilidad de las inversiones sea claramente visible en tiempo real.',
  authorisationNote: {
    literal:
      'Nuestra operatoria cuenta con la habilitación correspondiente para operar bilateralmente con nuestra firma en Argentina.',
    label: 'Registro y organismo pendientes de confirmación',
    debtId: 'REG',
  },
  accompaniment:
    'Para ello nos desempeñamos como intermediarios directos para que el inversor (desde un comprador a plazos de una propiedad en pozo con una cuota mínima hasta un inversor en acciones de empresas líderes) transfiera su capital de España a Argentina con toda la documentación que requiere la trazabilidad certificada por La Haya, lo que otorga absoluta transparencia al mecanismo que, además está sujeto a un sistema basado, al igual que el español, en el derecho romano. Así le acompañamos durante todo el proceso a través de nuestras tres áreas clave:',
  intermediationChain: {
    conventional: ['Inversor', 'Broker', 'Sociedad de valores', 'Custodio', 'Activo'],
    optimvs: ['Inversor', 'OPTIMVS', 'Entidad regulada', 'Activo'],
  },
  departments: [
    {
      id: 'analysis',
      name: 'Departamento de Análisis',
      role: 'Monitoreamos constantemente el contexto geopolítico para mantener una constante selección de activos con máxima proyección de valor.',
      output: 'Selección continua de activos con máxima proyección de valor',
      icon: 'analysis',
    },
    {
      id: 'finance',
      name: 'Departamento Financiero y Técnico-Legal',
      role: 'Estructuramos transparentemente las transferencias de capital, el cumplimiento normativo, la optimización mediante el Convenio para Evitar la Doble Imposición (CDI) y asesoramiento fiscal bilateral.',
      output: 'Asesoramiento fiscal bilateral',
      icon: 'finance',
    },
    {
      id: 'development',
      name: 'Departamento de Desarrollo',
      role: 'Selección, gestión y comercialización directa de bienes raíces y carteras de inversión locales con su correspondiente seguimiento e informes diarios de los valores.',
      output: 'Seguimiento e informes diarios de los valores',
      icon: 'development',
    },
  ],
  investorRange: {
    from: 'cuota mínima',
    to: 'sin techo',
    fromDetail: 'Comprador a plazos de propiedad en pozo con cuota mínima',
    toDetail: 'Inversor en acciones de empresas líderes',
  },
  routesTitle: 'Asesoramiento e intermediación transfronteriza',
  routesIntro:
    'Para la operativa de capitales y adquisición de activos entre España y Argentina disponemos del marco legal adecuado:',
  routes: [
    {
      id: 'property',
      title: 'Inmuebles',
      steps: [
        'Tramitación de CDI / CDI-CUIL para compradores no residentes',
        'estructuración vía fideicomisos o escrituras',
        'apoderamiento notarial apostillado (Apostilla de La Haya)',
      ],
      entities: ['ARCA', 'Apostilla de La Haya'],
    },
    {
      id: 'securities',
      title: 'Valores Financieros',
      steps: [
        'Alianzas estratégicas tipo Introducing Broker',
        'entidades reguladas (ALyC en Argentina y agencias/ESIs reguladas por CNMV en España)',
        'derivación e ingreso legal de capitales',
      ],
      entities: ['ALyC', 'CNV', 'CNMV', 'ESI'],
    },
  ],
  cdiDisambiguation:
    'Tramitación de la Clave de Identificación (CDI) o CUIL ante ARCA para compradores no residentes en Argentina — no debe confundirse con el Convenio para Evitar la Doble Imposición (CDI) mencionado en el apartado fiscal.',
  introducingBrokerNote:
    'La figura de Introducing Broker significa que OPTIMVS capta y deriva al cliente hacia una entidad regulada que ejecuta; no ejecuta ni custodia por sí misma.',
  glossary: [
    {
      id: 'cdi',
      term: 'CDI',
      definition: 'Clave de Identificación — identificador fiscal argentino para no residentes',
    },
    {
      id: 'cuil',
      term: 'CUIL',
      definition: 'Código Único de Identificación Laboral (Argentina)',
    },
    {
      id: 'apostille',
      term: 'Apostilla de La Haya',
      definition: 'Legalización única que da validez transfronteriza a escrituras y poderes',
    },
    {
      id: 'alyc',
      term: 'ALyC',
      definition:
        'Agente de Liquidación y Compensación — intermediario bursátil regulado en Argentina',
    },
    {
      id: 'esi',
      term: 'ESI',
      definition: 'Empresa de Servicios de Inversión (España)',
    },
    {
      id: 'cnmv',
      term: 'CNMV',
      definition: 'Comisión Nacional del Mercado de Valores (España)',
    },
    {
      id: 'cnv',
      term: 'CNV',
      definition: 'Comisión Nacional de Valores (Argentina)',
    },
    {
      id: 'ib',
      term: 'Introducing Broker',
      definition: 'Figura que capta y deriva clientes a una entidad ejecutora regulada',
    },
  ],
  organisations: ['CNMV', 'CNV', 'AEAT', 'ARCA', 'ALyC', 'Apostilla de La Haya'],
  alliedPending: { label: 'Entidades aliadas', debtId: 'ALLY' },
  copy: {
    founderHeading: 'Carlos Carbajal, fundador',
    portraitPending: 'Retrato pendiente',
    departmentsHeading: 'Cómo le acompañamos',
    rangeHeading: 'Inversores de toda escala',
    organisationsLabel: 'Organismos y marcos',
    glossaryHeading: 'Glosario',
    routesCaption: 'Las dos vías operativas',
    routesMetric: 'Paso',
    chainConventional: 'Broker / sociedad de valores convencional',
    chainOptimvs: 'OPTIMVS Capital Protegido',
  },
};

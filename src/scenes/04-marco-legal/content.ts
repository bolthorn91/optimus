export type ProcessSide = 'ar' | 'es';

export interface ProcessStep {
  index: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  side: ProcessSide;
}

export type GuaranteeIcon = 'title' | 'apostille' | 'channel' | 'compliance';

export interface Guarantee {
  index: 1 | 2 | 3 | 4;
  pillar: string;
  mechanism: string;
  icon: GuaranteeIcon;
}

export interface Factor {
  name: string;
  detail: string;
}

export interface Area {
  label: string;
  hectares: number;
}

export interface Act4Content {
  act: 4;
  title: string;
  intro: string;
  whyArgentina: {
    heading: string;
    factors: readonly Factor[];
    paragraphs: readonly [string, string];
  };
  anchorStat: {
    hectares: 13243219;
    equivalence: string;
    since: 2024;
    label: string;
    source: string;
  };
  areas: { primary: Area; reference: Area };
  fiscal: { heading: string; paragraphs: readonly [string, string] };
  cdiSteps: readonly ProcessStep[];
  withholdingNote: string;
  guarantees: {
    heading: string;
    intro: readonly [string, string];
    pillars: readonly [Guarantee, Guarantee, Guarantee, Guarantee];
  };
  capitalProtectionNote: string;
  taxAdviceNote: string;
  cta: { label: string; href: string };
  copy: {
    cdiTitle: string;
    cdiStepLabel: string;
  };
}

/** Literales de `content/secciones/04-estrategia-anticipatoria.md` y `content/03-datos-y-tablas.md`. */
export const ACT4: Act4Content = {
  act: 4,
  title: 'La necesidad de una estrategia anticipatoria',
  intro:
    'Dado que la contracción del mercado y la presión fiscal agobiante cierran las puertas a la diversificación o la reinversión, quienes conserven su capital íntegramente dentro del sistema europeo y mucho más en el español quedarán expuestos a mayores cargas, restricciones operativas y un paulatino deterioro en la economía y la calidad de vida. Esto obliga a desviar la mirada y buscar alternativas más rentables y seguras en mercados bajo jurisdicciones internacionales claras que ofrecen alto potencial de valorización, activos tangibles y margen de maniobra real en divisas fuertes.',
  whyArgentina: {
    heading: '¿Por qué Argentina?',
    factors: [
      {
        name: 'Acuerdos bilaterales',
        detail: 'España y Argentina cuentan con acuerdos exclusivos en diferentes campos',
      },
      {
        name: 'Proyección personal',
        detail:
          'Posibilidad de considerar Argentina como lugar de desarrollo personal futuro, no sólo de inversión',
      },
      {
        name: 'Perfil riesgo-retorno',
        detail: 'Punto de entrada estratégico, sumamente atractivo',
      },
      {
        name: 'Recursos naturales',
        detail: 'Rentabilidad del desarrollo de industrias asociadas',
      },
      {
        name: 'Activos subvaluados',
        detail: 'Combinación de descuentos históricos',
      },
      {
        name: 'Reformas',
        detail: 'Liberalización económica',
      },
      {
        name: 'Mercado inmobiliario',
        detail: 'Dolarizado → ventana de oportunidad histórica',
      },
      {
        name: 'Tracción real',
        detail: 'Desde 2024 atrae capitales particulares y corporativos',
      },
    ],
    paragraphs: [
      'Debemos reconocer la importancia de que España y Argentina cuentan con acuerdos exclusivos en diferentes campos, lo que facilita la interacción entre ciudadanos de ambos países. Esto permite a los españoles proyectarse más allá de una inversión segura; es decir, considerar a Argentina un posible lugar para el desarrollo personal futuro.',
      'La coyuntura actual de Argentina ofrece un punto de entrada estratégico, caracterizado por un perfil de riesgo-retorno sumamente atractivo y respaldado por sólidas estructuras de resguardo legal y patrimonial que están atrayendo, desde 2024, capitales particulares y corporativos, dada la rentabilidad del desarrollo de industrias relacionadas con sus recursos naturales, la combinación de activos subvaluados, las reformas de liberalización económica y un mercado inmobiliario dolarizado que crea una ventana de oportunidad histórica. A ello se atribuye que actualmente unas 13.243.219 hectáreas (equivalente a la extensión de Inglaterra) están en manos de capitales privados extranjeros.',
    ],
  },
  anchorStat: {
    hectares: 13243219,
    equivalence: 'equivalente a la extensión de Inglaterra',
    since: 2024,
    label: 'en manos de capitales privados extranjeros',
    source: 'dossier OPTIMVS, pág. 11',
  },
  areas: {
    primary: {
      label: 'Superficie argentina en manos de capitales privados extranjeros',
      hectares: 13243219,
    },
    reference: {
      label: 'Extensión de Inglaterra',
      hectares: 13243219,
    },
  },
  fiscal: {
    heading: 'Marco fiscal y de seguridad jurídica',
    paragraphs: [
      'La propuesta de OPTIMVS Capital Protegido se articula bajo el paraguas del Convenio para Evitar la Doble Imposición entre España y Argentina, garantizando máxima seguridad jurídica y una rentabilidad neta optimizada. Este tratado bilateral elimina de raíz el riesgo de sobrecarga fiscal mediante el cómputo de crédito internacional: los impuestos abonados en origen por rendimientos inmobiliarios, agrarios o plusvalías reducen directamente la factura fiscal en España, asegurando que jamás se tributen dos veces por el mismo beneficio.',
      'Además, el CDI blinda el flujo de caja operativo al fijar topes máximos a la retención de dividendos y distribuciones de capital en origen. Con una clara delimitación de activos reales y la simple acreditación de residencia fiscal ante la AEAT, el inversor cuenta con un marco legal previsible, transparente y eficiente desde la toma de participación hasta la desinversión.',
    ],
  },
  cdiSteps: [
    {
      index: 1,
      title: 'Se invierte en un activo argentino',
      body: 'Se invierte en un activo argentino',
      side: 'ar',
    },
    {
      index: 2,
      title: 'Se tributa en origen',
      body: 'Se tributa en origen (Argentina) por rendimientos inmobiliarios, agrarios o plusvalías',
      side: 'ar',
    },
    {
      index: 3,
      title: 'Se acredita residencia fiscal ante la AEAT',
      body: 'Se acredita residencia fiscal ante la AEAT',
      side: 'es',
    },
    {
      index: 4,
      title: 'El impuesto pagado en Argentina se computa como crédito',
      body: 'El impuesto pagado en Argentina se computa como crédito internacional y reduce directamente la factura fiscal en España',
      side: 'es',
    },
    {
      index: 5,
      title: 'Nunca se tributa dos veces por el mismo beneficio',
      body: 'Resultado: nunca se tributa dos veces por el mismo beneficio',
      side: 'es',
    },
  ],
  withholdingNote:
    'El convenio fija además topes máximos a la retención de dividendos y distribuciones de capital en origen.',
  guarantees: {
    heading: 'Qué protege exactamente su capital',
    intro: [
      'Nuestro programa prioriza la preservación patrimonial basando su estructura de garantías en la certidumbre jurídica y el control directo del activo. El capital comprometido se respalda mediante titulación pública registral o fideicomisos de desarrollo debidamente constituidos, asegurando que la propiedad de los inmuebles o tierras agrícolas permanezca siempre a nombre del inversor o de su vehículo societario.',
      'Toda la operativa documental y contractual se formaliza bajo el amparo del Convenio de La Haya (Apostilla), otorgando plena validez legal transfronteriza a las escrituras y poderes otorgados. Asimismo, el flujo financiero se canaliza exclusivamente a través de entidades bancarias y de intermediación reguladas en España y Argentina, cumpliendo estrictos estándares de compliance y garantizando la total trazabilidad del capital en cada fase del proceso.',
    ],
    pillars: [
      {
        index: 1,
        pillar: 'Titularidad',
        mechanism:
          'Titulación pública registral o fideicomisos de desarrollo debidamente constituidos. La propiedad permanece siempre a nombre del inversor o de su vehículo societario.',
        icon: 'title',
      },
      {
        index: 2,
        pillar: 'Validez transfronteriza',
        mechanism: 'Convenio de La Haya (Apostilla) sobre escrituras y poderes.',
        icon: 'apostille',
      },
      {
        index: 3,
        pillar: 'Canalización del flujo',
        mechanism:
          'Exclusivamente por entidades bancarias y de intermediación reguladas en España y Argentina.',
        icon: 'channel',
      },
      {
        index: 4,
        pillar: 'Compliance y trazabilidad',
        mechanism:
          'Estándares estrictos de compliance; trazabilidad total del capital en cada fase del proceso.',
        icon: 'compliance',
      },
    ],
  },
  capitalProtectionNote:
    'Lo que se protege es la titularidad registral del activo, no el valor de la inversión.',
  taxAdviceNote:
    'Información fiscal de carácter general. Su aplicación depende de su situación individual; consulte asesoramiento independiente.',
  cta: { label: 'Analice su caso con un consultor', href: '#contacto' },
  copy: {
    cdiTitle: 'Cómo funciona el Convenio de Doble Imposición',
    cdiStepLabel: 'Paso',
  },
};

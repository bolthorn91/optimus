export interface Factor {
  index: 1 | 2 | 3;
  title: string;
  body: string;
  scope: string;
  illustration: 'density' | 'surveillance' | 'dematerialisation';
}

export interface Act1Stat {
  value: 14;
  unit: '%';
  label: string;
  source: string;
}

export interface Act1Content {
  act: 1;
  title: string;
  intro: string;
  factors: readonly [Factor, Factor, Factor];
  closing: string;
  stat: Act1Stat;
  cta: { label: string; href: string };
}

/** Literales de `content/secciones/01-nuevo-escenario-europeo.md` y `content/03-datos-y-tablas.md`. */
export const ACT1: Act1Content = {
  act: 1,
  title: 'El nuevo escenario europeo',
  intro:
    'Luego de la II Guerra Mundial y durante décadas, el continente europeo creó y robusteció un marco elevado de seguridad jurídica, crecimiento económico y estabilidad social. Sin embargo, los indicadores macroeconómicos y geopolíticos actuales confirman, especialmente en España, un cambio de paradigma irreversible en el largo plazo, compuesto en su base por tres factores convergentes que están alterando sustancialmente las condiciones de vida y libertad económica en el continente:',
  factors: [
    {
      index: 1,
      title: 'Transformación demográfica estructural',
      body: 'Los flujos migratorios masivos no absorbidos han tensionado los servicios públicos, la seguridad jurídica y la cohesión social, desplazando paulatinamente a Europa de los estándares tradicionales del primer mundo y generando una profunda incertidumbre acerca del futuro a corto, mediano y largo plazo.',
      scope: 'Social / demográfico',
      illustration: 'density',
    },
    {
      index: 2,
      title: 'Supervisión digital de las comunicaciones (Chat Control)',
      body: 'El marco regulatorio en desarrollo impondrá el rastreo automatizado de la mensajería privada, restricciones a la movilidad y segmentación del suelo mediante las «ciudades de 15 minutos» y las zonas de bajas emisiones (ZBE), fragmentando el valor del suelo urbano, suprimiendo la privacidad y la libertad de los ciudadanos y aproximando la gobernanza europea a sistemas de control social centralizado.',
      scope: 'Privacidad / regulatorio',
      illustration: 'surveillance',
    },
    {
      index: 3,
      title: 'Control monetario mediante el Euro Digital',
      body: 'La inminente entrada en vigor de la divisa digital centralizada significa el fin gradual del dinero físico y de la libertad financiera individual, dejando cada transacción sujeta a una trazabilidad completa con potenciales restricciones de uso libre.',
      scope: 'Monetario / financiero',
      illustration: 'dematerialisation',
    },
  ],
  closing:
    'España, particularmente, ocupa el podio de la transformación descrita, sumado el riesgo de haber entrado en una fase crítica para su principal eje económico, el turismo y la oferta de servicios, que representa el 14% del PIB nacional. Esto nos invita a anticiparnos a los hechos que sucederán durante los próximos años: la necesidad de diversificación geográfica, soberanía patrimonial o activos tangibles fuera de este marco de control.',
  stat: {
    value: 14,
    unit: '%',
    label: 'del PIB nacional depende del turismo y la oferta de servicios',
    source: 'dossier OPTIMVS, sección I',
  },
  cta: { label: 'Analice su caso con un consultor', href: '#contacto' },
};

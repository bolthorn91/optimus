import { COUNTRY_COLOR } from '@/lib/tokens';

export type CountryId = 'es' | 'ar';

export interface CountryFigures {
  id: CountryId;
  name: string;
  areaKm2: number;
  population: number;
  densityPerKm2: number;
  accentToken: string;
}

export interface LandAdvantage {
  index: 1 | 2 | 3;
  type: string;
  zones: string;
  advantage: string;
}

export interface MarketRow {
  criterion: string;
  spain: string;
  argentina: string;
  mark?: 'currency';
}

export interface Act3Content {
  act: 3;
  title: string;
  intro: { europe: string; southAmerica: string };
  countries: readonly [CountryFigures, CountryFigures];
  territorialModel: { spain: string; argentina: string };
  landAdvantages: readonly [LandAdvantage, LandAdvantage, LandAdvantage];
  market: readonly MarketRow[];
  conclusion: string;
  cta: { label: string; href: string };
  copy: {
    areaLabel: string;
    populationLabel: string;
    densityLabel: string;
    canvasAlt: string;
    fallbackNote: string;
    territorialCaption: string;
    marketCaption: string;
    territorialHeading: string;
    marketHeading: string;
    emptyCell: string;
    metricHeader: string;
    marketSpainDetail: string;
    marketArgentinaDetail: string;
    modelTitle: string;
    modelDesc: string;
    modelNode: string;
  };
}

const EMPTY = '—';

/** Cifras y literales de `content/03-datos-y-tablas.md` y `content/secciones/03-estado-de-derecho.md`. */
export const ACT3: Act3Content = {
  act: 3,
  title: 'Estado de derecho',
  intro: {
    europe:
      'Europa ha resignado parcialmente su estado de derecho y los efectos previstos la diferenciarán claramente del resto de Occidente, provocando una fuga de capitales de perfiles dinámicos con alta conciencia ciudadana o insatisfacción con el modelo fiscal/institucional, reduciendo así la masa crítica necesaria para fiscalizar al poder público o movilizar reformas institucionales, deteriorando el sistema y afectando la capacidad recaudatoria.',
    southAmerica:
      'Sudamérica, por su parte, está recibiendo un impacto positivo en su estructura. La llegada de inversiones a variada escala representa un fortalecimiento en sus aspectos económico, político y social, impulsará una evolución en la calidad de vida y alimentará la necesidad de optimizar el estado de derecho característico de Occidente.',
  },
  countries: [
    {
      id: 'es',
      name: 'España',
      areaKm2: 505990,
      population: 48600000,
      densityPerKm2: 96.05,
      accentToken: COUNTRY_COLOR.es,
    },
    {
      id: 'ar',
      name: 'Argentina',
      areaKm2: 2780400,
      population: 45900000,
      densityPerKm2: 16.51,
      accentToken: COUNTRY_COLOR.ar,
    },
  ],
  territorialModel: {
    spain:
      'En España hay un modelo de distribución con una concentración en forma de «anillo» periférico con un gran nodo central (Madrid) hiperconectado y superpoblado, con escaso suelo urbanizable en todo el territorio y estrictas regulaciones que han elevado el precio del metro cuadrado, haciendo que la rentabilidad del suelo sea más predecible, pero con techos de revalorización notablemente acotados.',
    argentina:
      'Argentina, con una superficie 5 veces mayor y una población similar en cantidad, resultando en una densidad media mucho más baja, presenta tres ventajas estratégicas clave para un proyecto de resguardo y crecimiento de capital:',
  },
  landAdvantages: [
    {
      index: 1,
      type: 'Suelo urbano premium',
      zones: 'CABA, AMBA, nodos provinciales',
      advantage:
        'Precios comprimidos en suelo de calidad; margen de revalorización en dólares significativamente superior a medio y largo plazo',
    },
    {
      index: 2,
      type: 'Suelo agrícola y agroindustrial',
      zones: EMPTY,
      advantage:
        'Una de las reservas de suelo fértil más valiosas y productivas del planeta; descuento sustancial frente a tierras de productividad similar en Europa o EE. UU.; cobertura contra la inflación global',
    },
    {
      index: 3,
      type: 'Suelo de desarrollo estratégico (energía y minería)',
      zones: 'Zonas norte y sur',
      advantage: 'Revalorización acelerada por demanda logística, industrial y habitacional',
    },
  ],
  market: [
    {
      criterion: 'Composición sectorial',
      spain: 'Sectores tradicionales',
      argentina: 'Sectores estratégicos: energía, entre otros',
    },
    {
      criterion: 'Peso en el PIB',
      spain: 'Parte sustancial del PIB nacional',
      argentina: EMPTY,
    },
    {
      criterion: 'Participación institucional',
      spain: 'Alta, global',
      argentina: EMPTY,
    },
    {
      criterion: 'Acceso',
      spain: EMPTY,
      argentina: 'Doble vía de acceso',
    },
    {
      criterion: 'Divisa de operación',
      spain: 'Euro',
      argentina: 'Dólar, bajo jurisdicción internacional',
      mark: 'currency',
    },
    {
      criterion: 'Previsibilidad',
      spain: 'Estable',
      argentina: EMPTY,
    },
    {
      criterion: 'Potencial de apreciación',
      spain: 'Limitado',
      argentina:
        'Techo de revalorización de varios dígitos, en escenarios de normalidad macroeconómica',
    },
    {
      criterion: 'Factores limitantes',
      spain:
        'Bajo crecimiento de la eurozona; fuerte presión regulatoria y fiscal sobre beneficios corporativos',
      argentina: EMPTY,
    },
    {
      criterion: 'Ingresos de las compañías',
      spain: EMPTY,
      argentina: 'Dolarizados o vinculados a commodities, cotizando con descuentos',
    },
  ],
  conclusion:
    'Mientras que España está oficialmente dentro de una zona vulnerable a conflictos políticos, bélicos y climatológicos, con un mercado inmobiliario que opera bajo un esquema maduro de alta densidad y precios consolidados en euros, la geografía global mantiene a Argentina fuera de riesgo una asimetría territorial única en su mercado inmobiliario: un suelo de altísimo valor estratégico cotizando a precios de entrada sumamente competitivos en dólares, convirtiendo al activo tangible en un vehículo idóneo para la compra con descuento, la generación de renta neta atractiva y la captura de plusvalías por apreciación de capital. De igual modo, en España la renta variable genera escaso margen de multiplicación de capital; el mercado argentino ofrece la posibilidad de posicionarse en activos de valor con descuentos históricos.',
  cta: { label: 'Analice su caso con un consultor', href: '/contacto' },
  copy: {
    areaLabel: 'Superficie',
    populationLabel: 'Población',
    densityLabel: 'Densidad',
    canvasAlt: 'España y Argentina de noche: densidad de luz urbana comparada',
    fallbackNote: 'Vista estática: su dispositivo no admite la escena interactiva',
    territorialCaption: 'Comparativa territorial',
    marketCaption: 'Comparativa de mercado bursátil',
    territorialHeading: 'Comparativa territorial',
    marketHeading: 'Mercado bursátil',
    emptyCell: EMPTY,
    metricHeader: 'Criterio',
    marketSpainDetail: 'IBEX 35',
    marketArgentinaDetail: 'Mercado argentino',
    modelTitle: 'Modelo territorial español',
    modelDesc: 'Anillo periférico con un nodo central en Madrid, hiperconectado.',
    modelNode: 'Madrid',
  },
};

import { formatArea, formatDensity, formatNumber } from '@/lib/format';
import { ACT3 } from '@/scenes/03-asimetria-territorial/content';

import type { ActDetail } from './types';

export const ACT3_SATELLITE_CAPTION =
  'IMAGEN SATELITAL EN LA QUE SE OBSERVA LA DENSIDAD POBLACIONAL EN AMBOS PAÍSES';

export const ACT3_LAND_BODIES = [
  'Suelo urbano premium (CABA, AMBA, nodos provinciales) con precios comprimidos en su suelo de calidad y un margen de revalorización en dólares significativamente superior a mediano y largo plazo.',
  'Suelo agrícola y agroindustrial en una de las reservas de suelo fértil más valiosas y productivas del planeta con un descuento sustancial en comparación con tierras de productividad similar en Europa o Estados Unidos, ofreciendo una sólida cobertura contra la inflación global.',
  'Suelo de desarrollo estratégico (energía y minería) está experimentando un proceso acelerado de revalorización por demanda logística, industrial y habitacional en zonas norte y sur.',
] as const;

export const ACT3_TERRITORIAL_MODEL = [
  {
    criterion: 'Patrón de distribución',
    spain: '«Anillo» periférico + gran nodo central (Madrid) hiperconectado y superpoblado',
    argentina: 'Baja densidad media',
  },
  {
    criterion: 'Suelo urbanizable',
    spain: 'Escaso en todo el territorio',
    argentina: 'Amplio',
  },
  {
    criterion: 'Marco regulatorio',
    spain: 'Estricto; ha elevado el precio del m²',
    argentina: '—',
  },
  {
    criterion: 'Rentabilidad del suelo',
    spain: 'Más predecible',
    argentina: '—',
  },
  {
    criterion: 'Techo de revalorización',
    spain: 'Notablemente acotado',
    argentina: 'Significativamente superior a medio y largo plazo',
  },
] as const;

const SPAIN_AR = {
  left: {
    id: ACT3.countries[0].id,
    name: ACT3.countries[0].name,
    accentToken: 'var(--color-country-es)',
  },
  right: {
    id: ACT3.countries[1].id,
    name: ACT3.countries[1].name,
    accentToken: 'var(--color-country-ar)',
  },
  metricHeader: ACT3.copy.metricHeader,
} as const;

export const ACT3_DETAIL: ActDetail = {
  actNumber: 3,
  sources: ['dossier OPTIMVS, sección III', 'INDEC', 'Banco de España'],
  sections: [
    { id: 'entradilla', paragraphs: [ACT3.intro.europe, ACT3.intro.southAmerica] },
    {
      id: 'comparativa-territorial',
      heading: ACT3.copy.territorialHeading,
      paragraphs: [
        ACT3.territorialModel.spain,
        ACT3.territorialModel.argentina,
        ...ACT3_LAND_BODIES,
      ],
      blocks: [
        {
          kind: 'paired',
          caption: ACT3.copy.territorialCaption,
          ...SPAIN_AR,
          rows: [
            {
              id: 'area',
              metric: ACT3.copy.areaLabel,
              left: formatArea(ACT3.countries[0].areaKm2, 'km²'),
              right: formatArea(ACT3.countries[1].areaKm2, 'km²'),
            },
            {
              id: 'population',
              metric: ACT3.copy.populationLabel,
              left: formatNumber(ACT3.countries[0].population),
              right: formatNumber(ACT3.countries[1].population),
            },
            {
              id: 'density',
              metric: ACT3.copy.densityLabel,
              left: formatDensity(ACT3.countries[0].densityPerKm2),
              right: formatDensity(ACT3.countries[1].densityPerKm2),
            },
          ],
        },
        {
          kind: 'paired',
          caption: 'Comparativa de modelo territorial',
          ...SPAIN_AR,
          rows: ACT3_TERRITORIAL_MODEL.map((row) => ({
            id: row.criterion,
            metric: row.criterion,
            left: row.spain,
            right: row.argentina,
          })),
        },
        {
          kind: 'image',
          src: '/assets-origen/p09-X36.png',
          alt: ACT3_SATELLITE_CAPTION,
          caption: ACT3_SATELLITE_CAPTION,
        },
        {
          kind: 'table',
          caption: 'Las 3 ventajas estratégicas de Argentina',
          columns: ['#', 'Tipo de suelo', 'Zonas', 'Ventaja declarada'],
          rows: ACT3.landAdvantages.map((item) => [
            String(item.index),
            item.type,
            item.zones,
            item.advantage,
          ]),
        },
      ],
    },
    {
      id: 'mercado-bursatil',
      heading: ACT3.copy.marketHeading,
      paragraphs: [
        'En España el IBEX 35 está dominado por sectores tradicionales, representa una parte sustancial del PIB nacional con alta participación institucional global, ofrece previsibilidad estable, pero con un potencial de apreciación de capital limitado por el bajo crecimiento de la eurozona y la fuerte presión regulatoria y fiscal sobre los beneficios corporativos.',
        'El mercado argentino se concentra en sectores estratégicos como la energía, entre otros, con doble vía de acceso, lo que permite operar activos argentinos directamente en dólares y bajo jurisdicción internacional. Múltiples capitales generan ingresos dolarizados o vinculados a commodities, cotizando con descuentos, alcanzando un techo de revalorización de varios dígitos en escenarios de normalidad macroeconómica.',
      ],
      blocks: [
        {
          kind: 'paired',
          caption: ACT3.copy.marketCaption,
          left: {
            ...SPAIN_AR.left,
            detail: ACT3.copy.marketSpainDetail,
          },
          right: {
            ...SPAIN_AR.right,
            detail: ACT3.copy.marketArgentinaDetail,
          },
          metricHeader: SPAIN_AR.metricHeader,
          rows: ACT3.market.map((row) => ({
            id: row.criterion,
            metric: row.criterion,
            left: row.spain,
            right: row.argentina,
          })),
        },
      ],
    },
    { id: 'conclusion', heading: 'Conclusión', paragraphs: [ACT3.conclusion] },
  ],
};

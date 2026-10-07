import { ACT2 } from '@/scenes/02-seguridad-global/content';

import type { ActDetail } from './types';

export const ACT2_MAP_READING =
  'Oceanía y América del Sur se encuentran en zonas del mapa alejadas de los sectores vulnerables a conflictos bélicos. En el caso del continente oriental, el aislamiento insular le otorgó históricamente las condiciones geográficas para madurar un modelo de gobernanza propio e independiente con el reto actual de administrar la creciente atención de las potencias mundiales sin perder el control de su propia agenda regional. América del Sur, por su parte, también está ubicada lejos de las zonas propensas a guerras, tiene acuerdos de no proliferación de armas, es una masa continental enorme, difícil de ocupar o controlar militarmente, y se mantiene en una posición históricamente neutral.';

export const ACT2_CLIMATE_REGIONS =
  'Las zonas «a salvo» en el mundo se han visto poco a poco reducidas, hasta abarcar amplias regiones: China, la principal, Estados Unidos, Europa occidental, Emiratos Árabes, Arabia Saudita, México, India, Rusia, Irán, Tailandia, Israel y Australia.';

export const ACT2_DETAIL: ActDetail = {
  actNumber: 2,
  sources: ACT2.sources,
  sections: [
    {
      id: 'regiones-vulnerables',
      heading: ACT2.headingVulnerable,
      paragraphs: [...ACT2.intro, ACT2_MAP_READING],
      blocks: [
        {
          kind: 'risk-table',
          copy: {
            caption: ACT2.copy.tableCaption,
            regionHeader: ACT2.copy.tableRegion,
            projectionNote: ACT2.copy.projectionNote,
          },
          periods: ACT2.periods,
          regions: ACT2.regions,
          levels: ACT2.levels,
        },
        { kind: 'list', items: ACT2.southAmericaArgument },
      ],
    },
    {
      id: 'factor-climatico',
      heading: ACT2.climate.heading,
      paragraphs: [ACT2.climate.intro, ACT2_CLIMATE_REGIONS, ACT2.climate.southAmerica],
      blocks: [
        {
          kind: 'list',
          items: ACT2.climate.regions.map((region) =>
            region.isPrimary ? `${region.name} (${ACT2.climate.primaryMark})` : region.name,
          ),
        },
      ],
    },
    { id: 'zona-de-paz', paragraphs: [ACT2.closingQuote] },
  ],
};

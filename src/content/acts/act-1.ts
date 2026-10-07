import { formatPercent } from '@/lib/format';
import { ACT1 } from '@/scenes/01-escenario-europeo/content';

import type { ActDetail } from './types';

export const ACT1_DETAIL: ActDetail = {
  actNumber: 1,
  sources: ['dossier OPTIMVS, sección I'],
  sections: [
    { id: 'entradilla', paragraphs: [ACT1.intro] },
    {
      id: 'factores',
      heading: 'Los tres factores convergentes',
      paragraphs: ACT1.factors.map((factor) => factor.body),
      blocks: [
        {
          kind: 'table',
          caption: 'Los 3 factores del cambio europeo',
          columns: ['#', 'Título', 'Ámbito', 'Consecuencia declarada'],
          rows: ACT1.factors.map((factor) => [
            String(factor.index),
            factor.title,
            factor.scope,
            factor.body,
          ]),
        },
      ],
    },
    {
      id: 'cierre',
      paragraphs: [ACT1.closing],
      blocks: [
        {
          kind: 'stat',
          value: formatPercent(ACT1.stat.value),
          label: ACT1.stat.label,
          source: ACT1.stat.source,
        },
      ],
    },
  ],
};

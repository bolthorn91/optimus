import { formatArea } from '@/lib/format';
import { ACT4 } from '@/scenes/04-marco-legal/content';

import type { ActDetail } from './types';

export const ACT4_DETAIL: ActDetail = {
  actNumber: 4,
  sources: [ACT4.anchorStat.source, 'Convenio de La Haya'],
  sections: [
    { id: 'entradilla', paragraphs: [ACT4.intro] },
    {
      id: 'por-que-argentina',
      heading: ACT4.whyArgentina.heading,
      paragraphs: ACT4.whyArgentina.paragraphs,
      blocks: [
        {
          kind: 'table',
          caption: '¿Por qué Argentina? — factores',
          columns: ['Factor', 'Detalle'],
          rows: ACT4.whyArgentina.factors.map((factor) => [factor.name, factor.detail]),
        },
        {
          kind: 'stat',
          value: formatArea(ACT4.anchorStat.hectares, 'ha'),
          label: `${ACT4.anchorStat.label} — ${ACT4.anchorStat.equivalence}`,
          source: ACT4.anchorStat.source,
        },
      ],
    },
    {
      id: 'marco-fiscal',
      heading: ACT4.fiscal.heading,
      paragraphs: ACT4.fiscal.paragraphs,
      blocks: [
        {
          kind: 'process',
          title: ACT4.copy.cdiTitle,
          fromLabel: ACT4.copy.diagramFrom,
          toLabel: ACT4.copy.diagramTo,
          stepLabel: ACT4.copy.cdiStepLabel,
          steps: ACT4.cdiSteps.map((step) => ({
            id: String(step.index),
            title: step.title,
            body: step.body,
          })),
          notes: [ACT4.withholdingNote, ACT4.taxAdviceNote],
        },
        { kind: 'disclaimer' },
      ],
    },
    {
      id: 'garantias',
      heading: 'Garantías',
      paragraphs: ACT4.guarantees.intro,
      blocks: [
        {
          kind: 'table',
          caption: 'Los 4 pilares de garantías',
          columns: ['#', 'Pilar', 'Mecanismo'],
          rows: ACT4.guarantees.pillars.map((pillar) => [
            String(pillar.index),
            pillar.pillar,
            pillar.mechanism,
          ]),
        },
        { kind: 'list', items: [ACT4.capitalProtectionNote] },
        { kind: 'disclaimer' },
      ],
    },
  ],
};

import { ACT67 } from '@/scenes/06-firma/content';

import type { ActDetail } from './types';

export const ACT6_DETAIL: ActDetail = {
  actNumber: 6,
  sources: ['dossier OPTIMVS, sección VI', 'Convenio de La Haya'],
  sections: [
    { id: 'presentacion', paragraphs: [ACT67.firmSummary] },
    {
      id: 'fundador',
      heading: ACT67.copy.founderHeading,
      paragraphs: ACT67.founder.bio,
    },
    {
      id: 'diferencial',
      heading: 'Diferencial frente a brokers convencionales',
      paragraphs: [ACT67.differential],
      blocks: [
        {
          kind: 'paired',
          caption: 'Diferencial — comparativa',
          left: {
            id: 'conventional',
            name: ACT67.copy.chainConventional,
            accentToken: 'var(--ink-muted)',
          },
          right: {
            id: 'optimvs',
            name: ACT67.copy.chainOptimvs,
            accentToken: 'var(--accent)',
          },
          metricHeader: 'Criterio',
          rows: [
            {
              id: 'estructura',
              metric: 'Estructura',
              left: 'Múltiples capas de intermediación',
              right: 'Simplificada, trato directo con el cliente',
            },
            {
              id: 'intervinientes',
              metric: 'Intervinientes',
              left: 'Varios intermediarios',
              right: 'Sólo entidades bancarias/financieras reguladas para custodia de títulos',
            },
            {
              id: 'trazabilidad',
              metric: 'Trazabilidad',
              left: '—',
              right: 'Claramente visible en tiempo real',
            },
          ],
        },
      ],
    },
    {
      id: 'operativa',
      heading: 'Operativa bilateral',
      paragraphs: [`${ACT67.authorisationNote.literal} ${ACT67.accompaniment}`],
      blocks: [
        {
          kind: 'pending',
          label: ACT67.authorisationNote.label,
          debtId: ACT67.authorisationNote.debtId,
        },
      ],
    },
    {
      id: 'departamentos',
      heading: ACT67.copy.departmentsHeading,
      paragraphs: ACT67.departments.map((department) => department.role),
      blocks: [
        {
          kind: 'table',
          caption: 'Los tres departamentos',
          columns: ['Departamento', 'Función', 'Salida para el inversor'],
          rows: ACT67.departments.map((department) => [
            department.name,
            department.role,
            department.output,
          ]),
        },
      ],
    },
  ],
};

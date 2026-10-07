import { ACT67 } from '@/scenes/06-firma/content';

import type { ActDetail } from './types';

export const ACT7_PROPERTY_BODY =
  'Tramitación de CDI / CDI-CUIL para compradores no residentes, estructuración vía fideicomisos o escrituras con apoderamiento notarial apostillado (Apostilla de La Haya).';

export const ACT7_SECURITIES_BODY =
  'Alianzas estratégicas tipo Introducing Broker con entidades reguladas (ALyC en Argentina y agencias/ESIs reguladas por CNMV en España) para la derivación e ingreso legal de capitales.';

export const ACT7_DETAIL: ActDetail = {
  actNumber: 7,
  sources: ACT67.organisations,
  sections: [
    { id: 'entradilla', paragraphs: [ACT67.routesIntro] },
    {
      id: 'inmuebles',
      heading: 'Inmuebles',
      paragraphs: [ACT7_PROPERTY_BODY, ACT67.cdiDisambiguation],
      blocks: [
        {
          kind: 'table',
          caption: 'Vía 1 · Inmuebles',
          columns: ['Elemento', 'Detalle'],
          rows: [
            [
              'Identificación fiscal',
              'Tramitación de CDI / CDI-CUIL para compradores no residentes',
            ],
            ['Estructuración', 'Vía fideicomisos o escrituras'],
            ['Poderes', 'Apoderamiento notarial apostillado (Apostilla de La Haya)'],
            ['Destinatario', 'Comprador no residente en Argentina'],
          ],
        },
      ],
    },
    {
      id: 'valores-financieros',
      heading: 'Valores Financieros',
      paragraphs: [ACT7_SECURITIES_BODY, ACT67.introducingBrokerNote],
      blocks: [
        {
          kind: 'table',
          caption: 'Vía 2 · Valores financieros',
          columns: ['Elemento', 'Detalle'],
          rows: [
            ['Figura', 'Alianzas estratégicas tipo Introducing Broker'],
            [
              'Contraparte en Argentina',
              'ALyC — Agentes de Liquidación y Compensación (regulados por CNV)',
            ],
            ['Contraparte en España', 'Agencias / ESIs reguladas por CNMV'],
            ['Función', 'Derivación e ingreso legal de capitales'],
          ],
        },
        {
          kind: 'glossary',
          heading: ACT67.copy.organisationsLabel,
          organisations: ACT67.organisations,
          entries: ACT67.glossary,
        },
      ],
    },
  ],
};

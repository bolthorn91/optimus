import { CONTACT } from '@/content/contact';

import type { LegalDocument } from './types';

export const FINANCIAL_DISCLAIMER_LONG = [
  'Aviso importante. La información contenida en este sitio web tiene carácter exclusivamente informativo y comercial. No constituye asesoramiento de inversión, recomendación personalizada, oferta pública ni invitación a suscribir, adquirir o enajenar instrumento financiero alguno.',
  'OPTIMVS Capital Protegido actúa como intermediario y facilitador. La ejecución, custodia y liquidación de operaciones sobre valores se realiza a través de entidades reguladas por la CNMV en España y por la CNV en Argentina.',
  'Toda inversión conlleva riesgo, incluida la pérdida total o parcial del capital invertido. Las inversiones en activos denominados en divisa extranjera están expuestas a riesgo de tipo de cambio. Las inversiones en mercados emergentes conllevan riesgos adicionales de liquidez, volatilidad, regulatorios y político-económicos.',
  'Las referencias a rentabilidades, plusvalías o revalorizaciones son estimaciones o descripciones de escenarios y no constituyen garantía de resultados futuros. Los rendimientos pasados no son indicativos de rendimientos futuros.',
  'La información fiscal es de carácter general y no considera las circunstancias particulares de cada inversor. Su aplicación depende de la situación individual y puede variar por cambios normativos. Se recomienda asesoramiento fiscal y jurídico independiente antes de tomar cualquier decisión.',
] as const;

export const LEGAL_NOTICE: LegalDocument = {
  id: 'notice',
  title: 'Aviso legal',
  sections: [
    {
      id: 'datos-identificativos',
      heading: 'Datos identificativos',
      paragraphs: [
        'Los datos registrales de la firma no están confirmados. Cada campo ausente se marca de forma visible; no se publica un CIF, una razón social ni un domicilio inventados.',
      ],
      pending: [
        { label: 'Denominación social completa (España)', debtId: CONTACT.registry.debtId },
        { label: 'CIF / NIF', debtId: CONTACT.registry.debtId },
        { label: 'Domicilio social', debtId: CONTACT.registry.debtId },
        { label: 'Datos de inscripción registral', debtId: CONTACT.registry.debtId },
        { label: CONTACT.email.label, debtId: CONTACT.email.debtId },
        { label: 'Denominación y datos de la firma argentina', debtId: CONTACT.registry.debtId },
        { label: 'Habilitación / registro invocado en la sección VI', debtId: 'REG-06' },
      ],
    },
    {
      id: 'disclaimer-financiero',
      heading: 'Disclaimer financiero',
      paragraphs: FINANCIAL_DISCLAIMER_LONG,
    },
  ],
};

import { CONTACT } from '@/content/contact';

import type { LegalDocument } from './types';

export const ARGENTINA_TRANSFER =
  'El tratamiento implicará compartir datos con la firma argentina. Argentina cuenta con decisión de adecuación de la Comisión Europea.';

export const LEGAL_PRIVACY: LegalDocument = {
  id: 'privacy',
  title: 'Política de privacidad',
  sections: [
    {
      id: 'responsable',
      heading: 'Responsable del tratamiento',
      paragraphs: [
        'La identidad y los datos del responsable se publicarán cuando el cliente los confirme. Mientras tanto el campo permanece marcado como pendiente.',
      ],
      pending: [{ label: CONTACT.registry.label, debtId: CONTACT.registry.debtId }],
    },
    {
      id: 'finalidades',
      heading: 'Finalidades y base legal',
      paragraphs: [
        'Finalidades: atención de la solicitud de sesión, gestión comercial, y —si aplica— comunicaciones comerciales. Base legal de cada finalidad: consentimiento para lo comercial; medidas precontractuales para la solicitud.',
      ],
    },
    {
      id: 'categorias',
      heading: 'Categorías y destinatarios',
      paragraphs: [
        'Categorías de datos, incluida la horquilla de capital si se recoge. Destinatarios y cesiones: las necesarias para atender la solicitud. Datos de contacto para ejercer los derechos: pendientes de confirmación.',
      ],
      pending: [{ label: CONTACT.email.label, debtId: CONTACT.email.debtId }],
    },
    {
      id: 'transferencias',
      heading: 'Transferencias internacionales',
      paragraphs: [ARGENTINA_TRANSFER],
    },
    {
      id: 'derechos',
      heading: 'Plazo, derechos y AEPD',
      paragraphs: [
        'Plazo de conservación: el necesario para la finalidad. Derechos: acceso, rectificación, supresión, oposición, limitación, portabilidad, y reclamación ante la AEPD.',
      ],
    },
  ],
};

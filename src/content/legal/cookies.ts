import type { LegalDocument } from './types';

export const LEGAL_COOKIES: LegalDocument = {
  id: 'cookies',
  title: 'Política de cookies',
  sections: [
    {
      id: 'analitica',
      heading: 'Analítica sin cookies',
      paragraphs: [
        'La medición del sitio es una solución sin cookies y respetuosa con la privacidad. No hay banner porque no se usa ninguna cookie no esencial.',
      ],
    },
    {
      id: 'inventario',
      heading: 'Inventario',
      paragraphs: [
        'Este sitio no instala cookies, ni de analítica ni técnicamente necesarias. El inventario queda vacío.',
      ],
    },
  ],
};

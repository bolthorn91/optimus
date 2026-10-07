import { ACT5 } from '@/scenes/05-activos-simulador/content';

import type { ActDetail } from './types';

export const ACT5_DETAIL: ActDetail = {
  actNumber: 5,
  sources: ['dossier OPTIMVS, sección V'],
  sections: [
    { id: 'entradilla', paragraphs: [ACT5.intro] },
    {
      id: 'vehiculos',
      heading: 'Los tres vehículos',
      blocks: [
        {
          kind: 'table',
          caption: 'Tabla de activos',
          columns: ['Tipo de activo', ACT5.copy.advantage, ACT5.copy.performance],
          rows: ACT5.vehicles.map((vehicle) => [
            vehicle.name,
            vehicle.advantage,
            vehicle.performance,
          ]),
        },
        {
          kind: 'pending',
          label: ACT5.copy.entryFloorLabel,
          debtId: ACT5.entryFloor.debtId,
          note: ACT5.entryFloor.note,
        },
        { kind: 'disclaimer' },
      ],
    },
  ],
};

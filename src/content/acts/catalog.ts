import type { ActNumber } from '@/app/routes';

import { ACT1_DETAIL } from './act-1';
import { ACT2_DETAIL } from './act-2';
import { ACT3_DETAIL } from './act-3';
import { ACT4_DETAIL } from './act-4';
import { ACT5_DETAIL } from './act-5';
import { ACT6_DETAIL } from './act-6';
import { ACT7_DETAIL } from './act-7';
import type { ActDetail } from './types';

export const ACT_DETAILS: Record<ActNumber, ActDetail> = {
  1: ACT1_DETAIL,
  2: ACT2_DETAIL,
  3: ACT3_DETAIL,
  4: ACT4_DETAIL,
  5: ACT5_DETAIL,
  6: ACT6_DETAIL,
  7: ACT7_DETAIL,
};

export function actToc(actNumber: ActNumber): readonly { id: string; label: string }[] {
  return ACT_DETAILS[actNumber].sections.flatMap((section) =>
    section.heading ? [{ id: section.id, label: section.heading }] : [],
  );
}

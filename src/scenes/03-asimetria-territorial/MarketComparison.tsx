import type { ReactNode } from 'react';

import { PairedComparison } from '@/components/PairedComparison';
import { ACT3, type MarketRow } from '@/scenes/03-asimetria-territorial/content';

function cell(text: string, mark?: MarketRow['mark']): ReactNode {
  if (mark === 'currency' && text !== ACT3.copy.emptyCell) {
    return <span data-currency>{text}</span>;
  }
  return text;
}

export function MarketComparison({ rows }: { rows: readonly MarketRow[] }) {
  const [spain, argentina] = ACT3.countries;
  return (
    <PairedComparison
      caption={ACT3.copy.marketCaption}
      left={{
        id: spain.id,
        name: spain.name,
        detail: ACT3.copy.marketSpainDetail,
        accentToken: 'var(--color-country-es)',
      }}
      metricHeader={ACT3.copy.metricHeader}
      right={{
        id: argentina.id,
        name: argentina.name,
        detail: ACT3.copy.marketArgentinaDetail,
        accentToken: 'var(--color-country-ar)',
      }}
      rows={rows.map((row) => ({
        id: row.criterion,
        metric: row.criterion,
        left: cell(row.spain, row.mark),
        right: cell(row.argentina, row.mark),
      }))}
    />
  );
}

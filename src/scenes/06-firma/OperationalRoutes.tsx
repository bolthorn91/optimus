import type { CSSProperties } from 'react';

import { PairedComparison } from '@/components/PairedComparison';
import { ACT67, type OperationalRoute } from '@/scenes/06-firma/content';

function stepRows(routes: readonly [OperationalRoute, OperationalRoute]) {
  const [left, right] = routes;
  const count = Math.max(left.steps.length, right.steps.length);
  return Array.from({ length: count }, (_, index) => ({
    id: `step-${String(index + 1)}`,
    metric: String(index + 1),
    left: left.steps[index] ?? '',
    right: right.steps[index] ?? '',
  }));
}

export function OperationalRoutes({
  routes,
  progress,
}: {
  routes: readonly [OperationalRoute, OperationalRoute];
  progress: number;
}) {
  const [left, right] = routes;

  return (
    <div data-routes style={{ ['--routes-progress']: String(progress) } as CSSProperties}>
      <PairedComparison
        caption={ACT67.copy.routesCaption}
        left={{ id: left.id, name: left.title, accentToken: 'var(--color-gold)' }}
        metricHeader={ACT67.copy.routesMetric}
        right={{ id: right.id, name: right.title, accentToken: 'var(--color-gold-high)' }}
        rows={stepRows(routes)}
      />
    </div>
  );
}

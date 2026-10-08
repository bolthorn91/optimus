import type { CSSProperties } from 'react';

import type { PairedRow, PairedSide } from '@/components/PairedComparison';

import './stacked-comparison.css';

export function StackedComparison({
  left,
  right,
  rows,
  caption,
}: {
  left: PairedSide;
  right: PairedSide;
  rows: readonly PairedRow[];
  caption: string;
}) {
  const sides = [left, right] as const;

  return (
    <div className="stacked-comparison" data-stacked-comparison>
      <p className="stacked-comparison__caption">{caption}</p>
      {sides.map((side, index) => (
        <section
          className="stacked-comparison__side"
          data-side={side.id}
          key={side.id}
          style={{ '--side-accent': side.accentToken } as CSSProperties}
        >
          <h3 className="stacked-comparison__name">
            {side.name}
            {side.detail ? <span className="stacked-comparison__detail">{side.detail}</span> : null}
          </h3>
          <dl>
            {rows.map((row) => (
              <div key={row.id}>
                <dt>{row.metric}</dt>
                <dd data-tabular>{index === 0 ? row.left : row.right}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}

import type { CSSProperties, ReactNode } from 'react';

import './paired-comparison.css';

export interface PairedSide {
  id: string;
  name: string;
  detail?: string;
  accentToken: string;
}

export interface PairedRow {
  id: string;
  metric: string;
  left: ReactNode;
  right: ReactNode;
}

export function PairedComparison({
  left,
  right,
  rows,
  caption,
  metricHeader,
}: {
  left: PairedSide;
  right: PairedSide;
  rows: readonly PairedRow[];
  caption: string;
  metricHeader: string;
}) {
  return (
    <table
      className="paired-comparison"
      data-paired-comparison
      style={
        {
          '--paired-left': left.accentToken,
          '--paired-right': right.accentToken,
        } as CSSProperties
      }
    >
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">
            <span className="visually-hidden">{metricHeader}</span>
          </th>
          <th data-side={left.id} scope="col">
            {left.name}
            {left.detail ? <span className="paired-comparison__detail">{left.detail}</span> : null}
          </th>
          <th data-side={right.id} scope="col">
            {right.name}
            {right.detail ? (
              <span className="paired-comparison__detail">{right.detail}</span>
            ) : null}
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <th scope="row">{row.metric}</th>
            <td data-tabular>{row.left}</td>
            <td data-tabular>{row.right}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

import type { ReactNode } from 'react';

import './definition-table.css';

export interface DefinitionRow {
  id: string;
  term: string;
  description: ReactNode;
  note?: ReactNode;
}

export function DefinitionTable({
  caption,
  rows,
}: {
  caption: string;
  rows: readonly DefinitionRow[];
}) {
  return (
    <div className="definition-table" data-definition-table>
      <p className="definition-table__caption">{caption}</p>
      <dl>
        {rows.map((row) => (
          <div key={row.id}>
            <dt>{row.term}</dt>
            <dd>
              {row.description}
              {row.note ? <span className="definition-table__note"> {row.note}</span> : null}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

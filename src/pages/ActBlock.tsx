import { Disclaimer } from '@/components/Disclaimer';
import { PairedComparison } from '@/components/PairedComparison';
import { PendingValue } from '@/components/PendingValue';
import { ProcessDiagram } from '@/components/ProcessDiagram';
import { ProcessStepList } from '@/components/ProcessStepList';
import { RiskTable } from '@/components/RiskTable';
import { StatFigure } from '@/components/StatFigure';
import type { ActFigure } from '@/content/acts/types';

export function ActBlock({ block }: { block: ActFigure }) {
  switch (block.kind) {
    case 'table':
      return <SimpleTable caption={block.caption} columns={block.columns} rows={block.rows} />;
    case 'paired':
      return (
        <PairedComparison
          caption={block.caption}
          left={pairedSide(block.left)}
          metricHeader={block.metricHeader}
          right={pairedSide(block.right)}
          rows={block.rows.map((row) => ({
            id: row.id,
            metric: row.metric,
            left: row.left,
            right: row.right,
          }))}
        />
      );
    case 'stat':
      return <StatFigure label={block.label} source={block.source} value={block.value} />;
    case 'risk-table':
      return (
        <RiskTable
          copy={block.copy}
          levels={block.levels}
          periods={block.periods}
          regions={block.regions}
        />
      );
    case 'process': {
      const filled = block.steps.map(() => 1);
      return (
        <>
          <h3>{block.title}</h3>
          <ProcessDiagram
            drawProgress={filled}
            fromLabel={block.fromLabel}
            orientation="vertical"
            stepGlow={filled}
            steps={block.steps}
            toLabel={block.toLabel}
          />
          <ProcessStepList stepLabel={block.stepLabel} steps={block.steps} />
          {block.notes.map((note) => (
            <p key={note}>{note}</p>
          ))}
        </>
      );
    }
    case 'image':
      return (
        <figure>
          <img alt={block.alt} src={block.src} />
          <figcaption>{block.caption}</figcaption>
        </figure>
      );
    case 'disclaimer':
      return <Disclaimer variant="inline" />;
    case 'pending':
      return (
        <p>
          <PendingValue debtId={block.debtId} label={block.label} />
          {block.note === undefined ? null : ` ${block.note}`}
        </p>
      );
    case 'list':
      return (
        <ul>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case 'glossary':
      return (
        <>
          <h3>{block.heading}</h3>
          <ul>
            {block.organisations.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
          <dl>
            {block.entries.map((entry) => (
              <div key={entry.id}>
                <dt>{entry.term}</dt>
                <dd>{entry.definition}</dd>
              </div>
            ))}
          </dl>
        </>
      );
  }
}

function pairedSide(side: { id: string; name: string; accentToken: string; detail?: string }) {
  return {
    id: side.id,
    name: side.name,
    accentToken: side.accentToken,
    ...(side.detail ? { detail: side.detail } : {}),
  };
}

function SimpleTable({
  caption,
  columns,
  rows,
}: {
  caption: string;
  columns: readonly string[];
  rows: readonly (readonly string[])[];
}) {
  return (
    <table>
      <caption>{caption}</caption>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column} scope="col">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row[0]}>
            {row.map((cell, index) =>
              index === 0 ? (
                <th key={cell} scope="row">
                  {cell}
                </th>
              ) : (
                <td key={`${row[0]}-${cell}`}>{cell}</td>
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

import { DefinitionTable, type DefinitionRow } from '@/components/DefinitionTable';
import { useViewport } from '@/motion/useViewport';

import './risk-table.css';

export interface RiskTableCopy {
  caption: string;
  regionHeader: string;
  projectionNote: string;
}

export interface RiskTablePeriod {
  id: string;
  shortLabel: string;
  isProjection?: boolean;
  regions: Readonly<Record<string, string | undefined>>;
}

export interface RiskTableRegion {
  id: string;
  label: string;
}

export interface RiskTableLevel {
  id: string;
  label: string;
}

function riskToDefinitionRows(
  periods: readonly RiskTablePeriod[],
  regions: readonly RiskTableRegion[],
  levels: readonly RiskTableLevel[],
  copy: RiskTableCopy,
): DefinitionRow[] {
  return regions.flatMap((region) =>
    periods.map((period) => {
      const level = period.regions[region.id];
      const meta = levels.find((entry) => entry.id === level);
      return {
        id: `${region.id}-${period.id}`,
        term: `${region.label} · ${period.shortLabel}`,
        description: meta?.label,
        ...(period.isProjection ? { note: copy.projectionNote } : {}),
      };
    }),
  );
}

export function RiskTable({
  periods,
  regions,
  levels,
  copy,
}: {
  periods: readonly RiskTablePeriod[];
  regions: readonly RiskTableRegion[];
  levels: readonly RiskTableLevel[];
  copy: RiskTableCopy;
}) {
  const { isMobile } = useViewport();
  if (isMobile) {
    return (
      <DefinitionTable
        caption={copy.caption}
        rows={riskToDefinitionRows(periods, regions, levels, copy)}
      />
    );
  }

  return (
    <details className="risk-table-disclosure">
      <summary className="risk-table-summary">
        <span>{copy.caption}</span>
        <span className="risk-table-summary__count">
          {String(regions.length)} regiones · {String(periods.length)} períodos
        </span>
      </summary>
      <div className="risk-table-scroll">
        <table className="risk-table">
          <caption>{copy.caption}</caption>
          <thead>
            <tr>
              <th scope="col">{copy.regionHeader}</th>
              {periods.map((period) => (
                <th key={period.id} scope="col">
                  {period.shortLabel}
                  {period.isProjection ? (
                    <span className="risk-table__projection"> {copy.projectionNote}</span>
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {regions.map((region) => (
              <tr key={region.id}>
                <th scope="row">{region.label}</th>
                {periods.map((period) => {
                  const level = period.regions[region.id];
                  const meta = levels.find((entry) => entry.id === level);
                  return <td key={period.id}>{meta?.label}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

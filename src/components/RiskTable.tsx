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
  return (
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
  );
}

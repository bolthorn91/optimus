export interface SimulatorContextRow {
  label: string;
  value: string;
}

export function SimulatorContext({
  notice,
  rows,
}: {
  notice: string;
  rows: readonly SimulatorContextRow[];
}) {
  return (
    <aside data-simulator-context>
      <p>{notice}</p>
      <dl>
        {rows.map((row) => (
          <div key={row.label}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

import type { ContactContextRow } from '@/lib/contact-form';

export function SimulatorContext({
  notice,
  rows,
}: {
  notice: string;
  rows: readonly ContactContextRow[];
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

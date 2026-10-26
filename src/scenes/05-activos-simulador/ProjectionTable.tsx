import { MOBILE_COPY } from '@/app/mobileCopy';
import { formatCurrency } from '@/lib/format';
import type { ProjectionYear } from '@/lib/projection';
import { useViewport } from '@/motion/useViewport';
import { ACT5 } from '@/scenes/05-activos-simulador/content';

export function ProjectionTable({ series }: { series: readonly ProjectionYear[] }) {
  const { isMobile } = useViewport();
  const table = (
    <table data-projection-table>
      <caption>{ACT5.copy.tableCaption}</caption>
      <thead>
        <tr>
          <th scope="col">{ACT5.copy.tableYear}</th>
          <th scope="col">{ACT5.copy.tableValue}</th>
          <th scope="col">{ACT5.copy.tableGain}</th>
          <th scope="col">{ACT5.copy.tableRent}</th>
        </tr>
      </thead>
      <tbody>
        {series.map((row) => (
          <tr data-year={String(row.year)} key={row.year}>
            <th scope="row">{row.year}</th>
            <td data-value={String(row.value)}>{formatCurrency(row.value, 'USD', 2)}</td>
            <td>{formatCurrency(row.gain, 'USD', 2)}</td>
            <td>{formatCurrency(row.rentalIncome, 'USD', 2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
  if (!isMobile) return table;
  return (
    <details data-year-table>
      <summary>{MOBILE_COPY.tableExpand}</summary>
      <div className="projection-table-scroll">{table}</div>
    </details>
  );
}

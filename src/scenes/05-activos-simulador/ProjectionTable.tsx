import { formatCurrency } from '@/lib/format';
import type { ProjectionYear } from '@/lib/projection';
import { ACT5 } from '@/scenes/05-activos-simulador/content';

export function ProjectionTable({ series }: { series: readonly ProjectionYear[] }) {
  return (
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
}

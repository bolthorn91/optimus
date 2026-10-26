import { MOBILE_COPY } from '@/app/mobileCopy';
import { formatCurrency } from '@/lib/format';
import type { ProjectionYear } from '@/lib/projection';
import { ACT5 } from '@/scenes/05-activos-simulador/content';

/**
 * La tabla completa no debe ocupar media página: se presenta plegada y, al abrirla,
 * el cuerpo queda acotado con scroll propio. Así el simulador, la tabla y el CTA
 * caben en el mismo recorrido sin que el detalle anual empuje el resto fuera de vista.
 */
export function ProjectionTable({ series }: { series: readonly ProjectionYear[] }) {
  const lastYear = series[series.length - 1]?.year;

  return (
    <details data-year-table>
      <summary>
        <span>{MOBILE_COPY.tableExpand}</span>
        <span className="projection-table__count">{series.length} años</span>
      </summary>
      <div
        aria-label={ACT5.copy.tableCaption}
        className="projection-table-scroll"
        role="region"
        // El contenedor con scroll propio necesita ser alcanzable con Tab; la regla de
        // jsx-a11y no contempla los regiones desplazables (WCAG 2.2 2.1.1).
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
      >
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
              <tr
                data-current={row.year === lastYear ? 'true' : undefined}
                data-year={String(row.year)}
                key={row.year}
              >
                <th scope="row">{row.year}</th>
                <td data-value={String(row.value)}>{formatCurrency(row.value, 'USD', 2)}</td>
                <td>{formatCurrency(row.gain, 'USD', 2)}</td>
                <td>{formatCurrency(row.rentalIncome, 'USD', 2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

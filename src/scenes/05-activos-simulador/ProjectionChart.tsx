import type { ProjectionYear } from '@/lib/projection';

const WIDTH = 320;
const HEIGHT = 120;
const PAD = 8;

export function ProjectionChart({
  series,
  highlightYear,
}: {
  series: readonly ProjectionYear[];
  highlightYear?: number | undefined;
}) {
  const values = series.map((row) => row.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(max - min, 1);
  const lastIndex = Math.max(series.length - 1, 1);

  const points = series.map((row, index) => {
    const x = PAD + (index / lastIndex) * (WIDTH - PAD * 2);
    const y = HEIGHT - PAD - ((row.value - min) / span) * (HEIGHT - PAD * 2);
    return { x, y, year: row.year, value: row.value };
  });
  const polyline = points.map((point) => `${String(point.x)},${String(point.y)}`).join(' ');
  const highlight = points.find((point) => point.year === highlightYear);

  return (
    <svg
      aria-hidden="true"
      data-projection-chart
      fill="none"
      viewBox={`0 0 ${String(WIDTH)} ${String(HEIGHT)}`}
    >
      <polyline points={polyline} stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
      {points.map((point) => (
        <circle
          cx={point.x}
          cy={point.y}
          data-value={String(point.value)}
          data-year={String(point.year)}
          fill="currentColor"
          key={point.year}
          r="2"
        />
      ))}
      {highlight ? <circle cx={highlight.x} cy={highlight.y} fill="currentColor" r="4" /> : null}
    </svg>
  );
}

import { CountUp } from '@/components/CountUp';
import { StatFigure } from '@/components/StatFigure';
import { formatArea } from '@/lib/format';

export function AnchorStat({
  hectares,
  equivalence,
  progress,
  label,
  source,
}: {
  hectares: number;
  equivalence: string;
  progress?: number;
  label: string;
  source: string;
}) {
  return (
    <StatFigure
      label={`${label} — ${equivalence}`}
      source={source}
      value={
        <CountUp
          format={(value) => formatArea(value, 'ha')}
          {...(progress === undefined ? {} : { progress })}
          to={hectares}
        />
      }
    />
  );
}

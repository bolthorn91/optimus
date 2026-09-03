import type { PeriodIndex, RiskSeries } from '@/scenes/02-seguridad-global/risk-data';

export type { PeriodIndex };

const INDICES: readonly PeriodIndex[] = [0, 1, 2, 3];

export function PeriodSelector({
  periods,
  activeIndex,
  onSelect,
  label,
}: {
  periods: RiskSeries;
  activeIndex: PeriodIndex;
  onSelect: (index: PeriodIndex) => void;
  label: string;
}) {
  return (
    <div aria-label={label} className="period-selector" data-period-selector role="group">
      {INDICES.map((index) => (
        <button
          aria-pressed={index === activeIndex}
          key={periods[index].id}
          onClick={() => {
            onSelect(index);
          }}
          type="button"
        >
          {periods[index].shortLabel}
        </button>
      ))}
    </div>
  );
}

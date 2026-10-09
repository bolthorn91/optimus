import { RangeInput } from '@/scenes/05-activos-simulador/RangeInput';

export function CapitalSlider({
  value,
  min,
  max,
  step,
  onChange,
  label,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  label: string;
}) {
  return (
    <div data-capital-slider>
      <RangeInput
        id="simulator-capital"
        label={label}
        max={max}
        min={min}
        onChange={onChange}
        step={step}
        value={value}
      />
    </div>
  );
}

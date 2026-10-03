import { RangeInput } from '@/scenes/05-activos-simulador/RangeInput';

export function HorizonSlider({
  value,
  min,
  max,
  onChange,
  label,
  unit,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  label: string;
  unit: string;
}) {
  return (
    <div data-horizon-slider>
      <RangeInput
        id="simulator-horizon"
        label={label}
        max={max}
        min={min}
        onChange={onChange}
        step={1}
        unit={unit}
        value={value}
      />
    </div>
  );
}

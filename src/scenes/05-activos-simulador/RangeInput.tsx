import type { KeyboardEvent } from 'react';

import { applySliderKey, clamp } from '@/scenes/05-activos-simulador/sliderKeys';

export function RangeInput({
  id,
  label,
  value,
  min,
  max,
  step,
  onChange,
  unit,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  unit?: string;
}) {
  function onKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    const next = applySliderKey(event.key, value, min, max, step);
    if (next === null) return;
    event.preventDefault();
    onChange(next);
  }

  return (
    <>
      <label htmlFor={id}>{unit ? `${label} (${unit})` : label}</label>
      <input
        aria-valuemax={max}
        aria-valuemin={min}
        aria-valuenow={value}
        id={id}
        max={max}
        min={min}
        onChange={(event) => {
          onChange(clamp(Number(event.target.value), min, max));
        }}
        onKeyDown={onKeyDown}
        step={step}
        type="range"
        value={value}
      />
    </>
  );
}

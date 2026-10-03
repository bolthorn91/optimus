import { useEffect, useRef, useState } from 'react';

import { RangeInput } from '@/scenes/05-activos-simulador/RangeInput';
import { clamp } from '@/scenes/05-activos-simulador/sliderKeys';

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
  const [draft, setDraft] = useState(String(value));
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) setDraft(String(value));
  }, [value]);

  function commit(raw: string): void {
    const parsed = Number(raw);
    const next = Number.isFinite(parsed) && parsed > 0 ? clamp(parsed, min, max) : value;
    onChange(next);
    setDraft(String(next));
  }

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
      <input
        aria-label={label}
        max={max}
        min={min}
        onBlur={() => {
          focused.current = false;
          commit(draft);
        }}
        onChange={(event) => {
          const raw = event.target.value;
          setDraft(raw);
          const parsed = Number(raw);
          if (Number.isFinite(parsed) && parsed >= min && parsed <= max) {
            onChange(parsed);
          }
        }}
        onFocus={() => {
          focused.current = true;
        }}
        step={step}
        type="number"
        value={draft}
      />
    </div>
  );
}

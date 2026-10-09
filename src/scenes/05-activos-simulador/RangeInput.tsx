import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';

import { applySliderKey, clamp } from '@/scenes/05-activos-simulador/sliderKeys';

import './range-input.css';

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
  const dragging = useRef(false);
  const focused = useRef(false);
  const [draft, setDraft] = useState(String(value));
  const caption = unit ? `${label} (${unit})` : label;

  useEffect(() => {
    if (!focused.current) setDraft(String(value));
  }, [value]);

  useEffect(
    () => () => {
      if (dragging.current) unlockSliderGesture();
    },
    [],
  );

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    const next = applySliderKey(event.key, value, min, max, step);
    if (next === null) return;
    event.preventDefault();
    onChange(next);
  }

  function onPointerDown(event: PointerEvent<HTMLInputElement>): void {
    dragging.current = true;
    if (typeof event.currentTarget.setPointerCapture === 'function') {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    lockSliderGesture();
  }

  function onPointerUp(): void {
    if (!dragging.current) return;
    dragging.current = false;
    unlockSliderGesture();
  }

  function commit(raw: string): void {
    const parsed = Number(raw);
    const next = Number.isFinite(parsed) && parsed > 0 ? clamp(parsed, min, max) : value;
    onChange(next);
    setDraft(String(next));
  }

  return (
    <>
      <label htmlFor={id}>{caption}</label>
      <input
        aria-valuemax={max}
        aria-valuemin={min}
        aria-valuenow={value}
        className="range-input__range"
        id={id}
        max={max}
        min={min}
        onChange={(event) => {
          onChange(clamp(Number(event.target.value), min, max));
        }}
        onKeyDown={onKeyDown}
        onPointerCancel={onPointerUp}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        step={step}
        type="range"
        value={value}
      />
      <input
        aria-label={caption}
        className="range-input__numeric"
        inputMode="numeric"
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
    </>
  );
}

function lockSliderGesture(): void {
  document.documentElement.dataset.sliderGesture = 'lock';
}

function unlockSliderGesture(): void {
  delete document.documentElement.dataset.sliderGesture;
}

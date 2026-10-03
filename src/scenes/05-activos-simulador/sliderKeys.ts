export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function applySliderKey(
  key: string,
  value: number,
  min: number,
  max: number,
  step: number,
): number | null {
  switch (key) {
    case 'ArrowRight':
    case 'ArrowUp':
      return Math.min(max, value + step);
    case 'ArrowLeft':
    case 'ArrowDown':
      return Math.max(min, value - step);
    case 'PageUp':
      return Math.min(max, value + step * 5);
    case 'PageDown':
      return Math.max(min, value - step * 5);
    case 'Home':
      return min;
    case 'End':
      return max;
    default:
      return null;
  }
}

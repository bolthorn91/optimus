export function stepVisual(
  count: number,
  activeIndex: number,
): { drawProgress: number[]; stepGlow: number[] } {
  const last = Math.max(count - 1, 0);
  const active = Math.min(Math.max(activeIndex, 0), last);
  return {
    drawProgress: Array.from({ length: count }, (_, index) => (index <= active ? 1 : 0)),
    stepGlow: Array.from({ length: count }, (_, index) =>
      index === active ? 1 : index < active ? 0.35 : 0,
    ),
  };
}

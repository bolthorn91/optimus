import { describe, expect, it } from 'vitest';

import { stepVisual } from '@/scenes/04-marco-legal/stepVisual';

describe('stepVisual', () => {
  it('traza los pasos anteriores y deja un único nodo a glow 1', () => {
    const mid = stepVisual(5, 2);
    expect(mid.drawProgress).toEqual([1, 1, 1, 0, 0]);
    expect(mid.stepGlow.filter((value) => value === 1)).toHaveLength(1);
    expect(mid.stepGlow[2]).toBe(1);
    expect(mid.stepGlow[1]).toBe(0.35);
    expect(mid.stepGlow[3]).toBe(0);
  });

  it('acota el índice activo', () => {
    expect(stepVisual(5, 99).drawProgress).toEqual([1, 1, 1, 1, 1]);
    expect(stepVisual(5, -1).drawProgress).toEqual([1, 0, 0, 0, 0]);
  });
});

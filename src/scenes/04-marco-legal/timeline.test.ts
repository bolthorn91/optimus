import { describe, expect, it } from 'vitest';

import { choreographAct4 } from '@/scenes/04-marco-legal/timeline';

describe('choreographAct4', () => {
  it('CDI-01 · los cinco pasos activos en orden, uno por tramo', () => {
    const samples = [0.34, 0.42, 0.5, 0.58, 0.66] as const;
    samples.forEach((progress, index) => {
      const state = choreographAct4(progress);
      expect(state.pasoActivo).toBe(index);
      expect(state.stepGlow[index]).toBe(1);
    });
  });

  it('CDI-02 · cdiProgress 1 acota pasoActivo a 4', () => {
    const atEnd = choreographAct4(0.72);
    expect(atEnd.pasoActivo).toBe(4);
    expect(atEnd.drawProgress[4]).toBe(1);
    expect(choreographAct4(1).pasoActivo).toBe(4);
    expect(choreographAct4(1).pasoActivo).toBeLessThan(5);
  });

  it('CDI-03 · exactamente un paso con stepGlow 1 en el tramo del diagrama', () => {
    for (let i = 0; i <= 40; i += 1) {
      const progress = 0.34 + (0.38 * i) / 40;
      const lit = choreographAct4(progress).stepGlow.filter((glow) => glow === 1);
      expect(lit).toHaveLength(1);
    }
  });

  it('las garantías entran escalonadas entre 0.74 y 0.92', () => {
    expect(choreographAct4(0.73).guaranteeProgress).toEqual([0, 0, 0, 0]);
    for (let g = 0; g < 4; g += 1) {
      const start = 0.74 + g * 0.045;
      const atStart = choreographAct4(start).guaranteeProgress;
      expect(atStart[g]).toBe(0);
      for (let earlier = 0; earlier < g; earlier += 1) {
        expect(atStart[earlier] ?? 0).toBeGreaterThan(0);
      }
      expect(choreographAct4(start + 0.09).guaranteeProgress[g]).toBe(1);
    }
    expect(choreographAct4(1).guaranteeProgress).toEqual([1, 1, 1, 1]);
  });

  it('CDI-04 · drawProgress es monótona no decreciente; un paso trazado no se destraza', () => {
    const previous = [0, 0, 0, 0, 0];
    for (let i = 0; i <= 40; i += 1) {
      const progress = 0.34 + (0.38 * i) / 40;
      const { drawProgress } = choreographAct4(progress);
      drawProgress.forEach((value, index) => {
        expect(value + 1e-9).toBeGreaterThanOrEqual(previous[index] ?? 0);
        previous[index] = value;
      });
    }
  });
});

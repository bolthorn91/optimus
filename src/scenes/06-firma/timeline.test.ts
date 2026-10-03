import { describe, expect, it } from 'vitest';

import { easeInOut } from '@/lib/interpolate';
import { choreographAct67 } from '@/scenes/06-firma/timeline';

describe('choreographAct67', () => {
  it('FIR-01 · estados exactos en 0, 0.27, 0.48, 0.68, 0.86 y 1', () => {
    expect(choreographAct67(0)).toEqual({
      firmOpacity: 0,
      founderProgress: 0,
      quoteOpacity: 0,
      conventionalDraw: 0,
      optimvsDraw: 0,
      deptProgress: [0, 0, 0],
      routesProgress: 0,
      handoff: 0,
      surfaceMix: 0,
    });

    const atFounder = choreographAct67(0.27);
    expect(atFounder.firmOpacity).toBe(0);
    expect(atFounder.founderProgress).toBeCloseTo(0.5);
    expect(atFounder.quoteOpacity).toBe(0);
    expect(atFounder.conventionalDraw).toBe(0);
    expect(atFounder.optimvsDraw).toBe(0);
    expect(atFounder.deptProgress).toEqual([0, 0, 0]);
    expect(atFounder.routesProgress).toBe(0);
    expect(atFounder.handoff).toBe(0);
    expect(atFounder.surfaceMix).toBe(easeInOut(0.27));

    const atChainHandoff = choreographAct67(0.48);
    expect(atChainHandoff.founderProgress).toBe(1);
    expect(atChainHandoff.quoteOpacity).toBe(1);
    expect(atChainHandoff.conventionalDraw).toBe(1);
    expect(atChainHandoff.optimvsDraw).toBe(0);
    expect(atChainHandoff.deptProgress).toEqual([0, 0, 0]);
    expect(atChainHandoff.routesProgress).toBe(0);

    const atDepts = choreographAct67(0.68);
    expect(atDepts.conventionalDraw).toBe(1);
    expect(atDepts.optimvsDraw).toBe(1);
    expect(atDepts.deptProgress[0]).toBeCloseTo(0.8);
    expect(atDepts.deptProgress[1]).toBeCloseTo(0.3);
    expect(atDepts.deptProgress[2]).toBe(0);
    expect(atDepts.routesProgress).toBe(0);

    const atRoutes = choreographAct67(0.86);
    expect(atRoutes.deptProgress).toEqual([1, 1, 1]);
    expect(atRoutes.routesProgress).toBeCloseTo(0.5);
    expect(atRoutes.handoff).toBe(0);

    expect(choreographAct67(1)).toEqual({
      firmOpacity: 0,
      founderProgress: 1,
      quoteOpacity: 1,
      conventionalDraw: 1,
      optimvsDraw: 1,
      deptProgress: [1, 1, 1],
      routesProgress: 1,
      handoff: 1,
      surfaceMix: 1,
    });
  });

  it('FIR-02 · la cadena convencional se traza entera antes de que empiece la de OPTIMVS', () => {
    expect(choreographAct67(0.48).conventionalDraw).toBe(1);
    expect(choreographAct67(0.48).optimvsDraw).toBe(0);
    for (let i = 0; i <= 40; i += 1) {
      const state = choreographAct67(i / 40);
      if (state.optimvsDraw > 0) {
        expect(state.conventionalDraw).toBe(1);
      }
    }
  });
});

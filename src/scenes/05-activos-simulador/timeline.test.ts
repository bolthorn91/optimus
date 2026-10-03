import { describe, expect, it } from 'vitest';

import { HORIZON_DEFAULT, HORIZON_MAX, HORIZON_MIN } from '@/lib/projection-assumptions';
import {
  AUTO_HORIZON_DURATION,
  AUTO_HORIZON_START,
  choreographAct5,
} from '@/scenes/05-activos-simulador/timeline';

describe('choreographAct5', () => {
  it('antes del tramo automático el horizonte no avanza', () => {
    const state = choreographAct5(0);
    expect(state.autoHorizon).toBe(false);
    expect(state.yearsFromScroll).toBe(HORIZON_DEFAULT);
  });

  it('durante el tramo el horizonte crece desde el reposo hacia 15', () => {
    const mid = choreographAct5(AUTO_HORIZON_START + AUTO_HORIZON_DURATION / 2);
    expect(mid.autoHorizon).toBe(true);
    expect(mid.yearsFromScroll).toBeGreaterThan(HORIZON_DEFAULT);
    expect(mid.yearsFromScroll).toBeLessThan(HORIZON_MAX);
  });

  it('al cerrar el tramo el horizonte queda en 15 y el scroll sigue mandando', () => {
    const end = choreographAct5(AUTO_HORIZON_START + AUTO_HORIZON_DURATION);
    expect(end.autoHorizon).toBe(true);
    expect(end.yearsFromScroll).toBe(HORIZON_MAX);
    expect(choreographAct5(1).autoHorizon).toBe(true);
    expect(choreographAct5(1).yearsFromScroll).toBe(HORIZON_MAX);
  });

  it('el horizonte del tramo es un entero entre el mínimo y 15', () => {
    for (let i = 0; i <= 20; i += 1) {
      const state = choreographAct5(i / 20);
      expect(Number.isInteger(state.yearsFromScroll)).toBe(true);
      expect(state.yearsFromScroll).toBeGreaterThanOrEqual(HORIZON_MIN);
      expect(state.yearsFromScroll).toBeLessThanOrEqual(HORIZON_MAX);
    }
  });
});

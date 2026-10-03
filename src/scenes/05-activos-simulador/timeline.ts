import { clamp01, ramp } from '@/lib/interpolate';
import { HORIZON_DEFAULT, HORIZON_MAX } from '@/lib/projection-assumptions';

/** 0.12–0.60  el horizonte avanza solo desde el reposo; t≥1 deja el valor en 15 (S10). */
export const AUTO_HORIZON_START = 0.12;
export const AUTO_HORIZON_DURATION = 0.48;

export interface Act5State {
  yearsFromScroll: number;
  autoHorizon: boolean;
}

export function choreographAct5(progress: number): Act5State {
  const p = clamp01(progress);
  const t = ramp(p, AUTO_HORIZON_START, AUTO_HORIZON_DURATION);
  const span = HORIZON_MAX - HORIZON_DEFAULT;
  return {
    yearsFromScroll: HORIZON_DEFAULT + Math.round(t * span),
    autoHorizon: t > 0,
  };
}

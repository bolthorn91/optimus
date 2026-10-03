import { clamp01, ramp } from '@/lib/interpolate';

export interface ActContactState {
  /** 1 at arrival, 0 once settled. Content stays readable (I4). */
  rise: number;
}

export function choreographActContact(progress: number): ActContactState {
  const p = clamp01(progress);
  return { rise: 1 - ramp(p, 0, 0.6) };
}

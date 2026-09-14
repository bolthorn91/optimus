import { clamp01, easeOut, lerp } from '@/lib/interpolate';

export interface HeroIntroState {
  logoOpacity: number;
  logoY: number;
  lineOpacity: number[];
  lineY: number[];
  lineBlur: number[];
  claimOpacity: number;
  ctaOpacity: number;
  hintOpacity: number;
}

/** Coreografía de entrada del hero. `t` es tiempo 0→1, no progreso de scroll (F4). */
export function choreographIntro(t: number, lineCount = 3): HeroIntroState {
  const p = clamp01(t);
  const logoP = easeOut(clamp01(p / 0.3));
  const lineOpacity: number[] = [];
  const lineY: number[] = [];
  const lineBlur: number[] = [];

  for (let i = 0; i < lineCount; i += 1) {
    const start = 0.15 + i * 0.1;
    const local = clamp01((p - start) / 0.35);
    const eased = easeOut(local);
    lineOpacity.push(local);
    lineY.push(lerp(32, 0, eased));
    lineBlur.push(lerp(8, 0, eased));
  }

  return {
    logoOpacity: clamp01(p / 0.3),
    logoY: lerp(24, 0, logoP),
    lineOpacity,
    lineY,
    lineBlur,
    claimOpacity: clamp01((p - 0.55) / 0.3),
    ctaOpacity: clamp01((p - 0.7) / 0.3),
    hintOpacity: clamp01((p - 0.85) / 0.15),
  };
}

import { clamp01, easeInOut, lerp, peakWindow, ramp } from '@/lib/interpolate';

export interface Act1State {
  introOpacity: number;
  introY: number;
  factorOpacity: [number, number, number];
  factorProgress: [number, number, number];
  factorY: [number, number, number];
  statProgress: number;
  closingOpacity: number;
  surfaceMix: number;
}

export function choreographAct1(progress: number): Act1State {
  const p = clamp01(progress);
  const introExit = clamp01((p - 0.12) / 0.05);
  const factorOpacity: [number, number, number] = [0, 0, 0];
  const factorProgress: [number, number, number] = [0, 0, 0];
  const factorY: [number, number, number] = [0, 0, 0];

  for (let i = 0; i < 3; i += 1) {
    const start = 0.18 + i * 0.26;
    const end = start + 0.26;
    const local = clamp01((p - start) / (end - start));
    factorOpacity[i] = peakWindow(local, 0.15, 0.85);
    factorProgress[i] = local;
    factorY[i] = lerp(28, -28, local);
  }

  return {
    introOpacity: 1,
    introY: lerp(0, -40, introExit),
    factorOpacity,
    factorProgress,
    factorY,
    statProgress: ramp(p, 0.88, 0.08),
    closingOpacity: ramp(p, 0.92, 0.08),
    surfaceMix: easeInOut(p),
  };
}

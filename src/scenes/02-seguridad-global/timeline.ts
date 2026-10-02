import { clamp01, easeInOut, lerp, peakWindow } from '@/lib/interpolate';
import { RISK_PERIODS, type PeriodIndex } from '@/scenes/02-seguridad-global/risk-data';

export interface Act2State {
  introOpacity: number;
  layerOpacity: readonly [number, number, number, number];
  periodoActivo: PeriodIndex;
  year: number;
  blend: number;
  southAmericaGlow: number;
  climateOpacity: number;
  quoteOpacity: number;
  surfaceMix: number;
}

export function progressForPeriod(index: PeriodIndex): number {
  return 0.12 + 0.6 * (index / 3);
}

export function choreographAct2(progress: number): Act2State {
  const p = clamp01(progress);
  const mapProgress = clamp01((p - 0.12) / 0.6);
  const indice = mapProgress * 3;
  const from = Math.min(3, Math.max(0, Math.floor(indice))) as PeriodIndex;
  const to = Math.min(from + 1, 3) as PeriodIndex;
  const blend = indice - from;
  const periodoActivo: PeriodIndex = blend < 0.5 ? from : to;

  const layerOpacity: [number, number, number, number] = [0, 0, 0, 0];
  if (from === to) {
    layerOpacity[from] = 1;
  } else {
    const fromOpacity = 1 - blend;
    layerOpacity[from] = fromOpacity;
    layerOpacity[to] = 1 - fromOpacity;
  }

  return {
    introOpacity: peakWindow(clamp01(p / 0.12), 0.3, 0.8),
    layerOpacity,
    periodoActivo,
    year: RISK_PERIODS[periodoActivo].year,
    blend,
    southAmericaGlow: easeInOut(mapProgress),
    climateOpacity: peakWindow(clamp01((p - 0.74) / 0.14), 0.2, 0.85),
    quoteOpacity: clamp01((p - 0.9) / 0.1),
    surfaceMix: easeInOut(p),
  };
}

export function stateForPeriod(index: PeriodIndex): Act2State {
  return choreographAct2(progressForPeriod(index));
}

export function crossfade(from: PeriodIndex, to: PeriodIndex, t: number): Act2State {
  const dest = stateForPeriod(to);
  if (from === to) return dest;
  const origin = stateForPeriod(from);
  const p = clamp01(t);
  const fromOpacity = 1 - p;
  const layerOpacity: [number, number, number, number] = [0, 0, 0, 0];
  layerOpacity[from] = fromOpacity;
  layerOpacity[to] = 1 - fromOpacity;
  return {
    ...dest,
    layerOpacity,
    southAmericaGlow: lerp(origin.southAmericaGlow, dest.southAmericaGlow, p),
    introOpacity: lerp(origin.introOpacity, dest.introOpacity, p),
    climateOpacity: lerp(origin.climateOpacity, dest.climateOpacity, p),
    quoteOpacity: lerp(origin.quoteOpacity, dest.quoteOpacity, p),
    surfaceMix: lerp(origin.surfaceMix, dest.surfaceMix, p),
    blend: p,
  };
}

import { clamp01, easeInOut, peakWindow, ramp } from '@/lib/interpolate';

export type Act4Chrome = 'navy' | 'ivory';

export interface Act4State {
  introOpacity: number;
  anchorProgress: number;
  drawProgress: readonly [number, number, number, number, number];
  stepGlow: readonly [number, number, number, number, number];
  pasoActivo: 0 | 1 | 2 | 3 | 4;
  guaranteeProgress: readonly [number, number, number, number];
  closingOpacity: number;
  surfaceMix: number;
  chrome: Act4Chrome;
}

const CDI_START = 0.34;
const CDI_DURATION = 0.38;
const CDI_STEPS = 5;
const LAST_STEP = CDI_STEPS - 1;

/** Progreso de escena al final del paso `index` (0..4), para el selector. */
export function progressForStep(index: number): number {
  const i = Math.min(Math.max(index, 0), LAST_STEP);
  if (i === LAST_STEP) return CDI_START + CDI_DURATION;
  return CDI_START + ((i + 1) / CDI_STEPS) * CDI_DURATION - 1e-6;
}

export function choreographAct4(progress: number): Act4State {
  const p = clamp01(progress);
  // 0.34–0.72  el diagrama del CDI: cinco pasos en cinco tramos iguales
  const cdiProgress = ramp(p, CDI_START, CDI_DURATION);
  const pasoContinuo = cdiProgress * CDI_STEPS;
  const pasoActivo = Math.min(Math.floor(pasoContinuo), LAST_STEP) as 0 | 1 | 2 | 3 | 4;
  const pasoLocal = pasoContinuo - pasoActivo;

  const drawProgress: [number, number, number, number, number] = [0, 0, 0, 0, 0];
  const stepGlow: [number, number, number, number, number] = [0, 0, 0, 0, 0];
  for (let i = 0; i < CDI_STEPS; i += 1) {
    if (i < pasoActivo) {
      drawProgress[i] = 1;
      stepGlow[i] = 0.35;
    } else if (i === pasoActivo) {
      drawProgress[i] = pasoLocal;
      stepGlow[i] = 1;
    }
  }

  const guaranteeProgress: [number, number, number, number] = [0, 0, 0, 0];
  for (let g = 0; g < 4; g += 1) {
    // 0.74–0.92  las cuatro garantías, escalonadas
    guaranteeProgress[g] = ramp(p, 0.74 + g * 0.045, 0.09);
  }

  const surfaceMix = easeInOut(p);

  return {
    // 0.00–0.14  entradilla
    introOpacity: peakWindow(clamp01(p / 0.14), 0.25, 0.85),
    // 0.16–0.30  dato ancla
    anchorProgress: ramp(p, 0.16, 0.14),
    drawProgress,
    stepGlow,
    pasoActivo,
    guaranteeProgress,
    // 0.94–1.00  aclaración y CTA
    closingOpacity: ramp(p, 0.94, 0.06),
    surfaceMix,
    chrome: surfaceMix >= 0.5 ? 'ivory' : 'navy',
  };
}

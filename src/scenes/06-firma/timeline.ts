import { clamp01, easeInOut, peakWindow, ramp } from '@/lib/interpolate';

export interface Act67State {
  firmOpacity: number;
  founderProgress: number;
  quoteOpacity: number;
  conventionalDraw: number;
  optimvsDraw: number;
  deptProgress: readonly [number, number, number];
  routesProgress: number;
  handoff: number;
  surfaceMix: number;
}

export const PIN_END = '+=500vh';

export function choreographAct67(progress: number): Act67State {
  const p = clamp01(progress);

  // 0.00–0.16  la firma y su posicionamiento
  const firmOpacity = peakWindow(clamp01(p / 0.16), 0.25, 0.85);
  // 0.18–0.36  el fundador
  const founderProgress = ramp(p, 0.18, 0.18);
  // 0.30–0.36  la cita
  const quoteOpacity = ramp(p, 0.3, 0.06);
  // 0.38–0.48  cadena convencional; 0.48–0.58 cadena OPTIMVS
  const conventionalDraw = ramp(p, 0.38, 0.1);
  const optimvsDraw = ramp(p, 0.48, 0.1);
  // 0.60–0.76  los tres departamentos, escalonados
  const deptProgress = [ramp(p, 0.6, 0.1), ramp(p, 0.65, 0.1), ramp(p, 0.7, 0.1)] as const;
  // 0.78–0.94  las dos vías
  const routesProgress = ramp(p, 0.78, 0.16);
  // 0.96–1.00  transicion al bloque de contacto
  const handoff = ramp(p, 0.96, 0.04);

  return {
    firmOpacity,
    founderProgress,
    quoteOpacity,
    conventionalDraw,
    optimvsDraw,
    deptProgress,
    routesProgress,
    handoff,
    surfaceMix: easeInOut(p),
  };
}

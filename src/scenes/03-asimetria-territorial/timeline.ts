import { clamp01, lerp, ramp, smoothstep } from '@/lib/interpolate';
import type { CountryId } from '@/scenes/03-asimetria-territorial/content';

export interface CountryNight {
  nightAmount: number;
  terminatorX: number;
  cityGlow: number;
}

export type Act3Chrome = 'day' | 'night' | 'released';

export interface Act3State {
  nightAmount: Record<CountryId, number>;
  terminatorX: Record<CountryId, number>;
  cityGlow: Record<CountryId, number>;
  areaProgress: number;
  popProgress: number;
  densityProgress: number;
  nightRelease: number;
  chrome: Act3Chrome;
  /** max(es, ar) para el cielo y el par M8. */
  skyNight: number;
}

const OFFSET: Record<CountryId, number> = { es: 0, ar: 0.18 };

function countryNight(sweep: number, country: CountryId): CountryNight {
  const local = ramp(sweep, OFFSET[country], 1 - OFFSET[country]);
  return {
    nightAmount: smoothstep(0, 1, local),
    terminatorX: lerp(1.15, -0.15, local),
    cityGlow: smoothstep(0.25, 0.9, local),
  };
}

export function choreographAct3(progress: number): Act3State {
  const p = clamp01(progress);
  // 0.10–0.62  el terminador barre; España entra en la noche antes que Argentina
  const sweep = ramp(p, 0.1, 0.52);
  const es = countryNight(sweep, 'es');
  const ar = countryNight(sweep, 'ar');

  const nightRelease = ramp(p, 0.82, 0.18);
  const skyNight = Math.max(es.nightAmount, ar.nightAmount);
  const chrome: Act3Chrome = nightRelease >= 1 ? 'released' : skyNight < 0.4 ? 'day' : 'night';

  return {
    nightAmount: { es: es.nightAmount, ar: ar.nightAmount },
    terminatorX: { es: es.terminatorX, ar: ar.terminatorX },
    cityGlow: { es: es.cityGlow, ar: ar.cityGlow },
    // 0.16–0.40  superficie; 0.34–0.58  población
    areaProgress: ramp(p, 0.16, 0.24),
    popProgress: ramp(p, 0.34, 0.24),
    // 0.66–0.80  densidad, revelación final
    densityProgress: ramp(p, 0.66, 0.14),
    // 0.82–1.00  se recupera el fondo del sistema
    nightRelease,
    chrome,
    skyNight,
  };
}

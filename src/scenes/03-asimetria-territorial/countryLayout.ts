import { clamp01 } from '@/lib/interpolate';
import type { CountryId } from '@/scenes/03-asimetria-territorial/content';

/** Proporciones de las texturas-silueta; el área de Argentina es exactamente 5,5× (F2). */
const SPAIN_WIDTH = 1;
const SPAIN_HEIGHT = 384 / 512;
const ARGENTINA_ASPECT = 480 / 840;
export const AREA_RATIO_AR_TO_ES = 5.5;
const ARGENTINA_AREA = AREA_RATIO_AR_TO_ES * SPAIN_WIDTH * SPAIN_HEIGHT;
const ARGENTINA_WIDTH = Math.sqrt(ARGENTINA_AREA * ARGENTINA_ASPECT);
const ARGENTINA_HEIGHT = ARGENTINA_AREA / ARGENTINA_WIDTH;

export interface CountryMesh {
  width: number;
  height: number;
  x: number;
  y: number;
}

export const COUNTRY_MESH: Record<CountryId, CountryMesh> = {
  es: { width: SPAIN_WIDTH, height: SPAIN_HEIGHT, x: -1.15, y: 0 },
  ar: { width: ARGENTINA_WIDTH, height: ARGENTINA_HEIGHT, x: 0.95, y: 0 },
};

export function meshArea(id: CountryId): number {
  const mesh = COUNTRY_MESH[id];
  return mesh.width * mesh.height;
}

/** Cajas geográficas del país. Se proyectan sobre `LAND_UV`, no sobre el plano entero. */
export const COUNTRY_BOUNDS: Record<
  CountryId,
  { latMin: number; latMax: number; lonMin: number; lonMax: number }
> = {
  es: { latMin: 35.95, latMax: 43.79, lonMin: -9.3, lonMax: 3.32 },
  ar: { latMin: -55.05, latMax: -21.78, lonMin: -73.58, lonMax: -53.59 },
};

/** Bbox de texels opacos de las siluetas nocturnas (v = 0 al sur, flipY de three). */
export const LAND_UV: Record<
  CountryId,
  { minU: number; maxU: number; minV: number; maxV: number }
> = {
  es: { minU: 0.059, maxU: 0.955, minV: 0.029, maxV: 0.977 },
  ar: { minU: 0.042, maxU: 0.846, minV: 0.001, maxV: 0.985 },
};

export function lonLatToUv(country: CountryId, lat: number, lon: number): { u: number; v: number } {
  const bounds = COUNTRY_BOUNDS[country];
  const land = LAND_UV[country];
  const geoU = (lon - bounds.lonMin) / (bounds.lonMax - bounds.lonMin);
  const geoV = (lat - bounds.latMin) / (bounds.latMax - bounds.latMin);
  return {
    u: land.minU + geoU * (land.maxU - land.minU),
    v: land.minV + geoV * (land.maxV - land.minV),
  };
}

export function lonLatToLocal(
  country: CountryId,
  lat: number,
  lon: number,
): { x: number; y: number } {
  const mesh = COUNTRY_MESH[country];
  const { u, v } = lonLatToUv(country, lat, lon);
  return {
    x: (u - 0.5) * mesh.width,
    y: (v - 0.5) * mesh.height,
  };
}

/** Ciudades de más peso se encienden antes: el retardo es (1 − weight). */
export function cityIntensity(glow: number, weight: number): number {
  const delay = (1 - weight) * 0.4;
  const span = 1 - delay;
  if (span <= 0) return glow >= 1 ? weight : 0;
  return weight * clamp01((glow - delay) / span);
}

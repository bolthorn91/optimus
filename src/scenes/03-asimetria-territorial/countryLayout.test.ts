import { describe, expect, it } from 'vitest';

import { CITY_LIGHTS } from '@/scenes/03-asimetria-territorial/cities';
import {
  AREA_RATIO_AR_TO_ES,
  cityIntensity,
  COUNTRY_MESH,
  LAND_UV,
  lonLatToLocal,
  lonLatToUv,
  meshArea,
} from '@/scenes/03-asimetria-territorial/countryLayout';

describe('countryLayout', () => {
  it('Argentina ocupa 5,5 veces la superficie de España, sin normalizar', () => {
    expect(meshArea('ar') / meshArea('es')).toBeCloseTo(AREA_RATIO_AR_TO_ES, 10);
    expect(AREA_RATIO_AR_TO_ES).toBe(5.5);
    expect(COUNTRY_MESH.es.x).toBeLessThan(COUNTRY_MESH.ar.x);
  });

  it('las luces de más peso se encienden antes', () => {
    expect(cityIntensity(0, 1)).toBe(0);
    expect(cityIntensity(1, 1)).toBe(1);
    expect(cityIntensity(0.2, 1)).toBeGreaterThan(cityIntensity(0.2, 0.2));
    expect(cityIntensity(1, 0.35)).toBe(0.35);
  });

  it('proyecta Madrid y Buenos Aires sobre la silueta, no sobre el océano', () => {
    const madrid = CITY_LIGHTS.find((city) => city.name === 'Madrid');
    const buenosAires = CITY_LIGHTS.find((city) => city.name === 'Buenos Aires');
    expect(madrid).toBeDefined();
    expect(buenosAires).toBeDefined();
    if (!madrid || !buenosAires) return;
    const esUv = lonLatToUv('es', madrid.lat, madrid.lon);
    const arUv = lonLatToUv('ar', buenosAires.lat, buenosAires.lon);
    expect(esUv.u).toBeGreaterThan(LAND_UV.es.minU);
    expect(esUv.u).toBeLessThan(LAND_UV.es.maxU);
    expect(esUv.v).toBeGreaterThan(LAND_UV.es.minV);
    expect(esUv.v).toBeLessThan(LAND_UV.es.maxV);
    expect(arUv.u).toBeGreaterThan((LAND_UV.ar.minU + LAND_UV.ar.maxU) / 2);
    expect(arUv.u).toBeLessThanOrEqual(LAND_UV.ar.maxU);
    expect(arUv.v).toBeGreaterThan(LAND_UV.ar.minV);
    expect(arUv.v).toBeLessThan(LAND_UV.ar.maxV);
    const es = lonLatToLocal('es', madrid.lat, madrid.lon);
    const ar = lonLatToLocal('ar', buenosAires.lat, buenosAires.lon);
    expect(Math.abs(es.x)).toBeLessThan(COUNTRY_MESH.es.width / 2);
    expect(Math.abs(es.y)).toBeLessThan(COUNTRY_MESH.es.height / 2);
    expect(Math.abs(ar.x)).toBeLessThan(COUNTRY_MESH.ar.width / 2);
    expect(Math.abs(ar.y)).toBeLessThan(COUNTRY_MESH.ar.height / 2);
  });
});

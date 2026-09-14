import type { CountryId } from '@/scenes/03-asimetria-territorial/content';

export interface CityLight {
  name: string;
  country: CountryId;
  lat: number;
  lon: number;
  /** Brillo y retardo de encendido. Parámetro visual, no un dato de población afirmado. */
  weight: number;
}

export const CITY_LIGHTS: readonly CityLight[] = [
  { name: 'Madrid', country: 'es', lat: 40.42, lon: -3.7, weight: 1 },
  { name: 'Barcelona', country: 'es', lat: 41.39, lon: 2.17, weight: 0.85 },
  { name: 'Valencia', country: 'es', lat: 39.47, lon: -0.38, weight: 0.55 },
  { name: 'Sevilla', country: 'es', lat: 37.39, lon: -5.98, weight: 0.5 },
  { name: 'Bilbao', country: 'es', lat: 43.26, lon: -2.93, weight: 0.4 },
  { name: 'Málaga', country: 'es', lat: 36.72, lon: -4.42, weight: 0.4 },
  { name: 'Zaragoza', country: 'es', lat: 41.65, lon: -0.88, weight: 0.35 },
  { name: 'Murcia', country: 'es', lat: 37.99, lon: -1.13, weight: 0.3 },
  { name: 'Buenos Aires', country: 'ar', lat: -34.6, lon: -58.38, weight: 1 },
  { name: 'Córdoba', country: 'ar', lat: -31.42, lon: -64.18, weight: 0.35 },
  { name: 'Rosario', country: 'ar', lat: -32.95, lon: -60.65, weight: 0.3 },
  { name: 'Mendoza', country: 'ar', lat: -32.89, lon: -68.85, weight: 0.25 },
  { name: 'San Miguel de Tucumán', country: 'ar', lat: -26.82, lon: -65.22, weight: 0.2 },
  { name: 'La Plata', country: 'ar', lat: -34.92, lon: -57.95, weight: 0.2 },
  { name: 'Mar del Plata', country: 'ar', lat: -38, lon: -57.55, weight: 0.18 },
  { name: 'Salta', country: 'ar', lat: -24.79, lon: -65.41, weight: 0.15 },
];

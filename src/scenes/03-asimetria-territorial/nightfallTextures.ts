import type { CountryId } from '@/scenes/03-asimetria-territorial/content';

export interface StaticTexturePair {
  webp: string;
  fallback: string;
}

export const NIGHTFALL_TEXTURES: Record<CountryId, { day: string; night: string }> & {
  fallback: StaticTexturePair;
} = {
  es: {
    day: '/textures/es-day.webp',
    night: '/textures/es-night.webp',
  },
  ar: {
    day: '/textures/ar-day.webp',
    night: '/textures/ar-night.webp',
  },
  fallback: {
    webp: '/textures/nightfall-static.webp',
    fallback: '/textures/nightfall-static.jpg',
  },
};

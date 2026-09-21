import type { CountryId } from '@/scenes/03-asimetria-territorial/content';

export interface TexturePair {
  webp: string;
  fallback: string;
}

export const NIGHTFALL_TEXTURES: Record<CountryId, { day: TexturePair; night: TexturePair }> & {
  fallback: TexturePair;
} = {
  es: {
    day: { webp: '/textures/es-day.webp', fallback: '/textures/es-day.png' },
    night: { webp: '/textures/es-night.webp', fallback: '/textures/es-night.png' },
  },
  ar: {
    day: { webp: '/textures/ar-day.webp', fallback: '/textures/ar-day.png' },
    night: { webp: '/textures/ar-night.webp', fallback: '/textures/ar-night.png' },
  },
  fallback: {
    webp: '/textures/nightfall-static.webp',
    fallback: '/textures/nightfall-static.jpg',
  },
};

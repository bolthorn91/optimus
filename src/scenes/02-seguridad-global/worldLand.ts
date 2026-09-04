import WORLD_BASE from '../../../public/maps/world-base.svg?raw';

export const WORLD_BASE_SVG = WORLD_BASE;

const match = /id="continents"\s+d="([^"]+)"/.exec(WORLD_BASE);
if (!match?.[1]) {
  throw new Error('world-base.svg: missing continents path');
}

export const WORLD_LAND_D = match[1];

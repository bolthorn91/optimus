import type { RegionId } from '@/scenes/02-seguridad-global/risk-data';

export interface RegionBlob {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

/** Manchas esquemáticas en el viewBox 0 0 360 150 (equirrectangular recortada a 60° S). */
export const REGION_BLOBS: Record<RegionId, readonly RegionBlob[]> = {
  arcticNorthAmerica: [{ cx: 80, cy: 28, rx: 42, ry: 16 }],
  northAmerica: [{ cx: 78, cy: 48, rx: 28, ry: 14 }],
  mexicoCentralAmerica: [{ cx: 82, cy: 68, rx: 14, ry: 8 }],
  caribbean: [{ cx: 100, cy: 66, rx: 8, ry: 5 }],
  northernSouthAmerica: [{ cx: 112, cy: 82, rx: 12, ry: 8 }],
  southAmerica: [{ cx: 118, cy: 108, rx: 16, ry: 28 }],
  westernEurope: [{ cx: 176, cy: 42, rx: 12, ry: 10 }],
  easternEurope: [{ cx: 196, cy: 40, rx: 14, ry: 10 }],
  northAfrica: [{ cx: 184, cy: 62, rx: 18, ry: 8 }],
  sahel: [{ cx: 188, cy: 74, rx: 22, ry: 7 }],
  centralAfrica: [{ cx: 192, cy: 88, rx: 14, ry: 10 }],
  hornOfAfrica: [{ cx: 218, cy: 78, rx: 10, ry: 8 }],
  southernAfrica: [{ cx: 198, cy: 108, rx: 12, ry: 12 }],
  middleEast: [{ cx: 214, cy: 62, rx: 12, ry: 8 }],
  centralAsia: [{ cx: 240, cy: 48, rx: 16, ry: 10 }],
  southAsia: [{ cx: 258, cy: 68, rx: 14, ry: 10 }],
  eastAsia: [{ cx: 292, cy: 52, rx: 18, ry: 12 }],
  southeastAsia: [{ cx: 292, cy: 78, rx: 14, ry: 10 }],
  oceania: [{ cx: 318, cy: 118, rx: 18, ry: 12 }],
};

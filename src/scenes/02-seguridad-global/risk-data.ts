import { RISK_SCALE, type RiskLevel } from '@/lib/tokens';

/**
 * Niveles de riesgo por región y período. Derivados de las manchas de
 * `public/assets-origen/p04-X19.png` (1985, 2015) y `p05-X25.png` (2026).
 * El estado 2050 no existe en el dossier (B-03): se deriva de la tesis textual
 * (Ártico, Colorado, Golfo de México) y se marca como proyección (F6).
 *
 * `riskLevel` acepta un mapa parcial (MAP-14); los períodos canónicos son completos.
 */
export type { RiskLevel };

export type PeriodId = '1985' | '2015' | '2026' | '2050';

export type RegionId =
  | 'arcticNorthAmerica'
  | 'northAmerica'
  | 'mexicoCentralAmerica'
  | 'caribbean'
  | 'northernSouthAmerica'
  | 'southAmerica'
  | 'westernEurope'
  | 'easternEurope'
  | 'northAfrica'
  | 'sahel'
  | 'centralAfrica'
  | 'hornOfAfrica'
  | 'southernAfrica'
  | 'middleEast'
  | 'centralAsia'
  | 'southAsia'
  | 'eastAsia'
  | 'southeastAsia'
  | 'oceania';

export interface RiskLevelMeta {
  id: RiskLevel;
  label: string;
  color: string;
}

export interface RiskRegionMeta {
  id: RegionId;
  label: string;
}

export type RiskSnapshot = Record<RegionId, RiskLevel>;

export interface RiskPeriod {
  id: PeriodId;
  year: number;
  label: string;
  shortLabel: string;
  isProjection: boolean;
  regions: RiskSnapshot;
}

/** Cadenas de interfaz del acto II (§6). */
export const RISK_COPY = {
  legendTitle: 'Nivel de riesgo',
  tableCaption: 'Nivel de riesgo bélico por región y período',
  tableRegion: 'Región',
  projectionNote: 'Proyección, no dato observado',
} as const;

/** Etiquetas literales de la leyenda del dossier (versalitas). */
export const RISK_LEVELS: readonly RiskLevelMeta[] = [
  {
    id: 'extreme',
    label: 'RIESGO EXTREMO O GUERRA ABIERTA',
    color: RISK_SCALE.extreme,
  },
  {
    id: 'high',
    label: 'RIESGO ELEVADO',
    color: RISK_SCALE.high,
  },
  {
    id: 'latent',
    label: 'RIESGO LATENTE',
    color: RISK_SCALE.latent,
  },
  {
    id: 'stable',
    label: 'ESTABILIDAD',
    color: RISK_SCALE.stable,
  },
];

export const RISK_REGIONS: readonly RiskRegionMeta[] = [
  { id: 'arcticNorthAmerica', label: 'Ártico y Canadá' },
  { id: 'northAmerica', label: 'Estados Unidos' },
  { id: 'mexicoCentralAmerica', label: 'México y Centroamérica' },
  { id: 'caribbean', label: 'Caribe' },
  { id: 'northernSouthAmerica', label: 'Norte de Sudamérica' },
  { id: 'southAmerica', label: 'América del Sur' },
  { id: 'westernEurope', label: 'Europa occidental' },
  { id: 'easternEurope', label: 'Europa oriental' },
  { id: 'northAfrica', label: 'Norte de África' },
  { id: 'sahel', label: 'Sahel' },
  { id: 'centralAfrica', label: 'África central' },
  { id: 'hornOfAfrica', label: 'Cuerno de África' },
  { id: 'southernAfrica', label: 'África austral' },
  { id: 'middleEast', label: 'Oriente Próximo' },
  { id: 'centralAsia', label: 'Asia central' },
  { id: 'southAsia', label: 'Asia meridional' },
  { id: 'eastAsia', label: 'Asia oriental' },
  { id: 'southeastAsia', label: 'Sudeste asiático' },
  { id: 'oceania', label: 'Oceanía' },
];

const REGIONS_1985: RiskSnapshot = {
  arcticNorthAmerica: 'stable',
  northAmerica: 'stable',
  mexicoCentralAmerica: 'high',
  caribbean: 'high',
  northernSouthAmerica: 'high',
  southAmerica: 'stable',
  westernEurope: 'latent',
  easternEurope: 'latent',
  northAfrica: 'high',
  sahel: 'extreme',
  centralAfrica: 'extreme',
  hornOfAfrica: 'high',
  southernAfrica: 'high',
  middleEast: 'high',
  centralAsia: 'high',
  southAsia: 'high',
  eastAsia: 'latent',
  southeastAsia: 'high',
  oceania: 'stable',
};

const REGIONS_2026: RiskSnapshot = {
  arcticNorthAmerica: 'latent',
  northAmerica: 'stable',
  mexicoCentralAmerica: 'high',
  caribbean: 'stable',
  northernSouthAmerica: 'stable',
  southAmerica: 'stable',
  westernEurope: 'latent',
  easternEurope: 'latent',
  northAfrica: 'high',
  sahel: 'extreme',
  centralAfrica: 'extreme',
  hornOfAfrica: 'high',
  southernAfrica: 'stable',
  middleEast: 'latent',
  centralAsia: 'stable',
  southAsia: 'stable',
  eastAsia: 'stable',
  southeastAsia: 'high',
  oceania: 'stable',
};

export type PeriodIndex = 0 | 1 | 2 | 3;

export type RiskSeries = readonly [RiskPeriod, RiskPeriod, RiskPeriod, RiskPeriod];

export const RISK_PERIODS: RiskSeries = [
  {
    id: '1985',
    year: 1985,
    label: 'NIVEL DE RIESGO BÉLICO Y CONFLICTO ARMADO (1985)',
    shortLabel: '1985',
    isProjection: false,
    regions: REGIONS_1985,
  },
  {
    id: '2015',
    year: 2015,
    label: 'NIVEL DE RIESGO BÉLICO Y CONFLICTO ARMADO (2015)',
    shortLabel: '2015',
    isProjection: false,
    regions: {
      arcticNorthAmerica: 'stable',
      northAmerica: 'stable',
      mexicoCentralAmerica: 'high',
      caribbean: 'stable',
      northernSouthAmerica: 'stable',
      southAmerica: 'stable',
      westernEurope: 'latent',
      easternEurope: 'extreme',
      northAfrica: 'high',
      sahel: 'high',
      centralAfrica: 'high',
      hornOfAfrica: 'extreme',
      southernAfrica: 'stable',
      middleEast: 'extreme',
      centralAsia: 'high',
      southAsia: 'high',
      eastAsia: 'latent',
      southeastAsia: 'high',
      oceania: 'stable',
    },
  },
  {
    id: '2026',
    year: 2026,
    label: 'NIVEL DE RIESGO BÉLICO Y CONFLICTO ARMADO (EN LA ACTUALIDAD)',
    shortLabel: 'En la actualidad',
    isProjection: false,
    regions: REGIONS_2026,
  },
  {
    id: '2050',
    year: 2050,
    label: 'NIVEL DE RIESGO BÉLICO Y CONFLICTO ARMADO (PROYECCIÓN 2050)',
    shortLabel: 'Proyección 2050',
    isProjection: true,
    regions: {
      ...REGIONS_2026,
      arcticNorthAmerica: 'high',
      northAmerica: 'high',
    },
  },
];

export function riskLevel(
  period: { id: PeriodId; regions: Partial<Record<RegionId, RiskLevel>> },
  region: RegionId,
): RiskLevel {
  const declared = period.regions[region];
  if (declared === undefined) {
    if (import.meta.env.DEV) {
      console.warn(`Riesgo no declarado: ${region} en ${period.id}; se trata como stable`);
    }
    return 'stable';
  }
  return declared;
}

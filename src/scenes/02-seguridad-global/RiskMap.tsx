import { RiskPatternDefs, riskPatternId } from '@/components/RiskPattern';
import { RISK_SCALE } from '@/lib/tokens';
import {
  RISK_REGIONS,
  type PeriodIndex,
  type RiskSeries,
} from '@/scenes/02-seguridad-global/risk-data';
import { REGION_BLOBS } from '@/scenes/02-seguridad-global/risk-shapes';
import { WORLD_LAND_D } from '@/scenes/02-seguridad-global/worldLand';

export function RiskMap({
  periods,
  layerOpacity,
  activeIndex,
  southAmericaGlow,
  projectionNote,
}: {
  periods: RiskSeries;
  layerOpacity: readonly [number, number, number, number];
  activeIndex: PeriodIndex;
  southAmericaGlow: number;
  projectionNote: string;
}) {
  const active = periods[activeIndex];
  const titleId = 'act2-map-title';
  const descId = 'act2-map-desc';

  return (
    <svg
      aria-labelledby={`${titleId} ${descId}`}
      className="risk-map"
      data-risk-map
      role="img"
      viewBox="0 0 360 150"
    >
      <title id={titleId}>{active.label}</title>
      <desc id={descId}>{active.isProjection ? projectionNote : active.shortLabel}</desc>
      <RiskPatternDefs />
      <g fill="currentColor" id="land" opacity="0.45">
        <path d={WORLD_LAND_D} id="continents" />
      </g>
      {([0, 1, 2, 3] as const).map((index) => {
        const period = periods[index];
        return (
          <g data-risk-layer={period.id} key={period.id} opacity={layerOpacity[index]}>
            {RISK_REGIONS.map((regionMeta) => {
              const region = regionMeta.id;
              const level = period.regions[region];
              return REGION_BLOBS[region].map((blob, blobIndex) => (
                <g key={`${region}-${String(blobIndex)}`}>
                  <ellipse
                    cx={blob.cx}
                    cy={blob.cy}
                    fill={RISK_SCALE[level]}
                    rx={blob.rx}
                    ry={blob.ry}
                  />
                  <ellipse
                    cx={blob.cx}
                    cy={blob.cy}
                    fill={`url(#${riskPatternId(level)})`}
                    rx={blob.rx}
                    ry={blob.ry}
                  />
                </g>
              ));
            })}
          </g>
        );
      })}
      <g fill="none" opacity={southAmericaGlow} stroke="var(--color-gold-high)" strokeWidth="1.2">
        {REGION_BLOBS.southAmerica.map((blob, index) => (
          <ellipse cx={blob.cx} cy={blob.cy} key={index} rx={blob.rx + 2} ry={blob.ry + 2} />
        ))}
      </g>
      {active.isProjection ? (
        <text className="risk-map__projection" fill="currentColor" x="8" y="144">
          {projectionNote}
        </text>
      ) : null}
    </svg>
  );
}

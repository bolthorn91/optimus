import { useId } from 'react';

import { PALETTE, RISK_SCALE, type RiskLevel } from '@/lib/tokens';

export type RiskPatternKind = 'crosshatch' | 'diagonal' | 'dots' | 'bars';

export const RISK_PATTERN_KIND: Record<RiskLevel, RiskPatternKind> = {
  extreme: 'crosshatch',
  high: 'diagonal',
  latent: 'dots',
  stable: 'bars',
};

export function riskPatternId(level: RiskLevel, prefix: string): string {
  return `${prefix}-${level}`;
}

function DualStroke({ d }: { d: string }) {
  return (
    <>
      <path d={d} fill="none" stroke={PALETTE.white} strokeWidth="1.8" />
      <path d={d} fill="none" stroke={PALETTE.navyDeep} strokeWidth="0.7" />
    </>
  );
}

function PatternTiles({ kind }: { kind: RiskPatternKind }) {
  if (kind === 'crosshatch') {
    return (
      <>
        <DualStroke d="M0 0 L8 8" />
        <DualStroke d="M8 0 L0 8" />
      </>
    );
  }
  if (kind === 'diagonal') {
    return <DualStroke d="M0 8 L8 0" />;
  }
  if (kind === 'dots') {
    return (
      <>
        <circle cx="4" cy="4" fill={PALETTE.white} r="1.6" />
        <circle cx="4" cy="4" fill={PALETTE.navyDeep} r="0.9" />
      </>
    );
  }
  return <DualStroke d="M0 4 H8" />;
}

/** Definiciones SVG estables para mapa y leyenda (doc 02 §3.4). */
export function RiskPatternDefs({ prefix }: { prefix: string }) {
  return (
    <defs>
      {(Object.keys(RISK_PATTERN_KIND) as RiskLevel[]).map((level) => (
        <pattern
          height="8"
          id={riskPatternId(level, prefix)}
          key={level}
          patternUnits="userSpaceOnUse"
          width="8"
        >
          <PatternTiles kind={RISK_PATTERN_KIND[level]} />
        </pattern>
      ))}
    </defs>
  );
}

export function RiskPattern({ level }: { level: RiskLevel }) {
  const uid = useId();
  const patternId = riskPatternId(level, uid);

  return (
    <svg
      aria-hidden="true"
      data-risk-pattern={level}
      data-risk-pattern-kind={RISK_PATTERN_KIND[level]}
      viewBox="0 0 24 24"
    >
      <defs>
        <pattern height="8" id={patternId} patternUnits="userSpaceOnUse" width="8">
          <PatternTiles kind={RISK_PATTERN_KIND[level]} />
        </pattern>
      </defs>
      <rect fill={RISK_SCALE[level]} height="24" width="24" />
      <rect fill={`url(#${patternId})`} height="24" width="24" />
    </svg>
  );
}

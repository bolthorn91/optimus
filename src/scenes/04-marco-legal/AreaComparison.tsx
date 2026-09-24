import type { CSSProperties } from 'react';

import type { Area } from '@/scenes/04-marco-legal/content';

function scaleStyle(scale: number): CSSProperties {
  return { ['--area-scale']: String(scale) } as CSSProperties;
}

export function AreaComparison({ primary, reference }: { primary: Area; reference: Area }) {
  const max = Math.max(primary.hectares, reference.hectares);
  const primaryScale = max === 0 ? 0 : primary.hectares / max;
  const referenceScale = max === 0 ? 0 : reference.hectares / max;

  return (
    <figure data-area-comparison>
      <div className="act4-areas">
        <span className="act4-areas__shape" data-area="primary" style={scaleStyle(primaryScale)} />
        <span
          className="act4-areas__shape"
          data-area="reference"
          style={scaleStyle(referenceScale)}
        />
      </div>
      <figcaption>
        <span>{primary.label}</span>
        <span>{reference.label}</span>
      </figcaption>
    </figure>
  );
}

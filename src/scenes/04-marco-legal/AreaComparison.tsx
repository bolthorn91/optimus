import type { CSSProperties } from 'react';

import { formatArea } from '@/lib/format';
import type { Area } from '@/scenes/04-marco-legal/content';

function scaleStyle(scale: number): CSSProperties {
  return { ['--area-scale']: String(scale) } as CSSProperties;
}

/**
 * Las dos superficies valen lo mismo, así que superponerlas era una mancha gris sin lectura.
 * Se muestran en dos fichas equivalentes, cada una con su superficie escrita.
 */
export function AreaComparison({ primary, reference }: { primary: Area; reference: Area }) {
  const max = Math.max(primary.hectares, reference.hectares);
  const primaryScale = max === 0 ? 0 : primary.hectares / max;
  const referenceScale = max === 0 ? 0 : reference.hectares / max;

  return (
    <figure className="act4-areas" data-area-comparison>
      <div className="act4-areas__item" data-area="primary" style={scaleStyle(primaryScale)}>
        <span aria-hidden="true" className="act4-areas__shape" />
        <p className="act4-areas__label">{primary.label}</p>
        <strong className="act4-areas__value">{formatArea(primary.hectares, 'ha')}</strong>
      </div>
      <div className="act4-areas__item" data-area="reference" style={scaleStyle(referenceScale)}>
        <span aria-hidden="true" className="act4-areas__shape" />
        <p className="act4-areas__label">{reference.label}</p>
        <strong className="act4-areas__value">{formatArea(reference.hectares, 'ha')}</strong>
      </div>
    </figure>
  );
}

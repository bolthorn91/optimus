import type { ReactNode } from 'react';

import type { Factor } from '@/scenes/01-escenario-europeo/content';

export interface FactorPanelProps {
  factor: Factor;
  illustration?: ReactNode;
  children: ReactNode;
}

export function FactorPanel({ factor, illustration, children }: FactorPanelProps) {
  const index = String(factor.index).padStart(2, '0');

  return (
    <article className="factor-panel" data-factor={factor.index}>
      {illustration}
      <p className="factor-panel__index">{index}</p>
      <p className="factor-panel__scope">{factor.scope}</p>
      <h3>{factor.title}</h3>
      {children}
    </article>
  );
}

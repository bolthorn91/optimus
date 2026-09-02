import { RiskPattern } from '@/components/RiskPattern';
import type { RiskLevelMeta } from '@/scenes/02-seguridad-global/risk-data';

import './scene.css';

export function RiskLegend({ levels, title }: { levels: readonly RiskLevelMeta[]; title: string }) {
  return (
    <ul aria-label={title} className="risk-legend">
      {levels.map((level) => (
        <li className="risk-legend__item" key={level.id}>
          <RiskPattern level={level.id} />
          <span>{level.label}</span>
        </li>
      ))}
    </ul>
  );
}

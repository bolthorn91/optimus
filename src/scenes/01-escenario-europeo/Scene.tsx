import { DualFigure } from '@/components/DualFigure';
import { RomanNumeral } from '@/components/RomanNumeral';
import { StatFigure } from '@/components/StatFigure';
import { Scene } from '@/motion/Scene';
import { ACT1 } from '@/scenes/01-escenario-europeo/content';
import { FactorPanel } from '@/scenes/01-escenario-europeo/FactorPanel';

import './scene.css';

export function Act1Scene() {
  return (
    <Scene
      act={ACT1.act}
      background="var(--color-navy-deep)"
      className="on-navy"
      height="100vh"
      id="escenario"
    >
      <div className="act1">
        <h2>
          <RomanNumeral value={ACT1.act} />. {ACT1.title}
        </h2>
        <p className="act1-intro">{ACT1.intro}</p>
        <div className="act1-factors">
          {ACT1.factors.map((factor) => (
            <FactorPanel factor={factor} key={factor.index} />
          ))}
        </div>
        <StatFigure
          label={ACT1.stat.label}
          source={ACT1.stat.source}
          value={<DualFigure roman suffix={ACT1.stat.unit} value={ACT1.stat.value} />}
        />
        <p className="act1-closing">{ACT1.closing}</p>
        <a href={ACT1.cta.href}>{ACT1.cta.label}</a>
      </div>
    </Scene>
  );
}

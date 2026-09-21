import { RomanNumeral } from '@/components/RomanNumeral';
import { Scene } from '@/motion/Scene';
import { ACT3 } from '@/scenes/03-asimetria-territorial/content';
import { LandAdvantageCards } from '@/scenes/03-asimetria-territorial/LandAdvantageCards';
import { MarketComparison } from '@/scenes/03-asimetria-territorial/MarketComparison';
import { NightfallStage } from '@/scenes/03-asimetria-territorial/NightfallStage';
import { TerritorialComparison } from '@/scenes/03-asimetria-territorial/TerritorialComparison';
import { TerritorialModelDiagram } from '@/scenes/03-asimetria-territorial/TerritorialModelDiagram';
import { choreographAct3 } from '@/scenes/03-asimetria-territorial/timeline';

import './scene.css';

export function Act3Scene() {
  const initial = choreographAct3(0);

  return (
    <Scene
      act={ACT3.act}
      background="var(--color-navy-ink)"
      className="on-navy"
      height="100vh"
      id="territorio"
    >
      <div className="act3">
        <h2>
          <RomanNumeral value={ACT3.act} />. {ACT3.title}
        </h2>
        <NightfallStage countries={ACT3.countries} state={initial} />
        <div className="act3-intro">
          <p>{ACT3.intro.europe}</p>
          <p>{ACT3.intro.southAmerica}</p>
        </div>
        <h3>{ACT3.copy.territorialHeading}</h3>
        <TerritorialComparison countries={ACT3.countries} />
        <p>{ACT3.territorialModel.spain}</p>
        <TerritorialModelDiagram />
        <p>{ACT3.territorialModel.argentina}</p>
        <LandAdvantageCards advantages={ACT3.landAdvantages} />
        <h3>{ACT3.copy.marketHeading}</h3>
        <MarketComparison rows={ACT3.market} />
        <p className="act3-conclusion">{ACT3.conclusion}</p>
        <a href={ACT3.cta.href}>{ACT3.cta.label}</a>
      </div>
    </Scene>
  );
}

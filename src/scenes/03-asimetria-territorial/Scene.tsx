import { useCallback, useRef, useState } from 'react';

import { applyDocumentPair, TERRITORIO_PAIR } from '@/app/sections';
import { RomanNumeral } from '@/components/RomanNumeral';
import { Scene } from '@/motion/Scene';
import { useGsapScene } from '@/motion/useGsapScene';
import { ACT3 } from '@/scenes/03-asimetria-territorial/content';
import { LandAdvantageCards } from '@/scenes/03-asimetria-territorial/LandAdvantageCards';
import { MarketComparison } from '@/scenes/03-asimetria-territorial/MarketComparison';
import { NightfallStage } from '@/scenes/03-asimetria-territorial/NightfallStage';
import { TerritorialComparison } from '@/scenes/03-asimetria-territorial/TerritorialComparison';
import { TerritorialModelDiagram } from '@/scenes/03-asimetria-territorial/TerritorialModelDiagram';
import { choreographAct3, type Act3State } from '@/scenes/03-asimetria-territorial/timeline';

import './scene.css';

const HEIGHT = '100svh';
const PIN_END = '+=500vh';

function applyChrome(node: HTMLElement, state: Act3State): void {
  node.style.setProperty('--night-amount', String(state.skyNight));
  node.style.setProperty('--night-release', String(state.nightRelease));
  node.dataset.chrome = state.chrome;
  applyDocumentPair(
    state.chrome === 'night' ? { ...TERRITORIO_PAIR, surface: 'black' } : TERRITORIO_PAIR,
  );
}

export function Act3Scene() {
  const ref = useRef<HTMLElement>(null);
  const [visual, setVisual] = useState<Act3State>(() => choreographAct3(0));

  const paint = useCallback((state: Act3State) => {
    if (ref.current) applyChrome(ref.current, state);
    setVisual(state);
  }, []);

  useGsapScene({
    ref,
    choreograph: choreographAct3,
    apply: paint,
    pin: true,
    scrub: true,
    end: PIN_END,
  });

  return (
    <Scene
      act={ACT3.act}
      background="var(--act3-sky)"
      className={visual.chrome === 'day' ? '' : 'on-navy'}
      height={HEIGHT}
      id="territorio"
      ref={ref}
    >
      <div className="act3">
        <h2>
          <RomanNumeral value={ACT3.act} />. {ACT3.title}
        </h2>
        <NightfallStage countries={ACT3.countries} state={visual} />
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
        <a data-track="cta" data-track-position="act" href={ACT3.cta.href}>
          {ACT3.cta.label}
        </a>
      </div>
    </Scene>
  );
}

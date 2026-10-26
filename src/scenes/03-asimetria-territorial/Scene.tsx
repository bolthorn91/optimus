import { useCallback, useRef, useState } from 'react';

import { applyDocumentPair, TERRITORIO_PAIR } from '@/app/sections';
import { ActCta } from '@/components/ActCta';
import { Disclosure } from '@/components/Disclosure';
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
    // El acto III contenía toda la comparativa dentro de un pin de 600vh: el scroll se
    // bloqueaba y los datos no se podían leer. Sin pin, la página fluye y el color acompaña.
    pin: false,
    end: 'bottom bottom',
    scrub: true,
    sceneId: 'territorio',
  });

  return (
    <Scene
      act={ACT3.act}
      background="var(--act3-sky)"
      className={visual.chrome === 'day' ? 'on-light' : 'on-navy'}
      height={HEIGHT}
      id="territorio"
      ref={ref}
    >
      <div className="act3">
        <h2>
          <RomanNumeral value={ACT3.act} />. {ACT3.title}
        </h2>
        <div className="act3-intro">
          <p>{ACT3.intro.europe}</p>
          <p>{ACT3.intro.southAmerica}</p>
        </div>
        <NightfallStage countries={ACT3.countries} state={visual} />
        <Disclosure
          defaultOpen
          id="act3-territorial"
          meta="Superficie · población · densidad"
          title={<h3>{ACT3.copy.territorialHeading}</h3>}
        >
          <TerritorialComparison countries={ACT3.countries} />
          <div className="act3-model-copy">
            <p>{ACT3.territorialModel.spain}</p>
            <TerritorialModelDiagram />
            <p>{ACT3.territorialModel.argentina}</p>
          </div>
        </Disclosure>
        <Disclosure id="act3-suelo" meta="3 ventajas" title={<h3>{ACT3.copy.landHeading}</h3>}>
          <LandAdvantageCards advantages={ACT3.landAdvantages} />
        </Disclosure>
        <Disclosure id="act3-mercado" meta="9 criterios" title={<h3>{ACT3.copy.marketHeading}</h3>}>
          <MarketComparison rows={ACT3.market} />
        </Disclosure>
        <p className="act3-conclusion">{ACT3.conclusion}</p>
        <ActCta href={ACT3.cta.href} label={ACT3.cta.label} />
      </div>
    </Scene>
  );
}

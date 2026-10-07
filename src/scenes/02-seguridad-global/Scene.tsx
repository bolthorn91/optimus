import { useCallback, useEffect, useRef, useState } from 'react';

import { CountUp } from '@/components/CountUp';
import { PullQuote } from '@/components/PullQuote';
import { RiskTable } from '@/components/RiskTable';
import { RomanNumeral } from '@/components/RomanNumeral';
import { formatNumber } from '@/lib/format';
import { gsap } from '@/motion/gsapSetup';
import { Scene } from '@/motion/Scene';
import { useGsapScene } from '@/motion/useGsapScene';
import { useReducedMotionSafe } from '@/motion/useReducedMotionSafe';
import { ClimateSection } from '@/scenes/02-seguridad-global/ClimateSection';
import { ACT2 } from '@/scenes/02-seguridad-global/content';
import { PeriodSelector } from '@/scenes/02-seguridad-global/PeriodSelector';
import type { PeriodIndex } from '@/scenes/02-seguridad-global/risk-data';
import { RiskLegend } from '@/scenes/02-seguridad-global/RiskLegend';
import { RiskMap } from '@/scenes/02-seguridad-global/RiskMap';
import {
  choreographAct2,
  crossfade,
  progressForPeriod,
  stateForPeriod,
  type Act2State,
} from '@/scenes/02-seguridad-global/timeline';

import './scene.css';

const HEIGHT = '100vh';
const PIN_END = '+=400vh';
const SCENE_BACKGROUND =
  'color-mix(in srgb, var(--color-navy-mid) calc((1 - var(--surface-mix, 0)) * 100%), var(--color-navy-ink) calc(var(--surface-mix, 0) * 100%))';

function applyChrome(node: HTMLElement, state: Act2State): void {
  node.style.setProperty('--surface-mix', String(state.surfaceMix));
  node.style.setProperty('--intro-opacity', String(state.introOpacity));
  node.style.setProperty('--quote-opacity', String(state.quoteOpacity));
}

export function Act2Scene() {
  const ref = useRef<HTMLElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  const reduced = useReducedMotionSafe();
  const [visual, setVisual] = useState<Act2State>(() => choreographAct2(0));

  const paint = useCallback((state: Act2State) => {
    if (ref.current) applyChrome(ref.current, state);
    setVisual(state);
  }, []);

  const { seek } = useGsapScene({
    ref,
    choreograph: choreographAct2,
    apply: paint,
    pin: true,
    scrub: true,
    end: PIN_END,
  });

  useEffect(
    () => () => {
      tween.current?.kill();
    },
    [],
  );

  function onSelect(index: PeriodIndex): void {
    tween.current?.kill();
    const from = visual.periodoActivo;
    seek(progressForPeriod(index), 'silent');
    if (from === index) {
      paint(stateForPeriod(index));
      return;
    }
    paint(crossfade(from, index, 0));
    const proxy = { t: 0 };
    tween.current = gsap.to(proxy, {
      t: 1,
      duration: 0.45,
      ease: 'power1.inOut',
      onUpdate: () => {
        paint(crossfade(from, index, proxy.t));
      },
      onComplete: () => {
        paint(stateForPeriod(index));
      },
    });
  }

  return (
    <Scene
      act={ACT2.act}
      background={SCENE_BACKGROUND}
      className="on-navy"
      height={HEIGHT}
      id="seguridad"
      ref={ref}
    >
      <div className="act2">
        <h2>
          <RomanNumeral value={ACT2.act} />. {ACT2.title}
        </h2>
        <h3>{ACT2.headingVulnerable}</h3>
        {ACT2.intro.map((paragraph) => (
          <p className="act2-intro" key={paragraph}>
            {paragraph}
          </p>
        ))}
        <p className="act2-year">
          <CountUp format={formatNumber} to={visual.year} />
        </p>
        <PeriodSelector
          activeIndex={visual.periodoActivo}
          label={ACT2.copy.periodSelector}
          onSelect={onSelect}
          periods={ACT2.periods}
        />
        {reduced ? (
          <div className="act2-maps">
            {([0, 1, 2, 3] as const).map((index) => (
              <figure key={ACT2.periods[index].id}>
                <figcaption>{ACT2.periods[index].label}</figcaption>
                <RiskMap
                  activeIndex={index}
                  layerOpacity={stateForPeriod(index).layerOpacity}
                  periods={ACT2.periods}
                  projectionNote={ACT2.copy.projectionNote}
                  southAmericaGlow={1}
                />
              </figure>
            ))}
          </div>
        ) : (
          <RiskMap
            activeIndex={visual.periodoActivo}
            layerOpacity={visual.layerOpacity}
            periods={ACT2.periods}
            projectionNote={ACT2.copy.projectionNote}
            southAmericaGlow={visual.southAmericaGlow}
          />
        )}
        <RiskLegend levels={ACT2.levels} title={ACT2.copy.legendTitle} />
        <RiskTable
          copy={{
            caption: ACT2.copy.tableCaption,
            projectionNote: ACT2.copy.projectionNote,
            regionHeader: ACT2.copy.tableRegion,
          }}
          levels={ACT2.levels}
          periods={ACT2.periods}
          regions={ACT2.regions}
        />
        <ClimateSection content={ACT2.climate} progress={visual.climateOpacity} />
        <PullQuote className="act2-quote">{ACT2.closingQuote}</PullQuote>
      </div>
    </Scene>
  );
}

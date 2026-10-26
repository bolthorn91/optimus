import { useCallback, useRef, useState } from 'react';

import { ActCta } from '@/components/ActCta';
import { CountUp } from '@/components/CountUp';
import { DualFigure } from '@/components/DualFigure';
import { RomanNumeral } from '@/components/RomanNumeral';
import { StatFigure } from '@/components/StatFigure';
import { formatPercent } from '@/lib/format';
import { Scene } from '@/motion/Scene';
import { useGsapScene } from '@/motion/useGsapScene';
import { ACT1 } from '@/scenes/01-escenario-europeo/content';
import { DematerialisingNote } from '@/scenes/01-escenario-europeo/DematerialisingNote';
import { DensityIllustration } from '@/scenes/01-escenario-europeo/DensityIllustration';
import { FactorPanel } from '@/scenes/01-escenario-europeo/FactorPanel';
import { SurveillanceGrid } from '@/scenes/01-escenario-europeo/SurveillanceGrid';
import { choreographAct1, type Act1State } from '@/scenes/01-escenario-europeo/timeline';

import './scene.css';

const HEIGHT = '100svh';
const SCENE_BACKGROUND =
  'color-mix(in srgb, var(--color-navy-deep) calc((1 - var(--surface-mix, 0)) * 100%), var(--color-navy-mid) calc(var(--surface-mix, 0) * 100%))';

function applyAct1(node: HTMLElement, state: Act1State): void {
  node.style.setProperty('--surface-mix', String(state.surfaceMix));
  node.style.setProperty('--intro-opacity', String(state.introOpacity));
  node.style.setProperty('--intro-y', `${String(state.introY)}px`);
  node.style.setProperty('--closing-opacity', String(state.closingOpacity));
  node.style.setProperty('--stat-opacity', String(state.statProgress));
  for (let i = 0; i < 3; i += 1) {
    const panel = node.querySelector<HTMLElement>(`[data-factor="${String(i + 1)}"]`);
    if (!panel) continue;
    const opacity = state.factorOpacity[i] ?? 0;
    panel.style.setProperty('--factor-opacity', String(opacity));
    panel.style.setProperty('--factor-y', `${String(state.factorY[i] ?? 0)}px`);
    panel.style.setProperty('--factor-visibility', opacity === 0 ? 'hidden' : 'visible');
    panel.style.setProperty('--factor-pointer', opacity === 0 ? 'none' : 'auto');
  }
}

function sameProgress(
  left: Act1State['factorProgress'],
  right: Act1State['factorProgress'],
): boolean {
  return left[0] === right[0] && left[1] === right[1] && left[2] === right[2];
}

export function Act1Scene() {
  const ref = useRef<HTMLElement>(null);
  const [statProgress, setStatProgress] = useState(0);
  const [factorProgress, setFactorProgress] = useState<Act1State['factorProgress']>([0, 0, 0]);

  const apply = useCallback((state: Act1State) => {
    if (ref.current) applyAct1(ref.current, state);
    setStatProgress((current) => (current === state.statProgress ? current : state.statProgress));
    setFactorProgress((current) =>
      sameProgress(current, state.factorProgress) ? current : state.factorProgress,
    );
  }, []);

  useGsapScene({
    ref,
    choreograph: choreographAct1,
    apply,
    pin: true,
    scrub: true,
    sceneId: 'escenario',
  });

  return (
    <Scene
      act={ACT1.act}
      background={SCENE_BACKGROUND}
      className="on-navy"
      height={HEIGHT}
      id="escenario"
      ref={ref}
    >
      <div className="act1">
        <h2>
          <RomanNumeral value={ACT1.act} />. {ACT1.title}
        </h2>
        <p className="act1-intro">{ACT1.intro}</p>
        <div className="act1-factors">
          {ACT1.factors.map((factor, index) => {
            const progress = factorProgress[index] ?? 0;
            const body = <p>{factor.body}</p>;
            if (factor.illustration === 'density') {
              return (
                <FactorPanel
                  factor={factor}
                  illustration={<DensityIllustration progress={progress} />}
                  key={factor.index}
                >
                  {body}
                </FactorPanel>
              );
            }
            if (factor.illustration === 'surveillance') {
              return (
                <FactorPanel factor={factor} key={factor.index}>
                  <SurveillanceGrid progress={progress}>{body}</SurveillanceGrid>
                </FactorPanel>
              );
            }
            return (
              <FactorPanel
                factor={factor}
                illustration={<DematerialisingNote progress={progress} />}
                key={factor.index}
              >
                {body}
              </FactorPanel>
            );
          })}
        </div>
        <div className="act1-stat">
          <StatFigure
            label={ACT1.stat.label}
            source={ACT1.stat.source}
            value={
              <DualFigure
                arabic={
                  <CountUp format={formatPercent} progress={statProgress} to={ACT1.stat.value} />
                }
                roman
                suffix={ACT1.stat.unit}
                value={ACT1.stat.value}
              />
            }
          />
        </div>
        <p className="act1-closing">{ACT1.closing}</p>
        <ActCta href={ACT1.cta.href} label={ACT1.cta.label} />
      </div>
    </Scene>
  );
}

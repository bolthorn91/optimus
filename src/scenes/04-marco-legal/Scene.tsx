import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { applyDocumentPair, IVORY_PAIR, NAVY_DEEP_PAIR } from '@/app/sections';
import { Disclaimer } from '@/components/Disclaimer';
import { DualFigure } from '@/components/DualFigure';
import { GuaranteeCards, toGuaranteeCardItems } from '@/components/GuaranteeCards';
import { ProcessDiagram } from '@/components/ProcessDiagram';
import { ProcessStepList } from '@/components/ProcessStepList';
import { RomanNumeral } from '@/components/RomanNumeral';
import { paintProcessDiagram } from '@/motion/paintProcessDiagram';
import { Scene } from '@/motion/Scene';
import { useGsapScene } from '@/motion/useGsapScene';
import { useProcessOrientation } from '@/motion/useProcessOrientation';
import { useReducedMotionSafe } from '@/motion/useReducedMotionSafe';
import { AnchorStat } from '@/scenes/04-marco-legal/AnchorStat';
import { AreaComparison } from '@/scenes/04-marco-legal/AreaComparison';
import { ACT4 } from '@/scenes/04-marco-legal/content';
import { choreographAct4, progressForStep, type Act4State } from '@/scenes/04-marco-legal/timeline';

import './scene.css';

const HEIGHT = '100svh';
const PIN_END = '+=450vh';
const SCENE_BACKGROUND =
  'color-mix(in srgb, var(--color-navy-deep) calc((1 - var(--surface-mix, 0)) * 100%), var(--color-ivory) calc(var(--surface-mix, 0) * 100%))';

type Act4View = Pick<
  Act4State,
  'pasoActivo' | 'drawProgress' | 'stepGlow' | 'guaranteeProgress' | 'anchorProgress' | 'chrome'
>;

function viewOf(state: Act4State): Act4View {
  return {
    anchorProgress: state.anchorProgress,
    chrome: state.chrome,
    drawProgress: state.drawProgress,
    guaranteeProgress: state.guaranteeProgress,
    pasoActivo: state.pasoActivo,
    stepGlow: state.stepGlow,
  };
}

function applyChrome(node: HTMLElement, state: Act4State): void {
  node.style.setProperty('--intro-opacity', String(state.introOpacity));
  node.style.setProperty('--closing-opacity', String(state.closingOpacity));
  node.style.setProperty('--surface-mix', String(state.surfaceMix));
  node.dataset.chrome = state.chrome;
  applyDocumentPair(state.chrome === 'ivory' ? IVORY_PAIR : NAVY_DEEP_PAIR);
}

export function Act4Scene() {
  const ref = useRef<HTMLElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();
  const orientation = useProcessOrientation();
  const [visual, setVisual] = useState(() => viewOf(choreographAct4(reduced ? 1 : 0)));
  const visualRef = useRef(visual);
  const steps = useMemo(
    () =>
      ACT4.cdiSteps.map((step) => ({
        id: String(step.index),
        title: step.title,
        body: step.body,
      })),
    [],
  );
  const guarantees = useMemo(() => toGuaranteeCardItems(ACT4.guarantees.pillars), []);

  const apply = useCallback((state: Act4State) => {
    const view = viewOf(state);
    visualRef.current = view;
    if (ref.current) applyChrome(ref.current, state);
    if (diagramRef.current) {
      paintProcessDiagram(diagramRef.current, state.drawProgress, state.stepGlow);
    }
    setVisual(view);
  }, []);

  const { seek } = useGsapScene({
    ref,
    choreograph: choreographAct4,
    apply,
    pin: true,
    scrub: true,
    end: PIN_END,
  });

  useLayoutEffect(() => {
    const root = diagramRef.current;
    if (!root) return;
    const current = visualRef.current;
    paintProcessDiagram(root, current.drawProgress, current.stepGlow);
  }, [orientation]);

  function onSelect(index: number): void {
    if (reduced) return;
    seek(progressForStep(index));
  }

  return (
    <Scene
      act={ACT4.act}
      background={SCENE_BACKGROUND}
      className={visual.chrome === 'ivory' ? '' : 'on-navy'}
      height={HEIGHT}
      id="marco"
      ref={ref}
    >
      <div className="act4">
        <h2>
          <RomanNumeral value={ACT4.act} />. {ACT4.title}
        </h2>
        <div className="act4-intro">
          <p>{ACT4.intro}</p>
        </div>
        <h3>{ACT4.whyArgentina.heading}</h3>
        {ACT4.whyArgentina.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <ul className="act4-factors">
          {ACT4.whyArgentina.factors.map((factor) => (
            <li key={factor.name}>
              <strong>{factor.name}</strong>
              <span>{factor.detail}</span>
            </li>
          ))}
        </ul>
        <div data-anchor-stat>
          <time dateTime={String(ACT4.anchorStat.since)}>
            <DualFigure value={ACT4.anchorStat.since} />
          </time>
          <AnchorStat
            equivalence={ACT4.anchorStat.equivalence}
            hectares={ACT4.anchorStat.hectares}
            label={ACT4.anchorStat.label}
            progress={visual.anchorProgress}
            source={ACT4.anchorStat.source}
          />
          <AreaComparison primary={ACT4.areas.primary} reference={ACT4.areas.reference} />
        </div>
        <section data-fiscal>
          <h3>{ACT4.fiscal.heading}</h3>
          {ACT4.fiscal.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <h4>{ACT4.copy.cdiTitle}</h4>
          <div ref={diagramRef}>
            <ProcessDiagram
              drawProgress={visual.drawProgress}
              fromLabel={ACT4.copy.diagramFrom}
              orientation={orientation}
              stepGlow={visual.stepGlow}
              steps={steps}
              toLabel={ACT4.copy.diagramTo}
            />
          </div>
          <p data-withholding>{ACT4.withholdingNote}</p>
          <p data-tax-advice role="note">
            {ACT4.taxAdviceNote}
          </p>
          <ProcessStepList
            activeIndex={visual.pasoActivo}
            onSelect={onSelect}
            stepLabel={ACT4.copy.cdiStepLabel}
            steps={steps}
          />
          <Disclaimer variant="inline" />
        </section>
        <section data-guarantees>
          <h3>{ACT4.guarantees.heading}</h3>
          {ACT4.guarantees.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <GuaranteeCards guarantees={guarantees} progress={visual.guaranteeProgress} />
          <p data-capital-protection>{ACT4.capitalProtectionNote}</p>
          <Disclaimer variant="inline" />
        </section>
        <a data-track="cta" data-track-position="act" href={ACT4.cta.href}>
          {ACT4.cta.label}
        </a>
      </div>
    </Scene>
  );
}

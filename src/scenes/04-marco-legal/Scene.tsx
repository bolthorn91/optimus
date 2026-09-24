import { useLayoutEffect, useMemo, useRef, useState } from 'react';

import { Disclaimer } from '@/components/Disclaimer';
import { ProcessDiagram } from '@/components/ProcessDiagram';
import { ProcessStepList } from '@/components/ProcessStepList';
import { RomanNumeral } from '@/components/RomanNumeral';
import { paintProcessDiagram } from '@/motion/paintProcessDiagram';
import { Scene } from '@/motion/Scene';
import { useProcessOrientation } from '@/motion/useProcessOrientation';
import { AnchorStat } from '@/scenes/04-marco-legal/AnchorStat';
import { AreaComparison } from '@/scenes/04-marco-legal/AreaComparison';
import { ACT4 } from '@/scenes/04-marco-legal/content';
import { stepVisual } from '@/scenes/04-marco-legal/stepVisual';

import './scene.css';

export function Act4Scene() {
  const diagramRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(ACT4.cdiSteps.length - 1);
  const orientation = useProcessOrientation();
  const visual = useMemo(() => stepVisual(ACT4.cdiSteps.length, active), [active]);
  const steps = useMemo(
    () =>
      ACT4.cdiSteps.map((step) => ({
        id: String(step.index),
        title: step.title,
        body: step.body,
      })),
    [],
  );

  useLayoutEffect(() => {
    const root = diagramRef.current;
    if (!root) return undefined;
    return paintProcessDiagram(root, visual.drawProgress, visual.stepGlow);
  }, [orientation, visual]);

  return (
    <Scene
      act={ACT4.act}
      background="var(--color-navy-deep)"
      className="on-navy"
      height="100vh"
      id="marco"
    >
      <div className="act4">
        <h2>
          <RomanNumeral value={ACT4.act} />. {ACT4.title}
        </h2>
        <p>{ACT4.intro}</p>
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
          <AnchorStat
            equivalence={ACT4.anchorStat.equivalence}
            hectares={ACT4.anchorStat.hectares}
            label={ACT4.anchorStat.label}
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
            activeIndex={active}
            onSelect={setActive}
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
          <ul className="act4-guarantees">
            {ACT4.guarantees.pillars.map((item) => (
              <li data-guarantee={item.index} data-icon={item.icon} key={item.index}>
                <h4>{item.pillar}</h4>
                <p>{item.mechanism}</p>
              </li>
            ))}
          </ul>
          <p data-capital-protection>{ACT4.capitalProtectionNote}</p>
          <Disclaimer variant="inline" />
        </section>
        <a href={ACT4.cta.href}>{ACT4.cta.label}</a>
      </div>
    </Scene>
  );
}

import { useCallback, useRef, useState } from 'react';

import { ActSeal } from '@/components/ActSeal';
import { PendingValue } from '@/components/PendingValue';
import { RomanNumeral } from '@/components/RomanNumeral';
import { Scene } from '@/motion/Scene';
import { useGsapScene } from '@/motion/useGsapScene';
import { useReducedMotionSafe } from '@/motion/useReducedMotionSafe';
import { ACT67 } from '@/scenes/06-firma/content';
import { DepartmentCards } from '@/scenes/06-firma/DepartmentCards';
import { FounderCard } from '@/scenes/06-firma/FounderCard';
import { Glossary } from '@/scenes/06-firma/Glossary';
import { IntermediationChain } from '@/scenes/06-firma/IntermediationChain';
import { InvestorRange } from '@/scenes/06-firma/InvestorRange';
import { OperationalRoutes } from '@/scenes/06-firma/OperationalRoutes';
import { choreographAct67, type Act67State } from '@/scenes/06-firma/timeline';

import './scene.css';

const HEIGHT = '100svh';

type Act67View = Pick<
  Act67State,
  'founderProgress' | 'conventionalDraw' | 'optimvsDraw' | 'deptProgress' | 'routesProgress'
>;

function viewOf(state: Act67State): Act67View {
  return {
    founderProgress: state.founderProgress,
    conventionalDraw: state.conventionalDraw,
    optimvsDraw: state.optimvsDraw,
    deptProgress: state.deptProgress,
    routesProgress: state.routesProgress,
  };
}

function applyChrome(node: HTMLElement, state: Act67State): void {
  node.style.setProperty('--firm-opacity', String(state.firmOpacity));
  node.style.setProperty('--quote-opacity', String(state.quoteOpacity));
}

export function Act67Scene() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotionSafe();
  const [visual, setVisual] = useState(() => viewOf(choreographAct67(reduced ? 1 : 0)));

  const apply = useCallback((state: Act67State) => {
    if (ref.current) applyChrome(ref.current, state);
    setVisual(viewOf(state));
  }, []);

  useGsapScene({
    ref,
    choreograph: choreographAct67,
    apply,
    // La firma y el asesoramiento son demasiado largos para vivir dentro de un pin: el
    // recorrido se lee de arriba abajo y las cadenas se dibujan con el scroll normal.
    pin: false,
    end: 'bottom bottom',
    scrub: true,
    sceneId: 'firma',
  });

  return (
    <Scene
      act={ACT67.acts[0]}
      background="var(--color-navy-mid)"
      className="on-navy"
      height={HEIGHT}
      id="firma"
      ref={ref}
    >
      <div className="act67">
        <div className="act67-firm">
          <h2>
            <RomanNumeral value={ACT67.acts[0]} />. {ACT67.title}
          </h2>
          <p>{ACT67.firmSummary}</p>
        </div>
        <h3>{ACT67.copy.founderHeading}</h3>
        <FounderCard founder={ACT67.founder} progress={visual.founderProgress} />
        <p data-differential>{ACT67.differential}</p>
        <IntermediationChain
          conventional={ACT67.intermediationChain.conventional}
          conventionalDraw={visual.conventionalDraw}
          optimvs={ACT67.intermediationChain.optimvs}
          optimvsDraw={visual.optimvsDraw}
        />
        <p data-authorisation>
          {ACT67.authorisationNote.literal}{' '}
          <PendingValue
            debtId={ACT67.authorisationNote.debtId}
            label={ACT67.authorisationNote.label}
          />
        </p>
        <p data-accompaniment>{ACT67.accompaniment}</p>
        <DepartmentCards departments={ACT67.departments} progress={visual.deptProgress} />
        <InvestorRange range={ACT67.investorRange} />
        <ActSeal act={ACT67.acts[1]} />
        <section id="asesoramiento">
          <h2>
            <RomanNumeral value={ACT67.acts[1]} />. {ACT67.routesTitle}
          </h2>
          <p>{ACT67.routesIntro}</p>
          <OperationalRoutes progress={visual.routesProgress} routes={ACT67.routes} />
          <p data-cdi-disambiguation>{ACT67.cdiDisambiguation}</p>
          <p data-introducing-broker>{ACT67.introducingBrokerNote}</p>
          <h3>{ACT67.copy.organisationsLabel}</h3>
          <ul data-organisations>
            {ACT67.organisations.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
          <p>
            <PendingValue debtId={ACT67.alliedPending.debtId} label={ACT67.alliedPending.label} />
          </p>
          <Glossary entries={ACT67.glossary} />
        </section>
      </div>
    </Scene>
  );
}

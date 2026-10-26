import { ActSeal } from '@/components/ActSeal';
import { PendingValue } from '@/components/PendingValue';
import { RomanNumeral } from '@/components/RomanNumeral';
import { Scene } from '@/motion/Scene';
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

/**
 * El acto VI–VII es una lectura larga, no una escena anclada. Al quitar el pin, el
 * progreso de scroll se quedaba a cero al entrar y ocultaba la firma, la biografía y
 * las cadenas. Se sirve el estado final: todo el contenido existe y los mapas se
 * dibujan completos; la entrada se resuelve con CSS al llegar a cada bloque.
 */
const VISUAL = viewOf(choreographAct67(1));

export function Act67Scene() {
  return (
    <Scene
      act={ACT67.acts[0]}
      background="var(--color-navy-mid)"
      className="on-navy"
      height={HEIGHT}
      id="firma"
    >
      <div className="act67">
        <div className="act67-firm">
          <h2>
            <RomanNumeral value={ACT67.acts[0]} />. {ACT67.title}
          </h2>
          <p>{ACT67.firmSummary}</p>
        </div>
        <FounderCard founder={ACT67.founder} progress={VISUAL.founderProgress} />
        <p data-differential>{ACT67.differential}</p>
        <IntermediationChain
          conventional={ACT67.intermediationChain.conventional}
          conventionalDraw={VISUAL.conventionalDraw}
          optimvs={ACT67.intermediationChain.optimvs}
          optimvsDraw={VISUAL.optimvsDraw}
        />
        <p data-authorisation>
          {ACT67.authorisationNote.literal}{' '}
          <PendingValue
            debtId={ACT67.authorisationNote.debtId}
            label={ACT67.authorisationNote.label}
          />
        </p>
        <p data-accompaniment>{ACT67.accompaniment}</p>
        <DepartmentCards departments={ACT67.departments} progress={VISUAL.deptProgress} />
        <InvestorRange range={ACT67.investorRange} />
        <ActSeal act={ACT67.acts[1]} />
        <section id="asesoramiento">
          <h2>
            <RomanNumeral value={ACT67.acts[1]} />. {ACT67.routesTitle}
          </h2>
          <p>{ACT67.routesIntro}</p>
          <OperationalRoutes progress={VISUAL.routesProgress} routes={ACT67.routes} />
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

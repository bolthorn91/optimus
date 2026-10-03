import { ActSeal } from '@/components/ActSeal';
import { PendingValue } from '@/components/PendingValue';
import { RomanNumeral } from '@/components/RomanNumeral';
import { Scene } from '@/motion/Scene';
import { ACT67 } from '@/scenes/06-firma/content';
import { DepartmentCards } from '@/scenes/06-firma/DepartmentCards';
import { FounderCard } from '@/scenes/06-firma/FounderCard';
import { Glossary } from '@/scenes/06-firma/Glossary';
import { InvestorRange } from '@/scenes/06-firma/InvestorRange';
import { OperationalRoutes } from '@/scenes/06-firma/OperationalRoutes';

import './scene.css';

const HEIGHT = '100vh';
const FULL_PROGRESS = 1;
const DEPT_PROGRESS = [1, 1, 1] as const;

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
        <h2>
          <RomanNumeral value={ACT67.acts[0]} />. {ACT67.title}
        </h2>
        <p>{ACT67.firmSummary}</p>
        <h3>{ACT67.copy.founderHeading}</h3>
        <FounderCard founder={ACT67.founder} progress={FULL_PROGRESS} />
        <p data-differential>{ACT67.differential}</p>
        <p data-authorisation>
          {ACT67.authorisationNote.literal}{' '}
          <PendingValue
            debtId={ACT67.authorisationNote.debtId}
            label={ACT67.authorisationNote.label}
          />
        </p>
        <p data-accompaniment>{ACT67.accompaniment}</p>
        <DepartmentCards departments={ACT67.departments} progress={DEPT_PROGRESS} />
        <InvestorRange range={ACT67.investorRange} />
        <ActSeal act={ACT67.acts[1]} />
        <section id="asesoramiento">
          <h2>
            <RomanNumeral value={ACT67.acts[1]} />. {ACT67.routesTitle}
          </h2>
          <p>{ACT67.routesIntro}</p>
          <OperationalRoutes progress={FULL_PROGRESS} routes={ACT67.routes} />
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

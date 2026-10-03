import { useSyncExternalStore } from 'react';
import { useSearchParams } from 'react-router';

import { ContactDetails } from '@/components/ContactDetails';
import { Disclaimer } from '@/components/Disclaimer';
import { GuaranteeCards, toGuaranteeCardItems } from '@/components/GuaranteeCards';
import { formatCurrency } from '@/lib/format';
import type { ProjectionInput } from '@/lib/projection';
import { Scene } from '@/motion/Scene';
import { ACT4 } from '@/scenes/04-marco-legal/content';
import { parseContactQuery, parseContactVehicle } from '@/scenes/05-activos-simulador/contactHref';
import { SCENARIO_LABELS, VEHICLE_LABELS } from '@/scenes/05-activos-simulador/content';
import {
  getSimulatorSessionSnapshot,
  subscribeSimulatorSession,
} from '@/scenes/05-activos-simulador/simulatorSession';
import { ContactForm } from '@/scenes/07-contacto/ContactForm';
import { CONTACT_SCENE } from '@/scenes/07-contacto/content';
import type { SimulatorContextRow } from '@/scenes/07-contacto/SimulatorContext';

import './scene.css';

const HEIGHT = '100vh';

const GUARANTEES = toGuaranteeCardItems(ACT4.guarantees.pillars);

function labelledSnapshot(input: ProjectionInput): SimulatorContextRow[] {
  return [
    { label: CONTACT_SCENE.copy.capital, value: formatCurrency(input.capital) },
    {
      label: CONTACT_SCENE.copy.horizon,
      value: `${String(input.years)} ${CONTACT_SCENE.copy.horizonUnit}`,
    },
    { label: CONTACT_SCENE.copy.scenario, value: SCENARIO_LABELS[input.scenario] },
    { label: CONTACT_SCENE.copy.vehicle, value: VEHICLE_LABELS[input.vehicle] },
  ];
}

export function ContactScene() {
  const [params] = useSearchParams();
  const session = useSyncExternalStore(
    subscribeSimulatorSession,
    getSimulatorSessionSnapshot,
    getSimulatorSessionSnapshot,
  );
  const fromQuery = parseContactQuery(params);
  const snapshot = fromQuery ?? session?.input;
  const initialInterest = parseContactVehicle(params) ?? snapshot?.vehicle;

  return (
    <Scene background="var(--color-navy-deep)" className="on-navy" height={HEIGHT} id="contacto">
      <div className="act-contact">
        <h2>{CONTACT_SCENE.title}</h2>
        <p>{CONTACT_SCENE.subtitle}</p>
        <ul>
          {CONTACT_SCENE.benefits.map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>
        <div className="act-contact__layout">
          <ContactForm
            initialInterest={initialInterest}
            simulatorContext={snapshot ? labelledSnapshot(snapshot) : undefined}
          />
          <aside data-conversion>
            <h3>{ACT4.guarantees.heading}</h3>
            <GuaranteeCards guarantees={GUARANTEES} />
            <ContactDetails />
            <Disclaimer variant="inline" />
          </aside>
        </div>
      </div>
    </Scene>
  );
}

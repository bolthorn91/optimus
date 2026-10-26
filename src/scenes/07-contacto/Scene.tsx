import { useCallback, useRef, useSyncExternalStore } from 'react';
import { Link } from 'react-router';

import { ContactDetails } from '@/components/ContactDetails';
import { Disclaimer } from '@/components/Disclaimer';
import { GuaranteeCards, toGuaranteeCardItems } from '@/components/GuaranteeCards';
import { Scene } from '@/motion/Scene';
import { useGsapScene } from '@/motion/useGsapScene';
import { ACT4 } from '@/scenes/04-marco-legal/content';
import { contactHref } from '@/scenes/05-activos-simulador/contactHref';
import {
  getSimulatorSessionSnapshot,
  subscribeSimulatorSession,
} from '@/scenes/05-activos-simulador/simulatorSession';
import { CONTACT_SCENE } from '@/scenes/07-contacto/content';
import { choreographActContact, type ActContactState } from '@/scenes/07-contacto/timeline';
import { labelledSnapshot } from '@/scenes/07-contacto/useContactScenario';

import './scene.css';

const HEIGHT = '100svh';

const GUARANTEES = toGuaranteeCardItems(ACT4.guarantees.pillars);

function applyChrome(node: HTMLElement, state: ActContactState): void {
  node.style.setProperty('--contact-rise', String(state.rise));
}

export function ContactScene() {
  const ref = useRef<HTMLElement>(null);
  const session = useSyncExternalStore(
    subscribeSimulatorSession,
    getSimulatorSessionSnapshot,
    getSimulatorSessionSnapshot,
  );
  const snapshot = session?.input;
  const context = snapshot === undefined ? undefined : labelledSnapshot(snapshot);
  const href = contactHref(snapshot?.vehicle, snapshot);

  const apply = useCallback((state: ActContactState) => {
    if (ref.current) applyChrome(ref.current, state);
  }, []);

  useGsapScene({
    ref,
    choreograph: choreographActContact,
    apply,
    pin: false,
    scrub: true,
    start: 'top 85%',
    end: 'top 35%',
    sceneId: 'contacto',
  });

  return (
    <Scene
      background="var(--color-navy-deep)"
      className="on-navy"
      height={HEIGHT}
      id="contacto"
      ref={ref}
    >
      <div className="act-contact">
        <h2>{CONTACT_SCENE.title}</h2>
        <p>{CONTACT_SCENE.subtitle}</p>
        <ul>
          {CONTACT_SCENE.benefits.map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>
        <div className="act-contact__layout">
          <div className="contact-cta">
            {context === undefined ? (
              <p className="contact-cta__prompt">{CONTACT_SCENE.ctaPrompt}</p>
            ) : (
              <section aria-labelledby="contacto-escenario" className="contact-cta__scenario">
                <h3 id="contacto-escenario">{CONTACT_SCENE.scenarioHeading}</h3>
                <dl>
                  {context.map((row) => (
                    <div key={row.label}>
                      <dt>{row.label}</dt>
                      <dd>{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}
            <Link
              className="cta contact-cta__button"
              data-track="cta"
              data-track-position="contact"
              to={href}
            >
              {CONTACT_SCENE.cta}
            </Link>
            <p className="contact-cta__note">{CONTACT_SCENE.ctaNote}</p>
            <ContactDetails />
          </div>
          <aside data-conversion>
            <h3>{ACT4.guarantees.heading}</h3>
            <GuaranteeCards guarantees={GUARANTEES} />
            <Disclaimer variant="inline" />
          </aside>
        </div>
      </div>
    </Scene>
  );
}

import { Link } from 'react-router';

import { ContactDetails } from '@/components/ContactDetails';
import { Disclaimer } from '@/components/Disclaimer';
import { GuaranteeCards, toGuaranteeCardItems } from '@/components/GuaranteeCards';
import { DETAIL_COPY } from '@/pages/detailCopy';
import { ACT4 } from '@/scenes/04-marco-legal/content';
import { ContactForm } from '@/scenes/07-contacto/ContactForm';
import { CONTACT_SCENE } from '@/scenes/07-contacto/content';
import { useContactScenario } from '@/scenes/07-contacto/useContactScenario';

import './contact-page.css';

const GUARANTEES = toGuaranteeCardItems(ACT4.guarantees.pillars);

export function ContactPage() {
  const { snapshot, initialInterest, context } = useContactScenario();

  return (
    <article className="contact-page on-navy" data-contact-page>
      <div className="contact-page__layout">
        <header className="contact-page__header">
          <p className="contact-page__back">
            <Link to="/">{DETAIL_COPY.backToHome}</Link>
          </p>
          <p className="contact-page__eyebrow">Reserva de sesión</p>
          <h1>{CONTACT_SCENE.pageTitle}</h1>
          <p className="contact-page__lead">{CONTACT_SCENE.subtitle}</p>
          <p className="contact-page__scenario">
            {snapshot === undefined ? (
              <>
                {CONTACT_SCENE.scenarioEmpty}{' '}
                <Link to="/#simulador">{CONTACT_SCENE.scenarioConfigure}</Link>
              </>
            ) : (
              <>
                <span>{CONTACT_SCENE.scenarioHeading}:</span>{' '}
                {context?.map((row) => row.value).join(' · ')}{' '}
                <Link to="/#simulador">{CONTACT_SCENE.scenarioEdit}</Link>
              </>
            )}
          </p>
        </header>

        <section
          aria-labelledby="contact-form-heading"
          className="contact-page__form"
          id="formulario"
        >
          <h2 id="contact-form-heading">{CONTACT_SCENE.formHeading}</h2>
          <ContactForm
            initialInterest={initialInterest}
            showContext={false}
            simulatorContext={context}
          />
        </section>

        <div className="contact-page__info">
          <section aria-labelledby="contact-benefits-heading" className="contact-page__benefits">
            <h2 id="contact-benefits-heading">{CONTACT_SCENE.benefitsHeading}</h2>
            <ul>
              {CONTACT_SCENE.benefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </section>

          <section
            aria-labelledby="contact-guarantees-heading"
            className="contact-page__guarantees"
          >
            <h2 id="contact-guarantees-heading">{ACT4.guarantees.heading}</h2>
            <GuaranteeCards guarantees={GUARANTEES} />
          </section>

          <ContactDetails />
          <Disclaimer variant="inline" />
        </div>
      </div>
    </article>
  );
}

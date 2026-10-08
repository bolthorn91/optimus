import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from 'react';

import { trackEvent } from '@/lib/analytics';
import {
  CAPITAL_BANDS,
  EMPTY_CONTACT_VALUES,
  INTEREST_IDS,
  MESSAGE_MAX,
  PHONE_PREFIXES,
  TAX_RESIDENCES,
  decideSubmission,
  type ContactContextRow,
  type ContactErrorCode,
  type ContactField,
  type ContactValues,
} from '@/lib/contact-form';
import { sendContactEmail, type SendResult } from '@/lib/email';
import type { VehicleId } from '@/lib/projection-assumptions';
import { ConsentFields } from '@/scenes/07-contacto/ConsentFields';
import { CONTACT_SCENE } from '@/scenes/07-contacto/content';
import { Field } from '@/scenes/07-contacto/Field';
import { SimulatorContext } from '@/scenes/07-contacto/SimulatorContext';

import './contact-form.css';

function errorText(code: ContactErrorCode | undefined): string | undefined {
  return code === undefined ? undefined : CONTACT_SCENE.errors[code];
}

type FormStatus = 'idle' | 'sending' | 'success' | 'error' | 'rateLimited';

export function ContactForm({
  initialInterest,
  send = sendContactEmail,
  simulatorContext,
}: {
  initialInterest?: VehicleId | undefined;
  send?: typeof sendContactEmail;
  simulatorContext?: readonly ContactContextRow[] | undefined;
}) {
  const formId = useId();
  const attempts = useRef<number[]>([]);
  const busy = useRef(false);
  const successRef = useRef<HTMLParagraphElement>(null);
  const [values, setValues] = useState<ContactValues>(() => ({ ...EMPTY_CONTACT_VALUES }));
  const [errors, setErrors] = useState<Partial<Record<ContactField, ContactErrorCode>>>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const interest = values.interest !== '' ? values.interest : (initialInterest ?? '');

  useLayoutEffect(() => {
    if (status === 'success') successRef.current?.focus();
  }, [status]);

  function fieldId(name: ContactField): string {
    return `${formId}-${name}`;
  }

  function patch(partial: Partial<ContactValues>): void {
    setValues((current) => ({ ...current, ...partial }));
  }

  function bindText(field: Exclude<ContactField, 'consentData' | 'consentMarketing'>) {
    return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      patch({ [field]: event.currentTarget.value });
    };
  }

  function bindCheck(field: 'consentData' | 'consentMarketing') {
    return (event: ChangeEvent<HTMLInputElement>) => {
      patch({ [field]: event.currentTarget.checked });
    };
  }

  function applySend(result: SendResult): void {
    busy.current = false;
    if (result.ok) trackEvent('form_submit');
    setStatus(result.ok ? 'success' : 'error');
  }

  function onSubmit(event: SyntheticEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (busy.current || status === 'sending') return;
    const payload = { ...values, interest };
    const decision = decideSubmission(payload, attempts.current, Date.now());
    switch (decision.kind) {
      case 'honeypot':
        setErrors({});
        setStatus('success');
        return;
      case 'invalid':
        setErrors(decision.errors);
        setStatus('idle');
        return;
      case 'rateLimited':
        setErrors({});
        setStatus('rateLimited');
        return;
      case 'accepted':
        attempts.current = decision.attempts;
        busy.current = true;
        setErrors({});
        setStatus('sending');
        void send(payload, simulatorContext === undefined ? {} : { simulatorContext }).then(
          applySend,
          () => {
            applySend({ ok: false, reason: 'network' });
          },
        );
    }
  }

  if (status === 'success') {
    return (
      <div className="contact-form" data-contact-form>
        <p data-form-status="success" ref={successRef} role="status" tabIndex={-1}>
          {CONTACT_SCENE.copy.success}
        </p>
      </div>
    );
  }

  return (
    <form
      aria-busy={status === 'sending'}
      className="contact-form"
      data-contact-form
      noValidate
      onSubmit={onSubmit}
    >
      <Field
        error={errorText(errors.fullName)}
        field="fullName"
        id={fieldId('fullName')}
        label={CONTACT_SCENE.copy.fullName}
      >
        {(a11y) => (
          <input
            {...a11y}
            autoComplete="name"
            name="fullName"
            onChange={bindText('fullName')}
            value={values.fullName}
          />
        )}
      </Field>
      <Field
        error={errorText(errors.email)}
        field="email"
        id={fieldId('email')}
        label={CONTACT_SCENE.copy.email}
      >
        {(a11y) => (
          <input
            {...a11y}
            autoComplete="email"
            name="email"
            onChange={bindText('email')}
            type="email"
            value={values.email}
          />
        )}
      </Field>
      <fieldset>
        <legend>{CONTACT_SCENE.copy.phone}</legend>
        <div className="contact-form__phone">
          <Field
            error={undefined}
            field="phonePrefix"
            id={fieldId('phonePrefix')}
            label={CONTACT_SCENE.copy.phonePrefix}
          >
            {(a11y) => (
              <select
                {...a11y}
                autoComplete="tel-country-code"
                name="phonePrefix"
                onChange={bindText('phonePrefix')}
                value={values.phonePrefix}
              >
                {PHONE_PREFIXES.map((prefix) => (
                  <option key={prefix} value={prefix}>
                    {CONTACT_SCENE.phonePrefix[prefix]}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <Field
            error={errorText(errors.phone)}
            field="phone"
            id={fieldId('phone')}
            label={CONTACT_SCENE.copy.phoneNational}
          >
            {(a11y) => (
              <input
                {...a11y}
                autoComplete="tel-national"
                inputMode="numeric"
                name="phone"
                onChange={bindText('phone')}
                type="tel"
                value={values.phone}
              />
            )}
          </Field>
        </div>
      </fieldset>
      <Field
        error={errorText(errors.taxResidence)}
        field="taxResidence"
        id={fieldId('taxResidence')}
        label={CONTACT_SCENE.copy.taxResidence}
      >
        {(a11y) => (
          <select
            {...a11y}
            name="taxResidence"
            onChange={bindText('taxResidence')}
            value={values.taxResidence}
          >
            {TAX_RESIDENCES.map((code) => (
              <option key={code} value={code}>
                {CONTACT_SCENE.taxResidence[code]}
              </option>
            ))}
          </select>
        )}
      </Field>
      <Field
        error={errorText(errors.interest)}
        field="interest"
        id={fieldId('interest')}
        label={CONTACT_SCENE.copy.interest}
      >
        {(a11y) => (
          <select {...a11y} name="interest" onChange={bindText('interest')} value={interest}>
            <option value="">{CONTACT_SCENE.copy.interest}</option>
            {INTEREST_IDS.map((id) => (
              <option key={id} value={id}>
                {CONTACT_SCENE.interest[id]}
              </option>
            ))}
          </select>
        )}
      </Field>
      <Field
        error={errorText(errors.capitalBand)}
        field="capitalBand"
        id={fieldId('capitalBand')}
        label={CONTACT_SCENE.copy.capitalBand}
      >
        {(a11y) => (
          <select
            {...a11y}
            name="capitalBand"
            onChange={bindText('capitalBand')}
            value={values.capitalBand}
          >
            <option value="" />
            {CAPITAL_BANDS.map((id) => (
              <option key={id} value={id}>
                {CONTACT_SCENE.capitalBand[id]}
              </option>
            ))}
          </select>
        )}
      </Field>
      <Field
        error={errorText(errors.message)}
        field="message"
        id={fieldId('message')}
        label={CONTACT_SCENE.copy.message}
      >
        {(a11y) => (
          <>
            <textarea
              {...a11y}
              maxLength={MESSAGE_MAX}
              name="message"
              onChange={bindText('message')}
              value={values.message}
            />
            <p data-char-count>
              {CONTACT_SCENE.copy.messageCount(values.message.length, MESSAGE_MAX)}
            </p>
          </>
        )}
      </Field>
      {simulatorContext ? (
        <SimulatorContext notice={CONTACT_SCENE.copy.simulatorContext} rows={simulatorContext} />
      ) : null}
      <ConsentFields
        consentData={values.consentData}
        consentMarketing={values.consentMarketing}
        dataError={errors.consentData}
        dataErrorId={`${fieldId('consentData')}-error`}
        dataId={fieldId('consentData')}
        labelId={`${fieldId('consentData')}-copy`}
        marketingId={fieldId('consentMarketing')}
        onConsentData={bindCheck('consentData')}
        onConsentMarketing={bindCheck('consentMarketing')}
      />
      <div aria-hidden="true" data-honeypot>
        <label htmlFor={fieldId('honeypot')}>{CONTACT_SCENE.copy.honeypot}</label>
        <input
          autoComplete="off"
          id={fieldId('honeypot')}
          name="company"
          onChange={bindText('honeypot')}
          tabIndex={-1}
          value={values.honeypot}
        />
      </div>
      {status === 'sending' ? (
        <p data-form-status="sending" role="status">
          {CONTACT_SCENE.copy.sending}
        </p>
      ) : null}
      {status === 'error' ? (
        <p data-form-status="error" role="alert">
          {CONTACT_SCENE.copy.errorNetwork}
        </p>
      ) : null}
      {status === 'rateLimited' ? (
        <p data-error="rate" role="alert">
          {CONTACT_SCENE.copy.rateLimited}
        </p>
      ) : null}
      <button disabled={status === 'sending'} type="submit">
        {status === 'sending' ? CONTACT_SCENE.copy.sending : CONTACT_SCENE.copy.submit}
      </button>
    </form>
  );
}

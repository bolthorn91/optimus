import { useId, useRef, useState, type ChangeEvent, type SyntheticEvent } from 'react';

import {
  CAPITAL_BANDS,
  EMPTY_CONTACT_VALUES,
  INTEREST_IDS,
  MESSAGE_MAX,
  PHONE_PREFIXES,
  TAX_RESIDENCES,
  decideSubmission,
  type ContactErrorCode,
  type ContactField,
  type ContactValues,
} from '@/lib/contact-form';
import type { VehicleId } from '@/lib/projection-assumptions';
import { ConsentFields } from '@/scenes/07-contacto/ConsentFields';
import { CONTACT_SCENE } from '@/scenes/07-contacto/content';
import { Field } from '@/scenes/07-contacto/Field';
import { SimulatorContext, type SimulatorContextRow } from '@/scenes/07-contacto/SimulatorContext';

import './contact-form.css';

function errorText(code: ContactErrorCode | undefined): string | undefined {
  return code === undefined ? undefined : CONTACT_SCENE.errors[code];
}

export function ContactForm({
  initialInterest,
  simulatorContext,
}: {
  initialInterest?: VehicleId | undefined;
  simulatorContext?: readonly SimulatorContextRow[] | undefined;
}) {
  const formId = useId();
  const attempts = useRef<number[]>([]);
  const [values, setValues] = useState<ContactValues>(() => ({ ...EMPTY_CONTACT_VALUES }));
  const [errors, setErrors] = useState<Partial<Record<ContactField, ContactErrorCode>>>({});
  const [rateLimited, setRateLimited] = useState(false);
  const interest = values.interest !== '' ? values.interest : (initialInterest ?? '');

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

  function onSubmit(event: SyntheticEvent<HTMLFormElement>): void {
    event.preventDefault();
    const decision = decideSubmission({ ...values, interest }, attempts.current, Date.now());
    switch (decision.kind) {
      case 'honeypot':
        setErrors({});
        setRateLimited(false);
        return;
      case 'invalid':
        setErrors(decision.errors);
        setRateLimited(false);
        return;
      case 'rateLimited':
        setErrors({});
        setRateLimited(true);
        return;
      case 'accepted':
        attempts.current = decision.attempts;
        setErrors({});
        setRateLimited(false);
    }
  }

  return (
    <form className="contact-form" data-contact-form noValidate onSubmit={onSubmit}>
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
      {rateLimited ? (
        <p data-error="rate" role="alert">
          {CONTACT_SCENE.copy.rateLimited}
        </p>
      ) : null}
      <button type="submit">{CONTACT_SCENE.copy.submit}</button>
    </form>
  );
}

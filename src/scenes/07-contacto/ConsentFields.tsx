import type { ChangeEvent } from 'react';

import type { ContactErrorCode } from '@/lib/contact-form';
import { CONTACT_SCENE } from '@/scenes/07-contacto/content';

export function ConsentFields({
  consentData,
  consentMarketing,
  dataError,
  dataErrorId,
  dataId,
  labelId,
  marketingId,
  onConsentData,
  onConsentMarketing,
}: {
  consentData: boolean;
  consentMarketing: boolean;
  dataError: ContactErrorCode | undefined;
  dataErrorId: string;
  dataId: string;
  labelId: string;
  marketingId: string;
  onConsentData: (event: ChangeEvent<HTMLInputElement>) => void;
  onConsentMarketing: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  const copy = CONTACT_SCENE.copy.consentData;
  const errorText = dataError === undefined ? undefined : CONTACT_SCENE.errors[dataError];

  return (
    <>
      <div data-consent="data">
        <input
          aria-describedby={errorText ? dataErrorId : undefined}
          aria-invalid={errorText ? true : undefined}
          aria-labelledby={labelId}
          checked={consentData}
          id={dataId}
          name="consentData"
          onChange={onConsentData}
          type="checkbox"
        />
        <p id={labelId}>
          {copy.before}
          <a href={CONTACT_SCENE.privacyHref}>{copy.link}</a>
          {copy.after}
        </p>
        {errorText ? (
          <p data-error="consentData" id={dataErrorId} role="alert">
            {errorText}
          </p>
        ) : null}
      </div>
      <div data-consent="marketing">
        <input
          checked={consentMarketing}
          id={marketingId}
          name="consentMarketing"
          onChange={onConsentMarketing}
          type="checkbox"
        />
        <label htmlFor={marketingId}>{CONTACT_SCENE.copy.consentMarketing}</label>
      </div>
    </>
  );
}

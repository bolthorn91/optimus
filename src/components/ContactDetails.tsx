import { PendingValue } from '@/components/PendingValue';
import { CONTACT } from '@/content/contact';

import './contact-details.css';

export function ContactDetails() {
  return (
    <address data-contact-details>
      <p>{CONTACT.confidential}</p>
      <p>
        <PendingValue debtId={CONTACT.spainPhone.debtId} label={CONTACT.spainPhone.label} />
      </p>
      <p>
        <PendingValue debtId={CONTACT.argentinaPhone.debtId} label={CONTACT.argentinaPhone.label} />
      </p>
      <p>
        <PendingValue debtId={CONTACT.email.debtId} label={CONTACT.email.label} />
      </p>
      <p>
        <PendingValue debtId={CONTACT.domain.debtId} label={CONTACT.domain.label} />
      </p>
    </address>
  );
}

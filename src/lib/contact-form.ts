import { VEHICLE_IDS } from '@/lib/projection-assumptions';

export const INTEREST_IDS = [...VEHICLE_IDS, 'unspecified'] as const;
export type InterestId = (typeof INTEREST_IDS)[number];

export const CAPITAL_BANDS = ['minimum', 'uncapped'] as const;
export type CapitalBand = (typeof CAPITAL_BANDS)[number];

export const PHONE_PREFIXES = [
  '+34',
  '+54',
  '+49',
  '+33',
  '+39',
  '+351',
  '+44',
  '+1',
  '+41',
  '+32',
  '+31',
  '+52',
  '+56',
  '+598',
] as const;
export type PhonePrefix = (typeof PHONE_PREFIXES)[number];

export const TAX_RESIDENCES = [
  'ES',
  'AR',
  'DE',
  'FR',
  'IT',
  'PT',
  'GB',
  'CH',
  'BE',
  'NL',
  'OTHER',
] as const;
export type TaxResidence = (typeof TAX_RESIDENCES)[number];

export const NAME_MAX = 120;
export const MESSAGE_MAX = 2000;
export const RATE_MAX = 3;
export const RATE_WINDOW_MS = 10 * 60 * 1000;

export type ContactErrorCode = 'required' | 'tooLong' | 'invalid' | 'rejected';

export interface ContactValues {
  fullName: string;
  email: string;
  phonePrefix: string;
  phone: string;
  taxResidence: string;
  interest: string;
  capitalBand: string;
  message: string;
  consentData: boolean;
  consentMarketing: boolean;
  honeypot: string;
}

export type ContactField = keyof ContactValues;

export interface ContactValidation {
  valid: boolean;
  errors: Partial<Record<ContactField, ContactErrorCode>>;
}

export type SubmissionDecision =
  | { kind: 'honeypot' }
  | { kind: 'invalid'; errors: ContactValidation['errors'] }
  | { kind: 'rateLimited' }
  | { kind: 'accepted'; attempts: number[] };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NATIONAL_PHONE_PATTERN = /^\d{6,15}$/;

export const EMPTY_CONTACT_VALUES: ContactValues = {
  fullName: '',
  email: '',
  phonePrefix: '+34',
  phone: '',
  taxResidence: 'ES',
  interest: '',
  capitalBand: '',
  message: '',
  consentData: false,
  consentMarketing: false,
  honeypot: '',
};

export function isInterest(value: string): value is InterestId {
  return INTEREST_IDS.some((id) => id === value);
}

export function isCapitalBand(value: string): value is CapitalBand {
  return CAPITAL_BANDS.some((id) => id === value);
}

export function isPhonePrefix(value: string): value is PhonePrefix {
  return PHONE_PREFIXES.some((id) => id === value);
}

export function isTaxResidence(value: string): value is TaxResidence {
  return TAX_RESIDENCES.some((id) => id === value);
}

function blank(value: string): boolean {
  return value.trim().length === 0;
}

export function composePhone(prefix: string, national: string): string {
  const digits = national.replace(/\s+/g, '');
  if (digits.length === 0) return '';
  return `${prefix} ${digits}`;
}

export function validate(values: ContactValues): ContactValidation {
  const errors: ContactValidation['errors'] = {};

  if (blank(values.fullName)) errors.fullName = 'required';
  else if (values.fullName.length > NAME_MAX) errors.fullName = 'tooLong';

  if (blank(values.email)) errors.email = 'required';
  else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'invalid';

  if (blank(values.phone)) errors.phone = 'required';
  else if (
    !isPhonePrefix(values.phonePrefix) ||
    !NATIONAL_PHONE_PATTERN.test(values.phone.replace(/\s+/g, ''))
  ) {
    errors.phone = 'invalid';
  }

  if (blank(values.taxResidence)) errors.taxResidence = 'required';
  else if (!isTaxResidence(values.taxResidence)) errors.taxResidence = 'invalid';

  if (!isInterest(values.interest)) errors.interest = 'invalid';

  if (!blank(values.capitalBand) && !isCapitalBand(values.capitalBand)) {
    errors.capitalBand = 'invalid';
  }

  if (values.message.length > MESSAGE_MAX) errors.message = 'tooLong';

  if (!values.consentData) errors.consentData = 'required';

  if (!blank(values.honeypot)) errors.honeypot = 'rejected';

  return { valid: Object.keys(errors).length === 0, errors };
}

export function isRateLimited(attempts: readonly number[], now: number): boolean {
  return attempts.filter((stamp) => now - stamp < RATE_WINDOW_MS).length >= RATE_MAX;
}

export function recordAttempt(attempts: readonly number[], now: number): number[] {
  return [...attempts.filter((stamp) => now - stamp < RATE_WINDOW_MS), now];
}

export function decideSubmission(
  values: ContactValues,
  attempts: readonly number[],
  now: number,
): SubmissionDecision {
  const result = validate(values);
  if (result.errors.honeypot === 'rejected') return { kind: 'honeypot' };
  if (!result.valid) return { kind: 'invalid', errors: result.errors };
  if (isRateLimited(attempts, now)) return { kind: 'rateLimited' };
  return { kind: 'accepted', attempts: recordAttempt(attempts, now) };
}

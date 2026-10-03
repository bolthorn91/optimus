import { describe, expect, it } from 'vitest';

import {
  CAPITAL_BANDS,
  composePhone,
  decideSubmission,
  EMPTY_CONTACT_VALUES,
  INTEREST_IDS,
  isRateLimited,
  MESSAGE_MAX,
  NAME_MAX,
  RATE_MAX,
  RATE_WINDOW_MS,
  recordAttempt,
  validate,
  type ContactValues,
} from '@/lib/contact-form';
import { VEHICLE_IDS } from '@/lib/projection-assumptions';

const VALID: ContactValues = {
  ...EMPTY_CONTACT_VALUES,
  fullName: 'Ana Pérez',
  email: 'ana@example.com',
  phonePrefix: '+34',
  phone: '612345678',
  taxResidence: 'ES',
  interest: 'real-estate',
  consentData: true,
};

describe('INTEREST_IDS', () => {
  it('extiende los tres vehículos con unspecified', () => {
    expect(INTEREST_IDS).toEqual([...VEHICLE_IDS, 'unspecified']);
  });
});

describe('validate', () => {
  it('FRM-01 · todos los campos válidos, consentimiento comercial omitido', () => {
    const result = validate(VALID);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('FRM-02 · nombre, email, teléfono o residencia vacíos exigen required', () => {
    expect(validate({ ...VALID, fullName: '   ' }).errors.fullName).toBe('required');
    expect(validate({ ...VALID, email: '' }).errors.email).toBe('required');
    expect(validate({ ...VALID, phone: '' }).errors.phone).toBe('required');
    expect(validate({ ...VALID, taxResidence: ' ' }).errors.taxResidence).toBe('required');
  });

  it('FRM-03 · emails malformados son invalid', () => {
    for (const email of ['ana', 'ana@', '@x.com', 'a@b', 'ana @x.com']) {
      expect(validate({ ...VALID, email }).errors.email, email).toBe('invalid');
    }
  });

  it('FRM-04 · sin consentimiento de datos es required', () => {
    expect(validate({ ...VALID, consentData: false }).errors.consentData).toBe('required');
  });

  it('FRM-05 · sin consentimiento comercial sigue siendo válido', () => {
    const result = validate({ ...VALID, consentMarketing: false });
    expect(result.valid).toBe(true);
    expect(result.errors.consentMarketing).toBeUndefined();
  });

  it('FRM-06 · honeypot relleno se rechaza', () => {
    const result = validate({ ...VALID, honeypot: 'http://spam.test' });
    expect(result.valid).toBe(false);
    expect(result.errors.honeypot).toBe('rejected');
  });

  it('FRM-07 · mensaje de más de 2000 caracteres es tooLong', () => {
    expect(validate({ ...VALID, message: 'm'.repeat(MESSAGE_MAX) }).valid).toBe(true);
    expect(validate({ ...VALID, message: 'm'.repeat(MESSAGE_MAX + 1) }).errors.message).toBe(
      'tooLong',
    );
  });

  it('nombre demasiado largo es tooLong', () => {
    expect(validate({ ...VALID, fullName: 'a'.repeat(NAME_MAX) }).valid).toBe(true);
    expect(validate({ ...VALID, fullName: 'a'.repeat(NAME_MAX + 1) }).errors.fullName).toBe(
      'tooLong',
    );
  });

  it('interés fuera del enum e horquilla inventada son invalid', () => {
    expect(validate({ ...VALID, interest: 'crypto' }).errors.interest).toBe('invalid');
    expect(validate({ ...VALID, capitalBand: 'millions' }).errors.capitalBand).toBe('invalid');
    expect(validate({ ...VALID, capitalBand: CAPITAL_BANDS[0] }).valid).toBe(true);
  });

  it('teléfono o residencia fuera de formato son invalid', () => {
    expect(validate({ ...VALID, phone: '12' }).errors.phone).toBe('invalid');
    expect(validate({ ...VALID, phone: 'abc123456' }).errors.phone).toBe('invalid');
    expect(validate({ ...VALID, phonePrefix: '+999' }).errors.phone).toBe('invalid');
    expect(validate({ ...VALID, taxResidence: 'XX' }).errors.taxResidence).toBe('invalid');
  });
});

describe('teléfono', () => {
  it('composePhone omite el prefijo si el nacional está vacío', () => {
    expect(composePhone('+34', '')).toBe('');
    expect(composePhone('+34', '612 345 678')).toBe('+34 612345678');
  });
});

describe('decideSubmission', () => {
  it('el honeypot gana aunque el resto sea válido', () => {
    expect(decideSubmission({ ...VALID, honeypot: 'http://spam.test' }, [], 0)).toEqual({
      kind: 'honeypot',
    });
  });

  it('invalid devuelve los errores de validate', () => {
    expect(decideSubmission({ ...VALID, fullName: '' }, [], 0)).toEqual({
      kind: 'invalid',
      errors: { fullName: 'required' },
    });
  });

  it('rateLimited cuando hay RATE_MAX intentos en la ventana', () => {
    const start = 1_000_000;
    const attempts = Array.from({ length: RATE_MAX }, (_, i) => start + i);
    expect(decideSubmission(VALID, attempts, start + RATE_MAX)).toEqual({ kind: 'rateLimited' });
  });

  it('accepted registra el intento', () => {
    const now = 1_000_000;
    expect(decideSubmission(VALID, [], now)).toEqual({ kind: 'accepted', attempts: [now] });
  });
});

describe('límite de frecuencia', () => {
  it('el cuarto intento dentro de la ventana queda limitado', () => {
    const start = 1_000_000;
    let attempts: number[] = [];
    for (let i = 0; i < RATE_MAX; i += 1) {
      expect(isRateLimited(attempts, start + i)).toBe(false);
      attempts = recordAttempt(attempts, start + i);
    }
    expect(isRateLimited(attempts, start + RATE_MAX)).toBe(true);
    expect(isRateLimited(attempts, start + RATE_WINDOW_MS + RATE_MAX)).toBe(false);
  });
});

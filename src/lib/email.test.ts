import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it, vi } from 'vitest';

import { EMPTY_CONTACT_VALUES, type ContactValues } from '@/lib/contact-form';
import {
  EMAILJS_ENDPOINT,
  formatSimulatorContext,
  readEmailConfig,
  sendContactEmail,
  templateParams,
  type EmailFetch,
} from '@/lib/email';
import type { EnvSource } from '@/lib/env';

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

const CONFIGURED: EnvSource = {
  VITE_EMAILJS_SERVICE_ID: 'svc',
  VITE_EMAILJS_TEMPLATE_ID: 'tpl',
  VITE_EMAILJS_PUBLIC_KEY: 'pk',
};

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return walk(path);
    if (!/\.(ts|tsx|css)$/.test(name) || name.includes('.test.')) return [];
    return [path];
  });
}

describe('readEmailConfig', () => {
  it('exige las tres claves', () => {
    expect(readEmailConfig(CONFIGURED)).toEqual({
      serviceId: 'svc',
      templateId: 'tpl',
      publicKey: 'pk',
    });
    expect(readEmailConfig({})).toBeUndefined();
    expect(readEmailConfig({ VITE_EMAILJS_SERVICE_ID: 'svc' })).toBeUndefined();
  });
});

describe('templateParams', () => {
  it('compone el teléfono y omite el honeypot', () => {
    const params = templateParams({ ...VALID, honeypot: 'bot', consentMarketing: true }, [
      { label: 'Capital inicial', value: '150.000' },
    ]);
    expect(params.phone).toBe('+34 612345678');
    expect(params.consentData).toBe('yes');
    expect(params.consentMarketing).toBe('yes');
    expect(params.simulatorContext).toBe('Capital inicial: 150.000');
    expect(params).not.toHaveProperty('honeypot');
  });
});

describe('formatSimulatorContext', () => {
  it('vacío si no hay filas', () => {
    expect(formatSimulatorContext(undefined)).toBe('');
    expect(formatSimulatorContext([])).toBe('');
  });
});

describe('sendContactEmail', () => {
  it('sin claves no llama a la red', async () => {
    const fetchImpl: EmailFetch = vi.fn();
    await expect(sendContactEmail(VALID, { source: {}, fetchImpl })).resolves.toEqual({
      ok: false,
      reason: 'unconfigured',
    });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('un POST correcto es ok', async () => {
    const fetchImpl = vi.fn<EmailFetch>().mockResolvedValue({ ok: true });
    await expect(sendContactEmail(VALID, { source: CONFIGURED, fetchImpl })).resolves.toEqual({
      ok: true,
    });
    expect(fetchImpl).toHaveBeenCalledWith(
      EMAILJS_ENDPOINT,
      expect.objectContaining({ method: 'POST' }),
    );
    const bodyRaw = fetchImpl.mock.calls[0]?.[1]?.body;
    expect(typeof bodyRaw).toBe('string');
    if (typeof bodyRaw !== 'string') return;
    const body = JSON.parse(bodyRaw) as {
      service_id: string;
      template_id: string;
      user_id: string;
    };
    expect(body).toMatchObject({
      service_id: 'svc',
      template_id: 'tpl',
      user_id: 'pk',
    });
  });

  it('HTTP no ok o throw son network', async () => {
    const failing = vi.fn<EmailFetch>().mockResolvedValue({ ok: false });
    await expect(
      sendContactEmail(VALID, { source: CONFIGURED, fetchImpl: failing }),
    ).resolves.toEqual({ ok: false, reason: 'network' });
    const throwing = vi.fn<EmailFetch>().mockRejectedValue(new Error('offline'));
    await expect(
      sendContactEmail(VALID, { source: CONFIGURED, fetchImpl: throwing }),
    ).resolves.toEqual({ ok: false, reason: 'network' });
  });
});

describe('FRM-21', () => {
  it('FRM-21 · ninguna clave de EmailJS literal; solo VITE_* vía env', () => {
    const email = readFileSync(join(process.cwd(), 'src/lib/email.ts'), 'utf8');
    expect(email).toContain("readEnv('VITE_EMAILJS_SERVICE_ID'");
    expect(email).toContain("readEnv('VITE_EMAILJS_TEMPLATE_ID'");
    expect(email).toContain("readEnv('VITE_EMAILJS_PUBLIC_KEY'");
    expect(email).not.toMatch(/service_[A-Za-z0-9]{8,}/);
    expect(email).not.toMatch(/template_[A-Za-z0-9]{8,}/);
    for (const file of walk(join(process.cwd(), 'src'))) {
      if (file.endsWith('env.ts')) continue;
      const source = readFileSync(file, 'utf8');
      expect(source, file).not.toMatch(
        /VITE_EMAILJS_(?:SERVICE_ID|TEMPLATE_ID|PUBLIC_KEY)'\s*,\s*'[^']+'/,
      );
    }
  });
});

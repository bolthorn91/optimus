import { composePhone, type ContactContextRow, type ContactValues } from '@/lib/contact-form';
import { readEnv, type EnvSource } from '@/lib/env';

export const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send';

export interface EmailConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

export type SendFailure = 'unconfigured' | 'network';

export type SendResult = { ok: true } | { ok: false; reason: SendFailure };

export type EmailFetch = (url: string, init?: RequestInit) => Promise<{ ok: boolean }>;

export interface SendContactOptions {
  simulatorContext?: readonly ContactContextRow[];
  source?: EnvSource;
  fetchImpl?: EmailFetch;
}

export interface EmailTemplateParams {
  fullName: string;
  email: string;
  phone: string;
  taxResidence: string;
  interest: string;
  capitalBand: string;
  message: string;
  consentData: string;
  consentMarketing: string;
  simulatorContext: string;
}

export function readEmailConfig(source?: EnvSource): EmailConfig | undefined {
  const serviceId = readEnv('VITE_EMAILJS_SERVICE_ID', source);
  const templateId = readEnv('VITE_EMAILJS_TEMPLATE_ID', source);
  const publicKey = readEnv('VITE_EMAILJS_PUBLIC_KEY', source);
  if (serviceId === undefined || templateId === undefined || publicKey === undefined) {
    return undefined;
  }
  return { serviceId, templateId, publicKey };
}

export function formatSimulatorContext(rows?: readonly ContactContextRow[]): string {
  if (rows === undefined || rows.length === 0) return '';
  return rows.map((row) => `${row.label}: ${row.value}`).join('\n');
}

export function templateParams(
  values: ContactValues,
  simulatorContext?: readonly ContactContextRow[],
): EmailTemplateParams {
  return {
    fullName: values.fullName.trim(),
    email: values.email.trim(),
    phone: composePhone(values.phonePrefix, values.phone),
    taxResidence: values.taxResidence,
    interest: values.interest,
    capitalBand: values.capitalBand,
    message: values.message,
    consentData: values.consentData ? 'yes' : 'no',
    consentMarketing: values.consentMarketing ? 'yes' : 'no',
    simulatorContext: formatSimulatorContext(simulatorContext),
  };
}

export async function sendContactEmail(
  values: ContactValues,
  options: SendContactOptions = {},
): Promise<SendResult> {
  const config = readEmailConfig(options.source);
  if (config === undefined) return { ok: false, reason: 'unconfigured' };
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  try {
    const response = await fetchImpl(EMAILJS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: config.serviceId,
        template_id: config.templateId,
        user_id: config.publicKey,
        template_params: templateParams(values, options.simulatorContext),
      }),
    });
    if (!response.ok) return { ok: false, reason: 'network' };
    return { ok: true };
  } catch {
    return { ok: false, reason: 'network' };
  }
}

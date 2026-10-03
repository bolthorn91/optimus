/**
 * Única fuente de datos de contacto (I2, D9). Footer y formulario leen de aquí.
 * Ningún teléfono, correo ni dominio plausible: los del dossier son contradictorios o
 * provisionales (B-01, B-02).
 */

export interface PendingContactField {
  label: string;
  debtId: string;
}

export const CONTACT = {
  spainPhone: { label: 'Teléfono España', debtId: 'B-01' } satisfies PendingContactField,
  argentinaPhone: { label: 'Teléfono Argentina', debtId: 'B-01' } satisfies PendingContactField,
  email: { label: 'Correo', debtId: 'B-02' } satisfies PendingContactField,
  domain: { label: 'Dominio', debtId: 'B-02' } satisfies PendingContactField,
  socials: { label: 'Redes', debtId: 'B-07' } satisfies PendingContactField,
  registry: { label: 'Datos registrales', debtId: 'B-05' } satisfies PendingContactField,
  confidential: 'Consultoría confidencial · Atención directa',
  sources: [
    'ACLED',
    'Global Guardian',
    'Crisis24',
    'NASA',
    'Think Tanks',
    'Merval',
    'Clave Bursátil',
    'Convenio de La Haya',
    'CNMV',
    'CNV',
    'INDEC',
    'Banco de España',
    'BCE',
    'BCRA',
    'AEAT',
    'ARCA',
  ],
} as const;

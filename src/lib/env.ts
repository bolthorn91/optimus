/**
 * Única lectura de `import.meta.env` del proyecto (perfil §7 I8). Solo claves `VITE_*` con valor
 * público: no hay backend y cualquier cosa que llegue aquí acaba en el bundle.
 */

export const ENV_KEYS = [
  'VITE_EMAILJS_SERVICE_ID',
  'VITE_EMAILJS_TEMPLATE_ID',
  'VITE_EMAILJS_PUBLIC_KEY',
  'VITE_SITE_URL',
  'VITE_ANALYTICS_ENDPOINT',
] as const;

export type EnvKey = (typeof ENV_KEYS)[number];

export type EnvSource = Partial<Record<EnvKey, unknown>>;

export class MissingEnvError extends Error {
  readonly key: EnvKey;

  constructor(key: EnvKey) {
    super(
      `Falta la variable de entorno ${key}. Declárela en .env siguiendo .env.example; ` +
        'no se aplica ningún valor por defecto.',
    );
    this.name = 'MissingEnvError';
    this.key = key;
  }
}

function normalise(raw: unknown): string | undefined {
  if (typeof raw !== 'string') return undefined;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/** El entorno real. Los tests pasan su propia fuente; el resto del código no pasa ninguna. */
const runtimeSource: EnvSource = import.meta.env;

/** Devuelve el valor, o `undefined` si no está definido. Nunca inventa un valor por defecto. */
export function readEnv(key: EnvKey, source: EnvSource = runtimeSource): string | undefined {
  return normalise(source[key]);
}

/** Devuelve el valor o lanza `MissingEnvError`. Para claves sin las que la superficie no funciona. */
export function requireEnv(key: EnvKey, source: EnvSource = runtimeSource): string {
  const value = readEnv(key, source);
  if (value === undefined) throw new MissingEnvError(key);
  return value;
}

/** Las claves declaradas que faltan. */
export function missingEnvKeys(source: EnvSource = runtimeSource): EnvKey[] {
  return ENV_KEYS.filter((key) => readEnv(key, source) === undefined);
}

import { describe, expect, it, vi } from 'vitest';

import {
  ENV_KEYS,
  MissingEnvError,
  missingEnvKeys,
  readEnv,
  requireEnv,
  type EnvSource,
} from './env';

const complete: EnvSource = {
  VITE_EMAILJS_SERVICE_ID: 'service_x',
  VITE_EMAILJS_TEMPLATE_ID: 'template_x',
  VITE_EMAILJS_PUBLIC_KEY: 'key_x',
  VITE_SITE_URL: 'https://example.test',
  VITE_ANALYTICS_ENDPOINT: 'https://collect.example.test/e',
};

describe('lectura de variables de entorno', () => {
  // FND-14
  it('FND-14 · requireEnv lanza MissingEnvError cuando falta la variable', () => {
    expect(() => requireEnv('VITE_SITE_URL', {})).toThrow(MissingEnvError);
  });

  it('FND-14 · el mensaje nombra la clave y remite a .env.example', () => {
    expect(() => requireEnv('VITE_EMAILJS_PUBLIC_KEY', {})).toThrow(
      /VITE_EMAILJS_PUBLIC_KEY.*\.env\.example/s,
    );
  });

  it('FND-14 · no expone ningún valor por defecto inventado', () => {
    for (const key of ENV_KEYS) {
      expect(readEnv(key, {})).toBeUndefined();
    }
  });

  it('FND-14 · una cadena vacía o en blanco cuenta como ausente', () => {
    expect(readEnv('VITE_SITE_URL', { VITE_SITE_URL: '' })).toBeUndefined();
    expect(readEnv('VITE_SITE_URL', { VITE_SITE_URL: '   ' })).toBeUndefined();
    expect(() => requireEnv('VITE_SITE_URL', { VITE_SITE_URL: '  ' })).toThrow(MissingEnvError);
  });

  it('devuelve el valor recortado cuando está presente', () => {
    expect(readEnv('VITE_SITE_URL', { VITE_SITE_URL: '  https://a.test  ' })).toBe(
      'https://a.test',
    );
    expect(requireEnv('VITE_SITE_URL', complete)).toBe('https://example.test');
  });

  it('ignora los valores que no son cadena', () => {
    expect(readEnv('VITE_SITE_URL', { VITE_SITE_URL: 42 })).toBeUndefined();
    expect(readEnv('VITE_SITE_URL', { VITE_SITE_URL: null })).toBeUndefined();
  });

  it('missingEnvKeys enumera exactamente lo que falta', () => {
    expect(missingEnvKeys(complete)).toEqual([]);
    expect(missingEnvKeys({})).toEqual([...ENV_KEYS]);
    expect(missingEnvKeys({ VITE_SITE_URL: 'https://a.test' })).not.toContain('VITE_SITE_URL');
  });

  it('MissingEnvError conserva la clave que falló', () => {
    try {
      requireEnv('VITE_EMAILJS_SERVICE_ID', {});
      expect.unreachable('requireEnv debería haber lanzado');
    } catch (error) {
      expect(error).toBeInstanceOf(MissingEnvError);
      expect((error as MissingEnvError).key).toBe('VITE_EMAILJS_SERVICE_ID');
    }
  });
});

describe('lectura del entorno real, sin pasar fuente', () => {
  it('readEnv devuelve el valor inyectado en el entorno', () => {
    vi.stubEnv('VITE_SITE_URL', 'https://optimvs.test');
    expect(readEnv('VITE_SITE_URL')).toBe('https://optimvs.test');
  });

  it('readEnv devuelve undefined cuando la clave está vacía', () => {
    vi.stubEnv('VITE_EMAILJS_PUBLIC_KEY', '');
    expect(readEnv('VITE_EMAILJS_PUBLIC_KEY')).toBeUndefined();
  });

  it('requireEnv lanza MissingEnvError cuando la clave falta', () => {
    vi.stubEnv('VITE_EMAILJS_TEMPLATE_ID', '');
    expect(() => requireEnv('VITE_EMAILJS_TEMPLATE_ID')).toThrow(MissingEnvError);
  });

  it('requireEnv devuelve el valor cuando está presente', () => {
    vi.stubEnv('VITE_EMAILJS_TEMPLATE_ID', 'template_real');
    expect(requireEnv('VITE_EMAILJS_TEMPLATE_ID')).toBe('template_real');
  });

  it('missingEnvKeys enumera las claves ausentes del entorno real', () => {
    for (const key of ENV_KEYS) vi.stubEnv(key, '');
    expect(missingEnvKeys()).toEqual([...ENV_KEYS]);

    vi.stubEnv('VITE_SITE_URL', 'https://optimvs.test');
    expect(missingEnvKeys()).not.toContain('VITE_SITE_URL');
  });
});

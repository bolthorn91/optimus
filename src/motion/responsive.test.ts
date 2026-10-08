import { describe, expect, it } from 'vitest';

import {
  isMobileWidth,
  resolveScenePolicy,
  SCENE_POLICIES,
  SCENE_POLICY_LIST,
  ScenePolicyError,
  type SpecSceneId,
} from '@/motion/responsive';

const CAPABLE = { hasFallback: true, reducedMotion: false };

describe('resolveScenePolicy', () => {
  it('MOB-02 · las ocho escenas a 375 px devuelven la política declarada, sin valores por defecto', () => {
    expect(SCENE_POLICY_LIST).toHaveLength(8);
    const expected: Record<SpecSceneId, string> = {
      hero: 'scrub',
      'act-1': 'static',
      'act-2': 'scrub',
      'act-3': 'fallback',
      'act-4': 'scrub',
      'act-5': 'static',
      'act-67': 'scrub',
      contacto: 'static',
    };
    for (const policy of SCENE_POLICY_LIST) {
      const resolved = resolveScenePolicy(policy.sceneId, 375, CAPABLE);
      expect(resolved.height).toBe(policy.mobileHeight);
      expect(resolved.mode).toBe(expected[policy.specId]);
      expect(resolved.mode).toBe(policy.mobileMode);
    }
    expect(SCENE_POLICIES.territorio.specId).toBe('act-3');
    expect(SCENE_POLICIES.firma.specId).toBe('act-67');
  });

  it('MOB-03 · una escena sin política lanza y no inventa un comportamiento', () => {
    expect(() => resolveScenePolicy('act-9', 375, CAPABLE)).toThrow(ScenePolicyError);
    expect(() => resolveScenePolicy('act-3', 1440, CAPABLE)).toThrow(/no declara política/);
  });

  it('MOB-04 · fallback sin fallback disponible lanza', () => {
    expect(() =>
      resolveScenePolicy('territorio', 375, { hasFallback: false, reducedMotion: false }),
    ).toThrow(ScenePolicyError);
    expect(() =>
      resolveScenePolicy('territorio', 375, { hasFallback: false, reducedMotion: false }),
    ).toThrow(/exige un fallback/);
  });

  it('MOB-05 · prefers-reduced-motion deja todas las escenas en modo estático', () => {
    for (const policy of SCENE_POLICY_LIST) {
      const mobile = resolveScenePolicy(policy.sceneId, 375, {
        hasFallback: true,
        reducedMotion: true,
      });
      const desktop = resolveScenePolicy(policy.sceneId, 1440, {
        hasFallback: true,
        reducedMotion: true,
      });
      expect(mobile.mode).toBe('static');
      expect(desktop.mode).toBe('static');
      expect(mobile.height).toBe(policy.mobileHeight);
      expect(desktop.height).toBe(policy.desktopHeight);
    }
  });

  it('en escritorio sin movimiento reducido el modo es scrub', () => {
    expect(resolveScenePolicy('territorio', 1440, CAPABLE)).toEqual({
      height: '600vh',
      mode: 'scrub',
    });
    expect(isMobileWidth(767)).toBe(true);
    expect(isMobileWidth(768)).toBe(false);
  });
});

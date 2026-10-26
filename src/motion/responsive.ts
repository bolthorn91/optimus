export type SpecSceneId =
  'hero' | 'act-1' | 'act-2' | 'act-3' | 'act-4' | 'act-5' | 'act-67' | 'contacto';

export type PolicySceneId =
  'hero' | 'escenario' | 'seguridad' | 'territorio' | 'marco' | 'activos' | 'firma' | 'contacto';

export type SceneMobileMode = 'scrub' | 'static' | 'fallback';

export interface SceneViewportPolicy {
  sceneId: PolicySceneId;
  specId: SpecSceneId;
  desktopHeight: string;
  mobileHeight: string;
  mobileMode: SceneMobileMode;
  reason: string;
}

export interface SceneCapabilities {
  hasFallback: boolean;
  reducedMotion: boolean;
}

export interface ResolvedScenePolicy {
  height: string;
  mode: SceneMobileMode;
}

export const MOBILE_BREAKPOINT_PX = 768;

export function isMobileWidth(width: number): boolean {
  return width < MOBILE_BREAKPOINT_PX;
}

export class ScenePolicyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ScenePolicyError';
  }
}

export const SCENE_POLICIES = {
  hero: {
    sceneId: 'hero',
    specId: 'hero',
    desktopHeight: '100svh',
    mobileHeight: '100svh',
    mobileMode: 'scrub',
    reason: 'Animación de entrada, barata',
  },
  escenario: {
    sceneId: 'escenario',
    specId: 'act-1',
    desktopHeight: '400vh',
    mobileHeight: '220svh',
    mobileMode: 'static',
    reason: 'El canvas de partículas no compensa en gama media (S5)',
  },
  seguridad: {
    sceneId: 'seguridad',
    specId: 'act-2',
    desktopHeight: '500vh',
    mobileHeight: '260svh',
    mobileMode: 'scrub',
    reason: 'La serie temporal es el contenido; se reduce la altura (S4)',
  },
  territorio: {
    sceneId: 'territorio',
    specId: 'act-3',
    desktopHeight: '600vh',
    mobileHeight: '100svh',
    mobileMode: 'fallback',
    reason: 'WebGL reservado a escritorio (S3)',
  },
  marco: {
    sceneId: 'marco',
    specId: 'act-4',
    desktopHeight: '550vh',
    mobileHeight: '300svh',
    mobileMode: 'scrub',
    reason: 'El trazado del diagrama es barato y es el argumento',
  },
  activos: {
    sceneId: 'activos',
    specId: 'act-5',
    desktopHeight: '550vh',
    mobileHeight: '100svh',
    mobileMode: 'static',
    reason: 'El modo scroll del simulador se desactiva (G3)',
  },
  firma: {
    sceneId: 'firma',
    specId: 'act-67',
    desktopHeight: '600vh',
    mobileHeight: '320svh',
    mobileMode: 'scrub',
    reason: 'Trazado de cadenas, barato',
  },
  contacto: {
    sceneId: 'contacto',
    specId: 'contacto',
    desktopHeight: '100svh',
    mobileHeight: '100svh',
    mobileMode: 'static',
    reason: 'Es un formulario',
  },
} as const satisfies Record<PolicySceneId, SceneViewportPolicy>;

export const SCENE_POLICY_LIST: readonly SceneViewportPolicy[] = Object.values(SCENE_POLICIES);

export function policyFor(sceneId: string): SceneViewportPolicy {
  if (Object.hasOwn(SCENE_POLICIES, sceneId)) {
    return SCENE_POLICIES[sceneId as PolicySceneId];
  }
  throw new ScenePolicyError(`La escena ${sceneId} no declara política de viewport`);
}

/**
 * Convierte la altura total de política (`400vh`) en una distancia de pin en píxeles.
 *
 * ScrollTrigger no resuelve unidades CSS en `end`: `+=300vh` se interpreta como 300 px.
 * Por eso el pin terminaba a los 300 px y las animaciones se cortaban antes de tiempo.
 * El cálculo se hace aquí, con la altura real del viewport, y se devuelve en px.
 */
export function scrollTriggerEnd(
  height: string,
  viewportHeight = typeof window === 'undefined' ? 0 : window.innerHeight,
): string {
  const match = /^(\d+(?:\.\d+)?)(vh|svh|dvh)$/.exec(height);
  const value = match?.[1];
  if (value === undefined) {
    throw new ScenePolicyError(`Altura de escena no reconocida: ${height}`);
  }
  const extra = Math.max(Number(value) - 100, 0);
  const pixels = Math.round((extra / 100) * viewportHeight);
  return `+=${String(pixels)}px`;
}

export function resolveScenePolicy(
  sceneId: string,
  viewportWidth: number,
  capabilities: SceneCapabilities,
): ResolvedScenePolicy {
  const policy = policyFor(sceneId);
  const isMobile = isMobileWidth(viewportWidth);
  if (policy.mobileMode === 'fallback' && !capabilities.hasFallback) {
    throw new ScenePolicyError(
      `La escena ${sceneId} exige un fallback y no lo tiene; no se degrada a un hueco`,
    );
  }
  if (capabilities.reducedMotion) {
    return { height: isMobile ? policy.mobileHeight : policy.desktopHeight, mode: 'static' };
  }
  if (!isMobile) {
    return { height: policy.desktopHeight, mode: 'scrub' };
  }
  return { height: policy.mobileHeight, mode: policy.mobileMode };
}

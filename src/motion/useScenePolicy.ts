import { resolveScenePolicy, SCENE_POLICIES, type ResolvedScenePolicy } from '@/motion/responsive';
import { useReducedMotionSafe } from '@/motion/useReducedMotionSafe';
import { useViewport } from '@/motion/useViewport';

export function useResolvedPolicy(sceneId: string): ResolvedScenePolicy | null {
  const { width } = useViewport();
  const reducedMotion = useReducedMotionSafe();
  if (!Object.hasOwn(SCENE_POLICIES, sceneId)) return null;
  return resolveScenePolicy(sceneId, width, { hasFallback: true, reducedMotion });
}

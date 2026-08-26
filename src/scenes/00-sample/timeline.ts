import { lerp } from '@/lib/interpolate';
import type { SceneState } from '@/motion/types';

/** Coreografía pura de la escena de muestra (FND-05). */
export function choreograph(progress: number): SceneState {
  return {
    opacity: lerp(0.35, 1, progress),
    shift: lerp(32, 0, progress),
  };
}

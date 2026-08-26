import { type RefObject, useLayoutEffect } from 'react';

import { ScrollTrigger, gsap } from '@/motion/gsapSetup';
import type { Choreograph, SceneState } from '@/motion/types';
import { useReducedMotionSafe } from '@/motion/useReducedMotionSafe';

export interface UseGsapSceneOptions {
  ref: RefObject<HTMLElement | null>;
  choreograph: Choreograph;
  apply: (state: SceneState) => void;
  scrub?: boolean | number;
  pin?: boolean;
}

/**
 * Única puerta de creación de ScrollTrigger (M5, I5). En movimiento reducido aplica
 * choreograph(1) y no ancla.
 */
export function useGsapScene({
  ref,
  choreograph,
  apply,
  scrub = true,
  pin = true,
}: UseGsapSceneOptions): void {
  const reduced = useReducedMotionSafe();

  useLayoutEffect(() => {
    const triggerEl = ref.current;
    if (!triggerEl) return undefined;

    if (reduced) {
      apply(choreograph(1));
      return undefined;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: triggerEl,
        start: 'top top',
        end: () => `+=${String(triggerEl.offsetHeight)}`,
        pin,
        scrub,
        onUpdate: (self) => {
          apply(choreograph(self.progress));
        },
      });
      apply(choreograph(0));
    }, triggerEl);

    return () => {
      ctx.revert();
    };
  }, [apply, choreograph, pin, reduced, ref, scrub]);
}

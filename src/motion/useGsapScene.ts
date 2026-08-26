import { type RefObject, useLayoutEffect } from 'react';

import { ScrollTrigger, gsap } from '@/motion/gsapSetup';
import type { Choreograph, SceneState } from '@/motion/types';
import { useReducedMotionSafe } from '@/motion/useReducedMotionSafe';

export interface UseGsapSceneOptions<T = SceneState> {
  ref: RefObject<HTMLElement | null>;
  choreograph: Choreograph<T>;
  apply: (state: T) => void;
  scrub?: boolean | number;
  pin?: boolean;
  /** If set, plays t 0→1 over this many seconds instead of creating a ScrollTrigger (F4). */
  duration?: number;
  setup?: (element: HTMLElement) => void;
  start?: string;
  end?: string | (() => string);
}

/**
 * Única puerta de creación de ScrollTrigger (M5, I5). En movimiento reducido aplica
 * choreograph(1) y no ancla.
 */
export function useGsapScene<T>({
  ref,
  choreograph,
  apply,
  scrub = true,
  pin = true,
  duration,
  setup,
  start = 'top top',
  end,
}: UseGsapSceneOptions<T>): void {
  const reduced = useReducedMotionSafe();

  useLayoutEffect(() => {
    const triggerEl = ref.current;
    if (!triggerEl) return undefined;

    if (reduced) {
      apply(choreograph(1));
      return undefined;
    }

    const ctx = gsap.context(() => {
      setup?.(triggerEl);
      if (duration != null) {
        const proxy = { t: 0 };
        apply(choreograph(0));
        gsap.to(proxy, {
          t: 1,
          duration,
          ease: 'none',
          onUpdate: () => {
            apply(choreograph(proxy.t));
          },
        });
        return;
      }

      ScrollTrigger.create({
        trigger: triggerEl,
        start,
        end: end ?? (() => `+=${String(triggerEl.offsetHeight)}`),
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
  }, [apply, choreograph, duration, end, pin, reduced, ref, scrub, setup, start]);
}

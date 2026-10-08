import { type RefObject, useLayoutEffect, useRef } from 'react';

import { ScrollTrigger, gsap } from '@/motion/gsapSetup';
import { scrollTriggerEnd } from '@/motion/responsive';
import type { Choreograph, SceneState } from '@/motion/types';
import { useReducedMotionSafe } from '@/motion/useReducedMotionSafe';
import { useResolvedPolicy } from '@/motion/useScenePolicy';

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
  sceneId?: string;
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
  sceneId,
}: UseGsapSceneOptions<T>): { seek: (progress: number, mode?: 'apply' | 'silent') => void } {
  const reduced = useReducedMotionSafe();
  const policy = useResolvedPolicy(sceneId ?? '');
  const freeze = reduced || (policy !== null && policy.mode !== 'scrub');
  const pinEnd = policy !== null ? scrollTriggerEnd(policy.height) : end;
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const silent = useRef(false);

  useLayoutEffect(() => {
    const triggerEl = ref.current;
    if (!triggerEl) return undefined;

    if (freeze) {
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

      triggerRef.current = ScrollTrigger.create({
        trigger: triggerEl,
        start,
        end: pinEnd ?? (() => `+=${String(triggerEl.offsetHeight)}`),
        pin,
        scrub,
        onUpdate: (self) => {
          if (silent.current) return;
          apply(choreograph(self.progress));
        },
      });
      apply(choreograph(0));
    }, triggerEl);

    return () => {
      triggerRef.current = null;
      ctx.revert();
    };
  }, [apply, choreograph, duration, freeze, pin, pinEnd, reduced, ref, scrub, setup, start]);

  return {
    seek(progress: number, mode: 'apply' | 'silent' = 'apply') {
      const trigger = triggerRef.current;
      if (!trigger) return;
      silent.current = true;
      trigger.scroll(trigger.start + (trigger.end - trigger.start) * progress);
      silent.current = false;
      if (mode === 'apply') apply(choreograph(progress));
    },
  };
}

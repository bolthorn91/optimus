import { useCallback, useRef } from 'react';

import { ActSeal } from '@/components/ActSeal';
import { gsap } from '@/motion/gsapSetup';
import { useGsapScene } from '@/motion/useGsapScene';

function sealChoreograph(progress: number): { progress: number } {
  return { progress };
}

export function ActThreshold({ act, onNavy = true }: { act: number; onNavy?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  const apply = useCallback((state: { progress: number }) => {
    const node = ref.current;
    if (!node) return;
    node.dataset.draw = String(state.progress);
    gsap.set(node.querySelectorAll('path'), { drawSVG: `${String(state.progress * 100)}%` });
  }, []);

  useGsapScene({
    ref,
    choreograph: sealChoreograph,
    apply,
    pin: false,
    scrub: true,
    start: 'top bottom',
    end: 'center center',
  });

  return (
    <div className={onNavy ? 'on-navy' : undefined} ref={ref}>
      <ActSeal act={act} />
    </div>
  );
}

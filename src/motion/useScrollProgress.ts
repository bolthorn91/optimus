import { useEffect, useState } from 'react';

import { clamp01 } from '@/lib/interpolate';
import { useLenis } from '@/motion/MotionProvider';

function progressOf(scroll: number, limit: number): number {
  if (!Number.isFinite(scroll) || !Number.isFinite(limit) || limit <= 0) return 0;
  return clamp01(scroll / limit);
}

/** Única fuente del progreso global de lectura 0→1 (M10). No crea ScrollTrigger. */
export function useScrollProgress(): number {
  const lenis = useLenis();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!lenis) return undefined;

    const onScroll = () => {
      setProgress(progressOf(lenis.scroll, lenis.limit));
    };

    onScroll();
    const stop = lenis.on('scroll', onScroll);
    return () => {
      stop();
    };
  }, [lenis]);

  return progress;
}

import { useEffect, useState } from 'react';

import { isMobileWidth, MOBILE_BREAKPOINT_PX } from '@/motion/responsive';

export const MOBILE_MAX_PX = MOBILE_BREAKPOINT_PX - 1;
export const TABLET_MAX_PX = 1024;

export interface Viewport {
  width: number;
  isMobile: boolean;
  isTablet: boolean;
}

const listeners = new Set<() => void>();
let attached = false;

function readViewport(): Viewport {
  const width = typeof window === 'undefined' ? TABLET_MAX_PX + 1 : window.innerWidth;
  const isMobile = isMobileWidth(width);
  return {
    width,
    isMobile,
    isTablet: !isMobile && width <= TABLET_MAX_PX,
  };
}

function notify(): void {
  for (const listener of listeners) listener();
}

function attach(): void {
  if (attached || typeof window === 'undefined') return;
  attached = true;
  window.addEventListener('resize', notify);
}

export function useViewport(): Viewport {
  const [viewport, setViewport] = useState(readViewport);

  useEffect(() => {
    attach();
    const sync = () => {
      setViewport(readViewport());
    };
    sync();
    listeners.add(sync);
    return () => {
      listeners.delete(sync);
    };
  }, []);

  return viewport;
}

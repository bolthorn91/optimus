import Lenis from 'lenis';
import { type ReactNode, createContext, useContext, useEffect, useState } from 'react';

import { ScrollTrigger, gsap } from '@/motion/gsapSetup';

export const MotionContext = createContext<Lenis | null>(null);

/** Instancia única de Lenis, cableada al ticker de GSAP y a ScrollTrigger.update (M3). */
export function MotionProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const instance = new Lenis();
    gsap.ticker.lagSmoothing(0);

    const onTick = (time: number) => {
      instance.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    const onScroll = () => {
      ScrollTrigger.update();
    };
    const stopScroll = instance.on('scroll', onScroll);
    setLenis(instance);

    return () => {
      stopScroll();
      gsap.ticker.remove(onTick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <MotionContext.Provider value={lenis}>{children}</MotionContext.Provider>;
}

export function useLenis(): Lenis | null {
  return useContext(MotionContext);
}

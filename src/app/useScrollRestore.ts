import { useEffect, useRef } from 'react';

import { decideScroll } from '@/lib/scrollRestore';
import { useLenis } from '@/motion/MotionProvider';

function applyY(y: number, lenis: ReturnType<typeof useLenis>, resize: boolean): void {
  if (resize) lenis?.resize();
  window.scrollTo(0, y);
  lenis?.scrollTo(y, { immediate: true });
}

/** Restaura el scroll de la home al volver de un detalle. Un solo escritor de la posición. */
export function useScrollRestore(pathname: string, hash: string): void {
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;
  const prevPathRef = useRef('');
  const rememberedYRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const command = decideScroll({
      prevPath: prevPathRef.current,
      nextPath: pathname,
      nextHash: hash,
    });
    prevPathRef.current = pathname;

    if (command.kind === 'noop') return;
    if (command.kind === 'hash') {
      const target = document.getElementById(command.id);
      if (target) {
        target.scrollIntoView();
        return;
      }
      if (import.meta.env.DEV) {
        console.warn(`Ancla inexistente: #${command.id}`);
      }
      return;
    }
    if (command.kind === 'restore') {
      applyY(rememberedYRef.current ?? 0, lenisRef.current, true);
      return;
    }
    applyY(0, lenisRef.current, false);
  }, [pathname, hash]);

  useEffect(() => {
    if (pathname !== '/') return undefined;
    const save = () => {
      rememberedYRef.current = lenisRef.current?.scroll ?? window.scrollY;
    };
    save();
    window.addEventListener('scroll', save, { passive: true });
    const stop = lenisRef.current?.on('scroll', save);
    return () => {
      window.removeEventListener('scroll', save);
      stop?.();
    };
  }, [pathname, lenis]);
}

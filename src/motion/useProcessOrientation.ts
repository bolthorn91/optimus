import { useViewport } from '@/motion/useViewport';

/** Horizontal en escritorio, vertical bajo 48 rem (doc 04 F5). */
export function useProcessOrientation(): 'horizontal' | 'vertical' {
  const { isMobile } = useViewport();
  return isMobile ? 'vertical' : 'horizontal';
}

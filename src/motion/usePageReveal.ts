import { useLayoutEffect } from 'react';

import { useReducedMotionSafe } from '@/motion/useReducedMotionSafe';

const VISIBLE_BAND = 0.9;

/**
 * Las páginas estáticas no tienen una escena propia. Este observador les da una entrada
 * discreta al hacer scroll sin llenar cada componente de estado: sólo actúa sobre los nodos
 * que llevan `data-reveal` y deja el contenido visible si no hay JS o si el usuario pide
 * movimiento reducido.
 */
export function usePageReveal(pathname: string): void {
  const reducedMotion = useReducedMotionSafe();

  useLayoutEffect(() => {
    if (reducedMotion || typeof window === 'undefined') return undefined;

    const root = document.querySelector('main');
    if (root === null) return undefined;

    const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (nodes.length === 0) return undefined;

    if (typeof IntersectionObserver !== 'function') {
      nodes.forEach((node) => {
        node.classList.add('is-revealed');
      });
      return undefined;
    }

    const pending: HTMLElement[] = [];
    nodes.forEach((node) => {
      const top = node.getBoundingClientRect().top;
      if (top > window.innerHeight * VISIBLE_BAND) {
        node.classList.add('is-reveal-pending');
        pending.push(node);
      } else {
        node.classList.add('is-revealed');
      }
    });

    if (pending.length === 0) {
      return () => {
        nodes.forEach((node) => {
          node.classList.remove('is-revealed');
        });
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const node = entry.target;
          node.classList.remove('is-reveal-pending');
          node.classList.add('is-revealed');
          observer.unobserve(node);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );

    pending.forEach((node) => {
      observer.observe(node);
    });

    return () => {
      observer.disconnect();
      nodes.forEach((node) => {
        node.classList.remove('is-reveal-pending');
        node.classList.remove('is-revealed');
      });
    };
  }, [pathname, reducedMotion]);
}

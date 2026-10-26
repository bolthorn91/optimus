import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterAll, afterEach } from 'vitest';

import { ScrollTrigger } from '@/motion/gsapSetup';

/**
 * No se registra ningún matcher de accesibilidad: el gate del perfil §5 solo bloquea `critical` y
 * `serious`, y eso es un filtro, no un matcher. Vive en `src/test/axe.ts`, sobre axe-core, y está
 * cubierto por sus propios tests. El stub de `elementFromPoint` también vive allí.
 *
 * Stubs de window (scrollTo, rAF, matchMedia, ResizeObserver) viven en `env-stubs.ts`, que
 * Vitest carga antes que este fichero para que GSAP pueda registrarse.
 */

afterEach(() => {
  cleanup();
});

/**
 * ScrollTrigger arranca un setInterval de 250 ms al registrarse y no lo corta al matar los
 * triggers. Si el fichero termina con el intervalo vivo, dispara requestAnimationFrame cuando
 * Vitest ya ha desmontado jsdom y el run falla con un unhandled error. `disable` lo limpia.
 */
afterAll(() => {
  ScrollTrigger.disable(false, true);
});

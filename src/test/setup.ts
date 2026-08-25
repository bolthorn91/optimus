import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

/**
 * No se registra ningún matcher de accesibilidad: el gate del perfil §5 solo bloquea `critical` y
 * `serious`, y eso es un filtro, no un matcher. Vive en `src/test/axe.ts`, sobre axe-core, y está
 * cubierto por sus propios tests.
 */

/**
 * jsdom no implementa `elementFromPoint`. Sin este stub, `isModalOpen()` de axe lanza y toda regla
 * que pase por `passForModal` se aborta a `incomplete` en silencio — entre ellas
 * `landmark-one-main` y `page-has-heading-one`, que el gate de página sí debe evaluar.
 */
if (typeof document !== 'undefined' && typeof document.elementFromPoint !== 'function') {
  document.elementFromPoint = () => null;
}

afterEach(() => {
  cleanup();
});

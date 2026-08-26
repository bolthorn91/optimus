import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

/**
 * No se registra ningún matcher de accesibilidad: el gate del perfil §5 solo bloquea `critical` y
 * `serious`, y eso es un filtro, no un matcher. Vive en `src/test/axe.ts`, sobre axe-core, y está
 * cubierto por sus propios tests. El stub de `elementFromPoint` también vive allí.
 */

afterEach(() => {
  cleanup();
});

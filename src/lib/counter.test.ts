import { describe, expect, it } from 'vitest';

import { displayedValue } from '@/lib/counter';
import { easeOut } from '@/lib/interpolate';

const DESTINATIONS = [505990, 2780400, 48600000, 45900000, 16.51] as const;

describe('displayedValue', () => {
  // SAT-04
  it('SAT-04 · displayedValue(1, 96.05) es exactamente 96.05', () => {
    expect(displayedValue(1, 96.05)).toBe(96.05);
  });

  // SAT-05
  it('SAT-05 · en progress 1 cierra en el destino exacto de los cinco contadores', () => {
    for (const destination of DESTINATIONS) {
      expect(displayedValue(1, destination)).toBe(destination);
    }
  });

  it('en progress 0 arranca en 0', () => {
    expect(displayedValue(0, 96.05)).toBe(0);
  });

  it('acota el progreso y no extrapola', () => {
    expect(displayedValue(-1, 100)).toBe(0);
    expect(displayedValue(4, 96.05)).toBe(96.05);
  });

  it('en el tramo abierto aplica ease.out, no interpolación lineal', () => {
    expect(displayedValue(0.5, 100)).toBe(100 * easeOut(0.5));
    expect(displayedValue(0.5, 100)).toBe(75);
    expect(displayedValue(0.5, 100)).not.toBe(50);
  });
});

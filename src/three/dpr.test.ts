import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { DPR_CAP } from '@/three/dpr';

const LAZY_CANVAS = readFileSync(resolve(process.cwd(), 'src/three/LazyCanvas.tsx'), 'utf8');

describe('DPR_CAP', () => {
  // SAT-15
  it('SAT-15 · limita la densidad de píxeles a 2× y LazyCanvas lo aplica', () => {
    expect(DPR_CAP).toBe(2);
    expect(LAZY_CANVAS).toMatch(/dpr=\{\[1,\s*DPR_CAP\]\}/);
    expect(LAZY_CANVAS).not.toMatch(/cappedDpr/);
  });
});

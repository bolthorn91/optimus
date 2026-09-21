import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const ROOT = process.cwd();
const STAGE = readFileSync(
  resolve(ROOT, 'src/scenes/03-asimetria-territorial/NightfallStage.tsx'),
  'utf8',
);
const SCENE = readFileSync(resolve(ROOT, 'src/scenes/03-asimetria-territorial/Scene.tsx'), 'utf8');
const CANVAS = readFileSync(
  resolve(ROOT, 'src/scenes/03-asimetria-territorial/NightfallCanvas.tsx'),
  'utf8',
);

describe('carga diferida de la escena WebGL', () => {
  // SAT-11
  it('SAT-11 · NightfallCanvas entra por React.lazy y la escena no importa three', () => {
    expect(STAGE).toMatch(/lazy\(\(\)\s*=>\s*import\(['"]\.\/NightfallCanvas['"]\)\)/);
    expect(STAGE).not.toMatch(/from ['"]three['"]/);
    expect(STAGE).not.toMatch(/from ['"]@react-three\//);
    expect(STAGE).not.toMatch(/from ['"].*LazyCanvas['"]/);
    expect(SCENE).toMatch(/NightfallStage/);
    expect(SCENE).not.toMatch(/NightfallCanvas/);
    expect(SCENE).not.toMatch(/from ['"]three['"]/);
    expect(CANVAS).toMatch(/from ['"]@react-three\/fiber['"]/);
    expect(CANVAS).toMatch(/from ['"]postprocessing['"]/);
    expect(CANVAS).not.toMatch(/@react-three\/postprocessing/);
    expect(CANVAS).not.toMatch(/@react-three\/drei/);
  });

  // SAT-12
  it('SAT-12 · el presupuesto de la escena WebGL es 400 KB gzip', () => {
    const policy = readFileSync(resolve(ROOT, 'tooling/bundle-policy.js'), 'utf8');
    expect(policy).toMatch(/WEBGL_SCENE_BUDGET_GZIP_BYTES = 400 \* 1024/);
  });
});

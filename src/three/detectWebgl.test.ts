import { afterEach, describe, expect, it, vi } from 'vitest';

import { detectWebgl } from '@/three/detectWebgl';

describe('detectWebgl', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('en jsdom, sin contexto, devuelve false', () => {
    expect(detectWebgl()).toBe(false);
  });

  it('acepta un contexto webgl2 cuando el canvas lo ofrece', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      {} as WebGL2RenderingContext,
    );
    expect(detectWebgl()).toBe(true);
  });

  it('devuelve false si getContext lanza', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => {
      throw new Error('webgl disabled');
    });
    expect(detectWebgl()).toBe(false);
  });
});

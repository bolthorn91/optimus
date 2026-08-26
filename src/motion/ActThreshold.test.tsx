import { render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ActThreshold } from '@/motion/ActThreshold';
import { ScrollTrigger } from '@/motion/gsapSetup';

const nativeMatchMedia = window.matchMedia.bind(window);

describe('ActThreshold', () => {
  afterEach(() => {
    window.matchMedia = nativeMatchMedia;
    for (const trigger of ScrollTrigger.getAll()) trigger.kill();
  });

  it('con movimiento reducido no crea ScrollTrigger y DrawSVG queda al 100%', () => {
    window.matchMedia = (query: string) =>
      ({
        matches: query.includes('prefers-reduced-motion'),
        media: query,
        onchange: null,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        addListener: () => undefined,
        removeListener: () => undefined,
        dispatchEvent: () => false,
      }) as MediaQueryList;
    const { container } = render(<ActThreshold act={1} />);
    expect(ScrollTrigger.getAll()).toEqual([]);
    expect(container.querySelector('[data-draw="1"]')).not.toBeNull();
  });

  it('desmontar deja cero ScrollTrigger', () => {
    const { unmount } = render(<ActThreshold act={1} />);
    expect(ScrollTrigger.getAll().length).toBeGreaterThan(0);
    unmount();
    expect(ScrollTrigger.getAll()).toEqual([]);
  });
});

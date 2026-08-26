import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { gsap } from '@/motion/gsapSetup';
import { MotionProvider, useLenis } from '@/motion/MotionProvider';
import { useScrollProgress } from '@/motion/useScrollProgress';

afterEach(() => {
  vi.restoreAllMocks();
});

function ProgressProbe() {
  const progress = useScrollProgress();
  return <span data-progress={String(progress)} />;
}

function LenisProbe() {
  const lenis = useLenis();
  return <span data-lenis={lenis ? 'on' : 'off'} />;
}

describe('MotionProvider', () => {
  it('conecta Lenis al ticker con lagSmoothing(0) y limpia al desmontar', () => {
    const add = vi.spyOn(gsap.ticker, 'add');
    const remove = vi.spyOn(gsap.ticker, 'remove');
    const lag = vi.spyOn(gsap.ticker, 'lagSmoothing');

    const first = render(
      <MotionProvider>
        <LenisProbe />
      </MotionProvider>,
    );

    expect(lag).toHaveBeenCalledWith(0);
    expect(add).toHaveBeenCalled();
    const callback = add.mock.calls[0]?.[0];
    expect(typeof callback).toBe('function');

    first.unmount();
    expect(remove).toHaveBeenCalledWith(callback);

    render(
      <MotionProvider>
        <LenisProbe />
      </MotionProvider>,
    );
    expect(add.mock.calls.length).toBeGreaterThanOrEqual(2);
  });

  it('useScrollProgress parte de 0 cuando no hay recorrido', () => {
    const { container } = render(
      <MotionProvider>
        <ProgressProbe />
      </MotionProvider>,
    );

    const probe = container.querySelector('[data-progress]');
    expect(probe).toHaveAttribute('data-progress', '0');
  });
});

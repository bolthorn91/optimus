import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { MOBILE_MAX_PX, useViewport } from '@/motion/useViewport';

const nativeWidth = window.innerWidth;

afterEach(() => {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: nativeWidth });
});

function setWidth(width: number): void {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
  window.dispatchEvent(new Event('resize'));
}

describe('useViewport', () => {
  it('a 375 px es móvil', () => {
    setWidth(375);
    const { result } = renderHook(() => useViewport());
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.width).toBe(375);
  });

  it('a 1024 px es tableta y a 1440 px no', () => {
    setWidth(1024);
    const { result } = renderHook(() => useViewport());
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(true);
    act(() => {
      setWidth(1440);
    });
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(MOBILE_MAX_PX).toBe(767);
  });
});

import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { sectionAt } from '@/app/sections';
import { useSiteAnalytics } from '@/app/useSiteAnalytics';
import { resetAnalytics, setAnalyticsSink } from '@/lib/analytics';

describe('useSiteAnalytics', () => {
  afterEach(() => {
    resetAnalytics();
  });

  it('G7 · un barrido 0 → 1 en la home emite profundidad 100 % del acto I', () => {
    const events: { act?: number; depth?: number }[] = [];
    setAnalyticsSink((name, payload) => {
      if (name === 'act_scroll_depth') events.push(payload ?? {});
    });
    const { rerender } = renderHook(
      ({
        current,
        progress,
      }: {
        current: ReturnType<typeof sectionAt> | null;
        progress: number;
      }) => {
        useSiteAnalytics(current, progress);
      },
      { initialProps: { current: sectionAt(0), progress: 0 } },
    );
    rerender({ current: sectionAt(1), progress: 1 });
    expect(events.some((event) => event.act === 1 && event.depth === 1)).toBe(true);
  });

  it('G7 · fuera de la home no emite profundidad de acto', () => {
    const events: string[] = [];
    setAnalyticsSink((name) => {
      events.push(name);
    });
    renderHook(() => {
      useSiteAnalytics(null, 1);
    });
    expect(events).toEqual([]);
  });
});

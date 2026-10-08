import { useEffect, useRef } from 'react';

import { SECTIONS, type Section } from '@/app/sections';
import { actDepthMarks, eventFromClick, trackEvent } from '@/lib/analytics';

export function useSiteAnalytics(current: Section | null, progress: number): void {
  const fired = useRef(new Set<string>());
  const lastProgress = useRef(0);

  useEffect(() => {
    function onClick(event: MouseEvent): void {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest('a');
      if (!link) return;
      const classified = eventFromClick(link.getAttribute('href') ?? '', {
        track: link.getAttribute('data-track'),
        position: link.getAttribute('data-track-position'),
      });
      if (classified) trackEvent(classified.name, classified.payload);
    }
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
    };
  }, []);

  useEffect(() => {
    if (current === null) return;
    const events = actDepthMarks(lastProgress.current, progress, SECTIONS);
    lastProgress.current = progress;
    for (const event of events) {
      const key = `${event.section}:${String(event.depth)}`;
      if (fired.current.has(key)) continue;
      fired.current.add(key);
      trackEvent('act_scroll_depth', {
        act: event.act,
        section: event.section,
        depth: event.depth,
      });
    }
  }, [current, progress]);
}

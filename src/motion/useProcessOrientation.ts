import { useEffect, useState } from 'react';

const QUERY = '(max-width: 47.99rem)';

function matchesNarrow(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia(QUERY).matches;
}

/** Horizontal en escritorio, vertical bajo 48 rem (doc 04 F5). */
export function useProcessOrientation(): 'horizontal' | 'vertical' {
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>(() =>
    matchesNarrow() ? 'vertical' : 'horizontal',
  );

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;

    const media = window.matchMedia(QUERY);
    const onChange = () => {
      setOrientation(media.matches ? 'vertical' : 'horizontal');
    };
    onChange();
    media.addEventListener('change', onChange);
    return () => {
      media.removeEventListener('change', onChange);
    };
  }, []);

  return orientation;
}

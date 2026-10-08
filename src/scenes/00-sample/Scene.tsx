import { useCallback, useRef } from 'react';

import { Scene } from '@/motion/Scene';
import type { SceneState } from '@/motion/types';
import { useGsapScene } from '@/motion/useGsapScene';
import { SAMPLE_COPY } from '@/scenes/00-sample/content';
import { choreograph } from '@/scenes/00-sample/timeline';

import './scene.css';

const HEIGHT = '100svh';

function SampleCopy() {
  return (
    <div data-sample-copy>
      <p>{SAMPLE_COPY.eyebrow}</p>
      <h3>{SAMPLE_COPY.title}</h3>
      <p>{SAMPLE_COPY.body}</p>
    </div>
  );
}

export function SampleScene() {
  const ref = useRef<HTMLElement>(null);

  const apply = useCallback((state: SceneState) => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty('--sample-opacity', String(state.opacity));
    node.style.setProperty('--sample-shift', `${String(state.shift)}px`);
  }, []);

  useGsapScene({
    ref,
    choreograph,
    apply,
  });

  return (
    <Scene height={HEIGHT} id="escena-muestra" ref={ref}>
      <SampleCopy />
    </Scene>
  );
}

import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ScrollTrigger } from '@/motion/gsapSetup';
import { Scene } from '@/motion/Scene';
import { SAMPLE_COPY } from '@/scenes/00-sample/content';
import { SampleScene } from '@/scenes/00-sample/Scene';
import { choreograph } from '@/scenes/00-sample/timeline';

type Listener = () => void;

function stubMatchMedia(reduced: boolean): { setReduced: (value: boolean) => void } {
  const listeners = new Set<Listener>();
  let matches = reduced;

  window.matchMedia = (query: string) => ({
    get matches() {
      return query.includes('prefers-reduced-motion') ? matches : false;
    },
    media: query,
    onchange: null,
    addEventListener: (_event: string, listener: EventListenerOrEventListenerObject) => {
      if (typeof listener === 'function') listeners.add(listener as Listener);
    },
    removeEventListener: (_event: string, listener: EventListenerOrEventListenerObject) => {
      if (typeof listener === 'function') listeners.delete(listener as Listener);
    },
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  });

  return {
    setReduced: (value: boolean) => {
      matches = value;
      for (const listener of listeners) listener();
    },
  };
}

function sampleVars(container: HTMLElement): { opacity: string; shift: string } {
  const section = container.querySelector('#escena-muestra');
  if (!(section instanceof HTMLElement)) throw new Error('falta #escena-muestra');
  return {
    opacity: section.style.getPropertyValue('--sample-opacity'),
    shift: section.style.getPropertyValue('--sample-shift'),
  };
}

const nativeMatchMedia = window.matchMedia.bind(window);

beforeEach(() => {
  window.matchMedia = nativeMatchMedia;
});

afterEach(() => {
  cleanup();
  window.matchMedia = nativeMatchMedia;
  for (const trigger of ScrollTrigger.getAll()) trigger.kill();
});

describe('escena de muestra', () => {
  // FND-05
  it('FND-05 · choreograph es determinista en 0, 0.5 y 1', () => {
    expect(choreograph(0)).toEqual({ opacity: 0.35, shift: 32 });
    expect(choreograph(0.5)).toEqual({ opacity: 0.675, shift: 16 });
    expect(choreograph(1)).toEqual({ opacity: 1, shift: 0 });
    expect(choreograph(1)).toEqual(choreograph(1));
  });

  // FND-06
  it('FND-06 · desmontar deja cero ScrollTrigger de la escena', () => {
    const { unmount } = render(<SampleScene />);
    const triggers = ScrollTrigger.getAll();
    expect(triggers.length).toBeGreaterThan(0);
    const trigger = triggers[0];
    const node = trigger?.trigger;
    expect(node).toBeInstanceOf(HTMLElement);
    if (trigger && node instanceof HTMLElement) {
      expect(Math.abs(trigger.end - trigger.start - node.offsetHeight)).toBeLessThan(1);
    }
    unmount();
    expect(ScrollTrigger.getAll()).toEqual([]);
  });

  // FND-07
  it('FND-07 · con movimiento reducido no hay ScrollTrigger y el texto es el mismo', () => {
    const animated = render(<SampleScene />);
    const animatedText = animated.container.textContent;
    animated.unmount();
    for (const trigger of ScrollTrigger.getAll()) trigger.kill();

    stubMatchMedia(true);
    const reduced = render(<SampleScene />);
    const end = choreograph(1);
    expect(ScrollTrigger.getAll()).toEqual([]);
    expect(reduced.container.textContent).toBe(animatedText);
    expect(sampleVars(reduced.container)).toEqual({
      opacity: String(end.opacity),
      shift: `${String(end.shift)}px`,
    });
    expect(screen.getByRole('heading', { name: SAMPLE_COPY.title })).toBeInTheDocument();
  });

  it('reconstruye la escena al cambiar prefers-reduced-motion en caliente', () => {
    const media = stubMatchMedia(false);
    const view = render(<SampleScene />);
    expect(ScrollTrigger.getAll().length).toBeGreaterThan(0);

    act(() => {
      media.setReduced(true);
    });
    const end = choreograph(1);
    expect(ScrollTrigger.getAll()).toEqual([]);
    expect(sampleVars(view.container)).toEqual({
      opacity: String(end.opacity),
      shift: `${String(end.shift)}px`,
    });

    act(() => {
      media.setReduced(false);
    });
    expect(ScrollTrigger.getAll().length).toBeGreaterThan(0);
  });

  // FND-08
  it('FND-08 · Scene reserva altura y el fallback ya trae el texto', () => {
    const { container } = render(
      <Scene fallback={<p>{SAMPLE_COPY.body}</p>} height="80vh" id="reserva">
        {null}
      </Scene>,
    );

    const section = container.querySelector('#reserva');
    expect(section).toBeInstanceOf(HTMLElement);
    expect((section as HTMLElement).style.minBlockSize).toBe('80vh');
    expect(container).toHaveTextContent(SAMPLE_COPY.body);
  });
});

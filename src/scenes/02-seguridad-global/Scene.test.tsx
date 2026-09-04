import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { App } from '@/app/App';
import { ScrollTrigger } from '@/motion/gsapSetup';
import { HERO } from '@/scenes/00-hero/content';
import { ACT1 } from '@/scenes/01-escenario-europeo/content';
import { ACT2 } from '@/scenes/02-seguridad-global/content';
import { Act2Scene } from '@/scenes/02-seguridad-global/Scene';
import { choreographAct2, progressForPeriod } from '@/scenes/02-seguridad-global/timeline';
import { expectNoBlockingAxeViolations } from '@/test/axe';

const YEARS = [1985, 2015, 2026, 2050] as const;
const nativeMatchMedia = window.matchMedia.bind(window);

describe('Act2Scene', () => {
  afterEach(() => {
    window.matchMedia = nativeMatchMedia;
    for (const trigger of ScrollTrigger.getAll()) trigger.kill();
  });

  it('monta entradilla, leyenda y tabla con los literales del dossier', () => {
    render(<Act2Scene />);
    expect(screen.getByRole('heading', { level: 2, name: /Seguridad global/ })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: ACT2.headingVulnerable }),
    ).toBeInTheDocument();
    for (const paragraph of ACT2.intro) {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    }
    expect(screen.getByRole('list', { name: ACT2.copy.legendTitle })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: ACT2.copy.tableCaption })).toBeInTheDocument();
  });

  // MAP-09
  it('MAP-09 · los cuatro períodos se alcanzan con Tab y se activan con Enter y Espacio', () => {
    const { container } = render(<Act2Scene />);
    expect(screen.getAllByRole('button')).toHaveLength(4);
    for (const period of ACT2.periods) {
      const button = screen.getByRole('button', { name: period.shortLabel });
      expect(button).toHaveAttribute('type', 'button');
      expect(button.tabIndex).toBeGreaterThanOrEqual(0);
      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-pressed', 'true');
      expect(container.querySelector('[data-risk-map] title')).toHaveTextContent(period.label);
    }
  });

  it('el selector alinea el ScrollTrigger con progressForPeriod sin recorrer la serie', () => {
    const { container } = render(<Act2Scene />);
    const trigger = ScrollTrigger.getAll()[0];
    expect(trigger).toBeDefined();
    const scroll = vi.spyOn(trigger as ScrollTrigger, 'scroll');
    fireEvent.click(screen.getByRole('button', { name: /2050/ }));
    expect(scroll).toHaveBeenCalled();
    const destination = scroll.mock.calls[0]?.[0] ?? 0;
    expect(destination).toBeCloseTo(
      (trigger as ScrollTrigger).start +
        ((trigger as ScrollTrigger).end - (trigger as ScrollTrigger).start) * progressForPeriod(3),
      0,
    );
    expect(screen.getByRole('button', { name: /2050/ })).toHaveAttribute('aria-pressed', 'true');
    expect(container.querySelector('[data-risk-layer="2015"]')).toHaveAttribute('opacity', '0');
    expect(container.querySelector('[data-risk-layer="2026"]')).toHaveAttribute('opacity', '0');
    expect(container.querySelector('.act2-year')?.textContent).toContain('2050');
    expect(container.querySelector('.act2-year')?.textContent).not.toContain('2015');
  });

  // MAP-10
  it('MAP-10 · el período 2050 se marca como proyección, no como dato', () => {
    const { container } = render(<Act2Scene />);
    fireEvent.click(screen.getByRole('button', { name: /2050/ }));
    expect(container.querySelector('[data-risk-map] title')).toHaveTextContent('PROYECCIÓN 2050');
    expect(container.querySelector('.risk-map__projection')).toHaveTextContent(
      ACT2.copy.projectionNote,
    );
    expect(container.querySelector('[data-risk-map] desc')).toHaveTextContent(
      ACT2.copy.projectionNote,
    );
  });

  // MAP-11
  it('MAP-11 · no tiene violaciones de accesibilidad bloqueantes', async () => {
    const { container } = render(<Act2Scene />);
    await expectNoBlockingAxeViolations(container);
  });

  // MAP-01
  it('MAP-01 · los cuatro períodos activos en 0.12, 0.32, 0.52 y 0.72', () => {
    const peaks = [0.12, 0.32, 0.52, 0.72] as const;
    peaks.forEach((progress, index) => {
      const state = choreographAct2(progress);
      expect(state.periodoActivo).toBe(index);
      expect(state.year).toBe(YEARS[index]);
    });
  });

  // MAP-02
  it('MAP-02 · la suma de layerOpacity es exactamente 1', () => {
    for (let i = 0; i <= 100; i += 1) {
      const layers = choreographAct2(i / 100).layerOpacity;
      expect(layers[0] + layers[1] + layers[2] + layers[3]).toBe(1);
    }
  });

  // MAP-03
  it('MAP-03 · al final de la serie from == to == 3 y la última capa queda a 1', () => {
    const state = choreographAct2(1);
    expect(state.periodoActivo).toBe(3);
    expect(state.blend).toBe(0);
    expect(state.layerOpacity).toEqual([0, 0, 0, 1]);
    expect(state.layerOpacity.every((value) => Number.isFinite(value))).toBe(true);
  });

  // MAP-04
  it('MAP-04 · el año solo toma 1985, 2015, 2026 y 2050', () => {
    for (let i = 0; i <= 200; i += 1) {
      expect(YEARS).toContain(choreographAct2(i / 200).year);
    }
  });

  // MAP-05
  it('MAP-05 · southAmericaGlow es estrictamente creciente en la serie', () => {
    let previous = choreographAct2(0.12).southAmericaGlow;
    expect(previous).toBe(0);
    for (let i = 1; i <= 20; i += 1) {
      const current = choreographAct2(0.12 + (0.6 * i) / 20).southAmericaGlow;
      expect(current).toBeGreaterThan(previous);
      previous = current;
    }
    expect(choreographAct2(0.72).southAmericaGlow).toBe(1);
  });

  // MAP-08
  it('MAP-08 · con movimiento reducido los cuatro mapas están apilados y no hay ScrollTrigger', () => {
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
    render(<Act2Scene />);
    const captions = screen
      .getAllByRole('figure')
      .map((figure) => figure.querySelector('figcaption')?.textContent);
    expect(captions).toEqual(ACT2.periods.map((period) => period.label));
    expect(document.querySelectorAll('[data-risk-map]')).toHaveLength(4);
    expect(ScrollTrigger.getAll()).toEqual([]);
  });

  // MAP-12
  it('MAP-12 · desmontar deja cero ScrollTrigger', () => {
    const { unmount } = render(<Act2Scene />);
    expect(ScrollTrigger.getAll().length).toBeGreaterThan(0);
    unmount();
    expect(ScrollTrigger.getAll()).toEqual([]);
  });

  // MAP-15
  it('MAP-15 · el hero y el acto I siguen en la home con el acto II montado', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(HERO.headline);
    expect(
      screen.getByRole('heading', { level: 2, name: new RegExp(ACT1.title) }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Seguridad global/ })).toBeInTheDocument();
  });
});

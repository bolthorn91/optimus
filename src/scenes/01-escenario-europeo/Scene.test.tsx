import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { App } from '@/app/App';
import { easeInOut } from '@/lib/interpolate';
import { ScrollTrigger } from '@/motion/gsapSetup';
import { ACT1 } from '@/scenes/01-escenario-europeo/content';
import { DematerialisingNote } from '@/scenes/01-escenario-europeo/DematerialisingNote';
import { DensityIllustration } from '@/scenes/01-escenario-europeo/DensityIllustration';
import { Act1Scene } from '@/scenes/01-escenario-europeo/Scene';
import { SurveillanceGrid } from '@/scenes/01-escenario-europeo/SurveillanceGrid';
import { choreographAct1 } from '@/scenes/01-escenario-europeo/timeline';
import { expectNoBlockingAxeViolations } from '@/test/axe';

const CANON = readFileSync(
  resolve(process.cwd(), 'content/secciones/01-nuevo-escenario-europeo.md'),
  'utf8',
);

const nativeMatchMedia = window.matchMedia.bind(window);
const nativeWidth = window.innerWidth;

function setWidth(width: number): void {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
  window.dispatchEvent(new Event('resize'));
}

const canvasContext = {
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  fillStyle: '',
  globalAlpha: 1,
};

describe('Act1Scene', () => {
  beforeEach(() => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      canvasContext as unknown as CanvasRenderingContext2D,
    );
  });

  afterEach(() => {
    window.matchMedia = nativeMatchMedia;
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: nativeWidth });
    vi.restoreAllMocks();
    for (const trigger of ScrollTrigger.getAll()) trigger.kill();
  });

  // ACT1-01
  it('ACT1-01 · los títulos y cuerpos de los tres factores están en el DOM', () => {
    render(<Act1Scene />);
    for (const factor of ACT1.factors) {
      expect(screen.getByText(factor.title)).toBeInTheDocument();
      expect(screen.getByText(factor.body)).toBeInTheDocument();
    }
  });

  // ACT1-02
  it('ACT1-02 · el título es I. El nuevo escenario europeo con romano accesible', () => {
    render(<Act1Scene />);
    const heading = screen.getByRole('heading', { level: 2, name: /el nuevo escenario europeo/i });
    expect(heading).toHaveTextContent(`I. ${ACT1.title}`);
    expect(heading.querySelector('[lang="la"]')).toHaveAccessibleName('1');
  });

  // ACT1-06
  it('ACT1-06 · el 14 % está en el DOM con statProgress 0', () => {
    const { container } = render(<Act1Scene />);
    const final = container.querySelector('.visually-hidden');
    expect(final).not.toBeNull();
    expect((final?.textContent ?? '').replace(/\u00A0/g, ' ')).toBe('14 %');
    expect(container.querySelector('[data-stat-figure]')).not.toBeNull();
  });

  // ACT1-07
  it('ACT1-07 · DualFigure muestra XIV oculto y 14 % accesible', () => {
    const { container } = render(<Act1Scene />);
    const dual = container.querySelector('[data-dual-figure]');
    expect(dual).not.toBeNull();
    expect(dual?.querySelector('[data-dual-figure-roman]')).toHaveTextContent('XIV');
    expect(dual?.querySelector('[data-dual-figure-roman] [aria-hidden="true"]')).not.toBeNull();
    const accessible = dual?.querySelector('.visually-hidden');
    expect(accessible).not.toBeNull();
    expect((accessible?.textContent ?? '').replace(/\u00A0/g, ' ')).toBe('14 %');
  });

  // ACT1-11
  it('ACT1-11 · el CTA intermedio apunta a la página de contacto', () => {
    render(<Act1Scene />);
    const cta = screen.getByRole('link', { name: 'Analice su caso con un consultor' });
    expect(cta).toHaveAttribute('href', '/contacto');
  });

  // ACT1-12
  it('ACT1-12 · el texto de los tres factores coincide carácter a carácter con content/', () => {
    const unwrapped = CANON.replace(/\r\n/g, '\n')
      .replace(/^>\s?/gm, '')
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ');
    for (const factor of ACT1.factors) {
      expect(unwrapped).toContain(factor.title);
      expect(unwrapped).toContain(factor.body);
    }
  });

  // ACT1-09
  it('ACT1-09 · no tiene violaciones de accesibilidad bloqueantes', async () => {
    const { container } = render(<Act1Scene />);
    await expectNoBlockingAxeViolations(container);
  });

  // ACT1-08
  it('ACT1-08 · el párrafo bajo la retícula sigue siendo texto seleccionable', () => {
    const { container } = render(<Act1Scene />);
    const copy = container.querySelector('[data-surveillance-grid] .surveillance__copy p');
    expect(copy).toBeInstanceOf(HTMLParagraphElement);
    const surveillanceBody = ACT1.factors[1].body;
    expect(copy).toHaveTextContent(surveillanceBody);
    expect(copy?.closest('svg')).toBeNull();
  });

  // ACT1-03
  it('ACT1-03 · un factor visible por tramo', () => {
    expect(choreographAct1(0)).toEqual({
      introOpacity: 1,
      introY: 0,
      factorOpacity: [0, 0, 0],
      factorProgress: [0, 0, 0],
      factorY: [28, 28, 28],
      statProgress: 0,
      closingOpacity: 0,
      surfaceMix: 0,
    });
    const before = { opacity: 0, progress: 0, y: 28 };
    const mid = { opacity: 1, progress: 0.5, y: 0 };
    const after = { opacity: 0, progress: 1, y: -28 };
    const peaks = [
      { p: 0.31, active: 0 },
      { p: 0.57, active: 1 },
      { p: 0.83, active: 2 },
    ] as const;
    for (const { p, active } of peaks) {
      const state = choreographAct1(p);
      expect(state.introOpacity).toBe(0);
      expect(state.introY).toBe(0);
      expect(state.statProgress).toBe(0);
      expect(state.closingOpacity).toBe(0);
      expect(state.surfaceMix).toBeCloseTo(easeInOut(p));
      for (let i = 0; i < 3; i += 1) {
        const expected = i === active ? mid : i < active ? after : before;
        expect(state.factorOpacity[i]).toBe(expected.opacity);
        expect(state.factorProgress[i]).toBeCloseTo(expected.progress);
        expect(state.factorY[i]).toBeCloseTo(expected.y);
      }
    }
    expect(choreographAct1(1)).toEqual({
      introOpacity: 0,
      introY: 0,
      factorOpacity: [0, 0, 0],
      factorProgress: [1, 1, 1],
      factorY: [-28, -28, -28],
      statProgress: 1,
      closingOpacity: 1,
      surfaceMix: 1,
    });
  });

  // ACT1-04
  it('ACT1-04 · surfaceMix es estrictamente creciente', () => {
    let previous = choreographAct1(0).surfaceMix;
    expect(previous).toBe(0);
    for (let i = 1; i <= 20; i += 1) {
      const current = choreographAct1(i / 20).surfaceMix;
      expect(current).toBeGreaterThan(previous);
      previous = current;
    }
    expect(choreographAct1(1).surfaceMix).toBe(1);
  });

  // ACT1-05
  it('ACT1-05 · con movimiento reducido los tres factores están completos y no hay ScrollTrigger', () => {
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
    render(<Act1Scene />);
    for (const factor of ACT1.factors) {
      expect(screen.getByText(factor.title)).toBeInTheDocument();
      expect(screen.getByText(factor.body)).toBeInTheDocument();
    }
    expect(ScrollTrigger.getAll()).toEqual([]);
  });

  // ACT1-10
  it('ACT1-10 · desmontar deja cero ScrollTrigger', () => {
    const { unmount } = render(<Act1Scene />);
    expect(ScrollTrigger.getAll().length).toBeGreaterThan(0);
    unmount();
    expect(ScrollTrigger.getAll()).toEqual([]);
  });

  it('las tres ilustraciones están en el DOM y responden al progreso', () => {
    const { container } = render(<Act1Scene />);
    expect(container.querySelector('[data-density-illustration]')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(container.querySelector('[data-surveillance-grid]')).not.toBeNull();
    expect(container.querySelector('[data-dematerialising-note]')).toHaveAttribute(
      'aria-hidden',
      'true',
    );

    canvasContext.arc.mockClear();
    const { rerender: rerenderDensity } = render(<DensityIllustration progress={0} />);
    const xAt0 = Number(canvasContext.arc.mock.calls[0]?.[0]);
    canvasContext.arc.mockClear();
    rerenderDensity(<DensityIllustration progress={1} />);
    expect(Number(canvasContext.arc.mock.calls[0]?.[0])).not.toBe(xAt0);

    const { container: gridRoot, rerender: rerenderGrid } = render(
      <SurveillanceGrid progress={0}>
        <p>copy</p>
      </SurveillanceGrid>,
    );
    const grid = gridRoot.querySelector('[data-surveillance-grid]');
    expect(grid).toBeInstanceOf(HTMLElement);
    expect((grid as HTMLElement).style.getPropertyValue('--illustration-progress')).toBe('0');
    rerenderGrid(
      <SurveillanceGrid progress={0.8}>
        <p>copy</p>
      </SurveillanceGrid>,
    );
    expect((grid as HTMLElement).style.getPropertyValue('--illustration-progress')).toBe('0.8');

    const { container: noteRoot, rerender: rerenderNote } = render(
      <DematerialisingNote progress={0} />,
    );
    const note = noteRoot.querySelector('[data-dematerialising-note]');
    expect(note).toBeInstanceOf(SVGElement);
    expect((note as SVGElement).style.getPropertyValue('--illustration-progress')).toBe('0');
    rerenderNote(<DematerialisingNote progress={1} />);
    expect((note as SVGElement).style.getPropertyValue('--illustration-progress')).toBe('1');
  });

  // ACT1-13
  it('ACT1-13 · el shell sigue intacto con la escena montada', () => {
    const { container } = render(<App />);
    expect(container.querySelector('.skip-link')).toHaveTextContent('Saltar al contenido');
    expect(screen.getAllByText('Reservar sesión privada').length).toBeGreaterThan(0);
    expect(container.querySelector('[data-milestone]')).not.toBeNull();
    expect(screen.getAllByText('Escenario').length).toBeGreaterThan(0);
  });

  it('a 375 px el acto I es estático, sin ScrollTrigger, con los tres factores y la densidad final', () => {
    setWidth(375);
    const { container } = render(<Act1Scene />);
    expect(container.querySelector('#escenario')).toHaveAttribute('data-scene-mode', 'static');
    expect(ScrollTrigger.getAll()).toEqual([]);
    for (const factor of ACT1.factors) {
      expect(screen.getByText(factor.title)).toBeInTheDocument();
      expect(screen.getByText(factor.body)).toBeInTheDocument();
    }
    expect(container.querySelector('[data-density-illustration]')).toHaveAttribute(
      'data-progress',
      '1',
    );
  });
});

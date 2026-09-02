import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { App } from '@/app/App';
import { easeInOut } from '@/lib/interpolate';
import { ScrollTrigger } from '@/motion/gsapSetup';
import { ACT1 } from '@/scenes/01-escenario-europeo/content';
import { Act1Scene } from '@/scenes/01-escenario-europeo/Scene';
import { choreographAct1 } from '@/scenes/01-escenario-europeo/timeline';
import { expectNoBlockingAxeViolations } from '@/test/axe';

const CANON = readFileSync(
  resolve(process.cwd(), 'content/secciones/01-nuevo-escenario-europeo.md'),
  'utf8',
);

const nativeMatchMedia = window.matchMedia.bind(window);

describe('Act1Scene', () => {
  afterEach(() => {
    window.matchMedia = nativeMatchMedia;
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
  it('ACT1-11 · el CTA intermedio apunta a #contacto', () => {
    render(<Act1Scene />);
    const cta = screen.getByRole('link', { name: 'Analice su caso con un consultor' });
    expect(cta).toHaveAttribute('href', '#contacto');
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

  it('no tiene violaciones de accesibilidad bloqueantes', async () => {
    const { container } = render(<Act1Scene />);
    await expectNoBlockingAxeViolations(container);
  });

  // ACT1-03
  it('ACT1-03 · un factor visible por tramo', () => {
    expect(choreographAct1(0)).toEqual({
      introOpacity: 0,
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
      expect(state.introOpacity).toBe(1);
      expect(state.introY).toBe(-40);
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
      introOpacity: 1,
      introY: -40,
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

  it('desmontar deja cero ScrollTrigger', () => {
    const { unmount } = render(<Act1Scene />);
    expect(ScrollTrigger.getAll().length).toBeGreaterThan(0);
    unmount();
    expect(ScrollTrigger.getAll()).toEqual([]);
  });

  // ACT1-13
  it('ACT1-13 · el shell sigue intacto con la escena montada', () => {
    const { container } = render(<App />);
    expect(container.querySelector('.skip-link')).toHaveTextContent('Saltar al contenido');
    expect(screen.getAllByText('Reservar sesión privada').length).toBeGreaterThan(0);
    expect(container.querySelector('[data-milestone]')).not.toBeNull();
    expect(screen.getAllByText('Escenario').length).toBeGreaterThan(0);
  });
});

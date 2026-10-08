import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { App } from '@/app/App';
import { DISCLAIMER_TEXT } from '@/components/Disclaimer';
import { PENDING_LABEL } from '@/components/PendingValue';
import { resetAnalytics, setAnalyticsSink } from '@/lib/analytics';
import { formatCurrency, NBSP } from '@/lib/format';
import { project } from '@/lib/projection';
import { toRoman } from '@/lib/roman';
import { ScrollTrigger } from '@/motion/gsapSetup';
import { ACT1 } from '@/scenes/01-escenario-europeo/content';
import { ACT2 } from '@/scenes/02-seguridad-global/content';
import { ACT3 } from '@/scenes/03-asimetria-territorial/content';
import { ACT4 } from '@/scenes/04-marco-legal/content';
import { contactHref } from '@/scenes/05-activos-simulador/contactHref';
import { ACT5 } from '@/scenes/05-activos-simulador/content';
import { Act5Scene } from '@/scenes/05-activos-simulador/Scene';
import {
  clearSimulatorSession,
  readSimulatorSession,
} from '@/scenes/05-activos-simulador/simulatorSession';
import { CAPITAL_MIN } from '@/scenes/05-activos-simulador/sliderBounds';
import {
  AUTO_HORIZON_DURATION,
  AUTO_HORIZON_START,
  choreographAct5,
} from '@/scenes/05-activos-simulador/timeline';
import { DEFAULT_SIMULATOR_INPUT } from '@/scenes/05-activos-simulador/useSimulator';
import { expectNoBlockingAxeViolations } from '@/test/axe';

const CANON = readFileSync(
  resolve(process.cwd(), 'content/secciones/05-nuestra-estrategia.md'),
  'utf8',
);
const TABLES = readFileSync(resolve(process.cwd(), 'content/03-datos-y-tablas.md'), 'utf8');

const visible = (text: string): string => text.replaceAll(NBSP, ' ');
const MIN_INVESTMENT = /\d[\d.]{2,}\s*(US\$|USD|€|EUR|euros?)/i;
const nativeMatchMedia = window.matchMedia.bind(window);
const CSS = readFileSync(
  resolve(process.cwd(), 'src/scenes/05-activos-simulador/scene.css'),
  'utf8',
);

function stubNarrowViewport(): void {
  window.matchMedia = (query: string) =>
    ({
      matches: query.includes('min-width: 48rem') ? false : query.includes('max-width'),
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

function stubMatchMedia(queryNeedle: string): void {
  window.matchMedia = (query: string) =>
    ({
      matches: query.includes(queryNeedle),
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

function driveAct5(progress: number): void {
  const trigger = ScrollTrigger.getAll().find((item) => {
    const node = item.trigger;
    return node instanceof HTMLElement && node.id === 'activos';
  });
  expect(trigger).toBeDefined();
  act(() => {
    trigger?.vars.onUpdate?.({ progress } as ScrollTrigger);
  });
}

describe('Act5Scene', () => {
  afterEach(() => {
    window.matchMedia = nativeMatchMedia;
    clearSimulatorSession();
    resetAnalytics();
    for (const trigger of ScrollTrigger.getAll()) trigger.kill();
  });

  it('G7 · un control del simulador registra simulator_interaction', () => {
    const events: string[] = [];
    setAnalyticsSink((name) => {
      events.push(name);
    });
    render(<Act5Scene />);
    fireEvent.click(screen.getByRole('radio', { name: ACT5.copy.scenarioFavourable }));
    expect(events).toContain('simulator_interaction');
  });

  it('VEH-01 · los tres vehículos con ventaja y perfil literales del dossier', () => {
    const { container } = render(<Act5Scene />);
    expect(screen.getByRole('heading', { name: new RegExp(ACT5.title, 'i') })).toBeInTheDocument();
    expect(screen.getByText(ACT5.intro)).toBeInTheDocument();
    expect(container.querySelector('[data-disclaimer="inline"]')).toHaveTextContent(
      DISCLAIMER_TEXT,
    );
    expect(ACT5.vehicles).toHaveLength(3);
    for (const vehicle of ACT5.vehicles) {
      const card = container.querySelector(`[data-vehicle="${vehicle.id}"]`);
      expect(card).toHaveTextContent(vehicle.name);
      expect(card).toHaveTextContent(vehicle.advantage);
      expect(card).toHaveTextContent(vehicle.performance);
      expect(CANON).toContain(vehicle.name);
      expect(CANON).toContain(vehicle.advantage);
      expect(CANON).toContain(vehicle.performance);
      expect(TABLES).toContain(vehicle.name);
    }
  });

  it('VEH-02 · la tarjeta de proyectos de desarrollo contiene la glosa de al pozo', () => {
    const { container } = render(<Act5Scene />);
    const card = container.querySelector('[data-vehicle="development"]');
    const gloss = card?.querySelector('[data-pozo-gloss]');
    expect(card?.querySelector('summary')).toHaveTextContent(ACT5.copy.pozoTerm);
    expect(gloss).toHaveTextContent(ACT5.copy.pozoGloss);
    expect(ACT5.vehicles[2].glossary).toBe(ACT5.copy.pozoGloss);
  });

  it('VEH-03 · el suelo de entrada renderiza PendingValue y no publica cifra de importe mínimo', () => {
    const { container } = render(<Act5Scene />);
    const block = container.querySelector('[data-entry-floor]');
    expect(block).toHaveTextContent(ACT5.copy.entryFloorTitle);
    expect(block).toHaveTextContent(ACT5.entryFloor.note);
    expect(block?.querySelector('[data-pending]')).toHaveAttribute(
      'data-debt-id',
      ACT5.entryFloor.debtId,
    );
    expect(block).toHaveTextContent(PENDING_LABEL);
    expect(block?.textContent).not.toMatch(MIN_INVESTMENT);
    expect(JSON.stringify(ACT5)).not.toMatch(MIN_INVESTMENT);
  });

  it('VEH-06 · cada tarjeta repite sus etiquetas internas y no hay tabla con scroll horizontal', () => {
    stubNarrowViewport();
    expect(window.matchMedia('(min-width: 48rem)').matches).toBe(false);
    const { container } = render(<Act5Scene />);
    expect(container.querySelector('.vehicle-cards table')).toBeNull();
    const cards = container.querySelectorAll('[data-vehicle]');
    expect(cards).toHaveLength(3);
    for (const card of cards) {
      expect(card).toHaveTextContent(ACT5.copy.advantage);
      expect(card).toHaveTextContent(ACT5.copy.performance);
    }
    const list = container.querySelector('.vehicle-cards');
    expect(list).not.toBeNull();
    if (!list) return;
    expect(getComputedStyle(list).overflowX).not.toBe('scroll');
    const defaultBlock = /^\.vehicle-cards \{[^}]+\}/m.exec(CSS)?.[0];
    expect(defaultBlock).toMatch(/overflow-x:\s*visible/);
    expect(defaultBlock).not.toMatch(/grid-template-columns/);
    expect(CSS).toMatch(
      /@media \(min-width: 48rem\) \{[\s\S]*?\.vehicle-cards \{[\s\S]*?grid-template-columns:\s*repeat\(3/,
    );
  });

  it('VEH-07 · la sección no tiene violaciones axe critical ni serious', async () => {
    const { container } = render(<Act5Scene />);
    await expectNoBlockingAxeViolations(container);
  });

  it('VEH-04 · seleccionar una tarjeta cambia el vehículo del simulador y mueve el foco', () => {
    const { container } = render(<Act5Scene />);
    const equities = container.querySelector('[data-vehicle="equities"] button');
    expect(equities).toBeInstanceOf(HTMLButtonElement);
    if (!(equities instanceof HTMLButtonElement)) return;
    fireEvent.click(equities);
    expect(equities).toHaveAttribute('aria-pressed', 'true');
    expect(container.querySelector('[data-vehicle="equities"]')).toHaveAttribute(
      'data-selected',
      'true',
    );
    const simulator = container.querySelector('[data-simulator]');
    expect(simulator).toHaveFocus();
    const expected = project({ ...DEFAULT_SIMULATOR_INPUT, vehicle: 'equities' });
    expect(
      visible(container.querySelector('[data-simulator-result]')?.textContent ?? ''),
    ).toContain(visible(formatCurrency(expected.finalValue, 'USD', 2)));
  });

  it('VEH-05 · el CTA de cada tarjeta lleva al formulario con el vehículo como contexto', () => {
    const { container } = render(<Act5Scene />);
    for (const vehicle of ACT5.vehicles) {
      const card = container.querySelector(`[data-vehicle="${vehicle.id}"]`);
      const link = card?.querySelector('a');
      expect(link).toHaveAttribute('href', contactHref(vehicle.id));
      expect(link).toHaveTextContent(ACT5.cta.label);
    }
    const closing = screen.getAllByRole('link', { name: ACT5.cta.label });
    expect(closing.at(-1)).toHaveAttribute(
      'href',
      contactHref(DEFAULT_SIMULATOR_INPUT.vehicle, DEFAULT_SIMULATOR_INPUT),
    );
  });

  it('el anclaje usa 450vh y desmontar deja cero ScrollTrigger', () => {
    const { unmount } = render(<Act5Scene />);
    const trigger = ScrollTrigger.getAll().find((item) => {
      const node = item.trigger;
      return node instanceof HTMLElement && node.id === 'activos';
    });
    expect(trigger).toBeDefined();
    expect(trigger?.vars.pin).toBe(true);
    expect(trigger?.vars.end).toBe('+=450vh');
    unmount();
    expect(ScrollTrigger.getAll()).toEqual([]);
  });

  it('al cerrar el tramo automático el horizonte queda en 15 sin tocar el deslizador', () => {
    const { container } = render(<Act5Scene />);
    const horizon = container.querySelector('#simulator-horizon');
    expect(horizon).toBeInstanceOf(HTMLInputElement);
    if (!(horizon instanceof HTMLInputElement)) return;
    driveAct5(AUTO_HORIZON_START + AUTO_HORIZON_DURATION);
    expect(horizon).toHaveAttribute('aria-valuenow', '15');
    expect(container.querySelector('[data-projection-table] tbody')?.children).toHaveLength(15);
  });

  it('el horizonte avanza con el scroll y el deslizador toma el control sin salto', () => {
    const { container } = render(<Act5Scene />);
    const horizon = container.querySelector('#simulator-horizon');
    expect(horizon).toBeInstanceOf(HTMLInputElement);
    if (!(horizon instanceof HTMLInputElement)) return;
    expect(horizon).toHaveAttribute('aria-valuenow', String(DEFAULT_SIMULATOR_INPUT.years));
    const midProgress = AUTO_HORIZON_START + AUTO_HORIZON_DURATION / 2;
    const mid = choreographAct5(midProgress);
    driveAct5(midProgress);
    expect(horizon).toHaveAttribute('aria-valuenow', String(mid.yearsFromScroll));
    expect(container.querySelector('[data-projection-table] tbody')?.children).toHaveLength(
      mid.yearsFromScroll,
    );
    fireEvent.keyDown(horizon, { key: 'ArrowRight' });
    const taken = mid.yearsFromScroll + 1;
    expect(horizon).toHaveAttribute('aria-valuenow', String(taken));
    const stillAuto = AUTO_HORIZON_START + AUTO_HORIZON_DURATION - 0.01;
    expect(choreographAct5(stillAuto).autoHorizon).toBe(true);
    expect(choreographAct5(stillAuto).yearsFromScroll).not.toBe(taken);
    driveAct5(stillAuto);
    expect(horizon).toHaveAttribute('aria-valuenow', String(taken));
  });

  it('SIM-16 · con movimiento reducido los deslizadores funcionan y no hay avance automático', () => {
    stubMatchMedia('prefers-reduced-motion');
    const { container } = render(<Act5Scene />);
    expect(ScrollTrigger.getAll()).toEqual([]);
    const horizon = container.querySelector('#simulator-horizon');
    const capital = container.querySelector('#simulator-capital');
    expect(horizon).toBeInstanceOf(HTMLInputElement);
    expect(capital).toBeInstanceOf(HTMLInputElement);
    if (!(horizon instanceof HTMLInputElement) || !(capital instanceof HTMLInputElement)) return;
    expect(horizon).toHaveAttribute('aria-valuenow', String(DEFAULT_SIMULATOR_INPUT.years));
    expect(container.querySelector('[data-projection-table] tbody')?.children).toHaveLength(
      DEFAULT_SIMULATOR_INPUT.years,
    );
    fireEvent.keyDown(horizon, { key: 'End' });
    expect(horizon).toHaveAttribute('aria-valuenow', '15');
    fireEvent.keyDown(capital, { key: 'Home' });
    expect(capital).toHaveAttribute('aria-valuenow', String(CAPITAL_MIN));
    expect(container.querySelector('[data-simulator]')).toHaveTextContent(ACT5.copy.simulatorTitle);
    expect(container.querySelector('[data-assumptions]')).not.toBeNull();
  });

  it('la sesión en memoria sobrevive al desmontar y no usa localStorage', () => {
    const { container, unmount } = render(<Act5Scene />);
    const horizon = container.querySelector('#simulator-horizon');
    expect(horizon).toBeInstanceOf(HTMLInputElement);
    if (!(horizon instanceof HTMLInputElement)) return;
    fireEvent.keyDown(horizon, { key: 'Home' });
    expect(readSimulatorSession()?.input.years).toBe(1);
    expect(readSimulatorSession()?.horizonLocked).toBe(true);
    expect(localStorage.length).toBe(0);
    unmount();
    const remount = render(<Act5Scene />);
    expect(remount.container.querySelector('#simulator-horizon')).toHaveAttribute(
      'aria-valuenow',
      '1',
    );
    driveAct5(AUTO_HORIZON_START + AUTO_HORIZON_DURATION);
    expect(remount.container.querySelector('#simulator-horizon')).toHaveAttribute(
      'aria-valuenow',
      '1',
    );
  });

  it('VEH-08 · los actos I a IV siguen en el DOM con el acto V y el sello del VI', () => {
    const { container } = render(<App />);
    expect(screen.getByRole('heading', { name: new RegExp(ACT1.title, 'i') })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: new RegExp(ACT2.title, 'i') })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: new RegExp(ACT3.title, 'i') })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: new RegExp(ACT4.title, 'i') })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: new RegExp(ACT5.title, 'i') })).toBeInTheDocument();
    const seals = [...container.querySelectorAll('[data-act-seal]')];
    const numerals = seals.map((seal) => seal.querySelector('[lang="la"]')?.textContent);
    expect(numerals).toContain(toRoman(5));
    expect(numerals).toContain(toRoman(6));
    const sealVi = seals.find(
      (seal) => seal.querySelector('[lang="la"]')?.textContent === toRoman(6),
    );
    expect(sealVi).toBeInstanceOf(HTMLElement);
    if (!(sealVi instanceof HTMLElement) || !(sealVi.parentElement instanceof HTMLElement)) return;
    expect(sealVi.parentElement.classList.contains('on-navy')).toBe(false);
  });
});

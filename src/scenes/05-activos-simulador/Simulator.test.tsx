import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { DISCLAIMER_TEXT } from '@/components/Disclaimer';
import { formatCurrency, formatPercent, NBSP } from '@/lib/format';
import { project } from '@/lib/projection';
import {
  ANNUAL_RATE,
  ANNUAL_RENTAL_YIELD,
  ASSUMPTIONS_DISCLAIMER,
} from '@/lib/projection-assumptions';
import { ScrollTrigger } from '@/motion/gsapSetup';
import { ACT5 } from '@/scenes/05-activos-simulador/content';
import { Act5Scene } from '@/scenes/05-activos-simulador/Scene';
import { CAPITAL_MAX, CAPITAL_MIN, CAPITAL_STEP } from '@/scenes/05-activos-simulador/sliderBounds';
import { DEFAULT_SIMULATOR_INPUT } from '@/scenes/05-activos-simulador/useSimulator';
import { expectNoBlockingAxeViolations } from '@/test/axe';

const visible = (text: string): string => text.replaceAll(NBSP, ' ');
const PERSONAL = /edad|patrimonio|situación fiscal|situacion fiscal|objetivos personales/i;
const ADVICE = /le conviene|recomendad|rendimiento esperado|rentabilidad garantizada/i;

describe('Simulator', () => {
  afterEach(() => {
    for (const trigger of ScrollTrigger.getAll()) trigger.kill();
  });

  it('SIM-11 · AssumptionsPanel muestra la tasa aplicada y su justificación', () => {
    const { container } = render(<Act5Scene />);
    const panel = container.querySelector('[data-assumptions]');
    const rate = ANNUAL_RATE['real-estate'].base;
    expect(panel).toHaveTextContent(ACT5.copy.assumptionsTitle);
    expect(visible(panel?.textContent ?? '')).toContain(visible(formatPercent(rate * 100, 1)));
    expect(visible(panel?.textContent ?? '')).toContain(
      visible(formatPercent(ANNUAL_RENTAL_YIELD['real-estate'] * 100, 1)),
    );
    expect(panel).toHaveTextContent(ASSUMPTIONS_DISCLAIMER);
    expect(panel).toHaveTextContent(/capital inicial/i);
    expect(panel).toHaveTextContent(ACT5.copy.scenarioBase);
    expect(panel).toHaveTextContent(ACT5.vehicles[0].name);
  });

  it('SIM-12 · el disclaimer inline está adherido al resultado', () => {
    const { container } = render(<Act5Scene />);
    const result = container.querySelector('[data-simulator-result]');
    const disclaimer = result?.querySelector('[data-disclaimer="inline"]');
    expect(disclaimer).toHaveTextContent(DISCLAIMER_TEXT);
    expect(result?.querySelector('[data-stat-figure]')).not.toBeNull();
  });

  it('SIM-13 · el resultado se rotula como escenario ilustrativo', () => {
    const { container } = render(<Act5Scene />);
    const simulator = container.querySelector('[data-simulator]');
    expect(simulator).toHaveTextContent(ACT5.copy.simulatorTitle);
    expect(simulator?.textContent).not.toMatch(ADVICE);
  });

  it('SIM-14 · la tabla año a año está en el DOM con los mismos valores que el gráfico', () => {
    const { container } = render(<Act5Scene />);
    const chart = container.querySelector('[data-projection-chart]');
    const table = container.querySelector('[data-projection-table]');
    expect(chart).toHaveAttribute('aria-hidden', 'true');
    expect(table).not.toBeNull();
    expect(table?.querySelector('caption')).toHaveTextContent(ACT5.copy.tableCaption);
    const expected = project(DEFAULT_SIMULATOR_INPUT);
    expect(table?.querySelectorAll('tbody tr')).toHaveLength(expected.series.length);
    for (const row of expected.series) {
      const point = chart?.querySelector(`[data-year="${String(row.year)}"]`);
      const cell = table?.querySelector(`[data-year="${String(row.year)}"] [data-value]`);
      expect(point).toHaveAttribute('data-value', String(row.value));
      expect(cell).toHaveAttribute('data-value', String(row.value));
      expect(visible(cell?.textContent ?? '')).toBe(visible(formatCurrency(row.value, 'USD', 2)));
    }
  });

  it('SIM-15 · los deslizadores responden a flechas, Page, Home y End con roles ARIA', () => {
    const { container } = render(<Act5Scene />);
    const capital = container.querySelector('#simulator-capital');
    const horizon = container.querySelector('#simulator-horizon');
    expect(capital).toBeInstanceOf(HTMLInputElement);
    expect(horizon).toBeInstanceOf(HTMLInputElement);
    if (!(capital instanceof HTMLInputElement) || !(horizon instanceof HTMLInputElement)) return;
    expect(capital).toHaveAttribute('type', 'range');
    expect(capital).toHaveAttribute('aria-valuemin', String(CAPITAL_MIN));
    expect(capital).toHaveAttribute('aria-valuemax', String(CAPITAL_MAX));
    expect(capital).toHaveAttribute('aria-valuenow', String(DEFAULT_SIMULATOR_INPUT.capital));
    fireEvent.keyDown(capital, { key: 'ArrowRight' });
    expect(capital).toHaveAttribute(
      'aria-valuenow',
      String(DEFAULT_SIMULATOR_INPUT.capital + CAPITAL_STEP),
    );
    fireEvent.keyDown(capital, { key: 'Home' });
    expect(capital).toHaveAttribute('aria-valuenow', String(CAPITAL_MIN));
    fireEvent.keyDown(capital, { key: 'End' });
    expect(capital).toHaveAttribute('aria-valuenow', String(CAPITAL_MAX));
    fireEvent.keyDown(capital, { key: 'Home' });
    fireEvent.keyDown(capital, { key: 'PageUp' });
    expect(capital).toHaveAttribute('aria-valuenow', String(CAPITAL_MIN + CAPITAL_STEP * 5));
    fireEvent.keyDown(horizon, { key: 'ArrowLeft' });
    expect(horizon).toHaveAttribute('aria-valuenow', String(DEFAULT_SIMULATOR_INPUT.years - 1));
    fireEvent.keyDown(horizon, { key: 'Home' });
    expect(horizon).toHaveAttribute('aria-valuenow', '1');
    fireEvent.keyDown(horizon, { key: 'End' });
    expect(horizon).toHaveAttribute('aria-valuenow', '15');
    fireEvent.keyDown(horizon, { key: 'PageDown' });
    expect(horizon).toHaveAttribute('aria-valuenow', '10');
  });

  it('el escenario conservador recalcula cifras, supuestos y tabla', () => {
    const { container } = render(<Act5Scene />);
    fireEvent.click(screen.getByRole('radio', { name: ACT5.copy.scenarioConservative }));
    const expected = project({ ...DEFAULT_SIMULATOR_INPUT, scenario: 'conservative' });
    const resultBlock = container.querySelector('[data-simulator-result]');
    expect(visible(resultBlock?.textContent ?? '')).toContain(
      visible(formatCurrency(expected.finalValue, 'USD', 2)),
    );
    expect(container.querySelector('[data-assumptions]')).toHaveTextContent(
      ACT5.copy.scenarioConservative,
    );
    expect(visible(container.querySelector('[data-assumptions]')?.textContent ?? '')).toContain(
      visible(formatPercent(ANNUAL_RATE['real-estate'].conservative * 100, 1)),
    );
    for (const row of expected.series) {
      expect(
        container.querySelector(
          `[data-projection-table] [data-year="${String(row.year)}"] [data-value]`,
        ),
      ).toHaveAttribute('data-value', String(row.value));
      expect(
        container.querySelector(`[data-projection-chart] [data-year="${String(row.year)}"]`),
      ).toHaveAttribute('data-value', String(row.value));
    }
  });

  it('el capital numérico se acota al rango del deslizador al salir del campo', () => {
    const { container } = render(<Act5Scene />);
    const field = container.querySelector('[data-capital-slider] input[type="number"]');
    const range = container.querySelector('#simulator-capital');
    expect(field).toBeInstanceOf(HTMLInputElement);
    expect(range).toBeInstanceOf(HTMLInputElement);
    if (!(field instanceof HTMLInputElement) || !(range instanceof HTMLInputElement)) return;
    fireEvent.focus(field);
    fireEvent.change(field, { target: { value: '1' } });
    fireEvent.blur(field);
    expect(range).toHaveAttribute('aria-valuenow', String(CAPITAL_MIN));
    fireEvent.focus(field);
    fireEvent.change(field, { target: { value: '999999999' } });
    fireEvent.blur(field);
    expect(range).toHaveAttribute('aria-valuenow', String(CAPITAL_MAX));
  });

  it('SIM-17 · el simulador no tiene violaciones axe critical ni serious', async () => {
    const { container } = render(<Act5Scene />);
    const simulator = container.querySelector('[data-simulator]');
    expect(simulator).not.toBeNull();
    if (!simulator) return;
    await expectNoBlockingAxeViolations(simulator);
  });

  it('SIM-19 · no se solicita ningún dato personal', () => {
    const { container } = render(<Act5Scene />);
    const simulator = container.querySelector('[data-simulator]');
    expect(simulator?.textContent).not.toMatch(PERSONAL);
    expect(simulator?.querySelector('input[type="email"]')).toBeNull();
    expect(simulator?.querySelector('input[name="age"]')).toBeNull();
  });

  it('SIM-20 · ningún vehículo se marca como recomendado ni se ordena por atractivo', () => {
    const { container } = render(<Act5Scene />);
    expect(container.textContent).not.toMatch(ADVICE);
    const ids = [...container.querySelectorAll('[data-vehicle]')].map((node) =>
      node.getAttribute('data-vehicle'),
    );
    expect(ids).toEqual(ACT5.vehicles.map((vehicle) => vehicle.id));
  });
});

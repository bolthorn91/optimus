import { describe, expect, it } from 'vitest';

import {
  coerceProjectionInput,
  project,
  type ProjectionInput,
  type Scenario,
} from '@/lib/projection';
import {
  ANNUAL_RATE,
  ANNUAL_RENTAL_YIELD,
  ASSUMPTIONS_RATIONALE,
} from '@/lib/projection-assumptions';

const BASE: ProjectionInput = {
  capital: 100_000,
  years: 10,
  scenario: 'base',
  vehicle: 'real-estate',
};

function isCents(value: number): boolean {
  return Math.abs(value * 100 - Math.round(value * 100)) < 1e-8;
}

describe('project', () => {
  it('SIM-01 · serie de 10 años con year 1..10 para 100.000 USD base inmobiliario', () => {
    const result = project(BASE);
    const rate = ANNUAL_RATE['real-estate'].base;
    const round2 = (value: number): number => Math.round((value + Number.EPSILON) * 100) / 100;
    expect(result.series).toHaveLength(10);
    expect(result.series.map((row) => row.year)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(result.series[0]?.value).toBe(round2(BASE.capital * (1 + rate)));
    expect(result.series[1]?.value).toBe(round2(BASE.capital * (1 + rate) ** 2));
    expect(result.series[1]?.value).not.toBe(round2(BASE.capital * (1 + rate * 2)));
    const last = result.series[9];
    expect(last).toBeDefined();
    expect(result.finalValue).toBe(last?.value);
    expect(result.totalGain).toBe(last?.gain);
    expect(result.totalRentalIncome).toBe(last?.rentalIncome);
    expect(result.assumptions).toEqual({
      rate,
      rentYield: ANNUAL_RENTAL_YIELD['real-estate'],
      scenario: 'base',
      vehicle: 'real-estate',
      rationale: ASSUMPTIONS_RATIONALE,
    });
    expect(result.assumptions.rationale).toMatch(/capital inicial/i);
  });

  it('SIM-02 · la misma entrada dos veces produce el mismo resultado', () => {
    expect(project(BASE)).toEqual(project(BASE));
  });

  it('SIM-03 · capital 0, negativo, NaN o Infinity lanzan RangeError', () => {
    expect(() => project({ ...BASE, capital: 0 })).toThrow(RangeError);
    expect(() => project({ ...BASE, capital: -1 })).toThrow(RangeError);
    expect(() => project({ ...BASE, capital: Number.NaN })).toThrow(RangeError);
    expect(() => project({ ...BASE, capital: Number.POSITIVE_INFINITY })).toThrow(RangeError);
  });

  it('SIM-04 · years 0, 16, 1.5 o NaN lanzan RangeError', () => {
    expect(() => project({ ...BASE, years: 0 })).toThrow(RangeError);
    expect(() => project({ ...BASE, years: 16 })).toThrow(RangeError);
    expect(() => project({ ...BASE, years: 1.5 })).toThrow(RangeError);
    expect(() => project({ ...BASE, years: Number.NaN })).toThrow(RangeError);
  });

  it('SIM-05 · escenario o vehículo fuera del enum lanzan RangeError', () => {
    expect(() => project({ ...BASE, scenario: 'bull' as Scenario })).toThrow(RangeError);
    expect(() => project({ ...BASE, vehicle: 'crypto' as ProjectionInput['vehicle'] })).toThrow(
      RangeError,
    );
  });

  it('SIM-06 · en un vehículo sin renta rentalIncome es 0 exacto en toda la serie', () => {
    for (const vehicle of ['equities', 'development'] as const) {
      const result = project({ ...BASE, vehicle });
      for (const row of result.series) {
        expect(row.rentalIncome).toBe(0);
        expect(Number.isNaN(row.rentalIncome)).toBe(false);
      }
      expect(result.totalRentalIncome).toBe(0);
    }
  });

  it('SIM-07 · la renta inmobiliaria crece lineal sobre el capital inicial', () => {
    const result = project(BASE);
    const yieldRate = ANNUAL_RENTAL_YIELD['real-estate'];
    result.series.forEach((row, index) => {
      const expected =
        Math.round((BASE.capital * yieldRate * (index + 1) + Number.EPSILON) * 100) / 100;
      expect(row.rentalIncome).toBe(expected);
      expect(row.rentalIncome).toBeCloseTo(BASE.capital * yieldRate * row.year, 2);
      expect(row.rentalIncome).not.toBeCloseTo(row.value * yieldRate * row.year, 2);
    });
  });

  it('SIM-08 · el valor final crece de conservador a base a favorable', () => {
    const conservative = project({ ...BASE, scenario: 'conservative' }).finalValue;
    const base = project({ ...BASE, scenario: 'base' }).finalValue;
    const favourable = project({ ...BASE, scenario: 'favourable' }).finalValue;
    expect(base).toBeGreaterThan(conservative);
    expect(favourable).toBeGreaterThan(base);
  });

  it('SIM-09 · gain[n] es value[n] − capital en todos los años', () => {
    for (const vehicle of ['real-estate', 'equities', 'development'] as const) {
      const result = project({ ...BASE, vehicle });
      for (const row of result.series) {
        expect(row.gain).toBeCloseTo(row.value - BASE.capital, 2);
      }
    }
  });

  it('SIM-10 · todos los valores están redondeados a dos decimales', () => {
    const result = project({ ...BASE, capital: 123_456.78, years: 15, scenario: 'favourable' });
    for (const row of result.series) {
      expect(isCents(row.value)).toBe(true);
      expect(isCents(row.gain)).toBe(true);
      expect(isCents(row.rentalIncome)).toBe(true);
    }
    expect(isCents(result.finalValue)).toBe(true);
    expect(isCents(result.totalGain)).toBe(true);
    expect(isCents(result.totalRentalIncome)).toBe(true);
  });

  it('SIM-18 · al cambiar de escenario la serie se recalcula íntegra', () => {
    const first = project({ ...BASE, scenario: 'conservative' });
    const second = project({ ...BASE, scenario: 'favourable' });
    expect(second.series).toHaveLength(first.series.length);
    second.series.forEach((row, index) => {
      expect(row.year).toBe(first.series[index]?.year);
      expect(row.value).not.toBe(first.series[index]?.value);
    });
    expect(project({ ...BASE, scenario: 'favourable' })).toEqual(second);
  });

  it('un capital de 10^12 sigue siendo finito', () => {
    const result = project({ ...BASE, capital: 1e12 });
    expect(Number.isFinite(result.finalValue)).toBe(true);
    expect(result.finalValue).toBeGreaterThan(1e12);
  });

  it('coerceProjectionInput conserva el fallback en campos inválidos y redondea el horizonte', () => {
    expect(coerceProjectionInput({ capital: 0, years: 1.5 }, BASE)).toEqual({
      ...BASE,
      years: 2,
    });
    expect(coerceProjectionInput({ years: Number.NaN }, { ...BASE, years: 5 })).toEqual({
      ...BASE,
      years: 5,
    });
    expect(
      coerceProjectionInput(
        { scenario: 'bull' as Scenario, vehicle: 'crypto' as ProjectionInput['vehicle'] },
        BASE,
      ),
    ).toEqual(BASE);
  });
});

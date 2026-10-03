import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { project } from '@/lib/projection';
import { clearSimulatorSession } from '@/scenes/05-activos-simulador/simulatorSession';
import { DEFAULT_SIMULATOR_INPUT, useSimulator } from '@/scenes/05-activos-simulador/useSimulator';

describe('useSimulator', () => {
  afterEach(() => {
    clearSimulatorSession();
  });

  it('arranca en inmobiliario base a 10 años y coincide con project', () => {
    const { result } = renderHook(() => useSimulator());
    expect(result.current.input).toEqual(DEFAULT_SIMULATOR_INPUT);
    expect(result.current.result).toEqual(project(DEFAULT_SIMULATOR_INPUT));
  });

  it('SIM-18 · al cambiar de escenario la serie entera es la de project del nuevo input', () => {
    const { result } = renderHook(() => useSimulator());
    act(() => {
      result.current.setScenario('conservative');
    });
    const conservative = result.current.result.series.map((row) => row.value);
    act(() => {
      result.current.setScenario('favourable');
    });
    expect(result.current.result).toEqual(
      project({ ...DEFAULT_SIMULATOR_INPUT, scenario: 'favourable' }),
    );
    expect(result.current.result.series.map((row) => row.value)).not.toEqual(conservative);
  });

  it('setCapital actualiza el capital y el resultado coincide con project', () => {
    const { result } = renderHook(() => useSimulator());
    act(() => {
      result.current.setCapital(250_000);
    });
    expect(result.current.input.capital).toBe(250_000);
    expect(result.current.result).toEqual(
      project({ ...DEFAULT_SIMULATOR_INPUT, capital: 250_000 }),
    );
  });

  it('resolveInput sanitiza capital 0 y years 1.5 en el arranque', () => {
    const { result } = renderHook(() => useSimulator({ capital: 0, years: 1.5 }));
    expect(result.current.input.capital).toBe(DEFAULT_SIMULATOR_INPUT.capital);
    expect(result.current.input.years).toBe(2);
    expect(result.current.result).toEqual(project({ ...DEFAULT_SIMULATOR_INPUT, years: 2 }));
  });

  it('setCapital ignora valores no positivos y el árbol no lanza', () => {
    const { result } = renderHook(() => useSimulator());
    act(() => {
      result.current.setCapital(0);
      result.current.setCapital(-10);
      result.current.setCapital(Number.NaN);
    });
    expect(result.current.input).toEqual(DEFAULT_SIMULATOR_INPUT);
    expect(result.current.result).toEqual(project(DEFAULT_SIMULATOR_INPUT));
  });

  it('setYears ignora NaN y conserva el horizonte actual', () => {
    const { result } = renderHook(() => useSimulator());
    act(() => {
      result.current.setYears(5);
    });
    act(() => {
      result.current.setYears(Number.NaN);
    });
    expect(result.current.input.years).toBe(5);
    expect(result.current.result).toEqual(project({ ...DEFAULT_SIMULATOR_INPUT, years: 5 }));
  });

  it('setYears con el mismo valor conserva la identidad del input', () => {
    const { result } = renderHook(() => useSimulator());
    const first = result.current.input;
    act(() => {
      result.current.setYears(DEFAULT_SIMULATOR_INPUT.years);
      result.current.setCapital(DEFAULT_SIMULATOR_INPUT.capital);
    });
    expect(result.current.input).toBe(first);
  });

  it('syncYears cede cuando el visitante ya tomó el horizonte', () => {
    const { result, unmount } = renderHook(() => useSimulator());
    act(() => {
      result.current.syncYears(12);
    });
    expect(result.current.input.years).toBe(12);
    act(() => {
      result.current.setYears(8);
    });
    act(() => {
      result.current.syncYears(15);
    });
    expect(result.current.input.years).toBe(8);
    expect(result.current.result).toEqual(project({ ...DEFAULT_SIMULATOR_INPUT, years: 8 }));
    unmount();
    const remount = renderHook(() => useSimulator());
    act(() => {
      remount.result.current.syncYears(15);
    });
    expect(remount.result.current.input.years).toBe(8);
  });

  it('setVehicle y setYears sustituyen el input y recalculan', () => {
    const { result } = renderHook(() => useSimulator());
    act(() => {
      result.current.setVehicle('equities');
      result.current.setYears(5);
    });
    expect(result.current.input.vehicle).toBe('equities');
    expect(result.current.input.years).toBe(5);
    expect(result.current.result).toEqual(
      project({ ...DEFAULT_SIMULATOR_INPUT, vehicle: 'equities', years: 5 }),
    );
    expect(result.current.result.series).toHaveLength(5);
    expect(result.current.result.totalRentalIncome).toBe(0);
  });
});

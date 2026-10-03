import { useCallback, useMemo, useState } from 'react';

import {
  coerceProjectionInput,
  project,
  type ProjectionInput,
  type ProjectionResult,
} from '@/lib/projection';
import type { Scenario, VehicleId } from '@/lib/projection-assumptions';

export const DEFAULT_SIMULATOR_INPUT: ProjectionInput = {
  capital: 100_000,
  years: 10,
  scenario: 'base',
  vehicle: 'real-estate',
};

export function useSimulator(initial: Partial<ProjectionInput> = {}): {
  input: ProjectionInput;
  result: ProjectionResult;
  setCapital: (capital: number) => void;
  setYears: (years: number) => void;
  setScenario: (scenario: Scenario) => void;
  setVehicle: (vehicle: VehicleId) => void;
} {
  const [input, setInput] = useState<ProjectionInput>(() =>
    coerceProjectionInput(initial, DEFAULT_SIMULATOR_INPUT),
  );
  const result = useMemo(() => project(input), [input]);

  const setCapital = useCallback((capital: number) => {
    setInput((current) => coerceProjectionInput({ ...current, capital }, current));
  }, []);
  const setYears = useCallback((years: number) => {
    setInput((current) => coerceProjectionInput({ ...current, years }, current));
  }, []);
  const setScenario = useCallback((scenario: Scenario) => {
    setInput((current) => ({ ...current, scenario }));
  }, []);
  const setVehicle = useCallback((vehicle: VehicleId) => {
    setInput((current) => ({ ...current, vehicle }));
  }, []);

  return { input, result, setCapital, setYears, setScenario, setVehicle };
}

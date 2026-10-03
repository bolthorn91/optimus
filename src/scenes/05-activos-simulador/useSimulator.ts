import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  coerceProjectionInput,
  project,
  type ProjectionInput,
  type ProjectionResult,
} from '@/lib/projection';
import { HORIZON_DEFAULT, type Scenario, type VehicleId } from '@/lib/projection-assumptions';
import {
  readSimulatorSession,
  writeSimulatorSession,
} from '@/scenes/05-activos-simulador/simulatorSession';

export const DEFAULT_SIMULATOR_INPUT: ProjectionInput = {
  capital: 100_000,
  years: HORIZON_DEFAULT,
  scenario: 'base',
  vehicle: 'real-estate',
};

function commit(current: ProjectionInput, patch: Partial<ProjectionInput>): ProjectionInput {
  const next = coerceProjectionInput({ ...current, ...patch }, current);
  return next.capital === current.capital &&
    next.years === current.years &&
    next.scenario === current.scenario &&
    next.vehicle === current.vehicle
    ? current
    : next;
}

function persist(input: ProjectionInput, horizonLocked: boolean): void {
  writeSimulatorSession({ horizonLocked, input });
}

export function useSimulator(initial: Partial<ProjectionInput> = {}): {
  input: ProjectionInput;
  result: ProjectionResult;
  setCapital: (capital: number) => void;
  setYears: (years: number) => void;
  syncYears: (years: number) => void;
  setScenario: (scenario: Scenario) => void;
  setVehicle: (vehicle: VehicleId) => void;
} {
  const stored = readSimulatorSession();
  const [input, setInput] = useState<ProjectionInput>(() =>
    coerceProjectionInput(initial, stored?.input ?? DEFAULT_SIMULATOR_INPUT),
  );
  const result = useMemo(() => project(input), [input]);
  const takeover = useRef(stored?.horizonLocked ?? false);

  const patchInput = useCallback((patch: Partial<ProjectionInput>, horizonLocked: boolean) => {
    takeover.current = horizonLocked;
    setInput((current) => {
      const next = commit(current, patch);
      persist(next, horizonLocked);
      return next;
    });
  }, []);

  const setCapital = useCallback(
    (capital: number) => {
      patchInput({ capital }, takeover.current);
    },
    [patchInput],
  );
  const setYears = useCallback(
    (years: number) => {
      patchInput({ years }, true);
    },
    [patchInput],
  );
  const syncYears = useCallback(
    (years: number) => {
      if (takeover.current) return;
      patchInput({ years }, false);
    },
    [patchInput],
  );
  const setScenario = useCallback(
    (scenario: Scenario) => {
      patchInput({ scenario }, takeover.current);
    },
    [patchInput],
  );
  const setVehicle = useCallback(
    (vehicle: VehicleId) => {
      patchInput({ vehicle }, takeover.current);
    },
    [patchInput],
  );

  useEffect(() => {
    persist(input, takeover.current);
  }, [input]);

  return { input, result, setCapital, setYears, syncYears, setScenario, setVehicle };
}

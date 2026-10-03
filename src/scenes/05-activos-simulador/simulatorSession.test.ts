import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  clearSimulatorSession,
  readSimulatorSession,
  subscribeSimulatorSession,
  writeSimulatorSession,
} from '@/scenes/05-activos-simulador/simulatorSession';
import { DEFAULT_SIMULATOR_INPUT } from '@/scenes/05-activos-simulador/useSimulator';

describe('simulatorSession', () => {
  afterEach(() => {
    clearSimulatorSession();
  });

  it('arranca vacío y no toca localStorage', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    expect(readSimulatorSession()).toBeNull();
    writeSimulatorSession({ horizonLocked: false, input: DEFAULT_SIMULATOR_INPUT });
    expect(setItem).not.toHaveBeenCalled();
    expect(localStorage.length).toBe(0);
    setItem.mockRestore();
  });

  it('escribe una copia y la lectura no comparte la referencia', () => {
    writeSimulatorSession({ horizonLocked: true, input: DEFAULT_SIMULATOR_INPUT });
    const first = readSimulatorSession();
    const second = readSimulatorSession();
    expect(first).toEqual({ horizonLocked: true, input: DEFAULT_SIMULATOR_INPUT });
    expect(first?.input).not.toBe(DEFAULT_SIMULATOR_INPUT);
    expect(second?.input).not.toBe(first?.input);
    if (!first) return;
    first.input.years = 1;
    expect(readSimulatorSession()?.input.years).toBe(DEFAULT_SIMULATOR_INPUT.years);
  });

  it('clear deja la sesión vacía', () => {
    writeSimulatorSession({
      horizonLocked: false,
      input: { ...DEFAULT_SIMULATOR_INPUT, vehicle: 'equities' },
    });
    clearSimulatorSession();
    expect(readSimulatorSession()).toBeNull();
  });

  it('notifica a los suscriptores al escribir y al vaciar', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeSimulatorSession(listener);
    writeSimulatorSession({ horizonLocked: false, input: DEFAULT_SIMULATOR_INPUT });
    expect(listener).toHaveBeenCalledTimes(1);
    clearSimulatorSession();
    expect(listener).toHaveBeenCalledTimes(2);
    unsubscribe();
    writeSimulatorSession({ horizonLocked: true, input: DEFAULT_SIMULATOR_INPUT });
    expect(listener).toHaveBeenCalledTimes(2);
  });
});

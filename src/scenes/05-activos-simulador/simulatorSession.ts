import type { ProjectionInput } from '@/lib/projection';

export interface SimulatorSession {
  input: ProjectionInput;
  horizonLocked: boolean;
}

let snapshot: SimulatorSession | null = null;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

export function subscribeSimulatorSession(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

/** Referencia estable entre escrituras: `useSyncExternalStore` compara por identidad. */
export function getSimulatorSessionSnapshot(): SimulatorSession | null {
  return snapshot;
}

export function writeSimulatorSession(session: SimulatorSession): void {
  snapshot = { horizonLocked: session.horizonLocked, input: { ...session.input } };
  emit();
}

export function readSimulatorSession(): SimulatorSession | null {
  return snapshot === null
    ? null
    : { horizonLocked: snapshot.horizonLocked, input: { ...snapshot.input } };
}

export function clearSimulatorSession(): void {
  snapshot = null;
  emit();
}

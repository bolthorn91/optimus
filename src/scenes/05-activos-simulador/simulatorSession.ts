import type { ProjectionInput } from '@/lib/projection';

export interface SimulatorSession {
  input: ProjectionInput;
  horizonLocked: boolean;
}

let snapshot: SimulatorSession | null = null;

export function writeSimulatorSession(session: SimulatorSession): void {
  snapshot = { horizonLocked: session.horizonLocked, input: { ...session.input } };
}

export function readSimulatorSession(): SimulatorSession | null {
  return snapshot === null
    ? null
    : { horizonLocked: snapshot.horizonLocked, input: { ...snapshot.input } };
}

export function clearSimulatorSession(): void {
  snapshot = null;
}

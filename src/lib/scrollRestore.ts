export type ScrollCommand =
  { kind: 'noop' } | { kind: 'top' } | { kind: 'restore' } | { kind: 'hash'; id: string };

export interface ScrollDecisionInput {
  prevPath: string;
  nextPath: string;
  nextHash: string;
}

const HOME = '/';

function hashId(hash: string): string | undefined {
  return hash.length > 1 ? hash.slice(1) : undefined;
}

/** Qué hacer con el scroll al cambiar de ruta. La posición de la home la guarda el listener. */
export function decideScroll(input: ScrollDecisionInput): ScrollCommand {
  const { prevPath, nextPath, nextHash } = input;
  const id = hashId(nextHash);
  const arrivingHome = nextPath === HOME && prevPath !== HOME && prevPath !== '';

  if (prevPath === '') {
    if (id) return { kind: 'hash', id };
    if (nextPath === HOME) return { kind: 'noop' };
    return { kind: 'top' };
  }

  if (id && nextPath === HOME) return { kind: 'hash', id };
  if (arrivingHome) return { kind: 'restore' };
  if (nextPath !== prevPath) return { kind: 'top' };
  if (id) return { kind: 'hash', id };
  return { kind: 'noop' };
}

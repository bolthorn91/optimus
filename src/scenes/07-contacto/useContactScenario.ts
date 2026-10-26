import { useSyncExternalStore } from 'react';
import { useSearchParams } from 'react-router';

import type { ContactContextRow } from '@/lib/contact-form';
import { formatCurrency } from '@/lib/format';
import type { ProjectionInput } from '@/lib/projection';
import { parseContactQuery, parseContactVehicle } from '@/scenes/05-activos-simulador/contactHref';
import { SCENARIO_LABELS, VEHICLE_LABELS } from '@/scenes/05-activos-simulador/content';
import {
  getSimulatorSessionSnapshot,
  subscribeSimulatorSession,
} from '@/scenes/05-activos-simulador/simulatorSession';
import { CONTACT_SCENE } from '@/scenes/07-contacto/content';

export function labelledSnapshot(input: ProjectionInput): ContactContextRow[] {
  return [
    { label: CONTACT_SCENE.copy.capital, value: formatCurrency(input.capital) },
    {
      label: CONTACT_SCENE.copy.horizon,
      value: `${String(input.years)} ${CONTACT_SCENE.copy.horizonUnit}`,
    },
    { label: CONTACT_SCENE.copy.scenario, value: SCENARIO_LABELS[input.scenario] },
    { label: CONTACT_SCENE.copy.vehicle, value: VEHICLE_LABELS[input.vehicle] },
  ];
}

export interface ContactScenario {
  snapshot: ProjectionInput | undefined;
  initialInterest: ProjectionInput['vehicle'] | undefined;
  context: readonly ContactContextRow[] | undefined;
}

/**
 * El escenario llega por la URL (CTA del simulador) o por la sesión en memoria (home).
 * La URL manda: permite compartir el enlace y sobrevivir a una recarga.
 */
export function useContactScenario(): ContactScenario {
  const [params] = useSearchParams();
  const session = useSyncExternalStore(
    subscribeSimulatorSession,
    getSimulatorSessionSnapshot,
    getSimulatorSessionSnapshot,
  );
  const fromQuery = parseContactQuery(params);
  const snapshot = fromQuery ?? session?.input;
  const initialInterest = parseContactVehicle(params) ?? snapshot?.vehicle;

  return {
    snapshot,
    initialInterest,
    context: snapshot === undefined ? undefined : labelledSnapshot(snapshot),
  };
}

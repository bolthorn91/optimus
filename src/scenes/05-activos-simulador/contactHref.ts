import type { ProjectionInput } from '@/lib/projection';
import type { VehicleId } from '@/lib/projection-assumptions';
import { ACT5 } from '@/scenes/05-activos-simulador/content';

function contactHash(): string {
  return ACT5.cta.href.startsWith('#') ? ACT5.cta.href : `#${ACT5.cta.href}`;
}

export function contactHref(
  vehicle?: VehicleId,
  context?: Pick<ProjectionInput, 'capital' | 'years' | 'scenario'>,
): string {
  const hash = contactHash();
  const params = new URLSearchParams();
  if (vehicle) params.set('vehiculo', vehicle);
  if (context) {
    params.set('capital', String(context.capital));
    params.set('horizonte', String(context.years));
    params.set('escenario', context.scenario);
  }
  const query = params.toString();
  return query.length > 0 ? `/?${query}${hash}` : `/${hash}`;
}

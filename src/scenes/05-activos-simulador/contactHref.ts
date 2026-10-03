import type { VehicleId } from '@/lib/projection-assumptions';
import { ACT5 } from '@/scenes/05-activos-simulador/content';

function contactHash(): string {
  return ACT5.cta.href.startsWith('#') ? ACT5.cta.href : `#${ACT5.cta.href}`;
}

export function contactHref(vehicle?: VehicleId): string {
  const hash = contactHash();
  if (!vehicle) return `/${hash}`;
  return `/?${new URLSearchParams({ vehiculo: vehicle }).toString()}${hash}`;
}

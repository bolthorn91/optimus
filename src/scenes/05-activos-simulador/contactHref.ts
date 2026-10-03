import type { ProjectionInput } from '@/lib/projection';
import {
  HORIZON_MAX,
  HORIZON_MIN,
  isScenario,
  isVehicle,
  type VehicleId,
} from '@/lib/projection-assumptions';
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

export function parseContactVehicle(search: URLSearchParams): VehicleId | undefined {
  const value = search.get('vehiculo');
  return value !== null && isVehicle(value) ? value : undefined;
}

/** Estricto: un query incompleto o fuera de rango no se corrige. */
export function parseContactQuery(search: URLSearchParams): ProjectionInput | undefined {
  const capitalRaw = search.get('capital');
  const yearsRaw = search.get('horizonte');
  const scenario = search.get('escenario');
  const vehicle = search.get('vehiculo');
  if (capitalRaw === null || yearsRaw === null || scenario === null || vehicle === null) {
    return undefined;
  }
  if (!isScenario(scenario) || !isVehicle(vehicle)) return undefined;
  const capital = Number(capitalRaw);
  const years = Number(yearsRaw);
  if (!Number.isFinite(capital) || capital <= 0) return undefined;
  if (!Number.isInteger(years) || years < HORIZON_MIN || years > HORIZON_MAX) return undefined;
  return { capital, years, scenario, vehicle };
}

export const VEHICLE_IDS = ['real-estate', 'equities', 'development'] as const;
export type VehicleId = (typeof VEHICLE_IDS)[number];

export const SCENARIOS = ['conservative', 'base', 'favourable'] as const;
export type Scenario = (typeof SCENARIOS)[number];

export function isScenario(value: string): value is Scenario {
  return SCENARIOS.some((scenario) => scenario === value);
}

export function isVehicle(value: string): value is VehicleId {
  return VEHICLE_IDS.some((id) => id === value);
}

export const HORIZON_MIN = 1;
export const HORIZON_MAX = 15;

/**
 * Tasas anuales de revalorización. Son supuestos del implementador, no cifras del dossier (S5).
 * Conservadoras a propósito: el simulador ilustra un escenario, no vende un rendimiento.
 */
export const ANNUAL_RATE: Record<VehicleId, Record<Scenario, number>> = {
  'real-estate': { conservative: 0.03, base: 0.045, favourable: 0.06 },
  equities: { conservative: 0.04, base: 0.06, favourable: 0.08 },
  development: { conservative: 0.05, base: 0.07, favourable: 0.1 },
};

/** Renta anual sobre el capital inicial. Solo el vehículo inmobiliario es distinto de 0. */
export const ANNUAL_RENTAL_YIELD: Record<VehicleId, number> = {
  'real-estate': 0.03,
  equities: 0,
  development: 0,
};

export const ASSUMPTIONS_RATIONALE =
  'Tasas anuales de revalorización usadas como supuesto ilustrativo, no como dato de OPTIMVS ni del dossier. La renta, cuando aplica, se calcula cada año sobre el capital inicial, no sobre el valor revalorizado.';

export const ASSUMPTIONS_DISCLAIMER =
  'Estos supuestos son ilustrativos y no constituyen una previsión de rentabilidad.';

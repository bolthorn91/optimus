import {
  ANNUAL_RATE,
  ANNUAL_RENTAL_YIELD,
  ASSUMPTIONS_RATIONALE,
  HORIZON_MAX,
  HORIZON_MIN,
  isScenario,
  isVehicle,
  type Scenario,
  type VehicleId,
} from '@/lib/projection-assumptions';

export type { Scenario, VehicleId };

export interface ProjectionInput {
  capital: number;
  years: number;
  scenario: Scenario;
  vehicle: VehicleId;
}

export interface ProjectionYear {
  year: number;
  value: number;
  gain: number;
  rentalIncome: number;
}

export interface AppliedAssumptions {
  rate: number;
  rentYield: number;
  scenario: Scenario;
  vehicle: VehicleId;
  rationale: string;
}

export interface ProjectionResult {
  series: ProjectionYear[];
  finalValue: number;
  totalGain: number;
  totalRentalIncome: number;
  assumptions: AppliedAssumptions;
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function coerceCapital(value: number | undefined, fallback: number): number {
  if (value === undefined || !Number.isFinite(value) || value <= 0) return fallback;
  return value;
}

function coerceYears(value: number | undefined, fallback: number): number {
  if (value === undefined || !Number.isFinite(value)) return fallback;
  return Math.min(HORIZON_MAX, Math.max(HORIZON_MIN, Math.round(value)));
}

/** Política de la UI: un campo inválido conserva `fallback` (default al arrancar, actual al set). */
export function coerceProjectionInput(
  candidate: Partial<ProjectionInput>,
  fallback: ProjectionInput,
): ProjectionInput {
  const scenario = candidate.scenario;
  const vehicle = candidate.vehicle;
  return {
    capital: coerceCapital(candidate.capital, fallback.capital),
    years: coerceYears(candidate.years, fallback.years),
    scenario: scenario !== undefined && isScenario(scenario) ? scenario : fallback.scenario,
    vehicle: vehicle !== undefined && isVehicle(vehicle) ? vehicle : fallback.vehicle,
  };
}

function assertInput(input: ProjectionInput): void {
  if (!Number.isFinite(input.capital) || input.capital <= 0) {
    throw new RangeError(
      `project espera capital finito y positivo, recibió ${String(input.capital)}`,
    );
  }
  if (!Number.isInteger(input.years) || input.years < HORIZON_MIN || input.years > HORIZON_MAX) {
    throw new RangeError(
      `project espera un horizonte entero entre ${String(HORIZON_MIN)} y ${String(HORIZON_MAX)}, recibió ${String(input.years)}`,
    );
  }
  if (!isScenario(input.scenario)) {
    throw new RangeError(`project espera un escenario conocido, recibió ${String(input.scenario)}`);
  }
  if (!isVehicle(input.vehicle)) {
    throw new RangeError(`project espera un vehículo conocido, recibió ${String(input.vehicle)}`);
  }
}

/** Único lugar de cálculo de la proyección. Determinista, sin aleatoriedad. */
export function project(input: ProjectionInput): ProjectionResult {
  assertInput(input);
  const rate = ANNUAL_RATE[input.vehicle][input.scenario];
  const rentYield = ANNUAL_RENTAL_YIELD[input.vehicle];
  const series: ProjectionYear[] = [];
  let value = input.capital;
  let rentAcum = 0;

  for (let year = 1; year <= input.years; year += 1) {
    value *= 1 + rate;
    rentAcum += input.capital * rentYield;
    const displayed = round2(value);
    series.push({
      year,
      value: displayed,
      gain: round2(displayed - input.capital),
      rentalIncome: round2(rentAcum),
    });
  }

  const last = series[series.length - 1];
  if (!last) {
    throw new RangeError('project produjo una serie vacía');
  }

  return {
    series,
    finalValue: last.value,
    totalGain: last.gain,
    totalRentalIncome: last.rentalIncome,
    assumptions: {
      rate,
      rentYield,
      scenario: input.scenario,
      vehicle: input.vehicle,
      rationale: ASSUMPTIONS_RATIONALE,
    },
  };
}

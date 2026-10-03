import { formatPercent } from '@/lib/format';
import type { AppliedAssumptions } from '@/lib/projection';
import { ASSUMPTIONS_DISCLAIMER } from '@/lib/projection-assumptions';
import { ACT5, SCENARIO_LABELS, VEHICLE_LABELS } from '@/scenes/05-activos-simulador/content';

export function AssumptionsPanel({ assumptions }: { assumptions: AppliedAssumptions }) {
  return (
    <section data-assumptions>
      <h4>{ACT5.copy.assumptionsTitle}</h4>
      <dl>
        <div>
          <dt>{ACT5.copy.rateLabel}</dt>
          <dd>{formatPercent(assumptions.rate * 100, 1)}</dd>
        </div>
        <div>
          <dt>{ACT5.copy.rentYieldLabel}</dt>
          <dd>{formatPercent(assumptions.rentYield * 100, 1)}</dd>
        </div>
        <div>
          <dt>{ACT5.copy.scenarioLabel}</dt>
          <dd>{SCENARIO_LABELS[assumptions.scenario]}</dd>
        </div>
      </dl>
      <p>{VEHICLE_LABELS[assumptions.vehicle]}</p>
      <p>{assumptions.rationale}</p>
      <p>{ASSUMPTIONS_DISCLAIMER}</p>
    </section>
  );
}

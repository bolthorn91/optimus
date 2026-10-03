import { SCENARIOS, type Scenario } from '@/lib/projection-assumptions';
import { ACT5, SCENARIO_LABELS } from '@/scenes/05-activos-simulador/content';

export function ScenarioToggle({
  value,
  onChange,
}: {
  value: Scenario;
  onChange: (scenario: Scenario) => void;
}) {
  return (
    <fieldset data-scenario-toggle>
      <legend>{ACT5.copy.scenarioLabel}</legend>
      {SCENARIOS.map((scenario) => (
        <label key={scenario}>
          <input
            checked={scenario === value}
            name="simulator-scenario"
            onChange={() => {
              onChange(scenario);
            }}
            type="radio"
            value={scenario}
          />
          {SCENARIO_LABELS[scenario]}
        </label>
      ))}
    </fieldset>
  );
}

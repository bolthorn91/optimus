import type { Ref } from 'react';

import { Disclaimer } from '@/components/Disclaimer';
import { StatFigure } from '@/components/StatFigure';
import { formatCurrency } from '@/lib/format';
import type { ProjectionInput, ProjectionResult } from '@/lib/projection';
import { HORIZON_MAX, HORIZON_MIN, type Scenario } from '@/lib/projection-assumptions';
import { AssumptionsPanel } from '@/scenes/05-activos-simulador/AssumptionsPanel';
import { CapitalSlider } from '@/scenes/05-activos-simulador/CapitalSlider';
import { ACT5 } from '@/scenes/05-activos-simulador/content';
import { HorizonSlider } from '@/scenes/05-activos-simulador/HorizonSlider';
import { ProjectionChart } from '@/scenes/05-activos-simulador/ProjectionChart';
import { ProjectionTable } from '@/scenes/05-activos-simulador/ProjectionTable';
import { ScenarioToggle } from '@/scenes/05-activos-simulador/ScenarioToggle';
import { CAPITAL_MAX, CAPITAL_MIN, CAPITAL_STEP } from '@/scenes/05-activos-simulador/sliderBounds';

export function Simulator({
  input,
  result,
  setCapital,
  setYears,
  setScenario,
  ref,
}: {
  input: ProjectionInput;
  result: ProjectionResult;
  setCapital: (capital: number) => void;
  setYears: (years: number) => void;
  setScenario: (scenario: Scenario) => void;
  ref?: Ref<HTMLElement | null>;
}) {
  const lastYear = result.series[result.series.length - 1]?.year;

  return (
    <section data-simulator id="simulador" ref={ref} tabIndex={-1}>
      <h3>{ACT5.copy.simulatorTitle}</h3>
      <CapitalSlider
        label={ACT5.copy.capitalLabel}
        max={CAPITAL_MAX}
        min={CAPITAL_MIN}
        onChange={setCapital}
        step={CAPITAL_STEP}
        value={input.capital}
      />
      <HorizonSlider
        label={ACT5.copy.horizonLabel}
        max={HORIZON_MAX}
        min={HORIZON_MIN}
        onChange={setYears}
        unit={ACT5.copy.horizonUnit}
        value={input.years}
      />
      <ScenarioToggle onChange={setScenario} value={input.scenario} />
      <div data-simulator-result>
        <StatFigure
          label={ACT5.copy.finalValue}
          value={formatCurrency(result.finalValue, 'USD', 2)}
        />
        <StatFigure
          label={ACT5.copy.totalGain}
          value={formatCurrency(result.totalGain, 'USD', 2)}
        />
        {input.vehicle === 'real-estate' ? (
          <StatFigure
            label={ACT5.copy.rentalIncome}
            value={formatCurrency(result.totalRentalIncome, 'USD', 2)}
          />
        ) : null}
        <Disclaimer variant="inline" />
      </div>
      <AssumptionsPanel assumptions={result.assumptions} />
      <ProjectionChart highlightYear={lastYear} series={result.series} />
      <ProjectionTable series={result.series} />
    </section>
  );
}

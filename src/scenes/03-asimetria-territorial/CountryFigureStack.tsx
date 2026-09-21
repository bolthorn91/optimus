import { CountUp } from '@/components/CountUp';
import { StatFigure } from '@/components/StatFigure';
import { formatArea, formatDensity, formatNumber } from '@/lib/format';
import { ACT3, type CountryFigures } from '@/scenes/03-asimetria-territorial/content';

export function CountryFigureStack({
  country,
  areaProgress,
  popProgress,
  densityProgress,
}: {
  country: CountryFigures;
  areaProgress: number;
  popProgress: number;
  densityProgress: number;
}) {
  return (
    <div data-country-figures={country.id}>
      <p className="act3-nightfall-country">{country.name}</p>
      <StatFigure
        label={ACT3.copy.areaLabel}
        value={
          <CountUp
            format={(value) => formatArea(value, 'km²')}
            progress={areaProgress}
            to={country.areaKm2}
          />
        }
      />
      <StatFigure
        label={ACT3.copy.populationLabel}
        value={<CountUp format={formatNumber} progress={popProgress} to={country.population} />}
      />
      <StatFigure
        label={ACT3.copy.densityLabel}
        value={
          <CountUp format={formatDensity} progress={densityProgress} to={country.densityPerKm2} />
        }
      />
    </div>
  );
}

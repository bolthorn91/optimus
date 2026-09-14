import { PairedComparison } from '@/components/PairedComparison';
import { formatArea, formatDensity, formatNumber } from '@/lib/format';
import { ACT3, type CountryFigures } from '@/scenes/03-asimetria-territorial/content';

export function TerritorialComparison({
  countries,
}: {
  countries: readonly [CountryFigures, CountryFigures];
}) {
  const [spain, argentina] = countries;
  return (
    <PairedComparison
      caption={ACT3.copy.territorialCaption}
      left={{ id: spain.id, name: spain.name, accentToken: 'var(--color-country-es)' }}
      metricHeader={ACT3.copy.metricHeader}
      right={{ id: argentina.id, name: argentina.name, accentToken: 'var(--color-country-ar)' }}
      rows={[
        {
          id: 'area',
          metric: ACT3.copy.areaLabel,
          left: formatArea(spain.areaKm2, 'km²'),
          right: formatArea(argentina.areaKm2, 'km²'),
        },
        {
          id: 'population',
          metric: ACT3.copy.populationLabel,
          left: formatNumber(spain.population),
          right: formatNumber(argentina.population),
        },
        {
          id: 'density',
          metric: ACT3.copy.densityLabel,
          left: <span className="act3-density">{formatDensity(spain.densityPerKm2)}</span>,
          right: <span className="act3-density">{formatDensity(argentina.densityPerKm2)}</span>,
        },
      ]}
    />
  );
}

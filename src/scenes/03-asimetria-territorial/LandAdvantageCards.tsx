import type { LandAdvantage } from '@/scenes/03-asimetria-territorial/content';

export function LandAdvantageCards({ advantages }: { advantages: readonly LandAdvantage[] }) {
  return (
    <ol className="act3-advantages">
      {advantages.map((item) => (
        <li data-land-advantage={item.index} key={item.index}>
          <p className="act3-advantages__index">{String(item.index).padStart(2, '0')}</p>
          <h4>{item.type}</h4>
          <p>{item.zones}</p>
          <p>{item.advantage}</p>
        </li>
      ))}
    </ol>
  );
}

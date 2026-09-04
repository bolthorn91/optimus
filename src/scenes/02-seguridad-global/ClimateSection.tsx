import type { CSSProperties } from 'react';

import type { ClimateContent } from '@/scenes/02-seguridad-global/content';

export function ClimateSection({
  content,
  progress,
}: {
  content: ClimateContent;
  progress: number;
}) {
  return (
    <section
      className="act2-climate"
      data-climate-section
      style={
        {
          '--climate-progress': progress,
          '--region-count': content.regions.length,
        } as CSSProperties
      }
    >
      <h3>{content.heading}</h3>
      <p>{content.intro}</p>
      <ul className="climate-regions">
        {content.regions.map((region, index) => (
          <li
            data-climate-region={region.name}
            data-primary={region.isPrimary ? 'true' : undefined}
            key={region.name}
            style={{ '--region-index': index } as CSSProperties}
          >
            {region.name}
            {region.isPrimary ? ` (${content.primaryMark})` : null}
          </li>
        ))}
      </ul>
      <p className="climate-counter">{content.counter}</p>
      <p>{content.southAmerica}</p>
      <p className="climate-sources">
        {content.sourceNote}: {content.sources.join(' · ')}
      </p>
    </section>
  );
}

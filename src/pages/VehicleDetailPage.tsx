import { vehicleRoute } from '@/app/routes';
import { VEHICLE_DETAILS, vehicleToc } from '@/content/vehicles';
import type { VehicleId } from '@/lib/projection-assumptions';
import { ActBlock } from '@/pages/ActBlock';
import { DetailLayout } from '@/pages/DetailLayout';

import './act-detail.css';

export function VehicleDetailPage({ vehicleId }: { vehicleId: VehicleId }) {
  const route = vehicleRoute(vehicleId);
  const detail = VEHICLE_DETAILS[vehicleId];

  return (
    <DetailLayout
      ctaTo={detail.ctaHref}
      sources={detail.sources}
      title={route.title}
      toc={vehicleToc(vehicleId)}
    >
      <div className="detail-prose">
        {detail.sections.map((section) => (
          <section id={section.id} key={section.id}>
            {section.heading ? <h2>{section.heading}</h2> : null}
            {(section.paragraphs ?? []).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {(section.blocks ?? []).map((block, index) => (
              <ActBlock block={block} key={`${section.id}-${block.kind}-${String(index)}`} />
            ))}
          </section>
        ))}
      </div>
    </DetailLayout>
  );
}

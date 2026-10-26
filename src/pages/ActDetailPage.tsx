import type { ActNumber } from '@/app/routes';
import { actRoute, adjacentActs } from '@/app/routes';
import { ACT_DETAILS, actToc } from '@/content/acts/catalog';
import { Act7DetailPage } from '@/pages/Act7DetailPage';
import { ActBlock } from '@/pages/ActBlock';
import { DetailLayout } from '@/pages/DetailLayout';

import './act-detail.css';

export function ActDetailPage({ actNumber }: { actNumber: ActNumber }) {
  if (actNumber === 7) return <Act7DetailPage />;

  const route = actRoute(actNumber);
  const detail = ACT_DETAILS[actNumber];
  const adjacent = adjacentActs(actNumber);

  return (
    <DetailLayout
      title={route.title}
      toc={actToc(actNumber)}
      sources={detail.sources}
      actNumber={actNumber}
      {...adjacent}
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

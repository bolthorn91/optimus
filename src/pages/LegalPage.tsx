import { legalRoute } from '@/app/routes';
import { PendingValue } from '@/components/PendingValue';
import { LEGAL_DOCUMENTS, pendingFieldsOf } from '@/content/legal/catalog';
import type { LegalId } from '@/content/legal/types';
import { ActBlock } from '@/pages/ActBlock';
import { DetailLayout } from '@/pages/DetailLayout';
import { PendingNotice } from '@/pages/PendingNotice';

import './act-detail.css';
import './legal.css';

export function LegalPage({ document: id }: { document: LegalId }) {
  const route = legalRoute(id);
  const document = LEGAL_DOCUMENTS[id];
  const toc = document.sections.map((section) => ({
    id: section.id,
    label: section.heading,
  }));

  return (
    <DetailLayout title={route.title} toc={toc}>
      <div className="detail-prose">
        <PendingNotice fields={pendingFieldsOf(document)} />
        {document.sections.map((section) => (
          <section id={section.id} key={section.id}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {(section.pending ?? []).map((field) => (
              <p key={field.label}>
                <PendingValue debtId={field.debtId} label={field.label} />
              </p>
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

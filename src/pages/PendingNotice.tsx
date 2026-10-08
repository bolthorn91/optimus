import type { PendingField } from '@/content/legal/types';
import { DETAIL_COPY } from '@/pages/detailCopy';

export function PendingNotice({ fields }: { fields: readonly PendingField[] }) {
  return (
    <aside className="legal-draft" data-draft-notice="" role="status">
      <p>{DETAIL_COPY.draftNotice}</p>
      {fields.length === 0 ? null : (
        <ul>
          {fields.map((field) => (
            <li key={field.label}>{field.label}</li>
          ))}
        </ul>
      )}
    </aside>
  );
}

import { DETAIL_COPY } from '@/pages/detailCopy';

export interface TocEntry {
  id: string;
  label: string;
}

export function TableOfContents({ entries }: { entries: readonly TocEntry[] }) {
  if (entries.length === 0) return null;
  return (
    <nav aria-label={DETAIL_COPY.toc} className="detail-toc">
      <h2>{DETAIL_COPY.toc}</h2>
      <ol>
        {entries.map((entry) => (
          <li key={entry.id}>
            <a href={`#${entry.id}`}>{entry.label}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

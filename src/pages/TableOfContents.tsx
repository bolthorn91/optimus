import { MOBILE_COPY } from '@/app/mobileCopy';
import { useViewport } from '@/motion/useViewport';
import { DETAIL_COPY } from '@/pages/detailCopy';

export interface TocEntry {
  id: string;
  label: string;
}

export function TableOfContents({ entries }: { entries: readonly TocEntry[] }) {
  const { isMobile } = useViewport();
  if (entries.length === 0) return null;
  const list = (
    <ol>
      {entries.map((entry) => (
        <li key={entry.id}>
          <a href={`#${entry.id}`}>{entry.label}</a>
        </li>
      ))}
    </ol>
  );
  if (isMobile) {
    return (
      <details className="detail-toc" data-toc-collapse>
        <summary>{MOBILE_COPY.tocToggle}</summary>
        <nav aria-label={DETAIL_COPY.toc}>{list}</nav>
      </details>
    );
  }
  return (
    <nav aria-label={DETAIL_COPY.toc} className="detail-toc">
      <h2>{DETAIL_COPY.toc}</h2>
      {list}
    </nav>
  );
}

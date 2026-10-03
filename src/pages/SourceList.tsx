import { DETAIL_COPY } from '@/pages/detailCopy';

export function SourceList({ sources }: { sources: readonly string[] }) {
  if (sources.length === 0) return null;
  return (
    <section aria-labelledby="detail-sources-heading" className="detail-sources">
      <h2 id="detail-sources-heading">{DETAIL_COPY.sources}</h2>
      <ul>
        {sources.map((source) => (
          <li key={source}>{source}</li>
        ))}
      </ul>
    </section>
  );
}

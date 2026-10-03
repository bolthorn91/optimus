import { ACT67, type GlossaryEntry } from '@/scenes/06-firma/content';

function glossId(id: string): string {
  return `gloss-${id}`;
}

export function Glossary({ entries }: { entries: readonly GlossaryEntry[] }) {
  return (
    <section data-glossary>
      <h3>{ACT67.copy.glossaryHeading}</h3>
      <nav aria-label={ACT67.copy.glossaryHeading}>
        <ul className="glossary-index">
          {entries.map((entry) => (
            <li key={entry.id}>
              <a href={`#${glossId(entry.id)}`}>{entry.term}</a>
            </li>
          ))}
        </ul>
      </nav>
      <dl>
        {entries.map((entry) => (
          <div id={glossId(entry.id)} key={entry.id}>
            <dt>{entry.term}</dt>
            <dd>{entry.definition}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

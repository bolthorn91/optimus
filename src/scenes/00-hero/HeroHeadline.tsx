import { memo, type ReactNode } from 'react';

export interface HeroHeadlineProps {
  text: string;
  emphasis: readonly string[];
}

function emphasizedNodes(text: string, emphasis: readonly string[]): ReactNode[] {
  const nodes: ReactNode[] = [];
  let cursor = 0;
  let key = 0;
  for (const phrase of emphasis) {
    const at = text.indexOf(phrase, cursor);
    if (at === -1) continue;
    if (at > cursor) {
      nodes.push(text.slice(cursor, at));
    }
    nodes.push(<strong key={key}>{phrase}</strong>);
    key += 1;
    cursor = at + phrase.length;
  }
  if (cursor < text.length) {
    nodes.push(text.slice(cursor));
  }
  return nodes;
}

/** Memo: SplitText wraps this h1; a parent re-render would wipe the line fragments. */
export const HeroHeadline = memo(function HeroHeadline({ text, emphasis }: HeroHeadlineProps) {
  return <h1 aria-label={text}>{emphasizedNodes(text, emphasis)}</h1>;
});

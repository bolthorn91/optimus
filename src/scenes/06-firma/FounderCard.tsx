import type { CSSProperties } from 'react';

import { PullQuote } from '@/components/PullQuote';
import { ACT67, type Founder } from '@/scenes/06-firma/content';

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter((part) => part.length > 0)
    .map((part) => part[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function FounderCard({ founder, progress }: { founder: Founder; progress: number }) {
  const initials = initialsOf(founder.name);

  return (
    <article
      data-founder-card
      style={{ ['--founder-progress']: String(progress) } as CSSProperties}
    >
      <div className="founder-portrait">
        <div aria-label={ACT67.copy.portraitPending} data-portrait-pending role="img">
          <span aria-hidden="true">{initials}</span>
        </div>
        <p className="founder-portrait__caption">{ACT67.copy.portraitPending}</p>
      </div>
      <div className="founder-copy">
        <h3>{founder.name}</h3>
        <p className="founder-copy__role">{founder.role}</p>
        {founder.bio.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <PullQuote cite={founder.name}>«{founder.quote}»</PullQuote>
      </div>
    </article>
  );
}

import type { CSSProperties } from 'react';

import './guarantee-cards.css';

export type GuaranteeIconId = 'title' | 'apostille' | 'channel' | 'compliance';

export interface GuaranteeCardItem {
  id: string;
  pillar: string;
  mechanism: string;
  icon: GuaranteeIconId;
}

const ICON_PATH: Record<GuaranteeIconId, string> = {
  title: 'M7 3.5h10v17H7zM9 8h6M9 12h6M9 16h4',
  apostille: 'M12 4.5a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15zM12 8v4l2.5 1.5',
  channel: 'M5 12h14M16 8l4 4-4 4M5 8v8',
  compliance: 'M6 6h12M6 12h12M6 18h8M5 6l1.5 1.5L9 5M5 12l1.5 1.5L9 11',
};

export function GuaranteeCards({
  guarantees,
  progress,
}: {
  guarantees: readonly GuaranteeCardItem[];
  progress?: readonly number[];
}) {
  return (
    <ul className="guarantee-cards">
      {guarantees.map((item, index) => {
        const amount = progress?.[index] ?? 1;
        return (
          <li
            data-guarantee={item.id}
            key={item.id}
            style={{ ['--card-progress']: String(amount) } as CSSProperties}
          >
            <svg
              aria-hidden="true"
              className="guarantee-cards__icon"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d={ICON_PATH[item.icon]}
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
            <h4>{item.pillar}</h4>
            <p>{item.mechanism}</p>
          </li>
        );
      })}
    </ul>
  );
}

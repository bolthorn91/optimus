import type { CSSProperties } from 'react';

const CELLS = 8;
const FADE = 0.4;

export function DematerialisingNote({ progress }: { progress: number }) {
  return (
    <svg
      aria-hidden="true"
      className="note-grid"
      data-dematerialising-note
      style={{ '--illustration-progress': progress } as CSSProperties}
      viewBox="0 0 80 48"
    >
      <rect
        className="note-grid__bill"
        fill="currentColor"
        height="40"
        rx="2"
        width="72"
        x="4"
        y="4"
      />
      {Array.from({ length: CELLS * 4 }, (_, i) => {
        const col = i % CELLS;
        const row = Math.floor(i / CELLS);
        const delay = ((col + row) / (CELLS + 3)) * (1 - FADE);
        return (
          <g
            key={i}
            style={{ '--cell-delay': delay } as CSSProperties}
            transform={`translate(${String(4 + col * 9)} ${String(4 + row * 10)})`}
          >
            <rect fill="currentColor" height="8" width="8" />
            <text fill="var(--color-navy-deep)" fontSize="3" x="1" y="6">
              {String(i + 1).padStart(2, '0')}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

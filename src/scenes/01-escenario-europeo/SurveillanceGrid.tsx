import type { CSSProperties, ReactNode } from 'react';

export function SurveillanceGrid({
  progress,
  children,
}: {
  progress: number;
  children: ReactNode;
}) {
  return (
    <div
      className="surveillance"
      data-surveillance-grid
      style={{ '--illustration-progress': progress } as CSSProperties}
    >
      <svg
        aria-hidden="true"
        className="surveillance__grid"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        {Array.from({ length: 8 }, (_, i) => (
          <line
            key={`h-${String(i)}`}
            stroke="currentColor"
            strokeWidth="0.4"
            x1="0"
            x2="100"
            y1={((i + 1) / 9) * 100}
            y2={((i + 1) / 9) * 100}
          />
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <line
            key={`v-${String(i)}`}
            stroke="currentColor"
            strokeWidth="0.4"
            x1={((i + 1) / 9) * 100}
            x2={((i + 1) / 9) * 100}
            y1="0"
            y2="100"
          />
        ))}
        <line
          className="surveillance__scan"
          stroke="currentColor"
          strokeWidth="0.6"
          x1="0"
          x2="0"
          y1="0"
          y2="100"
        />
      </svg>
      <div className="surveillance__copy">{children}</div>
    </div>
  );
}

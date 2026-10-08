import { RomanNumeral } from '@/components/RomanNumeral';

import './progress-bar.css';

export interface ProgressBarProps {
  progress: number;
  currentAct: number;
}

export function ProgressBar({ progress, currentAct }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, progress * 100));
  return (
    <div
      aria-label="Progreso de lectura"
      className="progress-bar"
      data-progress-bar
      role="progressbar"
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={Math.round(pct)}
    >
      <span className="progress-bar__track">
        <span className="progress-bar__fill" style={{ inlineSize: `${String(pct)}%` }} />
      </span>
      <span className="progress-bar__act">
        <RomanNumeral value={currentAct} />
      </span>
    </div>
  );
}

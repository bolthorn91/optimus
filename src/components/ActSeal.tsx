import { RomanNumeral } from '@/components/RomanNumeral';

import './act-seal.css';

export interface ActSealProps {
  act: number;
}

/** Sello de laurel entre actos (D3). El trazado DrawSVG lo aplica `ActThreshold`. */
export function ActSeal({ act }: ActSealProps) {
  return (
    <div aria-hidden="true" className="act-seal" data-act-seal>
      <svg viewBox="0 0 80 80">
        <path d="M40 72 C 14 52 14 22 40 10" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M40 72 C 66 52 66 22 40 10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <RomanNumeral decorative value={act} />
    </div>
  );
}

import { RomanNumeral } from '@/components/RomanNumeral';

export interface MilestoneMarkView {
  id: string;
  href: string;
  label: string;
  act: number;
  reached: boolean;
}

export interface MilestoneProps {
  marks: readonly MilestoneMarkView[];
}

/** Miliario: una marca por acto en numeral romano (D2). */
export function Milestone({ marks }: MilestoneProps) {
  return (
    <ol aria-label="Progreso de lectura" data-milestone>
      {marks.map((mark) => (
        <li key={mark.id} data-reached={mark.reached ? 'true' : 'false'}>
          <a href={mark.href}>
            <RomanNumeral value={mark.act} />
            <span className="visually-hidden">{mark.label}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}

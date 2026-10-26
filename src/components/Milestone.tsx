import { useEffect, useState } from 'react';

import { RomanNumeral } from '@/components/RomanNumeral';

export interface MilestoneMarkView {
  id: string;
  href: string;
  label: string;
  chapterTitle: string;
  act: number;
  reached: boolean;
}

export interface MilestoneProps {
  marks: readonly MilestoneMarkView[];
  onNavigate?: (() => void) | undefined;
  /**
   * En la home el miliario es una brújula fija que estorba si siempre está abierta.
   * En el menú móvil se sirve como lista normal, sin botón ni estado propio.
   */
  collapsible?: boolean;
}

/** Miliario: una marca por acto en numeral romano (D2). */
export function Milestone({ marks, onNavigate, collapsible = false }: MilestoneProps) {
  const [open, setOpen] = useState(false);
  const current = [...marks].reverse().find((mark) => mark.reached) ?? marks[0] ?? null;
  const panelId = 'milestone-panel';

  useEffect(() => {
    if (!open) return undefined;
    function onKey(event: KeyboardEvent): void {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!collapsible) {
    return (
      <ol aria-label="Progreso de lectura" data-milestone>
        {marks.map((mark) => (
          <MilestoneItem
            current={mark.id === current?.id}
            key={mark.id}
            mark={mark}
            onNavigate={onNavigate}
          />
        ))}
      </ol>
    );
  }

  return (
    <div className="milestone-rail" data-milestone data-open={open ? 'true' : 'false'}>
      <button
        aria-controls={panelId}
        aria-expanded={open}
        aria-label={open ? 'Cerrar capítulos' : 'Abrir capítulos'}
        className="milestone-rail__toggle"
        onClick={() => {
          setOpen((value) => !value);
        }}
        type="button"
      >
        <span aria-hidden="true" className="milestone-rail__kicker">
          Capítulos
        </span>
        <RomanNumeral value={current?.act ?? 1} />
      </button>
      {open ? (
        <nav aria-label="Capítulos" className="milestone-rail__panel" id={panelId}>
          <p className="milestone-rail__eyebrow">Recorrido del dossier</p>
          <ol>
            {marks.map((mark) => (
              <MilestoneItem
                current={mark.id === current?.id}
                key={mark.id}
                mark={mark}
                onNavigate={() => {
                  setOpen(false);
                  onNavigate?.();
                }}
              />
            ))}
          </ol>
        </nav>
      ) : null}
    </div>
  );
}

function MilestoneItem({
  mark,
  current,
  onNavigate,
}: {
  mark: MilestoneMarkView;
  current: boolean;
  onNavigate?: (() => void) | undefined;
}) {
  return (
    <li data-reached={mark.reached ? 'true' : 'false'}>
      <a aria-current={current ? 'location' : undefined} href={mark.href} onClick={onNavigate}>
        <RomanNumeral value={mark.act} />
        <span className="milestone-rail__label">{mark.chapterTitle}</span>
      </a>
    </li>
  );
}

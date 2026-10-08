import { useEffect, useId, useLayoutEffect, useRef } from 'react';

import { MOBILE_COPY } from '@/app/mobileCopy';
import { milestoneMarks, navEntries, type Section } from '@/app/sections';
import { Milestone } from '@/components/Milestone';

import './mobile-nav.css';

export interface MobileNavProps {
  sections: readonly Section[];
  open: boolean;
  onClose: () => void;
  current: Section | null;
}

export function MobileNav({ sections, open, onClose, current }: MobileNavProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const onCloseRef = useRef(onClose);
  const marksFrom = current ?? sections[0];
  onCloseRef.current = onClose;

  useLayoutEffect(() => {
    if (!open) return;
    const node = dialogRef.current;
    if (node === null) return;
    try {
      if (!node.open) node.showModal();
    } catch {
      node.setAttribute('open', '');
    }
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    function onKey(event: KeyboardEvent): void {
      const root = dialogRef.current;
      if (root === null) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = [...root.querySelectorAll<HTMLElement>('a[href], button')];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (first === undefined || last === undefined) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!open) return null;

  return (
    <dialog ref={dialogRef} aria-labelledby={titleId} className="mobile-nav">
      <h2 className="visually-hidden" id={titleId}>
        {MOBILE_COPY.menu}
      </h2>
      {marksFrom ? (
        <Milestone marks={milestoneMarks(marksFrom, sections)} onNavigate={onClose} />
      ) : null}
      <nav aria-label="Principal">
        <ul>
          {navEntries(sections).map((entry) => (
            <li key={entry.label}>
              <a href={entry.href} onClick={onClose}>
                {entry.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <button type="button" onClick={onClose}>
        {MOBILE_COPY.closeMenu}
      </button>
    </dialog>
  );
}

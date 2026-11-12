import { useEffect, useId, useLayoutEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router';

import { MOBILE_COPY } from '@/app/mobileCopy';
import type { NavItem } from '@/app/navigation';

import './mobile-nav.css';

export interface MobileNavProps {
  items: readonly NavItem[];
  open: boolean;
  onClose: () => void;
  ctaTo?: string;
}

export function MobileNav({ items, open, onClose, ctaTo = '/contacto' }: MobileNavProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const onCloseRef = useRef(onClose);
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
      <div className="mobile-nav__head">
        <p className="mobile-nav__brand">
          OPTIMVS <span>Capital Protegido</span>
        </p>
        <button className="mobile-nav__close" type="button" onClick={onClose}>
          {MOBILE_COPY.closeMenu}
        </button>
      </div>
      <h2 className="visually-hidden" id={titleId}>
        {MOBILE_COPY.menu}
      </h2>
      <nav aria-label="Principal">
        <ul>
          {items.map((entry) => (
            <li key={entry.label}>
              <NavLink
                className={({ isActive }) => (isActive ? 'is-active' : undefined)}
                onClick={onClose}
                to={entry.href}
              >
                {entry.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <Link className="cta mobile-nav__cta" onClick={onClose} to={ctaTo}>
        Reservar sesión privada
      </Link>
    </dialog>
  );
}

import { useEffect, useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router';

import { RouteErrorBoundary } from '@/app/RouteErrorBoundary';
import {
  applyDocumentPair,
  clearDocumentPair,
  DOCUMENT_PAIR_OFF_HOME,
  milestoneMarks,
  navEntries,
  sectionAt,
} from '@/app/sections';
import { Disclaimer } from '@/components/Disclaimer';
import { Milestone } from '@/components/Milestone';
import { PendingValue } from '@/components/PendingValue';
import { useScrollProgress } from '@/motion/useScrollProgress';

import './shell.css';

export function Layout() {
  const location = useLocation();
  const progress = useScrollProgress();
  const isHome = location.pathname === '/';
  const current = isHome ? sectionAt(progress) : null;
  const pastHero = current?.id !== 'hero';
  const pair = current?.background ?? DOCUMENT_PAIR_OFF_HOME;
  const currentGroup = current?.navGroup ?? null;

  useEffect(() => {
    if (location.hash.length > 1) {
      const id = location.hash.slice(1);
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView();
        return;
      }
      if (import.meta.env.DEV) {
        console.warn(`Ancla inexistente: #${id}`);
      }
      return;
    }
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  useLayoutEffect(() => {
    applyDocumentPair(pair);
    return clearDocumentPair;
  }, [pair]);

  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <header className="site-header" data-past-hero={pastHero ? 'true' : 'false'}>
        <nav aria-label="Principal">
          <ul>
            {navEntries().map((entry) => (
              <li key={entry.label}>
                <a
                  aria-current={entry.label === currentGroup ? 'true' : undefined}
                  href={entry.href}
                >
                  {entry.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a className="cta" href="/#contacto">
          Reservar sesión privada
        </a>
      </header>
      {current ? <Milestone marks={milestoneMarks(current)} /> : null}
      <main id="contenido">
        <RouteErrorBoundary resetKey={location.pathname}>
          <Outlet />
        </RouteErrorBoundary>
      </main>
      <footer>
        <nav aria-label="Pie de relato">
          {navEntries().map((entry) => (
            <a href={entry.href} key={entry.label}>
              {entry.label}
            </a>
          ))}
        </nav>
        <nav aria-label="Legal">
          <a href="/detalle">Aviso legal</a>
          <a href="/detalle">Privacidad</a>
          <a href="/detalle">Cookies</a>
        </nav>
        <p>
          <PendingValue debtId="B-01" label="Teléfono España" />
        </p>
        <p>
          <PendingValue debtId="B-01" label="Teléfono Argentina" />
        </p>
        <p>
          <PendingValue debtId="B-02" label="Correo" />
        </p>
        <p>
          <PendingValue debtId="B-07" label="Redes" />
        </p>
        <p>Todos los derechos reservados.</p>
        <p>Fuentes</p>
        <Disclaimer variant="footer" />
      </footer>
    </>
  );
}

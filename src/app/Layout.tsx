import { useLayoutEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router';

import { DocumentHead } from '@/app/DocumentHead';
import { RouteErrorBoundary } from '@/app/RouteErrorBoundary';
import {
  applyDocumentPair,
  clearDocumentPair,
  DOCUMENT_PAIR_OFF_HOME,
  milestoneMarks,
  navEntries,
  sectionAt,
} from '@/app/sections';
import { useScrollRestore } from '@/app/useScrollRestore';
import { ContactDetails } from '@/components/ContactDetails';
import { Disclaimer } from '@/components/Disclaimer';
import { Milestone } from '@/components/Milestone';
import { PendingValue } from '@/components/PendingValue';
import { CONTACT } from '@/content/contact';
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

  useScrollRestore(location.pathname, location.hash);

  useLayoutEffect(() => {
    applyDocumentPair(pair);
    return clearDocumentPair;
  }, [pair]);

  useLayoutEffect(() => {
    if (isHome) document.body.removeAttribute('data-print');
    else document.body.setAttribute('data-print', 'document');
    return () => {
      document.body.removeAttribute('data-print');
    };
  }, [isHome]);

  return (
    <>
      <DocumentHead />
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
          <Link to="/aviso-legal">Aviso legal</Link>
          <Link to="/politica-de-privacidad">Privacidad</Link>
          <Link to="/politica-de-cookies">Cookies</Link>
        </nav>
        <ContactDetails />
        <p>
          <PendingValue debtId={CONTACT.socials.debtId} label={CONTACT.socials.label} />
        </p>
        <p>
          <PendingValue debtId={CONTACT.registry.debtId} label={CONTACT.registry.label} />
        </p>
        <p>Todos los derechos reservados.</p>
        <section aria-labelledby="fuentes-heading" id="fuentes">
          <h2 id="fuentes-heading">Fuentes</h2>
          <ul data-sources>
            {CONTACT.sources.map((source) => (
              <li key={source}>{source}</li>
            ))}
          </ul>
        </section>
        <Disclaimer variant="footer" />
      </footer>
    </>
  );
}

import { useCallback, useEffect, useLayoutEffect, useState, useSyncExternalStore } from 'react';
import { Link, Outlet, useLocation } from 'react-router';

import { DocumentHead } from '@/app/DocumentHead';
import { MOBILE_COPY } from '@/app/mobileCopy';
import { MobileNav } from '@/app/MobileNav';
import { ProgressBar } from '@/app/ProgressBar';
import { RouteErrorBoundary } from '@/app/RouteErrorBoundary';
import { isLegalRoute, ROUTES } from '@/app/routes';
import {
  applyDocumentPair,
  clearDocumentPair,
  DOCUMENT_PAIR_OFF_HOME,
  milestoneMarks,
  NAVY_DEEP_PAIR,
  navEntries,
  SECTIONS,
  sectionAt,
} from '@/app/sections';
import { StickyCta } from '@/app/StickyCta';
import { useScrollRestore } from '@/app/useScrollRestore';
import { useSiteAnalytics } from '@/app/useSiteAnalytics';
import { ContactDetails } from '@/components/ContactDetails';
import { Disclaimer } from '@/components/Disclaimer';
import { Milestone } from '@/components/Milestone';
import { PendingValue } from '@/components/PendingValue';
import { CONTACT } from '@/content/contact';
import { useScrollProgress } from '@/motion/useScrollProgress';
import { useViewport } from '@/motion/useViewport';
import { contactHref } from '@/scenes/05-activos-simulador/contactHref';
import {
  getSimulatorSessionSnapshot,
  subscribeSimulatorSession,
} from '@/scenes/05-activos-simulador/simulatorSession';

import './shell.css';

export function Layout() {
  const location = useLocation();
  const progress = useScrollProgress();
  const { isMobile } = useViewport();
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = location.pathname === '/';
  const isContact = location.pathname === '/contacto';
  const current = isHome ? sectionAt(progress) : null;
  const pastHero = current?.id !== 'hero';
  const pair = current?.background ?? (isContact ? NAVY_DEEP_PAIR : DOCUMENT_PAIR_OFF_HOME);
  const currentGroup = current?.navGroup ?? null;
  const currentAct = current?.act ?? null;
  const simulatorSession = useSyncExternalStore(
    subscribeSimulatorSession,
    getSimulatorSessionSnapshot,
    getSimulatorSessionSnapshot,
  );
  const contactTo = contactHref(simulatorSession?.input.vehicle, simulatorSession?.input);

  useScrollRestore(location.pathname, location.hash);
  useSiteAnalytics(current, progress);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

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
        {isMobile ? (
          <>
            <button
              aria-expanded={menuOpen}
              className="menu-toggle"
              type="button"
              onClick={() => {
                setMenuOpen(true);
              }}
            >
              {MOBILE_COPY.openMenu}
            </button>
            {currentAct === null ? null : (
              <ProgressBar currentAct={currentAct} progress={progress} />
            )}
          </>
        ) : (
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
        )}
        {isMobile || isContact ? null : (
          <Link className="cta" data-track="cta" data-track-position="header" to={contactTo}>
            Reservar sesión privada
          </Link>
        )}
      </header>
      {isMobile ? null : current ? <Milestone collapsible marks={milestoneMarks(current)} /> : null}
      {isMobile && !isContact && (!isHome || pastHero) ? <StickyCta to={contactTo} /> : null}
      <main id="contenido">
        <RouteErrorBoundary resetKey={location.pathname}>
          <Outlet />
        </RouteErrorBoundary>
      </main>
      <footer>
        <div className="footer__top">
          <div className="footer__brand">
            <p className="footer__wordmark">
              OPTIMVS <span>Capital Protegido</span>
            </p>
            <ContactDetails />
          </div>
          <nav aria-label="Recorrido" className="footer__col">
            <h2>Recorrido</h2>
            <ul>
              {navEntries().map((entry) => (
                <li key={entry.label}>
                  <a href={entry.href}>{entry.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Legal" className="footer__col">
            <h2>Legal</h2>
            <ul>
              {ROUTES.filter(isLegalRoute).map((route) => (
                <li key={route.path}>
                  <Link to={route.path}>{route.title}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="footer__col footer__meta">
            <h2>Firma</h2>
            <p>
              <PendingValue debtId={CONTACT.socials.debtId} label={CONTACT.socials.label} />
            </p>
            <p>
              <PendingValue debtId={CONTACT.registry.debtId} label={CONTACT.registry.label} />
            </p>
          </div>
        </div>
        <section aria-labelledby="fuentes-heading" className="footer__sources" id="fuentes">
          <h2 id="fuentes-heading">
            Fuentes <span>{String(CONTACT.sources.length).padStart(2, '0')}</span>
          </h2>
          <ul data-sources>
            {CONTACT.sources.map((source) => (
              <li key={source}>{source}</li>
            ))}
          </ul>
        </section>
        <div className="footer__bottom">
          <p>Todos los derechos reservados.</p>
          <Disclaimer variant="footer" />
        </div>
      </footer>
      <MobileNav current={current} open={menuOpen} sections={SECTIONS} onClose={closeMenu} />
    </>
  );
}

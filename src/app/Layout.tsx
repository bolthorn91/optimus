import { useCallback, useEffect, useLayoutEffect, useState, useSyncExternalStore } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';

import { DocumentHead } from '@/app/DocumentHead';
import { MOBILE_COPY } from '@/app/mobileCopy';
import { MobileNav } from '@/app/MobileNav';
import { FOOTER_NAV, PRIMARY_NAV } from '@/app/navigation';
import { RouteErrorBoundary } from '@/app/RouteErrorBoundary';
import { isLegalRoute, ROUTES } from '@/app/routes';
import {
  applyDocumentPair,
  clearDocumentPair,
  DOCUMENT_PAIR_OFF_HOME,
  NAVY_DEEP_PAIR,
} from '@/app/sections';
import { StickyCta } from '@/app/StickyCta';
import { useScrollRestore } from '@/app/useScrollRestore';
import { useSiteAnalytics } from '@/app/useSiteAnalytics';
import { ContactDetails } from '@/components/ContactDetails';
import { Disclaimer } from '@/components/Disclaimer';
import { PendingValue } from '@/components/PendingValue';
import { CONTACT } from '@/content/contact';
import { useViewport } from '@/motion/useViewport';
import { contactHref } from '@/scenes/05-activos-simulador/contactHref';
import {
  getSimulatorSessionSnapshot,
  subscribeSimulatorSession,
} from '@/scenes/05-activos-simulador/simulatorSession';

import './shell.css';

export function Layout() {
  const location = useLocation();
  const { isMobile } = useViewport();
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = location.pathname === '/';
  const isContact = location.pathname === '/contacto';
  const pair = isHome || isContact ? NAVY_DEEP_PAIR : DOCUMENT_PAIR_OFF_HOME;
  const simulatorSession = useSyncExternalStore(
    subscribeSimulatorSession,
    getSimulatorSessionSnapshot,
    getSimulatorSessionSnapshot,
  );
  const contactTo = contactHref(simulatorSession?.input.vehicle, simulatorSession?.input);

  useScrollRestore(location.pathname, location.hash);
  useSiteAnalytics(null, 0);

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
      <header className="site-header" data-past-hero="true">
        <Link className="site-header__brand" to="/">
          OPTIMVS <span>Capital Protegido</span>
        </Link>
        {isMobile ? (
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
        ) : (
          <nav aria-label="Principal">
            <ul>
              {PRIMARY_NAV.map((entry) => (
                <li key={entry.label}>
                  <NavLink
                    className={({ isActive }) => (isActive ? 'is-active' : undefined)}
                    to={entry.href}
                  >
                    {entry.label}
                  </NavLink>
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
      {isMobile && !isContact ? <StickyCta to={contactTo} /> : null}
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
          <nav aria-label="Navegación" className="footer__col">
            <h2>Navegación</h2>
            <ul>
              {FOOTER_NAV.map((entry) => (
                <li key={entry.label}>
                  <Link to={entry.href}>{entry.label}</Link>
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
      <MobileNav ctaTo={contactTo} items={PRIMARY_NAV} onClose={closeMenu} open={menuOpen} />
    </>
  );
}

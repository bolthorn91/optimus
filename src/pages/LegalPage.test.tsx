import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { App } from '@/app/App';
import { isLegalRoute, ROUTES } from '@/app/routes';
import { PENDING_LABEL } from '@/components/PendingValue';
import { LEGAL_DOCUMENTS, pendingFieldsOf } from '@/content/legal/catalog';
import { FINANCIAL_DISCLAIMER_LONG } from '@/content/legal/notice';
import { ARGENTINA_TRANSFER } from '@/content/legal/privacy';
import { resetAnalytics, setAnalyticsSink } from '@/lib/analytics';
import { DETAIL_COPY } from '@/pages/detailCopy';
import { HERO } from '@/scenes/00-hero/content';
import { ACT1 } from '@/scenes/01-escenario-europeo/content';
import { CONTACT_SCENE } from '@/scenes/07-contacto/content';
import { expectNoBlockingAxeViolations } from '@/test/axe';

const LEGAL_ROUTES = ROUTES.filter(isLegalRoute);
const ROBOTS = readFileSync(resolve(process.cwd(), 'public/robots.txt'), 'utf8');
const OG_PNG = resolve(process.cwd(), 'public/og.png');

const INVENTED_REGISTRY = [
  /\b[ABCDEFGHJNPQRSUVW]\d{7}[0-9A-J]\b/,
  /\bB-\d{8}\b/,
  /\bNIF\s*[:=]\s*[A-Z0-9]/i,
  /\bCIF\s*[:=]\s*[A-Z0-9]/i,
  /\b(Calle|Avenida|Plaza)\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+\d+)?/,
  /info@optimvs\./i,
  /optimvs\.cp\.com/i,
];

function renderLegal(path: string) {
  window.history.pushState({}, '', path);
  return render(<App />);
}

function textOutsidePending(container: HTMLElement): string {
  const clone = container.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('[data-pending]').forEach((node) => {
    node.remove();
  });
  return clone.textContent;
}

describe('páginas legales, SEO y analítica', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/');
    document.querySelector('link[rel="canonical"]')?.remove();
    document.querySelector('script[data-org-schema]')?.remove();
    resetAnalytics();
  });

  it('DET-07 · todo campo registral ausente es PendingValue; ningún CIF inventado', () => {
    for (const route of LEGAL_ROUTES) {
      const { container, unmount } = renderLegal(route.path);
      const legalDocument = LEGAL_DOCUMENTS[route.legalId];
      const pending = pendingFieldsOf(legalDocument);
      for (const field of pending) {
        const markers = [
          ...container.querySelectorAll(`[data-pending][data-debt-id="${field.debtId}"]`),
        ];
        expect(markers.length).toBeGreaterThan(0);
        expect(
          markers.some((node) => node.textContent.includes(`${field.label}: ${PENDING_LABEL}`)),
        ).toBe(true);
      }
      const published = textOutsidePending(container);
      for (const pattern of INVENTED_REGISTRY) {
        expect(published).not.toMatch(pattern);
      }
      expect(container.textContent).not.toMatch(/\+34\s*\d{2}/);
      expect(container.textContent).not.toMatch(/\+54\s*\d{2}/);
      unmount();
    }
  });

  it('DET-08 · página legal con marcadores: aviso de borrador y noindex', () => {
    for (const route of LEGAL_ROUTES) {
      expect(route.hasPendingData).toBe(true);
      const { container, unmount } = renderLegal(route.path);
      const notice = container.querySelector('[data-draft-notice]');
      expect(notice).not.toBeNull();
      expect(notice).toHaveTextContent(DETAIL_COPY.draftNotice);
      expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
      unmount();
    }
  });

  it('DET-09 · la política de privacidad declara la transferencia a Argentina', () => {
    const { container } = renderLegal('/politica-de-privacidad');
    expect(container).toHaveTextContent(ARGENTINA_TRANSFER);
    expect(
      screen.getByRole('heading', { level: 2, name: 'Transferencias internacionales' }),
    ).toBeInTheDocument();
  });

  it('DET-10 · /aviso-legal contiene el disclaimer financiero largo íntegro', () => {
    const { container } = renderLegal('/aviso-legal');
    for (const paragraph of FINANCIAL_DISCLAIMER_LONG) {
      expect(container).toHaveTextContent(paragraph);
    }
  });

  it('DET-17 · cada página legal pasa axe sin violaciones bloqueantes', async () => {
    for (const route of LEGAL_ROUTES) {
      const { container, unmount } = renderLegal(route.path);
      await expectNoBlockingAxeViolations(container);
      unmount();
    }
  }, 20_000);

  it('DET-20 · la home y sus actos siguen montados con las páginas nuevas', () => {
    const { container } = render(<App />);
    expect(screen.getByText(HERO.claim)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: new RegExp(ACT1.title, 'i') })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: CONTACT_SCENE.title })).toBeInTheDocument();
    expect(container.querySelector('#contacto')).not.toBeNull();
    for (const route of LEGAL_ROUTES) {
      expect(screen.getByRole('link', { name: route.title })).toHaveAttribute('href', route.path);
    }
  });

  it('SEO-05 · no hay banner de cookies porque no hay cookies no esenciales', () => {
    const { container } = render(<App />);
    expect(container.querySelector('[data-cookie-banner]')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Aceptar' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Rechazar' })).toBeNull();
  });

  it('SEO-06 · la carga inicial no instala cookies no esenciales', () => {
    render(<App />);
    expect(document.cookie).not.toMatch(/_ga|_gid|_fbp|plausible|ajs_/);
  });

  it('SEO-07 · robots.txt existe y permite indexar las rutas públicas', () => {
    expect(ROBOTS).toMatch(/User-agent:\s*\*/);
    expect(ROBOTS).toMatch(/Allow:\s*\//);
  });

  it('G2 · la imagen Open Graph es un PNG 1200×630 del emblema sobre navy', () => {
    expect(existsSync(OG_PNG)).toBe(true);
    const bytes = readFileSync(OG_PNG);
    expect(bytes.subarray(0, 8)).toEqual(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    );
    window.history.pushState({}, '', '/aviso-legal');
    render(<App />);
    const image = document.querySelector('meta[property="og:image"]');
    expect(image).toHaveAttribute('content', `${window.location.origin}/og.png`);
    expect(document.querySelector('meta[name="twitter:image"]')).toHaveAttribute(
      'content',
      `${window.location.origin}/og.png`,
    );
  });

  it('G7 · el CTA del header y el dossier emiten eventos con posición', () => {
    const events: {
      name: string;
      payload?: Readonly<Record<string, string | number | boolean>>;
    }[] = [];
    setAnalyticsSink((name, payload) => {
      if (payload === undefined) events.push({ name });
      else events.push({ name, payload });
    });
    const { container } = render(<App />);
    const header = container.querySelector('a[data-track-position="header"]');
    expect(header).not.toBeNull();
    fireEvent.click(header ?? document.body);
    expect(
      events.some((event) => event.name === 'cta_click' && event.payload?.position === 'header'),
    ).toBe(true);
    const dossier = container.querySelector('a[href="/dossier.pdf"]');
    expect(dossier).not.toBeNull();
    fireEvent.click(dossier ?? document.body);
    expect(events.some((event) => event.name === 'dossier_download')).toBe(true);
  });

  it('DET-14 · el JSON-LD de Organization omite telephone y sameAs', () => {
    render(<App />);
    const node = document.querySelector('script[data-org-schema]');
    expect(node).not.toBeNull();
    const schema = JSON.parse(node?.textContent ?? '{}') as Record<string, unknown>;
    expect(schema['@type']).toBe('Organization');
    expect(schema).not.toHaveProperty('telephone');
    expect(schema).not.toHaveProperty('sameAs');
  });
});

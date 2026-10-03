import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { DISCLAIMER_TEXT } from '@/components/Disclaimer';
import { PENDING_LABEL } from '@/components/PendingValue';
import { ScrollTrigger } from '@/motion/gsapSetup';
import { contactHref } from '@/scenes/05-activos-simulador/contactHref';
import { ACT5 } from '@/scenes/05-activos-simulador/content';
import { Act5Scene } from '@/scenes/05-activos-simulador/Scene';
import { expectNoBlockingAxeViolations } from '@/test/axe';

const CANON = readFileSync(
  resolve(process.cwd(), 'content/secciones/05-nuestra-estrategia.md'),
  'utf8',
);
const TABLES = readFileSync(resolve(process.cwd(), 'content/03-datos-y-tablas.md'), 'utf8');

const MIN_INVESTMENT = /\d[\d.]{2,}\s*(US\$|USD|€|EUR|euros?)/i;
const nativeMatchMedia = window.matchMedia.bind(window);
const CSS = readFileSync(
  resolve(process.cwd(), 'src/scenes/05-activos-simulador/scene.css'),
  'utf8',
);

function stubNarrowViewport(): void {
  window.matchMedia = (query: string) =>
    ({
      matches: query.includes('min-width: 48rem') ? false : query.includes('max-width'),
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

describe('Act5Scene', () => {
  afterEach(() => {
    window.matchMedia = nativeMatchMedia;
    for (const trigger of ScrollTrigger.getAll()) trigger.kill();
  });

  it('VEH-01 · los tres vehículos con ventaja y perfil literales del dossier', () => {
    const { container } = render(<Act5Scene />);
    expect(screen.getByRole('heading', { name: new RegExp(ACT5.title, 'i') })).toBeInTheDocument();
    expect(screen.getByText(ACT5.intro)).toBeInTheDocument();
    expect(container.querySelector('[data-disclaimer="inline"]')).toHaveTextContent(
      DISCLAIMER_TEXT,
    );
    expect(ACT5.vehicles).toHaveLength(3);
    for (const vehicle of ACT5.vehicles) {
      const card = container.querySelector(`[data-vehicle="${vehicle.id}"]`);
      expect(card).toHaveTextContent(vehicle.name);
      expect(card).toHaveTextContent(vehicle.advantage);
      expect(card).toHaveTextContent(vehicle.performance);
      expect(CANON).toContain(vehicle.name);
      expect(CANON).toContain(vehicle.advantage);
      expect(CANON).toContain(vehicle.performance);
      expect(TABLES).toContain(vehicle.name);
    }
  });

  it('VEH-02 · la tarjeta de proyectos de desarrollo contiene la glosa de al pozo', () => {
    const { container } = render(<Act5Scene />);
    const card = container.querySelector('[data-vehicle="development"]');
    const gloss = card?.querySelector('[data-pozo-gloss]');
    expect(gloss).toHaveTextContent(ACT5.copy.pozoGloss);
    expect(card?.querySelector('abbr')).toHaveAttribute('title', ACT5.copy.pozoGloss);
    expect(card?.querySelector('abbr')).toHaveTextContent(ACT5.copy.pozoTerm);
    expect(ACT5.vehicles[2].glossary).toBe(ACT5.copy.pozoGloss);
  });

  it('VEH-03 · el suelo de entrada renderiza PendingValue y no publica cifra de importe mínimo', () => {
    const { container } = render(<Act5Scene />);
    const block = container.querySelector('[data-entry-floor]');
    expect(block).toHaveTextContent(ACT5.copy.entryFloorTitle);
    expect(block).toHaveTextContent(ACT5.entryFloor.note);
    expect(block?.querySelector('[data-pending]')).toHaveAttribute(
      'data-debt-id',
      ACT5.entryFloor.debtId,
    );
    expect(block).toHaveTextContent(PENDING_LABEL);
    expect(container.textContent).not.toMatch(MIN_INVESTMENT);
    expect(JSON.stringify(ACT5)).not.toMatch(MIN_INVESTMENT);
  });

  it('VEH-06 · cada tarjeta repite sus etiquetas internas y no hay tabla con scroll horizontal', () => {
    stubNarrowViewport();
    expect(window.matchMedia('(min-width: 48rem)').matches).toBe(false);
    const { container } = render(<Act5Scene />);
    expect(container.querySelector('table')).toBeNull();
    const cards = container.querySelectorAll('[data-vehicle]');
    expect(cards).toHaveLength(3);
    for (const card of cards) {
      expect(card).toHaveTextContent(ACT5.copy.advantage);
      expect(card).toHaveTextContent(ACT5.copy.performance);
    }
    const list = container.querySelector('.vehicle-cards');
    expect(list).not.toBeNull();
    if (!list) return;
    expect(getComputedStyle(list).overflowX).not.toBe('scroll');
    const defaultBlock = /^\.vehicle-cards \{[^}]+\}/m.exec(CSS)?.[0];
    expect(defaultBlock).toMatch(/overflow-x:\s*visible/);
    expect(defaultBlock).not.toMatch(/grid-template-columns/);
    expect(CSS).toMatch(
      /@media \(min-width: 48rem\) \{[\s\S]*?\.vehicle-cards \{[\s\S]*?grid-template-columns:\s*repeat\(3/,
    );
  });

  it('VEH-07 · la sección no tiene violaciones axe critical ni serious', async () => {
    const { container } = render(<Act5Scene />);
    await expectNoBlockingAxeViolations(container);
  });

  it('cada vehículo enlaza al formulario con su tipo como contexto', () => {
    const { container } = render(<Act5Scene />);
    for (const vehicle of ACT5.vehicles) {
      const card = container.querySelector(`[data-vehicle="${vehicle.id}"]`);
      const link = card?.querySelector('a');
      expect(link).toHaveAttribute('href', contactHref(vehicle.id));
      expect(link).toHaveTextContent(ACT5.cta.label);
    }
    const closing = screen.getAllByRole('link', { name: ACT5.cta.label });
    expect(closing.at(-1)).toHaveAttribute('href', contactHref());
  });
});

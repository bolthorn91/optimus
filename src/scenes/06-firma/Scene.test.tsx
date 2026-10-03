import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';

import { PENDING_LABEL } from '@/components/PendingValue';
import { ScrollTrigger } from '@/motion/gsapSetup';
import { ACT67 } from '@/scenes/06-firma/content';
import { Act67Scene } from '@/scenes/06-firma/Scene';
import { expectNoBlockingAxeViolations } from '@/test/axe';

const CANON6 = readFileSync(
  resolve(process.cwd(), 'content/secciones/06-estructura-operativa.md'),
  'utf8',
);
const CANON7 = readFileSync(
  resolve(process.cwd(), 'content/secciones/07-asesoramiento-intermediacion.md'),
  'utf8',
);
const GLOSSARY = readFileSync(resolve(process.cwd(), 'content/01-identidad-y-tono.md'), 'utf8');

/** El canon parte las citas con `>` y saltos de línea; el sitio las sirve en un solo párrafo. */
function foldedCanon(markdown: string): string {
  return markdown.replace(/^>\s?/gm, '').replace(/\s+/g, ' ').trim();
}

const nativeMatchMedia = window.matchMedia.bind(window);

function stubMatchMedia(queryNeedle: string): void {
  window.matchMedia = (query: string) =>
    ({
      matches: query.includes(queryNeedle),
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

function renderScene() {
  return render(
    <MemoryRouter>
      <Act67Scene />
    </MemoryRouter>,
  );
}

function driveAct67(progress: number): void {
  const trigger = ScrollTrigger.getAll().find((item) => {
    const node = item.trigger;
    return node instanceof HTMLElement && node.id === 'firma';
  });
  expect(trigger).toBeDefined();
  act(() => {
    trigger?.vars.onUpdate?.({ progress } as ScrollTrigger);
  });
}

describe('Act67Scene', () => {
  afterEach(() => {
    window.matchMedia = nativeMatchMedia;
    for (const trigger of ScrollTrigger.getAll()) trigger.kill();
  });

  it('FIR-03 · el retrato es un marcador con iniciales, sin imagen', () => {
    const { container } = renderScene();
    const portrait = screen.getByRole('img', { name: ACT67.copy.portraitPending });
    expect(portrait).toHaveAttribute('data-portrait-pending');
    expect(portrait).toHaveTextContent('CC');
    expect(portrait.querySelector('img')).toBeNull();
    expect(container.querySelector('[data-founder-card] img')).toBeNull();
  });

  it('FIR-04 · la nota de habilitación reproduce el literal y marca el registro', () => {
    renderScene();
    const note = screen.getByText(ACT67.authorisationNote.literal, { exact: false });
    expect(note).toHaveAttribute('data-authorisation');
    expect(note).toHaveTextContent(ACT67.authorisationNote.label);
    expect(note).toHaveTextContent(PENDING_LABEL);
    expect(note.querySelector(`[data-debt-id="${ACT67.authorisationNote.debtId}"]`)).not.toBeNull();
  });

  it('FIR-05 · la trazabilidad es texto, sin enlace ni botón a un panel', () => {
    const { container } = renderScene();
    expect(screen.getByText(ACT67.differential)).toBeInTheDocument();
    expect(container.textContent).toContain('tiempo real');
    expect(container.textContent).toContain('informes diarios');
    const actions = container.querySelectorAll('a, button');
    for (const action of actions) {
      expect(action).not.toHaveTextContent(/panel|informes diarios|tiempo real/i);
    }
  });

  it('FIR-06 · los tres departamentos incluyen el guion de Técnico-Legal', () => {
    renderScene();
    expect(ACT67.departments).toHaveLength(3);
    for (const department of ACT67.departments) {
      expect(screen.getByRole('heading', { name: department.name })).toBeInTheDocument();
      expect(screen.getByText(department.role)).toBeInTheDocument();
    }
    expect(screen.getByRole('heading', { name: /Financiero y Técnico-Legal/ })).toBeInTheDocument();
  });

  it('FIR-07 · desambigua CDI como Clave de Identificación', () => {
    renderScene();
    const note = screen.getByText(ACT67.cdiDisambiguation);
    expect(note).toHaveAttribute('data-cdi-disambiguation');
    expect(note).toHaveTextContent('Clave de Identificación');
    expect(note).toHaveTextContent('Convenio para Evitar la Doble Imposición');
  });

  it('FIR-08 · los organismos son texto, sin logotipos', () => {
    const { container } = renderScene();
    const band = container.querySelector('[data-organisations]');
    expect(band).not.toBeNull();
    expect(band?.querySelector('img')).toBeNull();
    for (const name of ACT67.organisations) {
      expect(band).toHaveTextContent(name);
    }
    expect(container.querySelectorAll('[data-organisations] img')).toHaveLength(0);
    expect(container.querySelectorAll('img')).toHaveLength(0);
  });

  it('FIR-09 · OPTIMVS deriva y no ejecuta ni custodia', () => {
    renderScene();
    const note = screen.getByText(ACT67.introducingBrokerNote);
    expect(note).toHaveAttribute('data-introducing-broker');
    expect(note).toHaveTextContent('capta y deriva');
    expect(note).toHaveTextContent('no ejecuta ni custodia');
  });

  it('FIR-10 · las ocho siglas son accesibles por teclado y están al pie', () => {
    const { container } = renderScene();
    expect(ACT67.glossary).toHaveLength(8);
    const glossary = container.querySelector('[data-glossary]');
    expect(glossary).not.toBeNull();
    const links = glossary?.querySelectorAll('nav a');
    expect(links).toHaveLength(8);
    const terms = glossary?.querySelectorAll('dt');
    expect(terms).toHaveLength(8);
    for (const entry of ACT67.glossary) {
      const link = screen.getByRole('link', { name: entry.term });
      expect(link).toHaveAttribute('href', `#gloss-${entry.id}`);
      expect(screen.getByText(entry.definition)).toBeInTheDocument();
    }
  });

  it('FIR-14 · biografía, departamentos y vías coinciden con el canon', () => {
    const canon6 = foldedCanon(CANON6);
    const canon7 = foldedCanon(CANON7);
    renderScene();
    expect(canon6).toContain(ACT67.firmSummary);
    for (const paragraph of ACT67.founder.bio) {
      expect(canon6).toContain(paragraph);
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    }
    for (const department of ACT67.departments) {
      expect(CANON6).toContain(department.name);
      expect(canon6).toContain(department.role);
      expect(screen.getByText(department.role)).toBeInTheDocument();
    }
    expect(CANON6).toContain('Financiero y Técnico-Legal');
    for (const route of ACT67.routes) {
      expect(screen.getByText(route.title)).toBeInTheDocument();
      for (const step of route.steps) {
        expect(canon7).toContain(step);
        expect(screen.getByText(step)).toBeInTheDocument();
      }
    }
    expect(CANON7).toContain('Clave de Identificación');
    for (const entry of ACT67.glossary) {
      expect(GLOSSARY).toContain(entry.term);
    }
  });

  it('no publica teléfonos, dominio, retrato de banco ni Think Thanks', () => {
    const { container } = renderScene();
    expect(container).not.toHaveTextContent('+34');
    expect(container).not.toHaveTextContent('+54');
    expect(container).not.toHaveTextContent('optimvs.cp.com');
    expect(container).not.toHaveTextContent('Think Thanks');
    expect(container.querySelector('img')).toBeNull();
  });

  it('el rango de inversor no incluye cifras', () => {
    const { container } = renderScene();
    const range = container.querySelector('[data-investor-range]');
    expect(range).toHaveTextContent(ACT67.investorRange.from);
    expect(range).toHaveTextContent(ACT67.investorRange.to);
    expect(range).not.toHaveTextContent(/\d/);
  });

  it('FIR-11 · con movimiento reducido el contenido está visible y no hay ScrollTrigger', () => {
    stubMatchMedia('prefers-reduced-motion');
    const { container } = renderScene();
    expect(ScrollTrigger.getAll()).toEqual([]);
    expect(screen.getByText(ACT67.firmSummary)).toBeInTheDocument();
    expect(screen.getByText(ACT67.founder.bio[0])).toBeInTheDocument();
    expect(screen.getByText(ACT67.cdiDisambiguation)).toBeInTheDocument();
    const diagrams = container.querySelectorAll('[data-process-diagram]');
    expect(diagrams).toHaveLength(2);
    expect(diagrams[0]).toHaveAttribute(
      'data-draw',
      ACT67.intermediationChain.conventional.map(() => '1').join(' '),
    );
    expect(diagrams[1]).toHaveAttribute(
      'data-draw',
      ACT67.intermediationChain.optimvs.map(() => '1').join(' '),
    );
    const founder = container.querySelector('[data-founder-card]');
    expect(founder).toBeInstanceOf(HTMLElement);
    if (!(founder instanceof HTMLElement)) return;
    expect(founder.style.getPropertyValue('--founder-progress')).toBe('1');
  });

  it('FIR-12 · axe sin violaciones bloqueantes', async () => {
    const { container } = renderScene();
    await expectNoBlockingAxeViolations(container);
  });

  it('FIR-13 · desmontar deja cero ScrollTrigger', () => {
    const { unmount } = renderScene();
    expect(ScrollTrigger.getAll().length).toBeGreaterThan(0);
    unmount();
    expect(ScrollTrigger.getAll()).toEqual([]);
  });

  it('FIR-02 · en el DOM la cadena convencional se traza antes que la de OPTIMVS', () => {
    const { container } = renderScene();
    driveAct67(0.48);
    const diagrams = container.querySelectorAll('[data-process-diagram]');
    expect(diagrams[0]).toHaveAttribute(
      'data-draw',
      ACT67.intermediationChain.conventional.map(() => '1').join(' '),
    );
    expect(diagrams[1]).toHaveAttribute(
      'data-draw',
      ACT67.intermediationChain.optimvs.map(() => '0').join(' '),
    );
  });
});

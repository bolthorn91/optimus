import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';

import { App } from '@/app/App';
import { MOBILE_COPY } from '@/app/mobileCopy';
import { formatArea, formatDensity, formatNumber } from '@/lib/format';
import { ScrollTrigger } from '@/motion/gsapSetup';
import { scrollTriggerEnd } from '@/motion/responsive';
import { DETAIL_COPY } from '@/pages/detailCopy';
import { ACT1 } from '@/scenes/01-escenario-europeo/content';
import { ACT2 } from '@/scenes/02-seguridad-global/content';
import { ACT3 } from '@/scenes/03-asimetria-territorial/content';
import { ACT4 } from '@/scenes/04-marco-legal/content';
import { ACT5 } from '@/scenes/05-activos-simulador/content';
import { Act5Scene } from '@/scenes/05-activos-simulador/Scene';
import { ACT67 } from '@/scenes/06-firma/content';
import { Act67Scene } from '@/scenes/06-firma/Scene';
import { CONTACT_SCENE } from '@/scenes/07-contacto/content';
import { expectNoBlockingAxeViolations } from '@/test/axe';

const nativeWidth = window.innerWidth;

const ACT_IDS = [
  'escenario',
  'seguridad',
  'territorio',
  'marco',
  'activos',
  'firma',
  'contacto',
] as const;

const PRESENTATION = [
  MOBILE_COPY.staticSceneNote,
  MOBILE_COPY.tableExpand,
  MOBILE_COPY.openMenu,
  MOBILE_COPY.closeMenu,
  MOBILE_COPY.menu,
  MOBILE_COPY.stickyCta,
  ACT3.copy.fallbackNote,
] as const;

const CLIP_CSS = [
  'src/components/definition-table.css',
  'src/components/paired-comparison.css',
  'src/components/stacked-comparison.css',
  'src/components/risk-table.css',
] as const;

const CANONICAL: Record<(typeof ACT_IDS)[number], readonly string[]> = {
  escenario: [ACT1.title, ACT1.intro, ...ACT1.factors.map((factor) => factor.title)],
  seguridad: [ACT2.title, ...ACT2.intro],
  territorio: [ACT3.intro.europe, ACT3.intro.southAmerica, ...ACT3.countries.map((c) => c.name)],
  marco: [ACT4.title, ACT4.intro],
  activos: [ACT5.title, ACT5.intro],
  firma: [
    ACT67.title,
    ...ACT67.intermediationChain.conventional,
    ...ACT67.intermediationChain.optimvs,
    ...ACT67.glossary.map((entry) => entry.term),
  ],
  contacto: [
    CONTACT_SCENE.title,
    CONTACT_SCENE.subtitle,
    ...CONTACT_SCENE.benefits,
    CONTACT_SCENE.cta,
  ],
};

function setWidth(width: number): void {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
  window.dispatchEvent(new Event('resize'));
}

function isPresentation(text: string): boolean {
  const trimmed = text.trim();
  return (PRESENTATION as readonly string[]).includes(trimmed);
}

function observableTokens(root: Element | null): Set<string> {
  const tokens = new Set<string>();
  if (!root) return tokens;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const host = node.parentElement;
    const raw = node.textContent ?? '';
    const inFlight = host?.closest('[aria-hidden="true"]');
    const hiddenChrome = Boolean(
      host?.closest('.visually-hidden') && !host.closest('[data-tabular]'),
    );
    if (!inFlight && !hiddenChrome && !isPresentation(raw)) {
      const cleaned = raw.replaceAll('\u00A0', ' ').toLocaleLowerCase('es-ES');
      for (const token of cleaned.split(/[^\p{L}\p{N}²³%]+/u)) {
        if (token.length > 0) tokens.add(token);
      }
    }
    node = walker.nextNode();
  }
  return tokens;
}

function collectActs(): {
  text: Record<(typeof ACT_IDS)[number], string>;
  tokens: Record<(typeof ACT_IDS)[number], Set<string>>;
} {
  const { container, unmount } = render(<App />);
  const text = {} as Record<(typeof ACT_IDS)[number], string>;
  const tokens = {} as Record<(typeof ACT_IDS)[number], Set<string>>;
  for (const id of ACT_IDS) {
    const node = container.querySelector(`#${id}`);
    expect(node, id).not.toBeNull();
    text[id] = node?.textContent ?? '';
    tokens[id] = observableTokens(node);
  }
  unmount();
  for (const trigger of ScrollTrigger.getAll()) trigger.kill();
  return { text, tokens };
}

function triggerById(id: string) {
  return ScrollTrigger.getAll().find((item) => {
    const node = item.trigger;
    return node instanceof HTMLElement && node.id === id;
  });
}

describe('DoD móvil fase D', { timeout: 30_000 }, () => {
  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: nativeWidth });
    window.history.pushState({}, '', '/');
    for (const trigger of ScrollTrigger.getAll()) trigger.kill();
  });

  it('MOB-01 · el contenido textual de los siete actos es el mismo a 375 y a 1440 px', () => {
    setWidth(375);
    const mobile = collectActs();
    setWidth(1440);
    const desktop = collectActs();

    for (const id of ACT_IDS) {
      for (const needle of CANONICAL[id]) {
        expect(mobile.text[id], `${id} @375`).toContain(needle);
        expect(desktop.text[id], `${id} @1440`).toContain(needle);
      }
      const missingOnMobile = [...desktop.tokens[id]].filter(
        (token) => !mobile.tokens[id].has(token),
      );
      const extraOnMobile = [...mobile.tokens[id]].filter(
        (token) => !desktop.tokens[id].has(token),
      );
      expect(missingOnMobile, `${id} lost on mobile`).toEqual([]);
      expect(extraOnMobile, `${id} extra on mobile`).toEqual([]);
    }
    for (const country of ACT3.countries) {
      const figures = [
        formatArea(country.areaKm2, 'km²'),
        formatNumber(country.population),
        formatDensity(country.densityPerKm2),
      ];
      for (const figure of figures) {
        expect(mobile.text.territorio, `${country.id} @375`).toContain(figure);
        expect(desktop.text.territorio, `${country.id} @1440`).toContain(figure);
      }
    }
  });

  it('MOB-18 · al cruzar el punto de ruptura la política se reevalúa', () => {
    setWidth(375);
    const act5 = render(<Act5Scene />);
    expect(ScrollTrigger.getAll()).toEqual([]);
    act(() => {
      setWidth(1440);
    });
    expect(triggerById('activos')).toBeDefined();
    act(() => {
      setWidth(375);
    });
    expect(ScrollTrigger.getAll()).toEqual([]);
    act5.unmount();

    setWidth(1440);
    render(
      <MemoryRouter>
        <Act67Scene />
      </MemoryRouter>,
    );
    expect(String(triggerById('firma')?.vars.end)).toBe(scrollTriggerEnd('600vh'));
    act(() => {
      setWidth(375);
    });
    const firma = ScrollTrigger.getAll().filter((item) => {
      const node = item.trigger;
      return node instanceof HTMLElement && node.id === 'firma';
    });
    expect(firma).toHaveLength(1);
    expect(String(firma[0]?.vars.end)).toBe(scrollTriggerEnd('320svh'));
  });

  it('MOB-19 · cada acto a 375 px pasa axe sin violaciones bloqueantes', async () => {
    setWidth(375);
    const { container } = render(<App />);
    await expectNoBlockingAxeViolations(container);
  });

  it('MOB-20 · las tablas y comparativas adaptadas recortan el desbordamiento', () => {
    for (const file of CLIP_CSS) {
      expect(readFileSync(resolve(process.cwd(), file), 'utf8'), file).toContain(
        'overflow-x: clip',
      );
    }
  });

  it('MOB-22 · a 1440 px las escenas de escritorio siguen operativas', () => {
    setWidth(1440);
    const { container, unmount } = render(<App />);
    expect(screen.getByRole('table', { name: ACT2.copy.tableCaption })).toBeInTheDocument();
    expect(container.querySelector('#marco [data-process-diagram]')).toHaveAttribute(
      'data-orientation',
      'horizontal',
    );
    expect(triggerById('activos')).toBeDefined();
    expect(String(triggerById('contacto')?.vars.end)).toBe('top 35%');
    expect(container.querySelector('[data-year-table]')).toBeInstanceOf(HTMLDetailsElement);
    expect(container.querySelector('[data-year-table]')).not.toHaveAttribute('open');
    expect(container.querySelector('[data-toc-collapse]')).toBeNull();
    unmount();
    for (const trigger of ScrollTrigger.getAll()) trigger.kill();

    window.history.pushState({}, '', '/escenario-europeo');
    const detail = render(<App />);
    expect(detail.container.querySelector('[data-toc-collapse]')).toBeNull();
    expect(screen.getByRole('navigation', { name: DETAIL_COPY.toc })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: DETAIL_COPY.toc })).toBeInTheDocument();
  });
});

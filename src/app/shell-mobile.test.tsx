import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { App } from '@/app/App';
import { MOBILE_COPY } from '@/app/mobileCopy';
import { MobileNav } from '@/app/MobileNav';
import { ProgressBar } from '@/app/ProgressBar';
import { isAct, navEntries, SECTIONS } from '@/app/sections';
import { toRoman } from '@/lib/roman';
import { ScrollTrigger } from '@/motion/gsapSetup';
import { ACT5 } from '@/scenes/05-activos-simulador/content';
import { ACT67 } from '@/scenes/06-firma/content';

vi.mock('@/motion/useScrollProgress', () => ({
  useScrollProgress: () => 0.4,
}));

const nativeWidth = window.innerWidth;

function setWidth(width: number): void {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
  window.dispatchEvent(new Event('resize'));
}

function walkCss(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walkCss(path, acc);
    else if (
      (entry.name.endsWith('.css') || entry.name.endsWith('.tsx')) &&
      !entry.name.includes('.test.')
    ) {
      acc.push(path);
    }
  }
  return acc;
}

describe('shell móvil', { timeout: 30_000 }, () => {
  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: nativeWidth });
    window.history.pushState({}, '', '/');
    for (const trigger of ScrollTrigger.getAll()) trigger.kill();
  });

  it('MOB-08 · las superficies a pantalla completa usan svh o dvh, nunca vh', () => {
    const root = resolve(process.cwd(), 'src');
    const unit = 'vh';
    const fullscreen = new RegExp(
      String.raw`min-block-size:\s*100${unit}\b|height=["']100${unit}["']|HEIGHT = '100${unit}'`,
    );
    for (const file of walkCss(root)) {
      const source = readFileSync(file, 'utf8');
      expect(source, file).not.toMatch(fullscreen);
    }
  });

  it('MOB-09 · los controles del menú y del CTA fijo miden al menos 44 px', () => {
    setWidth(375);
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: MOBILE_COPY.openMenu }));
    const dialog = screen.getByRole('dialog');
    const controls = [
      screen.getByRole('button', { name: MOBILE_COPY.openMenu }),
      within(dialog).getByRole('button', { name: MOBILE_COPY.closeMenu }),
      ...navEntries().map((entry) => within(dialog).getByRole('link', { name: entry.label })),
      screen.getByRole('link', { name: MOBILE_COPY.stickyCta }),
    ];
    expect(controls).toHaveLength(3 + navEntries().length);
    expect(document.querySelector('[data-pozo-gloss] summary')).toBeInstanceOf(HTMLElement);
    expect(readFileSync(resolve(process.cwd(), 'src/styles/tokens.css'), 'utf8')).toContain(
      '--touch-min: 44px',
    );
    expect(readFileSync(resolve(process.cwd(), 'src/app/shell.css'), 'utf8')).toContain(
      '.menu-toggle',
    );
    expect(readFileSync(resolve(process.cwd(), 'src/app/mobile-nav.css'), 'utf8')).toContain(
      'min-block-size: var(--touch-min)',
    );
    expect(readFileSync(resolve(process.cwd(), 'src/app/sticky-cta.css'), 'utf8')).toContain(
      'min-block-size: var(--touch-min)',
    );
    expect(
      readFileSync(resolve(process.cwd(), 'src/scenes/05-activos-simulador/scene.css'), 'utf8'),
    ).toContain('min-block-size: var(--touch-min)');
    expect(readFileSync(resolve(process.cwd(), 'src/app/progress-bar.css'), 'utf8')).not.toMatch(
      /position:\s*fixed/,
    );
  });

  it('MOB-10 · el glosario y la glosa se activan por pulsación, no solo por hover', () => {
    setWidth(375);
    const { container } = render(<App />);
    fireEvent.click(screen.getByRole('button', { name: MOBILE_COPY.openMenu }));
    expect(container.querySelector('abbr[title]')).toBeNull();
    const gloss = container.querySelector('[data-glossary]');
    expect(gloss).not.toBeNull();
    for (const entry of ACT67.glossary) {
      expect(gloss).toHaveTextContent(entry.term);
      expect(gloss).toHaveTextContent(entry.definition);
    }
    const pozo = container.querySelector('[data-pozo-gloss]');
    expect(pozo?.querySelector('summary')).toHaveTextContent(ACT5.copy.pozoTerm);
    expect(pozo).toHaveTextContent(ACT5.copy.pozoGloss);
  });

  it('MOB-17 · el menú abierto atrapa el foco y ofrece las cinco entradas y el numeral', () => {
    setWidth(375);
    render(<App />);
    const header = document.querySelector('.site-header');
    expect(header?.querySelector('[data-progress-bar]')).not.toBeNull();
    const toggle = screen.getByRole('button', { name: MOBILE_COPY.openMenu });
    expect(header).toContainElement(toggle);
    fireEvent.click(toggle);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAccessibleName(MOBILE_COPY.menu);
    for (const entry of navEntries()) {
      expect(within(dialog).getByRole('link', { name: entry.label })).toBeInTheDocument();
    }
    for (const section of SECTIONS.filter(isAct)) {
      expect(within(dialog).getByText(toRoman(section.act))).toBeInTheDocument();
    }
    const focusable = [...dialog.querySelectorAll<HTMLElement>('a[href], button')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    expect(first).toBeDefined();
    expect(last).toBeDefined();
    last?.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(first);
    first?.focus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(last);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('activar un numeral del miliario cierra el menú', () => {
    setWidth(375);
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: MOBILE_COPY.openMenu }));
    const dialog = screen.getByRole('dialog');
    fireEvent.click(within(dialog).getByText(toRoman(1)));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('un rerender del menú abierto no mueve el foco al primer ítem', () => {
    const onClose = vi.fn();
    const current = SECTIONS[3];
    expect(current).toBeDefined();
    const { rerender } = render(
      <MobileNav current={current ?? null} onClose={onClose} open sections={SECTIONS} />,
    );
    const dialog = screen.getByRole('dialog');
    const links = within(dialog).getAllByRole('link');
    const mid = links[3];
    expect(mid).toBeDefined();
    mid?.focus();
    expect(document.activeElement).toBe(mid);
    const nextClose = (): void => {
      onClose();
    };
    rerender(<MobileNav current={current ?? null} onClose={nextClose} open sections={SECTIONS} />);
    expect(document.activeElement).toBe(mid);
  });

  it('el relleno de la barra de progreso sigue el porcentaje de lectura', () => {
    const { container } = render(<ProgressBar currentAct={3} progress={0.4} />);
    expect(container.querySelector('.progress-bar__fill')).toHaveStyle({ inlineSize: '40%' });
    expect(container.querySelector('[data-progress-bar]')).toHaveAttribute('aria-valuenow', '40');
  });

  it('MOB-16 · al enfocar un campo del formulario el CTA fijo se oculta', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/app/sticky-cta.css'), 'utf8');
    expect(css).toMatch(/\[data-contact-form\]:focus-within/);
    expect(css).toMatch(/\[data-contact-form\]:active/);
  });
});

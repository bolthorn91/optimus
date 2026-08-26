import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { App } from '@/app/App';
import { ScrollTrigger, gsap } from '@/motion/gsapSetup';
import { HERO } from '@/scenes/00-hero/content';
import { HeroScene } from '@/scenes/00-hero/Scene';
import { choreographIntro } from '@/scenes/00-hero/timeline';
import { expectNoBlockingAxeViolations } from '@/test/axe';

const PORTADA = readFileSync(
  resolve(process.cwd(), 'content/secciones/00-hero-portada.md'),
  'utf8',
);

const nativeMatchMedia = window.matchMedia.bind(window);

describe('HeroScene', () => {
  afterEach(() => {
    window.matchMedia = nativeMatchMedia;
    for (const trigger of ScrollTrigger.getAll()) trigger.kill();
  });

  // HERO-01
  it('HERO-01 · el h1 contiene el titular literal del dossier', () => {
    render(<HeroScene />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(HERO.headline);
    expect(PORTADA).toContain(HERO.headline);
  });

  // HERO-02
  it('HERO-02 · existe un solo h1 en la página', () => {
    const { container } = render(<App />);
    expect(container.querySelectorAll('h1')).toHaveLength(1);
  });

  // HERO-06
  it('HERO-06 · los CTA canónicos van a #contacto y /dossier.pdf', () => {
    render(<HeroScene />);
    expect(screen.getByRole('link', { name: 'Reservar sesión privada' })).toHaveAttribute(
      'href',
      '#contacto',
    );
    expect(screen.getByRole('link', { name: /Descargar dossier/ })).toHaveAttribute(
      'href',
      '/dossier.pdf',
    );
  });

  it('F1 · el h1 destaca patrimonio, libertad financiera e integridad ciudadana', () => {
    render(<HeroScene />);
    const heading = screen.getByRole('heading', { level: 1 });
    const strongs = [...heading.querySelectorAll('strong')].map((node) => node.textContent);
    expect(strongs).toEqual(['patrimonio', 'libertad financiera', 'integridad ciudadana']);
  });

  // HERO-07
  it('HERO-07 · no hay enlaces a redes sociales', () => {
    const { container } = render(<HeroScene />);
    const hrefs = [...container.querySelectorAll('a')].map(
      (node) => node.getAttribute('href') ?? '',
    );
    expect(hrefs.some((href) => /instagram|tiktok|facebook|linkedin/i.test(href))).toBe(false);
    expect(container.textContent).not.toMatch(/instagram|tiktok|facebook|linkedin/i);
  });

  // HERO-08
  it('HERO-08 · las tres tarjetas de presentación son literales', () => {
    render(<HeroScene />);
    expect(screen.getByText('Dirigido a')).toBeInTheDocument();
    expect(screen.getByText('Propuesta')).toBeInTheDocument();
    expect(screen.getByText('Estructura')).toBeInTheDocument();
    const unwrapped = PORTADA.replace(/\r\n/g, '\n')
      .replace(/^>\s?/gm, '')
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ');
    for (const card of HERO.intro) {
      expect(screen.getByText(card.body)).toBeInTheDocument();
      expect(unwrapped).toContain(card.body);
    }
  });

  it('el claim está reconstruido en CSS, no como imagen', () => {
    const { container } = render(<HeroScene />);
    expect(screen.getByText(HERO.claim)).toBeInTheDocument();
    expect(container.querySelector('img[src*="p01-X6"]')).toBeNull();
  });

  // HERO-09
  it('HERO-09 · no tiene violaciones de accesibilidad bloqueantes', async () => {
    const { container } = render(<HeroScene />);
    await expectNoBlockingAxeViolations(container);
  });

  // HERO-03
  it('HERO-03 · choreographIntro es determinista en 0, 0.5 y 1', () => {
    expect(choreographIntro(0)).toEqual({
      logoOpacity: 0,
      logoY: 24,
      lineOpacity: [0, 0, 0],
      lineY: [32, 32, 32],
      lineBlur: [8, 8, 8],
      claimOpacity: 0,
      ctaOpacity: 0,
      hintOpacity: 0,
    });
    const mid = choreographIntro(0.5);
    expect(mid.logoOpacity).toBe(1);
    expect(mid.logoY).toBe(0);
    expect(mid.claimOpacity).toBe(0);
    expect(mid.ctaOpacity).toBe(0);
    expect(mid.hintOpacity).toBe(0);
    expect(mid.lineOpacity[0]).toBe(1);
    expect(mid.lineOpacity[1]).toBeCloseTo(5 / 7);
    expect(mid.lineOpacity[2]).toBeCloseTo(3 / 7);
    expect(mid.lineY[0]).toBe(0);
    expect(mid.lineY[1]).toBeCloseTo(128 / 49);
    expect(mid.lineY[2]).toBeCloseTo(512 / 49);
    expect(mid.lineBlur[0]).toBe(0);
    expect(mid.lineBlur[1]).toBeCloseTo(32 / 49);
    expect(mid.lineBlur[2]).toBeCloseTo(128 / 49);
    const end = choreographIntro(1);
    expect(end).toEqual({
      logoOpacity: 1,
      logoY: 0,
      lineOpacity: [1, 1, 1],
      lineY: [0, 0, 0],
      lineBlur: [0, 0, 0],
      claimOpacity: 1,
      ctaOpacity: 1,
      hintOpacity: 1,
    });
    expect(choreographIntro(1)).toEqual(end);
  });

  // HERO-04
  it('HERO-04 · con movimiento reducido todo el contenido es visible y no hay ScrollTrigger', () => {
    window.matchMedia = (query: string) =>
      ({
        matches: query.includes('prefers-reduced-motion'),
        media: query,
        onchange: null,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        addListener: () => undefined,
        removeListener: () => undefined,
        dispatchEvent: () => false,
      }) as MediaQueryList;
    const { container } = render(<HeroScene />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(HERO.headline);
    expect(screen.getByText(HERO.claim)).toBeInTheDocument();
    expect(ScrollTrigger.getAll()).toEqual([]);
    expect(container.querySelectorAll('.hero-line')).toHaveLength(0);
    const end = choreographIntro(1);
    const hero = container.querySelector('#hero');
    expect(hero).toHaveStyle({
      '--logo-opacity': String(end.logoOpacity),
      '--claim-opacity': String(end.claimOpacity),
      '--cta-opacity': String(end.ctaOpacity),
      '--hint-opacity': String(end.hintOpacity),
    });
  });

  // HERO-05
  it('HERO-05 · el h1 anuncia el titular completo, no los fragmentos', () => {
    render(<HeroScene />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveAccessibleName(HERO.headline);
    const lines = heading.querySelectorAll('.hero-line');
    expect(lines.length).toBeGreaterThan(0);
    expect([...lines].every((line) => line.getAttribute('aria-hidden') === 'true')).toBe(true);
  });

  // HERO-10
  it('HERO-10 · desmontar deja cero animaciones vivas', () => {
    const { unmount } = render(<HeroScene />);
    unmount();
    expect(ScrollTrigger.getAll()).toEqual([]);
    expect(gsap.globalTimeline.getChildren().filter((tween) => tween.isActive())).toHaveLength(0);
  });
});

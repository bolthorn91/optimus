import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { App } from '@/app/App';
import { HERO } from '@/scenes/00-hero/content';
import { HeroScene } from '@/scenes/00-hero/Scene';
import { expectNoBlockingAxeViolations } from '@/test/axe';

const PORTADA = readFileSync(
  resolve(process.cwd(), 'content/secciones/00-hero-portada.md'),
  'utf8',
);

describe('HeroScene', () => {
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

  it('no tiene violaciones de accesibilidad bloqueantes', async () => {
    const { container } = render(<HeroScene />);
    await expectNoBlockingAxeViolations(container);
  });
});

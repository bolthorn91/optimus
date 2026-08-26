import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ACT1 } from '@/scenes/01-escenario-europeo/content';
import { Act1Scene } from '@/scenes/01-escenario-europeo/Scene';
import { expectNoBlockingAxeViolations } from '@/test/axe';

const CANON = readFileSync(
  resolve(process.cwd(), 'content/secciones/01-nuevo-escenario-europeo.md'),
  'utf8',
);

describe('Act1Scene', () => {
  // ACT1-01
  it('ACT1-01 · los títulos y cuerpos de los tres factores están en el DOM', () => {
    render(<Act1Scene />);
    for (const factor of ACT1.factors) {
      expect(screen.getByText(factor.title)).toBeInTheDocument();
      expect(screen.getByText(factor.body)).toBeInTheDocument();
    }
  });

  // ACT1-02
  it('ACT1-02 · el título es I. El nuevo escenario europeo con romano accesible', () => {
    render(<Act1Scene />);
    const heading = screen.getByRole('heading', { level: 2, name: /el nuevo escenario europeo/i });
    expect(heading).toHaveTextContent(`I. ${ACT1.title}`);
    expect(heading.querySelector('[lang="la"]')).toHaveAccessibleName('1');
  });

  // ACT1-06
  it('ACT1-06 · el 14 % está en el DOM con statProgress 0', () => {
    const { container } = render(<Act1Scene />);
    const visible = container.querySelector('[data-dual-figure-value]')?.textContent ?? '';
    expect(visible.replace(/\u00A0/g, ' ')).toBe('14 %');
    expect(container.querySelector('[data-stat-figure]')).not.toBeNull();
  });

  // ACT1-07
  it('ACT1-07 · DualFigure muestra XIV oculto y 14 % accesible', () => {
    const { container } = render(<Act1Scene />);
    const dual = container.querySelector('[data-dual-figure]');
    expect(dual).not.toBeNull();
    expect(dual?.querySelector('[data-dual-figure-roman]')).toHaveTextContent('XIV');
    expect(dual?.querySelector('[data-dual-figure-roman] [aria-hidden="true"]')).not.toBeNull();
    expect(
      (dual?.querySelector('[data-dual-figure-value]')?.textContent ?? '').replace(/\u00A0/g, ' '),
    ).toBe('14 %');
  });

  // ACT1-11
  it('ACT1-11 · el CTA intermedio apunta a #contacto', () => {
    render(<Act1Scene />);
    const cta = screen.getByRole('link', { name: 'Analice su caso con un consultor' });
    expect(cta).toHaveAttribute('href', '#contacto');
  });

  // ACT1-12
  it('ACT1-12 · el texto de los tres factores coincide carácter a carácter con content/', () => {
    const unwrapped = CANON.replace(/\r\n/g, '\n')
      .replace(/^>\s?/gm, '')
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ');
    for (const factor of ACT1.factors) {
      expect(unwrapped).toContain(factor.title);
      expect(unwrapped).toContain(factor.body);
    }
  });

  it('no tiene violaciones de accesibilidad bloqueantes', async () => {
    const { container } = render(<Act1Scene />);
    await expectNoBlockingAxeViolations(container);
  });
});

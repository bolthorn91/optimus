import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';

import { App } from '@/app/App';
import { Layout } from '@/app/Layout';
import { milestoneMarks, sectionAt } from '@/app/sections';
import { Milestone } from '@/components/Milestone';
import { PENDING_LABEL } from '@/components/PendingValue';
import { ScrollTrigger } from '@/motion/gsapSetup';
import { HERO } from '@/scenes/00-hero/content';
import { ACT1 } from '@/scenes/01-escenario-europeo/content';
import { ACT2 } from '@/scenes/02-seguridad-global/content';
import { ACT3 } from '@/scenes/03-asimetria-territorial/content';
import { expectNoBlockingAxeViolations } from '@/test/axe';

function Bomb(): ReactNode {
  throw new Error('escena rota');
}

describe('shell', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/');
    for (const trigger of ScrollTrigger.getAll()) trigger.kill();
  });

  // FND-13
  it('FND-13 · el enlace Saltar al contenido es el primer elemento enfocable', () => {
    const { container } = render(<App />);
    const focusable = container.querySelectorAll('a[href], button, input, select, textarea');
    const first = focusable[0];
    expect(first).toBeInstanceOf(HTMLAnchorElement);
    expect(first).toHaveTextContent('Saltar al contenido');
    expect(first).toHaveAttribute('href', '#contenido');
  });

  // FND-11
  it('FND-11 · el footer usa PendingValue y no publica teléfonos', () => {
    const { container } = render(<App />);
    expect(container.textContent).toContain(PENDING_LABEL);
    expect(container.textContent).toContain('Teléfono Argentina');
    expect(container.textContent).not.toMatch(/\+34/);
    expect(container.textContent).not.toMatch(/\+54/);
    expect(container.textContent).not.toContain('optimvs.cp.com');
  });

  it('muestra el CTA canónico y cinco grupos de navegación', () => {
    render(<App />);
    expect(screen.getAllByText('Reservar sesión privada').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Escenario').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Nosotros').length).toBeGreaterThan(0);
  });

  it('el miliario marca los actos alcanzados según el progreso', () => {
    const { container, rerender } = render(<Milestone marks={milestoneMarks(sectionAt(0))} />);
    expect(container.querySelectorAll('[data-reached="true"]')).toHaveLength(0);
    rerender(<Milestone marks={milestoneMarks(sectionAt(1))} />);
    expect(container.querySelectorAll('[data-reached="true"]').length).toBe(7);
    const mid = sectionAt(0.5);
    rerender(<Milestone marks={milestoneMarks(mid)} />);
    expect(container.querySelectorAll('[data-reached="true"]')).toHaveLength(
      milestoneMarks(mid).filter((mark) => mark.reached).length,
    );
  });

  it('un error de escena no tumba la navegación', () => {
    const { container } = render(
      <MemoryRouter>
        <Routes>
          <Route element={<Layout />} path="/">
            <Route element={<Bomb />} index />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(container.textContent).toContain('No hemos podido mostrar esta sección');
    expect(container.textContent).toContain('Saltar al contenido');
    expect(container.textContent).toContain('Reservar sesión privada');
  });

  it('en /design restaura el par marfil y no enciende el miliario', () => {
    window.history.pushState({}, '', '/design');
    const { container } = render(<App />);
    expect(screen.getByText('Muestrario del sistema de diseño')).toBeInTheDocument();
    expect(document.documentElement.style.getPropertyValue('--doc-surface')).toBe('var(--surface)');
    expect(document.documentElement.style.getPropertyValue('--doc-focus')).toBe('');
    expect(document.documentElement.style.getPropertyValue('--focus')).toBe('');
    expect(container.querySelector('[data-milestone]')).toBeNull();
    expect(container.querySelector('.site-header')).toHaveAttribute('data-past-hero', 'true');
  });

  it('en la home el miliario sigue el manifiesto y el nav espera al hero', () => {
    const { container } = render(<App />);
    expect(container.querySelector('.site-header')).toHaveAttribute('data-past-hero', 'false');
    expect(container.querySelector('[data-milestone]')).not.toBeNull();
    expect(document.documentElement.style.getPropertyValue('--doc-focus')).toBe(
      'var(--color-gold-high)',
    );
    expect(document.documentElement.style.getPropertyValue('--focus')).toBe('');
  });

  it('no tiene violaciones de accesibilidad bloqueantes en el shell', async () => {
    const { container } = render(<App />);
    await expectNoBlockingAxeViolations(container);
  });

  // CMP-10
  it('CMP-10 · hero y actos I y II siguen en el DOM con el acto III montado', () => {
    const { container, unmount } = render(<App />);
    expect(screen.getByText(HERO.claim)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: new RegExp(ACT1.title, 'i') })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: new RegExp(ACT2.title, 'i') })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: new RegExp(ACT3.title, 'i') })).toBeInTheDocument();
    const seals = container.querySelectorAll('[data-act-seal]');
    expect(seals.length).toBeGreaterThanOrEqual(4);
    expect([...seals].some((seal) => seal.textContent.includes('IV'))).toBe(true);
    unmount();
    expect(ScrollTrigger.getAll()).toEqual([]);
  });
});

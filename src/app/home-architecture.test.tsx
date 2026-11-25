import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { App } from '@/app/App';
import { PROJECTS_PUBLISHED } from '@/content/projects';
import { expectNoBlockingAxeViolations } from '@/test/axe';

function renderAt(path: string) {
  window.history.pushState({}, '', path);
  return render(<App />);
}

describe('arquitectura comercial', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('la home deja el dossier fuera y conduce a la reserva', () => {
    const { container } = renderAt('/');
    expect(container.querySelector('#escenario')).toBeNull();
    expect(container.querySelector('#como-funciona')).not.toBeNull();
    expect(container.querySelector('#por-que-optimvs')).not.toBeNull();
    expect(container.querySelector('#calculadora')).not.toBeNull();
    expect(container.querySelectorAll('.home-section-marker')).toHaveLength(
      PROJECTS_PUBLISHED ? 5 : 4,
    );
    expect(container.querySelector('[data-route-stage]')).not.toBeNull();
    expect(screen.getByRole('link', { name: 'Desplácese para continuar' })).toHaveAttribute(
      'href',
      PROJECTS_PUBLISHED ? '#proyectos' : '#como-funciona',
    );
    expect(screen.getAllByRole('link', { name: 'Reservar sesión privada' }).length).toBeGreaterThan(
      0,
    );
    if (PROJECTS_PUBLISHED) {
      expect(container.querySelector('#proyectos')).not.toBeNull();
      expect(container.querySelectorAll('.project-card__image--mono')).toHaveLength(4);
      expect(container.querySelectorAll('.project-card__image--color')).toHaveLength(4);
      expect(screen.getByRole('link', { name: /Ver ficha de ONE/ })).toHaveAttribute(
        'href',
        '/proyectos/one',
      );
      expect(screen.getAllByText('Próximamente').length).toBeGreaterThan(0);
      expect(screen.getByRole('link', { name: 'Ver todos los proyectos' })).toHaveAttribute(
        'href',
        '/proyectos',
      );
    } else {
      expect(container.querySelector('#proyectos')).toBeNull();
      expect(container.querySelectorAll('.project-card')).toHaveLength(0);
      expect(screen.queryByRole('link', { name: 'Ver proyectos abiertos' })).toBeNull();
      expect(screen.queryByRole('link', { name: 'Ver todos los proyectos' })).toBeNull();
      expect(screen.queryByRole('link', { name: 'Proyectos' })).toBeNull();
    }
  });

  it('con la cartera en pausa, las URLs de proyectos no publican fichas', () => {
    if (PROJECTS_PUBLISHED) return;
    const { container } = renderAt('/proyectos');
    expect(container.querySelector('[data-not-found]')).not.toBeNull();
    expect(container.textContent).not.toContain('Añelo');
    expect(container.querySelector('a[href^="/proyectos"]')).toBeNull();
  });

  it.skipIf(!PROJECTS_PUBLISHED)(
    'la página de proyectos publica las fichas con sus datos y enlaces',
    () => {
      const { container } = renderAt('/proyectos');
      expect(screen.getByRole('heading', { level: 1, name: 'Proyectos' })).toBeInTheDocument();
      expect(container.querySelectorAll('[data-project]')).toHaveLength(4);
      expect(container.textContent).toContain('Añelo');
      expect(container.textContent).toContain('ONE');
      expect(container.textContent).toContain('Entre Pinares');
      expect(container.textContent).toContain('Edificio M. Paz');
      expect(container.querySelectorAll('[data-project-status="coming-soon"]')).toHaveLength(4);
      expect(container.querySelectorAll('.project-card__image--color')).toHaveLength(0);
      expect(container.textContent).toContain('Próximamente');
      expect(container.querySelector('a[href="/proyectos/one"]')).not.toBeNull();
    },
  );

  it.skipIf(!PROJECTS_PUBLISHED)(
    'la ficha de una promoción describe el proyecto y ofrece reservar',
    () => {
      const { container } = renderAt('/proyectos/one');
      expect(screen.getByRole('heading', { level: 1, name: 'ONE' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: 'El proyecto' })).toBeInTheDocument();
      expect(container.textContent).toContain('30.000 m²');
      expect(container.textContent).toContain('Piscina');
      expect(container.querySelector('img[alt*="Fachada"]')).not.toBeNull();
      expect(container.querySelector('.project-detail__hero')).not.toBeNull();
      expect(
        container.querySelectorAll('.project-detail__gallery [data-reveal="image"]'),
      ).toHaveLength(6);
      expect(screen.getByRole('link', { name: 'Ver todos los proyectos' })).toHaveAttribute(
        'href',
        '/proyectos',
      );
    },
  );

  it.skipIf(!PROJECTS_PUBLISHED)(
    'la ficha de proyecto no tiene violaciones axe bloqueantes',
    async () => {
      const detail = renderAt('/proyectos/one');
      await expectNoBlockingAxeViolations(detail.container);
      detail.unmount();
    },
    30_000,
  );

  it('la calculadora y la firma tienen páginas propias con un h1', () => {
    const calculator = renderAt('/calculadora');
    expect(
      screen.getByRole('heading', { level: 1, name: 'Calculadora de escenario' }),
    ).toBeInTheDocument();
    calculator.unmount();

    const company = renderAt('/nosotros');
    expect(screen.getByRole('heading', { level: 1, name: 'Quiénes somos' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Nuestra estructura operativa/ }),
    ).toBeInTheDocument();
    company.unmount();
  });

  it('la estrategia enlaza los siete actos y los tres tipos de activo', () => {
    const { container } = renderAt('/estrategia');
    expect(
      screen.getByRole('heading', { level: 1, name: 'Estrategia de inversión' }),
    ).toBeInTheDocument();
    expect(container.querySelectorAll('.strategy-chapters a')).toHaveLength(7);
    expect(container.querySelectorAll('.strategy-assets a')).toHaveLength(3);
  });

  it('proyectos y estrategia no tienen violaciones axe bloqueantes', async () => {
    if (PROJECTS_PUBLISHED) {
      const projects = renderAt('/proyectos');
      await expectNoBlockingAxeViolations(projects.container);
      projects.unmount();
    }

    const strategy = renderAt('/estrategia');
    await expectNoBlockingAxeViolations(strategy.container);
    strategy.unmount();
  }, 30_000);
});

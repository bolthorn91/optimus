import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';

import { App } from '@/app/App';
import { PENDING_LABEL } from '@/components/PendingValue';
import { formatCurrency } from '@/lib/format';
import { ContactPage } from '@/pages/ContactPage';
import { SCENARIO_LABELS } from '@/scenes/05-activos-simulador/content';
import {
  clearSimulatorSession,
  writeSimulatorSession,
} from '@/scenes/05-activos-simulador/simulatorSession';
import { CONTACT_SCENE } from '@/scenes/07-contacto/content';
import { expectNoBlockingAxeViolations } from '@/test/axe';

const nativeWidth = window.innerWidth;

function renderPage(path = '/contacto') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ContactPage />
    </MemoryRouter>,
  );
}

function setWidth(width: number): void {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
  window.dispatchEvent(new Event('resize'));
}

describe('ContactPage', () => {
  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: nativeWidth });
    window.history.pushState({}, '', '/');
    clearSimulatorSession();
  });

  it('alberga el formulario completo y la información de la sesión', () => {
    const { container } = renderPage();
    expect(
      screen.getByRole('heading', { level: 1, name: CONTACT_SCENE.pageTitle }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: CONTACT_SCENE.formHeading }),
    ).toBeInTheDocument();
    expect(container.querySelector('form')).not.toBeNull();
    expect(screen.getByLabelText(CONTACT_SCENE.copy.fullName)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: CONTACT_SCENE.copy.submit })).toBeInTheDocument();
    expect(container.querySelector('[data-contact-page]')).not.toBeNull();
    expect(container.querySelector('[data-sticky-cta]')).toBeNull();
    expect(container.querySelector('[data-simulator-context]')).toBeNull();
    expect(screen.getByText(CONTACT_SCENE.scenarioEmpty)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: CONTACT_SCENE.scenarioConfigure })).toHaveAttribute(
      'href',
      '/#simulador',
    );
  });

  it('el escenario de la URL preselecciona el interés', () => {
    renderPage('/contacto?vehiculo=equities');
    expect(screen.getByLabelText(CONTACT_SCENE.copy.interest)).toHaveValue('equities');
  });

  it('con el simulador usado muestra el escenario y un enlace para editarlo', () => {
    writeSimulatorSession({
      horizonLocked: true,
      input: {
        capital: 200_000,
        years: 12,
        scenario: 'favourable',
        vehicle: 'real-estate',
      },
    });
    const { container } = renderPage();
    const card = container.querySelector('.contact-page__scenario');
    expect(card).toHaveTextContent(CONTACT_SCENE.scenarioHeading);
    expect((card?.textContent ?? '').replaceAll('\u00A0', ' ')).toContain(
      formatCurrency(200_000).replaceAll('\u00A0', ' '),
    );
    expect(card).toHaveTextContent(SCENARIO_LABELS.favourable);
    expect(screen.getByLabelText(CONTACT_SCENE.copy.interest)).toHaveValue('real-estate');
    expect(screen.getByRole('link', { name: CONTACT_SCENE.scenarioEdit })).toHaveAttribute(
      'href',
      '/#simulador',
    );
  });

  it('el escenario de la URL manda sobre la sesión en memoria', () => {
    writeSimulatorSession({
      horizonLocked: true,
      input: {
        capital: 80_000,
        years: 6,
        scenario: 'base',
        vehicle: 'equities',
      },
    });
    renderPage('/contacto?capital=150000&horizonte=8&escenario=conservative&vehiculo=development');
    expect(screen.getByLabelText(CONTACT_SCENE.copy.interest)).toHaveValue('development');
    const card = document.querySelector('.contact-page__scenario');
    expect(card).toHaveTextContent(SCENARIO_LABELS.conservative);
  });

  it('no deja el CTA fijo sobre el formulario en móvil', () => {
    setWidth(375);
    window.history.pushState({}, '', '/contacto');
    const { container } = render(<App />);
    expect(container.querySelector('[data-contact-page]')).not.toBeNull();
    expect(container.querySelector('[data-sticky-cta]')).toBeNull();
    expect(container.querySelector('[data-track-position="header"]')).toBeNull();
  });

  it('los datos de contacto siguen pendientes de confirmación', () => {
    const { container } = renderPage();
    const details = container.querySelector('[data-contact-details]');
    expect(details).toHaveTextContent(PENDING_LABEL);
    expect(details?.querySelectorAll('[data-pending]')).toHaveLength(4);
  });

  it('axe sin violaciones bloqueantes', async () => {
    const { container } = renderPage();
    await expectNoBlockingAxeViolations(container);
  });
});

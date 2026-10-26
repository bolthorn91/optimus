import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';

import { DISCLAIMER_TEXT } from '@/components/Disclaimer';
import { PENDING_LABEL } from '@/components/PendingValue';
import { CONTACT } from '@/content/contact';
import { formatCurrency } from '@/lib/format';
import { ScrollTrigger } from '@/motion/gsapSetup';
import { ACT4 } from '@/scenes/04-marco-legal/content';
import { SCENARIO_LABELS, VEHICLE_LABELS } from '@/scenes/05-activos-simulador/content';
import {
  clearSimulatorSession,
  writeSimulatorSession,
} from '@/scenes/05-activos-simulador/simulatorSession';
import { CONTACT_SCENE } from '@/scenes/07-contacto/content';
import { ContactScene } from '@/scenes/07-contacto/Scene';
import { expectNoBlockingAxeViolations } from '@/test/axe';

const nativeMatchMedia = window.matchMedia.bind(window);
const nativeWidth = window.innerWidth;

function setWidth(width: number): void {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
  window.dispatchEvent(new Event('resize'));
}

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
    <MemoryRouter initialEntries={['/']}>
      <ContactScene />
    </MemoryRouter>,
  );
}

describe('ContactScene', () => {
  afterEach(() => {
    window.matchMedia = nativeMatchMedia;
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: nativeWidth });
    clearSimulatorSession();
    for (const trigger of ScrollTrigger.getAll()) trigger.kill();
  });

  it('FRM-19 · teléfonos y dominio son PendingValue, sin cifras plausibles', () => {
    const { container } = renderScene();
    expect(screen.getByText(CONTACT_SCENE.title)).toBeInTheDocument();
    expect(screen.getByText(CONTACT_SCENE.subtitle)).toBeInTheDocument();
    for (const benefit of CONTACT_SCENE.benefits) {
      expect(screen.getByText(benefit)).toBeInTheDocument();
    }
    const block = container.querySelector('[data-contact-details]');
    expect(block).not.toBeNull();
    expect(block).toHaveTextContent(CONTACT.spainPhone.label);
    expect(block).toHaveTextContent(CONTACT.argentinaPhone.label);
    expect(block).toHaveTextContent(CONTACT.email.label);
    expect(block).toHaveTextContent(CONTACT.domain.label);
    expect(block).toHaveTextContent(PENDING_LABEL);
    expect(block?.querySelectorAll('[data-pending]')).toHaveLength(4);
    expect(block).not.toHaveTextContent('+34');
    expect(block).not.toHaveTextContent('+54');
    expect(container).not.toHaveTextContent('optimvs.cp.com');
    expect(container).not.toHaveTextContent(/\+34\s*\d/);
    expect(container).not.toHaveTextContent(/\+54\s*\d/);
    expect(container.querySelector('a[href^="tel:"]')).toBeNull();
  });

  it('el cierre no embebe el formulario y deriva a la página de contacto', () => {
    const { container } = renderScene();
    expect(container.querySelector('form')).toBeNull();
    const cta = screen.getByRole('link', { name: CONTACT_SCENE.cta });
    expect(cta).toHaveAttribute('href', '/contacto#formulario');
    expect(cta).toHaveClass('cta');
    expect(screen.getByText(CONTACT_SCENE.ctaNote)).toBeInTheDocument();
  });

  it('con el simulador usado muestra el escenario y el enlace lo conserva', () => {
    writeSimulatorSession({
      horizonLocked: true,
      input: {
        capital: 200_000,
        years: 12,
        scenario: 'favourable',
        vehicle: 'real-estate',
      },
    });
    const { container } = renderScene();
    const scenario = container.querySelector('.contact-cta__scenario');
    expect(scenario).toHaveTextContent(CONTACT_SCENE.scenarioHeading);
    expect((scenario?.textContent ?? '').replaceAll('\u00A0', ' ')).toContain(
      formatCurrency(200_000).replaceAll('\u00A0', ' '),
    );
    expect(scenario).toHaveTextContent(SCENARIO_LABELS.favourable);
    expect(scenario).toHaveTextContent(VEHICLE_LABELS['real-estate']);

    const cta = screen.getByRole('link', { name: CONTACT_SCENE.cta });
    const url = new URL(cta.getAttribute('href') ?? '', 'https://optimvs.test');
    expect(url.pathname).toBe('/contacto');
    expect(url.hash).toBe('#formulario');
    expect(url.searchParams.get('vehiculo')).toBe('real-estate');
    expect(url.searchParams.get('capital')).toBe('200000');
    expect(url.searchParams.get('horizonte')).toBe('12');
    expect(url.searchParams.get('escenario')).toBe('favourable');
    expect(container.querySelector('input[type="hidden"]')).toBeNull();
  });

  it('el cierre reacciona si el simulador se usa con la escena ya montada', () => {
    const { container } = renderScene();
    expect(container.querySelector('.contact-cta__scenario')).toBeNull();
    expect(screen.getByText(CONTACT_SCENE.ctaPrompt)).toBeInTheDocument();

    act(() => {
      writeSimulatorSession({
        horizonLocked: false,
        input: {
          capital: 80_000,
          years: 6,
          scenario: 'base',
          vehicle: 'equities',
        },
      });
    });

    const scenario = container.querySelector('.contact-cta__scenario');
    expect(scenario).toHaveTextContent(SCENARIO_LABELS.base);
    expect(scenario).toHaveTextContent(VEHICLE_LABELS.equities);
    expect(screen.queryByText(CONTACT_SCENE.ctaPrompt)).toBeNull();
  });

  it('FRM-20 · el bloque de conversión lleva Disclaimer inline', () => {
    const { container } = renderScene();
    const conversion = container.querySelector('[data-conversion]');
    const disclaimer = conversion?.querySelector('[data-disclaimer="inline"]');
    expect(disclaimer).toHaveTextContent(DISCLAIMER_TEXT);
    for (const pillar of ACT4.guarantees.pillars) {
      expect(conversion).toHaveTextContent(pillar.pillar);
    }
  });

  it('axe sin violaciones bloqueantes', async () => {
    const { container } = renderScene();
    await expectNoBlockingAxeViolations(container);
  });

  it('con movimiento reducido el cierre está visible y no ancla', () => {
    stubMatchMedia('prefers-reduced-motion');
    const { container, unmount } = renderScene();
    expect(screen.getByText(CONTACT_SCENE.title)).toBeInTheDocument();
    expect(screen.getByText(CONTACT_SCENE.subtitle)).toBeInTheDocument();
    for (const benefit of CONTACT_SCENE.benefits) {
      expect(screen.getByText(benefit)).toBeInTheDocument();
    }
    expect(container.querySelector('#contacto')).toHaveStyle({ minBlockSize: '100svh' });
    expect(ScrollTrigger.getAll()).toEqual([]);
    unmount();
    expect(ScrollTrigger.getAll()).toEqual([]);
  });

  it('limpia los ScrollTrigger al desmontar', () => {
    const { unmount } = renderScene();
    expect(ScrollTrigger.getAll().length).toBeGreaterThan(0);
    unmount();
    expect(ScrollTrigger.getAll()).toEqual([]);
  });

  it('a 375 px no ancla y a 1440 px conserva el end de subida', () => {
    setWidth(375);
    const mobile = renderScene();
    expect(ScrollTrigger.getAll()).toEqual([]);
    mobile.unmount();

    setWidth(1440);
    const desktop = renderScene();
    const trigger = ScrollTrigger.getAll().find((item) => {
      const node = item.trigger;
      return node instanceof HTMLElement && node.id === 'contacto';
    });
    expect(String(trigger?.vars.end)).toBe('top 35%');
    desktop.unmount();
    expect(ScrollTrigger.getAll()).toEqual([]);
  });
});

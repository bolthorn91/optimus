import { act, render, renderHook, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';

import { DISCLAIMER_TEXT } from '@/components/Disclaimer';
import { PENDING_LABEL } from '@/components/PendingValue';
import { CONTACT } from '@/content/contact';
import { formatCurrency } from '@/lib/format';
import { ACT4 } from '@/scenes/04-marco-legal/content';
import { SCENARIO_LABELS, VEHICLE_LABELS } from '@/scenes/05-activos-simulador/content';
import {
  clearSimulatorSession,
  writeSimulatorSession,
} from '@/scenes/05-activos-simulador/simulatorSession';
import { useSimulator } from '@/scenes/05-activos-simulador/useSimulator';
import { CONTACT_SCENE } from '@/scenes/07-contacto/content';
import { ContactScene } from '@/scenes/07-contacto/Scene';
import { expectNoBlockingAxeViolations } from '@/test/axe';

function renderScene(path = '/#contacto') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ContactScene />
    </MemoryRouter>,
  );
}

describe('ContactScene', () => {
  afterEach(() => {
    clearSimulatorSession();
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

  it('FRM-10 · llegada con vehículo preselecciona el interés', () => {
    renderScene('/?vehiculo=equities#contacto');
    expect(screen.getByLabelText(CONTACT_SCENE.copy.interest)).toHaveValue('equities');
  });

  it('FRM-11 · con el simulador usado el contexto es visible', () => {
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
    const context = container.querySelector('[data-simulator-context]');
    expect(context).toHaveTextContent(CONTACT_SCENE.copy.simulatorContext);
    expect((context?.textContent ?? '').replaceAll('\u00A0', ' ')).toContain(
      formatCurrency(200_000).replaceAll('\u00A0', ' '),
    );
    expect(context).toHaveTextContent(SCENARIO_LABELS.favourable);
    expect(context).toHaveTextContent(VEHICLE_LABELS['real-estate']);
    expect(container.querySelector('input[type="hidden"]')).toBeNull();
  });

  it('FRM-11 · el contexto aparece si el simulador se usa con la escena ya montada', () => {
    const { container } = renderScene();
    expect(container.querySelector('[data-simulator-context]')).toBeNull();
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
    const context = container.querySelector('[data-simulator-context]');
    expect(context).toHaveTextContent(CONTACT_SCENE.copy.simulatorContext);
    expect((context?.textContent ?? '').replaceAll('\u00A0', ' ')).toContain(
      formatCurrency(80_000).replaceAll('\u00A0', ' '),
    );
    expect(context).toHaveTextContent(VEHICLE_LABELS.equities);
  });

  it('FRM-11 · montar el simulador no muestra contexto hasta un cambio del visitante', () => {
    const { container } = renderScene();
    const hook = renderHook(() => useSimulator());
    expect(container.querySelector('[data-simulator-context]')).toBeNull();
    act(() => {
      hook.result.current.setCapital(150_000);
    });
    expect(container.querySelector('[data-simulator-context]')).toHaveTextContent(
      CONTACT_SCENE.copy.simulatorContext,
    );
    hook.unmount();
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
});

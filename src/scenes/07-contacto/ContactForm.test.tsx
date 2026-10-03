import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RATE_MAX } from '@/lib/contact-form';
import { ContactForm } from '@/scenes/07-contacto/ContactForm';
import { CONTACT_SCENE, consentDataSentence } from '@/scenes/07-contacto/content';
import { expectNoBlockingAxeViolations } from '@/test/axe';

function submit(): void {
  fireEvent.click(screen.getByRole('button', { name: CONTACT_SCENE.copy.submit }));
}

function fillValid(): void {
  fireEvent.change(screen.getByLabelText(CONTACT_SCENE.copy.fullName), {
    target: { value: 'Ana Pérez' },
  });
  fireEvent.change(screen.getByLabelText(CONTACT_SCENE.copy.email), {
    target: { value: 'ana@example.com' },
  });
  fireEvent.change(screen.getByLabelText(CONTACT_SCENE.copy.phoneNational), {
    target: { value: '612345678' },
  });
  fireEvent.change(screen.getByLabelText(CONTACT_SCENE.copy.interest), {
    target: { value: 'real-estate' },
  });
  fireEvent.click(screen.getByRole('checkbox', { name: /He leído y acepto/ }));
}

describe('ContactForm', () => {
  it('FRM-08 · dos casillas de consentimiento, separadas y sin premarcar', () => {
    const { container } = render(<ContactForm />);
    const data = container.querySelector('[data-consent="data"] input');
    const marketing = container.querySelector('[data-consent="marketing"] input');
    expect(data).toBeInstanceOf(HTMLInputElement);
    expect(marketing).toBeInstanceOf(HTMLInputElement);
    expect(data).not.toBe(marketing);
    expect(data).toHaveAttribute('type', 'checkbox');
    expect(marketing).toHaveAttribute('type', 'checkbox');
    expect(data).not.toBeChecked();
    expect(marketing).not.toBeChecked();
    expect(data).not.toHaveAttribute('checked');
    expect(marketing).not.toHaveAttribute('checked');
  });

  it('FRM-09 · enlace visible a privacidad junto a la casilla de datos', () => {
    const { container } = render(<ContactForm />);
    const data = container.querySelector('[data-consent="data"]');
    const link = screen.getByRole('link', { name: CONTACT_SCENE.copy.consentData.link });
    const box = screen.getByRole('checkbox', { name: consentDataSentence() });
    expect(data).toBeInstanceOf(HTMLElement);
    if (!(data instanceof HTMLElement)) return;
    expect(data).toContainElement(link);
    expect(link).toHaveAttribute('href', CONTACT_SCENE.privacyHref);
    expect(container.querySelector('[data-consent="marketing"]')).not.toContainElement(link);
    expect(data).toHaveTextContent(consentDataSentence());
    expect(data.textContent.match(/política de privacidad/gi)).toHaveLength(1);
    expect(link.closest('label')).toBeNull();
    expect(box).not.toBeChecked();
  });

  it('FRM-10 · el interés principal llega preseleccionado desde el vehículo', () => {
    render(<ContactForm initialInterest="equities" />);
    expect(screen.getByLabelText(CONTACT_SCENE.copy.interest)).toHaveValue('equities');
  });

  it('FRM-10 · un interés vacío sigue el vehículo vivo', () => {
    const { rerender } = render(<ContactForm />);
    expect(screen.getByLabelText(CONTACT_SCENE.copy.interest)).toHaveValue('');
    rerender(<ContactForm initialInterest="equities" />);
    expect(screen.getByLabelText(CONTACT_SCENE.copy.interest)).toHaveValue('equities');
  });

  it('FRM-10 · la elección del visitante gana al vehículo vivo', () => {
    const { rerender } = render(<ContactForm initialInterest="equities" />);
    fireEvent.change(screen.getByLabelText(CONTACT_SCENE.copy.interest), {
      target: { value: 'development' },
    });
    rerender(<ContactForm initialInterest="real-estate" />);
    expect(screen.getByLabelText(CONTACT_SCENE.copy.interest)).toHaveValue('development');
  });

  it('FRM-11 · el contexto del simulador se muestra y no viaja oculto', () => {
    const { container } = render(
      <ContactForm
        simulatorContext={[
          { label: CONTACT_SCENE.copy.capital, value: '150.000' },
          { label: CONTACT_SCENE.copy.horizon, value: '8' },
          { label: CONTACT_SCENE.copy.scenario, value: 'Conservador' },
          { label: CONTACT_SCENE.copy.vehicle, value: 'al pozo' },
        ]}
      />,
    );
    const context = container.querySelector('[data-simulator-context]');
    expect(context).not.toBeNull();
    expect(context).toHaveTextContent(CONTACT_SCENE.copy.simulatorContext);
    expect(context).toHaveTextContent('150.000');
    expect(context).toHaveTextContent('8');
    expect(context?.querySelector('input[type="hidden"]')).toBeNull();
    expect(container.querySelector('input[type="hidden"]')).toBeNull();
  });

  it('FRM-16 · no hay CAPTCHA visible', () => {
    const { container } = render(<ContactForm />);
    expect(container.textContent).not.toMatch(/captcha|recaptcha|hcaptcha/i);
    expect(container.querySelector('iframe')).toBeNull();
    expect(container.querySelector('[data-honeypot]')).not.toBeNull();
  });

  it('FRM-17 · campos etiquetados, operables y errores anunciados en su control', () => {
    render(<ContactForm />);
    fireEvent.change(screen.getByLabelText(CONTACT_SCENE.copy.fullName), {
      target: { value: '' },
    });
    submit();
    const name = screen.getByLabelText(CONTACT_SCENE.copy.fullName);
    const describedBy = name.getAttribute('aria-describedby');
    expect(name).toHaveAttribute('aria-invalid', 'true');
    expect(describedBy).toBeTruthy();
    expect(describedBy ? document.getElementById(describedBy) : null).toHaveTextContent(
      CONTACT_SCENE.errors.required,
    );
    expect(describedBy ? document.getElementById(describedBy) : null).toHaveAttribute(
      'role',
      'alert',
    );
    expect(screen.getByLabelText(CONTACT_SCENE.copy.email)).toBeEnabled();
    expect(screen.getByLabelText(CONTACT_SCENE.copy.phoneNational)).toBeEnabled();
    expect(screen.getByLabelText(CONTACT_SCENE.copy.taxResidence)).toBeEnabled();
    expect(screen.getByLabelText(CONTACT_SCENE.copy.interest)).toBeEnabled();
    expect(screen.getByLabelText(CONTACT_SCENE.copy.capitalBand)).toBeEnabled();
    expect(screen.getByLabelText(CONTACT_SCENE.copy.message)).toBeEnabled();
    expect(screen.getByRole('checkbox', { name: /He leído y acepto/ })).toBeEnabled();
    expect(
      screen.getByRole('checkbox', { name: CONTACT_SCENE.copy.consentMarketing }),
    ).toBeEnabled();
    expect(screen.queryByRole('textbox', { name: 'Empresa' })).toBeNull();
    expect(document.querySelector('[data-honeypot] input')).toHaveAttribute('tabIndex', '-1');
  });

  it('FRM-06 · honeypot relleno se descarta sin errores visibles', () => {
    const { container } = render(<ContactForm />);
    fillValid();
    const honey = container.querySelector('[data-honeypot] input');
    expect(honey).toBeInstanceOf(HTMLInputElement);
    if (!(honey instanceof HTMLInputElement)) return;
    fireEvent.change(honey, { target: { value: 'http://spam.test' } });
    submit();
    expect(container.querySelector('[data-error]')).toBeNull();
  });

  it('D6 · el cuarto envío válido pide esperar', () => {
    render(<ContactForm />);
    fillValid();
    for (let i = 0; i < RATE_MAX; i += 1) submit();
    expect(screen.queryByText(CONTACT_SCENE.copy.rateLimited)).toBeNull();
    submit();
    expect(screen.getByRole('alert')).toHaveTextContent(CONTACT_SCENE.copy.rateLimited);
  });

  it('FRM-18 · axe sin violaciones bloqueantes', async () => {
    const { container } = render(<ContactForm />);
    await expectNoBlockingAxeViolations(container);
  });
});

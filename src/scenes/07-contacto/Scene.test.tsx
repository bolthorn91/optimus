import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PENDING_LABEL } from '@/components/PendingValue';
import { CONTACT } from '@/content/contact';
import { CONTACT_SCENE } from '@/scenes/07-contacto/content';
import { ContactScene } from '@/scenes/07-contacto/Scene';
import { expectNoBlockingAxeViolations } from '@/test/axe';

describe('ContactScene', () => {
  it('FRM-19 · teléfonos y dominio son PendingValue, sin cifras plausibles', () => {
    const { container } = render(<ContactScene />);
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
    expect(container).not.toHaveTextContent('+34');
    expect(container).not.toHaveTextContent('+54');
    expect(container).not.toHaveTextContent('optimvs.cp.com');
    expect(container).not.toHaveTextContent(/\d{3}\s?\d{3}/);
  });

  it('axe sin violaciones bloqueantes', async () => {
    const { container } = render(<ContactScene />);
    await expectNoBlockingAxeViolations(container);
  });
});

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ActCta } from '@/components/ActCta';

describe('ActCta', () => {
  it('expone la acción como nombre accesible y conserva el enlace y el tracking', () => {
    render(<ActCta href="/contacto?capital=100000" label="Analice su caso con un consultor" />);

    const link = screen.getByRole('link', { name: 'Analice su caso con un consultor' });
    expect(link).toHaveAttribute('href', '/contacto?capital=100000');
    expect(link).toHaveAttribute('data-track', 'cta');
    expect(link).toHaveAttribute('data-track-position', 'act');
    expect(link.querySelector('.act-cta__eyebrow')).toHaveAttribute('aria-hidden', 'true');
    expect(link.querySelector('.act-cta__arrow')).toHaveAttribute('aria-hidden', 'true');
  });

  it('la variante compacta no añade la micro-etiqueta y conserva el tracking de vehículo', () => {
    render(
      <ActCta
        href="/contacto?vehiculo=real-estate"
        label="Reservar sesión privada"
        position="vehicle"
        variant="compact"
      />,
    );

    const link = screen.getByRole('link', { name: 'Reservar sesión privada' });
    expect(link).toHaveClass('act-cta--compact');
    expect(link).toHaveAttribute('data-track-position', 'vehicle');
    expect(link.querySelector('.act-cta__eyebrow')).toBeNull();
  });
});

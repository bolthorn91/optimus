import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PALETTE, RISK_SCALE } from '@/lib/tokens';
import { DesignPage } from '@/pages/DesignPage';
import { expectNoBlockingAxeViolations } from '@/test/axe';

describe('página de muestra del sistema de diseño', () => {
  // FND-12
  it('FND-12 · no tiene violaciones de accesibilidad bloqueantes', async () => {
    const { container } = render(<DesignPage />);

    await expectNoBlockingAxeViolations(container);
  });

  it('tiene un solo h1 y la jerarquía de encabezados no salta niveles', () => {
    render(<DesignPage />);

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);

    const niveles = screen.getAllByRole('heading').map((h) => Number(h.tagName.replace('H', '')));

    for (const [i, nivel] of niveles.entries()) {
      if (i === 0) continue;
      const previo = niveles[i - 1];
      expect(previo).toBeDefined();
      expect(nivel).toBeLessThanOrEqual((previo ?? 1) + 1);
    }
  });

  it('exhibe la paleta y la escala de riesgo completas', () => {
    render(<DesignPage />);

    // getAllBy y no getBy: los identificadores de país reutilizan tokens de la paleta y de la
    // escala de riesgo, así que algunos hexadecimales salen legítimamente más de una vez.
    for (const hex of [...Object.values(PALETTE), ...Object.values(RISK_SCALE)]) {
      expect(screen.getAllByText(hex).length).toBeGreaterThanOrEqual(1);
    }
  });

  it('cada sección está etiquetada por su encabezado', () => {
    render(<DesignPage />);
    const secciones = screen.getAllByRole('region');

    expect(secciones.length).toBeGreaterThanOrEqual(4);
    for (const seccion of secciones) {
      expect(seccion).toHaveAccessibleName();
    }
  });

  it('no renderiza contenido del dossier: solo relleno marcado (decisión C5)', () => {
    const { container } = render(<DesignPage />);
    const texto = container.textContent;

    expect(texto).toMatch(/relleno/i);
    expect(texto).not.toMatch(/Proteja su patrimonio/);
    expect(texto).not.toMatch(/Reserve su sesión/);
    expect(texto).not.toMatch(/nuevo Occidente/);
  });

  it('el marcador de dato pendiente no muestra ningún teléfono plausible (I2)', () => {
    const { container } = render(<DesignPage />);
    const texto = container.textContent;

    expect(container.querySelector('[data-pending]')).toBeInTheDocument();
    expect(texto).not.toMatch(/\+34\s*\d/);
    expect(texto).not.toMatch(/\+54\s*\d/);
  });

  it('renderiza el disclaimer financiero (I7)', () => {
    render(<DesignPage />);
    expect(screen.getAllByRole('note').length).toBeGreaterThanOrEqual(1);
  });
});

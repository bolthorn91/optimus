import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ACT2 } from '@/scenes/02-seguridad-global/content';
import { Act2Scene } from '@/scenes/02-seguridad-global/Scene';
import { expectNoBlockingAxeViolations } from '@/test/axe';

describe('Act2Scene', () => {
  it('monta entradilla, leyenda y tabla con los literales del dossier', () => {
    render(<Act2Scene />);
    expect(screen.getByRole('heading', { level: 2, name: /Seguridad global/ })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: ACT2.headingVulnerable }),
    ).toBeInTheDocument();
    for (const paragraph of ACT2.intro) {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    }
    expect(screen.getByRole('list', { name: ACT2.copy.legendTitle })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: ACT2.copy.tableCaption })).toBeInTheDocument();
  });

  // MAP-09
  it('MAP-09 · los cuatro períodos se alcanzan con Tab y se activan con Enter y Espacio', () => {
    const { container } = render(<Act2Scene />);
    expect(screen.getAllByRole('button')).toHaveLength(4);
    for (const period of ACT2.periods) {
      const button = screen.getByRole('button', { name: period.shortLabel });
      expect(button).toHaveAttribute('type', 'button');
      expect(button.tabIndex).toBeGreaterThanOrEqual(0);
      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-pressed', 'true');
      expect(container.querySelector('[data-risk-map] title')).toHaveTextContent(period.label);
    }
  });

  // MAP-10
  it('MAP-10 · el período 2050 se marca como proyección, no como dato', () => {
    const { container } = render(<Act2Scene />);
    fireEvent.click(screen.getByRole('button', { name: /2050/ }));
    expect(container.querySelector('[data-risk-map] title')).toHaveTextContent('PROYECCIÓN 2050');
    expect(container.querySelector('.risk-map__projection')).toHaveTextContent(
      ACT2.copy.projectionNote,
    );
    expect(container.querySelector('[data-risk-map] desc')).toHaveTextContent(
      ACT2.copy.projectionNote,
    );
  });

  // MAP-11
  it('MAP-11 · no tiene violaciones de accesibilidad bloqueantes', async () => {
    const { container } = render(<Act2Scene />);
    await expectNoBlockingAxeViolations(container);
  });
});

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ProcessDiagram } from './ProcessDiagram';
import { ProcessStepList } from './ProcessStepList';

const STEPS = [
  { id: 'uno', title: 'Primer paso', body: 'Explicación del primer paso.' },
  { id: 'dos', title: 'Segundo paso', body: 'Explicación del segundo paso.' },
] as const;

function draw() {
  return render(
    <ProcessDiagram
      drawProgress={[1, 1]}
      orientation="vertical"
      stepGlow={[1, 1]}
      stepLabel="Paso"
      steps={STEPS}
    />,
  );
}

describe('ProcessDiagram', () => {
  it('recorta el trazo antes del centro de cada nodo', () => {
    const { container } = draw();
    const path = container.querySelector('path[data-process-stroke]');

    expect(path).not.toBeNull();
    expect(path?.getAttribute('d')).toBe('M 140 108 L 140 892');
  });

  it('muestra el título y el cuerpo del paso al pasar por el punto', () => {
    const { container } = draw();
    const first = container.querySelector('[data-process-node="0"]');

    expect(first).not.toBeNull();
    if (!first) return;
    fireEvent.mouseEnter(first);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Paso 1');
    expect(tooltip).toHaveTextContent(STEPS[0].title);
    expect(tooltip).toHaveTextContent(STEPS[0].body);
  });

  it('retira la explicación al salir del diagrama', () => {
    const { container } = draw();
    const first = container.querySelector('[data-process-node="0"]');
    const wrap = container.querySelector('.process-diagram-wrap');

    if (!first || !wrap) return;
    fireEvent.mouseEnter(first);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    fireEvent.mouseLeave(wrap);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});

describe('ProcessStepList', () => {
  it('mantiene solo el cuerpo del paso activo a la vista', () => {
    const { container } = render(<ProcessStepList stepLabel="Paso" steps={STEPS} />);
    const first = container.querySelector('[data-process-step="uno"]');
    const second = container.querySelector('[data-process-step="dos"]');

    expect(first).toHaveTextContent(STEPS[0].body);
    expect(second).toHaveTextContent(STEPS[1].body);
    expect(screen.getByText(STEPS[0].body)).not.toHaveAttribute('hidden');
    expect(screen.getByText(STEPS[1].body)).toHaveAttribute('hidden');

    fireEvent.click(screen.getByRole('button', { name: /Paso 2/ }));

    expect(screen.getByText(STEPS[0].body)).toHaveAttribute('hidden');
    expect(screen.getByText(STEPS[1].body)).not.toHaveAttribute('hidden');
  });
});

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CountUp } from '@/components/CountUp';
import { DISCLAIMER_TEXT, Disclaimer } from '@/components/Disclaimer';
import { DualFigure } from '@/components/DualFigure';
import { PENDING_LABEL, PendingValue } from '@/components/PendingValue';
import { PullQuote } from '@/components/PullQuote';
import { RomanNumeral } from '@/components/RomanNumeral';
import { StatFigure } from '@/components/StatFigure';
import { NBSP, formatDensity, formatNumber, formatPercent } from '@/lib/format';

/**
 * Testing Library normaliza los espacios al comparar texto, así que el espacio duro llega como
 * espacio normal. Es lo correcto —un usuario no los distingue— y por eso la garantía del NBSP
 * se comprueba a nivel de cadena en `src/lib/format.test.ts`, no aquí.
 */
const visible = (text: string) => text.replaceAll(NBSP, ' ');

describe('RomanNumeral', () => {
  // FND-09
  it('FND-09 · renderiza IV con aria-label 4 y lang latino', () => {
    render(<RomanNumeral value={4} />);
    const el = screen.getByLabelText('4');

    expect(el).toHaveTextContent('IV');
    expect(el).toHaveAttribute('lang', 'la');
  });

  it('en modo decorativo lo oculta al lector de pantalla', () => {
    const { container } = render(<RomanNumeral decorative value={7} />);
    const el = container.querySelector('span');

    expect(el).toHaveTextContent('VII');
    expect(el).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByLabelText('7')).not.toBeInTheDocument();
  });

  it('propaga el RangeError de toRoman: un acto 0 es un error de programación', () => {
    expect(() => render(<RomanNumeral value={0} />)).toThrow(RangeError);
  });
});

describe('DualFigure', () => {
  it('muestra el arábigo como valor y el romano como marca oculta', () => {
    const { container } = render(<DualFigure suffix="%" value={14} />);

    expect(container).toHaveTextContent(visible(`14${NBSP}%`));
    expect(container.querySelector('[aria-hidden="true"]')).toHaveTextContent('XIV');
  });

  it('omite el romano fuera del rango que admite', () => {
    const { container } = render(<DualFigure value={13243219} />);

    expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
    expect(container).toHaveTextContent(formatNumber(13243219));
  });

  it('permite desactivar el romano de forma explícita', () => {
    const { container } = render(<DualFigure roman={false} value={14} />);
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
  });

  it('expone las marcas de las que depende su jerarquía visual', () => {
    const { container } = render(<DualFigure value={14} />);

    expect(container.querySelector('[data-dual-figure]')).toBeInTheDocument();
    expect(container.querySelector('[data-dual-figure] > [aria-hidden="true"]')).toHaveTextContent(
      'XIV',
    );
    expect(container.querySelector('[data-dual-figure-value]')).toHaveTextContent('14');
  });
});

describe('CountUp', () => {
  // FND-10
  it('FND-10 · el valor final está en el DOM aunque el progreso sea 0', () => {
    render(<CountUp format={formatDensity} progress={0} to={96.05} />);

    expect(screen.getByText(visible(formatDensity(96.05)))).toBeInTheDocument();
  });

  it('sin progreso muestra directamente el valor final', () => {
    const { container } = render(<CountUp format={formatPercent} to={14} />);
    expect(container).toHaveTextContent(visible(`14${NBSP}%`));
  });

  it('interpola el valor visible según el progreso', () => {
    const { container } = render(
      <CountUp format={(n) => formatNumber(n)} from={0} progress={0.5} to={100} />,
    );

    expect(container.querySelector('[aria-hidden="true"]')).toHaveTextContent('50');
  });

  it('acota el progreso fuera de rango en vez de extrapolar', () => {
    const { container } = render(
      <CountUp format={(n) => formatNumber(n)} progress={-3} to={100} />,
    );
    expect(container.querySelector('[aria-hidden="true"]')).toHaveTextContent('0');
  });

  it('cierra en el valor exacto con progreso 1, sin residuo de coma flotante', () => {
    const { container } = render(<CountUp format={formatDensity} progress={1} to={96.05} />);
    expect(container.querySelector('[aria-hidden="true"]')).toHaveTextContent(
      visible(formatDensity(96.05)),
    );
  });
});

describe('StatFigure', () => {
  it('rinde la cifra con su glosa y su fuente', () => {
    render(<StatFigure label="del PIB nacional" source="dossier §I" value="14 %" />);

    expect(screen.getByText('14 %')).toBeInTheDocument();
    expect(screen.getByText(/del PIB nacional/)).toBeInTheDocument();
    expect(screen.getByText(/dossier §I/)).toBeInTheDocument();
  });

  it('omite la fuente cuando no se pasa', () => {
    render(<StatFigure label="sin origen" value="1" />);
    expect(screen.queryByText(/Fuente:/)).not.toBeInTheDocument();
  });

  it('expone las marcas de las que depende su estilo', () => {
    const { container } = render(<StatFigure label="glosa" value="1" />);

    expect(container.querySelector('[data-stat-figure]')).toBeInTheDocument();
    expect(container.querySelector('[data-stat-value]')).toHaveTextContent('1');
  });
});

describe('PullQuote', () => {
  it('rinde la cita y su atribución', () => {
    render(<PullQuote cite="Carlos Carbajal">el nuevo Occidente</PullQuote>);

    expect(screen.getByText('el nuevo Occidente')).toBeInTheDocument();
    expect(screen.getByText('Carlos Carbajal')).toBeInTheDocument();
  });

  it('omite el pie cuando no hay atribución', () => {
    const { container } = render(<PullQuote>sin atribuir</PullQuote>);
    expect(container.querySelector('figcaption')).toBeNull();
  });

  it('expone la marca de la que depende su estilo', () => {
    const { container } = render(<PullQuote>cita</PullQuote>);
    expect(container.querySelector('[data-pull-quote]')).toBeInTheDocument();
  });
});

describe('Disclaimer', () => {
  it('renderiza siempre el mismo texto canónico', () => {
    const { rerender, container } = render(<Disclaimer variant="footer" />);
    const footer = container.textContent;

    rerender(<Disclaimer variant="inline" />);

    expect(container.textContent).toBe(footer);
    expect(container).toHaveTextContent(DISCLAIMER_TEXT);
  });

  it('menciona el riesgo de pérdida y niega ser asesoramiento', () => {
    render(<Disclaimer variant="inline" />);

    expect(screen.getByRole('note')).toHaveTextContent(/pérdida del capital/);
    expect(screen.getByRole('note')).toHaveTextContent(/no constituye asesoramiento/);
  });

  it('marca su variante para que el estilo la distinga', () => {
    const { container } = render(<Disclaimer variant="inline" />);
    expect(container.querySelector('[data-disclaimer="inline"]')).toBeInTheDocument();
  });
});

describe('PendingValue', () => {
  // FND-11
  it('FND-11 · renderiza un marcador visible, no un valor plausible', () => {
    const { container } = render(<PendingValue debtId="B-01" label="Teléfono España" />);

    expect(container).toHaveTextContent('Teléfono España');
    expect(container).toHaveTextContent(PENDING_LABEL);
    expect(container).not.toHaveTextContent(/\+34/);
    expect(container).not.toHaveTextContent(/\+54/);
  });

  it('FND-11 · deja rastro de la fila de deuda que lo registra', () => {
    const { container } = render(<PendingValue debtId="B-02" label="Dominio" />);
    expect(container.querySelector('[data-debt-id="B-02"]')).toBeInTheDocument();
  });

  it('es localizable en el DOM por su marca, para auditarlo de golpe', () => {
    const { container } = render(<PendingValue debtId="B-05" label="CIF" />);
    expect(container.querySelectorAll('[data-pending]')).toHaveLength(1);
  });
});

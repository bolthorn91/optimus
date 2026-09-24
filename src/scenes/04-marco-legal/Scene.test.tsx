import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DISCLAIMER_TEXT } from '@/components/Disclaimer';
import { formatArea, NBSP } from '@/lib/format';
import { AnchorStat } from '@/scenes/04-marco-legal/AnchorStat';
import { ACT4 } from '@/scenes/04-marco-legal/content';
import { Act4Scene } from '@/scenes/04-marco-legal/Scene';

const visible = (text: string) => text.replaceAll(NBSP, ' ');
const CANON = readFileSync(
  resolve(process.cwd(), 'content/secciones/04-estrategia-anticipatoria.md'),
  'utf8',
);
const TABLES = readFileSync(resolve(process.cwd(), 'content/03-datos-y-tablas.md'), 'utf8');
const FIGURE = visible(formatArea(ACT4.anchorStat.hectares, 'ha'));

describe('Act4Scene', () => {
  it('monta la entradilla, los factores y el CTA', () => {
    render(<Act4Scene />);
    expect(screen.getByText(ACT4.intro)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: new RegExp(ACT4.title, 'i') })).toBeInTheDocument();
    expect(ACT4.whyArgentina.factors).toHaveLength(8);
    for (const factor of ACT4.whyArgentina.factors) {
      expect(screen.getByText(factor.name)).toBeInTheDocument();
      expect(screen.getByText(factor.detail)).toBeInTheDocument();
    }
    const cta = screen.getByRole('link', { name: ACT4.cta.label });
    expect(cta).toHaveAttribute('href', ACT4.cta.href);
  });

  it('CDI-05 · la ol con los cinco pasos completos está en el DOM', () => {
    const { container } = render(<Act4Scene />);
    const list = container.querySelector('[data-fiscal] ol');
    expect(list).not.toBeNull();
    expect(list?.tagName).toBe('OL');
    const items = container.querySelectorAll('[data-cdi-step]');
    expect(items).toHaveLength(5);
    for (const step of ACT4.cdiSteps) {
      const item = container.querySelector(`[data-cdi-step="${String(step.index)}"]`);
      expect(item).toHaveTextContent(step.title);
      expect(item).toHaveTextContent(step.body);
    }
  });

  it('CDI-08 · el dato ancla cierra en 13.243.219 ha con la equivalencia en el mismo bloque', () => {
    const { container } = render(<Act4Scene />);
    const block = container.querySelector('[data-anchor-stat]');
    expect(block).not.toBeNull();
    expect(block).toHaveTextContent(FIGURE);
    expect(block).toHaveTextContent(ACT4.anchorStat.equivalence);
    expect(block).toHaveTextContent(ACT4.areas.reference.label);
    render(
      <AnchorStat
        equivalence={ACT4.anchorStat.equivalence}
        hectares={ACT4.anchorStat.hectares}
        label={ACT4.anchorStat.label}
        progress={1}
        source={ACT4.anchorStat.source}
      />,
    );
    expect(screen.getAllByText(FIGURE).length).toBeGreaterThan(0);
  });

  it('CDI-09 · con progress 0 la cifra final ya está en el DOM', () => {
    const { container } = render(
      <AnchorStat
        equivalence={ACT4.anchorStat.equivalence}
        hectares={ACT4.anchorStat.hectares}
        label={ACT4.anchorStat.label}
        progress={0}
        source={ACT4.anchorStat.source}
      />,
    );
    expect(container.querySelector('.visually-hidden')).toHaveTextContent(FIGURE);
    expect(container.querySelector('[aria-hidden="true"]')?.textContent).not.toBe(FIGURE);
  });

  it('CDI-10 · el marco fiscal y las garantías llevan Disclaimer inline', () => {
    const { container } = render(<Act4Scene />);
    const fiscal = container.querySelector('[data-fiscal] [data-disclaimer="inline"]');
    const guarantees = container.querySelector('[data-guarantees] [data-disclaimer="inline"]');
    expect(fiscal).not.toBeNull();
    expect(guarantees).not.toBeNull();
    expect(fiscal).toHaveTextContent(DISCLAIMER_TEXT);
    expect(guarantees).toHaveTextContent(DISCLAIMER_TEXT);
  });

  it('CDI-11 · la aclaración de Capital Protegido es explícita', () => {
    render(<Act4Scene />);
    expect(screen.getByText(ACT4.capitalProtectionNote)).toBeInTheDocument();
    expect(ACT4.capitalProtectionNote).toMatch(/titularidad registral del activo/i);
    expect(ACT4.capitalProtectionNote).toMatch(/no el valor de la inversión/i);
  });

  it('CDI-12 · las cuatro garantías tienen pilar y mecanismo literales', () => {
    const { container } = render(<Act4Scene />);
    expect(ACT4.guarantees.pillars).toHaveLength(4);
    for (const item of ACT4.guarantees.pillars) {
      const card = container.querySelector(`[data-guarantee="${String(item.index)}"]`);
      expect(card).toHaveTextContent(item.pillar);
      expect(card).toHaveTextContent(item.mechanism);
    }
  });

  it('CDI-15 · los cinco pasos y las cuatro garantías coinciden con content/', () => {
    const compact = (value: string) => value.replace(/\s+/g, ' ');
    const canon = compact(CANON.replaceAll(/^> ?/gm, ''));
    render(<Act4Scene />);
    for (const step of ACT4.cdiSteps) {
      expect(canon).toContain(step.body);
    }
    for (const item of ACT4.guarantees.pillars) {
      expect(canon).toContain(item.pillar);
      expect(canon).toContain(item.mechanism);
    }
    for (const paragraph of ACT4.fiscal.paragraphs) {
      expect(canon).toContain(compact(paragraph));
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    }
    for (const paragraph of ACT4.guarantees.intro) {
      expect(canon).toContain(compact(paragraph));
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    }
    expect(canon).toContain('garantizando máxima seguridad jurídica');
    expect(CANON).toContain('elimina de raíz');
    expect(CANON).toContain('jamás se tributen dos veces');
    expect(TABLES).toContain('13.243.219');
    expect(ACT4.anchorStat.hectares).toBe(13243219);
    expect(screen.getByText(`Fuente: ${ACT4.anchorStat.source}`)).toBeInTheDocument();
  });

  it('CDI-16 · la conversión derivada a km² no se publica', () => {
    const { container } = render(<Act4Scene />);
    expect(container.textContent).not.toContain('132.432,19');
    expect(container.textContent).not.toContain('132432,19');
    expect(container.textContent).not.toContain('4,76');
    expect(JSON.stringify(ACT4)).not.toContain('132.432,19');
    expect(JSON.stringify(ACT4)).not.toContain('4.76');
  });
});

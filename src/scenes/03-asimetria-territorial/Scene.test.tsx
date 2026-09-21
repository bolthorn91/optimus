import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { formatArea, formatDensity, formatNumber, NBSP } from '@/lib/format';
import { ACT3 } from '@/scenes/03-asimetria-territorial/content';
import { Act3Scene } from '@/scenes/03-asimetria-territorial/Scene';
import { expectNoBlockingAxeViolations } from '@/test/axe';

const visible = (text: string) => text.replaceAll(NBSP, ' ');

describe('Act3Scene', () => {
  it('monta la entradilla, el modelo territorial y el diagrama', () => {
    render(<Act3Scene />);
    expect(screen.getByText(ACT3.intro.europe)).toBeInTheDocument();
    expect(screen.getByText(ACT3.intro.southAmerica)).toBeInTheDocument();
    expect(screen.getByText(ACT3.territorialModel.spain)).toBeInTheDocument();
    expect(screen.getByText(ACT3.territorialModel.argentina)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: new RegExp(ACT3.copy.modelTitle) })).toBeInTheDocument();
    expect(screen.getByText(ACT3.copy.modelNode)).toBeInTheDocument();
  });

  // CMP-01
  it('CMP-01 · España y Argentina se identifican por etiqueta, no solo por color', () => {
    render(<Act3Scene />);
    const tables = screen.getAllByRole('table');
    expect(tables.length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('columnheader', { name: /España/ }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('columnheader', { name: /Argentina/ }).length).toBeGreaterThan(0);
  });

  // CMP-02
  it('CMP-02 · la comparativa territorial tiene las seis cifras en formato español', () => {
    const [spain, argentina] = ACT3.countries;
    render(<Act3Scene />);
    const table = screen.getByRole('table', { name: ACT3.copy.territorialCaption });
    expect(table).toHaveTextContent(visible(formatArea(spain.areaKm2, 'km²')));
    expect(table).toHaveTextContent(visible(formatArea(argentina.areaKm2, 'km²')));
    expect(table).toHaveTextContent(visible(formatNumber(spain.population)));
    expect(table).toHaveTextContent(visible(formatNumber(argentina.population)));
    expect(table).toHaveTextContent(visible(formatDensity(spain.densityPerKm2)));
    expect(table).toHaveTextContent(visible(formatDensity(argentina.densityPerKm2)));
  });

  // CMP-03
  it('CMP-03 · la comparativa bursátil tiene las nueve filas literales', () => {
    render(<Act3Scene />);
    const table = screen.getByRole('table', { name: ACT3.copy.marketCaption });
    expect(ACT3.market).toHaveLength(9);
    for (const row of ACT3.market) {
      expect(table).toHaveTextContent(row.criterion);
      if (row.spain !== ACT3.copy.emptyCell) expect(table).toHaveTextContent(row.spain);
      if (row.argentina !== ACT3.copy.emptyCell) expect(table).toHaveTextContent(row.argentina);
    }
    expect(table.textContent).toContain(ACT3.copy.emptyCell);
  });

  // CMP-04
  it('CMP-04 · ningún emoji de bandera identifica el país', () => {
    const { container } = render(<Act3Scene />);
    expect(container.textContent).not.toMatch(/🇪🇸|🇦🇷/);
  });

  // CMP-05
  it('CMP-05 · la conclusión reproduce la frase incompleta de E-02', () => {
    render(<Act3Scene />);
    expect(screen.getByText(ACT3.conclusion)).toBeInTheDocument();
    expect(ACT3.conclusion).toContain(
      'la geografía global mantiene a Argentina fuera de riesgo una asimetría territorial única',
    );
  });

  // CMP-06
  it('CMP-06 · las tres ventajas de suelo están con tipo, zonas y ventaja', () => {
    const { container } = render(<Act3Scene />);
    expect(container.querySelectorAll('[data-land-advantage]')).toHaveLength(3);
    for (const item of ACT3.landAdvantages) {
      const card = container.querySelector(`[data-land-advantage="${String(item.index)}"]`);
      expect(card).toHaveTextContent(item.type);
      expect(card).toHaveTextContent(item.zones);
      expect(card).toHaveTextContent(item.advantage);
    }
  });

  // CMP-07
  it('CMP-07 · no tiene violaciones de accesibilidad bloqueantes y las tablas tienen encabezados', async () => {
    const { container } = render(<Act3Scene />);
    await expectNoBlockingAxeViolations(container);
    for (const table of screen.getAllByRole('table')) {
      expect(table.querySelectorAll('th[scope="col"]').length).toBeGreaterThanOrEqual(2);
      expect(table.querySelectorAll('th[scope="row"]').length).toBeGreaterThan(0);
    }
  });

  // CMP-08
  it('CMP-08 · el CTA intermedio apunta a #contacto', () => {
    render(<Act3Scene />);
    const cta = screen.getByRole('link', { name: ACT3.cta.label });
    expect(cta).toHaveAttribute('href', '#contacto');
  });

  // SAT-09
  it('SAT-09 · sin WebGL se renderiza el fallback con las cifras completas, sin reintentos', () => {
    const { container } = render(<Act3Scene />);
    const fallback = container.querySelector('[data-nightfall-fallback]');
    expect(fallback).not.toBeNull();
    expect(container.querySelector('[data-nightfall-stage]')).toBeNull();
    expect(container.querySelector('canvas')).toBeNull();
    expect(screen.getByText(ACT3.copy.fallbackNote)).toBeInTheDocument();
    expect(screen.getByAltText(ACT3.copy.canvasAlt)).toBeInTheDocument();
    const picture = fallback?.querySelector('picture');
    expect(picture?.querySelector('source')?.getAttribute('type')).toBe('image/webp');
    expect(picture?.querySelector('img')?.getAttribute('src')).toMatch(/\.jpg$/);
    const [spain, argentina] = ACT3.countries;
    expect(fallback).toHaveTextContent(visible(formatArea(spain.areaKm2, 'km²')));
    expect(fallback).toHaveTextContent(visible(formatArea(argentina.areaKm2, 'km²')));
    expect(fallback).toHaveTextContent(visible(formatNumber(spain.population)));
    expect(fallback).toHaveTextContent(visible(formatNumber(argentina.population)));
    expect(fallback).toHaveTextContent(visible(formatDensity(spain.densityPerKm2)));
    expect(fallback).toHaveTextContent(visible(formatDensity(argentina.densityPerKm2)));
    expect(container.querySelectorAll('[data-country-figures]')).toHaveLength(2);
    const stageSource = readFileSync(
      resolve(process.cwd(), 'src/scenes/03-asimetria-territorial/NightfallStage.tsx'),
      'utf8',
    );
    expect(stageSource).not.toMatch(/setInterval/);
    expect(stageSource).toMatch(/useState\(\(\) => detectWebgl\(\)\)/);
  });

  // CMP-09
  it('CMP-09 · las cifras territoriales salen de las mismas instancias que los contadores', () => {
    const [spain, argentina] = ACT3.countries;
    render(<Act3Scene />);
    const table = screen.getByRole('table', { name: ACT3.copy.territorialCaption });
    expect(spain.areaKm2).toBe(505990);
    expect(argentina.areaKm2).toBe(2780400);
    expect(table).toHaveTextContent(visible(formatArea(spain.areaKm2, 'km²')));
    expect(table).toHaveTextContent(visible(formatDensity(spain.densityPerKm2)));
    expect(table).toHaveTextContent(visible(formatDensity(argentina.densityPerKm2)));
  });
});

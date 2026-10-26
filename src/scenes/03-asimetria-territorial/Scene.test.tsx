import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { MOBILE_COPY } from '@/app/mobileCopy';
import { formatArea, formatDensity, formatNumber, NBSP } from '@/lib/format';
import { ScrollTrigger } from '@/motion/gsapSetup';
import { scrollTriggerEnd, SCENE_POLICIES } from '@/motion/responsive';
import { ACT3 } from '@/scenes/03-asimetria-territorial/content';
import { Act3Scene } from '@/scenes/03-asimetria-territorial/Scene';
import { expectNoBlockingAxeViolations } from '@/test/axe';
import * as detectWebgl from '@/three/detectWebgl';

const visible = (text: string) => text.replaceAll(NBSP, ' ');
const nativeMatchMedia = window.matchMedia.bind(window);
const nativeWidth = window.innerWidth;

function setWidth(width: number): void {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
  window.dispatchEvent(new Event('resize'));
}

function reduceMotion(): void {
  window.matchMedia = (query: string) =>
    ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

describe('Act3Scene', () => {
  afterEach(() => {
    window.matchMedia = nativeMatchMedia;
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: nativeWidth });
    vi.restoreAllMocks();
    for (const trigger of ScrollTrigger.getAll()) trigger.kill();
  });

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
  it('CMP-08 · el CTA intermedio apunta a la página de contacto', () => {
    render(<Act3Scene />);
    const cta = screen.getByRole('link', { name: ACT3.cta.label });
    expect(cta).toHaveAttribute('href', '/contacto');
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

  // SAT-06
  it('SAT-06 · las seis cifras están en el DOM desde el primer render', () => {
    const { container } = render(<Act3Scene />);
    const figures = container.querySelectorAll('[data-country-figures]');
    expect(figures).toHaveLength(2);
    const hidden = [...container.querySelectorAll('.visually-hidden')]
      .map((node) => visible(node.textContent))
      .join(' ');
    const [spain, argentina] = ACT3.countries;
    expect(hidden).toContain(visible(formatArea(spain.areaKm2, 'km²')));
    expect(hidden).toContain(visible(formatArea(argentina.areaKm2, 'km²')));
    expect(hidden).toContain(visible(formatNumber(spain.population)));
    expect(hidden).toContain(visible(formatNumber(argentina.population)));
    expect(hidden).toContain(visible(formatDensity(spain.densityPerKm2)));
    expect(hidden).toContain(visible(formatDensity(argentina.densityPerKm2)));
  });

  // SAT-07
  it('SAT-07 · las cifras del nightfall usan el formato español exacto', () => {
    const { container } = render(<Act3Scene />);
    const nightfall = container.querySelector('.act3-nightfall-figures');
    expect(nightfall).toHaveTextContent(visible(formatArea(505990, 'km²')));
    expect(nightfall).toHaveTextContent(visible(formatArea(2780400, 'km²')));
    expect(nightfall).toHaveTextContent(visible(formatDensity(96.05)));
    expect(nightfall).toHaveTextContent(visible(formatDensity(16.51)));
  });

  // SAT-08
  it('SAT-08 · con movimiento reducido no hay canvas y el contenido es completo', () => {
    reduceMotion();
    const { container } = render(<Act3Scene />);
    expect(container.querySelector('canvas')).toBeNull();
    expect(container.querySelector('[data-nightfall-stage]')).toBeNull();
    expect(container.querySelector('[data-nightfall-fallback]')).not.toBeNull();
    expect(ScrollTrigger.getAll()).toEqual([]);
    expect(screen.getByRole('table', { name: ACT3.copy.territorialCaption })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: ACT3.copy.marketCaption })).toBeInTheDocument();
    expect(screen.getByText(ACT3.conclusion)).toBeInTheDocument();
    const [spain, argentina] = ACT3.countries;
    const nightfall = container.querySelector('.act3-nightfall-figures');
    expect(nightfall).toHaveTextContent(visible(formatArea(spain.areaKm2, 'km²')));
    expect(nightfall).toHaveTextContent(visible(formatDensity(argentina.densityPerKm2)));
    const scene = container.querySelector('#territorio');
    expect(scene).toBeInstanceOf(HTMLElement);
    expect((scene as HTMLElement).classList.contains('on-navy')).toBe(true);
    expect((scene as HTMLElement).dataset.chrome).toBe('released');
    expect(document.documentElement.style.getPropertyValue('--doc-surface')).toBe(
      'var(--color-navy-ink)',
    );
    expect(document.documentElement.style.getPropertyValue('--doc-ink')).toBe('var(--color-ivory)');
  });

  it('D1 · de día la tinta es navy y el documento cede el par M8', () => {
    const { container, unmount } = render(<Act3Scene />);
    const scene = container.querySelector('#territorio');
    expect(scene).toBeInstanceOf(HTMLElement);
    expect((scene as HTMLElement).classList.contains('on-navy')).toBe(false);
    expect((scene as HTMLElement).classList.contains('on-light')).toBe(true);
    expect((scene as HTMLElement).dataset.chrome).toBe('day');
    expect(document.documentElement.style.getPropertyValue('--doc-ink')).toBe('var(--color-ivory)');
    expect(document.documentElement.style.getPropertyValue('--doc-surface')).toBe(
      'var(--color-navy-ink)',
    );
    const css = readFileSync(
      resolve(process.cwd(), 'src/scenes/03-asimetria-territorial/scene.css'),
      'utf8',
    );
    expect(css).toMatch(/#territorio\[data-chrome='day'\]/);
    expect(css).toMatch(/--doc-ink:\s*var\(--color-navy-ink\)/);
    unmount();
  });

  it('ancla 100svh con scrub y distancia de pin en píxeles', () => {
    expect(SCENE_POLICIES.territorio.desktopHeight).toBe('600vh');
    expect(scrollTriggerEnd('600vh', 1000)).toBe('+=5000px');
    const source = readFileSync(
      resolve(process.cwd(), 'src/scenes/03-asimetria-territorial/Scene.tsx'),
      'utf8',
    );
    expect(source).toMatch(/sceneId: 'territorio'/);
  });

  // SAT-10
  it('SAT-10 · desmontar deja cero ScrollTrigger y dispone el compositor WebGL', () => {
    const { container, unmount } = render(<Act3Scene />);
    expect(ScrollTrigger.getAll().length).toBeGreaterThan(0);
    unmount();
    expect(ScrollTrigger.getAll()).toEqual([]);
    expect(container.querySelector('canvas')).toBeNull();
    const canvasSource = readFileSync(
      resolve(process.cwd(), 'src/scenes/03-asimetria-territorial/NightfallCanvas.tsx'),
      'utf8',
    );
    expect(canvasSource).toMatch(/composer\.dispose\(\)/);
  });

  // SAT-13
  it('SAT-13 · axe sin violaciones bloqueantes; el equivalente del canvas está fuera', async () => {
    const { container } = render(<Act3Scene />);
    await expectNoBlockingAxeViolations(container);
    expect(container.querySelector('canvas')).toBeNull();
    expect(screen.getByAltText(ACT3.copy.canvasAlt)).toBeInTheDocument();
    const lazy = readFileSync(resolve(process.cwd(), 'src/three/LazyCanvas.tsx'), 'utf8');
    expect(lazy).toMatch(/setAttribute\('aria-hidden', 'true'\)/);
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

  it('MOB-06 · a 375 px sirve el fallback estático con las tres cifras y sin WebGL', () => {
    vi.spyOn(detectWebgl, 'detectWebgl').mockReturnValue(true);
    setWidth(375);
    const { container } = render(<Act3Scene />);
    expect(container.querySelector('[data-nightfall-fallback]')).not.toBeNull();
    expect(container.querySelector('[data-nightfall-stage]')).toBeNull();
    expect(container.querySelector('canvas')).toBeNull();
    expect(screen.getByText(MOBILE_COPY.staticSceneNote)).toBeInTheDocument();
    expect(screen.getByAltText(ACT3.copy.canvasAlt)).toBeInTheDocument();
    const [spain, argentina] = ACT3.countries;
    expect(container).toHaveTextContent(visible(formatArea(spain.areaKm2, 'km²')));
    expect(container).toHaveTextContent(visible(formatArea(argentina.areaKm2, 'km²')));
    expect(container).toHaveTextContent(visible(formatNumber(spain.population)));
    expect(container).toHaveTextContent(visible(formatNumber(argentina.population)));
    expect(container).toHaveTextContent(visible(formatDensity(spain.densityPerKm2)));
    expect(container).toHaveTextContent(visible(formatDensity(argentina.densityPerKm2)));
    expect(ScrollTrigger.getAll()).toEqual([]);
  });

  it('MOB-11 · a 375 px las comparativas se apilan con España arriba y sin scroll horizontal', () => {
    setWidth(375);
    const { container } = render(<Act3Scene />);
    expect(screen.queryByRole('table')).toBeNull();
    const stacked = [...container.querySelectorAll('[data-stacked-comparison]')];
    expect(stacked).toHaveLength(2);
    for (const block of stacked) {
      const spain = block.querySelector('[data-side="es"]');
      const argentina = block.querySelector('[data-side="ar"]');
      expect(spain).not.toBeNull();
      expect(argentina).not.toBeNull();
      expect(
        (spain?.compareDocumentPosition(argentina as Node) ?? 0) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    }
    expect(stacked[0]).toHaveTextContent(ACT3.copy.areaLabel);
    expect(stacked[0]?.querySelector('[data-side="es"]')).toHaveTextContent(ACT3.copy.areaLabel);
    expect(stacked[0]?.querySelector('[data-side="ar"]')).toHaveTextContent(ACT3.copy.areaLabel);
    expect(stacked[1]).toHaveTextContent(ACT3.market[0]?.criterion ?? '');
    for (const block of stacked) {
      const node = block as HTMLElement;
      expect(node.scrollWidth).toBeLessThanOrEqual(node.clientWidth);
      expect(getComputedStyle(node).overflowX).not.toMatch(/^(auto|scroll)$/);
    }
  });
});

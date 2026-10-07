import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { App } from '@/app/App';
import { isActRoute, ROUTES, type ActNumber } from '@/app/routes';
import { ACT3_TERRITORIAL_MODEL } from '@/content/acts/act-3';
import { ACT_DETAILS } from '@/content/acts/catalog';
import { ACT1 } from '@/scenes/01-escenario-europeo/content';
import { ACT3 } from '@/scenes/03-asimetria-territorial/content';
import { ACT4 } from '@/scenes/04-marco-legal/content';
import { ACT5 } from '@/scenes/05-activos-simulador/content';
import { ACT67 } from '@/scenes/06-firma/content';
import { expectNoBlockingAxeViolations } from '@/test/axe';

const CANON: Record<ActNumber, string> = {
  1: readFileSync(
    resolve(process.cwd(), 'content/secciones/01-nuevo-escenario-europeo.md'),
    'utf8',
  ),
  2: readFileSync(resolve(process.cwd(), 'content/secciones/02-seguridad-global.md'), 'utf8'),
  3: readFileSync(resolve(process.cwd(), 'content/secciones/03-estado-de-derecho.md'), 'utf8'),
  4: readFileSync(
    resolve(process.cwd(), 'content/secciones/04-estrategia-anticipatoria.md'),
    'utf8',
  ),
  5: readFileSync(resolve(process.cwd(), 'content/secciones/05-nuestra-estrategia.md'), 'utf8'),
  6: readFileSync(resolve(process.cwd(), 'content/secciones/06-estructura-operativa.md'), 'utf8'),
  7: readFileSync(
    resolve(process.cwd(), 'content/secciones/07-asesoramiento-intermediacion.md'),
    'utf8',
  ),
};

const ACT_ROUTES = ROUTES.filter(isActRoute);

function renderAct(path: string) {
  window.history.pushState({}, '', path);
  return render(<App />);
}

function headingLevels(container: HTMLElement): number[] {
  return [...container.querySelectorAll('h1, h2, h3, h4, h5, h6')].map((node) =>
    Number(node.tagName[1]),
  );
}

/** El canon parte las citas con `>` y saltos de línea; el sitio las sirve en un solo párrafo. */
function literalParagraphs(markdown: string): string[] {
  const start = markdown.indexOf('## Contenido literal');
  if (start < 0) return [];
  const afterTitle = markdown.slice(start);
  const nextHeading = afterTitle.indexOf('\n## ', 1);
  const body = nextHeading >= 0 ? afterTitle.slice(0, nextHeading) : afterTitle;
  const paragraphs: string[] = [];
  let current: string[] = [];
  let skipping = false;
  const flush = () => {
    if (current.length === 0) {
      skipping = false;
      return;
    }
    const text = current.join(' ').replace(/\s+/g, ' ').trim();
    current = [];
    skipping = false;
    if (
      text.length > 0 &&
      !text.includes('⚠️') &&
      !text.includes('[Párrafo duplicado') &&
      !text.includes('En web debe')
    ) {
      paragraphs.push(text);
    }
  };
  for (const line of body.split('\n')) {
    if (!line.startsWith('>')) {
      flush();
      continue;
    }
    const text = line.replace(/^>\s?/, '').trim();
    if (
      text.includes('⚠️') ||
      text.includes('[Párrafo duplicado') ||
      text.includes('En web debe')
    ) {
      current = [];
      skipping = true;
      continue;
    }
    if (skipping) continue;
    if (text === '') {
      flush();
      continue;
    }
    current.push(text);
  }
  flush();
  return paragraphs;
}

describe('páginas de acto', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('DET-01 · las siete páginas de acto renderizan el texto completo, no el resumen de la home', () => {
    for (const route of ACT_ROUTES) {
      const { container, unmount } = renderAct(route.path);
      const detail = ACT_DETAILS[route.actNumber];
      for (const section of detail.sections) {
        for (const paragraph of section.paragraphs ?? []) {
          expect(container).toHaveTextContent(paragraph);
        }
      }
      unmount();
    }
    const { container } = renderAct('/escenario-europeo');
    expect(container).toHaveTextContent(ACT1.intro);
    expect(container.querySelector('h1')).toHaveTextContent(ACT1.title);
  });

  it('DET-02 · cada página de acto tiene un solo H1 y no salta de nivel', () => {
    for (const route of ACT_ROUTES) {
      const { container, unmount } = renderAct(route.path);
      const levels = headingLevels(container);
      expect(container.querySelectorAll('h1')).toHaveLength(1);
      expect(levels[0]).toBe(1);
      for (let index = 1; index < levels.length; index += 1) {
        const current = levels[index];
        const previous = levels[index - 1];
        if (current === undefined || previous === undefined) continue;
        expect(current - previous).toBeLessThanOrEqual(1);
      }
      unmount();
    }
  });

  it('DET-03 · las tablas de cada acto se reproducen íntegras', () => {
    const act1 = renderAct('/escenario-europeo');
    expect(act1.container.querySelectorAll('table tbody tr')).toHaveLength(ACT1.factors.length);
    expect(act1.container).toHaveTextContent('Los 3 factores del cambio europeo');
    for (const factor of ACT1.factors) {
      expect(act1.container).toHaveTextContent(factor.title);
      expect(act1.container).toHaveTextContent(factor.body);
    }
    expect(act1.container).toHaveTextContent('14');
    act1.unmount();

    const act2 = renderAct('/seguridad-global');
    expect(act2.container.querySelector('.risk-table')).not.toBeNull();
    expect(act2.container).toHaveTextContent('RIESGO EXTREMO O GUERRA ABIERTA');
    expect(act2.container).toHaveTextContent('América del Sur');
    act2.unmount();

    const act3 = renderAct('/estado-de-derecho');
    expect(act3.container).toHaveTextContent('505.990');
    expect(act3.container).toHaveTextContent('2.780.400');
    expect(act3.container).toHaveTextContent('96,05');
    expect(act3.container).toHaveTextContent('16,51');
    expect(act3.container).toHaveTextContent('IBEX 35');
    expect(act3.container).toHaveTextContent('Comparativa de modelo territorial');
    for (const row of ACT3_TERRITORIAL_MODEL) {
      expect(act3.container).toHaveTextContent(row.criterion);
      expect(act3.container).toHaveTextContent(row.spain);
      expect(act3.container).toHaveTextContent(row.argentina);
    }
    for (const row of ACT3.market) {
      expect(act3.container).toHaveTextContent(row.criterion);
    }
    act3.unmount();

    const act4 = renderAct('/estrategia-anticipatoria');
    expect(act4.container).toHaveTextContent('13.243.219');
    for (const step of ACT4.cdiSteps) {
      expect(act4.container).toHaveTextContent(step.body);
    }
    for (const factor of ACT4.whyArgentina.factors) {
      expect(act4.container).toHaveTextContent(factor.name);
      expect(act4.container).toHaveTextContent(factor.detail);
    }
    expect(act4.container).toHaveTextContent(ACT4.taxAdviceNote);
    expect(act4.container).toHaveTextContent(ACT4.capitalProtectionNote);
    for (const pillar of ACT4.guarantees.pillars) {
      expect(act4.container).toHaveTextContent(pillar.pillar);
      expect(act4.container).toHaveTextContent(pillar.mechanism);
    }
    act4.unmount();

    const act5 = renderAct('/nuestra-estrategia');
    for (const vehicle of ACT5.vehicles) {
      expect(act5.container).toHaveTextContent(vehicle.name);
      expect(act5.container).toHaveTextContent(vehicle.advantage);
      expect(act5.container).toHaveTextContent(vehicle.performance);
    }
    act5.unmount();

    const act6 = renderAct('/estructura-operativa');
    for (const department of ACT67.departments) {
      expect(act6.container).toHaveTextContent(department.name);
      expect(act6.container).toHaveTextContent(department.role);
    }
    act6.unmount();

    const act7 = renderAct('/asesoramiento-intermediacion');
    expect(act7.container).toHaveTextContent('Clave de Identificación');
    expect(act7.container).toHaveTextContent('Introducing Broker');
    expect(act7.container).toHaveTextContent('ALyC');
    expect(act7.container).toHaveTextContent('CNMV');
  });

  it('DET-18 · las fuentes de las páginas de acto son texto, sin imagen de organismo', () => {
    const organism = /acled|nasa|cnmv|cnv|arca|aeat|alyc|indec/i;
    for (const route of ACT_ROUTES) {
      const { container, unmount } = renderAct(route.path);
      for (const image of container.querySelectorAll('img')) {
        expect(`${image.getAttribute('alt') ?? ''} ${image.getAttribute('src') ?? ''}`).not.toMatch(
          organism,
        );
      }
      for (const source of ACT_DETAILS[route.actNumber].sources) {
        expect(container).toHaveTextContent(source);
      }
      unmount();
    }
  });

  it('DET-19 · el texto de cada página coincide carácter a carácter con content/secciones/', () => {
    for (const route of ACT_ROUTES) {
      const literals = literalParagraphs(CANON[route.actNumber]);
      const stored = ACT_DETAILS[route.actNumber].sections.flatMap(
        (section) => section.paragraphs ?? [],
      );
      for (const paragraph of stored) {
        if (paragraph === ACT67.cdiDisambiguation || paragraph === ACT67.introducingBrokerNote) {
          continue;
        }
        expect(literals.some((literal) => literal === paragraph)).toBe(true);
      }
      const { container, unmount } = renderAct(route.path);
      for (const paragraph of literals) {
        expect(container.textContent).toContain(paragraph);
      }
      unmount();
    }
  });

  it('C5 · el párrafo duplicado de la sección III no se repite en estado de derecho', () => {
    const { container } = renderAct('/estado-de-derecho');
    expect(container).not.toHaveTextContent('hacia Latinoamérica');
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });

  it('las páginas de acto no tienen violaciones axe bloqueantes', async () => {
    const sample = ['/escenario-europeo', '/asesoramiento-intermediacion'] as const;
    for (const path of sample) {
      const { container, unmount } = renderAct(path);
      await expectNoBlockingAxeViolations(container);
      unmount();
    }
  });
});

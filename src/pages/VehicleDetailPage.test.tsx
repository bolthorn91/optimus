import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { App } from '@/app/App';
import { isVehicleRoute, ROUTES } from '@/app/routes';
import { DISCLAIMER_TEXT } from '@/components/Disclaimer';
import { PENDING_LABEL } from '@/components/PendingValue';
import { ACT7_PROPERTY_BODY, ACT7_SECURITIES_BODY } from '@/content/acts/act-7';
import { VEHICLE_IDS, type VehicleId } from '@/lib/projection-assumptions';
import { ACT4 } from '@/scenes/04-marco-legal/content';
import { contactHref } from '@/scenes/05-activos-simulador/contactHref';
import { ACT5 } from '@/scenes/05-activos-simulador/content';
import { ACT67 } from '@/scenes/06-firma/content';
import { expectNoBlockingAxeViolations } from '@/test/axe';

const VEHICLE_ROUTES = ROUTES.filter(isVehicleRoute);

const SECCION_5 = readFileSync(
  resolve(process.cwd(), 'content/secciones/05-nuestra-estrategia.md'),
  'utf8',
);
const SECCION_4 = readFileSync(
  resolve(process.cwd(), 'content/secciones/04-estrategia-anticipatoria.md'),
  'utf8',
);
const SECCION_7 = readFileSync(
  resolve(process.cwd(), 'content/secciones/07-asesoramiento-intermediacion.md'),
  'utf8',
);

function renderVehicle(path: string) {
  window.history.pushState({}, '', path);
  return render(<App />);
}

function stripMd(text: string): string {
  return text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/\s+/g, ' ').trim();
}

/** Filas `| Campo | Contenido |` del desglose de un vehículo en sección V. */
function desgloseValues(markdown: string, heading: string): string[] {
  const start = markdown.indexOf(` · ${heading}**`);
  if (start < 0) return [];
  const rest = markdown.slice(start);
  const next = rest.search(/\n\*\*\d+ · |\n### /);
  const block = next >= 0 ? rest.slice(0, next) : rest;
  const values: string[] = [];
  for (const line of block.split('\n')) {
    if (!line.startsWith('|')) continue;
    const cells = line
      .split('|')
      .slice(1, -1)
      .map((cell) => stripMd(cell));
    if (cells.length < 2 || cells[0] === 'Campo' || cells[0] === '---') continue;
    const value = cells[1];
    if (value) values.push(value);
  }
  return values;
}

function vehicleOf(id: VehicleId) {
  const vehicle = ACT5.vehicles.find((entry) => entry.id === id);
  if (!vehicle) throw new Error(`ACT5 no declara ${id}`);
  return vehicle;
}

describe('páginas de vehículo', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('DET-04 · las tres páginas de vehículo renderizan el Disclaimer en línea', () => {
    for (const route of VEHICLE_ROUTES) {
      const { container, unmount } = renderVehicle(route.path);
      const inline = container.querySelector('.detail-prose [data-disclaimer="inline"]');
      expect(inline).not.toBeNull();
      expect(inline).toHaveTextContent(DISCLAIMER_TEXT);
      unmount();
    }
    expect(VEHICLE_IDS).toHaveLength(3);
  });

  it('DET-05 · el texto sale del canon; el suelo de entrada es PendingValue E-05', () => {
    for (const route of VEHICLE_ROUTES) {
      const vehicle = vehicleOf(route.vehicleId);
      const { container, unmount } = renderVehicle(route.path);
      const prose = container.querySelector('.detail-prose');
      expect(prose).not.toBeNull();
      if (prose === null) {
        unmount();
        continue;
      }

      expect(prose).toHaveTextContent(vehicle.advantage);
      expect(prose).toHaveTextContent(vehicle.performance);
      expect(SECCION_5).toContain(vehicle.advantage);
      expect(SECCION_5).toContain(vehicle.performance);

      for (const value of desgloseValues(SECCION_5, vehicle.name)) {
        expect(prose).toHaveTextContent(value);
      }

      expect(prose).toHaveTextContent(ACT4.guarantees.heading);
      expect(SECCION_4).toContain(ACT4.guarantees.pillars[0].pillar);
      if (route.vehicleId === 'equities') {
        expect(prose).toHaveTextContent(ACT7_SECURITIES_BODY);
        expect(prose).toHaveTextContent(ACT67.introducingBrokerNote);
      } else {
        expect(prose).toHaveTextContent(ACT7_PROPERTY_BODY);
        expect(prose).toHaveTextContent(ACT67.cdiDisambiguation);
      }
      expect(SECCION_7).toContain('Clave de Identificación');

      const allowedParagraphs = new Set([
        vehicle.advantage,
        vehicle.performance,
        ACT7_PROPERTY_BODY,
        ACT7_SECURITIES_BODY,
        ACT67.cdiDisambiguation,
        ACT67.introducingBrokerNote,
        ...ACT4.guarantees.intro,
        DISCLAIMER_TEXT,
        `${ACT5.copy.entryFloorLabel}: ${PENDING_LABEL} ${ACT5.entryFloor.note}`,
      ]);
      for (const node of prose.querySelectorAll('p')) {
        expect(allowedParagraphs.has(node.textContent.trim())).toBe(true);
      }

      expect(prose.querySelector('[data-debt-id="E-05"]')).not.toBeNull();
      expect(container.textContent).not.toMatch(/\d[\d.]{2,}\s*€/);
      unmount();
    }
  });

  it('DET-06 · el CTA preselecciona el vehículo del documento 05', () => {
    for (const route of VEHICLE_ROUTES) {
      const { container, unmount } = renderVehicle(route.path);
      const cta = container.querySelector('.detail-cta a');
      expect(cta).toHaveAttribute('href', contactHref(route.vehicleId));
      unmount();
    }
  });

  it('S2 · cada vehículo muestra ventaja, rendimiento, vía operativa y garantías', () => {
    for (const route of VEHICLE_ROUTES) {
      const vehicle = vehicleOf(route.vehicleId);
      const { container, unmount } = renderVehicle(route.path);
      expect(container).toHaveTextContent(vehicle.advantage);
      expect(container).toHaveTextContent(vehicle.performance);
      const viaId = route.vehicleId === 'equities' ? 'securities' : 'property';
      const via = ACT67.routes.find((entry) => entry.id === viaId);
      expect(via).toBeDefined();
      expect(container).toHaveTextContent(via?.title ?? '');
      expect(container).toHaveTextContent(ACT4.guarantees.heading);
      unmount();
    }
  });

  it('las páginas de vehículo no tienen violaciones axe bloqueantes', async () => {
    const { container } = renderVehicle('/activos/bienes-raices');
    await expectNoBlockingAxeViolations(container);
  });
});

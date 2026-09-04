import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { RISK_PATTERN_KIND } from '@/components/RiskPattern';
import { AA_NON_TEXT, contrastRatio } from '@/lib/contrast';
import { PALETTE, RISK_SCALE } from '@/lib/tokens';
import {
  RISK_COPY,
  RISK_LEVELS,
  RISK_PERIODS,
  RISK_REGIONS,
  riskLevel,
} from '@/scenes/02-seguridad-global/risk-data';
import { RiskLegend } from '@/scenes/02-seguridad-global/RiskLegend';
import { RiskTable } from '@/scenes/02-seguridad-global/RiskTable';
import { WORLD_BASE_SVG as WORLD } from '@/scenes/02-seguridad-global/worldLand';

const CANON = readFileSync(
  resolve(process.cwd(), 'content/secciones/02-seguridad-global.md'),
  'utf8',
);

describe('superficies accesibles del acto II', () => {
  // MAP-06
  it('MAP-06 · la tabla equivalente está en el DOM con las cuatro columnas de período', () => {
    render(
      <RiskTable
        copy={{
          caption: RISK_COPY.tableCaption,
          projectionNote: RISK_COPY.projectionNote,
          regionHeader: RISK_COPY.tableRegion,
        }}
        levels={RISK_LEVELS}
        periods={RISK_PERIODS}
        regions={RISK_REGIONS}
      />,
    );
    const table = screen.getByRole('table', {
      name: 'Nivel de riesgo bélico por región y período',
    });
    expect(table).toBeInTheDocument();
    for (const period of RISK_PERIODS) {
      expect(
        screen.getByRole('columnheader', { name: new RegExp(period.shortLabel) }),
      ).toBeInTheDocument();
    }
  });

  // MAP-07
  it('MAP-07 · la leyenda muestra los cuatro niveles con etiqueta y trama distintas', () => {
    const { container } = render(<RiskLegend levels={RISK_LEVELS} title={RISK_COPY.legendTitle} />);
    const patterns = container.querySelectorAll('[data-risk-pattern]');
    expect(patterns).toHaveLength(4);
    const kinds = [...patterns].map((node) => node.getAttribute('data-risk-pattern-kind'));
    expect(new Set(kinds)).toEqual(new Set(Object.values(RISK_PATTERN_KIND)));
    for (const level of RISK_LEVELS) {
      expect(screen.getByText(level.label)).toBeInTheDocument();
      const swatch = container.querySelector(`[data-risk-pattern="${level.id}"]`);
      expect(swatch).not.toBeNull();
      expect(swatch?.querySelector('pattern')).not.toBeNull();
      const fill = RISK_SCALE[level.id];
      const ink = Math.max(
        contrastRatio(PALETTE.white, fill),
        contrastRatio(PALETTE.navyDeep, fill),
      );
      expect(ink).toBeGreaterThanOrEqual(AA_NON_TEXT);
    }
  });

  // MAP-13
  it('MAP-13 · rótulos de mapas y etiquetas de niveles coinciden con content/', () => {
    const normalised = CANON.replace(/\r\n/g, '\n');
    for (const period of RISK_PERIODS) {
      expect(normalised).toContain(period.label);
    }
    for (const level of RISK_LEVELS) {
      expect(normalised).toContain(level.label);
    }
  });

  it('la silueta mundial es un SVG equirrectangular de Natural Earth', () => {
    expect(WORLD).toContain('viewBox="0 0 360 150"');
    expect(WORLD).toContain('Natural Earth');
    expect(WORLD).toContain('id="land"');
    expect(WORLD).toContain('id="continents"');
    expect(WORLD).not.toMatch(/NaN|Infinity/i);
    expect(WORLD).toContain('M89.45 20.50');
    const start = WORLD.indexOf(' d="') + 4;
    const path = WORLD.slice(start, WORLD.indexOf('"', start));
    for (const sub of path.split('M').filter(Boolean)) {
      const pts = [...sub.matchAll(/(-?\d+\.\d+)\s+(-?\d+\.\d+)/g)].map((match) => [
        Number(match[1]),
        Number(match[2]),
      ]);
      for (let i = 1; i < pts.length; i += 1) {
        const prev = pts[i - 1]?.[0];
        const next = pts[i]?.[0];
        if (prev === undefined || next === undefined) continue;
        expect(Math.abs(next - prev)).toBeLessThanOrEqual(180);
      }
    }
  });

  // MAP-14
  it('MAP-14 · una región sin nivel declarado se trata como stable y avisa en desarrollo', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const orphan = {
      id: '2015' as const,
      year: 2015,
      label: 'NIVEL DE RIESGO BÉLICO Y CONFLICTO ARMADO (2015)',
      shortLabel: '2015',
      isProjection: false,
      regions: {},
    };
    expect(riskLevel(orphan, 'caribbean')).toBe('stable');
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});

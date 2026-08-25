import { describe, expect, it } from 'vitest';

import {
  AA_LARGE,
  AA_NON_TEXT,
  AA_NORMAL,
  contrastRatio,
  meetsAA,
  relativeLuminance,
} from './contrast';
import { PALETTE, THEME } from './tokens';

describe('lectura del color hexadecimal', () => {
  it('acepta seis dígitos con y sin almohadilla', () => {
    expect(relativeLuminance('#102135')).toBeCloseTo(relativeLuminance('102135'), 10);
  });

  it('expande la forma de tres dígitos', () => {
    expect(relativeLuminance('#fff')).toBeCloseTo(relativeLuminance('#ffffff'), 10);
  });

  it.each(['', '#12', '#12345', 'rojo', '#12345g'])('rechaza "%s"', (input) => {
    expect(() => relativeLuminance(input)).toThrow(RangeError);
  });
});

describe('relativeLuminance', () => {
  it('sitúa negro y blanco en los extremos', () => {
    expect(relativeLuminance('#000000')).toBeCloseTo(0, 5);
    expect(relativeLuminance('#FFFFFF')).toBeCloseTo(1, 5);
  });
});

describe('contrastRatio', () => {
  it('negro sobre blanco da el máximo de 21', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 2);
  });

  it('un color contra sí mismo da 1', () => {
    expect(contrastRatio(PALETTE.gold, PALETTE.gold)).toBeCloseTo(1, 5);
  });

  it('es simétrico', () => {
    expect(contrastRatio(PALETTE.navyDeep, PALETTE.ivory)).toBeCloseTo(
      contrastRatio(PALETTE.ivory, PALETTE.navyDeep),
      10,
    );
  });
});

/**
 * Este bloque es el DoD de la fase B convertido en test: «Contraste verificado: el oro #B8974F no
 * se usa para texto pequeño». Si alguien cambia un token y rompe un par, falla aquí.
 */
describe('los pares de texto del sistema cumplen AA', () => {
  it.each([
    ['tinta sobre superficie, tema claro', THEME.light.ink, THEME.light.surface],
    ['tinta sobre superficie elevada, tema claro', THEME.light.ink, THEME.light.surfaceRaised],
    ['tinta atenuada sobre superficie, tema claro', THEME.light.inkMuted, THEME.light.surface],
    ['tinta sobre superficie, tema oscuro', THEME.dark.ink, THEME.dark.surface],
    ['tinta sobre superficie elevada, tema oscuro', THEME.dark.ink, THEME.dark.surfaceRaised],
    ['tinta atenuada sobre superficie, tema oscuro', THEME.dark.inkMuted, THEME.dark.surface],
  ])('%s', (_caso, fg, bg) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it.each([
    ['tinta enfatizada, tema claro', THEME.light.inkStrong, THEME.light.surface],
    ['tinta enfatizada, tema oscuro', THEME.dark.inkStrong, THEME.dark.surface],
  ])('%s', (_caso, fg, bg) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  // El anillo de foco es un objeto gráfico: WCAG 1.4.11 le pide 3:1 contra el fondo adyacente.
  it.each([
    ['foco sobre superficie, tema claro', THEME.light.focus, THEME.light.surface],
    ['foco sobre superficie elevada, tema claro', THEME.light.focus, THEME.light.surfaceRaised],
    ['foco sobre superficie, tema oscuro', THEME.dark.focus, THEME.dark.surface],
    ['foco sobre superficie elevada, tema oscuro', THEME.dark.focus, THEME.dark.surfaceRaised],
  ])('%s', (_caso, fg, bg) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(AA_NON_TEXT);
  });
});

/**
 * La guía de estilo dice que el oro es para «filetes, bordes, subrayados, iconos» y **nunca**
 * para texto. Estos tests fijan esa regla en el código en vez de dejarla en la guía.
 */
describe('el oro es decorativo, no es color de texto', () => {
  it('el acento cumple el umbral de contraste NO textual en ambos temas', () => {
    expect(contrastRatio(THEME.light.accent, THEME.light.surface)).toBeGreaterThanOrEqual(
      AA_NON_TEXT,
    );
    expect(contrastRatio(THEME.dark.accent, THEME.dark.surface)).toBeGreaterThanOrEqual(
      AA_NON_TEXT,
    );
  });

  it('el acento del tema claro NO alcanza para texto pequeño: por eso no es un rol de texto', () => {
    expect(meetsAA(THEME.light.accent, THEME.light.surface, { fontSizePx: 18 })).toBe(false);
  });

  it('el oro #B8974F tampoco alcanza sobre marfil', () => {
    expect(meetsAA(PALETTE.gold, PALETTE.ivory, { fontSizePx: 18 })).toBe(false);
  });

  it('sobre navy sí cumple, que es el único sitio donde se usa a gran tamaño', () => {
    expect(meetsAA(PALETTE.gold, PALETTE.navyDeep, { fontSizePx: 48 })).toBe(true);
    expect(meetsAA(PALETTE.gold, PALETTE.navyDeep, { fontSizePx: 18 })).toBe(true);
  });

  it('el umbral de texto grande es más laxo que el de texto normal', () => {
    expect(AA_LARGE).toBeLessThan(AA_NORMAL);
    expect(AA_NON_TEXT).toBeLessThan(AA_NORMAL);
  });
});

describe('meetsAA distingue el tamaño y el peso del texto', () => {
  const fg = '#767676';
  const bg = '#FFFFFF';

  it('un par en el filo cumple para texto grande y no para pequeño', () => {
    const ratio = contrastRatio(fg, bg);
    expect(ratio).toBeGreaterThanOrEqual(AA_LARGE);
    expect(ratio).toBeLessThan(7);

    expect(meetsAA(fg, bg, { fontSizePx: 24 })).toBe(true);
    expect(meetsAA('#949494', bg, { fontSizePx: 16 })).toBe(false);
  });

  it('la negrita baja el umbral de «texto grande» a 18,66 px', () => {
    expect(meetsAA('#949494', bg, { fontSizePx: 19, bold: true })).toBe(true);
    expect(meetsAA('#949494', bg, { fontSizePx: 19, bold: false })).toBe(false);
  });
});

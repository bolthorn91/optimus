/**
 * Contraste WCAG 2.1. Existe porque el gate de axe no puede auditarlo bajo jsdom (falta layout),
 * y el DoD de la fase B exige comprobar que el oro `#B8974F` no se usa para texto pequeño. Con
 * esto la comprobación deja de ser manual.
 *
 * La superficie pública es deliberadamente estrecha: colores en hexadecimal, que es como los
 * declara `tokens.ts`. Nada consume otra representación.
 */

/** Umbrales de WCAG 2.1 nivel AA. */
export const AA_NORMAL = 4.5;
export const AA_LARGE = 3;
/** WCAG 1.4.11: componentes de interfaz y objetos gráficos, incluidos los filetes decorativos. */
export const AA_NON_TEXT = 3;

/** Texto grande según WCAG: ≥ 24 px, o ≥ 18,66 px si es negrita. */
const LARGE_TEXT_PX = 24;
const LARGE_TEXT_BOLD_PX = 18.66;

function parseHex(hex: string): [r: number, g: number, b: number] {
  const clean = hex.trim().replace(/^#/, '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;

  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    throw new RangeError(`se esperaba un color hexadecimal de 3 o 6 dígitos, se recibió "${hex}"`);
  }

  return [
    Number.parseInt(full.slice(0, 2), 16),
    Number.parseInt(full.slice(2, 4), 16),
    Number.parseInt(full.slice(4, 6), 16),
  ];
}

function channelLuminance(value: number): number {
  const s = value / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

/** Luminancia relativa según WCAG 2.1, en el rango 0 (negro) a 1 (blanco). */
export function relativeLuminance(hex: string): number {
  const [r, g, b] = parseHex(hex);
  return 0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b);
}

/** Ratio de contraste entre dos colores, de 1 (idénticos) a 21 (negro sobre blanco). */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [light, dark] = la >= lb ? [la, lb] : [lb, la];
  return (light + 0.05) / (dark + 0.05);
}

/** Si el par cumple AA para el tamaño de texto dado. */
export function meetsAA(
  foreground: string,
  background: string,
  { fontSizePx, bold = false }: { fontSizePx: number; bold?: boolean },
): boolean {
  const isLarge = bold ? fontSizePx >= LARGE_TEXT_BOLD_PX : fontSizePx >= LARGE_TEXT_PX;
  return contrastRatio(foreground, background) >= (isLarge ? AA_LARGE : AA_NORMAL);
}

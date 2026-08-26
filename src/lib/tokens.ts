/**
 * Los tokens de `src/styles/tokens.css` para consumo en JavaScript: shaders, coreografías de
 * GSAP y cálculo de contraste. Duplicar aquí un valor que no esté allí rompe la única fuente
 * de verdad del doc 00 S4, así que estos objetos son la traducción literal, no una variante.
 */

/** Paleta de marca. Valores literales de `content/05-guia-estilo-visual.md`. */
export const PALETTE = {
  navyDeep: '#102135',
  navyMid: '#1A2C42',
  navyInk: '#21293D',
  ivory: '#F7F5F0',
  white: '#FFFFFF',
  goldHigh: '#FFEEB2',
  gold: '#B8974F',
  goldBronze: '#8E6D3F',
  goldMuted: '#8A7A55',
  slate: '#4A5468',
  slateLight: '#A8B0BF',
  ruleWarm: '#D9D4C9',
  ruleCool: '#2C3A4D',
} as const;

/** Escala de riesgo. Uso exclusivo en los mapas del acto II (doc 00 S2). */
export const RISK_SCALE = {
  extreme: '#9B1E22',
  high: '#C6772C',
  latent: '#DFCC4C',
  stable: '#2B498F',
} as const;

/** Identificadores de país, consistentes en todo el sitio (doc 00 S3). */
export const COUNTRY_COLOR = {
  es: PALETTE.goldMuted,
  ar: RISK_SCALE.stable,
} as const;

/**
 * Roles semánticos por tema.
 *
 * `accent` es **decorativo**: filetes, bordes, subrayados e iconos. Nunca color de texto — la
 * guía de estilo lo prohíbe explícitamente y el contraste no da. El texto enfatizado usa
 * `inkStrong`. La distinción está cubierta por `contrast.test.ts`.
 */
export const THEME = {
  light: {
    surface: PALETTE.ivory,
    surfaceRaised: PALETTE.white,
    ink: PALETTE.navyInk,
    inkStrong: PALETTE.navyDeep,
    inkMuted: PALETTE.slate,
    accent: PALETTE.goldBronze,
    rule: PALETTE.ruleWarm,
    focus: PALETTE.navyDeep,
  },
  dark: {
    surface: PALETTE.navyDeep,
    surfaceRaised: PALETTE.navyMid,
    ink: PALETTE.ivory,
    inkStrong: PALETTE.white,
    inkMuted: PALETTE.slateLight,
    accent: PALETTE.gold,
    rule: PALETTE.ruleCool,
    focus: PALETTE.goldHigh,
  },
} as const;

export type ThemeName = keyof typeof THEME;
export type ThemeRole = keyof (typeof THEME)['light'];

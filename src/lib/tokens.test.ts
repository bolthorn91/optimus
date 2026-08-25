/// <reference types="node" />
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { COUNTRY_COLOR, PALETTE, RISK_SCALE, THEME } from './tokens';

/**
 * Se lee del disco en vez de importar `?raw` para no tener que encender el procesado de CSS de
 * Vitest en toda la suite por un único test. Vitest siempre corre desde la raíz del repo.
 */
const cssSource = readFileSync(path.join(process.cwd(), 'src/styles/tokens.css'), 'utf8');

/**
 * `tokens.css` y `tokens.ts` declaran la misma paleta en dos lenguajes. Este fichero es lo que
 * impide que se separen: sin él, cambiar un color en uno y no en el otro pasa desapercibido
 * hasta que alguien ve dos oros distintos en la misma pantalla.
 */
/** Todas las custom properties declaradas, con su valor tal cual. */
function declaredVars(source: string): Map<string, string> {
  const vars = new Map<string, string>();
  for (const [, name, value] of source.matchAll(/^\s*(--[\w-]+):\s*([^;]+);/gm)) {
    if (name !== undefined && value !== undefined && !vars.has(name)) {
      vars.set(name, value.trim());
    }
  }
  return vars;
}

const vars = declaredVars(cssSource);

/** El cuerpo de un bloque de reglas, desde su selector hasta la llave que lo cierra. */
function darkBlock(selector: string): string {
  const inicio = cssSource.indexOf(selector);
  if (inicio === -1) throw new Error(`no se encontró el selector ${selector} en tokens.css`);
  const abre = cssSource.indexOf('{', inicio);
  return cssSource.slice(abre + 1, cssSource.indexOf('}', abre));
}

/** Sigue las referencias `var(--x)` hasta el valor literal. */
function resolve(value: string, source: Map<string, string>, depth = 0): string {
  const ref = /^var\((--[\w-]+)\)$/.exec(value.trim());
  if (!ref?.[1] || depth > 5) return value.trim();
  return resolve(source.get(ref[1]) ?? '', source, depth + 1);
}

function kebab(name: string): string {
  return name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
}

describe('tokens.css y tokens.ts no pueden divergir', () => {
  it('la paleta de TypeScript coincide con la de CSS, color a color', () => {
    for (const [name, hex] of Object.entries(PALETTE)) {
      const declarado = vars.get(`--color-${kebab(name)}`);

      expect(declarado, `falta --color-${kebab(name)} en tokens.css`).toBeDefined();
      expect(declarado?.toLowerCase()).toBe(hex.toLowerCase());
    }
  });

  it('la escala de riesgo coincide, nivel a nivel', () => {
    for (const [nivel, hex] of Object.entries(RISK_SCALE)) {
      const declarado = vars.get(`--color-risk-${kebab(nivel)}`);

      expect(declarado, `falta --color-risk-${kebab(nivel)} en tokens.css`).toBeDefined();
      expect(declarado?.toLowerCase()).toBe(hex.toLowerCase());
    }
  });

  it('los identificadores de país apuntan a los mismos tokens en ambos lados', () => {
    expect(vars.get('--color-country-es')).toBe('var(--color-gold-muted)');
    expect(COUNTRY_COLOR.es).toBe(PALETTE.goldMuted);

    expect(vars.get('--color-country-ar')).toBe('var(--color-risk-stable)');
    expect(COUNTRY_COLOR.ar).toBe(RISK_SCALE.stable);
  });

  it('cada rol semántico del tema claro existe en CSS con el MISMO valor', () => {
    for (const [rol, hex] of Object.entries(THEME.light)) {
      const declarado = vars.get(`--${kebab(rol)}`);
      expect(declarado, `falta --${kebab(rol)} en tokens.css`).toBeDefined();
      expect(resolve(declarado ?? '', vars).toLowerCase(), `--${kebab(rol)} difiere`).toBe(
        hex.toLowerCase(),
      );
    }
  });

  it('cada rol del tema oscuro coincide con su valor en CSS', () => {
    const oscuros = declaredVars(darkBlock(":root[data-theme='dark']"));

    for (const [rol, hex] of Object.entries(THEME.dark)) {
      const declarado = oscuros.get(`--${kebab(rol)}`);
      expect(declarado, `falta --${kebab(rol)} en el tema oscuro`).toBeDefined();
      expect(resolve(declarado ?? '', vars).toLowerCase(), `--${kebab(rol)} difiere`).toBe(
        hex.toLowerCase(),
      );
    }
  });

  it('los dos bloques de tema oscuro declaran exactamente lo mismo', () => {
    const porMedia = declaredVars(darkBlock(":root:not([data-theme='light'])"));
    const porAtributo = declaredVars(darkBlock(":root[data-theme='dark']"));

    expect([...porAtributo.entries()].sort()).toEqual([...porMedia.entries()].sort());
  });

  it('los dos temas declaran exactamente los mismos roles', () => {
    expect(Object.keys(THEME.dark)).toEqual(Object.keys(THEME.light));
  });
});

describe('el bloque de tema oscuro', () => {
  it('redefine todos los roles del claro, ninguno menos', () => {
    const bloque = cssSource.slice(cssSource.indexOf(":root[data-theme='dark']"));

    for (const rol of Object.keys(THEME.light)) {
      expect(bloque, `--${kebab(rol)} sin redefinir en el tema oscuro`).toContain(
        `--${kebab(rol)}:`,
      );
    }
  });

  it('ningún color de paleta tiene su única definición dentro de una media query (S5)', () => {
    const raiz = cssSource.slice(0, cssSource.indexOf('@media'));

    for (const name of Object.keys(PALETTE)) {
      expect(raiz).toContain(`--color-${kebab(name)}:`);
    }
  });
});

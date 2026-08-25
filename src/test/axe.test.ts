import axeCore from 'axe-core';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { BLOCKING_IMPACTS, RUN_OPTIONS, expectNoBlockingAxeViolations } from './axe';

function render(html: string): HTMLElement {
  const host = document.createElement('div');
  host.innerHTML = html;
  document.body.append(host);
  return host;
}

// `cleanup()` de RTL solo retira lo que renderizó RTL: lo que se añade a mano hay que quitarlo,
// o una violación de un test se cuela en el siguiente.
afterEach(() => {
  document.body.replaceChildren();
  document.documentElement.lang = 'es-ES';
  document.title = 'OPTIMVS';
});

// Mismas opciones que el gate: medir con otra configuración no demostraría nada sobre él.
async function impactsOf(target: Element | Document): Promise<(string | null | undefined)[]> {
  const { violations } = await axeCore.run(target, RUN_OPTIONS);
  return violations.map((v) => v.impact);
}

describe('gate de accesibilidad por sección', () => {
  it('bloquea ante una violación critical', async () => {
    // `image-alt` es critical: una imagen sin texto alternativo.
    const host = render('<img src="x.png" />');

    expect(await impactsOf(host)).toContain('critical');
    await expect(expectNoBlockingAxeViolations(host)).rejects.toThrow();
  });

  it('bloquea ante una violación serious', async () => {
    // `link-name` es serious: un enlace sin nombre accesible.
    const host = render('<a href="#destino"></a>');

    expect(await impactsOf(host)).toContain('serious');
    await expect(expectNoBlockingAxeViolations(host)).rejects.toThrow();
  });

  it('deja pasar un contenedor accesible', async () => {
    const host = render('<img src="x.png" alt="Un gráfico" /><a href="#destino">Ir al destino</a>');

    expect(await impactsOf(host)).toEqual([]);
    await expect(expectNoBlockingAxeViolations(host)).resolves.toBeUndefined();
  });

  it('deja pasar una violación real por debajo del umbral del perfil §5', async () => {
    // `heading-order` es moderate: saltar de h1 a h3. La violación existe y NO debe bloquear.
    const host = render('<h1>Uno</h1><h3>Tres</h3>');

    const impacts = await impactsOf(host);
    expect(impacts).toContain('moderate');
    expect(impacts).not.toContain('critical');
    expect(impacts).not.toContain('serious');

    await expect(expectNoBlockingAxeViolations(host)).resolves.toBeUndefined();
  });

  it('el umbral declarado es exactamente el del perfil §5', () => {
    expect(BLOCKING_IMPACTS).toEqual(['critical', 'serious']);
  });
});

describe('gate de accesibilidad de página, que es el contexto por defecto', () => {
  beforeEach(() => {
    document.documentElement.lang = 'es-ES';
    document.title = 'OPTIMVS';
  });

  it('detecta html-has-lang, que el contexto de sección no alcanza', async () => {
    document.documentElement.removeAttribute('lang');
    render('<main><h1>Uno</h1></main>');

    await expect(expectNoBlockingAxeViolations()).rejects.toThrow(/html-has-lang/);
  });

  it('detecta document-title, que el contexto de sección no alcanza', async () => {
    document.title = '';
    render('<main><h1>Uno</h1></main>');

    await expect(expectNoBlockingAxeViolations()).rejects.toThrow(/document-title/);
  });

  it('deja pasar una página con lang, título, landmark y encabezado', async () => {
    render('<a href="#principal">Saltar al contenido</a><main id="principal"><h1>Uno</h1></main>');

    await expect(expectNoBlockingAxeViolations()).resolves.toBeUndefined();
  });

  it('evalúa landmark-one-main gracias al stub de elementFromPoint', async () => {
    render('<div><span>Sin landmark</span></div>');

    const { violations, incomplete } = await axeCore.run(document, RUN_OPTIONS);

    expect(violations.map((v) => v.id)).toContain('landmark-one-main');
    // Si el stub de setup.ts desapareciera, la regla caería a incomplete en vez de a violations.
    expect(incomplete.map((v) => v.id)).not.toContain('landmark-one-main');
  });

  it('no deja el contraste en incomplete: la regla está desactivada explícitamente', async () => {
    render('<main><h1 style="color:#f2f2f2;background:#fff">Contraste pésimo</h1></main>');

    const { violations, incomplete } = await axeCore.run(document, RUN_OPTIONS);

    expect([...violations, ...incomplete].map((r) => r.id)).not.toContain('color-contrast');
  });
});

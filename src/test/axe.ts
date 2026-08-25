import axeCore, { type ImpactValue, type Result, type RunOptions } from 'axe-core';
import { expect } from 'vitest';

/**
 * El perfil §5 fija el gate en «cero violaciones critical y serious». Filtrar aquí mantiene el
 * gate ejecutado exactamente como está declarado.
 */
export const BLOCKING_IMPACTS: readonly ImpactValue[] = ['critical', 'serious'];

const BLOCKING = new Set<ImpactValue>(BLOCKING_IMPACTS);

/**
 * `color-contrast` se desactiva a propósito. Bajo jsdom no hay layout ni pintado, así que axe
 * nunca la resuelve: la deja en `incomplete`, donde pasaría desapercibida y daría un gate en verde
 * falso. Apagarla deja el límite escrito en el código.
 *
 * **El contraste no se audita aquí.** El DoD de la fase B («el oro #B8974F no se usa para texto
 * pequeño») es verificación manual o de herramienta externa, no de este gate.
 */
export const RUN_OPTIONS: RunOptions = {
  rules: { 'color-contrast': { enabled: false } },
};

function isBlocking(violation: Result): boolean {
  return violation.impact != null && BLOCKING.has(violation.impact);
}

function summarise(results: Result[]): string {
  return results
    .map((r) => `${r.impact ?? 'sin impacto'} · ${r.id}: ${r.help} (${r.nodes.length} nodos)`)
    .join('\n');
}

/**
 * Falla si hay alguna violación de accesibilidad bloqueante según el perfil §5.
 *
 * El **contexto decide qué reglas se evalúan**. Por defecto audita el documento entero, que es lo
 * único que dispara las reglas cuyo selector es `html:not(html *)` — `html-has-lang`,
 * `document-title`, `landmark-one-main` y `page-has-heading-one`. Pasar un `Element` audita solo
 * esa sección y deja esas cuatro fuera.
 *
 * Dos reglas quedan fuera siempre bajo jsdom, ambas por falta de layout: `bypass` (lo que
 * auditaría el enlace «Saltar al contenido», así que FND-13 se verifica afirmando el orden de
 * foco) y `color-contrast` (desactivada explícitamente, ver `RUN_OPTIONS`).
 *
 * `landmark-one-main` y `page-has-heading-one` solo se evalúan gracias al stub de
 * `document.elementFromPoint` de `setup.ts`.
 */
export async function expectNoBlockingAxeViolations(
  target: Element | Document = document,
): Promise<void> {
  const results = await axeCore.run(target, RUN_OPTIONS);
  const scope = target === document ? 'la página' : 'la sección';

  // Un `incomplete` de severidad bloqueante es un gate degradado, no un gate en verde: axe no
  // pudo decidir. No falla —sería ruido en jsdom— pero tampoco se calla.
  const undecided = results.incomplete.filter(isBlocking);
  if (undecided.length > 0) {
    console.warn(
      `axe no pudo decidir ${undecided.length} regla(s) en ${scope}:\n${summarise(undecided)}`,
    );
  }

  const blocking = results.violations.filter(isBlocking);
  expect(blocking, `Violaciones bloqueantes en ${scope}:\n${summarise(blocking)}`).toEqual([]);
}

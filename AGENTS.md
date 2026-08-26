# AGENTS.md — instrucciones de repositorio

Sitio web de **OPTIMVS Capital Protegido**. Frontend estático, sin backend.

Antes de tocar nada: leer [`agent-docs/goal-profile.md`](agent-docs/goal-profile.md). Es
normativo y sus secciones se citan por número (§1–§10).

---

## Autoridad

1. Documento canónico de la goal en curso — `docs/product/NN-<slug>.md`
2. Este fichero
3. `content/` — **canon de contenido**
4. `agent-docs/goal-profile.md`

---

## Lo que más se incumple en este repo

**El contenido no se inventa.** Todo texto, cifra y tabla de la web sale de `content/`.
`content/README.md` es el índice. Si hace falta un dato que no está ahí, se deja un marcador
visible y se registra en `docs/debt/technical-debt.md` — nunca se rellena con algo plausible.
Esto incluye teléfonos, importes mínimos de inversión, rentabilidades y nombres de entidades
aliadas (perfil §7 I1, I2).

**La animación ilustra; el DOM informa.** Ningún texto o cifra puede existir solo dentro de un
`<canvas>` ni aparecer únicamente al hacer scroll. Toda escena entrega el mismo contenido con
`prefers-reduced-motion` activo (perfil §7 I3, I4).

**Toda animación se limpia.** `gsap.context()` / `useGSAP` con su `revert()` al desmontar. Un
`ScrollTrigger` huérfano es un bug, no un detalle (perfil §7 I5).

**Las escenas pesadas van en chunk diferido.** Cualquier import de `three`, `@react-three/*` o
`postprocessing` entra por `React.lazy` o import dinámico (perfil §7 I9).

---

## Estructura

```
src/app/        router, providers, layout, error boundary
src/motion/     primitivas de animación (Lenis, GSAP, reduced-motion)
src/three/      piezas React Three Fiber reutilizables
src/scenes/     una carpeta por escena: Scene.tsx · timeline.ts · content.ts · Scene.test.tsx
src/components/ UI reutilizable
src/lib/        lógica pura — sin React, sin DOM. Aquí aplica el gate de cobertura
src/content/    contenido tipado derivado de content/*.md
src/pages/      páginas de detalle y legales
```

Detalle completo y patrones prohibidos: perfil §8.

---

## Comandos

```bash
npm run typecheck
npm run lint
npm run format:check
npm test
npm run test:coverage
npm run build
npm run build:budget
npx vitest run <ruta-o-patrón>
```

Los crea la fase A del documento `docs/product/00-fundacion-sistema-diseno.md`. Un comando que
no se ha ejecutado se reporta como «no ejecutado», nunca como «pasa».

---

## Tests

- **Lógica pura** (`src/lib/**`, `src/hooks/**`, `src/**/*.logic.ts`): cobertura ≥ 80 % en las
  cuatro métricas. Gate bloqueante.
- **Escenas** (`src/scenes/**`, `src/three/**`, `src/motion/**`): fuera del umbral de cobertura,
  pero cada una exige tres tests en el mismo cambio — contenido en el DOM, ruta
  `prefers-reduced-motion`, y limpieza al desmontar.
- **Accesibilidad**: cero violaciones `critical` y `serious` de axe en toda sección renderizada.

No se baja un umbral ni se amplía un `exclude` para pasar un gate. No se mueve un fichero de
`src/lib/` a `src/scenes/` para sacarlo del alcance de cobertura.

---

## Idioma

Textos de usuario en **español de España**, tratamiento de **usted** (así está el dossier:
«Proteja su patrimonio», «Reserve su sesión»). Identificadores y código en inglés.

Cifras en convención española: `2.780.400 km²`, `96,05 hab/km²`. Siempre con el helper de
`src/lib/format.ts`.

---

## Comentarios

Escasos y solo para explicar el **porqué**. Prohibido narrar el cambio o reformular el código.

Única excepción: los ficheros `timeline.ts` pueden llevar comentarios de tramo
(`// 0.00–0.25 — la luz diurna se mantiene`), porque documentan el contrato temporal de la
coreografía, no el código que lo implementa.

---

## Git

Conventional Commits. Sin push y sin PR salvo petición explícita. Perfil §10.

---

## Loop de goals

Este repo se implementa con la skill `/goal` de Grok (`.grok/skills/goal/`): una fase cada vez,
dos subagentes de review que deben devolver limpio sobre la misma foto del código, luego puerta
humana, luego commit. El estado vive en `.grok/goal-runs/` (git-ignored). Protocolo en
[`agent-docs/goal-loop.md`](agent-docs/goal-loop.md); orden de las features en
[`docs/product/roadmap.md`](docs/product/roadmap.md).

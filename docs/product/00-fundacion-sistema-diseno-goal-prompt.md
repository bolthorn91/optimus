# GOAL prompt — Fundación técnica, sistema de diseño y motor de movimiento (doc 00)

**Uso:** `/goal docs/product/00-fundacion-sistema-diseno-goal-prompt.md`, o copiar el bloque `GOAL` de §2 a una sesión de implementación.
**Canon de producto:** [`00-fundacion-sistema-diseno.md`](00-fundacion-sistema-diseno.md).
**Perfil de proyecto:** [`agent-docs/goal-profile.md`](../../agent-docs/goal-profile.md) — invariantes §7 aplicables: I1, I2, I3, I4, I5, I6, I7, I8, I9.
**Roadmap:** [`roadmap.md`](roadmap.md) §2, fila 00.
**Branch de trabajo esperado:** el HEAD actual del worktree (`main`, sin commits todavía). No inventar rama.
**Harness:** `AGENTS.md`, `content/` (canon de contenido), `agent-docs/goal-profile.md`.
**Loop:** [`agent-docs/goal-loop.md`](../../agent-docs/goal-loop.md).

---

## 1. Protocolo de fase (obligatorio en cada fase A–E)

Para **cada** fase, en este orden **estricto**:

1. **Implementar** el alcance de la fase según el doc 00 (sin reabrir las decisiones §2: C1–C5,
   F1–F8, S1–S11, M1–M10, D1–D7).
2. **Tests** de toda la superficie tocada en el mismo cambio; no diluir los gates del perfil §5.
3. **Verificación local** proporcional al riesgo, con los comandos del perfil §4: `npm run typecheck`,
   `npm run lint`, `npm run format:check` y `npx vitest run <patrón>` en cada fase; `npm test`,
   `npm run test:coverage`, `npm run build` y `npm run build:budget` al cerrar fases grandes y el
   programa. **La fase A es la que crea estos scripts**: hasta que exista `package.json`, decir qué
   se ha podido ejecutar y qué no, en lugar de fingir que se ejecutó.
4. **Loop subagente `goal-reviewer`** (persona de corrección) sobre el diff de la fase:
   - **Implementar íntegramente todas** las objeciones, sugerencias y nits que devuelva (sin
     cherry-pick, sin «lo dejamos en deuda»), salvo que el hallazgo sea **demostrablemente** fuera
     del alcance del doc 00 o un falso positivo con evidencia registrada.
   - Relanzar sobre el diff actualizado.
   - **Repetir** hasta ronda con **cero** ítems accionables de cualquier severidad.
5. **Loop subagente `goal-code-reviewer`** (persona de mantenibilidad) sobre el mismo alcance:
   - **Implementar íntegramente todas** las objeciones, sugerencias y nits.
   - Relanzar. **Repetir** hasta ronda limpia.
6. **Puerta de misma foto:** si el paso 5 tocó código, la ronda limpia del paso 4 caducó → volver al
   paso 4. Ambos subagentes deben tener su última ronda limpia sobre el **mismo hash** del diff de
   la fase.
7. **Puerta humana** (perfil §9 fases supervisadas): parar, informar del alcance, de la
   verificación ejecutada y de las rondas, y esperar go-ahead. No commitear hasta que el humano lo
   diga.
8. **Solo entonces:** crear los **commits** de la fase (Conventional Commits, perfil §10; sin
   secretos; sin amend de commits ajenos). Sin push, sin PR.
9. **Solo entonces** iniciar la fase siguiente. **Prohibido** empezar la fase N+1 con hallazgos
   abiertos, con un solo subagente limpio, o sin los commits de la fase N.

### Definición de ronda limpia

Una ronda está limpia **solo si** el subagente no devuelve ninguna objeción, ninguna sugerencia de
cambio y ningún nit. `VERDICT: CLEAN` / lista vacía → limpio. **Cualquier** ítem accionable → no
limpio: aplicar y re-ejecutar el **mismo** subagente.

### Límites de convergencia

- Máximo **5 rondas** por subagente y fase (perfil §9). Al agotarlas: parar, listar los hallazgos
  abiertos y pedir decisión al humano. Nunca declarar limpio por cansancio.
- Si una ronda devuelve el mismo conjunto `(file:line, severidad)` que la anterior, el loop no
  converge: parar y escalar en vez de reaplicar.
- Rechazar un hallazgo exige evidencia verificable, registrada en el estado del run y en el body del
  commit de la fase. Un hallazgo rechazado dos veces se escala, no se rechaza otra vez.

### Si los dos subagentes se contradicen

1. Preferir la interpretación que **cumple el doc 00** y la cadena de autoridad del perfil §2.
2. Aplicar ambas si son compatibles.
3. Si son mutuamente excluyentes: implementar la que preserve los invariantes del perfil §7 y el
   DoD de la fase; documentar la otra en el body del commit como «considerado / no aplicado por
   conflicto con doc 00 §X».

### Reglas globales del goal

- **No push / no PR** salvo que el humano lo pida explícitamente después (perfil §10).
- **No reabrir** las decisiones cerradas del doc 00 §2.
- **No bajar** umbrales de los gates del perfil §5 ni ampliar excludes para «pasarlos».
- **No tocar** las zonas protegidas del perfil §6 salvo los paths que el doc 00 §2 C3 autoriza:
  crear `src/`, `public/` fuera de `assets-origen/`, `index.html`, configuración en la raíz y `docs/`.
- **Invariantes del perfil §7** aplicables: I1, I2, I3, I4, I5, I6, I7, I8, I9 — este documento
  **crea los mecanismos** que los hacen cumplibles; no romperlos ni dejar que se rompan.
- **Idioma y comentarios** según perfil §1: textos de usuario en `es-ES` con tratamiento de usted,
  identificadores en inglés, comentarios escasos y solo del porqué.
- Si el contexto se compacta o la sesión se reinicia: **continuar** desde el worktree
  (`/goal --resume`); no resetear ni reescribir la feature desde cero.
- **No saltar fases.** No marcar el programa completo si una fase quedó a medias.

---

## 2. Bloque GOAL (copiar tal cual)

```text
GOAL: Implementar al 100 % la funcionalidad canónica de docs/product/00-fundacion-sistema-diseno.md (andamiaje Vite+React+TS, sistema de diseño derivado de la marca real, primitivas GSAP/Lenis con limpieza verificada, y shell navegable con CTA persistente), cumpliendo todos los gates, decisiones cerradas y criterios de hecho del documento, hasta el desarrollo completo en el HEAD actual del worktree.

AUTORIDAD
- Producto y alcance: docs/product/00-fundacion-sistema-diseno.md (leer completo antes de codificar; no reabrir §2 decisiones C1-C5, F1-F8, S1-S11, M1-M10, D1-D7).
- Ingeniería: agent-docs/goal-profile.md (comandos §4, gates §5, zonas protegidas §6, invariantes §7, arquitectura §8, git §10) + AGENTS.md + content/ como canon de contenido.
- Roadmap a actualizar al cerrar: docs/product/roadmap.md §2 fila 00.
- Deuda: docs/debt/technical-debt.md — al final registrar las filas del doc 00 §12 que queden sin cubrir.
- Relacionado ya hecho: ninguno. Este es el primer documento del programa; todos los demás dependen de él.

ORDEN DE FASES (doc 00 §7) — secuencial, sin saltar

FASE A — Andamiaje del proyecto
- package.json con React 19, Vite 6, TypeScript strict, Vitest, RTL, vitest-axe, ESLint 9 flat config, Prettier y los scripts del perfil §4.
- tsconfig.json strict con noUncheckedIndexedAccess y exactOptionalPropertyTypes; alias @/ declarado a la vez en tsconfig.json y vite.config.ts (F4).
- vite.config.ts con manualChunks que aísla three/@react-three/postprocessing (F7, I9).
- vitest.config.ts con jsdom, setupFiles de RTL y axe, y coverage limitado al alcance del perfil §5.
- src/lib/env.ts tipado y validado; .env.example con las cuatro claves y sin valores (F5, I8).
- src/lib/format.ts y src/lib/roman.ts como funciones puras con sus tests.
- render.yaml estático con reescritura SPA y cabeceras de seguridad (F6).
- index.html con lang="es-ES" y precarga de las dos fuentes.
- scripts/check-budget.mjs para npm run build:budget (F7).
- Tests FND-01 a FND-04 y FND-14 (doc 00 §3.8).
- DoD fase: doc 00 §7 Fase A.

FASE B — Sistema de diseño
- src/styles/tokens.css con la paleta de S1-S3, escala tipográfica S7 y los tres estados de tema de S5.
- src/lib/tokens.ts reexportando los tokens para consumo en JS.
- Cinzel e Inter autoalojadas en public/fonts/ con subconjunto latino y métricas de respaldo (S6).
- src/styles/base.css: reset, tipografía base, ancho de lectura, foco visible.
- Primitivas S8-S11: RomanNumeral, DualFigure, StatFigure, CountUp, PullQuote, Disclaimer, PendingValue.
- Página de muestra /design con texto de relleno explícitamente marcado (C5).
- Tests FND-03, FND-09, FND-10, FND-11, FND-12.
- DoD fase: doc 00 §7 Fase B + §8.1 en lo relativo a paleta, tipografía y primitivas.

FASE C — Motor de movimiento
- MotionProvider con instancia única de Lenis conectada al ticker de GSAP y a ScrollTrigger.update, con lagSmoothing(0) (M3).
- src/motion/types.ts con el contrato Choreograph (M4).
- useReducedMotionSafe() reactivo al cambio de la media query (M6).
- useGsapScene() según el pseudocódigo del doc 00 §3.3, con gsap.context() y revert() (M5, I5).
- useScrollProgress() como única fuente del progreso global (M10).
- Componente Scene con reserva de altura, fondo por acto y fallback (M7, M9, I9).
- Escena de muestra en /design que ejercita pin, scrub, reduced-motion y desmontaje.
- Tests FND-05, FND-06, FND-07, FND-08.
- DoD fase: doc 00 §7 Fase C + §8.1 en lo relativo al motor.

FASE D — Shell de aplicación
- src/app/sections.ts con el manifiesto tipado (D4), poblado con las entradas de los siete actos.
- Router con la home y una ruta de detalle marcador; scroll al principio en cada navegación (F8).
- Barra de navegación con aparición al salir del hero, 5 entradas agrupadas, sección activa y compensación de altura al saltar a un ancla (D1).
- Componente Milestone: el miliario con marcas por acto en numeral romano (D2).
- CTA persistente con el texto canónico de D3 («Reservar sesión privada»).
- Footer con la estructura de content/secciones/08-cta-contacto.md usando PendingValue (D5, I2).
- Error boundary por ruta (D6) y enlace de salto al contenido (D7).
- Fondo del documento transicionando por acto según el progreso global (M8).
- Tests FND-11 y FND-13.
- DoD fase: doc 00 §7 Fase D + resto de §8.1.

FASE E — Cierre documental y gates globales
- Marcar DoD en doc 00 §8 y roadmap §2 fila 00 de forma honesta («hecho en branch»).
- Registrar la deuda del doc 00 §12 en docs/debt/technical-debt.md, incluido el bloqueo B-04 (logotipo sin vectorial).
- Ejecutar los gates del perfil §5 y dejarlos en verde de verdad, incluido FND-15 (presupuesto de bundle).
- Limpieza residual: dependencias no usadas, tokens huérfanos, exportaciones muertas.
- DoD programa: doc 00 §8 Global + fases A-D cerradas.

PROTOCOLO OBLIGATORIO AL FINAL DE CADA FASE (A, B, C, D, E)
1) Implementación + tests de la fase.
2) Verificación local con los comandos del perfil §4 (cobertura y build al cerrar D y E; en A, decir qué scripts existen ya y cuáles no).
3) LOOP subagente goal-reviewer sobre el diff de la fase:
   - Aplicar TODAS las objeciones, sugerencias y nits devueltas.
   - Re-ejecutar hasta ronda LIMPIA (cero ítems). Máx. 5 rondas; luego escalar.
4) LOOP subagente goal-code-reviewer sobre el mismo alcance:
   - Aplicar TODAS las objeciones, sugerencias y nits devueltas.
   - Re-ejecutar hasta ronda LIMPIA. Máx. 5 rondas; luego escalar.
5) Si (4) tocó código, repetir (3): ambos deben quedar limpios sobre el MISMO estado del código.
6) Puerta humana (perfil §9 fases supervisadas): parar, informar, esperar go-ahead. No commitear hasta que el humano lo diga.
7) Solo entonces: commits de la fase (Conventional Commits; no push; no PR).
8) Solo entonces: fase siguiente. Si un re-check posterior encuentra regresión, no avanzar hasta nueva ronda limpia + commits de fix.

RESTRICCIONES
- No push, no abrir PR, no force-push, no git reset --hard, no descartar trabajo ajeno.
- No reabrir decisiones del doc 00 §2.
- No bajar umbrales de gates ni ampliar excludes.
- No tocar las zonas protegidas del perfil §6: content/, public/assets-origen/, el PDF del dossier, goal-loop-kit/, agent-docs/goal-loop.md, agent-docs/templates/, .grok/agents/ ni .grok/skills/. Solo lo autorizado por el doc 00 §2 C3.
- No romper los invariantes del perfil §7: I1 a I9.
- No renderizar ninguna escena de contenido del dossier: este documento crea el suelo, no las escenas (C5). La página /design usa texto de relleno explícitamente marcado.
- No publicar ningún teléfono ni dominio: el footer usa PendingValue (I2, doc 00 D5).
- No usar scroll-snap duro: la paginación es pin + scrub (M2).
- Ningún componente puede crear un ScrollTrigger fuera de useGsapScene (M5, I5).
- Ningún color literal fuera de src/styles/tokens.css (S4).
- Ningún import de three/@react-three/postprocessing en el chunk de entrada (I9, F7).
- Idioma y comentarios según perfil §1.
- Continuar desde el worktree actual si hay progreso parcial; no reiniciar la feature.
- No empezar la fase N+1 sin commits de la fase N tras ambos loops limpios.

CRITERIO DE COMPLETITUD DEL GOAL
El goal solo está completo cuando las fases A-E están implementadas, cada una pasó el protocolo de §1 (implementación, tests, dos loops limpios, misma foto, puerta humana, commits); los DoD del doc 00 §8 se cumplen en código y tests; los quince tests FND-01 a FND-15 existen y pasan; los gates del perfil §5 están en verde; y roadmap, deuda y doc 00 reflejan el estado real.

ENTREGABLE FINAL
Resumen por fase: qué se hizo, commits (hash + mensaje), comandos de verificación ejecutados con su resultado, número de rondas de cada subagente hasta limpio, y residuos o deuda documentada.
```

---

## 3. Variantes cortas (una fase)

Usar solo si el humano pide acotar. **Mismo protocolo que §1** (incluida la puerta humana del perfil §9). No push/PR.

### 3.1 Solo Fase A

```text
GOAL: Completar solo la FASE A de docs/product/00-fundacion-sistema-diseno.md (andamiaje: Vite, TS strict, Vitest, ESLint, env, render.yaml, presupuesto de bundle). Leer doc 00 §1, §2.2, §3.2, §3.3, §7 Fase A y agent-docs/goal-profile.md. Tests FND-01 a FND-04 y FND-14. Al terminar: protocolo de §1. No push/PR. No implementar tokens, primitivas, motor de movimiento ni shell.
```

### 3.2 Solo Fase B

```text
GOAL: Completar solo la FASE B de docs/product/00-fundacion-sistema-diseno.md (sistema de diseño: tokens, tipografía, once primitivas, página /design). Leer doc 00 §2.3, §3.7, §7 Fase B y agent-docs/goal-profile.md. Tests FND-03, FND-09, FND-10, FND-11, FND-12. Mismo protocolo que §1. No push/PR. Requiere la Fase A ya en el branch.
```

### 3.3 Solo Fase C

```text
GOAL: Completar solo la FASE C de docs/product/00-fundacion-sistema-diseno.md (motor de movimiento: Lenis + ScrollTrigger, useGsapScene, Scene). Leer doc 00 §2.4, §3.3, §3.6, §7 Fase C y agent-docs/goal-profile.md. Tests FND-05, FND-06, FND-07, FND-08. Mismo protocolo que §1. No push/PR. Requiere las Fases A y B ya en el branch.
```

### 3.4 Solo Fase D

```text
GOAL: Completar solo la FASE D de docs/product/00-fundacion-sistema-diseno.md (shell: router, navegación, miliario, CTA, footer, error boundary). Leer doc 00 §2.5, §3.2, §7 Fase D y agent-docs/goal-profile.md. Tests FND-11 y FND-13. Mismo protocolo que §1. No push/PR. Requiere las Fases A, B y C ya en el branch.
```

### 3.5 Solo Fase E

```text
GOAL: Completar solo la FASE E de docs/product/00-fundacion-sistema-diseno.md (cierre documental y gates). Marcar DoD en doc 00 §8 y roadmap fila 00; registrar la deuda de §12 en docs/debt/technical-debt.md; ejecutar los cinco gates del perfil §5 incluido FND-15. Mismo protocolo que §1. No push/PR. Requiere las Fases A a D cerradas.
```

---

## 4. Subagentes a invocar

| Paso | Subagente (`subagent_type`) | Condición de salida |
|------|-----------------------------|---------------------|
| Review de fase | `goal-reviewer` | Cero objeciones, sugerencias y nits |
| Code review de fase | `goal-code-reviewer` | Cero objeciones, sugerencias y nits |
| Puerta de fase | — | Ambos limpios sobre el mismo hash de diff |

**Orden fijo por fase:** el protocolo de §1 (reviewer → code-reviewer → misma foto → puerta humana si perfil §9 → commit). No invertir el orden. Repetir cada subagente en bucle hasta cero hallazgos accionables,
aplicando **todas** las correcciones en el mismo worktree antes de la siguiente invocación.

---

## 5. Commits sugeridos (orientativos)

Commits lógicos **tras** las rondas limpias de la fase, no antes. Conventional Commits (perfil §10).

| Fase | Mensaje orientativo |
|------|---------------------|
| A | `chore(setup): andamiar proyecto Vite + React + TypeScript con Vitest y gates` |
| B | `feat(design): añadir tokens, tipografía y primitivas del sistema de diseño` |
| C | `feat(motion): añadir motor de scroll con Lenis, ScrollTrigger y useGsapScene` |
| D | `feat(shell): añadir router, navegación con miliario, CTA persistente y footer` |
| E | `docs(setup): marcar DoD y registrar deuda de la fundación` |

Al ser el primer commit del repo no hay estilo previo que consultar; a partir de aquí,
`git log --oneline -20` fija la referencia.

---

## 6. Checklist rápido del agente (por fase)

```text
[ ] Alcance de la fase leído en el doc 00
[ ] Perfil del proyecto leído (§4 comandos, §5 gates, §6 zonas, §7 invariantes)
[ ] Código + tests de la fase
[ ] Verificación local ejecutada (comandos reales del perfil §4)
[ ] goal-reviewer → aplicar todo → goal-reviewer … hasta limpio
[ ] goal-code-reviewer → aplicar todo → goal-code-reviewer … hasta limpio
[ ] Ambos limpios sobre la misma foto del código
[ ] Commits de fase (sin push, sin PR)
[ ] No se ha iniciado la fase siguiente antes de lo anterior
```

---

*Generado para delegación GOAL. La autoridad de producto sigue siendo el doc 00, no este prompt.*

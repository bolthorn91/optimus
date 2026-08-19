# GOAL prompt — Acto III — La asimetría territorial (doc 03)

**Uso:** `/goal docs/product/03-acto-iii-asimetria-territorial-goal-prompt.md`, o copiar el bloque `GOAL` de §2 a una sesión de implementación.
**Canon de producto:** [`03-acto-iii-asimetria-territorial.md`](03-acto-iii-asimetria-territorial.md).
**Perfil de proyecto:** [`agent-docs/goal-profile.md`](../../agent-docs/goal-profile.md) — invariantes §7 aplicables: I1, I3, I4, I5, I9.
**Roadmap:** [`roadmap.md`](roadmap.md) §2, fila 03.
**Branch de trabajo esperado:** el HEAD actual del worktree. No inventar rama.
**Harness:** `AGENTS.md`, `content/` (canon de contenido), `agent-docs/goal-profile.md`.
**Loop:** [`agent-docs/goal-loop.md`](../../agent-docs/goal-loop.md).

---

## 1. Protocolo de fase (obligatorio en cada fase A–E)

Para **cada** fase, en este orden **estricto**:

1. **Implementar** el alcance de la fase según el doc 03 (sin reabrir las decisiones §2: C1-C5, F1-F10, S1-S9, D1-D2).
2. **Tests** de toda la superficie tocada en el mismo cambio; no diluir los gates del perfil §5.
3. **Verificación local** proporcional al riesgo, con los comandos del perfil §4: `npm run typecheck`,
   `npm run lint`, `npm run format:check` y `npx vitest run <patrón>` en cada fase; `npm test`,
   `npm run test:coverage`, `npm run build` y `npm run build:budget` al cerrar fases grandes y el
   programa.
4. **Loop subagente `goal-reviewer`** (persona de corrección) sobre el diff de la fase:
   - **Implementar íntegramente todas** las objeciones, sugerencias y nits que devuelva (sin
     cherry-pick, sin «lo dejamos en deuda»), salvo que el hallazgo sea **demostrablemente** fuera
     del alcance del doc 03 o un falso positivo con evidencia registrada.
   - Relanzar sobre el diff actualizado.
   - **Repetir** hasta ronda con **cero** ítems accionables de cualquier severidad.
5. **Loop subagente `goal-code-reviewer`** (persona de mantenibilidad) sobre el mismo alcance:
   - **Implementar íntegramente todas** las objeciones, sugerencias y nits.
   - Relanzar. **Repetir** hasta ronda limpia.
6. **Puerta de misma foto:** si el paso 5 tocó código, la ronda limpia del paso 4 caducó → volver al
   paso 4. Ambos subagentes deben tener su última ronda limpia sobre el **mismo hash** del diff de
   la fase.
7. **Solo entonces:** crear los **commits** de la fase (Conventional Commits, perfil §10; sin
   secretos; sin amend de commits ajenos). Sin push, sin PR.
8. **Solo entonces** iniciar la fase siguiente. **Prohibido** empezar la fase N+1 con hallazgos
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

1. Preferir la interpretación que **cumple el doc 03** y la cadena de autoridad del perfil §2.
2. Aplicar ambas si son compatibles.
3. Si son mutuamente excluyentes: implementar la que preserve los invariantes del perfil §7 y el
   DoD de la fase; documentar la otra en el body del commit como «considerado / no aplicado por
   conflicto con doc 03 §X».

### Reglas globales del goal

- **No push / no PR** salvo que el humano lo pida explícitamente después (perfil §10).
- **No reabrir** las decisiones cerradas del doc 03 §2.
- **No bajar** umbrales de los gates del perfil §5 ni ampliar excludes para «pasarlos».
- **No tocar** las zonas protegidas del perfil §6 salvo los paths que el doc 03 §2 C3 autoriza:
  crear `src/scenes/03-asimetria-territorial/`, `src/three/` y texturas derivadas en `public/textures/`.
- **Invariantes del perfil §7** aplicables a esta feature: I1, I3, I4, I5, I9 — no romperlos ni dejar que
  se rompan en el código tocado.
- **Idioma y comentarios** según perfil §1: textos de usuario en `es-ES` con tratamiento de usted,
  identificadores en inglés, comentarios escasos y solo del porqué.
- Si el contexto se compacta o la sesión se reinicia: **continuar** desde el worktree
  (`/goal --resume`); no resetear ni reescribir la feature desde cero.
- **No saltar fases.** No marcar el programa completo si una fase quedó a medias.

---

## 2. Bloque GOAL (copiar tal cual)

```text
GOAL: Implementar al 100 % la funcionalidad canónica de docs/product/03-acto-iii-asimetria-territorial.md (escena WebGL donde el terminador solar barre España y Argentina mientras se encienden las luces urbanas y los contadores de superficie, población y densidad cierran en sus valores exactos, más las comparativas territorial y bursátil), cumpliendo todos los gates, decisiones cerradas y criterios de hecho del documento, hasta el desarrollo completo en el HEAD actual del worktree.

AUTORIDAD
- Producto y alcance: docs/product/03-acto-iii-asimetria-territorial.md (leer completo antes de codificar; no reabrir §2 decisiones C1-C5, F1-F10, S1-S9, D1-D2).
- Ingeniería: agent-docs/goal-profile.md (comandos §4, gates §5, zonas protegidas §6, invariantes §7, arquitectura §8, git §10) + AGENTS.md + content/ como canon de contenido.
- Roadmap a actualizar al cerrar: docs/product/roadmap.md §2 fila 03.
- Deuda: docs/debt/technical-debt.md — al final registrar las filas del doc 03 §12 que queden sin cubrir.
- Relacionado ya hecho (no reimplementar): docs 00 (motor, Scene, CountUp, StatFigure) y 02 (ActSeal, patrón de escena anclada) — reutilizarlos. No reimplementar ninguno.

ORDEN DE FASES (doc 03 §7) — secuencial, sin saltar

FASE A — Lógica pura de contadores y datos
- src/lib/counter.ts con valorMostrado y el contrato de cierre exacto del doc 03 §3.3.
- src/scenes/03-asimetria-territorial/content.ts con las cifras exactas de content/03-datos-y-tablas.md y su tipado.
- src/scenes/03-asimetria-territorial/cities.ts con las ciudades y su weight documentado como parámetro visual, no como dato afirmado.
- choreographAct3 como función pura, con el desfase entre países del §3.3.
- Tests SAT-01 a SAT-05 y SAT-14 (doc 03 §3.8).
- DoD fase: doc 03 §7 Fase A. Cobertura de src/lib/counter.ts por encima del umbral del perfil §5.

FASE B — Comparativas estáticas y accesibles
- PairedComparison en src/components/, reutilizable por los documentos 04 y 06 (S1).
- TerritorialComparison y MarketComparison con sus filas literales.
- TerritorialModelDiagram: SVG esquemático del anillo peninsular con nodo central (S4).
- LandAdvantageCards con las tres ventajas de suelo (S5).
- Conclusión literal (incluida la frase incompleta de E-02, sin completar) y CTA intermedio.
- Registro de la escena en src/app/sections.ts.
- Tests CMP-01 a CMP-09 (doc 03 §4.6).
- DoD fase: doc 03 §7 Fase B + §8.2: todo el contenido del acto es legible y accesible sin ninguna animación.

FASE C — Escena WebGL día→noche
- src/three/LazyCanvas.tsx: convención de carga diferida y límite de devicePixelRatio a 2 (§3.6).
- Texturas diurna y nocturna por país, derivadas y optimizadas a WebP (F8).
- Shader con uniform nightAmount y frente de terminador que barre de este a oeste (F3, F4).
- Luces urbanas con retardo escalonado por ciudad y bloom mediante postprocessing (F5).
- NightfallFallback con las tres cifras completas: es contenido, no una pantalla de carga (F9).
- Ajuste de manualChunks para aislar el chunk WebGL.
- Tests SAT-09, SAT-11, SAT-12, SAT-15.
- DoD fase: doc 03 §7 Fase C: el chunk WebGL está aislado y por debajo de 400 KB gzip.

FASE D — Enlace scroll ↔ escena
- Anclaje y scrub con useGsapScene; altura 600vh.
- Cableado de nightAmount, terminatorX y cityGlow a los uniforms del shader.
- Contadores ligados a areaProgress, popProgress y densityProgress, con la densidad como revelación final (F6, F7).
- Control del fondo por la escena y devolución al sistema al salir (D1, D2).
- ActSeal de transición al acto IV.
- Tests SAT-06, SAT-07, SAT-08, SAT-10, SAT-13, CMP-10.
- DoD fase: doc 03 §7 Fase D + resto de §8.1.

FASE E — Cierre documental y gates globales
- Marcar DoD en doc 03 §8 y roadmap §2 fila 03 de forma honesta («hecho en branch»).
- Registrar la deuda del doc 03 §12 en docs/debt/technical-debt.md, incluidas E-02 (frase incompleta) y la verificación de licencia de la imagen satelital.
- Ejecutar los gates del perfil §5 con atención especial al presupuesto de bundle.
- Limpieza residual: texturas no usadas, uniforms muertos.
- DoD fase: doc 03 §8 Global + fases A-D cerradas. El chunk de entrada no ha crecido respecto al cierre del documento 02.


PROTOCOLO OBLIGATORIO AL FINAL DE CADA FASE (A, B, C, D, E)
1) Implementación + tests de la fase.
2) Verificación local con los comandos del perfil §4 (cobertura y build al cerrar fases grandes y el programa).
3) LOOP subagente goal-reviewer sobre el diff de la fase:
   - Aplicar TODAS las objeciones, sugerencias y nits devueltas.
   - Re-ejecutar hasta ronda LIMPIA (cero ítems). Máx. 5 rondas; luego escalar.
4) LOOP subagente goal-code-reviewer sobre el mismo alcance:
   - Aplicar TODAS las objeciones, sugerencias y nits devueltas.
   - Re-ejecutar hasta ronda LIMPIA. Máx. 5 rondas; luego escalar.
5) Si (4) tocó código, repetir (3): ambos deben quedar limpios sobre el MISMO estado del código.
6) Solo entonces: commits de la fase (Conventional Commits; no push; no PR).
7) Solo entonces: fase siguiente. Si un re-check posterior encuentra regresión, no avanzar hasta nueva ronda limpia + commits de fix.

RESTRICCIONES
- No push, no abrir PR, no force-push, no git reset --hard, no descartar trabajo ajeno.
- No reabrir decisiones del doc 03 §2.
- No bajar umbrales de gates ni ampliar excludes.
- No tocar las zonas protegidas del perfil §6 (content/, public/assets-origen/, el PDF del dossier, goal-loop-kit/, agent-docs/goal-loop.md, agent-docs/templates/, .claude/agents/, .claude/skills/) fuera de lo autorizado por el doc 03 §2 C3.
- No romper los invariantes del perfil §7: I1, I3, I4, I5, I9.
- La escala relativa entre países es REAL: Argentina ocupa 5,5 veces la superficie de España (F2). No normalizar el tamaño: la desproporción es el argumento.
- España debe anochecer antes que Argentina (F4, test SAT-03).
- Todo el WebGL (three, @react-three/*, postprocessing, shaders y texturas) va en chunk diferido y no supera 400 KB gzip (F10, I9, tests SAT-11 y SAT-12). El chunk de entrada del sitio no puede crecer.
- Las seis cifras de ambos países deben estar en el DOM desde el primer render, con progress = 0 (I4, test SAT-06).
- Los contadores cierran en su valor EXACTO, sin residuo de coma flotante (tests SAT-04 y SAT-05): 505.990, 2.780.400, 48.600.000, 45.900.000, 96,05 y 16,51.
- Una sola fuente de cifras en content.ts: la escena y la comparativa leen del mismo sitio (S3, test CMP-09).
- El canvas limita su devicePixelRatio a 2 (test SAT-15).
- Al desmontar se libera el contexto WebGL, se cancela el bucle de render y se revierte el contexto de GSAP (I5, test SAT-10).
- NO repetir el párrafo sobre la nueva ola migratoria (C5): pertenece al acto II (documento 02 D1). Es una decisión, no un olvido (errata E-01).
- NO completar la frase gramaticalmente incompleta de la conclusión (S8, errata E-02): se reproduce literal por I1 y la redacción correcta es decisión del cliente.
- Prohibido el emoji de bandera como único identificador de país (S2, test CMP-04): no renderiza en Windows.
- Idioma y comentarios según perfil §1.
- Continuar desde el worktree actual si hay progreso parcial; no reiniciar la feature.
- No empezar la fase N+1 sin commits de la fase N tras ambos loops limpios.

CRITERIO DE COMPLETITUD DEL GOAL
El goal solo está completo cuando las fases A-E están implementadas, cada una pasó (1) implementación+tests, (2) loop goal-reviewer limpio, (3) loop goal-code-reviewer limpio sobre la misma foto, (4) commits; los DoD del doc 03 §8 se cumplen en código y tests; los quince tests SAT-01 a SAT-15 y los diez CMP-01 a CMP-10 existen y pasan; los gates del perfil §5 están en verde; y roadmap, deuda y doc 03 reflejan el estado real.

ENTREGABLE FINAL
Resumen por fase: qué se hizo, commits (hash + mensaje), comandos de verificación ejecutados con su resultado, número de rondas de cada subagente hasta limpio, y residuos o deuda documentada.
```

---

## 3. Variantes cortas (una fase)

Usar solo si el humano pide acotar. **Mismo protocolo:** implementar → tests → loop `goal-reviewer`
limpio → loop `goal-code-reviewer` limpio → misma foto → commits. No push/PR.

### 3.1 Solo Fase A

```text
GOAL: Completar solo la FASE A de docs/product/03-acto-iii-asimetria-territorial.md (lógica pura de contadores con cierre exacto, cifras y coreografía). Leer doc 03 §7 Fase A y agent-docs/goal-profile.md. Tests SAT-01 a SAT-05 y SAT-14. Al terminar: loop goal-reviewer hasta limpio (aplicar TODO), luego loop goal-code-reviewer hasta limpio (aplicar TODO), re-verificar goal-reviewer si hubo cambios, luego commits. No push/PR. No implementar WebGL ni comparativas.
```

### 3.2 Solo Fase B

```text
GOAL: Completar solo la FASE B de docs/product/03-acto-iii-asimetria-territorial.md (comparativas territorial y bursátil estáticas con PairedComparison reutilizable). Leer doc 03 §7 Fase B y agent-docs/goal-profile.md. Tests CMP-01 a CMP-09. Al terminar: loop goal-reviewer hasta limpio (aplicar TODO), luego loop goal-code-reviewer hasta limpio (aplicar TODO), re-verificar goal-reviewer si hubo cambios, luego commits. No push/PR. Puede adelantarse a la Fase C.
```

### 3.3 Solo Fase C

```text
GOAL: Completar solo la FASE C de docs/product/03-acto-iii-asimetria-territorial.md (escena WebGL día→noche con su fallback y su chunk aislado). Leer doc 03 §7 Fase C y agent-docs/goal-profile.md. Tests SAT-09, SAT-11, SAT-12 y SAT-15. Al terminar: loop goal-reviewer hasta limpio (aplicar TODO), luego loop goal-code-reviewer hasta limpio (aplicar TODO), re-verificar goal-reviewer si hubo cambios, luego commits. No push/PR. Requiere la Fase A ya en el branch.
```

### 3.4 Solo Fase D

```text
GOAL: Completar solo la FASE D de docs/product/03-acto-iii-asimetria-territorial.md (enlace scroll ↔ escena: uniforms, contadores y control del fondo). Leer doc 03 §7 Fase D y agent-docs/goal-profile.md. Tests SAT-06, SAT-07, SAT-08, SAT-10, SAT-13 y CMP-10. Al terminar: loop goal-reviewer hasta limpio (aplicar TODO), luego loop goal-code-reviewer hasta limpio (aplicar TODO), re-verificar goal-reviewer si hubo cambios, luego commits. No push/PR. Requiere las Fases A, B y C ya en el branch.
```

### 3.5 Solo Fase E

```text
GOAL: Completar solo la FASE E de docs/product/03-acto-iii-asimetria-territorial.md (cierre documental y gates). Leer doc 03 §7 Fase E y agent-docs/goal-profile.md. Ejecutar los cinco gates del perfil §5, con atención al presupuesto de bundle. Al terminar: loop goal-reviewer hasta limpio (aplicar TODO), luego loop goal-code-reviewer hasta limpio (aplicar TODO), re-verificar goal-reviewer si hubo cambios, luego commits. No push/PR. Requiere las Fases A a D cerradas.
```

---

## 4. Subagentes a invocar

| Paso | Subagente (`subagent_type`) | Condición de salida |
|------|-----------------------------|---------------------|
| Review de fase | `goal-reviewer` | Cero objeciones, sugerencias y nits |
| Code review de fase | `goal-code-reviewer` | Cero objeciones, sugerencias y nits |
| Puerta de fase | — | Ambos limpios sobre el mismo hash de diff |

**Orden fijo por fase:** `goal-reviewer` (loop) → `goal-code-reviewer` (loop) → misma foto →
`git commit`. No invertir el orden. Repetir cada subagente en bucle hasta cero hallazgos accionables,
aplicando **todas** las correcciones en el mismo worktree antes de la siguiente invocación.

---

## 5. Commits sugeridos (orientativos)

Commits lógicos **tras** las rondas limpias de la fase, no antes. Conventional Commits (perfil §10).
Consultar `git log --oneline -20` para el estilo real ya establecido en el repo.

| Fase | Mensaje orientativo |
|------|---------------------|
| A | `feat(act3): añadir contadores con cierre exacto y coreografía de la asimetría` |
| B | `feat(act3): añadir comparativas territorial y bursátil con componente pareado` |
| C | `feat(act3): añadir la escena satelital día→noche en chunk diferido` |
| D | `feat(act3): ligar el scroll a la caída de la noche y a los contadores` |
| E | `docs(act3): marcar DoD y registrar deuda del acto III` |

---

## 6. Checklist rápido del agente (por fase)

```text
[ ] Alcance de la fase leído en el doc 03
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

*Generado para delegación GOAL. La autoridad de producto sigue siendo el doc 03, no este prompt.*

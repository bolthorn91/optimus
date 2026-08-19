# GOAL prompt — Adaptación móvil (doc 08)

**Uso:** `/goal docs/product/08-responsive-movil-goal-prompt.md`, o copiar el bloque `GOAL` de §2 a una sesión de implementación.
**Canon de producto:** [`08-responsive-movil.md`](08-responsive-movil.md).
**Perfil de proyecto:** [`agent-docs/goal-profile.md`](../../agent-docs/goal-profile.md) — invariantes §7 aplicables: I1, I3, I4, I5, I9.
**Roadmap:** [`roadmap.md`](roadmap.md) §2, fila 08.
**Branch de trabajo esperado:** el HEAD actual del worktree. No inventar rama.
**Harness:** `AGENTS.md`, `content/` (canon de contenido), `agent-docs/goal-profile.md`.
**Loop:** [`agent-docs/goal-loop.md`](../../agent-docs/goal-loop.md).

---

## 1. Protocolo de fase (obligatorio en cada fase A–E)

Para **cada** fase, en este orden **estricto**:

1. **Implementar** el alcance de la fase según el doc 08 (sin reabrir las decisiones §2: C1-C6, F1-F8, S1-S7, D1-D5, G1-G6).
2. **Tests** de toda la superficie tocada en el mismo cambio; no diluir los gates del perfil §5.
3. **Verificación local** proporcional al riesgo, con los comandos del perfil §4: `npm run typecheck`,
   `npm run lint`, `npm run format:check` y `npx vitest run <patrón>` en cada fase; `npm test`,
   `npm run test:coverage`, `npm run build` y `npm run build:budget` al cerrar fases grandes y el
   programa.
4. **Loop subagente `goal-reviewer`** (persona de corrección) sobre el diff de la fase:
   - **Implementar íntegramente todas** las objeciones, sugerencias y nits que devuelva (sin
     cherry-pick, sin «lo dejamos en deuda»), salvo que el hallazgo sea **demostrablemente** fuera
     del alcance del doc 08 o un falso positivo con evidencia registrada.
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

1. Preferir la interpretación que **cumple el doc 08** y la cadena de autoridad del perfil §2.
2. Aplicar ambas si son compatibles.
3. Si son mutuamente excluyentes: implementar la que preserve los invariantes del perfil §7 y el
   DoD de la fase; documentar la otra en el body del commit como «considerado / no aplicado por
   conflicto con doc 08 §X».

### Reglas globales del goal

- **No push / no PR** salvo que el humano lo pida explícitamente después (perfil §10).
- **No reabrir** las decisiones cerradas del doc 08 §2.
- **No bajar** umbrales de los gates del perfil §5 ni ampliar excludes para «pasarlos».
- **No tocar** las zonas protegidas del perfil §6 salvo los paths que el doc 08 §2 C3 autoriza:
  modificar cualquier fichero de `src/` **para adaptar presentación**, nunca para cambiar contenido ni coreografía; crear `src/motion/responsive.ts` y `src/motion/useViewport.ts`.
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
GOAL: Implementar al 100 % la funcionalidad canónica de docs/product/08-responsive-movil.md (shell móvil con CTA fijo, adaptación de los siete actos y del simulador a interacción táctil, y política explícita de degradación de las escenas pesadas), cumpliendo todos los gates, decisiones cerradas y criterios de hecho del documento, hasta el desarrollo completo en el HEAD actual del worktree.

AUTORIDAD
- Producto y alcance: docs/product/08-responsive-movil.md (leer completo antes de codificar; no reabrir §2 decisiones C1-C6, F1-F8, S1-S7, D1-D5, G1-G6).
- Ingeniería: agent-docs/goal-profile.md (comandos §4, gates §5, zonas protegidas §6, invariantes §7, arquitectura §8, git §10) + AGENTS.md + content/ como canon de contenido.
- Roadmap a actualizar al cerrar: docs/product/roadmap.md §2 fila 08.
- Deuda: docs/debt/technical-debt.md — al final registrar las filas del doc 08 §12 que queden sin cubrir.
- Relacionado ya hecho (no reimplementar): docs 00 a 07 — este documento ADAPTA; no reescribe ni rediseña ninguna escena, componente ni contenido.

ORDEN DE FASES (doc 08 §7) — secuencial, sin saltar

FASE A — Auditoría, políticas y shell móvil
- Auditoría a 375 px de las ocho escenas y las trece páginas, con todo lo que desborda registrado.
- src/motion/responsive.ts con las ocho políticas del doc 08 §3.2 y resolveScenePolicy.
- src/motion/useViewport.ts con un solo matchMedia (§3.4).
- Sustitución de vh por svh/dvh en toda superficie a pantalla completa (F6).
- MobileNav, ProgressBar y StickyCta (F3, F4, F5).
- Área táctil mínima de 44x44 px y eliminación de dependencias de hover (F7, F8).
- Tests MOB-02 a MOB-05, MOB-08, MOB-09, MOB-10, MOB-17 (doc 08 §3.8).
- DoD fase: doc 08 §7 Fase A + §8.1 en lo relativo al shell y a las políticas.

FASE B — Actos I a III
- Acto I: canvas del factor demográfico en su estado final estático (S5); alturas reducidas (S2).
- Acto II: alturas reducidas y selector de período como control principal (S4).
- Acto III: fallback estático en móvil, sin montar WebGL (S3). Salda la deuda 03 §12.5.
- StackedComparison y DefinitionTable para las comparativas y tablas (D1, D2).
- Tests MOB-06, MOB-07, MOB-11, MOB-12.
- DoD fase: doc 08 §7 Fase B: los tres primeros actos entregan en móvil el mismo contenido que en escritorio.

FASE C — Actos IV y V
- Acto IV: reflujo vertical del diagrama del CDI verificado y ajustado (S6).
- Acto V: tarjetas apiladas con etiquetas internas repetidas (D3); modo scroll del simulador desactivado (G3).
- Deslizadores con área táctil, bloqueo del gesto vertical durante el arrastre y entrada numérica con inputmode (G1, G2).
- Gráfico legible y tabla año a año colapsable (G4).
- Tests MOB-13, MOB-14.
- DoD fase: doc 08 §7 Fase C.

FASE D — Actos VI y VII, formulario y detalle
- Actos VI-VII: cadenas de intermediación en vertical; glosario activado por pulsación (S6, F8).
- Formulario: type e inputmode correctos, tamaño de fuente >= 16 px para evitar el zoom automático, y CTA fijo que se aparta con el teclado virtual (G5, G6).
- Páginas de detalle: índice lateral como desplegable colapsado (D5).
- Barrido final de desbordamiento horizontal en todas las rutas.
- Tests MOB-01, MOB-15, MOB-16, MOB-18, MOB-19, MOB-20, MOB-21, MOB-22.
- DoD fase: doc 08 §7 Fase D + resto de §8.1.

FASE E — Cierre documental y gates globales
- Marcar DoD en doc 08 §8 y roadmap §2 fila 08 de forma honesta («hecho en branch»).
- Cerrar la deuda 03 §12.5 (rendimiento de la escena WebGL en gama media), resuelta por S3, documentando su resolución.
- Registrar la deuda del doc 08 §12 en docs/debt/technical-debt.md.
- Ejecutar los gates del perfil §5 y dejarlos en verde de verdad.
- Limpieza residual: reglas CSS muertas, políticas de escena huérfanas.
- DoD fase: doc 08 §8 Global + fases A-D cerradas.


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
- No reabrir decisiones del doc 08 §2.
- No bajar umbrales de gates ni ampliar excludes.
- No tocar las zonas protegidas del perfil §6 (content/, public/assets-origen/, el PDF del dossier, goal-loop-kit/, agent-docs/goal-loop.md, agent-docs/templates/, .claude/agents/, .claude/skills/) fuera de lo autorizado por el doc 08 §2 C3.
- No romper los invariantes del perfil §7: I1, I3, I4, I5, I9.
- ADAPTAR NO ES REDISEÑAR (C5): si una escena no funciona en móvil se simplifica su PRESENTACIÓN, nunca su mensaje ni su contenido.
- El contenido textual observable debe ser IDÉNTICO a 375 px y a 1440 px en los siete actos (I4, test MOB-01). Es el invariante central de este documento.
- Ninguna ruta del sitio puede producir scroll horizontal a 375 px (test MOB-20).
- Sin ruta de contenido separada para móvil (C6): un solo contenido, dos presentaciones.
- Toda escena declara su política en src/motion/responsive.ts; ninguna decide por su cuenta (test MOB-03). Una escena sin política es error en desarrollo, nunca un comportamiento por defecto silencioso.
- prefers-reduced-motion MANDA sobre la política de escena: si el usuario lo pide, todas las escenas van en modo estático (test MOB-05).
- Toda superficie a pantalla completa usa svh o dvh, nunca vh (F6, test MOB-08): evita el salto de la barra del navegador móvil.
- Todo control interactivo con al menos 44x44 px de área efectiva (F7, test MOB-09).
- Ninguna información o acción puede depender exclusivamente de hover (F8, test MOB-10).
- Arrastrar un deslizador NO debe iniciar el scroll de la página (G1, test MOB-14).
- El CTA fijo se oculta mientras un campo del formulario tiene el foco, para no tapar el botón de envío (G6, test MOB-16).
- Ninguna tabla con scroll horizontal: se convierten en listas de definición apiladas (D2, test MOB-12).
- Escritorio debe seguir funcionando exactamente igual (test MOB-22): era la prioridad del cliente y no puede degradarse.
- Sin gestos propios de deslizamiento entre actos: compiten con el scroll nativo y rompen la accesibilidad.
- Sin PWA ni aplicación instalable: no aporta a un sitio de captación de una sola visita.
- Idioma y comentarios según perfil §1.
- Continuar desde el worktree actual si hay progreso parcial; no reiniciar la feature.
- No empezar la fase N+1 sin commits de la fase N tras ambos loops limpios.

CRITERIO DE COMPLETITUD DEL GOAL
El goal solo está completo cuando las fases A-E están implementadas, cada una pasó (1) implementación+tests, (2) loop goal-reviewer limpio, (3) loop goal-code-reviewer limpio sobre la misma foto, (4) commits; los DoD del doc 08 §8 se cumplen en código y tests; los veintidós tests MOB-01 a MOB-22 existen y pasan, y escritorio sigue intacto (MOB-22); los gates del perfil §5 están en verde; y roadmap, deuda y doc 08 reflejan el estado real.

ENTREGABLE FINAL
Resumen por fase: qué se hizo, commits (hash + mensaje), comandos de verificación ejecutados con su resultado, número de rondas de cada subagente hasta limpio, y residuos o deuda documentada.
```

---

## 3. Variantes cortas (una fase)

Usar solo si el humano pide acotar. **Mismo protocolo:** implementar → tests → loop `goal-reviewer`
limpio → loop `goal-code-reviewer` limpio → misma foto → commits. No push/PR.

### 3.1 Solo Fase A

```text
GOAL: Completar solo la FASE A de docs/product/08-responsive-movil.md (auditoría, políticas de escena, shell móvil y unidades de viewport). Leer doc 08 §7 Fase A y agent-docs/goal-profile.md. Tests MOB-02 a MOB-05, MOB-08, MOB-09, MOB-10 y MOB-17. Al terminar: loop goal-reviewer hasta limpio (aplicar TODO), luego loop goal-code-reviewer hasta limpio (aplicar TODO), re-verificar goal-reviewer si hubo cambios, luego commits. No push/PR. No adaptar todavía ninguna escena concreta.
```

### 3.2 Solo Fase B

```text
GOAL: Completar solo la FASE B de docs/product/08-responsive-movil.md (actos I a III, con el fallback del acto III y las tablas apiladas). Leer doc 08 §7 Fase B y agent-docs/goal-profile.md. Tests MOB-06, MOB-07, MOB-11 y MOB-12. Al terminar: loop goal-reviewer hasta limpio (aplicar TODO), luego loop goal-code-reviewer hasta limpio (aplicar TODO), re-verificar goal-reviewer si hubo cambios, luego commits. No push/PR. Requiere la Fase A ya en el branch.
```

### 3.3 Solo Fase C

```text
GOAL: Completar solo la FASE C de docs/product/08-responsive-movil.md (actos IV y V, con el simulador táctil). Leer doc 08 §7 Fase C y agent-docs/goal-profile.md. Tests MOB-13 y MOB-14. Al terminar: loop goal-reviewer hasta limpio (aplicar TODO), luego loop goal-code-reviewer hasta limpio (aplicar TODO), re-verificar goal-reviewer si hubo cambios, luego commits. No push/PR. Requiere la Fase A ya en el branch.
```

### 3.4 Solo Fase D

```text
GOAL: Completar solo la FASE D de docs/product/08-responsive-movil.md (actos VI y VII, formulario con teclado virtual y páginas de detalle). Leer doc 08 §7 Fase D y agent-docs/goal-profile.md. Tests MOB-01, MOB-15, MOB-16, MOB-18, MOB-19, MOB-20, MOB-21 y MOB-22. Al terminar: loop goal-reviewer hasta limpio (aplicar TODO), luego loop goal-code-reviewer hasta limpio (aplicar TODO), re-verificar goal-reviewer si hubo cambios, luego commits. No push/PR. Requiere las Fases A, B y C ya en el branch. Incluye el barrido final de desbordamiento.
```

### 3.5 Solo Fase E

```text
GOAL: Completar solo la FASE E de docs/product/08-responsive-movil.md (cierre documental, cierre de la deuda 03 §12.5 y gates). Leer doc 08 §7 Fase E y agent-docs/goal-profile.md. Ejecutar los cinco gates del perfil §5. Al terminar: loop goal-reviewer hasta limpio (aplicar TODO), luego loop goal-code-reviewer hasta limpio (aplicar TODO), re-verificar goal-reviewer si hubo cambios, luego commits. No push/PR. Requiere las Fases A a D cerradas.
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
| A | `feat(mobile): añadir shell móvil y políticas de degradación por escena` |
| B | `feat(mobile): adaptar los actos I a III a viewport estrecho` |
| C | `feat(mobile): adaptar el simulador y el diagrama del CDI a interacción táctil` |
| D | `feat(mobile): adaptar el formulario y las páginas de detalle a móvil` |
| E | `docs(mobile): marcar DoD, cerrar deuda de WebGL y registrar residuos` |

---

## 6. Checklist rápido del agente (por fase)

```text
[ ] Alcance de la fase leído en el doc 08
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

*Generado para delegación GOAL. La autoridad de producto sigue siendo el doc 08, no este prompt.*

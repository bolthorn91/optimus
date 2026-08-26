# GOAL prompt — Acto II — Seguridad global (doc 02)

**Uso:** `/goal docs/product/02-acto-ii-seguridad-global-goal-prompt.md`, o copiar el bloque `GOAL` de §2 a una sesión de implementación.
**Canon de producto:** [`02-acto-ii-seguridad-global.md`](02-acto-ii-seguridad-global.md).
**Perfil de proyecto:** [`agent-docs/goal-profile.md`](../../agent-docs/goal-profile.md) — invariantes §7 aplicables: I1, I3, I4, I5, I6, I9.
**Roadmap:** [`roadmap.md`](roadmap.md) §2, fila 02.
**Branch de trabajo esperado:** el HEAD actual del worktree. No inventar rama.
**Harness:** `AGENTS.md`, `content/` (canon de contenido), `agent-docs/goal-profile.md`.
**Loop:** [`agent-docs/goal-loop.md`](../../agent-docs/goal-loop.md).

---

## 1. Protocolo de fase (obligatorio en cada fase A–E)

Para **cada** fase, en este orden **estricto**:

1. **Implementar** el alcance de la fase según el doc 02 (sin reabrir las decisiones §2: C1-C5, F1-F11, S1-S5, D1-D3).
2. **Tests** de toda la superficie tocada en el mismo cambio; no diluir los gates del perfil §5.
3. **Verificación local** proporcional al riesgo, con los comandos del perfil §4: `npm run typecheck`,
   `npm run lint`, `npm run format:check` y `npx vitest run <patrón>` en cada fase; `npm test`,
   `npm run test:coverage`, `npm run build` y `npm run build:budget` al cerrar fases grandes y el
   programa.
4. **Loop subagente `goal-reviewer`** (persona de corrección) sobre el diff de la fase:
   - **Implementar íntegramente todas** las objeciones, sugerencias y nits que devuelva (sin
     cherry-pick, sin «lo dejamos en deuda»), salvo que el hallazgo sea **demostrablemente** fuera
     del alcance del doc 02 o un falso positivo con evidencia registrada.
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

1. Preferir la interpretación que **cumple el doc 02** y la cadena de autoridad del perfil §2.
2. Aplicar ambas si son compatibles.
3. Si son mutuamente excluyentes: implementar la que preserve los invariantes del perfil §7 y el
   DoD de la fase; documentar la otra en el body del commit como «considerado / no aplicado por
   conflicto con doc 02 §X».

### Reglas globales del goal

- **No push / no PR** salvo que el humano lo pida explícitamente después (perfil §10).
- **No reabrir** las decisiones cerradas del doc 02 §2.
- **No bajar** umbrales de los gates del perfil §5 ni ampliar excludes para «pasarlos».
- **No tocar** las zonas protegidas del perfil §6 salvo los paths que el doc 02 §2 C3 autoriza:
  crear `src/scenes/02-seguridad-global/` y los SVG derivados en `public/maps/`.
- **Invariantes del perfil §7** aplicables a esta feature: I1, I3, I4, I5, I6, I9 — no romperlos ni dejar que
  se rompan en el código tocado.
- **Idioma y comentarios** según perfil §1: textos de usuario en `es-ES` con tratamiento de usted,
  identificadores en inglés, comentarios escasos y solo del porqué.
- Si el contexto se compacta o la sesión se reinicia: **continuar** desde el worktree
  (`/goal --resume`); no resetear ni reescribir la feature desde cero.
- **No saltar fases.** No marcar el programa completo si una fase quedó a medias.

---

## 2. Bloque GOAL (copiar tal cual)

```text
GOAL: Implementar al 100 % la funcionalidad canónica de docs/product/02-acto-ii-seguridad-global.md (serie temporal de cuatro mapas mundiales de riesgo recorrida con el scroll, con leyenda accesible y tabla equivalente, más la subsección del factor climático), cumpliendo todos los gates, decisiones cerradas y criterios de hecho del documento, hasta el desarrollo completo en el HEAD actual del worktree.

AUTORIDAD
- Producto y alcance: docs/product/02-acto-ii-seguridad-global.md (leer completo antes de codificar; no reabrir §2 decisiones C1-C5, F1-F11, S1-S5, D1-D3).
- Ingeniería: agent-docs/goal-profile.md (comandos §4, gates §5, zonas protegidas §6, invariantes §7, arquitectura §8, git §10) + AGENTS.md + content/ como canon de contenido.
- Roadmap a actualizar al cerrar: docs/product/roadmap.md §2 fila 02.
- Deuda: docs/debt/technical-debt.md — al final registrar las filas del doc 02 §12 que queden sin cubrir.
- Relacionado ya hecho (no reimplementar): docs 00 (fundación) y 01 (ActSeal, patrón de escena anclada) — reutilizar sus primitivas y su patrón de coreografía. No reimplementar ninguno.

ORDEN DE FASES (doc 02 §7) — secuencial, sin saltar

FASE A — Cartografía vectorial y datos
- public/maps/world-base.svg: silueta mundial en proyección equirrectangular, optimizada y sin metadatos de editor (F2).
- src/scenes/02-seguridad-global/risk-data.ts con los niveles por región y período, derivados de los mapas originales y documentados como tal. Estado 2050 diferenciado y marcado como proyección (F6).
- RiskPattern con las cuatro tramas de accesibilidad (F9).
- RiskLegend reconstruida en HTML, con color y trama (F8).
- RiskTable con la tabla equivalente completa (F10).
- Tests MAP-06, MAP-07, MAP-13, MAP-14 (doc 02 §3.8).
- DoD fase: doc 02 §7 Fase A + §8.1 en lo relativo a datos, leyenda y tabla.

FASE B — Escena estática con selector
- Act2Scene estática: entradilla, RiskMap con un período fijo, leyenda, selector y tabla.
- PeriodSelector operable con teclado, cambiando el estado del mapa sin scroll (F11).
- Contenido tipado completo en content.ts, literal del dossier.
- Registro de la escena en src/app/sections.ts.
- Tests MAP-09, MAP-10, MAP-11.
- DoD fase: doc 02 §7 Fase B: la escena es completamente usable sin hacer scroll.

FASE C — Serie temporal con scrub
- choreographAct2 como función pura, con la interpolación de capas del doc 02 §3.3.
- Anclaje y scrub con useGsapScene; altura 500vh.
- Opacidad cruzada de las cuatro capas; contador de año discreto (F7); realce progresivo de Sudamérica (F4).
- Sincronización entre el selector manual y la posición de scroll (§3.6).
- Transición de fondo del acto (D2).
- Tests MAP-01, MAP-02, MAP-03, MAP-04, MAP-05, MAP-08, MAP-12, MAP-15.
- DoD fase: doc 02 §7 Fase C + resto de §8.1.

FASE D — Factor climático y cierre
- ClimateSection con las doce regiones escalonadas y el contador de S3.
- Atribución de fuentes visible como texto, sin logotipos (S5, I6).
- PullQuote de cierre del acto (D1). Aparece una sola vez en todo el sitio.
- ActSeal de transición al acto III.
- Tests CLI-01 a CLI-05 (doc 02 §4.6).
- DoD fase: doc 02 §7 Fase D + §8.2.

FASE E — Cierre documental y gates globales
- Marcar DoD en doc 02 §8 y roadmap §2 fila 02 de forma honesta («hecho en branch»).
- Registrar la deuda del doc 02 §12 en docs/debt/technical-debt.md, incluidos B-03 (mapa 2050), E-07 (afirmación climática) y la verificación de licencia de los mapas originales.
- Ejecutar los gates del perfil §5 y dejarlos en verde de verdad.
- Limpieza residual: SVG no usados, entradas huérfanas en risk-data.ts.
- DoD fase: doc 02 §8 Global + fases A-D cerradas.


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
6) Puerta humana (perfil §9 fases supervisadas): parar, informar, esperar go-ahead. No commitear hasta que el humano lo diga.
7) Solo entonces: commits de la fase (Conventional Commits; no push; no PR).
8) Solo entonces: fase siguiente. Si un re-check posterior encuentra regresión, no avanzar hasta nueva ronda limpia + commits de fix.

RESTRICCIONES
- No push, no abrir PR, no force-push, no git reset --hard, no descartar trabajo ajeno.
- No reabrir decisiones del doc 02 §2.
- No bajar umbrales de gates ni ampliar excludes.
- No tocar las zonas protegidas del perfil §6 (content/, public/assets-origen/, el PDF del dossier, goal-loop-kit/, agent-docs/goal-loop.md, agent-docs/templates/, .grok/agents/, .grok/skills/) fuera de lo autorizado por el doc 02 §2 C3.
- No romper los invariantes del perfil §7: I1, I3, I4, I5, I6, I9.
- Los cuatro mapas se redibujan como SVG vectorial (F1). NO usar los PNG de public/assets-origen/: son raster de 499x244 y se pixelan a pantalla completa.
- El estado 2050 debe marcarse visiblemente como PROYECCIÓN, nunca como dato observado (F6, test MAP-10). El PDF original duplica el mapa de «actualidad»; el bloqueo B-03 queda registrado en deuda.
- La suma de layerOpacity debe ser exactamente 1 en todo el recorrido (test MAP-02): es lo que impide que el mapa se vea lavado en mitad de una transición.
- Los cuatro niveles de riesgo deben distinguirse por TRAMA además de por color (F9, test MAP-07): el color solo no es accesible.
- La tabla equivalente de riesgo por región y período debe estar siempre en el DOM (F10, I4, test MAP-06).
- La escena debe ser completamente usable sin hacer scroll, con teclado (F11, test MAP-09).
- El año del contador solo puede tomar los valores 1985, 2015, 2026 y 2050; nunca un año intermedio inexistente (F7, test MAP-04).
- No suavizar, reformular ni suprimir el apartado de modificación climática (S4): se reproduce literal por I1 y la decisión es del cliente (errata E-07).
- Sin logotipos de ACLED, Global Guardian, Crisis24 ni NASA (I6, S5): la atribución es texto.
- La cita de cierre sobre la zona de paz aparece SOLO en este acto (D1): el documento 03 la omite por ser duplicado en el original (errata E-01).
- Idioma y comentarios según perfil §1.
- Continuar desde el worktree actual si hay progreso parcial; no reiniciar la feature.
- No empezar la fase N+1 sin commits de la fase N tras ambos loops limpios.

CRITERIO DE COMPLETITUD DEL GOAL
El goal solo está completo cuando las fases A-E están implementadas, cada una pasó el protocolo de §1 (implementación, tests, dos loops limpios, misma foto, puerta humana, commits); los DoD del doc 02 §8 se cumplen en código y tests; los quince tests MAP-01 a MAP-15 y los cinco CLI-01 a CLI-05 existen y pasan; los gates del perfil §5 están en verde; y roadmap, deuda y doc 02 reflejan el estado real.

ENTREGABLE FINAL
Resumen por fase: qué se hizo, commits (hash + mensaje), comandos de verificación ejecutados con su resultado, número de rondas de cada subagente hasta limpio, y residuos o deuda documentada.
```

---

## 3. Variantes cortas (una fase)

Usar solo si el humano pide acotar. **Mismo protocolo que §1** (incluida la puerta humana del perfil §9). No push/PR.

### 3.1 Solo Fase A

```text
GOAL: Completar solo la FASE A de docs/product/02-acto-ii-seguridad-global.md (cartografía vectorial, datos de riesgo, leyenda y tabla accesibles). Leer doc 02 §7 Fase A y agent-docs/goal-profile.md. Tests MAP-06, MAP-07, MAP-13 y MAP-14. Al terminar: protocolo de §1. No push/PR. No implementar la escena ni la animación.
```

### 3.2 Solo Fase B

```text
GOAL: Completar solo la FASE B de docs/product/02-acto-ii-seguridad-global.md (escena estática con selector de período usable sin scroll). Leer doc 02 §7 Fase B y agent-docs/goal-profile.md. Tests MAP-09, MAP-10 y MAP-11. Al terminar: protocolo de §1. No push/PR. Requiere la Fase A ya en el branch.
```

### 3.3 Solo Fase C

```text
GOAL: Completar solo la FASE C de docs/product/02-acto-ii-seguridad-global.md (serie temporal con scrub, contador de año y realce de Sudamérica). Leer doc 02 §7 Fase C y agent-docs/goal-profile.md. Tests MAP-01 a MAP-05, MAP-08, MAP-12 y MAP-15. Al terminar: protocolo de §1. No push/PR. Requiere las Fases A y B ya en el branch.
```

### 3.4 Solo Fase D

```text
GOAL: Completar solo la FASE D de docs/product/02-acto-ii-seguridad-global.md (factor climático, cita de cierre y sello de transición). Leer doc 02 §7 Fase D y agent-docs/goal-profile.md. Tests CLI-01 a CLI-05. Al terminar: protocolo de §1. No push/PR. Requiere las Fases A, B y C ya en el branch.
```

### 3.5 Solo Fase E

```text
GOAL: Completar solo la FASE E de docs/product/02-acto-ii-seguridad-global.md (cierre documental y gates). Leer doc 02 §7 Fase E y agent-docs/goal-profile.md. Ejecutar los cinco gates del perfil §5. Al terminar: protocolo de §1. No push/PR. Requiere las Fases A a D cerradas.
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
Consultar `git log --oneline -20` para el estilo real ya establecido en el repo.

| Fase | Mensaje orientativo |
|------|---------------------|
| A | `feat(act2): añadir cartografía vectorial de riesgo con leyenda y tabla accesibles` |
| B | `feat(act2): añadir escena de seguridad global con selector de período` |
| C | `feat(act2): recorrer la serie temporal de riesgo con scrub` |
| D | `feat(act2): añadir el factor climático y la cita de cierre del acto` |
| E | `docs(act2): marcar DoD y registrar deuda del acto II` |

---

## 6. Checklist rápido del agente (por fase)

```text
[ ] Alcance de la fase leído en el doc 02
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

*Generado para delegación GOAL. La autoridad de producto sigue siendo el doc 02, no este prompt.*

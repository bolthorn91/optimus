# GOAL prompt — Acto V — Los activos y el simulador de proyección (doc 05)

**Uso:** `/goal docs/product/05-acto-v-activos-simulador-goal-prompt.md`, o copiar el bloque `GOAL` de §2 a una sesión de implementación.
**Canon de producto:** [`05-acto-v-activos-simulador.md`](05-acto-v-activos-simulador.md).
**Perfil de proyecto:** [`agent-docs/goal-profile.md`](../../agent-docs/goal-profile.md) — invariantes §7 aplicables: I1, I3, I4, I5, I7, I9.
**Roadmap:** [`roadmap.md`](roadmap.md) §2, fila 05.
**Branch de trabajo esperado:** el HEAD actual del worktree. No inventar rama.
**Harness:** `AGENTS.md`, `content/` (canon de contenido), `agent-docs/goal-profile.md`.
**Loop:** [`agent-docs/goal-loop.md`](../../agent-docs/goal-loop.md).

---

## 1. Protocolo de fase (obligatorio en cada fase A–E)

Para **cada** fase, en este orden **estricto**:

1. **Implementar** el alcance de la fase según el doc 05 (sin reabrir las decisiones §2: C1-C5, F1-F7, S1-S11, E1-E5, D1-D2).
2. **Tests** de toda la superficie tocada en el mismo cambio; no diluir los gates del perfil §5.
3. **Verificación local** proporcional al riesgo, con los comandos del perfil §4: `npm run typecheck`,
   `npm run lint`, `npm run format:check` y `npx vitest run <patrón>` en cada fase; `npm test`,
   `npm run test:coverage`, `npm run build` y `npm run build:budget` al cerrar fases grandes y el
   programa.
4. **Loop subagente `goal-reviewer`** (persona de corrección) sobre el diff de la fase:
   - **Implementar íntegramente todas** las objeciones, sugerencias y nits que devuelva (sin
     cherry-pick, sin «lo dejamos en deuda»), salvo que el hallazgo sea **demostrablemente** fuera
     del alcance del doc 05 o un falso positivo con evidencia registrada.
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

1. Preferir la interpretación que **cumple el doc 05** y la cadena de autoridad del perfil §2.
2. Aplicar ambas si son compatibles.
3. Si son mutuamente excluyentes: implementar la que preserve los invariantes del perfil §7 y el
   DoD de la fase; documentar la otra en el body del commit como «considerado / no aplicado por
   conflicto con doc 05 §X».

### Reglas globales del goal

- **No push / no PR** salvo que el humano lo pida explícitamente después (perfil §10).
- **No reabrir** las decisiones cerradas del doc 05 §2.
- **No bajar** umbrales de los gates del perfil §5 ni ampliar excludes para «pasarlos».
- **No tocar** las zonas protegidas del perfil §6 salvo los paths que el doc 05 §2 C3 autoriza:
  crear `src/scenes/05-activos-simulador/`, `src/lib/projection.ts` y `src/lib/projection-assumptions.ts`.
- **Invariantes del perfil §7** aplicables a esta feature: I1, I3, I4, I5, I7, I9 — no romperlos ni dejar que
  se rompan en el código tocado.
- **Idioma y comentarios** según perfil §1: textos de usuario en `es-ES` con tratamiento de usted,
  identificadores en inglés, comentarios escasos y solo del porqué.
- Si el contexto se compacta o la sesión se reinicia: **continuar** desde el worktree
  (`/goal --resume`); no resetear ni reescribir la feature desde cero.
- **No saltar fases.** No marcar el programa completo si una fase quedó a medias.

---

## 2. Bloque GOAL (copiar tal cual)

```text
GOAL: Implementar al 100 % la funcionalidad canónica de docs/product/05-acto-v-activos-simulador.md (los tres vehículos de inversión y un simulador de proyección con capital, horizonte y escenario, cuyo CTA lleva el vehículo elegido al formulario), cumpliendo todos los gates, decisiones cerradas y criterios de hecho del documento, hasta el desarrollo completo en el HEAD actual del worktree.

AUTORIDAD
- Producto y alcance: docs/product/05-acto-v-activos-simulador.md (leer completo antes de codificar; no reabrir §2 decisiones C1-C5, F1-F7, S1-S11, E1-E5, D1-D2).
- Ingeniería: agent-docs/goal-profile.md (comandos §4, gates §5, zonas protegidas §6, invariantes §7, arquitectura §8, git §10) + AGENTS.md + content/ como canon de contenido.
- Roadmap a actualizar al cerrar: docs/product/roadmap.md §2 fila 05.
- Deuda: docs/debt/technical-debt.md — al final registrar las filas del doc 05 §12 que queden sin cubrir.
- Relacionado ya hecho (no reimplementar): docs 00 (motor, primitivas, Disclaimer), 03 (src/lib/counter.ts, PairedComparison) y 04 (GuaranteeCards, patrón de disclaimer en línea) — reutilizarlos. No reimplementar ninguno.

ORDEN DE FASES (doc 05 §7) — secuencial, sin saltar

FASE A — Motor de proyección
- src/lib/projection.ts con project según el doc 05 §3.3, incluida toda la validación de entrada.
- src/lib/projection-assumptions.ts con las tasas, su justificación y su advertencia (S5). Las tasas son SUPUESTOS DECLARADOS, no datos del dossier.
- formatCurrency en src/lib/format.ts si no estaba ya en uso real.
- useSimulator en src/scenes/05-activos-simulador/useSimulator.ts.
- Tests SIM-01 a SIM-10 y SIM-18 (doc 05 §3.8).
- DoD fase: doc 05 §7 Fase A + §8.1. Cobertura de src/lib/projection.ts >= 80 % en las cuatro métricas: es el gate más importante de este documento.

FASE B — Los tres vehículos
- content.ts con los tres vehículos, literales de la tabla del dossier.
- VehicleCards con etiquetas internas repetidas dentro de cada tarjeta y glosa de «al pozo» (F2, F3).
- EntryFloorNote con PendingValue: sin ninguna cifra de importe mínimo (F4, F5).
- Iconos de trazo lineal (F7).
- Registro de la escena en src/app/sections.ts.
- Tests VEH-01, VEH-02, VEH-03, VEH-06, VEH-07 (doc 05 §4.6).
- DoD fase: doc 05 §7 Fase B: los tres vehículos se leen completos y literales; no aparece ninguna cifra de importe mínimo.

FASE C — Simulador interactivo
- CapitalSlider, HorizonSlider y ScenarioToggle, todos operables con teclado (flechas, Page Up/Down, Home, End).
- ProjectionChart en SVG propio, con aria-hidden. Sin librería de gráficos (S8).
- ProjectionTable año a año, con los mismos valores que el gráfico (S9, I4).
- AssumptionsPanel siempre visible con la tasa aplicada y su justificación (S5, E3).
- Disclaimer variant=inline adherido al resultado, no en un pie desplazado (S7).
- Etiquetado como «Escenario ilustrativo» (S6) y verificación de E1 y E2.
- Tests SIM-11 a SIM-15, SIM-17, SIM-19, SIM-20, VEH-04, VEH-05.
- DoD fase: doc 05 §7 Fase C + §8.2 en lo relativo al simulador.

FASE D — Modo scroll y cierre
- Anclaje y scrub con useGsapScene; altura 450vh.
- Avance automático del horizonte en un tramo de la escena, con la curva creciendo (S10).
- Traspaso del control a los deslizadores al terminar el tramo, sin salto.
- Persistencia en memoria del estado del simulador hacia el formulario del documento 06 (S11). Sin localStorage.
- CTA de cierre con vehículo y valores como contexto (D2) y ActSeal de transición al acto VI.
- Tests SIM-16, VEH-08.
- DoD fase: doc 05 §7 Fase D + resto de §8.2.

FASE E — Cierre documental y gates globales
- Marcar DoD en doc 05 §8 y roadmap §2 fila 05 de forma honesta («hecho en branch»).
- Registrar la deuda del doc 05 §12 en docs/debt/technical-debt.md, incluidas E-05 (importe mínimo) y la validación de los supuestos del simulador por parte del cliente.
- Ejecutar los gates del perfil §5, con atención a la cobertura de src/lib/projection.ts.
- Limpieza residual: supuestos huérfanos, iconos no usados.
- DoD fase: doc 05 §8 Global + fases A-D cerradas. Cobertura de la lógica pura por encima del umbral, sin exclusiones añadidas.


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
- No reabrir decisiones del doc 05 §2.
- No bajar umbrales de gates ni ampliar excludes.
- No tocar las zonas protegidas del perfil §6 (content/, public/assets-origen/, el PDF del dossier, goal-loop-kit/, agent-docs/goal-loop.md, agent-docs/templates/, .grok/agents/, .grok/skills/) fuera de lo autorizado por el doc 05 §2 C3.
- No romper los invariantes del perfil §7: I1, I3, I4, I5, I7, I9.
- NO publicar ninguna cifra de importe mínimo de inversión (F5, errata E-05, test VEH-03): el dossier no la da. Se renderiza PendingValue con la explicación de que se determina en la sesión de diagnóstico.
- Las tasas del simulador son SUPUESTOS DECLARADOS del implementador, nunca proyecciones atribuidas a OPTIMVS (S5). Deben MOSTRARSE al usuario junto al resultado (E3, test SIM-11).
- El disclaimer en línea va ADHERIDO al resultado, visible sin hacer scroll desde la cifra (S7, I7, test SIM-12).
- El resultado se rotula siempre como «Escenario ilustrativo». Prohibidas las expresiones «rendimiento esperado» y «rentabilidad garantizada» (S6, E4, test SIM-13).
- El simulador NO pide ningún dato personal: ni edad, ni patrimonio, ni situación fiscal, ni objetivos (E1, test SIM-19). Pedirlos lo convertiría en recomendación personalizada.
- El simulador NO recomienda: no dice «le conviene», no ordena los vehículos por atractivo, no marca ninguno como recomendado (E2, test SIM-20).
- Sin comparación con depósitos, fondos ni el IBEX (E5): sería publicidad comparativa de producto financiero.
- Sin simulación de Montecarlo ni bandas de confianza (S4): parecer científico sin datos reales es peor que ser simple y honesto.
- Sin librería de gráficos (S8): una serie de 15 puntos no justifica una dependencia, y el control sobre la accesibilidad es mayor con SVG propio.
- Sin localStorage ni cookies (S11): el estado del simulador vive en memoria.
- La renta se calcula sobre el CAPITAL INICIAL, no sobre el valor revalorizado (doc 05 §3.3, test SIM-07). Es el supuesto más conservador y se documenta al usuario.
- La tabla año a año debe estar siempre en el DOM (S9, I4, test SIM-14).
- «Al pozo» lleva glosa obligatoria: es término argentino y el lector es español (F3, test VEH-02).
- Idioma y comentarios según perfil §1.
- Continuar desde el worktree actual si hay progreso parcial; no reiniciar la feature.
- No empezar la fase N+1 sin commits de la fase N tras ambos loops limpios.

CRITERIO DE COMPLETITUD DEL GOAL
El goal solo está completo cuando las fases A-E están implementadas, cada una pasó el protocolo de §1 (implementación, tests, dos loops limpios, misma foto, puerta humana, commits); los DoD del doc 05 §8 se cumplen en código y tests; los veinte tests SIM-01 a SIM-20 y los ocho VEH-01 a VEH-08 existen y pasan, y la cobertura de src/lib/projection.ts supera el umbral del perfil §5; los gates del perfil §5 están en verde; y roadmap, deuda y doc 05 reflejan el estado real.

ENTREGABLE FINAL
Resumen por fase: qué se hizo, commits (hash + mensaje), comandos de verificación ejecutados con su resultado, número de rondas de cada subagente hasta limpio, y residuos o deuda documentada.
```

---

## 3. Variantes cortas (una fase)

Usar solo si el humano pide acotar. **Mismo protocolo que §1** (incluida la puerta humana del perfil §9). No push/PR.

### 3.1 Solo Fase A

```text
GOAL: Completar solo la FASE A de docs/product/05-acto-v-activos-simulador.md (motor de proyección puro, con supuestos declarados y cobertura dura). Leer doc 05 §7 Fase A y agent-docs/goal-profile.md. Tests SIM-01 a SIM-10 y SIM-18. Al terminar: protocolo de §1. No push/PR. No implementar interfaz.
```

### 3.2 Solo Fase B

```text
GOAL: Completar solo la FASE B de docs/product/05-acto-v-activos-simulador.md (los tres vehículos en tarjetas accesibles, sin importe inventado). Leer doc 05 §7 Fase B y agent-docs/goal-profile.md. Tests VEH-01, VEH-02, VEH-03, VEH-06 y VEH-07. Al terminar: protocolo de §1. No push/PR. Puede adelantarse a la Fase A.
```

### 3.3 Solo Fase C

```text
GOAL: Completar solo la FASE C de docs/product/05-acto-v-activos-simulador.md (simulador interactivo con supuestos visibles, disclaimer adherido y tabla equivalente). Leer doc 05 §7 Fase C y agent-docs/goal-profile.md. Tests SIM-11 a SIM-15, SIM-17, SIM-19, SIM-20, VEH-04 y VEH-05. Al terminar: protocolo de §1. No push/PR. Requiere la Fase A ya en el branch.
```

### 3.4 Solo Fase D

```text
GOAL: Completar solo la FASE D de docs/product/05-acto-v-activos-simulador.md (modo scroll, persistencia hacia el formulario y cierre). Leer doc 05 §7 Fase D y agent-docs/goal-profile.md. Tests SIM-16 y VEH-08. Al terminar: protocolo de §1. No push/PR. Requiere las Fases A, B y C ya en el branch.
```

### 3.5 Solo Fase E

```text
GOAL: Completar solo la FASE E de docs/product/05-acto-v-activos-simulador.md (cierre documental y gates). Leer doc 05 §7 Fase E y agent-docs/goal-profile.md. Ejecutar los cinco gates del perfil §5, con atención a la cobertura de src/lib/projection.ts. Al terminar: protocolo de §1. No push/PR. Requiere las Fases A a D cerradas.
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
| A | `feat(sim): añadir motor de proyección con supuestos declarados` |
| B | `feat(act5): añadir los tres vehículos de inversión` |
| C | `feat(sim): añadir simulador interactivo con supuestos y tabla accesible` |
| D | `feat(sim): avanzar el horizonte con el scroll y llevar el contexto al formulario` |
| E | `docs(act5): marcar DoD y registrar deuda del acto V` |

---

## 6. Checklist rápido del agente (por fase)

```text
[ ] Alcance de la fase leído en el doc 05
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

*Generado para delegación GOAL. La autoridad de producto sigue siendo el doc 05, no este prompt.*

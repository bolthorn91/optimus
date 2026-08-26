# GOAL prompt — Acto IV — Marco legal y garantías (doc 04)

**Uso:** `/goal docs/product/04-acto-iv-marco-legal-garantias-goal-prompt.md`, o copiar el bloque `GOAL` de §2 a una sesión de implementación.
**Canon de producto:** [`04-acto-iv-marco-legal-garantias.md`](04-acto-iv-marco-legal-garantias.md).
**Perfil de proyecto:** [`agent-docs/goal-profile.md`](../../agent-docs/goal-profile.md) — invariantes §7 aplicables: I1, I3, I4, I5, I6, I7, I9.
**Roadmap:** [`roadmap.md`](roadmap.md) §2, fila 04.
**Branch de trabajo esperado:** el HEAD actual del worktree. No inventar rama.
**Harness:** `AGENTS.md`, `content/` (canon de contenido), `agent-docs/goal-profile.md`.
**Loop:** [`agent-docs/goal-loop.md`](../../agent-docs/goal-loop.md).

---

## 1. Protocolo de fase (obligatorio en cada fase A–E)

Para **cada** fase, en este orden **estricto**:

1. **Implementar** el alcance de la fase según el doc 04 (sin reabrir las decisiones §2: C1-C5, F1-F7, S1-S4, D1-D4, E1-E4, G1-G3).
2. **Tests** de toda la superficie tocada en el mismo cambio; no diluir los gates del perfil §5.
3. **Verificación local** proporcional al riesgo, con los comandos del perfil §4: `npm run typecheck`,
   `npm run lint`, `npm run format:check` y `npx vitest run <patrón>` en cada fase; `npm test`,
   `npm run test:coverage`, `npm run build` y `npm run build:budget` al cerrar fases grandes y el
   programa.
4. **Loop subagente `goal-reviewer`** (persona de corrección) sobre el diff de la fase:
   - **Implementar íntegramente todas** las objeciones, sugerencias y nits que devuelva (sin
     cherry-pick, sin «lo dejamos en deuda»), salvo que el hallazgo sea **demostrablemente** fuera
     del alcance del doc 04 o un falso positivo con evidencia registrada.
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

1. Preferir la interpretación que **cumple el doc 04** y la cadena de autoridad del perfil §2.
2. Aplicar ambas si son compatibles.
3. Si son mutuamente excluyentes: implementar la que preserve los invariantes del perfil §7 y el
   DoD de la fase; documentar la otra en el body del commit como «considerado / no aplicado por
   conflicto con doc 04 §X».

### Reglas globales del goal

- **No push / no PR** salvo que el humano lo pida explícitamente después (perfil §10).
- **No reabrir** las decisiones cerradas del doc 04 §2.
- **No bajar** umbrales de los gates del perfil §5 ni ampliar excludes para «pasarlos».
- **No tocar** las zonas protegidas del perfil §6 salvo los paths que el doc 04 §2 C3 autoriza:
  crear `src/scenes/04-marco-legal/` y los SVG derivados en `public/diagrams/`.
- **Invariantes del perfil §7** aplicables a esta feature: I1, I3, I4, I5, I6, I7, I9 — no romperlos ni dejar que
  se rompan en el código tocado.
- **Idioma y comentarios** según perfil §1: textos de usuario en `es-ES` con tratamiento de usted,
  identificadores en inglés, comentarios escasos y solo del porqué.
- Si el contexto se compacta o la sesión se reinicia: **continuar** desde el worktree
  (`/goal --resume`); no resetear ni reescribir la feature desde cero.
- **No saltar fases.** No marcar el programa completo si una fase quedó a medias.

---

## 2. Bloque GOAL (copiar tal cual)

```text
GOAL: Implementar al 100 % la funcionalidad canónica de docs/product/04-acto-iv-marco-legal-garantias.md (diagrama animado del Convenio de Doble Imposición en cinco pasos, las cuatro garantías, y el dato de las 13.243.219 hectáreas comparado con la extensión de Inglaterra), cumpliendo todos los gates, decisiones cerradas y criterios de hecho del documento, hasta el desarrollo completo en el HEAD actual del worktree.

AUTORIDAD
- Producto y alcance: docs/product/04-acto-iv-marco-legal-garantias.md (leer completo antes de codificar; no reabrir §2 decisiones C1-C5, F1-F7, S1-S4, D1-D4, E1-E4, G1-G3).
- Ingeniería: agent-docs/goal-profile.md (comandos §4, gates §5, zonas protegidas §6, invariantes §7, arquitectura §8, git §10) + AGENTS.md + content/ como canon de contenido.
- Roadmap a actualizar al cerrar: docs/product/roadmap.md §2 fila 04.
- Deuda: docs/debt/technical-debt.md — al final registrar las filas del doc 04 §12 que queden sin cubrir.
- Relacionado ya hecho (no reimplementar): docs 00 (motor, primitivas, Disclaimer) y 03 (PairedComparison, src/lib/counter.ts) — reutilizarlos. No reimplementar ninguno.

ORDEN DE FASES (doc 04 §7) — secuencial, sin saltar

FASE A — Contenido tipado y bloque estático
- src/scenes/04-marco-legal/content.ts con los cinco pasos, las cuatro garantías, el dato ancla y los ocho factores de «¿Por qué Argentina?», literales.
- Act4Scene estática: entradilla, dato ancla, lista ordenada de los cinco pasos, cuatro tarjetas de garantías, aclaración de S3, disclaimer y CTA. Sin animación ni diagrama.
- AnchorStat y AreaComparison con la equivalencia con Inglaterra (D1, D2).
- Registro de la escena en src/app/sections.ts.
- Tests CDI-05, CDI-08, CDI-09, CDI-10, CDI-11, CDI-12, CDI-15, CDI-16 (doc 04 §3.8).
- DoD fase: doc 04 §7 Fase A + §8.2 en lo relativo a contenido, disclaimer y aclaración de «Capital Protegido».

FASE B — Diagrama del CDI
- SVG propio del flujo España↔Argentina, con texto real (no trazado a curvas) y aria-hidden (F2, F5).
- ProcessDiagram genérico y reutilizable, con steps, drawProgress, stepGlow y orientación (F6). El documento 06 lo reutiliza.
- Trazado con DrawSVG; nodos e iluminación del paso activo con gsap.
- Reflujo a vertical en viewport estrecho, sin perder el orden de los pasos ni la dirección del flujo.
- Nota de topes de retención tras el diagrama (F7) y nota de asesoramiento independiente (E3).
- Tests CDI-06, CDI-13.
- DoD fase: doc 04 §7 Fase B + §8.1 en lo relativo al diagrama.

FASE C — Coreografía y garantías animadas
- choreographAct4 como función pura, con el invariante de paso único activo (doc 04 §3.3).
- Anclaje y scrub con useGsapScene; altura 550vh.
- Cableado de drawProgress y stepGlow al diagrama.
- GuaranteeCards con entrada escalonada, extraída a src/components/ para el documento 06 (S4).
- Iconos de trazo lineal para los cuatro pilares.
- Tests CDI-01, CDI-02, CDI-03, CDI-04, CDI-07, CDI-14.
- DoD fase: doc 04 §7 Fase C + resto de §8.1.

FASE D — Dato ancla, fondo y cierre
- AnchorStat con CountUp ligado a anchorProgress y cierre exacto vía src/lib/counter.ts.
- AreaComparison: las 13.243.219 ha frente a Inglaterra, a escala.
- DualFigure con MMXXIV / 2024 (D3).
- Transición de fondo de navy a marfil a lo largo del acto (G1).
- CTA intermedio (G3) y ActSeal de transición al acto V.
- Tests CDI-17.
- DoD fase: doc 04 §7 Fase D + resto de §8.2.

FASE E — Cierre documental y gates globales
- Marcar DoD en doc 04 §8 y roadmap §2 fila 04 de forma honesta («hecho en branch»).
- Registrar la deuda del doc 04 §12 en docs/debt/technical-debt.md, incluidas las matizaciones de copy pendientes de la asesoría legal (E4) y la fotografía a sustituir (G2).
- Ejecutar los gates del perfil §5 y dejarlos en verde de verdad.
- Limpieza residual: iconos no usados, nodos huérfanos del SVG.
- DoD fase: doc 04 §8 Global + fases A-D cerradas.


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
- No reabrir decisiones del doc 04 §2.
- No bajar umbrales de gates ni ampliar excludes.
- No tocar las zonas protegidas del perfil §6 (content/, public/assets-origen/, el PDF del dossier, goal-loop-kit/, agent-docs/goal-loop.md, agent-docs/templates/, .grok/agents/, .grok/skills/) fuera de lo autorizado por el doc 04 §2 C3.
- No romper los invariantes del perfil §7: I1, I3, I4, I5, I6, I7, I9.
- El disclaimer en línea es OBLIGATORIO en el bloque de marco fiscal y en el de garantías (I7, E2, test CDI-10). Esta es la sección con más afirmaciones absolutas del dossier.
- La aclaración de que «Capital Protegido» protege la TITULARIDAD REGISTRAL del activo y no el valor de la inversión es obligatoria y explícita (S3, test CDI-11).
- NO matizar ni reescribir las afirmaciones absolutas del dossier («garantizando máxima seguridad jurídica», «elimina de raíz», «jamás se tributen dos veces»): se reproducen literales por I1 y las matizaciones propuestas en content/07-legal-y-disclaimers.md se registran en deuda (E4).
- NO publicar la conversión derivada de las hectáreas a km² (132.432,19 km²): el propio canon la marca como derivada y pendiente de validación (D4, test CDI-16).
- En todo momento debe haber EXACTAMENTE un paso del diagrama con stepGlow igual a 1 (test CDI-03). Un paso ya trazado nunca se destraza (test CDI-04).
- El texto del SVG debe ser texto real, nunca trazado a curvas (F5, test CDI-06): es requisito de accesibilidad y de SEO.
- La lista ordenada con los cinco pasos completos debe estar siempre en el DOM; el SVG lleva aria-hidden (C5, I4, test CDI-05).
- Sin WebGL en este acto (F2): es un diagrama, y el vector es más nítido y más accesible.
- NO usar la fotografía del Obelisco de public/assets-origen/p11-X43.png (G2): sobresaturada y de aspecto amateur. Se registra en deuda la necesidad de fotografía profesional con licencia.
- Sin logotipos de AEAT, ARCA, CNMV ni CNV (I6): solo texto.
- El dato de 13.243.219 ha nunca aparece sin su equivalencia con Inglaterra (D2, test CDI-08).
- Idioma y comentarios según perfil §1.
- Continuar desde el worktree actual si hay progreso parcial; no reiniciar la feature.
- No empezar la fase N+1 sin commits de la fase N tras ambos loops limpios.

CRITERIO DE COMPLETITUD DEL GOAL
El goal solo está completo cuando las fases A-E están implementadas, cada una pasó el protocolo de §1 (implementación, tests, dos loops limpios, misma foto, puerta humana, commits); los DoD del doc 04 §8 se cumplen en código y tests; los diecisiete tests CDI-01 a CDI-17 existen y pasan; los gates del perfil §5 están en verde; y roadmap, deuda y doc 04 reflejan el estado real.

ENTREGABLE FINAL
Resumen por fase: qué se hizo, commits (hash + mensaje), comandos de verificación ejecutados con su resultado, número de rondas de cada subagente hasta limpio, y residuos o deuda documentada.
```

---

## 3. Variantes cortas (una fase)

Usar solo si el humano pide acotar. **Mismo protocolo que §1** (incluida la puerta humana del perfil §9). No push/PR.

### 3.1 Solo Fase A

```text
GOAL: Completar solo la FASE A de docs/product/04-acto-iv-marco-legal-garantias.md (contenido tipado y bloque estático con lista de pasos, garantías y disclaimer). Leer doc 04 §7 Fase A y agent-docs/goal-profile.md. Tests CDI-05, CDI-08, CDI-09, CDI-10, CDI-11, CDI-12, CDI-15 y CDI-16. Al terminar: protocolo de §1. No push/PR. No implementar el diagrama ni la animación.
```

### 3.2 Solo Fase B

```text
GOAL: Completar solo la FASE B de docs/product/04-acto-iv-marco-legal-garantias.md (diagrama del CDI en SVG, genérico y reutilizable). Leer doc 04 §7 Fase B y agent-docs/goal-profile.md. Tests CDI-06 y CDI-13. Al terminar: protocolo de §1. No push/PR. Requiere la Fase A ya en el branch.
```

### 3.3 Solo Fase C

```text
GOAL: Completar solo la FASE C de docs/product/04-acto-iv-marco-legal-garantias.md (coreografía del trazado y garantías escalonadas). Leer doc 04 §7 Fase C y agent-docs/goal-profile.md. Tests CDI-01, CDI-02, CDI-03, CDI-04, CDI-07 y CDI-14. Al terminar: protocolo de §1. No push/PR. Requiere las Fases A y B ya en el branch.
```

### 3.4 Solo Fase D

```text
GOAL: Completar solo la FASE D de docs/product/04-acto-iv-marco-legal-garantias.md (dato ancla, comparación de superficies, fondo y cierre). Leer doc 04 §7 Fase D y agent-docs/goal-profile.md. Test CDI-17. Al terminar: protocolo de §1. No push/PR. Requiere las Fases A, B y C ya en el branch.
```

### 3.5 Solo Fase E

```text
GOAL: Completar solo la FASE E de docs/product/04-acto-iv-marco-legal-garantias.md (cierre documental y gates). Leer doc 04 §7 Fase E y agent-docs/goal-profile.md. Ejecutar los cinco gates del perfil §5. Al terminar: protocolo de §1. No push/PR. Requiere las Fases A a D cerradas.
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
| A | `feat(act4): añadir contenido del marco legal con garantías y disclaimer` |
| B | `feat(act4): añadir el diagrama del convenio de doble imposición` |
| C | `feat(act4): trazar el diagrama del CDI con el scroll y animar las garantías` |
| D | `feat(act4): añadir el dato ancla de superficie y la transición a marfil` |
| E | `docs(act4): marcar DoD y registrar deuda del acto IV` |

---

## 6. Checklist rápido del agente (por fase)

```text
[ ] Alcance de la fase leído en el doc 04
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

*Generado para delegación GOAL. La autoridad de producto sigue siendo el doc 04, no este prompt.*

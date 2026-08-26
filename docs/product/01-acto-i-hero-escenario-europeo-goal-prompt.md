# GOAL prompt — Acto I — Hero y el nuevo escenario europeo (doc 01)

**Uso:** `/goal docs/product/01-acto-i-hero-escenario-europeo-goal-prompt.md`, o copiar el bloque `GOAL` de §2 a una sesión de implementación.
**Canon de producto:** [`01-acto-i-hero-escenario-europeo.md`](01-acto-i-hero-escenario-europeo.md).
**Perfil de proyecto:** [`agent-docs/goal-profile.md`](../../agent-docs/goal-profile.md) — invariantes §7 aplicables: I1, I3, I4, I5, I7, I9.
**Roadmap:** [`roadmap.md`](roadmap.md) §2, fila 01.
**Branch de trabajo esperado:** el HEAD actual del worktree. No inventar rama.
**Harness:** `AGENTS.md`, `content/` (canon de contenido), `agent-docs/goal-profile.md`.
**Loop:** [`agent-docs/goal-loop.md`](../../agent-docs/goal-loop.md).

---

## 1. Protocolo de fase (obligatorio en cada fase A–E)

Para **cada** fase, en este orden **estricto**:

1. **Implementar** el alcance de la fase según el doc 01 (sin reabrir las decisiones §2: C1-C5, F1-F8, S1-S10, D1-D3, E1-E4).
2. **Tests** de toda la superficie tocada en el mismo cambio; no diluir los gates del perfil §5.
3. **Verificación local** proporcional al riesgo, con los comandos del perfil §4: `npm run typecheck`,
   `npm run lint`, `npm run format:check` y `npx vitest run <patrón>` en cada fase; `npm test`,
   `npm run test:coverage`, `npm run build` y `npm run build:budget` al cerrar fases grandes y el
   programa.
4. **Loop subagente `goal-reviewer`** (persona de corrección) sobre el diff de la fase:
   - **Implementar íntegramente todas** las objeciones, sugerencias y nits que devuelva (sin
     cherry-pick, sin «lo dejamos en deuda»), salvo que el hallazgo sea **demostrablemente** fuera
     del alcance del doc 01 o un falso positivo con evidencia registrada.
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

1. Preferir la interpretación que **cumple el doc 01** y la cadena de autoridad del perfil §2.
2. Aplicar ambas si son compatibles.
3. Si son mutuamente excluyentes: implementar la que preserve los invariantes del perfil §7 y el
   DoD de la fase; documentar la otra en el body del commit como «considerado / no aplicado por
   conflicto con doc 01 §X».

### Reglas globales del goal

- **No push / no PR** salvo que el humano lo pida explícitamente después (perfil §10).
- **No reabrir** las decisiones cerradas del doc 01 §2.
- **No bajar** umbrales de los gates del perfil §5 ni ampliar excludes para «pasarlos».
- **No tocar** las zonas protegidas del perfil §6 salvo los paths que el doc 01 §2 C3 autoriza:
  crear `src/scenes/00-hero/`, `src/scenes/01-escenario-europeo/` y assets derivados en `public/img/`.
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
GOAL: Implementar al 100 % la funcionalidad canónica de docs/product/01-acto-i-hero-escenario-europeo.md (hero a pantalla completa con el titular del dossier y escena anclada donde los tres factores convergentes se despliegan con el scroll), cumpliendo todos los gates, decisiones cerradas y criterios de hecho del documento, hasta el desarrollo completo en el HEAD actual del worktree.

AUTORIDAD
- Producto y alcance: docs/product/01-acto-i-hero-escenario-europeo.md (leer completo antes de codificar; no reabrir §2 decisiones C1-C5, F1-F8, S1-S10, D1-D3, E1-E4).
- Ingeniería: agent-docs/goal-profile.md (comandos §4, gates §5, zonas protegidas §6, invariantes §7, arquitectura §8, git §10) + AGENTS.md + content/ como canon de contenido.
- Roadmap a actualizar al cerrar: docs/product/roadmap.md §2 fila 01.
- Deuda: docs/debt/technical-debt.md — al final registrar las filas del doc 01 §12 que queden sin cubrir.
- Relacionado ya hecho (no reimplementar): doc 00 (fundación) — reutilizar tokens, primitivas, useGsapScene, Scene, RomanNumeral, DualFigure, CountUp, StatFigure, PullQuote y el shell. No reimplementar ninguno.

ORDEN DE FASES (doc 01 §7) — secuencial, sin saltar

FASE A — Contenido tipado y hero estático
- src/scenes/00-hero/content.ts y src/scenes/01-escenario-europeo/content.ts con los literales del dossier y sus tipos.
- HeroScene estático: composición completa, claim reconstruido en CSS (F2), CTA y bloque de presentación (F8). Sin animación.
- Act1Scene estática: entradilla, tres FactorPanel, cifra ancla, cierre y CTA. Sin animación ni ilustraciones.
- Registro de ambas escenas en src/app/sections.ts.
- Tests HERO-01, HERO-02, HERO-06, HERO-07, HERO-08, ACT1-01, ACT1-02, ACT1-06, ACT1-07, ACT1-11, ACT1-12 (doc 01 §3.8 y §4.6).
- DoD fase: doc 01 §7 Fase A + §8.1 y §8.2 en lo relativo a contenido literal y accesibilidad.

FASE B — Animación del hero
- choreographIntro en timeline.ts como función pura (doc 01 §3.3).
- SplitText sobre el h1 con el tratamiento de accesibilidad de §3.6: aria-label con la frase completa y aria-hidden en los fragmentos.
- Aplicación vía useGsapScene sin scrub; veladura de fondo (F5); indicador de scroll.
- ActSeal en src/components/, trazado con DrawSVG (D3). Reutilizable por los documentos 02-06.
- Tests HERO-03, HERO-04, HERO-05, HERO-09, HERO-10.
- DoD fase: doc 01 §7 Fase B + resto de §8.1.

FASE C — Escena anclada del acto I
- choreographAct1 como función pura, con la ventana de tres tramos (doc 01 §4.3).
- Anclaje y scrub con useGsapScene; altura 400vh.
- Entrada y salida de los tres paneles de texto; cifra ancla ligada a statProgress; cierre.
- Transición de fondo del acto con surfaceMix (D2), usando el mecanismo del documento 00.
- Tests ACT1-03, ACT1-04, ACT1-05, ACT1-13.
- DoD fase: doc 01 §7 Fase C + §8.2 en lo relativo al recorrido con scroll.

FASE D — Las tres ilustraciones
- DensityIllustration en canvas 2D: redistribución de la trama de puntos (S3), con parada y liberación del bucle al salir del viewport.
- SurveillanceGrid en SVG: la retícula desciende y recorre el texto sin taparlo ni hacerlo inaccesible (S4).
- DematerialisingNote en SVG: desmaterialización en píxeles trazables (S5).
- Cableado de cada ilustración a su factorProgress[i]. Las tres comparten la firma { progress: number }.
- Tests ACT1-08, ACT1-09, ACT1-10.
- DoD fase: doc 01 §7 Fase D + resto de §8.2.

FASE E — Cierre documental y gates globales
- Marcar DoD en doc 01 §8 y roadmap §2 fila 01 de forma honesta («hecho en branch»).
- Registrar la deuda del doc 01 §12 en docs/debt/technical-debt.md, incluida la decisión pendiente del cliente sobre el registro visual (§2.5) y la errata E-08.
- Ejecutar los gates del perfil §5 y dejarlos en verde de verdad.
- Limpieza residual: assets no usados, exportaciones muertas.
- DoD fase: doc 01 §8 Global + fases A-D cerradas.


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
- No reabrir decisiones del doc 01 §2.
- No bajar umbrales de gates ni ampliar excludes.
- No tocar las zonas protegidas del perfil §6 (content/, public/assets-origen/, el PDF del dossier, goal-loop-kit/, agent-docs/goal-loop.md, agent-docs/templates/, .grok/agents/, .grok/skills/) fuera de lo autorizado por el doc 01 §2 C3.
- No romper los invariantes del perfil §7: I1, I3, I4, I5, I7, I9.
- Registro visual ABSTRACTO y cartográfico (doc 01 §2.3 S2-S5 y §2.5 E1): densidad, retícula, desmaterialización y dato. NO implementar iconografía literal de amenaza (embarcaciones migratorias, símbolos de delito, alarmas policiales): queda documentada en E2 como alternativa, no implementada.
- No corregir el tiempo verbal de las normas europeas en tramitación (errata E-08): se reproduce literal por I1 y la corrección es decisión editorial del cliente.
- Sin enlaces a redes sociales en el hero (F7): el dossier no facilita ninguna URL (bloqueo B-07).
- Sin WebGL en este acto (S10): canvas 2D y SVG. WebGL se reserva al documento 03.
- Sin vídeo de fondo en el hero (F5).
- El párrafo de cierre sobre la zona de paz pertenece al acto II (documento 02 D1); no duplicarlo aquí.
- El texto de los tres factores debe coincidir carácter a carácter con content/secciones/01-nuevo-escenario-europeo.md (I1, test ACT1-12).
- El texto bajo la retícula de vigilancia debe seguir siendo texto seleccionable en el DOM, nunca una imagen (I4, test ACT1-08).
- Idioma y comentarios según perfil §1.
- Continuar desde el worktree actual si hay progreso parcial; no reiniciar la feature.
- No empezar la fase N+1 sin commits de la fase N tras ambos loops limpios.

CRITERIO DE COMPLETITUD DEL GOAL
El goal solo está completo cuando las fases A-E están implementadas, cada una pasó el protocolo de §1 (implementación, tests, dos loops limpios, misma foto, puerta humana, commits); los DoD del doc 01 §8 se cumplen en código y tests; los diez tests HERO-01 a HERO-10 y los trece ACT1-01 a ACT1-13 existen y pasan; los gates del perfil §5 están en verde; y roadmap, deuda y doc 01 reflejan el estado real.

ENTREGABLE FINAL
Resumen por fase: qué se hizo, commits (hash + mensaje), comandos de verificación ejecutados con su resultado, número de rondas de cada subagente hasta limpio, y residuos o deuda documentada.
```

---

## 3. Variantes cortas (una fase)

Usar solo si el humano pide acotar. **Mismo protocolo que §1** (incluida la puerta humana del perfil §9). No push/PR.

### 3.1 Solo Fase A

```text
GOAL: Completar solo la FASE A de docs/product/01-acto-i-hero-escenario-europeo.md (contenido tipado y hero y acto I estáticos y accesibles). Leer doc 01 §7 Fase A y agent-docs/goal-profile.md. Tests HERO-01, HERO-02, HERO-06, HERO-07, HERO-08, ACT1-01, ACT1-02, ACT1-06, ACT1-07, ACT1-11 y ACT1-12. Al terminar: protocolo de §1. No push/PR. No implementar animación ni ilustraciones.
```

### 3.2 Solo Fase B

```text
GOAL: Completar solo la FASE B de docs/product/01-acto-i-hero-escenario-europeo.md (animación de entrada del hero y sello de transición). Leer doc 01 §7 Fase B y agent-docs/goal-profile.md. Tests HERO-03, HERO-04, HERO-05, HERO-09 y HERO-10. Al terminar: protocolo de §1. No push/PR. Requiere la Fase A ya en el branch.
```

### 3.3 Solo Fase C

```text
GOAL: Completar solo la FASE C de docs/product/01-acto-i-hero-escenario-europeo.md (escena anclada del acto I con scrub y fondo por acto). Leer doc 01 §7 Fase C y agent-docs/goal-profile.md. Tests ACT1-03, ACT1-04, ACT1-05 y ACT1-13. Al terminar: protocolo de §1. No push/PR. Requiere las Fases A y B ya en el branch.
```

### 3.4 Solo Fase D

```text
GOAL: Completar solo la FASE D de docs/product/01-acto-i-hero-escenario-europeo.md (las tres ilustraciones cableadas a su progreso). Leer doc 01 §7 Fase D y agent-docs/goal-profile.md. Tests ACT1-08, ACT1-09 y ACT1-10. Al terminar: protocolo de §1. No push/PR. Requiere las Fases A, B y C ya en el branch.
```

### 3.5 Solo Fase E

```text
GOAL: Completar solo la FASE E de docs/product/01-acto-i-hero-escenario-europeo.md (cierre documental y gates). Leer doc 01 §7 Fase E y agent-docs/goal-profile.md. Ejecutar los cinco gates del perfil §5. Al terminar: protocolo de §1. No push/PR. Requiere las Fases A a D cerradas.
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
| A | `feat(act1): añadir contenido tipado y escenas estáticas de hero y acto I` |
| B | `feat(act1): animar la entrada del hero y añadir el sello de transición` |
| C | `feat(act1): anclar el acto I con scrub y transición de fondo` |
| D | `feat(act1): añadir las ilustraciones de los tres factores convergentes` |
| E | `docs(act1): marcar DoD y registrar deuda del acto I` |

---

## 6. Checklist rápido del agente (por fase)

```text
[ ] Alcance de la fase leído en el doc 01
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

*Generado para delegación GOAL. La autoridad de producto sigue siendo el doc 01, no este prompt.*

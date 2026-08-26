# Goal loop — implementación por fases con subagentes de review

Cómo se implementa un documento canónico en este repositorio: una fase cada vez, cada fase con dos
subagentes de review que deben devolver limpio **sobre la misma foto del código** antes de que se
haga ningún commit.

| Pieza | Ruta |
|-------|------|
| Skill orquestadora | [`.grok/skills/goal/SKILL.md`](../.grok/skills/goal/SKILL.md) |
| Revisor de corrección | [`.grok/agents/goal-reviewer.md`](../.grok/agents/goal-reviewer.md) |
| Revisor de mantenibilidad | [`.grok/agents/goal-code-reviewer.md`](../.grok/agents/goal-code-reviewer.md) |
| **Perfil del proyecto** | [`goal-profile.md`](./goal-profile.md) |
| Plantilla de documento | [`templates/goal-doc.template.md`](./templates/goal-doc.template.md) |
| Plantilla de prompt de handover | [`templates/goal-prompt.template.md`](./templates/goal-prompt.template.md) |
| Meta-prompt del prompt | [`templates/goal-prompt.metaprompt.md`](./templates/goal-prompt.metaprompt.md) |
| Estado de los runs (git-ignored) | `.grok/goal-runs/<slug>/` |

## El seam: perfil del proyecto

La skill y los dos agentes no contienen **nada** específico de un repositorio. Todo lo específico
vive en [`goal-profile.md`](./goal-profile.md), y se cita por número de sección:

| § | Qué declara | Quién lo lee |
|---|-------------|--------------|
| §1 | Identidad, stack, idioma de UI y de código, comentarios, rama base | skill, `goal-reviewer` |
| §2 | Cadena de autoridad documental | skill, ambos agentes |
| §3 | Rutas canónicas (docs, deuda, E2E, roadmap, runs) | skill |
| §4 | Comandos de verificación reales | skill |
| §5 | Gates bloqueantes (cobertura y demás) | skill, `goal-reviewer` |
| §6 | Zonas protegidas | ambos agentes |
| §7 | Invariantes transversales del dominio | `goal-reviewer` |
| §8 | Convenciones de arquitectura | `goal-code-reviewer` |
| §9 | Parámetros del loop (rondas, umbrales, severidades) | skill, `goal-code-reviewer` |
| §10 | Política de git | skill |

Portar el loop a otro proyecto = escribir un `goal-profile.md` nuevo. Los otros tres ficheros se
copian sin tocar.

Sin perfil, el loop sigue funcionando: la skill usa los valores por defecto de su §9, avisa de que
corre «unprofiled» y pregunta solo por los comandos de verificación.

## Los tres artefactos de un goal

1. **Documento canónico** — la especificación de producto, en la carpeta que declara el perfil §3.
   Manda sobre alcance, decisiones cerradas, plan de fases y DoD. Se escribe desde
   `goal-doc.template.md`.
2. **Prompt de handover** — `<basename>-goal-prompt.md`, generado desde el documento con
   `goal-prompt.metaprompt.md` + `goal-prompt.template.md` (o con `/goal --make-prompt <doc>`).
   Lleva el bloque `GOAL:` copiable y el protocolo de fases. **Nunca** sustituye al documento.
3. **Run** — `/goal <ruta>` lo ejecuta. El estado vive en `.grok/goal-runs/<slug>/state.md`, de
   modo que el run sobrevive a la compactación de contexto y al reinicio de sesión
   (`/goal --resume`).

## Ciclo

```
SHA base de la fase
  → implementar el alcance de la fase
  → tests de toda superficie tocada
  → verificación local (comandos del perfil §4)
  → loop goal-reviewer        hasta ronda limpia
  → loop goal-code-reviewer   hasta ronda limpia
  → puerta de misma foto      (si el segundo loop tocó código, repetir el primero)
  → puerta humana             (si perfil §9 fases supervisadas)
  → commits (sin push, sin PR)
  → fase siguiente
```

Una **ronda limpia** es cero hallazgos accionables de cualquier severidad, nits incluidos (la lista
de severidades accionables se calibra en el perfil §9). Cualquier ítem accionable significa:
aplicarlo entero y relanzar el **mismo** agente.

La **puerta de misma foto** es lo que impide el autoengaño clásico: que el revisor de corrección
diera el visto bueno a un código que después cambió al aplicar los hallazgos de mantenibilidad. El
testigo es `git hash-object <diff de la fase>`: ambos agentes tienen que haber producido su ronda
limpia contra el mismo hash.

## Contrato de hallazgos

Los dos agentes escriben la misma gramática, así que el orquestador parsea un solo formato:

```markdown
## Summary
<2 a 4 frases>

## Issues
### Issue 1 -- Severity: bug|suggestion|nit
- File: path/to/file.ext:LINE
- Description: ...
- Suggestion: ...
- Status: open
```

Las tres palabras `bug`, `suggestion` y `nit` son contrato de parseo: no se traducen ni se renombran
aunque el resto del review esté en otro idioma.

Su respuesta final está limitada a 15 líneas y empieza por `VERDICT: CLEAN` o
`VERDICT: N findings (X bug, Y suggestion, Z nit)`. El detalle se queda en el fichero — eso es lo que
mantiene pequeño el contexto del orquestador.

## Límites de convergencia

| Guarda | Comportamiento |
|--------|----------------|
| Tope de rondas | Perfil §9 (5 por agente y fase por defecto); después, parar y escalar al humano |
| Oscilación | Mismo conjunto `(file:line, severidad)` dos rondas seguidas → parar, no reaplicar |
| Rechazo | Solo con evidencia verificable; registrado en `state.md` y en el body del commit |
| Rechazo repetido | Un hallazgo rechazado dos veces se escala, no se rechaza otra vez |
| Contradicción | Gana el documento y el perfil §2; aplicar ambos si son compatibles; si no, preservar los invariantes §7 y el DoD, y anotar el otro en el body del commit |

Sin estas guardas, «repetir hasta cero nits» contra un listón deliberadamente duro puede no terminar
nunca.

## Aislamiento de contexto

Cada llamada `spawn_subagent` arranca con su propio contexto y devuelve solo su informe final, así que un
review le cuesta al orquestador una línea de veredicto en vez de una transcripción entera. Los
prompts llevan **rutas** — diff, lista de ficheros, fichero de salida, perfil — nunca contenidos. A
`goal-code-reviewer` no se le dan los hallazgos de `goal-reviewer`, ni al revés: las dos personas
son deliberadamente independientes.

## Notas de harness

| Concepto | En Grok |
|----------|---------|
| Lanzar subagente | `spawn_subagent` con `subagent_type`, `background: false`, `capability_mode: all` |
| Definición de persona | `.grok/agents/<name>.md` (frontmatter + cuerpo) |
| Contexto propio por agente | nativo: cada `spawn_subagent` tiene el suyo |
| Modelo | `model: inherit` en el frontmatter del agente |
| Permisos | el cuerpo del agente prohíbe editar fuente; `capability_mode: all` solo porque el informe necesita write y git necesita shell |
| Entradas y salidas | rutas en el prompt + contrato de salida en el cuerpo del agente |

Los revisores son **agentes**, no skills, así que no colisionan con `/review`.

## Hueco conocido

Los dos revisores son personas opinadas. No hay un revisor agnóstico a la especificación — sin
rúbrica, con ojos frescos, al que solo se le pregunte «¿esto cumple el DoD y qué está mal?» — dando
una última pasada. Añadirlo significa un tercer fichero en `.grok/agents/` y un tercer loop entre
la puerta de misma foto y el commit; el protocolo no necesita ningún otro cambio.

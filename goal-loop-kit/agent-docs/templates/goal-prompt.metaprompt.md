# Meta-prompt — generar el prompt de handover de un goal

Este fichero contiene el prompt que se pega a un agente (o que ejecuta `/goal --make-prompt <doc>`)
justo después de terminar de escribir un documento canónico, para producir su fichero
`*-goal-prompt.md`.

- Plantilla de salida: [`goal-prompt.template.md`](./goal-prompt.template.md)
- Plantilla del documento de entrada: [`goal-doc.template.md`](./goal-doc.template.md)
- Perfil del proyecto: [`../goal-profile.md`](../goal-profile.md)
- Protocolo del loop: [`../goal-loop.md`](../goal-loop.md)

---

## Versión corta (la que se teclea)

```text
Genera un prompt de handover mediante la skill "goal" para implementar íntegramente el documento canónico recién generado. Al final de cada fase se hace un loop con dos subagentes, "goal-reviewer" y "goal-code-reviewer". Se implementa toda objeción, sugerencia y nit que devuelvan. Solo cuando ambos subagentes no devuelvan nada sobre el mismo estado del código se hacen los commits y se pasa a la fase siguiente.
```

---

## Versión completa (la que se usa para generar el fichero)

```text
Genera el prompt de handover para implementar íntegramente el documento canónico <RUTA_DEL_DOC>.

ENTRADAS
- Documento canónico: <RUTA_DEL_DOC> (leerlo COMPLETO antes de escribir nada).
- Perfil del proyecto: agent-docs/goal-profile.md (comandos §4, gates §5, zonas protegidas §6, invariantes §7, arquitectura §8, git §10). Si no existe, decirlo y no inventar reglas de proyecto.
- Plantilla de salida: agent-docs/templates/goal-prompt.template.md (respetar su estructura de secciones).
- Protocolo del loop: agent-docs/goal-loop.md.
- Harness del repo: los documentos que liste el perfil §2.

SALIDA
Un único fichero markdown en <MISMA_CARPETA_DEL_DOC>/<BASENAME>-goal-prompt.md, con las secciones de la plantilla:
1) Encabezado: uso, canon (enlace al doc), perfil del proyecto, roadmap, branch de trabajo esperado, harness, loop.
2) §1 Protocolo de fase obligatorio + definición de ronda limpia + límites de convergencia + resolución de contradicciones + reglas globales.
3) §2 Bloque GOAL copiable en un bloque ```text: autoridad, orden de fases, protocolo por fase, restricciones, criterio de completitud y entregable final.
4) §3 Variantes cortas de una sola fase.
5) §4 Tabla de subagentes con su condición de salida.
6) §5 Commits orientativos por fase.
7) §6 Checklist rápido por fase.

REGLAS DE DERIVACIÓN (todo sale del documento y del perfil; nada se inventa)
- Fases: exactamente las de §7 del documento, con sus mismos identificadores y su DoD por fase. Si el documento no tiene plan de fases, PARAR y decirlo; no inventar fases.
- Restricciones: las de §9 (fuera de alcance) + §2 (decisiones cerradas) del documento, expresadas en imperativo negativo, más las zonas protegidas del perfil §6 y los invariantes del perfil §7 que apliquen.
- Verificación: citar los comandos reales del perfil §4, no comandos genéricos. Si el perfil dice "No aplica" en un nivel, no exigir ese nivel.
- Gates: los del perfil §5, con su umbral exacto.
- Tests: citar por su prefijo de §3.8 / §4.6 (p. ej. <PREFIJO>-*) y exigir la suite de regresión que el documento nombre.
- Autoridad: doc canónico > perfil §2. Decir explícitamente que el prompt NO sustituye al documento y que ante contradicción gana el documento.
- Branch: el que indique el encabezado del documento; si no hay ninguno, usar «el HEAD actual del worktree» y no inventar nombre.
- Rutas: reales y verificadas contra el repo. Si una ruta citada por el documento no existe, señalarlo en el prompt en vez de copiarla a ciegas.

PROTOCOLO QUE DEBE QUEDAR ESCRITO EN EL PROMPT (literal en lo esencial)
Al final de CADA fase, en este orden:
1) Implementación + tests de toda superficie tocada.
2) Verificación local proporcional al riesgo con los comandos del perfil §4.
3) Loop con el subagente "goal-reviewer" sobre el diff de la fase: aplicar ÍNTEGRAMENTE todas las objeciones, sugerencias y nits; re-ejecutar; repetir hasta ronda limpia (cero ítems accionables de cualquier severidad).
4) Loop con el subagente "goal-code-reviewer" sobre el mismo alcance: mismo criterio, hasta ronda limpia.
5) Si el paso 4 modificó código, repetir el paso 3: ambos subagentes deben quedar limpios sobre el MISMO estado del código.
6) Solo entonces: commits de la fase. Sin push y sin PR.
7) Solo entonces: fase siguiente. Prohibido empezar la fase N+1 con hallazgos abiertos, con un solo subagente limpio, o sin los commits de la fase N.

Además debe constar: el tope de rondas por subagente y fase del perfil §9 antes de escalar al humano; parar y escalar si una ronda repite el mismo conjunto de hallazgos que la anterior; rechazar un hallazgo solo con evidencia verificable registrada en el body del commit; un hallazgo rechazado dos veces se escala.

TONO Y FORMA
- <Idioma del perfil §1 para el texto humano>, imperativo, sin relleno ni emojis.
- El bloque GOAL debe ser autosuficiente: quien lo pegue en una sesión limpia no necesita leer nada más para saber qué implementar, en qué orden y con qué puertas.
- No repetir la especificación del documento dentro del prompt: referenciar secciones (§) en vez de copiarlas.
```

---

## Comprobación de la salida

El prompt generado está bien si:

- [ ] Sus fases son las del documento, sin añadidos ni fusiones.
- [ ] El bloque `GOAL` se puede pegar solo y sigue siendo ejecutable.
- [ ] Cada fase tiene una condición de cierre verificable (DoD citado por §).
- [ ] El protocolo de loop aparece completo: aplicar todo, ronda limpia, misma foto, commits después.
- [ ] Están los límites de convergencia (tope de rondas, oscilación, rechazo con evidencia).
- [ ] Las restricciones cubren §2 y §9 del documento + §6 y §7 del perfil.
- [ ] Los comandos de verificación son los reales del perfil §4, no inventados.
- [ ] Dice explícitamente que la autoridad es el documento, no el prompt.
- [ ] No contiene especificación duplicada del documento.

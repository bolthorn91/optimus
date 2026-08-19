# Plantilla — prompt de handover para `/goal`

Copiar junto al documento canónico como `<basename>-goal-prompt.md` y rellenar. Se genera sola con
`/goal --make-prompt <ruta-del-doc>` (ver [`goal-prompt.metaprompt.md`](./goal-prompt.metaprompt.md)).
Borrar esta cabecera y las líneas en _cursiva_ antes de publicar.

Reglas de la plantilla:

- El prompt **no** manda sobre el documento: si se contradicen, gana el documento.
- El bloque `GOAL` de §2 tiene que ser copiable tal cual y autosuficiente.
- No inventar fases: son las del documento, con sus mismos identificadores.
- No duplicar la especificación: citar secciones (§) del documento en vez de copiarlas.

---

# GOAL prompt — \<título de la feature\> (doc \<NN\>)

**Uso:** `/goal <ruta>/<NN>-<slug>-goal-prompt.md`, o copiar el bloque `GOAL` de §2 a una sesión de implementación.
**Canon de producto:** [`<NN>-<slug>.md`](<NN>-<slug>.md).
**Perfil de proyecto:** [`agent-docs/goal-profile.md`](../../agent-docs/goal-profile.md) — invariantes §7 aplicables: \<I1, I3…\>.
**Roadmap:** \<enlace y §, o No aplica\>.
**Branch de trabajo esperado:** `<rama>` \<o «el HEAD actual del worktree; no inventar rama»\>.
**Harness:** \<documentos del perfil §2\>.
**Loop:** [`agent-docs/goal-loop.md`](../../agent-docs/goal-loop.md).

---

## 1. Protocolo de fase (obligatorio en cada fase \<A–E\>)

Para **cada** fase, en este orden **estricto**:

1. **Implementar** el alcance de la fase según el doc \<NN\> (sin reabrir las decisiones §2:
   \<C\*, F\*, S\*, D\*\>).
2. **Tests** de toda la superficie tocada en el mismo cambio; no diluir los gates del perfil §5.
3. **Verificación local** proporcional al riesgo, con los comandos del perfil §4 (typecheck y tests
   focalizados en cada fase; suite completa y cobertura al cerrar fases grandes y el programa).
4. **Loop subagente `goal-reviewer`** (persona de corrección) sobre el diff de la fase:
   - **Implementar íntegramente todas** las objeciones, sugerencias y nits que devuelva (sin
     cherry-pick, sin «lo dejamos en deuda»), salvo que el hallazgo sea **demostrablemente** fuera
     del alcance del doc \<NN\> o un falso positivo con evidencia registrada.
   - Relanzar sobre el diff actualizado.
   - **Repetir** hasta ronda con **cero** ítems accionables de cualquier severidad.
5. **Loop subagente `goal-code-reviewer`** (persona de mantenibilidad) sobre el mismo alcance:
   - **Implementar íntegramente todas** las objeciones, sugerencias y nits.
   - Relanzar. **Repetir** hasta ronda limpia.
6. **Puerta de misma foto:** si el paso 5 tocó código, la ronda limpia del paso 4 caducó → volver al
   paso 4. Ambos subagentes deben tener su última ronda limpia sobre el **mismo hash** del diff de
   la fase.
7. **Solo entonces:** crear los **commits** de la fase (estilo del perfil §10; sin secretos; sin
   amend de commits ajenos). Sin push, sin PR.
8. **Solo entonces** iniciar la fase siguiente. **Prohibido** empezar la fase N+1 con hallazgos
   abiertos, con un solo subagente limpio, o sin los commits de la fase N.

### Definición de ronda limpia

Una ronda está limpia **solo si** el subagente no devuelve ninguna objeción, ninguna sugerencia de
cambio y ningún nit. `VERDICT: CLEAN` / lista vacía → limpio. **Cualquier** ítem accionable → no
limpio: aplicar y re-ejecutar el **mismo** subagente.

### Límites de convergencia

- Máximo **\<5\> rondas** por subagente y fase (perfil §9). Al agotarlas: parar, listar los hallazgos
  abiertos y pedir decisión al humano. Nunca declarar limpio por cansancio.
- Si una ronda devuelve el mismo conjunto `(file:line, severidad)` que la anterior, el loop no
  converge: parar y escalar en vez de reaplicar.
- Rechazar un hallazgo exige evidencia verificable, registrada en el estado del run y en el body del
  commit de la fase. Un hallazgo rechazado dos veces se escala, no se rechaza otra vez.

### Si los dos subagentes se contradicen

1. Preferir la interpretación que **cumple el doc \<NN\>** y la cadena de autoridad del perfil §2.
2. Aplicar ambas si son compatibles.
3. Si son mutuamente excluyentes: implementar la que preserve \<los invariantes del perfil §7 + el
   DoD de la fase\>; documentar la otra en el body del commit como «considerado / no aplicado por
   conflicto con doc \<NN\> §X».

### Reglas globales del goal

- **No push / no PR** salvo que el humano lo pida explícitamente después (perfil §10).
- **No reabrir** las decisiones cerradas del doc \<NN\> §2.
- **No bajar** umbrales de los gates del perfil §5 ni ampliar excludes para «pasarlos».
- **No tocar** las zonas protegidas del perfil §6 salvo los paths que el doc \<NN\> autoriza
  explícitamente: \<lista\>.
- **Invariantes del perfil §7** aplicables a esta feature: \<I1, I3…\> — no romperlos ni dejar que se
  rompan en el código tocado.
- **Idioma y comentarios** según perfil §1.
- Si el contexto se compacta o la sesión se reinicia: **continuar** desde el worktree
  (`/goal --resume`); no resetear ni reescribir la feature desde cero.
- **No saltar fases.** No marcar el programa completo si una fase quedó a medias.

---

## 2. Bloque GOAL (copiar tal cual)

```text
GOAL: Implementar al 100 % la funcionalidad canónica de <ruta>/<NN>-<slug>.md (<resumen de una línea>), cumpliendo todos los gates, decisiones cerradas y criterios de hecho del documento, hasta el desarrollo completo en el worktree/branch actual (<rama> o el HEAD del worktree).

AUTORIDAD
- Producto y alcance: <ruta>/<NN>-<slug>.md (leer completo antes de codificar; no reabrir §2 decisiones <C*/F*/S*/D*>).
- Ingeniería: agent-docs/goal-profile.md (perfil del proyecto: comandos §4, gates §5, zonas protegidas §6, invariantes §7, arquitectura §8, git §10) + <documentos del perfil §2>.
- Roadmap a actualizar al cerrar: <ruta y §, o ninguno>.
- Deuda: <ruta del fichero de deuda> — al final registrar las filas del doc <NN> §12 que queden sin cubrir.
- Relacionado ya hecho (no reimplementar): <feature> — reutilizar <componentes>.

ORDEN DE FASES (doc <NN> §7) — secuencial, sin saltar

FASE A — <título>
- <entregable concreto>
- <entregable concreto>
- Tests <PREFIJO>-* (doc <NN> §3.8); regresión <suite existente> sin cambio de comportamiento.
- DoD fase: doc <NN> §7 Fase A + §8.1 en lo que sea <backend/motor>.

FASE B — <título>
- <entregables>
- DoD fase: doc <NN> §7 Fase B + resto §8.1.

FASE C — <título>
- <entregables>
- DoD fase: doc <NN> §7 Fase C + §8.2 API.

FASE D — <título>
- <entregables>
- DoD fase: doc <NN> §7 Fase D + resto §8.2.

FASE E — Cierre documental y gates globales
- Marcar DoD en doc <NN> §8 y roadmap de forma honesta (hecho en branch).
- Registrar la deuda del doc <NN> §12 en <fichero de deuda>; actualizar el inventario E2E si hubo specs.
- Ejecutar los gates del perfil §5 y dejarlos en verde de verdad.
- Limpieza residual: wiring muerto, traducciones incompletas, tests obsoletos.
- DoD programa: doc <NN> §8 Global + fases A–D cerradas.

PROTOCOLO OBLIGATORIO AL FINAL DE CADA FASE (A, B, C, D, E)
1) Implementación + tests de la fase.
2) Verificación local con los comandos del perfil §4 (cobertura al cerrar <D/E> o si la fase toca <área crítica>).
3) LOOP subagente goal-reviewer sobre el diff de la fase:
   - Aplicar TODAS las objeciones, sugerencias y nits devueltas.
   - Re-ejecutar hasta ronda LIMPIA (cero ítems). Máx. <5> rondas; luego escalar.
4) LOOP subagente goal-code-reviewer sobre el mismo alcance:
   - Aplicar TODAS las objeciones, sugerencias y nits devueltas.
   - Re-ejecutar hasta ronda LIMPIA. Máx. <5> rondas; luego escalar.
5) Si (4) tocó código, repetir (3): ambos deben quedar limpios sobre el MISMO estado del código.
6) Solo entonces: commits de la fase (lógicos y claros; no push; no PR).
7) Solo entonces: fase siguiente. Si un re-check posterior encuentra regresión, no avanzar hasta nueva ronda limpia + commits de fix.

RESTRICCIONES
- No push, no abrir PR, no force-push, no git reset --hard, no descartar trabajo ajeno.
- No reabrir decisiones del doc <NN> §2.
- No bajar umbrales de gates ni ampliar excludes.
- No tocar las zonas protegidas del perfil §6 fuera de <paths autorizados por el doc>.
- No romper los invariantes del perfil §7: <I1, I3…>.
- <restricción funcional del doc, p. ej. «sin compartir vistas entre usuarios en v1»>
- <restricción funcional del doc>
- Idioma y comentarios según perfil §1.
- Continuar desde el worktree actual si hay progreso parcial; no reiniciar la feature.
- No empezar la fase N+1 sin commits de la fase N tras ambos loops limpios.

CRITERIO DE COMPLETITUD DEL GOAL
El goal solo está completo cuando las fases A–E están implementadas, cada una pasó (1) implementación+tests, (2) loop goal-reviewer limpio, (3) loop goal-code-reviewer limpio sobre la misma foto, (4) commits; los DoD del doc <NN> §8 se cumplen en código y tests; los gates del perfil §5 están en verde; y la documentación de roadmap/deuda/doc <NN> refleja el estado real.

ENTREGABLE FINAL
Resumen por fase: qué se hizo, commits (hash + mensaje), comandos de verificación ejecutados con su resultado, número de rondas de cada subagente hasta limpio, y residuos o deuda documentada.
```

---

## 3. Variantes cortas (una fase)

Usar solo si el humano pide acotar. **Mismo protocolo:** implementar → tests → loop `goal-reviewer`
limpio → loop `goal-code-reviewer` limpio → misma foto → commits. No push/PR.

### 3.1 Solo Fase A

```text
GOAL: Completar solo la FASE A de <ruta>/<NN>-<slug>.md (<alcance en una línea>). Leer doc <NN> §<secciones> y agent-docs/goal-profile.md. Tests de toda superficie tocada. Al terminar: loop goal-reviewer hasta limpio (aplicar TODO), luego loop goal-code-reviewer hasta limpio (aplicar TODO), re-verificar goal-reviewer si hubo cambios, luego commits. No push/PR. No implementar <lo que pertenece a fases posteriores>.
```

### 3.2 Solo Fase B

```text
GOAL: Completar solo la FASE B de <ruta>/<NN>-<slug>.md (<alcance>). Leer doc <NN> §<secciones> y agent-docs/goal-profile.md. Mismo protocolo: goal-reviewer limpio → goal-code-reviewer limpio → misma foto → commits. No push/PR. Requiere la Fase A ya en el branch.
```

_Replicar para C, D y E según haga falta._

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

Commits lógicos **tras** las rondas limpias de la fase, no antes. Estilo según perfil §10.

| Fase | Mensaje orientativo |
|------|---------------------|
| A | `<type(scope): resumen>` |
| B | `<type(scope): resumen>` |
| C | `<type(scope): resumen>` |
| D | `<type(scope): resumen>` |
| E | `docs(<scope>): marcar DoD y registrar deuda` |

Ajustar al estilo real del repo (`git log --oneline -20`).

---

## 6. Checklist rápido del agente (por fase)

```text
[ ] Alcance de la fase leído en el doc <NN>
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

*Generado para delegación GOAL. La autoridad de producto sigue siendo el doc \<NN\>, no este prompt.*

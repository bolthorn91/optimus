# GOAL prompt — Vistas guardadas en listados (doc 01)

> **Ejemplo.** Generado desde [`01-saved-views.md`](01-saved-views.md) con la plantilla
> `goal-prompt.template.md`. Proyecto ficticio «Acme App»: reutiliza la estructura, no el contenido.

**Uso:** `/goal docs/product/01-saved-views-goal-prompt.md`, o copiar el bloque `GOAL` de §2 a una sesión de implementación.
**Canon de producto:** [`01-saved-views.md`](01-saved-views.md).
**Perfil de proyecto:** [`agent-docs/goal-profile.md`](../../goal-profile.md) — invariantes §7 aplicables: I1, I2, I3, I4, I5, I6.
**Roadmap:** [`roadmap.md`](roadmap.md) §4.2.
**Branch de trabajo esperado:** `feat/saved-views` (partir del HEAD actual del worktree; no reinventar la rama).
**Harness:** `AGENTS.md` + `docs/engineering/testing-policy.md` (perfil §2).
**Loop:** [`agent-docs/goal-loop.md`](../../../../agent-docs/goal-loop.md).

---

## 1. Protocolo de fase (obligatorio en cada fase A–E)

Para **cada** fase, en este orden **estricto**:

1. **Implementar** el alcance de la fase según el doc 01 (sin reabrir las decisiones §2: C1–C5,
   F1–F12, D1–D2).
2. **Tests** de toda la superficie tocada en el mismo cambio; no diluir los gates del perfil §5.
3. **Verificación local** proporcional al riesgo, con los comandos del perfil §4:
   `npm run typecheck` y `npx vitest run <ruta>` en cada fase; `npm run db:migrate:status` en la
   fase A; `npm test` y `npm run test:coverage` al cerrar las fases D y E.
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

1. Preferir la interpretación que **cumple el doc 01** y la cadena de autoridad del perfil §2.
2. Aplicar ambas si son compatibles.
3. Si son mutuamente excluyentes: implementar la que preserve los invariantes del perfil §7 (I1–I6)
   y el DoD de la fase; documentar la otra en el body del commit como «considerado / no aplicado por
   conflicto con doc 01 §X».

### Reglas globales del goal

- **No push / no PR** salvo que el humano lo pida explícitamente después (perfil §10).
- **No reabrir** las decisiones cerradas del doc 01 §2.
- **No bajar** los umbrales del perfil §5 (cobertura ≥ 80 % en las cuatro métricas) ni ampliar
  excludes para «pasarlos».
- **No tocar** las zonas protegidas del perfil §6 (`src/legacy/`, `src/db/generated/`, migraciones ya
  aplicadas). Sí se extienden `src/server/records/`, `src/server/saved-views/` y
  `src/client/features/records/`.
- **Invariantes del perfil §7** aplicables: I1 (ámbito por propietario en toda consulta), I2
  (validación por esquema antes del servicio), I3 (nada de datos personales en logs), I4 (permiso
  explícito por handler), I5 (migración reversible), I6 (`404`, nunca `403`, para recursos ajenos).
- **Idioma:** textos de usuario en español, identificadores en inglés, sin comentarios de relleno
  (perfil §1).
- Si el contexto se compacta o la sesión se reinicia: **continuar** desde el worktree
  (`/goal --resume`); no resetear ni reescribir la feature desde cero.
- **No saltar fases.** No marcar el programa completo si una fase quedó a medias.

---

## 2. Bloque GOAL (copiar tal cual)

```text
GOAL: Implementar al 100 % la funcionalidad canónica de docs/product/01-saved-views.md (vistas guardadas privadas por usuario en los listados: guardar, listar, aplicar, renombrar, borrar y marcar una predeterminada), cumpliendo todos los gates, decisiones cerradas y criterios de hecho del documento, hasta el desarrollo completo en el worktree/branch actual (feat/saved-views o el HEAD del worktree).

AUTORIDAD
- Producto y alcance: docs/product/01-saved-views.md (leer completo antes de codificar; no reabrir §2 decisiones C1-C5, F1-F12, D1-D2).
- Ingeniería: agent-docs/goal-profile.md (comandos §4, gates §5, zonas protegidas §6, invariantes §7, arquitectura §8, git §10) + AGENTS.md + docs/engineering/testing-policy.md.
- Roadmap a actualizar al cerrar: docs/product/roadmap.md §4.2.
- Deuda: docs/debt/technical-debt.md — al final registrar las filas del doc 01 §12 que queden sin cubrir por Playwright.
- Relacionado ya hecho (no reimplementar): el listado de registros y su API de filtros — reutilizar useRecordFilters, RecordsToolbar, el patrón de Record.repo.ts y withTransaction.

ORDEN DE FASES (doc 01 §7) — secuencial, sin saltar

FASE A — Esquema y repositorio
- Migración reversible que crea saved_views con sus tres índices (doc 01 §3.2), incluido el índice parcial UNIQUE (user_id, list_key) WHERE is_default.
- SavedViewRepo con interfaz e implementación en un solo fichero; todos los métodos reciben userId (invariante I1).
- Tests de repositorio contra base real: ámbito por propietario, unicidad de nombre normalizado, predeterminada única, cascada al borrar usuario.
- Tests SV-04, SV-08 (doc 01 §3.8).
- DoD fase: doc 01 §7 Fase A + la parte de §8.1 que sea persistencia.

FASE B — Servicio de aplicación y reglas
- SavedViewService con inyección por constructor y static create().
- Validación de listKey, nombre, esquema y tamaño de definition; un único helper de normalización.
- Bloque transaccional de creación y actualización con la regla de predeterminada única (doc 01 §3.3).
- Errores de dominio tipados: INVALID_LIST_KEY, INVALID_NAME, INVALID_DEFINITION, DEFINITION_TOO_LARGE, LIMIT_REACHED, NAME_TAKEN, NOT_FOUND.
- Tests SV-01 a SV-07 y SV-10.
- DoD fase: doc 01 §7 Fase B + resto de §8.1 en lo que sea reglas.

FASE C — API HTTP
- saved-views.routes.ts con los cuatro endpoints de doc 01 §3.7.
- Esquemas en schemas.ts aplicados antes del servicio (I2); permiso explícito por handler (I4); mapeo de errores de dominio a códigos HTTP con 404 para recursos ajenos (I6).
- Tests de ruta: contrato de respuesta, códigos de error, aislamiento entre usuarios (SV-08, SV-09).
- DoD fase: doc 01 §7 Fase C.

FASE D — UI del listado
- Selector de vistas en RecordsToolbar: listar en el orden F11, aplicar, guardar la actual, renombrar, borrar, marcar predeterminada.
- Aplicación de la predeterminada al entrar sin pisar los filtros que vengan en la URL.
- Aviso único de filtros desconocidos (F7) y estado deshabilitado para schemaVersion futura.
- Textos del doc 01 §6; tests de cliente con acción + aserción observable (SV-11, SV-12).
- DoD fase: doc 01 §7 Fase D + resto de §8.1.

FASE E — Cierre documental y gates globales
- Marcar DoD en doc 01 §8 y roadmap §4.2 de forma honesta (hecho en branch).
- Registrar la deuda del doc 01 §12 en docs/debt/technical-debt.md; actualizar docs/engineering/e2e-user-stories.md si se añadieron specs.
- Ejecutar npm run typecheck, npm run lint, npm test y npm run test:coverage; dejar cobertura >= 80 % en lines, branches, functions y statements.
- Limpieza residual: wiring muerto, claves de traducción sin usar, tests obsoletos.
- DoD programa: doc 01 §8.3 Global + fases A-D cerradas.

PROTOCOLO OBLIGATORIO AL FINAL DE CADA FASE (A, B, C, D, E)
1) Implementación + tests de la fase.
2) Verificación local con los comandos del perfil §4 (cobertura al cerrar D y E; db:migrate:status en A).
3) LOOP subagente goal-reviewer sobre el diff de la fase:
   - Aplicar TODAS las objeciones, sugerencias y nits devueltas.
   - Re-ejecutar hasta ronda LIMPIA (cero ítems). Máx. 5 rondas; luego escalar.
4) LOOP subagente goal-code-reviewer sobre el mismo alcance:
   - Aplicar TODAS las objeciones, sugerencias y nits devueltas.
   - Re-ejecutar hasta ronda LIMPIA. Máx. 5 rondas; luego escalar.
5) Si (4) tocó código, repetir (3): ambos deben quedar limpios sobre el MISMO estado del código.
6) Solo entonces: commits de la fase (lógicos y claros; no push; no PR).
7) Solo entonces: fase siguiente. Si un re-check posterior encuentra regresión, no avanzar hasta nueva ronda limpia + commits de fix.

RESTRICCIONES
- No push, no abrir PR, no force-push, no git reset --hard, no descartar trabajo ajeno.
- No reabrir decisiones del doc 01 §2.
- No bajar umbrales de cobertura ni ampliar excludes.
- No tocar src/legacy/, src/db/generated/ ni migraciones ya aplicadas (perfil §6).
- No romper los invariantes del perfil §7 (I1 ámbito por propietario, I2 validación por esquema, I3 sin datos personales en logs, I4 permiso explícito, I5 migración reversible, I6 404 en vez de 403).
- Vistas privadas: nada de compartir, publicar ni heredar vistas en v1 (doc 01 §9).
- No guardar columnas visibles ni su ancho: es preferencia de UI, no filtro (doc 01 C5).
- No persistir SQL ni query string cruda en definition: solo la forma de F3 con schemaVersion.
- Textos de usuario en español, identificadores en inglés, sin comentarios de relleno.
- Continuar desde el worktree actual si hay progreso parcial; no reiniciar la feature.
- No empezar la fase N+1 sin commits de la fase N tras ambos loops limpios.

CRITERIO DE COMPLETITUD DEL GOAL
El goal solo está completo cuando las fases A-E están implementadas, cada una pasó (1) implementación+tests, (2) loop goal-reviewer limpio, (3) loop goal-code-reviewer limpio sobre la misma foto, (4) commits; los DoD del doc 01 §8 se cumplen en código y tests; los doce tests SV-01 a SV-12 existen y pasan; los gates del perfil §5 están en verde; y roadmap, deuda y doc 01 reflejan el estado real.

ENTREGABLE FINAL
Resumen por fase: qué se hizo, commits (hash + mensaje), comandos de verificación ejecutados con su resultado, número de rondas de cada subagente hasta limpio, y residuos o deuda documentada.
```

---

## 3. Variantes cortas (una fase)

Usar solo si el humano pide acotar. **Mismo protocolo:** implementar → tests → loop `goal-reviewer`
limpio → loop `goal-code-reviewer` limpio → misma foto → commits. No push/PR.

### 3.1 Solo Fase A

```text
GOAL: Completar solo la FASE A de docs/product/01-saved-views.md (migración de saved_views con sus tres índices + SavedViewRepo con ámbito por propietario y sus tests contra base real). Leer doc 01 §2, §3.2, §3.8, §7 y agent-docs/goal-profile.md. Al terminar: loop goal-reviewer hasta limpio (aplicar TODO), luego loop goal-code-reviewer hasta limpio (aplicar TODO), re-verificar goal-reviewer si hubo cambios, luego commits. No push/PR. No implementar servicio, API ni UI.
```

### 3.2 Solo Fase B

```text
GOAL: Completar solo la FASE B de docs/product/01-saved-views.md (SavedViewService: validación, normalización de nombre, límite de 20, predeterminada única transaccional y errores tipados). Leer doc 01 §2, §3.3, §3.6, §3.8, §7 y agent-docs/goal-profile.md. Mismo protocolo: goal-reviewer limpio → goal-code-reviewer limpio → misma foto → commits. No push/PR. Requiere la Fase A ya en el branch. No implementar rutas HTTP ni UI.
```

### 3.3 Solo Fase C

```text
GOAL: Completar solo la FASE C de docs/product/01-saved-views.md (los cuatro endpoints REST de §3.7 con esquemas de validación, permiso explícito por handler y 404 para recursos ajenos). Leer doc 01 §3.7, §5, §3.8 y agent-docs/goal-profile.md §7. Mismo protocolo hasta ambos loops limpios sobre la misma foto, luego commits. No push/PR. Requiere las fases A y B en el branch. No tocar la UI.
```

### 3.4 Solo Fase D

```text
GOAL: Completar solo la FASE D de docs/product/01-saved-views.md (selector de vistas en RecordsToolbar: aplicar, guardar, renombrar, borrar, predeterminada, aviso de filtros desconocidos). Leer doc 01 §6, §7 Fase D, §3.8 (SV-11, SV-12) y agent-docs/goal-profile.md §8. Mismo protocolo. Requiere la fase C en el branch. Sin lógica de negocio en componentes.
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

| Fase | Mensaje orientativo |
|------|---------------------|
| A | `feat(saved-views): add saved_views schema and owner-scoped repository` |
| B | `feat(saved-views): add application service with default and limit rules` |
| C | `feat(saved-views): expose REST API with schema validation and ownership checks` |
| D | `feat(records): add saved view selector to the list toolbar` |
| E | `docs(saved-views): mark DoD, update roadmap and record E2E debt` |

Ajustar al estilo real del repo (`git log --oneline -20`).

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

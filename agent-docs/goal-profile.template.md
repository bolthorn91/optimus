# Perfil de proyecto — goal loop

Copiar a `agent-docs/goal-profile.md` y rellenar. Es el **único** fichero que hay que tocar para
adaptar el loop a un proyecto nuevo: la skill `/goal` y los dos subagentes leen de aquí todo lo que
es específico del repositorio (rutas, comandos, gates, zonas protegidas, invariantes, convenciones,
política de git).

Contrato de formato — no romperlo:

- **La numeración §1–§10 es estable.** La skill y los agentes citan las secciones por número, nunca
  por título. Puedes traducir los títulos; no toques los números ni el orden.
- Una sección que no aplica se rellena con `No aplica`. **Nunca se borra y nunca se deja vacía**:
  vacío significa «que decida el agente», y el agente no debe decidir esto.
- Todo lo que escribas aquí es **normativo** para el review: si no quieres que se exija en cada
  fase, no lo escribas.
- Rutas y comandos **reales y verificados**. Un comando que no existe convierte la verificación en
  teatro.

---

## §1 Identidad y lenguaje

| Campo | Valor |
|-------|-------|
| Proyecto | `<nombre>` |
| Stack | `<p. ej. TypeScript + Node + React, Python + FastAPI, Go, Rails…>` |
| Gestor de paquetes / runner | `<npm / pnpm / uv / poetry / make…>` |
| Idioma de los textos de usuario | `<es / en / n/a>` |
| Idioma de identificadores y código | `<en>` |
| Política de comentarios | `<p. ej. escasos y explicando el porqué; prohibido narrar el cambio>` |
| Rama base | `<main>` |

---

## §2 Autoridad documental (orden de precedencia)

De mayor a menor. Ante contradicción gana el de arriba; si dos empatan, gana el documento de la goal
en curso.

1. Documento canónico de la goal en curso (`<carpeta de docs de producto>`)
2. `<AGENTS.md | CLAUDE.md | CONTRIBUTING.md>` — instrucciones de agentes del repo
3. `<ruta de la política de tests / calidad, o No aplica>`
4. `<otros documentos normativos, o No aplica>`

---

## §3 Rutas canónicas

| Rol | Ruta | Obligatoria |
|-----|------|-------------|
| Documentos de goal | `<docs/product/NN-<slug>.md>` | sí |
| Prompt de handover | junto al doc, `<basename>-goal-prompt.md` | sí |
| Instrucciones de agentes | `<AGENTS.md>` | sí |
| Política de tests / cobertura | `<ruta o No aplica>` | no |
| Registro de deuda técnica | `<ruta o No aplica>` | no |
| Inventario de historias E2E | `<ruta o No aplica>` | no |
| Roadmap a actualizar al cerrar | `<ruta o No aplica>` | no |
| Estado de los runs (git-ignored) | `.grok/goal-runs/` | sí |
| Plantillas del loop | `agent-docs/templates/` | sí |

---

## §4 Comandos de verificación

Comandos ejecutables tal cual desde la raíz del repo. La skill no inventa comandos que no estén
aquí; si falta uno, lo dice en vez de improvisar.

| Nivel | Comando | Cuándo se ejecuta |
|-------|---------|-------------------|
| Typecheck | `<comando o No aplica>` | cada fase |
| Lint | `<comando o No aplica>` | cada fase |
| Tests focalizados | `<comando + cómo filtrar por fichero/patrón>` | cada fase, solo lo tocado |
| Suite completa | `<comando o No aplica>` | cierre de fase grande |
| Cobertura | `<comando o No aplica>` | cierre de fase grande y cierre de programa |
| Build | `<comando o No aplica>` | cierre de programa |
| Migraciones / esquema | `<comando o No aplica>` | fases que tocan datos |
| Otros checks propios | `<comando o No aplica>` | `<cuándo>` |

---

## §5 Gates de calidad (bloqueantes)

| Gate | Umbral | Alcance |
|------|--------|---------|
| Cobertura | `<≥ 80 % en lines, branches, functions y statements — o No aplica>` | `<paquetes/carpetas>` |
| `<otro gate>` | `<umbral>` | `<alcance>` |

Reglas fijas, no negociables por el agente:

- No bajar umbrales ni ampliar `exclude` para pasar un gate.
- Toda superficie nueva o modificada va con tests en el mismo cambio.
- Un gate que no se ha ejecutado se reporta como «no ejecutado», nunca como «pasa».

---

## §6 Zonas protegidas (no modificar)

| Ruta / patrón | Motivo | Excepción autorizada |
|---------------|--------|----------------------|
| `<ruta legacy o generada>` | `<por qué está congelada>` | `<solo si el doc de goal lo exige explícitamente>` |

Si el proyecto no tiene zonas congeladas: `No aplica`.
Duplicación inevitable causada por una zona protegida → registrarla en el fichero de deuda de §3.

---

## §7 Invariantes transversales

Se comprueban en **todas** las fases, toque lo que toque el diff. Son la sustitución genérica de las
reglas de dominio de cada proyecto. Borra los ejemplos que no apliquen y escribe los tuyos.

| # | Invariante | Cómo se verifica | Severidad si se rompe |
|---|------------|------------------|-----------------------|
| I1 | `<ej.: todo acceso a datos filtra por propietario/tenant>` | `<ruta del helper, patrón a buscar, test que lo cubre>` | bug |
| I2 | `<ej.: aritmética sensible solo vía <helper>; prohibido float>` | `<cómo se comprueba>` | bug |
| I3 | `<ej.: ningún dato personal en logs, analítica ni respuestas de error>` | `<cómo se comprueba>` | bug |
| I4 | `<ej.: toda ruta pública exige comprobación de permiso explícita>` | `<cómo se comprueba>` | bug |
| I5 | `<ej.: los cambios de esquema van con migración reversible>` | `<cómo se comprueba>` | bug |

Si el proyecto no tiene invariantes transversales: `No aplica` (y el review se limita a corrección,
spec y tests).

---

## §8 Convenciones de arquitectura

Lo que el revisor de mantenibilidad exige. Si el proyecto no las tiene escritas, poner
`Inferir del código circundante` y el agente hará cumplir el patrón dominante existente.

- **Capas y ubicación:** `<dónde vive el dominio, la persistencia, el transporte, la UI>`
- **Naming de ficheros:** `<convención real, p. ej. kebab-case para módulos, PascalCase para clases>`
- **Imports:** `<orden y prohibiciones, p. ej. externos → alias internos → relativos; sin barrels>`
- **Patrones obligatorios:** `<p. ej. inyección por constructor, repositorio en un solo fichero>`
- **Patrones prohibidos:** `<p. ej. singletons ocultos, acceso a BD desde la capa de transporte>`
- **Reutilización:** `<utilidades canónicas que hay que usar en vez de escribir una nueva>`

---

## §9 Parámetros del loop

| Parámetro | Defecto | Este proyecto |
|-----------|---------|---------------|
| Severidades accionables | `bug`, `suggestion`, `nit` | `<igual / lista reducida>` |
| Máx. rondas por subagente y fase | 5 | `<n>` |
| Umbral de tamaño de fichero | 1000 líneas | `<n>` |
| Aviso por diff grande | 1 MB | `<tamaño>` |
| Parada por diff enorme | 10 MB | `<tamaño>` |
| Orden de subagentes | `goal-reviewer` → `goal-code-reviewer` | `<igual>` |
| Fases supervisadas | no | `<sí / no>` |

Reducir las severidades accionables (p. ej. dejar fuera los `nit`) hace el loop más rápido y más
laxo. Es la palanca de calibración; el resto de parámetros rara vez se tocan.

---

## §10 Política de git

| Punto | Valor |
|-------|-------|
| Commits por fase | `<uno lógico por entregable; nunca antes de las dos rondas limpias>` |
| Estilo de mensaje | `<p. ej. Conventional Commits: type(scope): resumen>` |
| Índice | `<¿se permite `git add -A -N` para recolectar el diff? sí / no>` |
| Push | `<prohibido salvo petición explícita del humano>` |
| Pull request | `<prohibido salvo petición explícita del humano>` |
| Operaciones prohibidas | force-push, `reset --hard`, amend de commits ajenos, descartar trabajo ajeno |
| Firma / hooks | `<no saltarse hooks ni firma>` |

---

*Rellenado por: `<nombre>` · Última revisión: `<AAAA-MM-DD>`. Mantener este fichero al día es lo que
mantiene honesto al loop.*

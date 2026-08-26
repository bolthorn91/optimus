# Perfil de proyecto — goal loop

> **Ejemplo.** Proyecto ficticio «Acme App». Stack, rutas, comandos y umbrales son de ejemplo:
> sustitúyelos por los reales de tu proyecto. Lo que hay que copiar de aquí es la **forma**, no el
> contenido.

Contrato de formato — no romperlo:

- **La numeración §1–§10 es estable.** La skill y los agentes citan las secciones por número, nunca
  por título.
- Una sección que no aplica se rellena con `No aplica`. Nunca se borra ni se deja vacía.
- Todo lo que está aquí escrito es **normativo** para el review de cada fase.

---

## §1 Identidad y lenguaje

| Campo | Valor |
|-------|-------|
| Proyecto | Acme App |
| Stack | TypeScript strict + Node/Express (API) + React (SPA) + PostgreSQL |
| Gestor de paquetes / runner | `npm` |
| Idioma de los textos de usuario | es |
| Idioma de identificadores y código | en |
| Política de comentarios | Escasos y explicando el porqué. Prohibido narrar el cambio, restatear el código o dejar historia de diseño en comentarios. |
| Rama base | `main` |

---

## §2 Autoridad documental (orden de precedencia)

De mayor a menor. Ante contradicción gana el de arriba; si dos empatan, gana el documento de la goal
en curso.

1. Documento canónico de la goal en curso (`docs/product/NN-<slug>.md`)
2. `AGENTS.md` — instrucciones de agentes del repo
3. `docs/engineering/testing-policy.md` — política de tests y cobertura
4. Este perfil

---

## §3 Rutas canónicas

| Rol | Ruta | Obligatoria |
|-----|------|-------------|
| Documentos de goal | `docs/product/NN-<slug>.md` | sí |
| Prompt de handover | `docs/product/NN-<slug>-goal-prompt.md` | sí |
| Instrucciones de agentes | `AGENTS.md` | sí |
| Política de tests / cobertura | `docs/engineering/testing-policy.md` | no |
| Registro de deuda técnica | `docs/debt/technical-debt.md` | no |
| Inventario de historias E2E | `docs/engineering/e2e-user-stories.md` | no |
| Roadmap a actualizar al cerrar | `docs/product/roadmap.md` | no |
| Estado de los runs (git-ignored) | `.grok/goal-runs/` | sí |
| Plantillas del loop | `agent-docs/templates/` | sí |

---

## §4 Comandos de verificación

| Nivel | Comando | Cuándo se ejecuta |
|-------|---------|-------------------|
| Typecheck | `npm run typecheck` | cada fase |
| Lint | `npm run lint` | cada fase |
| Tests focalizados | `npx vitest run <ruta-o-patrón>` | cada fase, solo lo tocado |
| Suite completa | `npm test` | cierre de fase grande |
| Cobertura | `npm run test:coverage` | cierre de fase grande y cierre de programa |
| Build | `npm run build` | cierre de programa |
| Migraciones / esquema | `npm run db:migrate` (aplicar) · `npm run db:migrate:status` (verificar) | fases que tocan datos |
| E2E | `npx playwright test` | solo si la fase añade o cambia specs |

---

## §5 Gates de calidad (bloqueantes)

| Gate | Umbral | Alcance |
|------|--------|---------|
| Cobertura | ≥ 80 % en lines, branches, functions y statements | `src/server/**` y `src/client/**` por separado |
| Typecheck | cero errores | todo el repo |
| Lint | cero errores (los warnings no bloquean) | todo el repo |

Reglas fijas, no negociables por el agente:

- No bajar umbrales ni ampliar `exclude` para pasar un gate.
- Toda superficie nueva o modificada va con tests en el mismo cambio.
- Un gate que no se ha ejecutado se reporta como «no ejecutado», nunca como «pasa».

---

## §6 Zonas protegidas (no modificar)

| Ruta / patrón | Motivo | Excepción autorizada |
|---------------|--------|----------------------|
| `src/legacy/` | Módulo congelado, sin tests y en vías de retirada | Solo si el documento de goal lo exige explícitamente y lo justifica |
| `src/db/generated/` | Código generado por el ORM | Regenerar con `npm run db:generate`, nunca editar a mano |
| `migrations/*.sql` ya aplicadas | Historial inmutable | Nunca: los cambios van en una migración nueva |

Duplicación inevitable causada por una zona protegida → registrarla en `docs/debt/technical-debt.md`.

---

## §7 Invariantes transversales

Se comprueban en **todas** las fases, toque lo que toque el diff.

| # | Invariante | Cómo se verifica | Severidad si se rompe |
|---|------------|------------------|-----------------------|
| I1 | Todo acceso a datos de usuario filtra por propietario: ninguna consulta sin `user_id` en el `WHERE` o en el filtro del repositorio | Leer el repositorio y sus tests; buscar consultas sin ámbito | bug |
| I2 | Toda entrada de una ruta HTTP se valida con un esquema declarado antes de llegar al servicio; nada de `req.body` crudo aguas abajo | Leer la ruta y su esquema | bug |
| I3 | Ningún dato personal (email, nombre, teléfono, identificador de sesión) en logs, mensajes de error de cara al cliente ni telemetría | Buscar `logger.` en el diff y revisar el payload | bug |
| I4 | Toda ruta no pública exige comprobación de permiso explícita en el propio handler; no se hereda del router | Leer el handler | bug |
| I5 | Todo cambio de esquema va en una migración nueva, reversible y con su verificación en `db:migrate:status` | Leer la migración | bug |
| I6 | Un recurso ajeno responde `404`, nunca `403`: no se filtra la existencia | Leer el handler y sus tests | bug |

---

## §8 Convenciones de arquitectura

- **Capas y ubicación:** dominio y reglas en `src/server/<feature>/`; persistencia en
  `src/server/<feature>/<Name>.repo.ts` (interfaz + implementación en el mismo fichero); transporte
  en `src/server/<feature>/<feature>.routes.ts`; esquemas de validación en
  `src/server/<feature>/schemas.ts`; UI en `src/client/features/<feature>/`.
- **Naming de ficheros:** `kebab-case` para módulos y rutas; `PascalCase` para clases, repositorios
  y componentes React.
- **Imports:** externos → alias internos (`@shared/`, `@server/`, `@client/`) → relativos. Sin
  ficheros barril `index.ts`.
- **Patrones obligatorios:** servicios de aplicación con inyección por constructor y `static
  create()`; errores de dominio tipados que la capa de transporte mapea a códigos HTTP; operaciones
  que tocan varias filas, dentro de una transacción.
- **Patrones prohibidos:** acceso a base de datos desde la capa de transporte; singletons ocultos con
  estado mutable; lógica de negocio en componentes React.
- **Reutilización:** usar `@shared/result` para resultados esperables, `@server/db/withTransaction`
  para transacciones y `@client/lib/api` para llamadas HTTP, en vez de escribir variantes nuevas.

---

## §9 Parámetros del loop

| Parámetro | Defecto | Este proyecto |
|-----------|---------|---------------|
| Severidades accionables | `bug`, `suggestion`, `nit` | igual (las tres) |
| Máx. rondas por subagente y fase | 5 | 5 |
| Umbral de tamaño de fichero | 1000 líneas | 500 líneas |
| Aviso por diff grande | 1 MB | 1 MB |
| Parada por diff enorme | 10 MB | 10 MB |
| Orden de subagentes | `goal-reviewer` → `goal-code-reviewer` | igual |
| Fases supervisadas | no | no |

---

## §10 Política de git

| Punto | Valor |
|-------|-------|
| Commits por fase | Uno lógico por entregable; nunca antes de las dos rondas limpias sobre la misma foto |
| Estilo de mensaje | Conventional Commits: `type(scope): resumen en imperativo` |
| Índice | Se permite `git add -A -N` para recolectar el diff de la fase |
| Push | Prohibido salvo petición explícita del humano |
| Pull request | Prohibido salvo petición explícita del humano |
| Operaciones prohibidas | force-push, `reset --hard`, amend de commits ajenos, descartar trabajo ajeno |
| Firma / hooks | No saltarse hooks ni firma (`--no-verify` prohibido) |

---

*Rellenado por: equipo Acme · Última revisión: 2026-01-15.*

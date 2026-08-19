# Vistas guardadas en listados

> **Ejemplo.** Proyecto ficticio «Acme App». La feature, las rutas y los identificadores son de
> ejemplo: lo que hay que reutilizar es la **estructura** del documento, no su contenido.

**Estado:** especificación canónica (decisiones cerradas 2026-01-15). Pendiente de implementación en branch `feat/saved-views`.
**Branch de trabajo:** `feat/saved-views`.
**Perfil de proyecto:** [`agent-docs/goal-profile.md`](../../goal-profile.md) — invariantes §7 aplicables: I1, I2, I3, I4, I5, I6.
**Roadmap:** [`roadmap.md`](roadmap.md) §4.2.
**Relacionado:** el listado de registros (`RecordsPage`) y su API de filtros ya existen; este documento **no** los rediseña, solo persiste combinaciones de filtros.

Este documento sustituye cualquier conversación previa sobre «guardar filtros» y manda sobre alcance,
modelo de datos, API, UX, gates y plan de implementación de la feature.

| Referencia | Tema | Resumen v1 |
|------------|------|------------|
| **roadmap §4.2** | Vistas guardadas | El usuario guarda la combinación de filtros y orden de un listado con un nombre, la reutiliza y puede marcar una como predeterminada. Vistas privadas, sin compartir. |

---

## 1. Contexto del software actual (punto de partida)

### 1.1 Listado de registros

| Pieza | Ubicación | Comportamiento |
|-------|-----------|----------------|
| Pantalla de listado | `src/client/features/records/RecordsPage.tsx` | Renderiza la tabla y la barra de herramientas; mantiene los filtros en estado local. |
| Barra de filtros | `src/client/features/records/RecordsToolbar.tsx` | Filtros por estado, propietario, rango de fechas y texto libre; selector de orden. |
| Estado de filtros | `src/client/features/records/useRecordFilters.ts` | Hook que serializa los filtros a query string y los lee de vuelta. |
| API de listado | `src/server/records/records.routes.ts` | `GET /api/records` acepta los filtros como query params ya validados por esquema. |

**Contrato actual:** los filtros viven en la URL. Al recargar se recuperan de la query string; al
cambiar de pantalla se pierden.

**No existe** ninguna persistencia de combinaciones de filtros: cada usuario reconstruye a mano las
mismas búsquedas cada día. Eso es lo que este documento introduce.

### 1.2 Identidad y permisos

| Pieza | Estado |
|-------|--------|
| Usuario autenticado | `req.user.id` disponible en todos los handlers autenticados vía `requireAuth`. |
| Comprobación de permiso | Explícita en cada handler (perfil §7 I4); no hay permisos de equipo sobre listados. |

---

## 2. Decisiones cerradas (no reabrir en v1)

### 2.1 Comunes

| # | Tema | Decisión |
|---|------|----------|
| C1 | Idioma | Textos de usuario en español, identificadores y código en inglés, claves de traducción en el mismo cambio (perfil §1). |
| C2 | Tests | Unit de dominio, tests de repositorio contra base real, tests de ruta y tests de cliente en el mismo cambio. Cobertura ≥ 80 % en las cuatro métricas (perfil §5). E2E Playwright = deuda explícita en `docs/debt/technical-debt.md` salvo que la fase D ya lo cubra. |
| C3 | Zonas protegidas | No se toca `src/legacy/` ni `src/db/generated/` (perfil §6). Sí se extienden `src/server/records/` y `src/client/features/records/`. |
| C4 | Invariantes | Aplican I1 (ámbito por propietario), I2 (validación en la ruta), I3 (nada de datos personales en logs), I4 (permiso explícito), I5 (migración reversible), I6 (`404` para recursos ajenos). |
| C5 | Vista ≠ preferencia de usuario | Una vista guardada es un recurso con nombre y ciclo de vida propio. No se mezcla con la tabla de preferencias de usuario ni con el estado de columnas visibles. |

### 2.2 Vistas guardadas

| # | Tema | Decisión |
|---|------|----------|
| F1 | Alcance v1 | Vistas **privadas** por usuario. Compartir, publicar o heredar vistas queda fuera (§9). |
| F2 | Ámbito | Una vista pertenece al par (usuario, `listKey`). `listKey` es un identificador estable de pantalla (`records`, `invoices`…), validado contra una lista blanca del servidor. |
| F3 | Contenido | `definition = { schemaVersion: 1, filters: {...}, sort: { field, direction } }`, JSON validado por esquema. **Nunca** SQL, fragmentos de consulta ni query string cruda. |
| F4 | Límite | Máximo **20** vistas por (usuario, `listKey`). La creación número 21 falla con `409` y código `saved_view_limit_reached`. |
| F5 | Nombre | 1–60 caracteres tras recortar espacios. Único por (usuario, `listKey`) comparando en minúsculas y con espacios normalizados. Colisión → `409` con código `saved_view_name_taken`. |
| F6 | Predeterminada | Como máximo **una** vista predeterminada por (usuario, `listKey`). Marcar una desmarca la anterior **en la misma transacción**. |
| F7 | Filtros desconocidos | Al aplicar una vista, los campos de filtro que ya no existen se **ignoran** y la UI avisa una vez. No se borra la vista ni se rompe el listado. |
| F8 | Borrado | Borrado físico. Si la vista borrada era la predeterminada, el listado vuelve al estado por defecto sin vista aplicada. |
| F9 | Permisos | Solo el propietario lee, escribe y borra. Cualquier acceso a una vista ajena o inexistente responde `404` (I6). |
| F10 | API | REST bajo `/api/saved-views`. Sin endpoint «aplicar»: la UI aplica la definición en cliente reutilizando `useRecordFilters`. |
| F11 | Orden de presentación | Predeterminada primero, después por nombre ascendente con colación insensible a mayúsculas. |
| F12 | Migración de datos | Ninguna: la tabla nace vacía. La migración solo crea tabla e índices y es reversible (I5). |

### 2.3 Segunda feature

`No aplica` — este documento cubre una sola feature.

### 2.4 Enums / catálogos compartidos

| # | Tema | Decisión |
|---|------|----------|
| D1 | `listKey` | Lista blanca en `src/shared/lists.ts`: `records`, `invoices`. Añadir una pantalla nueva es añadir un valor ahí, no un campo libre. |
| D2 | No reutilizar el enum de preferencias | Un `listKey` no es una clave de preferencia de usuario: se separan para no acoplar dos ciclos de vida distintos. |

---

## 3. Vistas guardadas — Especificación de implementación

### 3.1 Objetivo de negocio

Un usuario que trabaja a diario sobre el mismo subconjunto de registros («mis pendientes de esta
semana», «cerrados del trimestre») deja de reconstruir los filtros a mano: los guarda una vez con un
nombre y los reutiliza en un clic, con la opción de que uno de ellos sea el que ve al entrar.

### 3.2 Modelo de datos

Tabla `saved_views`:

| Columna | Tipo | Notas |
|---------|------|-------|
| `id` | `uuid` PK | generado por la base de datos |
| `user_id` | `uuid` NOT NULL | FK a `users(id)` con `ON DELETE CASCADE` |
| `list_key` | `text` NOT NULL | validado contra la lista blanca D1 |
| `name` | `text` NOT NULL | tal como lo escribió el usuario, recortado |
| `name_normalized` | `text` NOT NULL | minúsculas + espacios internos colapsados; solo para unicidad |
| `definition` | `jsonb` NOT NULL | forma de F3; máximo 8 KB serializado |
| `is_default` | `boolean` NOT NULL DEFAULT `false` | |
| `created_at` / `updated_at` | `timestamptz` NOT NULL | |

Índices:

- `UNIQUE (user_id, list_key, name_normalized)` — implementa F5.
- `UNIQUE (user_id, list_key) WHERE is_default` — índice parcial que implementa F6 en la base de
  datos, no solo en el servicio.
- `INDEX (user_id, list_key)` — lectura del listado de vistas.

La migración crea tabla e índices y define su reverso (perfil §7 I5).

### 3.3 Algoritmo canónico (pseudocódigo)

```text
crear_vista(userId, listKey, name, definition, isDefault):
  validar listKey contra lista blanca            -> si no, error INVALID_LIST_KEY
  name := recortar(name)
  validar 1 <= longitud(name) <= 60              -> si no, error INVALID_NAME
  validar definition contra esquema              -> si no, error INVALID_DEFINITION
  validar tamaño(definition) <= 8 KB             -> si no, error DEFINITION_TOO_LARGE

  en transacción:
    n := contar vistas de (userId, listKey)
    si n >= 20                                   -> error LIMIT_REACHED
    si isDefault:
      desmarcar la predeterminada actual de (userId, listKey)
    insertar fila con name_normalized := normalizar(name)
    si la inserción viola el índice de nombre    -> error NAME_TAKEN
  devolver la vista creada
```

`actualizar_vista` reutiliza las mismas validaciones y el mismo bloque transaccional; `marcar_como_
predeterminada` es un caso particular de actualización. **Un solo helper de normalización y una sola
transacción**: prohibido duplicar la regla de «una sola predeterminada» en cada punto de escritura.

### 3.4 Superficies de escritura a unificar

| Punto de escritura | Fichero | Nota |
|--------------------|---------|------|
| Crear vista | `src/server/saved-views/SavedViewService.ts` | única puerta de entrada |
| Actualizar vista (nombre, definición, predeterminada) | mismo servicio | reutiliza el bloque transaccional |
| Borrar vista | mismo servicio | si era predeterminada, no promueve ninguna otra (F8) |

### 3.5 Migración / recálculo de datos existentes

No hay datos que migrar (F12). La migración es puramente estructural y reversible. `npm run
db:migrate:status` debe quedar limpio al cerrar la fase A.

### 3.6 Casos límite

- Nombre que solo difiere en mayúsculas o espacios → colisión (F5).
- Dos peticiones concurrentes marcando predeterminadas distintas → el índice parcial garantiza que
  solo una gana; la perdedora reintenta o devuelve `409`.
- `definition` con filtros desconocidos → se acepta al guardar (el esquema valida forma, no
  vocabulario) y se ignoran al aplicar (F7).
- Usuario borrado → sus vistas se borran en cascada.
- Vista con `definition` de una `schemaVersion` futura → se muestra deshabilitada con aviso; no se
  intenta aplicar.

### 3.7 API

| Método | Ruta | Request | Response | Permiso | Errores |
|--------|------|---------|----------|---------|---------|
| GET | `/api/saved-views?listKey=<k>` | — | `{ views: SavedView[] }` ordenadas por F11 | autenticado, solo propias | `400` listKey inválido |
| POST | `/api/saved-views` | `{ listKey, name, definition, isDefault? }` | `201 { view }` | autenticado | `400`, `409 saved_view_limit_reached`, `409 saved_view_name_taken` |
| PATCH | `/api/saved-views/:id` | `{ name?, definition?, isDefault? }` | `200 { view }` | propietario | `400`, `404`, `409` |
| DELETE | `/api/saved-views/:id` | — | `204` | propietario | `404` |

Toda ruta valida la entrada con esquema antes del servicio (I2) y comprueba el permiso en el propio
handler (I4). Una vista ajena responde `404` (I6).

### 3.8 Tests golden (mínimos)

| ID | Escenario | Esperado |
|----|-----------|----------|
| SV-01 | Crear vista válida | `201`, fila persistida, `isDefault=false` |
| SV-02 | Crear con `isDefault=true` habiendo otra predeterminada | La anterior queda en `false`; solo una predeterminada |
| SV-03 | Crear la vista número 21 | `409 saved_view_limit_reached`, no se inserta nada |
| SV-04 | Crear con nombre que solo difiere en mayúsculas | `409 saved_view_name_taken` |
| SV-05 | Nombre de 61 caracteres / vacío tras recortar | `400 INVALID_NAME` |
| SV-06 | `definition` que no cumple el esquema o supera 8 KB | `400` |
| SV-07 | `listKey` fuera de la lista blanca | `400 INVALID_LIST_KEY` |
| SV-08 | Listar vistas de otro usuario | Solo devuelve las propias; nunca las ajenas |
| SV-09 | `PATCH`/`DELETE` de una vista ajena | `404`, no `403` |
| SV-10 | Borrar la vista predeterminada | `204`; no queda ninguna predeterminada |
| SV-11 | Aplicar una vista con un filtro que ya no existe | El listado se aplica ignorando ese campo y avisa una vez |
| SV-12 | Regresión: listado sin vistas guardadas | El comportamiento del listado es idéntico al actual |

SV-12 es obligatorio: demuestra que la feature en su estado por defecto no cambia nada de lo que ya
funcionaba.

---

## 4. Segunda feature

`No aplica`.

---

## 5. Seguridad, permisos y aislamiento

- Toda consulta del repositorio filtra por `user_id` (I1); no existe un método de lectura sin ámbito.
- Cada handler comprueba el permiso explícitamente (I4); no se hereda del router.
- Una vista ajena o inexistente responde `404`, nunca `403` (I6).
- `definition` limitado a 8 KB y validado por esquema antes de tocar la base de datos (I2).
- Los logs de la feature registran `savedViewId` y `listKey`; nunca el nombre de la vista, el
  contenido de los filtros ni datos del usuario (I3).

---

## 6. Textos de interfaz (claves orientativas)

| Clave | ES |
|-------|-----|
| `savedViews.title` | Vistas guardadas |
| `savedViews.save` | Guardar vista actual |
| `savedViews.namePlaceholder` | Nombre de la vista |
| `savedViews.setDefault` | Usar como predeterminada |
| `savedViews.delete` | Eliminar vista |
| `savedViews.error.limitReached` | Has alcanzado el máximo de 20 vistas guardadas en este listado. |
| `savedViews.error.nameTaken` | Ya tienes una vista con ese nombre. |
| `savedViews.warning.unknownFilters` | Algunos filtros de esta vista ya no existen y se han ignorado. |

---

## 7. Plan de implementación (fases)

### Fase A — Esquema y repositorio

1. Migración reversible que crea `saved_views` con sus tres índices (§3.2).
2. `SavedViewRepo` (interfaz + implementación en un solo fichero) con `listByUserAndList`,
   `findOwned`, `insert`, `update`, `delete`, `clearDefault`, `countByUserAndList`. Todos los
   métodos reciben `userId` (I1).
3. Tests de repositorio contra base real: ámbito por propietario, unicidad de nombre, índice parcial
   de predeterminada, cascada al borrar usuario.

**DoD fase A:** migración aplicada y reversible verificada con `npm run db:migrate:status`; tests de
repositorio cubriendo SV-04, SV-08 y la unicidad de predeterminada; ninguna consulta sin `user_id`.

### Fase B — Servicio de aplicación y reglas

1. `SavedViewService` con inyección por constructor y `static create()` (perfil §8).
2. Validación de nombre, `listKey`, esquema y tamaño de `definition`; normalización en un único
   helper.
3. Bloque transaccional de creación y actualización con la regla «una sola predeterminada» (§3.3).
4. Errores de dominio tipados: `INVALID_LIST_KEY`, `INVALID_NAME`, `INVALID_DEFINITION`,
   `DEFINITION_TOO_LARGE`, `LIMIT_REACHED`, `NAME_TAKEN`, `NOT_FOUND`.

**DoD fase B:** tests unitarios SV-01 a SV-07 y SV-10 en verde; la regla de predeterminada única
existe en un solo sitio; ningún punto de escritura duplica la validación.

### Fase C — API HTTP

1. `saved-views.routes.ts` con los cuatro endpoints de §3.7.
2. Esquemas de validación en `schemas.ts`, aplicados antes del servicio (I2).
3. Permiso explícito por handler (I4) y mapeo de errores de dominio a códigos HTTP, con `404` para
   recursos ajenos (I6).
4. Tests de ruta: contrato de respuesta, códigos de error, aislamiento entre usuarios.

**DoD fase C:** tests de ruta cubriendo SV-08 y SV-09; ningún `req.body` crudo aguas abajo del
esquema; logs sin datos personales (I3).

### Fase D — UI del listado

1. Selector de vistas en `RecordsToolbar`: listar (orden F11), aplicar, guardar la actual, renombrar,
   borrar, marcar predeterminada.
2. Aplicación de la vista predeterminada al entrar en la pantalla, sin pisar los filtros que vengan
   en la URL.
3. Aviso único de filtros desconocidos (F7) y estado deshabilitado para `schemaVersion` futura.
4. Textos de §6 y tests de cliente con acción + aserción observable para cada comportamiento.

**DoD fase D:** tests de cliente cubriendo SV-11 y SV-12; sin lógica de negocio en componentes
(perfil §8); textos en español desde las claves de §6.

### Fase E — Cierre documental y gates globales

1. Marcar el DoD de este documento y `roadmap.md` §4.2 de forma honesta («hecho en branch»).
2. Registrar en `docs/debt/technical-debt.md` las historias E2E de §12 que no queden cubiertas por
   Playwright; si se añadieron specs, actualizar `docs/engineering/e2e-user-stories.md`.
3. Ejecutar los gates del perfil §5 y dejarlos en verde de verdad.
4. Limpieza residual: wiring muerto, claves de traducción sin usar, tests obsoletos.

**DoD fase E:** los tres gates del perfil §5 ejecutados y en verde; documentación y deuda reflejando
el estado real.

---

## 8. Criterios de aceptación (DoD)

### 8.1 Vistas guardadas

- [ ] Un usuario puede guardar, listar, renombrar, aplicar y borrar sus vistas en `records`.
- [ ] Como máximo una vista predeterminada por (usuario, listado), garantizado en base de datos.
- [ ] Límite de 20 vistas por listado, con error específico.
- [ ] Nombres únicos por usuario y listado, insensibles a mayúsculas y espacios.
- [ ] Una vista ajena responde `404`.
- [ ] Los filtros desconocidos se ignoran con aviso, sin romper el listado.
- [ ] Los doce tests golden SV-01…SV-12 existen y pasan.

### 8.2 Segunda feature

`No aplica`.

### 8.3 Global

- [ ] `roadmap.md` §4.2 actualizado a «hecho en branch».
- [ ] Historias E2E no cubiertas → filas en `docs/debt/technical-debt.md`.
- [ ] Idioma y política de comentarios del perfil §1 respetados.
- [ ] Ninguna zona protegida del perfil §6 modificada.
- [ ] Gates del perfil §5 en verde, ejecutados de verdad.
- [ ] Ningún invariante del perfil §7 roto en la superficie tocada.

---

## 9. Fuera de alcance (v1)

| Ítem | Notas |
|------|-------|
| Compartir vistas entre usuarios | Requiere modelo de permisos sobre el recurso; se valorará tras v1. |
| Vistas de equipo u organización | Depende de lo anterior. |
| Guardar columnas visibles o su ancho | Es preferencia de UI, no filtro; concepto distinto (C5). |
| Enlaces permanentes a una vista | La URL ya lleva los filtros; duplicarlo confundiría el modelo. |
| Exportar o importar vistas | Sin demanda todavía. |
| Vistas en pantallas fuera de la lista blanca D1 | Se añaden una a una, con su `listKey`. |

---

## 10. Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| La regla de «una sola predeterminada» se implementa solo en el servicio y una escritura concurrente la rompe | Índice parcial único en base de datos (§3.2), con test que lo demuestra |
| La definición guardada se acopla a la forma interna de los filtros y cualquier cambio rompe las vistas | `schemaVersion` explícito (F3) y campos desconocidos ignorados al aplicar (F7) |
| Crecimiento sin control del JSON guardado | Límite de 8 KB validado en la ruta (§3.6) |
| La UI aplica la vista predeterminada y pisa los filtros que el usuario traía en la URL | La URL gana sobre la predeterminada; test explícito en fase D |

---

## 11. Casos de prueba mínimos (checklist de revisión)

- [ ] Guardo la búsqueda «pendientes de esta semana», recargo y la aplico en un clic.
- [ ] Marco una vista como predeterminada; al volver a entrar, el listado ya viene filtrado.
- [ ] Marco otra como predeterminada; la primera deja de serlo.
- [ ] Intento guardar una vista con el nombre de otra cambiando mayúsculas: recibo un error claro.
- [ ] Con 20 vistas guardadas, intento la 21 y recibo un error que explica el límite.
- [ ] Otro usuario no ve mis vistas ni puede abrirlas por id.
- [ ] Borro la predeterminada y el listado vuelve al estado por defecto.

---

## 12. Deuda explícita (registrar al implementar)

### 12.1 E2E — Guardar y reutilizar una vista

- Historia: como usuario del listado, guardo la combinación actual de filtros con un nombre y la
  vuelvo a aplicar más tarde comprobando que la tabla muestra los mismos registros.
- Detectada en: este doc §7 fase D.

### 12.2 E2E — Vista predeterminada

- Historia: como usuario, marco una vista como predeterminada y al volver a entrar en la pantalla
  compruebo que el listado ya viene filtrado por ella.
- Detectada en: este doc §7 fase D.

---

## 13. Referencias de código (pre-feature)

| Área | Rutas |
|------|-------|
| Listado y filtros (cliente) | `src/client/features/records/RecordsPage.tsx`, `RecordsToolbar.tsx`, `useRecordFilters.ts` |
| Listado (servidor) | `src/server/records/records.routes.ts`, `src/server/records/schemas.ts` |
| Patrón de repositorio a copiar | `src/server/records/Record.repo.ts` |
| Patrón de servicio a copiar | `src/server/records/RecordService.ts` |
| Transacciones | `src/server/db/withTransaction.ts` |
| Migraciones | `migrations/` |

---

## 14. Orden de trabajo sugerido en el branch

```text
feat/saved-views
  Fase A  → migración + repositorio con ámbito por propietario
  Fase B  → servicio, validación y regla de predeterminada única
  Fase C  → API REST con validación y permisos
  Fase D  → selector de vistas en el listado
  Fase E  → docs + deuda + gates
```

Dependencias duras: B necesita el repositorio de A; C no puede empezar sin los errores tipados de B;
D no puede empezar sin la API de C. E es siempre la última.

---

*Documento vivo de implementación. Actualizar los checkboxes del DoD y el estado del encabezado al
cerrar cada fase.*

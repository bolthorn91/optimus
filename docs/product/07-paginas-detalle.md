# Páginas de detalle, legales y SEO

**Estado:** especificación canónica (decisiones cerradas 2026-08-17). Pendiente de implementación.
**Branch de trabajo:** el HEAD actual del worktree.
**Perfil de proyecto:** [`agent-docs/goal-profile.md`](../../agent-docs/goal-profile.md) — invariantes §7 aplicables: I1, I2, I3, I4, I6, I7, I8, I9.
**Roadmap:** [`roadmap.md`](roadmap.md) §2, fila 07.
**Relacionado:** documentos [`00`](00-fundacion-sistema-diseno.md) a [`06`](06-acto-vi-firma-cierre-contacto.md). **No reimplementar** ninguna primitiva, escena ni componente ya existente.

Manda sobre el destino de los CTA de la home: las páginas donde el contenido resumido se
desarrolla en detalle, las páginas legales, y la capa de SEO del sitio.

| Referencia | Tema | Resumen v1 |
|------------|------|------------|
| **roadmap §2 fila 07** | Detalle y legales | Siete páginas de acto, tres de vehículo, tres legales, más metadatos, datos estructurados, sitemap y banner de cookies. |

---

## 1. Contexto del software actual (punto de partida)

### 1.1 Lo que existe

| Pieza | Ubicación | Comportamiento |
|-------|-----------|----------------|
| Home completa | `src/scenes/` | Los siete actos y el bloque de contacto |
| Router y ruta marcador | `src/app/` | Documento 00 F8; una ruta de detalle sin contenido |
| Manifiesto de secciones | `src/app/sections.ts` | Del que se derivan navegación, miliario y sitemap |
| Contenido tipado por acto | `src/scenes/*/content.ts` | Resúmenes de la home |
| Datos de contacto con marcadores | `src/content/contact.ts` | Documento 06 |
| Sistema de diseño | `src/styles/`, `src/components/` | Tokens, tipografía y primitivas |

**No existe** ninguna página de detalle real, ninguna página legal, ni metadatos por ruta.

### 1.2 Contenido de origen

| Pieza | Ubicación |
|-------|-----------|
| Contenido completo de los siete actos | `content/secciones/01-…` a `07-…` |
| Requisitos de SEO, cookies y analítica | `content/06-requisitos-funcionales.md` |
| Aviso legal, privacidad, cookies, disclaimer | `content/07-legal-y-disclaimers.md` |
| Datos y tablas completas | `content/03-datos-y-tablas.md` |
| Bloqueos pendientes | `content/08-notas-editoriales.md` |

---

## 2. Decisiones cerradas (no reabrir en v1)

### 2.1 Comunes

| # | Tema | Decisión |
|---|------|----------|
| C1 | Idioma | Español de España. `lang="es-ES"`. Estructura preparada para inglés, sin traducir en v1. |
| C2 | Tests | Los obligatorios del perfil §5. Las páginas de detalle no llevan escenas ancladas, así que el peso del test recae en contenido, semántica y axe. |
| C3 | Zonas protegidas | No se toca `content/`. Este documento autoriza crear `src/pages/`, `src/content/legal/`, `public/robots.txt`, `public/sitemap.xml` y ampliar `src/app/` con rutas y metadatos. |
| C4 | Invariantes | I1, I2, I3, I4, I6, I7, I8, I9. En las páginas legales I2 es crítico: sin datos registrales no se publica un aviso legal inventado. |
| C5 | Detalle ≠ repetición | Una página de detalle **desarrolla**, no repite el resumen de la home. Su contenido es el texto completo del dossier, que en la home aparece condensado. |

### 2.2 Páginas de acto

| # | Tema | Decisión |
|---|------|----------|
| F1 | Rutas | `/escenario-europeo`, `/seguridad-global`, `/estado-de-derecho`, `/estrategia-anticipatoria`, `/nuestra-estrategia`, `/estructura-operativa`, `/asesoramiento-intermediacion`. Legibles, en español, sin numeración en la URL. |
| F2 | Estructura | Cabecera con numeral romano y título · texto completo del acto · datos y tablas íntegras · fuentes de la sección · CTA a `#contacto` de la home. |
| F3 | Sin escenas ancladas | Las páginas de detalle son documentos de lectura, no espectáculo. Movimiento mínimo: entradas por desvanecimiento. El clímax vive en la home. |
| F4 | Reutilización | `<PairedComparison>`, `<RiskTable>`, `<ProjectionTable>`, `<ProcessDiagram>` en modo estático, `<StatFigure>` y `<Disclaimer>` se reutilizan. Cero componentes nuevos de presentación de datos. |
| F5 | Navegación entre actos | Enlaces «acto anterior / acto siguiente» al pie de cada página, más regreso a su posición en la home. |
| F6 | Índice lateral | En escritorio, índice de la propia página con las subsecciones. El contenido completo del acto es largo. |
| F7 | Tabla de contenidos de datos | Toda tabla del acto se reproduce íntegra, no resumida. Es lo que un inversor quiere consultar y copiar. |

### 2.3 Páginas de vehículo

| # | Tema | Decisión |
|---|------|----------|
| S1 | Rutas | `/activos/bienes-raices`, `/activos/acciones-y-titulos`, `/activos/proyectos-al-pozo`. |
| S2 | Contenido | Ventaja estratégica y perfil de rendimiento completos, mecanismo operativo del acto VII aplicable a ese vehículo, y las garantías que le afectan. |
| S3 | Sin inventar | El dossier da tres celdas por vehículo y poco más. **No se rellena con contenido de marketing inventado** (I1): lo que falta se marca como pendiente del cliente y se registra en deuda. |
| S4 | Disclaimer | Obligatorio en las tres: son páginas con afirmaciones de rendimiento (I7). |
| S5 | CTA | Al formulario con ese vehículo preseleccionado, reutilizando el mecanismo del documento 05 F6. |

### 2.4 Páginas legales

| # | Tema | Decisión |
|---|------|----------|
| D1 | Rutas | `/aviso-legal`, `/politica-de-privacidad`, `/politica-de-cookies`. |
| D2 | Datos registrales | Bloqueo B-05: no existen. Se renderiza `<PendingValue>` en cada campo. **Nunca** un CIF, una razón social ni un domicilio inventados: en una página legal eso no es un marcador de trabajo pendiente, es una falsedad publicada (I2). |
| D3 | Aviso de borrador | Mientras haya marcadores, cada página legal lleva un aviso visible de que está pendiente de validación por la asesoría del cliente. Se retira cuando lleguen los datos. |
| D4 | Privacidad | Contenido mínimo de `content/07-legal-y-disclaimers.md`: responsable, finalidades, base legal por finalidad, categorías, destinatarios, **transferencia internacional a Argentina** (decisión de adecuación de la Comisión Europea, declarada expresamente), plazo de conservación, derechos y reclamación ante la AEPD. |
| D5 | Cookies | Inventario con finalidad, titular y duración de cada cookie. Si la analítica elegida no usa cookies, la página lo dice y el inventario queda en las técnicamente necesarias. |
| D6 | Disclaimer financiero | El texto largo de `content/07-legal-y-disclaimers.md`, íntegro, en `/aviso-legal`, además del resumen que ya va en el footer. |
| D7 | No se redacta derecho | Los textos se toman de `content/07-legal-y-disclaimers.md`, que ya los marca como orientativos y pendientes de validación legal. No se escribe cláusula nueva. |

### 2.5 SEO y analítica

| # | Tema | Decisión |
|---|------|----------|
| G1 | Metadatos por ruta | Título, descripción y canónica por página, declarados en el manifiesto de rutas junto a la propia ruta. Un solo sitio. |
| G2 | Open Graph | Imagen 1200×630 con el logotipo sobre navy `#102135`. Generada, no la del dossier. |
| G3 | Datos estructurados | `Organization` con nombre, logotipo y las dos ubicaciones. **Sin `telephone` ni `sameAs`** mientras estén bloqueados (B-01, B-07): un dato estructurado falso es peor que ninguno. |
| G4 | Sitemap y robots | `sitemap.xml` derivado del manifiesto de rutas, no escrito a mano. `robots.txt` permitiendo la indexación. |
| G5 | Analítica | Solución **sin cookies** y respetuosa con la privacidad. Además de simplificar el cumplimiento, es coherente con un sitio cuyo argumentario critica la vigilancia digital. |
| G6 | Banner de cookies | Solo si finalmente se usa alguna cookie no esencial. Si se usa: rechazar tan accesible y visible como aceptar, según la guía de la AEPD. Nada se carga antes del consentimiento. |
| G7 | Eventos | Envío de formulario, clic en cada CTA con su posición, descarga del dossier, profundidad de scroll por acto, interacción con la serie de mapas y con el simulador, clics en `tel:` y `mailto:`. |
| G8 | Sin renderizado en servidor | La SPA no renderiza sin JavaScript. Se acepta en v1 y se registra en deuda; el prerenderizado es la mitigación futura. |

---

## 3. Páginas de detalle — Especificación de implementación

### 3.1 Objetivo de negocio

La home resume para impactar; el detalle desarrolla para convencer. Un inversor que ha llegado
hasta aquí quiere el argumento completo, con sus tablas y sus fuentes, y quiere poder consultarlo
sin animaciones de por medio.

### 3.2 Modelo de datos

`src/app/routes.ts` — manifiesto único del que se derivan router, sitemap y metadatos:

```ts
type RouteEntry = {
  path: string
  kind: "home" | "act" | "vehicle" | "legal"
  actNumber?: 1 | 2 | 3 | 4 | 5 | 6 | 7
  title: string          // <title> y H1
  description: string    // meta description y og:description
  changefreq: "monthly" | "yearly"
  priority: number
  hasPendingData: boolean   // activa el aviso de borrador (D3)
}
```

`src/content/legal/` — un módulo tipado por página legal, con sus secciones y con los campos
pendientes declarados explícitamente:

```ts
type LegalSection = { heading: string; body: string; pending?: PendingField[] }
type PendingField = { label: string; debtId: string }
```

### 3.3 Algoritmo canónico (pseudocódigo)

Generación del sitemap desde el manifiesto — `scripts/build-sitemap.mjs`:

```text
buildSitemap(routes, siteUrl):
  si siteUrl esta vacio o no es una URL absoluta  -> error: no se genera sitemap con base falsa

  entradas := []
  para cada ruta en routes:
    si ruta.kind == "legal" y ruta.hasPendingData:
      continuar                      # no se indexa una pagina legal a medias

    entradas.push({
      loc:        siteUrl + ruta.path,
      changefreq: ruta.changefreq,
      priority:   ruta.priority,
    })

  ordenar entradas por priority descendente, luego por loc
  devolver xml(entradas)
```

Selección de metadatos por ruta:

```text
metaFor(path, routes):
  ruta := routes.find(r => r.path == path)
  si no existe  -> devolver los metadatos de la home y avisar en desarrollo

  devolver {
    title:       ruta.title + " — OPTIMVS Capital Protegido",
    description: ruta.description,
    canonical:   siteUrl + ruta.path,
    ogImage:     siteUrl + "/og.png",
    robots:      ruta.hasPendingData && ruta.kind == "legal" ? "noindex" : "index,follow",
  }
```

_Un solo manifiesto. Prohibido declarar una ruta en el router y otra en el sitemap._

### 3.4 Superficies a unificar

| Punto | Fichero | Nota |
|-------|---------|------|
| Manifiesto de rutas | `src/app/routes.ts` | Router, sitemap y metadatos derivan de aquí (G1, G4) |
| Metadatos por ruta | `src/app/meta.ts` | Función pura; entra en el gate de cobertura |
| Generación del sitemap | `scripts/build-sitemap.mjs` | Se ejecuta en `npm run build` |
| Contenido legal | `src/content/legal/` | Con sus campos pendientes declarados |
| Presentación de datos | `src/components/` | Reutilizados; cero componentes nuevos (F4) |

### 3.5 Migración / recálculo de datos existentes

`No aplica`.

### 3.6 Casos límite

- **`VITE_SITE_URL` ausente:** el sitemap **no se genera** y la build avisa. Un sitemap con base
  falsa es peor que ninguno.
- **Página legal con marcadores pendientes:** se sirve con `noindex` y con el aviso de borrador
  (D3), y queda fuera del sitemap. No se indexa un aviso legal a medias.
- **Ruta desconocida:** página 404 con navegación de vuelta y el CTA. Sin redirección silenciosa a
  la home: el usuario debe saber que la URL no existe.
- **Navegación desde la home a un detalle y vuelta:** se restaura la posición de scroll en la home,
  no el principio. El visitante estaba a mitad del acto V.
- **Enlace directo a un detalle sin pasar por la home:** la página es autónoma; su CTA lleva a
  `/#contacto`.
- **Movimiento reducido:** las páginas de detalle apenas tienen movimiento (F3); el contenido es
  idéntico.
- **Impresión:** las páginas de detalle y las legales tienen hoja de estilos de impresión
  razonable. Es un público que imprime documentos patrimoniales.

### 3.7 API de componentes (contrato de props)

| Componente | Props |
|------------|-------|
| `<DetailLayout>` | `title, actNumber?, toc: TocEntry[], children, prev?, next?` |
| `<ActDetailPage>` | `actNumber: 1..7` — lee su contenido tipado |
| `<VehicleDetailPage>` | `vehicleId: VehicleId` |
| `<LegalPage>` | `document: "notice" \| "privacy" \| "cookies"` |
| `<PendingNotice>` | `fields: PendingField[]` — el aviso de borrador (D3) |
| `<TableOfContents>` | `entries: TocEntry[]` (F6) |
| `<SourceList>` | `sources: string[]` — texto, sin logotipos (I6) |
| `<NotFoundPage>` | ninguna |

### 3.8 Tests golden Detalle (mínimos)

Prefijo estable **`DET`**.

| ID | Escenario | Esperado |
|----|-----------|----------|
| DET-01 | Las siete páginas de acto | Cada una renderiza el texto **completo** del acto, no el resumen de la home (C5) |
| DET-02 | Cada página de acto | Un solo `H1`, jerarquía de encabezados sin saltos de nivel |
| DET-03 | Cada página de acto | Las tablas del acto se reproducen íntegras, no resumidas (F7) |
| DET-04 | Las tres páginas de vehículo | Renderizan `<Disclaimer>` (S4, I7) |
| DET-05 | Las tres páginas de vehículo | No contienen contenido de marketing sin respaldo en `content/` (S3, I1) |
| DET-06 | CTA de una página de vehículo | Lleva al formulario con ese vehículo preseleccionado (S5) |
| DET-07 | Las tres páginas legales | Todo campo registral ausente es `<PendingValue>`; **ningún CIF, razón social ni domicilio inventado** (D2, I2) |
| DET-08 | Página legal con marcadores | Muestra el aviso de borrador y se sirve con `noindex` (D3, §3.6) |
| DET-09 | Política de privacidad | Declara expresamente la transferencia internacional a Argentina (D4) |
| DET-10 | `/aviso-legal` | Contiene el disclaimer financiero largo íntegro (D6) |
| DET-11 | `metaFor` de cada ruta | Devuelve título, descripción y canónica; ninguna ruta sin metadatos |
| DET-12 | `buildSitemap` sin `VITE_SITE_URL` | No genera sitemap y falla con mensaje claro (§3.6) |
| DET-13 | `buildSitemap` con páginas legales pendientes | Las excluye del sitemap |
| DET-14 | Datos estructurados | `Organization` sin `telephone` ni `sameAs` mientras B-01 y B-07 estén abiertos (G3) |
| DET-15 | Ruta desconocida | Página 404 con navegación y CTA; sin redirección silenciosa |
| DET-16 | Vuelta de un detalle a la home | Se restaura la posición de scroll previa, no el principio |
| DET-17 | Cada página con axe | Cero violaciones `critical` y `serious` |
| DET-18 | Fuentes en las páginas de acto | Solo texto; ningún `<img>` con nombre de organismo (I6) |
| DET-19 | Fidelidad de contenido | El texto de cada página de acto coincide carácter a carácter con su fichero de `content/secciones/` (I1) |
| DET-20 | Regresión: la home | La home y sus siete actos siguen funcionando con las trece páginas nuevas montadas |

DET-07 es el test más importante del documento: impide publicar un aviso legal con datos
registrales inventados.

---

## 4. SEO, cookies y analítica — Especificación de implementación

### 4.1 Objetivo de negocio

Que el sitio sea encontrable por las búsquedas que hace el público objetivo —invertir en Argentina
desde España, convenio de doble imposición, comprar propiedad siendo extranjero— y que la medición
no contradiga el discurso de privacidad del propio sitio.

### 4.2 Modelo de datos

| Campo | Tipo | Origen |
|-------|------|--------|
| `routes` | `RouteEntry[]` | `src/app/routes.ts` |
| `organization` | `OrganizationSchema` | Sin `telephone` ni `sameAs` (G3) |
| `analyticsEvents` | `EventName[]` | Los siete de G7 |

### 4.3 Flujo UX

Sin banner si la analítica no usa cookies (G5, G6). Si finalmente se usa: el banner aparece una
vez, con rechazar y aceptar al mismo nivel visual, y nada no esencial se carga antes de la
elección.

### 4.4 API (orientativa)

| Pieza | Contrato |
|-------|----------|
| `metaFor(path)` | Devuelve los metadatos de la ruta; función pura |
| `trackEvent(name, payload?)` | No hace nada sin consentimiento cuando el consentimiento aplica |
| `buildSitemap(routes, siteUrl)` | Función pura; falla sin base absoluta |

### 4.5 UI

- Banner de cookies, si aplica: rechazar tan accesible como aceptar, sin patrón oscuro.
- Enlaces a las tres páginas legales desde el footer y desde el formulario.
- Imagen Open Graph generada con el logotipo sobre navy.

### 4.6 Tests golden SEO (mínimos)

Prefijo estable **`SEO`**.

| ID | Escenario | Esperado |
|----|-----------|----------|
| SEO-01 | Todas las rutas del manifiesto | Cada una tiene título y descripción no vacíos y distintos entre sí |
| SEO-02 | Cada página renderizada | Canónica absoluta correcta |
| SEO-03 | `buildSitemap` con rutas válidas | XML bien formado, ordenado por prioridad, con todas las rutas indexables |
| SEO-04 | `trackEvent` sin consentimiento, cuando el consentimiento aplica | No emite ningún evento ni petición de red |
| SEO-05 | Banner de cookies, si existe | Rechazar y aceptar al mismo nivel visual y ambos alcanzables con teclado |
| SEO-06 | Carga inicial | Ninguna cookie no esencial antes del consentimiento (G6) |
| SEO-07 | `robots.txt` | Existe y permite la indexación de las rutas públicas |
| SEO-08 | Bundle de producción | Ninguna clave literal; solo `VITE_*` (I8) |

---

## 5. Seguridad, permisos y aislamiento

- **I2, DET-07:** ningún dato registral inventado en las páginas legales. Es el punto donde
  inventar un dato deja de ser un atajo y pasa a ser una falsedad publicada.
- **G3, DET-14:** los datos estructurados omiten teléfono y redes mientras estén bloqueados.
- **I8, SEO-08:** sin claves literales en el bundle.
- **I6, DET-18:** fuentes y organismos como texto en todas las páginas.
- **I7, DET-04, DET-10:** disclaimer en las páginas de vehículo y disclaimer largo en el aviso legal.
- **G5, SEO-04, SEO-06:** sin cookies no esenciales antes del consentimiento; analítica sin cookies
  preferida.
- **Cabeceras de seguridad:** ya declaradas en `render.yaml` por el documento 00.

---

## 6. Textos de interfaz (claves orientativas)

| Clave | ES |
|-------|-----|
| `detail.backToHome` | Volver al sitio |
| `detail.prevAct` | Acto anterior |
| `detail.nextAct` | Acto siguiente |
| `detail.toc` | En esta página |
| `detail.sources` | Fuentes de esta sección |
| `legal.draftNotice` | Documento pendiente de validación. Algunos datos identificativos están por confirmar. |
| `legal.notice` | Aviso legal |
| `legal.privacy` | Política de privacidad |
| `legal.cookies` | Política de cookies |
| `notFound.title` | Esta página no existe |
| `notFound.body` | Compruebe la dirección o vuelva al inicio. |
| `cookies.accept` | Aceptar |
| `cookies.reject` | Rechazar |
| `cookies.title` | Cookies |

---

## 7. Plan de implementación (fases)

### Fase A — Manifiesto de rutas y layout de detalle

1. `src/app/routes.ts` con las trece rutas nuevas más la home, con sus metadatos.
2. `src/app/meta.ts` con `metaFor` como función pura.
3. `<DetailLayout>` con cabecera, índice lateral, navegación entre actos y CTA (F2, F5, F6).
4. `<TableOfContents>`, `<SourceList>`, `<NotFoundPage>`.
5. Restauración de la posición de scroll al volver a la home (§3.6).
6. Hoja de estilos de impresión.
7. Tests DET-11, DET-15, DET-16, SEO-01, SEO-02.

**DoD fase A:** el layout de detalle existe y navega; toda ruta tiene metadatos; una URL
desconocida da 404 con salida; volver a la home restaura la posición.

### Fase B — Las siete páginas de acto

1. Contenido completo de cada acto en `src/content/acts/`, literal de `content/secciones/`.
2. `<ActDetailPage>` reutilizando los componentes de datos existentes (F4).
3. Tablas íntegras de cada acto (F7).
4. Fuentes por sección, solo texto (I6).
5. Tests DET-01, DET-02, DET-03, DET-18, DET-19.

**DoD fase B:** las siete páginas desarrollan el acto completo con sus tablas íntegras; el texto
coincide carácter a carácter con el canon; cero componentes nuevos de presentación de datos.

### Fase C — Las tres páginas de vehículo

1. Contenido por vehículo, sin rellenar huecos con marketing inventado (S3).
2. `<VehicleDetailPage>` con ventaja, perfil, mecanismo operativo y garantías aplicables.
3. `<Disclaimer>` obligatorio en las tres (S4).
4. CTA con preselección (S5).
5. Tests DET-04, DET-05, DET-06.

**DoD fase C:** las tres páginas existen con disclaimer; ningún contenido sin respaldo en el canon;
el CTA preselecciona el vehículo.

### Fase D — Legales, SEO y analítica

1. `src/content/legal/` con los tres documentos de `content/07-legal-y-disclaimers.md`, con sus
   campos pendientes declarados (D2, D7).
2. `<PendingNotice>` y servicio con `noindex` de las páginas legales incompletas (D3).
3. Transferencia internacional a Argentina declarada en privacidad (D4); inventario de cookies (D5);
   disclaimer largo en el aviso legal (D6).
4. Imagen Open Graph generada (G2); datos estructurados sin teléfono ni redes (G3).
5. `scripts/build-sitemap.mjs` y `robots.txt` (G4).
6. Analítica sin cookies y los siete eventos de G7; banner solo si aplica (G5, G6).
7. Tests DET-07 a DET-10, DET-13, DET-14, DET-17, DET-20, SEO-03 a SEO-08, DET-12.

**DoD fase D:** las tres páginas legales existen con marcadores y aviso de borrador, fuera del
sitemap y con `noindex`; el sitemap se genera del manifiesto y falla sin base absoluta; sin cookies
no esenciales antes del consentimiento.

### Fase E — Cierre documental y gates globales

1. Marcar el DoD de §8 y la fila 07 del roadmap como «hecho en branch».
2. Registrar en `docs/debt/technical-debt.md` las filas de §12, incluidos B-05 y la ausencia de
   renderizado sin JavaScript.
3. Ejecutar todos los gates del perfil §5.
4. Limpieza residual: rutas huérfanas, claves de traducción sin usar.

**DoD fase E:** los cinco gates del perfil §5 en verde, ejecutados de verdad.

---

## 8. Criterios de aceptación (DoD)

### 8.1 Páginas de detalle

- [ ] Las siete páginas de acto desarrollan el contenido completo, no el resumen.
- [ ] Las tablas se reproducen íntegras.
- [ ] Un solo `H1` por página, sin saltos de nivel de encabezado.
- [ ] Cero componentes nuevos de presentación de datos: todo reutilizado.
- [ ] Las tres páginas de vehículo llevan disclaimer y no inventan contenido.
- [ ] Volver a la home restaura la posición de scroll.
- [ ] Una URL desconocida da 404 con salida clara.

### 8.2 Legales y SEO

- [ ] Ningún dato registral inventado: todos son marcadores.
- [ ] Las páginas legales incompletas llevan aviso de borrador, `noindex` y quedan fuera del sitemap.
- [ ] La privacidad declara la transferencia internacional a Argentina.
- [ ] El aviso legal contiene el disclaimer financiero largo íntegro.
- [ ] Toda ruta tiene título, descripción y canónica; ninguna duplicada.
- [ ] El sitemap se genera del manifiesto y no se genera sin base absoluta.
- [ ] Los datos estructurados omiten teléfono y redes mientras estén bloqueados.
- [ ] Ninguna cookie no esencial antes del consentimiento.
- [ ] Los veinte tests DET-01…DET-20 y los ocho SEO-01…SEO-08 existen y pasan.

### 8.3 Global

- [ ] `docs/product/roadmap.md` fila 07 actualizada a «hecho en branch».
- [ ] Lo no cubierto → filas honestas en `docs/debt/technical-debt.md`.
- [ ] Se respetan el idioma y la política de comentarios del perfil §1.
- [ ] No se modificó ninguna zona protegida del perfil §6 sin autorización de C3.
- [ ] Todos los gates del perfil §5 en verde, ejecutados de verdad.
- [ ] Ningún invariante del perfil §7 roto en la superficie tocada.

---

## 9. Fuera de alcance (v1)

| Ítem | Notas |
|------|-------|
| Publicación de datos registrales | Bloqueo B-05; los aporta el cliente |
| Redacción de cláusulas legales nuevas | D7: se usan los textos del canon, marcados como orientativos |
| Renderizado en servidor o prerenderizado | G8: deuda registrada; afecta al SEO |
| Versión en inglés | La estructura queda preparada; el contenido traducido es v2 |
| Blog o sección de actualidad | Sin contenido y sin quien lo mantenga |
| Escenas animadas en las páginas de detalle | F3: son documentos de lectura |
| Adaptación móvil | Documento 08 |

---

## 10. Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| Se publica un aviso legal con CIF y razón social inventados | I2 + D2 + DET-07: marcadores obligatorios y test que falla si aparece un dato |
| Una página legal a medias se indexa y aparece en buscadores | D3 + DET-08 + DET-13: `noindex` y exclusión del sitemap |
| El sitemap se genera con una base falsa y todas las URL quedan mal | §3.6 + DET-12: sin `VITE_SITE_URL` no se genera y la build avisa |
| Router y sitemap declaran rutas distintas y divergen | Manifiesto único en `src/app/routes.ts` (§3.4) |
| Las páginas de vehículo se rellenan con marketing inventado para que no queden cortas | S3 + DET-05 + I1 |
| Los datos estructurados publican un teléfono bloqueado | G3 + DET-14 |
| La analítica contradice el discurso de privacidad del propio sitio | G5: analítica sin cookies + SEO-04 y SEO-06 |
| Volver del detalle a la home devuelve al principio y el visitante pierde el hilo | DET-16 |
| El detalle repite el resumen de la home y no aporta | C5 + DET-01 |

---

## 11. Casos de prueba mínimos (checklist de revisión)

- [ ] Pulso el CTA de un acto en la home y llego a su página de detalle.
- [ ] La página desarrolla el acto completo, con sus tablas enteras, no el resumen.
- [ ] Uso el índice lateral para saltar entre subsecciones.
- [ ] Navego al acto siguiente y al anterior desde el pie.
- [ ] Vuelvo a la home y aparezco donde estaba, no al principio.
- [ ] Entro en una página de vehículo: tiene disclaimer y su CTA preselecciona el vehículo.
- [ ] Abro el aviso legal: donde iría el CIF hay un marcador y un aviso de que está pendiente.
- [ ] Compruebo que esa página lleva `noindex`.
- [ ] Leo la política de privacidad: dice explícitamente que los datos viajan a Argentina.
- [ ] Escribo una URL inventada: recibo un 404 con salida, no una redirección silenciosa.
- [ ] Miro las cookies en el inspector antes de aceptar nada: no hay ninguna no esencial.
- [ ] Imprimo una página de detalle: sale legible.
- [ ] `npm run build` sin `VITE_SITE_URL`: avisa y no genera un sitemap con base falsa.

---

## 12. Deuda explícita (registrar al implementar)

### 12.1 E2E — Navegación home ↔ detalle

- Historia: como visitante, salto de un acto de la home a su página de detalle, la leo entera y
  vuelvo a mi posición anterior.
- Detectada en: este doc §7 fase A. Sin E2E en v1 (perfil §3).

### 12.2 Bloqueo B-05 — datos registrales

- Sin razón social, CIF, domicilio ni inscripción de ninguna de las dos sociedades. Las tres
  páginas legales quedan con marcadores y `noindex` hasta que lleguen.
- Detectada en: `content/08-notas-editoriales.md` B-05.

### 12.3 Validación legal de los textos

- `content/07-legal-y-disclaimers.md` se declara a sí mismo orientativo y no vinculante. Los tres
  documentos requieren validación de la asesoría del cliente antes de publicar.
- Detectada en: este doc §2.4 D7.

### 12.4 Sin renderizado sin JavaScript

- La SPA no entrega contenido sin JS, lo que penaliza el SEO justo en las páginas que existen para
  ser encontradas. Mitigación futura: prerenderizado estático de home, actos y legales.
- Detectada en: este doc §2.5 G8 y documento 00 §12.3.

### 12.5 Contenido insuficiente en las páginas de vehículo

- El dossier da tres celdas por vehículo. Las páginas quedan cortas y no se rellenan con material
  inventado. Falta contenido del cliente.
- Detectada en: este doc §2.3 S3.

---

## 13. Referencias de código (pre-feature)

| Área | Rutas |
|------|-------|
| Contenido completo de los siete actos | `content/secciones/01-…` a `07-…` |
| Requisitos de SEO, cookies y analítica | `content/06-requisitos-funcionales.md` |
| Textos legales y disclaimer largo | `content/07-legal-y-disclaimers.md` |
| Datos y tablas completas | `content/03-datos-y-tablas.md` |
| Bloqueos pendientes | `content/08-notas-editoriales.md` |
| Router y ruta marcador | `src/app/` (documento 00) |
| Componentes de datos a reutilizar | `src/components/` (documentos 03 a 05) |
| Datos de contacto con marcadores | `src/content/contact.ts` (documento 06) |

---

## 14. Orden de trabajo sugerido en el branch

```text
main
  Fase A  → manifiesto de rutas, metadatos y layout de detalle
  Fase B  → las siete páginas de acto con su contenido completo
  Fase C  → las tres páginas de vehículo
  Fase D  → legales con marcadores, SEO, sitemap y analítica sin cookies
  Fase E  → docs + deuda + gates
```

Dependencias duras: todo requiere los documentos 00 a 06 cerrados. B y C necesitan el layout de A;
D necesita el manifiesto de A para el sitemap y los datos de contacto del documento 06. E es
siempre la última.

---

*Documento vivo de implementación. Actualizar los checkboxes del DoD y el estado del encabezado
al cerrar cada fase.*

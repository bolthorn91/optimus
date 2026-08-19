# OPTIMVS Capital Protegido — Base de contenido para la web

Este directorio contiene **todo** el contenido del dossier `OPTIMVS Capital Protegido.pdf`
(15 páginas) descompuesto en ficheros Markdown listos para usarse como **input/prompt** de
una IA que construirá el sitio web.

Todo es **agnóstico a la tecnología**: no hay decisiones de framework, CSS ni build.
Sólo contenido, estructura, datos, jerarquía y requisitos.

---

## Cómo usar estos ficheros

**Opción A — prompt único (recomendado para empezar):**
Pasar [`09-prompt-maestro.md`](09-prompt-maestro.md) como prompt de sistema/goal, y adjuntar
el resto como contexto.

**Opción B — por secciones:**
Pasar `00`–`02` (brief + identidad + arquitectura) como contexto fijo, y luego un fichero
de `secciones/` por cada iteración de construcción.

**Opción C — por capas:**
1. Estructura → `02-arquitectura-informacion.md`
2. Contenido → `secciones/*`
3. Diseño → `05-guia-estilo-visual.md` + `04-assets-visuales.md`
4. Funcionalidad → `06-requisitos-funcionales.md`
5. Legal → `07-legal-y-disclaimers.md`

---

## Índice de ficheros

| Fichero | Qué contiene |
|---|---|
| [`00-brief-proyecto.md`](00-brief-proyecto.md) | Qué es OPTIMVS, a quién se dirige, objetivo del sitio, alcance |
| [`01-identidad-y-tono.md`](01-identidad-y-tono.md) | Marca, naming, voz, mensajes clave, glosario terminológico |
| [`02-arquitectura-informacion.md`](02-arquitectura-informacion.md) | Sitemap, orden de secciones, navegación, jerarquía de scroll |
| [`03-datos-y-tablas.md`](03-datos-y-tablas.md) | Todas las cifras, tablas y comparativas del dossier |
| [`04-assets-visuales.md`](04-assets-visuales.md) | Inventario de imágenes originales + qué visual necesita cada sección |
| [`05-guia-estilo-visual.md`](05-guia-estilo-visual.md) | Paleta, tipografía, tono visual (derivado de la marca real) |
| [`06-requisitos-funcionales.md`](06-requisitos-funcionales.md) | Formularios, CTA, SEO, i18n, accesibilidad, rendimiento, analítica |
| [`07-legal-y-disclaimers.md`](07-legal-y-disclaimers.md) | Avisos legales obligatorios, RGPD, disclaimers financieros |
| [`08-notas-editoriales.md`](08-notas-editoriales.md) | ⚠️ Erratas, duplicados, placeholders y datos a confirmar antes de publicar |
| [`09-prompt-maestro.md`](09-prompt-maestro.md) | Prompt compilado listo para pegar a la IA |

### Secciones de contenido (`secciones/`)

| Fichero | Sección del dossier | Págs. PDF |
|---|---|---|
| [`00-hero-portada.md`](secciones/00-hero-portada.md) | Portada + presentación | 1–2 |
| [`01-nuevo-escenario-europeo.md`](secciones/01-nuevo-escenario-europeo.md) | I. El nuevo escenario europeo | 3 |
| [`02-seguridad-global.md`](secciones/02-seguridad-global.md) | II. Seguridad global | 4–6 |
| [`03-estado-de-derecho.md`](secciones/03-estado-de-derecho.md) | III. Estado de derecho | 7–10 |
| [`04-estrategia-anticipatoria.md`](secciones/04-estrategia-anticipatoria.md) | IV. La necesidad de una estrategia anticipatoria | 11–12 |
| [`05-nuestra-estrategia.md`](secciones/05-nuestra-estrategia.md) | V. Nuestra estrategia | 13 |
| [`06-estructura-operativa.md`](secciones/06-estructura-operativa.md) | VI. Nuestra estructura operativa España–Argentina | 14 |
| [`07-asesoramiento-intermediacion.md`](secciones/07-asesoramiento-intermediacion.md) | VII. Asesoramiento e intermediación transfronteriza | 15 |
| [`08-cta-contacto.md`](secciones/08-cta-contacto.md) | Cierre, CTA, contacto y fuentes | 15 |

### Assets originales (`assets-origen/`)

13 imágenes extraídas del PDF (logo, mapas de riesgo, imagen satelital, fotografía).
Ver [`04-assets-visuales.md`](04-assets-visuales.md) para el detalle de cada una.

---

## Convención dentro de cada fichero de sección

```
## Metadatos          → id, slug, orden, origen
## Objetivo           → qué debe conseguir la sección en el usuario
## Contenido literal  → texto EXACTO del PDF (no reescribir sin autorización)
## Elementos estructurados → listas, tablas y datos ya normalizados
## Indicaciones para la web → componentes, jerarquía, comportamiento
## Assets             → imágenes/visuales asociados
```

> El bloque **Contenido literal** es la fuente de verdad. Cualquier adaptación de copy web
> (titulares más cortos, microcopy, etc.) va en **Indicaciones para la web** y debe validarse
> con el cliente.

---

## Antes de publicar

Leer obligatoriamente [`08-notas-editoriales.md`](08-notas-editoriales.md): contiene los
datos de contacto contradictorios, los placeholders, la errata de fuentes y las
afirmaciones que conviene revisar con asesoría legal antes de que salgan a producción.

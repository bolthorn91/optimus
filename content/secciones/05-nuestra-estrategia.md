# Sección V — Nuestra estrategia

## Metadatos

| Campo | Valor |
|---|---|
| id | `nuestra-estrategia` |
| slug | `#nuestra-estrategia` |
| orden | 5 |
| origen | PDF pág. 13 |
| función narrativa | **La oferta** — qué se puede comprar exactamente |

---

## Objetivo

Es la sección más corta del dossier y la más importante comercialmente: **qué vende
realmente OPTIMVS**. Tres vehículos de inversión, cada uno con su ventaja y su perfil de
rendimiento. Debe poder leerse aislada y entenderse sin el resto del documento.

---

## Contenido literal

### Entradilla

> Por ello en OPTIMVS Capital Protegido hemos desarrollado un programa de inversión que
> abarca a todo el público, en el cual el suelo de inversión es mínimo y no tiene techo:

### Tabla de activos

| Tipo de activo | Ventaja estratégica | Perfil de rendimiento |
|---|---|---|
| **Bienes raíces / inmuebles** | Ubicaciones prime con precios por metro cuadrado históricamente bajos respecto a Europa. Mercado cotizado y transaccionado en USD. | Alta plusvalía a mediano plazo y excelente rentabilidad por alquiler temporario o comercial. |
| **Acciones y títulos locales** | Empresas del sector energético, agroindustrial y tecnológico liderando la recuperación económica. Entrada en punto de inflexión. | Crecimiento de capital sustancial aprovechando el cambio de ciclo macroeconómico. |
| **Proyectos de desarrollo (al pozo)** | Ingreso directo en etapas tempranas de desarrollo urbano y residencial con estructura jurídico-fiscal optimizada (fideicomisos). | Retornos optimizados y resguardo patrimonial tangible. |

---

## Elementos estructurados

### Los tres vehículos, desglosados

**1 · Bienes raíces / inmuebles**

| Campo | Contenido |
|---|---|
| Ventaja estratégica | Ubicaciones *prime* con precios por m² históricamente bajos respecto a Europa |
| Divisa | Mercado cotizado y transaccionado en **USD** |
| Perfil de rendimiento | Alta plusvalía a mediano plazo |
| Renta | Excelente rentabilidad por alquiler temporario o comercial |
| Horizonte | Medio plazo |

**2 · Acciones y títulos locales**

| Campo | Contenido |
|---|---|
| Sectores | Energético, agroindustrial y tecnológico |
| Tesis | Empresas liderando la recuperación económica; entrada en punto de inflexión |
| Perfil de rendimiento | Crecimiento de capital sustancial |
| Palanca | Cambio de ciclo macroeconómico |
| Horizonte | Ciclo macro |

**3 · Proyectos de desarrollo (al pozo)**

| Campo | Contenido |
|---|---|
| Tipo de entrada | Ingreso directo en etapas tempranas de desarrollo urbano y residencial |
| Estructura | Jurídico-fiscal optimizada mediante **fideicomisos** |
| Perfil de rendimiento | Retornos optimizados |
| Resguardo | Patrimonial tangible |
| Horizonte | Ciclo de obra |

### Condición de acceso

| Concepto | Valor |
|---|---|
| Suelo de inversión (mínimo de entrada) | **Mínimo** — no cuantificado en el dossier |
| Techo máximo | **Sin techo** |
| Público | Todo el público, inversores de toda escala |

⚠️ El dossier **no indica cifras concretas** de entrada mínima. En la sección VI menciona
el caso extremo inferior: *«un comprador a plazos de una propiedad en pozo con una cuota
mínima»*. Si el cliente quiere que la web comunique un importe, hay que solicitarlo. Ver
[`08-notas-editoriales.md`](../08-notas-editoriales.md).

---

## Indicaciones para la web

**Composición sugerida:**

```
[H2] V. Nuestra estrategia
[Entradilla + destacado: «Suelo de inversión mínimo. Sin techo.»]

ESCRITORIO — tabla de 3 columnas o 3 tarjetas en fila
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│ [icono]       │ │ [icono]       │ │ [icono]       │
│ BIENES RAÍCES │ │ ACCIONES Y    │ │ PROYECTOS DE  │
│ / INMUEBLES   │ │ TÍTULOS       │ │ DESARROLLO    │
│               │ │ LOCALES       │ │ (AL POZO)     │
│ ── Ventaja    │ │ ── Ventaja    │ │ ── Ventaja    │
│ texto…        │ │ texto…        │ │ texto…        │
│               │ │               │ │               │
│ ── Rendimiento│ │ ── Rendimiento│ │ ── Rendimiento│
│ texto…        │ │ texto…        │ │ texto…        │
│               │ │               │ │               │
│ [Más info →]  │ │ [Más info →]  │ │ [Más info →]  │
└───────────────┘ └───────────────┘ └───────────────┘

MÓVIL — tarjetas apiladas, mismo orden

[CTA: «Consultar activos disponibles»]
```

- **Nunca** convertir esto en tabla con scroll horizontal en móvil. Tarjetas apiladas.
- **Etiquetas de fila visibles en cada tarjeta:** «Ventaja estratégica» y «Perfil de
  rendimiento» deben repetirse dentro de cada tarjeta en móvil, no sólo como cabecera de
  tabla.
- **Iconografía:** edificio / gráfico bursátil / grúa-plano de obra. Trazo lineal,
  consistente con el resto del sitio.
- **Destacado «suelo mínimo, sin techo»:** es un diferencial real frente a la banca
  privada tradicional. Merece tratamiento propio, no ir escondido en la entradilla.
- **Enlace por tarjeta:** cada vehículo debería poder abrir un panel o página con más
  detalle. En v1, si no hay más contenido, que el enlace lleve al formulario de contacto
  **con el tipo de activo preseleccionado** — eso cualifica el lead automáticamente.
- **Glosa de «al pozo»:** el término es argentino. Añadir tooltip o inciso: *«compra en
  fase temprana de obra»*. El lector es español.

**Advertencia de copy:** «alta plusvalía», «excelente rentabilidad», «crecimiento
sustancial», «retornos optimizados» son afirmaciones de rendimiento sin cifra ni horizonte.
En una web pública dirigida a inversores en España esto requiere, como mínimo, un
disclaimer visible de que no constituye recomendación de inversión y que rentabilidades
pasadas o proyectadas no garantizan resultados futuros. Ver
[`07-legal-y-disclaimers.md`](../07-legal-y-disclaimers.md).

---

## Assets

Ninguna imagen en el original más allá de la banda de cabecera.

**A crear:**
- 3 iconos (inmuebles / renta variable / desarrollo al pozo).
- Opcional: fotografía de apoyo por vehículo (inmueble prime en CABA, planta energética,
  obra en construcción). Debe ser fotografía con licencia, no de banco genérico de baja
  calidad.

# Sección 00 — Hero / Portada y presentación

## Metadatos

| Campo | Valor |
|---|---|
| id | `hero` / `propuesta` |
| slug | `#inicio`, `#propuesta` |
| orden | 0 |
| origen | PDF págs. 1–2 |

---

## Objetivo

En menos de 5 segundos el visitante debe entender: **quién habla**, **qué propone** y
**qué puede hacer ahora**. La portada del dossier es puramente emocional; la página 2 es
puramente informativa. La web debe encadenarlas: impacto → concreción.

---

## Contenido literal

### Portada (pág. 1)

**Titular:**

> Proteja su patrimonio, su libertad financiera y su integridad ciudadana

**Distintivo / badge:**

> INVERSIÓN ESTRATÉGICA Y PROTECCIÓN FINANCIERA

**Logotipo:** emblema circular dorado + wordmark `OPTIMVS` / `CAPITAL PROTEGIDO`

**Iconos de redes sociales:** Instagram · TikTok · Facebook · LinkedIn

### Presentación (pág. 2)

> **Dirigido a:** Inversores de toda escala en diferentes niveles y patrimonios privados.

> **Propuesta:** Estrategia anticipatoria de inversión en activos inmobiliarios y
> financieros en Argentina.

> **Estructura:** OPTIMVS Capital Protegido, firma Hispano - Argentina
> (España - Argentina).

### Índice del dossier (pág. 2)

```
I.    El nuevo escenario europeo
II.   Seguridad global
III.  Estado de derecho
IV.   La necesidad de una estrategia anticipatoria
V.    Nuestra estrategia
VI.   Nuestra estructura operativa España - Argentina
VII.  Asesoramiento e intermediación transfronteriza
```

---

## Elementos estructurados

**Bloque de tres datos (pág. 2) — convertir en 3 tarjetas:**

| Etiqueta | Contenido |
|---|---|
| Dirigido a | Inversores de toda escala en diferentes niveles y patrimonios privados |
| Propuesta | Estrategia anticipatoria de inversión en activos inmobiliarios y financieros en Argentina |
| Estructura | Firma hispano-argentina (España – Argentina) |

---

## Indicaciones para la web

### Hero

- **Altura:** pantalla completa (100vh), con indicador de scroll al pie.
- **Composición:** logotipo centrado o alineado a la izquierda; titular como `H1`;
  badge del claim debajo; par de CTAs.
- **Fondo:** ver [`05-guia-estilo-visual.md`](../05-guia-estilo-visual.md). El navy
  profundo `#102135` del badge original es el color natural de fondo del hero.
- **Titular:** mantener literal. Es largo (14 palabras) pero los tres sustantivos —
  *patrimonio*, *libertad financiera*, *integridad ciudadana* — son el eje del
  posicionamiento. Considerar destacarlos tipográficamente dentro de la frase.

**CTAs del hero:**

| Jerarquía | Texto | Acción |
|---|---|---|
| Primario | Reservar sesión privada | Ancla a `#contacto` |
| Secundario | Descargar dossier | Descarga del PDF |

- **Redes sociales:** en el hero sólo si hay perfiles reales activos. Si no, moverlas al
  footer. ⚠️ El dossier muestra los iconos pero **no facilita ninguna URL**.

### Bloque de presentación

- Tres tarjetas en fila (escritorio) / apiladas (móvil).
- Etiqueta pequeña en mayúsculas + contenido en cuerpo grande.
- Este bloque es el «resumen ejecutivo». Debe leerse en 10 segundos.

### Índice

- **No** reproducir el índice como lista estática: convertirlo en la **navegación ancla**
  del sitio. La numeración romana se conserva en los títulos `H2` de cada sección.
- Opcional: en escritorio, índice lateral fijo (rail de navegación) que marca la sección
  activa durante el scroll.

---

## Assets

| Archivo | Uso |
|---|---|
| `assets-origen/p01-X9.png` | Logotipo completo vertical (emblema + wordmark), 970×914 |
| `assets-origen/p12-X47.png` | Logotipo completo, versión de mayor resolución, 1000×929 |
| `assets-origen/p10-X39.png` | Emblema solo, tono claro/marfil — apto para marca de agua |
| `assets-origen/p15-X60.png` | Emblema en perspectiva con sombra — apto para elemento decorativo |
| `assets-origen/p01-X6.png` | Badge «INVERSIÓN ESTRATÉGICA Y PROTECCIÓN FINANCIERA» |
| `assets-origen/p01-X10.png` | Iconos de redes sociales (IG, TikTok, FB, LinkedIn) |
| `assets-origen/p02-X13.png` | Banda de cabecera con logo + datos de contacto |

> ⚠️ Todos los logos son PNG rasterizados extraídos del PDF, con **fondo blanco no
> transparente**. Antes de producción hay que pedir al cliente el **logotipo vectorial
> (SVG/AI)** o, como mínimo, PNG con canal alfa. Ver
> [`04-assets-visuales.md`](../04-assets-visuales.md).

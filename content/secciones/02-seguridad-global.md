# Sección II — Seguridad global

## Metadatos

| Campo | Valor |
|---|---|
| id | `seguridad-global` |
| slug | `#seguridad-global` |
| orden | 2 |
| origen | PDF págs. 4–6 |
| subsecciones | Regiones vulnerables · Factor climático |
| función narrativa | **Diagnóstico geográfico** — Sudamérica queda fuera del mapa de riesgo |

---

## Objetivo

Demostrar visualmente que el riesgo bélico y climático se ha desplazado hacia Europa y
Norteamérica, dejando a Sudamérica —y a Argentina en particular— en una «zona de paz».
Es la sección **más visual del dossier** y la que mejor puede funcionar en web.

---

## Contenido literal

### Regiones vulnerables

> Las estadísticas globales permiten observar un movimiento de conflictos extendido a lo
> largo de las últimas décadas hacia regiones de paz, previendo que América del Norte
> sufrirá mayor tensión cuando, en un futuro cercano, los recursos del Mar Ártico sean uno
> de los puntos de disputa de poder entre las grandes potencias, además del estrés hídrico
> previsto en la cuenca del Río Colorado y sus alrededores, sumado a los fenómenos
> climáticos que se incrementarán en el sur de EE.UU. desde el Golfo de México.

> Europa, que alcanzó niveles de bienestar muy por encima del resto del mundo gracias al
> Pacto Social y los servicios públicos universales tras la devastadora primera mitad del
> siglo XX, ha comenzado a dejar expuestas grietas estructurales producidas por un cambio
> en sus políticas, discusiones entre los integrantes de la UE, una migración
> descontrolada (principalmente magrebí), medidas extremas de control sobre los ciudadanos
> y la debilitación paulatina de sus industrias.

### Rótulos de los mapas

```
NIVEL DE RIESGO BÉLICO Y CONFLICTO ARMADO (1985)
NIVEL DE RIESGO BÉLICO Y CONFLICTO ARMADO (2015)
NIVEL DE RIESGO BÉLICO Y CONFLICTO ARMADO (EN LA ACTUALIDAD)
NIVEL DE RIESGO BÉLICO Y CONFLICTO ARMADO (PROYECCIÓN 2050)
```

**Leyenda de los mapas:**

```
■ RIESGO EXTREMO O GUERRA ABIERTA
■ RIESGO ELEVADO
■ RIESGO LATENTE
■ ESTABILIDAD
```

### Lectura de los mapas

> Oceanía y América del Sur se encuentran en zonas del mapa alejadas de los sectores
> vulnerables a conflictos bélicos. En el caso del continente oriental, el aislamiento
> insular le otorgó históricamente las condiciones geográficas para madurar un modelo de
> gobernanza propio e independiente con el reto actual de administrar la creciente
> atención de las potencias mundiales sin perder el control de su propia agenda regional.
> América del Sur, por su parte, también está ubicada lejos de las zonas propensas a
> guerras, tiene acuerdos de no proliferación de armas, es una masa continental enorme,
> difícil de ocupar o controlar militarmente, y se mantiene en una posición históricamente
> neutral.

### Factor climático

> Hace algunos años las principales potencias mundiales dieron inicio a la etapa de
> ejecución de programas de modificación del clima en algunas regiones del planeta. Estos
> programas se dividen en modificación local del tiempo y modificación de la radiación
> solar.

> Las zonas «a salvo» en el mundo se han visto poco a poco reducidas, hasta abarcar
> amplias regiones: China, la principal, Estados Unidos, Europa occidental, Emiratos
> Árabes, Arabia Saudita, México, India, Rusia, Irán, Tailandia, Israel y Australia.

> América del Sur cuenta en la actualidad únicamente con políticas preventivas,
> manteniendo el valor natural de la región, sin riesgos de medianas o grandes
> modificaciones en el futuro, influyendo positivamente en su proyección de estabilidad.

### Cierre de sección

> ¿Por qué es tan importante destacar la «zona de paz» en la que se encuentra Argentina,
> el eje del Cono Sur? Porque, si bien el desafío de este país es alcanzar una estabilidad
> política interna que impacte en los aspectos socioeconómico y de seguridad ciudadana
> para afianzar su sistema de vida, es un reto mucho más alcanzable que el que le toca
> enfrentar a Europa, en el que consultores políticos, sociales y económicos vaticinan el
> fin de Occidente como lo conocemos, pronosticando como efecto una nueva ola migratoria
> hacia América del Sur durante los próximos años.

⚠️ **Este párrafo se repite casi idéntico en la sección III** (con la única variante
«hacia Latinoamérica» en lugar de «hacia América del Sur»). Ver
[`08-notas-editoriales.md`](../08-notas-editoriales.md): en web debe aparecer **una sola
vez**.

---

## Elementos estructurados

### Serie temporal de mapas

| Orden | Rótulo | Estado | Asset |
|---|---|---|---|
| 1 | 1985 | Histórico | `p04-X19.png` (mitad izquierda) |
| 2 | 2015 | Histórico | `p04-X19.png` (mitad derecha) |
| 3 | En la actualidad | Presente | `p05-X25.png` |
| 4 | Proyección 2050 | Proyección | ⚠️ **falta** — ver nota |

⚠️ En el PDF, los mapas de «actualidad» y «proyección 2050» son **el mismo archivo de
imagen, byte a byte**. O bien es un error de montaje del dossier, o falta el mapa de 2050.
Hay que pedirlo al cliente antes de publicar.

### Escala de riesgo (leyenda)

| Nivel | Etiqueta | Color original |
|---|---|---|
| 4 | Riesgo extremo o guerra abierta | `#9B1E22` |
| 3 | Riesgo elevado | `#C6772C` |
| 2 | Riesgo latente | `#DFCC4C` |
| 1 | Estabilidad | `#2B498F` |

### Factores de riesgo citados para América del Norte

- Disputa por los recursos del **Mar Ártico**
- **Estrés hídrico** en la cuenca del Río Colorado
- Fenómenos climáticos crecientes en el sur de EE. UU. desde el **Golfo de México**

### Argumentos de estabilidad de América del Sur

1. Alejada de zonas propensas a guerras
2. Acuerdos de no proliferación de armas
3. Masa continental enorme, difícil de ocupar o controlar militarmente
4. Posición históricamente neutral

### Regiones citadas con programas de modificación climática

China *(la principal)* · Estados Unidos · Europa occidental · Emiratos Árabes ·
Arabia Saudita · México · India · Rusia · Irán · Tailandia · Israel · Australia

---

## Indicaciones para la web

**Esta es la sección con mayor potencial visual. Merece el mayor esfuerzo de diseño.**

**Componente principal — línea temporal de mapas:**

```
[H2] II. Seguridad global
[H3] Regiones vulnerables
[Texto introductorio]

┌─────────────────────────────────────────────────────────┐
│  ●───────●───────●───────●                              │
│ 1985    2015   Hoy     2050                             │
│                                                          │
│         [ MAPA A PANTALLA COMPLETA ]                     │
│                                                          │
│  Leyenda: ■ Extremo  ■ Elevado  ■ Latente  ■ Estabilidad│
└─────────────────────────────────────────────────────────┘
```

Opciones de implementación, en orden de preferencia:
1. **Scrollytelling** — el mapa cambia al hacer scroll, el texto avanza al lado.
2. **Selector temporal** — cuatro pestañas 1985 / 2015 / Hoy / 2050, con transición
   de fundido entre mapas.
3. **Comparador de cortina** — arrastrable entre dos estados (1985 ↔ hoy).

En los tres casos: **destacar Sudamérica en azul** de forma persistente. Es el argumento.

- **Leyenda:** siempre visible junto al mapa, no en un pie desplazado.
- **Accesibilidad:** los cuatro niveles no pueden distinguirse sólo por color. Añadir
  etiqueta textual y/o patrón de trama. Texto alternativo descriptivo por mapa.
- **Móvil:** los mapas originales son de baja resolución (499×244 px). En móvil pueden
  pixelarse. **Recomendación fuerte:** rehacerlos como SVG vectorial, lo que además
  resuelve accesibilidad, nitidez, peso y animación entre estados.

**Subsección «Factor climático»:**
- Separador visual claro respecto a «Regiones vulnerables».
- La lista de 12 regiones: presentarla como conjunto de etiquetas (chips), no como párrafo
  corrido.

**Bloque de cierre:**
- Tratar el párrafo «¿Por qué es tan importante destacar la zona de paz…?» como **cita
  destacada** a ancho reducido. Es la frase que enlaza con la sección III.

---

## Nota de contenido

⚠️ La subsección «Factor climático» afirma que las grandes potencias ejecutan programas de
modificación del clima y radiación solar en regiones concretas del planeta. Es la
afirmación más contestable del dossier y la que más puede erosionar la credibilidad ante
un inversor patrimonial, que es exactamente el público objetivo. Se reproduce íntegra
porque es contenido del cliente, pero conviene decidir explícitamente si entra en la web y,
si entra, respaldarla con la fuente concreta (el dossier cita NASA en el bloque general de
fuentes, sin referencia específica). Ver
[`08-notas-editoriales.md`](../08-notas-editoriales.md).

---

## Assets

| Archivo | Descripción | Resolución |
|---|---|---|
| `assets-origen/p04-X19.png` | Doble mapa mundial: riesgo 1985 (izq.) y 2015 (der.) | 1025×246 |
| `assets-origen/p04-X21.png` | Leyenda de colores de la escala de riesgo | 827×158 |
| `assets-origen/p05-X25.png` | Mapa mundial de riesgo — usado para «actualidad» **y** «2050» | 499×244 |

**Falta:** mapa diferenciado de proyección 2050.

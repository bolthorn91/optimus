# 05 — Guía de estilo visual

Derivada de los assets reales de marca. **Agnóstica a la tecnología**: se describen
valores y decisiones, no implementación.

---

## Principio rector

**Sobriedad patrimonial.** El producto es la custodia de capital ajeno en una jurisdicción
extranjera, apoyada en un argumentario geopolítico intenso. El diseño debe **bajar la
temperatura**, no subirla: si el copy es alarmante y el diseño también, el resultado se
lee como publicidad agresiva y el inversor prudente se marcha.

Referencia de tono visual: banca privada, despacho de abogados internacional, informe
institucional. **No**: fintech, criptomonedas, marketing de afiliación.

---

## Paleta

Colores muestreados directamente de los assets de marca del PDF.

### Base

| Rol | Hex | Origen |
|---|---|---|
| **Navy profundo** — fondo principal oscuro | `#102135` | Badge de portada |
| Navy medio — superficies elevadas | `#1A2C42` | derivado |
| Navy tinta — texto sobre claro | `#21293D` | Wordmark del logotipo |
| Marfil — fondo claro | `#F7F5F0` | derivado del emblema |
| Blanco | `#FFFFFF` | |

### Acento — oro metálico

El emblema es un degradado metálico, no un color plano. Para reproducirlo:

| Rol | Hex | Origen |
|---|---|---|
| Oro alto (brillo) | `#FFEEB2` | Emblema, zonas de luz |
| **Oro medio (color de marca)** | `#B8974F` | Interpolado del emblema |
| Oro bronce (sombra) | `#8E6D3F` | Emblema, zonas de sombra |
| Oro profundo | `#7B5A31` | Emblema, sombras densas |
| Oro apagado — bordes y filetes | `#8A7A55` | Borde del badge de portada |

**Uso del oro:** filetes, bordes, subrayados, iconos de acento, hover. **Nunca** como
fondo de superficies grandes ni como color de texto de párrafo (contraste insuficiente).
Para superficies metálicas usar degradado lineal `#FFEEB2 → #B8974F → #8E6D3F`.

### Funcionales — escala de riesgo

Colores de la leyenda de los mapas. Reservados **exclusivamente** para esa escala; no
reutilizar como colores de interfaz.

| Nivel | Hex |
|---|---|
| Riesgo extremo o guerra abierta | `#9B1E22` |
| Riesgo elevado | `#C6772C` |
| Riesgo latente | `#DFCC4C` |
| Estabilidad | `#2B498F` |

### Identificadores de país

El par España↔Argentina recorre todo el sitio y necesita distinción visual consistente:

| País | Color sugerido | Racional |
|---|---|---|
| 🇪🇸 España | `#8A7A55` (oro apagado) o gris neutro | Lado «maduro / consolidado» del relato |
| 🇦🇷 Argentina | `#2B498F` (azul de estabilidad) | Coincide con «estabilidad» en los mapas — refuerza el argumento |

> **No usar emoji de bandera** como único identificador: no renderizan de forma
> consistente entre plataformas (en Windows aparecen como códigos de dos letras).

---

## Modo claro y modo oscuro

El material de marca funciona en ambos. Recomendación:

- **Hero, sección II (mapas) y footer:** fondo navy `#102135`.
- **Secciones de contenido:** fondo marfil `#F7F5F0`, texto navy tinta `#21293D`.
- **Alternancia:** cambiar de fondo cada 2–3 secciones marca ritmo en un scroll largo y
  compensa la densidad de texto.

Si se implementa conmutador claro/oscuro, definir la paleta completa en modo claro y
redefinir sólo los tokens en oscuro, cubriendo los tres estados: preferencia del sistema,
elección explícita clara y elección explícita oscura.

---

## Tipografía

El logotipo usa una **serif de capitales romanas** (`OPTIMVS` con V latina) y una **sans
geométrica en versalitas** para `CAPITAL PROTEGIDO`. La web debe replicar ese contraste.

| Rol | Recomendación | Racional |
|---|---|---|
| **Titulares (H1–H2)** | Serif de transición o didona — p. ej. una con capitales de proporción romana | Continuidad con el wordmark; autoridad institucional |
| **Subtítulos (H3–H4)** | Sans humanista, peso medio, ligero tracking en versalitas | Ecoa «CAPITAL PROTEGIDO» |
| **Cuerpo** | Sans humanista, 17–19 px, interlineado 1,6–1,7 | El texto es largo y denso: legibilidad por encima de estilo |
| **Cifras y datos** | Sans con cifras tabulares | Las tablas comparativas lo exigen |
| **Etiquetas y eyebrows** | Sans, versalitas, tracking amplio | «DIRIGIDO A», «PROPUESTA», «ESTRUCTURA» |

**Escala tipográfica** (base 18 px, ratio ~1,25):

```
H1  →  56–72 px    (hero)
H2  →  40–48 px    (secciones romanas)
H3  →  28–32 px    (subsecciones)
H4  →  20–22 px    (ítems de lista destacada)
Cuerpo → 18 px
Cifras destacadas → 64–96 px
Pie / nota → 14–15 px
```

**Ancho de línea:** 65–75 caracteres para el cuerpo. Los párrafos del dossier son muy
largos; sin esta restricción el texto se vuelve ilegible.

**Numeración romana:** conservar `I.` … `VII.` en los `H2`. Es un rasgo de carácter del
documento y sirve de orientación en un scroll largo.

---

## Retícula y espacio

- **Contenedor máximo:** ~1200–1280 px.
- **Ancho de lectura:** ~680–720 px, centrado, para todos los bloques de texto corrido.
- **Retícula:** 12 columnas. Las comparativas pareadas ocupan 6+6.
- **Espacio vertical entre secciones:** generoso — 120–160 px en escritorio, 72–96 px en
  móvil. El respiro es lo que separa «informe institucional» de «landing de venta».
- **Puntos de ruptura:** móvil < 768, tableta 768–1024, escritorio > 1024.

---

## Componentes recurrentes

| Componente | Dónde aparece | Notas |
|---|---|---|
| **Comparativa pareada** España \| Argentina | III (×3), IV, VI | Componente más reutilizado. 6+6 en escritorio, apilado en móvil |
| **Tarjeta numerada** | I (3 factores), III (3 suelos), IV (4 garantías), V (3 activos), VI (3 departamentos) | Un solo patrón para todas |
| **Cifra destacada** | I (14 %), III (densidades), IV (13.243.219 ha) | Número grande + glosa pequeña |
| **Cita destacada** | Cierre de II, conclusión de III, «el nuevo Occidente» en VI | Ancho reducido, filete de oro a la izquierda |
| **Diagrama de proceso** | IV (flujo CDI), VI (intermediación), VII (dos vías) | SVG, reflow vertical en móvil |
| **Chips de etiqueta** | II (12 regiones), footer (fuentes) | |
| **Bloque CTA** | Hero, fin de IV, fin de V, sección contacto | Un solo verbo: «reservar» |

---

## Movimiento

**Contenido:** entradas por desvanecimiento sutil al llegar al viewport, 200–300 ms.
Nada de rebotes, giros ni desplazamientos largos.

**Excepción justificada:** la secuencia temporal de mapas de la sección II. Ahí el
movimiento *es* información — transición entre 1985, 2015, actualidad y 2050. Merece
tratamiento cuidado.

**Contadores animados:** aceptables en las cifras de la comparativa territorial. Máximo
una vez por sección; no en cada número de la página.

**Respetar `prefers-reduced-motion`:** desactivar todas las animaciones no informativas
cuando el usuario lo indique.

---

## Iconografía

- Trazo lineal, grosor único en todo el sitio (~1,5–2 px a 24 px de tamaño).
- Sin relleno, sin degradado, sin sombra.
- Color: navy tinta sobre claro, marfil sobre oscuro, oro para el estado de acento.
- Legibles a 24 px.
- **Coherentes en nivel de abstracción:** todos concretos o todos conceptuales, no
  mezclados.

---

## Lo que debe evitarse

| ❌ | Por qué |
|---|---|
| Degradados morados/azul eléctrico, estética cripto | Contradice el posicionamiento patrimonial |
| Contadores de urgencia, «plazas limitadas» | Erosiona la credibilidad ante un inversor prudente |
| Gráficos de rendimiento inventados o ilustrativos sin datos | Riesgo legal, además de riesgo de credibilidad |
| Logotipos de CNMV, CNV, AEAT, NASA | Sugiere aval o supervisión inexistente. Sólo texto |
| Banco de imágenes genérico de negocios | Delata la falta de material propio |
| Vídeo de fondo en el hero | Peso, distracción, y no aporta al argumento |
| Ventanas emergentes de captura al entrar | Incompatible con «consultoría confidencial» |
| Más de dos tipografías | Ya hay contraste serif/sans; una tercera es ruido |

---

## Favicon e identidad de pestaña

- **Favicon:** el emblema circular aislado (`p10-X39.png` o `p15-X60.png` como referencia),
  redibujado en vectorial y simplificado para 16×16 px. El detalle metálico se pierde a
  ese tamaño: hacer una versión de silueta plana en oro sobre navy.
- **Open Graph:** logotipo completo sobre navy `#102135`, 1200×630 px.
- **Título de pestaña:** `OPTIMVS Capital Protegido` — nombre estable, sin sufijos
  descriptivos largos.

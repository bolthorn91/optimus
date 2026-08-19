# 04 — Inventario de assets visuales

Todas las imágenes del PDF han sido extraídas a `assets-origen/`.
Este fichero documenta qué hay, en qué estado, y qué falta.

---

## Assets disponibles

| Archivo | Resolución | Descripción | Uso previsto | Estado |
|---|---|---|---|---|
| `p01-X9.png` | 970×914 | Logotipo completo vertical: emblema circular dorado + wordmark `OPTIMVS` / `CAPITAL PROTEGIDO` | Hero, cabecera | ⚠️ Raster, fondo blanco |
| `p12-X47.png` | 1000×929 | Logotipo completo, mayor resolución | Hero, Open Graph | ⚠️ Raster, fondo blanco |
| `p12-X49.png` | 1000×929 | Logotipo completo, variante casi idéntica a X47 | Redundante | ⚠️ Duplicado |
| `p10-X39.png` | 602×626 | Emblema aislado, tono marfil/crema muy claro | Marca de agua, fondo decorativo | ⚠️ Raster |
| `p15-X60.png` | 632×794 | Emblema en perspectiva isométrica con sombra proyectada | Elemento decorativo, footer | ⚠️ Raster |
| `p02-X13.png` | 1013×239 | Banda de cabecera: logo + teléfonos + email + web | Base para footer | ⚠️ Contiene datos de contacto **distintos** a los del texto |
| `p01-X6.png` | 624×145 | Badge navy con borde dorado: «INVERSIÓN ESTRATÉGICA Y PROTECCIÓN FINANCIERA» | Hero | ✅ Reproducible en CSS/HTML |
| `p01-X10.png` | 838×158 | Iconos de redes: Instagram, TikTok, Facebook, LinkedIn | Footer | ✅ Sustituir por iconos vectoriales |
| `p04-X19.png` | 1025×246 | Doble mapa mundial de riesgo bélico: 1985 (izq.) + 2015 (der.) | Sección II | ⚠️ Baja resolución |
| `p04-X21.png` | 827×158 | Leyenda de la escala de riesgo (4 niveles) | Sección II | ✅ Reproducible en HTML |
| `p05-X25.png` | 499×244 | Mapa mundial de riesgo | Sección II | ❌ **Baja resolución + usado dos veces** |
| `p09-X36.png` | 593×1024 | Imagen satelital nocturna: Argentina y España superpuestas, con Canarias recuadradas | Sección III | ✅ Buena, la mejor del dossier |
| `p11-X43.png` | 1022×563 | Obelisco de Buenos Aires, Av. 9 de Julio | Sección IV | ⚠️ Sobresaturada, aspecto amateur |

**Total: 13 imágenes únicas** (el PDF contiene 28 instancias; la banda de cabecera se
repite en 14 páginas).

---

## Problemas detectados

### 🔴 Críticos

**1. Los mapas de «actualidad» y «proyección 2050» son el mismo archivo.**
En el PDF, página 5, ambos rótulos apuntan a una imagen byte-idéntica (`p05-X25.png`,
MD5 coincidente). O el montaje del dossier tiene un error, o el mapa de proyección 2050
nunca se produjo. **Solicitar al cliente el mapa de 2050 antes de publicar la sección II.**

**2. Los logotipos no tienen transparencia.**
Todos los PNG de marca vienen con fondo blanco sólido. Sobre el navy del hero se verían
recortados en un rectángulo blanco. **Solicitar el logotipo vectorial (SVG/AI/EPS)** o,
como mínimo, PNG con canal alfa.

**3. Los datos de contacto de la cabecera gráfica contradicen los del texto.**
`p02-X13.png` muestra `+34 611 983 914` y `+54 9 11 10101010`; el texto de la página 15
dice `+34 698 900 559` y `+54 9 11 0000 0000`. Ninguna combinación es fiable.
**No usar esta imagen tal cual en el footer.** Ver
[`08-notas-editoriales.md`](08-notas-editoriales.md).

### 🟡 Importantes

**4. Resolución insuficiente de los mapas.**
`p05-X25.png` mide 499×244 px. En una pantalla de escritorio a ancho completo se vería
claramente pixelado, y en pantallas de alta densidad, peor.
**Recomendación: rehacer los cuatro mapas como SVG vectorial.** Además de resolver la
nitidez, permite animar la transición entre períodos, etiquetar regiones para
accesibilidad y reducir el peso.

**5. La fotografía del Obelisco tiene tratamiento amateur.**
Saturación muy alta, cielo procesado, aspecto de filtro de móvil. Para una firma de
gestión patrimonial esto trabaja en contra del posicionamiento. **Sustituir por
fotografía profesional con licencia**, o al menos regradar a un tratamiento sobrio.

**6. Duplicado innecesario.** `p12-X47.png` y `p12-X49.png` son prácticamente idénticos.
Conservar sólo uno.

---

## Assets que faltan y hay que producir

### Solicitar al cliente (bloqueantes)

| Asset | Para | Prioridad |
|---|---|---|
| **Logotipo vectorial (SVG/AI/EPS)** | Todo el sitio | 🔴 Crítica |
| Logotipo en versión monocroma y en negativo | Fondos oscuros, favicon | 🔴 Crítica |
| **Retrato profesional de Carlos Carbajal** | Sección VI | 🔴 Crítica — es el mayor generador de confianza del sitio |
| **Mapa de proyección 2050** | Sección II | 🔴 Crítica |
| Teléfonos y dominio definitivos | Contacto, footer | 🔴 Crítica |
| Datos registrales de ambas sociedades | Aviso legal | 🔴 Crítica |
| Fotografía de equipo u oficina | Sección VI | 🟡 Alta |
| URLs de los perfiles sociales | Footer | 🟡 Alta |
| Nombre de las entidades ALyC / ESI aliadas | Sección VII | 🟢 Deseable |

### Producir (diseño)

| Asset | Sección | Notas |
|---|---|---|
| 3 iconos: demografía / Chat Control / Euro Digital | I | Trazo lineal |
| 4 mapas de riesgo vectoriales | II | Reemplazo de los raster |
| Leyenda de riesgo en HTML/CSS | II | En lugar de la imagen |
| Diagrama del modelo territorial español («anillo» + Madrid) | III | Descrito en texto, sin ilustrar |
| 3 iconos: suelo urbano / agrícola / energía-minería | III | |
| **Diagrama del flujo del CDI (5 pasos)** | IV | 🔴 El activo visual más valioso a crear |
| 4 iconos: titularidad / apostilla / banca / compliance | IV | |
| Gráfico 13.243.219 ha vs Inglaterra | IV | |
| 3 iconos: inmuebles / valores / al pozo | V | |
| Diagrama de cadena de intermediación (convencional vs OPTIMVS) | VI | |
| 3 iconos de departamento | VI | |
| Gráfico de rango de inversor (cuota mínima → sin techo) | VI | |
| Diagrama de las dos vías operativas | VII | |
| Iconos sociales vectoriales | Footer | |
| Favicon + Open Graph + Apple touch icon | Global | |

---

## Directrices para los assets producidos

**Iconografía:** trazo lineal uniforme, sin relleno, esquinas ligeramente redondeadas.
Un solo grosor de trazo en todo el sitio. Sin ilustración editorial, sin caricatura,
sin degradados. Deben leerse a 24 px.

**Diagramas:** SVG. Deben funcionar en horizontal (escritorio) y reflowear a vertical
(móvil). Texto como texto real, no trazado a curvas — es requisito de accesibilidad y de
SEO.

**Fotografía:** sobria, luz natural, sin filtros marcados. Temas admisibles: arquitectura
de Buenos Aires y Madrid, campo argentino, infraestructura energética, documentación
notarial. Evitar el banco de imágenes genérico de «hombre de negocios señalando gráficos».

**Formatos de salida:** SVG para marca, iconos y diagramas. WebP con respaldo JPEG para
fotografía. Todo con imagen responsive por densidad de pantalla.

**Accesibilidad:** texto alternativo descriptivo en todas las imágenes con contenido
informativo. Los mapas de riesgo necesitan además una descripción larga o una tabla
equivalente — cuatro niveles distinguidos sólo por color no son accesibles.

---

## Nota sobre derechos

⚠️ Antes de publicar, confirmar la titularidad o licencia de:

- **Mapas de riesgo bélico** — el dossier cita ACLED, Global Guardian y Crisis24 como
  fuentes. Si los mapas derivan de material de estas organizaciones, su reproducción
  puede requerir licencia o atribución específica.
- **Imagen satelital nocturna** — la estética corresponde a la serie *Earth at Night* de
  la NASA (citada en fuentes). El material de la NASA suele ser de dominio público, pero
  la atribución es obligatoria y conviene verificar la procedencia exacta de este montaje.
- **Fotografía del Obelisco** — sin autoría ni licencia identificadas.

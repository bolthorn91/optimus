# Acto II — Seguridad global

**Estado:** hecho en branch `main` (2026-09-04). No fusionado.
**Branch de trabajo:** el HEAD actual del worktree.
**Perfil de proyecto:** [`agent-docs/goal-profile.md`](../../agent-docs/goal-profile.md) — invariantes §7 aplicables: I1, I3, I4, I5, I6, I9.
**Roadmap:** [`roadmap.md`](roadmap.md) §2, fila 02.
**Relacionado:** [`00-fundacion-sistema-diseno.md`](00-fundacion-sistema-diseno.md) (primitivas y motor de movimiento) · [`01-acto-i-hero-escenario-europeo.md`](01-acto-i-hero-escenario-europeo.md) (`<ActSeal>`, patrón de escena anclada). **No reimplementar** ninguno de los dos.

Manda sobre el acto II: la demostración cartográfica de que el riesgo bélico se ha desplazado
hacia Europa y Norteamérica dejando a Sudamérica fuera. Es la sección más visual del dossier.

| Referencia | Tema | Resumen v1 |
|------------|------|------------|
| **roadmap §2 fila 02** | Acto II | Serie temporal de cuatro mapas mundiales de riesgo recorrida con el scroll, con leyenda accesible y tabla equivalente, más la subsección del factor climático. |

---

## 1. Contexto del software actual (punto de partida)

### 1.1 Fundación y acto I disponibles

| Pieza | Ubicación | Comportamiento |
|-------|-----------|----------------|
| Motor de movimiento | `src/motion/` | `useGsapScene`, `<Scene>`, `useScrollProgress`, `useReducedMotionSafe` |
| Primitivas | `src/components/` | `<RomanNumeral>`, `<DualFigure>`, `<StatFigure>`, `<CountUp>`, `<PullQuote>`, `<ActSeal>` |
| Patrón de escena anclada | `src/scenes/01-escenario-europeo/` | Coreografía pura + ventana de tramos; se replica aquí |
| Tokens de la escala de riesgo | `src/styles/tokens.css` | `#9B1E22`, `#C6772C`, `#DFCC4C`, `#2B498F` ya definidos (doc 00 S2) |

### 1.2 Contenido y assets de origen

| Pieza | Ubicación | Estado |
|-------|-----------|--------|
| Acto II completo, literal | `content/secciones/02-seguridad-global.md` | Íntegro |
| Escala de riesgo y series | `content/03-datos-y-tablas.md` | Cuatro niveles con su color |
| Mapa 1985 + 2015 | `public/assets-origen/p04-X19.png` | 1025×246, doble mapa en una imagen |
| Mapa «actualidad» | `public/assets-origen/p05-X25.png` | 499×244, **baja resolución** |
| Mapa «proyección 2050» | — | **No existe.** Bloqueo B-03 |
| Leyenda | `public/assets-origen/p04-X21.png` | Se reconstruye en HTML |

**No existe** ningún mapa vectorial. Los originales son raster de muy baja resolución y no sirven
para pantalla completa.

---

## 2. Decisiones cerradas (no reabrir en v1)

### 2.1 Comunes

| # | Tema | Decisión |
|---|------|----------|
| C1 | Idioma | Español de España. Rótulos y leyenda literales del dossier, en versalitas como en el original. |
| C2 | Tests | Los tres obligatorios del perfil §5 por escena, más axe. La coreografía y la interpolación entre estados de mapa son funciones puras y se testean por valores exactos. |
| C3 | Zonas protegidas | No se toca `content/` ni `public/assets-origen/`. Este documento autoriza crear `src/scenes/02-seguridad-global/` y los SVG derivados en `public/maps/`. |
| C4 | Invariantes | I1 (rótulos y niveles literales), I3, I4 (**la tabla de riesgo por región vive en el DOM**, no solo en el SVG), I5, I6, I9. |
| C5 | Mapa ≠ dato | El mapa es la ilustración; la tabla equivalente es el dato. Ambos existen siempre, no uno en lugar del otro. |

### 2.2 Los mapas

| # | Tema | Decisión |
|---|------|----------|
| F1 | Técnica | **SVG vectorial redibujado**, no los PNG originales. Los raster de 499×244 se pixelan a pantalla completa y no son accesibles. Los PNG quedan solo como referencia durante el redibujo. |
| F2 | Geometría | Una sola silueta mundial compartida por los cuatro estados. Lo que cambia entre estados son las **manchas de riesgo**, no el mapa base. Proyección equirrectangular simple, sin dependencia de librería cartográfica. |
| F3 | Transición | Interpolación entre estados por opacidad cruzada de capas de riesgo, no por `MorphSVG`: las manchas cambian de número y topología entre períodos, y morfear formas de conteo distinto produce artefactos. |
| F4 | Sudamérica | Permanece en el azul de estabilidad `#2B498F` en los cuatro estados, con un realce sutil que crece con el progreso. Es el argumento de la sección. |
| F5 | Estados temporales | Cuatro: `1985`, `2015`, `2026` (rotulado «En la actualidad») y `2050` (rotulado «Proyección 2050»). |
| F6 | Mapa de 2050 | Bloqueo B-03: en el PDF es byte-idéntico al de «actualidad». **Se dibuja un estado 2050 diferenciado** derivado de la tesis textual del dossier (mayor tensión en América del Norte por el Ártico, el Colorado y el Golfo de México), y se marca visiblemente como **proyección**, no como dato. Se registra en deuda hasta que el cliente aporte el mapa real. |
| F7 | Contador de año | El año se muestra con `<CountUp>` ligado al progreso, saltando entre los cuatro valores discretos, nunca interpolando a años intermedios inexistentes. |
| F8 | Leyenda | Reconstruida en HTML con los cuatro niveles, siempre visible junto al mapa. Nunca en un pie desplazado. |
| F9 | Accesibilidad de la escala | Los cuatro niveles no se distinguen solo por color: cada mancha lleva además **patrón de trama** distinto y la leyenda muestra ambos. Requisito de `content/06-requisitos-funcionales.md`. |
| F10 | Tabla equivalente | Bajo el mapa, una tabla de regiones × períodos con el nivel de riesgo en texto. Es la alternativa accesible obligatoria (I4) y es contenido, no un extra. |
| F11 | Navegación manual | Además del scroll, cuatro botones de período operables con teclado. La escena debe ser usable sin hacer scroll. |

### 2.3 Factor climático

| # | Tema | Decisión |
|---|------|----------|
| S1 | Alcance | Se implementa el texto literal del dossier, incluidas las doce regiones. |
| S2 | Presentación de las regiones | Las doce regiones como conjunto de etiquetas, no como párrafo corrido. China marcada como «la principal» según el original. |
| S3 | Ausencia de Sudamérica | Se destaca visualmente que Sudamérica no está en la lista: es el argumento. Un contador «12 regiones · Sudamérica no figura». |
| S4 | Errata E-07 | El dossier afirma sin fuente concreta que las potencias ejecutan programas de modificación climática. Se reproduce literal por I1 y **se registra en deuda** para decisión del cliente. No se suaviza ni se suprime unilateralmente. |
| S5 | Fuente visible | Bajo la subsección, la atribución de fuentes del dossier (ACLED, Global Guardian, Crisis24, NASA) en texto legible, **sin logotipos** (I6). |

### 2.4 Cierre del acto

| # | Tema | Decisión |
|---|------|----------|
| D1 | Cita de cierre | El párrafo «¿Por qué es tan importante destacar la zona de paz…?» como `<PullQuote>` a ancho reducido. Aparece **solo aquí**: el documento 03 lo omite por ser duplicado en el original (errata E-01). |
| D2 | Fondo del acto | De navy medio `#1A2C42` (heredado del acto I) a un navy más frío conforme el mapa se enfría hacia Sudamérica. |
| D3 | CTA | Sin CTA intermedio en este acto. El del acto I está cerca y el del acto III llega después; tres seguidos saturan. |

---

## 3. Serie de mapas — Especificación de implementación

### 3.1 Objetivo de negocio

Demostrar visualmente, no argumentalmente, que la geografía del riesgo se ha desplazado y que
Sudamérica queda fuera. Es la sección con mayor potencial visual del dossier y la que mejor
convierte una tesis abstracta en una imagen que se recuerda.

### 3.2 Modelo de datos (contenido tipado)

`src/scenes/02-seguridad-global/content.ts`:

```ts
type RiskLevel = "extreme" | "high" | "latent" | "stable"

type RiskPeriod = {
  id: "1985" | "2015" | "2026" | "2050"
  year: number
  label: string
  shortLabel: string
  isProjection: boolean
  regions: Record<RegionId, RiskLevel>
}
```

| Campo | Tipo | Origen |
|-------|------|--------|
| `act` | `2` | |
| `title` | `string` | «Seguridad global» |
| `intro` | `string` | Entradilla literal |
| `periods` | `RiskPeriod[]` | Cuatro, en orden cronológico |
| `levels` | `{ id, label, color, pattern }[]` | Los cuatro niveles con su token y su trama (F9) |
| `southAmericaArgument` | `string[]` | Los cuatro argumentos de estabilidad, literales |
| `climate` | `ClimateContent` | Subsección del factor climático |
| `closingQuote` | `string` | La cita de D1 |
| `sources` | `string[]` | ACLED, Global Guardian, Crisis24, NASA |

Los niveles por región viven en `src/scenes/02-seguridad-global/risk-data.ts`, tipados y con
comentario de procedencia. Ninguna región tiene nivel inventado sin respaldo en el mapa original.

### 3.3 Algoritmo canónico (pseudocódigo)

Selección e interpolación del estado de mapa — `src/scenes/02-seguridad-global/timeline.ts`:

```text
choreographAct2(p):                     # p: 0 → 1, progreso de scroll de la escena
  # 0.00–0.12  entradilla
  introOpacity  := ventana(clamp01(p / 0.12), entrada=0.30, salida=0.80)

  # 0.12–0.72  la serie temporal: cuatro estados, tres transiciones
  mapProgress   := clamp01((p - 0.12) / 0.60)
  indice        := mapProgress * 3                 # 0 → 3, continuo
  from          := floor(indice) acotado a [0, 3]
  to            := min(from + 1, 3)
  blend         := indice - from                   # 0 → 1 dentro del tramo

  # el año NO se interpola: salta al periodo dominante (F7)
  periodoActivo := (blend < 0.5) ? from : to
  year          := periods[periodoActivo].year

  # opacidad de cada capa de riesgo
  para cada periodo i de 0..3:
    si from == to:            layerOpacity[i] := (i == from) ? 1 : 0
    sino si i == from:        layerOpacity[i] := 1 - blend
    sino si i == to:          layerOpacity[i] := blend
    sino:                     layerOpacity[i] := 0

  # 0.12–0.72  Sudamerica se realza progresivamente (F4)
  southAmericaGlow := ease.inOut(mapProgress)

  # 0.74–0.88  factor climatico
  climateOpacity := ventana(clamp01((p - 0.74) / 0.14), entrada=0.20, salida=0.85)

  # 0.90–1.00  cita de cierre
  quoteOpacity  := clamp01((p - 0.90) / 0.10)

  surfaceMix    := ease.inOut(p)

  devolver { introOpacity, layerOpacity, periodoActivo, year, blend,
             southAmericaGlow, climateOpacity, quoteOpacity, surfaceMix }
```

_Un solo helper. La suma de `layerOpacity` es siempre exactamente 1: es lo que impide que el mapa
se vea lavado o doblemente pintado en mitad de una transición._

### 3.4 Superficies a unificar

| Punto | Fichero | Nota |
|-------|---------|------|
| Coreografía y selección de período | `src/scenes/02-seguridad-global/timeline.ts` | Función pura |
| Datos de riesgo por región y período | `src/scenes/02-seguridad-global/risk-data.ts` | Única fuente; la tabla y el mapa leen de aquí |
| Silueta mundial | `public/maps/world-base.svg` | Compartida por los cuatro estados (F2) |
| Tramas de accesibilidad | `src/components/RiskPattern.tsx` | Definiciones SVG reutilizadas por mapa y leyenda |

### 3.5 Migración / recálculo de datos existentes

`No aplica`.

### 3.6 Casos límite

- **`blend` exactamente 0 o 1:** una sola capa visible, opacidad 1. Sin sumas de 0,999.
- **Final de la serie (`from == to == 3`):** la última capa queda a 1; sin división por cero.
- **Salto directo con los botones de período (F11):** transición por tiempo, no por scroll, y el
  scroll se sincroniza a la posición correspondiente para que no haya salto al reanudar.
- **Movimiento reducido:** se muestran los **cuatro mapas apilados** con su rótulo, más la tabla.
  Nada de un solo estado arbitrario: el argumento es la serie completa.
- **Sin JavaScript o SVG no soportado:** la tabla equivalente (F10) sigue siendo contenido HTML.
- **Viewport muy ancho:** el mapa tiene ancho máximo; no se estira hasta deformar la proyección.
- **Nivel de región ausente en un período:** se trata como `stable` y se registra un aviso en
  desarrollo; nunca se pinta un color por defecto silencioso.

### 3.7 API de componentes (contrato de props)

| Componente | Props |
|------------|-------|
| `<Act2Scene>` | ninguna — lee su `content.ts` |
| `<RiskMap>` | `periods: RiskPeriod[], layerOpacity: number[], southAmericaGlow: number` |
| `<RiskLegend>` | `levels: Level[]` — color + trama + etiqueta (F8, F9) |
| `<PeriodSelector>` | `periods, activeIndex, onSelect` — operable con teclado (F11) |
| `<RiskTable>` | `periods: RiskPeriod[]` — la alternativa accesible (F10) |
| `<ClimateRegions>` | `regions: ClimateRegion[], progress: number` |
| `<RiskPattern>` | `level: RiskLevel` — definición SVG de trama |

### 3.8 Tests golden Mapas (mínimos)

Prefijo estable **`MAP`**.

| ID | Escenario | Esperado |
|----|-----------|----------|
| MAP-01 | `choreographAct2` en `p` = 0.12, 0.32, 0.52, 0.72 | Los cuatro períodos activos en orden: 1985, 2015, 2026, 2050 |
| MAP-02 | `choreographAct2` en cualquier `p` de 0 a 1 | La suma de `layerOpacity` es exactamente 1 |
| MAP-03 | `choreographAct2` al final de la serie | `from == to == 3` no produce `NaN`; la última capa queda a 1 |
| MAP-04 | `year` a lo largo de toda la serie | Solo toma los valores 1985, 2015, 2026 y 2050; nunca un año intermedio (F7) |
| MAP-05 | `southAmericaGlow` a lo largo de la serie | Monótona creciente de 0 a 1 |
| MAP-06 | Escena renderizada | La tabla equivalente está en el DOM con las cuatro columnas de período (F10, I4) |
| MAP-07 | Leyenda renderizada | Los cuatro niveles con su etiqueta literal **y** su trama distinta, no solo color (F9) |
| MAP-08 | Escena con `prefers-reduced-motion: reduce` | Los cuatro mapas visibles apilados con sus rótulos; ningún ScrollTrigger creado |
| MAP-09 | `<PeriodSelector>` con teclado | Los cuatro períodos alcanzables con Tab y activables con Enter y Espacio |
| MAP-10 | Período 2050 renderizado | Marcado visiblemente como proyección, no como dato (F6) |
| MAP-11 | Escena con axe | Cero violaciones `critical` y `serious` |
| MAP-12 | Montaje y desmontaje | Cero ScrollTriggers vivos tras desmontar |
| MAP-13 | Fidelidad de contenido | Rótulos de los cuatro mapas y etiquetas de los cuatro niveles idénticos a `content/secciones/02-seguridad-global.md` (I1) |
| MAP-14 | Región sin nivel declarado en un período | Se trata como `stable` y emite aviso en desarrollo; no se pinta color por defecto silencioso |
| MAP-15 | Regresión: actos previos | El hero y el acto I siguen funcionando con el acto II montado |

---

## 4. Factor climático — Especificación de implementación

### 4.1 Objetivo de negocio

Reforzar el argumento geográfico con una segunda dimensión —la climática— y cerrar con la
observación de que Sudamérica no figura entre las regiones intervenidas.

### 4.2 Modelo de datos

| Campo | Tipo | Origen |
|-------|------|--------|
| `intro` | `string` | Literal |
| `split` | `string[]` | «modificación local del tiempo», «modificación de la radiación solar» |
| `regions` | `{ name: string; isPrimary: boolean }[]` | Las doce, China con `isPrimary` (S2) |
| `southAmerica` | `string` | Párrafo literal sobre las políticas preventivas |
| `sourceNote` | `string` | Atribución visible (S5) |

### 4.3 Flujo UX

Subsección de detalle con separador visual claro respecto a la serie de mapas: al ir fuera del
pin, el clima y el cierre se leen completos aunque la escena anclada ya haya terminado. Las doce
regiones entran escalonadas como etiquetas conforme avanza `climateOpacity`, y al completarse
aparece el contador de S3.

### 4.4 API (orientativa)

| Componente | Props |
|------------|-------|
| `<ClimateSection>` | `content: ClimateContent, progress: number` |
| `<ClimateRegions>` | `regions, progress` |

### 4.5 UI

- Las doce regiones como etiquetas, no como párrafo (S2).
- China con tratamiento diferenciado por ser «la principal» en el original.
- Contador «12 regiones · Sudamérica no figura» al completarse la entrada (S3).
- Atribución de fuentes en texto legible, sin logotipos (S5, I6).

### 4.6 Tests golden Factor climático (mínimos)

Prefijo estable **`CLI`**.

| ID | Escenario | Esperado |
|----|-----------|----------|
| CLI-01 | Subsección renderizada | Las doce regiones están en el DOM, con China marcada como principal |
| CLI-02 | Subsección renderizada | Sudamérica **no** figura entre las doce regiones (S3) |
| CLI-03 | Subsección con `prefers-reduced-motion` | Las doce etiquetas visibles a la vez, con todo su texto |
| CLI-04 | Atribución de fuentes | Presente como texto, sin ningún `<img>` con nombre de organismo (I6, S5) |
| CLI-05 | Fidelidad de contenido | El texto de la subsección coincide carácter a carácter con `content/secciones/02-seguridad-global.md` (I1) |

---

## 5. Seguridad, permisos y aislamiento

- **I4:** la tabla de riesgo por región y período está siempre en el DOM. El SVG del mapa lleva
  `role="img"` con `aria-labelledby` apuntando a un título y una descripción reales.
- **I6:** la atribución de fuentes es texto. Ninguna imagen con nombre de organismo en `public/`.
- **I9:** los SVG de los cuatro estados se cargan como componentes React, no como peticiones
  separadas; peso total de la escena por debajo de 120 KB.
- **I1:** los niveles de riesgo por región salen de `risk-data.ts`, cuyo contenido se deriva de los
  mapas originales del dossier y se documenta como tal. El estado 2050 se marca como proyección.
- Sin peticiones de red, sin cookies, sin analítica en esta superficie.

---

## 6. Textos de interfaz (claves orientativas)

| Clave | ES |
|-------|-----|
| `act2.legendTitle` | Nivel de riesgo |
| `act2.periodSelector` | Seleccionar período |
| `act2.tableCaption` | Nivel de riesgo bélico por región y período |
| `act2.projectionNote` | Proyección, no dato observado |
| `act2.climateCounter` | 12 regiones · Sudamérica no figura |
| `act2.sourcesLabel` | Fuentes de esta sección |

---

## 7. Plan de implementación (fases)

### Fase A — Cartografía vectorial y datos

1. `public/maps/world-base.svg`: silueta mundial en proyección equirrectangular, optimizada y sin
   metadatos de editor (F2).
2. `src/scenes/02-seguridad-global/risk-data.ts` con los niveles por región y período, derivados
   de los mapas originales y documentados como tal. Estado 2050 diferenciado y marcado (F6).
3. `<RiskPattern>` con las cuatro tramas de accesibilidad (F9).
4. `<RiskLegend>` reconstruida en HTML, con color y trama (F8).
5. `<RiskTable>` con la tabla equivalente completa (F10).
6. Tests MAP-06, MAP-07, MAP-13, MAP-14.

**DoD fase A:** los cuatro estados de riesgo existen como datos consultables; la tabla y la leyenda
renderizan sin mapa; las cuatro tramas se distinguen en escala de grises.

### Fase B — Escena estática con selector

1. `<Act2Scene>` estática: entradilla, `<RiskMap>` con un período fijo, leyenda, selector y tabla.
2. `<PeriodSelector>` operable con teclado, cambiando el estado del mapa sin scroll (F11).
3. Contenido tipado completo en `content.ts`, literal del dossier.
4. Registro de la escena en `src/app/sections.ts`.
5. Tests MAP-09, MAP-10, MAP-11.

**DoD fase B:** la escena es completamente usable **sin hacer scroll**: se navegan los cuatro
períodos con teclado y la tabla acompaña. Cero violaciones axe.

### Fase C — Serie temporal con scrub

1. `choreographAct2` como función pura, con la interpolación de capas de §3.3.
2. Anclaje y scrub con `useGsapScene`; altura `500vh`.
   La escena ancla el mapa y el selector; la leyenda, la tabla, el clima y el cierre viven en un
   bloque de detalle **fuera del pin**: el conjunto supera `100svh` y, al quedar fijo, la tabla
   y el cierre no eran accesibles. El mapa se dimensiona para caber entero en la ventana.
3. Opacidad cruzada de las cuatro capas; contador de año discreto (F7); realce de Sudamérica (F4).
4. Sincronización entre el selector manual y la posición de scroll (§3.6).
5. Transición de fondo del acto (D2).
6. Tests MAP-01, MAP-02, MAP-03, MAP-04, MAP-05, MAP-08, MAP-12, MAP-15.

**DoD fase C:** la serie se recorre con el scroll de 1985 a 2050 sin que el mapa se vea lavado en
ningún punto (MAP-02); el año nunca muestra un valor intermedio; con movimiento reducido se ven
los cuatro mapas apilados.

### Fase D — Factor climático y cierre

1. `<ClimateSection>` con las doce regiones escalonadas y el contador de S3.
2. Atribución de fuentes visible, sin logotipos (S5).
3. `<PullQuote>` de cierre del acto (D1).
4. `<ActSeal>` de transición al acto III.
5. Tests CLI-01 a CLI-05.

**DoD fase D:** la subsección climática entra tras la serie de mapas, con las doce regiones y el
contador; la cita de cierre aparece una sola vez en todo el sitio.

### Fase E — Cierre documental y gates globales

1. Marcar el DoD de §8 y la fila 02 del roadmap como «hecho en branch».
2. Registrar en `docs/debt/technical-debt.md` las filas de §12, incluidos B-03 (mapa 2050),
   E-07 (afirmación climática) y la licencia de los mapas originales.
3. Ejecutar todos los gates del perfil §5.
4. Limpieza residual: SVG no usados, entradas huérfanas en `risk-data.ts`.

**DoD fase E:** los cinco gates del perfil §5 en verde, ejecutados de verdad.

---

## 8. Criterios de aceptación (DoD)

### 8.1 Serie de mapas

- [x] Los cuatro estados son SVG vectorial nítido a pantalla completa, no los PNG originales.
- [x] La transición entre estados nunca deja el mapa lavado ni doblemente pintado.
- [x] El año salta entre los cuatro valores reales, sin interpolar años inexistentes.
- [x] Sudamérica permanece en azul de estabilidad y se realza progresivamente.
- [x] Los cuatro niveles se distinguen por trama además de por color.
- [x] La tabla equivalente está siempre en el DOM.
- [x] La escena es usable sin hacer scroll, con teclado.
- [x] El estado 2050 se presenta como proyección, nunca como dato.
- [x] Los quince tests MAP-01…MAP-15 existen y pasan.

### 8.2 Factor climático

- [x] Las doce regiones aparecen como etiquetas, con China marcada como principal.
- [x] Se destaca que Sudamérica no figura.
- [x] Las fuentes se citan como texto, sin logotipos.
- [x] Los cinco tests CLI-01…CLI-05 existen y pasan.

### 8.3 Global

- [x] `docs/product/roadmap.md` fila 02 actualizada a «hecho en branch».
- [x] Lo no cubierto → filas honestas en `docs/debt/technical-debt.md`.
- [x] Se respetan el idioma y la política de comentarios del perfil §1.
- [x] No se modificó ninguna zona protegida del perfil §6 sin autorización de C3.
- [x] Todos los gates del perfil §5 en verde, ejecutados de verdad.
- [x] Ningún invariante del perfil §7 roto en la superficie tocada.

---

## 9. Fuera de alcance (v1)

| Ítem | Notas |
|------|-------|
| Mapa de proyección 2050 aportado por el cliente | Bloqueo B-03; se dibuja uno derivado y marcado como proyección |
| Zoom o exploración interactiva del mapa | La serie temporal ya es la interacción; añadir zoom compite con el scroll |
| Datos de conflicto en tiempo real desde ACLED | Requeriría backend; el dossier usa una foto fija |
| Globo terráqueo en WebGL | El mapa plano comunica mejor la comparación entre continentes; WebGL se reserva para el acto III |
| Corrección o supresión del apartado climático | Errata E-07: decisión editorial del cliente |
| Página de detalle del acto II | Documento 07 |
| Adaptación móvil | Documento 08 |

---

## 10. Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| Redibujar los mapas a mano introduce imprecisión geográfica que un lector detecta | La silueta base se genera de datos públicos de dominio libre, no a pulso; las manchas de riesgo son deliberadamente esquemáticas y así se presentan |
| El estado 2050 dibujado se lee como dato y daña la credibilidad | F6 + MAP-10: marcado visible como proyección, y registrado en deuda hasta que llegue el mapa real |
| La opacidad cruzada deja el mapa lavado a mitad de transición | MAP-02 exige que la suma de opacidades sea exactamente 1 en todo el recorrido |
| Cuatro niveles distinguidos solo por color excluyen a usuarios con daltonismo | F9 + MAP-07: trama distinta por nivel, verificada también en escala de grises |
| La escena solo funciona haciendo scroll y queda inutilizable con teclado | F11 + MAP-09: selector de período completamente operable sin ratón ni scroll |
| La afirmación sobre modificación climática erosiona la credibilidad ante el inversor | S4: se reproduce literal por I1 y se registra en deuda con las tres opciones para el cliente |
| Los PNG originales pueden tener licencia de ACLED, Global Guardian o Crisis24 | Se redibuja desde cero (F1) y se registra la verificación de licencia en deuda |

---

## 11. Casos de prueba mínimos (checklist de revisión)

- [ ] Llego al acto II tras el sello de laurel y veo el mapa de 1985 con su leyenda.
- [ ] Hago scroll: el mapa transiciona a 2015, 2026 y 2050 sin quedar lavado en ningún momento.
- [ ] El año del contador salta entre los cuatro valores, nunca muestra 1997 ni 2031.
- [ ] Sudamérica se mantiene azul y va destacando conforme avanzo.
- [ ] Pongo la pantalla en escala de grises: sigo distinguiendo los cuatro niveles por su trama.
- [ ] Sin tocar el scroll, navego los cuatro períodos con Tab y Enter.
- [ ] Leo la tabla bajo el mapa: contiene los mismos niveles que veo pintados.
- [ ] El estado 2050 dice claramente que es una proyección.
- [ ] Activo «reducir movimiento» y recargo: veo los cuatro mapas apilados con sus rótulos.
- [ ] Cuento las regiones del factor climático: doce, y Sudamérica no está.

---

## 12. Deuda explícita (registrar al implementar)

### 12.1 E2E — Recorrido de la serie temporal

- Historia: como visitante, recorro el acto II y veo los cuatro estados de riesgo en orden
  cronológico, con Sudamérica destacada al final.
- Detectada en: este doc §7 fase C. Sin E2E en v1 (perfil §3).

### 12.2 Bloqueo B-03 — mapa de proyección 2050

- El PDF usa la misma imagen para «actualidad» y «2050». Se dibuja un estado derivado y marcado
  como proyección. Falta el mapa real del cliente.
- Detectada en: `content/08-notas-editoriales.md` B-03.

### 12.3 Errata E-07 — afirmación sobre modificación climática

- Sin fuente concreta. Se reproduce literal por I1. Decisión del cliente: mantener con fuente,
  reformular o suprimir.
- Detectada en: `content/08-notas-editoriales.md` E-07.

### 12.4 Licencia de los mapas originales

- Los PNG del dossier pueden derivar de material de ACLED, Global Guardian o Crisis24. Los SVG se
  redibujan desde cero, pero conviene confirmar que la clasificación de riesgo por región no
  reproduce un producto con licencia.
- Detectada en: `content/04-assets-visuales.md` §Nota sobre derechos.

---

## 13. Referencias de código (pre-feature)

| Área | Rutas |
|------|-------|
| Contenido literal del acto II | `content/secciones/02-seguridad-global.md` |
| Escala de riesgo y series | `content/03-datos-y-tablas.md` |
| Mapas originales de referencia | `public/assets-origen/p04-X19.png`, `p05-X25.png`, `p04-X21.png` |
| Requisitos de accesibilidad | `content/06-requisitos-funcionales.md` |
| Notas de derechos sobre los mapas | `content/04-assets-visuales.md` |
| Primitivas y motor | `src/components/`, `src/motion/` (documento 00) |
| Patrón de escena anclada | `src/scenes/01-escenario-europeo/` (documento 01) |

---

## 14. Orden de trabajo sugerido en el branch

```text
main
  Fase A  → cartografía vectorial, datos de riesgo, leyenda y tabla accesibles
  Fase B  → escena estática con selector de período usable sin scroll
  Fase C  → serie temporal con scrub, contador de año y realce de Sudamérica
  Fase D  → factor climático, cita de cierre y sello de transición
  Fase E  → docs + deuda + gates
```

Dependencias duras: todo requiere los documentos 00 y 01 cerrados. B necesita la leyenda y la
tabla de A; C necesita la escena estática de B para animarla; D se monta en la misma escena que C.
E es siempre la última.

---

*Documento vivo de implementación. Actualizar los checkboxes del DoD y el estado del encabezado
al cerrar cada fase.*

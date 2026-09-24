# Acto III — La asimetría territorial

**Estado:** hecho en branch `main` (2026-09-24). No fusionado.
**Branch de trabajo:** el HEAD actual del worktree.
**Perfil de proyecto:** [`agent-docs/goal-profile.md`](../../agent-docs/goal-profile.md) — invariantes §7 aplicables: I1, I3, I4, I5, I9.
**Roadmap:** [`roadmap.md`](roadmap.md) §2, fila 03.
**Relacionado:** [`00-fundacion-sistema-diseno.md`](00-fundacion-sistema-diseno.md) (motor, `<Scene>`, `<CountUp>`, `<StatFigure>`) · [`02-acto-ii-seguridad-global.md`](02-acto-ii-seguridad-global.md) (`<ActSeal>`, patrón de escena anclada, cita de cierre que **no** se repite aquí). **No reimplementar** ninguno de los dos.

Manda sobre el acto III: convertir la tesis geopolítica en números comparables. Contiene la
**escena estrella** del sitio —la transición día→noche sobre España y Argentina— y es el primer
punto donde el par España↔Argentina se hace explícito.

| Referencia | Tema | Resumen v1 |
|------------|------|------------|
| **roadmap §2 fila 03** | Acto III | Escena WebGL en la que el terminador solar barre ambos países mientras se encienden las luces urbanas y los contadores de superficie, población y densidad tickean con el scroll. Más la comparativa territorial y bursátil. |

---

## 1. Contexto del software actual (punto de partida)

### 1.1 Fundación y actos previos disponibles

| Pieza | Ubicación | Comportamiento |
|-------|-----------|----------------|
| Motor de movimiento | `src/motion/` | `useGsapScene`, `<Scene>` con `fallback` y reserva de altura, `useReducedMotionSafe` |
| Primitivas | `src/components/` | `<CountUp>`, `<StatFigure>`, `<DualFigure>`, `<PullQuote>`, `<ActSeal>` |
| Formato de cifras | `src/lib/format.ts` | `formatNumber`, `formatArea`, `formatDensity`, `formatPercent` |
| Carga diferida de WebGL | `src/three/` | Convención de `React.lazy` establecida en el documento 00 M9 |

**No existe** ninguna pieza React Three Fiber: este documento es el primero que introduce WebGL.

### 1.2 Contenido y assets de origen

| Pieza | Ubicación | Estado |
|-------|-----------|--------|
| Acto III completo, literal | `content/secciones/03-estado-de-derecho.md` | Íntegro |
| Comparativa territorial y bursátil | `content/03-datos-y-tablas.md` | Cifras exactas |
| Imagen satelital nocturna | `public/assets-origen/p09-X36.png` | 593×1024. **La mejor imagen del dossier** |
| Diagrama del modelo territorial español | — | No existe; descrito en texto |

**Errata conocida:** la conclusión del acto contiene una frase gramaticalmente incompleta
(«…mantiene a Argentina fuera de riesgo una asimetría territorial única…»), registrada como E-02.

---

## 2. Decisiones cerradas (no reabrir en v1)

### 2.1 Comunes

| # | Tema | Decisión |
|---|------|----------|
| C1 | Idioma | Español de España. Cifras en convención española mediante `src/lib/format.ts`, sin excepción. |
| C2 | Tests | Los tres obligatorios del perfil §5, más axe. La lógica de contadores e interpolación es pura y entra en el gate de cobertura de `src/lib/`. |
| C3 | Zonas protegidas | No se toca `content/` ni `public/assets-origen/`. Este documento autoriza crear `src/scenes/03-asimetria-territorial/`, `src/three/` y texturas derivadas en `public/textures/`. |
| C4 | Invariantes | I1 (cifras exactas del dossier), I3, I4 (**las tres cifras viven en el DOM desde el primer render**, no en el canvas), I5 (el contexto WebGL se destruye al desmontar), I9 (WebGL en chunk diferido). |
| C5 | Párrafo duplicado | El párrafo sobre la «nueva ola migratoria» se implementó en el acto II (documento 02 D1). **Aquí se omite**: errata E-01 del dossier. No es un olvido, es una decisión. |

### 2.2 Escena satelital día→noche

| # | Tema | Decisión |
|---|------|----------|
| F1 | Técnica | **React Three Fiber** con un shader propio. Es la única escena WebGL de los actos I–IV; se reserva aquí porque es donde el efecto es contenido y no adorno. |
| F2 | Composición | Dos siluetas de país lado a lado —España a la izquierda, Argentina a la derecha— con la escala relativa **real**: Argentina ocupa 5,5 veces la superficie de España. La desproporción es el argumento; no se normaliza el tamaño. |
| F3 | Mecanismo | Un `uniform nightAmount` de 0 a 1 mezcla dos texturas por país: diurna y nocturna. El scroll no desplaza la escena; la **transforma**. La escena queda anclada y el scroll controla la hora del día. |
| F4 | Terminador solar | La transición no es un fundido plano: un frente de sombra barre de este a oeste, con un degradado suave de unos pocos grados de ancho. España entra en la noche antes que Argentina, como en la realidad. |
| F5 | Luces urbanas | Emergen conforme cae la noche, con retardo escalonado por ciudad y una intensidad proporcional a la población del núcleo. Bloom sutil mediante `postprocessing`. España se enciende como una malla densa y continua; Argentina como un nodo muy brillante en AMBA con puntos dispersos. |
| F6 | Contadores | Superficie, población y densidad tickean con el mismo progreso que la noche. Cierran exactamente en `505.990 km²` / `2.780.400 km²`, `48.600.000` / `45.900.000` y `96,05` / `16,51 hab/km²`. |
| F7 | Momento de la revelación | La densidad es el dato que remata la escena: se revela al final, cuando ambos países ya están de noche y la diferencia lumínica es evidente. Los otros dos contadores llegan antes. |
| F8 | Texturas | Derivadas de `public/assets-origen/p09-X36.png` para el estado nocturno y generadas para el diurno. Se sirven en WebP con respaldo, con dimensión ajustada al uso real: nunca la imagen original a pantalla completa. |
| F9 | Fallback estático | `<Scene>` renderiza, mientras carga o si WebGL no está disponible, una composición estática con la imagen nocturna y **las tres cifras completas**. El fallback no es una pantalla de carga: es contenido (I4). |
| F10 | Presupuesto | Toda la escena WebGL —R3F, drei, postprocessing, shaders y texturas— va en su propio chunk diferido y no supera 400 KB gzip. El chunk de entrada del sitio no cambia (I9). |

### 2.3 Comparativa territorial y bursátil

| # | Tema | Decisión |
|---|------|----------|
| S1 | Componente pareado | Se crea `<PairedComparison>` en `src/components/`: dos columnas contrapuestas, España a la izquierda con oro apagado `#8A7A55`, Argentina a la derecha con azul de estabilidad `#2B498F`. **Reutilizable por los documentos 04 y 06.** |
| S2 | Identificador de país | Color + etiqueta textual. Prohibido el emoji de bandera como único identificador: no renderiza en Windows (doc 00 S3). |
| S3 | Comparativa territorial | Tres filas: superficie, población, densidad. Las cifras se enlazan a los contadores de la escena satelital: son el mismo dato, no dos versiones. |
| S4 | Modelo territorial español | El «anillo» periférico con nodo central en Madrid se ilustra con un diagrama SVG esquemático propio. Está descrito en el texto y sin ilustrar en el original. |
| S5 | Las tres ventajas de suelo | Suelo urbano premium, agrícola y de desarrollo estratégico como tres tarjetas numeradas, con el patrón de tarjeta del acto I. |
| S6 | Comparativa bursátil | `<PairedComparison>` con las filas de `content/03-datos-y-tablas.md`. En móvil se apila; nunca scroll horizontal de tabla (documento 08). |
| S7 | Divisa | El contraste euro/dólar es el eje del argumento y se marca tipográficamente en ambas comparativas. |
| S8 | Conclusión | Bloque destacado a ancho reducido. La frase incompleta de E-02 se reproduce **literal** por I1 y se registra en deuda; no se completa unilateralmente. |
| S9 | CTA intermedio | Al cierre del acto: «Analice su caso con un consultor» → `#contacto`. Es el segundo punto de conversión del scroll. |

### 2.4 Fondo y transición

| # | Tema | Decisión |
|---|------|----------|
| D1 | Fondo del acto | Es el único acto cuyo fondo lo controla la escena: pasa de un azul diurno claro a negro absoluto siguiendo `nightAmount`. El mecanismo de fondo por acto del documento 00 cede el control durante la escena satelital y lo recupera después. |
| D2 | Salida de la escena | Al terminar la escena satelital, el fondo vuelve al navy del sistema para las comparativas. La noche es el clímax, no el estado permanente. |

---

## 3. Escena satelital — Especificación de implementación

### 3.1 Objetivo de negocio

Hacer sentir, no solo leer, la asimetría entre España y Argentina. Dos países de población casi
idéntica y superficie cinco veces distinta: cuando ambos se encienden de noche, la diferencia de
densidad deja de ser un número y se convierte en una imagen. Es la escena que el visitante
recordará y la que justifica todo el argumento inmobiliario del acto V.

### 3.2 Modelo de datos (contenido tipado)

`src/scenes/03-asimetria-territorial/content.ts`:

```ts
type CountryFigures = {
  id: "es" | "ar"
  name: string
  areaKm2: number        // 505990 | 2780400
  population: number     // 48600000 | 45900000
  densityPerKm2: number  // 96.05 | 16.51
  accentToken: string    // token de color, no literal
}
```

| Campo | Tipo | Origen |
|-------|------|--------|
| `act` | `3` | |
| `title` | `string` | «Estado de derecho» |
| `intro` | `{ europe: string; southAmerica: string }` | Dos párrafos literales contrapuestos |
| `countries` | `[CountryFigures, CountryFigures]` | `content/03-datos-y-tablas.md` |
| `territorialModel` | `{ spain: string; argentina: string }` | Párrafos literales de comparativa territorial |
| `landAdvantages` | `LandAdvantage[]` | Las tres ventajas de suelo (S5) |
| `market` | `MarketRow[]` | Filas de la comparativa bursátil (S6) |
| `conclusion` | `string` | Literal, incluida la frase incompleta de E-02 |
| `cta` | `{ label, href }` | S9 |

Las ciudades para las luces urbanas viven en `src/scenes/03-asimetria-territorial/cities.ts`:
`{ name, lat, lon, weight }`. `weight` es relativo, entre 0 y 1, y solo controla brillo y retardo
de encendido — no es un dato de población que el sitio afirme.

### 3.3 Algoritmo canónico (pseudocódigo)

Coreografía de la escena — `src/scenes/03-asimetria-territorial/timeline.ts`:

```text
choreographAct3(p):                     # p: 0 → 1, progreso de scroll de la escena

  # 0.00–0.10  ambos países de día, en reposo
  # 0.10–0.62  el terminador barre; España entra en la noche antes que Argentina (F4)
  sweep         := clamp01((p - 0.10) / 0.52)

  # cada país tiene su propio desfase: España 0.00, Argentina 0.18
  para cada pais c en [es, ar]:
    local             := clamp01((sweep - offset[c]) / (1 - offset[c]))
    nightAmount[c]    := smoothstep(0, 1, local)
    terminatorX[c]    := lerp(1.15, -0.15, local)   # cruza el país de este a oeste
    cityGlow[c]       := smoothstep(0.25, 0.90, local)

  # contadores: superficie y población durante el barrido (F6)
  areaProgress  := clamp01((p - 0.16) / 0.24)
  popProgress   := clamp01((p - 0.34) / 0.24)

  # 0.66–0.80  la densidad es la revelación final (F7)
  densityProgress := clamp01((p - 0.66) / 0.14)

  # 0.82–1.00  se recupera el fondo del sistema y entra la comparativa (D2)
  nightRelease  := clamp01((p - 0.82) / 0.18)

  devolver { nightAmount, terminatorX, cityGlow,
             areaProgress, popProgress, densityProgress, nightRelease }
```

**Contrato de cierre exacto.** Todo contador cierra en su valor real, sin residuo de coma
flotante:

```text
valorMostrado(progreso, destino):
  si progreso >= 1:  devolver destino          # valor exacto, sin interpolar
  devolver destino * ease.out(progreso)
```

_Un solo helper en `src/lib/counter.ts`. Es lo que impide que la densidad de España cierre en
`96,04999` en vez de `96,05`._

### 3.4 Superficies a unificar

| Punto | Fichero | Nota |
|-------|---------|------|
| Coreografía de la escena | `src/scenes/03-asimetria-territorial/timeline.ts` | Función pura |
| Interpolación de contadores | `src/lib/counter.ts` | Entra en el gate de cobertura |
| Cifras de ambos países | `src/scenes/03-asimetria-territorial/content.ts` | Única fuente: contadores y comparativa leen de aquí (S3) |
| Comparativa pareada | `src/components/PairedComparison.tsx` | **Reutilizada por los documentos 04 y 06** (S1) |
| Canvas WebGL y su carga diferida | `src/three/LazyCanvas.tsx` | Convención para futuras escenas WebGL |

### 3.5 Migración / recálculo de datos existentes

`No aplica`.

### 3.6 Casos límite

- **WebGL no disponible o contexto perdido:** el `fallback` de F9 se mantiene permanentemente, con
  las tres cifras completas. Se escucha `webglcontextlost` y no se reintenta en bucle.
- **Movimiento reducido:** no se monta el canvas. Se muestra la composición estática nocturna con
  las tres cifras en su valor final y la comparativa completa. El contenido es idéntico (I3).
- **Contadores en `progress` = 1:** devuelven el valor exacto, no el resultado de interpolar
  (§3.3). Verificado por test.
- **Scroll muy rápido:** el shader interpola por `uniform`, no por acumulación de frames, así que
  un salto grande de progreso produce el estado correcto y no un estado intermedio pegado.
- **Texturas aún no cargadas al entrar la escena:** el fallback permanece hasta que ambas estén
  listas; nunca se muestra un plano negro sin contenido.
- **Ventana redimensionada durante la escena anclada:** el canvas ajusta su relación de aspecto sin
  deformar las siluetas; `ScrollTrigger.refresh()` recalcula la altura anclada.
- **Densidad de píxeles alta:** el canvas limita su `devicePixelRatio` a 2. Sin límite, una pantalla
  5K renderiza cuatro veces más píxeles de los necesarios y la escena cae de frames.

### 3.7 API de componentes (contrato de props)

| Componente | Props |
|------------|-------|
| `<Act3Scene>` | ninguna — lee su `content.ts` |
| `<NightfallCanvas>` | `state: Act3State, countries: CountryFigures[]` — **carga diferida** (F10) |
| `<NightfallFallback>` | `countries: CountryFigures[]` — estático, con las tres cifras (F9) |
| `<CountryFigureStack>` | `country: CountryFigures, areaProgress, popProgress, densityProgress` |
| `<PairedComparison>` | `left: Side, right: Side, rows: Row[], caption: string` (S1) |
| `<TerritorialModelDiagram>` | ninguna — SVG esquemático del anillo peninsular (S4) |
| `<LandAdvantageCards>` | `advantages: LandAdvantage[]` |

### 3.8 Tests golden Escena satelital (mínimos)

Prefijo estable **`SAT`**.

| ID | Escenario | Esperado |
|----|-----------|----------|
| SAT-01 | `choreographAct3` en `p` = 0, 0.25, 0.5, 0.75, 1 | Estados exactos y deterministas |
| SAT-02 | `nightAmount` a lo largo de la escena | Monótona creciente de 0 a 1 en ambos países; nunca retrocede |
| SAT-03 | `nightAmount` de España frente al de Argentina | El de España es siempre mayor o igual: España anochece antes (F4) |
| SAT-04 | `valorMostrado(1, 96.05)` | Devuelve exactamente `96.05`, sin residuo de coma flotante |
| SAT-05 | `valorMostrado` con destinos 505990, 2780400, 48600000, 45900000, 16.51 | Valor exacto en `progress` = 1 en los cinco casos |
| SAT-06 | Escena renderizada con `progress` = 0 | Las seis cifras de ambos países están ya en el DOM (I4) |
| SAT-07 | Cifras renderizadas | Formato español exacto: `505.990 km²`, `2.780.400 km²`, `96,05 hab/km²`, `16,51 hab/km²` |
| SAT-08 | Escena con `prefers-reduced-motion: reduce` | No se monta el canvas; la composición estática muestra las tres cifras finales y la comparativa completa |
| SAT-09 | WebGL no disponible | Se renderiza `<NightfallFallback>` con contenido completo, sin bucle de reintentos |
| SAT-10 | Montaje y desmontaje | Cero ScrollTriggers vivos; el contexto WebGL se libera; ningún `requestAnimationFrame` pendiente (I5) |
| SAT-11 | `npm run build` | R3F, drei, postprocessing y las texturas están en un chunk diferido; el chunk de entrada no los contiene (I9, F10) |
| SAT-12 | Peso del chunk de la escena | No supera 400 KB gzip (F10) |
| SAT-13 | Escena con axe | Cero violaciones `critical` y `serious`; el canvas lleva `aria-hidden` y el contenido equivalente está fuera |
| SAT-14 | Fidelidad de cifras | Superficie, población y densidad coinciden exactamente con `content/03-datos-y-tablas.md` (I1) |
| SAT-15 | `devicePixelRatio` alto | El canvas limita su resolución a 2× (§3.6) |

SAT-11 y SAT-12 son obligatorios: son los únicos tests que impiden que la escena estrella hunda el
tiempo de carga del sitio entero.

---

## 4. Comparativas — Especificación de implementación

### 4.1 Objetivo de negocio

Aterrizar la asimetría en números que el inversor pueda contrastar: territorio, densidad y mercado
bursátil. Es la evidencia cuantitativa que sostiene la tesis y prepara la sección de garantías.

### 4.2 Modelo de datos

| Campo | Tipo | Origen |
|-------|------|--------|
| `territorialRows` | `{ metric, spain, argentina, ratio }[]` | Superficie, población, densidad |
| `territorialModel` | `{ spain: string; argentina: string }` | Párrafos literales |
| `landAdvantages` | `{ index, type, zones, advantage }[]` | Las tres ventajas de suelo |
| `marketRows` | `{ criterion, spain, argentina }[]` | Nueve filas de la comparativa bursátil |
| `conclusion` | `string` | Literal, con la frase de E-02 |

### 4.3 Flujo UX

Tras la escena satelital, el fondo vuelve al navy del sistema (D2) y entran, en orden: comparativa
territorial → diagrama del modelo español → tres ventajas de suelo → comparativa bursátil →
conclusión → CTA. Entradas por desvanecimiento sutil al llegar al viewport, sin anclaje: el
clímax ya ha pasado y el resto del acto se lee, no se reproduce.

### 4.4 API (orientativa)

| Componente | Props |
|------------|-------|
| `<TerritorialComparison>` | `rows, countries` |
| `<MarketComparison>` | `rows` |
| `<TerritorialModelDiagram>` | ninguna |
| `<LandAdvantageCards>` | `advantages` |

### 4.5 UI

- `<PairedComparison>` con España a la izquierda en oro apagado y Argentina a la derecha en azul
  de estabilidad, con etiqueta textual además del color (S2).
- Las cifras de densidad en gran formato: `96,05` frente a `16,51` es el contraste visual más
  potente de la sección, casi seis veces.
- El contraste euro/dólar marcado tipográficamente en ambas comparativas (S7).
- La conclusión como bloque destacado a ancho reducido, con fondo diferenciado.
- Cifras tabulares activadas en todas las comparativas.

### 4.6 Tests golden Comparativas (mínimos)

Prefijo estable **`CMP`**.

| ID | Escenario | Esperado |
|----|-----------|----------|
| CMP-01 | `<PairedComparison>` renderizada | España y Argentina identificadas por etiqueta textual, no solo por color (S2) |
| CMP-02 | Comparativa territorial | Las tres filas con sus seis cifras exactas y su formato español |
| CMP-03 | Comparativa bursátil | Las nueve filas de `content/03-datos-y-tablas.md`, literales |
| CMP-04 | Comparativa renderizada | Ningún emoji de bandera como identificador único de país |
| CMP-05 | Conclusión renderizada | Texto literal, incluida la frase incompleta de E-02, sin completar (I1) |
| CMP-06 | Las tres ventajas de suelo | Presentes con su tipo, zonas y ventaja, literales |
| CMP-07 | Comparativas con axe | Cero violaciones `critical` y `serious`; las tablas con encabezados de fila y columna correctos |
| CMP-08 | CTA intermedio | Texto «Analice su caso con un consultor», destino `#contacto` |
| CMP-09 | Coherencia de cifras | Las cifras de la comparativa territorial son las mismas instancias que alimentan los contadores de la escena satelital (S3) |
| CMP-10 | Regresión: actos previos | Hero y actos I y II siguen funcionando con el acto III montado |

CMP-09 es obligatorio: impide que la escena y la tabla acaben mostrando dos versiones del mismo
dato tras un cambio.

---

## 5. Seguridad, permisos y aislamiento

- **I4:** las seis cifras de ambos países están en el DOM desde el primer render, con
  `progress` = 0. El canvas lleva `aria-hidden` y no contiene ningún dato que no esté fuera de él.
- **I9:** todo el WebGL en chunk diferido, verificado por SAT-11 y SAT-12. El canvas limita su
  resolución a 2× y detiene su bucle al salir del viewport.
- **I5:** al desmontar se libera el contexto WebGL, se cancela el bucle de render y se revierte el
  contexto de GSAP. Verificado por SAT-10.
- **I1:** las cifras salen de `content/03-datos-y-tablas.md`. El `weight` de las ciudades es un
  parámetro visual, no un dato que el sitio afirme, y así se documenta.
- **Licencia de la imagen satelital:** la textura nocturna deriva de `p09-X36.png`, de estética
  compatible con la serie *Earth at Night* de la NASA. Se registra en deuda la verificación de
  procedencia y la atribución. Sin logotipo de la NASA (I6).

---

## 6. Textos de interfaz (claves orientativas)

| Clave | ES |
|-------|-----|
| `act3.canvasAlt` | España y Argentina de noche: densidad de luz urbana comparada |
| `act3.areaLabel` | Superficie |
| `act3.populationLabel` | Población |
| `act3.densityLabel` | Densidad |
| `act3.spainLabel` | España |
| `act3.argentinaLabel` | Argentina |
| `act3.territorialCaption` | Comparativa territorial |
| `act3.marketCaption` | Comparativa de mercado bursátil |
| `act3.fallbackNote` | Vista estática: su dispositivo no admite la escena interactiva |

---

## 7. Plan de implementación (fases)

### Fase A — Lógica pura de contadores y datos

1. `src/lib/counter.ts` con `valorMostrado` y el contrato de cierre exacto de §3.3.
2. `src/scenes/03-asimetria-territorial/content.ts` con las cifras exactas y su tipado.
3. `src/scenes/03-asimetria-territorial/cities.ts` con las ciudades y su `weight` documentado como
   parámetro visual.
4. `choreographAct3` como función pura, con el desfase entre países de §3.3.
5. Tests SAT-01 a SAT-05, SAT-14.

**DoD fase A:** `valorMostrado` cierra en el valor exacto en los cinco destinos (SAT-05); la
coreografía es determinista y España anochece siempre antes que Argentina (SAT-03). Cobertura de
`src/lib/counter.ts` ≥ 80 %.

### Fase B — Comparativas estáticas y accesibles

1. `<PairedComparison>` en `src/components/`, reutilizable (S1).
2. `<TerritorialComparison>` y `<MarketComparison>` con sus filas literales.
3. `<TerritorialModelDiagram>`: SVG esquemático del anillo peninsular con nodo central (S4).
4. `<LandAdvantageCards>` con las tres ventajas de suelo (S5).
5. Conclusión y CTA intermedio.
6. Registro de la escena en `src/app/sections.ts`.
7. Tests CMP-01 a CMP-09.

**DoD fase B:** todo el contenido del acto III es legible y accesible **sin ninguna animación**;
las cifras se leen en formato español; la conclusión reproduce la frase de E-02 sin completarla.

### Fase C — Escena WebGL día→noche

1. `src/three/LazyCanvas.tsx`: convención de carga diferida y límite de `devicePixelRatio` (§3.6).
2. Texturas diurna y nocturna por país, derivadas y optimizadas a WebP (F8).
3. Shader con `uniform nightAmount` y frente de terminador (F3, F4).
4. Luces urbanas con retardo escalonado y bloom (F5).
5. `<NightfallFallback>` con las tres cifras completas (F9).
6. Ajuste de `manualChunks` para aislar el chunk WebGL.
7. Tests SAT-09, SAT-11, SAT-12, SAT-15.

**DoD fase C:** la escena renderiza a 60 fps en escritorio; el chunk WebGL está aislado y por
debajo de 400 KB gzip (SAT-11, SAT-12); sin WebGL se ve el fallback con contenido completo.

### Fase D — Enlace scroll ↔ escena

1. Anclaje y scrub con `useGsapScene`; altura `600vh`.
2. Cableado de `nightAmount`, `terminatorX` y `cityGlow` a los uniforms del shader.
3. Contadores ligados a `areaProgress`, `popProgress` y `densityProgress`, con la densidad como
   revelación final (F6, F7).
4. Control del fondo por la escena y devolución al sistema al salir (D1, D2).
5. `<ActSeal>` de transición al acto IV.
6. Tests SAT-06, SAT-07, SAT-08, SAT-10, SAT-13, CMP-10.

**DoD fase D:** el scroll transforma la escena de día a noche sin desplazarla; los contadores
cierran en sus valores exactos; con movimiento reducido no se monta el canvas y el contenido es
idéntico; desmontar libera el contexto WebGL.

### Fase E — Cierre documental y gates globales

1. Marcar el DoD de §8 y la fila 03 del roadmap como «hecho en branch».
2. Registrar en `docs/debt/technical-debt.md` las filas de §12, incluidas E-02 (frase incompleta) y
   la verificación de licencia de la imagen satelital.
3. Ejecutar todos los gates del perfil §5, con atención especial al presupuesto de bundle.
4. Limpieza residual: texturas no usadas, uniforms muertos.

**DoD fase E:** los cinco gates del perfil §5 en verde. El chunk de entrada del sitio no ha crecido
respecto al cierre del documento 02.

---

## 8. Criterios de aceptación (DoD)

### 8.1 Escena satelital

- [x] El scroll no desplaza la escena: la transforma de día a noche.
- [x] Argentina se muestra 5,5 veces mayor que España; la escala no se normaliza.
- [x] España anochece antes que Argentina.
- [x] Las luces urbanas emergen escaladas y con bloom.
- [x] Las tres cifras están en el DOM desde el primer render y cierran en su valor exacto.
- [x] La densidad se revela al final, cuando la diferencia lumínica ya es evidente.
- [x] Sin WebGL o con movimiento reducido, el contenido es idéntico.
- [x] El chunk WebGL está aislado y no supera 400 KB gzip.
- [x] Desmontar libera el contexto WebGL y todos los bucles.
- [x] Los quince tests SAT-01…SAT-15 existen y pasan.

### 8.2 Comparativas

- [x] `<PairedComparison>` existe en `src/components/` y es reutilizable por los documentos 04 y 06.
- [x] España y Argentina se identifican por etiqueta, no solo por color.
- [x] Las cifras de la comparativa son las mismas instancias que alimentan los contadores.
- [x] La conclusión reproduce la frase de E-02 sin completarla.
- [x] Las tablas tienen encabezados de fila y columna correctos.
- [x] Los diez tests CMP-01…CMP-10 existen y pasan.

### 8.3 Global

- [x] `docs/product/roadmap.md` fila 03 actualizada a «hecho en branch».
- [x] Lo no cubierto → filas honestas en `docs/debt/technical-debt.md`.
- [x] Se respetan el idioma y la política de comentarios del perfil §1.
- [x] No se modificó ninguna zona protegida del perfil §6 sin autorización de C3.
- [x] Todos los gates del perfil §5 en verde, ejecutados de verdad.
- [x] Ningún invariante del perfil §7 roto en la superficie tocada.

---

## 9. Fuera de alcance (v1)

| Ítem | Notas |
|------|-------|
| Globo terráqueo navegable | La comparación lado a lado es el argumento; un globo lo diluye |
| Datos de población en tiempo real | El dossier usa cifras fijas; sin backend |
| Zoom sobre las ciudades | Compite con el scroll, que ya controla la escena |
| Repetición del párrafo sobre la ola migratoria | Errata E-01: implementado en el acto II (C5) |
| Completar la frase incompleta de la conclusión | Errata E-02: decisión editorial del cliente |
| Página de detalle del acto III | Documento 07 |
| Adaptación móvil de la escena WebGL | Documento 08; ahí se decide si el móvil recibe canvas o fallback |

---

## 10. Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| La escena WebGL arrastra R3F al chunk de entrada y hunde el tiempo de carga del sitio entero | F10 + SAT-11 + SAT-12 + el gate de presupuesto del perfil §5; el chunk se verifica en cada build |
| La escena estrella no funciona en un portátil modesto y el visitante ve un rectángulo negro | F9: el fallback es contenido completo, no una pantalla de carga; SAT-09 lo verifica |
| Los contadores cierran en `96,04999` y la cifra clave del acto se ve mal | Contrato de cierre exacto en `src/lib/counter.ts` + SAT-04 y SAT-05 |
| La escena y la tabla acaban mostrando dos versiones del mismo dato tras un cambio | S3 + CMP-09: una sola fuente de cifras en `content.ts` |
| Una pantalla de alta densidad renderiza 4× píxeles y la escena cae de frames | Límite de `devicePixelRatio` a 2 + SAT-15 |
| El contexto WebGL no se libera y navegar entre secciones agota los contextos del navegador | I5 + SAT-10, que falla si queda algo vivo tras desmontar |
| La textura nocturna deriva de material de la NASA sin atribución verificada | Registrado en deuda §12.4; sin logotipo de la NASA (I6) |
| El desfase entre países se implementa al revés y Argentina anochece antes que España | SAT-03 lo verifica explícitamente |

---

## 11. Casos de prueba mínimos (checklist de revisión)

- [ ] Llego al acto III y veo España y Argentina de día, con Argentina claramente mucho mayor.
- [ ] Hago scroll: la escena **no se mueve**, cae la noche. Es la sensación correcta.
- [ ] España se oscurece antes que Argentina.
- [ ] Las luces se encienden: España como una malla continua, Argentina con un foco en Buenos Aires.
- [ ] Los contadores de superficie y población tickean durante el barrido.
- [ ] Al final se revela la densidad: 96,05 frente a 16,51. Cierran exactos.
- [ ] Sigo bajando: vuelve el navy y entran las comparativas territorial y bursátil.
- [ ] Leo la conclusión: incluye la frase tal como está en el dossier, sin arreglar.
- [ ] Desactivo WebGL en el navegador y recargo: veo la imagen estática con las tres cifras.
- [ ] Activo «reducir movimiento»: veo todo el contenido del acto, sin canvas.
- [ ] `npm run build`: el chunk de entrada no contiene `three`.

---

## 12. Deuda explícita (registrar al implementar)

### 12.1 E2E — La escena día→noche

- Historia: como visitante, recorro el acto III y veo caer la noche sobre ambos países mientras los
  contadores cierran en sus valores reales.
- Detectada en: este doc §7 fase D. Sin E2E en v1 (perfil §3).

### 12.2 E2E — Fallback sin WebGL

- Historia: como visitante en un dispositivo sin WebGL, recibo el mismo contenido del acto III en
  forma estática.
- Detectada en: este doc §7 fase C.

### 12.3 Errata E-02 — frase incompleta en la conclusión

- «…la geografía global mantiene a Argentina fuera de riesgo una asimetría territorial única…»
  Falta una conjunción o un verbo. Se reproduce literal por I1; la redacción correcta es decisión
  del cliente.
- Detectada en: `content/08-notas-editoriales.md` E-02.

### 12.4 Licencia de la imagen satelital

- La textura nocturna deriva de `p09-X36.png`, de estética compatible con *Earth at Night* de la
  NASA. Verificar procedencia y forma de atribución antes de publicar.
- Detectada en: `content/04-assets-visuales.md` §Nota sobre derechos.

### 12.5 Rendimiento de la escena en gama media

- La escena se optimiza para escritorio. Falta medir en portátiles con gráfica integrada y decidir
  el umbral por debajo del cual se sirve directamente el fallback.
- Detectada en: este doc §3.6.

---

## 13. Referencias de código (pre-feature)

| Área | Rutas |
|------|-------|
| Contenido literal del acto III | `content/secciones/03-estado-de-derecho.md` |
| Cifras territoriales y bursátiles | `content/03-datos-y-tablas.md` |
| Imagen satelital de origen | `public/assets-origen/p09-X36.png` |
| Notas de derechos sobre la imagen | `content/04-assets-visuales.md` |
| Frase incompleta de la conclusión | `content/08-notas-editoriales.md` E-02 |
| Motor, `<Scene>` y primitivas | `src/motion/`, `src/components/` (documento 00) |
| Patrón de escena anclada | `src/scenes/02-seguridad-global/` (documento 02) |

---

## 14. Orden de trabajo sugerido en el branch

```text
main
  Fase A  → lógica pura: contadores con cierre exacto, cifras, coreografía
  Fase B  → comparativas estáticas y accesibles, <PairedComparison> reutilizable
  Fase C  → escena WebGL día→noche con su fallback y su chunk aislado
  Fase D  → enlace scroll ↔ escena: uniforms, contadores, control del fondo
  Fase E  → docs + deuda + gates
```

Dependencias duras: todo requiere los documentos 00, 01 y 02 cerrados. C necesita las cifras de A
para su fallback; D necesita la coreografía de A y el canvas de C. B es independiente de C y puede
adelantarse. E es siempre la última.

---

*Documento vivo de implementación. Actualizar los checkboxes del DoD y el estado del encabezado
al cerrar cada fase.*

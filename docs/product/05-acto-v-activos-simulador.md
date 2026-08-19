# Acto V — Los activos y el simulador de proyección

**Estado:** especificación canónica (decisiones cerradas 2026-08-17). Pendiente de implementación.
**Branch de trabajo:** el HEAD actual del worktree.
**Perfil de proyecto:** [`agent-docs/goal-profile.md`](../../agent-docs/goal-profile.md) — invariantes §7 aplicables: I1, I3, I4, I5, I7, I9.
**Roadmap:** [`roadmap.md`](roadmap.md) §2, fila 05.
**Relacionado:** [`00-fundacion-sistema-diseno.md`](00-fundacion-sistema-diseno.md) (motor, primitivas, `<Disclaimer>`) · [`03-acto-iii-asimetria-territorial.md`](03-acto-iii-asimetria-territorial.md) (`src/lib/counter.ts`, `<PairedComparison>`) · [`04-acto-iv-marco-legal-garantias.md`](04-acto-iv-marco-legal-garantias.md) (`<GuaranteeCards>`, patrón de disclaimer en línea). **No reimplementar** ninguno.

Manda sobre el acto V: qué vende exactamente OPTIMVS y con qué se puede jugar. Es la sección más
corta del dossier y la más importante comercialmente, y la única con lógica de cálculo real.

| Referencia | Tema | Resumen v1 |
|------------|------|------------|
| **roadmap §2 fila 05** | Acto V | Los tres vehículos de inversión y un simulador de proyección donde el visitante mueve capital, horizonte y escenario y ve el resultado, con el CTA llevando el vehículo elegido al formulario. |

---

## 1. Contexto del software actual (punto de partida)

### 1.1 Fundación y actos previos disponibles

| Pieza | Ubicación | Comportamiento |
|-------|-----------|----------------|
| Motor de movimiento | `src/motion/` | `useGsapScene`, `<Scene>`, `useReducedMotionSafe` |
| Primitivas | `src/components/` | `<CountUp>`, `<StatFigure>`, `<DualFigure>`, `<Disclaimer>`, `<ActSeal>`, `<GuaranteeCards>` |
| Contadores con cierre exacto | `src/lib/counter.ts` | Documento 03 |
| Formato de cifras | `src/lib/format.ts` | Documento 00; se amplía con `formatCurrency` en uso real |

**No existe** ningún control de formulario ni ningún gráfico. Este documento introduce ambos.

### 1.2 Contenido de origen

| Pieza | Ubicación | Estado |
|-------|-----------|--------|
| Acto V completo, literal | `content/secciones/05-nuestra-estrategia.md` | Íntegro: la tabla de tres activos |
| Tabla de activos | `content/03-datos-y-tablas.md` | Reproducción literal |
| Disclaimer y avisos de rendimiento | `content/07-legal-y-disclaimers.md` | Tabla de afirmaciones del acto V |
| Importe mínimo de inversión | — | **No existe.** Errata E-05 |

**Advertencia central del acto:** «Alta plusvalía», «excelente rentabilidad», «crecimiento
sustancial» y «retornos optimizados» son afirmaciones de rendimiento sin cifra ni horizonte. Esta
es la sección de mayor exposición legal del sitio.

---

## 2. Decisiones cerradas (no reabrir en v1)

### 2.1 Comunes

| # | Tema | Decisión |
|---|------|----------|
| C1 | Idioma | Español de España. «Al pozo» lleva glosa obligatoria: es término argentino y el lector es español. |
| C2 | Tests | Los tres obligatorios del perfil §5, más axe. **El motor de proyección es lógica pura y entra de lleno en el gate de cobertura de `src/lib/`**: es el único código del sitio donde un error produce una cifra falsa. |
| C3 | Zonas protegidas | No se toca `content/`. Este documento autoriza crear `src/scenes/05-activos-simulador/` y `src/lib/projection.ts`. |
| C4 | Invariantes | I1, I3, I4, I5, **I7 (obligatorio y reforzado: toda cifra del simulador va acompañada de disclaimer)**, I9. |
| C5 | Simulador ≠ asesoramiento | El simulador es una **herramienta ilustrativa**, no una proyección de rendimiento de un producto. Esta distinción determina todo su diseño: ver §2.4. |

### 2.2 Los tres vehículos

| # | Tema | Decisión |
|---|------|----------|
| F1 | Los tres | Bienes raíces / inmuebles · Acciones y títulos locales · Proyectos de desarrollo (al pozo). Literales de la tabla del dossier. |
| F2 | Presentación | Tres tarjetas en fila en escritorio. **Nunca** tabla con scroll horizontal. Cada tarjeta repite dentro las etiquetas «Ventaja estratégica» y «Perfil de rendimiento»: en móvil no puede depender de una cabecera de tabla lejana. |
| F3 | Glosa de «al pozo» | Obligatoria, como inciso visible o `<abbr>` con explicación: «compra en fase temprana de obra». |
| F4 | Suelo mínimo y sin techo | Es un diferencial real frente a la banca privada y merece tratamiento propio, no ir escondido en la entradilla. Se presenta como bloque destacado. |
| F5 | Importe mínimo | **No se publica ninguna cifra.** El dossier no la da (E-05). Se renderiza `<PendingValue>` con la explicación de que se determina en la sesión de diagnóstico según el activo. Nunca un importe plausible (I1, I2). |
| F6 | CTA por tarjeta | Cada vehículo enlaza al formulario **con su tipo preseleccionado**. Es lo que cualifica el lead automáticamente y lo consume el documento 06. |
| F7 | Iconografía | Trazo lineal: inmueble, gráfico bursátil, grúa con plano. Consistente con los actos previos. |

### 2.3 El simulador de proyección

| # | Tema | Decisión |
|---|------|----------|
| S1 | Propósito | Que el visitante se vea dentro del producto. Es la interacción más pedida en captación inmobiliaria internacional y el mayor generador de tiempo en página. |
| S2 | Entradas | Tres: **capital inicial** (deslizador con entrada numérica), **horizonte** en años (deslizador 1–15) y **escenario** (conservador / base / favorable). Nada más: cada entrada extra reduce el uso. |
| S3 | Salidas | Valor proyectado al final del horizonte, plusvalía acumulada, y —solo en el vehículo inmobiliario— renta por alquiler acumulada. Todo en dólares, la divisa del mercado según el dossier. |
| S4 | Modelo de cálculo | Interés compuesto anual sobre una tasa por escenario y vehículo, más renta anual constante en el vehículo inmobiliario. Determinista, sin aleatoriedad, sin simulación de Montecarlo: una función que el visitante pueda entender es más honesta que una que parezca científica. |
| S5 | Origen de las tasas | **El dossier no da ninguna tasa.** Las tasas del simulador son **supuestos declarados**, no proyecciones de OPTIMVS. Viven en `src/lib/projection-assumptions.ts` con su justificación, y el simulador las **muestra al usuario** junto al resultado. Sin esto, el simulador afirma rendimientos que nadie ha respaldado (I1, I7). |
| S6 | Etiquetado | El resultado se rotula siempre como «Escenario ilustrativo», nunca como «Proyección de rentabilidad» ni «Rendimiento esperado». |
| S7 | Disclaimer | `<Disclaimer variant="inline">` adherido al resultado, **no** en un pie desplazado. Visible sin hacer scroll desde la cifra. Es requisito de I7 y de `content/07-legal-y-disclaimers.md`. |
| S8 | Gráfico | Curva de evolución año a año en SVG propio. Sin librería de gráficos: una serie de 15 puntos no justifica una dependencia, y el control sobre la accesibilidad es mayor. |
| S9 | Tabla equivalente | Bajo el gráfico, la tabla año a año con los mismos valores. Es la alternativa accesible obligatoria (I4) y además es lo que un inversor quiere copiar. |
| S10 | Modo scroll | Además de los deslizadores, el horizonte avanza automáticamente con el scroll en un tramo de la escena: el visitante ve la curva crecer sin tocar nada, y luego toma el control. El scroll no sustituye a los controles: los precede. |
| S11 | Persistencia | Los valores del simulador se conservan al navegar dentro de la sesión y viajan al formulario del documento 06 como contexto del lead. Sin `localStorage`: solo estado en memoria. |

### 2.4 Límites del simulador (lo que impide que sea asesoramiento)

| # | Tema | Decisión |
|---|------|----------|
| E1 | Sin datos personales | El simulador no pide edad, patrimonio, situación fiscal ni objetivos. Pedirlos lo convertiría en una recomendación personalizada, que es actividad reservada. |
| E2 | Sin recomendación | No dice «le conviene», no ordena los vehículos por atractivo, no marca ninguno como recomendado. |
| E3 | Supuestos visibles | La tasa aplicada, el escenario y el modelo se muestran junto al resultado, siempre (S5). |
| E4 | Sin garantía | El resultado nunca se presenta como esperable ni garantizado. Etiqueta de S6 y disclaimer de S7, ambos obligatorios. |
| E5 | Sin comparación con productos | No se compara con depósitos, fondos ni con el IBEX. Eso sería publicidad comparativa de producto financiero. |

### 2.5 Fondo y cierre

| # | Tema | Decisión |
|---|------|----------|
| D1 | Fondo del acto | Marfil `#F7F5F0` heredado del acto IV: el tramo luminoso del relato continúa. El simulador es la parte más clara y más «producto» del sitio. |
| D2 | CTA de cierre | «Reservar sesión privada» con el vehículo y los valores del simulador como contexto (F6, S11). |

---

## 3. Motor de proyección — Especificación de implementación

### 3.1 Objetivo de negocio

Un visitante que ha movido un deslizador y ha visto una cifra ya se ha imaginado dentro del
producto. Es el paso previo a reservar. El motor tiene que ser correcto y honesto: una cifra mal
calculada en una web de inversión no es un fallo de UI, es un problema.

### 3.2 Modelo de datos

`src/lib/projection.ts` — sin React, sin DOM:

```ts
type Scenario = "conservative" | "base" | "favourable"
type VehicleId = "real-estate" | "equities" | "development"

type ProjectionInput = {
  capital: number        // USD, > 0
  years: number          // entero, 1..15
  scenario: Scenario
  vehicle: VehicleId
}

type ProjectionYear = {
  year: number           // 1..years
  value: number          // valor del capital al cierre del año
  gain: number           // plusvalía acumulada
  rentalIncome: number   // renta acumulada; 0 salvo en real-estate
}

type ProjectionResult = {
  series: ProjectionYear[]
  finalValue: number
  totalGain: number
  totalRentalIncome: number
  assumptions: AppliedAssumptions   // se MUESTRA al usuario (S5, E3)
}
```

`src/lib/projection-assumptions.ts`:

| Campo | Tipo | Notas |
|-------|------|-------|
| `annualRate` | `Record<VehicleId, Record<Scenario, number>>` | Supuesto declarado, no dato del dossier |
| `annualRentalYield` | `Record<VehicleId, number>` | Solo `real-estate` distinto de 0 |
| `rationale` | `string` | Texto que se muestra al usuario explicando de dónde sale cada supuesto |
| `disclaimer` | `string` | Advertencia de que son supuestos ilustrativos |

Las tasas concretas las fija el implementador de forma conservadora y **claramente declarada**;
no se toman del dossier porque el dossier no las da (S5).

### 3.3 Algoritmo canónico (pseudocódigo)

```text
project(input):
  validar(input):
    si capital <= 0                       -> error RangeError
    si capital no es finito               -> error RangeError
    si years no es entero                 -> error RangeError
    si years < 1 o years > 15             -> error RangeError
    si scenario no esta en el enum        -> error RangeError
    si vehicle no esta en el enum         -> error RangeError

  rate       := assumptions.annualRate[vehicle][scenario]
  rentYield  := assumptions.annualRentalYield[vehicle]      # 0 salvo real-estate

  series     := []
  value      := capital
  rentAcum   := 0

  para year de 1 hasta years:
    value    := value * (1 + rate)
    rentAcum := rentAcum + capital * rentYield              # renta sobre capital inicial,
                                                            # NO sobre valor revalorizado
    series.push({
      year,
      value:        redondear2(value),
      gain:         redondear2(value - capital),
      rentalIncome: redondear2(rentAcum),
    })

  devolver {
    series,
    finalValue:         ultimo(series).value,
    totalGain:          ultimo(series).gain,
    totalRentalIncome:  ultimo(series).rentalIncome,
    assumptions:        { rate, rentYield, scenario, vehicle, rationale },
  }
```

_Decisión explícita: la renta se calcula sobre el **capital inicial**, no sobre el valor
revalorizado. Es el supuesto más conservador y el más fácil de explicar. Queda documentado en
`rationale` y se muestra al usuario._

_Un solo helper. Prohibido calcular una proyección en un componente._

### 3.4 Superficies a unificar

| Punto | Fichero | Nota |
|-------|---------|------|
| Cálculo de proyección | `src/lib/projection.ts` | Función pura; **único** lugar de cálculo |
| Supuestos y su justificación | `src/lib/projection-assumptions.ts` | Se muestran al usuario, no se esconden |
| Formato de moneda | `src/lib/format.ts` | `formatCurrency`; del documento 00 |
| Estado del simulador | `src/scenes/05-activos-simulador/useSimulator.ts` | Hook; entra en el gate de cobertura |
| Disclaimer | `src/components/Disclaimer.tsx` | Del documento 00; no se duplica |

### 3.5 Migración / recálculo de datos existentes

`No aplica`.

### 3.6 Casos límite

- **Capital 0 o negativo:** `RangeError`. La interfaz lo impide con el deslizador, pero el motor
  no confía en la interfaz.
- **Horizonte fuera de 1–15 o no entero:** `RangeError`.
- **Capital enorme (10^12):** el cálculo sigue siendo finito y el formato no revienta; la interfaz
  acota el deslizador a un máximo razonable.
- **Vehículo sin renta:** `rentalIncome` es exactamente 0 en toda la serie, no `undefined` ni `NaN`.
- **Redondeo:** a dos decimales en cada año, no al final. Es lo que hace que la tabla y el gráfico
  muestren los mismos números que la suma.
- **Escenario cambiado a mitad de la animación de scroll:** la serie se recalcula íntegra; no se
  mezclan años de dos escenarios.
- **Movimiento reducido:** el simulador funciona igual con los deslizadores. Solo desaparece el
  avance automático del horizonte con el scroll (S10). El contenido es idéntico.
- **Deslizador con teclado:** flechas mueven de uno en uno, `Page Up`/`Page Down` de cinco en cinco,
  `Home`/`End` a los extremos. Requisito de accesibilidad de un `slider`.

### 3.7 API de componentes (contrato de props)

| Componente | Props |
|------------|-------|
| `<Act5Scene>` | ninguna — lee su `content.ts` |
| `<VehicleCards>` | `vehicles: Vehicle[], onSelect: (id: VehicleId) => void` (F2, F6) |
| `<Simulator>` | `initialVehicle: VehicleId` |
| `<CapitalSlider>` | `value, min, max, step, onChange` — con entrada numérica asociada |
| `<HorizonSlider>` | `value, min: 1, max: 15, onChange` |
| `<ScenarioToggle>` | `value: Scenario, onChange` — grupo de radio, no `<select>` |
| `<ProjectionChart>` | `series: ProjectionYear[], highlightYear?: number` — SVG propio (S8) |
| `<ProjectionTable>` | `series: ProjectionYear[]` — alternativa accesible (S9, I4) |
| `<AssumptionsPanel>` | `assumptions: AppliedAssumptions` — siempre visible (S5, E3) |
| `<Disclaimer>` | `variant: "inline"` — adherido al resultado (S7) |

### 3.8 Tests golden Simulador (mínimos)

Prefijo estable **`SIM`**.

| ID | Escenario | Esperado |
|----|-----------|----------|
| SIM-01 | `project` con capital 100.000, 10 años, escenario base, inmobiliario | Serie de exactamente 10 elementos, con `year` de 1 a 10 |
| SIM-02 | `project` con la misma entrada dos veces | Resultado idénticamente igual: la función es determinista, sin aleatoriedad |
| SIM-03 | `project` con capital 0, negativo, `NaN` o `Infinity` | `RangeError` en los cuatro casos |
| SIM-04 | `project` con `years` = 0, 16, 1.5 o `NaN` | `RangeError` en los cuatro casos |
| SIM-05 | `project` con escenario o vehículo fuera del enum | `RangeError` |
| SIM-06 | `project` en vehículo sin renta | `rentalIncome` es exactamente 0 en toda la serie; nunca `undefined` ni `NaN` |
| SIM-07 | `project` en el vehículo inmobiliario | La renta acumulada crece linealmente sobre el capital **inicial**, no sobre el valor revalorizado (§3.3) |
| SIM-08 | `project` con los tres escenarios y la misma entrada | El valor final es estrictamente creciente de conservador a base a favorable |
| SIM-09 | Serie de cualquier proyección | `gain[n]` es exactamente `value[n] − capital` en todos los años |
| SIM-10 | Serie de cualquier proyección | Todos los valores están redondeados a dos decimales |
| SIM-11 | Simulador renderizado | `<AssumptionsPanel>` está visible con la tasa aplicada y su justificación (S5, E3) |
| SIM-12 | Simulador renderizado | `<Disclaimer variant="inline">` está adherido al resultado, no en el pie (S7, I7) |
| SIM-13 | Resultado renderizado | Rotulado como «Escenario ilustrativo»; no aparecen «rendimiento esperado» ni «rentabilidad garantizada» (S6, E4) |
| SIM-14 | Simulador renderizado | La tabla año a año está en el DOM con los mismos valores que el gráfico (S9, I4) |
| SIM-15 | Deslizadores con teclado | Flechas, `Page Up`/`Page Down`, `Home` y `End` operan el valor; el rol y los valores ARIA son correctos |
| SIM-16 | Simulador con `prefers-reduced-motion` | Los deslizadores funcionan igual; solo desaparece el avance automático del horizonte |
| SIM-17 | Escena con axe | Cero violaciones `critical` y `serious` |
| SIM-18 | Cambio de escenario a mitad de animación | La serie se recalcula íntegra; ningún año conserva el escenario anterior |
| SIM-19 | Simulador renderizado | No se solicita ningún dato personal: ni edad, ni patrimonio, ni situación fiscal (E1) |
| SIM-20 | Simulador renderizado | Ningún vehículo se marca como recomendado ni se ordena por atractivo (E2) |

SIM-11, SIM-12, SIM-13, SIM-19 y SIM-20 son obligatorios: son los cinco tests que mantienen el
simulador del lado de la herramienta ilustrativa y fuera del de la recomendación personalizada.

---

## 4. Los tres vehículos — Especificación de implementación

### 4.1 Objetivo de negocio

Es la sección más corta del dossier y la más importante comercialmente: qué se puede comprar
exactamente. Debe poder leerse aislada y entenderse sin el resto del documento.

### 4.2 Modelo de datos

`src/scenes/05-activos-simulador/content.ts`:

```ts
type Vehicle = {
  id: VehicleId
  name: string          // literal: "Bienes raíces / inmuebles"
  advantage: string     // literal, columna "Ventaja estratégica"
  performance: string   // literal, columna "Perfil de rendimiento"
  glossary?: string     // glosa de "al pozo" (F3)
  icon: VehicleIcon
}
```

| Campo | Tipo | Origen |
|-------|------|--------|
| `act` | `5` | |
| `title` | `string` | «Nuestra estrategia» |
| `intro` | `string` | Entradilla literal |
| `vehicles` | `[Vehicle, Vehicle, Vehicle]` | Tabla literal del dossier |
| `entryFloor` | `{ note: string; debtId: "E-05" }` | Suelo mínimo, sin cifra (F5) |
| `cta` | `{ label, href }` | D2 |

### 4.3 Flujo UX

Entradilla → bloque destacado de «suelo mínimo, sin techo» → tres tarjetas → simulador → CTA.
El simulador arranca con el vehículo inmobiliario preseleccionado por ser el de entrada más común;
elegir una tarjeta lo cambia y desplaza el foco al simulador.

### 4.4 API (orientativa)

| Componente | Props |
|------------|-------|
| `<VehicleCards>` | `vehicles, selectedId, onSelect` |
| `<EntryFloorNote>` | `note: string, debtId: string` |

### 4.5 UI

- Tres tarjetas en fila; en móvil apiladas con sus etiquetas internas repetidas (F2).
- «Al pozo» con glosa visible (F3).
- Bloque de «suelo mínimo, sin techo» con tratamiento propio (F4), y `<PendingValue>` donde iría
  el importe (F5).
- Cada tarjeta con enlace al simulador y al formulario con su vehículo preseleccionado (F6).
- Iconos de trazo lineal coherentes con los actos previos (F7).

### 4.6 Tests golden Vehículos (mínimos)

Prefijo estable **`VEH`**.

| ID | Escenario | Esperado |
|----|-----------|----------|
| VEH-01 | Tarjetas renderizadas | Los tres vehículos con su ventaja y su perfil, literales del dossier (I1) |
| VEH-02 | Tarjeta de proyectos de desarrollo | Contiene la glosa de «al pozo» (F3) |
| VEH-03 | Bloque de suelo de entrada | Renderiza `<PendingValue>`; **no** aparece ninguna cifra de importe mínimo (F5, I2) |
| VEH-04 | Selección de una tarjeta | El simulador cambia a ese vehículo y el foco se desplaza a él |
| VEH-05 | CTA de una tarjeta | Lleva al formulario con el vehículo como contexto (F6) |
| VEH-06 | Tarjetas en viewport estrecho | Cada tarjeta repite sus etiquetas internas; sin scroll horizontal (F2) |
| VEH-07 | Sección con axe | Cero violaciones `critical` y `serious` |
| VEH-08 | Regresión: actos previos | Los actos I a IV siguen funcionando con el acto V montado |

---

## 5. Seguridad, permisos y aislamiento

- **I7 reforzado:** toda cifra producida por el simulador va acompañada del disclaimer en línea y
  de los supuestos aplicados. Verificado por SIM-11 y SIM-12. Es la sección de mayor exposición
  legal del sitio.
- **E1, SIM-19:** el simulador no recoge ni un dato personal. No hay tratamiento de datos en esta
  superficie, y por tanto no hay base legal que documentar aquí.
- **I1:** ni el texto de los vehículos ni el importe mínimo se inventan. Las tasas del simulador son
  supuestos declarados y etiquetados como tales, nunca proyecciones atribuidas a OPTIMVS.
- **I4:** la tabla año a año está siempre en el DOM. El SVG del gráfico lleva `aria-hidden`.
- **I9:** sin WebGL. El gráfico es SVG propio; sin librería de gráficos (S8).
- **S11:** el estado del simulador vive en memoria. Sin `localStorage`, sin cookies: coherente con
  el argumentario de privacidad del sitio.

---

## 6. Textos de interfaz (claves orientativas)

| Clave | ES |
|-------|-----|
| `act5.entryFloorTitle` | Suelo de inversión mínimo. Sin techo. |
| `act5.simulatorTitle` | Escenario ilustrativo |
| `act5.capitalLabel` | Capital inicial |
| `act5.horizonLabel` | Horizonte |
| `act5.horizonUnit` | años |
| `act5.scenarioLabel` | Escenario |
| `act5.scenarioConservative` | Conservador |
| `act5.scenarioBase` | Base |
| `act5.scenarioFavourable` | Favorable |
| `act5.finalValue` | Valor proyectado |
| `act5.totalGain` | Plusvalía acumulada |
| `act5.rentalIncome` | Renta acumulada |
| `act5.assumptionsTitle` | Supuestos aplicados |
| `act5.assumptionsNote` | Estos supuestos son ilustrativos y no constituyen una previsión de rentabilidad. |
| `act5.tableCaption` | Evolución año a año del escenario ilustrativo |
| `act5.pozoGloss` | Compra en fase temprana de obra |
| `act5.entryFloorPending` | El importe de entrada se determina en la sesión de diagnóstico según el activo. |

---

## 7. Plan de implementación (fases)

### Fase A — Motor de proyección

1. `src/lib/projection.ts` con `project` según §3.3, incluida toda la validación.
2. `src/lib/projection-assumptions.ts` con las tasas, su justificación y su advertencia (S5).
3. `formatCurrency` en `src/lib/format.ts`, si no estaba ya en uso real.
4. `useSimulator` en `src/scenes/05-activos-simulador/useSimulator.ts`.
5. Tests SIM-01 a SIM-10, SIM-18.

**DoD fase A:** el motor es determinista y rechaza toda entrada inválida con `RangeError`; la renta
se calcula sobre el capital inicial (SIM-07); `gain` cuadra con `value − capital` en todos los años
(SIM-09). **Cobertura de `src/lib/projection.ts` ≥ 80 % en las cuatro métricas** — es el gate más
importante de este documento.

### Fase B — Los tres vehículos

1. `content.ts` con los tres vehículos, literales del dossier.
2. `<VehicleCards>` con etiquetas internas repetidas y glosa de «al pozo» (F2, F3).
3. `<EntryFloorNote>` con `<PendingValue>` (F4, F5).
4. Iconos de trazo lineal (F7).
5. Registro de la escena en `src/app/sections.ts`.
6. Tests VEH-01 a VEH-03, VEH-06, VEH-07.

**DoD fase B:** los tres vehículos se leen completos y literales; no aparece ninguna cifra de
importe mínimo; en viewport estrecho las tarjetas se apilan sin scroll horizontal.

### Fase C — Simulador interactivo

1. `<CapitalSlider>`, `<HorizonSlider>` y `<ScenarioToggle>`, todos operables con teclado (SIM-15).
2. `<ProjectionChart>` en SVG propio, con `aria-hidden` (S8).
3. `<ProjectionTable>` año a año (S9, I4).
4. `<AssumptionsPanel>` siempre visible (S5, E3).
5. `<Disclaimer variant="inline">` adherido al resultado (S7).
6. Etiquetado de S6 y verificación de E1, E2.
7. Tests SIM-11 a SIM-15, SIM-17, SIM-19, SIM-20, VEH-04, VEH-05.

**DoD fase C:** el simulador es completamente operable con teclado; los supuestos y el disclaimer
acompañan siempre al resultado; no se pide ningún dato personal; ningún vehículo aparece como
recomendado.

### Fase D — Modo scroll y cierre

1. Anclaje y scrub con `useGsapScene`; altura `450vh`.
2. Avance automático del horizonte en un tramo de la escena, con la curva creciendo (S10).
3. Traspaso del control a los deslizadores al terminar el tramo.
4. Persistencia en memoria del estado del simulador hacia el formulario (S11).
5. CTA de cierre con vehículo y valores como contexto (D2) y `<ActSeal>` de transición al acto VI.
6. Tests SIM-16, VEH-08.

**DoD fase D:** la curva crece sola durante un tramo del scroll y después el visitante toma el
control sin salto; con movimiento reducido el simulador funciona igual, solo sin el avance
automático.

### Fase E — Cierre documental y gates globales

1. Marcar el DoD de §8 y la fila 05 del roadmap como «hecho en branch».
2. Registrar en `docs/debt/technical-debt.md` las filas de §12, incluidas E-05 (importe mínimo) y
   la validación de los supuestos del simulador por parte del cliente.
3. Ejecutar todos los gates del perfil §5, con atención a la cobertura de `src/lib/projection.ts`.
4. Limpieza residual: supuestos huérfanos, iconos no usados.

**DoD fase E:** los cinco gates del perfil §5 en verde. Cobertura de la lógica pura por encima del
umbral, sin exclusiones añadidas.

---

## 8. Criterios de aceptación (DoD)

### 8.1 Motor de proyección

- [ ] `project` es determinista y sin aleatoriedad.
- [ ] Rechaza toda entrada inválida con `RangeError`, sin confiar en la interfaz.
- [ ] La renta se calcula sobre el capital inicial y así se documenta al usuario.
- [ ] `gain` cuadra con `value − capital` en todos los años.
- [ ] Todos los valores están redondeados a dos decimales.
- [ ] Cobertura de `src/lib/projection.ts` ≥ 80 % en las cuatro métricas.

### 8.2 Simulador y vehículos

- [ ] Tres entradas y no más: capital, horizonte y escenario.
- [ ] Los supuestos aplicados se muestran siempre junto al resultado.
- [ ] El disclaimer en línea está adherido al resultado, no en el pie.
- [ ] El resultado se rotula como escenario ilustrativo.
- [ ] La tabla año a año está en el DOM con los mismos valores que el gráfico.
- [ ] Todos los controles son operables con teclado, con roles y valores ARIA correctos.
- [ ] No se pide ningún dato personal ni se recomienda ningún vehículo.
- [ ] Los tres vehículos son literales y «al pozo» lleva glosa.
- [ ] No aparece ninguna cifra de importe mínimo de inversión.
- [ ] Los veinte tests SIM-01…SIM-20 y los ocho VEH-01…VEH-08 existen y pasan.

### 8.3 Global

- [ ] `docs/product/roadmap.md` fila 05 actualizada a «hecho en branch».
- [ ] Lo no cubierto → filas honestas en `docs/debt/technical-debt.md`.
- [ ] Se respetan el idioma y la política de comentarios del perfil §1.
- [ ] No se modificó ninguna zona protegida del perfil §6 sin autorización de C3.
- [ ] Todos los gates del perfil §5 en verde, ejecutados de verdad.
- [ ] Ningún invariante del perfil §7 roto en la superficie tocada.

---

## 9. Fuera de alcance (v1)

| Ítem | Notas |
|------|-------|
| Publicación de un importe mínimo de inversión | Errata E-05: el dossier no lo da; lo aporta el cliente |
| Listado de activos concretos con precios | El cliente no ha facilitado inventario |
| Simulación de Montecarlo o bandas de confianza | S4: parecer científico sin datos reales es peor que ser simple y honesto |
| Comparación con depósitos, fondos o el IBEX | E5: sería publicidad comparativa de producto financiero |
| Cálculo del efecto fiscal del CDI sobre el resultado | Requiere supuestos fiscales personales; sería asesoramiento |
| Guardar escenarios o enviarlos por correo | Documento 06 lleva los valores al formulario; guardar exige backend |
| Página de detalle por vehículo | Documento 07 |
| Adaptación móvil del simulador | Documento 08, incluido el comportamiento táctil de los deslizadores |

---

## 10. Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| El simulador se lee como una promesa de rentabilidad de OPTIMVS | S5, S6, S7 + SIM-11, SIM-12, SIM-13: supuestos visibles, etiqueta de escenario ilustrativo y disclaimer adherido |
| Las tasas del simulador acaban pareciendo dato del dossier | S5: viven en un fichero de supuestos con justificación, y se muestran al usuario; registrado en deuda para validación del cliente |
| Un error de cálculo produce una cifra falsa en una web de inversión | C2 + cobertura ≥ 80 % sobre `src/lib/projection.ts` + veinte tests golden, incluidos los de cuadre (SIM-09) |
| El simulador deriva hacia asesoramiento personalizado al añadir campos | E1 + SIM-19: ningún dato personal, verificado por test que fallará si alguien añade un campo de edad o patrimonio |
| Alguien inventa un importe mínimo plausible para no dejar el hueco | F5 + VEH-03 + I2: el test falla si aparece una cifra |
| El gráfico es inaccesible y la cifra solo existe dentro del SVG | S9 + SIM-14 + I4: tabla año a año siempre en el DOM |
| Los deslizadores solo funcionan con ratón | SIM-15 verifica flechas, `Page Up`/`Page Down`, `Home` y `End` |
| El avance automático con scroll pelea con el control manual y da saltos | S10: el scroll precede al control, no compite; el traspaso se verifica en §11 |
| Redondear solo al final descuadra la tabla respecto al gráfico | Redondeo a dos decimales por año (§3.6) + SIM-10 |

---

## 11. Casos de prueba mínimos (checklist de revisión)

- [ ] Llego al acto V y leo los tres vehículos completos, con «al pozo» explicado.
- [ ] Busco el importe mínimo: veo un marcador que explica que se determina en la sesión, no una cifra.
- [ ] Sigo bajando: la curva del simulador crece sola mientras hago scroll.
- [ ] Al terminar el tramo, tomo el control de los deslizadores sin ningún salto.
- [ ] Muevo el capital y el horizonte: la cifra y la curva responden.
- [ ] Cambio a escenario conservador: el valor final baja, y la serie entera se recalcula.
- [ ] Junto al resultado veo qué tasa se ha aplicado y por qué.
- [ ] El disclaimer está pegado a la cifra, no escondido en el pie.
- [ ] Leo la tabla año a año: coincide con lo que dibuja el gráfico.
- [ ] Opero los tres controles solo con teclado.
- [ ] Compruebo que en ningún sitio se me pide edad, patrimonio ni situación fiscal.
- [ ] Ningún vehículo aparece marcado como el recomendado.
- [ ] Pulso el CTA de una tarjeta y llego al formulario con ese vehículo ya elegido.

---

## 12. Deuda explícita (registrar al implementar)

### 12.1 E2E — Uso del simulador

- Historia: como visitante, muevo capital, horizonte y escenario, veo el resultado con sus
  supuestos, y llego al formulario con el vehículo elegido.
- Detectada en: este doc §7 fase C. Sin E2E en v1 (perfil §3).

### 12.2 Errata E-05 — importe mínimo de inversión

- El dossier insiste en que el suelo es mínimo pero nunca da cifra. Es probablemente la primera
  pregunta del visitante. Se renderiza un marcador con explicación.
- Detectada en: `content/08-notas-editoriales.md` E-05.

### 12.3 Validación de los supuestos del simulador

- Las tasas de `src/lib/projection-assumptions.ts` son supuestos del implementador, declarados
  como tales. Requieren validación del cliente y, dado el ámbito, revisión de su asesoría legal
  antes de publicar.
- Detectada en: este doc §2.3 S5.

### 12.4 Efecto fiscal del CDI no reflejado en la proyección

- El acto IV explica el mecanismo fiscal y el acto V proyecta valores brutos. La conexión entre
  ambos queda sin hacer porque exigiría datos fiscales personales.
- Detectada en: este doc §9.

---

## 13. Referencias de código (pre-feature)

| Área | Rutas |
|------|-------|
| Contenido literal del acto V | `content/secciones/05-nuestra-estrategia.md` |
| Tabla de activos | `content/03-datos-y-tablas.md` |
| Disclaimer y avisos de rendimiento | `content/07-legal-y-disclaimers.md` |
| Importe mínimo ausente | `content/08-notas-editoriales.md` E-05 |
| Motor y primitivas | `src/motion/`, `src/components/` (documento 00) |
| Contadores y formato | `src/lib/counter.ts` (documento 03), `src/lib/format.ts` (documento 00) |
| Disclaimer en línea | `src/components/Disclaimer.tsx` (documento 00), patrón de uso en el documento 04 |

---

## 14. Orden de trabajo sugerido en el branch

```text
main
  Fase A  → motor de proyección puro, con supuestos declarados y cobertura dura
  Fase B  → los tres vehículos en tarjetas accesibles, sin importe inventado
  Fase C  → simulador interactivo con supuestos, disclaimer y tabla equivalente
  Fase D  → modo scroll, persistencia hacia el formulario y cierre
  Fase E  → docs + deuda + gates
```

Dependencias duras: todo requiere los documentos 00 a 04 cerrados. C necesita el motor de A; D
necesita el simulador de C. B es independiente de A y puede adelantarse. E es siempre la última.

---

*Documento vivo de implementación. Actualizar los checkboxes del DoD y el estado del encabezado
al cerrar cada fase.*

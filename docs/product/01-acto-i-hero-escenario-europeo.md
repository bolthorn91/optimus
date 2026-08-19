# Acto I — Hero y el nuevo escenario europeo

**Estado:** especificación canónica (decisiones cerradas 2026-08-17). Pendiente de implementación.
**Branch de trabajo:** el HEAD actual del worktree.
**Perfil de proyecto:** [`agent-docs/goal-profile.md`](../../agent-docs/goal-profile.md) — invariantes §7 aplicables: I1, I3, I4, I5, I7, I9.
**Roadmap:** [`roadmap.md`](roadmap.md) §2, fila 01.
**Relacionado:** [`00-fundacion-sistema-diseno.md`](00-fundacion-sistema-diseno.md) — **no reimplementar** tokens, primitivas, `useGsapScene`, `<Scene>`, `<RomanNumeral>`, `<CountUp>`, `<StatFigure>` ni el shell. Se reutilizan.

Manda sobre la primera pantalla del sitio y el acto I del relato: el diagnóstico de que el cambio
europeo es estructural. Es la sección que decide si el visitante sigue leyendo.

| Referencia | Tema | Resumen v1 |
|------------|------|------------|
| **roadmap §2 fila 01** | Hero + acto I | Hero a pantalla completa con el titular del dossier, y una escena anclada donde los tres factores convergentes se despliegan con el scroll. |

---

## 1. Contexto del software actual (punto de partida)

### 1.1 Fundación disponible

| Pieza | Ubicación | Comportamiento |
|-------|-----------|----------------|
| Motor de movimiento | `src/motion/` | `MotionProvider`, `useGsapScene`, `useScrollProgress`, `useReducedMotionSafe`, `<Scene>` |
| Primitivas de contenido | `src/components/` | `<RomanNumeral>`, `<DualFigure>`, `<StatFigure>`, `<CountUp>`, `<PullQuote>`, `<Disclaimer>`, `<PendingValue>` |
| Tokens y tipografía | `src/styles/tokens.css`, `src/lib/tokens.ts` | Paleta completa, escala fluida, Cinzel + Inter |
| Manifiesto de secciones | `src/app/sections.ts` | Ya contiene las entradas de los siete actos; este documento puebla las de `hero` y `act-1` |
| Shell | `src/app/` | Navegación, miliario, CTA persistente, footer, error boundary |

**Contrato heredado del documento 00:** la coreografía de una escena es una función pura
`choreograph(progress) → SceneState` en su `timeline.ts`. Ningún componente crea un ScrollTrigger.

### 1.2 Contenido de origen

| Pieza | Ubicación |
|-------|-----------|
| Portada y presentación | `content/secciones/00-hero-portada.md` |
| Acto I completo, literal | `content/secciones/01-nuevo-escenario-europeo.md` |
| Cifra del 14 % del PIB | `content/03-datos-y-tablas.md` §Otros datos económicos |
| Voz, tono y arco narrativo | `content/01-identidad-y-tono.md` |
| Erratas y avisos editoriales | `content/08-notas-editoriales.md` E-08 |

**No existe** ninguna escena montada: la home está vacía bajo el shell.

---

## 2. Decisiones cerradas (no reabrir en v1)

### 2.1 Comunes

| # | Tema | Decisión |
|---|------|----------|
| C1 | Idioma | Español de España, tratamiento de usted. El titular del hero es **literal** del dossier. |
| C2 | Tests | Cada escena exige los tres tests obligatorios del perfil §5 (contenido en el DOM, ruta reducida, limpieza al desmontar) más axe sin violaciones `critical` ni `serious`. Las coreografías, al ser puras, se testean por valores exactos. |
| C3 | Zonas protegidas | No se toca `content/` ni `public/assets-origen/`. Este documento autoriza crear `src/scenes/00-hero/`, `src/scenes/01-escenario-europeo/` y assets derivados en `public/img/`. |
| C4 | Invariantes | I1 (fidelidad literal del texto y del 14 %), I3, I4 (el texto de los tres factores vive en el DOM, no en el canvas), I5, I7 (esta sección no hace afirmaciones de rendimiento, pero el footer del shell ya lleva el disclaimer), I9. |
| C5 | Hero ≠ acto I | Son dos escenas distintas con dos entradas separadas en el manifiesto. El hero es emocional y sin scrub; el acto I es argumental y anclado. No se fusionan. |

### 2.2 Hero

| # | Tema | Decisión |
|---|------|----------|
| F1 | Titular | Literal: «Proteja su patrimonio, su libertad financiera y su integridad ciudadana». Es `h1`, único en la página. Los tres sustantivos —patrimonio, libertad financiera, integridad ciudadana— se destacan tipográficamente dentro de la frase. |
| F2 | Claim | «Inversión estratégica y protección financiera», reproducido en HTML/CSS con el navy `#102135` y el filete de oro del badge original. **No** se usa la imagen `p01-X6.png`: se reconstruye. |
| F3 | Composición | Pantalla completa (100 svh, no vh — evita el salto de la barra de navegador). Logotipo, `h1`, claim, par de CTA e indicador de scroll. |
| F4 | Animación de entrada | `SplitText` por líneas sobre el `h1`, con entrada escalonada y desenfoque que se resuelve. Sin scrub: es una animación de entrada, no de scroll. Duración total ≤ 1,2 s. |
| F5 | Fondo | Navy profundo con una veladura de oro que respira muy lentamente. Sin vídeo de fondo (peso, distracción, y no aporta al argumento). |
| F6 | CTA | Primario «Reservar sesión privada» → ancla a `#contacto`. Secundario «Descargar dossier» → PDF. Texto canónico del documento 00 D3. |
| F7 | Redes sociales | **No** aparecen en el hero: el dossier muestra los iconos pero no facilita ninguna URL (bloqueo B-07). Van al footer cuando el cliente las confirme. |
| F8 | Bloque de presentación | Los tres datos de la página 2 del dossier —Dirigido a / Propuesta / Estructura— como tres tarjetas inmediatamente bajo el hero, dentro de la misma escena. Literales. |

### 2.3 Acto I — El nuevo escenario europeo

| # | Tema | Decisión |
|---|------|----------|
| S1 | Estructura | Escena anclada con scrub. Cuatro tramos: entradilla, y los tres factores. El texto de cada factor entra y sale mientras su ilustración se transforma detrás. |
| S2 | Registro visual | **Abstracto, cartográfico y de dato.** La tensión se construye por composición, densidad y movimiento, no por iconografía literal de amenaza. Ver la nota de §2.5 y el riesgo asociado en §10. |
| S3 | Factor 1 — Transformación demográfica | Un mapa de Europa en trama de puntos donde la densidad se redistribuye: los puntos migran y se acumulan hasta saturar zonas concretas mientras la retícula se deforma. Sin figuras humanas, sin embarcaciones, sin banderas. |
| S4 | Factor 2 — Chat Control | Una retícula de vigilancia que desciende y se cierra sobre el propio texto del factor hasta cuadricularlo, mientras las líneas de la retícula «leen» el párrafo de izquierda a derecha. El texto sigue siendo legible y seleccionable en todo momento (I4). |
| S5 | Factor 3 — Euro Digital | Un billete se desmaterializa en píxeles que se ordenan en una cuadrícula trazable, y cada píxel adquiere un identificador. Es la imagen literal de «cada transacción sujeta a trazabilidad completa». |
| S6 | Cifra ancla | El 14 % del PIB se presenta con `<DualFigure>`: `XIV` decorativo sobre `14 %`, con `<CountUp>` ligado al progreso. Glosa: «del PIB nacional depende del turismo y la oferta de servicios». Fuente citada. |
| S7 | Numeración | El acto se titula «I. El nuevo escenario europeo» con `<RomanNumeral value={1} />`. Los tres factores se numeran `01`, `02`, `03` en arábigo: son elementos de lista, no actos. |
| S8 | Tiempo verbal | Se conserva el texto literal del dossier. La errata E-08 —normas europeas en tramitación descritas en futuro de certeza— se registra como deuda para decisión del cliente, **no** se corrige unilateralmente (I1). |
| S9 | CTA intermedio | Al cierre del acto, un CTA en línea: «Analice su caso con un consultor» → `#contacto`. Es el primer punto del scroll donde el visitante tiene motivo. |
| S10 | Técnica de render | Canvas 2D para la trama de puntos del factor 1; SVG animado para la retícula del factor 2 y la desmaterialización del factor 3. **Sin WebGL en este acto**: no lo necesita, y mantiene ligero el primer tramo del scroll (I9). |

### 2.4 Fondo y transición de acto

| # | Tema | Decisión |
|---|------|----------|
| D1 | Fondo del hero | Navy profundo `#102135`. |
| D2 | Fondo del acto I | Transición de navy profundo a navy medio `#1A2C42` conforme avanza el acto: el escenario se cierra. Se aplica con el mecanismo de fondo por acto del documento 00 (M8), no con clases. |
| D3 | Sello de transición | Entre el hero y el acto I, una marca de laurel que se traza con `DrawSVG` al cruzar el umbral. Es el separador de actos reutilizable por los documentos 02–06. Vive en `src/components/ActSeal.tsx`. |

### 2.5 Registro visual del acto I — decisión y alternativa

| # | Tema | Decisión |
|---|------|----------|
| E1 | Variante elegida | **Abstracta y cartográfica** (S2–S5): densidad, retícula, desmaterialización y dato. |
| E2 | Variante descartada | Iconografía literal de amenaza —embarcaciones migratorias, símbolos de delito, alarmas policiales— pedida en la conversación inicial. Queda registrada aquí, no implementada. |
| E3 | Razón | El público objetivo es el inversor patrimonial conservador, y `content/08-notas-editoriales.md` E-07 ya registra que esta es la sección más contestable del dossier. La variante abstracta transmite la misma tesis con más fuerza visual y menos exposición: es también el registro de la referencia principal del proyecto, spacex.com. |
| E4 | Reversibilidad | La decisión es del cliente. Cambiar de variante afecta solo a los tres módulos de ilustración de `src/scenes/01-escenario-europeo/`; el texto, la estructura y la coreografía no cambian. |

---

## 3. Hero — Especificación de implementación

### 3.1 Objetivo de negocio

En menos de cinco segundos el visitante debe saber quién habla, qué se le propone y qué puede
hacer ahora. La portada del dossier es puramente emocional y la página 2 puramente informativa:
la web las encadena — impacto, luego concreción.

### 3.2 Modelo de datos (contenido tipado)

`src/scenes/00-hero/content.ts`:

| Campo | Tipo | Origen |
|-------|------|--------|
| `headline` | `string` | Literal de `content/secciones/00-hero-portada.md` |
| `headlineEmphasis` | `string[]` | Los tres sustantivos a destacar (F1) |
| `claim` | `string` | «Inversión estratégica y protección financiera» |
| `intro` | `{ label, body }[]` | Los tres datos de la página 2 (F8) |
| `primaryCta` / `secondaryCta` | `{ label, href }` | Textos canónicos del documento 00 D3 |

### 3.3 Algoritmo canónico (pseudocódigo)

Coreografía de entrada del hero — `src/scenes/00-hero/timeline.ts`:

```text
choreographIntro(t):            # t: 0 → 1, tiempo de entrada, NO progreso de scroll
  # 0.00–0.30  el logotipo aparece y se asienta
  logoOpacity   := clamp01(t / 0.30)
  logoY         := lerp(24, 0, ease.out(clamp01(t / 0.30)))

  # 0.15–0.70  las líneas del titular entran escalonadas
  para cada línea i de 0..n-1:
    inicio      := 0.15 + i * 0.10
    p           := clamp01((t - inicio) / 0.35)
    lineOpacity[i] := p
    lineY[i]       := lerp(32, 0, ease.out(p))
    lineBlur[i]    := lerp(8, 0, ease.out(p))

  # 0.55–0.85  el claim
  claimOpacity  := clamp01((t - 0.55) / 0.30)

  # 0.70–1.00  los CTA y el indicador de scroll
  ctaOpacity    := clamp01((t - 0.70) / 0.30)
  hintOpacity   := clamp01((t - 0.85) / 0.15)

  devolver { logoOpacity, logoY, lineOpacity, lineY, lineBlur,
             claimOpacity, ctaOpacity, hintOpacity }
```

Con `prefers-reduced-motion` se aplica `choreographIntro(1)` de una vez: todo visible, sin
transición.

### 3.4 Superficies a unificar

| Punto | Fichero | Nota |
|-------|---------|------|
| Contenido del hero | `src/scenes/00-hero/content.ts` | Único literal; nada suelto en el JSX |
| Coreografía de entrada | `src/scenes/00-hero/timeline.ts` | Función pura |
| Sello de transición de acto | `src/components/ActSeal.tsx` | Reutilizado por los documentos 02–06 |

### 3.5 Migración / recálculo de datos existentes

`No aplica`.

### 3.6 Casos límite

- **Titular largo en viewport bajo:** el `h1` reduce su tamaño con `clamp()` antes de desbordar;
  nunca se recorta ni se hace scroll interno.
- **`SplitText` y el lector de pantalla:** la división en líneas fragmenta el texto en el DOM. Se
  aplica `aria-label` con el titular completo sobre el `h1` y `aria-hidden` sobre los fragmentos,
  para que el lector anuncie una frase y no ocho.
- **Fuente Cinzel aún no cargada:** las métricas de respaldo del documento 00 evitan el
  desplazamiento; la animación de entrada arranca igual.
- **PDF de descarga (5,6 MB):** el CTA secundario indica el peso y nunca inicia la descarga sola.

### 3.7 API de componentes (contrato de props)

| Componente | Props |
|------------|-------|
| `<HeroScene>` | ninguna — lee su `content.ts` |
| `<HeroHeadline>` | `text: string, emphasis: string[], state: HeroState` |
| `<IntroCards>` | `items: { label: string; body: string }[]` |
| `<ActSeal>` | `act: number, progress: number` |

### 3.8 Tests golden Hero (mínimos)

Prefijo estable **`HERO`**.

| ID | Escenario | Esperado |
|----|-----------|----------|
| HERO-01 | Hero renderizado | El `h1` contiene el titular literal del dossier, palabra por palabra |
| HERO-02 | Hero renderizado | Existe un solo `h1` en la página |
| HERO-03 | `choreographIntro` en `t` = 0, 0.5 y 1 | Estados exactos y deterministas; en `t`=1 todas las opacidades valen 1 y todos los desplazamientos 0 |
| HERO-04 | Hero con `prefers-reduced-motion: reduce` | Todo el contenido visible sin animación; ningún ScrollTrigger creado |
| HERO-05 | Titular con `SplitText` aplicado | El `h1` expone el titular completo como texto accesible, no ocho fragmentos sueltos |
| HERO-06 | CTA primario | Texto exacto «Reservar sesión privada» y destino `#contacto` |
| HERO-07 | Hero renderizado | No hay ningún enlace a redes sociales (F7) |
| HERO-08 | Bloque de presentación | Las tres etiquetas «Dirigido a», «Propuesta» y «Estructura» con su contenido literal |
| HERO-09 | Hero con axe | Cero violaciones `critical` y `serious` |
| HERO-10 | Montaje y desmontaje del hero | Cero animaciones vivas tras desmontar |

---

## 4. Acto I — Especificación de implementación

### 4.1 Objetivo de negocio

Instalar la premisa sobre la que descansa todo el argumentario: el cambio europeo es estructural
e irreversible. Sin esta premisa aceptada, ninguna sección posterior funciona.

### 4.2 Modelo de datos (contenido tipado)

`src/scenes/01-escenario-europeo/content.ts`:

| Campo | Tipo | Origen |
|-------|------|--------|
| `act` | `1` | |
| `title` | `string` | «El nuevo escenario europeo» |
| `intro` | `string` | Entradilla literal |
| `factors` | `Factor[]` | Los tres factores |
| `closing` | `string` | Párrafo de cierre literal |
| `stat` | `{ value: 14, unit: "%", label: string, source: string }` | `content/03-datos-y-tablas.md` |
| `cta` | `{ label: "Analice su caso con un consultor", href: "#contacto" }` | S9 |

```ts
type Factor = {
  index: 1 | 2 | 3
  title: string      // literal, p. ej. "Transformación demográfica estructural"
  body: string       // literal
  scope: string      // "Social / demográfico" | "Privacidad / regulatorio" | "Monetario / financiero"
  illustration: "density" | "surveillance" | "dematerialisation"
}
```

### 4.3 Flujo UX y coreografía

Escena anclada, scrub, altura `400vh`. Coreografía en
`src/scenes/01-escenario-europeo/timeline.ts`:

```text
choreographAct1(p):                    # p: 0 → 1, progreso de scroll de la escena
  # 0.00–0.15  entradilla: entra y se mantiene
  introOpacity   := clamp01(p / 0.08)
  introExit      := clamp01((p - 0.12) / 0.05)
  introY         := lerp(0, -40, introExit)

  # tres tramos iguales, uno por factor: [0.18,0.44] [0.44,0.70] [0.70,0.90]
  para cada factor i de 0..2:
    inicio       := 0.18 + i * 0.26
    fin          := inicio + 0.26
    local        := clamp01((p - inicio) / (fin - inicio))
    factorOpacity[i]  := ventana(local, entrada=0.15, salida=0.85)
    factorProgress[i] := local          # alimenta la ilustración correspondiente
    factorY[i]        := lerp(28, -28, local)

  # 0.88–1.00  cifra ancla y cierre
  statProgress   := clamp01((p - 0.88) / 0.08)
  closingOpacity := clamp01((p - 0.92) / 0.08)

  # fondo: de navy profundo a navy medio a lo largo de todo el acto (D2)
  surfaceMix     := ease.inOut(p)

  devolver { introOpacity, introY, factorOpacity, factorProgress, factorY,
             statProgress, closingOpacity, surfaceMix }

ventana(x, entrada, salida):            # sube, se mantiene, baja
  si x < entrada:  devolver x / entrada
  si x > salida:   devolver (1 - x) / (1 - salida)
  devolver 1
```

Cada ilustración recibe **solo** su `factorProgress[i]` — un número entre 0 y 1 — y es
responsable de su propio dibujo. Ninguna conoce el scroll.

### 4.4 API de componentes (contrato de props)

| Componente | Props |
|------------|-------|
| `<Act1Scene>` | ninguna — lee su `content.ts` |
| `<FactorPanel>` | `factor: Factor, opacity: number, y: number` |
| `<DensityIllustration>` | `progress: number` — canvas 2D (S3) |
| `<SurveillanceGrid>` | `progress: number, children: ReactNode` — SVG sobre el texto (S4) |
| `<DematerialisingNote>` | `progress: number` — SVG (S5) |

Las tres ilustraciones comparten firma: `{ progress: number }`. Es el contrato que permite
intercambiar la variante visual de §2.5 sin tocar nada más (E4).

### 4.5 UI

- **Ancho de lectura** de 65–75 caracteres para los párrafos de los factores, pese a que la
  ilustración ocupe toda la pantalla detrás.
- **Numeración de factores** `01`/`02`/`03` en Cinzel, gran tamaño, oro apagado.
- **Cifra ancla** con `<DualFigure>` y `<CountUp>` ligado a `statProgress`; el valor final `14 %`
  está en el DOM desde el primer render (I4).
- **Fuente del dato** visible bajo la cifra, no escondida en un pie diminuto.
- **CTA intermedio** al cierre, con el estilo secundario del sistema de diseño.

### 4.6 Tests golden Acto I (mínimos)

Prefijo estable **`ACT1`**.

| ID | Escenario | Esperado |
|----|-----------|----------|
| ACT1-01 | Escena renderizada | Los títulos y cuerpos literales de los tres factores están en el DOM |
| ACT1-02 | Escena renderizada | El título es «I. El nuevo escenario europeo» con el romano accesible como «1» |
| ACT1-03 | `choreographAct1` en `p` = 0, 0.31, 0.57, 0.83 y 1 | Estados exactos; en cada tramo el factor correspondiente tiene opacidad 1 y los otros dos 0 |
| ACT1-04 | `choreographAct1` monótona en `surfaceMix` | Estrictamente creciente de 0 a 1: el fondo nunca retrocede |
| ACT1-05 | Escena con `prefers-reduced-motion: reduce` | Los tres factores visibles simultáneamente, con todo su texto; ningún ScrollTrigger creado |
| ACT1-06 | Cifra ancla con `statProgress` = 0 | `14 %` presente en el DOM pese al progreso 0 (I4) |
| ACT1-07 | Cifra ancla | El `<DualFigure>` renderiza `XIV` con `aria-hidden` y `14 %` como valor accesible |
| ACT1-08 | Texto bajo `<SurveillanceGrid>` | El párrafo sigue siendo texto seleccionable en el DOM, no una imagen (I4, S4) |
| ACT1-09 | Escena con axe | Cero violaciones `critical` y `serious` |
| ACT1-10 | Montaje y desmontaje | Cero ScrollTriggers vivos; los canvas liberan su bucle de animación |
| ACT1-11 | CTA intermedio | Texto «Analice su caso con un consultor», destino `#contacto` |
| ACT1-12 | Fidelidad de contenido | El texto de los tres factores coincide carácter a carácter con `content/secciones/01-nuevo-escenario-europeo.md` (I1) |
| ACT1-13 | Regresión: shell | La navegación, el miliario y el CTA persistente del documento 00 siguen funcionando con la escena montada |

ACT1-12 es obligatorio: es el test que hace ejecutable el invariante I1 en lugar de dejarlo como
buena intención. ACT1-13 demuestra que montar la primera escena real no rompe la fundación.

---

## 5. Seguridad, permisos y aislamiento

Sin datos de usuario en este acto. Aplica:

- **I4:** todo el texto de los tres factores y la cifra del 14 % están en el DOM. El canvas del
  factor 1 es puramente decorativo y lleva `aria-hidden`.
- **I9:** sin WebGL en este acto (S10). El canvas 2D del factor 1 se detiene cuando la escena sale
  del viewport y libera su `requestAnimationFrame`.
- **I1:** ninguna cifra fuera de `content/03-datos-y-tablas.md`. El 14 % cita su origen.
- Sin peticiones de red, sin cookies, sin analítica en esta superficie.

---

## 6. Textos de interfaz (claves orientativas)

Los textos de contenido son literales del dossier y viven en los `content.ts` de cada escena. Aquí
solo los de interfaz:

| Clave | ES |
|-------|-----|
| `hero.scrollHint` | Desplácese para continuar |
| `hero.downloadNote` | PDF · 5,6 MB |
| `act1.statSource` | Fuente: dossier OPTIMVS, sección I |
| `act1.factorLabel` | Factor |
| `act1.ctaInline` | Analice su caso con un consultor |

---

## 7. Plan de implementación (fases)

### Fase A — Contenido tipado y hero estático

1. `src/scenes/00-hero/content.ts` y `src/scenes/01-escenario-europeo/content.ts` con los
   literales del dossier y sus tipos.
2. `<HeroScene>` estático: composición completa, tipografía, claim reconstruido en CSS (F2),
   CTA, bloque de presentación (F8). Sin animación todavía.
3. `<Act1Scene>` estático: entradilla, tres `<FactorPanel>`, cifra ancla, cierre y CTA. Sin
   animación ni ilustraciones.
4. Registro de ambas escenas en `src/app/sections.ts`.
5. Tests HERO-01, HERO-02, HERO-06, HERO-07, HERO-08, ACT1-01, ACT1-02, ACT1-06, ACT1-07,
   ACT1-11, ACT1-12.

**DoD fase A:** ambas escenas renderizan todo su contenido literal, verificado carácter a carácter
contra `content/` (ACT1-12). La home navega a ellas desde el miliario. Cero violaciones axe.

### Fase B — Animación del hero

1. `choreographIntro` en `timeline.ts` como función pura (§3.3).
2. `SplitText` sobre el `h1` con el tratamiento de accesibilidad de §3.6.
3. Aplicación vía `useGsapScene` sin scrub; veladura de fondo (F5); indicador de scroll.
4. `<ActSeal>` en `src/components/`, trazado con `DrawSVG` (D3).
5. Tests HERO-03, HERO-04, HERO-05, HERO-09, HERO-10.

**DoD fase B:** el hero entra en ≤ 1,2 s; con movimiento reducido todo aparece de golpe sin
ScrollTrigger; el lector de pantalla anuncia el titular como una frase (HERO-05); desmontar deja
cero animaciones vivas.

### Fase C — Escena anclada del acto I

1. `choreographAct1` como función pura, con la ventana de tres tramos (§4.3).
2. Anclaje y scrub con `useGsapScene`; altura `400vh`.
3. Entrada y salida de los tres paneles de texto; cifra ancla ligada a `statProgress`; cierre.
4. Transición de fondo del acto con `surfaceMix` (D2), usando el mecanismo del documento 00.
5. Tests ACT1-03, ACT1-04, ACT1-05, ACT1-13.

**DoD fase C:** el acto se recorre entero con scroll, un factor visible cada vez; el fondo
transiciona sin retroceder; con movimiento reducido los tres factores se ven a la vez y completos;
el shell sigue intacto.

### Fase D — Las tres ilustraciones

1. `<DensityIllustration>` en canvas 2D: redistribución de la trama de puntos (S3), con parada y
   liberación del bucle al salir del viewport.
2. `<SurveillanceGrid>` en SVG: la retícula desciende y recorre el texto sin taparlo (S4).
3. `<DematerialisingNote>` en SVG: desmaterialización en píxeles trazables (S5).
4. Cableado de cada una a su `factorProgress[i]`.
5. Tests ACT1-08, ACT1-09, ACT1-10.

**DoD fase D:** las tres ilustraciones responden al progreso, ninguna tapa ni sustituye texto, el
párrafo bajo la retícula sigue siendo seleccionable (ACT1-08), y salir del viewport detiene todo
bucle de animación.

### Fase E — Cierre documental y gates globales

1. Marcar el DoD de §8 y la fila 01 del roadmap como «hecho en branch».
2. Registrar en `docs/debt/technical-debt.md` las filas de §12, incluida la errata E-08 y la
   decisión pendiente del cliente sobre el registro visual (§2.5).
3. Ejecutar todos los gates del perfil §5.
4. Limpieza residual: assets no usados, exportaciones muertas.

**DoD fase E:** los cinco gates del perfil §5 en verde, ejecutados de verdad.

---

## 8. Criterios de aceptación (DoD)

### 8.1 Hero

- [ ] El titular es literal y es el único `h1` de la página.
- [ ] El claim está reconstruido en CSS, no como imagen.
- [ ] Los dos CTA usan los textos canónicos y llevan a su destino.
- [ ] No hay enlaces a redes sociales.
- [ ] La animación de entrada dura ≤ 1,2 s y respeta el movimiento reducido.
- [ ] El lector de pantalla anuncia el titular como una sola frase.
- [ ] Los diez tests HERO-01…HERO-10 existen y pasan.

### 8.2 Acto I

- [ ] Los tres factores se recorren con el scroll, uno visible cada vez.
- [ ] El texto de los tres coincide carácter a carácter con `content/`.
- [ ] El 14 % está en el DOM desde el primer render y cita su fuente.
- [ ] El texto bajo la retícula de vigilancia sigue siendo seleccionable.
- [ ] Con movimiento reducido, los tres factores se ven a la vez y completos.
- [ ] Desmontar la escena deja cero animaciones vivas.
- [ ] Los trece tests ACT1-01…ACT1-13 existen y pasan.

### 8.3 Global

- [ ] `docs/product/roadmap.md` fila 01 actualizada a «hecho en branch».
- [ ] Lo no cubierto → filas honestas en `docs/debt/technical-debt.md`.
- [ ] Se respetan el idioma y la política de comentarios del perfil §1.
- [ ] No se modificó ninguna zona protegida del perfil §6 sin autorización de C3.
- [ ] Todos los gates del perfil §5 en verde, ejecutados de verdad.
- [ ] Ningún invariante del perfil §7 roto en la superficie tocada.

---

## 9. Fuera de alcance (v1)

| Ítem | Notas |
|------|-------|
| Página de detalle del acto I | Documento 07 |
| Iconografía literal de amenaza | Decisión E2; queda documentada, no implementada |
| Vídeo de fondo en el hero | F5: peso, distracción y no aporta al argumento |
| Enlaces a redes sociales | Bloqueo B-07: sin URLs confirmadas |
| Corrección del tiempo verbal de las normas europeas | Errata E-08: es decisión editorial del cliente, no del implementador |
| WebGL en este acto | S10: no lo necesita y encarece el primer tramo del scroll |
| Adaptación móvil | Documento 08 |

---

## 10. Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| La escena anclada de `400vh` se hace larga y el visitante abandona antes de llegar al acto II | Tres tramos de igual duración con ventana de entrada y salida; el miliario del shell muestra siempre cuánto queda |
| `SplitText` fragmenta el titular y el lector de pantalla lo lee como ocho trozos | `aria-label` con la frase completa y `aria-hidden` en los fragmentos; test HERO-05 lo verifica |
| La retícula de vigilancia se dibuja encima del texto y lo hace ilegible o inaccesible | La retícula va detrás con `aria-hidden`; el test ACT1-08 falla si el texto deja de ser seleccionable |
| El canvas del factor 1 sigue consumiendo CPU fuera del viewport | Parada y liberación del bucle al salir; verificado en ACT1-10 |
| El registro visual abstracto se percibe como tibio frente a lo que pidió el cliente | Documentado en §2.5 con su alternativa; las tres ilustraciones comparten firma `{ progress }`, así que cambiar de variante no toca texto ni coreografía (E4) |
| El texto del dossier se «mejora» al maquetarlo y deja de ser fiel | I1 + ACT1-12, que compara carácter a carácter contra el fichero de `content/` |

---

## 11. Casos de prueba mínimos (checklist de revisión)

- [ ] Entro en la home: en cinco segundos sé quién habla, qué me proponen y qué puedo hacer.
- [ ] Hago scroll: el hero cede paso al sello de laurel y entra el acto I.
- [ ] Recorro el acto I: los tres factores aparecen de uno en uno, cada uno con su ilustración.
- [ ] El fondo se cierra progresivamente de navy profundo a navy medio, sin retroceder.
- [ ] Intento seleccionar el párrafo del Chat Control con el ratón: es texto, se selecciona.
- [ ] Al final del acto veo el 14 % con su numeral romano y su fuente.
- [ ] Activo «reducir movimiento», recargo y recorro el acto: veo exactamente el mismo contenido.
- [ ] Navego a `/design` y vuelvo: el número de animaciones vivas no ha crecido.

---

## 12. Deuda explícita (registrar al implementar)

### 12.1 E2E — Recorrido del acto I

- Historia: como visitante, recorro el hero y el acto I completos y llego al CTA intermedio
  habiendo visto los tres factores y la cifra ancla.
- Detectada en: este doc §7 fase C. Sin E2E en v1 (perfil §3).

### 12.2 Decisión pendiente del cliente — registro visual

- El cliente pidió iconografía literal de amenaza; se implementa la variante abstracta (§2.5).
  Falta su confirmación.
- Detectada en: este doc §2.5.

### 12.3 Errata E-08 — tiempo verbal de las normas europeas

- El dossier describe en futuro de certeza normas aún en tramitación (Chat Control, Euro Digital).
  Se reproduce literal por I1; la corrección es decisión editorial del cliente.
- Detectada en: `content/08-notas-editoriales.md` E-08.

---

## 13. Referencias de código (pre-feature)

| Área | Rutas |
|------|-------|
| Contenido literal del hero | `content/secciones/00-hero-portada.md` |
| Contenido literal del acto I | `content/secciones/01-nuevo-escenario-europeo.md` |
| Cifra del 14 % | `content/03-datos-y-tablas.md` |
| Voz, tono y arco narrativo | `content/01-identidad-y-tono.md` |
| Paleta y tipografía | `content/05-guia-estilo-visual.md` |
| Primitivas a reutilizar | `src/components/`, `src/motion/` (documento 00) |
| Manifiesto de secciones | `src/app/sections.ts` |

---

## 14. Orden de trabajo sugerido en el branch

```text
main
  Fase A  → contenido tipado + hero y acto I estáticos y accesibles
  Fase B  → animación de entrada del hero + sello de transición
  Fase C  → escena anclada del acto I con scrub y fondo por acto
  Fase D  → las tres ilustraciones cableadas a su progreso
  Fase E  → docs + deuda + gates
```

Dependencias duras: todo requiere el documento 00 cerrado. B necesita el hero estático de A; C
necesita el acto I estático de A; D necesita la coreografía de C para recibir `factorProgress`. E
es siempre la última.

---

*Documento vivo de implementación. Actualizar los checkboxes del DoD y el estado del encabezado
al cerrar cada fase.*

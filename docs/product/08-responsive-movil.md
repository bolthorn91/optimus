# Adaptación móvil

**Estado:** especificación canónica (decisiones cerradas 2026-08-17). Pendiente de implementación.
**Branch de trabajo:** el HEAD actual del worktree.
**Perfil de proyecto:** [`agent-docs/goal-profile.md`](../../agent-docs/goal-profile.md) — invariantes §7 aplicables: I1, I3, I4, I5, I9.
**Roadmap:** [`roadmap.md`](roadmap.md) §2, fila 08.
**Relacionado:** documentos [`00`](00-fundacion-sistema-diseno.md) a [`07`](07-paginas-detalle.md). Este documento **adapta**; no reescribe ni rediseña ninguna escena.

Manda sobre la adaptación de toda la superficie a móvil y tableta. Va deliberadamente al final:
la decisión del cliente fue escritorio impoluto primero, móvil en segunda iteración.

| Referencia | Tema | Resumen v1 |
|------------|------|------------|
| **roadmap §2 fila 08** | Responsive | Shell móvil con CTA fijo, adaptación de los siete actos y del simulador a interacción táctil, y política explícita de degradación de las escenas pesadas. |

---

## 1. Contexto del software actual (punto de partida)

### 1.1 Lo que existe

| Pieza | Ubicación | Estado en móvil |
|-------|-----------|-----------------|
| Sistema de diseño | `src/styles/` | Escala tipográfica ya fluida con `clamp()`; puntos de ruptura declarados pero sin usar |
| Motor de movimiento | `src/motion/` | `useGsapScene` y `<Scene>` funcionan, sin ajuste de alturas por viewport |
| Los siete actos | `src/scenes/` | Diseñados y verificados solo en escritorio |
| Escena WebGL | `src/three/` | Sin política de degradación en móvil (deuda 03 §12.5) |
| Simulador | `src/scenes/05-activos-simulador/` | Deslizadores sin comportamiento táctil verificado |
| Formulario | `src/scenes/07-contacto/` | Sin verificar con teclado virtual |
| Páginas de detalle | `src/pages/` | Índice lateral pensado para escritorio |

**No existe** ninguna verificación en viewport estrecho. Las decisiones móviles de los documentos
anteriores están declaradas pero no implementadas ni comprobadas.

---

## 2. Decisiones cerradas (no reabrir en v1)

### 2.1 Comunes

| # | Tema | Decisión |
|---|------|----------|
| C1 | Idioma | Sin cambios. Este documento no toca contenido. |
| C2 | Tests | Los obligatorios del perfil §5, ejecutados además en viewport estrecho. Toda escena adquiere un test de contenido a 375 px de ancho. |
| C3 | Zonas protegidas | No se toca `content/`. Este documento autoriza modificar cualquier fichero de `src/` **para adaptar presentación**, nunca para cambiar contenido ni coreografía. |
| C4 | Invariantes | I1, I3, I4 (**crítico**: la degradación móvil no puede perder contenido), I5, I9. |
| C5 | Adaptar ≠ rediseñar | Si una escena no funciona en móvil, se **simplifica su presentación**, no se cambia su mensaje ni su contenido. Un acto entrega en móvil exactamente la misma información que en escritorio. |
| C6 | Sin ruta de contenido separada | No hay una versión móvil del contenido. Un solo contenido, dos presentaciones. |

### 2.2 Puntos de ruptura y shell

| # | Tema | Decisión |
|---|------|----------|
| F1 | Puntos de ruptura | Móvil < 768 px · tableta 768–1024 px · escritorio > 1024 px. Los del documento 00. |
| F2 | Ancho de referencia | 375 px. Todo test de viewport estrecho usa esta anchura. |
| F3 | Navegación | Menú desplegable a pantalla completa, con las mismas cinco entradas agrupadas y el miliario romano como índice. |
| F4 | CTA fijo | Barra inferior fija con «Reservar sesión», presente desde que se sale del hero. Es el único elemento fijo permanente en móvil. |
| F5 | Miliario | En móvil pasa de columna lateral a barra de progreso superior fina, con el numeral del acto actual visible. La información se conserva, el formato cambia. |
| F6 | Unidades de viewport | `svh` y `dvh` en lugar de `vh` en toda superficie a pantalla completa, para que la barra del navegador móvil no produzca saltos. |
| F7 | Área táctil | Todo control interactivo con al menos 44×44 px de área efectiva. |
| F8 | Sin `hover` | Ninguna información o acción depende exclusivamente de `hover`. Los tooltips del glosario pasan a activarse por pulsación. |

### 2.3 Degradación de escenas

| # | Tema | Decisión |
|---|------|----------|
| S1 | Principio | El anclaje con scrub funciona en móvil, pero cuesta caro: alturas grandes, más scroll y más carga. Cada escena declara explícitamente su comportamiento móvil. |
| S2 | Alturas ancladas | Se reducen entre un 40 % y un 50 % respecto a escritorio. Un acto de `500vh` en escritorio no puede pedir cinco pantallas de scroll en un móvil. |
| S3 | Escena WebGL del acto III | En móvil se sirve **el fallback estático** con las tres cifras completas y la comparación visual. Salda la deuda 03 §12.5. La escena WebGL se reserva a escritorio y tableta con WebGL disponible. |
| S4 | Serie de mapas del acto II | Se conserva el scrub, con alturas reducidas. El selector de período (documento 02 F11) pasa a ser el control principal en móvil, no un extra. |
| S5 | Ilustraciones del acto I | El canvas del factor demográfico se sustituye por su estado final estático en móvil: un canvas animado a pantalla completa en un móvil de gama media no compensa. |
| S6 | Diagramas de proceso | Reflujo a vertical, ya previsto en los documentos 04 F5 y 06. Aquí se verifica y se ajusta. |
| S7 | Criterio de degradación | Una escena degrada en móvil si su versión completa no mantiene 50 fps en un dispositivo de gama media. La degradación **siempre** conserva todo el contenido (I4, C5). |

### 2.4 Componentes de datos

| # | Tema | Decisión |
|---|------|----------|
| D1 | Comparativas pareadas | Se apilan: España arriba, Argentina abajo, en ese orden. Cada lado conserva sus etiquetas de fila. Sin scroll horizontal. |
| D2 | Tablas | Se convierten en listas de definición apiladas, con la etiqueta de columna repetida por fila. **Nunca** scroll horizontal de tabla. |
| D3 | Tarjetas de vehículo | Apiladas, con las etiquetas «Ventaja estratégica» y «Perfil de rendimiento» repetidas dentro de cada una (documento 05 F2). |
| D4 | Cifras destacadas | Reducen tamaño pero conservan jerarquía. Las densidades del acto III siguen siendo el contraste visual dominante. |
| D5 | Índice lateral del detalle | Pasa a desplegable colapsado al inicio de la página. |

### 2.5 Simulador y formulario

| # | Tema | Decisión |
|---|------|----------|
| G1 | Deslizadores | Área táctil de al menos 44 px de alto. El arrastre del deslizador **no** debe iniciar el scroll de la página: se bloquea el gesto vertical mientras se arrastra. |
| G2 | Entrada numérica | Junto a cada deslizador, entrada numérica con teclado numérico (`inputmode`). En móvil es más rápido teclear que arrastrar con precisión. |
| G3 | Modo scroll del simulador | Se **desactiva** en móvil: competir por el gesto de scroll con el control manual produce una experiencia confusa. Los deslizadores son el único control (documento 05 S10 queda como comportamiento de escritorio). |
| G4 | Gráfico de proyección | Conserva altura suficiente para ser legible; la tabla año a año se colapsa en un desplegable, presente pero no dominante. |
| G5 | Formulario | Tipos de entrada correctos para que el teclado virtual sea el adecuado: `email`, `tel`, `numeric`. Sin zoom automático al enfocar: tamaño de fuente mínimo de 16 px en los campos. |
| G6 | Teclado virtual | El campo enfocado permanece visible al abrirse el teclado; el CTA fijo no tapa el campo activo ni el botón de envío. |

---

## 3. Adaptación móvil — Especificación de implementación

### 3.1 Objetivo de negocio

El tráfico de campañas en Instagram y TikTok —que el propio dossier anticipa con sus iconos de
redes— llega mayoritariamente desde móvil. Una home que solo funciona en escritorio desperdicia
justo el canal por el que llegará la mayor parte de los visitantes.

### 3.2 Modelo de datos (declaración de comportamiento por escena)

`src/motion/responsive.ts` — cada escena declara su comportamiento, en un solo sitio:

```ts
type SceneViewportPolicy = {
  sceneId: string
  desktopHeight: string      // p. ej. "500vh"
  mobileHeight: string       // p. ej. "260svh"
  mobileMode: "scrub" | "static" | "fallback"
  reason: string             // por qué degrada, para que la decisión no se pierda
}
```

| Escena | `mobileMode` | Razón |
|--------|--------------|-------|
| `hero` | `scrub` | Animación de entrada, barata |
| `act-1` | `static` | El canvas de partículas no compensa en gama media (S5) |
| `act-2` | `scrub` | La serie temporal es el contenido; se reduce la altura (S4) |
| `act-3` | `fallback` | WebGL reservado a escritorio (S3) |
| `act-4` | `scrub` | El trazado del diagrama es barato y es el argumento |
| `act-5` | `static` | El modo scroll del simulador se desactiva (G3) |
| `act-67` | `scrub` | Trazado de cadenas, barato |
| `contacto` | `static` | Es un formulario |

### 3.3 Algoritmo canónico (pseudocódigo)

Resolución del comportamiento de una escena — `src/motion/responsive.ts`:

```text
resolveScenePolicy(sceneId, viewportWidth, capabilities):
  policy := policies[sceneId]
  si no existe policy  -> error en desarrollo: toda escena declara su politica

  esMovil := viewportWidth < 768

  si no esMovil:
    devolver { height: policy.desktopHeight, mode: "scrub" }

  modo := policy.mobileMode

  # una escena en modo fallback exige que su fallback exista y lleve el contenido
  si modo == "fallback" y no capabilities.hasFallback:
    error en desarrollo: no se degrada a un fallback que no existe

  # I4: degradar NUNCA reduce contenido
  devolver { height: policy.mobileHeight, mode: modo }
```

**Regla que atraviesa todo el documento:** `mode` cambia **cómo** se presenta una escena, nunca
**qué** contiene. Un test compara el contenido textual observable a 375 px y a 1440 px y falla si
difieren.

### 3.4 Superficies a unificar

| Punto | Fichero | Nota |
|-------|---------|------|
| Política por escena | `src/motion/responsive.ts` | Única fuente; ninguna escena decide por su cuenta |
| Detección de viewport | `src/motion/useViewport.ts` | Un solo `matchMedia`, no uno por componente |
| Puntos de ruptura | `src/styles/tokens.css` | Ya declarados en el documento 00; aquí se usan |
| Shell móvil | `src/app/` | Menú, miliario superior y CTA fijo |

### 3.5 Migración / recálculo de datos existentes

`No aplica`.

### 3.6 Casos límite

- **Rotación del dispositivo:** `ScrollTrigger.refresh()` con `debounce`; las alturas ancladas se
  recalculan y ninguna escena queda descuadrada. Si el giro cruza el punto de ruptura, la política
  se reevalúa.
- **Barra del navegador que aparece y desaparece:** `svh` y `dvh` (F6) evitan el salto. Nunca `vh`
  en una superficie a pantalla completa.
- **Teclado virtual abierto:** el CTA fijo se oculta mientras un campo del formulario tiene el foco,
  para no tapar el botón de envío (G6).
- **Arrastre de un deslizador:** se bloquea el gesto vertical mientras dura el arrastre (G1), y se
  libera al soltar. Sin esto, mover un deslizador hace scroll a la página.
- **Tableta en horizontal:** entra en el tramo de escritorio si supera 1024 px. Se verifica que la
  escena WebGL del acto III funcione ahí antes de servirla.
- **Movimiento reducido en móvil:** manda sobre la política de escena. Si el usuario pide
  movimiento reducido, todas las escenas van en modo estático independientemente de su política.
- **Escena sin política declarada:** error en desarrollo. Nunca un comportamiento por defecto
  silencioso.

### 3.7 API de componentes (contrato de props)

| Componente | Props |
|------------|-------|
| `<MobileNav>` | `sections: Section[], open: boolean, onClose` (F3) |
| `<StickyCta>` | `hidden?: boolean` — se oculta con el teclado virtual (F4, G6) |
| `<ProgressBar>` | `progress: number, currentAct: number` — el miliario en móvil (F5) |
| `<StackedComparison>` | `left: Side, right: Side, rows: Row[]` — variante apilada (D1) |
| `<DefinitionTable>` | `rows: Row[], columns: string[]` — tabla convertida en lista (D2) |
| `<CollapsibleToc>` | `entries: TocEntry[]` (D5) |
| `useViewport()` | Devuelve `{ width, isMobile, isTablet }` desde un solo `matchMedia` |
| `resolveScenePolicy()` | Función pura; entra en el gate de cobertura |

### 3.8 Tests golden Móvil (mínimos)

Prefijo estable **`MOB`**.

| ID | Escenario | Esperado |
|----|-----------|----------|
| MOB-01 | Cada uno de los siete actos a 375 px y a 1440 px | El contenido textual observable es **idéntico** en ambas anchuras (C5, I4) |
| MOB-02 | `resolveScenePolicy` para las ocho escenas a 375 px | Devuelve la política declarada en §3.2, sin valores por defecto |
| MOB-03 | `resolveScenePolicy` con una escena sin política | Error en desarrollo; ningún comportamiento por defecto silencioso |
| MOB-04 | `resolveScenePolicy` en modo `fallback` sin fallback disponible | Error en desarrollo (§3.3) |
| MOB-05 | `resolveScenePolicy` con `prefers-reduced-motion` | Todas las escenas en modo estático, sea cual sea su política (§3.6) |
| MOB-06 | Acto III a 375 px | Se sirve el fallback estático con las tres cifras completas; ningún canvas WebGL montado (S3) |
| MOB-07 | Acto II a 375 px | El selector de período es el control principal y es operable táctil y con teclado (S4) |
| MOB-08 | Toda superficie a pantalla completa | Usa `svh` o `dvh`, nunca `vh` (F6) |
| MOB-09 | Todos los controles interactivos a 375 px | Área efectiva de al menos 44×44 px (F7) |
| MOB-10 | Glosario y tooltips a 375 px | Se activan por pulsación; ninguna información depende solo de `hover` (F8) |
| MOB-11 | Comparativas a 375 px | Apiladas con España arriba; cada lado conserva sus etiquetas; **sin scroll horizontal** (D1) |
| MOB-12 | Tablas a 375 px | Convertidas en listas de definición; ninguna tabla con scroll horizontal (D2) |
| MOB-13 | Simulador a 375 px | El modo scroll está desactivado; los deslizadores son el único control (G3) |
| MOB-14 | Arrastre de un deslizador | No inicia el scroll de la página; el gesto se libera al soltar (G1) |
| MOB-15 | Campos del formulario a 375 px | `inputmode` y `type` correctos; tamaño de fuente ≥ 16 px; sin zoom automático al enfocar (G5) |
| MOB-16 | Formulario con un campo enfocado | El CTA fijo se oculta y no tapa el campo ni el botón de envío (G6) |
| MOB-17 | Menú móvil abierto | Las cinco entradas y el numeral de acto son alcanzables con teclado; el foco queda atrapado en el menú |
| MOB-18 | Rotación del dispositivo | Ninguna escena queda descuadrada; la política se reevalúa si se cruza el punto de ruptura |
| MOB-19 | Cada acto a 375 px con axe | Cero violaciones `critical` y `serious` |
| MOB-20 | Ninguna página a 375 px | El `body` no produce scroll horizontal en ninguna ruta del sitio |
| MOB-21 | Páginas de detalle a 375 px | El índice lateral es un desplegable colapsado (D5) |
| MOB-22 | Regresión: escritorio | Todas las escenas y páginas siguen funcionando igual a 1440 px |

MOB-01 y MOB-20 son los dos tests que definen el documento: el primero garantiza que degradar no
pierde contenido, el segundo que nada desborda. MOB-22 garantiza que adaptar no rompe lo que ya
estaba impoluto.

---

## 4. Segunda feature

`No aplica` — este documento cubre una sola feature transversal.

---

## 5. Seguridad, permisos y aislamiento

- **I4, MOB-01:** degradar una escena nunca reduce el contenido. Es el invariante central de este
  documento y el que más fácilmente se incumple al simplificar para móvil.
- **I3, MOB-05:** `prefers-reduced-motion` manda sobre la política de escena.
- **I9:** en móvil el ahorro es mayor —no se carga el chunk WebGL en el acto III (S3)— y el
  presupuesto del chunk de entrada no cambia.
- **I5:** al cruzar un punto de ruptura, las animaciones de la política anterior se destruyen antes
  de crear las nuevas. Sin acumulación de ScrollTriggers al rotar el dispositivo.
- Sin cambios en tratamiento de datos: el formulario es el mismo del documento 06.

---

## 6. Textos de interfaz (claves orientativas)

| Clave | ES |
|-------|-----|
| `mobile.openMenu` | Abrir menú |
| `mobile.closeMenu` | Cerrar menú |
| `mobile.stickyCta` | Reservar sesión |
| `mobile.tocToggle` | En esta página |
| `mobile.tableExpand` | Ver tabla completa |
| `mobile.staticSceneNote` | Vista optimizada para su dispositivo |

`mobile.staticSceneNote` acompaña al fallback del acto III y explica por qué se ve una imagen
estática. Sin esa nota, el visitante puede pensar que la escena ha fallado.

---

## 7. Plan de implementación (fases)

### Fase A — Auditoría, políticas y shell móvil

1. Auditoría a 375 px de las ocho escenas y las trece páginas, con lo que desborda registrado.
2. `src/motion/responsive.ts` con las ocho políticas de §3.2 y `resolveScenePolicy`.
3. `src/motion/useViewport.ts` con un solo `matchMedia` (§3.4).
4. Sustitución de `vh` por `svh`/`dvh` en toda superficie a pantalla completa (F6).
5. `<MobileNav>`, `<ProgressBar>` y `<StickyCta>` (F3, F4, F5).
6. Área táctil mínima y eliminación de dependencias de `hover` (F7, F8).
7. Tests MOB-02 a MOB-05, MOB-08, MOB-09, MOB-10, MOB-17.

**DoD fase A:** el shell móvil navega; toda escena tiene política declarada; ninguna superficie usa
`vh`; ninguna información depende de `hover`; el foco queda atrapado en el menú abierto.

### Fase B — Actos I a III

1. Acto I: canvas del factor demográfico en su estado final estático (S5); alturas reducidas (S2).
2. Acto II: alturas reducidas, selector de período como control principal (S4).
3. Acto III: fallback estático en móvil, sin montar WebGL (S3); saldo de la deuda 03 §12.5.
4. `<StackedComparison>` y `<DefinitionTable>` para las comparativas y tablas (D1, D2).
5. Tests MOB-06, MOB-07, MOB-11, MOB-12.

**DoD fase B:** los tres primeros actos se recorren en móvil con el mismo contenido que en
escritorio; el acto III no monta WebGL; ninguna comparativa ni tabla produce scroll horizontal.

### Fase C — Actos IV y V

1. Acto IV: reflujo vertical del diagrama del CDI verificado y ajustado (S6).
2. Acto V: tarjetas apiladas con etiquetas internas (D3); modo scroll del simulador desactivado (G3).
3. Deslizadores con área táctil, bloqueo del gesto vertical y entrada numérica (G1, G2).
4. Gráfico legible y tabla año a año colapsable (G4).
5. Tests MOB-13, MOB-14.

**DoD fase C:** el diagrama del CDI reflúye sin perder el orden de los pasos; arrastrar un
deslizador no hace scroll a la página; el simulador es plenamente usable con el pulgar.

### Fase D — Actos VI y VII, formulario y detalle

1. Actos VI–VII: cadenas de intermediación en vertical; glosario por pulsación (S6, F8).
2. Formulario: tipos de entrada, tamaño de fuente ≥ 16 px, CTA fijo que se aparta con el teclado
   virtual (G5, G6).
3. Páginas de detalle: índice lateral como desplegable colapsado (D5).
4. Barrido final de desbordamiento horizontal en todas las rutas.
5. Tests MOB-15, MOB-16, MOB-20, MOB-21, MOB-01, MOB-18, MOB-19, MOB-22.

**DoD fase D:** el formulario se rellena cómodamente con teclado virtual sin que nada lo tape;
ninguna ruta produce scroll horizontal a 375 px; el contenido observable es idéntico en móvil y en
escritorio (MOB-01); escritorio sigue intacto (MOB-22).

### Fase E — Cierre documental y gates globales

1. Marcar el DoD de §8 y la fila 08 del roadmap como «hecho en branch».
2. Cerrar la deuda 03 §12.5 (rendimiento de la escena WebGL en gama media), resuelta por S3.
3. Registrar en `docs/debt/technical-debt.md` las filas de §12.
4. Ejecutar todos los gates del perfil §5.
5. Limpieza residual: reglas CSS muertas, políticas de escena huérfanas.

**DoD fase E:** los cinco gates del perfil §5 en verde. La deuda 03 §12.5 cerrada con su
resolución documentada.

---

## 8. Criterios de aceptación (DoD)

### 8.1 Adaptación móvil

- [ ] El contenido textual observable es idéntico a 375 px y a 1440 px en los siete actos.
- [ ] Ninguna ruta del sitio produce scroll horizontal a 375 px.
- [ ] Toda escena tiene su política declarada en un solo sitio; ninguna decide por su cuenta.
- [ ] El acto III sirve el fallback estático en móvil, sin montar WebGL.
- [ ] Toda superficie a pantalla completa usa `svh` o `dvh`, nunca `vh`.
- [ ] Todo control tiene al menos 44×44 px de área efectiva.
- [ ] Ninguna información depende exclusivamente de `hover`.
- [ ] Arrastrar un deslizador no hace scroll a la página.
- [ ] El CTA fijo no tapa el campo activo ni el botón de envío con el teclado abierto.
- [ ] `prefers-reduced-motion` manda sobre la política de escena.
- [ ] Escritorio sigue funcionando exactamente igual.
- [ ] Los veintidós tests MOB-01…MOB-22 existen y pasan.

### 8.2 Segunda feature

`No aplica`.

### 8.3 Global

- [ ] `docs/product/roadmap.md` fila 08 actualizada a «hecho en branch».
- [ ] La deuda 03 §12.5 queda cerrada con su resolución documentada.
- [ ] Lo no cubierto → filas honestas en `docs/debt/technical-debt.md`.
- [ ] Se respetan el idioma y la política de comentarios del perfil §1.
- [ ] No se modificó ninguna zona protegida del perfil §6 sin autorización de C3.
- [ ] Todos los gates del perfil §5 en verde, ejecutados de verdad.
- [ ] Ningún invariante del perfil §7 roto en la superficie tocada.

---

## 9. Fuera de alcance (v1)

| Ítem | Notas |
|------|-------|
| Escena WebGL en móvil | S3: se sirve el fallback. Reevaluable cuando haya medición en dispositivos reales |
| Versión móvil del contenido | C6: un solo contenido, dos presentaciones |
| Aplicación instalable o PWA | No aporta a un sitio de captación de una sola visita |
| Gestos propios (deslizar entre actos) | Compiten con el scroll nativo y rompen la accesibilidad |
| Rediseño de cualquier escena | C5: este documento adapta, no rediseña |
| Optimización para navegadores móviles antiguos | Perfil: dos últimas versiones de los navegadores principales |

---

## 10. Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| Simplificar para móvil acaba recortando contenido sin que nadie se dé cuenta | C5 + I4 + MOB-01, que compara el contenido observable en ambas anchuras y falla si difiere |
| Adaptar a móvil rompe algo del escritorio, que era la prioridad del cliente | MOB-22 como test de regresión explícito en cada fase |
| Una escena decide por su cuenta cómo comportarse en móvil y el criterio se dispersa | Política única en `src/motion/responsive.ts` + MOB-03, que falla si falta una declaración |
| Arrastrar un deslizador hace scroll a la página y el simulador resulta inusable | G1 + MOB-14 |
| El teclado virtual tapa el botón de envío y el formulario parece roto | G6 + MOB-16 |
| Una tabla se queda con scroll horizontal y se pierde información fuera de pantalla | D2 + MOB-12 + MOB-20 |
| Rotar el dispositivo acumula ScrollTriggers y la página se degrada | I5 + §3.6: se destruyen las animaciones de la política anterior antes de crear las nuevas |
| El uso de `vh` produce saltos al aparecer y desaparecer la barra del navegador | F6 + MOB-08 |
| El fallback del acto III se percibe como un fallo de carga | `mobile.staticSceneNote` explica que es una vista optimizada |

---

## 11. Casos de prueba mínimos (checklist de revisión)

- [ ] Abro la home en un móvil real: el hero ocupa la pantalla sin saltos al desplazar.
- [ ] Aparece la barra inferior con «Reservar sesión» y me acompaña todo el recorrido.
- [ ] Abro el menú: veo las cinco entradas y en qué acto estoy, con su numeral romano.
- [ ] Recorro el acto I: veo los tres factores completos, con la ilustración estática.
- [ ] En el acto II uso el selector de período con el pulgar y cambio entre los cuatro mapas.
- [ ] En el acto III veo la imagen nocturna con las tres cifras y una nota de vista optimizada.
- [ ] En el acto IV el diagrama del CDI se lee en vertical, con los cinco pasos en orden.
- [ ] En el acto V arrastro el deslizador de capital: la página no se mueve.
- [ ] Tecleo el capital directamente: se abre el teclado numérico.
- [ ] Abro la tabla año a año desde su desplegable.
- [ ] Relleno el formulario: cada campo abre el teclado correcto y nada me tapa el envío.
- [ ] Giro el móvil a horizontal y vuelvo: ninguna escena queda descuadrada.
- [ ] Recorro las trece páginas: ninguna se desplaza horizontalmente.
- [ ] Comparo el contenido de cada acto con el de escritorio: es el mismo.
- [ ] Vuelvo al escritorio: todo sigue exactamente como estaba.

---

## 12. Deuda explícita (registrar al implementar)

### 12.1 E2E — Recorrido móvil completo

- Historia: como visitante desde un móvil, recorro la home entera y envío el formulario de reserva
  sin que ningún elemento me lo impida.
- Detectada en: este doc §7 fase D. Sin E2E en v1 (perfil §3).

### 12.2 Sin medición en dispositivos reales

- Las políticas de degradación de §3.2 se basan en criterio, no en medición sobre un parque de
  dispositivos. Falta verificar en gama media y baja reales y ajustar S7 en consecuencia.
- Detectada en: este doc §2.3 S7.

### 12.3 Escena WebGL no disponible en móvil

- El acto III sirve el fallback en todo móvil, incluidos los que sí podrían ejecutar la escena.
  Es una decisión conservadora que conviene revisar con datos de rendimiento reales.
- Detectada en: este doc §2.3 S3. Cierra parcialmente la deuda 03 §12.5.

### 12.4 Tableta sin verificación específica

- El tramo 768–1024 px hereda comportamiento de escritorio por encima de 1024 y de móvil por
  debajo de 768. La franja intermedia se verifica pero no se optimiza.
- Detectada en: este doc §2.2 F1.

---

## 13. Referencias de código (pre-feature)

| Área | Rutas |
|------|-------|
| Puntos de ruptura y tokens | `src/styles/tokens.css` (documento 00) |
| Motor de movimiento y `<Scene>` | `src/motion/` (documento 00) |
| Las ocho escenas | `src/scenes/` (documentos 01 a 06) |
| Escena WebGL y su fallback | `src/three/`, `src/scenes/03-asimetria-territorial/` (documento 03) |
| Simulador | `src/scenes/05-activos-simulador/` (documento 05) |
| Formulario | `src/scenes/07-contacto/` (documento 06) |
| Páginas de detalle | `src/pages/` (documento 07) |
| Requisitos de accesibilidad y rendimiento | `content/06-requisitos-funcionales.md` |

---

## 14. Orden de trabajo sugerido en el branch

```text
main
  Fase A  → auditoría, políticas de escena, shell móvil y unidades de viewport
  Fase B  → actos I a III, con el fallback del acto III y las tablas apiladas
  Fase C  → actos IV y V, con el simulador táctil
  Fase D  → actos VI y VII, formulario con teclado virtual y páginas de detalle
  Fase E  → docs + deuda + gates
```

Dependencias duras: todo requiere los documentos 00 a 07 cerrados. B, C y D necesitan las políticas
y el shell de A. El barrido final de desbordamiento y MOB-01 se ejecutan en D, cuando toda la
superficie está adaptada. E es siempre la última.

---

*Documento vivo de implementación. Actualizar los checkboxes del DoD y el estado del encabezado
al cerrar cada fase.*

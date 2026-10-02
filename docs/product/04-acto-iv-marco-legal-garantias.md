# Acto IV — Marco legal y garantías

**Estado:** hecho en branch `main` (2026-10-02). No fusionado.
**Branch de trabajo:** el HEAD actual del worktree.
**Perfil de proyecto:** [`agent-docs/goal-profile.md`](../../agent-docs/goal-profile.md) — invariantes §7 aplicables: I1, I3, I4, I5, I6, I7, I9.
**Roadmap:** [`roadmap.md`](roadmap.md) §2, fila 04.
**Relacionado:** [`00-fundacion-sistema-diseno.md`](00-fundacion-sistema-diseno.md) (motor y primitivas, `<Disclaimer>`) · [`03-acto-iii-asimetria-territorial.md`](03-acto-iii-asimetria-territorial.md) (`<PairedComparison>`, `src/lib/counter.ts`). **No reimplementar** ninguno de los dos.

Manda sobre el acto IV: la bisagra del relato. Cierra la puerta a la inacción y abre la de la
solución con mecanismos jurídicos concretos. Es donde el visitante decide si sigue leyendo.

| Referencia | Tema | Resumen v1 |
|------------|------|------------|
| **roadmap §2 fila 04** | Acto IV | El diagrama animado del Convenio de Doble Imposición en cinco pasos, las cuatro garantías, y el dato de las 13.243.219 hectáreas comparado con la extensión de Inglaterra. |

---

## 1. Contexto del software actual (punto de partida)

### 1.1 Fundación y actos previos disponibles

| Pieza | Ubicación | Comportamiento |
|-------|-----------|----------------|
| Motor de movimiento | `src/motion/` | `useGsapScene`, `<Scene>`, `useReducedMotionSafe` |
| Primitivas | `src/components/` | `<CountUp>`, `<StatFigure>`, `<DualFigure>`, `<PullQuote>`, `<Disclaimer>`, `<ActSeal>` |
| Comparativa pareada | `src/components/PairedComparison.tsx` | Creada en el documento 03; se reutiliza |
| Contadores con cierre exacto | `src/lib/counter.ts` | Creado en el documento 03; se reutiliza |
| Trazado de SVG | GSAP `DrawSVG` | Disponible desde el documento 00 |

**No existe** ningún diagrama de proceso: este documento crea el patrón que reutilizará el
documento 06 para la cadena de intermediación.

### 1.2 Contenido y assets de origen

| Pieza | Ubicación | Estado |
|-------|-----------|--------|
| Acto IV completo, literal | `content/secciones/04-estrategia-anticipatoria.md` | Íntegro, con el flujo del CDI ya descompuesto en cinco pasos |
| Dato de las hectáreas | `content/03-datos-y-tablas.md` | `13.243.219 ha`, equivalente a Inglaterra |
| Disclaimer y afirmaciones a matizar | `content/07-legal-y-disclaimers.md` | Tabla de afirmaciones absolutas del acto IV |
| Fotografía del Obelisco | `public/assets-origen/p11-X43.png` | 1022×563, **sobresaturada y de aspecto amateur** |

---

## 2. Decisiones cerradas (no reabrir en v1)

### 2.1 Comunes

| # | Tema | Decisión |
|---|------|----------|
| C1 | Idioma | Español de España. Términos fiscales con su desarrollo en la primera aparición. |
| C2 | Tests | Los tres obligatorios del perfil §5, más axe. El paso a paso del diagrama es una función pura y se testea por valores exactos. |
| C3 | Zonas protegidas | No se toca `content/` ni `public/assets-origen/`. Este documento autoriza crear `src/scenes/04-marco-legal/` y los SVG derivados en `public/diagrams/`. |
| C4 | Invariantes | I1 (cifra de las hectáreas exacta), I3, I4 (los cinco pasos del CDI son texto en el DOM, no etiquetas dentro de un SVG inaccesible), I5, I6, **I7 (esta es la sección con más afirmaciones absolutas del dossier: el disclaimer es obligatorio)**, I9. |
| C5 | Diagrama ≠ lista | El diagrama del CDI es la ilustración; la lista ordenada de cinco pasos es el contenido. Ambos existen siempre. El SVG lleva `aria-hidden` y la lista es la que lee el lector de pantalla. |

### 2.2 Diagrama del CDI

| # | Tema | Decisión |
|---|------|----------|
| F1 | Importancia | Es el activo visual más valioso a crear en todo el sitio: traduce el argumento fiscal abstracto en un mecanismo comprensible. Recibe el mayor esfuerzo de diseño del acto. |
| F2 | Técnica | SVG propio animado con `DrawSVG` para los trazos y `gsap` para los nodos. **Sin WebGL**: es un diagrama, y el vector es más nítido y más accesible. |
| F3 | Los cinco pasos | Literales de `content/secciones/04-estrategia-anticipatoria.md`: (1) se invierte en un activo argentino; (2) se tributa en origen; (3) se acredita residencia fiscal ante la AEAT; (4) el impuesto pagado en Argentina se computa como crédito y reduce la factura en España; (5) nunca se tributa dos veces por el mismo beneficio. |
| F4 | Coreografía | Cada paso se traza y se ilumina en su tramo de scroll. El trazo avanza de Argentina a España siguiendo el flujo del capital y del crédito fiscal. El paso activo destaca; los anteriores quedan trazados y atenuados; los siguientes, sin trazar. |
| F5 | Orientación | Horizontal en escritorio, con reflujo vertical en viewport estrecho. El texto del diagrama es texto real, nunca trazado a curvas: es requisito de accesibilidad y de SEO. |
| F6 | Reutilización | El patrón se extrae a `<ProcessDiagram>` en `src/components/`, con pasos, trazos y estado activo. **El documento 06 lo reutiliza** para la cadena de intermediación. |
| F7 | Topes de retención | El segundo beneficio del CDI —topes máximos a la retención de dividendos y distribuciones— se presenta como nota tras el diagrama, no como sexto paso: no forma parte del flujo. |

### 2.3 Las cuatro garantías

| # | Tema | Decisión |
|---|------|----------|
| S1 | Los cuatro pilares | Titularidad, validez transfronteriza (Apostilla de La Haya), canalización por entidades reguladas, y compliance con trazabilidad. Literales del dossier. |
| S2 | Presentación | Cuatro tarjetas con icono de trazo lineal, con el patrón de tarjeta establecido en el acto I. Es el bloque que más confianza genera y el que más se recuerda. |
| S3 | Aclaración de «Capital Protegido» | **Obligatoria y explícita.** En el ámbito financiero español «capital protegido» designa productos con devolución asegurada de la inversión, y este no lo es. La sección declara sin ambigüedad que lo que se protege es la **titularidad registral del activo**, no el valor de la inversión. Texto en `content/07-legal-y-disclaimers.md`. |
| S4 | Reutilización | Un resumen de las cuatro garantías se repite junto al formulario del documento 06: es el argumento que más pesa en el momento de convertir. Se extrae `<GuaranteeCards>` reutilizable. |

### 2.4 El dato ancla

| # | Tema | Decisión |
|---|------|----------|
| D1 | Cifra | `13.243.219 hectáreas` en manos de capitales privados extranjeros, con `<CountUp>` y cierre exacto vía `src/lib/counter.ts`. |
| D2 | Comparación | La equivalencia con la extensión de Inglaterra es lo que hace comprensible el número, y **no se separa de él**. Se ilustra con dos áreas superpuestas a escala. |
| D3 | Doble numeral | `MMXXIV` / `2024` como año de inicio del flujo de capitales citado, con `<DualFigure>`. Es una de las apariciones con sentido del numeral romano. |
| D4 | Conversión derivada | `content/03-datos-y-tablas.md` incluye una conversión calculada (132.432,19 km², ≈ 4,76 % de Argentina). **No se publica**: el propio fichero la marca como derivada y pendiente de validación del cliente (I1). |

### 2.5 Afirmaciones absolutas y disclaimer

| # | Tema | Decisión |
|---|------|----------|
| E1 | Texto | Se reproduce **literal** el texto del dossier, con sus afirmaciones absolutas («garantizando máxima seguridad jurídica», «elimina de raíz», «jamás se tributen dos veces»). I1 manda. |
| E2 | Disclaimer | El `<Disclaimer variant="inline">` acompaña obligatoriamente al bloque de marco fiscal y al de garantías (I7). No es opcional ni se pospone al footer. |
| E3 | Nota de asesoramiento | Junto al diagrama del CDI, una nota visible: la información fiscal es general y su aplicación depende de la situación individual; se recomienda asesoramiento independiente. Texto de `content/07-legal-y-disclaimers.md`. |
| E4 | Matización del copy | Las sugerencias de matización de `content/07-legal-y-disclaimers.md` (tabla de afirmaciones) **no se aplican unilateralmente**: se registran en deuda para revisión de la asesoría legal del cliente. Cambiar el texto sería violar I1. |

### 2.6 Fondo, fotografía y CTA

| # | Tema | Decisión |
|---|------|----------|
| G1 | Fondo del acto | Transición de navy del sistema a marfil `#F7F5F0`: es el primer acto luminoso del relato, el punto donde se pasa del diagnóstico a la solución. El cambio de temperatura es narrativo. |
| G2 | Fotografía del Obelisco | **No se usa** `p11-X43.png`: sobresaturada, cielo procesado, aspecto de filtro de móvil, y desentona con el posicionamiento patrimonial. Se registra en deuda la necesidad de fotografía profesional con licencia. |
| G3 | CTA intermedio | Obligatorio al cierre del acto: «Analice su caso con un consultor» → `#contacto`. Es el punto del scroll donde el visitante tiene más motivo acumulado para convertir. |

---

## 3. Diagrama del CDI — Especificación de implementación

### 3.1 Objetivo de negocio

Responder a la única pregunta que separa al interesado del cliente: «sí, pero ¿cómo funciona
legalmente y qué me protege?». Un inversor que no entiende el mecanismo fiscal no reserva una
sesión. El diagrama convierte cuatro párrafos densos en cinco pasos que se ven.

### 3.2 Modelo de datos (contenido tipado)

`src/scenes/04-marco-legal/content.ts`:

```ts
type ProcessStep = {
  index: 1 | 2 | 3 | 4 | 5
  title: string       // literal
  body: string        // literal
  side: "ar" | "es"   // en qué lado del flujo ocurre
}

type Guarantee = {
  index: 1 | 2 | 3 | 4
  pillar: string      // "Titularidad" | "Validez transfronteriza" | ...
  mechanism: string   // literal
  icon: GuaranteeIcon
}
```

| Campo | Tipo | Origen |
|-------|------|--------|
| `act` | `4` | |
| `title` | `string` | «La necesidad de una estrategia anticipatoria» |
| `intro` | `string` | Entradilla literal sobre el coste de la inacción |
| `whyArgentina` | `{ factors: Factor[]; body: string }` | Los ocho factores de la tabla del dossier |
| `anchorStat` | `{ hectares: 13243219; equivalence: string; since: 2024 }` | `content/03-datos-y-tablas.md` |
| `cdiSteps` | `ProcessStep[]` | Los cinco pasos (F3) |
| `withholdingNote` | `string` | Topes de retención (F7) |
| `guarantees` | `Guarantee[]` | Los cuatro pilares (S1) |
| `capitalProtectionNote` | `string` | Aclaración de S3 |
| `cta` | `{ label, href }` | G3 |

### 3.3 Algoritmo canónico (pseudocódigo)

Coreografía del acto — `src/scenes/04-marco-legal/timeline.ts`:

```text
choreographAct4(p):                     # p: 0 → 1, progreso de scroll de la escena

  # 0.00–0.14  entradilla: el coste de la inaccion
  introOpacity   := ventana(clamp01(p / 0.14), entrada=0.25, salida=0.85)

  # 0.16–0.30  el dato ancla: 13.243.219 ha frente a Inglaterra
  anchorProgress := clamp01((p - 0.16) / 0.14)

  # 0.34–0.72  el diagrama del CDI: cinco pasos en cinco tramos iguales
  cdiProgress    := clamp01((p - 0.34) / 0.38)
  pasoContinuo   := cdiProgress * 5                   # 0 → 5
  pasoActivo     := min(floor(pasoContinuo), 4)       # indice 0..4
  pasoLocal      := pasoContinuo - pasoActivo         # 0 → 1 dentro del paso

  para cada paso i de 0..4:
    si i <  pasoActivo:  drawProgress[i] := 1;         stepGlow[i] := 0.35
    si i == pasoActivo:  drawProgress[i] := pasoLocal;  stepGlow[i] := 1
    si i >  pasoActivo:  drawProgress[i] := 0;          stepGlow[i] := 0

  # 0.74–0.92  las cuatro garantias, escalonadas
  para cada garantia g de 0..3:
    inicio := 0.74 + g * 0.045
    guaranteeProgress[g] := clamp01((p - inicio) / 0.09)

  # 0.94–1.00  aclaracion de "Capital Protegido" y CTA
  closingOpacity := clamp01((p - 0.94) / 0.06)

  # el fondo se aclara de navy a marfil a lo largo del acto (G1)
  surfaceMix     := ease.inOut(p)

  devolver { introOpacity, anchorProgress, drawProgress, stepGlow, pasoActivo,
             guaranteeProgress, closingOpacity, surfaceMix }
```

_Invariante de la coreografía: en todo momento hay exactamente un paso con `stepGlow` igual a 1.
Un diagrama con dos pasos activos o con ninguno es un fallo, no un estado intermedio._

### 3.4 Superficies a unificar

| Punto | Fichero | Nota |
|-------|---------|------|
| Coreografía del acto | `src/scenes/04-marco-legal/timeline.ts` | Función pura |
| Diagrama de proceso genérico | `src/components/ProcessDiagram.tsx` | **Reutilizado por el documento 06** (F6) |
| Tarjetas de garantías | `src/components/GuaranteeCards.tsx` | **Reutilizadas junto al formulario del documento 06** (S4) |
| Contadores | `src/lib/counter.ts` | Reutilizado del documento 03; no se duplica |
| Disclaimer | `src/components/Disclaimer.tsx` | Del documento 00; no se duplica |

### 3.5 Migración / recálculo de datos existentes

`No aplica`.

### 3.6 Casos límite

- **`cdiProgress` exactamente 1:** `pasoActivo` queda acotado a 4; sin índice fuera de rango.
- **Dos pasos activos:** imposible por construcción; verificado por test (CDI-03).
- **Viewport estrecho:** el diagrama reflúye a vertical (F5) sin perder el orden de los pasos ni
  la dirección del flujo.
- **Movimiento reducido:** los cinco pasos aparecen trazados por completo y a la vez, con la lista
  ordenada íntegra. Ningún paso queda oculto.
- **Texto del diagrama y lector de pantalla:** el SVG lleva `aria-hidden`; la lista ordenada `<ol>`
  que está fuera es la que se anuncia, con los cinco pasos completos (C5, I4).
- **`13.243.219` en `progress` = 1:** valor exacto vía `src/lib/counter.ts`, sin residuo.
- **Zoom del navegador al 200 %:** el diagrama no se recorta ni obliga a scroll horizontal.

### 3.7 API de componentes (contrato de props)

| Componente | Props |
|------------|-------|
| `<Act4Scene>` | ninguna — lee su `content.ts` |
| `<ProcessDiagram>` | `steps: ProcessStep[], drawProgress: number[], stepGlow: number[], orientation: "horizontal" \| "vertical"` (F6) |
| `<ProcessStepList>` | `steps: ProcessStep[]` — la `<ol>` accesible que acompaña al SVG (C5) |
| `<GuaranteeCards>` | `guarantees: Guarantee[], progress: number[]` (S4) |
| `<AnchorStat>` | `hectares: number, equivalence: string, progress: number` (D1, D2) |
| `<AreaComparison>` | `primary: Area, reference: Area` — las dos superficies a escala (D2) |
| `<Disclaimer>` | `variant: "inline"` — del documento 00 (E2) |

### 3.8 Tests golden CDI y garantías (mínimos)

Prefijo estable **`CDI`**.

| ID | Escenario | Esperado |
|----|-----------|----------|
| CDI-01 | `choreographAct4` en `p` = 0.34, 0.42, 0.50, 0.58, 0.66 | Los cinco pasos activos en orden, uno por tramo |
| CDI-02 | `choreographAct4` con `cdiProgress` = 1 | `pasoActivo` acotado a 4; sin índice fuera de rango |
| CDI-03 | `choreographAct4` en cualquier `p` dentro del tramo del diagrama | Exactamente un paso con `stepGlow` igual a 1 |
| CDI-04 | `drawProgress` a lo largo del tramo | Monótona no decreciente para cada paso; un paso trazado nunca se destraza |
| CDI-05 | Escena renderizada | La `<ol>` con los cinco pasos completos está en el DOM (C5, I4) |
| CDI-06 | SVG del diagrama | Lleva `aria-hidden`; el texto es texto real, no trazado a curvas (F5) |
| CDI-07 | Escena con `prefers-reduced-motion: reduce` | Los cinco pasos trazados y visibles a la vez; ningún ScrollTrigger creado |
| CDI-08 | Dato ancla con `progress` = 1 | `13.243.219 ha` exacto, con su equivalencia con Inglaterra en el mismo bloque (D2) |
| CDI-09 | Dato ancla con `progress` = 0 | La cifra ya está en el DOM (I4) |
| CDI-10 | Bloque de marco fiscal y bloque de garantías | Ambos renderizan `<Disclaimer variant="inline">` (I7, E2) |
| CDI-11 | Sección de garantías | Contiene la aclaración explícita de que se protege la titularidad del activo, no el valor de la inversión (S3) |
| CDI-12 | Las cuatro garantías | Presentes con su pilar y su mecanismo, literales |
| CDI-13 | Escena con axe | Cero violaciones `critical` y `serious` |
| CDI-14 | Montaje y desmontaje | Cero ScrollTriggers vivos tras desmontar |
| CDI-15 | Fidelidad de contenido | Los cinco pasos y las cuatro garantías coinciden carácter a carácter con `content/secciones/04-estrategia-anticipatoria.md` (I1) |
| CDI-16 | Conversión derivada | La cifra de 132.432,19 km² **no** aparece en ninguna parte del sitio (D4) |
| CDI-17 | Regresión: actos previos | Los actos I a III siguen funcionando con el acto IV montado |

CDI-10 y CDI-11 son obligatorios: son los dos tests que convierten los requisitos legales de
`content/07-legal-y-disclaimers.md` en algo verificable en lugar de una intención.

---

## 4. Segunda feature

`No aplica` — este documento cubre una sola feature con dos bloques (diagrama y garantías)
especificados conjuntamente en §3.

---

## 5. Seguridad, permisos y aislamiento

- **I7:** el disclaimer en línea acompaña al marco fiscal y a las garantías. Verificado por CDI-10.
  Es la sección con más afirmaciones absolutas del dossier y la de mayor exposición legal.
- **I4, C5:** el SVG del diagrama lleva `aria-hidden`; la `<ol>` con los cinco pasos es contenido
  real en el DOM y es lo que anuncia el lector de pantalla.
- **I1:** el texto se reproduce literal, con sus absolutos. Las matizaciones sugeridas por
  `content/07-legal-y-disclaimers.md` se registran en deuda, no se aplican unilateralmente (E4).
- **I6:** ninguna mención de AEAT, ARCA, CNMV o CNV lleva logotipo. Solo texto.
- **I9:** sin WebGL en este acto (F2). El SVG del diagrama pesa por debajo de 40 KB.
- **D4:** la conversión derivada de las hectáreas a km² no se publica; verificado por CDI-16.

---

## 6. Textos de interfaz (claves orientativas)

| Clave | ES |
|-------|-----|
| `act4.cdiTitle` | Cómo funciona el Convenio de Doble Imposición |
| `act4.cdiStepLabel` | Paso |
| `act4.taxAdviceNote` | Información fiscal de carácter general. Su aplicación depende de su situación individual; consulte asesoramiento independiente. |
| `act4.guaranteesTitle` | Qué protege exactamente su capital |
| `act4.capitalProtectionNote` | Lo que se protege es la titularidad registral del activo, no el valor de la inversión. |
| `act4.anchorEquivalence` | equivalente a la extensión de Inglaterra |
| `act4.withholdingNote` | El convenio fija además topes máximos a la retención de dividendos y distribuciones de capital en origen. |

---

## 7. Plan de implementación (fases)

### Fase A — Contenido tipado y bloque estático

1. `src/scenes/04-marco-legal/content.ts` con los cinco pasos, las cuatro garantías, el dato ancla
   y los ocho factores de «¿Por qué Argentina?», literales.
2. `<Act4Scene>` estática: entradilla, dato ancla, lista ordenada de los cinco pasos, cuatro
   tarjetas de garantías, aclaración de S3, disclaimer y CTA. Sin animación ni diagrama.
3. `<AnchorStat>` y `<AreaComparison>` con la equivalencia con Inglaterra (D1, D2).
4. Registro de la escena en `src/app/sections.ts`.
5. Tests CDI-05, CDI-08, CDI-09, CDI-10, CDI-11, CDI-12, CDI-15, CDI-16.

**DoD fase A:** todo el contenido del acto es legible sin animación; los cinco pasos están en una
`<ol>` real; el disclaimer acompaña a ambos bloques; la aclaración de «Capital Protegido» es
explícita; la conversión derivada no aparece.

### Fase B — Diagrama del CDI

1. SVG propio del flujo España↔Argentina, con texto real y `aria-hidden` (F2, F5, CDI-06).
2. `<ProcessDiagram>` genérico y reutilizable, con `steps`, `drawProgress`, `stepGlow` y
   orientación (F6).
3. Trazado con `DrawSVG`; nodos e iluminación del paso activo con `gsap`.
4. Reflujo a vertical en viewport estrecho.
5. Nota de topes de retención tras el diagrama (F7) y nota de asesoramiento (E3).
6. Tests CDI-06, CDI-13.

**DoD fase B:** el diagrama existe y es navegable manualmente paso a paso; el texto del SVG es
texto real; a 200 % de zoom no se recorta ni obliga a scroll horizontal.

### Fase C — Coreografía y garantías animadas

1. `choreographAct4` como función pura, con el invariante de paso único activo (§3.3).
2. Anclaje y scrub con `useGsapScene`; altura `550vh`.
3. Cableado de `drawProgress` y `stepGlow` al diagrama.
4. `<GuaranteeCards>` con entrada escalonada, extraída a `src/components/` para el documento 06 (S4).
5. Iconos de trazo lineal para los cuatro pilares.
6. Tests CDI-01, CDI-02, CDI-03, CDI-04, CDI-07, CDI-14.

**DoD fase C:** los cinco pasos se trazan en orden con el scroll, siempre exactamente uno activo
(CDI-03); un paso trazado nunca se destraza (CDI-04); con movimiento reducido los cinco aparecen
trazados a la vez.

### Fase D — Dato ancla, fondo y cierre

1. `<AnchorStat>` con `<CountUp>` ligado a `anchorProgress` y cierre exacto vía `src/lib/counter.ts`.
2. `<AreaComparison>`: las 13.243.219 ha frente a Inglaterra, a escala.
3. `<DualFigure>` con `MMXXIV` / `2024` (D3).
4. Transición de fondo de navy a marfil a lo largo del acto (G1).
5. CTA intermedio (G3) y `<ActSeal>` de transición al acto V.
6. Tests CDI-17.

**DoD fase D:** el dato ancla cierra exacto y nunca aparece sin su equivalencia; el fondo se aclara
progresivamente; los actos previos siguen intactos.

### Fase E — Cierre documental y gates globales

1. Marcar el DoD de §8 y la fila 04 del roadmap como «hecho en branch».
2. Registrar en `docs/debt/technical-debt.md` las filas de §12, incluidas las matizaciones de copy
   pendientes de la asesoría legal (E4) y la fotografía a sustituir (G2).
3. Ejecutar todos los gates del perfil §5.
4. Limpieza residual: iconos no usados, nodos huérfanos del SVG.

**DoD fase E:** los cinco gates del perfil §5 en verde, ejecutados de verdad.

---

## 8. Criterios de aceptación (DoD)

### 8.1 Diagrama del CDI

- [x] Los cinco pasos se trazan en orden con el scroll, siempre exactamente uno activo.
- [x] Un paso ya trazado nunca se destraza al avanzar.
- [x] El texto del SVG es texto real, no trazado a curvas.
- [x] La `<ol>` con los cinco pasos completos está siempre en el DOM.
- [x] El diagrama reflúye a vertical en viewport estrecho sin perder el orden.
- [x] Con movimiento reducido, los cinco pasos aparecen trazados a la vez.
- [x] `<ProcessDiagram>` es genérico y lo puede reutilizar el documento 06.

### 8.2 Garantías y marco legal

- [x] Las cuatro garantías están con su pilar y su mecanismo literales.
- [x] La aclaración de que se protege la titularidad y no el valor es explícita y visible.
- [x] El disclaimer en línea acompaña al marco fiscal y a las garantías.
- [x] La nota de asesoramiento independiente acompaña al diagrama.
- [x] El dato de 13.243.219 ha cierra exacto y nunca aparece sin su equivalencia.
- [x] La conversión derivada a km² no aparece en ninguna parte.
- [x] Los diecisiete tests CDI-01…CDI-17 existen y pasan.

### 8.3 Global

- [x] `docs/product/roadmap.md` fila 04 actualizada a «hecho en branch».
- [x] Lo no cubierto → filas honestas en `docs/debt/technical-debt.md`.
- [x] Se respetan el idioma y la política de comentarios del perfil §1.
- [x] No se modificó ninguna zona protegida del perfil §6 sin autorización de C3.
- [x] Todos los gates del perfil §5 en verde, ejecutados de verdad.
- [x] Ningún invariante del perfil §7 roto en la superficie tocada.

---

## 9. Fuera de alcance (v1)

| Ítem | Notas |
|------|-------|
| Calculadora de ahorro fiscal | Requiere supuestos fiscales que el dossier no aporta y expone legalmente |
| Texto completo del convenio bilateral | Documento 07, como página de detalle |
| Matización del copy con afirmaciones absolutas | E4: decisión de la asesoría legal del cliente |
| Fotografía del Obelisco | G2: se descarta por calidad; falta fotografía profesional con licencia |
| Publicación de la conversión derivada a km² | D4: marcada como no validada en el propio canon de contenido |
| Página de detalle del acto IV | Documento 07 |
| Adaptación móvil | Documento 08 |

---

## 10. Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| El diagrama es bonito pero el lector de pantalla no recibe los cinco pasos | C5 + CDI-05 + CDI-06: la `<ol>` es el contenido y el SVG va `aria-hidden` |
| Dos pasos activos a la vez, o ninguno, en mitad de una transición | Invariante de la coreografía + CDI-03, que falla si no hay exactamente uno |
| El nombre «Capital Protegido» se lee como producto de capital garantizado | S3 + CDI-11: aclaración explícita y verificada por test |
| Las afirmaciones absolutas del dossier salen sin disclaimer y exponen a la firma | I7 + E2 + CDI-10, que exige el disclaimer en ambos bloques |
| Alguien «arregla» el copy para matizar los absolutos y rompe la fidelidad al canon | I1 + E4 + CDI-15: la matización se registra en deuda, no se aplica |
| El texto del SVG se traza a curvas al exportar desde el editor de diseño | CDI-06 lo verifica explícitamente |
| La conversión derivada a km² acaba publicada como si fuera dato del dossier | D4 + CDI-16 |
| El diagrama se recorta a 200 % de zoom | Reflujo a vertical (F5) y comprobación manual en §11 |

---

## 11. Casos de prueba mínimos (checklist de revisión)

- [ ] Llego al acto IV y el fondo empieza a aclararse: se nota que cambia el tono del relato.
- [ ] Veo las 13.243.219 hectáreas y, en el mismo bloque, que equivalen a Inglaterra.
- [ ] Hago scroll: el diagrama del CDI se traza paso a paso, de Argentina a España.
- [ ] En cada momento hay un solo paso iluminado; los anteriores quedan trazados y atenuados.
- [ ] Selecciono el texto del diagrama con el ratón: es texto, no un dibujo.
- [ ] Con un lector de pantalla recorro los cinco pasos completos.
- [ ] Veo las cuatro garantías con su icono y su mecanismo.
- [ ] Leo, sin buscarlo, que lo que se protege es la titularidad y no el valor de la inversión.
- [ ] El disclaimer está junto al marco fiscal y junto a las garantías, no solo en el pie.
- [ ] Pongo el zoom del navegador al 200 %: el diagrama reflúye y no obliga a scroll horizontal.
- [ ] Activo «reducir movimiento»: veo los cinco pasos trazados a la vez y todo el contenido.

---

## 12. Deuda explícita (registrar al implementar)

### 12.1 E2E — Recorrido del diagrama del CDI

- Historia: como visitante, recorro el acto IV y veo los cinco pasos del convenio trazarse en
  orden, terminando en la afirmación de que no se tributa dos veces.
- Detectada en: este doc §7 fase C. Sin E2E en v1 (perfil §3).

### 12.2 Matización del copy pendiente de asesoría legal

- `content/07-legal-y-disclaimers.md` propone matizar siete afirmaciones absolutas de este acto
  («garantizando máxima seguridad jurídica», «elimina de raíz», «jamás se tributen dos veces»…).
  Se reproduce el literal por I1; la matización requiere decisión del cliente y de su asesoría.
- Detectada en: este doc §2.5 E4.

### 12.3 Fotografía profesional pendiente

- La fotografía del Obelisco del dossier se descarta por calidad (G2). Falta material fotográfico
  profesional con licencia para este acto.
- Detectada en: `content/04-assets-visuales.md` §Problemas detectados, punto 5.

### 12.4 Página de detalle del marco fiscal

- El acto resume el convenio en cinco pasos. La explicación completa —créditos, topes de retención,
  acreditación ante la AEAT, desinversión— necesita su página de detalle.
- Detectada en: este doc §9. Corresponde al documento 07.

---

## 13. Referencias de código (pre-feature)

| Área | Rutas |
|------|-------|
| Contenido literal del acto IV | `content/secciones/04-estrategia-anticipatoria.md` |
| Dato de las hectáreas | `content/03-datos-y-tablas.md` |
| Disclaimer y afirmaciones a matizar | `content/07-legal-y-disclaimers.md` |
| Fotografía descartada | `public/assets-origen/p11-X43.png` |
| Motor y primitivas | `src/motion/`, `src/components/` (documento 00) |
| Contadores con cierre exacto | `src/lib/counter.ts` (documento 03) |
| Comparativa pareada | `src/components/PairedComparison.tsx` (documento 03) |

---

## 14. Orden de trabajo sugerido en el branch

```text
main
  Fase A  → contenido tipado + bloque estático con lista de pasos y disclaimer
  Fase B  → diagrama del CDI en SVG, genérico y reutilizable
  Fase C  → coreografía del trazado y garantías escalonadas
  Fase D  → dato ancla, comparación de superficies, fondo y cierre
  Fase E  → docs + deuda + gates
```

Dependencias duras: todo requiere los documentos 00 a 03 cerrados. B necesita el contenido tipado
de A; C necesita el diagrama de B para animarlo; D reutiliza `src/lib/counter.ts` del documento 03.
E es siempre la última.

---

*Documento vivo de implementación. Actualizar los checkboxes del DoD y el estado del encabezado
al cerrar cada fase.*

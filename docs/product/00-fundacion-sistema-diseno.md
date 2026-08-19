# Fundación técnica, sistema de diseño y motor de movimiento

**Estado:** especificación canónica (decisiones cerradas 2026-08-17). Pendiente de implementación.
**Branch de trabajo:** el HEAD actual del worktree (`main`, sin commits todavía).
**Perfil de proyecto:** [`agent-docs/goal-profile.md`](../../agent-docs/goal-profile.md) — invariantes §7 aplicables: I1, I2, I3, I4, I5, I6, I7, I8, I9.
**Roadmap:** [`roadmap.md`](roadmap.md) §2, fila 00.
**Relacionado:** ninguno. Este es el primer documento; todos los demás dependen de él.

Este documento manda sobre el andamiaje técnico, el sistema de diseño, las primitivas de
animación y el shell de aplicación del sitio de OPTIMVS Capital Protegido. **No construye
ninguna escena de contenido**: crea el suelo sobre el que los documentos 01–08 las montan.

| Referencia | Tema | Resumen v1 |
|------------|------|------------|
| **roadmap §2 fila 00** | Fundación | Proyecto Vite + React + TS que arranca, con tokens de diseño derivados de la marca real, primitivas GSAP/Lenis con limpieza verificada, y un shell navegable con CTA persistente. |

---

## 1. Contexto del software actual (punto de partida)

### 1.1 Repositorio

| Pieza | Ubicación | Comportamiento |
|-------|-----------|----------------|
| Canon de contenido | `content/` | 20 ficheros markdown con todo el contenido del dossier, ya estructurado e indexado en `content/README.md`. Zona protegida (perfil §6). |
| Assets originales | `public/assets-origen/` | 13 PNG extraídos del PDF: logotipo, mapas de riesgo, imagen satelital, fotografía. Zona protegida. |
| Guía de estilo visual | `content/05-guia-estilo-visual.md` | Paleta muestreada de los assets reales, tipografía, componentes recurrentes, movimiento. |
| Requisitos funcionales | `content/06-requisitos-funcionales.md` | Navegación, SEO, WCAG 2.1 AA, rendimiento, cookies. |
| Loop de implementación | `agent-docs/`, `.claude/` | Perfil, protocolo, plantillas y subagentes. Zona protegida. |

**No existe** ningún fichero de código, ni `package.json`, ni `src/`. El repositorio está en
`main` sin commits.

### 1.2 Marca

| Pieza | Estado |
|-------|--------|
| Logotipo | Solo PNG rasterizado con fondo blanco opaco (`public/assets-origen/p12-X47.png`). Sin vectorial, sin canal alfa. Bloqueo B-04. |
| Paleta | Muestreada de los assets: navy `#102135`, oro `#B8974F`, marfil, escala de riesgo. `content/05-guia-estilo-visual.md`. |
| Tipografía | Sin definir. El wordmark usa capitales romanas serif + sans en versalitas. |

---

## 2. Decisiones cerradas (no reabrir en v1)

### 2.1 Comunes

| # | Tema | Decisión |
|---|------|----------|
| C1 | Idioma | Textos de usuario en español de España con tratamiento de usted; identificadores y código en inglés (perfil §1). |
| C2 | Tests | Cobertura ≥ 80 % en `src/lib/**` y `src/hooks/**` (perfil §5). Las primitivas de `src/motion/` quedan fuera del umbral pero exigen test de contenido, de `prefers-reduced-motion` y de limpieza al desmontar. Sin E2E en v1: deuda explícita en §12. |
| C3 | Zonas protegidas | No se toca `content/`, `public/assets-origen/`, `goal-loop-kit/`, `agent-docs/goal-loop.md`, `agent-docs/templates/` ni `.claude/agents|skills/` (perfil §6). Este documento autoriza crear `src/`, `public/` (fuera de `assets-origen/`), `index.html`, ficheros de configuración en la raíz y `docs/`. |
| C4 | Invariantes | Aplican los nueve del perfil §7. Este documento **crea los mecanismos** que los hacen cumplibles: `useReducedMotionSafe` (I3), `<Disclaimer>` (I7), `.env.example` (I8), división de chunks (I9), constantes marcadas como pendientes (I2). |
| C5 | Fundación ≠ contenido | Este documento no renderiza ni una frase del dossier salvo en la página de muestra del sistema de diseño, que usa texto de relleno explícitamente marcado. El contenido real lo montan los documentos 01–08. |

### 2.2 Andamiaje técnico

| # | Tema | Decisión |
|---|------|----------|
| F1 | Bundler y framework | Vite 6 + React 19 + TypeScript en modo `strict`, con `noUncheckedIndexedAccess` y `exactOptionalPropertyTypes` activos. |
| F2 | Tests | Vitest con entorno `jsdom` + React Testing Library + `@testing-library/user-event` + `vitest-axe`. Sin Jest, sin Enzyme. |
| F3 | Lint y formato | ESLint 9 en formato flat config con `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y` y `eslint-plugin-import`. Prettier para formato. |
| F4 | Alias de import | `@/` apunta a `src/`. Declarado a la vez en `tsconfig.json` y en `vite.config.ts`; una sola fuente de verdad para las rutas. |
| F5 | Variables de entorno | Solo `VITE_*`. Se commitea `.env.example` con las claves y sin valores; `.env` está en `.gitignore` (I8). Un helper tipado en `src/lib/env.ts` lee y valida; una variable ausente falla con un mensaje claro en desarrollo y no rompe la build de producción. |
| F6 | Despliegue | `render.yaml` de tipo `static` con `buildCommand: npm ci && npm run build`, `staticPublishPath: dist` y regla de reescritura `/*` → `/index.html` para el enrutado en cliente. |
| F7 | Presupuesto de bundle | Script `build:budget` que lee la salida de `npm run build` y falla si el chunk de entrada supera 250 KB gzip o si `three`, `@react-three/*` o `postprocessing` aparecen en él (perfil §5, I9). |
| F8 | Enrutado | `react-router` en modo declarativo. La home es `/`; las páginas de detalle se registran en el documento 07. Scroll restaurado al principio en cada navegación. |

### 2.3 Sistema de diseño

| # | Tema | Decisión |
|---|------|----------|
| S1 | Paleta | Los valores de `content/05-guia-estilo-visual.md`, sin reinterpretar: navy `#102135`, navy medio `#1A2C42`, navy tinta `#21293D`, marfil `#F7F5F0`, oro alto `#FFEEB2`, oro medio `#B8974F`, oro bronce `#8E6D3F`, oro apagado `#8A7A55`. |
| S2 | Escala de riesgo | `#9B1E22` extremo, `#C6772C` elevado, `#DFCC4C` latente, `#2B498F` estabilidad. **Uso exclusivo** en los mapas del acto II; prohibido reutilizarlos como colores de interfaz. |
| S3 | Identificadores de país | España = oro apagado `#8A7A55`; Argentina = azul de estabilidad `#2B498F`. Consistente en todo el sitio. **Prohibido** usar emoji de bandera como único identificador: no renderizan en Windows. |
| S4 | Tokens | Custom properties CSS en `src/styles/tokens.css`, tipadas y reexportadas desde `src/lib/tokens.ts` para consumo en JS (shaders, GSAP). Un color no existe si no es un token. |
| S5 | Tema claro/oscuro | Paleta completa definida en `:root` (claro). Redefinición de tokens bajo `@media (prefers-color-scheme: dark)` con guarda `:root:not([data-theme="light"])` y bajo `:root[data-theme="dark"]`. Ningún color tiene su única definición dentro de un bloque de media query. |
| S6 | Tipografía | Display: **Cinzel** (capitales inscripcionales romanas) para `h1`–`h2` y numerales. Cuerpo: **Inter** para todo lo demás, con cifras tabulares activadas en tablas y contadores. Autoalojadas en `public/fonts/` con subconjunto latino y `font-display: swap`; sin peticiones a CDN. |
| S7 | Escala tipográfica | Base 18 px, ratio 1,25, fluida con `clamp()`. `h1` 56–72 px, `h2` 40–48 px, `h3` 28–32 px, cuerpo 18 px, cifra destacada 64–96 px, nota 14–15 px. Ancho de lectura 65–75 caracteres. |
| S8 | Numerales romanos | Componente `<RomanNumeral>` que convierte un entero 1–3999 y renderiza `<span lang="la">` con el arábigo en `aria-label`. Nunca se escribe un numeral romano a mano. La conversión vive en `src/lib/roman.ts` como función pura. |
| S9 | Doble numeral | Componente `<DualFigure>` para las cifras ancla: muestra el arábigo como valor principal y el romano como marca secundaria (`XIV` / `14 %`). El romano es decorativo y va con `aria-hidden`. |
| S10 | Primitivas de contenido | `<StatFigure>` (cifra grande + glosa), `<CountUp>` (contador con `aria-live="off"` y valor final siempre en el DOM), `<PullQuote>` (cita con filete de oro), `<Disclaimer>` (aviso financiero canónico, I7), `<PendingValue>` (marcador visible para datos no confirmados, I2). |
| S11 | Formato de cifras | Un único helper en `src/lib/format.ts`: millares con punto, decimales con coma, unidades pospuestas. `formatNumber`, `formatArea`, `formatDensity`, `formatPercent`, `formatCurrency`. Prohibido `toLocaleString` suelto en un componente. |

### 2.4 Motor de movimiento

| # | Tema | Decisión |
|---|------|----------|
| M1 | Librerías | GSAP 3 con ScrollTrigger, SplitText, MorphSVG, DrawSVG, Observer y Flip. Lenis para el scroll suave. `@gsap/react` para `useGSAP`. Todo gratuito y con uso comercial cubierto desde abril de 2025. |
| M2 | Paginación | **Pin + scrub**, no `scroll-snap` duro. El snap obligatorio pelea contra el scrub y contra el scroll suave de Lenis. Cada escena se ancla y ocupa la pantalla mientras su timeline se reproduce con el scroll: se percibe como paginación sin sus defectos. |
| M3 | Integración Lenis ↔ ScrollTrigger | Un único proveedor `MotionProvider` en `src/motion/` crea la instancia de Lenis, la conecta al `ticker` de GSAP y a `ScrollTrigger.update`, y desactiva el suavizado de GSAP (`lagSmoothing(0)`). Una sola instancia en toda la aplicación. |
| M4 | Contrato de coreografía | La timeline de una escena es una **función pura** `choreograph(progress: number): SceneState` en su `timeline.ts`, testeable sin DOM ni GSAP. `Scene.tsx` solo aplica el estado devuelto. Esto es lo que hace testeable una animación. |
| M5 | Hook canónico | `useGsapScene({ ref, choreograph, apply, scrub, pin })` encapsula el registro con `gsap.context()`, la creación del ScrollTrigger y su `revert()` al desmontar. **Ningún componente crea un ScrollTrigger a mano** (I5). |
| M6 | Movimiento reducido | `useReducedMotionSafe()` devuelve `true` si el usuario pide movimiento reducido. `useGsapScene` lo consulta: en ese caso no crea ScrollTrigger, no ancla, y aplica el estado de `choreograph(1)` — el **final** de la coreografía, que es el estado más informativo (I3). |
| M7 | Componente `<Scene>` | Envoltorio que reserva la altura declarada antes de montar nada (evita desplazamiento de layout, I9), aplica el fondo del acto, expone el `ref` y renderiza `children`. Toda escena de la home se monta dentro de un `<Scene>`. |
| M8 | Fondo por acto | El color de fondo del documento transiciona entre actos mediante una variable CSS animada por el progreso global de scroll, no por cambios de clase. Cada acto declara su par (fondo, tinta) en su `content.ts`. |
| M9 | Carga de escenas pesadas | `src/three/` se importa siempre por `React.lazy`. `<Scene>` acepta un `fallback` estático que se renderiza mientras carga y que ya contiene el contenido textual completo (I4, I9). |
| M10 | Progreso de lectura | `useScrollProgress()` expone el progreso global 0→1. Lo consumen el miliario de navegación y el fondo por acto. Una sola fuente. |

### 2.5 Shell de aplicación

| # | Tema | Decisión |
|---|------|----------|
| D1 | Navegación | Barra superior que aparece al salir del hero. Máximo 5 entradas + CTA persistente. Marca la sección activa. Compensa su propia altura al saltar a un ancla. |
| D2 | Miliario | El indicador de progreso es una columna vertical con una marca por acto, numeradas en romano (I–VII) con `<RomanNumeral>`. Es el elemento romano estructural del sitio, no un adorno. |
| D3 | CTA | Un solo verbo en todo el sitio: **reservar**. Texto canónico del botón primario: «Reservar sesión privada». Prohibido alternar con «solicitar», «agendar» o «pedir cita». |
| D4 | Registro de secciones | Las escenas se registran en un manifiesto tipado `src/app/sections.ts` con `{ id, act, label, href, order }`. La navegación, el miliario y el sitemap se derivan de él. Añadir un acto es añadir una fila. |
| D5 | Footer | Estructura de `content/secciones/08-cta-contacto.md`: navegación, legales, contacto, redes, fuentes y disclaimer. En este documento se crea con marcadores `<PendingValue>` donde faltan datos (I2); el documento 06 lo puebla. |
| D6 | Error boundary | Un límite de error por ruta que muestra un mensaje sobrio en español y no pierde la navegación. Una escena que falla no tumba la página. |
| D7 | Enlace de salto | Enlace «Saltar al contenido» como primer elemento enfocable. Obligatorio en un sitio de scroll largo. |

---

## 3. Fundación — Especificación de implementación

### 3.1 Objetivo de negocio

El sitio tiene un único objetivo de conversión: que el visitante reserve una sesión privada de
diagnóstico patrimonial. Todo lo que este documento construye existe para que las siete escenas
del relato puedan montarse rápido, verse impecables y no romperse: un sistema de diseño derivado
de la marca real, primitivas de animación que se limpian solas y un shell donde el CTA está
siempre a un clic.

### 3.2 Modelo de datos (contenido y estado)

**Manifiesto de secciones** — `src/app/sections.ts`:

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | `string` | Ancla, sin `#`. Estable: la navegación y el sitemap dependen de él |
| `act` | `number \| null` | 1–7 para los actos; `null` para hero, contacto y footer |
| `label` | `string` | Texto corto para la navegación |
| `navGroup` | `string \| null` | Agrupación en la barra: máximo 5 grupos (D1) |
| `order` | `number` | Orden en la home |
| `background` | `{ surface: string; ink: string }` | Tokens del fondo del acto (M8) |

**Estado de escena** — `src/motion/types.ts`:

```ts
type SceneState = Record<string, number | string>
type Choreograph = (progress: number) => SceneState
```

Una coreografía es una función pura. Sin `this`, sin DOM, sin efectos.

**Entorno** — `src/lib/env.ts` valida y expone:

| Clave | Requerida en | Notas |
|-------|--------------|-------|
| `VITE_EMAILJS_SERVICE_ID` | doc 06 | Pública por diseño |
| `VITE_EMAILJS_TEMPLATE_ID` | doc 06 | Pública por diseño |
| `VITE_EMAILJS_PUBLIC_KEY` | doc 06 | Pública por diseño |
| `VITE_SITE_URL` | doc 07 | Base para canonical y sitemap |

En este documento solo se crea el helper y `.env.example`; las claves las consumen documentos
posteriores.

### 3.3 Algoritmo canónico (pseudocódigo)

**Ciclo de vida de una escena animada** — el contrato que hace cumplir I3 y I5:

```text
useGsapScene({ ref, choreograph, apply, scrub, pin, height }):

  reduced := prefiere_movimiento_reducido()

  si reduced:
    aplicar(choreograph(1))            # el final de la coreografía: el estado más informativo
    no crear ScrollTrigger
    no anclar
    return

  contexto := gsap.context(() => {
      trigger := ScrollTrigger.create({
        trigger:  ref,
        start:    "top top",
        end:      "+=" + height,
        pin:      pin,
        scrub:    scrub,
        onUpdate: (self) => aplicar(choreograph(self.progress)),
      })
      aplicar(choreograph(0))          # estado inicial explícito, sin esperar al primer scroll
  }, ref)

  al desmontar:
    contexto.revert()                  # destruye timelines, triggers y estilos inline
    afirmar ScrollTrigger.getAll() sin instancias de esta escena
```

_Un solo hook. **Prohibido** que un componente cree un `ScrollTrigger`, un `gsap.timeline` o un
`requestAnimationFrame` por su cuenta._

**Conversión a numeral romano** — `src/lib/roman.ts`:

```text
toRoman(n):
  si n no es entero               -> error RangeError
  si n < 1 o n > 3999             -> error RangeError
  tabla := [(1000,"M"),(900,"CM"),(500,"D"),(400,"CD"),(100,"C"),(90,"XC"),
            (50,"L"),(40,"XL"),(10,"X"),(9,"IX"),(5,"V"),(4,"IV"),(1,"I")]
  resultado := ""
  para cada (valor, simbolo) en tabla:
    mientras n >= valor:
      resultado += simbolo
      n -= valor
  devolver resultado
```

### 3.4 Superficies a unificar

| Punto | Fichero | Nota |
|-------|---------|------|
| Creación de animaciones con scroll | `src/motion/useGsapScene.ts` | Única puerta de entrada |
| Instancia de scroll suave | `src/motion/MotionProvider.tsx` | Una sola en toda la app (M3) |
| Progreso global de scroll | `src/motion/useScrollProgress.ts` | Consumido por miliario y fondo |
| Formato de cifras | `src/lib/format.ts` | Prohibido `toLocaleString` suelto |
| Numerales romanos | `src/lib/roman.ts` + `<RomanNumeral>` | Prohibido escribirlos a mano |
| Definición de colores | `src/styles/tokens.css` + `src/lib/tokens.ts` | Un color sin token no existe |
| Registro de secciones | `src/app/sections.ts` | Navegación, miliario y sitemap derivan de aquí |

### 3.5 Migración / recálculo de datos existentes

`No aplica` — proyecto nuevo, sin datos previos.

### 3.6 Casos límite

- **Sin JavaScript:** el HTML no renderiza (es una SPA). Se acepta en v1 y se registra en §12.
  Lo que **sí** se garantiza es que con JS y `prefers-reduced-motion` el contenido es completo.
- **`prefers-reduced-motion` cambiado en caliente:** el hook escucha el cambio de la media query
  y reconstruye o destruye las animaciones sin recargar.
- **Redimensionado de ventana:** `ScrollTrigger.refresh()` con `debounce`; las alturas ancladas
  se recalculan. Ninguna escena queda descuadrada tras rotar el dispositivo.
- **Fuente que tarda en cargar:** `font-display: swap` y métricas de respaldo declaradas para
  que el intercambio no desplace el layout (I9).
- **`toRoman` fuera de rango:** lanza `RangeError`. El componente `<RomanNumeral>` no captura:
  un acto número 0 es un error de programación, no un caso de usuario.
- **Navegación a un ancla inexistente:** no rompe; el router deja la posición actual y registra
  un aviso en desarrollo.
- **WebGL no disponible:** `<Scene>` renderiza su `fallback` estático permanentemente (M9).

### 3.7 API de componentes (contrato de props)

| Componente | Props | Notas |
|------------|-------|-------|
| `<Scene>` | `id, act?, height, background, fallback?, children` | Reserva altura antes de montar (I9) |
| `<RomanNumeral>` | `value: number, decorative?: boolean` | `RangeError` fuera de 1–3999 |
| `<DualFigure>` | `value: number, suffix?: string, roman?: boolean` | Romano decorativo, `aria-hidden` |
| `<StatFigure>` | `value: ReactNode, label: string, source?: string` | `source` cita el origen del dato (I1) |
| `<CountUp>` | `to: number, from?: number, format: (n:number)=>string, progress?: number` | Valor final siempre en el DOM (I4) |
| `<PullQuote>` | `children, cite?: string` | Filete de oro, ancho reducido |
| `<Disclaimer>` | `variant: "footer" \| "inline"` | Texto canónico único (I7) |
| `<PendingValue>` | `label: string, debtId: string` | Marcador visible; `debtId` apunta a la fila de deuda (I2) |
| `<Milestone>` | `sections: Section[], progress: number` | El miliario (D2) |

### 3.8 Tests golden Fundación (mínimos)

Prefijo estable **`FND`**.

| ID | Escenario | Esperado |
|----|-----------|----------|
| FND-01 | `toRoman` con 1, 4, 9, 14, 40, 90, 400, 1994, 2024, 3999 | `I`, `IV`, `IX`, `XIV`, `XL`, `XC`, `CD`, `MCMXCIV`, `MMXXIV`, `MMMCMXCIX` |
| FND-02 | `toRoman` con 0, −1, 4000, 1.5, `NaN` | `RangeError` en los cinco casos |
| FND-03 | `formatNumber(2780400)`, `formatDensity(96.05)`, `formatPercent(14)` | `2.780.400`, `96,05 hab/km²`, `14 %` |
| FND-04 | `formatArea(13243219)` en hectáreas | `13.243.219 ha` |
| FND-05 | `choreograph` de la escena de muestra en `progress` 0, 0.5 y 1 | Estados exactos y deterministas; misma entrada, misma salida |
| FND-06 | Escena montada y desmontada | `ScrollTrigger.getAll()` no contiene ninguna instancia de la escena tras desmontar |
| FND-07 | Escena renderizada con `prefers-reduced-motion: reduce` | No se crea ningún ScrollTrigger; el contenido textual es **idéntico** al de la ruta animada |
| FND-08 | `<Scene>` antes de montar su contenido pesado | Reserva la altura declarada; el `fallback` contiene ya el texto completo |
| FND-09 | `<RomanNumeral value={4} />` | Renderiza `IV` con `aria-label="4"` y `lang="la"` |
| FND-10 | `<CountUp to={96.05} progress={0} />` | El valor final `96,05` está en el DOM aunque el progreso sea 0 (I4) |
| FND-11 | `<PendingValue>` en el footer | Renderiza un marcador visible, nunca un teléfono o dominio plausible (I2) |
| FND-12 | Página de muestra del sistema de diseño con axe | Cero violaciones `critical` y `serious` |
| FND-13 | Shell renderizado | El enlace «Saltar al contenido» es el primer elemento enfocable |
| FND-14 | `env.ts` con una variable requerida ausente | Falla con mensaje explícito en desarrollo; no expone ningún valor por defecto inventado |
| FND-15 | Regresión: `npm run build` | El chunk de entrada no contiene `three`, `@react-three/*` ni `postprocessing` (I9) |

FND-15 es obligatorio: es el único test que demuestra que la decisión de rendimiento no se ha
erosionado al añadir dependencias.

---

## 4. Segunda feature

`No aplica` — este documento cubre una sola feature.

---

## 5. Seguridad, permisos y aislamiento

Sin backend, sin autenticación y sin datos de usuario en esta fase. Lo que sí aplica:

- **Sin secretos en el bundle** (I8): solo `VITE_*` con valor público. `.env` en `.gitignore`,
  `.env.example` commiteado sin valores. `src/lib/env.ts` es la única lectura de `import.meta.env`.
- **Sin peticiones a terceros en la carga inicial**: fuentes autoalojadas, sin CDN, sin píxeles.
  Coherente con un sitio cuyo argumentario critica la vigilancia digital.
- **Sin cookies** en esta fase. El banner de consentimiento y la analítica los introduce el
  documento 07.
- **Sin logotipos de organismos** (I6): la carpeta `public/` no contiene ningún asset con nombre
  de regulador.
- **Cabeceras de seguridad** declaradas en `render.yaml`: `X-Content-Type-Options`,
  `Referrer-Policy`, `X-Frame-Options`.

---

## 6. Textos de interfaz (claves orientativas)

| Clave | ES |
|-------|-----|
| `nav.skipToContent` | Saltar al contenido |
| `nav.menu` | Menú |
| `nav.close` | Cerrar |
| `cta.primary` | Reservar sesión privada |
| `cta.secondary` | Descargar dossier |
| `cta.sticky` | Reservar sesión |
| `footer.rights` | Todos los derechos reservados. |
| `footer.sources` | Fuentes |
| `pending.label` | Dato pendiente de confirmación |
| `error.title` | No hemos podido mostrar esta sección |
| `error.body` | Puede continuar navegando por el resto de la página. |
| `error.retry` | Reintentar |
| `disclaimer.short` | Toda inversión conlleva riesgo, incluida la pérdida del capital. Esta información no constituye asesoramiento de inversión. |

El texto largo del disclaimer sale literal de `content/07-legal-y-disclaimers.md`.

---

## 7. Plan de implementación (fases)

### Fase A — Andamiaje del proyecto

1. `package.json` con React 19, Vite 6, TypeScript strict, Vitest, RTL, `vitest-axe`, ESLint 9
   flat config, Prettier y los scripts del perfil §4.
2. `tsconfig.json` en `strict` con `noUncheckedIndexedAccess` y `exactOptionalPropertyTypes`;
   alias `@/` declarado a la vez en `tsconfig.json` y `vite.config.ts` (F4).
3. `vite.config.ts` con React, alias, y `manualChunks` que aísla `three`/`@react-three/*`/
   `postprocessing` en su propio chunk (F7, I9).
4. `vitest.config.ts` con entorno `jsdom`, `setupFiles` que registra los matchers de RTL y axe,
   y `coverage` limitado al alcance del perfil §5.
5. `src/lib/env.ts` con lectura tipada y validada; `.env.example` con las cuatro claves y sin
   valores (F5, I8).
6. `src/lib/format.ts` y `src/lib/roman.ts` como funciones puras, con sus tests.
7. `render.yaml` estático con reescritura SPA y cabeceras de seguridad (F6).
8. `index.html` con `lang="es-ES"`, metadatos base y precarga de las dos fuentes.
9. `scripts/check-budget.mjs` para `npm run build:budget` (F7).

**DoD fase A:** `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm test` y
`npm run build` se ejecutan y pasan. Tests FND-01 a FND-04 y FND-14 en verde. `.env` no está en
el índice de git. `npm run build:budget` pasa sobre una build vacía.

### Fase B — Sistema de diseño

1. `src/styles/tokens.css` con la paleta completa de S1–S3, escala tipográfica S7, espaciado y
   radios; los tres estados de tema de S5.
2. `src/lib/tokens.ts` reexportando los tokens para consumo en JS.
3. Fuentes Cinzel e Inter autoalojadas en `public/fonts/` con subconjunto latino, `font-display:
   swap` y métricas de respaldo (S6).
4. `src/styles/base.css`: reset, tipografía base, ancho de lectura, foco visible.
5. Primitivas de S8–S11: `<RomanNumeral>`, `<DualFigure>`, `<StatFigure>`, `<CountUp>`,
   `<PullQuote>`, `<Disclaimer>`, `<PendingValue>`.
6. Página de muestra en `/design` que exhibe todos los tokens y componentes con texto de relleno
   explícitamente marcado (C5).

**DoD fase B:** tests FND-03, FND-09, FND-10, FND-11 y FND-12 en verde. Ningún color literal
fuera de `tokens.css`. La página de muestra pasa axe sin violaciones `critical` ni `serious`.
Contraste verificado: el oro `#B8974F` no se usa para texto pequeño.

### Fase C — Motor de movimiento

1. `MotionProvider` con la instancia única de Lenis conectada al ticker de GSAP y a
   `ScrollTrigger.update`, con `lagSmoothing(0)` (M3).
2. `src/motion/types.ts` con el contrato `Choreograph` (M4).
3. `useReducedMotionSafe()` reactivo al cambio de la media query (M6, §3.6).
4. `useGsapScene()` según el pseudocódigo de §3.3, con `gsap.context()` y `revert()` (M5, I5).
5. `useScrollProgress()` como única fuente del progreso global (M10).
6. `<Scene>` con reserva de altura, fondo por acto y `fallback` (M7, M9, I9).
7. Escena de muestra en `/design` que ejercita pin, scrub, reduced-motion y desmontaje.

**DoD fase C:** tests FND-05, FND-06, FND-07 y FND-08 en verde. Ningún componente crea un
ScrollTrigger fuera de `useGsapScene`. El desmontaje deja cero instancias vivas. Con
`prefers-reduced-motion` activo no se crea ningún ScrollTrigger y el contenido es idéntico.

### Fase D — Shell de aplicación

1. `src/app/sections.ts` con el manifiesto tipado (D4), poblado con las entradas de los siete
   actos aunque sus escenas aún no existan.
2. Router con la home y una ruta de detalle marcador; scroll al principio en cada navegación (F8).
3. Barra de navegación con aparición al salir del hero, agrupación en 5 entradas, sección activa
   y compensación de altura al saltar a un ancla (D1).
4. `<Milestone>`: el miliario con marcas por acto en numeral romano (D2).
5. CTA persistente con el texto canónico de D3.
6. Footer con la estructura de `content/secciones/08-cta-contacto.md`, usando `<PendingValue>`
   donde faltan datos (D5, I2).
7. Error boundary por ruta (D6) y enlace de salto al contenido (D7).
8. Fondo del documento transicionando por acto según el progreso global (M8).

**DoD fase D:** tests FND-11 y FND-13 en verde; la home navega, el miliario refleja el progreso,
el CTA es alcanzable desde cualquier punto del scroll, y una escena que lanza un error no tumba
la página. Ningún teléfono ni dominio real renderizado (I2).

### Fase E — Cierre documental y gates globales

1. Marcar el DoD de §8 y la fila 00 de `docs/product/roadmap.md` como «hecho en branch».
2. Registrar en `docs/debt/technical-debt.md` las filas de §12 y el bloqueo B-04 (logotipo sin
   vectorial).
3. Ejecutar todos los gates del perfil §5 y dejarlos en verde de verdad.
4. Limpieza residual: dependencias no usadas, tokens huérfanos, exportaciones muertas.

**DoD fase E:** los cinco gates del perfil §5 ejecutados y en verde, incluido FND-15
(presupuesto de bundle). Documentación y deuda reflejando el estado real.

---

## 8. Criterios de aceptación (DoD)

### 8.1 Fundación

- [ ] `npm ci && npm run build` produce un `dist/` desplegable en Render.
- [ ] Los cinco gates del perfil §5 pasan ejecutados de verdad.
- [ ] La paleta y la tipografía son las de `content/05-guia-estilo-visual.md`, sin colores
      literales fuera de `tokens.css`.
- [ ] Existen las once primitivas de §3.7 con sus tests.
- [ ] `useGsapScene` es la única puerta de creación de animaciones con scroll.
- [ ] Montar y desmontar una escena deja cero ScrollTriggers vivos.
- [ ] Con `prefers-reduced-motion` activo, toda escena entrega el mismo contenido.
- [ ] El shell navega, con miliario romano, CTA persistente, footer y enlace de salto.
- [ ] Los quince tests golden FND-01…FND-15 existen y pasan.

### 8.2 Segunda feature

`No aplica`.

### 8.3 Global

- [ ] `docs/product/roadmap.md` fila 00 actualizada a «hecho en branch».
- [ ] Lo no cubierto → filas honestas en `docs/debt/technical-debt.md`.
- [ ] Se respetan el idioma y la política de comentarios del perfil §1.
- [ ] No se modificó ninguna zona protegida del perfil §6 sin autorización de C3.
- [ ] Todos los gates del perfil §5 en verde, ejecutados de verdad.
- [ ] Ningún invariante del perfil §7 roto en la superficie tocada.

---

## 9. Fuera de alcance (v1)

| Ítem | Notas |
|------|-------|
| Cualquier escena de contenido del dossier | La montan los documentos 01–06 |
| Páginas de detalle reales | Documento 07; aquí solo la ruta marcador |
| Adaptación móvil | Documento 08, por decisión del cliente |
| Formulario y envío de correo | Documento 06 |
| Banner de cookies y analítica | Documento 07 |
| Renderizado en servidor o prerenderizado | La SPA sin JS no renderiza; deuda registrada en §12 |
| Versión en inglés | La estructura queda preparada; el contenido traducido es v2 |
| Storybook | La página `/design` cumple la función sin añadir una herramienta más |

---

## 10. Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| Las escenas crean ScrollTriggers a mano y el sitio acumula fugas al navegar | `useGsapScene` como única puerta (M5) + FND-06 que falla si queda una instancia viva |
| «Máxima calidad visual» arrastra `three` al chunk de entrada y la primera carga se hunde | `manualChunks` (F7) + FND-15 + gate de presupuesto en el perfil §5 |
| La animación se convierte en el único portador del contenido y el sitio deja de ser accesible | I3 e I4 como invariantes de severidad `bug` + FND-07 que compara contenido entre ambas rutas |
| El scroll suave de Lenis y el scrub de ScrollTrigger se desincronizan y el movimiento tiembla | Una sola instancia conectada al ticker de GSAP con `lagSmoothing(0)` (M3) |
| Cada escena reinventa el formato de cifras y la comparativa España/Argentina se ve inconsistente | Helper único en `src/lib/format.ts` (S11) + prohibición explícita en el perfil §8 |
| El tema romano queda en adorno tipográfico y no aporta | Se ancla a la estructura: miliario de navegación (D2), numeración de actos y doble numeral en las cifras ancla (S9) |
| El logotipo rasterizado con fondo blanco se ve recortado sobre el navy del hero | Bloqueo B-04 registrado; hasta que llegue el vectorial se usa una versión recortada a mano documentada como deuda |

---

## 11. Casos de prueba mínimos (checklist de revisión)

- [ ] Clono el repo, `npm ci`, `npm run dev`, y la home carga sin errores de consola.
- [ ] Activo «reducir movimiento» en el sistema y recargo: veo todo el contenido, sin animación.
- [ ] Navego entre la home y `/design` varias veces y el número de ScrollTriggers no crece.
- [ ] Redimensiono la ventana durante una escena anclada y no queda descuadrada.
- [ ] Tabulo desde el principio: el primer foco es «Saltar al contenido».
- [ ] Recorro toda la home con teclado y alcanzo el CTA sin ratón.
- [ ] Miro el footer: donde falta un teléfono hay un marcador visible, no un número inventado.
- [ ] `npm run build` y compruebo que el chunk de entrada no lleva WebGL.

---

## 12. Deuda explícita (registrar al implementar)

### 12.1 E2E — Recorrido completo de la home

- Historia: como visitante, recorro la home de principio a fin y alcanzo el formulario de reserva
  sin que ninguna escena falle ni pierda contenido.
- Detectada en: este doc §7 fase D. Sin E2E en v1 (perfil §3).

### 12.2 E2E — Movimiento reducido

- Historia: como usuario con `prefers-reduced-motion` activo, recorro la home y compruebo que
  recibo el mismo contenido que un usuario sin esa preferencia.
- Detectada en: este doc §7 fase C.

### 12.3 Sin renderizado sin JavaScript

- El sitio es una SPA: sin JS no hay contenido. Afecta al SEO y a la robustez.
- Mitigación futura: prerenderizado estático de la home y las páginas de detalle.
- Detectada en: este doc §3.6.

### 12.4 Logotipo sin versión vectorial

- Bloqueo B-04 de `content/08-notas-editoriales.md`. Los PNG disponibles tienen fondo blanco
  opaco y se ven recortados sobre el navy.
- Detectada en: este doc §1.2.

---

## 13. Referencias de código (pre-feature)

| Área | Rutas |
|------|-------|
| Canon de contenido | `content/README.md` (índice de los 20 ficheros) |
| Guía de estilo visual, paleta y tipografía | `content/05-guia-estilo-visual.md` |
| Requisitos funcionales, SEO, a11y, rendimiento | `content/06-requisitos-funcionales.md` |
| Arquitectura de la información y navegación | `content/02-arquitectura-informacion.md` |
| Textos legales y disclaimer | `content/07-legal-y-disclaimers.md` |
| Estructura del footer | `content/secciones/08-cta-contacto.md` |
| Bloqueos y datos pendientes | `content/08-notas-editoriales.md` |
| Assets originales | `public/assets-origen/` |

---

## 14. Orden de trabajo sugerido en el branch

```text
main
  Fase A  → andamiaje: Vite, TS strict, Vitest, ESLint, env, render.yaml, presupuesto
  Fase B  → sistema de diseño: tokens, tipografía, once primitivas, página /design
  Fase C  → motor de movimiento: Lenis + ScrollTrigger, useGsapScene, <Scene>
  Fase D  → shell: router, navegación, miliario, CTA, footer, error boundary
  Fase E  → docs + deuda + gates
```

Dependencias duras: B necesita los helpers de A (`format`, `roman`, `tokens`); C necesita las
primitivas de B para su escena de muestra; D necesita `<Scene>` y `useScrollProgress` de C. E es
siempre la última.

---

*Documento vivo de implementación. Actualizar los checkboxes del DoD y el estado del encabezado
al cerrar cada fase.*

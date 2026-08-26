# Perfil de proyecto — goal loop

Perfil de **OPTIMVS Capital Protegido**. Es el seam entre la skill `/goal` y este repositorio:
rutas, comandos, gates, zonas protegidas, invariantes, convenciones y política de git.

Contrato de formato — no romperlo:

- **La numeración §1–§10 es estable.** La skill y los agentes citan las secciones por número.
- Una sección que no aplica se rellena con `No aplica`. Nunca se borra ni se deja vacía.
- Todo lo escrito aquí es **normativo** para el review de cada fase.

---

## §1 Identidad y lenguaje

| Campo | Valor |
|-------|-------|
| Proyecto | OPTIMVS Capital Protegido — sitio web corporativo |
| Stack | React 19 + TypeScript strict + Vite · GSAP 3 (ScrollTrigger, SplitText, MorphSVG, DrawSVG, Observer, Flip) + Lenis · React Three Fiber + drei + postprocessing · Vitest + React Testing Library |
| Gestor de paquetes / runner | `npm` |
| Idioma de los textos de usuario | es-ES (español de España, tratamiento de **usted**) |
| Idioma de identificadores y código | en |
| Política de comentarios | Escasos y solo para explicar el **porqué**. Prohibido narrar el cambio, reformular el código o dejar historia de diseño. Excepción: las coreografías de `timeline.ts` pueden llevar comentarios de tramo (`// 0.00–0.25 …`) porque documentan el contrato temporal, no el código. |
| Rama base | `main` |

**Sin backend.** El sitio es estático. Cualquier necesidad de servidor se resuelve con un
servicio de terceros invocado desde el cliente (§3 y decisiones de cada documento).

---

## §2 Autoridad documental (orden de precedencia)

De mayor a menor. Ante contradicción gana el de arriba; si dos empatan, gana el documento de la
goal en curso.

1. Documento canónico de la goal en curso (`docs/product/NN-<slug>.md`)
2. `AGENTS.md` — instrucciones de agentes del repo
3. `content/**` — **canon de contenido**: todo texto, cifra, tabla y dato de la web sale de aquí
4. Este perfil

`content/README.md` indexa los 20 ficheros de contenido. `content/08-notas-editoriales.md`
registra las erratas y los datos pendientes de confirmación del cliente: es de lectura
obligatoria antes de publicar cualquier dato de contacto.

---

## §3 Rutas canónicas

| Rol | Ruta | Obligatoria |
|-----|------|-------------|
| Documentos de goal | `docs/product/NN-<slug>.md` | sí |
| Prompt de handover | `docs/product/NN-<slug>-goal-prompt.md` | sí |
| Instrucciones de agentes | `AGENTS.md` | sí |
| Canon de contenido | `content/` | sí |
| Política de tests / cobertura | este perfil §5 | no |
| Registro de deuda técnica | `docs/debt/technical-debt.md` | sí |
| Inventario de historias E2E | `No aplica` — sin E2E en v1; las historias se registran como deuda | no |
| Roadmap a actualizar al cerrar | `docs/product/roadmap.md` | sí |
| Estado de los runs (git-ignored) | `.grok/goal-runs/` | sí |
| Plantillas del loop | `agent-docs/templates/` | sí |
| Assets originales del dossier | `public/assets-origen/` | sí |

---

## §4 Comandos de verificación

Ejecutables tal cual desde la raíz del repo. La skill no inventa comandos que no estén aquí.

| Nivel | Comando | Cuándo se ejecuta |
|-------|---------|-------------------|
| Typecheck | `npm run typecheck` | cada fase |
| Lint | `npm run lint` | cada fase |
| Formato | `npm run format:check` | cada fase |
| Tests focalizados | `npx vitest run <ruta-o-patrón>` | cada fase, solo lo tocado |
| Suite completa | `npm test` | cierre de fase grande |
| Cobertura | `npm run test:coverage` | cierre de fase grande y cierre de programa |
| Build | `npm run build` | cierre de programa y toda fase que añada dependencias o chunks |
| Presupuesto de bundle | `npm run build:budget` | cierre de programa y toda fase que añada dependencias |
| Migraciones / esquema | `No aplica` — sin backend ni base de datos | — |
| E2E | `No aplica` en v1 | — |

**La fase A del documento `00` es la que crea estos scripts en `package.json`.** Hasta que esa
fase cierre, el único comando verificable es el que la propia fase vaya creando; el orquestador
lo dice en vez de fingir que ejecutó el resto.

---

## §5 Gates de calidad (bloqueantes)

| Gate | Umbral | Alcance |
|------|--------|---------|
| Cobertura | ≥ 80 % en lines, branches, functions y statements | `src/lib/**`, `src/hooks/**`, `src/**/*.logic.ts` — la **lógica pura** |
| Typecheck | cero errores | todo el repo |
| Lint | cero errores (los warnings no bloquean) | todo el repo |
| Accesibilidad | cero violaciones `critical` y `serious` de axe | toda sección o página renderizada en un test |
| Presupuesto de bundle | chunk de entrada ≤ 250 KB gzip; todo lo que importe `three`, `@react-three/*` o `postprocessing` va en chunk diferido | salida de `npm run build` |

Las **escenas de animación** (`src/scenes/**`, `src/three/**`, `src/motion/**`) quedan fuera del
umbral de cobertura porque medir líneas de timeline no demuestra nada. A cambio, cada escena
exige en el mismo cambio:

1. Test RTL de que su **contenido textual y su semántica** están en el DOM.
2. Test de la ruta `prefers-reduced-motion` (invariante I3).
3. Test de que la escena **limpia** sus animaciones al desmontar (invariante I5).

Reglas fijas, no negociables por el agente:

- No bajar umbrales ni ampliar `exclude` para pasar un gate.
- No mover un fichero de `src/lib/` a `src/scenes/` para sacarlo del alcance de cobertura.
- Toda superficie nueva o modificada va con tests en el mismo cambio.
- Un gate que no se ha ejecutado se reporta como «no ejecutado», nunca como «pasa».

---

## §6 Zonas protegidas (no modificar)

| Ruta / patrón | Motivo | Excepción autorizada |
|---------------|--------|----------------------|
| `content/**` | Canon de contenido (§2). Se lee y se deriva a `src/content/`; no se reescribe | Solo si el documento de goal lo exige explícitamente y nombra el fichero |
| `OPTIMVS Capital Protegido.pdf` | Fuente original del contenido | Nunca |
| `public/assets-origen/**` | Imágenes extraídas del PDF, sin procesar. Se derivan versiones optimizadas a otra ruta | Nunca se editan in situ |
| `goal-loop-kit/**` | Kit de referencia del loop | Nunca |
| `agent-docs/goal-loop.md`, `agent-docs/templates/**` | Protocolo y plantillas del loop | Nunca |
| `.grok/agents/**`, `.grok/skills/**` | Definición del propio loop | Nunca |

Duplicación inevitable causada por una zona protegida → registrarla en
`docs/debt/technical-debt.md`.

---

## §7 Invariantes transversales

Se comprueban en **todas** las fases, toque lo que toque el diff. Son lo que impide que
«máxima calidad visual» degenere en una web bonita y rota.

| # | Invariante | Cómo se verifica | Severidad si se rompe |
|---|------------|------------------|-----------------------|
| I1 | **Fidelidad de contenido.** Ningún texto de usuario contradice `content/`; ninguna cifra existe fuera de `content/03-datos-y-tablas.md`. Prohibido inventar rentabilidades, importes mínimos, testimonios, credenciales o nombres de entidades aliadas | Cotejar todo literal nuevo de `src/content/` contra el fichero de `content/` que lo origina; toda cifra cita su origen en el módulo tipado | bug |
| I2 | **Sin datos de contacto inventados.** Los teléfonos del dossier son contradictorios y algunos son placeholders; el dominio es provisional. Hasta confirmación del cliente se renderiza un marcador visible, nunca un número plausible | Buscar `+34`, `+54`, `optimvs.cp.com` en el diff; deben venir de una constante marcada como pendiente (`content/08-notas-editoriales.md` B-01, B-02) | bug |
| I3 | **`prefers-reduced-motion`.** Toda escena entrega el **mismo contenido** en su ruta reducida: sin pin, sin scrub, sin partículas, sin WebGL. Nunca una pantalla vacía ni contenido perdido | Test que renderiza la escena con la media query activa y afirma el mismo contenido observable | bug |
| I4 | **El contenido vive en el DOM.** Ningún texto, cifra o dato existe únicamente dentro de un `<canvas>` o aparece solo al hacer scroll. El canvas ilustra; el DOM informa | Test que afirma el contenido sin ejecutar ninguna animación; toda escena WebGL lleva su equivalente accesible | bug |
| I5 | **Ciclo de vida limpio.** Todo `ScrollTrigger`, `gsap.timeline`, `requestAnimationFrame`, listener y contexto WebGL se destruye al desmontar. Se usa `gsap.context()` / `useGSAP` con su `revert()` | Test de montaje y desmontaje que afirma cero instancias vivas de `ScrollTrigger` tras desmontar | bug |
| I6 | **Sin logotipos de organismos.** Nunca los logotipos de CNMV, CNV, AEAT, ARCA, BCE, BCRA ni NASA: sugieren aval o supervisión inexistente. Solo texto | Buscar en `public/` y en el diff cualquier asset con nombre de organismo (`content/07-legal-y-disclaimers.md`) | bug |
| I7 | **Disclaimer financiero.** Toda superficie con afirmación de rendimiento, plusvalía o revalorización renderiza el disclaimer del componente canónico. El footer lo lleva siempre | Test que afirma la presencia del disclaimer en toda vista que muestre cifras de rendimiento | bug |
| I8 | **Sin secretos en el bundle.** Solo variables `VITE_*` con valor público. `.env` nunca se commitea; existe `.env.example` con las claves y sin valores | Buscar `.env` en el índice de git y valores literales de clave en el diff | bug |
| I9 | **Presupuesto de rendimiento.** Todo lo que importe `three`, `@react-three/*` o `postprocessing` entra por `React.lazy` o import dinámico. Ninguna escena provoca desplazamiento de layout al entrar. Ninguna animación bloquea el hilo principal con trabajo síncrono por frame | Revisar la salida de `npm run build` (§4) y los imports del diff; toda escena reserva su altura antes de montarse | bug |

---

## §8 Convenciones de arquitectura

- **Capas y ubicación:**

  ```
  src/app/                    router, providers, layout shell, error boundary
  src/motion/                 primitivas de animación: contexto Lenis, useGsapScene,
                              useScrollProgress, useReducedMotionSafe, <Scene>
  src/three/                  piezas React Three Fiber reutilizables (canvas, loaders, shaders)
  src/scenes/<NN>-<slug>/     una carpeta por escena de la home:
                                Scene.tsx        composición y JSX
                                timeline.ts      coreografía: progress 0→1 → estado visual
                                content.ts       contenido tipado de esa escena
                                Scene.test.tsx   contenido + reduced-motion + cleanup
  src/components/             UI reutilizable, sin dependencia de escena
  src/lib/                    lógica pura, sin React ni DOM — aquí vive el gate de cobertura
  src/content/                contenido tipado derivado de content/*.md
  src/pages/                  páginas de detalle y legales
  ```

- **Naming de ficheros:** `PascalCase` para componentes y sus tests; `camelCase` con prefijo
  `use` para hooks; `kebab-case` para carpetas y módulos que no exportan componente.
- **Imports:** externos → alias internos (`@/app`, `@/motion`, `@/lib`, `@/content`) → relativos.
  Sin ficheros barril `index.ts`.
- **Patrones obligatorios:**
  - La coreografía de una escena vive en su `timeline.ts` como **función pura** de `progress`
    a estado visual, testeable sin DOM. `Scene.tsx` solo la aplica.
  - Toda animación se registra con `gsap.context()` (o `useGSAP`) y se revierte al desmontar.
  - Todo contenido llega a la escena desde `content.ts` tipado; nunca literales sueltos en JSX.
  - Toda cifra se formatea con el helper canónico de `src/lib/format.ts` — convención española
    de millares y decimales.
- **Patrones prohibidos:**
  - Lógica de negocio o cálculo dentro de un componente de escena.
  - Importar `gsap`, `lenis` o `three` fuera de `src/motion/`, `src/three/` y `src/scenes/`.
  - Un `ScrollTrigger` creado sin su limpieza.
  - Leer `window` o `document` en el cuerpo de un componente (solo dentro de efectos).
  - Un fichero de escena por encima de **400 líneas**: se descompone en subcomponentes.
- **Reutilización:** usar `useGsapScene`, `useScrollProgress`, `useReducedMotionSafe`, `<Scene>`,
  `<RomanNumeral>`, `<CountUp>`, `<StatFigure>`, `<Disclaimer>` y `src/lib/format.ts` antes de
  escribir cualquier variante nueva. Una primitiva duplicada es un hallazgo de review.

---

## §9 Parámetros del loop

| Parámetro | Defecto | Este proyecto |
|-----------|---------|---------------|
| Severidades accionables | `bug`, `suggestion`, `nit` | igual (las tres) |
| Máx. rondas por subagente y fase | 5 | 5 |
| Umbral de tamaño de fichero | 1000 líneas | **400 líneas** |
| Aviso por diff grande | 1 MB | 1 MB |
| Parada por diff enorme | 10 MB | 10 MB |
| Orden de subagentes | `goal-reviewer` → `goal-code-reviewer` | igual |
| Fases supervisadas | no | **sí** — puerta humana después de la misma foto y antes del commit |

---

## §10 Política de git

| Punto | Valor |
|-------|-------|
| Commits por fase | Uno lógico por entregable; nunca antes de las dos rondas limpias sobre la misma foto |
| Estilo de mensaje | Conventional Commits: `type(scope): resumen en imperativo`. Scopes: `setup`, `design`, `motion`, `shell`, `act1`…`act7`, `sim`, `form`, `pages`, `mobile`, `docs` |
| Índice | Se permite `git add -A -N` para recolectar el diff de la fase |
| Push | Prohibido salvo petición explícita del humano |
| Pull request | Prohibido salvo petición explícita del humano |
| Operaciones prohibidas | force-push, `reset --hard`, amend de commits ajenos, descartar trabajo ajeno |
| Firma / hooks | No saltarse hooks ni firma (`--no-verify` prohibido) |

---

*Rellenado por: Grok · Última revisión: 2026-08-25. Mantener este fichero al día es lo que
mantiene honesto al loop.*

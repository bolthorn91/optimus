# Actos VI y VII — La firma, las dos vías, cierre y contacto

**Estado:** hecho en branch `main` (2026-10-03). No fusionado.
**Branch de trabajo:** el HEAD actual del worktree.
**Perfil de proyecto:** [`agent-docs/goal-profile.md`](../../agent-docs/goal-profile.md) — invariantes §7 aplicables: I1, I2, I3, I4, I5, I6, I7, I8, I9.
**Roadmap:** [`roadmap.md`](roadmap.md) §2, fila 06.
**Relacionado:** [`00-fundacion-sistema-diseno.md`](00-fundacion-sistema-diseno.md) (`<PendingValue>`, footer, `<Disclaimer>`) · [`03-acto-iii-asimetria-territorial.md`](03-acto-iii-asimetria-territorial.md) (`<PairedComparison>`) · [`04-acto-iv-marco-legal-garantias.md`](04-acto-iv-marco-legal-garantias.md) (`<ProcessDiagram>`, `<GuaranteeCards>`) · [`05-acto-v-activos-simulador.md`](05-acto-v-activos-simulador.md) (contexto del simulador hacia el formulario). **No reimplementar** ninguno.

Manda sobre el cierre del relato: quién es la firma, cómo opera legalmente, y el punto de
conversión. Es la única superficie del sitio que trata datos personales.

| Referencia | Tema | Resumen v1 |
|------------|------|------------|
| **roadmap §2 fila 06** | Actos VI–VII + cierre | La firma y su fundador, la cadena de intermediación sin capas, las dos vías operativas, y el bloque de reserva con formulario, envío por EmailJS y confirmación. |

---

## 1. Contexto del software actual (punto de partida)

### 1.1 Fundación y actos previos disponibles

| Pieza | Ubicación | Comportamiento |
|-------|-----------|----------------|
| Motor y primitivas | `src/motion/`, `src/components/` | Todo lo de los documentos 00 a 05 |
| Diagrama de proceso | `src/components/ProcessDiagram.tsx` | Del documento 04; **se reutiliza** para la cadena de intermediación |
| Tarjetas de garantías | `src/components/GuaranteeCards.tsx` | Del documento 04; **se reutilizan** junto al formulario |
| Comparativa pareada | `src/components/PairedComparison.tsx` | Del documento 03; se reutiliza para las dos vías |
| Marcador de dato pendiente | `src/components/PendingValue.tsx` | Del documento 00; aquí es donde más se usa |
| Footer con marcadores | `src/app/` | Creado en el documento 00 D5; **este documento lo puebla** |
| Contexto del simulador | `src/scenes/05-activos-simulador/useSimulator.ts` | Documento 05 S11; viaja al formulario |
| Lectura de entorno | `src/lib/env.ts` | Documento 00 F5; aquí se consumen las claves de EmailJS |

**No existe** ningún formulario ni ninguna llamada de red. Este documento introduce ambos.

### 1.2 Contenido de origen

| Pieza | Ubicación | Estado |
|-------|-----------|--------|
| Acto VI completo, literal | `content/secciones/06-estructura-operativa.md` | Íntegro |
| Acto VII completo, literal | `content/secciones/07-asesoramiento-intermediacion.md` | Íntegro |
| Cierre, contacto y fuentes | `content/secciones/08-cta-contacto.md` | Con la estructura de formulario y footer |
| RGPD y consentimientos | `content/07-legal-y-disclaimers.md` | Requisitos de tratamiento y consentimiento |
| Bloqueos de contacto | `content/08-notas-editoriales.md` | B-01, B-02, B-06, B-07 |

**Bloqueos activos:** teléfonos contradictorios (B-01), dominio provisional (B-02), sin retrato del
fundador (B-06), sin URLs de redes (B-07).

---

## 2. Decisiones cerradas (no reabrir en v1)

### 2.1 Comunes

| # | Tema | Decisión |
|---|------|----------|
| C1 | Idioma | Español de España, tratamiento de usted. Los cinco verbos del CTA del dossier —reserve, analice, evite, mitigue, obtenga— se conservan literales. |
| C2 | Tests | Los tres obligatorios del perfil §5, más axe. **La validación del formulario es lógica pura y entra en el gate de cobertura de `src/lib/`.** |
| C3 | Zonas protegidas | No se toca `content/` ni `public/assets-origen/`. Este documento autoriza crear `src/scenes/06-firma/`, `src/scenes/07-contacto/`, `src/lib/contact-form.ts` y `src/lib/email.ts`, y **modificar el footer** creado en el documento 00. |
| C4 | Invariantes | Los nueve. En particular **I2 (ningún dato de contacto inventado)**, **I7 (disclaimer en el bloque de conversión)** e **I8 (claves de EmailJS solo por `VITE_*`, `.env` nunca commiteado)**. |
| C5 | Actos VI y VII juntos | Comparten escena y coreografía: ambos hablan de cómo opera la firma. Se separan visualmente pero no estructuralmente. |
| C6 | Contacto separado | El bloque de contacto es escena propia, con su entrada en el manifiesto y su ancla `#contacto`. Es el destino de todos los CTA del sitio y no puede depender de la escena anterior. |

### 2.2 La firma y el fundador

| # | Tema | Decisión |
|---|------|----------|
| F1 | Retrato del fundador | Bloqueo B-06: no existe. Se renderiza un marcador de retrato con las iniciales en Cinzel sobre navy, dimensionado como el retrato definitivo para que sustituirlo no altere el layout. **Nunca** una foto de banco de imágenes ni una silueta genérica. |
| F2 | Biografía | Literal del dossier. Formación, especializaciones y trayectoria tal como están. |
| F3 | «El nuevo Occidente» | Como `<PullQuote>` atribuida al fundador. Es el concepto de marca y funciona mejor entrecomillado que dentro del párrafo. |
| F4 | Cadena de intermediación | `<ProcessDiagram>` del documento 04 en modo comparativo: cadena convencional larga arriba, cadena de OPTIMVS corta abajo. Es un argumento que se entiende mucho mejor dibujado que escrito. |
| F5 | Habilitación regulatoria | El dossier dice «cuenta con la habilitación correspondiente» sin especificar cuál ni ante qué organismo. Se reproduce literal por I1 y se **añade un marcador** de dato pendiente donde iría el registro concreto. Es exactamente el dato que un inversor prudente verificará. |
| F6 | Trazabilidad en tiempo real | El dossier menciona «trazabilidad visible en tiempo real» e «informes diarios». El sitio **no** debe sugerir que existe ya un panel accesible: el texto se reproduce como descripción del servicio, sin enlace ni botón que prometa acceso. |
| F7 | Los tres departamentos | Análisis, Financiero y Técnico-Legal, y Desarrollo. Tres tarjetas con icono. El nombre completo con guion se conserva. |
| F8 | Rango de inversor | Gráfico de escala de «cuota mínima» a «sin techo». Refuerza el mensaje de toda escala y evita que un inversor pequeño se autoexcluya. Sin cifras (E-05). |

### 2.3 Las dos vías (acto VII)

| # | Tema | Decisión |
|---|------|----------|
| S1 | Presentación | `<PairedComparison>` del documento 03: inmuebles a la izquierda, valores financieros a la derecha. |
| S2 | Desambiguación de «CDI» | **Obligatoria.** En el acto IV «CDI» es el Convenio de Doble Imposición; aquí es la Clave de Identificación fiscal argentina. Se desarrolla explícitamente con el texto propuesto en `content/secciones/07-asesoramiento-intermediacion.md`. Sin esto, para un lector español la sección parece un error. |
| S3 | Glosario | Ocho siglas en dos párrafos. Se implementa `<Glossary>` con término y definición, accesible por teclado y también listado al pie de la sección. Consume el glosario de `content/01-identidad-y-tono.md`. |
| S4 | Introducing Broker | Se explicita que OPTIMVS **capta y deriva** hacia una entidad regulada que ejecuta; no ejecuta ni custodia. Es un punto de transparencia, no una debilidad, y protege a la firma frente a la normativa española. |
| S5 | Organismos | CNMV, CNV, AEAT, ARCA, ALyC y Apostilla de La Haya como **texto**, en tratamiento tipográfico neutro. **Prohibidos los logotipos**: sugieren aval o supervisión inexistente (I6). |
| S6 | Entidades aliadas | Sin nombres: el cliente no los ha facilitado. Marcador de dato pendiente; nombrarlas convertiría esta sección en el mayor generador de confianza del sitio. |

### 2.4 Cierre y formulario

| # | Tema | Decisión |
|---|------|----------|
| D1 | Escena de cierre | A pantalla completa, con el CTA descompuesto en sus cinco verbos: «Reserve» como titular, «Analice» como subtítulo, y «Evite / Mitigue / Obtenga» como tres beneficios. Literales del dossier. |
| D2 | Campos | Nombre y apellidos, email, teléfono con prefijo, país de residencia fiscal, interés principal, horquilla de capital (opcional), mensaje (opcional), consentimiento RGPD y consentimiento comercial. Según `content/secciones/08-cta-contacto.md`. |
| D3 | Consentimientos | **Dos casillas separadas y ninguna premarcada.** Tratamiento por un lado, comunicaciones comerciales por otro. Enlace visible a la política de privacidad junto a la casilla. |
| D4 | Preselección | «Interés principal» llega preseleccionado desde la tarjeta del acto V o la vía del acto VII que originó el clic (documento 05 F6). |
| D5 | Contexto del simulador | Si el visitante ha usado el simulador, sus valores viajan al mensaje como contexto del lead. **Se le muestra qué se va a enviar**: nada oculto en un campo invisible. |
| D6 | Antispam | Honeypot más límite de frecuencia en cliente. **Sin CAPTCHA visible**: en el punto de conversión de un producto patrimonial cuesta leads. |
| D7 | Envío | EmailJS desde el cliente, con las tres claves `VITE_EMAILJS_*` leídas por `src/lib/env.ts`. Son públicas por diseño (I8). |
| D8 | Estados | Reposo, enviando, éxito y error, todos anunciados a lectores de pantalla. El éxito indica plazo de respuesta. El error ofrece el contacto directo como alternativa y **no pierde lo que el usuario escribió**. |
| D9 | Datos de contacto | Bloqueos B-01 y B-02: teléfonos contradictorios y dominio provisional. Se renderiza `<PendingValue>` en su lugar. **Ningún número ni dominio plausible** (I2). |
| D10 | WhatsApp | No se implementa: el dossier no lo menciona y no está confirmado. Registrado como pendiente. |
| D11 | Garantías junto al formulario | `<GuaranteeCards>` del documento 04 en versión resumida junto al formulario: es el argumento que más pesa en el momento de convertir (documento 04 S4). |
| D12 | Disclaimer | `<Disclaimer variant="inline">` en el bloque de conversión (I7). |

### 2.5 Footer

| # | Tema | Decisión |
|---|------|----------|
| G1 | Poblado | Este documento puebla el footer creado en el documento 00 D5: navegación, legales, contacto, redes, fuentes y disclaimer. |
| G2 | Fuentes | Las dieciséis fuentes del dossier con visibilidad real, no en letra minúscula escondida. **«Think Thanks» se corrige a «Think Tanks»**: es una errata tipográfica evidente (E-03), no contenido sustantivo, y corregirla no vulnera I1. |
| G3 | Redes sociales | Bloqueo B-07: sin URLs. No se renderizan iconos que no lleven a ningún sitio. Marcador de pendiente. |
| G4 | Datos registrales | Bloqueo B-05: sin razón social ni CIF. Marcador de pendiente; el documento 07 crea las páginas legales. |

---

## 3. La firma y las dos vías — Especificación de implementación

### 3.1 Objetivo de negocio

Responder a la pregunta que el visitante se hace al llegar aquí: quién es esta gente y por qué
debería confiarles su capital. En una firma desconocida, con ticket alto y argumentario sensible,
esta sección es determinante para la conversión.

### 3.2 Modelo de datos

`src/scenes/06-firma/content.ts`:

```ts
type Department = { id: string; name: string; role: string; output: string; icon: DeptIcon }
type OperationalRoute = { id: "property" | "securities"; title: string; steps: string[]; entities: string[] }
```

| Campo | Tipo | Origen |
|-------|------|--------|
| `acts` | `[6, 7]` | |
| `firmSummary` | `string` | Literal |
| `founder` | `{ name, role, bio, quote, portraitPending: true }` | Literal; retrato pendiente (F1) |
| `intermediationChain` | `{ conventional: string[]; optimvs: string[] }` | Para `<ProcessDiagram>` (F4) |
| `authorisationNote` | `{ literal: string; pendingRegistry: true }` | F5 |
| `departments` | `[Department, Department, Department]` | F7 |
| `investorRange` | `{ from: string; to: string }` | F8, sin cifras |
| `routes` | `[OperationalRoute, OperationalRoute]` | S1 |
| `cdiDisambiguation` | `string` | S2 |
| `glossary` | `{ term: string; definition: string }[]` | S3 |
| `organisations` | `string[]` | S5, solo texto |

### 3.3 Algoritmo canónico (pseudocódigo)

Coreografía de los actos VI–VII — `src/scenes/06-firma/timeline.ts`:

```text
choreographAct67(p):                    # p: 0 → 1

  # 0.00–0.16  la firma y su posicionamiento
  firmOpacity   := ventana(clamp01(p / 0.16), entrada=0.25, salida=0.85)

  # 0.18–0.36  el fundador: retrato, biografia y la cita
  founderProgress := clamp01((p - 0.18) / 0.18)
  quoteOpacity    := clamp01((p - 0.30) / 0.06)

  # 0.38–0.58  la cadena de intermediacion: primero la larga, luego la corta
  chainProgress   := clamp01((p - 0.38) / 0.20)
  conventionalDraw := clamp01(chainProgress / 0.5)          # 0.38–0.48
  optimvsDraw      := clamp01((chainProgress - 0.5) / 0.5)  # 0.48–0.58

  # 0.60–0.76  los tres departamentos, escalonados
  para cada departamento d de 0..2:
    inicio := 0.60 + d * 0.05
    deptProgress[d] := clamp01((p - inicio) / 0.10)

  # 0.78–0.94  las dos vias operativas
  routesProgress := clamp01((p - 0.78) / 0.16)

  # 0.96–1.00  transicion al bloque de contacto
  handoff        := clamp01((p - 0.96) / 0.04)

  surfaceMix     := ease.inOut(p)

  devolver { firmOpacity, founderProgress, quoteOpacity,
             conventionalDraw, optimvsDraw, deptProgress, routesProgress,
             handoff, surfaceMix }
```

**Validación del formulario** — `src/lib/contact-form.ts`, pura y sin DOM:

```text
validate(values):
  errores := {}

  si vacio(values.fullName)                    -> errores.fullName := "required"
  si longitud(values.fullName) > 120           -> errores.fullName := "tooLong"

  si vacio(values.email)                       -> errores.email := "required"
  sino si no cumpleFormatoEmail(values.email)  -> errores.email := "invalid"

  si vacio(values.phone)                       -> errores.phone := "required"
  sino si no cumpleFormatoTelefono(values.phone) -> errores.phone := "invalid"

  si vacio(values.taxResidence)                -> errores.taxResidence := "required"
  si values.interest no esta en el enum        -> errores.interest := "invalid"
  si values.capitalBand presente y no esta en el enum -> errores.capitalBand := "invalid"
  si longitud(values.message) > 2000           -> errores.message := "tooLong"
  si values.consentData !== true               -> errores.consentData := "required"
  # consentMarketing es OPCIONAL: nunca produce error

  si values.honeypot no esta vacio             -> errores.honeypot := "rejected"

  devolver { valid: errores esta vacio, errores }
```

_Un solo validador. La interfaz muestra los errores; no los decide._

### 3.4 Superficies a unificar

| Punto | Fichero | Nota |
|-------|---------|------|
| Coreografía de los actos VI–VII | `src/scenes/06-firma/timeline.ts` | Función pura |
| Validación del formulario | `src/lib/contact-form.ts` | Pura; entra en el gate de cobertura |
| Envío por EmailJS | `src/lib/email.ts` | Único punto de red del sitio |
| Lectura de claves | `src/lib/env.ts` | Del documento 00; no se duplica |
| Diagrama de proceso | `src/components/ProcessDiagram.tsx` | Del documento 04; no se duplica |
| Garantías | `src/components/GuaranteeCards.tsx` | Del documento 04; no se duplica |
| Datos de contacto pendientes | `src/content/contact.ts` | Única fuente; footer y formulario leen de aquí (I2) |

### 3.5 Migración / recálculo de datos existentes

`No aplica`.

### 3.6 Casos límite

- **EmailJS no configurado** (claves ausentes en `.env`): el formulario **no se deshabilita**. Valida
  y, al enviar, muestra un error claro con el contacto directo como alternativa y conserva lo
  escrito. Un formulario muerto en producción es peor que un error honesto.
- **Fallo de red en el envío:** mismo tratamiento. Se conservan los valores. Se permite reintentar.
- **Doble envío por doble clic:** el botón se bloquea durante el envío; el estado `enviando` es
  explícito.
- **Envíos repetidos desde la misma sesión:** límite de frecuencia en cliente; tras el tercero en
  poco tiempo, se pide esperar. No es seguridad real —sin backend no la hay— y se documenta como tal.
- **Honeypot relleno:** se descarta silenciosamente con éxito aparente. Un bot no debe aprender.
- **Mensaje muy largo:** acotado a 2000 caracteres, con contador visible antes del límite.
- **Movimiento reducido:** el formulario y toda la sección funcionan igual. Solo desaparece la
  coreografía de entrada.
- **Teléfono internacional:** el prefijo es un `<select>` con búsqueda; el valor enviado incluye el
  prefijo. Sin librería pesada de validación telefónica: comprobación de formato razonable.
- **Envío con éxito:** el foco se mueve al mensaje de confirmación y este se anuncia con
  `role="status"`. Sin esto, un usuario de lector de pantalla no sabe que se ha enviado.

### 3.7 API de componentes (contrato de props)

| Componente | Props |
|------------|-------|
| `<Act67Scene>` | ninguna |
| `<FounderCard>` | `founder: Founder, progress: number` — retrato con marcador (F1) |
| `<IntermediationChain>` | `conventional: string[], optimvs: string[], conventionalDraw, optimvsDraw` (F4) |
| `<DepartmentCards>` | `departments, progress: number[]` (F7) |
| `<InvestorRange>` | `from: string, to: string` (F8) |
| `<OperationalRoutes>` | `routes: OperationalRoute[], progress: number` (S1) |
| `<Glossary>` | `entries: GlossaryEntry[]` (S3) |
| `<ContactScene>` | ninguna — ancla `#contacto` (C6) |
| `<ContactForm>` | `initialInterest?: VehicleId, simulatorContext?: SimulatorSnapshot` (D4, D5) |
| `<ContactDetails>` | ninguna — lee `src/content/contact.ts` con sus marcadores (D9) |

### 3.8 Tests golden Firma (mínimos)

Prefijo estable **`FIR`**.

| ID | Escenario | Esperado |
|----|-----------|----------|
| FIR-01 | `choreographAct67` en `p` = 0, 0.27, 0.48, 0.68, 0.86, 1 | Estados exactos y deterministas |
| FIR-02 | `conventionalDraw` y `optimvsDraw` | La cadena convencional se traza entera antes de que empiece la de OPTIMVS |
| FIR-03 | Retrato del fundador | Renderiza el marcador con iniciales; **ninguna** imagen de banco ni silueta genérica (F1) |
| FIR-04 | Nota de habilitación | Reproduce el literal del dossier **y** un marcador de registro pendiente (F5) |
| FIR-05 | Sección de trazabilidad | No hay enlace ni botón que prometa acceso a un panel (F6) |
| FIR-06 | Los tres departamentos | Presentes con su nombre completo, incluido el guion de «Financiero y Técnico-Legal» (F7) |
| FIR-07 | Sección de las dos vías | Contiene la desambiguación explícita de «CDI» como Clave de Identificación (S2) |
| FIR-08 | Organismos citados | Solo texto; ningún `<img>` con nombre de CNMV, CNV, AEAT, ARCA ni ALyC (S5, I6) |
| FIR-09 | Sección renderizada | Explicita que OPTIMVS deriva a entidades reguladas y no ejecuta ni custodia (S4) |
| FIR-10 | Glosario | Las ocho siglas del acto VII accesibles por teclado y listadas al pie (S3) |
| FIR-11 | Escena con `prefers-reduced-motion` | Todo el contenido visible; ningún ScrollTrigger creado |
| FIR-12 | Escena con axe | Cero violaciones `critical` y `serious` |
| FIR-13 | Montaje y desmontaje | Cero ScrollTriggers vivos tras desmontar |
| FIR-14 | Fidelidad de contenido | Biografía, departamentos y vías coinciden carácter a carácter con `content/secciones/06-…` y `07-…` (I1) |

### 3.9 Tests golden Formulario (mínimos)

Prefijo estable **`FRM`**.

| ID | Escenario | Esperado |
|----|-----------|----------|
| FRM-01 | `validate` con todos los campos válidos | `valid: true`, sin errores |
| FRM-02 | `validate` con nombre, email, teléfono o residencia vacíos | Error `required` en el campo correspondiente |
| FRM-03 | `validate` con emails malformados | Error `invalid` en cada caso |
| FRM-04 | `validate` sin consentimiento de datos | Error `required` en `consentData` |
| FRM-05 | `validate` sin consentimiento comercial | **Válido**: el consentimiento comercial es opcional |
| FRM-06 | `validate` con honeypot relleno | `rejected`, y el envío se descarta con éxito aparente (§3.6) |
| FRM-07 | `validate` con mensaje de más de 2000 caracteres | Error `tooLong` |
| FRM-08 | Formulario renderizado | Las dos casillas de consentimiento existen, **separadas** y **ninguna premarcada** (D3) |
| FRM-09 | Formulario renderizado | Enlace visible a la política de privacidad junto a la casilla de datos |
| FRM-10 | Llegada desde una tarjeta del acto V | «Interés principal» llega preseleccionado con ese vehículo (D4) |
| FRM-11 | Con el simulador usado | El contexto del simulador se muestra al usuario antes de enviarse; ningún campo oculto (D5) |
| FRM-12 | Envío con éxito | El foco se mueve a la confirmación, anunciada con `role="status"`, con plazo de respuesta |
| FRM-13 | Envío con error de red | Se conserva todo lo escrito, se ofrece el contacto directo y se permite reintentar |
| FRM-14 | EmailJS sin configurar | El formulario sigue operativo; al enviar da error claro y conserva los valores (§3.6) |
| FRM-15 | Doble clic en enviar | Un solo envío; el botón se bloquea durante el proceso |
| FRM-16 | Formulario renderizado | No hay CAPTCHA visible (D6) |
| FRM-17 | Formulario con teclado | Todos los campos alcanzables y operables; los errores se asocian a su campo y se anuncian |
| FRM-18 | Formulario con axe | Cero violaciones `critical` y `serious`; toda etiqueta asociada a su control |
| FRM-19 | Bloque de contacto renderizado | Los teléfonos y el dominio son `<PendingValue>`; **ningún número ni dominio plausible** (D9, I2) |
| FRM-20 | Bloque de conversión | Renderiza `<Disclaimer variant="inline">` (D12, I7) |
| FRM-21 | Bundle de producción | Ninguna clave de EmailJS literal en el código; todas por `VITE_*` (I8) |
| FRM-22 | Footer renderizado | Las dieciséis fuentes visibles, con «Think Tanks» corregido (G2) |
| FRM-23 | Footer renderizado | Ningún icono de red social sin destino (G3) |
| FRM-24 | Regresión: actos previos | Los actos I a V siguen funcionando con los actos VI–VII y el contacto montados |

FRM-19 y FRM-21 son obligatorios: el primero impide publicar un teléfono inventado, el segundo
impide que una clave acabe escrita en el código.

---

## 4. Segunda feature

`No aplica` — este documento cubre los actos VI y VII y el bloque de contacto como una sola
entrega, especificados conjuntamente en §3.

---

## 5. Seguridad, permisos y aislamiento

Es la **única superficie del sitio que trata datos personales**. Aplica en su totalidad:

- **I2, FRM-19:** ningún dato de contacto inventado. Teléfonos y dominio son marcadores hasta que
  el cliente confirme (B-01, B-02).
- **I8, FRM-21:** las tres claves de EmailJS se leen por `VITE_*` desde `src/lib/env.ts`. Son
  públicas por diseño; aun así, ninguna se escribe literal en el código y `.env` nunca se commitea.
- **I7, FRM-20:** disclaimer en el bloque de conversión.
- **I6, FIR-08:** organismos como texto, sin logotipos.
- **Consentimiento:** dos casillas separadas, ninguna premarcada, con enlace a la política de
  privacidad (D3, FRM-08, FRM-09). La política la crea el documento 07.
- **Transferencia internacional:** el tratamiento implica compartir datos con la firma argentina.
  Argentina tiene decisión de adecuación de la Comisión Europea, lo que simplifica el régimen, pero
  **debe declararse expresamente** en la política de privacidad. Registrado para el documento 07.
- **Registro del consentimiento:** sin backend no se puede guardar prueba del consentimiento con
  fecha, hora y texto. **Es una carencia real de cumplimiento** y se registra como deuda §12.3, no
  se disimula.
- **Antispam:** honeypot y límite de frecuencia en cliente. Sin backend no hay protección real; se
  documenta como tal (§12.4).
- Sin cookies ni analítica en esta superficie. El banner lo introduce el documento 07.

---

## 6. Textos de interfaz (claves orientativas)

| Clave | ES |
|-------|-----|
| `contact.title` | Reserve su sesión privada de diagnóstico patrimonial |
| `contact.subtitle` | Analice junto a nuestros consultores cómo estructurar la salida parcial de capitales hacia activos estratégicos en Argentina. |
| `contact.benefit1` | Evite que su esfuerzo quede atrapado en un mercado con proyección en baja |
| `contact.benefit2` | Mitigue los riesgos hacia su patrimonio |
| `contact.benefit3` | Obtenga los beneficios de la estabilidad de su valor |
| `contact.confidential` | Consultoría confidencial · Atención directa |
| `form.fullName` | Nombre y apellidos |
| `form.email` | Correo electrónico |
| `form.phone` | Teléfono |
| `form.taxResidence` | País de residencia fiscal |
| `form.interest` | Interés principal |
| `form.capitalBand` | Horquilla de capital (opcional) |
| `form.message` | Mensaje (opcional) |
| `form.consentData` | He leído y acepto la política de privacidad |
| `form.consentMarketing` | Deseo recibir comunicaciones comerciales de OPTIMVS Capital Protegido |
| `form.submit` | Reservar sesión privada |
| `form.sending` | Enviando… |
| `form.success` | Solicitud recibida. Le responderemos en un plazo de 48 horas laborables. |
| `form.errorNetwork` | No hemos podido enviar su solicitud. Puede reintentarlo o escribirnos directamente. |
| `form.simulatorContext` | Se enviará también el escenario que ha configurado |
| `firm.registryPending` | Registro y organismo pendientes de confirmación |
| `firm.portraitPending` | Retrato pendiente |

---

## 7. Plan de implementación (fases)

### Fase A — Contenido tipado y secciones estáticas

1. `src/scenes/06-firma/content.ts` y `src/scenes/07-contacto/content.ts`, literales.
2. `src/content/contact.ts` como única fuente de datos de contacto, con marcadores (D9, I2).
3. Secciones estáticas: firma, `<FounderCard>` con marcador de retrato, `<DepartmentCards>`,
   `<InvestorRange>`, `<OperationalRoutes>`, desambiguación de CDI y `<Glossary>`.
4. Poblado del footer del documento 00: fuentes con «Think Tanks» corregido, legales, contacto y
   disclaimer (G1–G4).
5. Registro de ambas escenas en `src/app/sections.ts`.
6. Tests FIR-03 a FIR-10, FIR-14, FRM-19, FRM-22, FRM-23.

**DoD fase A:** todo el contenido de los actos VI y VII es legible sin animación; no aparece ningún
teléfono, dominio, retrato de banco ni logotipo de organismo; la desambiguación de CDI es explícita.

### Fase B — Cadena de intermediación y coreografía

1. `<IntermediationChain>` reutilizando `<ProcessDiagram>` del documento 04 (F4).
2. `choreographAct67` como función pura (§3.3).
3. Anclaje y scrub con `useGsapScene`; altura `500vh`.
4. Trazado secuencial: cadena convencional y después la de OPTIMVS (F2).
5. Entrada escalonada de los tres departamentos y de las dos vías.
6. `<PullQuote>` de «el nuevo Occidente» (F3).
7. Tests FIR-01, FIR-02, FIR-11, FIR-12, FIR-13.

**DoD fase B:** la cadena larga se traza entera antes que la corta; la comparación se entiende sin
leer el texto; con movimiento reducido todo el contenido está visible.

### Fase C — Formulario y validación

1. `src/lib/contact-form.ts` con `validate` según §3.3, pura y completa.
2. `<ContactForm>` con los nueve campos de D2, etiquetas asociadas y errores anunciados.
3. Dos casillas de consentimiento separadas y sin premarcar, con enlace a privacidad (D3).
4. Preselección desde el acto V y contexto del simulador visible al usuario (D4, D5).
5. Honeypot y límite de frecuencia (D6).
6. `<GuaranteeCards>` resumidas junto al formulario (D11) y `<Disclaimer>` (D12).
7. Tests FRM-01 a FRM-11, FRM-16, FRM-17, FRM-18, FRM-20.

**DoD fase C:** la validación cubre los nueve campos y es pura; el consentimiento comercial es
opcional y el de datos obligatorio; ninguna casilla viene marcada; el formulario es completamente
operable con teclado. **Cobertura de `src/lib/contact-form.ts` ≥ 80 %.**

### Fase D — Envío, estados y escena de cierre

1. `src/lib/email.ts` con EmailJS y las claves de `src/lib/env.ts` (D7, I8).
2. Los cuatro estados de D8, con foco y anuncio en el éxito.
3. Manejo de EmailJS no configurado y de fallo de red, conservando valores (§3.6).
4. Bloqueo del botón durante el envío (FRM-15).
5. `<ContactScene>` a pantalla completa con los cinco verbos del CTA (D1) y transición animada
   desde el acto VII.
6. Tests FRM-12 a FRM-15, FRM-21, FRM-24.

**DoD fase D:** un envío correcto mueve el foco a la confirmación y la anuncia; un fallo conserva
lo escrito y ofrece alternativa; sin claves configuradas el formulario sigue operativo y da un
error honesto; ninguna clave literal en el bundle.

### Fase E — Cierre documental y gates globales

1. Marcar el DoD de §8 y la fila 06 del roadmap como «hecho en branch».
2. Registrar en `docs/debt/technical-debt.md` las filas de §12: bloqueos B-01, B-02, B-05, B-06,
   B-07, la ausencia de registro de consentimiento y la ausencia de antispam real.
3. Ejecutar todos los gates del perfil §5.
4. Limpieza residual: claves de traducción huérfanas, estados muertos.

**DoD fase E:** los cinco gates del perfil §5 en verde, ejecutados de verdad.

---

## 8. Criterios de aceptación (DoD)

### 8.1 La firma y las dos vías

- [x] El retrato del fundador es un marcador dimensionado, nunca una foto de banco.
- [x] La nota de habilitación reproduce el literal y marca el registro como pendiente.
- [x] Nada sugiere que exista ya un panel de trazabilidad accesible.
- [x] La cadena convencional se traza entera antes que la de OPTIMVS.
- [x] La desambiguación de «CDI» como Clave de Identificación es explícita.
- [x] Se explicita que OPTIMVS deriva y no ejecuta ni custodia.
- [x] Los organismos aparecen solo como texto, sin ningún logotipo.
- [x] Los catorce tests FIR-01…FIR-14 existen y pasan.

### 8.2 Formulario y cierre

- [x] La validación es pura, cubre los nueve campos y tiene cobertura ≥ 80 %.
- [x] Dos casillas de consentimiento, separadas y sin premarcar.
- [x] El consentimiento comercial es opcional; el de datos, obligatorio.
- [x] El contexto del simulador se muestra al usuario antes de enviarse.
- [x] Un envío correcto mueve el foco a la confirmación y la anuncia.
- [x] Un fallo conserva lo escrito y ofrece contacto directo.
- [x] Sin claves configuradas el formulario sigue operativo y da un error honesto.
- [x] Ningún teléfono ni dominio plausible en toda la superficie.
- [x] Ninguna clave de EmailJS literal en el bundle.
- [x] Los veinticuatro tests FRM-01…FRM-24 existen y pasan.

### 8.3 Global

- [x] `docs/product/roadmap.md` fila 06 actualizada a «hecho en branch».
- [x] Lo no cubierto → filas honestas en `docs/debt/technical-debt.md`.
- [x] Se respetan el idioma y la política de comentarios del perfil §1.
- [x] No se modificó ninguna zona protegida del perfil §6 sin autorización de C3.
- [x] Todos los gates del perfil §5 en verde, ejecutados de verdad.
- [x] Ningún invariante del perfil §7 roto en la superficie tocada.

---

## 9. Fuera de alcance (v1)

| Ítem | Notas |
|------|-------|
| Publicación de teléfonos y dominio reales | Bloqueos B-01 y B-02; los aporta el cliente |
| Retrato del fundador | Bloqueo B-06 |
| Enlaces a redes sociales | Bloqueo B-07 |
| Nombres de las entidades ALyC y ESI aliadas | El cliente no los ha facilitado (S6) |
| WhatsApp | D10: no mencionado en el dossier ni confirmado |
| Registro con prueba del consentimiento | Requiere backend; deuda §12.3 |
| Antispam con verificación real | Requiere backend; deuda §12.4 |
| Panel de trazabilidad e informes diarios | F6: es producto, no web |
| Páginas legales y política de privacidad | Documento 07 |
| Banner de cookies y analítica | Documento 07 |
| Adaptación móvil | Documento 08 |

---

## 10. Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| Se publica uno de los cuatro teléfonos del dossier y resulta ser el equivocado | I2 + D9 + FRM-19: marcador obligatorio, test que falla si aparece un número |
| Una clave de EmailJS acaba escrita literal en el código | I8 + FRM-21, que inspecciona el bundle de producción |
| El formulario queda muerto en producción porque faltan las claves | §3.6 + FRM-14: sigue operativo y da un error honesto con alternativa |
| Un lector de pantalla no se entera de que el formulario se ha enviado | D8 + FRM-12: foco movido a la confirmación y anuncio con `role="status"` |
| Se recoge consentimiento sin poder demostrarlo, incumpliendo el RGPD | Deuda §12.3 registrada explícitamente, no disimulada; requiere backend |
| El contexto del simulador viaja en un campo oculto sin que el usuario lo sepa | D5 + FRM-11: se muestra qué se envía |
| Las casillas de consentimiento vienen premarcadas o fusionadas en una | D3 + FRM-08, que verifica separación y estado inicial |
| Se usa una foto de banco de imágenes como retrato del fundador | F1 + FIR-03: el test falla si aparece un `<img>` de retrato |
| Se colocan logotipos de CNMV o CNV para dar sensación de aval | I6 + FIR-08 |
| El texto sobre trazabilidad en tiempo real se convierte en un botón que no lleva a nada | F6 + FIR-05 |

---

## 11. Casos de prueba mínimos (checklist de revisión)

- [x] Llego al acto VI y veo quién es la firma y quién la fundó, con la cita del «nuevo Occidente».
- [x] Donde iría el retrato hay un marcador claro, no una foto genérica de ejecutivo.
- [x] Veo dibujarse la cadena convencional larga y después la de OPTIMVS, corta.
- [x] Leo la nota de habilitación y veo marcado que falta el registro concreto.
- [x] En el acto VII entiendo que aquí «CDI» significa Clave de Identificación, no el convenio.
- [x] Paso por las ocho siglas: cada una tiene su definición accesible.
- [x] No veo ningún logotipo de CNMV, CNV, AEAT ni ARCA.
- [x] Llego al cierre a pantalla completa con «Reserve su sesión privada».
- [x] Relleno el formulario solo con teclado, de principio a fin.
- [x] Intento enviar sin marcar el consentimiento de datos: no me deja y me dice por qué.
- [x] Marco solo el consentimiento de datos y no el comercial: me deja enviar.
- [x] Si he usado el simulador, veo qué escenario se va a enviar con mi solicitud.
- [x] Envío: el foco salta a la confirmación y me dice el plazo de respuesta.
- [x] Desconecto la red y reintento: conservo todo lo escrito y me ofrecen escribir directamente.
- [x] En el footer veo las dieciséis fuentes, con «Think Tanks» bien escrito.
- [x] No hay iconos de redes sociales que no lleven a ningún sitio.

---

## 12. Deuda explícita (registrar al implementar)

### 12.1 E2E — Reserva completa

- Historia: como visitante, recorro la home hasta el cierre, relleno el formulario y recibo la
  confirmación de que mi solicitud se ha enviado.
- Detectada en: este doc §7 fase D. Sin E2E en v1 (perfil §3).

### 12.2 Bloqueos de contacto del cliente

- B-01 teléfonos contradictorios · B-02 dominio provisional · B-05 datos registrales ·
  B-06 retrato del fundador · B-07 URLs de redes. Todos renderizados como marcadores.
- Detectada en: `content/08-notas-editoriales.md`.

### 12.3 Sin registro de prueba del consentimiento

- El RGPD exige poder demostrar el consentimiento con fecha, hora y texto exacto aceptado. Sin
  backend, EmailJS entrega el mensaje pero no constituye un registro de consentimiento fiable.
  **Es una carencia real de cumplimiento**, no un detalle técnico.
- Mitigación futura: función serverless que registre el consentimiento antes de enviar.
- Detectada en: este doc §5.

### 12.4 Antispam sin verificación real

- Honeypot y límite de frecuencia en cliente son disuasorios, no protección. Sin backend no hay
  forma de validar el origen del envío.
- Detectada en: este doc §3.6.

### 12.5 Nombres de entidades aliadas

- Nombrar las entidades ALyC y ESI/agencia convertiría el acto VII en el mayor generador de
  confianza del sitio. El cliente no las ha facilitado.
- Detectada en: este doc §2.3 S6.

### 12.6 Registro de habilitación regulatoria

- El dossier invoca «la habilitación correspondiente» sin especificar cuál ni ante qué organismo.
  Es el dato que un inversor prudente intentará verificar.
- Detectada en: `content/secciones/06-estructura-operativa.md` §Advertencia de copy.

---

## 13. Referencias de código (pre-feature)

| Área | Rutas |
|------|-------|
| Contenido literal del acto VI | `content/secciones/06-estructura-operativa.md` |
| Contenido literal del acto VII | `content/secciones/07-asesoramiento-intermediacion.md` |
| Cierre, formulario, footer y fuentes | `content/secciones/08-cta-contacto.md` |
| RGPD y consentimientos | `content/07-legal-y-disclaimers.md` |
| Glosario de siglas | `content/01-identidad-y-tono.md` |
| Bloqueos de contacto | `content/08-notas-editoriales.md` |
| Diagrama de proceso y garantías | `src/components/ProcessDiagram.tsx`, `GuaranteeCards.tsx` (documento 04) |
| Comparativa pareada | `src/components/PairedComparison.tsx` (documento 03) |
| Lectura de entorno | `src/lib/env.ts` (documento 00) |
| Footer con marcadores | `src/app/` (documento 00 D5) |

---

## 14. Orden de trabajo sugerido en el branch

```text
main
  Fase A  → contenido tipado, secciones estáticas y footer poblado
  Fase B  → cadena de intermediación y coreografía de los actos VI–VII
  Fase C  → formulario con validación pura, consentimientos y accesibilidad
  Fase D  → envío por EmailJS, estados y escena de cierre a pantalla completa
  Fase E  → docs + deuda + gates
```

Dependencias duras: todo requiere los documentos 00 a 05 cerrados. B reutiliza `<ProcessDiagram>`
del documento 04; C necesita las secciones estáticas de A; D necesita el formulario de C y
`src/lib/env.ts` del documento 00. La preselección de interés depende del documento 05 F6. E es
siempre la última.

---

*Documento vivo de implementación. Actualizar los checkboxes del DoD y el estado del encabezado
al cerrar cada fase.*

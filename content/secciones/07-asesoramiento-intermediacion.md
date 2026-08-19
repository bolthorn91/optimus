# Sección VII — Asesoramiento e intermediación transfronteriza

## Metadatos

| Campo | Valor |
|---|---|
| id | `asesoramiento` |
| slug | `#asesoramiento` |
| orden | 7 |
| origen | PDF pág. 15 |
| función narrativa | **Detalle operativo** — el marco legal concreto de cada vía |

---

## Objetivo

Cerrar las últimas objeciones técnicas antes del CTA: *«sí, pero ¿cómo se hace legalmente?»*.
Es la sección más técnica y la que da soporte a las afirmaciones de las secciones IV y V.

---

## Contenido literal

### Entradilla

> Para la operativa de capitales y adquisición de activos entre España y Argentina
> disponemos del marco legal adecuado:

### Las dos vías

**Inmuebles**

> Tramitación de CDI / CDI-CUIL para compradores no residentes, estructuración vía
> fideicomisos o escrituras con apoderamiento notarial apostillado (Apostilla de La Haya).

**Valores Financieros**

> Alianzas estratégicas tipo Introducing Broker con entidades reguladas (ALyC en Argentina
> y agencias/ESIs reguladas por CNMV en España) para la derivación e ingreso legal de
> capitales.

---

## Elementos estructurados

### Vía 1 · Inmuebles

| Elemento | Detalle |
|---|---|
| Identificación fiscal | Tramitación de **CDI / CDI-CUIL** para compradores no residentes |
| Estructuración | Vía **fideicomisos** o **escrituras** |
| Poderes | Apoderamiento notarial apostillado (**Apostilla de La Haya**) |
| Destinatario | Comprador no residente en Argentina |

⚠️ **Colisión de siglas.** En este punto «CDI» **no** significa *Convenio de Doble
Imposición* (como en la sección IV), sino **Clave de Identificación**: el identificador
fiscal que ARCA (ex-AFIP) asigna en Argentina a sujetos que no pueden obtener CUIT/CUIL.
Usar la misma sigla con dos significados distintos en el mismo documento es un problema
serio de comprensión para el lector español. **En la web hay que desambiguar
explícitamente.** Ver [`08-notas-editoriales.md`](../08-notas-editoriales.md).

### Vía 2 · Valores financieros

| Elemento | Detalle |
|---|---|
| Figura | Alianzas estratégicas tipo **Introducing Broker** |
| Contraparte en Argentina | **ALyC** — Agentes de Liquidación y Compensación (regulados por CNV) |
| Contraparte en España | Agencias / **ESIs** reguladas por **CNMV** |
| Función | Derivación e ingreso legal de capitales |

> **Implicación importante:** la figura de *Introducing Broker* significa que OPTIMVS
> **capta y deriva** al cliente hacia una entidad regulada que ejecuta; no ejecuta ni
> custodia por sí misma. El copy de la web debe reflejarlo con precisión: es un punto de
> transparencia, no una debilidad, y protege a la firma frente a la normativa española de
> servicios de inversión.

### Mapa de la operativa

```
INVERSOR (España)
     │
     ├──── VÍA INMUEBLES ─────────────────────────────────┐
     │     • Tramitación CDI / CDI-CUIL                    │
     │     • Fideicomiso o escritura                       │
     │     • Poder notarial apostillado (La Haya)          │
     │                                                     ▼
     │                                          ACTIVO INMOBILIARIO
     │                                          a nombre del inversor
     │                                          o su vehículo societario
     │
     └──── VÍA VALORES FINANCIEROS ──────────────────────┐
           • Agencia / ESI regulada por CNMV (España)     │
           • ALyC regulado por CNV (Argentina)            │
           • OPTIMVS como Introducing Broker              │
                                                          ▼
                                               CARTERA DE TÍTULOS
                                               en entidad regulada
```

### Organismos y marcos citados

| Sigla | Organismo / marco | Jurisdicción |
|---|---|---|
| CNMV | Comisión Nacional del Mercado de Valores | 🇪🇸 España |
| CNV | Comisión Nacional de Valores | 🇦🇷 Argentina |
| ESI | Empresa de Servicios de Inversión | 🇪🇸 España |
| ALyC | Agente de Liquidación y Compensación | 🇦🇷 Argentina |
| ARCA | Agencia de Recaudación y Control Aduanero (ex-AFIP) | 🇦🇷 Argentina |
| AEAT | Agencia Estatal de Administración Tributaria | 🇪🇸 España |
| — | Convenio de La Haya (Apostilla) | Multilateral |
| — | Convenio para Evitar la Doble Imposición España–Argentina | Bilateral |

---

## Indicaciones para la web

**Composición sugerida:**

```
[H2] VII. Asesoramiento e intermediación transfronteriza
[Entradilla]

┌──────────────────────────┬──────────────────────────┐
│  🏛  INMUEBLES            │  📈 VALORES FINANCIEROS   │
│                          │                          │
│  • Tramitación CDI/CUIL  │  • Introducing Broker    │
│  • Fideicomiso o         │  • ALyC (CNV, Argentina) │
│    escritura             │  • Agencia/ESI (CNMV,    │
│  • Poder apostillado     │    España)               │
│                          │                          │
│  [Ver proceso →]         │  [Ver proceso →]         │
└──────────────────────────┴──────────────────────────┘

[Banda de logos/siglas de organismos reguladores]

[CTA principal → #contacto]
```

- **Dos columnas contrapuestas**, una por vía. Es el patrón más claro para esta sección.
- **Banda de organismos:** listar CNMV, CNV, AEAT, ARCA, ALyC, Apostilla de La Haya como
  marca de rigor institucional. ⚠️ **Sin usar los logotipos oficiales de los organismos** —
  su uso sugiere aval o supervisión y puede constituir un problema legal. Usar sólo texto
  o siglas en tratamiento tipográfico neutro.
- **Desambiguación de «CDI»:** obligatoria. Propuesta de copy para la web:

  > Tramitación de la **Clave de Identificación (CDI) o CUIL** ante ARCA para compradores
  > no residentes en Argentina — no debe confundirse con el Convenio para Evitar la Doble
  > Imposición (CDI) mencionado en el apartado fiscal.

- **Glosario emergente:** en esta sección hay 8 siglas en dos párrafos. Implementar
  tooltips o un glosario desplegable al pie. Ver
  [`01-identidad-y-tono.md`](../01-identidad-y-tono.md).
- **«Ver proceso»:** si se dispone de contenido, abrir un paso a paso de la operativa por
  vía. En v1, enlazar al formulario con la vía preseleccionada.

---

## Assets

Ninguna imagen en el original.

**A crear:**
- Diagrama de las dos vías operativas (esquema de arriba, en versión gráfica).
- 2 iconos (inmueble / valores).

**A solicitar al cliente:**
- Nombre de las entidades ALyC y ESI/agencia con las que existe alianza, si es publicable.
  Nombrarlas convertiría esta sección en el mayor generador de confianza del sitio.

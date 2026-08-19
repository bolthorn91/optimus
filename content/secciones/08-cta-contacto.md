# Sección 08 — CTA, contacto y fuentes

## Metadatos

| Campo | Valor |
|---|---|
| id | `contacto` / `fuentes` |
| slug | `#contacto`, `#fuentes` |
| orden | 8–9 |
| origen | PDF pág. 15 (cierre) |
| función narrativa | **Conversión** |

---

## Objetivo

Es el objetivo del sitio entero: que el visitante **reserve la sesión privada de
diagnóstico patrimonial**. Todo lo anterior existe para llegar aquí.

---

## Contenido literal

### Llamada a la acción

> Reserve su sesión privada de diagnóstico patrimonial, analice junto a nuestros
> consultores cómo estructurar la salida parcial de capitales hacia activos estratégicos
> en Argentina con total respaldo legal y operativo, evite que su esfuerzo quede atrapado
> en un mercado con una proyección en baja, mitigue los riesgos hacia su patrimonio y
> obtenga los beneficios de la estabilidad de su valor.

### Datos de contacto

> **Consultoría confidencial: Atención directa**
> España: +34 698 900 559 | Argentina: +54 9 11 0000 0000
> Correo: consultoria@optimvs.cp.com
> www.optimvs.cp.com

### Fuentes

> ACLED, Global Guardian, Crisis24, NASA, Think Thanks, Merval, Clave Bursátil, Convenio
> de La Haya, CNMV, CNV, INDEC, Banco de España, BCE, BCRA, AEAT, ARCA.

---

## Elementos estructurados

### El CTA descompuesto en sus 5 promesas

El párrafo original encadena cinco acciones. En web deben separarse:

| # | Acción | Uso sugerido |
|---|---|---|
| 1 | **Reserve** su sesión privada de diagnóstico patrimonial | Titular del bloque / texto del botón |
| 2 | **Analice** junto a nuestros consultores cómo estructurar la salida parcial de capitales hacia activos estratégicos en Argentina, con total respaldo legal y operativo | Subtítulo |
| 3 | **Evite** que su esfuerzo quede atrapado en un mercado con una proyección en baja | Viñeta de beneficio |
| 4 | **Mitigue** los riesgos hacia su patrimonio | Viñeta de beneficio |
| 5 | **Obtenga** los beneficios de la estabilidad de su valor | Viñeta de beneficio |

### Datos de contacto — ⚠️ contradictorios en el original

| Canal | Texto (pág. 15) | Cabecera gráfica (todas las págs.) | Estado |
|---|---|---|---|
| Teléfono España | +34 698 900 559 | +34 611 983 914 | ❌ **Contradicción — confirmar** |
| Teléfono Argentina | +54 9 11 0000 0000 | +54 9 11 10101010 | ❌ **Ambos son placeholders** |
| Email | consultoria@optimvs.cp.com | consultoria@optimvs.cp.com | ⚠️ Dominio inusual — confirmar |
| Web | www.optimvs.cp.com | www.optimvs.cp.com | ⚠️ Confirmar dominio definitivo |

**Naturaleza del servicio de contacto:** *consultoría confidencial, atención directa*.

### Fuentes citadas — normalizadas

| Categoría | Fuentes |
|---|---|
| Conflicto y riesgo global | ACLED, Global Guardian, Crisis24 |
| Científicas | NASA |
| Análisis | *Think Tanks* ⚠️ (en el original: «Think Thanks» — errata) |
| Mercados | Merval, Clave Bursátil |
| Marco legal | Convenio de La Haya |
| Reguladores de valores | CNMV (España), CNV (Argentina) |
| Estadística | INDEC (Argentina) |
| Bancos centrales | Banco de España, BCE, BCRA |
| Administración tributaria | AEAT (España), ARCA (Argentina) |

---

## Indicaciones para la web

### Bloque de conversión

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│   Reserve su sesión privada de                          │
│   diagnóstico patrimonial                               │
│                                                          │
│   Analice junto a nuestros consultores cómo             │
│   estructurar la salida parcial de capitales            │
│   hacia activos estratégicos en Argentina.              │
│                                                          │
│   ✓ Evite que su esfuerzo quede atrapado en un          │
│     mercado con proyección en baja                      │
│   ✓ Mitigue los riesgos hacia su patrimonio             │
│   ✓ Obtenga los beneficios de la estabilidad            │
│     de su valor                                         │
│                                                          │
│   ┌────────────────────────────────────────┐            │
│   │  [FORMULARIO]                          │            │
│   └────────────────────────────────────────┘            │
│                                                          │
│   Consultoría confidencial · Atención directa           │
└──────────────────────────────────────────────────────────┘
```

### Formulario — campos

| Campo | Tipo | Obligatorio | Nota |
|---|---|---|---|
| Nombre y apellidos | texto | ✅ | |
| Email | email | ✅ | Validación de formato |
| Teléfono | tel | ✅ | Con selector de prefijo internacional |
| País de residencia fiscal | select | ✅ | Relevante para el CDI. Por defecto: España |
| Interés principal | select | ✅ | Inmuebles / Acciones y títulos / Proyectos al pozo / No lo tengo claro |
| Horquilla de capital | select | ⬜ | Opcional. Cualifica el lead sin bloquear la conversión |
| Mensaje | textarea | ⬜ | |
| Consentimiento RGPD | checkbox | ✅ | **Sin premarcar.** Enlace a política de privacidad |
| Consentimiento comercial | checkbox | ⬜ | Separado del anterior. Sin premarcar |

**Notas de implementación:**
- Preseleccionar «Interés principal» cuando se llega desde una tarjeta de la sección V
  o una vía de la sección VII.
- Protección antispam **sin CAPTCHA visible** (honeypot + límite de envíos). Un CAPTCHA
  en el punto de conversión de un producto patrimonial cuesta leads.
- Página o estado de confirmación explícito tras el envío, con plazo de respuesta.
- Almacenamiento y tratamiento conformes a RGPD. Ver
  [`07-legal-y-disclaimers.md`](../07-legal-y-disclaimers.md).

### Canales directos

Junto al formulario, ofrecer contacto inmediato:

- **Teléfono España** — enlace `tel:`, con horario de atención indicado.
- **Teléfono Argentina** — enlace `tel:`, indicando zona horaria.
- **Email** — enlace `mailto:`.
- **WhatsApp** — si el cliente lo usa; en este perfil de negocio es habitual y convierte.
  ⚠️ El dossier no lo menciona: confirmar antes de añadirlo.

> ⚠️ **No publicar ningún teléfono hasta que el cliente confirme cuáles son los reales.**
> Los cuatro números del dossier son contradictorios entre sí o claramente ficticios.

### Footer

```
[Logo OPTIMVS Capital Protegido]

Navegación         Legal                    Contacto
· Escenario        · Aviso legal            España: +34 …
· Seguridad        · Política de privacidad Argentina: +54 …
· Estrategia       · Política de cookies    consultoria@…
· Activos
· Nosotros         [Redes: IG · TikTok · FB · LinkedIn]

────────────────────────────────────────────────────────
Fuentes: ACLED · Global Guardian · Crisis24 · NASA ·
Think Tanks · Merval · Clave Bursátil · Convenio de La Haya ·
CNMV · CNV · INDEC · Banco de España · BCE · BCRA · AEAT · ARCA

[Disclaimer financiero — ver 07-legal-y-disclaimers.md]

© [año] OPTIMVS Capital Protegido. Todos los derechos reservados.
[Razón social · CIF · domicilio · datos registrales]
```

- **Fuentes:** darles visibilidad real, no letra minúscula escondida. Son el respaldo de
  todo el argumentario y refuerzan la credibilidad. Corregir «Think Thanks» → «Think Tanks».
- **Redes sociales:** sólo si hay perfiles activos y con URL confirmada.
- **Descarga del dossier PDF:** enlace en el footer, además del CTA secundario del hero.

---

## Assets

| Archivo | Descripción |
|---|---|
| `assets-origen/p02-X13.png` | Banda de cabecera con logo y datos de contacto — base para el footer |
| `assets-origen/p01-X10.png` | Iconos de redes sociales (Instagram, TikTok, Facebook, LinkedIn) |
| `assets-origen/p15-X60.png` | Emblema en perspectiva — apto como elemento decorativo del footer |

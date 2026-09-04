# Deuda técnica — OPTIMVS Capital Protegido

Registro honesto de lo que no queda cubierto. Cada fase E de un documento de goal añade aquí
las filas que correspondan (perfil §3).

**Reglas:**

- Una fila se añade cuando algo queda sin cubrir, no cuando alguien promete cubrirlo.
- Toda fila cita el documento y la sección que la originó.
- Una fila se borra cuando la deuda se salda, no cuando deja de molestar.

---

## §1 Historias E2E sin cobertura

El proyecto no tiene E2E en v1 (perfil §3). Las historias que un E2E debería cubrir se
registran aquí para que la decisión sea explícita y no un olvido.

| Id | Historia | Origen | Estado |
|----|----------|--------|--------|
| E2E-00-HOME | Como visitante, recorro la home de principio a fin y alcanzo el formulario de reserva sin que ninguna escena falle ni pierda contenido | doc 00 §12.1 | abierto |
| E2E-00-MOTION | Como usuario con `prefers-reduced-motion` activo, recorro la home y recibo el mismo contenido que sin esa preferencia | doc 00 §12.2 | abierto |
| E2E-01-ACT1 | Como visitante, recorro el hero y el acto I completos y llego al CTA intermedio habiendo visto los tres factores y la cifra ancla | doc 01 §12.1 | abierto |
| E2E-02-ACT2 | Como visitante, recorro el acto II y veo los cuatro estados de riesgo en orden cronológico, con Sudamérica destacada al final | doc 02 §12.1 | abierto |

---

## §2 Cobertura y tests

| Id | Deuda | Origen | Estado |
|----|-------|--------|--------|
| _(vacío)_ | | | |

---

## §3 Contenido pendiente del cliente

Bloqueos y decisiones editoriales que el cliente aún no ha cerrado (perfil §7 I1, I2). Origen:
[`content/08-notas-editoriales.md`](../../content/08-notas-editoriales.md) y los documentos de goal.

| Id | Pendiente | Afecta a | Estado |
|----|-----------|----------|--------|
| B-01 | Teléfonos de España y Argentina: el texto y la cabecera del dossier se contradicen, y los argentinos son placeholders | doc 06, doc 07 | abierto |
| B-02 | Dominio y correo definitivos: `optimvs.cp.com` parece provisional | doc 06, doc 07 | abierto |
| B-03 | Mapa de proyección 2050: en el PDF es byte-idéntico al de «actualidad». v1 dibuja un estado derivado (Ártico y EE.UU. en high) marcado como proyección; falta el mapa real del cliente | doc 02 §12.2 | abierto |
| B-04 | Logotipo vectorial (SVG/AI/EPS) y versiones en negativo y monocromo | doc 00 | abierto |
| B-05 | Datos registrales de la sociedad española y de la argentina | doc 07 | abierto |
| B-06 | Retrato profesional de Carlos Carbajal | doc 06 | abierto |
| B-07 | URLs de los perfiles de Instagram, TikTok, Facebook y LinkedIn | doc 06 | abierto |
| E-02 | Redacción correcta de la frase incompleta en la conclusión del acto III | doc 03 | abierto |
| E-05 | Importe mínimo de inversión, o explicación de cómo se determina | doc 05, doc 06 | abierto |
| E-07 | Decisión sobre el apartado de modificación climática: se reproduce literal por I1. Cliente: mantener con fuente, reformular o suprimir | doc 02 §12.3 | abierto |
| E-08 | Tiempo verbal de las normas europeas aún en tramitación (Chat Control, Euro Digital). Reproducido literal (I1); la corrección es decisión editorial del cliente | doc 01 §12.3 / `content/08-notas-editoriales.md` E-08 | abierto |
| VIS-01 | El cliente pidió iconografía literal de amenaza (E2); v1 implementa la variante abstracta y cartográfica (E1). Falta confirmación del cliente | doc 01 §2.5 / §12.2 | abierto |
| — | Nombre publicable de las entidades ALyC y ESI/agencia aliadas | doc 06 | abierto |
| MAP-LIC-02 | Verificar que la clasificación de riesgo por región no reproduce un producto con licencia de ACLED, Global Guardian o Crisis24. Los SVG se redibujaron desde cero (F1) | doc 02 §12.4 | abierto |
| — | Licencia y atribución de la imagen satelital y la foto del Obelisco | doc 03, doc 04 | abierto |

---

## §4 Duplicación causada por zonas protegidas

| Id | Duplicación | Zona protegida implicada | Origen |
|----|-------------|--------------------------|--------|
| LOOP-01 | `agent-docs/templates/goal-prompt.template.md` y `goal-prompt.metaprompt.md` (y las copias en `goal-loop-kit/agent-docs/templates/`) siguen emitiendo el protocolo sin puerta humana. Los nueve `docs/product/*-goal-prompt.md` y la skill `/goal` §5 pasos 8–10 ya la insertan. `--make-prompt` regeneraría prompts viejos. | `agent-docs/templates/**` (perfil §6) | migración Grok 2026-08-25 |

---

## §5 Rendimiento y accesibilidad

| Id | Deuda | Origen | Estado |
|----|-------|--------|--------|
| A11Y-00-SPA | El sitio es una SPA: sin JavaScript no hay contenido. Afecta al SEO y a la robustez. Mitigación futura: prerenderizado estático de la home y las páginas de detalle | doc 00 §12.3 | abierto |

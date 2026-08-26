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
| _(vacío — se puebla al cerrar cada goal)_ | | | |

---

## §2 Cobertura y tests

| Id | Deuda | Origen | Estado |
|----|-------|--------|--------|
| _(vacío)_ | | | |

---

## §3 Contenido pendiente del cliente

Bloqueos que obligan a renderizar un marcador en vez del dato real (perfil §7 I1, I2). Origen:
[`content/08-notas-editoriales.md`](../../content/08-notas-editoriales.md).

| Id | Pendiente | Afecta a | Estado |
|----|-----------|----------|--------|
| B-01 | Teléfonos de España y Argentina: el texto y la cabecera del dossier se contradicen, y los argentinos son placeholders | doc 06, doc 07 | abierto |
| B-02 | Dominio y correo definitivos: `optimvs.cp.com` parece provisional | doc 06, doc 07 | abierto |
| B-03 | Mapa de proyección 2050: en el PDF es byte-idéntico al de «actualidad» | doc 02 | abierto |
| B-04 | Logotipo vectorial (SVG/AI/EPS) y versiones en negativo y monocromo | doc 00 | abierto |
| B-05 | Datos registrales de la sociedad española y de la argentina | doc 07 | abierto |
| B-06 | Retrato profesional de Carlos Carbajal | doc 06 | abierto |
| B-07 | URLs de los perfiles de Instagram, TikTok, Facebook y LinkedIn | doc 06 | abierto |
| E-02 | Redacción correcta de la frase incompleta en la conclusión del acto III | doc 03 | abierto |
| E-05 | Importe mínimo de inversión, o explicación de cómo se determina | doc 05, doc 06 | abierto |
| E-07 | Decisión sobre el apartado de modificación climática: mantener con fuente, reformular o suprimir | doc 02 | abierto |
| E-08 | Tiempo verbal de las normas europeas aún en tramitación (Chat Control, Euro Digital) | doc 01 | abierto |
| — | Nombre publicable de las entidades ALyC y ESI/agencia aliadas | doc 06 | abierto |
| — | Licencia y atribución de los mapas de riesgo, la imagen satelital y la foto del Obelisco | doc 02, doc 03, doc 04 | abierto |

---

## §4 Duplicación causada por zonas protegidas

| Id | Duplicación | Zona protegida implicada | Origen |
|----|-------------|--------------------------|--------|
| LOOP-01 | `agent-docs/templates/goal-prompt.template.md` y `goal-prompt.metaprompt.md` (y las copias en `goal-loop-kit/agent-docs/templates/`) siguen emitiendo el protocolo sin puerta humana. Los nueve `docs/product/*-goal-prompt.md` y la skill `/goal` §5 pasos 8–10 ya la insertan. `--make-prompt` regeneraría prompts viejos. | `agent-docs/templates/**` (perfil §6) | migración Grok 2026-08-25 |

---

## §5 Rendimiento y accesibilidad

| Id | Deuda | Origen | Estado |
|----|-------|--------|--------|
| _(vacío)_ | | | |

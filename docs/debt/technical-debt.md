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
| E2E-03-ACT3 | Como visitante, recorro el acto III y veo caer la noche sobre ambos países mientras los contadores cierran en sus valores reales | doc 03 §12.1 | abierto |
| E2E-03-WEBGL | Como visitante en un dispositivo sin WebGL, recibo el mismo contenido del acto III en forma estática | doc 03 §12.2 | abierto |
| E2E-04-CDI | Como visitante, recorro el acto IV y veo los cinco pasos del convenio trazarse en orden, terminando en la afirmación de que no se tributa dos veces | doc 04 §12.1 | abierto |
| E2E-05-SIM | Como visitante, muevo capital, horizonte y escenario, veo el resultado con sus supuestos, y llego al formulario con el vehículo elegido | doc 05 §12.1 | abierto |
| E2E-06-RESERVE | Como visitante, recorro la home hasta el cierre, relleno el formulario y recibo la confirmación de que mi solicitud se ha enviado | doc 06 §12.1 | abierto |
| E2E-07-DETAIL | Como visitante, salto de un acto de la home a su página de detalle, la leo entera y vuelvo a mi posición anterior | doc 07 §12.1 | abierto |
| E2E-08-MOBILE | Como visitante desde un móvil, recorro la home entera y envío el formulario de reserva sin que ningún elemento me lo impida | doc 08 §12.1 | abierto |

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
| B-05 | Datos registrales de la sociedad española y de la argentina. Sin ellos las tres páginas legales quedan con marcadores y `noindex` | doc 06 §12.2, doc 07 §12.2 | abierto |
| B-06 | Retrato profesional de Carlos Carbajal | doc 06 | abierto |
| B-07 | URLs de los perfiles de Instagram, TikTok, Facebook y LinkedIn | doc 06 | abierto |
| E-02 | Redacción correcta de la frase incompleta en la conclusión del acto III. Se reproduce literal por I1; falta una conjunción o un verbo | doc 03 §12.3 | abierto |
| E-05 | Importe mínimo de inversión, o explicación de cómo se determina | doc 05, doc 06 | abierto |
| E-07 | Decisión sobre el apartado de modificación climática: se reproduce literal por I1. Cliente: mantener con fuente, reformular o suprimir | doc 02 §12.3 | abierto |
| E-08 | Tiempo verbal de las normas europeas aún en tramitación (Chat Control, Euro Digital). Reproducido literal (I1); la corrección es decisión editorial del cliente | doc 01 §12.3 / `content/08-notas-editoriales.md` E-08 | abierto |
| VIS-01 | El cliente pidió iconografía literal de amenaza (E2); v1 implementa la variante abstracta y cartográfica (E1). Falta confirmación del cliente | doc 01 §2.5 / §12.2 | abierto |
| ALLY-06 | Nombre publicable de las entidades ALyC y ESI/agencia aliadas. Nombrarlas convertiría el acto VII en el mayor generador de confianza del sitio | doc 06 §12.5 / S6 | abierto |
| REG-06 | El dossier invoca «la habilitación correspondiente» sin especificar cuál ni ante qué organismo. El sitio reproduce el literal y marca el registro como pendiente | doc 06 §12.6 / F5 | abierto |
| MAP-LIC-02 | Verificar que la clasificación de riesgo por región no reproduce un producto con licencia de ACLED, Global Guardian o Crisis24. Los SVG se redibujaron desde cero (F1) | doc 02 §12.4 | abierto |
| SAT-LIC-03 | La textura nocturna deriva de `p09-X36.png`, de estética compatible con *Earth at Night* de la NASA. Verificar procedencia y forma de atribución antes de publicar. Sin logotipo de la NASA (I6) | doc 03 §12.4 | abierto |
| RGPD-CONSENT | Sin backend no hay prueba del consentimiento (fecha, hora y texto exacto). EmailJS entrega el mensaje pero no constituye un registro fiable. Carencia real de cumplimiento | doc 06 §12.3 / §5 | abierto |
| ANTISPAM-06 | Honeypot y límite de frecuencia en cliente son disuasorios, no protección. Sin backend no hay forma de validar el origen del envío | doc 06 §12.4 / §3.6 | abierto |
| E-04 | Matización de siete afirmaciones absolutas del acto IV («garantizando máxima seguridad jurídica», «elimina de raíz», «jamás se tributen dos veces», etc.). Se reproduce el literal por I1; la matización requiere la asesoría legal del cliente | doc 04 §12.2 / E4 | abierto |
| PHOTO-04 | Fotografía profesional con licencia para el acto IV. `p11-X43.png` (Obelisco) se descarta por calidad (G2); no se usa | doc 04 §12.3 / G2 | abierto |
| DET-04 | Página de detalle del marco fiscal: créditos, topes de retención, acreditación ante la AEAT, desinversión | doc 04 §12.4 · doc 07 | abierto |
| LEGAL-07 | `content/07-legal-y-disclaimers.md` se declara orientativo. Los tres documentos legales requieren validación de la asesoría del cliente antes de publicar | doc 07 §12.3 / D7 | abierto |
| VEH-07 | El dossier da tres celdas por vehículo. Las páginas de detalle quedan cortas; no se rellenan con marketing inventado (S3) | doc 07 §12.5 / S3 | abierto |
| SIM-RATES | Las tasas de `src/lib/projection-assumptions.ts` son supuestos del implementador, declarados como tales. Requieren validación del cliente y revisión de su asesoría legal antes de publicar | doc 05 §12.3 / S5 | abierto |
| TAX-CDI | El acto IV explica el CDI y el acto V proyecta valores brutos; el efecto fiscal no entra en la proyección porque exigiría datos personales | doc 05 §12.4 / §9 | abierto |

---

## §4 Duplicación causada por zonas protegidas

| Id | Duplicación | Zona protegida implicada | Origen |
|----|-------------|--------------------------|--------|
| LOOP-01 | `agent-docs/templates/goal-prompt.template.md` y `goal-prompt.metaprompt.md` (y las copias en `goal-loop-kit/agent-docs/templates/`) siguen emitiendo el protocolo sin puerta humana. Los nueve `docs/product/*-goal-prompt.md` y la skill `/goal` §5 pasos 8–10 ya la insertan. `--make-prompt` regeneraría prompts viejos. | `agent-docs/templates/**` (perfil §6) | migración Grok 2026-08-25 |

---

## §5 Rendimiento y accesibilidad

| Id | Deuda | Origen | Estado |
|----|-------|--------|--------|
| A11Y-00-SPA | El sitio es una SPA: sin JavaScript no hay contenido. Afecta al SEO y a la robustez, justo en las páginas de detalle que existen para ser encontradas. Mitigación futura: prerenderizado estático de home, actos y legales | doc 00 §12.3 · doc 07 §12.4 / G8 | abierto |
| PERF-03-GPU | En móvil el acto III sirve el fallback estático (doc 08 S3). La medición en portátiles con gráfica integrada queda como PERF-08-DEVICE | doc 03 §12.5 / §3.6 · doc 08 S3 | cerrado (2026-10-09) |
| ASSET-03-WEBP | F8 pide WebP con respaldo. El picture estático lo cubre (`nightfall-static.jpg`); el canvas carga solo WebP vía TextureLoader. Los PNG de país (~2 MB) no se servían y se retiraron | doc 03 F8 / §7 E | abierto |
| PERF-08-DEVICE | Las políticas de degradación de §3.2 se basan en criterio, no en medición sobre un parque de dispositivos. Falta verificar en gama media y baja reales (y en portátiles con gráfica integrada) y ajustar S7 | doc 08 §12.2 / S7 · doc 03 §12.5 | abierto |
| WEBGL-08-MOBILE | El acto III sirve el fallback en todo móvil, incluidos los que sí podrían ejecutar la escena. Decisión conservadora a revisar con datos reales | doc 08 §12.3 / S3 | abierto |
| TAB-08 | El tramo 768–1024 px hereda escritorio por encima de 1024 y móvil por debajo de 768. La franja intermedia se verifica pero no se optimiza | doc 08 §12.4 / F1 | abierto |

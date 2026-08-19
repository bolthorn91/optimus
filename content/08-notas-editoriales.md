# 08 — Notas editoriales

Erratas, contradicciones, duplicados y placeholders detectados en el dossier original.
**Leer antes de construir.** Cada punto requiere una decisión del cliente.

---

## 🔴 Bloqueantes — no publicar sin resolver

### B-01 · Los datos de contacto se contradicen

El PDF ofrece **dos juegos distintos** de teléfonos:

| Canal | Texto (pág. 15) | Cabecera gráfica (todas las páginas) |
|---|---|---|
| España | `+34 698 900 559` | `+34 611 983 914` |
| Argentina | `+54 9 11 0000 0000` | `+54 9 11 10101010` |

Ambos números argentinos son evidentemente **placeholders**. Los dos españoles son
plausibles pero incompatibles entre sí.

**Acción:** confirmar con el cliente los números reales. **No publicar ninguno** hasta
entonces.

### B-02 · El dominio parece provisional

`www.optimvs.cp.com` y `consultoria@optimvs.cp.com`.

El subdominio `.cp` dentro de `optimvs.cp.com` es una construcción inusual —
probablemente un marcador de «Capital Protegido» pendiente de sustituir por el dominio
definitivo.

**Acción:** confirmar el dominio real antes de generar enlaces canónicos, correos y
metadatos.

### B-03 · Falta el mapa de proyección 2050

La página 5 rotula dos mapas — «EN LA ACTUALIDAD» y «PROYECCIÓN 2050» — pero **ambos
apuntan a la misma imagen, byte a byte** (MD5 idéntico).

La proyección a 2050 es uno de los argumentos visuales más fuertes del dossier. Publicar
el mismo mapa dos veces con rótulos distintos es un error que un lector atento detecta de
inmediato, y daña la credibilidad justo en la sección que más depende de ella.

**Acción:** solicitar el mapa de 2050. Si no existe, eliminar el rótulo y presentar sólo
tres estados temporales.

### B-04 · Los logotipos no tienen transparencia

Todos los PNG de marca extraídos vienen con fondo blanco sólido. Sobre el navy del hero
aparecerían recortados en un rectángulo blanco.

**Acción:** solicitar el logotipo vectorial (SVG/AI/EPS) o, como mínimo, PNG con canal
alfa, más versiones en monocromo y en negativo.

### B-05 · Faltan los datos registrales

No hay razón social, CIF, domicilio ni datos de inscripción de ninguna de las dos
sociedades. Son obligatorios en el aviso legal.

**Acción:** solicitar los datos de la sociedad española y de la argentina.

---

## 🟡 Importantes — decisión editorial necesaria

### E-01 · Párrafo duplicado entre las secciones II y III

El mismo párrafo aparece dos veces, con una única variante:

**Sección II (pág. 6):**
> «…pronosticando como efecto una nueva ola migratoria hacia **América del Sur** durante
> los próximos años.»

**Sección III (pág. 7):**
> «…pronosticando como efecto una nueva ola migratoria hacia **Latinoamérica** durante los
> próximos años.»

El resto del párrafo es idéntico palabra por palabra.

**Recomendación:** conservarlo en la sección II, donde cierra el argumento de la «zona de
paz», y eliminarlo de la sección III.

### E-02 · Frase gramaticalmente incompleta en la conclusión de la sección III

> «…la geografía global mantiene a Argentina fuera de riesgo **una asimetría territorial
> única** en su mercado inmobiliario…»

Falta una conjunción o un verbo. Lecturas posibles:

- «…mantiene a Argentina fuera de riesgo, **con** una asimetría territorial única…»
- «…mantiene a Argentina fuera de riesgo **y le otorga** una asimetría territorial única…»

**Acción:** que el cliente confirme la redacción correcta. Es una frase de conclusión, muy
visible.

### E-03 · Errata en las fuentes

> «Think **Thanks**»

Debe ser **«Think Tanks»**. Aparece en el listado de fuentes de la última página.

### E-04 · Colisión de siglas: «CDI»

La sigla se usa con **dos significados incompatibles** en el mismo documento:

| Sección | Significado | Contexto |
|---|---|---|
| IV | **Convenio para Evitar la Doble Imposición** | «el CDI blinda el flujo de caja operativo» |
| VII | **Clave de Identificación** (identificador fiscal argentino) | «Tramitación de CDI / CDI-CUIL para compradores no residentes» |

Para un lector español, que probablemente conoce el primer sentido y no el segundo, esto
es confuso hasta el punto de parecer un error.

**Acción:** desambiguar explícitamente en la web. Propuesta de copy en
[`secciones/07-asesoramiento-intermediacion.md`](secciones/07-asesoramiento-intermediacion.md).

### E-05 · Falta la cifra de inversión mínima

El dossier insiste en que *«el suelo de inversión es mínimo y no tiene techo»* y menciona
*«un comprador a plazos de una propiedad en pozo con una cuota mínima»*, pero **nunca da
una cifra**.

Es probablemente la primera pregunta de cualquier visitante.

**Acción:** decidir si se publica un importe orientativo. Si no, el copy debe explicar
cómo se determina («se define en la sesión de diagnóstico según el activo»), no dejarlo
sin respuesta.

### E-06 · El PDF declara 58 páginas de material pero contiene 15

El archivo pesa 5,6 MB y algunas herramientas anuncian una paginación mayor. La
extracción confirma **15 páginas reales**, con el documento completo y coherente de la
portada al cierre con datos de contacto y fuentes.

**Acción:** confirmar con el cliente que no existe una versión ampliada con secciones
adicionales. Si la hay, este directorio debe actualizarse.

### E-07 · Afirmación sobre modificación climática

La subsección «Factor climático» (pág. 6) afirma que las principales potencias ejecutan
programas de modificación del clima y de la radiación solar en doce regiones concretas.

Es la afirmación más contestable del dossier, no está atribuida a ninguna fuente concreta
(NASA aparece sólo en el listado general del final), y es la que con más probabilidad
erosionará la credibilidad ante un inversor patrimonial — que es exactamente el público
objetivo.

**Acción:** decisión explícita del cliente. Tres opciones:
1. Mantenerla con fuente concreta y verificable citada al pie.
2. Reformularla en términos de riesgo climático y estrés hídrico, que están documentados
   y sostienen el mismo argumento.
3. Suprimirla — el argumento de la sección II funciona sin ella.

Es contenido del cliente y la decisión es suya; la nota queda registrada porque el
formato web amplifica el alcance respecto a un PDF enviado a un contacto directo.

### E-08 · Normas europeas descritas como cerradas

La sección I describe con futuro de certeza marcos regulatorios que todavía están en
tramitación o debate: *«impondrá el rastreo automatizado»* (Chat Control), *«la inminente
entrada en vigor»* (Euro Digital).

**Acción:** revisar el tiempo verbal hacia el condicional («la propuesta contempla»,
«de aprobarse en su redacción actual»). Es un cambio menor de redacción que reduce
exposición sin debilitar el argumento — y que, si la norma cambia, evita que la web quede
desactualizada de forma visible.

---

## 🟢 Menores

### M-01 · Redundancia entre las secciones II y III

Los párrafos sobre la comparación del desafío argentino frente al europeo se solapan
considerablemente. Al fusionar el contenido para web se puede compactar sin perder
argumento.

### M-02 · Logotipo duplicado

`p12-X47.png` y `p12-X49.png` son prácticamente idénticos. Conservar uno.

### M-03 · Fotografía del Obelisco con tratamiento amateur

Saturación excesiva, cielo procesado, aspecto de filtro de móvil. Desentona con el
posicionamiento patrimonial. Sustituir o regradar.

### M-04 · Sin URLs de redes sociales

La portada muestra iconos de Instagram, TikTok, Facebook y LinkedIn, pero el documento no
facilita ninguna dirección. Solicitarlas, o retirar los iconos.

### M-05 · «5 veces mayor» vs cálculo exacto

El dossier dice que Argentina tiene «una superficie 5 veces mayor»; el cociente real es
5,49. Ambas formulaciones son defendibles. Si se quiere precisión: «más de cinco veces».

### M-06 · Sin fecha de corte en los datos

Ninguna cifra lleva año de referencia. Las de población y superficie envejecen. Añadir
año en el pie de cada tabla.

---

## Preguntas para el cliente

Recopilación de todo lo anterior, en un formato listo para enviar:

**Contacto e identidad**
1. ¿Cuáles son los teléfonos reales de España y Argentina?
2. ¿Cuál es el dominio definitivo del sitio y del correo?
3. ¿Datos registrales completos de la sociedad española y de la argentina?
4. ¿URLs de los perfiles de Instagram, TikTok, Facebook y LinkedIn?

**Marca y assets**
5. ¿Existe el logotipo en vectorial (SVG/AI/EPS)?
6. ¿Hay retrato profesional de Carlos Carbajal? *(es el asset que más confianza aportaría)*
7. ¿Existe fotografía de equipo u oficina?

**Contenido**
8. ¿Existe el mapa de proyección 2050, o el rótulo es un error de montaje?
9. En la conclusión de la sección III, ¿cuál es la redacción correcta de la frase sobre la
   asimetría territorial?
10. ¿Se publica un importe mínimo de inversión? Si no, ¿cómo se explica que se determina?
11. ¿Existe una versión más extensa del dossier que la de 15 páginas?
12. Sobre el apartado de modificación climática: ¿se mantiene, se reformula o se suprime?
    Si se mantiene, ¿qué fuente concreta lo respalda?

**Legal y regulatorio**
13. ¿Qué habilitación concreta, y ante qué organismo, respalda la operatoria bilateral?
14. ¿Se pueden nombrar las entidades ALyC y ESI/agencia aliadas?
15. ¿Origen y licencia de los mapas de riesgo, la imagen satelital y la fotografía del
    Obelisco?
16. ¿Quién revisa legalmente los textos de inversión antes de publicar?

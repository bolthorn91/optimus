# Ejemplo — «Vistas guardadas en listados»

Un goal completo de principio a fin para un proyecto ficticio («Acme App»), sin ninguna dependencia
del proyecto original del que salió este kit. Sirve para dos cosas: ver cómo se rellenan las
plantillas y tener un patrón que copiar la primera vez.

## Qué hay aquí

| Fichero | Qué es | Plantilla de la que sale |
|---------|--------|--------------------------|
| [`goal-profile.md`](goal-profile.md) | El perfil del proyecto ficticio, con las diez secciones rellenas | `agent-docs/goal-profile.template.md` |
| [`docs/product/01-saved-views.md`](docs/product/01-saved-views.md) | El documento canónico de la feature: decisiones cerradas, modelo de datos, API, fases A–E, DoD | `agent-docs/templates/goal-doc.template.md` |
| [`docs/product/01-saved-views-goal-prompt.md`](docs/product/01-saved-views-goal-prompt.md) | El prompt de handover con el bloque `GOAL` copiable | `agent-docs/templates/goal-prompt.template.md` |

En un proyecto real, `goal-profile.md` vive en `agent-docs/` y los otros dos en `docs/product/`. Aquí
están juntos para que el ejemplo se lea de un tirón.

## La feature, en una frase

En una pantalla de listado con filtros, el usuario guarda la combinación actual con un nombre, la
reutiliza en un clic y puede marcar una como predeterminada. Vistas privadas, máximo 20 por listado,
nombres únicos, una sola predeterminada garantizada en base de datos.

Se eligió a propósito porque casi cualquier aplicación tiene un listado con filtros, y porque toca
las cuatro capas: migración, repositorio, servicio con reglas, API y UI. Eso permite que las fases
A–E sean realistas en vez de decorativas.

## Cómo leerlo

1. **Empieza por el perfil.** Es el fichero que hay que reescribir para cada proyecto; todo lo demás
   lo referencia por número de sección. Fíjate en §7 (invariantes): ahí es donde en el proyecto
   original vivían reglas de dominio muy específicas, y aquí son cinco líneas genéricas que cada
   equipo sustituye por las suyas.
2. **Sigue por el documento canónico.** Mira cómo cada decisión cerrada lleva identificador (`F4`,
   `F6`…) para poder citarla en un review, y cómo cada fase termina en un DoD verificable.
3. **Termina por el prompt.** Comprueba que el bloque `GOAL` de §2 se puede pegar en una sesión
   limpia y sigue siendo ejecutable sin leer nada más.

## Cómo usarlo como plantilla

```bash
cp goal-loop-kit/examples/saved-views/docs/product/01-saved-views.md docs/product/01-mi-feature.md
```

Reescribe el contenido conservando la numeración de secciones (§2 decisiones, §7 fases, §8 DoD, §9
fuera de alcance y §12 deuda son las que citan el prompt y los subagentes), y después genera el
prompt de handover:

```bash
/goal --make-prompt docs/product/01-mi-feature.md
```

## Detalles del ejemplo que merece la pena copiar

- **Las decisiones cerradas tienen identificador.** `F6` («una sola predeterminada») se puede citar
  en un hallazgo, en un rechazo y en el body de un commit sin ambigüedad.
- **La regla crítica se defiende en el sitio más bajo posible.** La unicidad de la vista
  predeterminada es un índice parcial en base de datos, no solo una comprobación en el servicio: el
  documento lo decide (§3.2) y el riesgo lo justifica (§10).
- **Hay un test de regresión obligatorio.** `SV-12` demuestra que con la feature en su estado por
  defecto el listado se comporta exactamente igual que antes.
- **Las fases respetan la dependencia real.** Nada de UI para un motor que todavía no existe: A
  persistencia → B reglas → C API → D UI → E cierre.
- **El DoD es verificable.** «Como máximo una vista predeterminada por usuario y listado, garantizado
  en base de datos» se puede comprobar; «la feature funciona bien» no.

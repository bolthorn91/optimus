# Plantilla — documento canónico de goal

Copiar a la carpeta de documentos de goal que declare el perfil §3 (por convención
`docs/product/NN-<slug>.md`) y rellenar. Borrar esta cabecera y toda línea en _cursiva_ antes de
publicar: son instrucciones de relleno, no contenido.

Reglas de la plantilla:

- El documento es la **fuente de verdad** del alcance. El prompt de handover no lo sustituye.
- **La numeración §1–§14 es estable**: el prompt de handover y los subagentes citan §2 (decisiones),
  §7 (fases), §8 (DoD), §9 (fuera de alcance) y §12 (deuda). Puedes borrar el contenido de una
  sección que no aplique, pero no renumerar las demás.
- Secciones sin contenido real se marcan `No aplica`; no se dejan apartados vacíos.
- Toda decisión cerrada lleva **identificador** (`C1`, `F3`, `S7`, `D2`…) para poder citarla en
  reviews y commits.
- Los tests golden llevan **prefijo estable** (`<PREFIJO>-01`, `<PREFIJO>-02`…) para poder exigirlos
  por nombre.
- Nada de comentarios de relleno en los ejemplos de código. El idioma de la UI y de los
  identificadores lo fija el perfil §1.

---

# \<Título funcional del cambio\>

**Estado:** \<especificación canónica | borrador | implementado en branch\> (decisiones cerradas \<AAAA-MM-DD\>).
**Branch de trabajo:** `<rama>` \<o «el HEAD actual del worktree»\>.
**Perfil de proyecto:** [`agent-docs/goal-profile.md`](../../agent-docs/goal-profile.md) — invariantes §7 aplicables: \<I1, I3…\>.
**Roadmap:** \<enlace y § del roadmap, o No aplica\>.
**Relacionado:** \<docs o features de los que depende / que no hay que reimplementar\>.

\<Una o dos frases: qué sustituye este documento y sobre qué manda (alcance, modelo, UX, API, gates,
plan de implementación).\>

| Referencia | Tema | Resumen v1 |
|------------|------|------------|
| **\<§ roadmap o ticket\>** | \<tema\> | \<qué se entrega en v1, en una línea\> |

---

## 1. Contexto del software actual (punto de partida)

_Qué existe hoy, con rutas reales. Sin esto, el agente reinventa piezas que ya están._

### 1.1 \<Área afectada\>

| Pieza | Ubicación | Comportamiento |
|-------|-----------|----------------|
| \<concepto\> | `<ruta/fichero.ext>` | \<qué hace hoy\> |

**\<Fórmula / invariante / contrato actual, si aplica.\>**

**No existe** \<lo que hoy falta y este documento introduce\>.

### 1.2 \<Otra área afectada\>

| Pieza | Estado |
|-------|--------|
| \<concepto\> | \<estado actual\> |

---

## 2. Decisiones cerradas (no reabrir en v1)

_Cada fila es un contrato. El agente no puede renegociarlas; un revisor que las contradiga se
resuelve a favor del documento._

### 2.1 Comunes

| # | Tema | Decisión |
|---|------|----------|
| C1 | Idioma | \<según perfil §1: textos de usuario en \<idioma\>, identificadores en \<idioma\>, claves de traducción en el mismo cambio\> |
| C2 | Tests | \<qué niveles se exigen y el gate del perfil §5; qué queda como deuda explícita\> |
| C3 | Zonas protegidas | \<las del perfil §6 + los paths que este documento sí autoriza a extender\> |
| C4 | Invariantes | \<los del perfil §7 que aplican a esta feature y cómo se cumplen aquí\> |
| C5 | \<separación de conceptos que se confunden\> | \<decisión\> |

### 2.2 \<Feature 1\>

| # | Tema | Decisión |
|---|------|----------|
| F1 | \<modos / valores admitidos\> | \<decisión\> |
| F2 | Default | \<valor y por qué no rompe a los usuarios existentes\> |
| F3 | Persistencia | \<tabla, columna, restricción, proyección hacia la API\> |
| F4 | UI | \<pantalla y copy; nunca un control mudo\> |
| F5 | Activación | \<de qué flag o permiso depende\> |
| F6…Fn | \<algoritmo, migración de datos, superficies de escritura, docs a alinear\> | \<decisión\> |

### 2.3 \<Feature 2, si el documento cubre dos\>

| # | Tema | Decisión |
|---|------|----------|
| S1 | Alcance v1 | \<qué entra y qué se aplaza\> |
| S2…Sn | \<modelo, elegibilidad, UX, permisos, integración con lo existente\> | \<decisión\> |

### 2.4 \<Enums / catálogos compartidos\>

| # | Tema | Decisión |
|---|------|----------|
| D1 | \<valores nuevos de enum\> | \<valores + copy\> |
| D2 | No reutilizar \<valor genérico\> | \<razón: trazabilidad, reporting\> |

---

## 3. \<Feature 1\> — Especificación de implementación

### 3.1 Objetivo de negocio

\<Para qué sirve, en lenguaje de negocio. Un párrafo.\>

### 3.2 Modelo de datos

\<Tabla/columnas, tipos, defaults, restricciones, validación de entrada, índices, migración.
Nombrar el patrón existente que se copia.\>

### 3.3 Algoritmo canónico (pseudocódigo)

```text
<pseudocódigo determinista, con los casos límite explícitos>
```

_Un solo helper. Prohibido duplicar la regla en cada punto de escritura._

### 3.4 Superficies de escritura a unificar

| Punto de escritura | Fichero | Nota |
|--------------------|---------|------|
| \<flujo\> | `<ruta>` | \<qué cambia\> |

### 3.5 Migración / recálculo de datos existentes

\<Qué se recalcula, qué es intocable (histórico cerrado), qué se registra en logs, cómo se revierte.\>

### 3.6 Casos límite

\<Límites, valores nulos, concurrencia, colisiones, qué se formaliza como deuda.\>

### 3.7 API (orientativa)

| Método | Ruta | Request | Response | Permiso | Errores |
|--------|------|---------|----------|---------|---------|
| \<GET\> | `<ruta>` | \<forma\> | \<forma\> | \<permiso\> | \<códigos\> |

### 3.8 Tests golden \<Feature 1\> (mínimos)

| ID | Escenario | Esperado |
|----|-----------|----------|
| \<PREFIJO\>-01 | \<entrada\> | \<salida exacta\> |

_Incluir siempre al menos un test de **regresión** que demuestre que el comportamiento actual no
cambia cuando la opción nueva está en su default._

---

## 4. \<Feature 2\> — Especificación de implementación

_Misma estructura que §3, adaptada a la segunda feature. Si el documento cubre una sola feature,
poner `No aplica` y seguir._

### 4.1 Objetivo de negocio
### 4.2 Modelo de datos
### 4.3 Flujo UX
### 4.4 API (orientativa)
### 4.5 UI
### 4.6 Tests golden \<Feature 2\> (mínimos)

---

## 5. Seguridad, permisos y aislamiento

_Aterrizar aquí los invariantes del perfil §7 que apliquen._

- \<Toda consulta filtrada por \<propietario / tenant / ámbito\>.\>
- \<Permiso exigido por endpoint.\>
- \<Datos que nunca salen en la respuesta ni en logs.\>
- \<Gates de plan / feature flags.\>
- \<Límites de tasa, tamaño o cantidad.\>

---

## 6. Textos de interfaz (claves orientativas)

_Si el perfil §1 declara un idioma de UI. Si no: `No aplica`._

| Clave | \<Idioma\> |
|-------|-----------|
| `<namespace.key>` | \<texto\> |

---

## 7. Plan de implementación (fases)

_Fases secuenciales, cada una entregable y revisable por separado. Backend antes que UI: nada de UI
para un motor que aún no existe. Una fase debe caber en un diff que un revisor pueda leer entero._

### Fase A — \<título\>

1. \<paso\>
2. \<paso\>

**DoD fase A:** \<condición verificable de cierre\>

### Fase B — \<título\>

**DoD fase B:** \<…\>

### Fase C — \<título\>

**DoD fase C:** \<…\>

### Fase D — \<título\>

**DoD fase D:** \<…\>

### Fase E — Cierre documental y gates globales

1. Marcar el DoD de este documento y del roadmap (perfil §3) de forma honesta.
2. Registrar en el fichero de deuda (perfil §3) lo que quede sin cubrir; actualizar el inventario
   E2E si se añadieron o movieron specs.
3. Ejecutar todos los gates bloqueantes del perfil §5.
4. Limpieza residual: wiring muerto, traducciones incompletas, tests obsoletos.

**DoD fase E:** \<…\>

---

## 8. Criterios de aceptación (DoD)

### 8.1 \<Feature 1\>

- [ ] \<criterio verificable\>

### 8.2 \<Feature 2\>

- [ ] \<criterio verificable\>

### 8.3 Global

- [ ] Roadmap / referencias actualizados a hecho o «hecho en branch».
- [ ] Lo no cubierto por E2E → filas honestas en el fichero de deuda (perfil §3).
- [ ] Se respetan el idioma y la política de comentarios del perfil §1.
- [ ] No se modificó ninguna zona protegida del perfil §6 sin autorización de este documento.
- [ ] Todos los gates del perfil §5 en verde, ejecutados de verdad.
- [ ] Ningún invariante del perfil §7 roto en la superficie tocada.

---

## 9. Fuera de alcance (v1)

| Ítem | Notas |
|------|-------|
| \<lo que alguien pedirá y no entra\> | \<por qué / cuándo\> |

---

## 10. Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| \<riesgo real\> | \<mitigación concreta y verificable\> |

---

## 11. Casos de prueba mínimos (checklist de revisión)

### \<Feature 1\>

- [ ] \<caso end-to-end en lenguaje de negocio\>

### \<Feature 2\>

- [ ] \<caso end-to-end en lenguaje de negocio\>

---

## 12. Deuda explícita (registrar al implementar)

### 12.1 E2E — \<historia\>

- Historia: como \<rol\>, \<acción\> y \<verificación\>.
- Detectada en: este doc §\<x\>.

---

## 13. Referencias de código (pre-feature)

| Área | Rutas |
|------|-------|
| \<área\> | `<ruta>`, `<ruta>` |

---

## 14. Orden de trabajo sugerido en el branch

```text
<rama>
  Fase A  → <resumen>
  Fase B  → <resumen>
  Fase C  → <resumen>
  Fase D  → <resumen>
  Fase E  → docs + deuda + gates
```

\<Dependencias duras entre fases: qué no se puede empezar antes de qué.\>

---

*Documento vivo de implementación. Actualizar los checkboxes del DoD y el estado del encabezado al
cerrar cada fase.*

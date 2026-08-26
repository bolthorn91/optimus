# GOAL prompt — Páginas de detalle, legales y SEO (doc 07)

**Uso:** `/goal docs/product/07-paginas-detalle-goal-prompt.md`, o copiar el bloque `GOAL` de §2 a una sesión de implementación.
**Canon de producto:** [`07-paginas-detalle.md`](07-paginas-detalle.md).
**Perfil de proyecto:** [`agent-docs/goal-profile.md`](../../agent-docs/goal-profile.md) — invariantes §7 aplicables: I1, I2, I3, I4, I6, I7, I8, I9.
**Roadmap:** [`roadmap.md`](roadmap.md) §2, fila 07.
**Branch de trabajo esperado:** el HEAD actual del worktree. No inventar rama.
**Harness:** `AGENTS.md`, `content/` (canon de contenido), `agent-docs/goal-profile.md`.
**Loop:** [`agent-docs/goal-loop.md`](../../agent-docs/goal-loop.md).

---

## 1. Protocolo de fase (obligatorio en cada fase A–E)

Para **cada** fase, en este orden **estricto**:

1. **Implementar** el alcance de la fase según el doc 07 (sin reabrir las decisiones §2: C1-C5, F1-F7, S1-S5, D1-D7, G1-G8).
2. **Tests** de toda la superficie tocada en el mismo cambio; no diluir los gates del perfil §5.
3. **Verificación local** proporcional al riesgo, con los comandos del perfil §4: `npm run typecheck`,
   `npm run lint`, `npm run format:check` y `npx vitest run <patrón>` en cada fase; `npm test`,
   `npm run test:coverage`, `npm run build` y `npm run build:budget` al cerrar fases grandes y el
   programa.
4. **Loop subagente `goal-reviewer`** (persona de corrección) sobre el diff de la fase:
   - **Implementar íntegramente todas** las objeciones, sugerencias y nits que devuelva (sin
     cherry-pick, sin «lo dejamos en deuda»), salvo que el hallazgo sea **demostrablemente** fuera
     del alcance del doc 07 o un falso positivo con evidencia registrada.
   - Relanzar sobre el diff actualizado.
   - **Repetir** hasta ronda con **cero** ítems accionables de cualquier severidad.
5. **Loop subagente `goal-code-reviewer`** (persona de mantenibilidad) sobre el mismo alcance:
   - **Implementar íntegramente todas** las objeciones, sugerencias y nits.
   - Relanzar. **Repetir** hasta ronda limpia.
6. **Puerta de misma foto:** si el paso 5 tocó código, la ronda limpia del paso 4 caducó → volver al
   paso 4. Ambos subagentes deben tener su última ronda limpia sobre el **mismo hash** del diff de
   la fase.
7. **Puerta humana** (perfil §9 fases supervisadas): parar, informar del alcance, de la
   verificación ejecutada y de las rondas, y esperar go-ahead. No commitear hasta que el humano lo
   diga.
8. **Solo entonces:** crear los **commits** de la fase (Conventional Commits, perfil §10; sin
   secretos; sin amend de commits ajenos). Sin push, sin PR.
9. **Solo entonces** iniciar la fase siguiente. **Prohibido** empezar la fase N+1 con hallazgos
   abiertos, con un solo subagente limpio, o sin los commits de la fase N.

### Definición de ronda limpia

Una ronda está limpia **solo si** el subagente no devuelve ninguna objeción, ninguna sugerencia de
cambio y ningún nit. `VERDICT: CLEAN` / lista vacía → limpio. **Cualquier** ítem accionable → no
limpio: aplicar y re-ejecutar el **mismo** subagente.

### Límites de convergencia

- Máximo **5 rondas** por subagente y fase (perfil §9). Al agotarlas: parar, listar los hallazgos
  abiertos y pedir decisión al humano. Nunca declarar limpio por cansancio.
- Si una ronda devuelve el mismo conjunto `(file:line, severidad)` que la anterior, el loop no
  converge: parar y escalar en vez de reaplicar.
- Rechazar un hallazgo exige evidencia verificable, registrada en el estado del run y en el body del
  commit de la fase. Un hallazgo rechazado dos veces se escala, no se rechaza otra vez.

### Si los dos subagentes se contradicen

1. Preferir la interpretación que **cumple el doc 07** y la cadena de autoridad del perfil §2.
2. Aplicar ambas si son compatibles.
3. Si son mutuamente excluyentes: implementar la que preserve los invariantes del perfil §7 y el
   DoD de la fase; documentar la otra en el body del commit como «considerado / no aplicado por
   conflicto con doc 07 §X».

### Reglas globales del goal

- **No push / no PR** salvo que el humano lo pida explícitamente después (perfil §10).
- **No reabrir** las decisiones cerradas del doc 07 §2.
- **No bajar** umbrales de los gates del perfil §5 ni ampliar excludes para «pasarlos».
- **No tocar** las zonas protegidas del perfil §6 salvo los paths que el doc 07 §2 C3 autoriza:
  crear `src/pages/`, `src/content/legal/`, `src/content/acts/`, `public/robots.txt`, `public/sitemap.xml`, `scripts/build-sitemap.mjs`, y ampliar `src/app/` con rutas y metadatos.
- **Invariantes del perfil §7** aplicables a esta feature: I1, I2, I3, I4, I6, I7, I8, I9 — no romperlos ni dejar que
  se rompan en el código tocado.
- **Idioma y comentarios** según perfil §1: textos de usuario en `es-ES` con tratamiento de usted,
  identificadores en inglés, comentarios escasos y solo del porqué.
- Si el contexto se compacta o la sesión se reinicia: **continuar** desde el worktree
  (`/goal --resume`); no resetear ni reescribir la feature desde cero.
- **No saltar fases.** No marcar el programa completo si una fase quedó a medias.

---

## 2. Bloque GOAL (copiar tal cual)

```text
GOAL: Implementar al 100 % la funcionalidad canónica de docs/product/07-paginas-detalle.md (siete páginas de acto, tres de vehículo y tres legales, más metadatos, datos estructurados, sitemap y analítica sin cookies), cumpliendo todos los gates, decisiones cerradas y criterios de hecho del documento, hasta el desarrollo completo en el HEAD actual del worktree.

AUTORIDAD
- Producto y alcance: docs/product/07-paginas-detalle.md (leer completo antes de codificar; no reabrir §2 decisiones C1-C5, F1-F7, S1-S5, D1-D7, G1-G8).
- Ingeniería: agent-docs/goal-profile.md (comandos §4, gates §5, zonas protegidas §6, invariantes §7, arquitectura §8, git §10) + AGENTS.md + content/ como canon de contenido.
- Roadmap a actualizar al cerrar: docs/product/roadmap.md §2 fila 07.
- Deuda: docs/debt/technical-debt.md — al final registrar las filas del doc 07 §12 que queden sin cubrir.
- Relacionado ya hecho (no reimplementar): docs 00 a 06 — reutilizar PairedComparison, RiskTable, ProjectionTable, ProcessDiagram en modo estático, StatFigure, Disclaimer, PendingValue y el manifiesto de secciones. Cero componentes nuevos de presentación de datos.

ORDEN DE FASES (doc 07 §7) — secuencial, sin saltar

FASE A — Manifiesto de rutas y layout de detalle
- src/app/routes.ts con las trece rutas nuevas más la home, con sus metadatos (G1).
- src/app/meta.ts con metaFor como función pura.
- DetailLayout con cabecera, índice lateral, navegación entre actos y CTA (F2, F5, F6).
- TableOfContents, SourceList y NotFoundPage.
- Restauración de la posición de scroll al volver a la home (§3.6).
- Hoja de estilos de impresión.
- Tests DET-11, DET-15, DET-16, SEO-01, SEO-02 (doc 07 §3.8 y §4.6).
- DoD fase: doc 07 §7 Fase A + §8.1 en lo relativo a navegación y metadatos.

FASE B — Las siete páginas de acto
- Contenido completo de cada acto en src/content/acts/, literal de content/secciones/.
- ActDetailPage reutilizando los componentes de datos existentes (F4).
- Tablas íntegras de cada acto, no resumidas (F7).
- Fuentes por sección, solo texto, sin logotipos (I6).
- Tests DET-01, DET-02, DET-03, DET-18, DET-19.
- DoD fase: doc 07 §7 Fase B + resto de §8.1.

FASE C — Las tres páginas de vehículo
- Contenido por vehículo, sin rellenar huecos con marketing inventado (S3).
- VehicleDetailPage con ventaja, perfil, mecanismo operativo del acto VII aplicable y garantías que le afectan.
- Disclaimer obligatorio en las tres (S4, I7).
- CTA con preselección del vehículo, reutilizando el mecanismo del documento 05 (S5).
- Tests DET-04, DET-05, DET-06.
- DoD fase: doc 07 §7 Fase C.

FASE D — Legales, SEO y analítica
- src/content/legal/ con los tres documentos de content/07-legal-y-disclaimers.md y sus campos pendientes declarados (D2, D7).
- PendingNotice y servicio con noindex de las páginas legales incompletas (D3).
- Transferencia internacional a Argentina declarada en privacidad (D4); inventario de cookies (D5); disclaimer largo íntegro en el aviso legal (D6).
- Imagen Open Graph generada (G2); datos estructurados Organization sin telephone ni sameAs (G3).
- scripts/build-sitemap.mjs y robots.txt derivados del manifiesto (G4).
- Analítica sin cookies y los siete eventos de G7; banner solo si finalmente aplica (G5, G6).
- Tests DET-07 a DET-10, DET-12, DET-13, DET-14, DET-17, DET-20, SEO-03 a SEO-08.
- DoD fase: doc 07 §7 Fase D + §8.2.

FASE E — Cierre documental y gates globales
- Marcar DoD en doc 07 §8 y roadmap §2 fila 07 de forma honesta («hecho en branch»).
- Registrar la deuda del doc 07 §12 en docs/debt/technical-debt.md, incluidos B-05 y la ausencia de renderizado sin JavaScript.
- Ejecutar los gates del perfil §5 y dejarlos en verde de verdad.
- Limpieza residual: rutas huérfanas, claves de traducción sin usar.
- DoD fase: doc 07 §8 Global + fases A-D cerradas.


PROTOCOLO OBLIGATORIO AL FINAL DE CADA FASE (A, B, C, D, E)
1) Implementación + tests de la fase.
2) Verificación local con los comandos del perfil §4 (cobertura y build al cerrar fases grandes y el programa).
3) LOOP subagente goal-reviewer sobre el diff de la fase:
   - Aplicar TODAS las objeciones, sugerencias y nits devueltas.
   - Re-ejecutar hasta ronda LIMPIA (cero ítems). Máx. 5 rondas; luego escalar.
4) LOOP subagente goal-code-reviewer sobre el mismo alcance:
   - Aplicar TODAS las objeciones, sugerencias y nits devueltas.
   - Re-ejecutar hasta ronda LIMPIA. Máx. 5 rondas; luego escalar.
5) Si (4) tocó código, repetir (3): ambos deben quedar limpios sobre el MISMO estado del código.
6) Puerta humana (perfil §9 fases supervisadas): parar, informar, esperar go-ahead. No commitear hasta que el humano lo diga.
7) Solo entonces: commits de la fase (Conventional Commits; no push; no PR).
8) Solo entonces: fase siguiente. Si un re-check posterior encuentra regresión, no avanzar hasta nueva ronda limpia + commits de fix.

RESTRICCIONES
- No push, no abrir PR, no force-push, no git reset --hard, no descartar trabajo ajeno.
- No reabrir decisiones del doc 07 §2.
- No bajar umbrales de gates ni ampliar excludes.
- No tocar las zonas protegidas del perfil §6 (content/, public/assets-origen/, el PDF del dossier, goal-loop-kit/, agent-docs/goal-loop.md, agent-docs/templates/, .grok/agents/, .grok/skills/) fuera de lo autorizado por el doc 07 §2 C3.
- No romper los invariantes del perfil §7: I1, I2, I3, I4, I6, I7, I8, I9.
- NUNCA inventar datos registrales: razón social, CIF, domicilio e inscripción son PendingValue hasta que el cliente los aporte (D2, I2, test DET-07, bloqueo B-05). En una página legal, un dato inventado no es un marcador de trabajo pendiente: es una falsedad publicada.
- Una página legal con marcadores se sirve con noindex, lleva aviso de borrador y queda fuera del sitemap (D3, tests DET-08 y DET-13).
- NO redactar cláusulas legales nuevas (D7): los textos se toman de content/07-legal-y-disclaimers.md, que se declara a sí mismo orientativo y pendiente de validación.
- La política de privacidad debe declarar EXPRESAMENTE la transferencia internacional de datos a Argentina (D4, test DET-09).
- Los datos estructurados Organization omiten telephone y sameAs mientras B-01 y B-07 estén abiertos (G3, test DET-14): un dato estructurado falso es peor que ninguno.
- El sitemap NO se genera sin VITE_SITE_URL absoluta: la build avisa y falla (§3.6, test DET-12). Un sitemap con base falsa es peor que ninguno.
- Router y sitemap derivan del MISMO manifiesto src/app/routes.ts (§3.4): prohibido declarar una ruta en un sitio y otra en otro.
- Las páginas de vehículo NO se rellenan con contenido de marketing inventado (S3, test DET-05): lo que falta se marca como pendiente del cliente.
- Sin cookies no esenciales antes del consentimiento (G6, test SEO-06). Analítica sin cookies preferida: es coherente con un sitio cuyo argumentario critica la vigilancia digital.
- Sin escenas ancladas ni animación de scroll en las páginas de detalle (F3): son documentos de lectura, y el clímax vive en la home.
- Cero componentes nuevos de presentación de datos (F4): todo reutilizado de los documentos 03 a 05.
- Una URL desconocida da 404 con navegación de vuelta, nunca una redirección silenciosa a la home (§3.6, test DET-15).
- Sin logotipos de organismos en ninguna página (I6, test DET-18).
- Idioma y comentarios según perfil §1.
- Continuar desde el worktree actual si hay progreso parcial; no reiniciar la feature.
- No empezar la fase N+1 sin commits de la fase N tras ambos loops limpios.

CRITERIO DE COMPLETITUD DEL GOAL
El goal solo está completo cuando las fases A-E están implementadas, cada una pasó el protocolo de §1 (implementación, tests, dos loops limpios, misma foto, puerta humana, commits); los DoD del doc 07 §8 se cumplen en código y tests; los veinte tests DET-01 a DET-20 y los ocho SEO-01 a SEO-08 existen y pasan; los gates del perfil §5 están en verde; y roadmap, deuda y doc 07 reflejan el estado real.

ENTREGABLE FINAL
Resumen por fase: qué se hizo, commits (hash + mensaje), comandos de verificación ejecutados con su resultado, número de rondas de cada subagente hasta limpio, y residuos o deuda documentada.
```

---

## 3. Variantes cortas (una fase)

Usar solo si el humano pide acotar. **Mismo protocolo que §1** (incluida la puerta humana del perfil §9). No push/PR.

### 3.1 Solo Fase A

```text
GOAL: Completar solo la FASE A de docs/product/07-paginas-detalle.md (manifiesto de rutas, metadatos y layout de detalle). Leer doc 07 §7 Fase A y agent-docs/goal-profile.md. Tests DET-11, DET-15, DET-16, SEO-01 y SEO-02. Al terminar: protocolo de §1. No push/PR. No implementar el contenido de las páginas.
```

### 3.2 Solo Fase B

```text
GOAL: Completar solo la FASE B de docs/product/07-paginas-detalle.md (las siete páginas de acto con su contenido completo). Leer doc 07 §7 Fase B y agent-docs/goal-profile.md. Tests DET-01, DET-02, DET-03, DET-18 y DET-19. Al terminar: protocolo de §1. No push/PR. Requiere la Fase A ya en el branch.
```

### 3.3 Solo Fase C

```text
GOAL: Completar solo la FASE C de docs/product/07-paginas-detalle.md (las tres páginas de vehículo). Leer doc 07 §7 Fase C y agent-docs/goal-profile.md. Tests DET-04, DET-05 y DET-06. Al terminar: protocolo de §1. No push/PR. Requiere la Fase A ya en el branch.
```

### 3.4 Solo Fase D

```text
GOAL: Completar solo la FASE D de docs/product/07-paginas-detalle.md (legales con marcadores, SEO, sitemap y analítica sin cookies). Leer doc 07 §7 Fase D y agent-docs/goal-profile.md. Tests DET-07 a DET-10, DET-12, DET-13, DET-14, DET-17, DET-20 y SEO-03 a SEO-08. Al terminar: protocolo de §1. No push/PR. Requiere las Fases A, B y C ya en el branch.
```

### 3.5 Solo Fase E

```text
GOAL: Completar solo la FASE E de docs/product/07-paginas-detalle.md (cierre documental y gates). Leer doc 07 §7 Fase E y agent-docs/goal-profile.md. Ejecutar los cinco gates del perfil §5. Al terminar: protocolo de §1. No push/PR. Requiere las Fases A a D cerradas.
```

---

## 4. Subagentes a invocar

| Paso | Subagente (`subagent_type`) | Condición de salida |
|------|-----------------------------|---------------------|
| Review de fase | `goal-reviewer` | Cero objeciones, sugerencias y nits |
| Code review de fase | `goal-code-reviewer` | Cero objeciones, sugerencias y nits |
| Puerta de fase | — | Ambos limpios sobre el mismo hash de diff |

**Orden fijo por fase:** el protocolo de §1 (reviewer → code-reviewer → misma foto → puerta humana si perfil §9 → commit). No invertir el orden. Repetir cada subagente en bucle hasta cero hallazgos accionables,
aplicando **todas** las correcciones en el mismo worktree antes de la siguiente invocación.

---

## 5. Commits sugeridos (orientativos)

Commits lógicos **tras** las rondas limpias de la fase, no antes. Conventional Commits (perfil §10).
Consultar `git log --oneline -20` para el estilo real ya establecido en el repo.

| Fase | Mensaje orientativo |
|------|---------------------|
| A | `feat(pages): añadir manifiesto de rutas, metadatos y layout de detalle` |
| B | `feat(pages): añadir las siete páginas de detalle por acto` |
| C | `feat(pages): añadir las páginas de detalle por vehículo de inversión` |
| D | `feat(pages): añadir páginas legales, sitemap y analítica sin cookies` |
| E | `docs(pages): marcar DoD y registrar deuda de detalle y legales` |

---

## 6. Checklist rápido del agente (por fase)

```text
[ ] Alcance de la fase leído en el doc 07
[ ] Perfil del proyecto leído (§4 comandos, §5 gates, §6 zonas, §7 invariantes)
[ ] Código + tests de la fase
[ ] Verificación local ejecutada (comandos reales del perfil §4)
[ ] goal-reviewer → aplicar todo → goal-reviewer … hasta limpio
[ ] goal-code-reviewer → aplicar todo → goal-code-reviewer … hasta limpio
[ ] Ambos limpios sobre la misma foto del código
[ ] Commits de fase (sin push, sin PR)
[ ] No se ha iniciado la fase siguiente antes de lo anterior
```

---

*Generado para delegación GOAL. La autoridad de producto sigue siendo el doc 07, no este prompt.*

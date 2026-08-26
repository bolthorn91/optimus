# GOAL prompt — Actos VI y VII — La firma, las dos vías, cierre y contacto (doc 06)

**Uso:** `/goal docs/product/06-acto-vi-firma-cierre-contacto-goal-prompt.md`, o copiar el bloque `GOAL` de §2 a una sesión de implementación.
**Canon de producto:** [`06-acto-vi-firma-cierre-contacto.md`](06-acto-vi-firma-cierre-contacto.md).
**Perfil de proyecto:** [`agent-docs/goal-profile.md`](../../agent-docs/goal-profile.md) — invariantes §7 aplicables: I1, I2, I3, I4, I5, I6, I7, I8, I9.
**Roadmap:** [`roadmap.md`](roadmap.md) §2, fila 06.
**Branch de trabajo esperado:** el HEAD actual del worktree. No inventar rama.
**Harness:** `AGENTS.md`, `content/` (canon de contenido), `agent-docs/goal-profile.md`.
**Loop:** [`agent-docs/goal-loop.md`](../../agent-docs/goal-loop.md).

---

## 1. Protocolo de fase (obligatorio en cada fase A–E)

Para **cada** fase, en este orden **estricto**:

1. **Implementar** el alcance de la fase según el doc 06 (sin reabrir las decisiones §2: C1-C6, F1-F8, S1-S6, D1-D12, G1-G4).
2. **Tests** de toda la superficie tocada en el mismo cambio; no diluir los gates del perfil §5.
3. **Verificación local** proporcional al riesgo, con los comandos del perfil §4: `npm run typecheck`,
   `npm run lint`, `npm run format:check` y `npx vitest run <patrón>` en cada fase; `npm test`,
   `npm run test:coverage`, `npm run build` y `npm run build:budget` al cerrar fases grandes y el
   programa.
4. **Loop subagente `goal-reviewer`** (persona de corrección) sobre el diff de la fase:
   - **Implementar íntegramente todas** las objeciones, sugerencias y nits que devuelva (sin
     cherry-pick, sin «lo dejamos en deuda»), salvo que el hallazgo sea **demostrablemente** fuera
     del alcance del doc 06 o un falso positivo con evidencia registrada.
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

1. Preferir la interpretación que **cumple el doc 06** y la cadena de autoridad del perfil §2.
2. Aplicar ambas si son compatibles.
3. Si son mutuamente excluyentes: implementar la que preserve los invariantes del perfil §7 y el
   DoD de la fase; documentar la otra en el body del commit como «considerado / no aplicado por
   conflicto con doc 06 §X».

### Reglas globales del goal

- **No push / no PR** salvo que el humano lo pida explícitamente después (perfil §10).
- **No reabrir** las decisiones cerradas del doc 06 §2.
- **No bajar** umbrales de los gates del perfil §5 ni ampliar excludes para «pasarlos».
- **No tocar** las zonas protegidas del perfil §6 salvo los paths que el doc 06 §2 C3 autoriza:
  crear `src/scenes/06-firma/`, `src/scenes/07-contacto/`, `src/lib/contact-form.ts`, `src/lib/email.ts` y `src/content/contact.ts`, y **modificar el footer** creado en el documento 00.
- **Invariantes del perfil §7** aplicables a esta feature: I1, I2, I3, I4, I5, I6, I7, I8, I9 — no romperlos ni dejar que
  se rompan en el código tocado.
- **Idioma y comentarios** según perfil §1: textos de usuario en `es-ES` con tratamiento de usted,
  identificadores en inglés, comentarios escasos y solo del porqué.
- Si el contexto se compacta o la sesión se reinicia: **continuar** desde el worktree
  (`/goal --resume`); no resetear ni reescribir la feature desde cero.
- **No saltar fases.** No marcar el programa completo si una fase quedó a medias.

---

## 2. Bloque GOAL (copiar tal cual)

```text
GOAL: Implementar al 100 % la funcionalidad canónica de docs/product/06-acto-vi-firma-cierre-contacto.md (la firma y su fundador, la cadena de intermediación sin capas, las dos vías operativas, y el bloque de reserva con formulario, envío por EmailJS y confirmación), cumpliendo todos los gates, decisiones cerradas y criterios de hecho del documento, hasta el desarrollo completo en el HEAD actual del worktree.

AUTORIDAD
- Producto y alcance: docs/product/06-acto-vi-firma-cierre-contacto.md (leer completo antes de codificar; no reabrir §2 decisiones C1-C6, F1-F8, S1-S6, D1-D12, G1-G4).
- Ingeniería: agent-docs/goal-profile.md (comandos §4, gates §5, zonas protegidas §6, invariantes §7, arquitectura §8, git §10) + AGENTS.md + content/ como canon de contenido.
- Roadmap a actualizar al cerrar: docs/product/roadmap.md §2 fila 06.
- Deuda: docs/debt/technical-debt.md — al final registrar las filas del doc 06 §12 que queden sin cubrir.
- Relacionado ya hecho (no reimplementar): docs 00 (PendingValue, footer, Disclaimer, env), 03 (PairedComparison), 04 (ProcessDiagram, GuaranteeCards) y 05 (contexto del simulador) — reutilizarlos. No reimplementar ninguno.

ORDEN DE FASES (doc 06 §7) — secuencial, sin saltar

FASE A — Contenido tipado y secciones estáticas
- src/scenes/06-firma/content.ts y src/scenes/07-contacto/content.ts, literales del dossier.
- src/content/contact.ts como única fuente de datos de contacto, con marcadores PendingValue (D9, I2).
- Secciones estáticas: firma, FounderCard con marcador de retrato, DepartmentCards, InvestorRange, OperationalRoutes, desambiguación de CDI y Glossary.
- Poblado del footer creado en el documento 00: fuentes con «Think Tanks» corregido, legales, contacto y disclaimer (G1-G4).
- Registro de ambas escenas en src/app/sections.ts.
- Tests FIR-03 a FIR-10, FIR-14, FRM-19, FRM-22, FRM-23 (doc 06 §3.8 y §3.9).
- DoD fase: doc 06 §7 Fase A + §8.1: no aparece ningún teléfono, dominio, retrato de banco ni logotipo de organismo.

FASE B — Cadena de intermediación y coreografía
- IntermediationChain reutilizando ProcessDiagram del documento 04 (F4).
- choreographAct67 como función pura (doc 06 §3.3).
- Anclaje y scrub con useGsapScene; altura 500vh.
- Trazado secuencial: la cadena convencional entera antes de que empiece la de OPTIMVS (F2).
- Entrada escalonada de los tres departamentos y de las dos vías.
- PullQuote de «el nuevo Occidente» atribuida al fundador (F3).
- Tests FIR-01, FIR-02, FIR-11, FIR-12, FIR-13.
- DoD fase: doc 06 §7 Fase B + resto de §8.1.

FASE C — Formulario y validación
- src/lib/contact-form.ts con validate según el doc 06 §3.3, pura y completa.
- ContactForm con los nueve campos de D2, etiquetas asociadas y errores anunciados.
- Dos casillas de consentimiento separadas y sin premarcar, con enlace visible a la política de privacidad (D3).
- Preselección desde el acto V y contexto del simulador mostrado al usuario, sin campos ocultos (D4, D5).
- Honeypot y límite de frecuencia en cliente. Sin CAPTCHA visible (D6).
- GuaranteeCards resumidas junto al formulario (D11) y Disclaimer variant=inline (D12).
- Tests FRM-01 a FRM-11, FRM-16, FRM-17, FRM-18, FRM-20.
- DoD fase: doc 06 §7 Fase C + §8.2 en lo relativo a validación y accesibilidad. Cobertura de src/lib/contact-form.ts >= 80 %.

FASE D — Envío, estados y escena de cierre
- src/lib/email.ts con EmailJS y las claves leídas de src/lib/env.ts (D7, I8).
- Los cuatro estados de D8 (reposo, enviando, éxito, error), con foco movido a la confirmación y anuncio con role=status.
- Manejo de EmailJS no configurado y de fallo de red conservando todo lo escrito (§3.6).
- Bloqueo del botón durante el envío.
- ContactScene a pantalla completa con los cinco verbos del CTA (D1) y transición animada desde el acto VII.
- Tests FRM-12 a FRM-15, FRM-21, FRM-24.
- DoD fase: doc 06 §7 Fase D + resto de §8.2.

FASE E — Cierre documental y gates globales
- Marcar DoD en doc 06 §8 y roadmap §2 fila 06 de forma honesta («hecho en branch»).
- Registrar la deuda del doc 06 §12 en docs/debt/technical-debt.md: bloqueos B-01, B-02, B-05, B-06 y B-07, la ausencia de registro de consentimiento y la ausencia de antispam real.
- Ejecutar los gates del perfil §5 y dejarlos en verde de verdad.
- Limpieza residual: claves de traducción huérfanas, estados muertos.
- DoD fase: doc 06 §8 Global + fases A-D cerradas.


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
- No reabrir decisiones del doc 06 §2.
- No bajar umbrales de gates ni ampliar excludes.
- No tocar las zonas protegidas del perfil §6 (content/, public/assets-origen/, el PDF del dossier, goal-loop-kit/, agent-docs/goal-loop.md, agent-docs/templates/, .grok/agents/, .grok/skills/) fuera de lo autorizado por el doc 06 §2 C3.
- No romper los invariantes del perfil §7: I1, I2, I3, I4, I5, I6, I7, I8, I9.
- NO publicar ningún teléfono ni dominio (I2, D9, test FRM-19): los cuatro números del dossier son contradictorios o placeholders (bloqueos B-01 y B-02). Se renderiza PendingValue.
- NO usar ninguna foto de banco de imágenes ni silueta genérica como retrato del fundador (F1, test FIR-03, bloqueo B-06): marcador dimensionado con iniciales.
- Ninguna clave de EmailJS literal en el código: solo VITE_* leídas por src/lib/env.ts (I8, test FRM-21). .env nunca se commitea.
- Dos casillas de consentimiento SEPARADAS y NINGUNA PREMARCADA (D3, test FRM-08). El consentimiento comercial es OPCIONAL; el de datos, obligatorio (test FRM-05).
- Sin CAPTCHA visible (D6, test FRM-16): en el punto de conversión de un producto patrimonial cuesta leads.
- El formulario NO se deshabilita si faltan las claves de EmailJS (§3.6, test FRM-14): sigue operativo y da un error honesto con el contacto directo como alternativa, conservando lo escrito.
- La desambiguación de «CDI» como Clave de Identificación fiscal argentina es OBLIGATORIA (S2, test FIR-07): en el acto IV la misma sigla es el Convenio de Doble Imposición.
- Sin logotipos de CNMV, CNV, AEAT, ARCA ni ALyC (S5, I6, test FIR-08): solo texto en tratamiento tipográfico neutro.
- Nada debe sugerir que existe ya un panel de trazabilidad accesible (F6, test FIR-05): ni enlace ni botón que prometa acceso.
- La nota de habilitación reproduce el literal del dossier Y añade un marcador de registro pendiente (F5, test FIR-04).
- El contexto del simulador se MUESTRA al usuario antes de enviarse; nada oculto en un campo invisible (D5, test FRM-11).
- Sin WhatsApp (D10): el dossier no lo menciona y no está confirmado.
- Corregir «Think Thanks» a «Think Tanks» en las fuentes del footer (G2, errata E-03): es una errata tipográfica evidente, no contenido sustantivo.
- Ningún icono de red social sin destino (G3, test FRM-23, bloqueo B-07).
- El disclaimer en línea es obligatorio en el bloque de conversión (I7, D12, test FRM-20).
- Idioma y comentarios según perfil §1.
- Continuar desde el worktree actual si hay progreso parcial; no reiniciar la feature.
- No empezar la fase N+1 sin commits de la fase N tras ambos loops limpios.

CRITERIO DE COMPLETITUD DEL GOAL
El goal solo está completo cuando las fases A-E están implementadas, cada una pasó el protocolo de §1 (implementación, tests, dos loops limpios, misma foto, puerta humana, commits); los DoD del doc 06 §8 se cumplen en código y tests; los catorce tests FIR-01 a FIR-14 y los veinticuatro FRM-01 a FRM-24 existen y pasan; los gates del perfil §5 están en verde; y roadmap, deuda y doc 06 reflejan el estado real.

ENTREGABLE FINAL
Resumen por fase: qué se hizo, commits (hash + mensaje), comandos de verificación ejecutados con su resultado, número de rondas de cada subagente hasta limpio, y residuos o deuda documentada.
```

---

## 3. Variantes cortas (una fase)

Usar solo si el humano pide acotar. **Mismo protocolo que §1** (incluida la puerta humana del perfil §9). No push/PR.

### 3.1 Solo Fase A

```text
GOAL: Completar solo la FASE A de docs/product/06-acto-vi-firma-cierre-contacto.md (contenido tipado, secciones estáticas de los actos VI y VII, y footer poblado). Leer doc 06 §7 Fase A y agent-docs/goal-profile.md. Tests FIR-03 a FIR-10, FIR-14, FRM-19, FRM-22 y FRM-23. Al terminar: protocolo de §1. No push/PR. No implementar formulario ni animación.
```

### 3.2 Solo Fase B

```text
GOAL: Completar solo la FASE B de docs/product/06-acto-vi-firma-cierre-contacto.md (cadena de intermediación y coreografía de los actos VI y VII). Leer doc 06 §7 Fase B y agent-docs/goal-profile.md. Tests FIR-01, FIR-02, FIR-11, FIR-12 y FIR-13. Al terminar: protocolo de §1. No push/PR. Requiere la Fase A ya en el branch.
```

### 3.3 Solo Fase C

```text
GOAL: Completar solo la FASE C de docs/product/06-acto-vi-firma-cierre-contacto.md (formulario con validación pura, consentimientos separados y accesibilidad). Leer doc 06 §7 Fase C y agent-docs/goal-profile.md. Tests FRM-01 a FRM-11, FRM-16, FRM-17, FRM-18 y FRM-20. Al terminar: protocolo de §1. No push/PR. Requiere la Fase A ya en el branch.
```

### 3.4 Solo Fase D

```text
GOAL: Completar solo la FASE D de docs/product/06-acto-vi-firma-cierre-contacto.md (envío por EmailJS, estados y escena de cierre a pantalla completa). Leer doc 06 §7 Fase D y agent-docs/goal-profile.md. Tests FRM-12 a FRM-15, FRM-21 y FRM-24. Al terminar: protocolo de §1. No push/PR. Requiere las Fases A, B y C ya en el branch.
```

### 3.5 Solo Fase E

```text
GOAL: Completar solo la FASE E de docs/product/06-acto-vi-firma-cierre-contacto.md (cierre documental y gates). Leer doc 06 §7 Fase E y agent-docs/goal-profile.md. Ejecutar los cinco gates del perfil §5. Al terminar: protocolo de §1. No push/PR. Requiere las Fases A a D cerradas.
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
| A | `feat(act6): añadir la firma, las dos vías operativas y poblar el footer` |
| B | `feat(act6): animar la cadena de intermediación y los departamentos` |
| C | `feat(form): añadir formulario de reserva con validación y consentimientos` |
| D | `feat(form): enviar la solicitud por EmailJS y añadir la escena de cierre` |
| E | `docs(act6): marcar DoD y registrar deuda de los actos VI y VII` |

---

## 6. Checklist rápido del agente (por fase)

```text
[ ] Alcance de la fase leído en el doc 06
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

*Generado para delegación GOAL. La autoridad de producto sigue siendo el doc 06, no este prompt.*

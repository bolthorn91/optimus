# Goal loop kit — implementación por fases con dos subagentes de review

Configuración portable para Claude Code que implementa un documento de especificación **fase a
fase**, y que después de cada fase corre **dos subagentes de review en bucle** hasta que ambos
devuelven cero hallazgos **sobre la misma foto del código**. Solo entonces se hacen los commits y se
pasa a la fase siguiente.

No contiene nada específico de ningún proyecto: todo lo que es propio de un repositorio vive en un
único fichero de perfil que se rellena una vez.

---

## 1. Qué problema resuelve

Un agente que implementa una feature grande de una sentada produce un diff que nadie revisa de
verdad, se autoevalúa con generosidad y declara el trabajo hecho. Este kit impone tres cosas:

1. **Fases.** El trabajo se parte en entregables que caben en un diff legible, con un criterio de
   cierre verificable cada uno.
2. **Review delegado.** Quien implementa nunca se revisa a sí mismo. Dos personas independientes —
   corrección y mantenibilidad — revisan cada fase en su propio contexto y no ven los hallazgos de
   la otra.
3. **Puerta de misma foto.** Los dos revisores tienen que estar limpios **sobre el mismo hash del
   diff**. Si aplicar los hallazgos de mantenibilidad cambia el código, la ronda limpia de
   corrección caduca y se repite. Es lo que impide el autoengaño clásico de «ya lo revisó el otro».

Además, el review le cuesta al orquestador una línea de veredicto en vez de una transcripción
entera: los prompts llevan rutas, nunca contenidos, y cada subagente escribe su informe en un
fichero.

---

## 2. Contenido

```
goal-loop-kit/
├── README.md                                   ← este fichero
├── claude/                                     ← se copia a .claude/ del proyecto destino
│   ├── skills/goal/SKILL.md                    ← orquestador: el comando /goal
│   └── agents/
│       ├── goal-reviewer.md                    ← persona de corrección
│       └── goal-code-reviewer.md               ← persona de mantenibilidad
├── agent-docs/                                 ← se copia tal cual a agent-docs/
│   ├── goal-loop.md                            ← protocolo, para humanos
│   ├── goal-profile.template.md                ← EL FICHERO QUE HAY QUE RELLENAR
│   └── templates/
│       ├── goal-doc.template.md                ← plantilla de documento canónico
│       ├── goal-prompt.template.md             ← plantilla de prompt de handover
│       └── goal-prompt.metaprompt.md           ← genera el prompt desde el documento
└── examples/saved-views/                       ← ejemplo completo, agnóstico
    ├── README.md
    ├── goal-profile.md                         ← perfil de ejemplo, relleno
    └── docs/product/
        ├── 01-saved-views.md                   ← documento canónico de ejemplo
        └── 01-saved-views-goal-prompt.md       ← prompt de handover de ejemplo
```

Tres ficheros hacen el trabajo (`SKILL.md` y los dos agentes) y **no se tocan** al cambiar de
proyecto. Lo único que se reescribe es el perfil.

---

## 3. El seam: `agent-docs/goal-profile.md`

La skill y los agentes citan el perfil **por número de sección**, así que puedes traducir los
títulos pero no renumerar:

| § | Declara | Sustituye a |
|---|---------|-------------|
| §1 | Stack, idioma de UI y de código, comentarios, rama base | Reglas de estilo del proyecto original |
| §2 | Cadena de autoridad documental | `AGENTS.md` + política de tests, cableados a mano |
| §3 | Rutas canónicas (docs, deuda, E2E, roadmap, runs) | Rutas fijas tipo `docs/product/NN-*.md` |
| §4 | Comandos de verificación reales | `npm run typecheck`, Vitest, etc., hardcodeados |
| §5 | Gates bloqueantes | El «≥ 80 % de cobertura» hardcodeado |
| §6 | Zonas protegidas | La lista de legacy intocable del proyecto original |
| §7 | **Invariantes transversales** | Reglas de dominio como «dinero solo vía un helper» o «toda consulta filtrada por organización» |
| §8 | Convenciones de arquitectura | La arquitectura concreta del proyecto original |
| §9 | Parámetros del loop (rondas, umbrales, severidades) | Constantes repartidas por los prompts |
| §10 | Política de git | «Sin push, sin PR» hardcodeado |

**§7 es la sección importante.** Ahí es donde cada proyecto declara las tres o cuatro reglas que se
revisan en *todas* las fases toque lo que toque el diff. Sin perfil, el revisor de corrección se
limita a corrección, spec y tests, y lo dice en su resumen: nunca se inventa reglas de dominio.

---

## 4. Instalación en un proyecto nuevo

### 4.1 Copiar los ficheros

Desde la carpeta que contiene `goal-loop-kit`, con `<destino>` = raíz del proyecto que lo va a usar.

PowerShell:

```powershell
$dest = "C:\ruta\a\mi-proyecto"
New-Item -ItemType Directory -Force "$dest\.claude" | Out-Null
Copy-Item -Recurse -Force goal-loop-kit\claude\* "$dest\.claude\"
Copy-Item -Recurse -Force goal-loop-kit\agent-docs "$dest\"
Copy-Item "$dest\agent-docs\goal-profile.template.md" "$dest\agent-docs\goal-profile.md"
```

bash:

```bash
dest=~/ruta/a/mi-proyecto
mkdir -p "$dest/.claude"
cp -r goal-loop-kit/claude/. "$dest/.claude/"
cp -r goal-loop-kit/agent-docs "$dest/"
cp "$dest/agent-docs/goal-profile.template.md" "$dest/agent-docs/goal-profile.md"
```

Resultado en el proyecto destino:

```
mi-proyecto/
├── .claude/
│   ├── skills/goal/SKILL.md
│   └── agents/goal-reviewer.md, goal-code-reviewer.md
└── agent-docs/
    ├── goal-loop.md
    ├── goal-profile.md            ← rellenar ahora
    ├── goal-profile.template.md
    └── templates/
```

### 4.2 Ignorar el estado de los runs

Añadir a `.gitignore`:

```gitignore
.claude/goal-runs/
.claude/settings.local.json
```

El resto de `.claude/` **sí** se versiona: es configuración compartida del equipo.

### 4.3 Rellenar el perfil

Abrir `agent-docs/goal-profile.md` y completar las diez secciones. Reglas:

- **Comandos reales y verificados** en §4. Un comando que no existe convierte la verificación en
  teatro: el agente lo ejecutará, fallará y perderás una ronda.
- **`No aplica` en lo que no aplique**, nunca en blanco. Vacío significa «decide tú», y no quieres
  que decida.
- **§7 con tres a seis invariantes como mucho.** Si listas veinte, ninguno se revisa en serio.
- Lo que escribas es normativo: si no quieres que se exija en cada fase, no lo escribas.

Si prefieres delegarlo, abre una sesión en el proyecto destino y pide: «lee el repo y rellena
`agent-docs/goal-profile.md` desde `goal-profile.template.md`; pregúntame lo que no puedas deducir».
Después revísalo a mano — es el fichero del que depende todo lo demás.

### 4.4 Comprobar que la skill está disponible

Reinicia la sesión de Claude Code en el proyecto destino y escribe `/goal`. Debe aparecer la skill
con su `argument-hint`. Si no aparece, comprueba que la ruta es exactamente
`.claude/skills/goal/SKILL.md` y que el frontmatter no se rompió al copiar.

Los dos agentes se detectan solos por estar en `.claude/agents/`.

---

## 5. Uso

### 5.1 Ciclo completo

```
1. Escribir el documento canónico     ← plantilla goal-doc.template.md
2. Generar el prompt de handover      ← /goal --make-prompt docs/product/01-mi-feature.md
3. Ejecutar                           ← /goal docs/product/01-mi-feature-goal-prompt.md
```

### 5.2 Comandos

| Comando | Qué hace |
|---------|----------|
| `/goal <ruta>` | Arranca (o retoma) un run desde un documento o un prompt de handover |
| `/goal` | Retoma el run más reciente |
| `/goal --resume` | Igual, explícito |
| `/goal --status` | Imprime el estado del run y no cambia nada |
| `/goal --phase B` | Ejecuta solo esa fase y para |
| `/goal --make-prompt <doc>` | Genera el prompt de handover del documento |

### 5.3 Qué pasa en cada fase

```
SHA base de la fase
  → implementar el alcance de la fase
  → tests de toda superficie tocada
  → verificación local (comandos del perfil §4)
  → loop goal-reviewer        hasta ronda limpia
  → loop goal-code-reviewer   hasta ronda limpia
  → puerta de misma foto      (si el segundo loop tocó código, repetir el primero)
  → commits (sin push, sin PR)
  → fase siguiente
```

Una **ronda limpia** es cero hallazgos accionables de cualquier severidad, nits incluidos. Cualquier
ítem accionable significa aplicarlo entero y relanzar el **mismo** agente.

El estado vive en `.claude/goal-runs/<slug>/state.md`, así que el run sobrevive a la compactación de
contexto y al reinicio de sesión. Para un run desatendido: `/loop /goal --resume`.

---

## 6. Escribir un goal nuevo

Copia `agent-docs/templates/goal-doc.template.md` a la carpeta de documentos que declaraste en el
perfil §3 y rellénalo. Lo que hace que un documento funcione:

- **Decisiones cerradas con identificador** (`F4`, `C2`…). Se citan en hallazgos, rechazos y commits.
- **Fases que caben en un diff legible.** Si una fase genera más de 1 MB de diff, la skill avisa; si
  genera más de 10 MB, para. Backend antes que UI.
- **DoD verificable por fase.** «Como máximo una vista predeterminada, garantizado por índice único»
  se comprueba; «la feature funciona bien» no.
- **Tests golden con prefijo estable** (`SV-01`, `SV-02`…) para poder exigirlos por nombre.
- **Fuera de alcance explícito.** Es lo que impide que el agente se expanda solo.

La numeración §1–§14 del documento es estable: el prompt y los subagentes citan §2 (decisiones), §7
(fases), §8 (DoD), §9 (fuera de alcance) y §12 (deuda).

Después, `/goal --make-prompt <doc>` genera el prompt de handover siguiendo
`goal-prompt.metaprompt.md`. Si el documento no tiene plan de fases, el proceso para y lo dice en
vez de inventarse fases.

Hay un ejemplo completo y agnóstico en [`examples/saved-views/`](examples/saved-views/README.md):
perfil relleno, documento canónico y prompt de handover de una feature de «vistas guardadas».

---

## 7. Calibración

Todo se ajusta desde el perfil §9:

| Palanca | Efecto |
|---------|--------|
| **Severidades accionables** | Quitar `nit` de la lista acorta mucho los loops y baja el listón. Es la palanca principal. |
| **Tope de rondas** (5) | Cuántas rondas por agente y fase antes de escalar al humano. |
| **Umbral de tamaño de fichero** (1000 líneas) | A partir de ahí, el revisor de mantenibilidad exige descomponer. |
| **Aviso / parada por diff** (1 MB / 10 MB) | Protege el contexto de los revisores. |

Si un loop no converge, la causa suele ser una de tres: la fase es demasiado grande, el documento no
cierra una decisión que los dos revisores interpretan distinto, o el perfil §8 no declara la
convención que uno de ellos está exigiendo de memoria. Las guardas de oscilación y el tope de rondas
paran el bucle y te lo cuentan en vez de dar vueltas.

---

## 8. Requisitos y compatibilidad

- **Claude Code** con soporte de skills (`.claude/skills/`) y subagentes (`.claude/agents/`).
- **Git**. La recolección del diff usa `git add -A -N` (portable, respeta `.gitignore`); si el perfil
  §10 prohíbe tocar el índice, la skill usa la variante `--no-index`, que necesita bash.
- **Cualquier lenguaje y stack.** No hay nada atado a TypeScript, Node ni npm: el lenguaje sale del
  perfil §1 y los comandos del §4. El ejemplo usa TypeScript porque hay que usar algo.
- **Windows, macOS y Linux.** Los bloques de recolección de diff están en forma portable.

Los revisores son **agentes**, no skills, así que no colisionan con `/review` ni `/code-review`.

---

## 9. Idiomas del kit

| Ficheros | Idioma | Por qué |
|----------|--------|---------|
| `claude/skills/goal/SKILL.md`, `claude/agents/*.md` | Inglés | Son prompts que consume el modelo; el contrato de severidades (`bug`, `suggestion`, `nit`) es literal |
| `agent-docs/*`, `examples/*`, este README | Español | Son para el equipo |

Puedes traducir los prompts de los agentes a tu idioma, pero **no traduzcas** las tres palabras de
severidad ni las líneas `VERDICT:`: la skill las parsea literalmente.

---

## 10. Qué NO hace el kit

- No abre PRs ni hace push. Nunca, salvo que se lo pidas explícitamente fuera del loop.
- No modifica las zonas que declares protegidas en §6.
- No baja umbrales ni amplía excludes para pasar un gate.
- No inventa comandos de verificación que no estén en §4.
- No tiene un tercer revisor sin rúbrica que dé una última pasada con ojos frescos. Añadirlo es un
  fichero más en `.claude/agents/` y un tercer loop entre la puerta de misma foto y el commit; el
  protocolo no necesita ningún otro cambio (ver `agent-docs/goal-loop.md`).

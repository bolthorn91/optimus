# Roadmap — OPTIMVS Capital Protegido

Orden de implementación del sitio web. Cada fila es un documento canónico de goal que se
ejecuta con `/goal docs/product/<slug>-goal-prompt.md`.

**Perfil del proyecto:** [`agent-docs/goal-profile.md`](../../agent-docs/goal-profile.md)
**Canon de contenido:** [`content/`](../../content/README.md)

---

## §1 Estado global

| Campo | Valor |
|-------|-------|
| Fase del producto | v1 — sitio de captación, objetivo único: reservar sesión de diagnóstico patrimonial |
| Superficie | Home de scroll continuo (actos I–VII) + páginas de detalle + legales |
| Estado | Fundación, actos I–VII y páginas de detalle hechos en branch `main`. Documento 08 pendiente. |

---

## §2 Features

| # | Documento | Alcance | Estado |
|---|-----------|---------|--------|
| 00 | [`00-fundacion-sistema-diseno.md`](00-fundacion-sistema-diseno.md) | Andamiaje técnico, sistema de diseño, motor de movimiento y shell de aplicación | hecho en branch |
| 01 | [`01-acto-i-hero-escenario-europeo.md`](01-acto-i-hero-escenario-europeo.md) | Hero a pantalla completa y acto I: los tres factores convergentes | hecho en branch |
| 02 | [`02-acto-ii-seguridad-global.md`](02-acto-ii-seguridad-global.md) | Acto II: mapas de riesgo bélico 1985→2050 y factor climático | hecho en branch |
| 03 | [`03-acto-iii-asimetria-territorial.md`](03-acto-iii-asimetria-territorial.md) | Acto III: escena satelital día→noche, comparativa territorial y bursátil | hecho en branch |
| 04 | [`04-acto-iv-marco-legal-garantias.md`](04-acto-iv-marco-legal-garantias.md) | Acto IV: diagrama del CDI, las cuatro garantías, el dato de las 13.243.219 ha | hecho en branch |
| 05 | [`05-acto-v-activos-simulador.md`](05-acto-v-activos-simulador.md) | Acto V: los tres vehículos de inversión y el simulador de proyección | hecho en branch |
| 06 | [`06-acto-vi-firma-cierre-contacto.md`](06-acto-vi-firma-cierre-contacto.md) | Actos VI–VII: la firma, las dos vías, cierre y formulario de reserva | hecho en branch |
| 07 | [`07-paginas-detalle.md`](07-paginas-detalle.md) | Páginas de detalle por acto y por vehículo, legales, SEO | hecho en branch |
| 08 | [`08-responsive-movil.md`](08-responsive-movil.md) | Adaptación móvil de toda la superficie | pendiente |

---

## §3 Dependencias duras

```
00 ──┬── 01 ── 02 ── 03 ── 04 ── 05 ── 06 ──┬── 07 ── 08
     │                                      │
     └──────────── (primitivas) ────────────┘
```

- **00 antes que todo.** Sin tokens, motor de movimiento y shell no hay dónde montar una escena.
- **01→06 en orden.** Construyen el relato secuencial de la home y cada una reutiliza primitivas
  introducidas por la anterior.
- **07 necesita 01–06:** las páginas de detalle son el destino de los CTA de cada acto.
- **08 al final:** decisión del cliente — escritorio impoluto primero, móvil en segunda iteración.

---

## §4 Fuera del roadmap v1

| Ítem | Notas |
|------|-------|
| Panel de inversor con trazabilidad en tiempo real | El dossier lo insinúa (`content/secciones/06-estructura-operativa.md`); es producto, no web |
| Informes diarios de valores | Ídem |
| Área privada, login, KYC | Sin backend en v1 |
| Listado de activos concretos con precios | El cliente no ha facilitado inventario |
| Versión en inglés | La estructura queda preparada en 00; el contenido traducido es v2 |

---

## §5 Bloqueos conocidos del cliente

Registrados en [`content/08-notas-editoriales.md`](../../content/08-notas-editoriales.md). No
bloquean la implementación —se renderiza un marcador visible— pero sí la publicación:

| Id | Bloqueo | Afecta a |
|----|---------|----------|
| B-01 | Teléfonos contradictorios entre el texto y la cabecera del dossier | 06 |
| B-02 | Dominio y correo provisionales (`optimvs.cp.com`) | 06, 07 |
| B-03 | Falta el mapa de proyección 2050 (duplicado del de «actualidad») | 02 |
| B-04 | Logotipo sin transparencia, sin versión vectorial | 00 |
| B-05 | Faltan datos registrales de ambas sociedades | 07 |
| — | Sin retrato del fundador | 06 |
| E-05 | Sin cifra de inversión mínima | 05, 06 |

---

*Actualizar la columna «Estado» al cerrar cada goal: `pendiente` → `hecho en branch` → `hecho`.*

# 02 — Arquitectura de la información

---

## Estructura recomendada

**Formato: one-page largo con navegación ancla + páginas legales separadas.**

Razón: el dossier es un **argumento secuencial**. Cada sección depende de la anterior
(diagnóstico → implicación → solución). Fragmentarlo en páginas independientes rompe el
arco narrativo y obliga al usuario a reconstruirlo. El scroll continuo lo preserva.

Alternativa aceptable si el cliente prefiere multipágina: mantener el mismo orden y añadir
navegación «anterior / siguiente» al pie de cada sección para forzar la secuencia.

---

## Sitemap

```
/                                   ← One-page principal
├── #inicio                         Hero / portada
├── #propuesta                      Dirigido a / Propuesta / Estructura (pág. 2)
├── #escenario-europeo              I.   El nuevo escenario europeo
├── #seguridad-global               II.  Seguridad global
│   ├── Regiones vulnerables
│   └── Factor climático
├── #estado-de-derecho              III. Estado de derecho
│   ├── Comparativa territorial
│   ├── Mercado bursátil
│   └── Conclusión
├── #estrategia-anticipatoria       IV.  La necesidad de una estrategia anticipatoria
│   ├── ¿Por qué Argentina?
│   ├── Marco fiscal y seguridad jurídica
│   └── Garantías
├── #nuestra-estrategia             V.   Nuestra estrategia (tabla de activos)
├── #estructura-operativa           VI.  Estructura operativa España–Argentina
│   ├── Carlos Carbajal, fundador
│   └── Tres departamentos
├── #asesoramiento                  VII. Asesoramiento e intermediación transfronteriza
├── #contacto                       CTA + formulario + datos de contacto
└── #fuentes                        Fuentes y notas (footer)

/aviso-legal
/politica-de-privacidad
/politica-de-cookies
/dossier.pdf                        ← descarga del PDF original
```

---

## Orden de secciones y peso relativo

| # | Sección | Ancla | Peso visual | Nota |
|---|---|---|---|---|
| 0 | Hero | `#inicio` | **Alto** | Pantalla completa. Logo + titular + claim + CTA. |
| 1 | Propuesta en 3 datos | `#propuesta` | Medio | Tres tarjetas: Dirigido a / Propuesta / Estructura. |
| 2 | I. Nuevo escenario europeo | `#escenario-europeo` | **Alto** | Los 3 factores convergentes son el gancho argumental. |
| 3 | II. Seguridad global | `#seguridad-global` | **Alto** | Sección más visual: mapas de riesgo. |
| 4 | III. Estado de derecho | `#estado-de-derecho` | **Alto** | Contiene la tabla España/Argentina y la imagen satelital. |
| 5 | IV. Estrategia anticipatoria | `#estrategia-anticipatoria` | **Muy alto** | Bisagra: aquí se pasa del problema a la solución. |
| 6 | V. Nuestra estrategia | `#nuestra-estrategia` | **Muy alto** | Los 3 tipos de activo. Núcleo de la oferta. |
| 7 | VI. Estructura operativa | `#estructura-operativa` | **Alto** | Confianza: quién es la firma y quién la fundó. |
| 8 | VII. Asesoramiento | `#asesoramiento` | Medio | Detalle operativo/legal. |
| 9 | CTA + contacto | `#contacto` | **Muy alto** | Objetivo de conversión. |
| 10 | Footer + fuentes | `#fuentes` | Bajo | Fuentes, legales, redes. |

---

## Navegación

**Barra superior fija** (aparece tras salir del hero):

```
[Logo OPTIMVS]   Escenario · Seguridad · Estrategia · Activos · Nosotros   [Reservar sesión]
```

- Máximo 5 entradas visibles. Agrupar: I+II+III → «Escenario» y «Seguridad»;
  IV → «Estrategia»; V → «Activos»; VI+VII → «Nosotros».
- CTA persistente a la derecha, siempre visible.
- En móvil: menú hamburguesa + **CTA sticky inferior** (barra fija con «Reservar sesión»).

**Indicador de progreso de lectura:** barra fina superior. El documento es largo y
argumental; señalar avance reduce abandono.

---

## Puntos de conversión (CTA)

El dossier tiene un único CTA al final. En web hay que **repartirlo** sin volverlo intrusivo:

| Posición | Tipo | Texto sugerido |
|---|---|---|
| Hero | Primario | **Reservar sesión privada** + secundario «Descargar dossier» |
| Fin de sección IV (bisagra) | Intermedio, en línea | «Analice su caso con un consultor» |
| Fin de sección V (activos) | Intermedio, en línea | «Consultar activos disponibles» |
| Sección VII / #contacto | Primario, bloque completo | **Reservar su sesión privada de diagnóstico patrimonial** |
| Barra fija | Persistente | «Reservar sesión» |

> Un mismo verbo en todos: **reservar**. No alternar entre «solicitar», «agendar»,
> «pedir cita».

---

## Jerarquía tipográfica por sección

```
H1  →  Sólo en el hero: «Proteja su patrimonio, su libertad financiera
       y su integridad ciudadana»
H2  →  Título de cada sección romana: «I. El nuevo escenario europeo»
H3  →  Subsecciones: «Regiones vulnerables», «Factor climático»,
       «Comparativa territorial», «Mercado bursátil», «Conclusión»,
       «¿Por qué Argentina?», «Marco fiscal y de seguridad jurídica», «Garantías»
H4  →  Etiquetas de ítem dentro de listas destacadas:
       «Transformación demográfica estructural», «Departamento de Análisis», etc.
```

**Numeración romana:** conservarla. Es parte del carácter institucional del documento y
ayuda a orientar en un scroll largo.

---

## Patrón de composición dominante: la comparativa pareada

España y Argentina se contraponen sistemáticamente en el dossier. Es el **motivo
compositivo central** del sitio. Se repite en:

- Comparativa territorial (superficie, población, densidad)
- Imagen satelital nocturna
- Mercado bursátil (IBEX 35 vs mercado argentino)
- Conclusión de la sección III

**Recomendación:** usar un componente reutilizable de **dos columnas contrapuestas**
(España a la izquierda, Argentina a la derecha), con tratamiento cromático distinto para
cada lado. En móvil, apilar manteniendo el orden España → Argentina.

---

## Comportamiento en scroll

- **Mapas de riesgo (sección II):** son 4 estados temporales (1985 → 2015 → actualidad →
  proyección 2050). Tratar como **secuencia**: carrusel temporal, scroll horizontal
  o transición al hacer scroll. Es el mejor momento visual del documento.
- **Tabla comparativa territorial:** contador animado al entrar en viewport (opcional,
  sin abusar).
- **Tabla de activos (sección V):** en escritorio tabla de 3 columnas; en móvil, tarjetas
  apiladas. Nunca scroll horizontal de tabla en móvil.

---

## Fuera de alcance en v1

Documentado explícitamente porque el dossier lo insinúa:

- Panel de inversor con *«trazabilidad de las inversiones visible en tiempo real»*.
- *«Informes diarios de los valores»*.
- Simulador de rentabilidad o calculadora de inversión.
- Listado de activos concretos disponibles con precios.
- Área privada / login / KYC.

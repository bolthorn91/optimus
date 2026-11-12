# 09 · Home comercial y arquitectura de páginas

Cambio de modelo: la home deja de ser un one-page de siete actos y pasa a ser una página de
decisión. El argumentario se conserva en páginas propias; la conversión se concentra en
**reservar sesión privada**.

## Mapa

| Ruta | Función |
|---|---|
| `/` | Home comercial breve |
| `/proyectos` | Cartera de oportunidades y fichas |
| `/calculadora` | Simulador completo |
| `/nosotros` | Firma, fundador, equipo y acompañamiento |
| `/estrategia` | Tesis y acceso a los siete actos |
| `/contacto` | Reserva |
| Actos y activos existentes | Contenido profundo y SEO |
| `/recorrido` | Dossier completo heredado, `noindex` y sin navegación |

## Home

1. Hero con una única acción principal y acceso a proyectos.
2. Proyectos abiertos: tres fichas de decisión con tipo, ubicación, inversión inicial,
   retorno estimado y plazo.
3. Cómo funciona: diagnóstico, estructuración y seguimiento.
4. Por qué OPTIMVS: España–Argentina, CDI y atención directa.
5. Calculadora: banda de enlace, sin simulador embebido.
6. Cierre: reserva y descargo.

## Proyectos

`src/content/projects.ts` define el contrato de ficha. Los campos sin información del cliente
se sirven con `PendingValue` y deuda **PROY-01**; no se inventan cifras. La home usa la
variante `featured` (tarjeta compacta y carril horizontal en móvil) y `/proyectos` la ficha
completa.

## Navegación

La cabecera muestra solo `Proyectos`, `Estrategia`, `Calculadora`, `Nosotros` y la acción de
reserva. El miliario de capítulos queda fuera de la home; los actos se enlazan desde
`/estrategia`.

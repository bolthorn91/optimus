# 09 · Home comercial y arquitectura de páginas

Cambio de modelo: la home deja de ser un one-page de siete actos y pasa a ser una página de
decisión. El argumentario se conserva en páginas propias; la conversión se concentra en
**reservar sesión privada**.

## Mapa

| Ruta | Función |
|---|---|
| `/` | Home comercial breve |
| `/proyectos` | Cartera de oportunidades y fichas |
| `/proyectos/:slug` | Descripción, datos, imágenes y condiciones de cada promoción |
| `/calculadora` | Simulador completo |
| `/nosotros` | Firma, fundador, equipo y acompañamiento |
| `/estrategia` | Tesis y acceso a los siete actos |
| `/contacto` | Reserva |
| Actos y activos existentes | Contenido profundo y SEO |
| `/recorrido` | Dossier completo heredado, `noindex` y sin navegación |

## Home

1. Hero con una única acción principal y acceso a proyectos.
2. Proyectos: fichas con imagen, tipo, ubicación y datos técnicos. Cada ficha es clicable y
   lleva a su descripción; si no hay apertura comercial, la imagen se sirve en gris con el
   banner «Próximamente».
3. Cómo funciona: diagnóstico, estructuración y seguimiento.
4. Por qué OPTIMVS: España–Argentina, CDI y atención directa.
5. Calculadora: banda de enlace, sin simulador embebido.
6. Cierre: reserva y descargo.

## Proyectos

`src/content/projects.ts` define el contrato de ficha. Las cuatro promociones del dossier
`CARBAJAL.001.pdf` —Añelo, ONE, Entre Pinares y Edificio M. Paz— tienen nombre, ubicación,
tipo, descripción, datos técnicos e imágenes. El PDF no incluye condiciones económicas de
inversión, retorno o plazo: estas se comparten en la sesión privada y no se inventan en la
interfaz. La home usa la variante `featured` (tarjeta compacta y carril horizontal en móvil)
y `/proyectos` la ficha completa; `/proyectos/:slug` aloja la descripción navegable.

## Navegación

La cabecera muestra solo `Proyectos`, `Estrategia`, `Calculadora`, `Nosotros` y la acción de
reserva. El miliario de capítulos queda fuera de la home; los actos se enlazan desde
`/estrategia`.

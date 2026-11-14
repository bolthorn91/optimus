# 11 · Marca, pestaña y motion de la home

La marca se integra con el nombre **OPTIMVS** —nunca «Optimus»— en el logotipo, el `alt`, los
nombres de archivo, el manifest y el schema. «Optimus» queda solo como `alternateName` para
búsquedas escritas sin la V.

## Derivados de marca

| Archivo | Tamaño | Uso |
|---|---|---|
| `public/brand/optimvs-emblem-sm.png` | 180 × 153 | Emblema de cabecera, menú móvil y pie (se muestra a 37–46 px de alto) |
| `public/brand/optimvs-emblem.png` | 404 × 344 | Maestro con alfa para generar favicons |
| `public/brand/optimvs-emblem-gold.png` | 404 × 344 | Emblema monocromo en oro para piezas pequeñas |
| `public/brand/optimvs-capital-protegido-logo.png` | 559 × 511 | Logotipo completo con transparencia; `logo` del schema Organization |
| `public/brand/optimvs-capital-protegido-logo-inverse.png` | 559 × 511 | Logotipo para fondos navy; piezas editoriales |
| `public/favicon.ico` | 16/32/48 | Pestaña del navegador |
| `public/favicon-16x16.png`, `favicon-32x32.png`, `favicon-48x48.png` | nativos | Pestaña y accesos directos |
| `public/apple-touch-icon.png` | 180 × 180 | iOS |
| `public/icon-192.png`, `icon-512.png` | nativos | Manifest instalable |
| `public/og.png` | 1200 × 630 | Open Graph y Twitter Card |

El SVG aportado por el cliente envuelve un PNG; por eso los derivados se generan desde el PNG
maestro. El wordmark del logotipo completo se conserva rasterizado; el emblema de la cabecera
usa una versión en oro plano para que no aparezca el halo blanco del render original a 40 px.

## Dónde aparece

- **Cabecera** de todas las rutas: emblema + `OPTIMVS / Capital Protegido`, enlazado a `/`.
- **Menú móvil** y **pie**: el mismo emblema, con el wordmark textual para mantener el SEO.
- **Pestaña**: `favicon.ico`, PNG 16/32 y `apple-touch-icon` declarados en `index.html`.
- **Metadatos**: `og:image` con `og:image:alt`, `theme-color`, manifest y `application-name`.
- **Datos estructurados**: `Organization.logo` apunta al logotipo completo y `alternateName`
  recoge «Optimus Capital Protegido».

## Scroll de la home

- El hero ya no muestra el texto «Desplácese para continuar»: muestra una pista circular con
  un ratón y la rueda animada, enlazada a `#proyectos`. El texto sigue disponible como
  `aria-label` y se conserva en `/recorrido`, que no es la home.
- Cada sección de la home lleva un marcador decorativo con icono de trazo (proyectos, método,
  confianza, calculadora y cierre) y su numeral. El trazo se dibuja al entrar en pantalla con
  `IntersectionObserver` + `stroke-dashoffset`; con `prefers-reduced-motion` queda estático y
  sin JS también es visible.
- El CTA principal del hero usa un barrido navy, cambio de borde y desplazamiento de flecha al
  hover/focus; el CTA de cabecera mantiene su inversión y desplazamiento de flecha.

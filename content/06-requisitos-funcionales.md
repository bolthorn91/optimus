# 06 — Requisitos funcionales

Agnóstico a la tecnología. Describe **qué** debe hacer el sitio, no con qué se construye.

---

## Requisitos funcionales

### RF-01 · Navegación ancla

- Barra superior fija que aparece al salir del hero.
- Máximo 5 entradas + CTA persistente.
- Marca la sección activa durante el scroll.
- Desplazamiento suave, respetando `prefers-reduced-motion`.
- Compensar la altura de la barra fija al saltar a un ancla (evitar que el título quede
  oculto bajo ella).
- Móvil: menú desplegable + barra CTA fija inferior.

### RF-02 · Indicador de progreso de lectura

Barra fina superior que refleja el avance en el documento. Justificada por la longitud
del contenido.

### RF-03 · Secuencia temporal de mapas (sección II)

- Cuatro estados: 1985 · 2015 · Actualidad · Proyección 2050.
- Navegable por selector, scroll o arrastre.
- Leyenda siempre visible.
- Debe funcionar sin JavaScript en su forma degradada: los cuatro mapas visibles apilados.
- Alternativa textual accesible obligatoria.

### RF-04 · Formulario de contacto

Campos y validación en [`secciones/08-cta-contacto.md`](secciones/08-cta-contacto.md).

- Validación en cliente **y** en servidor.
- Preselección del campo «Interés principal» según el punto de origen del clic.
- Protección antispam por honeypot y limitación de frecuencia. **Sin CAPTCHA visible.**
- Confirmación explícita tras el envío, con plazo de respuesta indicado.
- Notificación por email al equipo comercial.
- Almacenamiento conforme a RGPD, con base legal y plazo de conservación definidos.
- Registro de la fecha, hora y texto exacto del consentimiento prestado.

### RF-05 · Descarga del dossier

- Enlace al PDF original desde el hero (CTA secundario) y desde el footer.
- Abrir en pestaña nueva o descargar directamente; no ocultar el peso del archivo (5,6 MB).
- Opcional: versión reducida y optimizada del PDF para descarga.

### RF-06 · Glosario de términos

- 20+ siglas y términos técnicos en el contenido.
- Implementación: tooltip al pasar/pulsar sobre el término, o sección de glosario
  desplegable al pie.
- **Obligatorio** para la desambiguación de «CDI» (Convenio vs Clave de Identificación).

### RF-07 · Enlaces de contacto directo

`tel:` para ambos teléfonos, `mailto:` para el email. Indicar horario y zona horaria.

### RF-08 · Páginas legales

`/aviso-legal`, `/politica-de-privacidad`, `/politica-de-cookies`.
Enlazadas desde el footer y desde el formulario.

---

## Internacionalización

- **v1:** español (España). `lang="es-ES"`.
- **Preparar** la estructura para inglés — el público declarado incluye «resto de
  europeos».
- Mantener el contenido separado del maquetado desde el principio, para que añadir un
  idioma no exija rehacer las plantillas.
- Formato de números y fechas: convención española (punto de millar, coma decimal).
- Si se añade una segunda lengua: `hreflang` en todas las páginas y conmutador visible.

---

## SEO

### Metadatos

| Página | Título | Descripción |
|---|---|---|
| Inicio | `OPTIMVS Capital Protegido — Inversión estratégica en Argentina` | Firma hispano-argentina de intermediación en activos inmobiliarios y financieros. Protección patrimonial bajo el Convenio de Doble Imposición España–Argentina. |

- Un solo `H1` por página.
- Jerarquía de encabezados sin saltos de nivel.
- URL canónica.
- Open Graph y Twitter Card con imagen 1200×630.
- Datos estructurados: `Organization` con nombre, logotipo, datos de contacto y ambas
  ubicaciones; `FAQPage` si se añade sección de preguntas frecuentes.
- `sitemap.xml` y `robots.txt`.

### Contenido

- Palabras clave naturales del dossier: *invertir en Argentina desde España*,
  *convenio doble imposición España Argentina*, *comprar propiedad en Argentina siendo
  extranjero*, *diversificación patrimonial fuera de Europa*, *inversión al pozo Argentina*.
- Los textos son largos y sustanciales: es una ventaja para SEO. No trocearlos en exceso.
- Texto alternativo descriptivo en todas las imágenes informativas.

---

## Accesibilidad — objetivo WCAG 2.1 AA

| Requisito | Aplicación concreta en este sitio |
|---|---|
| Contraste 4,5:1 en texto | ⚠️ **El oro `#B8974F` sobre navy no cumple para texto pequeño.** Usar sólo en texto grande o elementos no textuales |
| No depender del color | Los 4 niveles de riesgo de los mapas necesitan etiqueta o patrón además del color |
| Alternativa textual | Descripción larga o tabla equivalente para cada mapa; alt descriptivo en la imagen satelital |
| Navegación por teclado | Selector de mapas, menú, formulario y tooltips totalmente operables sin ratón |
| Foco visible | Indicador claro en todos los elementos interactivos |
| Etiquetas de formulario | Asociadas explícitamente; errores anunciados a lectores de pantalla |
| `prefers-reduced-motion` | Desactiva animaciones no informativas |
| Estructura semántica | Landmarks correctos; enlace de salto al contenido principal |
| Tablas | Encabezados de fila y columna correctamente marcados |
| Idioma | Declarado en el documento; marcar los pasajes en otro idioma si los hubiera |

---

## Rendimiento

| Métrica | Objetivo |
|---|---|
| Largest Contentful Paint | < 2,5 s |
| Cumulative Layout Shift | < 0,1 |
| Interaction to Next Paint | < 200 ms |
| Peso de la primera vista | < 1 MB |

**Puntos de atención específicos:**

- Las imágenes del PDF suman ~4,5 MB sin optimizar. Convertir a WebP, servir por densidad
  de pantalla y dimensionar según uso real.
- Carga diferida de todo salvo el hero.
- Reservar espacio con relación de aspecto declarada en todas las imágenes (evita CLS).
- Tipografías: precarga de las variantes críticas, `font-display: swap`, subconjunto a
  caracteres latinos.
- El PDF de 5,6 MB nunca debe cargarse automáticamente: sólo bajo clic explícito.

---

## Privacidad, cookies y analítica

- **Sin cookies no esenciales antes del consentimiento.** El propio dossier argumenta
  sobre privacidad y vigilancia digital: rastrear al visitante sin permiso sería una
  contradicción visible.
- Banner de consentimiento con rechazo tan accesible como la aceptación (mismo nivel de
  jerarquía visual, no un enlace escondido).
- **Analítica recomendada:** solución sin cookies y respetuosa con la privacidad. Encaja
  con el posicionamiento y evita el banner por analítica.
- Si se usa analítica con cookies o píxeles publicitarios: sólo tras consentimiento
  explícito, y declarados en la política de cookies.
- Formulario: cifrado en tránsito, base legal documentada, plazo de conservación definido,
  y proceso para atender derechos de acceso, rectificación y supresión.

**Eventos a medir** (una vez concedido el consentimiento):
- Envío de formulario (conversión principal)
- Clic en cada CTA, identificando su posición
- Descarga del dossier
- Profundidad de scroll por sección
- Interacción con la secuencia de mapas
- Clics en `tel:` y `mailto:`

---

## Seguridad

- HTTPS obligatorio, con redirección desde HTTP.
- Cabeceras de seguridad: política de seguridad de contenido, `X-Content-Type-Options`,
  `Referrer-Policy`, HSTS.
- Protección del endpoint del formulario contra envíos masivos.
- Sin credenciales ni claves de API en el cliente.
- Registro de envíos del formulario con retención limitada.

---

## Compatibilidad

- Dos últimas versiones de los navegadores principales.
- Móvil primero: el tráfico de campañas en redes llegará mayoritariamente desde móvil, y
  el dossier incluye iconos de Instagram y TikTok.
- Degradación aceptable sin JavaScript: todo el contenido debe ser legible; sólo se pierden
  la secuencia de mapas interactiva y el envío asíncrono del formulario.
- Versión imprimible razonable — es un público que imprime documentos patrimoniales.

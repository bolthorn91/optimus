# Despliegue — OPTIMVS Capital Protegido

SPA de Vite que se publica como **sitio estático** en Render. `render.yaml` ya define el
servicio, el build, el rewrite de todas las rutas a `/index.html` y las cabeceras. No hay
SSR ni funciones de servidor.

## 1. Verificación local antes de publicar

```bash
npm ci
npm run typecheck
npm run lint
npm run format:check
npm test
npm run build
npm run build:budget
```

Estado de referencia (commit `7812d0c`): 58 ficheros de test / 551 tests, build ~6 s,
203,9 KB de primera carga (tope 250) y 252,7 KB de escena WebGL (tope 400).

## 2. Variables de build

Todas son `VITE_*`: **públicas por diseño**, quedan incrustadas en el bundle. Cambiarlas
exige volver a desplegar con la caché de build limpia. `.env.example` es la referencia.

| Variable | Obligatoria | Uso |
|---|---|---|
| `VITE_SITE_URL` | Sí para canonical y sitemap | URL absoluta, **sin barra final**. Sin ella el build no genera `sitemap.xml`. |
| `VITE_EMAILJS_SERVICE_ID` | Sí para el formulario | Servicio de EmailJS. |
| `VITE_EMAILJS_TEMPLATE_ID` | Sí para el formulario | Plantilla de EmailJS. |
| `VITE_EMAILJS_PUBLIC_KEY` | Sí para el formulario | Clave pública de EmailJS. |
| `VITE_ANALYTICS_ENDPOINT` | No | Colector cookieless de eventos. Sin valor no se mide. |

Si faltan las tres de EmailJS, el formulario muestra su estado «no configurado»; no envía.

## 3. Render

1. **Repositorio**: el remoto configurado es `github.com/bolthorn91/optimus`. Si el repo no
   existe o el push pide credenciales, créalo/autentica desde GitHub Desktop o con
   `gh auth login` y empuja `main` antes de conectar Render.
2. **New + → Blueprint** → selecciona el repositorio → **Apply**. Render lee `render.yaml`:
   - servicio `optimvs-capital-protegido` (`runtime: static`)
   - build `npm ci && npm run build`
   - publicación de `dist`
   - rewrite `/*` → `/index.html`
   - cabeceras `X-Content-Type-Options: nosniff`,
     `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`
   - caché inmutable para `/assets/*` y `/fonts/*`
3. **Environment**: el blueprint declara las variables con `sync: false`, así que Render las
   pide al crear el servicio. Si no aparecen, añádelas a mano en *Environment*.
4. **Primer deploy**. Si falla con `vite: not found`, cambia el build a
   `npm ci --include=dev && npm run build` (Render puede estar omitiendo devDependencies).
5. **EmailJS**: la plantilla debe aceptar exactamente estos parámetros:
   `fullName`, `email`, `phone`, `taxResidence`, `interest`, `capitalBand`, `message`,
   `consentData`, `consentMarketing`, `simulatorContext`.
6. **Dominio**: Render → *Settings → Custom Domains*, apunta el DNS y vuelve a desplegar con
   `VITE_SITE_URL` apuntando ya al dominio final (sin barra). Así canonical, Open Graph y
   sitemap quedan con la URL definitiva.

## 4. Comprobación post-deploy

- `/` y `/nuestra-estrategia` responden 200.
- Una ruta inexistente sirve la SPA (HTTP 200 y la página 404 del cliente).
- `/sitemap.xml` existe y contiene **11 URLs** (las 3 legales en `noindex` quedan fuera).
- `/robots.txt` permite el rastreo y referencia el sitemap.
- El formulario entrega el correo con todos los campos de la plantilla.
- Cabeceras:
  ```bash
  curl -I https://TU-DOMINIO/
  ```
  Debe mostrar `x-frame-options: DENY`, `referrer-policy: strict-origin-when-cross-origin`
  y `x-content-type-options: nosniff`.
- `axe`/Lighthouse sobre home, un acto y el formulario.

## 5. Rollback

Render → *Deploys* → despliegue anterior → **Rollback**. Alternativa: revertir el commit en
`main` y volver a desplegar.

## 6. Límites conocidos antes de un lanzamiento público

- **Datos del cliente**: siguen los marcadores «Dato pendiente de confirmación» (B-01,
  B-02, B-05, B-07, E-05, REG-06, ALLY-06 y el retrato B-06). No se inventan.
- **Legal**: las tres páginas legales están en `noindex` hasta cerrar B-05 y LEGAL-07; el
  consentimiento RGPD no tiene registro server-side (RGPD-CONSENT) y el antispam es solo de
  cliente (ANTISPAM-06).
- **Licencias**: SIM-RATES, SAT-LIC-03 y MAP-LIC-02 requieren validación antes de publicar.
- **SPA sin JS**: A11Y-00-SPA; si se exige contenido sin JavaScript o SEO de texto, hace
  falta prerenderizar.
- **Assets**: el logo es un PNG sin transparencia real (B-04) y falta el retrato del
  fundador (B-06). Se ven en la home.
- **Responsive**: verificado sin scroll horizontal de 320 a 1440 px (TAB-08 cerrado).

El detalle completo está en [`../debt/technical-debt.md`](../debt/technical-debt.md).

# 10 · Cartera de proyectos

Fuente editorial: `CARBAJAL.001.pdf` (12 páginas). Las imágenes se extrajeron de la página
correspondiente del PDF, se recompusieron en JPG para la web y se guardaron en
`public/media/proyectos/` con el patrón `<nombredeproyecto>_<numerofoto>.jpg`.

| Proyecto | Slug | Imágenes | Datos de la ficha |
|---|---|---|---|
| Añelo | `/proyectos/anelo` | `anelo_1.jpg` a `anelo_3.jpg` | Añelo, Neuquén; Vaca Muerta; uso habitacional, logístico y de servicios |
| ONE | `/proyectos/one` | `one_1.jpg` a `one_7.jpg` | Canning, Buenos Aires; 30.000 m²; comercio, oficina y vivienda; amenities |
| Entre Pinares | `/proyectos/entre-pinares` | `entre-pinares_1.jpg` a `entre-pinares_4.jpg` | Ruta 52, km 8,5; 25 ha; 263 parcelas de 600–900 m²; seguridad 24/7 |
| Edificio M. Paz | `/proyectos/edificio-m-paz` | `edificio-m-paz_1.jpg` a `edificio-m-paz_4.jpg` | Zona residencial y comercial; dos locales en planta baja; viviendas con balcones |

Las cuatro promociones están marcadas como `coming-soon` porque el PDF no confirma su
apertura comercial. La home las muestra en gris con el banner «Próximamente»; el banner y
toda la tarjeta enlazan a la ficha. Al cambiar `status` a `open` en
`src/content/projects.ts`, la ficha deja de mostrarse en gris y pasa a mostrar el estado
«Abierto».

El PDF no contiene inversión inicial, retorno estimado ni plazo. La ficha no inventa esas
cifras: las condiciones se comparten en la sesión privada y quedan registradas como
`PROY-01` en la deuda técnica.

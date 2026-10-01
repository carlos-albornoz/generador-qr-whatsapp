# EnlaceChat — Generador de enlaces de WhatsApp con mensaje y QR

Web 100 % estática: funciona entera en el navegador del visitante, sin servidor,
sin base de datos y sin servicios de pago. Lista para GitHub Pages o cualquier hosting.

## Qué hay en la carpeta

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La página principal (herramienta + contenido SEO + FAQ) |
| `styles.css` | Todo el diseño |
| `main.js` | El funcionamiento de la herramienta |
| `lib/qr-encoder.js` | Motor propio de códigos QR (sin dependencias externas) |
| `lib/qr-render.js` | Dibuja el QR con estilos, colores y logo (PNG y SVG) |
| `lib/countries.js` | Países, banderas y prefijos |
| `lib/manifest.js` | **Tus ajustes**: nombre, dirección de la web, país por defecto |
| `privacidad.html`, `aviso-legal.html` | Páginas legales (AdSense las exige) — complétalas |
| `assets/` | Favicon e imagen para redes sociales |
| `robots.txt`, `sitemap.xml` | Para Google |
| `.htaccess` | Ajustes para hosting tipo Hostinger (GitHub Pages lo ignora, no molesta) |
| `.nojekyll` | Necesario para GitHub Pages |
| `ads.txt.ejemplo` | Plantilla para cuando AdSense te apruebe |

## Antes de publicar: 1 cambio obligatorio

Busca y reemplaza `https://carlos-albornoz.github.io/generador-qr-whatsapp/` por la dirección
real de tu web en estos archivos: `index.html`, `lib/manifest.js`, `robots.txt` y
`sitemap.xml`. (Si usas dominio propio, pon tu dominio.)

## Publicar en GitHub Pages (gratis)

1. Crea un repositorio nuevo en GitHub (público).
2. Sube **el contenido** de esta carpeta (que `index.html` quede en la raíz, no dentro de otra carpeta).
3. Ve a **Settings → Pages**, en «Source» elige la rama `main` y la carpeta `/ (root)`. Guarda.
4. En 1–2 minutos tu web estará en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`.

## Publicar en Hostinger

Sube todo el contenido de la carpeta a `public_html` (incluidos los archivos que
empiezan por punto, como `.htaccess`).

## Activar AdSense

Hay 4 huecos marcados con `ANUNCIO` y el comentario `PEGA AQUÍ TU CÓDIGO DE ADSENSE`:

1. Banner horizontal arriba del formulario.
2. Cuadrado en el lateral derecho (debajo de la vista previa en móvil).
3. Ventana emergente tras «Copiar enlace» o «Descargar QR» (siempre después de que la acción ocurra, nunca la bloquea).
4. Banner horizontal al final.

Pasos: pega el script principal de AdSense en el `<head>` (donde está el TODO),
añade un banner de consentimiento de cookies certificado por Google (obligatorio en
Europa), pega cada bloque de anuncio dentro de su hueco y borra la etiqueta `ANUNCIO`.
Renombra `ads.txt.ejemplo` a `ads.txt` con tu ID de editor (en GitHub Pages solo
funciona si usas dominio propio).

Si la ventana emergente resulta molesta, en `lib/manifest.js` puedes poner
`popupCooldownSeconds = 60` para que salga como mucho una vez por minuto.

## Cada vez que cambies algo

Sube el número `?v=20261001` (en `index.html`) a la fecha del día para que los
visitantes vean la versión nueva al instante.

## El icono del centro del QR

La opción «Icono de chat» usa un icono genérico propio. Si quieres usar el logotipo
oficial de WhatsApp, descárgalo del centro de recursos de marca de Meta, revisa sus
condiciones de uso y súbelo con la opción «Mi logo…».

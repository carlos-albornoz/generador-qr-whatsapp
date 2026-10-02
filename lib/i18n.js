/*!
 * i18n.js — sistema bilingüe (ES / EN) de EnlaceChat.
 *
 * 1. DICCIONARIO: todos los textos visibles, en un único objeto. Para cambiar
 *    un texto, edítalo aquí (en los dos idiomas) y vuelve a generar las
 *    páginas con:  python tools/generar-idiomas.py
 * 2. MOTOR: traduce la página al instante (sin recargar) usando los atributos
 *    del HTML:
 *      data-i18n="clave"            → texto del elemento
 *      data-i18n-html="clave"       → contenido con etiquetas (<strong>, <code>…)
 *      data-i18n-attr="attr:clave;…" → atributos (placeholder, aria-label, href…)
 *      data-i18n-jsonld="app|faq"   → marcado Schema regenerado en el idioma activo
 * 3. DETECCIÓN: en la página principal, si el navegador está en inglés y el
 *    visitante no ha elegido idioma antes, se cambia a inglés automáticamente.
 *    Nunca se aplica a los robots de buscadores (cada URL conserva su idioma).
 */
(function () {
  "use strict";
  var B = (window.__BRAND__ = window.__BRAND__ || {});

  /*DICT-START*/
  var DICT = {
    "es": {
      "meta.title": "Crear link de WhatsApp con mensaje y QR personalizado gratis",
      "meta.desc": "Generador de enlace WhatsApp con mensaje: crea tu link wa.me y un WhatsApp QR personalizado con tu logo y colores. Gratis, sin registro y 100 % privado.",
      "meta.canonical": "{base}",
      "meta.ogLocale": "es_ES",
      "meta.ogLocaleAlt": "en_US",
      "meta.ogTitle": "Crear link de WhatsApp con mensaje y QR personalizado",
      "meta.ogDesc": "Crea tu enlace wa.me con mensaje predeterminado y descarga un código QR con tus colores y tu logo. Gratis y sin registro.",
      "ld.appName": "EnlaceChat — Generador de enlace WhatsApp con mensaje y QR",
      "ld.appDesc": "Herramienta gratuita para crear un link de WhatsApp con mensaje predeterminado y generar un WhatsApp QR personalizado con colores y logo, descargable en PNG y SVG.",
      "ld.os": "Cualquiera (funciona en el navegador)",
      "nav.skip": "Saltar a la herramienta",
      "nav.home": "EnlaceChat, inicio",
      "nav.sections": "Secciones",
      "nav.how": "Cómo funciona",
      "nav.cases": "Casos de uso",
      "nav.faq": "FAQ",
      "nav.langLabel": "Idioma",
      "hero.h1": "Crear link de WhatsApp con mensaje y código QR personalizado",
      "hero.sub": "Generador de enlace WhatsApp con mensaje predeterminado: consigue tu link <strong>wa.me</strong> y un QR con tus colores y tu logo en segundos.",
      "hero.pills": "Ventajas",
      "hero.p1": "✓ Gratis",
      "hero.p2": "✓ Sin registro",
      "hero.p3": "✓ 100 % privado",
      "hero.p4": "✓ PNG y SVG",
      "ad.label": "ANUNCIO",
      "ad.aria": "Espacio publicitario",
      "tool.aria": "Generador de enlaces de WhatsApp",
      "tool.noscript": "Esta herramienta necesita JavaScript activado para generar tu enlace y tu código QR.",
      "tool.step1": "Tus datos",
      "tool.phoneLabel": "Número de WhatsApp",
      "tool.ccAria": "País y prefijo",
      "tool.ccSearch": "Buscar país o prefijo…",
      "tool.ccSearchAria": "Buscar país",
      "tool.ccListAria": "Países",
      "tool.phonePh": "600 123 456",
      "tool.phoneHint": "Escribe tu número sin el prefijo del país. Si pegas uno con «+», detectamos el país solos.",
      "tool.msgLabel": "Mensaje predeterminado <span class=\"opt\">(opcional)</span>",
      "tool.fmtLabel": "Formato del texto",
      "tool.fmtBold": "Negrita",
      "tool.fmtItalic": "Cursiva",
      "tool.fmtStrike": "Tachado",
      "tool.fmtMono": "Monoespaciado",
      "tool.fmtBoldBtn": "<b>N</b>",
      "tool.fmtItalicBtn": "<i>C</i>",
      "tool.fmtStrikeBtn": "<s>T</s>",
      "tool.msgPh": "Hola 👋 Vengo de vuestra web y me gustaría recibir más información.",
      "tool.chips": "Plantillas rápidas",
      "tool.chip1": "Información",
      "tool.chip2": "Reserva",
      "tool.chip3": "Pedido",
      "tool.chip4": "Presupuesto",
      "tool.tpl1": "Hola 👋 Me gustaría recibir más información sobre sus servicios.",
      "tool.tpl2": "¡Hola! Quiero reservar una mesa para ___ personas el día ___ a las ___.",
      "tool.tpl3": "Hola, me interesa este producto que vi en Instagram: ___ ¿Sigue disponible?",
      "tool.tpl4": "Hola, me gustaría solicitar un presupuesto para automatizar ___ en mi empresa.",
      "tool.generate": "Generar enlace y QR",
      "tool.privacy": "🔒 100 % privado: tu número, tu mensaje y tu logo se procesan en tu dispositivo y no se envían a ningún servidor.",
      "tool.step2": "Tu enlace de WhatsApp",
      "tool.linkAria": "Enlace generado",
      "tool.copy": "Copiar enlace",
      "tool.test": "Probar enlace ↗",
      "tool.step3": "Personaliza tu WhatsApp QR",
      "tool.qrAria": "Código QR generado",
      "tool.fg": "Color frontal",
      "tool.bg": "Color de fondo",
      "tool.fgHex": "Color frontal en hexadecimal",
      "tool.bgHex": "Color de fondo en hexadecimal",
      "tool.swatches": "Combinaciones rápidas",
      "tool.sw1": "Verde oscuro sobre blanco",
      "tool.sw2": "Verde sobre blanco",
      "tool.sw3": "Negro sobre blanco",
      "tool.sw4": "Verde oscuro sobre verde claro",
      "tool.sw5": "Azul marino sobre gris",
      "tool.shape": "Forma de los puntos",
      "tool.sq": "<span class=\"g\">▪ </span>Cuadrados",
      "tool.rd": "<span class=\"g\">◆ </span>Redondeados",
      "tool.dt": "<span class=\"g\">● </span>Puntos",
      "tool.center": "Imagen central",
      "tool.cNone": "Ninguna",
      "tool.cChat": "Icono de chat",
      "tool.cCustom": "Mi logo…",
      "tool.logoHint": "Con imagen central activamos la máxima corrección de errores para que el código siga leyéndose.",
      "tool.pngSize": "Tamaño PNG",
      "tool.s2048": "2048 px (alta)",
      "tool.s4096": "4096 px (imprenta)",
      "tool.dlPng": "⬇ Descargar PNG",
      "tool.dlSvg": "⬇ Descargar SVG",
      "pv.aria": "Vista previa",
      "pv.chatAria": "Vista previa del chat",
      "pv.online": "en línea",
      "pv.today": "Hoy",
      "pv.sys": "Los mensajes y llamadas están protegidos. Vista previa simulada.",
      "pv.empty": "Sin mensaje: el chat se abrirá vacío y tu cliente escribirá lo que quiera.",
      "pv.input": "Mensaje",
      "pv.cap": "Así verá tu cliente el mensaje: le aparecerá ya escrito y solo tendrá que pulsar enviar.",
      "how.title": "Cómo crear un link de WhatsApp en 3 simples pasos",
      "how.s1t": "1. Introduce tu número",
      "how.s1p": "Elige tu país en el desplegable de banderas y escribe tu número de WhatsApp. El prefijo internacional se añade solo, sin espacios ni símbolos.",
      "how.s2t": "2. Escribe el mensaje",
      "how.s2p": "Redacta el texto con el que tus clientes iniciarán la conversación. La vista previa te enseña cómo quedará en el chat, con negritas y emojis incluidos.",
      "how.s3t": "3. Copia el enlace y descarga tu QR",
      "how.s3p": "Pulsa generar: copia tu enlace wa.me con un clic, personaliza el código QR con tus colores y tu logo, y descárgalo en PNG o SVG de alta calidad.",
      "cases.title": "Casos de uso del enlace de WhatsApp con mensaje",
      "cases.lead": "Un link de WhatsApp con mensaje predeterminado elimina fricción: el cliente no tiene que guardar tu número ni pensar qué escribir. Así lo aprovechan distintos negocios:",
      "cases.c1t": "Agencias de tecnología y automatización",
      "cases.c1p": "Coloca el enlace en tu web, en tus anuncios y en tus propuestas comerciales con un mensaje como «Quiero automatizar mi atención al cliente». El texto predefinido te dice de qué campaña llega cada contacto y permite que tus chatbots o flujos de CRM clasifiquen el lead al instante.",
      "cases.c2t": "Restaurantes y bares",
      "cases.c2p": "Imprime un WhatsApp QR personalizado en mesas, cartas y escaparates para recibir reservas y pedidos para llevar sin llamadas. Con un mensaje tipo «Quiero reservar una mesa para ___ personas» las peticiones llegan ordenadas y con los datos que necesitas.",
      "cases.c3t": "Tiendas de Instagram",
      "cases.c3p": "Pon el enlace en tu bio, en los stories con el sticker de enlace y en las publicaciones de producto. Un mensaje como «Me interesa este producto, ¿sigue disponible?» convierte seguidores en conversaciones de venta en un solo toque.",
      "cases.c4t": "Tarjetas de presentación",
      "cases.c4p": "Añade el QR en formato SVG a tu tarjeta de visita, folletos o firma impresa: al escanearlo se abre un chat contigo con un saludo ya escrito. Para tarjetas pequeñas, usa un mensaje corto y el código seguirá siendo nítido y fácil de leer.",
      "seo.title": "Qué es un enlace wa.me y por qué usar un generador",
      "seo.p1": "WhatsApp ofrece un formato oficial de enlace corto, <strong>wa.me</strong>, que abre directamente un chat con un número concreto. La estructura es sencilla: <code>https://wa.me/</code> seguido del número en formato internacional (prefijo del país y número, solo cifras) y, si quieres, <code>?text=</code> con el mensaje codificado para que funcione en una URL.",
      "seo.p2": "Hacerlo a mano da errores fáciles: dejar el «+» o los ceros iniciales, olvidar el prefijo, o escribir tildes, espacios y emojis sin codificar. Este <strong>generador de enlace WhatsApp con mensaje</strong> se encarga de todo: limpia el número, codifica el texto correctamente y te enseña el resultado antes de compartirlo.",
      "seo.h3a": "Consejos para que tu WhatsApp QR personalizado siempre escanee",
      "seo.p3": "Usa siempre un color frontal oscuro sobre un fondo claro: los lectores de QR buscan contraste, y un código con colores invertidos o pastel puede fallar en móviles antiguos. Si añades tu logo, la herramienta activa la máxima corrección de errores automáticamente. Para impresión, descarga el SVG (vectorial, no pierde calidad) y no lo imprimas por debajo de 2 × 2 cm; si el mensaje es largo, el código tendrá más puntos y conviene imprimirlo más grande. Prueba siempre el código con tu móvil antes de mandarlo a imprenta.",
      "seo.h3b": "Formato de texto en el mensaje",
      "seo.p4": "WhatsApp admite formato básico y lo respeta en los mensajes predeterminados: <code>*negrita*</code>, <code>_cursiva_</code>, <code>~tachado~</code> y <code>```monoespaciado```</code>. Usa los botones de formato del editor y verás el resultado en la vista previa al momento.",
      "faq.title": "Preguntas frecuentes",
      "faq.q1": "¿Cómo crear un link de WhatsApp con mensaje?",
      "faq.a1": "Elige tu país, escribe tu número sin el prefijo y redacta el mensaje que verán tus clientes. Pulsa «Generar enlace y QR» y obtendrás un enlace wa.me listo para copiar, con el texto ya incluido.",
      "faq.q2": "¿Es gratis este generador de enlace de WhatsApp con mensaje?",
      "faq.a2": "Sí. Puedes crear todos los enlaces y códigos QR que quieras, sin registro y sin límites. Los enlaces wa.me no caducan nunca.",
      "faq.q3": "¿El código QR de WhatsApp caduca?",
      "faq.a3": "No. El QR contiene directamente tu enlace wa.me, sin redirecciones intermedias, así que funcionará mientras tu número siga activo en WhatsApp.",
      "faq.q4": "¿Puedo poner mi logo en el WhatsApp QR personalizado?",
      "faq.a4": "Sí. Puedes añadir un icono de chat o subir tu propio logo (PNG, JPG o SVG). La herramienta aumenta automáticamente la corrección de errores del código para que siga escaneándose bien.",
      "faq.q5": "¿Sirve para WhatsApp Business?",
      "faq.a5": "Sí. Los enlaces wa.me funcionan igual con cuentas personales y con WhatsApp Business: el chat se abre con tu número y el mensaje ya escrito.",
      "faq.q6": "¿Mis datos se guardan en algún servidor?",
      "faq.a6": "No. El enlace y el código QR se generan en tu propio navegador. Tu número, tu mensaje y tu logo nunca se envían ni se guardan en ningún servidor.",
      "faq.q7": "¿Qué formato de QR debo descargar, PNG o SVG?",
      "faq.a7": "PNG es ideal para redes sociales, webs y documentos. SVG es un formato vectorial que se puede ampliar sin perder calidad, perfecto para imprenta, tarjetas de presentación, carteles y vinilos.",
      "faq.q8": "¿Por qué mi QR no se escanea?",
      "faq.a8": "Las causas más habituales son poco contraste entre colores, un color frontal más claro que el fondo, un tamaño de impresión demasiado pequeño o un mensaje muy largo. Usa un color oscuro sobre fondo claro e imprímelo al menos a 2 × 2 cm.",
      "footer.tagline": "<b>EnlaceChat</b> · Crear link de WhatsApp con mensaje y WhatsApp QR personalizado, gratis.",
      "footer.legalAria": "Legal",
      "footer.privacy": "Privacidad y cookies",
      "footer.privacyHref": "privacidad.html",
      "footer.legal": "Aviso legal",
      "footer.legalHref": "aviso-legal.html",
      "footer.tm": "WhatsApp es una marca registrada de Meta Platforms, Inc. EnlaceChat es una herramienta independiente y no está afiliada, patrocinada ni respaldada por WhatsApp ni por Meta.",
      "popup.close": "Cerrar",
      "popup.done": "¡Listo!",
      "popup.continue": "Cerrar y continuar",
      "js.noCountry": "No encontramos ese país",
      "js.ccAria": "País: {name} ({dial}). Cambiar país",
      "js.detected": "País detectado: {name}.",
      "js.zero": "Hemos quitado el 0 inicial: no se usa en formato internacional.",
      "js.double": "¿Has escrito el prefijo {dial} dos veces? No hace falta incluirlo en el número.",
      "js.ar": "Móviles de Argentina: añade un 9 antes del código de área y quita el 15 (ej.: 9 11 2345 6789).",
      "js.mx": "En México ya no hace falta el 1 después del +52: usa solo los 10 dígitos.",
      "js.yourNumber": "Tu número",
      "js.errEmpty": "Escribe tu número de WhatsApp para generar el enlace.",
      "js.errInvalid": "Ese número no parece válido. Revisa el país y que tenga todos los dígitos (sin el prefijo).",
      "js.genDone": "Enlace y QR actualizados ✓",
      "js.linkMeta": "Enlace oficial wa.me · {n} caracteres",
      "js.densLow": "Densidad baja: ideal incluso para tarjetas pequeñas.",
      "js.densMid": "Densidad media: imprímelo a 2,5 cm o más.",
      "js.densHigh": "Densidad alta (mensaje largo): imprímelo a 3,5 cm o más, o acorta el mensaje.",
      "js.modules": "({n}×{n} módulos)",
      "js.logoDropped": "Mensaje muy largo: hemos quitado la imagen central para que el código quepa.",
      "js.tooLong": "El mensaje es demasiado largo para un código QR. Acórtalo un poco.",
      "js.qrAria": "Código QR de {link}",
      "js.inverted": "⚠ Colores invertidos: muchos lectores necesitan el código oscuro sobre fondo claro. Prueba a intercambiarlos.",
      "js.lowContrast": "⚠ Contraste bajo ({ratio}:1). Oscurece el color frontal o aclara el fondo para que se escanee bien.",
      "js.logoAdded": "Logo «{name}» añadido. Pulsa «Mi logo…» otra vez para cambiarlo.",
      "js.tooBig": "La imagen supera 5 MB. Prueba con una más ligera.",
      "js.readFail": "No hemos podido leer esa imagen. Usa PNG, JPG o SVG.",
      "js.qrFail": "No se pudo crear el QR: acorta el mensaje.",
      "js.pngToast": "Descargando PNG de {px} px",
      "js.pngPopup": "Tu código QR en PNG se está descargando.",
      "js.pngFail": "No hemos podido crear el PNG. Prueba con el SVG o con otro logo.",
      "js.svgToast": "Descargando SVG vectorial",
      "js.svgPopup": "Tu código QR en SVG se está descargando.",
      "js.copied": "✓ Copiado",
      "js.copyPopup": "Enlace copiado al portapapeles.",
      "js.loadFail": "No se ha podido cargar la herramienta. Recarga la página.",
      "js.decimal": ","
    },
    "en": {
      "meta.title": "WhatsApp Link Generator with Message & Custom QR Code",
      "meta.desc": "Create a WhatsApp link with a pre-filled message and a custom WhatsApp QR code with your logo and colors. Free, no sign-up, 100% private.",
      "meta.canonical": "{base}en.html",
      "meta.ogLocale": "en_US",
      "meta.ogLocaleAlt": "es_ES",
      "meta.ogTitle": "Create a WhatsApp link with a message and a custom QR code",
      "meta.ogDesc": "Create your wa.me link with a pre-filled message and download a QR code with your colors and logo. Free, no sign-up.",
      "ld.appName": "EnlaceChat — WhatsApp link generator with message and QR code",
      "ld.appDesc": "Free tool to create a WhatsApp link with a pre-filled message and generate a custom WhatsApp QR code with colors and logo, downloadable as PNG and SVG.",
      "ld.os": "Any (runs in the browser)",
      "nav.skip": "Skip to the tool",
      "nav.home": "EnlaceChat, home",
      "nav.sections": "Sections",
      "nav.how": "How it works",
      "nav.cases": "Use cases",
      "nav.faq": "FAQ",
      "nav.langLabel": "Language",
      "hero.h1": "Create a WhatsApp Link with a Message and a Custom QR Code",
      "hero.sub": "WhatsApp link generator with a pre-filled message: get your <strong>wa.me</strong> link and a QR code with your colors and logo in seconds.",
      "hero.pills": "Benefits",
      "hero.p1": "✓ Free",
      "hero.p2": "✓ No sign-up",
      "hero.p3": "✓ 100% private",
      "hero.p4": "✓ PNG & SVG",
      "ad.label": "ADVERTISEMENT",
      "ad.aria": "Advertising space",
      "tool.aria": "WhatsApp link generator",
      "tool.noscript": "This tool needs JavaScript enabled to generate your link and QR code.",
      "tool.step1": "Your details",
      "tool.phoneLabel": "WhatsApp number",
      "tool.ccAria": "Country and calling code",
      "tool.ccSearch": "Search country or code…",
      "tool.ccSearchAria": "Search country",
      "tool.ccListAria": "Countries",
      "tool.phonePh": "201 555 0123",
      "tool.phoneHint": "Enter your number without the country code. If you paste one starting with “+”, we detect the country for you.",
      "tool.msgLabel": "Pre-filled message <span class=\"opt\">(optional)</span>",
      "tool.fmtLabel": "Text formatting",
      "tool.fmtBold": "Bold",
      "tool.fmtItalic": "Italic",
      "tool.fmtStrike": "Strikethrough",
      "tool.fmtMono": "Monospace",
      "tool.fmtBoldBtn": "<b>B</b>",
      "tool.fmtItalicBtn": "<i>I</i>",
      "tool.fmtStrikeBtn": "<s>S</s>",
      "tool.msgPh": "Hi 👋 I found you on your website and I'd like more information.",
      "tool.chips": "Quick templates",
      "tool.chip1": "Information",
      "tool.chip2": "Booking",
      "tool.chip3": "Order",
      "tool.chip4": "Quote",
      "tool.tpl1": "Hi 👋 I'd like more information about your services.",
      "tool.tpl2": "Hi! I'd like to book a table for ___ people on ___ at ___.",
      "tool.tpl3": "Hi, I'm interested in this product I saw on Instagram: ___ Is it still available?",
      "tool.tpl4": "Hi, I'd like a quote to automate ___ in my business.",
      "tool.generate": "Generate link & QR",
      "tool.privacy": "🔒 100% private: your number, message and logo are processed on your device and never sent to any server.",
      "tool.step2": "Your WhatsApp link",
      "tool.linkAria": "Generated link",
      "tool.copy": "Copy link",
      "tool.test": "Test link ↗",
      "tool.step3": "Customize your WhatsApp QR code",
      "tool.qrAria": "Generated QR code",
      "tool.fg": "Foreground color",
      "tool.bg": "Background color",
      "tool.fgHex": "Foreground color in hex",
      "tool.bgHex": "Background color in hex",
      "tool.swatches": "Quick color combos",
      "tool.sw1": "Dark green on white",
      "tool.sw2": "Green on white",
      "tool.sw3": "Black on white",
      "tool.sw4": "Dark green on light green",
      "tool.sw5": "Navy on gray",
      "tool.shape": "Dot shape",
      "tool.sq": "<span class=\"g\">▪ </span>Square",
      "tool.rd": "<span class=\"g\">◆ </span>Rounded",
      "tool.dt": "<span class=\"g\">● </span>Dots",
      "tool.center": "Center image",
      "tool.cNone": "None",
      "tool.cChat": "Chat icon",
      "tool.cCustom": "My logo…",
      "tool.logoHint": "With a center image we switch to maximum error correction so the code still scans.",
      "tool.pngSize": "PNG size",
      "tool.s2048": "2048 px (high)",
      "tool.s4096": "4096 px (print)",
      "tool.dlPng": "⬇ Download PNG",
      "tool.dlSvg": "⬇ Download SVG",
      "pv.aria": "Preview",
      "pv.chatAria": "Chat preview",
      "pv.online": "online",
      "pv.today": "Today",
      "pv.sys": "Messages and calls are protected. Simulated preview.",
      "pv.empty": "No message: the chat will open empty and your customer can type anything.",
      "pv.input": "Message",
      "pv.cap": "This is how your customer will see it: the message appears already typed, they just tap send.",
      "how.title": "How to create a WhatsApp link in 3 simple steps",
      "how.s1t": "1. Enter your number",
      "how.s1p": "Pick your country from the flag dropdown and type your WhatsApp number. The international calling code is added automatically, with no spaces or symbols.",
      "how.s2t": "2. Write the message",
      "how.s2p": "Write the text your customers will start the conversation with. The live preview shows exactly how it will look in the chat, bold text and emojis included.",
      "how.s3t": "3. Copy the link and download your QR",
      "how.s3p": "Click generate: copy your wa.me link in one click, customize the QR code with your colors and logo, and download it as a high-quality PNG or SVG.",
      "cases.title": "Use cases for a WhatsApp link with a message",
      "cases.lead": "A WhatsApp link with a pre-filled message removes friction: customers don't need to save your number or think about what to write. Here's how different businesses use it:",
      "cases.c1t": "Tech and automation agencies",
      "cases.c1p": "Add the link to your website, ads and sales proposals with a message like “I want to automate my customer support”. The pre-filled text tells you which campaign each lead came from and lets your chatbots or CRM workflows qualify it instantly.",
      "cases.c2t": "Restaurants and bars",
      "cases.c2p": "Print a custom WhatsApp QR code on tables, menus and windows to take bookings and takeaway orders without phone calls. With a message like “I'd like to book a table for ___ people”, requests arrive organized and with the details you need.",
      "cases.c3t": "Instagram shops",
      "cases.c3p": "Put the link in your bio, in Stories with the link sticker and in product posts. A message like “I'm interested in this product, is it still available?” turns followers into sales conversations in a single tap.",
      "cases.c4t": "Business cards",
      "cases.c4p": "Add the SVG QR code to your business card, flyers or printed signature: scanning it opens a chat with you with a greeting already typed. For small cards, keep the message short and the code stays sharp and easy to scan.",
      "seo.title": "What is a wa.me link and why use a generator?",
      "seo.p1": "WhatsApp offers an official short link format, <strong>wa.me</strong>, that opens a chat with a specific number directly. The structure is simple: <code>https://wa.me/</code> followed by the number in international format (country code and number, digits only) and, optionally, <code>?text=</code> with the message encoded so it works inside a URL.",
      "seo.p2": "Building it by hand leads to easy mistakes: leaving the “+” or leading zeros, forgetting the country code, or typing accents, spaces and emojis without encoding them. This <strong>WhatsApp link generator with message</strong> handles everything: it cleans the number, encodes the text correctly and shows you the result before you share it.",
      "seo.h3a": "Tips to make sure your custom WhatsApp QR code always scans",
      "seo.p3": "Always use a dark foreground on a light background: QR readers rely on contrast, and inverted or pastel codes can fail on older phones. If you add your logo, the tool automatically switches to maximum error correction. For print, download the SVG (vector, no quality loss) and don't print it smaller than 2 × 2 cm (about 0.8 in); long messages create denser codes that should be printed larger. Always test the code with your phone before sending it to print.",
      "seo.h3b": "Text formatting in the message",
      "seo.p4": "WhatsApp supports basic formatting and keeps it in pre-filled messages: <code>*bold*</code>, <code>_italic_</code>, <code>~strikethrough~</code> and <code>```monospace```</code>. Use the editor's formatting buttons and you'll see the result in the preview instantly.",
      "faq.title": "Frequently asked questions",
      "faq.q1": "How do I create a WhatsApp link with a message?",
      "faq.a1": "Choose your country, enter your number without the country code and write the message your customers will see. Click “Generate link & QR” and you'll get a wa.me link ready to copy, with the text already included.",
      "faq.q2": "Is this WhatsApp link generator with message free?",
      "faq.a2": "Yes. You can create as many links and QR codes as you want, with no sign-up and no limits. wa.me links never expire.",
      "faq.q3": "Does the WhatsApp QR code expire?",
      "faq.a3": "No. The QR code contains your wa.me link directly, with no redirects in between, so it will work as long as your number is active on WhatsApp.",
      "faq.q4": "Can I add my logo to a custom WhatsApp QR code?",
      "faq.a4": "Yes. You can add a chat icon or upload your own logo (PNG, JPG or SVG). The tool automatically increases the code's error correction so it keeps scanning reliably.",
      "faq.q5": "Does it work with WhatsApp Business?",
      "faq.a5": "Yes. wa.me links work the same for personal accounts and WhatsApp Business: the chat opens with your number and the message already typed.",
      "faq.q6": "Is my data stored on any server?",
      "faq.a6": "No. The link and the QR code are generated in your own browser. Your number, message and logo are never sent to or stored on any server.",
      "faq.q7": "Which QR format should I download, PNG or SVG?",
      "faq.a7": "PNG is ideal for social media, websites and documents. SVG is a vector format that scales without losing quality, perfect for print, business cards, posters and vinyl.",
      "faq.q8": "Why won't my QR code scan?",
      "faq.a8": "The most common causes are low color contrast, a foreground lighter than the background, a print size that's too small or a very long message. Use a dark color on a light background and print it at least 2 × 2 cm (about 0.8 in).",
      "footer.tagline": "<b>EnlaceChat</b> · Create a WhatsApp link with a message and a custom WhatsApp QR code, free.",
      "footer.legalAria": "Legal",
      "footer.privacy": "Privacy & cookies",
      "footer.privacyHref": "privacy.html",
      "footer.legal": "Legal notice",
      "footer.legalHref": "legal-notice.html",
      "footer.tm": "WhatsApp is a registered trademark of Meta Platforms, Inc. EnlaceChat is an independent tool and is not affiliated with, sponsored or endorsed by WhatsApp or Meta.",
      "popup.close": "Close",
      "popup.done": "Done!",
      "popup.continue": "Close and continue",
      "js.noCountry": "No country found",
      "js.ccAria": "Country: {name} ({dial}). Change country",
      "js.detected": "Country detected: {name}.",
      "js.zero": "We removed the leading 0: it isn't used in international format.",
      "js.double": "Did you type the {dial} code twice? You don't need to include it in the number.",
      "js.ar": "Argentina mobiles: add a 9 before the area code and drop the 15 (e.g. 9 11 2345 6789).",
      "js.mx": "Mexico no longer needs the 1 after +52: use just the 10 digits.",
      "js.yourNumber": "Your number",
      "js.errEmpty": "Enter your WhatsApp number to generate the link.",
      "js.errInvalid": "That number doesn't look valid. Check the country and that it has all its digits (without the country code).",
      "js.genDone": "Link & QR updated ✓",
      "js.linkMeta": "Official wa.me link · {n} characters",
      "js.densLow": "Low density: great even for small business cards.",
      "js.densMid": "Medium density: print it at 2.5 cm (1 in) or larger.",
      "js.densHigh": "High density (long message): print it at 3.5 cm (1.4 in) or larger, or shorten the message.",
      "js.modules": "({n}×{n} modules)",
      "js.logoDropped": "Very long message: we removed the center image so the code fits.",
      "js.tooLong": "The message is too long for a QR code. Please shorten it a bit.",
      "js.qrAria": "QR code for {link}",
      "js.inverted": "⚠ Inverted colors: many readers need a dark code on a light background. Try swapping them.",
      "js.lowContrast": "⚠ Low contrast ({ratio}:1). Darken the foreground or lighten the background so it scans well.",
      "js.logoAdded": "Logo “{name}” added. Click “My logo…” again to change it.",
      "js.tooBig": "The image is larger than 5 MB. Try a lighter one.",
      "js.readFail": "We couldn't read that image. Use PNG, JPG or SVG.",
      "js.qrFail": "Couldn't create the QR code: shorten the message.",
      "js.pngToast": "Downloading {px} px PNG",
      "js.pngPopup": "Your PNG QR code is downloading.",
      "js.pngFail": "We couldn't create the PNG. Try the SVG or another logo.",
      "js.svgToast": "Downloading vector SVG",
      "js.svgPopup": "Your SVG QR code is downloading.",
      "js.copied": "✓ Copied",
      "js.copyPopup": "Link copied to clipboard.",
      "js.loadFail": "The tool couldn't load. Please reload the page.",
      "js.decimal": "."
    }
  };
  /*DICT-END*/

  var LANGS = ["es", "en"];
  var PAGES = { es: "./", en: "en.html" };
  var STORE_KEY = "enlacechat-lang";
  var BOT = /bot|crawl|spider|slurp|lighthouse|preview|facebookexternalhit|whatsapp/i;

  var root = document.documentElement;
  var pageLang = root.getAttribute("data-page-lang") || "es";
  var current = LANGS.indexOf(root.lang) > -1 ? root.lang : pageLang;

  function base() { return B.siteUrl || ""; }

  function t(key, vars) {
    var d = DICT[current] || DICT.es;
    var s = d[key];
    if (s == null) s = DICT.es[key];
    if (s == null) return key;
    s = s.replace(/\{base\}/g, base());
    if (vars) s = s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
    return s;
  }

  function jsonld(kind) {
    if (kind === "app") {
      return {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": t("ld.appName"),
        "url": t("meta.canonical"),
        "description": t("ld.appDesc"),
        "applicationCategory": "BusinessApplication",
        "operatingSystem": t("ld.os"),
        "inLanguage": current,
        "isAccessibleForFree": true,
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" }
      };
    }
    var items = [];
    for (var i = 1; DICT.es["faq.q" + i]; i++) {
      items.push({
        "@type": "Question",
        "name": t("faq.q" + i),
        "acceptedAnswer": { "@type": "Answer", "text": t("faq.a" + i) }
      });
    }
    return { "@context": "https://schema.org", "@type": "FAQPage", "inLanguage": current, "mainEntity": items };
  }

  function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }

  function apply() {
    root.lang = current;
    each("[data-i18n]", function (el) { el.textContent = t(el.getAttribute("data-i18n")); });
    each("[data-i18n-html]", function (el) { el.innerHTML = t(el.getAttribute("data-i18n-html")); });
    each("[data-i18n-attr]", function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var p = pair.split(":");
        if (p.length === 2) el.setAttribute(p[0].trim(), t(p[1].trim()));
      });
    });
    each("script[data-i18n-jsonld]", function (el) {
      el.textContent = JSON.stringify(jsonld(el.getAttribute("data-i18n-jsonld")), null, 2);
    });
    each("[data-lang]", function (a) {
      if (a.getAttribute("data-lang") === current) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }

  function syncUrl() {
    if (!window.history || !history.replaceState || location.protocol === "file:") return;
    try {
      var target = new URL(PAGES[current], location.href);
      target.hash = location.hash;
      if (target.pathname !== location.pathname) history.replaceState(null, "", target.href);
    } catch (e) { /* navegador antiguo: el idioma cambia igual, solo no se toca la URL */ }
  }

  function setLang(lang, opts) {
    opts = opts || {};
    if (LANGS.indexOf(lang) < 0) return;
    var changed = lang !== current;
    current = lang;
    apply();
    syncUrl();
    if (opts.remember) {
      try { localStorage.setItem(STORE_KEY, lang); } catch (e) { /* modo privado */ }
    }
    if (changed || opts.force) {
      document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: lang } }));
    }
  }

  function initialLang() {
    var stored = null;
    try { stored = localStorage.getItem(STORE_KEY); } catch (e) { /* sin almacenamiento */ }
    if (LANGS.indexOf(stored) > -1) return stored;
    if (pageLang !== "es" || BOT.test(navigator.userAgent || "")) return pageLang;
    var first = (navigator.languages && navigator.languages[0]) || navigator.language || "";
    return /^en\b/i.test(first) ? "en" : "es";
  }

  B.i18n = {
    dict: DICT,
    t: t,
    set: setLang,
    lang: function () { return current; }
  };
  B.t = t;

  // Botones ES / EN: cambian al instante; si no hay JavaScript son enlaces normales.
  each("[data-lang]", function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      setLang(a.getAttribute("data-lang"), { remember: true });
    });
  });

  var start = initialLang();
  if (start !== current) setLang(start);
})();

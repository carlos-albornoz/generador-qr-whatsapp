/*!
 * manifest.js — datos de marca y ajustes del propietario.
 * Es el único sitio que necesitas tocar para cambiar estos valores.
 */
(function () {
  "use strict";
  var B = (window.__BRAND__ = window.__BRAND__ || {});
  B.name = "EnlaceChat";
  // TODO: cambia por la dirección real de tu web cuando la publiques
  B.siteUrl = "https://TU-USUARIO.github.io/TU-REPOSITORIO/";
  // País por defecto si no se puede deducir del idioma del navegador
  B.defaultCountry = "ES";
  // Ventana de anuncio al copiar/descargar: segundos mínimos entre dos apariciones
  // (0 = aparece en cada clic, como se pidió).
  B.popupCooldownSeconds = 0;
  // Límite de caracteres del mensaje (los mensajes largos generan QR muy densos)
  B.maxMessage = 1000;
})();

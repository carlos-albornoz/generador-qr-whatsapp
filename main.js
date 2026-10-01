/*!
 * main.js — EnlaceChat: generador de enlaces de WhatsApp con mensaje + QR.
 * Todo ocurre en el navegador del visitante: nada se envía a ningún servidor.
 */
(function () {
  "use strict";
  var B = window.__BRAND__ || {};
  var MAX_MSG = B.maxMessage || 1000;
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(id) { return document.getElementById(id); }
  function safe(name, fn) {
    try { fn(); } catch (e) { console.error("[EnlaceChat] " + name, e); }
  }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function debounce(fn, ms) {
    var t; return function () { clearTimeout(t); t = setTimeout(fn, ms); };
  }

  var state = {
    country: null,
    generated: false,
    style: "rounded",
    logoMode: "chat",
    customLogo: null, // { href, raster }
    fg: "#0b3d33",
    bg: "#ffffff",
    link: "",
    full: ""
  };

  // Icono genérico de chat (diseño propio) para el centro del QR
  var CHAT_ICON = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 100 100">' +
    '<circle cx="50" cy="50" r="48" fill="#25D366"/>' +
    '<path d="M26 35a9 9 0 0 1 9-9h30a9 9 0 0 1 9 9v19a9 9 0 0 1-9 9H47L33 74V62.6A9 9 0 0 1 26 54z" fill="#fff"/>' +
    '<circle cx="39" cy="44.5" r="4.2" fill="#25D366"/><circle cx="50" cy="44.5" r="4.2" fill="#25D366"/>' +
    '<circle cx="61" cy="44.5" r="4.2" fill="#25D366"/></svg>');

  /* =========================================================
     Banderas: emoji si el sistema las pinta, si no un distintivo con el código
     ========================================================= */
  var flagsOK = (function () {
    try {
      var c = document.createElement("canvas"); c.width = c.height = 32;
      var x = c.getContext("2d");
      x.textBaseline = "top"; x.font = "28px sans-serif";
      x.fillText("\uD83C\uDDEA\uD83C\uDDF8", 0, 0);
      var d = x.getImageData(0, 0, 32, 32).data;
      for (var i = 0; i < d.length; i += 4) {
        if (d[i + 3] > 0 && Math.max(d[i], d[i + 1], d[i + 2]) - Math.min(d[i], d[i + 1], d[i + 2]) > 60) return true;
      }
    } catch (e) { /* sin canvas */ }
    return false;
  })();
  function flagEmoji(iso) {
    return String.fromCodePoint(0x1f1e6 + iso.charCodeAt(0) - 65, 0x1f1e6 + iso.charCodeAt(1) - 65);
  }
  function flagHTML(iso) {
    return flagsOK ? flagEmoji(iso) : '<span class="flag-code">' + iso + "</span>";
  }
  function fmtDial(d) {
    return (d.length === 4 && d.charAt(0) === "1") ? "+1 " + d.slice(1) : "+" + d;
  }

  /* =========================================================
     Selector de país
     ========================================================= */
  var countries = B.countries || [];
  var byIso = {};
  countries.forEach(function (c) { byIso[c.iso] = c; });
  var sorted = countries.slice().sort(function (a, b) { return a.name.localeCompare(b.name, "es"); });

  function norm(s) {
    return String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function guessCountry() {
    var langs = navigator.languages || [navigator.language || ""];
    for (var i = 0; i < langs.length; i++) {
      var m = /[-_]([A-Za-z]{2})$/.exec(langs[i] || "");
      if (m && byIso[m[1].toUpperCase()]) return m[1].toUpperCase();
    }
    return byIso[B.defaultCountry] ? B.defaultCountry : "ES";
  }

  function initCountryPicker() {
    var btn = $("ccBtn"), panel = $("ccPanel"), search = $("ccSearch"), list = $("ccList"), wrap = $("cc");
    var active = -1;

    function items() { return Array.prototype.slice.call(list.querySelectorAll("li[data-iso]")); }

    function render(q) {
      var nq = norm(q || "").replace(/^\+/, "").replace(/\s/g, "");
      var html = "";
      function row(c) {
        var sel = state.country && state.country.iso === c.iso;
        return '<li role="option" data-iso="' + c.iso + '" aria-selected="' + sel + '">' +
          '<span class="f">' + flagHTML(c.iso) + '</span><span class="n">' + esc(c.name) + '</span><span class="d">' + fmtDial(c.dial) + "</span></li>";
      }
      if (!nq) {
        (B.pinnedCountries || []).forEach(function (iso) { if (byIso[iso]) html += row(byIso[iso]); });
        html += '<li class="sep" role="separator" aria-hidden="true"></li>';
        sorted.forEach(function (c) { html += row(c); });
      } else {
        var hits = sorted.filter(function (c) {
          return norm(c.name).indexOf(nq) > -1 || c.iso.toLowerCase() === nq || c.dial.indexOf(nq) === 0;
        });
        hits.forEach(function (c) { html += row(c); });
        if (!hits.length) html = '<li class="none">No encontramos ese país</li>';
      }
      list.innerHTML = html;
      active = -1;
    }

    function open() {
      panel.hidden = false;
      btn.setAttribute("aria-expanded", "true");
      search.value = "";
      render("");
      var sel = list.querySelector('li[aria-selected="true"]');
      if (sel) list.scrollTop = sel.offsetTop - 60;
      setTimeout(function () { search.focus(); }, 0);
    }
    function close(focusBtn) {
      panel.hidden = true;
      btn.setAttribute("aria-expanded", "false");
      if (focusBtn) btn.focus();
    }
    function setActive(i) {
      var it = items();
      if (!it.length) return;
      active = (i + it.length) % it.length;
      it.forEach(function (li, k) { li.classList.toggle("is-active", k === active); });
      it[active].scrollIntoView({ block: "nearest" });
    }

    btn.addEventListener("click", function () { panel.hidden ? open() : close(true); });
    search.addEventListener("input", function () { render(search.value); if (search.value) setActive(0); });
    search.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); setActive(active + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive(active - 1); }
      else if (e.key === "Enter") {
        e.preventDefault();
        var it = items()[active < 0 ? 0 : active];
        if (it) { selectCountry(it.getAttribute("data-iso")); close(false); $("phone").focus(); }
      } else if (e.key === "Escape") { close(true); }
    });
    list.addEventListener("click", function (e) {
      var li = e.target.closest("li[data-iso]");
      if (!li) return;
      selectCountry(li.getAttribute("data-iso"));
      close(false);
      $("phone").focus();
    });
    document.addEventListener("click", function (e) { if (!panel.hidden && !wrap.contains(e.target)) close(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) close(true); });

    selectCountry(guessCountry(), true);
  }

  function selectCountry(iso, silent) {
    var c = byIso[iso];
    if (!c) return;
    // Si el usuario elige país a mano y el número llevaba «+prefijo», lo pasamos a número local
    var ph = $("phone");
    if (!silent && /^\s*(\+|00)/.test(ph.value)) {
      var dg = ph.value.replace(/\D/g, "").replace(/^00/, "");
      var old = state.country;
      ph.value = (old && dg.indexOf(old.dial) === 0) ? dg.slice(old.dial.length) : dg;
    }
    state.country = c;
    $("ccFlag").innerHTML = flagHTML(c.iso);
    $("ccDial").textContent = fmtDial(c.dial);
    $("ccBtn").setAttribute("aria-label", "País: " + c.name + " (" + fmtDial(c.dial) + "). Cambiar país");
    if (!silent) onInput();
  }

  function detectCountry(digits) {
    for (var len = 4; len >= 1; len--) {
      var pre = digits.slice(0, len);
      var hits = countries.filter(function (c) { return c.dial === pre; });
      if (!hits.length) continue;
      if (state.country && hits.some(function (h) { return h.iso === state.country.iso; })) return state.country;
      var pref = (B.preferredForDial || {})[pre];
      return (pref && byIso[pref]) || hits[0];
    }
    return null;
  }

  /* =========================================================
     Número de teléfono
     ========================================================= */
  function parsePhone() {
    var raw = $("phone").value.trim();
    var digits = raw.replace(/\D/g, "");
    var notes = [], full, local, c = state.country;
    if (!digits) return { empty: true, valid: false, notes: notes };

    if (/^(\+|00)/.test(raw)) {
      if (/^00/.test(raw)) digits = digits.replace(/^00/, "");
      var det = detectCountry(digits);
      if (det && det !== state.country) { selectCountry(det.iso, true); notes.push("País detectado: " + det.name + "."); }
      c = state.country;
      full = digits;
      local = det ? digits.slice(det.dial.length) : digits;
    } else {
      local = digits;
      if (/^0/.test(local) && local.length > 1 && ["IT", "SM"].indexOf(c.iso) < 0) {
        local = local.replace(/^0+/, "");
        notes.push("Hemos quitado el 0 inicial: no se usa en formato internacional.");
      }
      full = c.dial + local;
      if (local.indexOf(c.dial) === 0 && full.length > 13) {
        notes.push("¿Has escrito el prefijo " + fmtDial(c.dial) + " dos veces? No hace falta incluirlo en el número.");
      }
    }
    if (c.iso === "AR" && local && local.charAt(0) !== "9") {
      notes.push("Móviles de Argentina: añade un 9 antes del código de área y quita el 15 (ej.: 9 11 2345 6789).");
    }
    if (c.iso === "MX" && local.length === 11 && local.charAt(0) === "1") {
      notes.push("En México ya no hace falta el 1 después del +52: usa solo los 10 dígitos.");
    }
    var valid = local.length >= 4 && full.length >= 8 && full.length <= 15;
    return { empty: false, valid: valid, full: full, local: local, notes: notes };
  }

  function prettyNumber(p) {
    if (!p || p.empty) return "Tu número";
    var c = state.country, d = p.local || "", out = [];
    if (d.length === 8) out = [d.slice(0, 4), d.slice(4)];
    else {
      while (d.length > 4) { out.push(d.slice(0, 3)); d = d.slice(3); }
      if (d) out.push(d);
    }
    return fmtDial(c.dial) + " " + out.join(" ");
  }

  /* =========================================================
     Mensaje + vista previa
     ========================================================= */
  function waFormat(text) {
    var s = esc(text);
    s = s.replace(/```([\s\S]+?)```/g, "<code>$1</code>");
    s = s.replace(/\*([^\s*](?:[^*\n]*[^\s*])?)\*/g, "<strong>$1</strong>");
    s = s.replace(/(^|[^\w])_([^\s_](?:[^_\n]*[^\s_])?)_(?![\w])/g, "$1<em>$2</em>");
    s = s.replace(/~([^\s~](?:[^~\n]*[^\s~])?)~/g, "<s>$1</s>");
    return s;
  }
  function nowHM() {
    var d = new Date();
    return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
  }
  function cleanMessage() { return $("message").value.replace(/\s+$/, ""); }

  function renderPreview(p) {
    var msg = cleanMessage();
    $("pvName").textContent = prettyNumber(p);
    $("pvTime").textContent = nowHM();
    var has = msg.trim().length > 0;
    $("pvBubble").hidden = !has;
    $("pvEmpty").hidden = has;
    if (has) $("pvText").innerHTML = waFormat(msg);
    var chat = $("pvChat");
    chat.scrollTop = chat.scrollHeight;
    var n = $("message").value.length, ctr = $("counter");
    ctr.textContent = n + " / " + MAX_MSG;
    ctr.classList.toggle("is-high", n > 300);
  }

  function showNotes(p) {
    var hint = $("phoneHint");
    if (p.notes && p.notes.length) {
      hint.textContent = p.notes.join(" ");
      hint.classList.add("is-alert");
    } else {
      hint.textContent = "Escribe tu número sin el prefijo del país. Si pegas uno con «+», detectamos el país solos.";
      hint.classList.remove("is-alert");
    }
  }

  function buildLink(p) {
    var msg = cleanMessage();
    return "https://wa.me/" + p.full + (msg.trim() ? "?text=" + encodeURIComponent(msg) : "");
  }

  function onInput() {
    var p = parsePhone();
    showNotes(p);
    renderPreview(p);
    if (p.valid) {
      $("phone").classList.remove("is-invalid");
      $("formError").hidden = true;
    }
    if (state.generated && p.valid) {
      updateResult(p);
    }
  }

  function initMessage() {
    var ta = $("message");
    ta.maxLength = MAX_MSG;
    ta.addEventListener("input", onInput);
    $("phone").addEventListener("input", onInput);
    $("phone").addEventListener("keydown", function (e) { if (e.key === "Enter") generate(); });

    Array.prototype.forEach.call(document.querySelectorAll(".fmt button"), function (b) {
      b.addEventListener("click", function () {
        var mk = b.getAttribute("data-wrap"), s = ta.selectionStart, e = ta.selectionEnd, v = ta.value;
        var sel = v.slice(s, e);
        var lead = sel.match(/^\s*/)[0], trail = sel.match(/\s*$/)[0], core = sel.trim();
        var ins = lead + mk + core + mk + trail;
        if (v.length - sel.length + ins.length > MAX_MSG) return;
        ta.value = v.slice(0, s) + ins + v.slice(e);
        var cur = core ? s + ins.length : s + lead.length + mk.length;
        ta.focus();
        ta.setSelectionRange(cur, cur);
        onInput();
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll(".chip"), function (c) {
      c.addEventListener("click", function () {
        ta.value = c.getAttribute("data-tpl");
        ta.focus();
        var i = ta.value.indexOf("___");
        if (i > -1) ta.setSelectionRange(i, i + 3);
        onInput();
      });
    });
  }

  /* =========================================================
     Generar
     ========================================================= */
  function generate() {
    var p = parsePhone();
    var err = $("formError");
    if (!p.valid) {
      err.textContent = p.empty
        ? "Escribe tu número de WhatsApp para generar el enlace."
        : "Ese número no parece válido. Revisa el país y que tenga todos los dígitos (sin el prefijo).";
      err.hidden = false;
      $("phone").classList.add("is-invalid");
      $("phone").focus();
      return;
    }
    err.hidden = true;
    var first = !state.generated;
    state.generated = true;
    $("resultCard").hidden = false;
    updateResult(p, true);
    var gb = $("generateBtn");
    gb.lastChild.textContent = " Enlace y QR actualizados ✓";
    setTimeout(function () { gb.lastChild.textContent = " Generar enlace y QR"; }, 1800);
    if (first || window.innerWidth < 1000) {
      $("resultCard").scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    }
  }

  function updateResult(p, immediate) {
    state.full = p.full;
    state.link = buildLink(p);
    $("linkOut").value = state.link;
    $("testLink").href = state.link;
    $("linkLen").textContent = "Enlace oficial wa.me · " + state.link.length + " caracteres";
    immediate ? renderQR() : renderQRSoon();
  }

  /* =========================================================
     QR
     ========================================================= */
  function currentScene() {
    var logo = null, raster = null;
    if (state.logoMode === "chat") logo = CHAT_ICON;
    else if (state.logoMode === "custom" && state.customLogo) { logo = state.customLogo.href; raster = state.customLogo.raster; }
    var qr, dropped = false;
    try {
      qr = B.qr.encode(state.link, logo ? "H" : "M");
    } catch (e) {
      // Mensaje muy largo: sin imagen central cabe mucho más texto
      if (logo) { logo = raster = null; dropped = true; }
      try { qr = B.qr.encode(state.link, "M"); } catch (e2) { qr = B.qr.encode(state.link, "L"); }
    }
    var sc = B.qrRender.scene(qr, { fg: state.fg, bg: state.bg, style: state.style, logo: logo, logoRaster: raster });
    sc.logoDropped = dropped;
    return sc;
  }

  function renderQR() {
    if (!state.link) return;
    var box = $("qrBox");
    try {
      var sc = currentScene();
      box.innerHTML = B.qrRender.toSVG(sc);
      var v = sc.version, mods = v * 4 + 17, txt;
      if (v <= 6) txt = "Densidad baja: ideal incluso para tarjetas pequeñas.";
      else if (v <= 12) txt = "Densidad media: imprímelo a 2,5 cm o más.";
      else txt = "Densidad alta (mensaje largo): imprímelo a 3,5 cm o más, o acorta el mensaje.";
      if (sc.logoDropped) txt = "Mensaje muy largo: hemos quitado la imagen central para que el código quepa. " + txt;
      $("qrInfo").textContent = txt + " (" + mods + "×" + mods + " módulos)";
      box.setAttribute("aria-label", "Código QR de " + state.link);
    } catch (e) {
      box.innerHTML = "";
      $("qrInfo").textContent = "El mensaje es demasiado largo para un código QR. Acórtalo un poco.";
      console.error("[EnlaceChat] QR", e);
    }
    checkContrast();
  }
  var renderQRSoon = debounce(renderQR, 120);

  function lum(hex) {
    var n = parseInt(hex.slice(1), 16), rgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    var l = rgb.map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2];
  }
  function checkContrast() {
    var lf = lum(state.fg), lb = lum(state.bg), w = $("contrastWarn");
    var ratio = (Math.max(lf, lb) + 0.05) / (Math.min(lf, lb) + 0.05);
    if (lf > lb) {
      w.textContent = "⚠ Colores invertidos: muchos lectores necesitan el código oscuro sobre fondo claro. Prueba a intercambiarlos.";
      w.hidden = false;
    } else if (ratio < 3.5) {
      w.textContent = "⚠ Contraste bajo (" + ratio.toFixed(1) + ":1). Oscurece el color frontal o aclara el fondo para que se escanee bien.";
      w.hidden = false;
    } else {
      w.hidden = true;
    }
  }

  function normHex(v) {
    v = v.trim().replace(/^#?/, "#");
    if (/^#[0-9a-f]{3}$/i.test(v)) v = "#" + v[1] + v[1] + v[2] + v[2] + v[3] + v[3];
    return /^#[0-9a-f]{6}$/i.test(v) ? v.toLowerCase() : null;
  }

  function setColors(fg, bg) {
    if (fg) { state.fg = fg; $("fgColor").value = fg; $("fgHex").value = fg; }
    if (bg) { state.bg = bg; $("bgColor").value = bg; $("bgHex").value = bg; }
    renderQRSoon();
  }

  function setSeg(id, val) {
    Array.prototype.forEach.call($(id).querySelectorAll("button"), function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-val") === val));
    });
  }

  function readLogo(file) {
    return new Promise(function (resolve, reject) {
      if (!file) return reject(new Error("NO_FILE"));
      if (file.size > 5 * 1024 * 1024) return reject(new Error("TOO_BIG"));
      var isSvg = file.type === "image/svg+xml" || /\.svg$/i.test(file.name);
      var fr = new FileReader();
      fr.onerror = function () { reject(new Error("READ")); };
      fr.onload = function () {
        var href = fr.result;
        var img = new Image();
        img.onload = function () {
          var w = img.naturalWidth || 512, h = img.naturalHeight || 512, k = Math.min(1, 512 / Math.max(w, h));
          if (isSvg && (!img.naturalWidth || !img.naturalHeight)) { w = h = 512; k = 1; }
          var c = document.createElement("canvas");
          c.width = Math.max(1, Math.round(w * k)); c.height = Math.max(1, Math.round(h * k));
          c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
          var raster = c.toDataURL("image/png");
          resolve({ href: isSvg ? href : raster, raster: raster });
        };
        img.onerror = function () { reject(new Error("DECODE")); };
        img.src = href;
      };
      fr.readAsDataURL(file);
    });
  }

  function initQRControls() {
    $("fgColor").addEventListener("input", function () { setColors(this.value.toLowerCase(), null); });
    $("bgColor").addEventListener("input", function () { setColors(null, this.value.toLowerCase()); });
    $("fgHex").addEventListener("input", function () { var h = normHex(this.value); if (h) { state.fg = h; $("fgColor").value = h; renderQRSoon(); } });
    $("bgHex").addEventListener("input", function () { var h = normHex(this.value); if (h) { state.bg = h; $("bgColor").value = h; renderQRSoon(); } });
    $("fgHex").addEventListener("blur", function () { this.value = state.fg; });
    $("bgHex").addEventListener("blur", function () { this.value = state.bg; });

    Array.prototype.forEach.call(document.querySelectorAll(".sw"), function (s) {
      s.addEventListener("click", function () { setColors(s.getAttribute("data-fg"), s.getAttribute("data-bg")); });
    });

    $("styleSeg").addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      state.style = b.getAttribute("data-val");
      setSeg("styleSeg", state.style);
      renderQRSoon();
    });

    var file = $("logoFile");
    $("logoSeg").addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      var v = b.getAttribute("data-val");
      if (v === "custom") { file.value = ""; file.click(); return; }
      state.logoMode = v;
      setSeg("logoSeg", v);
      renderQRSoon();
    });
    file.addEventListener("change", function () {
      var f = file.files && file.files[0];
      if (!f) return;
      readLogo(f).then(function (logo) {
        state.customLogo = logo;
        state.logoMode = "custom";
        setSeg("logoSeg", "custom");
        $("logoHint").textContent = "Logo «" + f.name + "» añadido. Pulsa «Mi logo…» otra vez para cambiarlo.";
        renderQR();
      }).catch(function (err) {
        toast(err.message === "TOO_BIG" ? "La imagen supera 5 MB. Prueba con una más ligera." : "No hemos podido leer esa imagen. Usa PNG, JPG o SVG.");
      });
    });

    $("dlPng").addEventListener("click", downloadPNG);
    $("dlSvg").addEventListener("click", downloadSVG);
    $("copyBtn").addEventListener("click", copyLink);
    $("generateBtn").addEventListener("click", generate);
  }

  /* =========================================================
     Copiar y descargar
     ========================================================= */
  function saveBlob(blob, name) {
    var url = URL.createObjectURL(blob), a = document.createElement("a");
    a.href = url; a.download = name; a.rel = "noopener";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
  }
  function fileBase() { return "qr-whatsapp-" + (state.full || "enlace"); }

  function downloadPNG() {
    if (!state.link) return;
    var px = parseInt($("pngSize").value, 10) || 1024, btn = $("dlPng");
    btn.disabled = true;
    var sc;
    try { sc = currentScene(); } catch (e) { btn.disabled = false; toast("No se pudo crear el QR: acorta el mensaje."); return; }
    B.qrRender.toPNG(sc, px).then(function (blob) {
      saveBlob(blob, fileBase() + ".png");
      toast("Descargando PNG de " + px + " px");
      afterAction("Tu código QR en PNG se está descargando.");
    }).catch(function () {
      toast("No hemos podido crear el PNG. Prueba con el SVG o con otro logo.");
    }).then(function () { btn.disabled = false; });
  }

  function downloadSVG() {
    if (!state.link) return;
    var sc;
    try { sc = currentScene(); } catch (e) { toast("No se pudo crear el QR: acorta el mensaje."); return; }
    var svg = '<?xml version="1.0" encoding="UTF-8"?>\n' + B.qrRender.toSVG(sc, 1024);
    saveBlob(new Blob([svg], { type: "image/svg+xml" }), fileBase() + ".svg");
    toast("Descargando SVG vectorial");
    afterAction("Tu código QR en SVG se está descargando.");
  }

  function copyLink() {
    if (!state.link) return;
    var done = function () {
      var lbl = $("copyLabel"), btn = $("copyBtn");
      lbl.textContent = "✓ Copiado";
      btn.classList.add("is-done");
      setTimeout(function () { lbl.textContent = "Copiar enlace"; btn.classList.remove("is-done"); }, 2000);
      afterAction("Enlace copiado al portapapeles.");
    };
    var fallback = function () {
      var inp = $("linkOut");
      inp.focus(); inp.select();
      try { document.execCommand("copy"); } catch (e) { /* el usuario puede copiarlo a mano */ }
      done();
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(state.link).then(done, fallback);
    } else {
      fallback();
    }
  }

  /* =========================================================
     Pop-up intermedio (se abre DESPUÉS de copiar/descargar, nunca lo bloquea)
     ========================================================= */
  var lastPopup = 0;
  function afterAction(msg) {
    var cool = (B.popupCooldownSeconds || 0) * 1000;
    if (cool && Date.now() - lastPopup < cool) return;
    setTimeout(function () { openPopup(msg); }, 350);
  }
  function openPopup(msg) {
    var d = $("adDialog");
    if (d.open) return;
    lastPopup = Date.now();
    $("adDialogMsg").textContent = msg;
    if (typeof d.showModal === "function") d.showModal(); else d.setAttribute("open", "");
    $("adContinue").focus();
  }
  function closePopup() {
    var d = $("adDialog");
    if (typeof d.close === "function") d.close(); else d.removeAttribute("open");
  }
  function initPopup() {
    var d = $("adDialog");
    $("adClose").addEventListener("click", closePopup);
    $("adContinue").addEventListener("click", closePopup);
    d.addEventListener("click", function (e) {
      if (e.target !== d) return;
      var r = d.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closePopup();
    });
  }

  var toastTimer;
  function toast(msg) {
    var t = $("toast");
    t.textContent = msg;
    t.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("is-on"); }, 2400);
  }

  /* =========================================================
     Arranque
     ========================================================= */
  function boot() {
    if (!B.qr || !B.qrRender || !countries.length) {
      var e = $("formError");
      e.textContent = "No se ha podido cargar la herramienta. Recarga la página.";
      e.hidden = false;
      return;
    }
    safe("countryPicker", initCountryPicker);
    safe("message", initMessage);
    safe("qrControls", initQRControls);
    safe("popup", initPopup);
    safe("preview", function () { renderPreview(parsePhone()); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();

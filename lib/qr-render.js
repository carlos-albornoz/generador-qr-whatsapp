/*!
 * qr-render.js — dibuja un QR con estilo a partir de la matriz de qr-encoder.js.
 * Una sola "escena" alimenta las dos salidas, así SVG y PNG son idénticos:
 *   window.__BRAND__.qrRender.scene(qr, opts) → escena
 *   window.__BRAND__.qrRender.toSVG(escena, px) → string SVG
 *   window.__BRAND__.qrRender.toPNG(escena, px) → Promise<Blob>
 * opts: { fg, bg, style: "square"|"rounded"|"dots", logo: dataURL|null, logoRaster: dataURL|null, margin }
 */
(function () {
  "use strict";
  var B = (window.__BRAND__ = window.__BRAND__ || {});

  function f(n) { return Math.round(n * 1000) / 1000; }

  function rrect(x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    if (r <= 0) return "M" + f(x) + " " + f(y) + "h" + f(w) + "v" + f(h) + "h" + f(-w) + "z";
    return "M" + f(x + r) + " " + f(y) +
      "h" + f(w - 2 * r) + "a" + f(r) + " " + f(r) + " 0 0 1 " + f(r) + " " + f(r) +
      "v" + f(h - 2 * r) + "a" + f(r) + " " + f(r) + " 0 0 1 " + f(-r) + " " + f(r) +
      "h" + f(-(w - 2 * r)) + "a" + f(r) + " " + f(r) + " 0 0 1 " + f(-r) + " " + f(-r) +
      "v" + f(-(h - 2 * r)) + "a" + f(r) + " " + f(r) + " 0 0 1 " + f(r) + " " + f(-r) + "z";
  }
  // rectángulo con radio independiente por esquina (tl, tr, br, bl)
  function cornerRect(x, y, s, tl, tr, br, bl) {
    var d = "M" + f(x + tl) + " " + f(y) + "H" + f(x + s - tr);
    if (tr) d += "A" + tr + " " + tr + " 0 0 1 " + f(x + s) + " " + f(y + tr);
    d += "V" + f(y + s - br);
    if (br) d += "A" + br + " " + br + " 0 0 1 " + f(x + s - br) + " " + f(y + s);
    d += "H" + f(x + bl);
    if (bl) d += "A" + bl + " " + bl + " 0 0 1 " + f(x) + " " + f(y + s - bl);
    d += "V" + f(y + tl);
    if (tl) d += "A" + tl + " " + tl + " 0 0 1 " + f(x + tl) + " " + f(y);
    return d + "Z";
  }
  function circle(cx, cy, r) {
    return "M" + f(cx - r) + " " + f(cy) + "a" + f(r) + " " + f(r) + " 0 1 0 " + f(2 * r) + " 0" +
      "a" + f(r) + " " + f(r) + " 0 1 0 " + f(-2 * r) + " 0z";
  }

  function scene(qr, opts) {
    opts = opts || {};
    var size = qr.size, m = opts.margin == null ? 4 : opts.margin;
    var N = size + 2 * m, style = opts.style || "square";
    var fg = opts.fg || "#000000", bg = opts.bg || "#ffffff";

    // Hueco para el logo central (≈22 % del código, centrado)
    var hole = null;
    if (opts.logo) {
      var L = Math.round(size * 0.22);
      if ((size - L) % 2) L++;
      var start = (size - L) / 2;
      hole = { x0: start - 0.5, y0: start - 0.5, x1: start + L + 0.5, y1: start + L + 0.5, L: L, start: start };
    }
    function inHole(x, y) {
      return hole && x + 1 > hole.x0 && x < hole.x1 && y + 1 > hole.y0 && y < hole.y1;
    }
    function dark(x, y) {
      return x >= 0 && y >= 0 && x < size && y < size && qr.modules[y][x] && !qr.isFinder(x, y) && !inHole(x, y);
    }

    var d = [];
    for (var y = 0; y < size; y++) {
      for (var x = 0; x < size; x++) {
        if (!dark(x, y)) continue;
        var px = x + m, py = y + m;
        if (style === "dots") {
          d.push(circle(px + 0.5, py + 0.5, 0.45));
        } else if (style === "rounded") {
          var t = dark(x, y - 1), b = dark(x, y + 1), l = dark(x - 1, y), r = dark(x + 1, y), R = 0.5;
          d.push(cornerRect(px, py, 1,
            (!t && !l) ? R : 0, (!t && !r) ? R : 0, (!b && !r) ? R : 0, (!b && !l) ? R : 0));
        } else {
          // cuadrados: fusionamos tramos horizontales para menos nodos
          var run = 1;
          while (dark(x + run, y)) run++;
          d.push("M" + px + " " + py + "h" + run + "v1h" + (-run) + "z");
          x += run - 1;
        }
      }
    }

    // Ojos (patrones de posición)
    var eyes = [[0, 0], [size - 7, 0], [0, size - 7]], eyeD = [];
    eyes.forEach(function (p) {
      var ex = p[0] + m, ey = p[1] + m;
      if (style === "square") {
        eyeD.push(rrect(ex, ey, 7, 7, 0) + rrect(ex + 1, ey + 1, 5, 5, 0) + rrect(ex + 2, ey + 2, 3, 3, 0));
      } else if (style === "rounded") {
        eyeD.push(rrect(ex, ey, 7, 7, 2.2) + rrect(ex + 1, ey + 1, 5, 5, 1.4) + rrect(ex + 2, ey + 2, 3, 3, 0.9));
      } else {
        eyeD.push(rrect(ex, ey, 7, 7, 3.5) + rrect(ex + 1, ey + 1, 5, 5, 2.5) + circle(ex + 3.5, ey + 3.5, 1.5));
      }
    });

    var logo = null;
    if (hole) {
      var lx = hole.start + m - 0.25, ls = hole.L + 0.5;
      logo = {
        href: opts.logo,
        raster: opts.logoRaster || null,
        plate: rrect(lx, lx, ls, ls, style === "square" ? 0.6 : 1.4),
        x: lx + ls * 0.1, y: lx + ls * 0.1, s: ls * 0.8
      };
    }

    return {
      N: N, fg: fg, bg: bg, style: style,
      dots: d.join(""), eyes: eyeD.join(""), logo: logo,
      version: qr.version
    };
  }

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;"); }

  function toSVG(sc, px) {
    var seam = sc.style === "dots" ? "" : ' stroke="' + sc.fg + '" stroke-width="0.04" stroke-linejoin="round"';
    var out = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"' +
      (px ? ' width="' + px + '" height="' + px + '"' : "") +
      ' viewBox="0 0 ' + sc.N + " " + sc.N + '" shape-rendering="geometricPrecision">' +
      '<rect width="' + sc.N + '" height="' + sc.N + '" fill="' + sc.bg + '"/>' +
      '<path d="' + sc.dots + '" fill="' + sc.fg + '"' + seam + "/>" +
      '<path d="' + sc.eyes + '" fill="' + sc.fg + '" fill-rule="evenodd"/>';
    if (sc.logo) {
      out += '<path d="' + sc.logo.plate + '" fill="' + sc.bg + '"/>' +
        '<image x="' + f(sc.logo.x) + '" y="' + f(sc.logo.y) + '" width="' + f(sc.logo.s) + '" height="' + f(sc.logo.s) +
        '" preserveAspectRatio="xMidYMid meet" xlink:href="' + esc(sc.logo.href) + '"/>';
    }
    return out + "</svg>";
  }

  function loadImage(src) {
    return new Promise(function (res, rej) {
      var img = new Image();
      img.onload = function () { res(img); };
      img.onerror = function () { rej(new Error("LOGO_LOAD")); };
      img.src = src;
    });
  }

  // PNG dibujado directamente en canvas (más fiable que rasterizar el SVG en Safari)
  function toPNG(sc, px) {
    var c = document.createElement("canvas");
    c.width = c.height = px;
    var ctx = c.getContext("2d");
    var k = px / sc.N;
    ctx.scale(k, k);
    ctx.fillStyle = sc.bg;
    ctx.fillRect(0, 0, sc.N, sc.N);
    ctx.fillStyle = sc.fg;
    var dots = new Path2D(sc.dots);
    ctx.fill(dots);
    if (sc.style !== "dots") {
      ctx.strokeStyle = sc.fg; ctx.lineWidth = 0.04; ctx.lineJoin = "round";
      ctx.stroke(dots);
    }
    ctx.fill(new Path2D(sc.eyes), "evenodd");
    var done = Promise.resolve();
    if (sc.logo) {
      ctx.fillStyle = sc.bg;
      ctx.fill(new Path2D(sc.logo.plate));
      done = loadImage(sc.logo.raster || sc.logo.href).then(function (img) {
        var iw = img.naturalWidth || 1, ih = img.naturalHeight || 1;
        var s = sc.logo.s, r = Math.min(s / iw, s / ih), w = iw * r, h = ih * r;
        ctx.drawImage(img, sc.logo.x + (s - w) / 2, sc.logo.y + (s - h) / 2, w, h);
      });
    }
    return done.then(function () {
      return new Promise(function (res, rej) {
        c.toBlob(function (b) { b ? res(b) : rej(new Error("PNG_FAIL")); }, "image/png");
      });
    });
  }

  B.qrRender = { scene: scene, toSVG: toSVG, toPNG: toPNG };
})();

/*!
 * qr-encoder.js — codificador QR propio, sin dependencias (ISO/IEC 18004).
 * Modo byte (UTF-8), versiones 1–40, corrección de errores L/M/Q/H,
 * elección automática de la máscara óptima.
 * Expone: window.__BRAND__.qr.encode(texto, "L"|"M"|"Q"|"H")
 *   → { size, version, ecl, modules: bool[y][x], isFinder(x, y) }
 */
(function () {
  "use strict";
  var B = (window.__BRAND__ = window.__BRAND__ || {});

  var ECL = {
    L: { ord: 0, bits: 1 },
    M: { ord: 1, bits: 0 },
    Q: { ord: 2, bits: 3 },
    H: { ord: 3, bits: 2 }
  };

  var ECC_PER_BLOCK = [
    [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
    [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]
  ];
  var NUM_BLOCKS = [
    [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
    [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
    [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
    [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81]
  ];

  function getBit(x, i) { return ((x >>> i) & 1) !== 0; }

  function utf8(str) {
    if (typeof TextEncoder !== "undefined") return Array.prototype.slice.call(new TextEncoder().encode(str));
    var s = unescape(encodeURIComponent(str)), out = [];
    for (var i = 0; i < s.length; i++) out.push(s.charCodeAt(i));
    return out;
  }

  function rawDataModules(ver) {
    var r = (16 * ver + 128) * ver + 64;
    if (ver >= 2) {
      var n = Math.floor(ver / 7) + 2;
      r -= (25 * n - 10) * n - 55;
      if (ver >= 7) r -= 36;
    }
    return r;
  }
  function dataCodewords(ver, e) {
    return Math.floor(rawDataModules(ver) / 8) - ECC_PER_BLOCK[e][ver] * NUM_BLOCKS[e][ver];
  }

  /* ---------- Reed–Solomon sobre GF(2^8), polinomio 0x11D ---------- */
  function rsMul(x, y) {
    var z = 0;
    for (var i = 7; i >= 0; i--) {
      z = (z << 1) ^ ((z >>> 7) * 0x11d);
      z ^= ((y >>> i) & 1) * x;
    }
    return z & 0xff;
  }
  function rsDivisor(degree) {
    var res = [], i, j, root = 1;
    for (i = 0; i < degree - 1; i++) res.push(0);
    res.push(1);
    for (i = 0; i < degree; i++) {
      for (j = 0; j < res.length; j++) {
        res[j] = rsMul(res[j], root);
        if (j + 1 < res.length) res[j] ^= res[j + 1];
      }
      root = rsMul(root, 0x02);
    }
    return res;
  }
  function rsRemainder(data, div) {
    var res = div.map(function () { return 0; });
    data.forEach(function (b) {
      var f = b ^ res.shift();
      res.push(0);
      for (var i = 0; i < div.length; i++) res[i] ^= rsMul(div[i], f);
    });
    return res;
  }

  function addEccAndInterleave(data, ver, e) {
    var nBlocks = NUM_BLOCKS[e][ver], eccLen = ECC_PER_BLOCK[e][ver];
    var raw = Math.floor(rawDataModules(ver) / 8);
    var nShort = nBlocks - (raw % nBlocks);
    var shortLen = Math.floor(raw / nBlocks);
    var div = rsDivisor(eccLen), blocks = [], k = 0, i, j;
    for (i = 0; i < nBlocks; i++) {
      var dat = data.slice(k, k + shortLen - eccLen + (i < nShort ? 0 : 1));
      k += dat.length;
      var ecc = rsRemainder(dat, div);
      if (i < nShort) dat.push(0);
      blocks.push(dat.concat(ecc));
    }
    var out = [];
    for (i = 0; i < blocks[0].length; i++) {
      for (j = 0; j < blocks.length; j++) {
        if (i !== shortLen - eccLen || j >= nShort) out.push(blocks[j][i]);
      }
    }
    return out;
  }

  function alignmentPositions(ver, size) {
    if (ver === 1) return [];
    var n = Math.floor(ver / 7) + 2;
    var step = Math.floor((ver * 8 + n * 3 + 5) / (n * 4 - 4)) * 2;
    var res = [6];
    for (var pos = size - 7; res.length < n; pos -= step) res.splice(1, 0, pos);
    return res;
  }

  function encode(text, eclName) {
    var ecl = ECL[eclName] || ECL.M, e = ecl.ord;
    var bytes = utf8(String(text));
    var ver, cap, ccBits;
    for (ver = 1; ver <= 40; ver++) {
      cap = dataCodewords(ver, e) * 8;
      ccBits = ver < 10 ? 8 : 16;
      if (4 + ccBits + bytes.length * 8 <= cap) break;
    }
    if (ver > 40) throw new Error("QR_TOO_LONG");

    // --- flujo de bits ---
    var bits = [];
    function push(val, len) { for (var i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1); }
    push(4, 4);
    push(bytes.length, ccBits);
    bytes.forEach(function (b) { push(b, 8); });
    push(0, Math.min(4, cap - bits.length));
    push(0, (8 - (bits.length % 8)) % 8);
    for (var pad = 0xec; bits.length < cap; pad ^= 0xec ^ 0x11) push(pad, 8);
    var cw = [];
    for (var i = 0; i < bits.length; i += 8) {
      var v = 0;
      for (var b = 0; b < 8; b++) v = (v << 1) | bits[i + b];
      cw.push(v);
    }
    var all = addEccAndInterleave(cw, ver, e);

    // --- matriz ---
    var size = ver * 4 + 17, x, y;
    var mod = [], fn = [];
    for (y = 0; y < size; y++) {
      mod.push(new Array(size).fill(false));
      fn.push(new Array(size).fill(false));
    }
    function setF(xx, yy, dark) { mod[yy][xx] = dark; fn[yy][xx] = true; }

    for (i = 0; i < size; i++) { setF(6, i, i % 2 === 0); setF(i, 6, i % 2 === 0); }
    function finder(cx, cy) {
      for (var dy = -4; dy <= 4; dy++) for (var dx = -4; dx <= 4; dx++) {
        var d = Math.max(Math.abs(dx), Math.abs(dy)), xx = cx + dx, yy = cy + dy;
        if (xx >= 0 && xx < size && yy >= 0 && yy < size) setF(xx, yy, d !== 2 && d !== 4);
      }
    }
    finder(3, 3); finder(size - 4, 3); finder(3, size - 4);
    var ap = alignmentPositions(ver, size), na = ap.length;
    for (i = 0; i < na; i++) for (var j = 0; j < na; j++) {
      if ((i === 0 && j === 0) || (i === 0 && j === na - 1) || (i === na - 1 && j === 0)) continue;
      for (var dy2 = -2; dy2 <= 2; dy2++) for (var dx2 = -2; dx2 <= 2; dx2++)
        setF(ap[i] + dx2, ap[j] + dy2, Math.max(Math.abs(dx2), Math.abs(dy2)) !== 1);
    }

    function drawFormat(mask) {
      var data = (ecl.bits << 3) | mask, rem = data;
      for (var k = 0; k < 10; k++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
      var fb = ((data << 10) | rem) ^ 0x5412, q;
      for (q = 0; q <= 5; q++) setF(8, q, getBit(fb, q));
      setF(8, 7, getBit(fb, 6)); setF(8, 8, getBit(fb, 7)); setF(7, 8, getBit(fb, 8));
      for (q = 9; q < 15; q++) setF(14 - q, 8, getBit(fb, q));
      for (q = 0; q < 8; q++) setF(size - 1 - q, 8, getBit(fb, q));
      for (q = 8; q < 15; q++) setF(8, size - 15 + q, getBit(fb, q));
      setF(8, size - 8, true);
    }
    drawFormat(0);

    if (ver >= 7) {
      var rem = ver;
      for (i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
      var vb = (ver << 12) | rem;
      for (i = 0; i < 18; i++) {
        var bt = getBit(vb, i), a = size - 11 + (i % 3), c = Math.floor(i / 3);
        setF(a, c, bt); setF(c, a, bt);
      }
    }

    // --- datos en zigzag ---
    var bi = 0, total = all.length * 8;
    for (var right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (var vert = 0; vert < size; vert++) for (var jj = 0; jj < 2; jj++) {
        x = right - jj;
        var up = ((right + 1) & 2) === 0;
        y = up ? size - 1 - vert : vert;
        if (!fn[y][x] && bi < total) {
          mod[y][x] = getBit(all[bi >>> 3], 7 - (bi & 7));
          bi++;
        }
      }
    }

    function applyMask(m) {
      for (var yy = 0; yy < size; yy++) for (var xx = 0; xx < size; xx++) {
        var inv;
        switch (m) {
          case 0: inv = (xx + yy) % 2 === 0; break;
          case 1: inv = yy % 2 === 0; break;
          case 2: inv = xx % 3 === 0; break;
          case 3: inv = (xx + yy) % 3 === 0; break;
          case 4: inv = (Math.floor(xx / 3) + Math.floor(yy / 2)) % 2 === 0; break;
          case 5: inv = ((xx * yy) % 2) + ((xx * yy) % 3) === 0; break;
          case 6: inv = (((xx * yy) % 2) + ((xx * yy) % 3)) % 2 === 0; break;
          default: inv = (((xx + yy) % 2) + ((xx * yy) % 3)) % 2 === 0;
        }
        if (!fn[yy][xx] && inv) mod[yy][xx] = !mod[yy][xx];
      }
    }

    var P1 = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0], P2 = [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1];
    function penalty() {
      var score = 0, dark = 0, yy, xx, k;
      for (var pass = 0; pass < 2; pass++) {
        for (var a1 = 0; a1 < size; a1++) {
          var run = 0, prev = null, line = [];
          for (var b1 = 0; b1 < size; b1++) {
            var m = pass === 0 ? mod[a1][b1] : mod[b1][a1];
            line.push(m ? 1 : 0);
            if (m === prev) { run++; if (run === 5) score += 3; else if (run > 5) score++; }
            else { prev = m; run = 1; }
          }
          for (k = 0; k + 11 <= size; k++) {
            var ok1 = true, ok2 = true;
            for (var t = 0; t < 11; t++) {
              if (line[k + t] !== P1[t]) ok1 = false;
              if (line[k + t] !== P2[t]) ok2 = false;
            }
            if (ok1) score += 40;
            if (ok2) score += 40;
          }
        }
      }
      for (yy = 0; yy < size - 1; yy++) for (xx = 0; xx < size - 1; xx++) {
        var cc = mod[yy][xx];
        if (cc === mod[yy][xx + 1] && cc === mod[yy + 1][xx] && cc === mod[yy + 1][xx + 1]) score += 3;
      }
      for (yy = 0; yy < size; yy++) for (xx = 0; xx < size; xx++) if (mod[yy][xx]) dark++;
      var tot = size * size;
      score += (Math.ceil(Math.abs(dark * 20 - tot * 10) / tot) - 1) * 10;
      return score;
    }

    var best = 0, bestScore = Infinity;
    for (var mk = 0; mk < 8; mk++) {
      applyMask(mk); drawFormat(mk);
      var s = penalty();
      if (s < bestScore) { bestScore = s; best = mk; }
      applyMask(mk);
    }
    applyMask(best); drawFormat(best);

    return {
      size: size,
      version: ver,
      ecl: eclName,
      modules: mod,
      isFinder: function (xx, yy) {
        return (xx < 7 && yy < 7) || (xx >= size - 7 && yy < 7) || (xx < 7 && yy >= size - 7);
      }
    };
  }

  B.qr = { encode: encode };
})();

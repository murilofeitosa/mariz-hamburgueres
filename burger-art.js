/* ============================================================
   BurgerArt — gera ilustrações SVG de hambúrgueres a partir
   da lista de ingredientes (arte original, sem imagens externas)
   ============================================================ */
(function (root) {
  "use strict";

  var W = 240;
  var uid = 0;

  // Ordem de empilhamento, de baixo para cima
  var ORDER = ["salada", "vinagrete", "cebola", "calabresa", "tomate",
               "burger", "frango", "contra", "mignon", "picanha",
               "bacon", "presunto", "ovo", "cheddar", "queijo", "oregano"];

  function wavy(y, h, amp, fill, stroke, n) {
    n = n || 8;
    var step = 220 / n;
    var d = "M10 " + (y + amp);
    for (var i = 0; i < n; i++) {
      var cx = 10 + step * i + step / 2;
      var ex = 10 + step * (i + 1);
      d += " Q" + cx + " " + (y + (i % 2 ? amp * 2 : -amp * 0.2)) + " " + ex + " " + (y + amp);
    }
    d += " L230 " + (y + h - 4) + " Q230 " + (y + h) + " 226 " + (y + h) +
         " L14 " + (y + h) + " Q10 " + (y + h) + " 10 " + (y + h - 4) + " Z";
    return '<path d="' + d + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.5" stroke-linejoin="round"/>';
  }

  function slab(y, h, fill, stroke, dots, dotFill) {
    var s = '<rect x="8" y="' + y + '" width="224" height="' + h + '" rx="' + Math.min(14, h / 2) +
            '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.5"/>';
    for (var i = 0; i < dots; i++) {
      var x = 24 + ((i * 47) % 190);
      var yy = y + 5 + ((i * 13) % Math.max(4, h - 10));
      s += '<ellipse cx="' + x + '" cy="' + yy + '" rx="5" ry="1.8" fill="' + dotFill + '" opacity=".55"/>';
    }
    return s;
  }

  // Cada camada: h = altura ocupada, draw(y) = desenho
  var LAYERS = {
    salada: { h: 17, draw: function (y) {
      return wavy(y, 17, 4, "#5fae3a", "#3d7d22", 12) +
             '<path d="M20 ' + (y + 9) + ' q10 4 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" fill="none" stroke="#8fd25c" stroke-width="2" opacity=".7"/>';
    } },
    vinagrete: { h: 11, draw: function (y) {
      var s = '<rect x="12" y="' + y + '" width="216" height="11" rx="5" fill="#f4efe0" opacity=".25"/>';
      var cols = ["#d8392b", "#5fae3a", "#f2f2e8", "#d8392b", "#f0b429"];
      for (var i = 0; i < 26; i++) {
        s += '<rect x="' + (16 + i * 8.2) + '" y="' + (y + 1 + (i % 3) * 3) + '" width="5" height="4.5" rx="1" fill="' + cols[i % cols.length] + '" stroke="#0004" stroke-width=".4"/>';
      }
      return s;
    } },
    cebola: { h: 8, draw: function (y) {
      var s = "";
      for (var i = 0; i < 6; i++) {
        s += '<ellipse cx="' + (38 + i * 33) + '" cy="' + (y + 4) + '" rx="15" ry="3.6" fill="none" stroke="#efe3f2" stroke-width="2.4"/>';
      }
      return s;
    } },
    calabresa: { h: 16, draw: function (y) {
      var s = "";
      for (var i = 0; i < 6; i++) {
        var cx = 36 + i * 34;
        s += '<ellipse cx="' + cx + '" cy="' + (y + 8) + '" rx="17" ry="7.5" fill="#b3402b" stroke="#6e1f12" stroke-width="1.5"/>' +
             '<circle cx="' + (cx - 5) + '" cy="' + (y + 7) + '" r="1.6" fill="#e9a58c"/>' +
             '<circle cx="' + (cx + 4) + '" cy="' + (y + 9) + '" r="1.6" fill="#e9a58c"/>' +
             '<circle cx="' + (cx + 8) + '" cy="' + (y + 6) + '" r="1.2" fill="#e9a58c"/>';
      }
      return s;
    } },
    tomate: { h: 13, draw: function (y) {
      var s = "";
      for (var i = 0; i < 4; i++) {
        var cx = 48 + i * 48;
        s += '<ellipse cx="' + cx + '" cy="' + (y + 6.5) + '" rx="26" ry="6.2" fill="#e0402f" stroke="#9a2216" stroke-width="1.5"/>' +
             '<ellipse cx="' + cx + '" cy="' + (y + 6.5) + '" rx="16" ry="2.6" fill="#f4786a" opacity=".7"/>';
      }
      return s;
    } },
    burger: { h: 28, draw: function (y) {
      return slab(y, 28, "#5b2e18", "#2e1409", 18, "#8a4a2a") +
             '<path d="M16 ' + (y + 6) + ' H224" stroke="#7a3f22" stroke-width="2" opacity=".5" stroke-linecap="round"/>';
    } },
    frango: { h: 26, draw: function (y) {
      return slab(y, 26, "#e0a25a", "#9a6422", 22, "#f6cf8c") +
             '<path d="M20 ' + (y + 7) + ' q30 -5 60 0 t60 0 t60 0" fill="none" stroke="#f6cf8c" stroke-width="2" opacity=".7"/>';
    } },
    contra: { h: 26, draw: function (y) {
      return slab(y, 26, "#6d2f1c", "#341308", 20, "#9c5436") +
             '<path d="M18 ' + (y + 8) + ' h200 M18 ' + (y + 17) + ' h200" stroke="#2a0f06" stroke-width="2" opacity=".35" stroke-dasharray="14 8"/>';
    } },
    mignon: { h: 30, draw: function (y) {
      return slab(y, 30, "#7a3a24", "#391609", 16, "#b0684a") +
             '<ellipse cx="120" cy="' + (y + 15) + '" rx="70" ry="6" fill="#a24f33" opacity=".5"/>';
    } },
    picanha: { h: 30, draw: function (y) {
      return slab(y, 30, "#6a2a18", "#2d1007", 14, "#9a4c32") +
             '<rect x="8" y="' + (y + 24) + '" width="224" height="6" rx="3" fill="#f3e2b8" stroke="#c9a85a" stroke-width="1"/>';
    } },
    bacon: { h: 12, draw: function (y) {
      var s = wavy(y, 12, 3, "#b8402e", "#6b1d12", 9);
      s += '<path d="M14 ' + (y + 5) + ' q18 6 36 0 t36 0 t36 0 t36 0 t36 0 t36 0" fill="none" stroke="#f0b8a0" stroke-width="2.2" opacity=".8"/>';
      return s;
    } },
    presunto: { h: 9, draw: function (y) {
      return wavy(y, 9, 3, "#f1a3a8", "#b0545c", 10);
    } },
    ovo: { h: 17, draw: function (y) {
      return '<path d="M16 ' + (y + 13) + ' Q10 ' + (y + 4) + ' 40 ' + (y + 6) + ' Q80 ' + (y + 1) + ' 120 ' + (y + 6) +
             ' Q170 ' + (y + 1) + ' 206 ' + (y + 6) + ' Q236 ' + (y + 5) + ' 224 ' + (y + 13) +
             ' Q200 ' + (y + 18) + ' 120 ' + (y + 16) + ' Q50 ' + (y + 18) + ' 16 ' + (y + 13) + 'Z" fill="#fffdf6" stroke="#cfc6a8" stroke-width="1.5"/>' +
             '<ellipse cx="120" cy="' + (y + 8) + '" rx="19" ry="6.5" fill="#f7b81c" stroke="#c98a00" stroke-width="1.2"/>' +
             '<ellipse cx="114" cy="' + (y + 6) + '" rx="6" ry="2" fill="#fde28a"/>';
    } },
    cheddar: { h: 10, draw: function (y) {
      return '<path d="M10 ' + y + ' H230 V' + (y + 6) + ' L214 ' + (y + 6) + ' L204 ' + (y + 17) + ' L194 ' + (y + 6) + ' L40 ' + (y + 6) + ' L30 ' + (y + 13) + ' L20 ' + (y + 6) + ' L10 ' + (y + 6) + ' Z" fill="#f08a1a" stroke="#a85a05" stroke-width="1.5" stroke-linejoin="round"/>';
    } },
    queijo: { h: 10, draw: function (y) {
      return '<path d="M8 ' + y + ' H232 V' + (y + 6) + ' L196 ' + (y + 6) + ' L182 ' + (y + 18) + ' L168 ' + (y + 6) +
             ' L96 ' + (y + 6) + ' L84 ' + (y + 15) + ' L72 ' + (y + 6) + ' L8 ' + (y + 6) + ' Z" fill="#fbc531" stroke="#b8860b" stroke-width="1.5" stroke-linejoin="round"/>' +
             '<path d="M20 ' + (y + 2.5) + ' H110" stroke="#ffe48a" stroke-width="2" stroke-linecap="round" opacity=".8"/>';
    } },
    oregano: { h: 0, draw: function (y) {
      var s = "";
      for (var i = 0; i < 22; i++) {
        s += '<rect x="' + (20 + (i * 37) % 200) + '" y="' + (y + (i * 7) % 10 - 2) + '" width="4" height="1.8" rx=".9" fill="#2f7d2a" transform="rotate(' + (i * 41 % 180) + ' ' + (22 + (i * 37) % 200) + ' ' + (y + (i * 7) % 10) + ')"/>';
      }
      return s;
    } }
  };

  var TOP_H = 56, BOT_H = 24, OVERLAP = 3;

  function defs(p) {
    return '<defs>' +
      '<linearGradient id="' + p + 'bun" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#f2b25a"/><stop offset=".6" stop-color="#d9893a"/><stop offset="1" stop-color="#b9651f"/></linearGradient>' +
      '<linearGradient id="' + p + 'bunb" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#e3a04a"/><stop offset="1" stop-color="#b9651f"/></linearGradient>' +
      '<radialGradient id="' + p + 'glow" cx=".5" cy=".5" r=".5">' +
        '<stop offset="0" stop-color="#ffcf4a" stop-opacity=".35"/><stop offset="1" stop-color="#ffcf4a" stop-opacity="0"/></radialGradient>' +
      '</defs>';
  }

  function topBun(y, p, opts) {
    var s = '<path d="M10 ' + (y + TOP_H) + ' Q8 ' + (y + 4) + ' 120 ' + (y + 2) + ' Q232 ' + (y + 4) + ' 230 ' + (y + TOP_H) +
            ' Q230 ' + (y + TOP_H + 4) + ' 222 ' + (y + TOP_H + 4) + ' H18 Q10 ' + (y + TOP_H + 4) + ' 10 ' + (y + TOP_H) + ' Z" ' +
            'fill="url(#' + p + 'bun)" stroke="#7a3f10" stroke-width="2" stroke-linejoin="round"/>';
    s += '<path d="M40 ' + (y + 30) + ' Q60 ' + (y + 10) + ' 120 ' + (y + 9) + '" fill="none" stroke="#fff" stroke-width="5" opacity=".18" stroke-linecap="round"/>';
    var seeds = [[60,22],[90,14],[120,10],[150,14],[180,22],[75,34],[105,26],[135,26],[165,34],[120,40],[88,46],[152,46],[50,40],[190,40]];
    for (var i = 0; i < seeds.length; i++) {
      var a = (i * 53) % 90 - 45;
      s += '<ellipse cx="' + seeds[i][0] + '" cy="' + (y + seeds[i][1]) + '" rx="4.2" ry="2.1" fill="#fff3d1" stroke="#c9985a" stroke-width=".5" transform="rotate(' + a + ' ' + seeds[i][0] + ' ' + (y + seeds[i][1]) + ')"/>';
    }
    return s;
  }

  function botBun(y, p) {
    return '<path d="M10 ' + y + ' H230 V' + (y + 10) + ' Q230 ' + (y + BOT_H) + ' 214 ' + (y + BOT_H) +
           ' H26 Q10 ' + (y + BOT_H) + ' 10 ' + (y + 10) + ' Z" fill="url(#' + p + 'bunb)" stroke="#7a3f10" stroke-width="2" stroke-linejoin="round"/>';
  }

  // Retorna string SVG completa
  function burger(ings, opts) {
    opts = opts || {};
    var p = "ba" + (++uid) + "_";
    var list = ORDER.filter(function (k) { return ings.indexOf(k) > -1; });
    var total = BOT_H + TOP_H + 4;
    list.forEach(function (k) { total += LAYERS[k].h - OVERLAP; });
    var H = total + 22;                // espaço para sombra
    var y = H - 22;                    // base do hambúrguer
    var out = "";

    y -= BOT_H;
    var parts = [botBun(y, p)];
    list.forEach(function (k) {
      var L = LAYERS[k];
      y -= (L.h - OVERLAP);
      parts.push(L.draw(y));
    });
    y -= TOP_H - OVERLAP + 4;
    parts.push(topBun(y, p, opts));

    out = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' +
          (opts.label || "Ilustração do hambúrguer") + '">' + defs(p) +
          '<ellipse cx="120" cy="' + (H - 12) + '" rx="108" ry="9" fill="#000" opacity=".45"/>' +
          '<ellipse cx="120" cy="' + (H / 2) + '" rx="120" ry="' + (H / 2) + '" fill="url(#' + p + 'glow)"/>' +
          parts.join("") + '</svg>';
    return out;
  }

  // Batata frita (SVG)
  function fries() {
    var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 200" role="img" aria-label="Porção de batata frita">';
    var cols = ["#f6c64a", "#f2b92f", "#fbd566", "#e9a91f"];
    for (var i = 0; i < 17; i++) {
      var x = 50 + i * 8.5;
      var tilt = (i - 8) * 3.2;
      var top = 22 + (i * 11) % 34;
      s += '<g transform="rotate(' + tilt + ' ' + x + ' 150)"><rect x="' + x + '" y="' + top + '" width="10" height="' + (150 - top) +
           '" rx="2.5" fill="' + cols[i % 4] + '" stroke="#b07b10" stroke-width="1"/><rect x="' + (x + 2) + '" y="' + (top + 3) +
           '" width="2.5" height="' + (130 - top) + '" rx="1" fill="#fff" opacity=".35"/></g>';
    }
    s += '<path d="M34 112 H206 L188 192 Q186 198 180 198 H60 Q54 198 52 192 Z" fill="#c8281e" stroke="#7b130c" stroke-width="2.5" stroke-linejoin="round"/>' +
         '<path d="M34 112 H206 L202 130 H38 Z" fill="#f2c230" stroke="#a97b0b" stroke-width="2"/>' +
         '<text x="120" y="172" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="30" fill="#ffd54a">MARIZ</text></svg>';
    return s;
  }

  var api = { burger: burger, fries: fries, ORDER: ORDER };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.BurgerArt = api;
})(typeof window !== "undefined" ? window : this);

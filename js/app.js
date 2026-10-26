/* ============================================================
   Mariz Hambúrgueres — lógica do site (sem dependências)
   ============================================================ */
(function () {
  "use strict";

  var CFG = window.MARIZ_CONFIG;
  var MENU = window.MARIZ_MENU;
  var Art = window.BurgerArt;

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var brl = function (n) { return "R$ " + n.toFixed(2).replace(".", ","); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); };

  var state = { cat: "tradicionais", pao: 0, cart: [], modal: null };
  var STORAGE = "mariz_cart_v1";

  /* ---------- Persistência ---------- */
  function load() {
    try { state.cart = JSON.parse(localStorage.getItem(STORAGE)) || []; } catch (e) { state.cart = []; }
  }
  function save() {
    try { localStorage.setItem(STORAGE, JSON.stringify(state.cart)); } catch (e) { /* ignore */ }
  }

  /* ---------- Util ---------- */
  function findItem(id) {
    return MENU.tradicionais.concat(MENU.premium).filter(function (i) { return i.id === id; })[0];
  }
  function findExtra(id) {
    return MENU.adicionais.filter(function (a) { return a.id === id; })[0];
  }
  function whatsUrl(text) {
    var base = "https://wa.me/" + CFG.whatsapp;
    return text ? base + "?text=" + encodeURIComponent(text) : base;
  }
  var toastT;
  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }

  /* ---------- Hero / destaques ---------- */
  function renderHero() {
    $("#heroArt").innerHTML = Art.burger(["burger", "presunto", "queijo", "ovo", "bacon", "salada", "tomate"], { label: "Hambúrguer X-Tudo" });
  }

  function renderFeatured() {
    var list = MENU.tradicionais.concat(MENU.premium).filter(function (i) { return i.destaque; });
    $("#featured").innerHTML = list.map(function (i) {
      return '<article class="feat">' +
        '<span class="tag">Destaque</span>' +
        Art.burger(i.ing, { label: i.nome }) +
        '<h3>' + esc(i.nome) + '</h3>' +
        '<p>' + esc(i.desc) + '</p>' +
        '<div class="price">a partir de ' + brl(i.precos[0]) + '</div>' +
        '<button class="btn btn--gold" data-open="' + i.id + '">Pedir agora</button>' +
        '</article>';
    }).join("");
  }

  /* ---------- Cardápio ---------- */
  function renderMenu() {
    var grid = $("#menuGrid");
    var html = "";
    if (state.cat === "adicionais") {
      html = MENU.adicionais.map(function (a) {
        return '<div class="item extra"><div><h3>' + esc(a.nome) + '</h3><p>Adicional para qualquer lanche</p></div>' +
               '<div class="item__buy"><div class="price">' + brl(a.preco) + '</div></div></div>';
      }).join("");
      $("#breadSwitch").style.visibility = "hidden";
    } else {
      $("#breadSwitch").style.visibility = "visible";
      html = MENU[state.cat].map(function (i, idx) {
        return '<div class="item">' +
          '<div class="item__art">' + Art.burger(i.ing, { label: i.nome }) + '</div>' +
          '<div><h3><span class="item__num">' + (idx + 1) + '</span>' + esc(i.nome) + '</h3><p>' + esc(i.desc) + '</p></div>' +
          '<div class="item__buy"><div class="price">' + brl(i.precos[state.pao]) + '</div>' +
          '<button class="add" data-open="' + i.id + '">Adicionar</button></div></div>';
      }).join("");
    }
    grid.innerHTML = html;
  }

  /* ---------- Modal do item ---------- */
  function openModal(id) {
    var item = findItem(id);
    if (!item) return;
    state.modal = { item: item, pao: state.pao, extras: [], qty: 1 };
    $("#mArt").innerHTML = Art.burger(item.ing, { label: item.nome });
    $("#mTitle").textContent = item.nome;
    $("#mDesc").textContent = item.desc;
    $("#mPrice0").textContent = brl(item.precos[0]);
    $("#mPrice1").textContent = brl(item.precos[1]);
    $$('input[name="mPao"]').forEach(function (r) { r.checked = Number(r.value) === state.pao; });
    $("#mExtras").innerHTML = MENU.adicionais.map(function (a) {
      return '<label class="check"><input type="checkbox" value="' + a.id + '"><span>' + esc(a.nome) + '</span><b>+ ' + brl(a.preco) + '</b></label>';
    }).join("");
    $("#mObs").value = "";
    $("#mQty").textContent = "1";
    updateModalTotal();
    var dlg = $("#itemModal");
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
  }

  function closeModal() {
    var dlg = $("#itemModal");
    if (typeof dlg.close === "function") dlg.close(); else dlg.removeAttribute("open");
  }

  function modalUnit() {
    var m = state.modal;
    var extras = m.extras.reduce(function (s, id) { return s + findExtra(id).preco; }, 0);
    return m.item.precos[m.pao] + extras;
  }
  function updateModalTotal() {
    $("#mTotal").textContent = brl(modalUnit() * state.modal.qty);
  }

  function addFromModal() {
    var m = state.modal;
    var obs = $("#mObs").value.trim();
    var extras = m.extras.slice().sort();
    var key = [m.item.id, m.pao, extras.join("+"), obs.toLowerCase()].join("|");
    var line = state.cart.filter(function (l) { return l.key === key; })[0];
    if (line) line.qty += m.qty;
    else state.cart.push({ key: key, id: m.item.id, pao: m.pao, extras: extras, obs: obs, qty: m.qty });
    save(); renderCart(); closeModal();
    toast(m.qty + "× " + m.item.nome + " adicionado!");
    var b = $("#openCart"); b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump");
  }

  /* ---------- Carrinho ---------- */
  function lineUnit(l) {
    var item = findItem(l.id);
    return item.precos[l.pao] + l.extras.reduce(function (s, id) { return s + findExtra(id).preco; }, 0);
  }
  function cartTotal() {
    return state.cart.reduce(function (s, l) { return s + lineUnit(l) * l.qty; }, 0);
  }

  function renderCart() {
    // limpa itens que não existem mais no cardápio
    state.cart = state.cart.filter(function (l) { return findItem(l.id); });
    var n = state.cart.reduce(function (s, l) { return s + l.qty; }, 0);
    $("#cartCount").textContent = n;
    var empty = state.cart.length === 0;
    $("#cartEmpty").hidden = !empty;
    $("#checkout").hidden = empty;
    $("#drawerFoot").hidden = empty;

    $("#cartList").innerHTML = state.cart.map(function (l, i) {
      var item = findItem(l.id);
      var extras = l.extras.map(function (id) { return findExtra(id).nome; });
      var sub = MENU.paes[l.pao] + (extras.length ? " · + " + extras.join(", ") : "") + (l.obs ? " · Obs: " + l.obs : "");
      return '<li><span class="nm">' + esc(item.nome) + '</span><span class="pr">' + brl(lineUnit(l) * l.qty) + '</span>' +
        '<span class="sub">' + esc(sub) + '</span>' +
        '<div class="acts"><div class="qty"><button data-q="-1" data-i="' + i + '" aria-label="Diminuir">−</button><span>' + l.qty +
        '</span><button data-q="1" data-i="' + i + '" aria-label="Aumentar">+</button></div>' +
        '<button class="rm" data-rm="' + i + '">remover</button></div></li>';
    }).join("");

    $("#cartTotal").textContent = brl(cartTotal());
    $("#feeNote").textContent = CFG.taxaEntrega > 0
      ? "Taxa de entrega: " + brl(CFG.taxaEntrega) + " (somada na confirmação)."
      : "Taxa de entrega combinada pelo WhatsApp.";
  }

  function openCart() {
    $("#drawer").classList.add("open");
    $("#drawer").setAttribute("aria-hidden", "false");
    $("#overlay").hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeCart() {
    $("#drawer").classList.remove("open");
    $("#drawer").setAttribute("aria-hidden", "true");
    $("#overlay").hidden = true;
    document.body.style.overflow = "";
  }

  /* ---------- Envio pelo WhatsApp ---------- */
  function sendOrder() {
    var nome = $("#cNome").value.trim();
    var tipo = $('input[name="cTipo"]:checked').value;
    var end = $("#cEnd").value.trim();
    var ok = true;

    $("#cNome").parentNode.classList.toggle("err", !nome);
    if (!nome) ok = false;
    var needAddr = tipo === "entrega";
    $("#cEnd").parentNode.classList.toggle("err", needAddr && !end);
    if (needAddr && !end) ok = false;
    if (!ok) { toast("Preencha os campos obrigatórios."); return; }
    if (!state.cart.length) return;

    var L = [];
    L.push("*NOVO PEDIDO — " + CFG.nome.toUpperCase() + "*");
    L.push("");
    L.push("*Cliente:* " + nome);
    L.push("*Tipo:* " + (tipo === "entrega" ? "Entrega" : "Retirada no local"));
    if (tipo === "entrega") {
      L.push("*Endereço:* " + end);
      var ref = $("#cRef").value.trim();
      if (ref) L.push("*Referência:* " + ref);
    }
    L.push("");
    L.push("*Itens:*");
    state.cart.forEach(function (l) {
      var item = findItem(l.id);
      var extras = l.extras.map(function (id) { return findExtra(id).nome; });
      var linha = "• " + l.qty + "x " + item.nome + " (" + MENU.paes[l.pao] + ")";
      if (extras.length) linha += " + " + extras.join(", ");
      linha += " — " + brl(lineUnit(l) * l.qty);
      L.push(linha);
      if (l.obs) L.push("   Obs: " + l.obs);
    });
    L.push("");
    L.push("*Subtotal:* " + brl(cartTotal()));
    if (tipo === "entrega") L.push("*Taxa de entrega:* " + (CFG.taxaEntrega > 0 ? brl(CFG.taxaEntrega) : "a combinar"));
    var pag = $("#cPag").value;
    L.push("*Pagamento:* " + pag);
    if (pag === "Dinheiro" && $("#cTroco").value.trim()) L.push("*Troco para:* R$ " + $("#cTroco").value.trim());

    window.open(whatsUrl(L.join("\n")), "_blank", "noopener");
  }

  /* ---------- Horários / contato ---------- */
  function toMin(hhmm) { var p = hhmm.split(":"); return Number(p[0]) * 60 + Number(p[1]); }

  function isOpenNow() {
    var now = new Date();
    var d = now.getDay();
    var m = now.getHours() * 60 + now.getMinutes();
    var h = CFG.horarios[d];
    var prev = CFG.horarios[(d + 6) % 7];
    // expediente de ontem que passou da meia-noite
    if (prev && !prev.fechado && toMin(prev.fecha) < toMin(prev.abre) && m < toMin(prev.fecha)) return { open: true, until: prev.fecha };
    if (!h || h.fechado) return { open: false };
    var a = toMin(h.abre), f = toMin(h.fecha);
    if (f <= a) return m >= a ? { open: true, until: h.fecha } : { open: false };
    return m >= a && m < f ? { open: true, until: h.fecha } : { open: false, opens: m < a ? h.abre : null };
  }

  function renderStatus() {
    var s = isOpenNow(), b = $("#statusBadge");
    b.classList.remove("open", "closed");
    if (s.open) { b.classList.add("open"); b.textContent = "● Aberto agora · até " + s.until; }
    else { b.classList.add("closed"); b.textContent = "● Fechado no momento"; }
  }

  function renderContact() {
    var rows = [];
    rows.push("<li>📱 <span>WhatsApp: <a href=\"" + whatsUrl() + "\" target=\"_blank\" rel=\"noopener\">" + esc(CFG.whatsappExibicao) + "</a></span></li>");
    if (CFG.endereco) {
      var addr = esc(CFG.endereco) + (CFG.cidade ? " — " + esc(CFG.cidade) : "");
      rows.push("<li>📍 <span>" + (CFG.mapsLink ? '<a href="' + esc(CFG.mapsLink) + '" target="_blank" rel="noopener">' + addr + "</a>" : addr) + "</span></li>");
    }
    if (CFG.instagram) rows.push('<li>📸 <span><a href="https://instagram.com/' + esc(CFG.instagram) + '" target="_blank" rel="noopener">@' + esc(CFG.instagram) + "</a></span></li>");
    rows.push("<li>💳 <span>Pagamento: " + CFG.formasPagamento.map(esc).join(", ") + "</span></li>");
    $("#infoList").innerHTML = rows.join("");

    var today = new Date().getDay();
    $("#hoursTable").innerHTML = CFG.horarios.map(function (h, i) {
      return '<tr class="' + (i === today ? "today" : "") + '"><td>' + esc(h.dia) + "</td><td>" +
             (h.fechado ? "Fechado" : esc(h.abre) + " às " + esc(h.fecha)) + "</td></tr>";
    }).join("");

    $("#cPag").innerHTML = CFG.formasPagamento.map(function (p) { return "<option>" + esc(p) + "</option>"; }).join("");
    ["#heroWhats", "#contactWhats", "#fabWhats"].forEach(function (s) {
      var el = $(s);
      el.href = whatsUrl("Olá! Vim pelo site e gostaria de fazer um pedido.");
    });
  }

  /* ---------- Eventos ---------- */
  function bind() {
    // abrir modal por delegação (cards e destaques)
    document.addEventListener("click", function (e) {
      var o = e.target.closest("[data-open]");
      if (o) openModal(o.getAttribute("data-open"));
    });

    // abas
    $$(".tab").forEach(function (t) {
      t.addEventListener("click", function () {
        $$(".tab").forEach(function (x) { x.classList.remove("is-active"); });
        t.classList.add("is-active");
        state.cat = t.getAttribute("data-cat");
        renderMenu();
      });
    });

    // tipo de pão
    $$(".bread__opt").forEach(function (b) {
      b.addEventListener("click", function () {
        $$(".bread__opt").forEach(function (x) { x.classList.remove("is-active"); });
        b.classList.add("is-active");
        state.pao = Number(b.getAttribute("data-pao"));
        renderMenu();
      });
    });

    // modal
    $("#mClose").addEventListener("click", closeModal);
    $("#itemModal").addEventListener("click", function (e) { if (e.target === this) closeModal(); });
    $("#itemModal").addEventListener("change", function (e) {
      if (!state.modal) return;
      if (e.target.name === "mPao") state.modal.pao = Number(e.target.value);
      if (e.target.type === "checkbox") {
        state.modal.extras = $$("#mExtras input:checked").map(function (c) { return c.value; });
      }
      updateModalTotal();
    });
    $("#mMinus").addEventListener("click", function () {
      state.modal.qty = Math.max(1, state.modal.qty - 1); $("#mQty").textContent = state.modal.qty; updateModalTotal();
    });
    $("#mPlus").addEventListener("click", function () {
      state.modal.qty = Math.min(50, state.modal.qty + 1); $("#mQty").textContent = state.modal.qty; updateModalTotal();
    });
    $("#mAdd").addEventListener("click", addFromModal);

    // carrinho
    $("#openCart").addEventListener("click", openCart);
    $("#closeCart").addEventListener("click", closeCart);
    $("#overlay").addEventListener("click", closeCart);
    $("#goMenu").addEventListener("click", closeCart);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeCart(); });

    $("#cartList").addEventListener("click", function (e) {
      var q = e.target.closest("[data-q]"), r = e.target.closest("[data-rm]");
      if (q) {
        var l = state.cart[Number(q.getAttribute("data-i"))];
        l.qty += Number(q.getAttribute("data-q"));
        if (l.qty < 1) state.cart.splice(state.cart.indexOf(l), 1);
      } else if (r) {
        state.cart.splice(Number(r.getAttribute("data-rm")), 1);
      } else return;
      save(); renderCart();
    });
    $("#clearCart").addEventListener("click", function () {
      if (confirm("Esvaziar o carrinho?")) { state.cart = []; save(); renderCart(); }
    });

    // checkout
    $$('input[name="cTipo"]').forEach(function (r) {
      r.addEventListener("change", function () {
        $("#addrBox").hidden = $('input[name="cTipo"]:checked').value === "retirada";
      });
    });
    $("#cPag").addEventListener("change", function () { $("#trocoBox").hidden = this.value !== "Dinheiro"; });
    $("#checkout").addEventListener("submit", function (e) { e.preventDefault(); });
    $("#sendWhats").addEventListener("click", sendOrder);

    // menu mobile
    $("#menuToggle").addEventListener("click", function () {
      var open = $("#nav").classList.toggle("open");
      this.setAttribute("aria-expanded", open);
    });
    $$("#nav a").forEach(function (a) { a.addEventListener("click", function () { $("#nav").classList.remove("open"); }); });
  }

  /* ---------- Init ---------- */
  function init() {
    load();
    renderHero(); renderFeatured(); renderMenu(); renderContact(); renderCart(); renderStatus();
    $("#year").textContent = new Date().getFullYear();
    bind();
    setInterval(renderStatus, 60000);
  }
  init();
})();

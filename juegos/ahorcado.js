/* Ahorcado — teams take turns choosing letters. */
(function () {
  "use strict";
  var GK = window.GameKit;
  var MAX_MISS = 6;
  var queue = [], cur = null, letters = {}, guessed = {}, misses = 0, over = false, keyHandler = null;

  var SVG =
    '<svg viewBox="0 0 200 220" aria-hidden="true">' +
    '<path class="base" d="M20 210 H180 M60 210 V20 H130 V48"/>' +
    '<circle class="part" cx="130" cy="64" r="16"/>' +
    '<path class="part" d="M130 80 V138"/>' +
    '<path class="part" d="M130 96 L106 120"/>' +
    '<path class="part" d="M130 96 L154 120"/>' +
    '<path class="part" d="M130 138 L110 176"/>' +
    '<path class="part" d="M130 138 L150 176"/>' +
    "</svg>";

  function letterCount(w) { return GK.norm(w).replace(/[^A-Z]/g, "").length; }

  function pickWord() {
    if (!queue.length) {
      var all = GK.words();
      var long = all.filter(function (w) { return letterCount(w.w) >= 3; });
      queue = GK.shuffle(long.length ? long : all);
    }
    return queue.pop();
  }

  function draw() {
    var area = GK.$("#gk-area");
    area.innerHTML = "";
    var root = GK.el("div", "hm");
    root.innerHTML = SVG;
    var side = GK.el("div", "hm-side");
    var clue = GK.el("p", "hm-clue");
    clue.textContent = "Pista: " + cur.c;
    var word = GK.el("div", "hm-word");
    word.id = "hm-word";
    var msg = GK.el("p", "gk-msg");
    msg.id = "hm-msg";
    var keys = GK.el("div", "hm-keys");
    keys.id = "hm-keys";
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(function (L) {
      var b = GK.el("button");
      b.textContent = L;
      b.dataset.l = L;
      b.addEventListener("click", function () { guess(L); });
      keys.appendChild(b);
    });
    var row = GK.el("div", "gk-row");
    var reveal = GK.el("button", "gk-btn alt", "Revelar palabra");
    var next = GK.el("button", "gk-btn", "Siguiente palabra →");
    reveal.addEventListener("click", function () { if (!over) finish(false, "Se reveló la palabra."); });
    next.addEventListener("click", function () { startRound(); GK.next(); });
    row.appendChild(reveal);
    row.appendChild(next);
    side.appendChild(clue);
    side.appendChild(word);
    side.appendChild(msg);
    side.appendChild(keys);
    side.appendChild(row);
    root.appendChild(side);
    area.appendChild(root);
    paint();
  }

  function paint() {
    var word = GK.$("#hm-word");
    word.innerHTML = "";
    cur.w.split(" ").forEach(function (part) {
      var group = GK.el("span", "hm-wordgroup");
      part.split("").forEach(function (ch) {
        var n = GK.norm(ch);
        var isLetter = /^[A-Z]$/.test(n);
        var s = GK.el("span", "hm-slot");
        if (!isLetter) { s.className = "hm-slot fixed"; s.textContent = ch; }
        else if (guessed[n]) { s.textContent = ch; }
        else if (over) { s.textContent = ch; s.classList.add("lost"); }
        else { s.innerHTML = "&nbsp;"; }
        group.appendChild(s);
      });
      word.appendChild(group);
    });
    var parts = document.querySelectorAll(".hm svg .part");
    parts.forEach(function (p, i) { p.style.display = i < misses ? "" : "none"; });
  }

  function finish(won, text) {
    over = true;
    var msg = GK.$("#hm-msg");
    msg.textContent = text;
    msg.className = "gk-msg " + (won ? "ok" : "no");
    GK.$("#hm-keys").querySelectorAll("button").forEach(function (b) { b.disabled = true; });
    paint();
  }

  function guess(L) {
    if (over || GK.modalOpen) return;
    var btn = GK.$('#hm-keys button[data-l="' + L + '"]');
    if (!btn || btn.disabled) return;
    btn.disabled = true;
    guessed[L] = true;
    if (letters[L]) {
      btn.classList.add("hit");
      GK.award(1);
      var done = Object.keys(letters).every(function (k) { return guessed[k]; });
      if (done) {
        GK.award(3);
        finish(true, "¡Palabra completa! +3 puntos extra para el equipo " + GK.team().name + ".");
        return;
      }
      GK.$("#hm-msg").textContent = "";
    } else {
      btn.classList.add("miss");
      misses++;
      if (misses >= MAX_MISS) { finish(false, "Se acabaron los intentos. La palabra era: " + cur.w); return; }
      GK.next();
    }
    paint();
  }

  function startRound() {
    cur = pickWord();
    letters = {}; guessed = {}; misses = 0; over = false;
    cur.w.split("").forEach(function (ch) {
      var n = GK.norm(ch);
      if (/^[A-Z]$/.test(n)) letters[n] = true;
    });
    draw();
  }

  GK.init({
    start: function () {
      queue = [];
      if (!GK.words().length) {
        GK.$("#gk-area").innerHTML = '<p class="gk-empty">No hay palabras para este contenido. Elige otro tema.</p>';
        return;
      }
      startRound();
      keyHandler = function (e) {
        if (e.ctrlKey || e.metaKey || e.altKey || !GK.$("#hm-keys")) return;
        var L = GK.norm(e.key || "");
        if (/^[A-Z]$/.test(L)) guess(L);
      };
      document.addEventListener("keydown", keyHandler);
    },
    stop: function () {
      if (keyHandler) document.removeEventListener("keydown", keyHandler);
      keyHandler = null;
    },
  });
})();

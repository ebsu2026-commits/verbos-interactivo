/* Memoria de parejas — teams flip two cards per turn; a match scores and keeps the turn. */
(function () {
  "use strict";
  var GK = window.GameKit;
  var cards = [], flipped = [], lock = false, found = 0, total = 0;

  function newRound() {
    var sets = GK.pairSets();
    var area = GK.$("#gk-area");
    if (!sets.length) {
      area.innerHTML = '<p class="gk-empty">No hay parejas para este contenido. Elige otro tema.</p>';
      return;
    }
    var set = GK.shuffle(sets)[0];
    var pairs = GK.shuffle(set.pairs).slice(0, 6);
    total = pairs.length; found = 0; flipped = []; lock = false;
    cards = [];
    pairs.forEach(function (p, i) {
      cards.push({ id: i, text: p[0] });
      cards.push({ id: i, text: p[1] });
    });
    cards = GK.shuffle(cards);

    area.innerHTML = "";
    var title = GK.el("p", "mm-title");
    title.textContent = "Encuentren las parejas: " + set.title;
    var grid = GK.el("div", "mm-grid");
    var cols = cards.length <= 8 ? 4 : cards.length === 10 ? 5 : 4;
    grid.style.gridTemplateColumns = "repeat(" + cols + ", 1fr)";
    cards.forEach(function (c) {
      var b = GK.el("button", "mm-card");
      b.innerHTML = '<div class="mm-inner"><div class="mm-face mm-back">?</div><div class="mm-face mm-front"></div></div>';
      b.querySelector(".mm-front").textContent = c.text;
      b.addEventListener("click", function () { flip(c, b); });
      c.node = b;
      grid.appendChild(b);
    });
    var row = GK.el("div", "gk-row");
    var again = GK.el("button", "gk-btn alt", "↺ Nuevo tablero");
    again.addEventListener("click", newRound);
    row.appendChild(again);
    area.appendChild(title);
    area.appendChild(grid);
    area.appendChild(row);
  }

  function flip(card, node) {
    if (lock || GK.modalOpen || node.classList.contains("up") || node.classList.contains("done")) return;
    node.classList.add("up");
    flipped.push(card);
    if (flipped.length < 2) return;
    lock = true;
    var a = flipped[0], b = flipped[1];
    if (a.id === b.id) {
      setTimeout(function () {
        var color = GK.team().c;
        [a, b].forEach(function (c) {
          c.node.classList.remove("up");
          c.node.classList.add("done");
          c.node.style.setProperty("--tc", color);
        });
        GK.award(1);
        found++;
        flipped = []; lock = false;
        if (found === total) setTimeout(function () { GK.endModal(GK.restart); }, 500);
      }, 500);
    } else {
      setTimeout(function () {
        a.node.classList.remove("up");
        b.node.classList.remove("up");
        flipped = []; lock = false;
        GK.next();
      }, 1100);
    }
  }

  GK.init({ start: newRound });
})();

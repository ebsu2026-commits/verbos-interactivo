/* Concurso de puntos — categories x 100..500; the value follows the question's difficulty. */
(function () {
  "use strict";
  var GK = window.GameKit;
  var VALUES = [100, 200, 300, 400, 500];
  var LEVELS = [1, 1, 2, 2, 3];          // difficulty asked in each row
  var board = [], used = 0, totalTiles = 0, seen = {};

  // five questions for a category, easy to hard, avoiding questions already used this session
  function buildColumn(topic) {
    var chosen = [];
    LEVELS.forEach(function (level) {
      var tries = [level, level - 1, level + 1, level - 2, level + 2];
      var pick = null;
      for (var i = 0; i < tries.length && !pick; i++) {
        var pool = topic.questions.filter(function (q) {
          return q.d === tries[i] && chosen.indexOf(q) === -1 && !seen[q.s + "|" + q.o[q.a]];
        });
        if (!pool.length) pool = topic.questions.filter(function (q) { return q.d === tries[i] && chosen.indexOf(q) === -1; });
        if (pool.length) pick = pool[Math.floor(Math.random() * pool.length)];
      }
      if (!pick) pick = GK.shuffle(topic.questions.filter(function (q) { return chosen.indexOf(q) === -1; }))[0];
      chosen.push(pick);
    });
    return chosen;
  }

  function build() {
    var area = GK.$("#gk-area");
    var topics = GK.topics().filter(function (t) { return t.questions.length >= VALUES.length; });
    if (!topics.length) {
      area.innerHTML = '<p class="gk-empty">No hay preguntas para este contenido. Elige otro tema.</p>';
      return;
    }
    board = GK.shuffle(topics).slice(0, 5).map(function (t) { return { title: t.title, qs: buildColumn(t) }; });
    used = 0;
    totalTiles = board.length * VALUES.length;
    area.innerHTML = "";

    var grid = GK.el("div", "jp-board");
    grid.style.gridTemplateColumns = "repeat(" + board.length + ", minmax(0, 1fr))";
    board.forEach(function (c) {
      var h = GK.el("div", "jp-head");
      h.textContent = c.title;
      grid.appendChild(h);
    });
    VALUES.forEach(function (v, r) {
      board.forEach(function (c) {
        var b = GK.el("button", "jp-tile");
        b.textContent = v;
        b.addEventListener("click", function () { open(c.qs[r], v, b); });
        grid.appendChild(b);
      });
    });
    var row = GK.el("div", "gk-row");
    var shuffle = GK.el("button", "gk-btn alt", "↺ Mezclar categorías");
    shuffle.addEventListener("click", build);
    row.appendChild(shuffle);
    area.appendChild(grid);
    area.appendChild(row);
  }

  function open(q, value, tile) {
    if (GK.modalOpen || GK.timer.isPaused()) return;
    seen[q.s + "|" + q.o[q.a]] = true;
    var box = GK.el("div");
    var head = GK.el("h2");
    head.textContent = "Equipo " + GK.team().name + " · " + value + " puntos";
    var cont = GK.el("button", "gk-btn", "Continuar →");
    cont.hidden = true;
    var card = GK.ask(q, function (ok) {
      if (ok) GK.award(value);
      cont.hidden = false;
    });
    box.appendChild(head);
    box.appendChild(card);
    box.appendChild(cont);
    var close = GK.modal(box);
    GK.timer.begin(function () { card.timeout(); });
    cont.addEventListener("click", function () {
      close();
      GK.timer.end();
      tile.disabled = true;
      used++;
      GK.next();
      if (used >= totalTiles) setTimeout(function () { GK.endModal(GK.restart); }, 300);
    });
  }

  GK.init({ id: "jeopardy", defaultTurn: 30, start: function () { seen = {}; build(); } });
})();

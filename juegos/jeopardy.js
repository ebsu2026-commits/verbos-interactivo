/* Concurso de puntos — board of categories x 100..500, one question per tile. */
(function () {
  "use strict";
  var GK = window.GameKit;
  var VALUES = [100, 200, 300, 400, 500];
  var board = [], used = 0, totalTiles = 0;

  function build() {
    var area = GK.$("#gk-area");
    var topics = GK.topics().filter(function (t) { return t.questions.length >= VALUES.length; });
    if (!topics.length) {
      area.innerHTML = '<p class="gk-empty">No hay preguntas para este contenido. Elige otro tema.</p>';
      return;
    }
    board = GK.shuffle(topics).slice(0, 5);
    used = 0;
    totalTiles = board.length * VALUES.length;
    area.innerHTML = "";

    var grid = GK.el("div", "jp-board");
    grid.style.gridTemplateColumns = "repeat(" + board.length + ", minmax(0, 1fr))";
    board.forEach(function (t) {
      var h = GK.el("div", "jp-head");
      h.textContent = t.title;
      grid.appendChild(h);
    });
    VALUES.forEach(function (v, r) {
      board.forEach(function (t) {
        var b = GK.el("button", "jp-tile");
        b.textContent = v;
        b.addEventListener("click", function () { open(t.questions[r], v, b); });
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
    if (GK.modalOpen) return;
    var box = GK.el("div");
    var head = GK.el("h2");
    head.textContent = "Equipo " + GK.team().name + " · " + value + " puntos";
    var card = GK.ask(q, function (ok) {
      if (ok) GK.award(value);
      cont.hidden = false;
    });
    var cont = GK.el("button", "gk-btn", "Continuar →");
    cont.hidden = true;
    box.appendChild(head);
    box.appendChild(card);
    box.appendChild(cont);
    var close = GK.modal(box);
    cont.addEventListener("click", function () {
      close();
      tile.disabled = true;
      used++;
      GK.next();
      if (used >= totalTiles) setTimeout(function () { GK.endModal(GK.restart); }, 300);
    });
  }

  GK.init({ start: build });
})();

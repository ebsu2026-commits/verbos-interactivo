/* Ordena la oración — put scrambled words in order; a wrong try passes the same sentence to the next team. */
(function () {
  "use strict";
  var GK = window.GameKit;
  var pool = [], idx = -1, cur = null, start = [], bank = [], answer = [], attempts = 0, solved = false;

  function scramble(tokens) {
    var s = GK.shuffle(tokens);
    for (var i = 0; i < 12 && s.join(" ") === tokens.join(" "); i++) s = GK.shuffle(tokens);
    return s;
  }

  function nextSentence() {
    if (!pool.length) {
      GK.$("#gk-area").innerHTML = '<p class="gk-empty">No hay oraciones para este contenido. Elige otro tema.</p>';
      return;
    }
    idx = (idx + 1) % pool.length;
    cur = pool[idx];
    var tokens = cur.t.split(" ");
    start = scramble(tokens).map(function (w, i) { return { w: w, id: i }; });
    bank = start.slice();
    answer = [];
    attempts = 0;
    solved = false;
    draw();
  }

  function chip(item, from) {
    var b = GK.el("button", "sb-chip");
    b.textContent = item.w;
    b.addEventListener("click", function () {
      if (solved || GK.modalOpen) return;
      var src = from === "bank" ? bank : answer;
      var dst = from === "bank" ? answer : bank;
      src.splice(src.indexOf(item), 1);
      dst.push(item);
      if (from === "answer") bank.sort(function (a, b) { return a.id - b.id; });
      zones();
    });
    return b;
  }

  function zones() {
    var a = GK.$("#sb-answer"), b = GK.$("#sb-bank");
    a.innerHTML = ""; b.innerHTML = "";
    answer.forEach(function (it) { a.appendChild(chip(it, "answer")); });
    bank.forEach(function (it) { b.appendChild(chip(it, "bank")); });
  }

  function draw() {
    var area = GK.$("#gk-area");
    area.innerHTML = "";
    var hint = GK.el("p", "sb-hint", "Toquen las palabras para armar la oración. Toquen de nuevo para quitarlas.");
    var ans = GK.el("div", "sb-zone sb-answer");
    ans.id = "sb-answer";
    var bnk = GK.el("div", "sb-zone sb-bank");
    bnk.id = "sb-bank";
    var msg = GK.el("p", "gk-msg");
    msg.id = "sb-msg";
    var row = GK.el("div", "gk-row");
    var check = GK.el("button", "gk-btn", "Comprobar ✓");
    var reset = GK.el("button", "gk-btn alt", "Reiniciar");
    var listen = GK.el("button", "gk-btn alt", "🔊 Escuchar");
    var next = GK.el("button", "gk-btn", "Siguiente oración →");
    listen.hidden = true; next.hidden = true;
    check.addEventListener("click", function () { checkAnswer(check, reset, listen, next); });
    reset.addEventListener("click", function () { if (solved) return; bank = start.slice(); answer = []; zones(); });
    listen.addEventListener("click", function () { GK.play(cur.a); });
    next.addEventListener("click", function () { nextSentence(); GK.next(); });
    [check, reset, listen, next].forEach(function (b) { row.appendChild(b); });
    area.appendChild(hint);
    area.appendChild(ans);
    area.appendChild(bnk);
    area.appendChild(msg);
    area.appendChild(row);
    zones();
  }

  function finish(check, reset, listen, next) {
    solved = true;
    check.hidden = true; reset.hidden = true;
    next.hidden = false;
    listen.hidden = !cur.a;
    zones();
  }

  function checkAnswer(check, reset, listen, next) {
    if (solved || GK.modalOpen) return;
    var msg = GK.$("#sb-msg");
    if (answer.length !== start.length) {
      msg.className = "gk-msg no";
      msg.textContent = "Faltan palabras por colocar.";
      return;
    }
    var got = answer.map(function (i) { return i.w; }).join(" ");
    if (got === cur.t) {
      GK.award(2);
      msg.className = "gk-msg ok";
      msg.textContent = "✓ ¡Correcto! +2 puntos para el equipo " + GK.team().name + ".";
      GK.play(cur.a);
      finish(check, reset, listen, next);
      return;
    }
    attempts++;
    var box = GK.$("#sb-answer");
    box.classList.remove("shake");
    void box.offsetWidth;
    box.classList.add("shake");
    if (attempts >= GK.teams.length) {
      msg.className = "gk-msg no";
      msg.textContent = "Nadie lo logró. Respuesta: " + cur.t;
      answer = cur.t.split(" ").map(function (w, i) { return { w: w, id: i }; });
      bank = [];
      finish(check, reset, listen, next);
      return;
    }
    msg.className = "gk-msg no";
    msg.textContent = "✗ No es así. Le toca al siguiente equipo con la misma oración.";
    bank = start.slice();
    answer = [];
    GK.next();
    zones();
  }

  GK.init({
    start: function () {
      pool = GK.shuffle(GK.sentences());
      idx = -1;
      nextSentence();
    },
  });
})();

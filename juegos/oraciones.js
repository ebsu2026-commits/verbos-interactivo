/* Ordena la oración — put scrambled words in order; a wrong try (or the timer) passes the same sentence to the next team. */
(function () {
  "use strict";
  var GK = window.GameKit;
  var nextSentenceFn = null, cur = null, start = [], bank = [], answer = [], attempts = 0, solved = false, ui = {};

  function scramble(tokens) {
    var s = GK.shuffle(tokens);
    for (var i = 0; i < 12 && s.join(" ") === tokens.join(" "); i++) s = GK.shuffle(tokens);
    return s;
  }

  function attemptStart() { GK.timer.begin(onTimeout); }
  function onTimeout() {
    if (solved) return;
    failAttempt("⏰ Se acabó el tiempo.");
  }

  function nextSentence() {
    cur = nextSentenceFn();
    if (!cur) {
      GK.$("#gk-area").innerHTML = '<p class="gk-empty">No hay oraciones para este contenido. Elige otro tema.</p>';
      return;
    }
    var tokens = cur.t.split(" ");
    start = scramble(tokens).map(function (w, i) { return { w: w, id: i }; });
    bank = start.slice();
    answer = [];
    attempts = 0;
    solved = false;
    draw();
    attemptStart();
  }

  function chip(item, from) {
    var b = GK.el("button", "sb-chip");
    b.textContent = item.w;
    b.addEventListener("click", function () {
      if (solved || GK.modalOpen || GK.timer.isPaused()) return;
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
    ui.check = GK.el("button", "gk-btn", "Comprobar ✓");
    ui.reset = GK.el("button", "gk-btn alt", "Reiniciar");
    ui.listen = GK.el("button", "gk-btn alt", "🔊 Escuchar");
    ui.next = GK.el("button", "gk-btn", "Siguiente oración →");
    ui.listen.hidden = true; ui.next.hidden = true;
    ui.check.addEventListener("click", checkAnswer);
    ui.reset.addEventListener("click", function () { if (solved) return; bank = start.slice(); answer = []; zones(); });
    ui.listen.addEventListener("click", function () { GK.play(cur.a); });
    ui.next.addEventListener("click", function () { nextSentence(); GK.next(); });
    [ui.check, ui.reset, ui.listen, ui.next].forEach(function (b) { row.appendChild(b); });
    area.appendChild(hint);
    area.appendChild(ans);
    area.appendChild(bnk);
    area.appendChild(msg);
    area.appendChild(row);
    zones();
  }

  function finish() {
    solved = true;
    GK.timer.end();
    ui.check.hidden = true; ui.reset.hidden = true;
    ui.next.hidden = false;
    ui.listen.hidden = !cur.a;
    zones();
  }

  // one failed attempt (wrong order or time out): pass to the next team, or reveal after every team tried
  function failAttempt(prefix) {
    var msg = GK.$("#sb-msg");
    var box = GK.$("#sb-answer");
    box.classList.remove("shake");
    void box.offsetWidth;
    box.classList.add("shake");
    GK.sfx("no");
    attempts++;
    if (attempts >= GK.teams.length) {
      msg.className = "gk-msg no";
      msg.textContent = prefix + " Nadie lo logró. Respuesta: " + cur.t;
      answer = cur.t.split(" ").map(function (w, i) { return { w: w, id: i }; });
      bank = [];
      finish();
      return;
    }
    msg.className = "gk-msg no";
    msg.textContent = prefix + " Le toca al siguiente equipo con la misma oración.";
    bank = start.slice();
    answer = [];
    GK.next();
    zones();
    attemptStart();
  }

  function checkAnswer() {
    if (solved || GK.modalOpen || GK.timer.isPaused()) return;
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
      finish();
      return;
    }
    failAttempt("✗ No es así.");
  }

  GK.init({
    id: "oraciones",
    defaultTurn: 60,
    start: function () {
      nextSentenceFn = GK.picker(GK.sentences());
      nextSentence();
    },
  });
})();

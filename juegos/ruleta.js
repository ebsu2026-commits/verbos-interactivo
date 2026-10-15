/* Ruleta de retos — spin to get a question, a speaking challenge, a bonus or a trap. */
(function () {
  "use strict";
  var GK = window.GameKit;
  var SEGMENTS = [
    { k: "q", label: "❓ Pregunta", c: "#8ecbe0" },
    { k: "speak", label: "🗣 Habla", c: "#ef8f66" },
    { k: "bonus", label: "🎁 +2", c: "#8ee0b0" },
    { k: "q", label: "❓ Pregunta", c: "#f0c94a" },
    { k: "speak", label: "🗣 Habla", c: "#c9a4f0" },
    { k: "lose", label: "💣 −1", c: "#e57373" },
    { k: "q", label: "❓ Pregunta", c: "#8ecbe0" },
    { k: "bonus", label: "🎁 +2", c: "#f0a94a" },
  ];
  var STEP = 360 / SEGMENTS.length;
  var angle = 0, spinning = false, disc = null, spinBtn = null, nextQ = null, nextPrompt = null;

  function build() {
    var area = GK.$("#gk-area");
    area.innerHTML = "";
    nextQ = GK.picker(GK.questions());
    nextPrompt = GK.picker(GK.prompts());
    var wheel = GK.el("div", "wh");
    disc = GK.el("div", "wh-disc");
    var stops = SEGMENTS.map(function (s, i) { return s.c + " " + i * STEP + "deg " + (i + 1) * STEP + "deg"; });
    disc.style.background = "conic-gradient(" + stops.join(",") + ")";
    SEGMENTS.forEach(function (s, i) {
      var lab = GK.el("div", "wh-label");
      lab.style.transform = "rotate(" + (i * STEP + STEP / 2) + "deg)";
      var sp = GK.el("span");
      sp.textContent = s.label;
      lab.appendChild(sp);
      disc.appendChild(lab);
    });
    wheel.appendChild(disc);
    wheel.appendChild(GK.el("div", "wh-pointer"));
    wheel.appendChild(GK.el("div", "wh-hub"));
    spinBtn = GK.el("button", "gk-primary", "🎡 ¡Girar!");
    spinBtn.addEventListener("click", spin);
    area.appendChild(wheel);
    area.appendChild(spinBtn);
    angle = 0;
    spinning = false;
  }

  function spin() {
    if (spinning || GK.modalOpen || GK.timer.isPaused()) return;
    spinning = true;
    spinBtn.disabled = true;
    angle += 1440 + Math.floor(Math.random() * 360);
    disc.style.transform = "rotate(" + angle + "deg)";
    setTimeout(function () {
      var r = ((angle % 360) + 360) % 360;
      var idx = Math.floor(((360 - r) % 360) / STEP) % SEGMENTS.length;
      if (!GK.active) return;
      result(SEGMENTS[idx]);
    }, 4400);
  }

  function done(close) {
    close();
    GK.timer.end();
    spinning = false;
    spinBtn.disabled = false;
    GK.next();
  }

  function result(seg) {
    var box = GK.el("div");
    var head = GK.el("h2");
    head.textContent = "Equipo " + GK.team().name + " · " + seg.label;
    box.appendChild(head);
    var cont = GK.el("button", "gk-btn", "Continuar →");
    var close;
    var timer = null;

    if (seg.k === "q") {
      var q = nextQ();
      if (!q) { box.appendChild(GK.el("p", "gk-big", "No hay preguntas para este contenido.")); }
      else {
        var card = GK.ask(q, function (ok) { if (ok) GK.award(1); cont.hidden = false; });
        cont.hidden = true;
        box.appendChild(card);
        timer = function () { card.timeout(); };
      }
      box.appendChild(cont);
    } else if (seg.k === "speak") {
      var p = nextPrompt();
      var big = GK.el("p", "gk-big");
      big.textContent = p ? p.p : "Di una oración libre con lo que aprendimos.";
      box.appendChild(big);
      var warn = GK.el("p", "gk-msg no");
      box.appendChild(warn);
      var row = GK.el("div", "gk-row");
      var yes = GK.el("button", "gk-btn", "✓ Lo logró (+2)");
      var no = GK.el("button", "gk-btn alt", "✗ Todavía no (0)");
      yes.addEventListener("click", function () { GK.award(2); done(close); });
      no.addEventListener("click", function () { done(close); });
      row.appendChild(yes);
      row.appendChild(no);
      box.appendChild(row);
      timer = function () { warn.textContent = "⏰ ¡Se acabó el tiempo! El docente decide."; };
    } else if (seg.k === "bonus") {
      var b = GK.el("p", "gk-big");
      b.textContent = "¡Punto extra! +2 para el equipo " + GK.team().name + ".";
      box.appendChild(b);
      GK.award(2);
      box.appendChild(cont);
    } else {
      var l = GK.el("p", "gk-big");
      l.textContent = "¡Trampa! El equipo " + GK.team().name + " pierde 1 punto.";
      box.appendChild(l);
      GK.award(-1);
      box.appendChild(cont);
    }
    close = GK.modal(box);
    if (timer) GK.timer.begin(timer);
    cont.addEventListener("click", function () { done(close); });
  }

  GK.init({ id: "ruleta", defaultTurn: 30, start: build });
})();

/* Arma la escena — a scene with hidden pieces: the team names an object, the teacher reveals it to check. */
(function () {
  "use strict";
  var GK = window.GameKit;
  var pick = null, slots = [], selected = null, phase = "pick", hint = true, round = 0;
  var stage, msg, bar, titleP;

  function hidden() { return slots.filter(function (s) { return !s.rev; }).length; }
  function say(text, cls) { msg.className = "gk-msg" + (cls ? " " + cls : ""); msg.textContent = text; }
  function turnStart() { GK.timer.begin(onTimeout); }
  function blocked() { return GK.modalOpen || GK.timer.isPaused(); }

  function start() {
    pick = GK.picker(GK.scenes());
    newScene();
  }

  function newScene() {
    var sc = pick();
    var area = GK.$("#gk-area");
    if (!sc) {
      area.innerHTML = '<p class="gk-empty">No hay escenas para este contenido. Elige «Todos los temas» o un tema de vocabulario.</p>';
      return;
    }
    round++; selected = null; phase = "pick"; slots = [];
    area.innerHTML = "";
    titleP = GK.el("p", "sc-title");
    stage = GK.el("div", "sc-stage sc-" + sc.bg);
    if (sc.bg === "face") stage.appendChild(GK.el("div", "sc-faceshape"));
    sc.items.forEach(function (it, i) {
      var b = GK.el("button", "sc-slot hid" + (hint ? "" : " nohint") + (it.l ? " side-" + it.l : ""));
      b.style.left = it.x + "%";
      b.style.top = it.y + "%";
      b.style.setProperty("--s", it.s);
      b.setAttribute("aria-label", "Pieza " + (i + 1));
      b.innerHTML = '<span class="sc-ico"></span><span class="sc-num">' + (i + 1) + '</span><span class="sc-label"><span class="w"></span><small></small></span>';
      b.querySelector(".sc-ico").textContent = it.e;
      b.querySelector(".w").textContent = it.w;
      b.querySelector("small").textContent = it.es;
      var slot = { item: it, node: b, rev: false };
      b.addEventListener("click", function () { choose(slot); });
      slots.push(slot);
      stage.appendChild(b);
    });
    msg = GK.el("p", "gk-msg");
    bar = GK.el("div", "sc-bar");
    area.appendChild(titleP);
    area.appendChild(stage);
    area.appendChild(msg);
    area.appendChild(bar);
    paintTitle(sc);
    paintBar();
    say("Elijan una pieza y digan qué objeto es.");
    turnStart();
    area._scene = sc;
  }

  function paintTitle(sc) {
    titleP.innerHTML = "Completen la escena: <strong>" + GK.esc(sc.title) + "</strong> · quedan " + hidden() + " por descubrir";
  }

  function button(label, cls, fn, disabled) {
    var b = GK.el("button", "gk-btn" + (cls ? " " + cls : ""), label);
    b.disabled = !!disabled;
    b.addEventListener("click", fn);
    bar.appendChild(b);
    return b;
  }

  function paintBar() {
    bar.innerHTML = "";
    if (phase === "pick") {
      button("👁 Mostrar", "", reveal, !selected);
      button("Siluetas: " + (hint ? "sí" : "no"), "alt", function () {
        hint = !hint;
        slots.forEach(function (s) { s.node.classList.toggle("nohint", !hint); });
        paintBar();
      });
    } else if (phase === "judge") {
      button("✓ Lo dijo bien (+2)", "ok", function () { judge(true); });
      button("✗ No acertó", "bad", function () { judge(false); });
    } else {
      button("➡ Otra escena", "", newScene);
      button("🏁 Terminar partida", "alt", function () { GK.endModal(GK.restart); });
    }
  }

  function choose(slot) {
    if (phase !== "pick" || slot.rev || blocked()) return;
    selected = slot;
    slots.forEach(function (s) { s.node.classList.toggle("sel", s === slot); });
    say("Pieza " + (slots.indexOf(slot) + 1) + ": ¿qué objeto es? Cuando lo digan, toca «Mostrar».");
    paintBar();
  }

  function show(slot, cls) {
    slot.rev = true;
    slot.node.classList.remove("hid", "sel");
    slot.node.classList.add("rev");
    if (cls) slot.node.classList.add(cls);
    GK.play(slot.item.a);
  }

  function reveal() {
    if (phase !== "pick" || !selected || blocked()) return;
    GK.timer.end();
    show(selected);
    phase = "judge";
    say("¿Era ese el objeto que dijo el equipo?");
    paintBar();
  }

  function judge(ok) {
    if (phase !== "judge" || blocked()) return;
    var slot = selected;
    slot.node.classList.add(ok ? "hit" : "miss");
    selected = null;
    if (ok) GK.award(2); else { GK.sfx("no"); GK.next(); }
    afterPiece(ok ? "✓ ¡Muy bien!" : "✗ Esa pieza era otra. Pasa el turno.", ok ? "ok" : "no");
  }

  function afterPiece(text, cls) {
    phase = hidden() ? "pick" : "done";
    paintTitle(GK.$("#gk-area")._scene);
    if (phase === "done") {
      GK.timer.end();
      GK.sfx("ok");
      say("🎉 ¡Escena completa!", "ok");
    } else {
      say(text, cls);
      turnStart();
    }
    paintBar();
  }

  function onTimeout() {
    if (phase !== "pick") { turnStart(); return; }
    if (selected) {
      var slot = selected;
      selected = null;
      show(slot, "miss");
      GK.next();
      afterPiece("⏰ Se acabó el tiempo: era «" + slot.item.w + "». Pasa el turno.", "no");
    } else {
      GK.next();
      say("⏰ Se acabó el tiempo: pasa el turno.", "no");
      turnStart();
    }
  }

  GK.init({ id: "escena", defaultTurn: 60, start: start });
})();

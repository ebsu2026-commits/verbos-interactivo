/* Aprender jugando — shared engine: setup, teams, scoreboard, timers, sounds, questions, modals. */
(function () {
  "use strict";

  var TEAM_COLORS = [
    { name: "Rojo", c: "#ef8f66" },
    { name: "Azul", c: "#8ecbe0" },
    { name: "Verde", c: "#8ee0b0" },
    { name: "Amarillo", c: "#f0c94a" },
  ];
  var STORE = "verbos-juegos-v1";

  var GK = (window.GameKit = {
    teams: [], turn: 0, lang: "en", group: "all", nTeams: 2,
    turnSeconds: 0, gameMinutes: 0, sel: {}, modalOpen: false, active: false,
  });

  function $(sel, root) { return (root || document).querySelector(sel); }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  GK.$ = $;
  GK.el = el;
  GK.esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  };
  GK.shuffle = function (a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };
  // letters without accents, uppercase; the "oe" ligature counts as O
  GK.norm = function (s) {
    return s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/œ/gi, "o").toUpperCase();
  };
  // endless no-repeat picker: every item is used once before any repeats
  GK.picker = function (list) {
    var order = [];
    return function () {
      if (!list.length) return null;
      if (!order.length) order = GK.shuffle(list);
      return order.pop();
    };
  };

  // ------------------------------------------------------------ saved settings
  var cfg = { lang: null, group: "all", nTeams: 2, minutes: 0, sound: true, names: [], turn: {}, sel: {} };
  try {
    var raw = JSON.parse(localStorage.getItem(STORE));
    if (raw && typeof raw === "object") for (var k in raw) cfg[k] = raw[k];
  } catch (e) { /* no storage: fine */ }
  function save() { try { localStorage.setItem(STORE, JSON.stringify(cfg)); } catch (e) { /* ignore */ } }

  // ------------------------------------------------------------------- data
  GK.data = function () { return window.GAME_DATA[GK.lang]; };
  function selGroups() {
    var set = {};
    GK.data().groups.forEach(function (g) {
      g.topics.forEach(function (t) { if (GK.sel[t.title]) set[g.name] = true; });
    });
    return set;
  }
  function match(item) {
    if (GK.group === "all") return true;
    if (GK.group !== "custom") return item.g === GK.group;
    if (item.tp) return !!GK.sel[item.tp];
    return !!selGroups()[item.g];
  }
  GK.topics = function () {
    var out = [];
    GK.data().groups.forEach(function (g) {
      g.topics.forEach(function (t) {
        var ok = GK.group === "all" || (GK.group === "custom" ? GK.sel[t.title] : g.name === GK.group);
        if (ok) out.push(t);
      });
    });
    return out;
  };
  GK.questions = function () {
    var out = [];
    GK.topics().forEach(function (t) { t.questions.forEach(function (q) { out.push(q); }); });
    return out;
  };
  GK.sentences = function () { return GK.data().sentences.filter(match); };
  GK.pairSets = function () { return GK.data().pairSets.filter(match); };
  GK.words = function () { return GK.data().words.filter(match); };
  GK.prompts = function () { return GK.data().prompts.filter(match); };
  GK.scenes = function () { return GK.data().scenes.filter(match); };

  // ------------------------------------------------------------------ sounds
  var ac = null;
  function tone(freq, start, dur, type, vol) {
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      if (ac.state === "suspended") ac.resume();
      var o = ac.createOscillator(), g = ac.createGain();
      o.type = type || "sine"; o.frequency.value = freq;
      g.gain.value = 0.0001;
      o.connect(g); g.connect(ac.destination);
      var t0 = ac.currentTime + start;
      g.gain.exponentialRampToValueAtTime(vol || 0.15, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.start(t0); o.stop(t0 + dur + 0.05);
    } catch (e) { /* sound is optional */ }
  }
  GK.sfx = function (kind) {
    if (!cfg.sound || !GK.active || document.hidden || T.paused) return;
    if (kind === "tick") tone(880, 0, 0.08, "square", 0.06);
    else if (kind === "ok") { tone(660, 0, 0.12, "sine", 0.15); tone(990, 0.12, 0.18, "sine", 0.15); }
    else if (kind === "no") { tone(220, 0, 0.25, "sawtooth", 0.1); }
    else if (kind === "end") { tone(520, 0, 0.18, "square", 0.1); tone(390, 0.2, 0.18, "square", 0.1); tone(260, 0.4, 0.35, "square", 0.1); }
  };

  // ---------------------------------------------------------------- scoreboard
  GK.render = function () {
    var box = $("#gk-scoreboard");
    box.innerHTML = "";
    var grid = el("div", "gk-scores");
    GK.teams.forEach(function (t, i) {
      var d = el("div", "gk-team" + (i === GK.turn ? " active" : ""));
      d.style.setProperty("--tc", t.c);
      d.innerHTML =
        '<div class="gk-name">' + GK.esc(t.name) + (i === GK.turn ? " · turno" : "") + "</div>" +
        '<div class="gk-score">' + t.score + "</div>" +
        '<div class="gk-adj"><button data-d="-1" aria-label="Restar un punto">−1</button><button data-d="1" aria-label="Sumar un punto">+1</button></div>';
      d.addEventListener("click", function (e) {
        var b = e.target.closest("button");
        if (b) { t.score += parseInt(b.dataset.d, 10); } else { GK.turn = i; }
        GK.render();
      });
      grid.appendChild(d);
    });
    box.appendChild(grid);
  };
  GK.award = function (n, idx) {
    var t = GK.teams[idx == null ? GK.turn : idx];
    t.score = Math.max(0, t.score + n);
    GK.render();
    GK.sfx(n > 0 ? "ok" : "no");
  };
  GK.next = function () {
    GK.turn = (GK.turn + 1) % GK.teams.length;
    GK.render();
  };
  GK.team = function () { return GK.teams[GK.turn]; };

  // ------------------------------------------------------------------ timers
  var T = { running: false, total: 0, left: 0, cb: null, paused: false, gLeft: 0, gActive: false, last: 0, iv: null, lastSec: -1, idle: 0 };
  function fmt(sec) {
    sec = Math.max(0, Math.ceil(sec));
    var m = Math.floor(sec / 60), s = sec % 60;
    return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
  }
  function paintClock() {
    var box = $("#gk-clock");
    if (!box) return;
    var hasTurn = GK.turnSeconds > 0, hasGame = GK.gameMinutes > 0;
    box.hidden = !(hasTurn || hasGame);
    $(".gk-turnclock", box).style.display = hasTurn ? "" : "none";
    $(".gk-gameclock", box).style.display = hasGame ? "" : "none";
    var frac = T.running ? T.left / T.total : 0;
    $("#gk-tnum").textContent = T.running ? Math.ceil(T.left) : "—";
    $("#gk-tfill").style.width = Math.max(0, Math.min(1, frac)) * 100 + "%";
    box.classList.toggle("warn", T.running && frac <= 0.5 && frac > 0.25);
    box.classList.toggle("low", T.running && frac <= 0.25);
    if (hasGame) $("#gk-gtime").textContent = fmt(T.gLeft);
  }
  function tick() {
    var now = performance.now();
    var dt = (now - T.last) / 1000;
    T.last = now;
    if (T.paused) return;
    if (T.running) {
      T.left -= dt;
      var sec = Math.ceil(T.left);
      if (sec <= 3 && sec > 0 && sec !== T.lastSec) { T.lastSec = sec; GK.sfx("tick"); }
      if (T.left <= 0) {
        T.running = false; T.left = 0;
        var cb = T.cb; T.cb = null;
        T.idle++;
        GK.sfx("end");
        paintClock();
        if (cb) cb();
        if (T.idle >= 3 && GK.active) setPaused(true, "⏸ Pausa automática: nadie respondió en 3 turnos seguidos");
      }
    }
    if (T.gActive) {
      T.gLeft -= dt;
      if (T.gLeft <= 0) {
        T.gActive = false; T.gLeft = 0;
        GK.timer.end();
        GK.closeModals();
        GK.sfx("end");
        paintClock();
        GK.endModal(GK.restart, "⏱ ¡Se acabó el tiempo!");
      }
    }
    paintClock();
  }
  GK.timer = {
    // start the per-turn countdown; onExpire runs once if it reaches zero
    begin: function (onExpire, seconds) {
      if (!GK.active || !GK.turnSeconds) { T.running = false; T.cb = null; paintClock(); return; }
      T.total = T.left = seconds || GK.turnSeconds;
      T.cb = onExpire || null;
      T.running = true;
      T.lastSec = -1;
      paintClock();
    },
    end: function () { T.running = false; T.cb = null; paintClock(); },
    isPaused: function () { return T.paused; },
  };
  function setPaused(p, why) {
    T.paused = p;
    var ov = $("#gk-pause-ov");
    if (p && !ov) {
      ov = el("div", "gk-pause-ov");
      ov.id = "gk-pause-ov";
      ov.innerHTML = '<p class="gk-pause-title">' + (why || "⏸ En pausa") + "</p>";
      var b = el("button", "gk-primary", "▶ Reanudar");
      b.addEventListener("click", function () { setPaused(false); });
      ov.appendChild(b);
      document.body.appendChild(ov);
    } else if (!p && ov) { ov.parentNode.removeChild(ov); }
    var pb = $("#gk-pause");
    if (pb) pb.textContent = p ? "▶ Reanudar" : "⏸ Pausa";
    if (!p) T.idle = 0;
    T.last = performance.now();
  }
  function clockStart() {
    GK.active = true;
    T.idle = 0;
    T.running = false; T.cb = null;
    T.gLeft = GK.gameMinutes * 60;
    T.gActive = GK.gameMinutes > 0;
    T.last = performance.now();
    setPaused(false);
    if (!T.iv) T.iv = setInterval(tick, 100);
    paintClock();
  }
  function clockStop() {
    GK.active = false;
    T.running = false; T.gActive = false; T.cb = null;
    setPaused(false);
    paintClock();
  }

  function autoPause() {
    if (GK.active && !T.paused && (T.running || T.gActive)) setPaused(true, "⏸ Pausa automática");
  }
  document.addEventListener("visibilitychange", function () { if (document.hidden) autoPause(); });
  window.addEventListener("blur", autoPause);
  ["pointerdown", "keydown"].forEach(function (ev) {
    document.addEventListener(ev, function () { T.idle = 0; }, true);
  });
  window.addEventListener("pagehide", function () {
    GK.active = false;
    try { if (ac) ac.close(); } catch (e) { /* ignore */ }
  });

  // ------------------------------------------------------------------ modals
  var openModals = [];
  GK.modal = function (node) {
    var ov = el("div", "gk-overlay");
    var card = el("div", "gk-modal");
    card.appendChild(node);
    ov.appendChild(card);
    document.body.appendChild(ov);
    openModals.push(ov);
    GK.modalOpen = true;
    return function () {
      if (ov.parentNode) ov.parentNode.removeChild(ov);
      openModals = openModals.filter(function (x) { return x !== ov; });
      GK.modalOpen = openModals.length > 0;
    };
  };
  GK.closeModals = function () {
    openModals.forEach(function (ov) { if (ov.parentNode) ov.parentNode.removeChild(ov); });
    openModals = [];
    GK.modalOpen = false;
  };

  var KIND_LABEL = { fill: "Completa la oración", vocab: "Vocabulario", form: "Conjugación", choose: "Elige la oración correcta" };

  // multiple-choice question card; calls onDone(correct, timedOut) once. card.timeout() forces a miss.
  GK.ask = function (q, onDone) {
    var wrap = el("div", "gk-q");
    var text = GK.esc(q.s).replace("___", '<span class="gk-blank">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');
    wrap.innerHTML = '<p class="gk-q-label">' + (KIND_LABEL[q.k] || KIND_LABEL.fill) + '</p><p class="gk-q-text">' + text + "</p>";
    var opts = el("div", "gk-q-opts");
    var fb = el("p", "gk-q-fb");
    var answered = false;
    function reveal() {
      opts.querySelectorAll("button").forEach(function (x) {
        x.disabled = true;
        if (x.dataset.ok === "1") x.classList.add("correct");
      });
    }
    var items = q.o.map(function (t, i) { return { t: t, ok: i === q.a }; });
    GK.shuffle(items).forEach(function (o) {
      var b = el("button");
      b.textContent = o.t;
      b.dataset.ok = o.ok ? "1" : "0";
      b.addEventListener("click", function () {
        if (answered) return;
        answered = true;
        reveal();
        GK.timer.end();
        if (o.ok) { fb.textContent = "✓ ¡Correcto!"; fb.className = "gk-q-fb ok"; GK.sfx("ok"); }
        else { b.classList.add("wrong"); fb.textContent = "✗ Incorrecto"; fb.className = "gk-q-fb no"; GK.sfx("no"); }
        if (onDone) onDone(o.ok, false);
      });
      opts.appendChild(b);
    });
    wrap.appendChild(opts);
    wrap.appendChild(fb);
    wrap.timeout = function () {
      if (answered) return;
      answered = true;
      reveal();
      fb.textContent = "⏰ ¡Se acabó el tiempo!";
      fb.className = "gk-q-fb no";
      if (onDone) onDone(false, true);
    };
    return wrap;
  };

  GK.endModal = function (onAgain, title) {
    if (!GK.active) return;
    GK.timer.end();
    if (window.mieTrack) window.mieTrack("game_end", { game: GK.gameId, lang: GK.lang, teams: GK.teams.length });
    var max = Math.max.apply(null, GK.teams.map(function (t) { return t.score; }));
    var sorted = GK.teams.slice().sort(function (a, b) { return b.score - a.score; });
    var winners = GK.teams.filter(function (t) { return t.score === max; });
    var box = el("div");
    box.innerHTML =
      "<h2>🏆 " + (title || "¡Fin del juego!") + "</h2>" +
      '<p class="gk-big">' + (winners.length > 1 ? "¡Empate!" : "Ganó el equipo <strong style=\"color:" + winners[0].c + '">' + GK.esc(winners[0].name) + "</strong>") + "</p>";
    var ul = el("ul", "gk-end-list");
    sorted.forEach(function (t) {
      var li = el("li", t.score === max ? "win" : "");
      li.innerHTML = '<span style="color:' + t.c + '">' + GK.esc(t.name) + "</span><span>" + t.score + "</span>";
      ul.appendChild(li);
    });
    box.appendChild(ul);
    var row = el("div", "gk-row");
    var again = el("button", "gk-btn", "↺ Jugar otra ronda");
    var close = el("button", "gk-btn alt", "Cerrar");
    row.appendChild(again);
    row.appendChild(close);
    box.appendChild(row);
    var closeModal = GK.modal(box);
    again.addEventListener("click", function () { closeModal(); if (onAgain) onAgain(); });
    close.addEventListener("click", closeModal);
  };

  GK.play = function (file) {
    if (!file) return;
    try { new Audio("audio/" + file).play(); } catch (e) { /* audio is optional */ }
  };

  // ------------------------------------------------------------------- setup
  GK.init = function (game) {
    var params = new URLSearchParams(location.search);
    GK.lang = params.get("lang") === "fr" || params.get("lang") === "en" ? params.get("lang") : (cfg.lang === "fr" ? "fr" : "en");
    GK.group = cfg.group || "all";
    GK.nTeams = cfg.nTeams || 2;
    GK.gameMinutes = cfg.minutes || 0;
    GK.gameId = game.id;
    var turnSaved = cfg.turn && cfg.turn[game.id];
    GK.turnSeconds = turnSaved != null ? turnSaved : (game.defaultTurn != null ? game.defaultTurn : 30);

    var langBox = $("#gk-lang"), teamBox = $("#gk-teams"), sel = $("#gk-group");
    var turnBox = $("#gk-turn"), minBox = $("#gk-minutes"), namesBox = $("#gk-names"), topicsBox = $("#gk-topics");
    var setup = $("#gk-setup"), stage = $("#gk-stage"), rules = $("#gk-rules"), note = $("#gk-note");

    function mark(box, value) {
      box.querySelectorAll("button").forEach(function (b) { b.classList.toggle("on", b.dataset.v === String(value)); });
    }
    function currentSel() { return (cfg.sel && cfg.sel[GK.lang]) || null; }

    function fillGroups() {
      var prev = GK.group;
      sel.innerHTML = "";
      var all = el("option"); all.value = "all"; all.textContent = "Todos los temas (mezcla)"; sel.appendChild(all);
      GK.data().groups.forEach(function (g) {
        var o = el("option"); o.value = g.name; o.textContent = g.name; sel.appendChild(o);
      });
      var custom = el("option"); custom.value = "custom"; custom.textContent = "Elegir temas…"; sel.appendChild(custom);
      var ok = Array.prototype.some.call(sel.options, function (o) { return o.value === prev; });
      sel.value = ok ? prev : "all";
      GK.group = sel.value;
      fillTopics();
    }
    function fillTopics() {
      topicsBox.innerHTML = "";
      topicsBox.hidden = GK.group !== "custom";
      var saved = currentSel();
      GK.data().groups.forEach(function (g) {
        var h = el("p", "gk-topics-group"); h.textContent = g.name; topicsBox.appendChild(h);
        var row = el("div", "gk-topics-row");
        g.topics.forEach(function (t) {
          var lab = el("label", "gk-check");
          var cb = el("input"); cb.type = "checkbox"; cb.value = t.title;
          cb.checked = saved ? saved.indexOf(t.title) !== -1 : true;
          lab.appendChild(cb);
          lab.appendChild(document.createTextNode(" " + t.title));
          row.appendChild(lab);
        });
        topicsBox.appendChild(row);
      });
      var acts = el("div", "gk-row");
      var all = el("button", "gk-ghost", "Marcar todo"), none = el("button", "gk-ghost", "Quitar todo");
      all.type = none.type = "button";
      all.addEventListener("click", function () { topicsBox.querySelectorAll("input").forEach(function (c) { c.checked = true; }); });
      none.addEventListener("click", function () { topicsBox.querySelectorAll("input").forEach(function (c) { c.checked = false; }); });
      acts.appendChild(all); acts.appendChild(none);
      topicsBox.appendChild(acts);
    }
    function fillNames() {
      namesBox.innerHTML = "";
      for (var i = 0; i < GK.nTeams; i++) {
        var inp = el("input");
        inp.type = "text"; inp.maxLength = 14;
        inp.value = (cfg.names && cfg.names[i]) || TEAM_COLORS[i].name;
        inp.dataset.i = i;
        inp.style.borderColor = TEAM_COLORS[i].c;
        inp.setAttribute("aria-label", "Nombre del equipo " + (i + 1));
        namesBox.appendChild(inp);
      }
    }

    langBox.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      GK.lang = b.dataset.v; mark(langBox, GK.lang); fillGroups();
    });
    teamBox.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      GK.nTeams = parseInt(b.dataset.v, 10); mark(teamBox, GK.nTeams); fillNames();
    });
    turnBox.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      GK.turnSeconds = parseInt(b.dataset.v, 10); mark(turnBox, GK.turnSeconds);
    });
    minBox.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      GK.gameMinutes = parseInt(b.dataset.v, 10); mark(minBox, GK.gameMinutes);
    });
    sel.addEventListener("change", function () { GK.group = sel.value; fillTopics(); });

    mark(langBox, GK.lang);
    mark(teamBox, GK.nTeams);
    mark(turnBox, GK.turnSeconds);
    mark(minBox, GK.gameMinutes);
    fillGroups();
    fillNames();

    function begin() {
      GK.group = sel.value;
      GK.sel = {};
      if (GK.group === "custom") {
        var chosen = [];
        topicsBox.querySelectorAll("input:checked").forEach(function (c) { GK.sel[c.value] = true; chosen.push(c.value); });
        if (!chosen.length) { note.textContent = "Elige al menos un tema."; note.hidden = false; return; }
        cfg.sel = cfg.sel || {};
        cfg.sel[GK.lang] = chosen;
      }
      note.hidden = true;
      var names = [];
      namesBox.querySelectorAll("input").forEach(function (inp, i) { names.push(inp.value.trim() || TEAM_COLORS[i].name); });
      cfg.names = names;
      cfg.lang = GK.lang; cfg.group = GK.group; cfg.nTeams = GK.nTeams; cfg.minutes = GK.gameMinutes;
      cfg.turn = cfg.turn || {}; cfg.turn[game.id] = GK.turnSeconds;
      save();

      GK.teams = TEAM_COLORS.slice(0, GK.nTeams).map(function (t, i) { return { name: names[i], c: t.c, score: 0 }; });
      GK.turn = 0;
      GK.closeModals();
      setup.hidden = true; rules.hidden = true; stage.hidden = false;
      GK.render();
      $("#gk-area").innerHTML = "";
      clockStart();
      if (window.mieTrack) window.mieTrack("game_start", { game: game.id, lang: GK.lang, content: GK.group, teams: GK.nTeams, turn_seconds: GK.turnSeconds, game_minutes: GK.gameMinutes });
      game.start();
    }
    $("#gk-start").addEventListener("click", begin);
    $("#gk-back").addEventListener("click", function () {
      clockStop();
      GK.closeModals();
      stage.hidden = true; setup.hidden = false; rules.hidden = false;
      if (game.stop) game.stop();
    });
    $("#gk-full").addEventListener("click", function () {
      var d = document;
      if (d.fullscreenElement) { d.exitFullscreen(); }
      else if (d.documentElement.requestFullscreen) { d.documentElement.requestFullscreen(); }
    });
    $("#gk-pause").addEventListener("click", function () { setPaused(!T.paused); });
    var mute = $("#gk-mute");
    function paintMute() { mute.textContent = cfg.sound ? "🔊" : "🔇"; }
    mute.addEventListener("click", function () { cfg.sound = !cfg.sound; save(); paintMute(); });
    paintMute();
    GK.restart = begin;
  };
})();

/* Aprender jugando — shared engine: setup bar, teams, scoreboard, questions, modals. */
(function () {
  "use strict";

  var TEAM_COLORS = [
    { name: "Rojo", c: "#ef8f66" },
    { name: "Azul", c: "#8ecbe0" },
    { name: "Verde", c: "#8ee0b0" },
    { name: "Amarillo", c: "#f0c94a" },
  ];

  var GK = (window.GameKit = { teams: [], turn: 0, lang: "en", group: "all", nTeams: 2 });

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
  // letters without accents, uppercase; "oe" ligature counts as O
  GK.norm = function (s) {
    return s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/œ/gi, "o").toUpperCase();
  };

  // ---------------------------------------------------------------- data
  GK.data = function () { return window.GAME_DATA[GK.lang]; };
  function inGroup(g) { return GK.group === "all" || g === GK.group; }
  GK.topics = function () {
    var out = [];
    GK.data().groups.forEach(function (g) {
      if (inGroup(g.name)) g.topics.forEach(function (t) { out.push(t); });
    });
    return out;
  };
  GK.questions = function () {
    var out = [];
    GK.topics().forEach(function (t) { t.questions.forEach(function (q) { out.push(q); }); });
    return out;
  };
  GK.sentences = function () { return GK.data().sentences.filter(function (s) { return inGroup(s.g); }); };
  GK.pairSets = function () { return GK.data().pairSets.filter(function (p) { return inGroup(p.g); }); };
  GK.words = function () { return GK.data().words.filter(function (w) { return inGroup(w.g); }); };
  GK.prompts = function () { return GK.data().prompts.filter(function (p) { return inGroup(p.g); }); };

  // ------------------------------------------------------------- scoreboard
  GK.render = function () {
    var box = $("#gk-scoreboard");
    box.innerHTML = "";
    var grid = el("div", "gk-scores");
    GK.teams.forEach(function (t, i) {
      var d = el("div", "gk-team" + (i === GK.turn ? " active" : ""));
      d.style.setProperty("--tc", t.c);
      d.innerHTML =
        '<div class="gk-name">' + t.name + (i === GK.turn ? " · turno" : "") + "</div>" +
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
  };
  GK.next = function () {
    GK.turn = (GK.turn + 1) % GK.teams.length;
    GK.render();
  };
  GK.team = function () { return GK.teams[GK.turn]; };

  // ------------------------------------------------------------------ modal
  GK.modal = function (node) {
    var ov = el("div", "gk-overlay");
    var card = el("div", "gk-modal");
    card.appendChild(node);
    ov.appendChild(card);
    document.body.appendChild(ov);
    var close = function () { if (ov.parentNode) ov.parentNode.removeChild(ov); GK.modalOpen = false; };
    GK.modalOpen = true;
    return close;
  };

  // multiple-choice question card; calls onDone(correct) once
  GK.ask = function (q, onDone) {
    var wrap = el("div", "gk-q");
    var label = q.k === "vocab" ? "Vocabulario" : "Completa la oración";
    var text = GK.esc(q.s).replace("___", '<span class="gk-blank">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');
    wrap.innerHTML = '<p class="gk-q-label">' + label + '</p><p class="gk-q-text">' + text + "</p>";
    var opts = el("div", "gk-q-opts");
    var fb = el("p", "gk-q-fb");
    var answered = false;
    var items = q.o.map(function (t, i) { return { t: t, ok: i === q.a }; });
    GK.shuffle(items).forEach(function (o) {
      var b = el("button");
      b.textContent = o.t;
      b.dataset.ok = o.ok ? "1" : "0";
      b.addEventListener("click", function () {
        if (answered) return;
        answered = true;
        opts.querySelectorAll("button").forEach(function (x) {
          x.disabled = true;
          if (x.dataset.ok === "1") x.classList.add("correct");
        });
        if (o.ok) { fb.textContent = "✓ ¡Correcto!"; fb.className = "gk-q-fb ok"; }
        else { b.classList.add("wrong"); fb.textContent = "✗ Incorrecto"; fb.className = "gk-q-fb no"; }
        if (onDone) onDone(o.ok);
      });
      opts.appendChild(b);
    });
    wrap.appendChild(opts);
    wrap.appendChild(fb);
    return wrap;
  };

  GK.endModal = function (onAgain) {
    var max = Math.max.apply(null, GK.teams.map(function (t) { return t.score; }));
    var sorted = GK.teams.slice().sort(function (a, b) { return b.score - a.score; });
    var winners = GK.teams.filter(function (t) { return t.score === max; });
    var box = el("div");
    box.innerHTML =
      "<h2>🏆 ¡Fin del juego!</h2>" +
      '<p class="gk-big">' + (winners.length > 1 ? "¡Empate!" : "Ganó el equipo <strong style=\"color:" + winners[0].c + '">' + winners[0].name + "</strong>") + "</p>";
    var ul = el("ul", "gk-end-list");
    sorted.forEach(function (t) {
      var li = el("li", t.score === max ? "win" : "");
      li.innerHTML = '<span style="color:' + t.c + '">' + t.name + "</span><span>" + t.score + "</span>";
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

  // ------------------------------------------------------------------ setup
  GK.init = function (game) {
    var params = new URLSearchParams(location.search);
    if (params.get("lang") === "fr") GK.lang = "fr";

    var langBox = $("#gk-lang"), teamBox = $("#gk-teams"), sel = $("#gk-group");
    var setup = $("#gk-setup"), stage = $("#gk-stage"), rules = $("#gk-rules");

    function mark(box, value) {
      box.querySelectorAll("button").forEach(function (b) { b.classList.toggle("on", b.dataset.v === String(value)); });
    }
    function fillGroups() {
      var prev = sel.value;
      sel.innerHTML = "";
      var all = el("option"); all.value = "all"; all.textContent = "Todos los temas (mezcla)"; sel.appendChild(all);
      GK.data().groups.forEach(function (g) {
        var o = el("option"); o.value = g.name; o.textContent = g.name; sel.appendChild(o);
      });
      sel.value = Array.prototype.some.call(sel.options, function (o) { return o.value === prev; }) ? prev : "all";
    }

    langBox.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      GK.lang = b.dataset.v; mark(langBox, GK.lang); fillGroups();
    });
    teamBox.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      GK.nTeams = parseInt(b.dataset.v, 10); mark(teamBox, GK.nTeams);
    });
    mark(langBox, GK.lang);
    mark(teamBox, GK.nTeams);
    fillGroups();

    function begin() {
      GK.group = sel.value;
      GK.teams = TEAM_COLORS.slice(0, GK.nTeams).map(function (t) { return { name: t.name, c: t.c, score: 0 }; });
      GK.turn = 0;
      setup.hidden = true; rules.hidden = true; stage.hidden = false;
      GK.render();
      $("#gk-area").innerHTML = "";
      game.start();
    }
    $("#gk-start").addEventListener("click", begin);
    $("#gk-back").addEventListener("click", function () {
      stage.hidden = true; setup.hidden = false; rules.hidden = false;
      if (game.stop) game.stop();
    });
    $("#gk-full").addEventListener("click", function () {
      var d = document;
      if (d.fullscreenElement) { d.exitFullscreen(); }
      else if (d.documentElement.requestFullscreen) { d.documentElement.requestFullscreen(); }
    });
    GK.restart = begin;
  };
})();

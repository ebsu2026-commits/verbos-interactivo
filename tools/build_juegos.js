// Builds the "Aprender jugando" section: juegos/data.js + juegos.html + one page per game.
// Running this file also regenerates the whole EN + FR site (it requires both builders).
// Usage:  node tools/build_juegos.js
const fs = require("fs");
const path = require("path");

const site = require("./build_verbos_site.js");
const frSite = require("./build_verbos_fr.js");
const { OUT_DIR, HEAD, COPYRIGHT, siteNav, shuffle, TENSES } = site;
const { TENSES_FR } = frSite;
const dataEn = require("./juegos_data_en.js");
const dataFr = require("./juegos_data_fr.js");
const qEn = require("./juegos_q_en.js");
const qFr = require("./juegos_q_fr.js");

const readMap = (name) => {
  const p = path.join(__dirname, name);
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf-8")) : {};
};
const AUDIO = { en: readMap("practice_audio_map.json"), fr: readMap("practice_audio_map_fr.json") };

// ------------------------------------------------------------------ data.js
const VERB_LABELS = {
  en: { be: "to be", have: "to have", do: "to do", go: "to go", make: "to make", get: "to get" },
  fr: { etre: "être", avoir: "avoir", faire: "faire", aller: "aller", prendre: "prendre", dire: "dire" },
};

// small deterministic helpers (build output must be reproducible)
let seedCounter = 100;
const sh = (arr) => shuffle(arr, (seedCounter += 7));
const uniq = (arr) => [...new Set(arr)];

// level 1 (recognition): "who + (verb) -> ___" built from the conjugation tables
const polarity = (t) => (/negativ/.test(t.slug) ? "neg" : /pregunt|question/.test(t.slug) ? "q" : "aff");

function drillsFor(t, lang, allForms) {
  const out = [];
  if (t.verbs) {
    Object.entries(t.verbs).forEach(([key, rows]) => {
      rows.forEach(([who, form]) => {
        const sameTense = uniq(rows.map((r) => r[1])).filter((f) => f !== form);
        const otherTenses = [...allForms[key][polarity(t)]].filter((f) => f !== form && !sameTense.includes(f));
        const cand = [...sh(sameTense), ...sh(otherTenses)];
        if (cand.length < 2) return;
        out.push({ s: `${who}  +  (${VERB_LABELS[lang][key]})  →  ___`, o: [form, cand[0], cand[1]], a: 0, k: "form", d: 1 });
      });
    });
  } else if (t.diagram && t.diagram.boxes.every((b) => b.rows.length === 6)) {
    t.diagram.boxes.forEach((box) => {
      const lemma = box.head.split(" · ")[0].toLowerCase();
      box.rows.forEach(([who, form]) => {
        const cand = sh(uniq(box.rows.map((r) => r[1])).filter((f) => f !== form));
        if (cand.length < 2) return;
        out.push({ s: `${who}  +  (${lemma})  →  ___`, o: [form, cand[0], cand[1]], a: 0, k: "form", d: 1 });
      });
    });
  }
  return out;
}

function extraQs(table, key) {
  const out = [];
  const e = (table || {})[key] || {};
  [1, 2, 3].forEach((d) => (e[d] || []).forEach(([s, ok, w1, w2, kind]) => {
    out.push({ s, o: [ok, w1, w2], a: 0, k: kind === "choose" ? "choose" : "fill", d });
  }));
  return out;
}

function buildLang(lang, tenses, extra, qTable) {
  const byGroup = new Map();
  const allForms = {};
  tenses.forEach((t) => {
    if (!t.verbs) return;
    Object.entries(t.verbs).forEach(([k, rows]) => {
      allForms[k] = allForms[k] || { aff: new Set(), neg: new Set(), q: new Set() };
      rows.forEach((r) => allForms[k][polarity(t)].add(r[1]));
    });
  });

  tenses.forEach((t) => {
    if (!byGroup.has(t.group)) byGroup.set(t.group, { name: t.group, topics: [] });
    const practice = (t.practice || []).map((it) => ({ s: it.sentence, o: it.options, a: it.correct, k: "fill", d: 2 }));
    const questions = [...drillsFor(t, lang, allForms), ...practice, ...extraQs(qTable, t.slug)];
    byGroup.get(t.group).topics.push({ title: t.title, questions });
  });
  const groups = [...byGroup.values()];

  // vocabulary: level 1 = Spanish -> word, level 2 = word -> Spanish, level 3 = written in context
  const vocabTopics = extra.vocab.map((v) => {
    const questions = [];
    v.items.forEach(([word, es], idx) => {
      const others = v.items.filter((_, i) => i !== idx);
      const wrongWords = sh(others.map((x) => x[0])).slice(0, 2);
      questions.push({ s: extra.labels.howToSay(es), o: [word, ...wrongWords], a: 0, k: "vocab", d: 1 });
      const wrongEs = sh(others.map((x) => x[1])).slice(0, 2);
      questions.push({ s: `¿Qué significa «${word}»?`, o: [es, ...wrongEs], a: 0, k: "vocab", d: 2 });
    });
    return { title: v.title, questions: [...questions, ...extraQs(qTable, "vocab:" + v.title)] };
  });
  groups.push({ name: extra.vocabGroup, topics: vocabTopics });

  const sentences = [];
  const extraSentenceTexts = [];
  tenses.forEach((t) => {
    const add = (full, fromExtra) => {
      const text = lang === "fr" ? full.replace(/' /g, "'") : full;
      sentences.push({ g: t.group, tp: t.title, t: text, a: AUDIO[lang][full] || null });
      if (fromExtra) extraSentenceTexts.push(full);
    };
    (t.practice || []).forEach((it) => add(it.sentence.replace("___", it.options[it.correct]), false));
    ((extra.sentences || {})[t.slug] || []).forEach((full) => add(full, true));
  });

  const seen = new Set();
  for (let i = sentences.length - 1; i >= 0; i--) {
    if (seen.has(sentences[i].t)) sentences.splice(i, 1); else seen.add(sentences[i].t);
  }

  const pairSets = [
    ...extra.pairSets.map((p) => ({ g: p.group, title: p.title, pairs: p.pairs })),
    ...extra.vocab.map((v) => ({ g: extra.vocabGroup, tp: v.title, title: v.title, pairs: v.items.slice(0, 6) })),
  ];

  const words = [
    ...extra.words.map((w) => ({ g: w.group, w: w.w, c: w.c })),
    ...extra.vocab.flatMap((v) =>
      v.items.map(([word, es]) => ({ g: extra.vocabGroup, tp: v.title, w: word.toUpperCase(), c: `${es} · ${v.title}` }))
    ),
  ];

  const prompts = extra.prompts.map((p) => ({ g: p.group, p: p.p }));
  return { groups, sentences, pairSets, words, prompts, _extraSentenceTexts: extraSentenceTexts };
}

const GAME_DATA = { en: buildLang("en", TENSES, dataEn, qEn), fr: buildLang("fr", TENSES_FR, dataFr, qFr) };

// sentences that still need audio (the audio generators read these files)
fs.writeFileSync(path.join(__dirname, "game_sentences.json"), JSON.stringify(uniq(GAME_DATA.en._extraSentenceTexts), null, 2), "utf-8");
fs.writeFileSync(path.join(__dirname, "game_sentences_fr.json"), JSON.stringify(uniq(GAME_DATA.fr._extraSentenceTexts), null, 2), "utf-8");
delete GAME_DATA.en._extraSentenceTexts;
delete GAME_DATA.fr._extraSentenceTexts;
fs.mkdirSync(path.join(OUT_DIR, "juegos"), { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, "juegos", "data.js"), "window.GAME_DATA = " + JSON.stringify(GAME_DATA) + ";\n", "utf-8");
const levels = (l) => {
  const c = { 1: 0, 2: 0, 3: 0 };
  GAME_DATA[l].groups.forEach((g) => g.topics.forEach((t) => t.questions.forEach((q) => c[q.d]++)));
  return `${c[1] + c[2] + c[3]} preguntas (fáciles ${c[1]}, medias ${c[2]}, difíciles ${c[3]})`;
};
console.log("wrote juegos/data.js — EN:", levels("en"), `${GAME_DATA.en.sentences.length} oraciones`, "| FR:", levels("fr"), `${GAME_DATA.fr.sentences.length} oraciones`);

// --------------------------------------------------------------------- CSS
const GAMES_CSS = `
  [hidden]{ display:none !important; }
  .gk-setup{ display:flex; flex-wrap:wrap; gap:18px 28px; align-items:flex-end; justify-content:center;
    background:var(--slate-2); border:1.5px solid var(--line-soft); border-radius:20px; padding:22px 26px; }
  .gk-field{ display:flex; flex-direction:column; gap:8px; }
  .gk-label{ font-size:.72rem; text-transform:uppercase; letter-spacing:.1em; color:var(--chalk-faint); font-weight:600; }
  .gk-seg{ display:flex; gap:6px; }
  .gk-seg button, .gk-field select, .gk-ghost{
    font:inherit; font-size:.92rem; font-weight:600; cursor:pointer; color:var(--chalk-dim);
    background:var(--slate-1); border:1.5px solid var(--line-soft); border-radius:999px; padding:9px 18px;
    transition:border-color .15s, color .15s, background .15s;
  }
  .gk-seg button:hover, .gk-ghost:hover{ border-color:var(--line); color:var(--chalk); }
  .gk-seg button.on{ background:var(--yellow); color:var(--slate-1); border-color:var(--yellow); }
  .gk-field select{ min-width:250px; max-width:100%; }
  .gk-primary{ font-family:"Kalam",cursive; font-size:1.25rem; font-weight:700; cursor:pointer;
    background:var(--yellow); color:var(--slate-1); border:none; border-radius:999px; padding:10px 32px; }
  .gk-primary:hover{ filter:brightness(1.08); }
  .gk-wide{ flex-basis:100%; align-items:center; }
  .gk-names{ display:flex; flex-wrap:wrap; gap:8px; justify-content:center; }
  .gk-names input{ font:inherit; font-weight:600; width:120px; color:var(--chalk); background:var(--slate-1);
    border:2px solid var(--line-soft); border-radius:999px; padding:8px 14px; text-align:center; }
  .gk-topics{ flex-basis:100%; background:#00000018; border:1.5px dashed var(--line-soft); border-radius:14px; padding:14px 18px; display:flex; flex-direction:column; gap:8px; }
  .gk-topics-group{ margin:6px 0 0; font-size:.72rem; text-transform:uppercase; letter-spacing:.1em; color:var(--yellow); font-weight:600; }
  .gk-topics-row{ display:flex; flex-wrap:wrap; gap:6px 18px; }
  .gk-check{ font-size:.9rem; color:var(--chalk-dim); cursor:pointer; }
  .gk-check input{ accent-color:var(--yellow); }
  .gk-clock{ display:flex; flex-wrap:wrap; align-items:center; gap:10px 18px; background:var(--slate-2);
    border:1.5px solid var(--line-soft); border-radius:16px; padding:10px 16px; margin-bottom:14px; }
  .gk-turnclock{ display:flex; align-items:center; gap:12px; flex:1; min-width:220px; }
  #gk-tnum{ font-family:"Kalam",cursive; font-weight:700; font-size:2.4rem; line-height:1; min-width:2.2ch; text-align:center; color:var(--chalk); }
  .gk-tbar{ flex:1; height:14px; background:#00000040; border-radius:999px; overflow:hidden; }
  .gk-tbar i{ display:block; height:100%; width:0; background:var(--mint); border-radius:999px; transition:width .12s linear, background .3s; }
  .gk-clock.warn .gk-tbar i{ background:var(--yellow); }
  .gk-clock.low .gk-tbar i{ background:var(--coral); }
  .gk-clock.low #gk-tnum{ color:var(--coral); animation:gkpulse .6s infinite alternate; }
  @keyframes gkpulse{ to{ transform:scale(1.18); } }
  .gk-gameclock{ font-weight:700; color:var(--chalk-dim); font-size:1.05rem; white-space:nowrap; }
  .gk-pause-ov{ position:fixed; inset:0; z-index:80; background:#000000ee; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:22px; }
  .gk-pause-title{ margin:0; font-family:"Kalam",cursive; font-weight:700; font-size:clamp(2rem,7vw,3.4rem); color:var(--yellow); }
  .gk-rules{ background:#00000018; border:1.5px dashed var(--line-soft); border-radius:14px; padding:12px 18px; font-size:.9rem; color:var(--chalk-dim); }
  .gk-rules summary{ cursor:pointer; font-weight:600; color:var(--chalk); }
  .gk-rules ul{ margin:8px 0 0; padding-left:20px; display:flex; flex-direction:column; gap:4px; }
  .gk-toolbar{ display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap; margin-bottom:14px; }
  .gk-scores{ display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:12px; margin-bottom:18px; }
  .gk-team{ background:var(--slate-2); border:2px solid var(--line-soft); border-radius:18px; padding:10px 14px 12px;
    text-align:center; cursor:pointer; transition:transform .15s, border-color .15s, box-shadow .15s; }
  .gk-team.active{ border-color:var(--tc); transform:translateY(-3px); box-shadow:0 0 0 3px #ffffff22, 0 10px 24px -12px #000; }
  .gk-name{ font-family:"Kalam",cursive; font-weight:700; font-size:1.05rem; color:var(--tc); }
  .gk-score{ font-family:"Kalam",cursive; font-weight:700; font-size:2.8rem; line-height:1.05; color:var(--chalk); }
  .gk-adj{ display:flex; justify-content:center; gap:8px; margin-top:4px; }
  .gk-adj button{ font:inherit; font-size:.8rem; font-weight:700; cursor:pointer; color:var(--chalk-dim);
    background:var(--slate-1); border:1.5px solid var(--line-soft); border-radius:999px; padding:2px 12px; }
  .gk-adj button:hover{ color:var(--chalk); border-color:var(--line); }
  .gk-area{ display:flex; flex-direction:column; align-items:center; gap:18px; }
  .gk-empty{ color:var(--chalk-dim); text-align:center; }
  .gk-btn{ font:inherit; font-size:1rem; font-weight:700; cursor:pointer; color:var(--slate-1); background:var(--chalk);
    border:none; border-radius:999px; padding:10px 24px; }
  .gk-btn.alt{ background:transparent; color:var(--chalk-dim); border:1.5px solid var(--line-soft); }
  .gk-btn:hover{ filter:brightness(1.06); }
  .gk-btn:disabled{ opacity:.4; cursor:default; }
  .gk-row{ display:flex; flex-wrap:wrap; gap:10px; justify-content:center; }
  .gk-msg{ min-height:1.6em; margin:0; font-size:1.1rem; font-weight:600; text-align:center; }
  .gk-msg.ok{ color:var(--mint); } .gk-msg.no{ color:var(--coral); }

  /* hangman */
  .hm{ display:flex; flex-wrap:wrap; gap:26px; justify-content:center; align-items:center; width:100%; }
  .hm svg{ width:min(240px,60vw); height:auto; flex-shrink:0; }
  .hm svg .base{ stroke:var(--line); stroke-width:5; stroke-linecap:round; fill:none; }
  .hm svg .part{ stroke:var(--coral); stroke-width:5; stroke-linecap:round; fill:none; }
  .hm-side{ display:flex; flex-direction:column; align-items:center; gap:14px; flex:1; min-width:280px; }
  .hm-clue{ margin:0; font-size:1.05rem; color:var(--chalk-dim); text-align:center; }
  .hm-word{ display:flex; flex-wrap:wrap; gap:10px 26px; justify-content:center; font-family:"Kalam",cursive; font-weight:700; }
  .hm-wordgroup{ display:flex; gap:5px; flex-wrap:nowrap; }
  .hm-slot{ min-width:1.5ch; text-align:center; font-size:clamp(1.5rem,4.2vw,2.5rem); border-bottom:4px solid var(--chalk-dim); line-height:1.2; padding:0 3px; }
  .hm-slot.fixed{ border-bottom-color:transparent; min-width:.6ch; }
  .hm-slot.lost{ color:var(--coral); }
  .hm-keys{ display:flex; flex-wrap:wrap; gap:7px; justify-content:center; max-width:560px; }
  .hm-keys button{ font:inherit; font-weight:700; font-size:1.05rem; width:44px; height:44px; cursor:pointer;
    color:var(--chalk); background:var(--slate-2); border:1.5px solid var(--line-soft); border-radius:10px; }
  .hm-keys button:hover:not(:disabled){ border-color:var(--yellow); }
  .hm-keys button:disabled{ cursor:default; opacity:.35; }
  .hm-keys button.hit{ background:#2e7d3240; border-color:#4caf50; opacity:1; }
  .hm-keys button.miss{ background:#c0392b40; border-color:#e57373; opacity:1; }

  /* memory */
  .mm-title{ margin:0; color:var(--chalk-dim); font-size:.95rem; }
  .mm-grid{ display:grid; gap:12px; width:100%; max-width:860px; }
  .mm-card{ aspect-ratio:1.5/1; perspective:700px; cursor:pointer; background:none; border:none; padding:0; font:inherit; }
  .mm-inner{ position:relative; width:100%; height:100%; transition:transform .45s; transform-style:preserve-3d; }
  .mm-card.up .mm-inner, .mm-card.done .mm-inner{ transform:rotateY(180deg); }
  .mm-face{ position:absolute; inset:0; backface-visibility:hidden; display:flex; align-items:center; justify-content:center;
    text-align:center; border-radius:16px; padding:6px; border:2px solid var(--line-soft); }
  .mm-back{ background:var(--slate-2); font-size:2rem; color:var(--chalk-faint); }
  .mm-front{ transform:rotateY(180deg); background:var(--chalk); color:var(--slate-1); font-family:"Kalam",cursive; font-weight:700; font-size:clamp(1.1rem,3vw,1.8rem); }
  .mm-card.done .mm-front{ border-color:var(--tc,var(--mint)); border-width:4px; opacity:.85; }

  /* jeopardy */
  .jp-board{ display:grid; gap:10px; width:100%; max-width:980px; }
  .jp-head{ background:var(--slate-2); border:1.5px solid var(--line-soft); border-radius:14px; padding:12px 8px; text-align:center;
    font-family:"Kalam",cursive; font-weight:700; font-size:clamp(.6rem,2.4vw,1.2rem); color:var(--yellow); display:flex; align-items:center; justify-content:center; overflow-wrap:anywhere; hyphens:auto; min-width:0; }
  .jp-tile{ font-family:"Kalam",cursive; font-weight:700; font-size:clamp(1.3rem,3.4vw,2.2rem); cursor:pointer; color:var(--slate-1);
    background:var(--sky); border:none; border-radius:14px; padding:16px 2px; min-width:0; transition:transform .12s, filter .12s; }
  .jp-tile:hover:not(:disabled){ transform:scale(1.04); filter:brightness(1.07); }
  .jp-tile:disabled{ background:#00000030; color:#ffffff22; cursor:default; }

  /* wheel */
  .wh{ position:relative; width:min(380px,86vw); aspect-ratio:1; }
  .wh-disc{ position:absolute; inset:0; border-radius:50%; border:6px solid var(--chalk); transition:transform 4.2s cubic-bezier(.17,.67,.12,1);
    box-shadow:0 14px 34px -12px #000; overflow:hidden; }
  .wh-label{ position:absolute; left:50%; top:50%; width:0; height:0; }
  .wh-label span{ position:absolute; left:0; top:0; transform:translate(-50%, calc(-1 * min(150px,33vw))); font-weight:700; font-size:clamp(.8rem,2.4vw,1.05rem);
    color:var(--slate-1); white-space:nowrap; }
  .wh-pointer{ position:absolute; left:50%; top:-14px; transform:translateX(-50%); width:0; height:0; z-index:3;
    border-left:16px solid transparent; border-right:16px solid transparent; border-top:30px solid var(--yellow); filter:drop-shadow(0 3px 3px #0008); }
  .wh-hub{ position:absolute; left:50%; top:50%; width:64px; height:64px; margin:-32px; border-radius:50%; background:var(--slate-1);
    border:4px solid var(--chalk); z-index:2; }

  /* sentence builder */
  .sb-zone{ display:flex; flex-wrap:wrap; gap:10px; justify-content:center; align-items:center; width:100%; max-width:860px; padding:16px; border-radius:16px; min-height:78px; }
  .sb-answer{ border:2.5px dashed var(--line); background:#00000018; }
  .sb-bank{ background:var(--slate-2); border:1.5px solid var(--line-soft); }
  .sb-chip{ font:inherit; font-family:"Kalam",cursive; font-weight:700; font-size:clamp(1.1rem,3vw,1.7rem); cursor:pointer; color:var(--slate-1);
    background:var(--chalk); border:none; border-radius:12px; padding:8px 16px; transition:transform .12s; }
  .sb-chip:hover{ transform:translateY(-2px); }
  .sb-answer.shake{ animation:sbshake .4s; }
  @keyframes sbshake{ 20%{ transform:translateX(-9px);} 40%{ transform:translateX(9px);} 60%{ transform:translateX(-6px);} 80%{ transform:translateX(6px);} }
  .sb-hint{ margin:0; color:var(--chalk-dim); font-size:.95rem; text-align:center; }

  /* question card + modal (jeopardy, wheel) */
  .gk-overlay{ position:fixed; inset:0; z-index:50; background:#000000b0; display:flex; align-items:center; justify-content:center; padding:20px; }
  .gk-modal{ background:var(--slate-2); border:2px solid var(--line); border-radius:24px; padding:26px 28px; width:min(720px,100%); max-height:92vh; overflow-y:auto;
    display:flex; flex-direction:column; gap:16px; text-align:center; }
  .gk-modal h2{ margin:0; font-family:"Kalam",cursive; font-size:1.7rem; color:var(--yellow); }
  .gk-q-label{ margin:0; font-size:.74rem; text-transform:uppercase; letter-spacing:.12em; color:var(--chalk-faint); font-weight:600; }
  .gk-q-text{ margin:6px 0 0; font-size:clamp(1.3rem,3.4vw,2rem); line-height:1.4; }
  .gk-blank{ display:inline-block; min-width:80px; border-bottom:3px dashed var(--yellow); }
  .gk-q-opts{ display:flex; flex-wrap:wrap; gap:12px; justify-content:center; }
  .gk-q-opts button{ font:inherit; font-size:clamp(1rem,2.6vw,1.35rem); font-weight:700; cursor:pointer; color:var(--chalk);
    background:var(--slate-1); border:2px solid var(--line-soft); border-radius:14px; padding:12px 22px; }
  .gk-q-opts button:hover:not(:disabled){ border-color:var(--yellow); }
  .gk-q-opts button:disabled{ cursor:default; }
  .gk-q-opts button.correct{ background:#2e7d3240; border-color:#4caf50; }
  .gk-q-opts button.wrong{ background:#c0392b40; border-color:#e57373; }
  .gk-q-fb{ margin:0; min-height:1.4em; font-weight:700; font-size:1.1rem; }
  .gk-q-fb.ok{ color:var(--mint); } .gk-q-fb.no{ color:var(--coral); }
  .gk-big{ font-size:clamp(1.3rem,3.2vw,1.9rem); line-height:1.4; margin:0; }
  .gk-end-list{ list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:8px; }
  .gk-end-list li{ display:flex; justify-content:space-between; gap:20px; background:var(--slate-1); border:2px solid var(--line-soft); border-radius:14px; padding:10px 18px; font-weight:700; font-size:1.2rem; }
  .gk-end-list li.win{ border-color:var(--yellow); }

  /* games hub */
  .gm-card{ display:flex; flex-direction:column; gap:8px; text-decoration:none; background:var(--slate-2); border:1.5px solid var(--line-soft);
    border-radius:20px; padding:18px 20px; transition:transform .15s,border-color .15s; position:relative; overflow:hidden; }
  .gm-card:hover{ transform:translateY(-3px); border-color:var(--line); }
  .gm-card .bar{ position:absolute; left:0; top:0; bottom:0; width:6px; }
  .gm-card h3{ margin:0; font-family:"Kalam",cursive; font-size:1.35rem; color:var(--chalk); }
  .gm-card .tag{ font-size:.68rem; text-transform:uppercase; letter-spacing:.08em; color:var(--chalk-faint); font-weight:600; }
  .gm-card p{ margin:0; font-size:.88rem; color:var(--chalk-dim); line-height:1.45; }
  .gm-card .go{ font-size:.78rem; color:var(--yellow); font-weight:600; margin-top:4px; }
  .gm-tips{ background:#00000018; border:1.5px dashed var(--line-soft); border-radius:16px; padding:16px 22px; }
  .gm-tips h2{ margin:0 0 8px; font-family:"Kalam",cursive; font-size:1.2rem; color:var(--yellow); }
  .gm-tips ul{ margin:0; padding-left:20px; display:flex; flex-direction:column; gap:6px; color:var(--chalk-dim); font-size:.92rem; line-height:1.45; }
  .gm-tips strong{ color:var(--chalk); }
`;

// ------------------------------------------------------------------- games
const GAMES = [
  {
    slug: "ahorcado", title: "Ahorcado", icon: "🔤", color: "sky", js: "ahorcado.js", tag: "Toda la clase · letras",
    desc: "Adivinen la palabra letra por letra, por turnos. Cada letra correcta suma puntos al equipo.",
    short: "Una palabra oculta con una pista. Los equipos eligen letras por turnos.",
    rules: [
      "Cada equipo, en su turno, elige una letra (con el mouse o el teclado).",
      "Letra correcta: +1 punto y el mismo equipo sigue. Letra incorrecta: se dibuja una parte del ahorcado y pasa el turno.",
      "El equipo que completa la palabra gana +3 puntos extra. Con 6 errores se pierde la palabra.",
      "⏱ Si se acaba el tiempo del turno, pasa al siguiente equipo sin penalización.",
    ],
  },
  {
    slug: "memoria", title: "Memoria de parejas", icon: "🧠", color: "mint", js: "memoria.js", tag: "Equipos · concentración",
    desc: "Volteen cartas y encuentren las parejas: sujeto y forma, verbo y pasado, palabra y significado.",
    short: "Encuentren las parejas correctas volteando dos cartas por turno.",
    rules: [
      "En su turno, el equipo voltea dos cartas.",
      "Si forman una pareja correcta: +1 punto y vuelve a jugar. Si no, las cartas se tapan y pasa el turno.",
      "Gana el equipo con más parejas al descubrir todas las cartas.",
      "⏱ Si se acaba el tiempo del turno, las cartas se tapan y pasa al siguiente equipo.",
    ],
  },
  {
    slug: "jeopardy", title: "Concurso de puntos", icon: "🏆", color: "yellow", js: "jeopardy.js", tag: "Equipos · preguntas",
    desc: "Tablero de categorías con puntos de 100 a 500. Elijan un casillero y respondan para ganarlo.",
    short: "Tablero estilo concurso: categorías, casilleros de 100 a 500 puntos.",
    rules: [
      "El equipo en turno elige una categoría y un valor del tablero.",
      "Si responde bien, gana esos puntos. Si falla, no suma y pasa el turno.",
      "Cada casillero se usa una sola vez. Gana el equipo con más puntos al terminar.",
      "Los valores crecen con la dificultad: 100 y 200 son fáciles, 300 y 400 medias, 500 difícil.",
      "⏱ El reloj corre mientras se responde. Si se acaba, cuenta como respuesta incorrecta.",
    ],
  },
  {
    slug: "ruleta", title: "Ruleta de retos", icon: "🎡", color: "coral", js: "ruleta.js", tag: "Equipos · sorpresa",
    desc: "Giren la ruleta: puede tocar una pregunta, un reto para hablar, un punto extra o una trampa.",
    short: "Giren la ruleta: pregunta, reto oral, punto extra o trampa.",
    rules: [
      "El equipo en turno gira la ruleta.",
      "❓ Pregunta: +1 si responde bien. 🗣 Habla: el docente decide si lo logró (+2). 🎁 Punto extra: +2. 💣 Trampa: −1.",
      "Después de cada giro pasa el turno al siguiente equipo.",
      "⏱ El reloj corre en las preguntas (cuenta como fallo si se acaba) y en los retos orales (avisa y el docente decide).",
    ],
  },
  {
    slug: "oraciones", title: "Ordena la oración", icon: "🧩", color: "lilac", js: "oraciones.js", tag: "Equipos · orden de palabras",
    desc: "Las palabras llegan desordenadas. Ordénenlas para formar la oración correcta y escuchen cómo suena.",
    short: "Ordenen las palabras revueltas para formar la oración correcta.",
    rules: [
      "Aparece una oración con las palabras desordenadas. Toquen las palabras para armarla.",
      "Si el equipo en turno acierta: +2 puntos y se escucha la oración. Si falla, le toca al siguiente equipo con la misma oración.",
      "Si todos los equipos fallan, se muestra la respuesta.",
      "⏱ Cada intento tiene su reloj: si se acaba, cuenta como un intento fallido y pasa al siguiente equipo.",
    ],
  },
];

const SQUIGGLE = `<svg class="squiggle" viewBox="0 0 220 14"><path d="M4 8 Q 30 -2, 56 8 T 108 8 T 160 8 T 216 8"/></svg>`;

function gamePage(g) {
  return `${HEAD(`${g.title} — Aprender jugando`)}
  <style>${GAMES_CSS}</style>
  ${siteNav("verbos")}

  <nav class="crumb">
    <a href="juegos.html">← Aprender jugando</a>
    <span class="progress">${g.tag}</span>
  </nav>

  <header class="board-head">
    <p class="eyebrow">Aprender jugando · Para proyectar en el aula</p>
    <h1>${g.icon} ${g.title}</h1>
    ${SQUIGGLE}
    <p class="subtitle">${g.desc}</p>
  </header>

  <section id="gk-setup" class="gk-setup">
    <div class="gk-field">
      <span class="gk-label">Idioma</span>
      <div class="gk-seg" id="gk-lang">
        <button data-v="en">🇬🇧 English</button>
        <button data-v="fr">🇫🇷 Français</button>
      </div>
    </div>
    <div class="gk-field">
      <span class="gk-label">Contenido</span>
      <select id="gk-group" aria-label="Contenido"></select>
    </div>
    <div class="gk-field">
      <span class="gk-label">Equipos</span>
      <div class="gk-seg" id="gk-teams">
        <button data-v="2">2</button>
        <button data-v="3">3</button>
        <button data-v="4">4</button>
      </div>
    </div>
    <div class="gk-field gk-wide">
      <span class="gk-label">Nombres de los equipos</span>
      <div class="gk-names" id="gk-names"></div>
    </div>
    <div class="gk-field">
      <span class="gk-label">⏱ Tiempo por turno</span>
      <div class="gk-seg" id="gk-turn">
        <button data-v="0">Sin límite</button>
        <button data-v="15">15 s</button>
        <button data-v="30">30 s</button>
        <button data-v="60">60 s</button>
        <button data-v="90">90 s</button>
      </div>
    </div>
    <div class="gk-field">
      <span class="gk-label">⏱ Duración de la partida</span>
      <div class="gk-seg" id="gk-minutes">
        <button data-v="0">Sin límite</button>
        <button data-v="5">5 min</button>
        <button data-v="10">10 min</button>
        <button data-v="15">15 min</button>
      </div>
    </div>
    <div id="gk-topics" class="gk-topics" hidden></div>
    <p id="gk-note" class="gk-msg no" hidden></p>
    <button id="gk-start" class="gk-primary">▶ Empezar</button>
  </section>

  <details class="gk-rules" id="gk-rules" open>
    <summary>Cómo se juega</summary>
    <ul>
      ${g.rules.map((r) => `<li>${r}</li>`).join("\n      ")}
    </ul>
  </details>

  <section id="gk-stage" hidden>
    <div class="gk-toolbar">
      <button class="gk-ghost" id="gk-back">← Cambiar ajustes</button>
      <button class="gk-ghost" id="gk-full">⛶ Pantalla completa</button>
    </div>
    <div id="gk-clock" class="gk-clock" hidden>
      <div class="gk-turnclock"><span id="gk-tnum">—</span><div class="gk-tbar"><i id="gk-tfill"></i></div></div>
      <div class="gk-gameclock">⏱ Partida <span id="gk-gtime">00:00</span></div>
      <button class="gk-ghost" id="gk-pause">⏸ Pausa</button>
      <button class="gk-ghost" id="gk-mute" aria-label="Sonido">🔊</button>
    </div>
    <div id="gk-scoreboard"></div>
    <div id="gk-area" class="gk-area"></div>
  </section>

  ${COPYRIGHT}
</div>
<script src="juegos/data.js"></script>
<script src="juegos/common.js"></script>
<script src="juegos/${g.js}"></script>
</body>
</html>
`;
}

GAMES.forEach((g) => {
  fs.writeFileSync(path.join(OUT_DIR, `juego-${g.slug}.html`), gamePage(g), "utf-8");
  console.log("wrote juego-" + g.slug + ".html");
});

// --------------------------------------------------------------- games hub
const cards = GAMES.map((g) => `<a class="gm-card" href="juego-${g.slug}.html" data-game>
        <span class="bar" style="background:var(--${g.color})"></span>
        <span class="tag">${g.tag}</span>
        <h3>${g.icon} ${g.title}</h3>
        <p>${g.short}</p>
        <span class="go">Jugar →</span>
      </a>`).join("\n      ");

const hubHtml = `${HEAD("Aprender jugando — Verbos y Gramática")}
  <style>${GAMES_CSS}</style>
  ${siteNav("verbos")}

  <nav class="crumb">
    <a href="index.html">← Verbos y Gramática</a>
    <span class="progress">Aprender jugando</span>
  </nav>

  <header class="board-head">
    <p class="eyebrow">Estrategia de enseñanza · Dinámicas de aula</p>
    <h1>🎲 Aprender jugando</h1>
    ${SQUIGGLE}
    <p class="hub-intro">Juegos para proyectar en el aula y jugar por equipos, con el mismo contenido que ya practicamos: verbos, modales, posesivos, pronombres y vocabulario. Funcionan en inglés y en francés.</p>
  </header>

  <div class="card-grid">
      ${cards}
  </div>

  <section class="gm-tips">
    <h2>Para dinamizar la clase</h2>
    <ul>
      <li><strong>Equipos de 4 o 5 estudiantes</strong> con un nombre y un portavoz que cambia en cada turno, para que todos participen.</li>
      <li><strong>El docente valida:</strong> los puntos se pueden corregir con los botones +1 / −1 de cada equipo.</li>
      <li><strong>Un tema a la vez:</strong> elijan en "Contenido" lo que se acaba de estudiar para reforzarlo.</li>
      <li><strong>Temporizador:</strong> cada juego permite un reloj por turno (15 a 90 segundos) y una duración total de la partida (5 a 15 minutos) para ajustarse al tiempo de la clase. Hay botón de pausa y sonido opcional.</li>
      <li><strong>Pantalla completa:</strong> cada juego tiene un botón para verse mejor en el proyector o el televisor.</li>
      <li><strong>Sin internet:</strong> el sitio también funciona abierto desde la carpeta de la computadora.</li>
    </ul>
  </section>

  <nav class="pagenav">
    <a href="index.html">← Inglés</a>
    <span class="spacer"></span>
    <a href="fr-index.html">Français →</a>
  </nav>
  ${COPYRIGHT}
</div>
<script>
  (function () {
    var lang = new URLSearchParams(location.search).get("lang");
    if (lang !== "fr" && lang !== "en") return;
    document.querySelectorAll("[data-game]").forEach(function (a) { a.href += "?lang=" + lang; });
  })();
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(OUT_DIR, "juegos.html"), hubHtml, "utf-8");
console.log("wrote juegos.html");
console.log("\nDone (juegos):", GAMES.length, "games +", "hub in", OUT_DIR);

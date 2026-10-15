const fs = require("fs");
const path = require("path");

const SITE_ROOT_FALLBACK = "C:\\Trabajo - Salome Ureña\\Recursos Compartidos\\Estrategias de Enseñanza\\Verbos Interactivo";
const OUT_DIR = path.basename(__dirname) === "tools" ? path.resolve(__dirname, "..") : SITE_ROOT_FALLBACK;

const AUDIO_MAP_PATH = path.join(__dirname, "practice_audio_map.json");
const AUDIO_MAP = fs.existsSync(AUDIO_MAP_PATH) ? JSON.parse(fs.readFileSync(AUDIO_MAP_PATH, "utf-8")) : {};

// ---------- shared CSS (identical visual language across every page) ----------
const CSS = `
  :root{
    --slate-1:#16241f; --slate-2:#1e332c;
    --chalk:#f4f1e6; --chalk-dim:#a9bdb2; --chalk-faint:#6f8478;
    --line:#8fae9c; --line-soft:#4a6459;
    --yellow:#f0c94a; --coral:#ef8f66; --sky:#8ecbe0;
    --mint:#8ee0b0; --lilac:#c9a4f0; --amber:#f0a94a;
  }
  *{box-sizing:border-box;}
  html,body{margin:0;padding:0;}
  body{
    background:
      radial-gradient(circle at 18% 8%, #ffffff08 0, transparent 45%),
      radial-gradient(circle at 82% 92%, #ffffff06 0, transparent 40%),
      linear-gradient(160deg, var(--slate-2), var(--slate-1) 70%);
    color:var(--chalk); font-family:"Archivo","Segoe UI",sans-serif;
    -webkit-font-smoothing:antialiased; padding:34px 24px 32px; min-height:100vh;
  }
  a{ color:inherit; }
  .board{ max-width:1050px; margin:0 auto; display:flex; flex-direction:column; gap:32px; }

  /* ---------- cross-site nav (present on every mieducacion.es property) ---------- */
  .site-nav{
    display:flex; justify-content:center; gap:6px; flex-wrap:wrap;
    background:#00000020; border:1.5px solid var(--line-soft); border-radius:999px;
    padding:6px; width:fit-content; margin:0 auto;
  }
  .site-nav a{
    text-decoration:none; font-size:.8rem; color:var(--chalk-dim); font-weight:600;
    padding:7px 14px; border-radius:999px; transition:background .15s,color .15s;
  }
  .site-nav a:hover{ color:var(--chalk); background:#ffffff0f; }
  .site-nav a.current{ background:var(--chalk); color:var(--slate-1); }

  .lang-switch{ display:flex; justify-content:center; gap:6px; }
  .lang-switch a{
    text-decoration:none; font-size:.78rem; color:var(--chalk-dim); font-weight:600;
    padding:5px 12px; border-radius:999px; border:1.5px solid var(--line-soft);
    transition:color .15s,border-color .15s;
  }
  .lang-switch a:hover{ color:var(--chalk); border-color:var(--line); }
  .lang-switch a.current{ background:var(--yellow); color:var(--slate-1); border-color:var(--yellow); }

  .crumb{ display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap; }
  .crumb a{ text-decoration:none; font-size:.85rem; color:var(--chalk-dim); border:1.5px dashed var(--line-soft); border-radius:999px; padding:6px 14px; transition:color .15s,border-color .15s; }
  .crumb a:hover{ color:var(--chalk); border-color:var(--line); }
  .crumb .progress{ font-size:.72rem; color:var(--chalk-faint); text-transform:uppercase; letter-spacing:.08em; }

  /* ---------- topics dropdown (grows with the site, always one click away) ---------- */
  .topics-menu{ position:relative; }
  .topics-menu summary{
    list-style:none; cursor:pointer; display:flex; align-items:center; gap:8px;
    text-decoration:none; font-size:.85rem; color:var(--chalk-dim); font-weight:600;
    border:1.5px solid var(--line-soft); border-radius:999px; padding:7px 16px;
    transition:color .15s,border-color .15s;
  }
  .topics-menu summary::-webkit-details-marker{ display:none; }
  .topics-menu summary:hover{ color:var(--chalk); border-color:var(--line); }
  .topics-menu[open] summary{ color:var(--chalk); border-color:var(--line); }
  .topics-panel{
    position:absolute; z-index:20; top:calc(100% + 8px); left:0; min-width:280px;
    background:var(--slate-2); border:1.5px solid var(--line-soft); border-radius:16px;
    padding:14px; box-shadow:0 14px 30px -10px #000000a0;
    display:flex; flex-direction:column; gap:12px; max-height:70vh; overflow-y:auto;
  }
  .topics-panel .tgroup-label{ margin:0; font-size:.68rem; text-transform:uppercase; letter-spacing:.08em; color:var(--chalk-faint); font-weight:600; }
  .topics-panel ul{ list-style:none; margin:4px 0 0; padding:0; display:flex; flex-direction:column; gap:2px; }
  .topic-row{ display:flex; align-items:stretch; gap:4px; }
  .topics-panel .topic-link{
    flex:1; display:block; text-decoration:none; font-size:.86rem; color:var(--chalk-dim);
    padding:6px 10px; border-radius:8px; transition:background .15s,color .15s;
  }
  .topics-panel .topic-link:hover{ background:#ffffff10; color:var(--chalk); }
  .topics-panel .topic-link.current{ background:var(--yellow); color:var(--slate-1); font-weight:700; }
  .topics-panel .practice-link{
    display:flex; align-items:center; justify-content:center; width:32px; flex-shrink:0;
    text-decoration:none; border-radius:8px; transition:background .15s;
  }
  .topics-panel .practice-link:hover{ background:#ffffff10; }
  .topics-panel .practice-link.current{ background:var(--yellow); }
  @media (max-width:520px){ .topics-panel{ position:fixed; left:16px; right:16px; top:auto; min-width:0; } }

  .board-head{ text-align:center; display:flex; flex-direction:column; align-items:center; gap:6px; }
  .eyebrow{ margin:0; text-transform:uppercase; letter-spacing:.16em; font-size:.68rem; font-weight:600; color:var(--chalk-faint); }
  h1{ margin:2px 0 0; font-family:"Kalam",cursive; font-weight:700; font-size:clamp(2rem,5vw,2.8rem); color:var(--chalk); text-wrap:balance; line-height:1.1; }
  .squiggle{ width:200px; height:14px; margin-top:-2px; }
  .squiggle path{ fill:none; stroke:var(--yellow); stroke-width:4; stroke-linecap:round; }
  .subtitle, .tense-rule{ margin:4px 0 0; font-size:1rem; color:var(--chalk-dim); max-width:58ch; text-wrap:balance; text-align:center; }
  .subtitle strong, .tense-rule strong{ color:var(--chalk); font-weight:600; }

  .diagram-desktop{ display:none; }
  .canvas{ position:relative; width:964px; height:438px; margin:0 auto; }
  .canvas svg.connectors{ position:absolute; inset:0; width:100%; height:100%; overflow:visible; }
  .connectors line{ stroke:var(--line); stroke-width:2; }
  .connectors circle{ fill:var(--slate-1); stroke:var(--line); stroke-width:2; }
  .node{ position:absolute; overflow:hidden; background:var(--slate-2); border:1.5px solid var(--line-soft); box-shadow:0 8px 20px -12px #00000080; }
  .hub{ left:0; top:0; width:200px; height:438px; border-radius:100px; display:flex; align-items:center; justify-content:center; }
  .hub span{ font-family:"Kalam",cursive; font-weight:700; font-size:1.6rem; color:var(--chalk); }
  .verb{ width:340px; height:130px; border-radius:65px; display:flex; flex-direction:column; }
  .verb-head{ text-align:center; padding:8px 20px 6px; font-family:"Kalam",cursive; font-weight:700; font-size:1.2rem; color:var(--slate-1); }
  .verb-rows{ flex:1; display:flex; flex-direction:column; justify-content:center; gap:4px; padding:2px 26px 10px; }
  .verb-row{ display:flex; align-items:baseline; justify-content:space-between; gap:10px; }
  .verb-row .who{ font-size:.8rem; color:var(--chalk-dim); white-space:nowrap; }
  .verb-row .form{ font-weight:700; font-size:1.05rem; color:var(--chalk); white-space:nowrap; }
  .verb-row.solo{ justify-content:center; gap:8px; }
  .verb-row.solo .who{ font-style:italic; }
  .v-be .verb-head{ background:var(--sky); } .v-have .verb-head{ background:var(--yellow); }
  .v-do .verb-head{ background:var(--coral); } .v-go .verb-head{ background:var(--mint); }
  .v-make .verb-head{ background:var(--lilac); } .v-get .verb-head{ background:var(--amber); }

  .diagram-mobile{ display:flex; flex-direction:column; gap:16px; width:100%; max-width:480px; margin:0 auto; }
  .diagram-mobile .node{ position:static; width:100%; height:auto; border-radius:36px; }
  .diagram-mobile .hub{ padding:18px 0; }
  .diagram-mobile .verb-rows{ padding:6px 30px 16px; }

  @media (min-width:1050px){ .diagram-desktop{ display:block; } .diagram-mobile{ display:none; } }

  .examples{ width:100%; }
  .examples h3{ margin:0 0 12px; font-family:"Kalam",cursive; font-weight:700; font-size:1.15rem; color:var(--chalk); text-align:center; }
  .examples-grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:12px; }
  .example-card{ background:#00000018; border:1.5px dashed var(--line-soft); border-radius:12px; padding:12px 16px; display:flex; flex-direction:column; gap:6px; }
  .example-card .subj-row{ display:flex; align-items:center; gap:8px; }
  .example-card .subj{ font-family:"Kalam",cursive; font-weight:700; font-size:1rem; color:var(--chalk); }
  .example-card .grp-tag{ font-size:.62rem; text-transform:uppercase; letter-spacing:.04em; font-weight:600; padding:2px 8px; border-radius:999px; white-space:nowrap; }
  .example-card .grp-tag.he{ background:#e8607a26; color:#e8607a; }
  .example-card .grp-tag.they{ background:#5fd0c726; color:#5fd0c7; }
  .example-card p{ margin:0; font-size:.92rem; color:var(--chalk-dim); line-height:1.4; }
  .example-card p strong{ color:var(--chalk); font-weight:700; }
  .example-card p.es{ font-size:.84rem; font-style:italic; color:var(--chalk-faint); }
  .example-card p.note{ font-size:.78rem; color:var(--yellow); font-style:normal; line-height:1.4; }

  .pagenav{ display:flex; justify-content:space-between; align-items:center; gap:12px; border-top:1.5px dashed var(--line-soft); padding-top:20px; width:100%; }
  .pagenav a{ text-decoration:none; font-size:.85rem; color:var(--chalk-dim); border:1.5px solid var(--line-soft); border-radius:999px; padding:9px 18px; transition:color .15s,border-color .15s,background .15s; }
  .pagenav a:hover{ color:var(--slate-1); background:var(--chalk); border-color:var(--chalk); }
  .pagenav .spacer{ flex:1; }

  .copyright{ text-align:center; margin:0; font-size:.72rem; color:var(--chalk-faint); }

  /* ---------- practice link (on tense pages) ---------- */
  .practice-cta{
    display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;
    background:var(--yellow); color:var(--slate-1); border-radius:18px; padding:16px 22px;
    text-decoration:none;
  }
  .practice-cta strong{ font-family:"Kalam",cursive; font-size:1.15rem; }
  .practice-cta span{ font-size:.85rem; opacity:.85; }
  .practice-cta .go{ font-weight:700; font-size:.9rem; white-space:nowrap; }

  /* ---------- practice page ---------- */
  .practice-block{ display:flex; flex-direction:column; gap:16px; }
  .practice-block h2{ margin:0; font-family:"Kalam",cursive; font-weight:700; font-size:1.3rem; color:var(--chalk); text-align:center; }
  .practice-block .practice-sub{ margin:-8px 0 0; font-size:.88rem; color:var(--chalk-dim); text-align:center; }

  .quiz{ display:flex; flex-direction:column; gap:14px; }
  .quiz-item{
    background:var(--slate-2); border:1.5px solid var(--line-soft); border-radius:16px;
    padding:18px 20px; display:flex; flex-direction:column; gap:12px;
  }
  .q-sentence{ margin:0; font-size:1.05rem; line-height:1.5; }
  .q-sentence .blank{ display:inline-block; min-width:56px; border-bottom:2px dashed var(--line); }
  .q-prompt{ margin:0; font-size:.9rem; color:var(--chalk-dim); }
  .quiz-item audio{ width:100%; height:36px; }
  .q-options{ display:flex; flex-wrap:wrap; gap:10px; }
  .q-options button{
    font:inherit; font-size:.92rem; font-weight:600; cursor:pointer;
    background:var(--slate-1); color:var(--chalk); border:1.5px solid var(--line-soft);
    border-radius:10px; padding:9px 16px; transition:border-color .15s, background .15s;
  }
  .q-options button:hover:not(:disabled){ border-color:var(--line); }
  .q-options button:disabled{ cursor:default; }
  .q-options button.correct{ background:#2e7d3240; border-color:#4caf50; color:var(--chalk); }
  .q-options button.wrong{ background:#c0392b40; border-color:#e57373; color:var(--chalk); }
  .q-feedback{ margin:0; font-size:.85rem; min-height:1.2em; }
  .q-feedback.ok{ color:#8ee0b0; } .q-feedback.no{ color:#ef8f66; }

  .quiz-score{
    align-self:center; font-family:"Kalam",cursive; font-weight:700; font-size:1.1rem;
    color:var(--slate-1); background:var(--chalk); border-radius:999px; padding:8px 20px;
  }

  /* ---------- hub / index page ---------- */
  .hub-intro{ text-align:center; font-size:1rem; color:var(--chalk-dim); max-width:60ch; margin:0 auto; text-wrap:balance; }
  .hub-group{ display:flex; flex-direction:column; gap:14px; }
  .hub-group h2{ margin:0; font-family:"Kalam",cursive; font-weight:700; font-size:1.3rem; color:var(--yellow); text-align:center; }
  .card-grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:16px; }
  .tense-card{
    display:block; text-decoration:none; background:var(--slate-2); border:1.5px solid var(--line-soft);
    border-radius:20px; padding:18px 20px; transition:transform .15s,border-color .15s; position:relative; overflow:hidden;
  }
  .tense-card:hover{ transform:translateY(-3px); border-color:var(--line); }
  .tense-card .bar{ position:absolute; left:0; top:0; bottom:0; width:6px; }
  .tense-card h3{ margin:0 0 6px; font-family:"Kalam",cursive; font-weight:700; font-size:1.25rem; color:var(--chalk); }
  .tense-card p{ margin:0; font-size:.85rem; color:var(--chalk-dim); line-height:1.45; }
  .tense-card .go{ display:inline-block; margin-top:10px; font-size:.75rem; color:var(--yellow); font-weight:600; }

  .games-link{ text-decoration:none; font-size:.85rem; font-weight:700; color:var(--slate-1); background:var(--yellow); border-radius:999px; padding:7px 16px; }
  .games-link:hover{ filter:brightness(1.07); }

  @media print{
    body{ background:var(--slate-1) !important; -webkit-print-color-adjust:exact; print-color-adjust:exact; padding:14px; }
    .diagram-mobile{ display:none !important; } .diagram-desktop{ display:block !important; }
    .canvas{ transform:scale(.74); transform-origin:top left; margin-bottom:-114px; }
    .pagenav, .crumb{ display:none !important; }
  }
`;

const HEAD = (title) => `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&family=Archivo:ital,wght@0,500;0,600;0,700;1,500&display=swap">
<style>${CSS}</style>
<script src="https://mieducacion.es/analytics.js" defer></script>
</head>
<body>
<div class="board">
`;

const COPYRIGHT = `<p class="copyright">© ${new Date().getFullYear()} Sebastián González Rodríguez</p>`;

const FOOT = `${COPYRIGHT}
</div>
</body>
</html>
`;

// ---------- fixed, proven canvas geometry (do not recompute) ----------
const CONNECTORS_SVG = `<svg class="connectors" viewBox="0 0 964 438" preserveAspectRatio="none">
          <line x1="177" y1="36.5"  x2="240" y2="65"/>
          <line x1="200" y1="109.5" x2="604" y2="65"/>
          <line x1="200" y1="182.5" x2="240" y2="219"/>
          <line x1="200" y1="255.5" x2="604" y2="219"/>
          <line x1="200" y1="328.5" x2="240" y2="373"/>
          <line x1="177" y1="401.5" x2="604" y2="373"/>
          <circle cx="177" cy="36.5"  r="4"/>
          <circle cx="200" cy="109.5" r="4"/>
          <circle cx="200" cy="182.5" r="4"/>
          <circle cx="200" cy="255.5" r="4"/>
          <circle cx="200" cy="328.5" r="4"/>
          <circle cx="177" cy="401.5" r="4"/>
          <circle cx="240" cy="65"  r="4.5"/>
          <circle cx="604" cy="65"  r="4.5"/>
          <circle cx="240" cy="219" r="4.5"/>
          <circle cx="604" cy="219" r="4.5"/>
          <circle cx="240" cy="373" r="4.5"/>
          <circle cx="604" cy="373" r="4.5"/>
        </svg>`;

const VERB_POS = {
  be:   { left: 240, top: 0,   cls: "v-be",   head: "To Be" },
  have: { left: 604, top: 0,   cls: "v-have", head: "To Have" },
  do:   { left: 240, top: 154, cls: "v-do",   head: "To Do" },
  go:   { left: 604, top: 154, cls: "v-go",   head: "To Go" },
  make: { left: 240, top: 308, cls: "v-make", head: "To Make" },
  get:  { left: 604, top: 308, cls: "v-get",  head: "To Get" },
};
const VERB_ORDER = ["be", "have", "do", "go", "make", "get"];

function verbRows(rows) {
  if (rows.length === 1) {
    return `<div class="verb-row solo"><span class="who">${rows[0][0]}</span><span class="form">${rows[0][1]}</span></div>`;
  }
  return rows.map(([who, form]) => `<div class="verb-row"><span class="who">${who}</span><span class="form">${form}</span></div>`).join("\n            ");
}

function renderVerbNode(key, rows, desktop) {
  const p = VERB_POS[key];
  const style = desktop ? ` style="left:${p.left}px; top:${p.top}px;"` : "";
  return `<div class="node verb ${p.cls}"${style}>
        <div class="verb-head">${p.head}</div>
        <div class="verb-rows">
          ${verbRows(rows)}
        </div>
      </div>`;
}

function renderDiagram(verbs) {
  const desktopNodes = VERB_ORDER.map((k) => renderVerbNode(k, verbs[k], true)).join("\n\n      ");
  const mobileNodes = VERB_ORDER.map((k) => renderVerbNode(k, verbs[k], false)).join("\n\n    ");
  return `<div class="diagram-desktop">
    <div class="canvas">
      ${CONNECTORS_SVG}

      <div class="node hub"><span>SUJETO</span></div>

      ${desktopNodes}
    </div>
  </div>

  <div class="diagram-mobile">
    <div class="node hub"><span>SUJETO</span></div>

    ${mobileNodes}
  </div>`;
}

const SLOTS_EN = [
  { left: 240, top: 0 }, { left: 604, top: 0 },
  { left: 240, top: 154 }, { left: 604, top: 154 },
  { left: 240, top: 308 }, { left: 604, top: 308 },
];
const SLOT_COLORS = ["v-be", "v-have", "v-do", "v-go", "v-make", "v-get"];

// Generic 6-box node map for grammar topics that are not verb conjugations
// (modals, possessives, pronouns). Same geometry/connectors as renderDiagram.
function renderGenericDiagram(d) {
  const node = (b, i, desktop) => {
    const pos = SLOTS_EN[i];
    const style = desktop ? ` style="left:${pos.left}px; top:${pos.top}px;"` : "";
    return `<div class="node verb ${SLOT_COLORS[i]}"${style}>
        <div class="verb-head">${b.head}</div>
        <div class="verb-rows">
          ${verbRows(b.rows)}
        </div>
      </div>`;
  };
  const desktopNodes = d.boxes.map((b, i) => node(b, i, true)).join("\n\n      ");
  const mobileNodes = d.boxes.map((b, i) => node(b, i, false)).join("\n\n    ");
  return `<div class="diagram-desktop">
    <div class="canvas">
      ${CONNECTORS_SVG}

      <div class="node hub"><span>${d.hub}</span></div>

      ${desktopNodes}
    </div>
  </div>

  <div class="diagram-mobile">
    <div class="node hub"><span>${d.hub}</span></div>

    ${mobileNodes}
  </div>`;
}

function renderExamples(examples) {
  const cards = examples
    .map(([subj, grp, sentence, es, note]) => {
      const grpClass = grp === "He · She · It" ? "he" : "they";
      const noteHtml = note ? `<p class="note">💡 ${note}</p>` : "";
      return `<div class="example-card">
        <div class="subj-row"><span class="subj">${subj}</span><span class="grp-tag ${grpClass}">${grp}</span></div>
        <p>${sentence}</p>
        <p class="es">${es}</p>
        ${noteHtml}
      </div>`;
    })
    .join("\n      ");
  return `<div class="examples">
    <h3>Ejemplos con otros sujetos</h3>
    <div class="examples-grid">
      ${cards}
    </div>
  </div>`;
}

// ============================================================
// TENSE DATA
// ============================================================
const TENSES = [
  {
    slug: "presente-simple",
    group: "Tiempos Simples",
    title: "Presente Simple",
    eyebrow: "Tiempo 1 de 6 · Tiempos Simples",
    rule: `<strong>Regla:</strong> solo He · She · It cambia el verbo (agrega -s o -es). Los demás sujetos usan la forma base. <strong>To Be es la excepción</strong> — tiene tres formas propias.`,
    cardDesc: "Solo He · She · It cambia el verbo. To Be es la excepción con tres formas.",
    color: "sky",
    verbs: {
      be: [["I", "am"], ["He · She · It", "is"], ["You · We · They", "are"]],
      have: [["I · You · We · They", "have"], ["He · She · It", "has"]],
      do: [["I · You · We · They", "do"], ["He · She · It", "does"]],
      go: [["I · You · We · They", "go"], ["He · She · It", "goes"]],
      make: [["I · You · We · They", "make"], ["He · She · It", "makes"]],
      get: [["I · You · We · They", "get"], ["He · She · It", "gets"]],
    },
    examples: [
      ["María", "He · She · It", "María <strong>goes</strong> to school every day.", "→ María va a la escuela todos los días."],
      ["The students", "You · We · They", "The students <strong>have</strong> a test tomorrow.", "→ Los estudiantes tienen una prueba mañana."],
      ["My brother", "He · She · It", "My brother <strong>makes</strong> breakfast on Sundays.", "→ Mi hermano prepara el desayuno los domingos."],
      ["Ana and Luis", "You · We · They", "Ana and Luis <strong>do</strong> their homework together.", "→ Ana y Luis hacen la tarea juntos."],
    ],
    practice: [
      { sentence: "María ___ to school every day.", options: ["goes", "go", "going"], correct: 0 },
      { sentence: "The students ___ a test tomorrow.", options: ["have", "has", "had"], correct: 0 },
      { sentence: "My brother ___ breakfast on Sundays.", options: ["makes", "make", "made"], correct: 0 },
      { sentence: "Ana and Luis ___ their homework together.", options: ["do", "does", "did"], correct: 0 },
      { sentence: "I ___ a student.", options: ["am", "is", "are"], correct: 0 },
    ],
  },
  {
    slug: "presente-simple-negativo",
    group: "Tiempos Simples",
    title: "Presente Simple — Negativo",
    rule: `<strong>Regla:</strong> don't / doesn't + verbo base. Solo He · She · It usa "doesn't" — los demás usan "don't". <strong>To Be es la excepción</strong> — no usa don't/doesn't.`,
    cardDesc: `Don't / doesn't + verbo. To Be no sigue esta regla.`,
    color: "sky",
    verbs: {
      be: [["I", "am not"], ["He · She · It", "isn't"], ["You · We · They", "aren't"]],
      have: [["I · You · We · They", "don't have"], ["He · She · It", "doesn't have"]],
      do: [["I · You · We · They", "don't do"], ["He · She · It", "doesn't do"]],
      go: [["I · You · We · They", "don't go"], ["He · She · It", "doesn't go"]],
      make: [["I · You · We · They", "don't make"], ["He · She · It", "doesn't make"]],
      get: [["I · You · We · They", "don't get"], ["He · She · It", "doesn't get"]],
    },
    examples: [
      ["María", "He · She · It", "María <strong>doesn't go</strong> to school on Sundays.", "→ María no va a la escuela los domingos."],
      ["The students", "You · We · They", "The students <strong>don't have</strong> class today.", "→ Los estudiantes no tienen clase hoy."],
      ["My brother", "He · She · It", "My brother <strong>doesn't make</strong> breakfast on weekdays.", "→ Mi hermano no prepara el desayuno entre semana."],
      ["Ana and Luis", "You · We · They", "Ana and Luis <strong>don't do</strong> homework on Fridays.", "→ Ana y Luis no hacen tarea los viernes."],
    ],
    practice: [
      { sentence: "María ___ go to school on Sundays.", options: ["doesn't", "don't", "isn't"], correct: 0 },
      { sentence: "The students ___ have class today.", options: ["don't", "doesn't", "didn't"], correct: 0 },
      { sentence: "My brother ___ make breakfast on weekdays.", options: ["doesn't", "don't", "wasn't"], correct: 0 },
      { sentence: "Ana and Luis ___ do homework on Fridays.", options: ["don't", "doesn't", "aren't"], correct: 0 },
      { sentence: "I ___ tired right now.", options: ["am not", "isn't", "don't"], correct: 0 },
    ],
  },
  {
    slug: "presente-simple-preguntas",
    group: "Tiempos Simples",
    title: "Presente Simple — Preguntas",
    rule: `<strong>Regla:</strong> Do / Does + sujeto + verbo base? Solo He · She · It usa "Does". <strong>To Be es la excepción</strong> — se invierte: Am / Is / Are + sujeto?`,
    cardDesc: `Do / Does + sujeto + verbo? To Be se invierte en vez de usar do/does.`,
    color: "sky",
    verbs: {
      be: [["I", "Am I...?"], ["He · She · It", "Is he...?"], ["You · We · They", "Are you...?"]],
      have: [["I · You · We · They", "Do you have...?"], ["He · She · It", "Does he have...?"]],
      do: [["I · You · We · They", "Do you do...?"], ["He · She · It", "Does he do...?"]],
      go: [["I · You · We · They", "Do you go...?"], ["He · She · It", "Does he go...?"]],
      make: [["I · You · We · They", "Do you make...?"], ["He · She · It", "Does he make...?"]],
      get: [["I · You · We · They", "Do you get...?"], ["He · She · It", "Does he get...?"]],
    },
    examples: [
      ["María", "He · She · It", "<strong>Does María go</strong> to school by bus?", "→ ¿María va a la escuela en autobús?"],
      ["The students", "You · We · They", "<strong>Do the students have</strong> a test tomorrow?", "→ ¿Los estudiantes tienen una prueba mañana?"],
      ["My brother", "He · She · It", "<strong>Does my brother make</strong> breakfast every day?", "→ ¿Mi hermano prepara el desayuno todos los días?"],
      ["Ana and Luis", "You · We · They", "<strong>Do Ana and Luis do</strong> their homework together?", "→ ¿Ana and Luis hacen la tarea juntos?"],
    ],
    practice: [
      { sentence: "___ María go to school by bus?", options: ["Does", "Do", "Is"], correct: 0 },
      { sentence: "___ the students have a test tomorrow?", options: ["Do", "Does", "Are"], correct: 0 },
      { sentence: "___ my brother make breakfast every day?", options: ["Does", "Do", "Is"], correct: 0 },
      { sentence: "___ Ana and Luis do their homework together?", options: ["Do", "Does", "Did"], correct: 0 },
      { sentence: "___ you happy?", options: ["Are", "Do", "Is"], correct: 0 },
    ],
  },
  {
    slug: "pasado-simple",
    group: "Tiempos Simples",
    title: "Pasado Simple",
    rule: `<strong>Regla:</strong> el verbo no cambia según el sujeto — es el mismo para todos. <strong>To Be es la excepción</strong> — usa was o were según quién sea.`,
    cardDesc: "El verbo no cambia con nadie. To Be es la excepción (was / were).",
    color: "coral",
    verbs: {
      be: [["I · He · She · It", "was"], ["You · We · They", "were"]],
      have: [["Todos los sujetos", "had"]],
      do: [["Todos los sujetos", "did"]],
      go: [["Todos los sujetos", "went"]],
      make: [["Todos los sujetos", "made"]],
      get: [["Todos los sujetos", "got"]],
    },
    examples: [
      ["María", "He · She · It", "María <strong>went</strong> to school yesterday.", "→ María fue a la escuela ayer."],
      ["The students", "You · We · They", "The students <strong>had</strong> a test last week.", "→ Los estudiantes tuvieron una prueba la semana pasada."],
      ["My brother", "He · She · It", "My brother <strong>made</strong> breakfast this morning.", "→ Mi hermano preparó el desayuno esta mañana."],
      ["Ana and Luis", "You · We · They", "Ana and Luis <strong>did</strong> their homework together.", "→ Ana y Luis hicieron la tarea juntos."],
    ],
    practice: [
      { sentence: "María ___ to school yesterday.", options: ["went", "go", "goes"], correct: 0 },
      { sentence: "The students ___ a test last week.", options: ["had", "have", "has"], correct: 0 },
      { sentence: "My brother ___ breakfast this morning.", options: ["made", "make", "makes"], correct: 0 },
      { sentence: "Ana and Luis ___ their homework together.", options: ["did", "do", "does"], correct: 0 },
      { sentence: "I ___ happy yesterday.", options: ["was", "were", "am"], correct: 0 },
    ],
  },
  {
    slug: "pasado-simple-negativo",
    group: "Tiempos Simples",
    title: "Pasado Simple — Negativo",
    rule: `<strong>Regla:</strong> didn't + verbo base, para todos los sujetos. <strong>To Be es la excepción</strong> — usa wasn't o weren't.`,
    cardDesc: `Didn't + verbo, para todos. To Be usa wasn't / weren't.`,
    color: "coral",
    verbs: {
      be: [["I · He · She · It", "wasn't"], ["You · We · They", "weren't"]],
      have: [["Todos los sujetos", "didn't have"]],
      do: [["Todos los sujetos", "didn't do"]],
      go: [["Todos los sujetos", "didn't go"]],
      make: [["Todos los sujetos", "didn't make"]],
      get: [["Todos los sujetos", "didn't get"]],
    },
    examples: [
      ["María", "He · She · It", "María <strong>didn't go</strong> to school yesterday.", "→ María no fue a la escuela ayer."],
      ["The students", "You · We · They", "The students <strong>didn't have</strong> a test last week.", "→ Los estudiantes no tuvieron una prueba la semana pasada."],
      ["My brother", "He · She · It", "My brother <strong>didn't make</strong> breakfast this morning.", "→ Mi hermano no preparó el desayuno esta mañana."],
      ["Ana and Luis", "You · We · They", "Ana and Luis <strong>didn't do</strong> their homework together.", "→ Ana y Luis no hicieron la tarea juntos."],
    ],
    practice: [
      { sentence: "María ___ go to school yesterday.", options: ["didn't", "doesn't", "wasn't"], correct: 0 },
      { sentence: "The students ___ have a test last week.", options: ["didn't", "don't", "weren't"], correct: 0 },
      { sentence: "My brother ___ make breakfast this morning.", options: ["didn't", "doesn't", "don't"], correct: 0 },
      { sentence: "Ana and Luis ___ do their homework together.", options: ["didn't", "don't", "doesn't"], correct: 0 },
      { sentence: "I ___ tired yesterday.", options: ["wasn't", "weren't", "didn't"], correct: 0 },
    ],
  },
  {
    slug: "pasado-simple-preguntas",
    group: "Tiempos Simples",
    title: "Pasado Simple — Preguntas",
    rule: `<strong>Regla:</strong> Did + sujeto + verbo base?, para todos los sujetos. <strong>To Be es la excepción</strong> — se invierte: Was / Were + sujeto?`,
    cardDesc: `Did + sujeto + verbo?, para todos. To Be se invierte (Was / Were).`,
    color: "coral",
    verbs: {
      be: [["I · He · She · It", "Was...?"], ["You · We · They", "Were...?"]],
      have: [["Todos los sujetos", "Did you have...?"]],
      do: [["Todos los sujetos", "Did you do...?"]],
      go: [["Todos los sujetos", "Did you go...?"]],
      make: [["Todos los sujetos", "Did you make...?"]],
      get: [["Todos los sujetos", "Did you get...?"]],
    },
    examples: [
      ["María", "He · She · It", "<strong>Did María go</strong> to school yesterday?", "→ ¿María fue a la escuela ayer?"],
      ["The students", "You · We · They", "<strong>Did the students have</strong> a test last week?", "→ ¿Los estudiantes tuvieron una prueba la semana pasada?"],
      ["My brother", "He · She · It", "<strong>Did my brother make</strong> breakfast this morning?", "→ ¿Mi hermano preparó el desayuno esta mañana?"],
      ["Ana and Luis", "You · We · They", "<strong>Did Ana and Luis do</strong> their homework together?", "→ ¿Ana and Luis hicieron la tarea juntos?"],
    ],
    practice: [
      { sentence: "___ María go to school yesterday?", options: ["Did", "Does", "Was"], correct: 0 },
      { sentence: "___ the students have a test last week?", options: ["Did", "Do", "Were"], correct: 0 },
      { sentence: "___ my brother make breakfast this morning?", options: ["Did", "Does", "Was"], correct: 0 },
      { sentence: "___ Ana and Luis do their homework together?", options: ["Did", "Do", "Does"], correct: 0 },
      { sentence: "___ you tired yesterday?", options: ["Were", "Did", "Was"], correct: 0 },
    ],
  },
  {
    slug: "futuro-simple",
    group: "Tiempos Simples",
    title: "Futuro Simple",
    rule: `<strong>Regla:</strong> con "will", el verbo nunca cambia — ni siquiera To Be. Es la más fácil de las tres.`,
    cardDesc: `Con "will", el verbo nunca cambia — ni siquiera To Be.`,
    color: "mint",
    verbs: {
      be: [["Todos los sujetos", "will be"]],
      have: [["Todos los sujetos", "will have"]],
      do: [["Todos los sujetos", "will do"]],
      go: [["Todos los sujetos", "will go"]],
      make: [["Todos los sujetos", "will make"]],
      get: [["Todos los sujetos", "will get"]],
    },
    examples: [
      ["María", "He · She · It", "María <strong>will go</strong> to school tomorrow.", "→ María irá a la escuela mañana."],
      ["The students", "You · We · They", "The students <strong>will have</strong> a test next week.", "→ Los estudiantes tendrán una prueba la próxima semana."],
      ["My brother", "He · She · It", "My brother <strong>will make</strong> breakfast on Sunday.", "→ Mi hermano preparará el desayuno el domingo."],
      ["Ana and Luis", "You · We · They", "Ana and Luis <strong>will do</strong> their homework together.", "→ Ana y Luis harán la tarea juntos."],
    ],
    practice: [
      { sentence: "María ___ to school tomorrow.", options: ["will go", "goes", "went"], correct: 0 },
      { sentence: "The students ___ a test next week.", options: ["will have", "have", "had"], correct: 0 },
      { sentence: "My brother ___ breakfast on Sunday.", options: ["will make", "makes", "made"], correct: 0 },
      { sentence: "Ana and Luis ___ their homework together.", options: ["will do", "do", "did"], correct: 0 },
      { sentence: "I ___ happy tomorrow.", options: ["will be", "am", "was"], correct: 0 },
    ],
  },
  {
    slug: "presente-continuo",
    group: "Tiempos Continuos",
    title: "Presente Continuo",
    eyebrow: "Tiempo 4 de 6 · Tiempos Continuos",
    rule: `<strong>Regla:</strong> siempre am / is / are + -ing. No importa cuál sea el verbo principal — todos siguen el mismo patrón.`,
    cardDesc: "Siempre am / is / are + -ing, sin importar el verbo.",
    color: "lilac",
    verbs: {
      be: [["I", "am being"], ["He · She · It", "is being"], ["You · We · They", "are being"]],
      have: [["I", "am having"], ["He · She · It", "is having"], ["You · We · They", "are having"]],
      do: [["I", "am doing"], ["He · She · It", "is doing"], ["You · We · They", "are doing"]],
      go: [["I", "am going"], ["He · She · It", "is going"], ["You · We · They", "are going"]],
      make: [["I", "am making"], ["He · She · It", "is making"], ["You · We · They", "are making"]],
      get: [["I", "am getting"], ["He · She · It", "is getting"], ["You · We · They", "are getting"]],
    },
    examples: [
      ["María", "He · She · It", "María <strong>is going</strong> to school right now.", "→ María está yendo a la escuela ahora mismo."],
      ["The students", "You · We · They", "The students <strong>are having</strong> a test at this moment.", "→ Los estudiantes están en una prueba en este momento."],
      ["My brother", "He · She · It", "My brother <strong>is making</strong> breakfast right now.", "→ Mi hermano está preparando el desayuno ahora mismo."],
      ["Ana and Luis", "You · We · They", "Ana and Luis <strong>are doing</strong> their homework together.", "→ Ana y Luis están haciendo la tarea juntos."],
    ],
    practice: [
      { sentence: "María ___ to school right now.", options: ["is going", "goes", "go"], correct: 0 },
      { sentence: "The students ___ a test at this moment.", options: ["are having", "have", "has"], correct: 0 },
      { sentence: "My brother ___ breakfast right now.", options: ["is making", "makes", "make"], correct: 0 },
      { sentence: "Ana and Luis ___ their homework together.", options: ["are doing", "do", "does"], correct: 0 },
      { sentence: "I ___ my homework right now.", options: ["am doing", "do", "does"], correct: 0 },
    ],
  },
  {
    slug: "pasado-continuo",
    group: "Tiempos Continuos",
    title: "Pasado Continuo",
    eyebrow: "Tiempo 5 de 6 · Tiempos Continuos",
    rule: `<strong>Regla:</strong> was para I y He · She · It — were para el resto. Siempre + -ing.`,
    cardDesc: "Was (I, He·She·It) o were (el resto) + -ing.",
    color: "amber",
    verbs: {
      be: [["I · He · She · It", "was being"], ["You · We · They", "were being"]],
      have: [["I · He · She · It", "was having"], ["You · We · They", "were having"]],
      do: [["I · He · She · It", "was doing"], ["You · We · They", "were doing"]],
      go: [["I · He · She · It", "was going"], ["You · We · They", "were going"]],
      make: [["I · He · She · It", "was making"], ["You · We · They", "were making"]],
      get: [["I · He · She · It", "was getting"], ["You · We · They", "were getting"]],
    },
    examples: [
      ["María", "He · She · It", "María <strong>was going</strong> to school when it started to rain.", "→ María iba camino a la escuela cuando empezó a llover.", "Se usa cuando una acción larga es interrumpida por otra más corta (aquí, en pasado simple)."],
      ["The students", "You · We · They", "The students <strong>were having</strong> a test when the bell rang.", "→ Los estudiantes estaban en una prueba cuando sonó el timbre."],
      ["My brother", "He · She · It", "My brother <strong>was making</strong> breakfast when I woke up.", "→ Mi hermano estaba preparando el desayuno cuando desperté."],
      ["Ana and Luis", "You · We · They", "Ana and Luis <strong>were doing</strong> their homework when I called.", "→ Ana y Luis estaban haciendo la tarea cuando llamé."],
    ],
    practice: [
      { sentence: "María ___ to school when it started to rain.", options: ["was going", "is going", "went"], correct: 0 },
      { sentence: "The students ___ a test when the bell rang.", options: ["were having", "are having", "had"], correct: 0 },
      { sentence: "My brother ___ breakfast when I woke up.", options: ["was making", "is making", "made"], correct: 0 },
      { sentence: "Ana and Luis ___ their homework when I called.", options: ["were doing", "are doing", "did"], correct: 0 },
      { sentence: "I ___ my homework when you called.", options: ["was doing", "am doing", "did"], correct: 0 },
    ],
  },
  {
    slug: "futuro-going-to",
    group: "Tiempos Continuos",
    title: `Futuro con "Going To"`,
    eyebrow: "Tiempo 6 de 6 · Otra forma de futuro",
    rule: `<strong>Regla:</strong> am / is / are + going to + verbo. A diferencia de "will", aquí el verbo <strong>sí</strong> cambia según el sujeto.`,
    cardDesc: `Am / is / are + going to + verbo. A diferencia de "will", sí cambia.`,
    color: "yellow",
    verbs: {
      be: [["I", "am going to be"], ["He · She · It", "is going to be"], ["You · We · They", "are going to be"]],
      have: [["I", "am going to have"], ["He · She · It", "is going to have"], ["You · We · They", "are going to have"]],
      do: [["I", "am going to do"], ["He · She · It", "is going to do"], ["You · We · They", "are going to do"]],
      go: [["I", "am going to go"], ["He · She · It", "is going to go"], ["You · We · They", "are going to go"]],
      make: [["I", "am going to make"], ["He · She · It", "is going to make"], ["You · We · They", "are going to make"]],
      get: [["I", "am going to get"], ["He · She · It", "is going to get"], ["You · We · They", "are going to get"]],
    },
    examples: [
      ["María", "He · She · It", "María <strong>is going to go</strong> to school tomorrow.", "→ María va a ir a la escuela mañana.", "\"Going to\" se usa para planes ya decididos, a diferencia de \"will\" (decisiones del momento)."],
      ["The students", "You · We · They", "The students <strong>are going to have</strong> a test next week.", "→ Los estudiantes van a tener una prueba la próxima semana."],
      ["My brother", "He · She · It", "My brother <strong>is going to make</strong> breakfast on Sunday.", "→ Mi hermano va a preparar el desayuno el domingo."],
      ["Ana and Luis", "You · We · They", "Ana and Luis <strong>are going to do</strong> their homework together.", "→ Ana y Luis van a hacer la tarea juntos."],
    ],
    practice: [
      { sentence: "María ___ to school tomorrow.", options: ["is going to go", "will go", "goes"], correct: 0 },
      { sentence: "The students ___ a test next week.", options: ["are going to have", "will have", "have"], correct: 0 },
      { sentence: "My brother ___ breakfast on Sunday.", options: ["is going to make", "will make", "makes"], correct: 0 },
      { sentence: "Ana and Luis ___ their homework together.", options: ["are going to do", "will do", "do"], correct: 0 },
      { sentence: "I ___ my homework tonight.", options: ["am going to do", "will do", "do"], correct: 0 },
    ],
  },
];

TENSES.push(...require("./verbos_extra_en.js"));

function siteNav(current) {
  const sites = [
    { key: "inicio", href: "https://mieducacion.es", label: "🏠 Inicio" },
    { key: "libros", href: "https://libros.mieducacion.es", label: "📖 Libros" },
    { key: "cuadernos", href: "https://cuadernos.mieducacion.es", label: "📓 Cuadernos" },
    { key: "verbos", href: "https://verbos.mieducacion.es", label: "🔤 Verbos" },
  ];
  const links = sites
    .map((s) => `<a href="${s.href}"${s.key === current ? ' class="current"' : ""}>${s.label}</a>`)
    .join("\n    ");
  return `<nav class="site-nav">
    ${links}
  </nav>`;
}

function langSwitch(current) {
  // current: "en" | "fr" — the other languages' hub pages
  return `<nav class="lang-switch">
    <a href="index.html"${current === "en" ? ' class="current"' : ""}>🇬🇧 English</a>
    <a href="fr-index.html"${current === "fr" ? ' class="current"' : ""}>🇫🇷 Français</a>
  </nav>`;
}

function topicsMenu(currentSlug) {
  const groups = [...new Set(TENSES.map((t) => t.group))];
  const groupsHtml = groups
    .map((g) => {
      const items = TENSES.filter((t) => t.group === g)
        .map((t) => {
          const topicCurrent = t.slug === currentSlug ? " current" : "";
          const practiceCurrent = `${t.slug}-practica` === currentSlug ? " current" : "";
          return `<li class="topic-row">
            <a href="${t.slug}.html" class="topic-link${topicCurrent}">${t.title}</a>
            <a href="${t.slug}-practica.html" class="practice-link${practiceCurrent}" title="Practicar ${t.title}">🎯</a>
          </li>`;
        })
        .join("\n          ");
      return `<div>
          <p class="tgroup-label">${g}</p>
          <ul>
          ${items}
          </ul>
        </div>`;
    })
    .join("\n        ");
  return `<details class="topics-menu">
      <summary>☰ Todos los temas</summary>
      <div class="topics-panel">
        ${groupsHtml}
      </div>
    </details>`;
}

function shuffle(arr, seed) {
  // deterministic shuffle so the build is reproducible (no Math.random)
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function renderQuizItem(kind, index, innerHtml, optionsHtml) {
  return `<div class="quiz-item" data-quiz-item>
        ${innerHtml}
        <div class="q-options">
          ${optionsHtml}
        </div>
        <p class="q-feedback"></p>
      </div>`;
}

function renderPractice(t) {
  const items = t.practice || [];

  // ---- grammar (fill-in-the-blank, multiple choice) ----
  const grammarItems = items
    .map((item, i) => {
      const opts = shuffle(
        item.options.map((text, oi) => ({ text, correct: oi === item.correct })),
        i + 1
      );
      const optionsHtml = opts
        .map((o) => `<button${o.correct ? ' data-correct="true"' : ""}>${o.text}</button>`)
        .join("\n          ");
      const sentenceHtml = `<p class="q-sentence">${item.sentence.replace("___", '<span class="blank">___</span>')}</p>`;
      return renderQuizItem("grammar", i, sentenceHtml, optionsHtml);
    })
    .join("\n      ");

  // ---- listening (play audio of the full correct sentence, choose which sentence it was) ----
  const listeningItems = items
    .map((item, i) => {
      const fullSentences = item.options.map((opt, oi) => ({
        text: item.sentence.replace("___", opt),
        correct: oi === item.correct,
      }));
      const correctFull = fullSentences.find((s) => s.correct).text;
      const audioFile = AUDIO_MAP[correctFull];
      const opts = shuffle(fullSentences, i + 100);
      const optionsHtml = opts
        .map((o) => `<button${o.correct ? ' data-correct="true"' : ""}>${o.text}</button>`)
        .join("\n          ");
      const innerHtml = `<audio controls${audioFile ? ` src="audio/${audioFile}"` : ""}></audio>
        <p class="q-prompt">¿Cuál oración escuchaste?</p>`;
      return renderQuizItem("listening", i, innerHtml, optionsHtml);
    })
    .join("\n      ");

  return `<section class="practice-block">
    <h2>📝 Gramática</h2>
    <p class="practice-sub">${t.practiceSub || "Elige la forma correcta del verbo."}</p>
    <div class="quiz" data-quiz="grammar">
      ${grammarItems}
    </div>
    <p class="quiz-score" data-quiz-score="grammar">0 / ${items.length}</p>
  </section>

  <section class="practice-block">
    <h2>🎧 Listening</h2>
    <p class="practice-sub">Escucha el audio y elige la oración correcta.</p>
    <div class="quiz" data-quiz="listening">
      ${listeningItems}
    </div>
    <p class="quiz-score" data-quiz-score="listening">0 / ${items.length}</p>
  </section>`;
}

const QUIZ_SCRIPT = `<script>
(function(){
  document.querySelectorAll('[data-quiz-item]').forEach(function(item){
    var buttons = item.querySelectorAll('.q-options button');
    var feedback = item.querySelector('.q-feedback');
    var quiz = item.closest('.quiz');
    var scoreEl = quiz ? document.querySelector('[data-quiz-score="' + quiz.dataset.quiz + '"]') : null;
    buttons.forEach(function(btn){
      btn.addEventListener('click', function(){
        if (item.dataset.answered) return;
        item.dataset.answered = '1';
        var isCorrect = btn.dataset.correct === 'true';
        buttons.forEach(function(b){ b.disabled = true; });
        if (isCorrect) {
          btn.classList.add('correct');
          feedback.textContent = '✓ ¡Correcto!';
          feedback.className = 'q-feedback ok';
        } else {
          btn.classList.add('wrong');
          var correctBtn = item.querySelector('[data-correct="true"]');
          if (correctBtn) correctBtn.classList.add('correct');
          feedback.textContent = '✗ Incorrecto — la respuesta correcta está marcada.';
          feedback.className = 'q-feedback no';
        }
        if (scoreEl && isCorrect) {
          var parts = scoreEl.textContent.split(' / ');
          scoreEl.textContent = (parseInt(parts[0], 10) + 1) + ' / ' + parts[1];
        }
      });
    });
  });
})();
</script>`;

// ============================================================
// RENDER TENSE PAGES
// ============================================================
TENSES.forEach((t, idx) => {
  const prev = TENSES[idx - 1];
  const next = TENSES[idx + 1];
  const navPrev = prev ? `<a href="${prev.slug}.html">← ${prev.title}</a>` : `<span></span>`;
  const navNext = next ? `<a href="${next.slug}.html">${next.title} →</a>` : `<a href="index.html">Volver al inicio →</a>`;

  const html = `${HEAD(`${t.title} — ${t.siteTitle || "Conjugación de Verbos"}`)}
  ${siteNav("verbos")}
  ${langSwitch("en")}

  <nav class="crumb">
    ${topicsMenu(t.slug)}
    <a class="games-link" href="juegos.html">🎲 Aprender jugando</a>
    <span class="progress">Tema ${idx + 1} de ${TENSES.length} · ${t.group}</span>
  </nav>

  <header class="board-head">
    <p class="eyebrow">Estrategia de enseñanza · Gramática · Inglés</p>
    <h1>${t.title}</h1>
    <svg class="squiggle" viewBox="0 0 220 14"><path d="M4 8 Q 30 -2, 56 8 T 108 8 T 160 8 T 216 8"/></svg>
    <p class="subtitle">${t.rule}</p>
  </header>

  ${t.diagram ? renderGenericDiagram(t.diagram) : renderDiagram(t.verbs)}

  ${renderExamples(t.examples)}

  <a class="practice-cta" href="${t.slug}-practica.html">
    <strong>🎯 Practicar ${t.title}</strong>
    <span>${(t.practice || []).length} preguntas de gramática + ${(t.practice || []).length} de listening</span>
    <span class="go">Empezar →</span>
  </a>

  <nav class="pagenav">
    ${navPrev}
    <span class="spacer"></span>
    ${navNext}
  </nav>
${FOOT}`;

  fs.writeFileSync(path.join(OUT_DIR, `${t.slug}.html`), html, "utf-8");
  console.log("wrote", t.slug + ".html");

  // ---- practice page ----
  const practiceHtml = `${HEAD(`${t.title} — Práctica — ${t.siteTitle || "Conjugación de Verbos"}`)}
  ${siteNav("verbos")}
  ${langSwitch("en")}

  <nav class="crumb">
    ${topicsMenu(`${t.slug}-practica`)}
    <a class="games-link" href="juegos.html">🎲 Aprender jugando</a>
    <span class="progress">Práctica · ${t.title}</span>
  </nav>

  <header class="board-head">
    <p class="eyebrow">Práctica · Gramática y Listening</p>
    <h1>${t.title}</h1>
    <svg class="squiggle" viewBox="0 0 220 14"><path d="M4 8 Q 30 -2, 56 8 T 108 8 T 160 8 T 216 8"/></svg>
    <p class="subtitle">Pon a prueba lo que aprendiste. Haz clic en una opción para ver si es correcta.</p>
  </header>

  ${renderPractice(t)}

  <nav class="pagenav">
    <a href="${t.slug}.html">← Ver el mapa de ${t.title}</a>
    <span class="spacer"></span>
    <a href="index.html">Todos los temas →</a>
  </nav>
  ${COPYRIGHT}
</div>
${QUIZ_SCRIPT}
</body>
</html>
`;

  fs.writeFileSync(path.join(OUT_DIR, `${t.slug}-practica.html`), practiceHtml, "utf-8");
  console.log("wrote", t.slug + "-practica.html");
});

// ============================================================
// RENDER INDEX / HUB PAGE
// ============================================================
const groups = [...new Set(TENSES.map((t) => t.group))];
const groupsHtml = groups
  .map((g) => {
    const cards = TENSES.filter((t) => t.group === g)
      .map(
        (t) => `<a class="tense-card" href="${t.slug}.html">
        <span class="bar" style="background:var(--${t.color})"></span>
        <h3>${t.title}</h3>
        <p>${t.cardDesc}</p>
        <span class="go">Ver el mapa →</span>
      </a>`
      )
      .join("\n      ");
    return `<div class="hub-group">
    <h2>${g}</h2>
    <div class="card-grid">
      ${cards}
    </div>
  </div>`;
  })
  .join("\n\n  ");

const indexHtml = `${HEAD("Verbos y Gramática — Inicio")}
  ${siteNav("verbos")}
  ${langSwitch("en")}

  <header class="board-head">
    <p class="eyebrow">Estrategia de enseñanza · Gramática · Inglés</p>
    <h1>Verbos y Gramática</h1>
    <svg class="squiggle" viewBox="0 0 220 14"><path d="M4 8 Q 30 -2, 56 8 T 108 8 T 160 8 T 216 8"/></svg>
    <p class="hub-intro">Elige un tema para ver su mapa de nodos: el Sujeto en el centro, conectado a las formas correctas, con ejemplos con otros sujetos (no solo pronombres). Tiempos verbales, verbos modales, posesivos y pronombres.</p>
  </header>

  <a class="practice-cta" href="juegos.html">
    <strong>🎲 Aprender jugando</strong>
    <span>Ahorcado, memoria, concurso, ruleta y más para jugar por equipos en el aula</span>
    <span class="go">Jugar →</span>
  </a>

  ${groupsHtml}
${FOOT}`;

fs.writeFileSync(path.join(OUT_DIR, "index.html"), indexHtml, "utf-8");
console.log("wrote index.html");

// ============================================================
// EXPORT PRACTICE SENTENCES (for the Python/edge-tts audio step)
// ============================================================
const practiceSentences = [];
TENSES.forEach((t) => {
  (t.practice || []).forEach((item) => {
    practiceSentences.push(item.sentence.replace("___", item.options[item.correct]));
  });
});
fs.writeFileSync(
  path.join(__dirname, "practice_sentences.json"),
  JSON.stringify([...new Set(practiceSentences)], null, 2),
  "utf-8"
);
console.log("wrote practice_sentences.json —", new Set(practiceSentences).size, "unique sentences");

console.log("\nDone:", TENSES.length, "tense pages + 1 index page in", OUT_DIR);

// ============================================================
// SHARED EXPORTS (reused by build_verbos_fr.js so both languages
// stay visually identical without copy-pasting the CSS/JS engine)
// ============================================================
module.exports = {
  TENSES,
  OUT_DIR,
  CSS,
  HEAD,
  FOOT,
  COPYRIGHT,
  QUIZ_SCRIPT,
  shuffle,
  siteNav,
  langSwitch,
  renderQuizItem,
  SLOT_COLORS,
  verbRows,
};

const fs = require("fs");
const path = require("path");
const shared = require("./build_verbos_site.js"); // also regenerates the EN pages as a side effect

const { OUT_DIR, CSS, HEAD, FOOT, COPYRIGHT, QUIZ_SCRIPT, shuffle, siteNav, langSwitch, SLOT_COLORS } = shared;

const AUDIO_MAP_PATH = path.join(__dirname, "practice_audio_map_fr.json");
const AUDIO_MAP = fs.existsSync(AUDIO_MAP_PATH) ? JSON.parse(fs.readFileSync(AUDIO_MAP_PATH, "utf-8")) : {};

// ============================================================
// FRENCH-SPECIFIC GEOMETRY
// French verbs conjugate for all 6 persons (no shared "base form"
// like English), so every verb node always needs 6 rows -> taller
// boxes than the English version. Canvas WIDTH stays 964 (same
// column layout), only the per-row height and total canvas height
// change. Connector coordinates recomputed for this new height
// using the same hub-oval-tangent method as the English script.
// ============================================================
const FR_CSS_EXTRA = `
  .canvas-fr{ position:relative; width:964px; height:798px; margin:0 auto; }
  .canvas-fr svg.connectors{ position:absolute; inset:0; width:100%; height:100%; overflow:visible; }
  .hub-fr{ left:0; top:0; width:200px; height:798px; border-radius:100px; }
  .verb-fr{ width:340px; height:250px; border-radius:125px; }
  .canvas-fr4{ position:relative; width:964px; height:524px; margin:0 auto; }
  .canvas-fr4 svg.connectors{ position:absolute; inset:0; width:100%; height:100%; overflow:visible; }
  .hub-fr4{ left:0; top:0; width:200px; height:524px; border-radius:100px; }
`;

const VERB_POS_FR = {
  etre:    { left: 240, top: 0,   cls: "v-be",   head: "Être" },
  avoir:   { left: 604, top: 0,   cls: "v-have", head: "Avoir" },
  faire:   { left: 240, top: 274, cls: "v-do",   head: "Faire" },
  aller:   { left: 604, top: 274, cls: "v-go",   head: "Aller" },
  prendre: { left: 240, top: 548, cls: "v-make", head: "Prendre" },
  dire:    { left: 604, top: 548, cls: "v-get",  head: "Dire" },
};
const VERB_ORDER_FR = ["etre", "avoir", "faire", "aller", "prendre", "dire"];

const CONNECTORS_SVG_FR = `<svg class="connectors" viewBox="0 0 964 798" preserveAspectRatio="none">
          <line x1="194.2" y1="66.5"  x2="240" y2="125"/>
          <line x1="200"   y1="199.5" x2="604" y2="125"/>
          <line x1="200"   y1="332.5" x2="240" y2="399"/>
          <line x1="200"   y1="465.5" x2="604" y2="399"/>
          <line x1="200"   y1="598.5" x2="240" y2="673"/>
          <line x1="194.2" y1="731.5" x2="604" y2="673"/>
          <circle cx="194.2" cy="66.5"  r="4"/>
          <circle cx="200"   cy="199.5" r="4"/>
          <circle cx="200"   cy="332.5" r="4"/>
          <circle cx="200"   cy="465.5" r="4"/>
          <circle cx="200"   cy="598.5" r="4"/>
          <circle cx="194.2" cy="731.5" r="4"/>
          <circle cx="240" cy="125" r="4.5"/>
          <circle cx="604" cy="125" r="4.5"/>
          <circle cx="240" cy="399" r="4.5"/>
          <circle cx="604" cy="399" r="4.5"/>
          <circle cx="240" cy="673" r="4.5"/>
          <circle cx="604" cy="673" r="4.5"/>
        </svg>`;

function verbRowsFr(rows) {
  return rows.map(([who, form]) => `<div class="verb-row"><span class="who">${who}</span><span class="form">${form}</span></div>`).join("\n            ");
}

function renderVerbNodeFr(key, rows, desktop) {
  const p = VERB_POS_FR[key];
  const style = desktop ? ` style="left:${p.left}px; top:${p.top}px;"` : "";
  return `<div class="node verb verb-fr ${p.cls}"${style}>
        <div class="verb-head">${p.head}</div>
        <div class="verb-rows">
          ${verbRowsFr(rows)}
        </div>
      </div>`;
}

function renderDiagramFr(verbs) {
  const desktopNodes = VERB_ORDER_FR.map((k) => renderVerbNodeFr(k, verbs[k], true)).join("\n\n      ");
  const mobileNodes = VERB_ORDER_FR.map((k) => renderVerbNodeFr(k, verbs[k], false)).join("\n\n    ");
  return `<div class="diagram-desktop">
    <div class="canvas-fr">
      ${CONNECTORS_SVG_FR}

      <div class="node hub hub-fr"><span>SUJET</span></div>

      ${desktopNodes}
    </div>
  </div>

  <div class="diagram-mobile">
    <div class="node hub"><span>SUJET</span></div>

    ${mobileNodes}
  </div>`;
}


// ---------- generic node map for grammar topics (modals, possessives, pronouns) ----------
const SLOTS_FR = [
  { left: 240, top: 0 }, { left: 604, top: 0 },
  { left: 240, top: 274 }, { left: 604, top: 274 },
  { left: 240, top: 548 }, { left: 604, top: 548 },
];

// 2x2 layout: hub 200x524, caps centered at y=100 / y=424, points every 131px.
// boundary x on a cap = 100 + sqrt(100^2 - dy^2) -> dy = 34.5 -> 193.9
const CONNECTORS_SVG_FR4 = `<svg class="connectors" viewBox="0 0 964 524" preserveAspectRatio="none">
          <line x1="193.9" y1="65.5"  x2="240" y2="125"/>
          <line x1="200"   y1="196.5" x2="604" y2="125"/>
          <line x1="200"   y1="327.5" x2="240" y2="399"/>
          <line x1="193.9" y1="458.5" x2="604" y2="399"/>
          <circle cx="193.9" cy="65.5"  r="4"/>
          <circle cx="200"   cy="196.5" r="4"/>
          <circle cx="200"   cy="327.5" r="4"/>
          <circle cx="193.9" cy="458.5" r="4"/>
          <circle cx="240" cy="125" r="4.5"/>
          <circle cx="604" cy="125" r="4.5"/>
          <circle cx="240" cy="399" r="4.5"/>
          <circle cx="604" cy="399" r="4.5"/>
        </svg>`;

function renderGenericDiagramFr(d) {
  const node = (b, i, desktop) => {
    const pos = SLOTS_FR[i];
    const style = desktop ? ` style="left:${pos.left}px; top:${pos.top}px;"` : "";
    return `<div class="node verb verb-fr ${SLOT_COLORS[i]}"${style}>
        <div class="verb-head">${b.head}</div>
        <div class="verb-rows">
          ${verbRowsFr(b.rows)}
        </div>
      </div>`;
  };
  const four = d.layout === 4;
  const desktopNodes = d.boxes.map((b, i) => node(b, i, true)).join("\n\n      ");
  const mobileNodes = d.boxes.map((b, i) => node(b, i, false)).join("\n\n    ");
  return `<div class="diagram-desktop">
    <div class="${four ? "canvas-fr4" : "canvas-fr"}">
      ${four ? CONNECTORS_SVG_FR4 : CONNECTORS_SVG_FR}

      <div class="node hub ${four ? "hub-fr4" : "hub-fr"}"><span>${d.hub}</span></div>

      ${desktopNodes}
    </div>
  </div>

  <div class="diagram-mobile">
    <div class="node hub"><span>${d.hub}</span></div>

    ${mobileNodes}
  </div>`;
}

function renderExamplesFr(examples) {
  const cards = examples
    .map(([subj, grp, sentence, es, note]) => {
      const grpClass = grp === "Il · Elle · On" ? "he" : "they";
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
    <h3>Exemples avec d'autres sujets</h3>
    <div class="examples-grid">
      ${cards}
    </div>
  </div>`;
}

function topicsMenuFr(currentSlug) {
  const groups = [...new Set(TENSES_FR.map((t) => t.group))];
  const groupsHtml = groups
    .map((g) => {
      const items = TENSES_FR.filter((t) => t.group === g)
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
      <summary>☰ Tous les sujets</summary>
      <div class="topics-panel">
        ${groupsHtml}
      </div>
    </details>`;
}

function renderQuizItemFr(innerHtml, optionsHtml) {
  return `<div class="quiz-item" data-quiz-item>
        ${innerHtml}
        <div class="q-options">
          ${optionsHtml}
        </div>
        <p class="q-feedback"></p>
      </div>`;
}

function renderPracticeFr(t) {
  const items = t.practice || [];

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
      return renderQuizItemFr(sentenceHtml, optionsHtml);
    })
    .join("\n      ");

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
        <p class="q-prompt">Quelle phrase as-tu entendue ?</p>`;
      return renderQuizItemFr(innerHtml, optionsHtml);
    })
    .join("\n      ");

  return `<section class="practice-block">
    <h2>📝 Grammaire</h2>
    <p class="practice-sub">${t.practiceSub || "Choisis la forme correcte du verbe."}</p>
    <div class="quiz" data-quiz="grammar">
      ${grammarItems}
    </div>
    <p class="quiz-score" data-quiz-score="grammar">0 / ${items.length}</p>
  </section>

  <section class="practice-block">
    <h2>🎧 Listening</h2>
    <p class="practice-sub">Écoute l'audio et choisis la bonne phrase.</p>
    <div class="quiz" data-quiz="listening">
      ${listeningItems}
    </div>
    <p class="quiz-score" data-quiz-score="listening">0 / ${items.length}</p>
  </section>`;
}

// ============================================================
// FRENCH TENSE DATA — 3 tiempos básicos, parallel to the English start
// ============================================================
const TENSES_FR = [
  {
    slug: "fr-present",
    group: "Temps Simples",
    title: "Présent",
    rule: `<strong>Regla:</strong> a diferencia del inglés, en francés cada persona (je, tu, il/elle, nous, vous, ils/elles) tiene su propia forma del verbo — no hay una forma "base" compartida.`,
    cardDesc: "Cada persona tiene su propia forma — no hay forma base compartida.",
    color: "sky",
    verbs: {
      etre:    [["Je", "suis"], ["Tu", "es"], ["Il · Elle · On", "est"], ["Nous", "sommes"], ["Vous", "êtes"], ["Ils · Elles", "sont"]],
      avoir:   [["Je", "j'ai"], ["Tu", "as"], ["Il · Elle · On", "a"], ["Nous", "avons"], ["Vous", "avez"], ["Ils · Elles", "ont"]],
      faire:   [["Je", "fais"], ["Tu", "fais"], ["Il · Elle · On", "fait"], ["Nous", "faisons"], ["Vous", "faites"], ["Ils · Elles", "font"]],
      aller:   [["Je", "vais"], ["Tu", "vas"], ["Il · Elle · On", "va"], ["Nous", "allons"], ["Vous", "allez"], ["Ils · Elles", "vont"]],
      prendre: [["Je", "prends"], ["Tu", "prends"], ["Il · Elle · On", "prend"], ["Nous", "prenons"], ["Vous", "prenez"], ["Ils · Elles", "prennent"]],
      dire:    [["Je", "dis"], ["Tu", "dis"], ["Il · Elle · On", "dit"], ["Nous", "disons"], ["Vous", "dites"], ["Ils · Elles", "disent"]],
    },
    examples: [
      ["Marie", "Il · Elle · On", "Marie <strong>est</strong> française.", "→ María es francesa."],
      ["Les étudiants", "Ils · Elles", "Les étudiants <strong>ont</strong> un examen demain.", "→ Los estudiantes tienen un examen mañana."],
      ["Mon frère", "Il · Elle · On", "Mon frère <strong>fait</strong> ses devoirs.", "→ Mi hermano hace su tarea."],
      ["Ana et Luc", "Ils · Elles", "Ana et Luc <strong>vont</strong> à l'école.", "→ Ana y Luc van a la escuela."],
    ],
    practice: [
      { sentence: "Marie ___ française.", options: ["est", "es", "suis"], correct: 0 },
      { sentence: "Les étudiants ___ un examen demain.", options: ["ont", "a", "as"], correct: 0 },
      { sentence: "Mon frère ___ ses devoirs.", options: ["fait", "fais", "faisons"], correct: 0 },
      { sentence: "Ana et Luc ___ à l'école.", options: ["vont", "va", "allez"], correct: 0 },
      { sentence: "Je ___ étudiant.", options: ["suis", "es", "est"], correct: 0 },
    ],
  },
  {
    slug: "fr-present-negatif",
    group: "Temps Simples",
    title: "Présent — Négatif",
    rule: `<strong>Regla:</strong> ne + verbo + pas (ne se convierte en n' antes de vocal). Como en presente cada persona tiene su propia forma, la negación envuelve esa forma específica.`,
    cardDesc: "Ne + verbo + pas (n' antes de vocal). Envuelve la forma de cada persona.",
    color: "sky",
    verbs: {
      etre:    [["Je", "ne suis pas"], ["Tu", "n'es pas"], ["Il · Elle · On", "n'est pas"], ["Nous", "ne sommes pas"], ["Vous", "n'êtes pas"], ["Ils · Elles", "ne sont pas"]],
      avoir:   [["Je", "n'ai pas"], ["Tu", "n'as pas"], ["Il · Elle · On", "n'a pas"], ["Nous", "n'avons pas"], ["Vous", "n'avez pas"], ["Ils · Elles", "n'ont pas"]],
      faire:   [["Je", "ne fais pas"], ["Tu", "ne fais pas"], ["Il · Elle · On", "ne fait pas"], ["Nous", "ne faisons pas"], ["Vous", "ne faites pas"], ["Ils · Elles", "ne font pas"]],
      aller:   [["Je", "ne vais pas"], ["Tu", "ne vas pas"], ["Il · Elle · On", "ne va pas"], ["Nous", "n'allons pas"], ["Vous", "n'allez pas"], ["Ils · Elles", "ne vont pas"]],
      prendre: [["Je", "ne prends pas"], ["Tu", "ne prends pas"], ["Il · Elle · On", "ne prend pas"], ["Nous", "ne prenons pas"], ["Vous", "ne prenez pas"], ["Ils · Elles", "ne prennent pas"]],
      dire:    [["Je", "ne dis pas"], ["Tu", "ne dis pas"], ["Il · Elle · On", "ne dit pas"], ["Nous", "ne disons pas"], ["Vous", "ne dites pas"], ["Ils · Elles", "ne disent pas"]],
    },
    examples: [
      ["Marie", "Il · Elle · On", "Marie <strong>n'est pas</strong> fatiguée.", "→ María no está cansada."],
      ["Les étudiants", "Ils · Elles", "Les étudiants <strong>ne vont pas</strong> à l'école le dimanche.", "→ Los estudiantes no van a la escuela los domingos."],
      ["Mon frère", "Il · Elle · On", "Mon frère <strong>ne fait pas</strong> ses devoirs le samedi.", "→ Mi hermano no hace su tarea los sábados."],
      ["Ana et Luc", "Ils · Elles", "Ana et Luc <strong>ne disent pas</strong> la vérité.", "→ Ana y Luc no dicen la verdad."],
    ],
    practice: [
      { sentence: "Marie ___ fatiguée.", options: ["n'est pas", "n'es pas", "ne suis pas"], correct: 0 },
      { sentence: "Les étudiants ___ à l'école le dimanche.", options: ["ne vont pas", "ne va pas", "ne vais pas"], correct: 0 },
      { sentence: "Mon frère ___ ses devoirs le samedi.", options: ["ne fait pas", "ne fais pas", "ne faisons pas"], correct: 0 },
      { sentence: "Ana et Luc ___ la vérité.", options: ["ne disent pas", "ne dit pas", "ne dites pas"], correct: 0 },
      { sentence: "Je ___ fatigué.", options: ["ne suis pas", "n'es pas", "n'est pas"], correct: 0 },
    ],
  },
  {
    slug: "fr-present-questions",
    group: "Temps Simples",
    title: "Présent — Questions",
    rule: `<strong>Regla:</strong> Est-ce que + sujeto + verbo...? (que se convierte en qu' antes de vocal). Es la forma más simple de preguntar — el verbo mantiene su forma normal.`,
    cardDesc: `Est-ce que + sujeto + verbo? El verbo no cambia de forma.`,
    color: "sky",
    verbs: {
      etre:    [["Est-ce que je", "suis...?"], ["Est-ce que tu", "es...?"], ["Est-ce qu'il · elle · on", "est...?"], ["Est-ce que nous", "sommes...?"], ["Est-ce que vous", "êtes...?"], ["Est-ce qu'ils · elles", "sont...?"]],
      avoir:   [["Est-ce que j'", "ai...?"], ["Est-ce que tu", "as...?"], ["Est-ce qu'il · elle · on", "a...?"], ["Est-ce que nous", "avons...?"], ["Est-ce que vous", "avez...?"], ["Est-ce qu'ils · elles", "ont...?"]],
      faire:   [["Est-ce que je", "fais...?"], ["Est-ce que tu", "fais...?"], ["Est-ce qu'il · elle · on", "fait...?"], ["Est-ce que nous", "faisons...?"], ["Est-ce que vous", "faites...?"], ["Est-ce qu'ils · elles", "font...?"]],
      aller:   [["Est-ce que je", "vais...?"], ["Est-ce que tu", "vas...?"], ["Est-ce qu'il · elle · on", "va...?"], ["Est-ce que nous", "allons...?"], ["Est-ce que vous", "allez...?"], ["Est-ce qu'ils · elles", "vont...?"]],
      prendre: [["Est-ce que je", "prends...?"], ["Est-ce que tu", "prends...?"], ["Est-ce qu'il · elle · on", "prend...?"], ["Est-ce que nous", "prenons...?"], ["Est-ce que vous", "prenez...?"], ["Est-ce qu'ils · elles", "prennent...?"]],
      dire:    [["Est-ce que je", "dis...?"], ["Est-ce que tu", "dis...?"], ["Est-ce qu'il · elle · on", "dit...?"], ["Est-ce que nous", "disons...?"], ["Est-ce que vous", "dites...?"], ["Est-ce qu'ils · elles", "disent...?"]],
    },
    examples: [
      ["Marie", "Il · Elle · On", "<strong>Est-ce que Marie est</strong> fatiguée ?", "→ ¿María está cansada?"],
      ["Les étudiants", "Ils · Elles", "<strong>Est-ce que les étudiants ont</strong> un examen demain ?", "→ ¿Los estudiantes tienen un examen mañana?"],
      ["Mon frère", "Il · Elle · On", "<strong>Est-ce que mon frère fait</strong> ses devoirs ?", "→ ¿Mi hermano hace su tarea?"],
      ["Ana et Luc", "Ils · Elles", "<strong>Est-ce qu'Ana et Luc vont</strong> à l'école ?", "→ ¿Ana y Luc van a la escuela?"],
    ],
    practice: [
      { sentence: "Est-ce que Marie ___ fatiguée ?", options: ["est", "es", "suis"], correct: 0 },
      { sentence: "Est-ce que les étudiants ___ un examen demain ?", options: ["ont", "a", "as"], correct: 0 },
      { sentence: "Est-ce que mon frère ___ ses devoirs ?", options: ["fait", "fais", "faisons"], correct: 0 },
      { sentence: "Est-ce qu'Ana et Luc ___ à l'école ?", options: ["vont", "va", "allez"], correct: 0 },
      { sentence: "Est-ce que je ___ en retard ?", options: ["suis", "es", "est"], correct: 0 },
    ],
  },
  {
    slug: "fr-passe-compose",
    group: "Temps Simples",
    title: "Passé Composé",
    rule: `<strong>Regla:</strong> avoir o être (auxiliar) + participio pasado. La mayoría usa avoir. <strong>Aller es la excepción</strong> — usa être, y el participio concuerda en género y número con el sujeto.`,
    cardDesc: "Avoir/être + participio. Aller es la excepción (usa être, con concordancia).",
    color: "coral",
    verbs: {
      etre:    [["Je", "j'ai été"], ["Tu", "as été"], ["Il · Elle · On", "a été"], ["Nous", "avons été"], ["Vous", "avez été"], ["Ils · Elles", "ont été"]],
      avoir:   [["Je", "j'ai eu"], ["Tu", "as eu"], ["Il · Elle · On", "a eu"], ["Nous", "avons eu"], ["Vous", "avez eu"], ["Ils · Elles", "ont eu"]],
      faire:   [["Je", "j'ai fait"], ["Tu", "as fait"], ["Il · Elle · On", "a fait"], ["Nous", "avons fait"], ["Vous", "avez fait"], ["Ils · Elles", "ont fait"]],
      aller:   [["Je", "suis allé(e)"], ["Tu", "es allé(e)"], ["Il · Elle · On", "est allé(e)"], ["Nous", "sommes allé(e)s"], ["Vous", "êtes allé(e)(s)"], ["Ils · Elles", "sont allé(e)s"]],
      prendre: [["Je", "j'ai pris"], ["Tu", "as pris"], ["Il · Elle · On", "a pris"], ["Nous", "avons pris"], ["Vous", "avez pris"], ["Ils · Elles", "ont pris"]],
      dire:    [["Je", "j'ai dit"], ["Tu", "as dit"], ["Il · Elle · On", "a dit"], ["Nous", "avons dit"], ["Vous", "avez dit"], ["Ils · Elles", "ont dit"]],
    },
    examples: [
      ["Marie", "Il · Elle · On", "Marie <strong>est allée</strong> à l'école hier.", "→ María fue a la escuela ayer.", "Aller usa être (no avoir) y el participio concuerda con el sujeto: allée (femenino) porque el sujeto es Marie."],
      ["Les étudiants", "Ils · Elles", "Les étudiants <strong>ont eu</strong> un examen la semaine dernière.", "→ Los estudiantes tuvieron un examen la semana pasada."],
      ["Mon frère", "Il · Elle · On", "Mon frère <strong>a fait</strong> le petit-déjeuner ce matin.", "→ Mi hermano preparó el desayuno esta mañana."],
      ["Ana et Luc", "Ils · Elles", "Ana et Luc <strong>ont dit</strong> la vérité.", "→ Ana y Luc dijeron la verdad."],
    ],
    practice: [
      { sentence: "Marie ___ à l'école hier.", options: ["est allée", "a allé", "est allé"], correct: 0 },
      { sentence: "Les étudiants ___ un examen la semaine dernière.", options: ["ont eu", "ont été", "avons eu"], correct: 0 },
      { sentence: "Mon frère ___ le petit-déjeuner ce matin.", options: ["a fait", "a fais", "a faire"], correct: 0 },
      { sentence: "Ana et Luc ___ la vérité.", options: ["ont dit", "ont dis", "ont dire"], correct: 0 },
      { sentence: "J' ___ un chat.", options: ["ai eu", "a eu", "ai été"], correct: 0 },
    ],
  },
  {
    slug: "fr-passe-compose-negatif",
    group: "Temps Simples",
    title: "Passé Composé — Négatif",
    rule: `<strong>Regla:</strong> ne + auxiliar (avoir/être) + pas + participio. La negación envuelve el auxiliar, no el participio. <strong>Aller</strong> sigue concordando en género y número.`,
    cardDesc: "Ne + auxiliar + pas + participio. Envuelve el auxiliar, no el participio.",
    color: "coral",
    verbs: {
      etre:    [["Je", "n'ai pas été"], ["Tu", "n'as pas été"], ["Il · Elle · On", "n'a pas été"], ["Nous", "n'avons pas été"], ["Vous", "n'avez pas été"], ["Ils · Elles", "n'ont pas été"]],
      avoir:   [["Je", "n'ai pas eu"], ["Tu", "n'as pas eu"], ["Il · Elle · On", "n'a pas eu"], ["Nous", "n'avons pas eu"], ["Vous", "n'avez pas eu"], ["Ils · Elles", "n'ont pas eu"]],
      faire:   [["Je", "n'ai pas fait"], ["Tu", "n'as pas fait"], ["Il · Elle · On", "n'a pas fait"], ["Nous", "n'avons pas fait"], ["Vous", "n'avez pas fait"], ["Ils · Elles", "n'ont pas fait"]],
      aller:   [["Je", "ne suis pas allé(e)"], ["Tu", "n'es pas allé(e)"], ["Il · Elle · On", "n'est pas allé(e)"], ["Nous", "ne sommes pas allé(e)s"], ["Vous", "n'êtes pas allé(e)(s)"], ["Ils · Elles", "ne sont pas allé(e)s"]],
      prendre: [["Je", "n'ai pas pris"], ["Tu", "n'as pas pris"], ["Il · Elle · On", "n'a pas pris"], ["Nous", "n'avons pas pris"], ["Vous", "n'avez pas pris"], ["Ils · Elles", "n'ont pas pris"]],
      dire:    [["Je", "n'ai pas dit"], ["Tu", "n'as pas dit"], ["Il · Elle · On", "n'a pas dit"], ["Nous", "n'avons pas dit"], ["Vous", "n'avez pas dit"], ["Ils · Elles", "n'ont pas dit"]],
    },
    examples: [
      ["Marie", "Il · Elle · On", "Marie <strong>n'est pas allée</strong> à Paris.", "→ María no fue a París.", "La negación no cambia la concordancia de aller: sigue siendo allée (femenino) porque el sujeto es Marie."],
      ["Les étudiants", "Ils · Elles", "Les étudiants <strong>n'ont pas fait</strong> leurs devoirs.", "→ Los estudiantes no hicieron su tarea."],
      ["Mon frère", "Il · Elle · On", "Mon frère <strong>n'a pas fait</strong> le petit-déjeuner.", "→ Mi hermano no preparó el desayuno."],
      ["Ana et Luc", "Ils · Elles", "Ana et Luc <strong>n'ont pas dit</strong> la vérité.", "→ Ana y Luc no dijeron la verdad."],
    ],
    practice: [
      { sentence: "Marie ___ à Paris.", options: ["n'est pas allée", "n'a pas allé", "n'est pas allé"], correct: 0 },
      { sentence: "Les étudiants ___ leurs devoirs.", options: ["n'ont pas fait", "n'a pas fait", "n'ont pas faire"], correct: 0 },
      { sentence: "Mon frère ___ le petit-déjeuner.", options: ["n'a pas fait", "n'a pas fais", "n'a pas faire"], correct: 0 },
      { sentence: "Ana et Luc ___ la vérité.", options: ["n'ont pas dit", "n'ont pas dite", "n'ont pas dits"], correct: 0 },
      { sentence: "Je ___ ce livre.", options: ["n'ai pas pris", "n'ai pas prit", "n'a pas pris"], correct: 0 },
    ],
  },
  {
    slug: "fr-passe-compose-questions",
    group: "Temps Simples",
    title: "Passé Composé — Questions",
    rule: `<strong>Regla:</strong> Est-ce que + sujeto + auxiliar + participio...? El auxiliar es el que cambia según la persona, el participio siempre queda igual.`,
    cardDesc: "Est-ce que + sujeto + auxiliar + participio? El participio no cambia.",
    color: "coral",
    verbs: {
      etre:    [["Est-ce que j'", "ai été...?"], ["Est-ce que tu", "as été...?"], ["Est-ce qu'il · elle · on", "a été...?"], ["Est-ce que nous", "avons été...?"], ["Est-ce que vous", "avez été...?"], ["Est-ce qu'ils · elles", "ont été...?"]],
      avoir:   [["Est-ce que j'", "ai eu...?"], ["Est-ce que tu", "as eu...?"], ["Est-ce qu'il · elle · on", "a eu...?"], ["Est-ce que nous", "avons eu...?"], ["Est-ce que vous", "avez eu...?"], ["Est-ce qu'ils · elles", "ont eu...?"]],
      faire:   [["Est-ce que j'", "ai fait...?"], ["Est-ce que tu", "as fait...?"], ["Est-ce qu'il · elle · on", "a fait...?"], ["Est-ce que nous", "avons fait...?"], ["Est-ce que vous", "avez fait...?"], ["Est-ce qu'ils · elles", "ont fait...?"]],
      aller:   [["Est-ce que je", "suis allé(e)...?"], ["Est-ce que tu", "es allé(e)...?"], ["Est-ce qu'il · elle · on", "est allé(e)...?"], ["Est-ce que nous", "sommes allé(e)s...?"], ["Est-ce que vous", "êtes allé(e)(s)...?"], ["Est-ce qu'ils · elles", "sont allé(e)s...?"]],
      prendre: [["Est-ce que j'", "ai pris...?"], ["Est-ce que tu", "as pris...?"], ["Est-ce qu'il · elle · on", "a pris...?"], ["Est-ce que nous", "avons pris...?"], ["Est-ce que vous", "avez pris...?"], ["Est-ce qu'ils · elles", "ont pris...?"]],
      dire:    [["Est-ce que j'", "ai dit...?"], ["Est-ce que tu", "as dit...?"], ["Est-ce qu'il · elle · on", "a dit...?"], ["Est-ce que nous", "avons dit...?"], ["Est-ce que vous", "avez dit...?"], ["Est-ce qu'ils · elles", "ont dit...?"]],
    },
    examples: [
      ["Marie", "Il · Elle · On", "<strong>Est-ce que Marie est allée</strong> à l'école hier ?", "→ ¿María fue a la escuela ayer?"],
      ["Les étudiants", "Ils · Elles", "<strong>Est-ce que les étudiants ont eu</strong> un examen la semaine dernière ?", "→ ¿Los estudiantes tuvieron un examen la semana pasada?"],
      ["Mon frère", "Il · Elle · On", "<strong>Est-ce que mon frère a fait</strong> le petit-déjeuner ?", "→ ¿Mi hermano preparó el desayuno?"],
      ["Ana et Luc", "Ils · Elles", "<strong>Est-ce qu'Ana et Luc ont dit</strong> la vérité ?", "→ ¿Ana y Luc dijeron la verdad?"],
    ],
    practice: [
      { sentence: "Est-ce que Marie ___ à l'école hier ?", options: ["est allée", "a allé", "est allé"], correct: 0 },
      { sentence: "Est-ce que les étudiants ___ un examen la semaine dernière ?", options: ["ont eu", "ont été", "avez eu"], correct: 0 },
      { sentence: "Est-ce que mon frère ___ le petit-déjeuner ?", options: ["a fait", "a fais", "a faire"], correct: 0 },
      { sentence: "Est-ce qu'Ana et Luc ___ la vérité ?", options: ["ont dit", "ont dis", "ont dire"], correct: 0 },
      { sentence: "Est-ce que j' ___ un chat ?", options: ["ai eu", "a eu", "ai été"], correct: 0 },
    ],
  },
  {
    slug: "fr-futur-simple",
    group: "Temps Simples",
    title: "Futur Simple",
    rule: `<strong>Regla:</strong> cada persona tiene su propia terminación (-ai, -as, -a, -ons, -ez, -ont) sobre una raíz que a veces es irregular (ser- para être, ir- para aller).`,
    cardDesc: "Terminaciones propias por persona, sobre una raíz a veces irregular.",
    color: "mint",
    verbs: {
      etre:    [["Je", "serai"], ["Tu", "seras"], ["Il · Elle · On", "sera"], ["Nous", "serons"], ["Vous", "serez"], ["Ils · Elles", "seront"]],
      avoir:   [["Je", "j'aurai"], ["Tu", "auras"], ["Il · Elle · On", "aura"], ["Nous", "aurons"], ["Vous", "aurez"], ["Ils · Elles", "auront"]],
      faire:   [["Je", "ferai"], ["Tu", "feras"], ["Il · Elle · On", "fera"], ["Nous", "ferons"], ["Vous", "ferez"], ["Ils · Elles", "feront"]],
      aller:   [["Je", "irai"], ["Tu", "iras"], ["Il · Elle · On", "ira"], ["Nous", "irons"], ["Vous", "irez"], ["Ils · Elles", "iront"]],
      prendre: [["Je", "prendrai"], ["Tu", "prendras"], ["Il · Elle · On", "prendra"], ["Nous", "prendrons"], ["Vous", "prendrez"], ["Ils · Elles", "prendront"]],
      dire:    [["Je", "dirai"], ["Tu", "diras"], ["Il · Elle · On", "dira"], ["Nous", "dirons"], ["Vous", "direz"], ["Ils · Elles", "diront"]],
    },
    examples: [
      ["Marie", "Il · Elle · On", "Marie <strong>sera</strong> contente demain.", "→ María estará contenta mañana."],
      ["Les étudiants", "Ils · Elles", "Les étudiants <strong>auront</strong> un examen la semaine prochaine.", "→ Los estudiantes tendrán un examen la próxima semana."],
      ["Mon frère", "Il · Elle · On", "Mon frère <strong>fera</strong> le petit-déjeuner dimanche.", "→ Mi hermano preparará el desayuno el domingo."],
      ["Ana et Luc", "Ils · Elles", "Ana et Luc <strong>iront</strong> à l'école demain.", "→ Ana y Luc irán a la escuela mañana."],
    ],
    practice: [
      { sentence: "Marie ___ contente demain.", options: ["sera", "serai", "seras"], correct: 0 },
      { sentence: "Les étudiants ___ un examen la semaine prochaine.", options: ["auront", "aura", "avez"], correct: 0 },
      { sentence: "Mon frère ___ le petit-déjeuner dimanche.", options: ["fera", "ferai", "ferez"], correct: 0 },
      { sentence: "Ana et Luc ___ à l'école demain.", options: ["iront", "ira", "irez"], correct: 0 },
      { sentence: "Je ___ content demain.", options: ["serai", "sera", "seras"], correct: 0 },
    ],
  },
];

TENSES_FR.push(...require("./verbos_extra_fr.js"));

// ============================================================
// RENDER FRENCH TENSE + PRACTICE PAGES
// ============================================================
TENSES_FR.forEach((t, idx) => {
  const prev = TENSES_FR[idx - 1];
  const next = TENSES_FR[idx + 1];
  const navPrev = prev ? `<a href="${prev.slug}.html">← ${prev.title}</a>` : `<span></span>`;
  const navNext = next ? `<a href="${next.slug}.html">${next.title} →</a>` : `<a href="fr-index.html">Retour à l'accueil →</a>`;

  const html = `${HEAD(`${t.title} — ${t.siteTitle || "Conjugaison des Verbes"}`)}
  <style>${FR_CSS_EXTRA}</style>
  ${siteNav("verbos")}
  ${langSwitch("fr")}

  <nav class="crumb">
    ${topicsMenuFr(t.slug)}
    <a class="games-link" href="juegos.html?lang=fr">🎲 Aprender jugando</a>
    <span class="progress">Sujet ${idx + 1} de ${TENSES_FR.length} · ${t.group}</span>
  </nav>

  <header class="board-head">
    <p class="eyebrow">Estrategia de enseñanza · Gramática · Francés</p>
    <h1>${t.title}</h1>
    <svg class="squiggle" viewBox="0 0 220 14"><path d="M4 8 Q 30 -2, 56 8 T 108 8 T 160 8 T 216 8"/></svg>
    <p class="subtitle">${t.rule}</p>
  </header>

  ${t.diagram ? renderGenericDiagramFr(t.diagram) : renderDiagramFr(t.verbs)}

  ${renderExamplesFr(t.examples)}

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

  const practiceHtml = `${HEAD(`${t.title} — Pratique — ${t.siteTitle || "Conjugaison des Verbes"}`)}
  ${siteNav("verbos")}
  ${langSwitch("fr")}

  <nav class="crumb">
    ${topicsMenuFr(`${t.slug}-practica`)}
    <a class="games-link" href="juegos.html?lang=fr">🎲 Aprender jugando</a>
    <span class="progress">Pratique · ${t.title}</span>
  </nav>

  <header class="board-head">
    <p class="eyebrow">Pratique · Grammaire et Listening</p>
    <h1>${t.title}</h1>
    <svg class="squiggle" viewBox="0 0 220 14"><path d="M4 8 Q 30 -2, 56 8 T 108 8 T 160 8 T 216 8"/></svg>
    <p class="subtitle">Teste ce que tu as appris. Clique sur une option pour voir si elle est correcte.</p>
  </header>

  ${renderPracticeFr(t)}

  <nav class="pagenav">
    <a href="${t.slug}.html">← Voir la carte de ${t.title}</a>
    <span class="spacer"></span>
    <a href="fr-index.html">Tous les sujets →</a>
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
// RENDER FRENCH INDEX / HUB PAGE
// ============================================================
const groupsFr = [...new Set(TENSES_FR.map((t) => t.group))];
const groupsHtmlFr = groupsFr
  .map((g) => {
    const cards = TENSES_FR.filter((t) => t.group === g)
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

const indexHtmlFr = `${HEAD("Verbes et Grammaire — Accueil")}
  ${siteNav("verbos")}
  ${langSwitch("fr")}

  <header class="board-head">
    <p class="eyebrow">Estrategia de enseñanza · Gramática · Francés</p>
    <h1>Verbes et Grammaire</h1>
    <svg class="squiggle" viewBox="0 0 220 14"><path d="M4 8 Q 30 -2, 56 8 T 108 8 T 160 8 T 216 8"/></svg>
    <p class="hub-intro">Elige un tema para ver su mapa de nodos: el Sujet en el centro, conectado a las formas correctas, con ejemplos con otros sujetos. Tiempos verbales, verbes modaux, possessifs et pronoms.</p>
  </header>

  <a class="practice-cta" href="juegos.html?lang=fr">
    <strong>🎲 Aprender jugando</strong>
    <span>Ahorcado, memoria, concurso, ruleta y más para jugar por equipos en el aula</span>
    <span class="go">Jugar →</span>
  </a>

  ${groupsHtmlFr}
${FOOT}`;

fs.writeFileSync(path.join(OUT_DIR, "fr-index.html"), indexHtmlFr, "utf-8");
console.log("wrote fr-index.html");

// ============================================================
// EXPORT PRACTICE SENTENCES (French, for edge-tts)
// ============================================================
const practiceSentencesFr = [];
TENSES_FR.forEach((t) => {
  (t.practice || []).forEach((item) => {
    practiceSentencesFr.push(item.sentence.replace("___", item.options[item.correct]));
  });
});
fs.writeFileSync(
  path.join(__dirname, "practice_sentences_fr.json"),
  JSON.stringify([...new Set(practiceSentencesFr)], null, 2),
  "utf-8"
);
console.log("wrote practice_sentences_fr.json —", new Set(practiceSentencesFr).size, "unique sentences");

console.log("\nDone (FR):", TENSES_FR.length, "tense pages + 1 index page in", OUT_DIR);

module.exports = { TENSES_FR };

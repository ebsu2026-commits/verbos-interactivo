// New French grammar topics: modal verbs (3 pages), possessive adjectives,
// tonic pronouns, COD and COI object pronouns. Uses `diagram` (generic node map).
//   layout 4 -> 2x2 boxes (verb with 6 rows, or pronoun pairs)
//   layout 6 -> 3x2 boxes

const PERSONS = ["Je", "Tu", "Il · Elle · On", "Nous", "Vous", "Ils · Elles"];
const Q_PERSONS = ["Est-ce que je", "Est-ce que tu", "Est-ce qu'il · elle · on", "Est-ce que nous", "Est-ce que vous", "Est-ce qu'ils · elles"];
const SUBJ_IL = "Il · Elle · On";
const SUBJ_ILS = "Ils · Elles";

const MODALS = {
  pouvoir: { head: "Pouvoir · poder", f: ["peux", "peux", "peut", "pouvons", "pouvez", "peuvent"] },
  vouloir: { head: "Vouloir · querer", f: ["veux", "veux", "veut", "voulons", "voulez", "veulent"] },
  devoir: { head: "Devoir · deber", f: ["dois", "dois", "doit", "devons", "devez", "doivent"] },
  savoir: { head: "Savoir · saber", f: ["sais", "sais", "sait", "savons", "savez", "savent"] },
};

const modalBoxes = (wrap) =>
  Object.values(MODALS).map((m) => ({
    head: m.head,
    rows: PERSONS.map((p, i) => wrap.persons ? [wrap.persons[i], wrap.form(m.f[i])] : [p, wrap.form(m.f[i])]),
  }));

module.exports = [
  // ------------------------------------------------------------ VERBES MODAUX
  {
    slug: "fr-modaux",
    group: "Verbes Modaux",
    title: "Verbes Modaux — Présent",
    siteTitle: "Grammaire",
    practiceSub: "Choisis le bon mot.",
    rule: `<strong>Regla:</strong> pouvoir, vouloir, devoir y savoir son verbos <strong>modales</strong>. El modal se conjuga según la persona, y el segundo verbo queda en <strong>infinitivo</strong>: <em>je peux manger</em>, <em>nous devons partir</em>.`,
    cardDesc: "Pouvoir, vouloir, devoir, savoir + infinitivo. El modal se conjuga.",
    color: "lilac",
    diagram: { hub: "SUJET", layout: 4, boxes: modalBoxes({ form: (f) => f }) },
    examples: [
      ["Marie", SUBJ_IL, "Marie <strong>peut</strong> parler trois langues.", "→ María puede hablar tres idiomas."],
      ["Les étudiants", SUBJ_ILS, "Les étudiants <strong>doivent</strong> arriver à l'heure.", "→ Los estudiantes deben llegar a tiempo."],
      ["Mon frère", SUBJ_IL, "Mon frère <strong>veut</strong> jouer au football.", "→ Mi hermano quiere jugar al fútbol."],
      ["Ana et Luc", SUBJ_ILS, "Ana et Luc <strong>savent</strong> nager.", "→ Ana y Luc saben nadar.", "Savoir = saber hacer algo aprendido. Pouvoir = poder (ser capaz o tener permiso)."],
    ],
    practice: [
      { sentence: "Marie ___ parler trois langues.", options: ["peut", "peux", "peuvent"], correct: 0 },
      { sentence: "Les étudiants ___ arriver à l'heure.", options: ["doivent", "doit", "devez"], correct: 0 },
      { sentence: "Mon frère ___ jouer au football.", options: ["veut", "veux", "voulons"], correct: 0 },
      { sentence: "Ana et Luc ___ nager.", options: ["savent", "sait", "savez"], correct: 0 },
      { sentence: "Je ___ aller au cinéma.", options: ["peux", "peut", "pouvons"], correct: 0 },
    ],
  },
  {
    slug: "fr-modaux-negatif",
    group: "Verbes Modaux",
    title: "Verbes Modaux — Négatif",
    siteTitle: "Grammaire",
    practiceSub: "Choisis le bon mot.",
    rule: `<strong>Regla:</strong> ne + modal + pas + infinitivo. La negación envuelve al <strong>modal</strong>, no al infinitivo: <em>je ne peux pas venir</em>.`,
    cardDesc: "Ne + modal + pas + infinitivo. Envuelve al modal.",
    color: "lilac",
    diagram: { hub: "SUJET", layout: 4, boxes: modalBoxes({ form: (f) => `ne ${f} pas` }) },
    examples: [
      ["Marie", SUBJ_IL, "Marie <strong>ne peut pas</strong> venir demain.", "→ María no puede venir mañana."],
      ["Les étudiants", SUBJ_ILS, "Les étudiants <strong>ne doivent pas</strong> courir dans le couloir.", "→ Los estudiantes no deben correr en el pasillo.", "Ne doivent pas + infinitivo expresa prohibición, como mustn't en inglés."],
      ["Mon frère", SUBJ_IL, "Mon frère <strong>ne veut pas</strong> manger.", "→ Mi hermano no quiere comer."],
      ["Ana et Luc", SUBJ_ILS, "Ana et Luc <strong>ne savent pas</strong> nager.", "→ Ana y Luc no saben nadar."],
    ],
    practice: [
      { sentence: "Marie ___ venir demain.", options: ["ne peut pas", "ne peux pas", "ne peuvent pas"], correct: 0 },
      { sentence: "Les étudiants ___ courir dans le couloir.", options: ["ne doivent pas", "ne doit pas", "ne devez pas"], correct: 0 },
      { sentence: "Mon frère ___ manger.", options: ["ne veut pas", "ne veux pas", "ne voulons pas"], correct: 0 },
      { sentence: "Ana et Luc ___ nager.", options: ["ne savent pas", "ne sait pas", "ne savez pas"], correct: 0 },
      { sentence: "Je ___ aller au cinéma.", options: ["ne peux pas", "ne peut pas", "ne pouvons pas"], correct: 0 },
    ],
  },
  {
    slug: "fr-modaux-questions",
    group: "Verbes Modaux",
    title: "Verbes Modaux — Questions",
    siteTitle: "Grammaire",
    practiceSub: "Choisis le bon mot.",
    rule: `<strong>Regla:</strong> Est-ce que + sujeto + modal + infinitivo...? El modal conserva su forma normal y el infinitivo no cambia.`,
    cardDesc: "Est-ce que + sujeto + modal + infinitivo? El modal no cambia de forma.",
    color: "lilac",
    diagram: { hub: "SUJET", layout: 4, boxes: modalBoxes({ persons: Q_PERSONS, form: (f) => `${f}...?` }) },
    examples: [
      ["Marie", SUBJ_IL, "<strong>Est-ce que Marie peut</strong> venir demain ?", "→ ¿María puede venir mañana?"],
      ["Les étudiants", SUBJ_ILS, "<strong>Est-ce que les étudiants doivent</strong> arriver à l'heure ?", "→ ¿Los estudiantes deben llegar a tiempo?"],
      ["Mon frère", SUBJ_IL, "<strong>Est-ce que mon frère veut</strong> manger ?", "→ ¿Mi hermano quiere comer?"],
      ["Ana et Luc", SUBJ_ILS, "<strong>Est-ce qu'Ana et Luc savent</strong> nager ?", "→ ¿Ana y Luc saben nadar?"],
    ],
    practice: [
      { sentence: "Est-ce que Marie ___ venir demain ?", options: ["peut", "peux", "peuvent"], correct: 0 },
      { sentence: "Est-ce que les étudiants ___ arriver à l'heure ?", options: ["doivent", "doit", "devez"], correct: 0 },
      { sentence: "Est-ce que mon frère ___ manger ?", options: ["veut", "veux", "voulons"], correct: 0 },
      { sentence: "Est-ce qu'Ana et Luc ___ nager ?", options: ["savent", "sait", "savez"], correct: 0 },
      { sentence: "Est-ce que je ___ entrer ?", options: ["peux", "peut", "pouvons"], correct: 0 },
    ],
  },

  // --------------------------------------------------- ADJECTIFS POSSESSIFS
  {
    slug: "fr-adjectifs-possessifs",
    group: "Pronoms et Possessifs",
    title: "Adjectifs Possessifs",
    siteTitle: "Grammaire",
    practiceSub: "Choisis le bon mot.",
    rule: `<strong>Regla:</strong> el adjetivo posesivo concuerda con la <strong>cosa poseída</strong> (masculino, femenino o plural), no con el poseedor: <em>son frère</em> = su hermano (de él o de ella).`,
    cardDesc: "Mon / ma / mes... Concuerda con la cosa, no con quien la tiene.",
    color: "mint",
    diagram: {
      hub: "SUJET",
      layout: 6,
      boxes: [
        { head: "Je", rows: [["Masc.", "mon frère"], ["Fém.", "ma sœur"], ["Plur.", "mes amis"]] },
        { head: "Tu", rows: [["Masc.", "ton frère"], ["Fém.", "ta sœur"], ["Plur.", "tes amis"]] },
        { head: "Il · Elle · On", rows: [["Masc.", "son frère"], ["Fém.", "sa sœur"], ["Plur.", "ses amis"]] },
        { head: "Nous", rows: [["Masc.", "notre frère"], ["Fém.", "notre sœur"], ["Plur.", "nos amis"]] },
        { head: "Vous", rows: [["Masc.", "votre frère"], ["Fém.", "votre sœur"], ["Plur.", "vos amis"]] },
        { head: "Ils · Elles", rows: [["Masc.", "leur frère"], ["Fém.", "leur sœur"], ["Plur.", "leurs amis"]] },
      ],
    },
    examples: [
      ["Marie", SUBJ_IL, "Marie aime <strong>sa</strong> sœur.", "→ María quiere a su hermana.", "Sa porque sœur es femenino, aunque el poseedor sea Marie. En francés manda la cosa poseída."],
      ["Les étudiants", SUBJ_ILS, "Les étudiants ont <strong>leurs</strong> livres.", "→ Los estudiantes tienen sus libros."],
      ["Mon frère", SUBJ_IL, "Mon frère cherche <strong>son</strong> téléphone.", "→ Mi hermano busca su teléfono."],
      ["Ana et Luc", SUBJ_ILS, "Ana et Luc aiment <strong>leur</strong> école.", "→ Ana y Luc quieren a su escuela.", "Leur (un solo objeto) / leurs (varios objetos)."],
      ["Léa", SUBJ_IL, "Léa présente <strong>son</strong> amie.", "→ Léa presenta a su amiga.", "Amie es femenino pero empieza por vocal: se usa son (no sa). Igual: mon amie, ton amie."],
    ],
    practice: [
      { sentence: "Marie aime ___ sœur.", options: ["sa", "son", "ses"], correct: 0 },
      { sentence: "Les étudiants ont ___ livres.", options: ["leurs", "leur", "ses"], correct: 0 },
      { sentence: "Mon frère cherche ___ téléphone.", options: ["son", "sa", "ses"], correct: 0 },
      { sentence: "Léa présente ___ amie.", options: ["son", "sa", "ses"], correct: 0 },
      { sentence: "Nous aimons ___ école.", options: ["notre", "nos", "votre"], correct: 0 },
    ],
  },

  // -------------------------------------------------------- PRONOMS TONIQUES
  {
    slug: "fr-pronoms-toniques",
    group: "Pronoms et Possessifs",
    title: "Pronoms Toniques",
    siteTitle: "Grammaire",
    practiceSub: "Choisis le bon mot.",
    rule: `<strong>Regla:</strong> los pronombres tónicos (moi, toi, lui, elle, nous, vous, eux, elles) se usan <strong>solos</strong>, <strong>después de una preposición</strong> (avec, pour, chez...) o después de <em>c'est</em>. También sirven para dar énfasis: <em>Moi, je parle</em>.`,
    cardDesc: "Moi, toi, lui, elle, nous, vous, eux, elles. Solos o después de preposición.",
    color: "mint",
    diagram: {
      hub: "SUJET",
      layout: 6,
      boxes: [
        { head: "Je", rows: [["Tonique", "moi"], ["Exemple", "C'est moi"]] },
        { head: "Tu", rows: [["Tonique", "toi"], ["Exemple", "pour toi"]] },
        { head: "Il · Elle", rows: [["Il", "lui"], ["Elle", "elle"], ["Exemple", "avec elle"]] },
        { head: "Nous", rows: [["Tonique", "nous"], ["Exemple", "chez nous"]] },
        { head: "Vous", rows: [["Tonique", "vous"], ["Exemple", "avec vous"]] },
        { head: "Ils · Elles", rows: [["Ils", "eux"], ["Elles", "elles"], ["Exemple", "avec eux"]] },
      ],
    },
    examples: [
      ["Marie", SUBJ_IL, "Marie est sympa. Je parle avec <strong>elle</strong>.", "→ María es simpática. Hablo con ella."],
      ["Les étudiants", SUBJ_ILS, "Les étudiants sont ici. Le prof parle avec <strong>eux</strong>.", "→ Los estudiantes están aquí. El profesor habla con ellos."],
      ["Mon frère", SUBJ_IL, "Mon frère est drôle. Je joue avec <strong>lui</strong>.", "→ Mi hermano es gracioso. Juego con él."],
      ["Réponse courte", "Pronom seul", "— Qui est là ? — <strong>Moi</strong> !", "→ — ¿Quién está ahí? — ¡Yo!", "Al responder solo, el francés usa el tónico: Moi ! / Lui ! (no \"Je !\")."],
      ["C'est...", "Après c'est", "C'est <strong>lui</strong> !", "→ ¡Es él!", "Después de c'est siempre va el tónico: c'est moi, c'est toi, c'est lui."],
    ],
    practice: [
      { sentence: "Marie est sympa. Je parle avec ___.", options: ["elle", "lui", "elles"], correct: 0 },
      { sentence: "Les étudiants sont ici. Le prof parle avec ___.", options: ["eux", "ils", "leur"], correct: 0 },
      { sentence: "Mon frère est drôle. Je joue avec ___.", options: ["lui", "il", "le"], correct: 0 },
      { sentence: "— Qui est là ? — ___ !", options: ["Moi", "Je", "Me"], correct: 0 },
      { sentence: "C'est ___ !", options: ["toi", "tu", "te"], correct: 0 },
    ],
  },

  // --------------------------------------------------------------- COD / COI
  {
    slug: "fr-pronoms-cod",
    group: "Pronoms et Possessifs",
    title: "Pronoms COD",
    siteTitle: "Grammaire",
    practiceSub: "Choisis le bon mot.",
    rule: `<strong>Regla:</strong> el pronombre COD (objeto directo) reemplaza a lo que recibe la acción <strong>sin preposición</strong> y va <strong>antes del verbo</strong>: <em>Je regarde le film → Je <strong>le</strong> regarde</em>. Delante de vocal: <em>l'</em>.`,
    cardDesc: "Me, te, le, la, nous, vous, les. Antes del verbo, sin preposición.",
    color: "amber",
    diagram: {
      hub: "SUJET",
      layout: 4,
      boxes: [
        { head: "Moi · Toi", rows: [["Moi", "me / m'"], ["Toi", "te / t'"], ["Exemple", "Il me voit"]] },
        { head: "Lui · Elle", rows: [["Lui (masc.)", "le / l'"], ["Elle (fém.)", "la / l'"], ["Exemple", "Je la vois"]] },
        { head: "Nous · Vous", rows: [["Nous", "nous"], ["Vous", "vous"], ["Exemple", "Il vous voit"]] },
        { head: "Eux · Elles", rows: [["Eux · Elles", "les"], ["Exemple", "Je les vois"]] },
      ],
    },
    examples: [
      ["Marie", SUBJ_IL, "Marie regarde le film. Marie <strong>le</strong> regarde.", "→ María mira la película. María la mira.", "Le porque film es masculino en francés. Se escoge según el género de la palabra francesa."],
      ["Les étudiants", SUBJ_ILS, "Les étudiants lisent les livres. Ils <strong>les</strong> lisent.", "→ Los estudiantes leen los libros. Los leen."],
      ["Mon frère", SUBJ_IL, "Mon frère aime Léa. Il <strong>l'</strong>aime.", "→ Mi hermano quiere a Léa. Él la quiere.", "Delante de vocal o h muda, le y la se convierten en l'."],
      ["Mon prof", SUBJ_IL, "Mon prof écoute Paul et moi. Il <strong>nous</strong> écoute.", "→ Mi profesor nos escucha a Paul y a mí. Nos escucha."],
    ],
    practice: [
      { sentence: "Marie regarde le film. Marie ___ regarde.", options: ["le", "la", "les"], correct: 0 },
      { sentence: "Les étudiants lisent les livres. Ils ___ lisent.", options: ["les", "le", "leur"], correct: 0 },
      { sentence: "Mon frère aime Léa. Il ___ aime.", options: ["l'", "le", "lui"], correct: 0 },
      { sentence: "Mon prof écoute Paul et moi. Il ___ écoute.", options: ["nous", "vous", "les"], correct: 0 },
      { sentence: "Je regarde la télé. Je ___ regarde.", options: ["la", "le", "les"], correct: 0 },
    ],
  },
  {
    slug: "fr-pronoms-coi",
    group: "Pronoms et Possessifs",
    title: "Pronoms COI",
    siteTitle: "Grammaire",
    practiceSub: "Choisis le bon mot.",
    rule: `<strong>Regla:</strong> el pronombre COI (objeto indirecto) reemplaza a <strong>à + persona</strong> y va <strong>antes del verbo</strong>: <em>Je parle à Marie → Je <strong>lui</strong> parle</em>. Lui sirve para él y para ella; leur, para ellos y ellas.`,
    cardDesc: "Me, te, lui, nous, vous, leur. Reemplazan a « à + persona ».",
    color: "amber",
    diagram: {
      hub: "SUJET",
      layout: 4,
      boxes: [
        { head: "Moi · Toi", rows: [["Moi", "me / m'"], ["Toi", "te / t'"], ["Exemple", "Il me parle"]] },
        { head: "Lui · Elle", rows: [["Lui (à lui)", "lui"], ["Elle (à elle)", "lui"], ["Exemple", "Je lui parle"]] },
        { head: "Nous · Vous", rows: [["Nous", "nous"], ["Vous", "vous"], ["Exemple", "Il nous parle"]] },
        { head: "Eux · Elles", rows: [["Eux · Elles", "leur"], ["Exemple", "Je leur parle"]] },
      ],
    },
    examples: [
      ["Marie", SUBJ_IL, "Je parle à Marie. Je <strong>lui</strong> parle.", "→ Hablo con María. Le hablo.", "Lui no distingue masculino y femenino: vale para él y para ella."],
      ["Les étudiants", SUBJ_ILS, "Le prof parle aux étudiants. Il <strong>leur</strong> parle.", "→ El profesor habla a los estudiantes. Les habla."],
      ["Mon frère", SUBJ_IL, "Je téléphone à mon frère. Je <strong>lui</strong> téléphone.", "→ Llamo a mi hermano. Le llamo."],
      ["Ana et Luc", SUBJ_ILS, "Ana et Luc donnent un cadeau à Marie. Ils <strong>lui</strong> donnent un cadeau.", "→ Ana y Luc dan un regalo a María. Le dan un regalo."],
    ],
    practice: [
      { sentence: "Je parle à Marie. Je ___ parle.", options: ["lui", "leur", "la"], correct: 0 },
      { sentence: "Le prof parle aux étudiants. Il ___ parle.", options: ["leur", "lui", "les"], correct: 0 },
      { sentence: "Je téléphone à mon frère. Je ___ téléphone.", options: ["lui", "le", "leur"], correct: 0 },
      { sentence: "Ana et Luc donnent un cadeau à Marie. Ils ___ donnent un cadeau.", options: ["lui", "leur", "la"], correct: 0 },
      { sentence: "Mon prof parle à Paul et à moi. Il ___ parle.", options: ["nous", "vous", "leur"], correct: 0 },
    ],
  },
];

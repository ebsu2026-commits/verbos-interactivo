// New English grammar topics: modal verbs, possessive adjectives, object pronouns.
// Each entry uses `diagram` (generic 6-box node map) instead of the 6-verb `verbs` map.

const SUBJ_HE = "He · She · It";
const SUBJ_THEY = "You · We · They";

module.exports = [
  // ---------------------------------------------------------------- MODAL VERBS
  {
    slug: "modal-verbs",
    group: "Verbos Modales",
    title: "Modal Verbs",
    siteTitle: "Gramática",
    practiceSub: "Elige la palabra correcta.",
    rule: `<strong>Regla:</strong> los modales <strong>no cambian</strong> con ningún sujeto (nunca llevan -s: <em>he can</em>, no <em>he cans</em>) y siempre van seguidos del <strong>verbo en forma base</strong>: sujeto + modal + verbo.`,
    cardDesc: "No cambian con ningún sujeto. Modal + verbo base, nunca -s.",
    color: "lilac",
    diagram: {
      hub: "SUJETO",
      boxes: [
        { head: "Can", rows: [["Habilidad / permiso", "can + verbo"], ["Ejemplo", "She can swim"]] },
        { head: "Could", rows: [["Pedir con cortesía", "could + verbo"], ["Ejemplo", "Could you help?"]] },
        { head: "Must", rows: [["Obligación fuerte", "must + verbo"], ["Ejemplo", "We must study"]] },
        { head: "Should", rows: [["Consejo", "should + verbo"], ["Ejemplo", "He should rest"]] },
        { head: "May", rows: [["Permiso formal", "may + verbo"], ["Ejemplo", "May I come in?"]] },
        { head: "Would", rows: [["Cortesía (would like)", "would + verbo"], ["Ejemplo", "I would like tea"]] },
      ],
    },
    examples: [
      ["María", SUBJ_HE, "María <strong>can</strong> speak three languages.", "→ María sabe hablar tres idiomas.", "Observa: nunca \"cans\". Con he / she / it el modal no lleva -s."],
      ["The students", SUBJ_THEY, "The students <strong>must</strong> arrive on time.", "→ Los estudiantes deben llegar a tiempo."],
      ["My brother", SUBJ_HE, "My brother <strong>should</strong> study more.", "→ Mi hermano debería estudiar más."],
      ["Ana and Luis", SUBJ_THEY, "Ana and Luis <strong>could</strong> swim when they were five.", "→ Ana y Luis sabían nadar cuando tenían cinco años."],
    ],
    practice: [
      { sentence: "María ___ speak three languages.", options: ["can", "cans", "is can"], correct: 0 },
      { sentence: "The students ___ arrive on time.", options: ["must", "musts", "must to"], correct: 0 },
      { sentence: "My brother ___ study more.", options: ["should", "shoulds", "should to"], correct: 0 },
      { sentence: "Ana and Luis ___ swim when they were five.", options: ["could", "can", "cans"], correct: 0 },
      { sentence: "You ___ wear a helmet.", options: ["must", "musts", "are must"], correct: 0 },
    ],
  },
  {
    slug: "modal-verbs-negativo",
    group: "Verbos Modales",
    title: "Modal Verbs — Negativo",
    siteTitle: "Gramática",
    practiceSub: "Elige la palabra correcta.",
    rule: `<strong>Regla:</strong> modal + <strong>not</strong> (forma corta: can't, couldn't, mustn't, shouldn't). <strong>Nunca</strong> se usa don't / doesn't con un modal: el modal ya hace ese trabajo.`,
    cardDesc: "Can't, couldn't, mustn't... Nunca don't / doesn't con un modal.",
    color: "lilac",
    diagram: {
      hub: "SUJETO",
      boxes: [
        { head: "Can't", rows: [["No puede / no sabe", "can't + verbo"], ["Ejemplo", "He can't swim"]] },
        { head: "Couldn't", rows: [["No pudo / no podía", "couldn't + verbo"], ["Ejemplo", "I couldn't go"]] },
        { head: "Mustn't", rows: [["Prohibido", "mustn't + verbo"], ["Ejemplo", "You mustn't run"]] },
        { head: "Shouldn't", rows: [["No debería", "shouldn't + verbo"], ["Ejemplo", "He shouldn't eat"]] },
        { head: "May not", rows: [["No se permite", "may not + verbo"], ["Ejemplo", "You may not go"]] },
        { head: "Wouldn't", rows: [["No querría", "wouldn't + verbo"], ["Ejemplo", "She wouldn't say"]] },
      ],
    },
    examples: [
      ["María", SUBJ_HE, "María <strong>can't</strong> swim.", "→ María no sabe nadar."],
      ["The students", SUBJ_THEY, "The students <strong>mustn't</strong> use phones in class.", "→ Los estudiantes no deben usar celulares en clase.", "Mustn't significa PROHIBIDO. No es lo mismo que \"no hace falta\"."],
      ["My brother", SUBJ_HE, "My brother <strong>shouldn't</strong> stay up late.", "→ Mi hermano no debería acostarse tarde."],
      ["Ana and Luis", SUBJ_THEY, "Ana and Luis <strong>can't</strong> come today.", "→ Ana y Luis no pueden venir hoy."],
    ],
    practice: [
      { sentence: "María ___ swim.", options: ["can't", "don't", "doesn't"], correct: 0 },
      { sentence: "The students ___ use phones in class.", options: ["mustn't", "don't must", "doesn't must"], correct: 0 },
      { sentence: "My brother ___ stay up late.", options: ["shouldn't", "doesn't should", "don't should"], correct: 0 },
      { sentence: "Ana and Luis ___ come today.", options: ["can't", "don't can", "doesn't can"], correct: 0 },
      { sentence: "I ___ speak French last year.", options: ["couldn't", "didn't could", "don't could"], correct: 0 },
    ],
  },
  {
    slug: "modal-verbs-preguntas",
    group: "Verbos Modales",
    title: "Modal Verbs — Preguntas",
    siteTitle: "Gramática",
    practiceSub: "Elige la palabra correcta.",
    rule: `<strong>Regla:</strong> el modal pasa al <strong>principio</strong>: Modal + sujeto + verbo base? <strong>Sin</strong> do / does: el modal ya forma la pregunta.`,
    cardDesc: "Modal + sujeto + verbo? Sin do / does.",
    color: "lilac",
    diagram: {
      hub: "SUJETO",
      boxes: [
        { head: "Can", rows: [["Orden", "Can + sujeto...?"], ["Ejemplo", "Can she swim?"]] },
        { head: "Could", rows: [["Orden", "Could + sujeto...?"], ["Ejemplo", "Could you help?"]] },
        { head: "Must", rows: [["Orden", "Must + sujeto...?"], ["Ejemplo", "Must we go?"]] },
        { head: "Should", rows: [["Orden", "Should + sujeto...?"], ["Ejemplo", "Should he rest?"]] },
        { head: "May", rows: [["Orden", "May + sujeto...?"], ["Ejemplo", "May I come in?"]] },
        { head: "Would", rows: [["Orden", "Would + sujeto...?"], ["Ejemplo", "Would you like tea?"]] },
      ],
    },
    examples: [
      ["María", SUBJ_HE, "<strong>Can María</strong> swim?", "→ ¿María sabe nadar?"],
      ["The students", SUBJ_THEY, "<strong>May the students</strong> use the lab?", "→ ¿Pueden los estudiantes usar el laboratorio?"],
      ["My brother", SUBJ_HE, "<strong>Should my brother</strong> stay here?", "→ ¿Debería mi hermano quedarse aquí?"],
      ["Ana and Luis", SUBJ_THEY, "<strong>Could Ana and Luis</strong> come with us?", "→ ¿Podrían Ana y Luis venir con nosotros?"],
    ],
    practice: [
      { sentence: "___ María swim?", options: ["Can", "Does", "Is"], correct: 0 },
      { sentence: "___ the students use the lab?", options: ["May", "Do", "Are"], correct: 0 },
      { sentence: "___ my brother stay here?", options: ["Should", "Does", "Is"], correct: 0 },
      { sentence: "___ Ana and Luis come with us?", options: ["Could", "Do", "Are"], correct: 0 },
      { sentence: "___ we leave now?", options: ["Must", "Do", "Are"], correct: 0 },
    ],
  },

  // ------------------------------------------------- POSSESSIVE ADJECTIVES
  {
    slug: "possessive-adjectives",
    group: "Pronombres y Posesivos",
    title: "Possessive Adjectives",
    siteTitle: "Gramática",
    practiceSub: "Elige la palabra correcta.",
    rule: `<strong>Regla:</strong> el adjetivo posesivo va <strong>antes del sustantivo</strong> y depende de <strong>quién tiene</strong> la cosa, no de la cosa: <em>his sister</em> (la hermana de él), <em>her sister</em> (la hermana de ella). Nunca lleva -s ni artículo.`,
    cardDesc: "My, your, his, her, its, our, their. Van antes del sustantivo.",
    color: "mint",
    diagram: {
      hub: "SUJETO",
      boxes: [
        { head: "I", rows: [["Posesivo", "my"], ["Ejemplo", "my book"]] },
        { head: "You", rows: [["Posesivo", "your"], ["Ejemplo", "your book"]] },
        { head: "He", rows: [["Posesivo", "his"], ["Ejemplo", "his book"]] },
        { head: "She", rows: [["Posesivo", "her"], ["Ejemplo", "her book"]] },
        { head: "It", rows: [["Posesivo", "its"], ["Ejemplo", "its tail"]] },
        { head: "We · They", rows: [["We", "our"], ["They", "their"]] },
      ],
    },
    examples: [
      ["María", SUBJ_HE, "María loves <strong>her</strong> brother.", "→ María quiere a su hermano.", "Her porque el poseedor es María (ella). En español \"su\" sirve para todos; en inglés hay que elegir."],
      ["The students", SUBJ_THEY, "The students have <strong>their</strong> books.", "→ Los estudiantes tienen sus libros."],
      ["My brother", SUBJ_HE, "My brother likes <strong>his</strong> new phone.", "→ A mi hermano le gusta su teléfono nuevo."],
      ["Ana and Luis", SUBJ_THEY, "Ana and Luis help <strong>their</strong> mother.", "→ Ana y Luis ayudan a su mamá."],
      ["The dog", SUBJ_HE, "The dog wags <strong>its</strong> tail.", "→ El perro mueve su cola.", "Its (sin apóstrofo) = posesivo para animales y cosas. It's = it is."],
    ],
    practice: [
      { sentence: "María loves ___ brother.", options: ["her", "his", "their"], correct: 0 },
      { sentence: "The students have ___ books.", options: ["their", "they", "them"], correct: 0 },
      { sentence: "My brother likes ___ new phone.", options: ["his", "her", "him"], correct: 0 },
      { sentence: "I love ___ family.", options: ["my", "me", "mine"], correct: 0 },
      { sentence: "The dog wags ___ tail.", options: ["its", "it's", "his"], correct: 0 },
    ],
  },

  // ------------------------------------------------------ OBJECT PRONOUNS
  {
    slug: "object-pronouns",
    group: "Pronombres y Posesivos",
    title: "Object Pronouns",
    siteTitle: "Gramática",
    practiceSub: "Elige la palabra correcta.",
    rule: `<strong>Regla:</strong> el pronombre de objeto va <strong>después del verbo o de una preposición</strong> y reemplaza a la persona o cosa que recibe la acción: <em>I see <strong>him</strong></em>, <em>with <strong>them</strong></em>. Solo, también se usa para responder: <em>Me too!</em>, <em>It's me!</em>`,
    cardDesc: "Me, you, him, her, it, us, them. Después del verbo o de una preposición.",
    color: "mint",
    diagram: {
      hub: "SUJETO",
      boxes: [
        { head: "I", rows: [["Objeto", "me"], ["Ejemplo", "Call me"]] },
        { head: "You", rows: [["Objeto", "you"], ["Ejemplo", "I know you"]] },
        { head: "He", rows: [["Objeto", "him"], ["Ejemplo", "I see him"]] },
        { head: "She", rows: [["Objeto", "her"], ["Ejemplo", "Help her"]] },
        { head: "It", rows: [["Objeto", "it"], ["Ejemplo", "Open it"]] },
        { head: "We · They", rows: [["We", "us"], ["They", "them"]] },
      ],
    },
    examples: [
      ["María", SUBJ_HE, "I know María. I talk to <strong>her</strong> every day.", "→ Conozco a María. Hablo con ella todos los días."],
      ["The students", SUBJ_THEY, "The teacher helps the students. She helps <strong>them</strong>.", "→ La profesora ayuda a los estudiantes. Los ayuda."],
      ["My brother", SUBJ_HE, "My brother is funny. I play with <strong>him</strong> after school.", "→ Mi hermano es gracioso. Juego con él después de la escuela."],
      ["Ana and Luis", SUBJ_THEY, "Ana and Luis invite <strong>us</strong> to the party.", "→ Ana y Luis nos invitan a la fiesta."],
      ["Respuesta corta", "Pronombre solo", "Who is there? — <strong>Me</strong>!", "→ ¿Quién está ahí? — ¡Yo!", "Al responder solo, el inglés usa el pronombre de objeto: Me! / Him! / Us! (no \"I!\"). Es el uso \"tónico\" del inglés."],
    ],
    practice: [
      { sentence: "I know María. I talk to ___ every day.", options: ["her", "she", "hers"], correct: 0 },
      { sentence: "The teacher helps the students. She helps ___.", options: ["them", "they", "their"], correct: 0 },
      { sentence: "My brother is funny. I play with ___.", options: ["him", "he", "his"], correct: 0 },
      { sentence: "Ana and Luis invite ___ to the party.", options: ["us", "we", "our"], correct: 0 },
      { sentence: "Look at the dog! Give ___ some water.", options: ["it", "its", "it's"], correct: 0 },
    ],
  },
];

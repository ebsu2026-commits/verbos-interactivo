// Authored game content for French (see juegos_data_en.js for the format).

const VOCAB_GROUP = "Vocabulaire : Identification Personnelle";

module.exports = {
  vocabGroup: VOCAB_GROUP,
  vocab: [
    { title: "Professions", items: [["professeur", "profesor/a"], ["médecin", "doctor/a"], ["ingénieur", "ingeniero/a"], ["infirmier", "enfermero/a"], ["avocat", "abogado/a"], ["architecte", "arquitecto/a"], ["mécanicien", "mecánico/a"], ["agriculteur", "agricultor/a"]] },
    { title: "Famille", items: [["la mère", "madre"], ["le père", "padre"], ["le frère", "hermano"], ["la sœur", "hermana"], ["la grand-mère", "abuela"], ["le grand-père", "abuelo"], ["la tante", "tía"], ["l'oncle", "tío"], ["le cousin", "primo"]] },
    { title: "Nationalités", items: [["dominicain", "dominicano"], ["haïtien", "haitiano"], ["français", "francés"], ["espagnol", "español"], ["italien", "italiano"], ["brésilien", "brasileño"], ["américain", "estadounidense"], ["mexicain", "mexicano"]] },
    { title: "Salutations", items: [["bonjour", "hola / buenos días"], ["bonsoir", "buenas noches"], ["au revoir", "adiós"], ["merci", "gracias"], ["s'il vous plaît", "por favor"], ["enchanté", "mucho gusto"], ["salut", "hola (informal)"]] },
    { title: "Nombres", items: [["un", "uno"], ["cinq", "cinco"], ["dix", "diez"], ["douze", "doce"], ["quinze", "quince"], ["vingt", "veinte"], ["trente", "treinta"]] },
  ],
  pairSets: [
    { group: "Verbes Modaux", title: "Modal → significado", pairs: [["pouvoir", "poder"], ["vouloir", "querer"], ["devoir", "deber"], ["savoir", "saber"]] },
    { group: "Pronoms et Possessifs", title: "Sujet → possessif", pairs: [["je", "mon / ma"], ["tu", "ton / ta"], ["il / elle", "son / sa"], ["nous", "notre"], ["vous", "votre"], ["ils / elles", "leur"]] },
    { group: "Pronoms et Possessifs", title: "Sujet → pronom tonique", pairs: [["je", "moi"], ["tu", "toi"], ["il", "lui"], ["ils", "eux"]] },
    { group: "Pronoms et Possessifs", title: "Remplace → pronom COD / COI", pairs: [["moi", "me"], ["toi", "te"], ["le garçon", "le"], ["la fille", "la"], ["les amis", "les"], ["à Marie", "lui"]] },
    { group: "Temps Simples", title: "Verbe → il / elle", pairs: [["être", "est"], ["avoir", "a"], ["faire", "fait"], ["aller", "va"], ["prendre", "prend"], ["dire", "dit"]] },
    { group: "Temps Simples", title: "Verbe → futur (je)", pairs: [["être", "serai"], ["avoir", "aurai"], ["faire", "ferai"], ["aller", "irai"], ["prendre", "prendrai"], ["dire", "dirai"]] },
  ],
  words: [
    { group: "Verbes Modaux", w: "PEUX", c: "Je ___ venir. (poder)" },
    { group: "Verbes Modaux", w: "DOIT", c: "Il ___ étudier. (deber)" },
    { group: "Verbes Modaux", w: "VEUT", c: "Marie ___ jouer. (querer)" },
    { group: "Verbes Modaux", w: "SAIT", c: "Il ___ nager. (saber)" },
    { group: "Pronoms et Possessifs", w: "LEUR", c: "Posesivo de ellos: Ils aiment ___ école." },
    { group: "Pronoms et Possessifs", w: "NOTRE", c: "Posesivo de nosotros: ___ classe." },
    { group: "Pronoms et Possessifs", w: "MOI", c: "Pronombre tónico de je: C'est ___ !" },
    { group: "Pronoms et Possessifs", w: "EUX", c: "Pronombre tónico de ils: avec ___." },
    { group: "Temps Simples", w: "SOMMES", c: "Nous ___ français. (être)" },
    { group: "Temps Simples", w: "VONT", c: "Ils ___ à l'école. (aller)" },
    { group: "Temps Simples", w: "FERA", c: "Il ___ ses devoirs demain. (faire, futur)" },
  ],
  prompts: [
    { group: "Verbes Modaux", p: "Dis une phrase avec POUVOIR." },
    { group: "Verbes Modaux", p: "Dis ce que tu ne peux pas faire en classe." },
    { group: "Verbes Modaux", p: "Dis ce que tu dois faire à la maison." },
    { group: "Pronoms et Possessifs", p: "Dis une phrase avec MON, MA ou MES." },
    { group: "Pronoms et Possessifs", p: "Réponds avec un pronom tonique : « Qui est là ? »" },
    { group: "Pronoms et Possessifs", p: "Remplace le mot : « Je regarde la télé » → « Je ___ regarde »." },
    { group: "Temps Simples", p: "Dis ce que tu fais chaque jour." },
    { group: "Temps Simples", p: "Dis ce que tu as fait hier." },
    { group: "Temps Simples", p: "Dis ce que tu feras demain." },
    { group: VOCAB_GROUP, p: "Présente-toi : nom, âge et nationalité." },
    { group: VOCAB_GROUP, p: "Dis trois professions en français." },
    { group: VOCAB_GROUP, p: "Dis le nom de quatre membres de ta famille." },
  ],
  labels: {
    fill: "Completa la frase",
    vocab: "Vocabulario",
    howToSay: (es) => `¿Cómo se dice «${es}» en francés?`,
  },
};

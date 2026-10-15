// Hand-written extra questions for the games (French). See juegos_q_en.js for the format.
// Tense topics and the modal topics get their level-1 questions automatically from the conjugation tables.
const C = "¿Cuál frase es correcta?";

module.exports = {
  "fr-present": {
    2: [
      ["Nous ___ à Paris.", "sommes", "êtes", "sont"],
      ["Tu ___ un frère ?", "as", "a", "ai"],
    ],
    3: [
      ["Ils ___ le bus.", "prennent", "prend", "prenent"],
      ["Vous ___ la vérité.", "dites", "disez", "disent"],
      [C, "Vous faites vos devoirs.", "Vous faisez vos devoirs.", "Vous font vos devoirs.", "choose"],
    ],
  },
  "fr-present-negatif": {
    2: [
      ["Je ___ en retard.", "ne suis pas", "ne suis", "suis ne pas"],
      ["Tu ___ tes devoirs.", "ne fais pas", "ne fait pas", "ne fais"],
    ],
    3: [
      ["Nous ___ la réponse.", "n'avons pas", "ne avons pas", "n'ont pas"],
      ["Il ___ à la maison.", "n'est pas", "ne est pas", "n'es pas"],
      [C, "Elles ne vont pas au parc.", "Elles ne va pas au parc.", "Elles vont ne pas au parc.", "choose"],
    ],
  },
  "fr-present-questions": {
    2: [
      ["Est-ce que vous ___ prêts ?", "êtes", "est", "es"],
      ["Est-ce que nous ___ un cours demain ?", "avons", "avez", "ont"],
    ],
    3: [
      ["Est-ce que Paul ___ du café ?", "prend", "prends", "prennent"],
      ["Est-ce qu'elles ___ à la plage ?", "vont", "va", "allez"],
      [C, "Est-ce que tu dis la vérité ?", "Est-ce que tu dit la vérité ?", "Est-ce tu dis la vérité que ?", "choose"],
    ],
  },
  "fr-passe-compose": {
    2: [
      ["Marie et Léa ___ au parc.", "sont allées", "ont allé", "sont allés"],
      ["Tu ___ un gâteau.", "as fait", "a fait", "es fait"],
    ],
    3: [
      ["Mes amis ___ à Paris.", "sont allés", "ont allés", "sont allé"],
      ["Vous ___ une erreur.", "avez fait", "êtes fait", "avez faites"],
      [C, "Elle a pris le bus.", "Elle est pris le bus.", "Elle a prise le bus.", "choose"],
    ],
  },
  "fr-passe-compose-negatif": {
    2: [
      ["Je ___ mes devoirs.", "n'ai pas fait", "ne pas fait", "n'ai fait pas"],
      ["Marie ___ en retard.", "n'a pas été", "n'est pas été", "n'a été pas"],
    ],
    3: [
      ["Elle ___ le train.", "n'a pas pris", "n'est pas pris", "ne a pas pris"],
      ["Ils ___ la vérité.", "n'ont pas dit", "n'ont dit pas", "ne ont pas dit"],
      [C, "Nous n'avons pas fait nos devoirs.", "Nous ne avons pas fait nos devoirs.", "Nous n'avons fait pas nos devoirs.", "choose"],
    ],
  },
  "fr-passe-compose-questions": {
    2: [
      ["Est-ce que tu ___ ton livre ?", "as pris", "a pris", "es pris"],
      ["Est-ce que vous ___ à Paris ? (Marc et Luc)", "êtes allés", "avez allé", "êtes allé"],
    ],
    3: [
      ["Est-ce qu'elles ___ la vérité ?", "ont dit", "sont dit", "ont dites"],
      ["Est-ce que Léa ___ un chat ?", "a eu", "est eu", "a été"],
      [C, "Est-ce que nous avons fait nos devoirs ?", "Est-ce que nous sommes fait nos devoirs ?", "Est-ce que nous avons faits nos devoirs ?", "choose"],
    ],
  },
  "fr-futur-simple": {
    2: [
      ["Tu ___ à la maison demain.", "seras", "serai", "sera"],
      ["Nous ___ un examen vendredi.", "aurons", "avons", "aurez"],
    ],
    3: [
      ["Vous ___ au musée.", "irez", "allez", "iront"],
      ["Je ___ mes devoirs ce soir.", "ferai", "fais", "ferais"],
      [C, "Elles diront la vérité.", "Elles dirons la vérité.", "Elles disent la vérité demain.", "choose"],
    ],
  },

  // ------------------------------------------------------------------ modals
  "fr-modaux": {
    2: [
      ["Nous ___ partir maintenant.", "devons", "devez", "doivent"],
      ["Vous ___ entrer.", "pouvez", "pouvons", "peuvent"],
    ],
    3: [
      ["Ils ___ aller au parc.", "veulent", "veut", "voulons"],
      ["Les élèves ___ écouter le professeur.", "doivent", "doit", "devez"],
      [C, "Nous voulons une glace.", "Nous veulent une glace.", "Nous veux une glace.", "choose"],
    ],
  },
  "fr-modaux-negatif": {
    2: [
      ["Je ___ venir ce soir.", "ne peux pas", "ne peut pas", "ne peuvent pas"],
      ["Nous ___ rester.", "ne voulons pas", "ne veulent pas", "ne voulez pas"],
    ],
    3: [
      ["Il ___ aller à l'école aujourd'hui.", "ne doit pas", "ne doivent pas", "ne dois pas"],
      ["Elles ___ conduire.", "ne savent pas", "ne sait pas", "ne savez pas"],
      [C, "Vous ne devez pas fumer ici.", "Vous ne devons pas fumer ici.", "Vous devez ne pas fumer ici.", "choose"],
    ],
  },
  "fr-modaux-questions": {
    2: [
      ["Est-ce que vous ___ m'aider ?", "pouvez", "peut", "peuvent"],
      ["Est-ce que tu ___ venir ?", "veux", "veut", "voulez"],
    ],
    3: [
      ["Est-ce que nous ___ partir ?", "devons", "doivent", "devez"],
      ["Est-ce qu'ils ___ jouer ?", "savent", "sait", "savez"],
      [C, "Est-ce que Léa sait chanter ?", "Est-ce que Léa savent chanter ?", "Est-ce Léa que sait chanter ?", "choose"],
    ],
  },

  // ------------------------------------------------- possessives / pronouns
  "fr-adjectifs-possessifs": {
    1: [
      ["C'est ___ frère. (je)", "mon", "ma", "mes"],
      ["C'est ___ sœur. (tu)", "ta", "ton", "tes"],
      ["Ce sont ___ amis. (nous)", "nos", "notre", "votre"],
    ],
    2: [
      ["Il aime ___ école. (il)", "son", "sa", "ses"],
      ["Vous avez ___ livre.", "votre", "vos", "notre"],
    ],
    3: [
      ["Elle cherche ___ amie Léa.", "son", "sa", "ses"],
      ["Les enfants aiment ___ maison.", "leur", "leurs", "son"],
      [C, "Tu as tes clés ?", "Tu as ton clés ?", "Tu as ta clés ?", "choose"],
    ],
  },
  "fr-pronoms-toniques": {
    1: [
      ["C'est ___ ! (je)", "moi", "je", "me"],
      ["Pour ___, merci. (tu)", "toi", "tu", "te"],
      ["Chez ___, c'est grand. (nous)", "nous", "on", "vous"],
    ],
    2: [
      ["Tu viens avec ___ ? (lui)", "lui", "il", "le"],
      ["Les garçons ? Je joue avec ___.", "eux", "ils", "leur"],
    ],
    3: [
      ["___, je préfère le thé. (moi)", "Moi", "Me", "Je"],
      ["— Qui parle ? — ___ ! (elles)", "Elles", "Elle", "Eux"],
      [C, "C'est toi qui chantes.", "C'est tu qui chantes.", "C'est te qui chantes.", "choose"],
    ],
  },
  "fr-pronoms-cod": {
    1: [
      ["Je ___ vois. (le garçon)", "le", "la", "les"],
      ["Il ___ voit. (moi)", "me", "moi", "je"],
      ["Nous ___ aimons. (les films)", "les", "le", "leur"],
    ],
    2: [
      ["Tu regardes la télé ? Oui, je ___ regarde.", "la", "le", "lui"],
      ["Marie voit Paul. Elle ___ voit.", "le", "lui", "la"],
    ],
    3: [
      ["Nous écoutons les élèves. Nous ___ écoutons.", "les", "leur", "nous"],
      ["Il ___ regarde. (toi)", "te", "tu", "toi"],
      [C, "Je ne la vois pas.", "Je ne lui vois pas.", "Je ne vois la pas.", "choose"],
    ],
  },
  "fr-pronoms-coi": {
    1: [
      ["Je ___ parle. (à Marie)", "lui", "la", "leur"],
      ["Il ___ donne un livre. (à moi)", "me", "moi", "je"],
      ["Je ___ téléphone. (à mes parents)", "leur", "lui", "les"],
    ],
    2: [
      ["Paul parle à Léa. Il ___ parle.", "lui", "la", "leur"],
      ["Tu écris à tes amis ? Oui, je ___ écris.", "leur", "lui", "les"],
    ],
    3: [
      ["Elle ___ dit bonjour. (à nous)", "nous", "lui", "leur"],
      ["Je ne ___ réponds pas. (à lui)", "lui", "le", "leur"],
      [C, "Il leur donne un cadeau.", "Il les donne un cadeau.", "Il donne leur un cadeau.", "choose"],
    ],
  },

  // -------------------------------------------------------------- vocabulary
  "vocab:Professions": {
    3: [
      ["Elle travaille à l'hôpital et soigne les malades. Elle est ___.", "infirmière", "avocate", "agricultrice"],
      ["Il répare les voitures dans un garage. Il est ___.", "mécanicien", "architecte", "professeur"],
    ],
  },
  "vocab:Famille": {
    3: [
      ["Le frère de mon père est mon ___.", "oncle", "cousin", "grand-père"],
      ["La mère de ma mère est ma ___.", "grand-mère", "tante", "sœur"],
    ],
  },
  "vocab:Nationalités": {
    3: [
      ["Une personne de Haïti est ___.", "haïtienne", "dominicaine", "mexicaine"],
      ["Une personne de France est ___.", "française", "espagnole", "italienne"],
    ],
  },
  "vocab:Salutations": {
    3: [
      ["Tu rencontres quelqu'un pour la première fois. Tu dis : ___.", "Enchanté", "Au revoir", "Merci"],
      ["Tu pars. Tu dis : ___.", "Au revoir", "Bonjour", "Enchanté"],
    ],
  },
  "vocab:Nombres": {
    3: [
      ["Quel âge as-tu ? — J'ai ___ ans. (15)", "quinze", "cinq", "quarante"],
      ["10 + 10 = ___", "vingt", "trente", "dix"],
    ],
  },
};

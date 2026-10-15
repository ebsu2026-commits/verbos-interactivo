// Hand-written extra questions for the games (English), by topic slug and difficulty.
// Format: [sentence with ___, correct, wrong1, wrong2, kind?]
//   kind "choose": no blank; the sentence is a prompt and the options are whole sentences.
// Difficulty: 1 = recognition, 2 = in context, 3 = tricky (spelling, exceptions, choose the correct sentence).
// Tense topics get their level-1 questions automatically from the conjugation tables.
const C = "¿Cuál oración es correcta?";

module.exports = {
  "presente-simple": {
    2: [
      ["Carlos ___ soccer after school.", "plays", "play", "playing"],
      ["My parents ___ in Santiago.", "live", "lives", "living"],
    ],
    3: [
      ["She ___ English every night.", "studies", "studys", "study"],
      ["My brother ___ TV after dinner.", "watches", "watchs", "watching"],
      [C, "The baby sleeps all afternoon.", "The baby sleep all afternoon.", "The baby sleeps all afternoons are.", "choose"],
    ],
  },
  "presente-simple-negativo": {
    2: [
      ["Rosa ___ eat meat.", "doesn't", "don't", "isn't"],
      ["We ___ have class on Sunday.", "don't", "doesn't", "aren't"],
    ],
    3: [
      ["He doesn't ___ to school by bus.", "go", "goes", "going"],
      ["They ___ happy today.", "aren't", "don't", "doesn't"],
      [C, "My cat doesn't like water.", "My cat don't like water.", "My cat doesn't likes water.", "choose"],
    ],
  },
  "presente-simple-preguntas": {
    2: [
      ["___ your mother work here?", "Does", "Do", "Is"],
      ["___ we have homework today?", "Do", "Does", "Are"],
    ],
    3: [
      ["Does he ___ English?", "speak", "speaks", "speaking"],
      ["___ the children happy?", "Are", "Do", "Does"],
      [C, "Where do you live?", "Where does you live?", "Where you do live?", "choose"],
    ],
  },
  "pasado-simple": {
    2: [
      ["We ___ to the beach last Sunday.", "went", "go", "goed"],
      ["She ___ a new bike yesterday.", "got", "gets", "getted"],
    ],
    3: [
      ["They ___ at home last night.", "were", "was", "are"],
      ["He ___ a cake for my birthday.", "made", "maked", "makes"],
      [C, "I did my homework before dinner.", "I done my homework before dinner.", "I did my homework before dinner yesterday are.", "choose"],
    ],
  },
  "pasado-simple-negativo": {
    2: [
      ["I ___ go to school yesterday.", "didn't", "don't", "wasn't"],
      ["They ___ a test last week.", "didn't have", "didn't had", "don't have"],
    ],
    3: [
      ["She didn't ___ the answer.", "know", "knew", "known"],
      ["We ___ at the party.", "weren't", "wasn't", "didn't"],
      [C, "He didn't buy bread.", "He didn't bought bread.", "He not buy bread.", "choose"],
    ],
  },
  "pasado-simple-preguntas": {
    2: [
      ["___ you go to the park yesterday?", "Did", "Do", "Were"],
      ["___ she at home last night?", "Was", "Did", "Were"],
    ],
    3: [
      ["Did they ___ the movie?", "like", "liked", "likes"],
      ["___ the students late yesterday?", "Were", "Was", "Did"],
      [C, "What did you do last weekend?", "What did you did last weekend?", "What you did last weekend?", "choose"],
    ],
  },
  "futuro-simple": {
    2: [
      ["I ___ call you tomorrow.", "will", "wills", "am"],
      ["They ___ arrive at six.", "will", "wills", "are"],
    ],
    3: [
      ["She will ___ the answer.", "know", "knows", "knowing"],
      ["My brother ___ travel next year.", "will", "wills", "will to"],
      [C, "He will go to school tomorrow.", "He will goes to school tomorrow.", "He wills go to school tomorrow.", "choose"],
    ],
  },
  "presente-continuo": {
    2: [
      ["I ___ my homework right now.", "am doing", "do", "does"],
      ["The kids ___ in the park.", "are playing", "is playing", "plays"],
    ],
    3: [
      ["She is ___ a letter.", "writing", "write", "writeing"],
      ["We ___ for the bus.", "are waiting", "is waiting", "waiting are"],
      [C, "He is running to school.", "He is runing to school.", "He running to school.", "choose"],
    ],
  },
  "pasado-continuo": {
    2: [
      ["I ___ TV when you called.", "was watching", "were watching", "watched are"],
      ["They ___ in the yard at five.", "were playing", "was playing", "played are"],
    ],
    3: [
      ["She ___ lunch when the phone rang.", "was making", "were making", "is making"],
      ["We were ___ when the lights went out.", "studying", "study", "studyed"],
      [C, "They were waiting for the bus.", "They was waiting for the bus.", "They waiting for the bus was.", "choose"],
    ],
  },
  "futuro-going-to": {
    2: [
      ["I ___ visit my aunt on Saturday.", "am going to", "is going to", "going to"],
      ["They ___ play baseball tomorrow.", "are going to", "is going to", "am going to"],
    ],
    3: [
      ["She is going to ___ a new phone.", "buy", "buys", "buying"],
      ["My dad ___ cook dinner tonight.", "is going to", "are going to", "going to"],
      [C, "We are going to travel in July.", "We going to travel in July.", "We are going to travels in July.", "choose"],
    ],
  },

  // ------------------------------------------------------------------- modals
  "modal-verbs": {
    1: [
      ["I ___ swim. (habilidad)", "can", "must", "should"],
      ["We ___ wear a uniform. (obligación)", "must", "can", "may"],
      ["You ___ drink more water. (consejo)", "should", "must", "would"],
    ],
    2: [
      ["He ___ speak English very well.", "can", "cans", "can to"],
      ["They ___ finish the project today.", "must", "musts", "must to"],
    ],
    3: [
      ["I ___ like a glass of water, please.", "would", "will to", "am"],
      ["My dog ___ run very fast when it was young.", "could", "can", "cans"],
      [C, "She should visit her grandmother.", "She shoulds visit her grandmother.", "She should to visit her grandmother.", "choose"],
    ],
  },
  "modal-verbs-negativo": {
    1: [
      ["He ___ swim. (no sabe)", "can't", "mustn't", "shouldn't"],
      ["You ___ run here. (prohibido)", "mustn't", "can't", "wouldn't"],
      ["You ___ eat so much sugar. (consejo)", "shouldn't", "mustn't", "couldn't"],
    ],
    2: [
      ["They ___ come to the party.", "can't", "cans't", "don't can"],
      ["We ___ use phones in the exam.", "mustn't", "don't must", "mustn't to"],
    ],
    3: [
      ["She ___ remember my name.", "couldn't", "didn't could", "can't to"],
      ["He ___ tell lies.", "shouldn't", "doesn't should", "shouldn't to"],
      [C, "You mustn't open that door.", "You don't must open that door.", "You mustn't to open that door.", "choose"],
    ],
  },
  "modal-verbs-preguntas": {
    1: [
      ["___ you help me?", "Can", "Does", "Are"],
      ["___ I open the window?", "May", "Do", "Am"],
      ["___ we go now?", "Should", "Do", "Are"],
    ],
    2: [
      ["___ he swim?", "Can", "Does", "Cans"],
      ["___ they come tomorrow?", "Could", "Do", "Are"],
    ],
    3: [
      ["Can she ___ the guitar?", "play", "plays", "playing"],
      ["___ you like some tea?", "Would", "Do", "Are"],
      [C, "Must we do homework today?", "Do we must homework today?", "Must we to do homework today?", "choose"],
    ],
  },

  // ------------------------------------------------- possessives / pronouns
  "possessive-adjectives": {
    1: [
      ["This is ___ book. (I)", "my", "me", "mine"],
      ["That is ___ house. (you)", "your", "you", "yours"],
      ["They love ___ teacher. (they)", "their", "them", "they"],
    ],
    2: [
      ["She has ___ keys.", "her", "his", "hers"],
      ["We clean ___ classroom.", "our", "us", "ours"],
    ],
    3: [
      ["Carlos and ___ sister are twins.", "his", "he", "him"],
      ["The cat licks ___ paws.", "its", "it's", "his"],
      [C, "Maria and Ana love their mother.", "Maria and Ana love her mother.", "Maria and Ana love theirs mother.", "choose"],
    ],
  },
  "object-pronouns": {
    1: [
      ["Call ___ tomorrow. (I)", "me", "I", "my"],
      ["I know ___. (he)", "him", "he", "his"],
      ["Help ___, please. (we)", "us", "we", "our"],
    ],
    2: [
      ["I see ___ every day. (they)", "them", "they", "their"],
      ["She talks to ___ often. (you)", "you", "your", "yours"],
    ],
    3: [
      ["Give the ball to ___. (she)", "her", "she", "hers"],
      ["— Who broke it? — ___!", "Me", "I", "My"],
      [C, "The teacher is looking at us.", "The teacher is looking at we.", "The teacher is looking at our.", "choose"],
    ],
  },

  // -------------------------------------------------------------- vocabulary
  "vocab:Ocupaciones": {
    3: [
      ["My mother works in a hospital and helps sick people. She is a ___.", "nurse", "farmer", "lawyer"],
      ["He fixes cars at a garage. He is a ___.", "mechanic", "architect", "teacher"],
    ],
  },
  "vocab:Familia": {
    3: [
      ["My father's brother is my ___.", "uncle", "cousin", "grandfather"],
      ["My mother's mother is my ___.", "grandmother", "aunt", "sister"],
    ],
  },
  "vocab:Nacionalidades": {
    3: [
      ["A person from Brazil is ___.", "Brazilian", "Brazil", "Brazilan"],
      ["A person from the Dominican Republic is ___.", "Dominican", "Dominic", "Dominica"],
    ],
  },
  "vocab:Idiomas": {
    3: [
      ["In Haiti, many people speak ___.", "Creole", "Italian", "Portuguese"],
      ["In Brazil, people speak ___.", "Portuguese", "Spanish", "French"],
    ],
  },
  "vocab:Saludos y cortesía": {
    3: [
      ["You meet someone for the first time. You say: ___.", "Nice to meet you", "Good night", "Goodbye"],
      ["It's 10 p.m. and you go to bed. You say: ___.", "Good night", "Good morning", "Hello"],
    ],
  },
  "vocab:Números": {
    3: [
      ["How old are you? — I am ___ years old. (15)", "fifteen", "fifty", "fifth"],
      ["3 × 10 = ___", "thirty", "thirteen", "third"],
    ],
  },
};

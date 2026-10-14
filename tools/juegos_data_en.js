// Authored game content for English. Grammar questions and sentences are
// derived automatically from the topic pages (practice items), so new topics
// feed the games without extra work. This file adds vocabulary, pairs,
// hangman words and speaking prompts.

const VOCAB_GROUP = "Vocabulario: Identificación Personal";

module.exports = {
  vocabGroup: VOCAB_GROUP,
  // [target word, Spanish meaning]
  vocab: [
    { title: "Ocupaciones", items: [["teacher", "profesor/a"], ["doctor", "doctor/a"], ["engineer", "ingeniero/a"], ["nurse", "enfermero/a"], ["lawyer", "abogado/a"], ["architect", "arquitecto/a"], ["mechanic", "mecánico/a"], ["farmer", "agricultor/a"]] },
    { title: "Familia", items: [["mother", "madre"], ["father", "padre"], ["brother", "hermano"], ["sister", "hermana"], ["grandmother", "abuela"], ["grandfather", "abuelo"], ["aunt", "tía"], ["uncle", "tío"], ["cousin", "primo/a"]] },
    { title: "Nacionalidades", items: [["Dominican", "dominicano/a"], ["Haitian", "haitiano/a"], ["American", "estadounidense"], ["Spanish", "español/a"], ["French", "francés/a"], ["Italian", "italiano/a"], ["Brazilian", "brasileño/a"], ["Mexican", "mexicano/a"]] },
    { title: "Idiomas", items: [["Spanish", "español"], ["English", "inglés"], ["French", "francés"], ["Creole", "criollo"], ["Italian", "italiano"], ["Portuguese", "portugués"]] },
    { title: "Saludos y cortesía", items: [["hello", "hola"], ["good morning", "buenos días"], ["good night", "buenas noches"], ["goodbye", "adiós"], ["thank you", "gracias"], ["please", "por favor"], ["nice to meet you", "mucho gusto"]] },
    { title: "Números", items: [["five", "cinco"], ["ten", "diez"], ["twelve", "doce"], ["fifteen", "quince"], ["twenty", "veinte"], ["thirty", "treinta"]] },
  ],
  // matching sets for the memory game: [A, B]
  pairSets: [
    { group: "Pronombres y Posesivos", title: "Sujeto → objeto", pairs: [["I", "me"], ["he", "him"], ["she", "her"], ["we", "us"], ["they", "them"]] },
    { group: "Pronombres y Posesivos", title: "Sujeto → posesivo", pairs: [["I", "my"], ["you", "your"], ["he", "his"], ["she", "her"], ["we", "our"], ["they", "their"]] },
    { group: "Verbos Modales", title: "Modal → para qué sirve", pairs: [["can", "habilidad"], ["must", "obligación"], ["should", "consejo"], ["may", "permiso formal"], ["would", "cortesía"], ["mustn't", "prohibido"]] },
    { group: "Tiempos Simples", title: "Verbo → he / she / it", pairs: [["go", "goes"], ["have", "has"], ["do", "does"], ["make", "makes"], ["get", "gets"], ["be", "is"]] },
    { group: "Tiempos Simples", title: "Presente → pasado", pairs: [["go", "went"], ["have", "had"], ["do", "did"], ["make", "made"], ["get", "got"], ["is", "was"]] },
    { group: "Tiempos Continuos", title: "Verbo → -ing", pairs: [["go", "going"], ["have", "having"], ["do", "doing"], ["make", "making"], ["get", "getting"], ["be", "being"]] },
  ],
  // hangman: word + clue (the vocabulary above is added automatically)
  words: [
    { group: "Verbos Modales", w: "SHOULD", c: "Consejo: You ___ rest." },
    { group: "Verbos Modales", w: "MUST", c: "Obligación: We ___ study." },
    { group: "Verbos Modales", w: "COULD", c: "Cortesía: ___ you help me?" },
    { group: "Verbos Modales", w: "CAN'T", c: "No puede: He ___ swim." },
    { group: "Pronombres y Posesivos", w: "THEIR", c: "Posesivo de ellos: They love ___ school." },
    { group: "Pronombres y Posesivos", w: "THEM", c: "Objeto de ellos: I help ___." },
    { group: "Pronombres y Posesivos", w: "HIS", c: "Posesivo de él: He likes ___ phone." },
    { group: "Pronombres y Posesivos", w: "OUR", c: "Posesivo de nosotros: We love ___ class." },
    { group: "Tiempos Simples", w: "WENT", c: "Pasado de GO." },
    { group: "Tiempos Simples", w: "GOES", c: "He ___ to school every day." },
    { group: "Tiempos Simples", w: "DOES", c: "She ___ her homework." },
    { group: "Tiempos Continuos", w: "MAKING", c: "She is ___ lunch." },
    { group: "Tiempos Continuos", w: "GOING", c: "I am ___ to school." },
  ],
  // speaking challenges for the wheel
  prompts: [
    { group: "Verbos Modales", p: "Say a sentence with CAN." },
    { group: "Verbos Modales", p: "Say a sentence with MUST." },
    { group: "Verbos Modales", p: "Give advice to a friend using SHOULD." },
    { group: "Verbos Modales", p: "Ask a polite question with COULD." },
    { group: "Pronombres y Posesivos", p: "Say a sentence with MY and a sentence with HER." },
    { group: "Pronombres y Posesivos", p: "Use THEM in a sentence." },
    { group: "Pronombres y Posesivos", p: "Point to a classmate's thing and say: This is HIS / HER ..." },
    { group: "Tiempos Simples", p: "Say what you do every day (3 sentences)." },
    { group: "Tiempos Simples", p: "Say what you did yesterday." },
    { group: "Tiempos Continuos", p: "Say what you are doing right now." },
    { group: "Tiempos Continuos", p: "Say what you are going to do tomorrow." },
    { group: VOCAB_GROUP, p: "Introduce yourself: name, age and nationality." },
    { group: VOCAB_GROUP, p: "Name three occupations in English." },
    { group: VOCAB_GROUP, p: "Name four family members." },
    { group: VOCAB_GROUP, p: "Say which languages you speak." },
  ],
  labels: {
    fill: "Completa la oración",
    vocab: "Vocabulario",
    howToSay: (es) => `¿Cómo se dice «${es}» en inglés?`,
  },
};

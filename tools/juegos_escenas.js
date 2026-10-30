// Scenes for the game "Arma la escena": a room / street / face with hidden pieces. The team names the object,
// then the teacher reveals it. Geometry (x, y = % of the stage, s = size) is shared by both languages;
// every item carries its word in English, French and the Spanish meaning shown on reveal.
// Scene words also become vocabulary topics, so the other games (jeopardy, memory, hangman...) use them for free.
//   item: { e: emoji, x, y, s, es: "significado", en: "word", fr: "le mot" }

module.exports = {
  groups: {
    en: { home: "Vocabulario: Casa y Ciudad", school: "Vocabulario: Escuela", people: "Vocabulario: Personas" },
    fr: { home: "Vocabulaire : Maison et Ville", school: "Vocabulaire : École", people: "Vocabulaire : Personnes" },
  },
  scenes: [
    {
      group: "home", bg: "room", title: { en: "La sala", fr: "Le salon" },
      items: [
        { e: "🚪", x: 8, y: 46, s: 1.9, es: "puerta", en: "door", fr: "la porte" },
        { e: "🖼️", x: 30, y: 24, s: 1.3, es: "cuadro", en: "picture", fr: "le tableau" },
        { e: "🕰️", x: 55, y: 16, s: 1.1, es: "reloj de pared", en: "clock", fr: "l'horloge" },
        { e: "☎️", x: 85, y: 26, s: 1.2, es: "teléfono", en: "phone", fr: "le téléphone" },
        { e: "📺", x: 72, y: 50, s: 1.6, es: "televisor", en: "TV", fr: "la télévision" },
        { e: "🛋️", x: 38, y: 66, s: 2.3, es: "sofá", en: "sofa", fr: "le canapé" },
        { e: "💐", x: 62, y: 78, s: 1.1, es: "flores", en: "flowers", fr: "les fleurs" },
        { e: "🪑", x: 86, y: 74, s: 1.6, es: "silla", en: "chair", fr: "la chaise" },
      ],
    },
    {
      group: "home", bg: "room", title: { en: "El dormitorio", fr: "La chambre" },
      items: [
        { e: "🚪", x: 8, y: 46, s: 1.9, es: "puerta", en: "door", fr: "la porte" },
        { e: "⏰", x: 60, y: 16, s: 1.1, es: "despertador", en: "alarm clock", fr: "le réveil" },
        { e: "🛏️", x: 36, y: 66, s: 2.4, es: "cama", en: "bed", fr: "le lit" },
        { e: "🧸", x: 60, y: 66, s: 1.3, es: "oso de peluche", en: "teddy bear", fr: "l'ours en peluche" },
        { e: "👕", x: 84, y: 34, s: 1.3, es: "camiseta", en: "T-shirt", fr: "le t-shirt" },
        { e: "📚", x: 90, y: 62, s: 1.3, es: "libros", en: "books", fr: "les livres" },
        { e: "👟", x: 76, y: 80, s: 1.0, es: "zapatos", en: "shoes", fr: "les chaussures" },
        { e: "🎒", x: 15, y: 80, s: 1.4, es: "mochila", en: "backpack", fr: "le sac à dos" },
      ],
    },
    {
      group: "home", bg: "city", title: { en: "La ciudad", fr: "La ville" },
      items: [
        { e: "🏫", x: 14, y: 25, s: 1.9, es: "escuela", en: "school", fr: "l'école" },
        { e: "🏥", x: 38, y: 25, s: 1.9, es: "hospital", en: "hospital", fr: "l'hôpital" },
        { e: "🏦", x: 62, y: 25, s: 1.9, es: "banco", en: "bank", fr: "la banque" },
        { e: "⛪", x: 86, y: 25, s: 1.9, es: "iglesia", en: "church", fr: "l'église" },
        { e: "🏠", x: 16, y: 56, s: 1.6, es: "casa", en: "house", fr: "la maison" },
        { e: "🏪", x: 42, y: 56, s: 1.6, es: "tienda", en: "store", fr: "le magasin" },
        { e: "🚌", x: 68, y: 79, s: 1.7, es: "autobús (guagua)", en: "bus", fr: "le bus" },
        { e: "🚗", x: 89, y: 79, s: 1.4, es: "carro", en: "car", fr: "la voiture" },
      ],
    },
    {
      group: "school", bg: "desk", title: { en: "Útiles escolares", fr: "Le matériel scolaire" },
      items: [
        { e: "🎒", x: 14, y: 40, s: 1.9, es: "mochila", en: "backpack", fr: "le sac à dos" },
        { e: "📖", x: 38, y: 38, s: 1.5, es: "libro", en: "book", fr: "le livre" },
        { e: "📓", x: 16, y: 74, s: 1.4, es: "cuaderno", en: "notebook", fr: "le cahier" },
        { e: "✏️", x: 62, y: 76, s: 1.3, es: "lápiz", en: "pencil", fr: "le crayon" },
        { e: "🖊️", x: 40, y: 76, s: 1.2, es: "bolígrafo", en: "pen", fr: "le stylo" },
        { e: "📏", x: 88, y: 40, s: 1.3, es: "regla", en: "ruler", fr: "la règle" },
        { e: "✂️", x: 84, y: 76, s: 1.2, es: "tijeras", en: "scissors", fr: "les ciseaux" },
        { e: "💻", x: 66, y: 40, s: 1.6, es: "computadora", en: "computer", fr: "l'ordinateur" },
      ],
    },
    {
      group: "people", bg: "room", title: { en: "Mi familia", fr: "Ma famille" },
      items: [
        { e: "👴", x: 38, y: 14, s: 1.3, es: "abuelo", en: "grandfather", fr: "le grand-père" },
        { e: "👵", x: 62, y: 14, s: 1.3, es: "abuela", en: "grandmother", fr: "la grand-mère" },
        { e: "👨", x: 38, y: 43, s: 1.3, es: "padre", en: "father", fr: "le père" },
        { e: "👩", x: 62, y: 43, s: 1.3, es: "madre", en: "mother", fr: "la mère" },
        { e: "👦", x: 20, y: 72, s: 1.3, es: "hermano", en: "brother", fr: "le frère" },
        { e: "👧", x: 40, y: 72, s: 1.3, es: "hermana", en: "sister", fr: "la sœur" },
        { e: "👶", x: 60, y: 72, s: 1.2, es: "bebé", en: "baby", fr: "le bébé" },
        { e: "🐶", x: 80, y: 72, s: 1.3, es: "perro", en: "dog", fr: "le chien" },
      ],
    },
    {
      group: "people", bg: "face", title: { en: "La cara", fr: "Le visage" },
      items: [
        { e: "🎩", x: 50, y: 15, s: 1.3, es: "sombrero", en: "hat", fr: "le chapeau" },
        { e: "👓", x: 86, y: 34, s: 1.4, es: "lentes", en: "glasses", fr: "les lunettes" },
        { l: "r", e: "👀", x: 50, y: 40, s: 1.5, es: "ojos", en: "eyes", fr: "les yeux" },
        { l: "r", e: "👃", x: 50, y: 54, s: 1.3, es: "nariz", en: "nose", fr: "le nez" },
        { e: "👂", x: 24, y: 52, s: 1.3, es: "oreja", en: "ear", fr: "l'oreille" },
        { l: "r", e: "👄", x: 50, y: 67, s: 1.3, es: "boca", en: "mouth", fr: "la bouche" },
        { l: "r", e: "👅", x: 50, y: 81, s: 1.1, es: "lengua", en: "tongue", fr: "la langue" },
        { e: "🦷", x: 84, y: 70, s: 1.2, es: "diente", en: "tooth", fr: "la dent" },
      ],
    },
  ],
};

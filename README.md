# Verbos y Gramática — Sitio Interactivo

Recurso didáctico para la enseñanza de inglés y francés en el Centro Educativo Salomé Ureña. Muestra, en forma de mapa de nodos, cómo cambia (o no cambia) cada forma según el sujeto. Incluye práctica de gramática y de listening con audio.

## Contenido

**Inglés** (`index.html`)
- **Tiempos Simples:** Presente, Pasado y Futuro (`will`), cada uno con sus versiones Negativo y Preguntas (presente y pasado).
- **Tiempos Continuos:** Presente Continuo, Pasado Continuo, Futuro con `going to`.
- **Verbos Modales:** Modal Verbs (afirmativo, negativo, preguntas).
- **Pronombres y Posesivos:** Possessive Adjectives, Object Pronouns (incluye el uso corto "Me too!").

**Francés** (`fr-index.html`)
- **Temps Simples:** Présent, Passé Composé y Futur Simple (con Négatif y Questions en presente y passé composé).
- **Verbes Modaux:** pouvoir, vouloir, devoir, savoir (présent, négatif, questions).
- **Pronoms et Possessifs:** Adjectifs Possessifs, Pronoms Toniques, Pronoms COD, Pronoms COI.

Cada tema tiene un mapa de nodos, "Ejemplos con otros sujetos" y una página de **práctica** (5 preguntas de gramática + 5 de listening con audio).

Es un sitio 100% estático (HTML + CSS en línea, sin dependencias): cada página funciona también abierta desde el explorador de archivos.

## Desarrollo

Las páginas se generan con los scripts de `tools/` — no se edita el HTML a mano, para no perder la sincronía entre páginas.

- `tools/build_verbos_site.js` — inglés (tiempos verbales + motor visual compartido).
- `tools/verbos_extra_en.js` / `tools/verbos_extra_fr.js` — temas de gramática nuevos (modales, posesivos, pronombres). Para agregar un tema, se añade un bloque aquí.
- `tools/build_verbos_fr.js` — francés; **también regenera el inglés**. Es el comando principal: `node tools/build_verbos_fr.js`.
- `tools/gen_practice_audio.py` y `tools/gen_practice_audio_fr.py` — generan los audios de la práctica (requieren `pip install edge-tts`). Se corren después de añadir o cambiar preguntas y luego se vuelve a ejecutar el build para incrustar los audios.

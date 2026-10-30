# Verbos y Gramática — Sitio Interactivo

Recurso didáctico para la enseñanza de inglés y francés en el Centro Educativo Salomé Ureña. Muestra, en forma de mapa de nodos, cómo cambia (o no cambia) cada forma según el sujeto. Incluye práctica de gramática y de listening con audio, y juegos para el aula.

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

**Aprender jugando** (`juegos.html`) — juegos para proyectar y jugar por equipos (2 a 4), en inglés y en francés:
- Ahorcado, Memoria de parejas, Concurso de puntos (tablero 100–500), Ruleta de retos, Ordena la oración (con audio) y **Arma la escena**: una sala, dormitorio, ciudad, útiles escolares, familia o cara con piezas en silueta; el equipo dice el objeto y el docente lo «muestra» para comprobar (✓ +2 puntos; al mostrarse suena la palabra). Con «Siluetas: no» solo se ve un «?». Las escenas están en `tools/juegos_escenas.js` (emoji, posición y palabra en inglés/francés); sus palabras también son temas de vocabulario para los demás juegos.
- **Temporizador:** tiempo por turno (sin límite, 15, 30, 60 o 90 s) y duración de la partida (sin límite, 5, 10 o 15 min). Barra que cambia de color, pausa, sonido opcional. Cuando se acaba el turno: el Ahorcado y la Memoria pasan al siguiente equipo; en el Concurso y la Ruleta cuenta como respuesta fallida; en Ordena la oración cuenta como intento fallido. Al terminar la partida se muestra el ganador.
- **Contenido:** se elige un grupo de temas, una mezcla o temas concretos ("Elegir temas…"). Incluye vocabulario de Identificación Personal.
- **Dificultad:** las preguntas tienen nivel 1 (reconocer la forma), 2 (en contexto) o 3 (difícil). En el Concurso, 100 y 200 son fáciles, 300 y 400 medias y 500 difícil. Las preguntas no se repiten dentro de una partida.
- Nombres de equipo editables, marcador con +1 / −1 y pantalla completa. Los ajustes (idioma, contenido, equipos, nombres, tiempos y sonido) se guardan en el navegador.

Es un sitio 100% estático (HTML + CSS en línea, sin dependencias): cada página funciona también abierta desde el explorador de archivos.

## Desarrollo

Las páginas se generan con los scripts de `tools/` — no se edita el HTML a mano, para no perder la sincronía entre páginas. **Comando principal:** `node tools/build_juegos.js` (regenera todo: inglés, francés y juegos).

- `tools/build_verbos_site.js` — inglés (tiempos verbales + motor visual compartido).
- `tools/verbos_extra_en.js` / `tools/verbos_extra_fr.js` — temas de gramática nuevos (modales, posesivos, pronombres). Para agregar un tema, se añade un bloque aquí.
- `tools/build_verbos_fr.js` — francés.
- `tools/build_juegos.js` — genera `juegos/data.js`, `juegos.html` y las páginas de cada juego. Arma automáticamente las preguntas de conjugación (nivel 1) a partir de las tablas de cada tema y reúne las de práctica (nivel 2).
- `tools/juegos_q_en.js` / `tools/juegos_q_fr.js` — preguntas escritas a mano por tema y nivel (formato `[oración con ___, correcta, error1, error2]`; con quinto elemento `"choose"` son de "elegir la oración correcta").
- `tools/juegos_escenas.js` — las escenas de «Arma la escena» (una sola lista para inglés y francés). Para añadir una: copiar una escena, cambiar emoji, `x`/`y`/`s` (posición y tamaño en %) y palabras; el audio se genera con los `gen_practice_audio*.py` (build → audio → build).
- `tools/juegos_data_en.js` / `tools/juegos_data_fr.js` — vocabulario, parejas, palabras del ahorcado, retos de la ruleta y oraciones extra para ordenar.
- `juegos/*.js` — lógica de cada juego y motor común (`common.js`); se editan a mano. `juegos/data.js` sí es generado.
- `tools/gen_practice_audio.py` y `tools/gen_practice_audio_fr.py` — generan los audios de la práctica y de las oraciones del juego (requieren `pip install -U edge-tts`). Orden al añadir oraciones: build → generar audio → build otra vez.

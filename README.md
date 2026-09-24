# Conjugación de Verbos — Sitio Interactivo

Recurso didáctico para la enseñanza de inglés en el Centro Educativo Salomé Ureña. Muestra, en forma de mapa de nodos, cómo cambia (o no cambia) la forma de un verbo según el sujeto, para los 6 tiempos verbales básicos.

## Contenido

- **`index.html`** — página de inicio con tarjetas de navegación agrupadas en Tiempos Simples y Tiempos Continuos.
- **Tiempos Simples:** Presente Simple, Pasado Simple, Futuro Simple (`will`).
- **Tiempos Continuos:** Presente Continuo, Pasado Continuo, Futuro con `going to`.

Cada página tiene:
- Un mapa de nodos: el Sujeto en el centro, conectado a los seis verbos más usados (to be, to have, to do, to go, to make, to get), cada uno con su forma correcta por grupo de sujeto.
- Una sección de "Ejemplos con otros sujetos" (María, Los estudiantes, Mi hermano, Ana y Luis) para mostrar que la regla aplica más allá de los pronombres personales.
- Navegación anterior/siguiente entre tiempos, y un enlace de regreso al inicio.

Es un sitio 100% estático (HTML + CSS en línea, sin build ni dependencias) — cada página también funciona abierta directamente desde el explorador de archivos, sin necesidad de internet.

## Desarrollo

Las páginas se generan con un script (`build_verbos_site.js`, fuera de este repositorio) a partir de una lista de tiempos verbales. Para agregar un tiempo nuevo o corregir contenido, se edita ese script y se regenera — no se edita el HTML de cada página directamente, para no perder la sincronía entre páginas.

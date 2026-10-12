# Circuitos E·B

Sitio estático para preparar los certámenes de Electromagnetismo EIE2211 (PUCV), con énfasis en teoría de circuitos. Cada módulo conecta el circuito con la física de campos, resuelve un ejemplo separando planteamiento y álgebra y trae un laboratorio interactivo. Al final tiene tres bloques con la respuesta bloqueada hasta que escribes tu desarrollo:

- **Verifica tu comprensión**: las preguntas de la lección en PDF, con las respuestas del solucionario.
- **Ejercicio propuesto de la lección** (20 pts): el enunciado y la figura de la lección, con la pauta del solucionario. El módulo 2.4 incluye además el ejercicio de Kirchhoff de la clase 1.
- **Ejercicio adicional tipo certamen**: un ejercicio extra propio del sitio.

El módulo 2.1 sigue la notación del Cap. 3 (ρe, U_d, μe, S, ρΩ).

## Panel de notación y formulario

En el borde derecho hay dos pestañas que abren un panel visible desde cualquier módulo:

- **Notación**: los símbolos del curso con su unidad, agrupados por tema y con la variante que usan los apuntes cuando difiere (Cap. 3, 4 y 7, formulario del profesor Villarroel, guía de circuitos y libro de ejercicios). Arriba están las reglas de escritura del ramo.
- **Formulario**: las fórmulas de los doce módulos. Cada una tiene el botón *Explicar paso a paso*, que abre una ventana con qué dice la fórmula, de dónde sale, qué es cada símbolo, cuándo se usa, un ejemplo resuelto y el error típico del certamen.

El sitio también ofrece **Formulario PDF** (`descargas/Formulario_EIE2211_circuitos.pdf`): dos páginas A4 con el nombre y la fórmula de las 38 fichas del panel, las que aparecen en los módulos sin ficha propia y las constantes del curso, para usar en la prueba. Se regenera con `python3 tools/build_formulario.py` (requiere node y pdflatex) cada vez que cambien las fórmulas.

El panel muestra por defecto lo del módulo abierto (se puede cambiar a todo el curso) y tiene buscador. Los bloques "Ecuaciones que usarás" de cada módulo también llevan un enlace *Explicar* a la misma ventana.

## Módulos

| Módulo | Tema | Laboratorio |
|---|---|---|
| 2.1 | Corriente y ley de Ohm | Conductor con deriva de electrones |
| 2.2 | Fuerza electromotriz | Batería real y potencia en la carga |
| 2.3 | Ley de corrientes (LCK) | Balanza de carga en un nodo |
| 2.4 | Ley de voltajes (LVK) | Perfil de potencial a lo largo del lazo |
| 2.5 | Serie, paralelo y Δ–Y | Conversor triángulo-estrella |
| 2.6 | Análisis de mallas | Matriz de mallas en vivo |
| 2.7 | Análisis de nodos | Matriz de conductancias en vivo |
| 2.8 | Thévenin, Norton y máxima potencia | Barrido de carga |
| 2.9 | Capacitores y circuito RC | Carga y descarga |
| 2.10 | Inductancia y circuito RL | Energización y desenergización |
| 2.11 | Resistencia en geometrías no uniformes | Fuga radial en un coaxial |
| 2.12 | Capacitancia y dieléctricos | Condensador con lámina |

## Estructura

```
index.html          contenido de los módulos (HTML semántico, LaTeX con MathJax)
img/lecciones/      figuras de los ejercicios, recortadas de las lecciones en PDF
css/styles.css      tokens de diseño, tema oscuro y claro, responsivo
js/physics.js       funciones puras de física (sin DOM), comentadas
js/plot.js          gráficos de línea en canvas
js/schematic.js     dibujante de circuitos en SVG a partir de datos
js/circuits.js      diagramas de cada módulo descritos como datos
js/sims.js          laboratorios interactivos
js/app.js           navegación, progreso, tema y pauta bloqueada
js/notation.js      símbolos del curso por tema (datos del panel de notación)
js/formulas/*.js    fórmulas con su explicación paso a paso, en cuatro partes
js/panel.js         panel lateral derecho y ventana de explicación
tests/physics.test.js  verifica los números de ejemplos y pautas
tests/formulas.test.js verifica los datos del panel y los ejemplos del formulario
descargas/          formulario en PDF para la prueba
tools/              generador del PDF (build_formulario.py, dump-formulas.js, formulario.tex)
vercel.json         configuración de Vercel (sitio estático, sin build)
```

No hay dependencias ni paso de compilación. MathJax 3.2.2 y las fuentes se cargan desde CDN.

## Desarrollo local

```bash
python -m http.server 8000      # o: npx serve .
# abrir http://localhost:8000
node tests/physics.test.js      # pruebas de los cálculos
node tests/formulas.test.js     # pruebas del formulario y la notación
```

## Publicar en Vercel

1. En Vercel, **Add New → Project** e importar `davidacaceres/electromagnetismo`.
2. Framework preset: **Other**. Build command: vacío. Output directory: `.` (raíz).
3. Deploy. Cada push a `main` vuelve a publicar.

## Convenciones del curso

Corrientes de malla horarias, tensiones de nodo respecto de tierra y referencia pasiva para la potencia (p = v·i > 0 indica que el elemento absorbe). El avance y los borradores de los ejercicios se guardan en `localStorage` del navegador.

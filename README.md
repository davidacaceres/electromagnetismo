# Circuitos E·B

Sitio estático para preparar los certámenes de Electromagnetismo EIE2211 (PUCV), con énfasis en teoría de circuitos. Cada módulo conecta el circuito con la física de campos, resuelve un ejemplo separando planteamiento y álgebra, trae un laboratorio interactivo y termina con un ejercicio tipo certamen cuya pauta se abre solo después de escribir el planteamiento.

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
css/styles.css      tokens de diseño, tema oscuro y claro, responsivo
js/physics.js       funciones puras de física (sin DOM), comentadas
js/plot.js          gráficos de línea en canvas
js/schematic.js     dibujante de circuitos en SVG a partir de datos
js/circuits.js      diagramas de cada módulo descritos como datos
js/sims.js          laboratorios interactivos
js/app.js           navegación, progreso, tema y pauta bloqueada
tests/physics.test.js  verifica los números de ejemplos y pautas
vercel.json         configuración de Vercel (sitio estático, sin build)
```

No hay dependencias ni paso de compilación. MathJax 3.2.2 y las fuentes se cargan desde CDN.

## Desarrollo local

```bash
python -m http.server 8000      # o: npx serve .
# abrir http://localhost:8000
node tests/physics.test.js      # pruebas de los cálculos
```

## Publicar en Vercel

1. En Vercel, **Add New → Project** e importar `davidacaceres/electromagnetismo`.
2. Framework preset: **Other**. Build command: vacío. Output directory: `.` (raíz).
3. Deploy. Cada push a `main` vuelve a publicar.

## Convenciones del curso

Corrientes de malla horarias, tensiones de nodo respecto de tierra y referencia pasiva para la potencia (p = v·i > 0 indica que el elemento absorbe). El avance y los borradores de los ejercicios se guardan en `localStorage` del navegador.

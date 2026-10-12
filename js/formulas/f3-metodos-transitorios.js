/**
 * Formulario, parte 3: mallas, nodos, teoremas de redes y transitorios RC/RL (módulos 2.6 a 2.10).
 */
(function (root) {
  'use strict';
  const R = String.raw;
  const list = (root.Formulas = root.Formulas || []);

  list.push(
    {
      id: 'mallas', g: 'Métodos de análisis', m: ['m26'],
      t: 'Análisis de mallas por inspección',
      f: R`\begin{bmatrix} R_{11} & -R_{12} \\ -R_{21} & R_{22} \end{bmatrix}\begin{bmatrix} I_1 \\ I_2 \end{bmatrix} = \begin{bmatrix} \sum \varepsilon_1 \\ \sum \varepsilon_2 \end{bmatrix}`,
      x: {
        idea: R`<p>En vez de una incógnita por rama, pones una corriente que circula por cada ventana del circuito. La LCK se cumple sola, porque cada corriente de malla entra y sale de cada nodo. Solo queda escribir una LVK por malla.</p>`,
        pasos: [
          R`Dibuja una corriente horaria en cada malla: \(I_1\), \(I_2\).`,
          R`En una resistencia que solo es de la malla 1 pasa \(I_1\). En una compartida pasa \(I_1 - I_2\) (vista desde la malla 1).`,
          R`LVK en la malla 1, recorriéndola en el sentido de \(I_1\): \(\sum\varepsilon_1 - R_{\text{propias}}I_1 - R_{12}(I_1 - I_2) = 0\).`,
          R`Ordena: \((R_{\text{propias}} + R_{12})I_1 - R_{12}I_2 = \sum\varepsilon_1\). El coeficiente de \(I_1\) es \(R_{11}\), la suma de todas las resistencias de la malla 1.`,
          R`Así sale la regla: en la diagonal, la suma de las resistencias de cada malla; fuera de ella, menos la resistencia compartida. A la derecha, la suma de las fem que empujan a favor de la malla.`,
          R`Resuelves el sistema (Cramer o sustitución) y obtienes las corrientes de rama restando corrientes de malla.`,
        ],
        simbolos: [
          [R`I_1,\ I_2`, 'corrientes de malla, horarias [A]'],
          [R`R_{11}`, 'suma de las resistencias de la malla 1 [Ω]'],
          [R`R_{12}`, 'resistencia compartida entre las mallas 1 y 2 [Ω]'],
          [R`\sum\varepsilon_1`, 'fem que empujan en el sentido de \(I_1\), con + [V]'],
        ],
        cuando: R`<p>Circuitos planos con fuentes de tensión. La forma por inspección vale solo sin fuentes dependientes ni fuentes de corriente; con una fuente de corriente usa supermalla.</p>`,
        ejemplo: {
          q: R`Malla 1: fuente de 10 V y 2 Ω. Malla 2: 6 Ω. Compartida: 4 Ω. Calcula las corrientes de malla y la corriente en la de 4 Ω.`,
          pasos: [
            R`Planteamiento: \(R_{11} = 2 + 4 = 6\), \(R_{22} = 6 + 4 = 10\), \(R_{12} = 4\). Sistema: \(6I_1 - 4I_2 = 10\), \(-4I_1 + 10I_2 = 0\).`,
            R`De la segunda, \(I_2 = 0{,}4\,I_1\). En la primera: \(6I_1 - 1{,}6I_1 = 10\), así que \(I_1 = 10/4{,}4\).`,
            R`\(I_1 = 2{,}273\) A, \(I_2 = 0{,}909\) A. Por la compartida: \(I_1 - I_2 = 1{,}364\) A.`,
          ],
          r: R`\(I_1 \approx 2{,}27\) A, \(I_2 \approx 0{,}91\) A, y 1,36 A por la de 4 Ω en el sentido de \(I_1\).`,
        },
        error: R`<p>Poner + en los términos fuera de la diagonal. Con todas las mallas horarias, la resistencia compartida siempre va con signo menos.</p>`,
      },
    },
    {
      id: 'supermalla', g: 'Métodos de análisis', m: ['m26'],
      t: 'Supermalla',
      f: R`I_2 - I_1 = I_s \ \ \text{(fuente en la rama compartida)} \quad+\quad \text{LVK por el contorno de ambas mallas}`,
      x: {
        idea: R`<p>Una fuente de corriente no tiene una tensión conocida, así que no puedes escribir la LVK de una malla que la cruce. Lo que sí sabes es la corriente de esa rama. Entonces cambias una LVK por esa condición, y la otra ecuación es una LVK por el contorno que rodea a la fuente.</p>`,
        pasos: [
          R`Identifica la fuente de corriente que está entre dos mallas.`,
          R`Escribe la restricción: la corriente de la rama es la diferencia de las corrientes de malla, con el signo según el sentido de la fuente.`,
          R`Escribe una LVK por el camino exterior que rodea ambas mallas sin pasar por la fuente de corriente.`,
          R`Resuelve las dos ecuaciones juntas.`,
        ],
        simbolos: [
          [R`I_s`, 'corriente de la fuente [A]'],
        ],
        cuando: R`<p>Fuente de corriente compartida por dos mallas. Si la fuente está en una rama que pertenece a una sola malla, esa corriente de malla queda conocida directamente.</p>`,
        ejemplo: {
          q: R`Malla 1 (izquierda): fuente de 12 V subiendo y 2 Ω. Malla 2 (derecha): 4 Ω. En la rama vertical compartida hay una fuente de 2 A hacia arriba. Calcula \(I_1\) e \(I_2\).`,
          pasos: [
            R`Restricción: en la rama compartida, \(I_1\) horaria baja y \(I_2\) horaria sube. Hacia arriba pasa \(I_2 - I_1 = 2\).`,
            R`LVK por el contorno: \(+12 - 2I_1 - 4I_2 = 0\).`,
            R`Reemplaza \(I_2 = I_1 + 2\): \(12 - 2I_1 - 4I_1 - 8 = 0\), \(I_1 = 4/6\).`,
          ],
          r: R`\(I_1 = 0{,}667\) A e \(I_2 = 2{,}667\) A.`,
        },
        error: R`<p>Escribir la LVK de una malla pasando por la fuente de corriente como si su tensión fuera cero. La tensión en una fuente de corriente es una incógnita.</p>`,
      },
    },
    {
      id: 'nodos', g: 'Métodos de análisis', m: ['m27'],
      t: 'Análisis de nodos',
      f: R`\sum_j \frac{V_i - V_j}{R_{ij}} = I_{s,\text{entrando}} \qquad\Longleftrightarrow\qquad \sum_j G_{ij}(V_i - V_j) = I_{s,\text{entrando}}`,
      x: {
        idea: R`<p>Eliges un nodo como tierra (0 V) y tomas como incógnitas las tensiones de los demás. Con la ley de Ohm, cada corriente de rama queda escrita con esas tensiones. Después aplicas la LCK en cada nodo: lo que sale por las resistencias es lo que entra por las fuentes de corriente.</p>`,
        pasos: [
          R`Marca la tierra y nombra \(V_1, V_2, \dots\) los demás nodos.`,
          R`Por una resistencia entre \(i\) y \(j\), la corriente que sale del nodo \(i\) es \((V_i - V_j)/R_{ij}\). Si \(V_i > V_j\), sale; si no, el signo lo corrige solo.`,
          R`Si la resistencia va a una fuente de tensión, usa el potencial que impone la fuente, por ejemplo \((V_1 - 20)/R\).`,
          R`LCK: suma de corrientes que salen por resistencias = corriente de fuentes que entra al nodo.`,
          R`Una ecuación por nodo, un sistema con tantas incógnitas como nodos.`,
        ],
        simbolos: [
          [R`V_i`, 'tensión del nodo i respecto de tierra [V]'],
          [R`R_{ij},\ G_{ij}`, 'resistencia o conductancia entre i y j'],
          [R`I_{s,\text{entrando}}`, 'corriente de fuentes que entra al nodo [A]'],
        ],
        cuando: R`<p>Cuando hay pocos nodos o muchas fuentes de corriente. Para una fuente de tensión entre dos nodos sin tierra, usa supernodo.</p>`,
        ejemplo: {
          q: R`Un nodo a se conecta a tierra por 6 Ω y a una fuente de 12 V por 4 Ω. Además le entra una fuente de 0,5 A. Calcula \(V_a\).`,
          pasos: [
            R`Planteamiento: corrientes que salen de a: \(V_a/6\) a tierra y \((V_a - 12)/4\) hacia la fuente. LCK: \(\dfrac{V_a}{6} + \dfrac{V_a - 12}{4} = 0{,}5\).`,
            R`\(V_a\left(\tfrac16 + \tfrac14\right) = 0{,}5 + 3\), o sea \(V_a\cdot\tfrac{5}{12} = 3{,}5\).`,
          ],
          r: R`\(V_a = 8{,}4\) V.`,
        },
        error: R`<p>Escribir unas corrientes saliendo y otras entrando en el mismo nodo sin ajustar signos. Escribe todas saliendo; las fuentes de corriente van al otro lado.</p>`,
      },
    },
    {
      id: 'supernodo', g: 'Métodos de análisis', m: ['m27'],
      t: 'Supernodo',
      f: R`V_1 - V_2 = \varepsilon \quad+\quad \text{LCK de la superficie que encierra los nodos 1 y 2}`,
      x: {
        idea: R`<p>Una fuente de tensión entre dos nodos no deja escribir su corriente con Ohm. Lo que sí sabes es la diferencia de potencial. Encierras los dos nodos y la fuente en una sola superficie y escribes una LCK para el conjunto.</p>`,
        pasos: [
          R`Escribe la restricción de la fuente: \(V_+ - V_- = \varepsilon\).`,
          R`Dibuja una superficie que encierre los dos nodos y la fuente. La corriente de la fuente queda adentro y no aparece.`,
          R`LCK en esa superficie con todas las demás ramas que la cruzan.`,
          R`Las dos ecuaciones resuelven \(V_1\) y \(V_2\).`,
        ],
        simbolos: [
          [R`\varepsilon`, 'fem de la fuente entre los nodos, + en el nodo 1 [V]'],
        ],
        cuando: R`<p>Fuente de tensión entre dos nodos que no son tierra. Si un extremo es tierra, ese nodo ya es conocido y no hace falta supernodo.</p>`,
        ejemplo: {
          q: R`Fuente de 6 V entre los nodos 1 (+) y 2. El nodo 1 va a tierra por 2 Ω, el nodo 2 por 4 Ω y al supernodo le entra una fuente de 4,5 A. Calcula \(V_1\) y \(V_2\).`,
          pasos: [
            R`Restricción: \(V_1 - V_2 = 6\).`,
            R`LCK del supernodo: \(\dfrac{V_1}{2} + \dfrac{V_2}{4} = 4{,}5\).`,
            R`Con \(V_2 = V_1 - 6\) y multiplicando por 4: \(2V_1 + V_1 - 6 = 18\), \(V_1 = 8\).`,
          ],
          r: R`\(V_1 = 8\) V y \(V_2 = 2\) V.`,
        },
        error: R`<p>Escribir la LCK de cada nodo por separado olvidando la corriente de la fuente, que es desconocida. Esa corriente solo desaparece si encierras los dos nodos juntos.</p>`,
      },
    },
    {
      id: 'superposicion', g: 'Teoremas de redes', m: ['m28'],
      t: 'Superposición',
      f: R`x = x' + x'' + \dots \qquad x^{(k)}:\ \text{respuesta con solo la fuente } k \text{ encendida}`,
      x: {
        idea: R`<p>Las ecuaciones del circuito son lineales porque \(\vec J = \sigma\vec E\) es lineal. Entonces la respuesta a varias fuentes juntas es la suma de las respuestas a cada una por separado.</p>`,
        pasos: [
          R`Deja encendida una sola fuente independiente.`,
          R`Apaga las demás: una fuente de tensión apagada es un cortocircuito (0 V); una de corriente apagada es un circuito abierto (0 A). Las dependientes se quedan.`,
          R`Calcula la tensión o corriente que buscas en ese circuito más simple.`,
          R`Repite con cada fuente y suma con signo.`,
        ],
        simbolos: [
          [R`x'`, 'aporte de la primera fuente a la variable buscada'],
        ],
        cuando: R`<p>Para tensiones y corrientes. No para potencias: \(P\) depende del cuadrado de la corriente y los cuadrados no se suman.</p>`,
        ejemplo: {
          q: R`Nodo V conectado a 10 V por 5 Ω, a 20 V por 5 Ω y a tierra por 10 Ω. Calcula V por superposición.`,
          pasos: [
            R`Solo 10 V: la de 20 V es un corto, quedan 5 Ω y 10 Ω en paralelo: \(10/3\ \Omega\). Divisor: \(V' = 10\cdot\dfrac{10/3}{5 + 10/3} = 4\) V.`,
            R`Solo 20 V: por simetría, \(V'' = 20\cdot\dfrac{10/3}{5 + 10/3} = 8\) V.`,
            R`Comprobación por nodos: \(\dfrac{V - 10}{5} + \dfrac{V - 20}{5} + \dfrac{V}{10} = 0\) da \(5V = 60\).`,
          ],
          r: R`\(V = 4 + 8 = 12\) V.`,
        },
        error: R`<p>Apagar una fuente de corriente poniéndola en cortocircuito. Apagada significa que no aporta corriente: queda abierta.</p>`,
      },
    },
    {
      id: 'thevenin', g: 'Teoremas de redes', m: ['m28', 'm29', 'm210'],
      t: 'Equivalentes de Thévenin y Norton',
      f: R`V_{th} = V_{ab}\big|_{\text{abierto}} \qquad I_N = I_{ab}\big|_{\text{corto}} \qquad R_{th} = \frac{V_{th}}{I_N} = R_{ab}\big|_{\text{fuentes indep. apagadas}}`,
      x: {
        idea: R`<p>Visto desde dos terminales, cualquier circuito lineal se comporta como una fuente con una resistencia en serie (Thévenin) o una fuente de corriente con una resistencia en paralelo (Norton). Es como reemplazar toda la red eléctrica de una casa por "un enchufe con su resistencia interna".</p>`,
        pasos: [
          R`\(V_{th}\): deja los terminales a–b abiertos y calcula la tensión entre ellos. Sin carga, por los terminales no circula corriente.`,
          R`\(I_N\): une a y b con un cable y calcula la corriente por ese cable.`,
          R`\(R_{th}\): apaga las fuentes independientes y calcula la resistencia vista desde a–b. Si hay dependientes, usa \(R_{th} = V_{th}/I_N\) o una fuente de prueba.`,
          R`Los dos equivalentes se relacionan como una batería real: \(V_{th} = I_N R_{th}\).`,
        ],
        simbolos: [
          [R`V_{th}`, 'tensión en circuito abierto [V]'],
          [R`I_N`, 'corriente en cortocircuito [A]'],
          [R`R_{th}`, 'resistencia de Thévenin [Ω]'],
        ],
        cuando: R`<p>Cuando te interesa una sola carga que cambia, o cuando quieres la máxima potencia (\(R_L = R_{th}\), \(P_{\max} = V_{th}^2/4R_{th}\)). En transitorios, la \(R\) de \(\tau\) es la \(R_{th}\) vista desde el capacitor o el inductor.</p>`,
        ejemplo: {
          q: R`Fuente de 12 V, 4 Ω en serie hasta el nodo a, y 12 Ω de a a tierra (b). Calcula el equivalente y la máxima potencia que puede entregar.`,
          pasos: [
            R`\(V_{th}\): divisor de tensión, \(12\cdot\dfrac{12}{4 + 12} = 9\) V.`,
            R`\(R_{th}\): fuente en corto, se ven 4 Ω y 12 Ω en paralelo: \(\dfrac{4\cdot 12}{16} = 3\ \Omega\).`,
            R`\(I_N = 9/3 = 3\) A (en corto, por la de 12 Ω no pasa nada y \(12/4 = 3\) A: coincide).`,
            R`\(P_{\max} = 81/(4\cdot 3)\).`,
          ],
          r: R`\(V_{th} = 9\) V, \(R_{th} = 3\ \Omega\), \(I_N = 3\) A y \(P_{\max} = 6{,}75\) W con \(R_L = 3\ \Omega\).`,
        },
        error: R`<p>Calcular \(V_{th}\) con la carga conectada. La tensión de Thévenin es la de terminales abiertos: primero saca la carga.</p>`,
      },
    },
    {
      id: 'capacitor-iv', g: 'Transitorios', m: ['m29'],
      t: 'Relación tensión-corriente del capacitor',
      f: R`i_C = C\,\frac{dv_C}{dt} \qquad v_C(0^+) = v_C(0^-)`,
      x: {
        idea: R`<p>Un capacitor no deja pasar carga de una placa a la otra: la acumula. La corriente que llega es la rapidez con que crece la carga, y como \(Q = Cv\), es la rapidez con que crece la tensión. Para cambiar la tensión de golpe haría falta una corriente infinita, por eso la tensión de un capacitor no salta.</p><p>Es como llenar un estanque: el nivel (tensión) sube a la velocidad que entra el agua (corriente) y no puede pasar de un valor a otro en un instante.</p>`,
        pasos: [
          R`La carga en las placas es \(Q = C\,v_C\) (definición de capacitancia, Cap. 4).`,
          R`La corriente que llega a la placa positiva es \(i_C = dQ/dt\) (continuidad).`,
          R`Con \(C\) constante: \(i_C = C\,dv_C/dt\).`,
          R`Si \(v_C\) saltara en un tiempo cero, \(dv_C/dt\) sería infinita y la corriente también. Con resistencias finitas eso no pasa: \(v_C(0^+) = v_C(0^-)\).`,
          R`En régimen DC, \(dv_C/dt = 0\) y \(i_C = 0\): el capacitor es un circuito abierto.`,
        ],
        simbolos: [
          [R`v_C`, 'tensión del capacitor [V]'],
          [R`i_C`, 'corriente que entra por el terminal + [A]'],
          [R`C`, 'capacitancia [F]'],
          [R`0^-,\ 0^+`, 'justo antes y justo después de mover el interruptor'],
        ],
        cuando: R`<p>Al plantear la ecuación diferencial de un RC y al buscar las condiciones iniciales: \(v_C(0^+)\) se saca del circuito en \(0^-\).</p>`,
        ejemplo: {
          q: R`La tensión de un capacitor de 10 µF sube a razón de 500 V/s. ¿Qué corriente recibe?`,
          pasos: [
            R`Planteamiento: \(i_C = C\,dv_C/dt\).`,
            R`\(i_C = 10\times10^{-6}\cdot 500\).`,
          ],
          r: R`\(i_C = 5\) mA.`,
        },
        error: R`<p>Suponer que la corriente del capacitor tampoco salta. La que no salta es la tensión; la corriente puede cambiar de golpe.</p>`,
      },
    },
    {
      id: 'primer-orden', g: 'Transitorios', m: ['m29', 'm210'],
      t: 'Respuesta de primer orden (RC y RL)',
      f: R`x(t) = x(\infty) + \left[x(0^+) - x(\infty)\right]e^{-t/\tau} \qquad \tau = R_{th}C \quad\text{o}\quad \tau = \frac{L}{R_{th}}`,
      x: {
        idea: R`<p>Todo circuito con un solo capacitor o un solo inductor y fuentes DC va de un valor inicial a un valor final siguiendo una exponencial. Con tres datos tienes la respuesta completa: dónde parte, dónde termina y qué tan rápido.</p>`,
        pasos: [
          R`Para un RC serie cargándose con \(V\): LVK da \(V - Ri - v_C = 0\) con \(i = C\,dv_C/dt\). Queda \(RC\,\dfrac{dv_C}{dt} + v_C = V\).`,
          R`La solución es \(v_C(t) = V + Ae^{-t/RC}\). El término constante es el valor final y la exponencial se apaga.`,
          R`La constante \(A\) sale de la condición inicial: en \(t = 0^+\), \(v_C(0^+) = V + A\), así que \(A = v_C(0^+) - V\).`,
          R`Con un inductor pasa lo mismo con \(i_L\) y \(L\,di/dt + R\,i = V\), y \(\tau = L/R\).`,
          R`Receta: \(x(0^+)\) del circuito antes del cambio (lo que no salta); \(x(\infty)\) con C abierto o L en corto; \(\tau\) con la \(R_{th}\) vista desde el elemento.`,
        ],
        simbolos: [
          [R`x(0^+)`, 'valor justo después del cambio'],
          [R`x(\infty)`, 'valor final en régimen permanente'],
          [R`\tau`, 'constante de tiempo [s]'],
        ],
        cuando: R`<p>Cualquier variable de un circuito de primer orden con fuentes constantes: tensiones, corrientes de cualquier rama. Después de \(5\tau\) la diferencia con el valor final es menor que 1 %.</p>`,
        ejemplo: {
          q: R`RC con \(R = 2\) kΩ, \(C = 50\) µF y una fuente de 10 V. El capacitor parte descargado. Calcula \(\tau\), \(v_C(\tau)\) y \(v_C(2\tau)\).`,
          pasos: [
            R`Planteamiento: \(v_C(0^+) = 0\), \(v_C(\infty) = 10\) V, \(\tau = RC\).`,
            R`\(\tau = 2000\cdot 50\times10^{-6} = 0{,}1\) s.`,
            R`\(v_C(t) = 10(1 - e^{-t/0{,}1})\). En \(\tau\): \(10(1 - e^{-1})\); en \(2\tau\): \(10(1 - e^{-2})\).`,
          ],
          r: R`\(\tau = 0{,}1\) s, \(v_C(\tau) = 6{,}32\) V y \(v_C(2\tau) = 8{,}65\) V.`,
        },
        error: R`<p>Usar la resistencia de la fuente o una resistencia cualquiera para \(\tau\). Es la \(R_{th}\) vista desde los terminales del capacitor o del inductor, con las fuentes apagadas.</p>`,
      },
    },
    {
      id: 'energia-capacitor', g: 'Transitorios', m: ['m29', 'm212'],
      t: 'Energía almacenada en un capacitor',
      f: R`W = \tfrac12 C v_C^2 = \tfrac12 Q v_C = \frac{Q^2}{2C}`,
      x: {
        idea: R`<p>Para cargar un capacitor hay que llevar carga de una placa a la otra contra una tensión que va creciendo. Ese trabajo queda guardado en el campo eléctrico entre las placas y se puede recuperar al descargarlo.</p>`,
        pasos: [
          R`Cuando la placa tiene carga \(q\), la tensión es \(v = q/C\).`,
          R`Llevar otra carga \(dq\) cuesta \(dW = v\,dq = (q/C)\,dq\).`,
          R`Integra desde 0 hasta \(Q\): \(W = \int_0^Q \dfrac{q}{C}dq = \dfrac{Q^2}{2C}\).`,
          R`Con \(Q = Cv\) aparecen las otras dos formas: \(\tfrac12 Cv^2\) y \(\tfrac12 Qv\). El Cap. 4 la escribe \(U = \mathcal E_E\).`,
        ],
        simbolos: [
          [R`W`, 'energía almacenada [J]'],
          [R`Q`, 'carga de la placa positiva [C]'],
        ],
        cuando: R`<p>En balances de energía de transitorios RC. Al cargar un capacitor desde cero con una fuente fija, la fuente entrega \(CV^2\): la mitad queda en el capacitor y la otra mitad se disipa en la resistencia, sin importar cuánto valga R.</p>`,
        ejemplo: {
          q: R`Un capacitor de 470 µF cargado a 25 V. ¿Cuánta energía guarda?`,
          pasos: [
            R`Planteamiento: \(W = \tfrac12 Cv^2\).`,
            R`\(W = 0{,}5\cdot 470\times10^{-6}\cdot 625\).`,
          ],
          r: R`\(W \approx 0{,}147\) J.`,
        },
        error: R`<p>Olvidar el ½, o usar \(QV\). El factor ½ aparece porque la tensión crece de 0 a V mientras cargas: en promedio cada carga sube la mitad.</p>`,
      },
    },
    {
      id: 'inductor-iv', g: 'Transitorios', m: ['m210'],
      t: 'Relación tensión-corriente del inductor',
      f: R`v_L = \frac{d\lambda}{dt} = L\,\frac{di_L}{dt}, \quad \lambda = N\Phi = L\,i_L \qquad i_L(0^+) = i_L(0^-)`,
      x: {
        idea: R`<p>La corriente de una bobina crea un flujo magnético. Si la corriente cambia, el flujo cambia y por la ley de Faraday aparece una tensión que se opone al cambio (Lenz). Por eso la corriente de un inductor no puede saltar: haría falta una tensión infinita.</p><p>Es como un carro de supermercado cargado: cuesta ponerlo en marcha y cuesta frenarlo. La corriente es su velocidad.</p>`,
        pasos: [
          R`Faraday (Cap. 7): en una bobina de \(N\) vueltas, la fem inducida es \(N\,d\Phi/dt\) en magnitud.`,
          R`Si el núcleo es lineal, el flujo enlazado es proporcional a la corriente: \(\lambda = N\Phi = L\,i\). Eso define la inductancia \(L\).`,
          R`Con referencia pasiva, la tensión en terminales es \(v_L = d\lambda/dt = L\,di_L/dt\).`,
          R`Si \(i_L\) saltara, \(di_L/dt\) sería infinita y \(v_L\) también: \(i_L(0^+) = i_L(0^-)\).`,
          R`En régimen DC, \(di_L/dt = 0\) y \(v_L = 0\): el inductor es un cortocircuito.`,
        ],
        simbolos: [
          [R`L`, 'inductancia [H]'],
          [R`\lambda`, 'flujo enlazado \(N\Phi\) [Wb]'],
          [R`v_L,\ i_L`, 'tensión y corriente del inductor, referencia pasiva'],
        ],
        cuando: R`<p>En transitorios RL. Ojo: el campo inducido no es conservativo, pero en circuitos se mantiene la LVK modelando el efecto como la caída \(L\,di/dt\) en la bobina.</p>`,
        ejemplo: {
          q: R`Por una bobina de 50 mH la corriente crece a razón de 200 A/s. ¿Qué tensión aparece en sus terminales?`,
          pasos: [
            R`Planteamiento: \(v_L = L\,di_L/dt\).`,
            R`\(v_L = 0{,}05\cdot 200\).`,
          ],
          r: R`\(v_L = 10\) V.`,
        },
        error: R`<p>Abrir un circuito con un inductor y suponer que la corriente se corta. La corriente sigue en \(0^+\) y busca un camino: si no hay, el \(di/dt\) enorme produce la chispa.</p>`,
      },
    },
    {
      id: 'rl', g: 'Transitorios', m: ['m210'],
      t: 'Transitorio RL',
      f: R`i_L(t) = i_L(\infty) + \left[i_L(0^+) - i_L(\infty)\right]e^{-t/\tau} \qquad \tau = \frac{L}{R_{th}}`,
      x: {
        idea: R`<p>Es la misma exponencial del RC, pero ahora la variable que no salta es la corriente. Más resistencia acorta el transitorio, al revés que en el RC.</p>`,
        pasos: [
          R`Fuente \(V\), resistencia \(R\) e inductor en serie. LVK: \(V - Ri - L\,di/dt = 0\).`,
          R`Ordena: \(\dfrac{L}{R}\dfrac{di}{dt} + i = \dfrac{V}{R}\). El coeficiente de la derivada es \(\tau = L/R\).`,
          R`Valor final: \(di/dt = 0\), así que \(i(\infty) = V/R\).`,
          R`Con \(i(0^+) = 0\): \(i(t) = \dfrac{V}{R}(1 - e^{-t/\tau})\).`,
          R`¿Por qué \(\tau = L/R\) y no \(RL\)? Con más R la corriente final es menor y se alcanza antes; la inercia de la bobina pesa menos.`,
        ],
        simbolos: [
          [R`\tau`, 'constante de tiempo \(L/R_{th}\) [s]'],
        ],
        cuando: R`<p>Cualquier circuito con un solo inductor y fuentes DC. \(i_L(0^+)\) sale del circuito en \(0^-\) (en régimen permanente, el inductor es un cable).</p>`,
        ejemplo: {
          q: R`Bobina de 0,5 H, resistencia de 10 Ω y fuente de 20 V. Parte sin corriente. Calcula \(\tau\), \(i(\infty)\) e \(i(\tau)\).`,
          pasos: [
            R`\(\tau = 0{,}5/10 = 0{,}05\) s. \(i(\infty) = 20/10 = 2\) A.`,
            R`\(i(\tau) = 2(1 - e^{-1})\).`,
          ],
          r: R`\(\tau = 50\) ms, \(i(\infty) = 2\) A, \(i(\tau) = 1{,}26\) A.`,
        },
        error: R`<p>Escribir \(\tau = RL\) por analogía con \(RC\). Revisa las unidades: H/Ω da segundos; H·Ω no.</p>`,
      },
    },
    {
      id: 'energia-inductor', g: 'Transitorios', m: ['m210'],
      t: 'Energía almacenada en un inductor',
      f: R`W = \tfrac12 L\,i_L^2 \qquad w_m = \frac{B^2}{2\mu}`,
      x: {
        idea: R`<p>Para establecer la corriente en una bobina hay que vencer la tensión inducida. Ese trabajo queda guardado en el campo magnético. Cuando se corta la corriente, la energía sale: en una resistencia como calor, o en el aire como chispa.</p>`,
        pasos: [
          R`La potencia que recibe el inductor es \(p = v_L i_L = L\,i_L\,di_L/dt\).`,
          R`La energía es la integral de la potencia: \(W = \int p\,dt = \int_0^{I} L\,i\,di\).`,
          R`Resultado: \(W = \tfrac12 L I^2\). El Cap. 7 la escribe \(\mathcal E_M\); el formulario, \(W_m\).`,
          R`Repartida en el volumen, la densidad de energía es \(B^2/(2\mu)\).`,
        ],
        simbolos: [
          [R`W`, 'energía [J]'],
          [R`w_m`, 'densidad de energía magnética [J/m³]'],
        ],
        cuando: R`<p>En balances de energía de la descarga de un inductor: toda la energía inicial termina en las resistencias del circuito de descarga.</p>`,
        ejemplo: {
          q: R`Una bobina de 0,2 H lleva 3 A. ¿Cuánta energía guarda?`,
          pasos: [
            R`Planteamiento: \(W = \tfrac12 L i^2\).`,
            R`\(W = 0{,}5\cdot 0{,}2\cdot 9\).`,
          ],
          r: R`\(W = 0{,}9\) J.`,
        },
        error: R`<p>Pensar que la energía depende de la tensión de la bobina. En régimen DC la tensión es cero y la bobina igual guarda energía: depende de la corriente.</p>`,
      },
    },
  );
})(typeof window !== 'undefined' ? window : globalThis);

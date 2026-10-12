/**
 * Formulario, parte 2: fuentes, leyes de Kirchhoff y redes equivalentes (módulos 2.2 a 2.5).
 */
(function (root) {
  'use strict';
  const R = String.raw;
  const list = (root.Formulas = root.Formulas || []);

  list.push(
    {
      id: 'fem', g: 'Fuentes', m: ['m22'],
      t: 'Fuerza electromotriz',
      f: R`\varepsilon = \frac{W_{\text{no est}}}{q} = \int_{-}^{+} \vec f_s\cdot d\vec l \qquad [\mathrm{V}]`,
      x: {
        idea: R`<p>El campo electrostático es conservativo: en una vuelta completa al circuito no entrega energía neta. Entonces algo tiene que reponer lo que se pierde en las resistencias. En una pila es una fuerza química que empuja las cargas positivas del borne − al +, cuesta arriba en potencial. La fem es el trabajo que hace esa fuerza por cada coulomb.</p><p>En una montaña rusa, la gravedad sube y baja el carro sin darle energía neta. La cadena que lo sube al inicio es la fem.</p>`,
        pasos: [
          R`El campo de las cargas cumple \(\oint \vec E_{\text{est}}\cdot d\vec l = 0\). No puede mantener una corriente en un lazo con resistencia.`,
          R`Dentro de la fuente actúa además una fuerza no electrostática. Por unidad de carga la llamamos \(\vec f_s\).`,
          R`El trabajo que hace sobre una carga \(q\) al llevarla de − a + es \(W_{\text{no est}} = q\int_-^+ \vec f_s\cdot d\vec l\). "est" abrevia electrostático, así que \(W_{\text{no est}}\) es el trabajo de la fuerza química.`,
          R`Por unidad de carga, eso es la fem: \(\varepsilon = W_{\text{no est}}/q\). Se mide en J/C, que es el volt.`,
          R`En circuito abierto no circula corriente: dentro de la fuente las dos fuerzas se equilibran, \(\vec f_s = -\vec E\), y la fem coincide con \(V_+ - V_-\).`,
        ],
        simbolos: [
          [R`\varepsilon`, 'fem [V]. El libro de ejercicios usa ξ'],
          [R`W_{\text{no est}}`, 'trabajo de la fuerza no electrostática [J]'],
          [R`\vec f_s`, 'fuerza no electrostática por unidad de carga [N/C]'],
        ],
        cuando: R`<p>La fem es la "subida" de potencial que pones al recorrer una fuente de − a + en la LVK. Pese al nombre no es una fuerza: es energía por unidad de carga.</p>`,
        ejemplo: {
          q: R`Una batería hace 54 J de trabajo químico para llevar 4,5 C de su borne − al +. ¿Cuál es su fem?`,
          pasos: [
            R`Planteamiento: \(\varepsilon = W_{\text{no est}}/q\).`,
            R`\(\varepsilon = 54/4{,}5\).`,
          ],
          r: R`\(\varepsilon = 12\) V.`,
        },
        error: R`<p>Decir que la fem es una diferencia de potencial. Coinciden en número solo en circuito abierto. El potencial viene de un campo conservativo; la fem, de una fuerza que no lo es.</p>`,
      },
    },
    {
      id: 'bateria-real', g: 'Fuentes', m: ['m22', 'm24'],
      t: 'Tensión en bornes de una fuente real',
      f: R`V_{ab} = \varepsilon - I\,r\ \ \text{(entrega)} \qquad V_{ab} = \varepsilon + I\,r\ \ \text{(se carga)} \qquad I = \frac{\varepsilon}{r + R}`,
      x: {
        idea: R`<p>Una batería real es una fem ideal en serie con una resistencia interna \(r\). Cuando entrega corriente, parte de la subida se pierde dentro de ella y en los bornes ves menos que \(\varepsilon\). Cuando la cargas desde afuera, tienes que empujar la corriente contra la fem y además vencer \(r\): en los bornes ves más.</p>`,
        pasos: [
          R`Recorre la batería por dentro del borne b (−) al a (+) en el sentido de la corriente: subes \(+\varepsilon\) y bajas \(-Ir\). Entonces \(V_{ab} = \varepsilon - Ir\).`,
          R`Si un circuito externo obliga a la corriente a entrar por +, al recorrerla de b a a vas contra la corriente en \(r\): subes \(+Ir\). Queda \(V_{ab} = \varepsilon + Ir\).`,
          R`Con una carga \(R\) conectada, la LVK del lazo es \(\varepsilon - Ir - IR = 0\), así que \(I = \varepsilon/(r + R)\).`,
          R`Balance: \(\varepsilon I = I^2 r + I^2 R\). La fuente entrega \(\varepsilon I\), una parte se calienta adentro y el resto llega a la carga.`,
        ],
        simbolos: [
          [R`r`, 'resistencia interna [Ω]'],
          [R`R`, 'resistencia de carga [Ω]'],
          [R`V_{ab}`, 'tensión en bornes, a es el +, b es el − [V]'],
        ],
        cuando: R`<p>Siempre que el enunciado dé \(r\). Casos límite: en circuito abierto \(I = 0\) y \(V_{ab} = \varepsilon\); en cortocircuito \(R = 0\), \(I_{cc} = \varepsilon/r\) y \(V_{ab} = 0\).</p>`,
        ejemplo: {
          q: R`Una batería de 12 V con \(r = 0{,}5\ \Omega\). Calcula \(V_{ab}\) cuando entrega 4 A y cuando la cargan con 4 A.`,
          pasos: [
            R`Planteamiento: entregando, \(V_{ab} = \varepsilon - Ir\); cargándose, \(V_{ab} = \varepsilon + Ir\).`,
            R`\(Ir = 4\cdot 0{,}5 = 2\) V.`,
          ],
          r: R`Entregando: 10 V. Cargándose: 14 V.`,
        },
        error: R`<p>Usar siempre \(\varepsilon - Ir\). Antes de escribir, mira por qué borne entra la corriente: si entra por +, la fuente se está cargando.</p>`,
      },
    },
    {
      id: 'max-potencia-bateria', g: 'Fuentes', m: ['m22', 'm28'],
      t: 'Potencia en la carga y máxima transferencia',
      f: R`P_R = \frac{\varepsilon^2 R}{(r + R)^2} \qquad P_{R,\max} = \frac{\varepsilon^2}{4r}\ \ \text{en}\ R = r`,
      x: {
        idea: R`<p>Si la carga es muy chica, circula mucha corriente pero casi no cae tensión en ella. Si es muy grande, cae casi toda la tensión pero no pasa corriente. En los dos extremos la potencia en la carga es casi cero, así que hay un máximo entre medio. Ese máximo está cuando la carga es igual a la resistencia interna.</p>`,
        pasos: [
          R`Con \(I = \varepsilon/(r + R)\), la potencia en la carga es \(P_R = I^2R = \varepsilon^2 R/(r + R)^2\).`,
          R`Deriva respecto de \(R\) e iguala a cero: \(\dfrac{dP_R}{dR} = \varepsilon^2\dfrac{(r + R)^2 - 2R(r + R)}{(r + R)^4} = 0\).`,
          R`El numerador da \((r + R) - 2R = 0\), o sea \(R = r\).`,
          R`Reemplaza \(R = r\): \(P_{R,\max} = \varepsilon^2 r/(2r)^2 = \varepsilon^2/(4r)\).`,
          R`En ese punto la mitad de la potencia de la fuente se pierde en \(r\): la eficiencia es 50 %.`,
        ],
        simbolos: [
          [R`P_R`, 'potencia en la carga [W]'],
          [R`r`, 'resistencia interna (o \(R_{th}\) en el módulo 2.8) [Ω]'],
        ],
        cuando: R`<p>Cuando preguntan qué carga recibe la mayor potencia. En el módulo 2.8 es lo mismo con el equivalente de Thévenin: \(R_L = R_{th}\) y \(P_{\max} = V_{th}^2/(4R_{th})\).</p>`,
        ejemplo: {
          q: R`Fuente de 12 V con \(r = 2\ \Omega\). ¿Qué carga recibe la máxima potencia y cuánto? ¿Cuánto recibe una carga de 4 Ω?`,
          pasos: [
            R`Planteamiento: máximo con \(R = r = 2\ \Omega\), \(P_{\max} = \varepsilon^2/(4r)\).`,
            R`\(P_{\max} = 144/8 = 18\) W.`,
            R`Con 4 Ω: \(I = 12/(2 + 4) = 2\) A y \(P = 2^2\cdot 4 = 16\) W, menos que 18 W.`,
          ],
          r: R`\(R = 2\ \Omega\) con 18 W; con 4 Ω recibe 16 W.`,
        },
        error: R`<p>Pensar que máxima potencia significa máxima eficiencia. Con \(R = r\) se pierde la mitad. Las redes eléctricas trabajan con \(R \gg r\) para perder poco.</p>`,
      },
    },
    {
      id: 'lck', g: 'Leyes de Kirchhoff', m: ['m23', 'm27'],
      t: 'Ley de corrientes de Kirchhoff (LCK)',
      f: R`\sum I_{\text{entran}} = \sum I_{\text{salen}} \qquad\Longleftrightarrow\qquad \sum_k I_k = 0`,
      x: {
        idea: R`<p>Un nodo no guarda carga. Todo lo que llega por unos cables tiene que irse por otros, igual que el agua en una unión de cañerías.</p>`,
        pasos: [
          R`Rodea el nodo con una superficie cerrada pequeña.`,
          R`Por continuidad, \(\oint \vec J\cdot d\vec s = -dQ_i/dt\).`,
          R`En corriente continua la carga del nodo no cambia: \(dQ_i/dt = 0\). Entonces la corriente neta que sale es cero.`,
          R`La integral se reduce a sumar la corriente de cada cable que cruza la superficie, con + si sale y − si entra: \(\sum_k I_k = 0\).`,
        ],
        simbolos: [
          [R`I_k`, 'corriente del cable k, con signo según entre o salga [A]'],
        ],
        cuando: R`<p>En cada nodo, y también en una superficie que encierre varios nodos (supernodo). Con \(n\) nodos hay \(n - 1\) ecuaciones independientes: la última es combinación de las otras.</p>`,
        ejemplo: {
          q: R`A un nodo llegan 3 A y 2 A, y por un tercer cable salen 4 A. ¿Cuánto vale la corriente \(I_x\) del cuarto cable, supuesta saliendo?`,
          pasos: [
            R`Planteamiento: entran = salen. \(3 + 2 = 4 + I_x\).`,
            R`\(I_x = 1\) A.`,
          ],
          r: R`\(I_x = 1\) A, y como dio positiva, de verdad sale.`,
        },
        error: R`<p>Cambiar el sentido de una corriente a mitad del ejercicio. Elige un sentido para cada incógnita, respétalo en todas las ecuaciones y al final interpreta el signo.</p>`,
      },
    },
    {
      id: 'divisor-corriente', g: 'Leyes de Kirchhoff', m: ['m23', 'm25'],
      t: 'Divisor de corriente',
      f: R`I_1 = I\,\frac{R_2}{R_1 + R_2} \qquad I_2 = I\,\frac{R_1}{R_1 + R_2}`,
      x: {
        idea: R`<p>Dos resistencias en paralelo tienen la misma tensión. La corriente se reparte en proporción inversa a la resistencia: pasa más por el camino fácil. Por eso en el numerador de \(I_1\) va la otra resistencia, \(R_2\).</p>`,
        pasos: [
          R`En paralelo, la tensión es la misma: \(V = I_1R_1 = I_2R_2\).`,
          R`Por LCK, \(I = I_1 + I_2\).`,
          R`La tensión común es \(V = I\,R_{eq} = I\dfrac{R_1R_2}{R_1 + R_2}\).`,
          R`Entonces \(I_1 = V/R_1 = I\dfrac{R_2}{R_1 + R_2}\), y lo mismo para \(I_2\).`,
        ],
        simbolos: [
          [R`I`, 'corriente total que llega al par en paralelo [A]'],
          [R`I_1,\ I_2`, 'corrientes por cada rama [A]'],
        ],
        cuando: R`<p>Solo con dos ramas en paralelo y sin fuentes dentro de ellas. Con más ramas, usa conductancias: \(I_k = I\,G_k/\sum G\).</p>`,
        ejemplo: {
          q: R`Llegan 6 A a un paralelo de 3 Ω y 6 Ω. ¿Cuánto pasa por cada una?`,
          pasos: [
            R`Planteamiento: \(I_{3\Omega} = 6\cdot\dfrac{6}{3 + 6}\), \(I_{6\Omega} = 6\cdot\dfrac{3}{3 + 6}\).`,
            R`Comprobación de tensión: \(4\cdot 3 = 2\cdot 6 = 12\) V.`,
          ],
          r: R`4 A por la de 3 Ω y 2 A por la de 6 Ω.`,
        },
        error: R`<p>Poner en el numerador la misma resistencia de la rama. Revisa con sentido común: la resistencia menor debe llevar más corriente.</p>`,
      },
    },
    {
      id: 'lvk', g: 'Leyes de Kirchhoff', m: ['m24', 'm26'],
      t: 'Ley de voltajes de Kirchhoff (LVK)',
      f: R`\oint \vec E\cdot d\vec l = 0 \;\Longrightarrow\; \sum_{\text{lazo}} \Delta V = 0 \qquad V_c - V_a = \sum_{a\to c}\Delta V`,
      x: {
        idea: R`<p>El potencial es como la altura en un cerro: depende solo del punto. Si das una vuelta completa y vuelves al punto de partida, lo que subiste es igual a lo que bajaste. Por la misma razón, la diferencia de potencial entre dos puntos da lo mismo por cualquier camino.</p>`,
        pasos: [
          R`En régimen DC el campo electrostático es conservativo: \(\oint \vec E\cdot d\vec l = 0\).`,
          R`Como \(V_a - V_b = \int_a^b \vec E\cdot d\vec l\), al cerrar el lazo la suma de todas las diferencias de potencial es cero.`,
          R`Elige un sentido de recorrido. En un resistor que cruzas en el sentido de la corriente bajas: \(-IR\). Contra la corriente subes: \(+IR\).`,
          R`En una fuente que cruzas de − a + subes \(+\varepsilon\); de + a − bajas \(-\varepsilon\).`,
          R`Suma todo e iguala a cero. Para \(V_c - V_a\), suma solo los tramos desde a hasta c.`,
        ],
        simbolos: [
          [R`\Delta V`, 'cambio de potencial al cruzar un elemento en el sentido del recorrido [V]'],
        ],
        cuando: R`<p>En cada lazo. Con \(b\) ramas y \(n\) nodos hay \(b - n + 1\) ecuaciones de lazo independientes. Si hay un inductor, el campo inducido no es conservativo, pero se sigue usando la LVK poniendo la caída \(L\,di/dt\) en sus terminales (módulo 2.10).</p>`,
        ejemplo: {
          q: R`Lazo con una fuente de 10 V y resistencias de 2 Ω y 3 Ω en serie. Encuentra la corriente y comprueba la suma.`,
          pasos: [
            R`Planteamiento: supongo \(I\) horaria y parto del borne − de la fuente: \(+10 - 2I - 3I = 0\).`,
            R`\(I = 10/5 = 2\) A.`,
            R`Comprobación: \(+10 - 4 - 6 = 0\).`,
          ],
          r: R`\(I = 2\) A.`,
        },
        error: R`<p>Mezclar dos criterios de signo en el mismo lazo. Elige "subir es +" y aplícalo a todos los elementos, fuentes y resistencias.</p>`,
      },
    },
    {
      id: 'divisor-tension', g: 'Leyes de Kirchhoff', m: ['m24', 'm28'],
      t: 'Divisor de tensión',
      f: R`V_k = V\,\frac{R_k}{\sum R}`,
      x: {
        idea: R`<p>Resistencias en serie llevan la misma corriente. La tensión total se reparte en proporción a cada resistencia: la más grande se lleva la mayor parte.</p>`,
        pasos: [
          R`En serie, \(I = V/\sum R\).`,
          R`La tensión en la resistencia \(k\) es \(V_k = I\,R_k\).`,
          R`Reemplaza \(I\): \(V_k = V\,R_k/\sum R\).`,
        ],
        simbolos: [
          [R`V`, 'tensión total aplicada a la serie [V]'],
          [R`V_k`, 'tensión en la resistencia k [V]'],
        ],
        cuando: R`<p>Solo si por todas las resistencias pasa la misma corriente. Si conectas algo a la salida del divisor, esa carga queda en paralelo con \(R_k\) y el divisor cambia. Por eso en el módulo 2.8 \(V_{th}\) se calcula con los terminales abiertos.</p>`,
        ejemplo: {
          q: R`12 V aplicados a 1 kΩ y 2 kΩ en serie. ¿Cuánto cae en la de 2 kΩ?`,
          pasos: [
            R`Planteamiento: \(V_2 = 12\cdot\dfrac{2}{1 + 2}\).`,
          ],
          r: R`\(V_2 = 8\) V (y 4 V en la de 1 kΩ).`,
        },
        error: R`<p>Aplicarlo cuando hay otra rama conectada al punto medio. Primero reduce el circuito hasta que la serie sea real.</p>`,
      },
    },
    {
      id: 'serie-paralelo', g: 'Redes equivalentes', m: ['m25', 'm28'],
      t: 'Resistencias en serie y en paralelo',
      f: R`R_{eq} = R_1 + R_2 + \dots \qquad \frac{1}{R_{eq}} = \frac{1}{R_1} + \frac{1}{R_2} + \dots \qquad R_1 \parallel R_2 = \frac{R_1R_2}{R_1 + R_2}`,
      x: {
        idea: R`<p>Un equivalente es una sola resistencia que, vista desde los terminales, se comporta igual que el grupo: con la misma tensión toma la misma corriente. En serie los obstáculos se suman. En paralelo se abren más caminos y la resistencia baja.</p>`,
        pasos: [
          R`Serie: la corriente es la misma y las tensiones se suman (LVK). \(V = IR_1 + IR_2 = I(R_1 + R_2)\), así que \(R_{eq} = R_1 + R_2\). Es la lámina 33 del Cap. 3, que lo llama \(R_O\).`,
          R`Paralelo: la tensión es la misma y las corrientes se suman (LCK). \(I = V/R_1 + V/R_2 = V(1/R_1 + 1/R_2)\), así que \(1/R_{eq} = 1/R_1 + 1/R_2\) (lámina 34).`,
          R`Para dos en paralelo conviene el atajo producto sobre suma.`,
        ],
        simbolos: [
          [R`R_{eq}`, 'resistencia equivalente [Ω] (en el Cap. 3, \(R_O\))'],
          [R`\parallel`, 'se lee "en paralelo con"'],
        ],
        cuando: R`<p>Dos elementos están en serie si por ellos pasa la misma corriente sin que nada se desvíe entre ellos. Están en paralelo si comparten los mismos dos nodos. Si ninguna resistencia cumple eso, prueba Δ–Y.</p>`,
        ejemplo: {
          q: R`Calcula \(2 + 3 + 5\ \Omega\) en serie, y \(6\ \Omega \parallel 3\ \Omega\).`,
          pasos: [
            R`Serie: \(2 + 3 + 5 = 10\ \Omega\).`,
            R`Paralelo: \(\dfrac{6\cdot 3}{6 + 3} = \dfrac{18}{9}\).`,
          ],
          r: R`10 Ω en serie y 2 Ω en paralelo. El paralelo siempre es menor que la menor de las resistencias.`,
        },
        error: R`<p>Ver un paralelo donde no lo hay porque las resistencias están dibujadas una al lado de la otra. Lo que manda son los nodos, no el dibujo.</p>`,
      },
    },
    {
      id: 'delta-y', g: 'Redes equivalentes', m: ['m25'],
      t: 'Transformación triángulo a estrella (Δ → Y)',
      f: R`R_a = \frac{R_{ab}R_{ca}}{\Sigma} \quad R_b = \frac{R_{ab}R_{bc}}{\Sigma} \quad R_c = \frac{R_{bc}R_{ca}}{\Sigma} \qquad \Sigma = R_{ab} + R_{bc} + R_{ca}`,
      x: {
        idea: R`<p>A veces ninguna resistencia está en serie ni en paralelo. Tres resistencias en triángulo se pueden cambiar por tres en estrella que, vistas desde los tres nodos, se comportan igual. Después del cambio suelen aparecer series y paralelos.</p><p>Regla para recordar: la resistencia de la estrella en el nodo a es el producto de las dos del triángulo que tocan a, dividido por la suma de las tres.</p>`,
        pasos: [
          R`Para que las dos redes sean equivalentes, la resistencia vista entre cada par de nodos, con el tercero suelto, tiene que ser igual.`,
          R`Entre a y b, en el triángulo ves \(R_{ab}\) en paralelo con \(R_{bc} + R_{ca}\). En la estrella ves \(R_a + R_b\). Igualas: \(R_a + R_b = \dfrac{R_{ab}(R_{bc} + R_{ca})}{\Sigma}\).`,
          R`Escribes lo mismo para b–c y c–a. Son tres ecuaciones con tres incógnitas.`,
          R`Sumas las tres y divides por 2 para obtener \(R_a + R_b + R_c\). Le restas la ecuación del par que no incluye al nodo a (la de b–c, que vale \(R_b + R_c\)) y queda \(R_a = R_{ab}R_{ca}/\Sigma\). Igual para \(R_b\) y \(R_c\).`,
        ],
        simbolos: [
          [R`R_{ab}`, 'resistencia del triángulo entre los nodos a y b [Ω]'],
          [R`R_a`, 'resistencia de la estrella entre el nodo a y el centro [Ω]'],
          [R`\Sigma`, 'suma de las tres del triángulo [Ω]'],
        ],
        cuando: R`<p>Cuando la red no se reduce con serie y paralelo, típicamente un puente. Para volver de estrella a triángulo: \(R_{ab} = (R_aR_b + R_bR_c + R_cR_a)/R_c\), con la resistencia del nodo opuesto abajo.</p>`,
        ejemplo: {
          q: R`Un triángulo con tres resistencias de 9 Ω. ¿Cuánto vale la estrella? Comprueba volviendo al triángulo.`,
          pasos: [
            R`Planteamiento: \(\Sigma = 27\ \Omega\) y \(R_a = 9\cdot 9/27\).`,
            R`\(R_a = R_b = R_c = 3\ \Omega\). Con resistencias iguales, \(R_Y = R_\Delta/3\).`,
            R`Vuelta: \(R_{ab} = (3\cdot 3 + 3\cdot 3 + 3\cdot 3)/3 = 9\ \Omega\).`,
          ],
          r: R`Estrella de 3 Ω en cada rama.`,
        },
        error: R`<p>Calcular corrientes dentro del triángulo usando la estrella. La equivalencia vale solo hacia afuera: las corrientes internas se sacan del circuito original con las tensiones de nodo.</p>`,
      },
    },
  );
})(typeof window !== 'undefined' ? window : globalThis);

/**
 * Formulario, parte 1: corriente, conductores y potencia (Cap. 3, módulos 2.1 y 2.3).
 * Cada entrada: id, g (grupo), m (módulos), t (nombre), f (fórmula en TeX), x (explicación tutor):
 *   idea, pasos (de dónde sale), simbolos, cuando, ejemplo {q, pasos, r}, error.
 * Los números de los ejemplos están verificados en tests/formulas.test.js.
 */
(function (root) {
  'use strict';
  const R = String.raw;
  const list = (root.Formulas = root.Formulas || []);

  list.push(
    {
      id: 'continuidad', g: 'Carga y corriente', m: ['m23', 'm21'],
      t: 'Principio de continuidad',
      f: R`I = \oint_S \vec J\cdot d\vec s = -\frac{dQ_i}{dt} \qquad \nabla\cdot\vec J = -\frac{\partial\rho}{\partial t}`,
      x: {
        idea: R`<p>La carga no se crea ni se destruye. Si por una superficie cerrada sale más carga de la que entra, la carga que hay adentro tiene que estar bajando. La fórmula dice exactamente eso: la corriente neta que sale es igual a lo que pierde el interior por segundo.</p><p>Piensa en una piscina con una manguera que entra y un desagüe que sale. Si sale más agua de la que entra, el nivel baja. La corriente es el caudal y \(Q_i\) es el nivel.</p>`,
        pasos: [
          R`Encierra un volumen \(v\) con una superficie cerrada \(S\). Adentro hay una carga \(Q_i = \int_v \rho\,dv\).`,
          R`La corriente que atraviesa un trozo \(d\vec s\) de la superficie es \(\vec J\cdot d\vec s\). El vector \(d\vec s\) apunta hacia afuera, así que si \(\vec J\) sale el producto es positivo, y si entra es negativo.`,
          R`Sumando sobre toda la superficie obtienes la corriente neta que sale: \(I = \oint_S \vec J\cdot d\vec s\).`,
          R`Por conservación de la carga, esa corriente saliente es lo que pierde el interior: \(I = -dQ_i/dt\). El signo menos está porque si sale carga, \(Q_i\) disminuye.`,
          R`Con el teorema de la divergencia, \(\oint_S \vec J\cdot d\vec s = \int_v \nabla\cdot\vec J\,dv\). Como vale para cualquier volumen, los integrandos son iguales: \(\nabla\cdot\vec J = -\partial\rho/\partial t\). Es la forma puntual.`,
        ],
        simbolos: [
          [R`I`, 'corriente neta que sale de la superficie [A]'],
          [R`\vec J`, 'densidad de corriente [A/m²]'],
          [R`d\vec s`, 'elemento de superficie, normal hacia afuera [m²]'],
          [R`Q_i`, 'carga encerrada por la superficie [C]'],
          [R`\rho`, 'densidad de carga libre [C/m³]'],
        ],
        cuando: R`<p>Se usa para justificar la LCK: en corriente continua la carga de un nodo no cambia, \(dQ_i/dt = 0\), y entonces todo lo que entra sale. También sirve en el capacitor: la corriente que llega a una placa no la atraviesa, se acumula y hace crecer \(Q\).</p>`,
        ejemplo: {
          q: R`Una esfera aislada tiene carga positiva que se escapa por un hilo a razón constante: en 2 s pasa de 10 mC a 4 mC. ¿Cuál es la corriente neta que sale de una superficie que encierra la esfera?`,
          pasos: [
            R`Planteamiento: \(I = -dQ_i/dt\), y como la variación es constante, \(dQ_i/dt = \Delta Q/\Delta t\).`,
            R`\(\Delta Q = 4 - 10 = -6\) mC en 2 s, así que \(dQ_i/dt = -3\) mC/s.`,
            R`\(I = -(-3\times10^{-3}) = 3\times10^{-3}\) A.`,
          ],
          r: R`\(I = 3\) mA, positiva: sale carga, como esperábamos.`,
        },
        error: R`<p>Olvidar el signo. \(I\) positiva significa corriente que sale; si la carga encerrada aumenta, \(I\) da negativa porque está entrando. Antes de reemplazar, decide hacia dónde apunta \(d\vec s\).</p>`,
      },
    },
    {
      id: 'densidad-corriente', g: 'Carga y corriente', m: ['m21', 'm211'],
      t: 'Corriente y densidad de corriente',
      f: R`I = \int_S \vec J\cdot d\vec s \qquad\Longrightarrow\qquad J = \frac{I}{S}\ \ (\vec J\ \text{uniforme y perpendicular a } S)`,
      x: {
        idea: R`<p>\(I\) es un número que dice cuánta carga cruza toda la sección por segundo. \(\vec J\) es un vector que dice cuánta corriente pasa por cada metro cuadrado y hacia dónde. Si la corriente se reparte parejo, basta dividir.</p><p>Es como la diferencia entre "cuántas personas salen del estadio por minuto" (\(I\)) y "cuántas pasan por cada metro de ancho de la puerta" (\(J\)).</p>`,
        pasos: [
          R`Divide la sección en trocitos \(d\vec s\). Por cada uno pasa \(dI = \vec J\cdot d\vec s\). Solo cuenta la componente de \(\vec J\) perpendicular al trocito, por eso aparece el producto punto.`,
          R`Suma todos los trocitos: \(I = \int_S \vec J\cdot d\vec s\).`,
          R`Si \(\vec J\) tiene el mismo valor en toda la sección y es perpendicular a ella, sale de la integral: \(I = J\int_S ds = J\,S\).`,
          R`Despejas: \(J = I/S\).`,
        ],
        simbolos: [
          [R`I`, 'intensidad de corriente [A]'],
          [R`\vec J`, 'densidad de corriente [A/m²]'],
          [R`S`, 'sección del conductor [m²]'],
        ],
        cuando: R`<p>\(J = I/S\) solo vale si la corriente se reparte parejo. En un coaxial con corriente radial (módulo 2.11) el área que atraviesa la corriente cambia con el radio, \(S(r) = 2\pi r L\), y \(J\) cambia con él.</p>`,
        ejemplo: {
          q: R`Un alambre de 2 mm de diámetro lleva 3 A. ¿Cuánto vale \(J\)?`,
          pasos: [
            R`Planteamiento: \(J = I/S\) con \(S = \pi r^2\). El radio es la mitad del diámetro: \(r = 1\) mm \(= 10^{-3}\) m.`,
            R`\(S = \pi(10^{-3})^2 = 3{,}14\times10^{-6}\ \mathrm{m^2}\).`,
            R`\(J = 3/(3{,}14\times10^{-6})\).`,
          ],
          r: R`\(J \approx 9{,}55\times10^{5}\ \mathrm{A/m^2}\).`,
        },
        error: R`<p>Usar el diámetro como si fuera el radio, o pasar mm² a m² multiplicando por \(10^{-3}\). Un mm² son \(10^{-6}\) m², porque el factor \(10^{-3}\) del milímetro va al cuadrado.</p>`,
      },
    },
    {
      id: 'deriva', g: 'Conductores y resistencia', m: ['m21'],
      t: 'Velocidad de deriva y movilidad',
      f: R`\vec U_d = -\mu_e\,\vec E \qquad [\mathrm{m/s}]`,
      x: {
        idea: R`<p>Dentro del metal, el campo empuja a cada electrón, pero el electrón choca con los átomos y pierde lo ganado. El resultado es un avance promedio lento y constante, la velocidad de deriva. Es proporcional al campo, y la constante es la movilidad: dice qué tan fácil se mueve el electrón en ese material.</p><p>Una multitud saliendo por un pasillo: cada persona camina, choca y se detiene, pero el grupo avanza despacio hacia la salida. Ese avance del grupo es \(U_d\).</p>`,
        pasos: [
          R`Cada electrón siente la fuerza de Coulomb \(\vec F = -q_e\vec E\). El signo menos es porque su carga es negativa: la fuerza apunta contra el campo.`,
          R`En el vacío esa fuerza lo aceleraría sin parar. En el metal, los choques lo frenan una y otra vez, y en promedio se mueve a velocidad constante.`,
          R`El Cap. 3 (lámina 13) toma esa velocidad promedio como proporcional al campo. A la constante la llama movilidad \(\mu_e\): \(\vec U_d = -\mu_e\vec E\).`,
          R`El signo menos dice que los electrones van contra \(\vec E\), hacia el potencial más alto.`,
        ],
        simbolos: [
          [R`\vec U_d`, 'velocidad de deriva [m/s]'],
          [R`\mu_e`, 'movilidad del electrón [m²/(V·s)], positiva'],
          [R`\vec E`, 'campo eléctrico dentro del conductor [V/m]'],
        ],
        cuando: R`<p>Cuando te piden qué tan rápido avanzan los electrones, o cuando tienes que relacionar la conductividad con la estructura del material (\(\sigma = -\rho_e\mu_e\)).</p>`,
        ejemplo: {
          q: R`En cobre, \(\mu_e = 4{,}3\times10^{-3}\ \mathrm{m^2/(V\cdot s)}\). Si el campo en el alambre es 0,05 V/m en dirección \(+\hat x\), ¿cuál es \(\vec U_d\)?`,
          pasos: [
            R`Planteamiento: reemplazo directo en \(\vec U_d = -\mu_e\vec E\).`,
            R`\(\vec U_d = -4{,}3\times10^{-3}\cdot 0{,}05\,\hat x\).`,
          ],
          r: R`\(\vec U_d = -2{,}15\times10^{-4}\,\hat x\) m/s: unos 0,2 mm por segundo, contra el campo.`,
        },
        error: R`<p>Confundir la velocidad de deriva con la agitación térmica, que es de unos \(10^{6}\) m/s pero en direcciones al azar. La deriva es muy lenta; lo que viaja rápido al cerrar un interruptor es el campo.</p>`,
      },
    },
    {
      id: 'ohm-puntual', g: 'Conductores y resistencia', m: ['m21', 'm211'],
      t: 'Densidad de corriente y ley de Ohm puntual',
      f: R`\vec J = \rho_e\,\vec U_d \qquad \sigma = -\rho_e\,\mu_e \qquad \vec J = \sigma\,\vec E`,
      x: {
        idea: R`<p>Primero se cuenta cuánta carga cruza por segundo: depende de cuánta carga móvil hay por metro cúbico y de qué tan rápido avanza. Después se reemplaza la velocidad por el campo, y aparece la ley de Ohm en un punto: la corriente es proporcional al campo.</p><p>Es un peaje: los autos por segundo dependen de cuántos hay por kilómetro y de su velocidad.</p>`,
        pasos: [
          R`En un tiempo \(dt\) cruzan una sección \(S\) los electrones que están a menos de \(U_d\,dt\) de ella. Ocupan el volumen \(S\,U_d\,dt\).`,
          R`La carga en ese volumen es \(dQ = \rho_e\,S\,U_d\,dt\). Dividiendo por \(dt\) y por \(S\): \(J = \rho_e U_d\). En vector, \(\vec J = \rho_e\vec U_d\) (lámina 14).`,
          R`Reemplaza \(\vec U_d = -\mu_e\vec E\): \(\vec J = -\rho_e\mu_e\vec E\).`,
          R`Al factor lo llamas conductividad: \(\sigma = -\rho_e\mu_e\). Como \(\rho_e < 0\), el signo menos deja \(\sigma\) positiva. Queda \(\vec J = \sigma\vec E\).`,
          R`Revisa los signos: \(\rho_e\) negativa y \(\vec U_d\) contra el campo dan \(\vec J\) a favor del campo, igual que la corriente convencional.`,
        ],
        simbolos: [
          [R`\rho_e`, 'densidad de electrones de conducción [C/m³], negativa'],
          [R`\vec U_d`, 'velocidad de deriva [m/s]'],
          [R`\mu_e`, 'movilidad [m²/(V·s)]'],
          [R`\sigma`, 'conductividad [S/m]'],
        ],
        cuando: R`<p>\(\vec J = \sigma\vec E\) vale en cada punto de cualquier conductor óhmico, aunque la geometría sea complicada. Es el punto de partida del módulo 2.11. Para semiconductores se suma el aporte de los huecos: \(\sigma_{sc} = -\rho_e\mu_e + \rho_h\mu_h\).</p>`,
        ejemplo: {
          q: R`En cobre hay \(8{,}5\times10^{28}\) electrones de conducción por m³ y \(\mu_e = 4{,}3\times10^{-3}\ \mathrm{m^2/(V\cdot s)}\). Calcula \(\rho_e\) y \(\sigma\).`,
          pasos: [
            R`Planteamiento: \(\rho_e\) es la cantidad por m³ por la carga de cada uno, con signo negativo. Después, \(\sigma = -\rho_e\mu_e\).`,
            R`\(\rho_e = -8{,}5\times10^{28}\cdot 1{,}6\times10^{-19} = -1{,}36\times10^{10}\ \mathrm{C/m^3}\).`,
            R`\(\sigma = -(-1{,}36\times10^{10})(4{,}3\times10^{-3}) = 5{,}85\times10^{7}\ \mathrm{S/m}\).`,
          ],
          r: R`\(\sigma \approx 5{,}8\times10^{7}\) S/m, el valor de la tabla de la lámina 14.`,
        },
        error: R`<p>Escribir \(\rho_e\) positiva y terminar con una conductividad negativa. Cuando un resultado físico que debe ser positivo sale negativo, revisa los signos de las cargas.</p>`,
      },
    },
    {
      id: 'resistencia', g: 'Conductores y resistencia', m: ['m21', 'm211'],
      t: 'Resistencia de un conductor uniforme',
      f: R`R = \frac{L}{\sigma S} = \rho_\Omega\,\frac{L}{S} \qquad [\Omega]`,
      x: {
        idea: R`<p>La resistencia depende solo de la forma y del material. Un conductor más largo resiste más, porque los electrones chocan durante más recorrido. Uno más grueso resiste menos, porque hay más espacio por donde pasar, como una carretera con más pistas.</p>`,
        pasos: [
          R`Toma un conductor de largo \(L\) y sección \(S\) uniforme, con \(V_{ab}\) entre sus extremos. Supón \(\vec E\) y \(\vec J\) uniformes (lámina 18).`,
          R`Relaciona voltaje y campo: \(V_{ab} = \int_a^b \vec E\cdot d\vec l = E\,L\).`,
          R`Relaciona campo y corriente con la ley puntual: \(E = J/\sigma\) y \(J = I/S\), así que \(E = I/(\sigma S)\).`,
          R`Reemplaza: \(V_{ab} = \dfrac{I}{\sigma S}L\). Lo que multiplica a \(I\) es la resistencia: \(R = L/(\sigma S)\).`,
          R`Con la resistividad \(\rho_\Omega = 1/\sigma\) queda \(R = \rho_\Omega L/S\).`,
        ],
        simbolos: [
          [R`L`, 'largo [m]'],
          [R`S`, 'sección [m²]'],
          [R`\sigma`, 'conductividad [S/m]'],
          [R`\rho_\Omega`, 'resistividad [Ω·m]'],
        ],
        cuando: R`<p>Solo si la sección y el material son iguales en todo el largo y la corriente va a lo largo. Si la sección cambia (un tronco de cono, un coaxial con corriente radial), divides en trozos \(dR = dl/(\sigma S)\) y sumas, en serie o en paralelo según cómo va la corriente (módulo 2.11).</p>`,
        ejemplo: {
          q: R`Un cable de aluminio (\(\sigma = 3{,}72\times10^{7}\) S/m) de 50 m y 2 mm² de sección. ¿Cuánto vale su resistencia?`,
          pasos: [
            R`Planteamiento: \(R = L/(\sigma S)\). Paso la sección a m²: \(2\ \mathrm{mm^2} = 2\times10^{-6}\ \mathrm{m^2}\).`,
            R`\(R = \dfrac{50}{3{,}72\times10^{7}\cdot 2\times10^{-6}} = \dfrac{50}{74{,}4}\).`,
          ],
          r: R`\(R \approx 0{,}672\ \Omega\).`,
        },
        error: R`<p>Si te dan el diámetro, primero calcula el área. Si duplicas el diámetro, el área se multiplica por 4 y la resistencia se divide por 4.</p>`,
      },
    },
    {
      id: 'ohm', g: 'Conductores y resistencia', m: ['m21', 'm23', 'm24'],
      t: 'Ley de Ohm en circuitos',
      f: R`V_{ab} = R\,I \qquad I = G\,V_{ab}, \quad G = \frac{1}{R}\ [\mathrm{S}]`,
      x: {
        idea: R`<p>En un resistor, la caída de potencial es proporcional a la corriente que lo atraviesa. La corriente va del extremo de mayor potencial al de menor, igual que el agua baja por una cañería.</p>`,
        pasos: [
          R`Viene directo del cálculo anterior: \(V_{ab} = I\,L/(\sigma S)\), y a \(L/(\sigma S)\) le llamas \(R\).`,
          R`La relación es lineal mientras el material sea óhmico (\(\sigma\) no depende de \(E\)).`,
          R`El Cap. 3 también la escribe al revés, con la conductancia: \(I = G\,V_{ab}\), con \(G = 1/R\) en siemens. Es la forma cómoda para el análisis de nodos.`,
        ],
        simbolos: [
          [R`V_{ab}`, 'tensión del extremo a respecto del b [V]'],
          [R`I`, 'corriente que entra por a y sale por b [A]'],
          [R`G`, 'conductancia [S]'],
        ],
        cuando: R`<p>En cada resistor de un circuito. Ojo con el sentido: si la corriente que supusiste va de b hacia a, entonces \(V_{ab} = -RI\).</p>`,
        ejemplo: {
          q: R`Por un resistor de 8 Ω circulan 1,5 A de a hacia b. ¿Cuánto vale \(V_{ab}\) y la conductancia?`,
          pasos: [
            R`Planteamiento: la corriente entra por a, así que a está más alto: \(V_{ab} = RI\).`,
            R`\(V_{ab} = 8\cdot 1{,}5 = 12\) V. \(G = 1/8 = 0{,}125\) S.`,
          ],
          r: R`\(V_{ab} = 12\) V y \(G = 0{,}125\) S.`,
        },
        error: R`<p>Poner el signo sin mirar el sentido de la corriente. Primero dibuja la flecha de corriente, después marca + donde entra y − donde sale, y recién ahí escribe la ecuación.</p>`,
      },
    },
    {
      id: 'potencia', g: 'Potencia y energía', m: ['m21', 'm22', 'm23', 'm24', 'm26', 'm27', 'm28'],
      t: 'Potencia con referencia pasiva',
      f: R`p(t) = v(t)\,i(t) \qquad p > 0:\ \text{recibe energía} \qquad p < 0:\ \text{entrega energía}`,
      x: {
        idea: R`<p>Una carga que baja de potencial pierde energía y se la deja al elemento. La potencia es la energía por segundo que pasa por los terminales. El signo dice hacia dónde va esa energía, siempre que tomes la referencia pasiva: la corriente entra por el terminal que marcaste +.</p>`,
        pasos: [
          R`Una carga \(dq\) que cruza el elemento de + a − baja de potencial \(v\). Pierde energía \(dW = v\,dq\) y el elemento la recibe.`,
          R`Divide por \(dt\): \(p = dW/dt = v\,dq/dt = v\,i\).`,
          R`Eso supone que la corriente entra por +. Es la convención de las direcciones de referencia asociadas del Cap. 3 (lámina 35).`,
          R`Con esa convención, \(p > 0\) significa que el elemento recibe energía (una resistencia, una batería cargándose) y \(p < 0\) que la entrega (una fuente funcionando como fuente).`,
        ],
        simbolos: [
          [R`v(t)`, 'tensión entre terminales, + menos − [V]'],
          [R`i(t)`, 'corriente que entra por el terminal + [A]'],
          [R`p(t)`, 'potencia instantánea [W]'],
        ],
        cuando: R`<p>En todo balance de energía. Al final de cada ejercicio de circuitos conviene comprobar que la suma de todas las potencias, con su signo, da cero: lo que entregan las fuentes lo reciben los demás elementos.</p>`,
        ejemplo: {
          q: R`En un elemento marcas + arriba y − abajo. Mides \(v = 5\) V y una corriente de 2 A que sale por el terminal + (o sea, \(i = -2\) A entrando por +). ¿Recibe o entrega energía?`,
          pasos: [
            R`Planteamiento: con referencia pasiva, \(i\) es la que entra por +. Aquí \(i = -2\) A.`,
            R`\(p = 5\cdot(-2) = -10\) W.`,
          ],
          r: R`\(p = -10\) W: el elemento entrega 10 W. Se comporta como fuente.`,
        },
        error: R`<p>Calcular \(v\cdot i\) sin fijarse por dónde entra la corriente. En una fuente que entrega energía la corriente sale por +, así que con referencia pasiva su potencia es negativa. Si tu curso pregunta "potencia entregada", da el valor positivo y dilo con palabras.</p>`,
      },
    },
    {
      id: 'joule', g: 'Potencia y energía', m: ['m21', 'm22', 'm24'],
      t: 'Potencia disipada en un resistor (efecto Joule)',
      f: R`P = V I = I^2 R = \frac{V^2}{R} \qquad W[t_0,t] = \int_{t_0}^{t} p(t')\,dt'`,
      x: {
        idea: R`<p>En un resistor la corriente siempre va de + a −, así que la potencia siempre sale positiva: el resistor solo recibe energía y la convierte en calor. La energía total es la integral de la potencia en el tiempo.</p>`,
        pasos: [
          R`Parte de \(p = v\,i\) con referencia pasiva.`,
          R`Reemplaza la ley de Ohm, \(v = R\,i\): \(p = R\,i^2\).`,
          R`O despeja \(i = v/R\): \(p = v^2/R\).`,
          R`Como \(i^2\) y \(v^2\) nunca son negativos, \(p \ge 0\). La energía \(W = \int p\,dt\) solo puede crecer (lámina 36).`,
        ],
        simbolos: [
          [R`P`, 'potencia [W]'],
          [R`W`, 'energía [J]'],
        ],
        cuando: R`<p>Elige la forma según el dato que tengas: si conoces la corriente, \(I^2R\); si conoces la tensión, \(V^2/R\). En resistores en serie comparte la corriente y en paralelo la tensión.</p>`,
        ejemplo: {
          q: R`Un resistor de 10 Ω tiene 20 V entre sus terminales. ¿Cuánta potencia disipa y cuánta energía en un minuto?`,
          pasos: [
            R`Planteamiento: tengo \(V\) y \(R\), uso \(V^2/R\). Comprobación con \(I^2R\): \(I = 20/10 = 2\) A.`,
            R`\(P = 400/10 = 40\) W; \(I^2R = 4\cdot 10 = 40\) W.`,
            R`\(W = P\,t = 40\cdot 60\).`,
          ],
          r: R`\(P = 40\) W y \(W = 2400\) J.`,
        },
        error: R`<p>Usar superposición para la potencia. Las corrientes se suman, las potencias no, porque \(P\) depende de \(I^2\): \((I_1 + I_2)^2 \ne I_1^2 + I_2^2\).</p>`,
      },
    },
  );
})(typeof window !== 'undefined' ? window : globalThis);

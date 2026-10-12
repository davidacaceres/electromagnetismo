/**
 * Formulario, parte 4: resistencia en geometrías no uniformes y capacitores con dieléctricos
 * (módulos 2.11 y 2.12; Cap. 3 y Cap. 4).
 */
(function (root) {
  'use strict';
  const R = String.raw;
  const list = (root.Formulas = root.Formulas || []);

  list.push(
    {
      id: 'r-general', g: 'Resistencia en geometrías no uniformes', m: ['m211'],
      t: 'Procedimiento general para calcular una resistencia',
      f: R`I \;\to\; J = \frac{I}{S(r)} \;\to\; E = \frac{J}{\sigma} \;\to\; V = \int E\,dl \;\to\; R = \frac{V}{I} \qquad R = \frac{\int \vec E\cdot d\vec l}{\int_S \sigma\vec E\cdot d\vec s}`,
      x: {
        idea: R`<p>Cuando la sección cambia a lo largo del camino, \(R = L/(\sigma S)\) ya no sirve. Lo que siempre funciona es suponer una corriente, ver cómo se reparte, sacar el campo, integrarlo para tener la tensión y dividir. La corriente que supusiste se cancela al final.</p>`,
        pasos: [
          R`Supón una corriente total \(I\) entre los electrodos.`,
          R`Por continuidad, la misma \(I\) cruza cada superficie perpendicular a la corriente. Si esa superficie tiene área \(S(r)\), entonces \(J(r) = I/S(r)\).`,
          R`Ley de Ohm puntual: \(E(r) = J(r)/\sigma\).`,
          R`Integra el campo de un electrodo al otro: \(V = \int E\,dr\).`,
          R`Divide: \(R = V/I\). Si \(I\) no se cancela, hay un error antes.`,
          R`Otra forma equivalente (Cap. 3, ejemplos 3-1 y 3-2): corta el resistor en trozos de resistencia \(dR = dl/(\sigma S)\). Si la corriente atraviesa los trozos uno tras otro, se suman en serie; si los recorre a lo largo, en paralelo.`,
        ],
        simbolos: [
          [R`S(r)`, 'área que atraviesa la corriente a la distancia r [m²]'],
          [R`dR`, 'resistencia de un trozo delgado [Ω]'],
        ],
        cuando: R`<p>Coaxiales con fuga radial, esferas concéntricas, conos, semiesferas de puesta a tierra, conductividad que varía con la posición.</p>`,
        ejemplo: {
          q: R`Entre dos esferas concéntricas de radios 0,1 m y 0,5 m hay un material con \(\sigma = 0{,}01\) S/m. Calcula la resistencia entre ellas.`,
          pasos: [
            R`\(S(r) = 4\pi r^2\), así que \(J = I/(4\pi r^2)\) y \(E = I/(4\pi\sigma r^2)\).`,
            R`\(V = \int_a^b \dfrac{I}{4\pi\sigma r^2}dr = \dfrac{I}{4\pi\sigma}\left(\dfrac1a - \dfrac1b\right)\).`,
            R`\(R = \dfrac{1}{4\pi\cdot 0{,}01}(10 - 2) = \dfrac{8}{0{,}1257}\).`,
          ],
          r: R`\(R \approx 63{,}7\ \Omega\).`,
        },
        error: R`<p>Usar el área de los electrodos en vez del área que cruza la corriente a cada radio. En una corriente radial esa área crece con \(r\).</p>`,
      },
    },
    {
      id: 'r-coaxial', g: 'Resistencia en geometrías no uniformes', m: ['m211'],
      t: 'Resistencia de fuga de un coaxial',
      f: R`R = \frac{\ln(b/a)}{2\pi\sigma L} \qquad E(r) = \frac{V}{r\,\ln(b/a)}`,
      x: {
        idea: R`<p>Entre el conductor central y la malla de un coaxial hay un aislante imperfecto. Una pequeña corriente se escapa en dirección radial. Atraviesa cilindros cada vez más grandes, así que la corriente se aprieta cerca del centro y ahí el campo es más fuerte.</p>`,
        pasos: [
          R`La corriente de fuga \(I\) cruza un cilindro de radio \(r\) y largo \(L\): \(S(r) = 2\pi rL\).`,
          R`\(J = \dfrac{I}{2\pi rL}\) y \(E = \dfrac{I}{2\pi\sigma rL}\).`,
          R`\(V = \int_a^b E\,dr = \dfrac{I}{2\pi\sigma L}\ln\dfrac{b}{a}\).`,
          R`\(R = V/I = \dfrac{\ln(b/a)}{2\pi\sigma L}\).`,
          R`Despejando \(I\) de la tensión y volviendo a \(E\): \(E(r) = V/(r\ln(b/a))\). El campo máximo está en \(r = a\).`,
        ],
        simbolos: [
          [R`a,\ b`, 'radio del conductor interno y del externo [m]'],
          [R`L`, 'largo del cable [m]'],
          [R`\sigma`, 'conductividad del aislante [S/m]'],
        ],
        cuando: R`<p>Fuga radial en cables y cualquier cilindro con corriente de adentro hacia afuera. La resistencia baja con el largo: un cable más largo tiene más área por donde fugarse.</p>`,
        ejemplo: {
          q: R`Coaxial de 2 m, \(a = 0{,}5\) mm, \(b = 2{,}5\) mm, aislante con \(\sigma = 10^{-5}\) S/m. Calcula la resistencia de fuga.`,
          pasos: [
            R`Planteamiento: \(b/a = 5\), \(\ln 5 = 1{,}609\).`,
            R`\(R = \dfrac{1{,}609}{2\pi\cdot 10^{-5}\cdot 2} = \dfrac{1{,}609}{1{,}257\times10^{-4}}\).`,
          ],
          r: R`\(R \approx 12{,}8\) kΩ.`,
        },
        error: R`<p>Poner \(L\) en el numerador como en un cable. Aquí la corriente no recorre el largo: lo atraviesa de lado, así que \(L\) aumenta el área y va abajo.</p>`,
      },
    },
    {
      id: 'c-placas', g: 'Capacitores y dieléctricos', m: ['m212', 'm29'],
      t: 'Capacitancia de placas paralelas',
      f: R`C = \frac{Q}{V} \qquad C = \frac{\varepsilon_0\varepsilon_r A}{d}`,
      x: {
        idea: R`<p>La capacitancia dice cuánta carga guarda el capacitor por cada volt. Depende solo de la geometría y del material: placas grandes y juntas guardan más; un dieléctrico entre ellas también, porque se polariza y debilita el campo, y con menos campo hace falta menos tensión para la misma carga.</p>`,
        pasos: [
          R`Pon carga \(+Q\) y \(-Q\) en placas de área \(A\). La densidad superficial es \(\rho_S = Q/A\).`,
          R`Con Gauss, entre placas grandes \(D = \rho_S\), y en un dieléctrico \(E = D/\varepsilon = Q/(\varepsilon_0\varepsilon_r A)\).`,
          R`Campo uniforme: \(V = E\,d = \dfrac{Q\,d}{\varepsilon_0\varepsilon_r A}\).`,
          R`\(C = Q/V = \dfrac{\varepsilon_0\varepsilon_r A}{d}\). La \(Q\) se cancela.`,
        ],
        simbolos: [
          [R`A`, 'área de cada placa [m²] (el formulario usa S)'],
          [R`d`, 'separación [m]'],
          [R`\varepsilon_r`, 'permitividad relativa'],
        ],
        cuando: R`<p>Placas mucho más grandes que su separación (se desprecia el efecto de borde). Para otras formas, aplica el mismo camino: \(Q \to E \to V \to C\). Coaxial: \(C = 2\pi\varepsilon L/\ln(b/a)\).</p>`,
        ejemplo: {
          q: R`Placas de 0,02 m² separadas 1 mm con un dieléctrico de \(\varepsilon_r = 2{,}2\). Calcula C.`,
          pasos: [
            R`Planteamiento: \(C = \varepsilon_0\varepsilon_r A/d\).`,
            R`\(C = \dfrac{8{,}854\times10^{-12}\cdot 2{,}2\cdot 0{,}02}{10^{-3}}\).`,
          ],
          r: R`\(C \approx 390\) pF.`,
        },
        error: R`<p>Dejar la separación en mm. Con \(d = 1\) en vez de \(10^{-3}\) el resultado sale mil veces menor.</p>`,
      },
    },
    {
      id: 'c-serie-paralelo', g: 'Capacitores y dieléctricos', m: ['m212', 'm29'],
      t: 'Capacitores en serie y en paralelo',
      f: R`\text{Paralelo: } C_{eq} = C_1 + C_2 \qquad \text{Serie: } \frac{1}{C_{eq}} = \frac{1}{C_1} + \frac{1}{C_2}`,
      x: {
        idea: R`<p>Es al revés que con resistencias. En paralelo, la tensión es la misma y las cargas se suman: es como agrandar las placas. En serie, la carga es la misma y las tensiones se suman: es como separar más las placas.</p>`,
        pasos: [
          R`Paralelo: \(V\) común, \(Q = Q_1 + Q_2 = C_1V + C_2V\). Dividiendo por \(V\): \(C_{eq} = C_1 + C_2\) (Cap. 4, lámina 29).`,
          R`Serie: la carga que sale de una placa llega a la siguiente, así que \(Q\) es la misma. \(V = Q/C_1 + Q/C_2\). Dividiendo por \(Q\): \(1/C_{eq} = 1/C_1 + 1/C_2\) (lámina 31).`,
        ],
        simbolos: [
          [R`C_{eq}`, 'capacitancia equivalente [F]'],
        ],
        cuando: R`<p>Para reducir redes de capacitores. También sirve para un capacitor con dos dieléctricos: capas una sobre otra (el campo las cruza una tras otra) son capacitores en serie; lado a lado, en paralelo.</p>`,
        ejemplo: {
          q: R`Calcula \(C_{eq}\) de 2 µF y 3 µF en paralelo y en serie.`,
          pasos: [
            R`Paralelo: \(2 + 3 = 5\) µF.`,
            R`Serie: \(\dfrac{2\cdot 3}{2 + 3} = 1{,}2\) µF.`,
          ],
          r: R`5 µF en paralelo y 1,2 µF en serie.`,
        },
        error: R`<p>Aplicar las fórmulas de resistencias. Para revisar: en serie la equivalente es menor que la menor, igual que las resistencias en paralelo.</p>`,
      },
    },
    {
      id: 'c-capas-serie', g: 'Capacitores y dieléctricos', m: ['m212'],
      t: 'Capacitor con capas en serie',
      f: R`C = \frac{\varepsilon_0 A}{t/\varepsilon_r + (d - t)} \qquad E_{aire} = \varepsilon_r E_{diel}`,
      x: {
        idea: R`<p>Una lámina de dieléctrico de espesor \(t\) apoyada en una placa. El campo cruza primero el dieléctrico y después el aire. Son dos capacitores en serie con la misma carga. En el dieléctrico el campo es \(\varepsilon_r\) veces más chico, así que la lámina "vale" como si fuera \(\varepsilon_r\) veces más delgada.</p>`,
        pasos: [
          R`En la frontera no hay carga libre, así que la componente normal de \(D\) es continua: \(D_{aire} = D_{diel}\).`,
          R`\(\varepsilon_0E_{aire} = \varepsilon_0\varepsilon_rE_{diel}\), o sea \(E_{aire} = \varepsilon_rE_{diel}\).`,
          R`La tensión total es la suma de las dos caídas: \(V = E_{diel}\,t + E_{aire}(d - t)\).`,
          R`Con \(D = Q/A\): \(V = \dfrac{Q}{\varepsilon_0A}\left(\dfrac{t}{\varepsilon_r} + d - t\right)\), y \(C = Q/V\) da la fórmula.`,
          R`Es lo mismo que dos capacitores en serie, \(C_{diel} = \varepsilon_0\varepsilon_rA/t\) y \(C_{aire} = \varepsilon_0A/(d - t)\).`,
        ],
        simbolos: [
          [R`t`, 'espesor de la lámina [m]'],
          [R`d`, 'separación total entre placas [m]'],
        ],
        cuando: R`<p>Cuando el dieléctrico ocupa toda el área pero no todo el espesor. Recuerda que el aire se lleva la mayor parte de la tensión, por eso es el que se perfora primero.</p>`,
        ejemplo: {
          q: R`Placas de 0,01 m² a 3 mm, con una lámina de 1 mm y \(\varepsilon_r = 5\). Calcula C.`,
          pasos: [
            R`Planteamiento: \(t/\varepsilon_r = 0{,}2\) mm y \(d - t = 2\) mm. Denominador: 2,2 mm.`,
            R`\(C = \dfrac{8{,}854\times10^{-12}\cdot 0{,}01}{2{,}2\times10^{-3}}\).`,
          ],
          r: R`\(C \approx 40{,}2\) pF (sin lámina sería 29,5 pF).`,
        },
        error: R`<p>Suponer que el campo es el mismo en las dos capas. Lo que se conserva en la frontera es \(D\) normal, no \(E\).</p>`,
      },
    },
    {
      id: 'c-capas-paralelo', g: 'Capacitores y dieléctricos', m: ['m212'],
      t: 'Capacitor con capas en paralelo',
      f: R`C = \frac{\varepsilon_0}{d}\left(\varepsilon_{r1}A_1 + \varepsilon_{r2}A_2\right) \qquad E_1 = E_2 = \frac{V}{d}`,
      x: {
        idea: R`<p>Dos dieléctricos lado a lado, cada uno de placa a placa. Las dos partes tienen la misma tensión, así que son dos capacitores en paralelo y sus capacitancias se suman.</p>`,
        pasos: [
          R`La tensión entre placas es la misma en ambas zonas, y la separación también: \(E_1 = E_2 = V/d\). Coincide con la condición de frontera: \(E\) tangencial continuo.`,
          R`Cada zona es un capacitor de placas: \(C_k = \varepsilon_0\varepsilon_{rk}A_k/d\).`,
          R`En paralelo se suman: \(C = C_1 + C_2\).`,
          R`La carga no se reparte parejo: \(\rho_{Sk} = D_k = \varepsilon_0\varepsilon_{rk}E\). Hay más carga frente al dieléctrico de mayor \(\varepsilon_r\).`,
        ],
        simbolos: [
          [R`A_1,\ A_2`, 'áreas de placa frente a cada dieléctrico [m²]'],
        ],
        cuando: R`<p>Cuando los dieléctricos dividen el área y cada uno ocupa todo el espesor.</p>`,
        ejemplo: {
          q: R`Placas a 2 mm. La mitad del área (0,005 m²) tiene aire y la otra mitad un dieléctrico de \(\varepsilon_r = 3\). Calcula C.`,
          pasos: [
            R`Planteamiento: \(C = \dfrac{\varepsilon_0}{d}(1\cdot 0{,}005 + 3\cdot 0{,}005)\).`,
            R`\(\dfrac{8{,}854\times10^{-12}}{2\times10^{-3}} = 4{,}427\times10^{-9}\) y el paréntesis vale 0,02.`,
          ],
          r: R`\(C \approx 88{,}5\) pF.`,
        },
        error: R`<p>Promediar las permitividades sin ponderar por el área. Cada zona aporta en proporción a su área.</p>`,
      },
    },
    {
      id: 'energia-campo', g: 'Capacitores y dieléctricos', m: ['m212', 'm29'],
      t: 'Energía en el campo eléctrico',
      f: R`W = \tfrac12 CV^2 = \int_v \tfrac12\varepsilon E^2\,dv \qquad u_e = \tfrac12\varepsilon E^2`,
      x: {
        idea: R`<p>La energía de un capacitor cargado no está en las placas: está repartida en el espacio donde hay campo. Cada metro cúbico con campo \(E\) guarda \(\tfrac12\varepsilon E^2\) joules.</p>`,
        pasos: [
          R`Placas paralelas: \(C = \varepsilon A/d\) y \(V = E\,d\).`,
          R`\(W = \tfrac12 CV^2 = \tfrac12\dfrac{\varepsilon A}{d}E^2d^2 = \tfrac12\varepsilon E^2\,(A\,d)\).`,
          R`\(A\,d\) es el volumen entre placas, así que la energía por unidad de volumen es \(u_e = \tfrac12\varepsilon E^2\) (Cap. 4, lámina 45).`,
          R`Si el campo no es uniforme, integras \(u_e\) en el volumen.`,
        ],
        simbolos: [
          [R`u_e`, 'densidad de energía eléctrica [J/m³]'],
          [R`\varepsilon`, 'permitividad del medio \(\varepsilon_0\varepsilon_r\) [F/m]'],
        ],
        cuando: R`<p>Para ver en qué región se guarda la energía (por ejemplo, cuánta queda en el aire y cuánta en el dieléctrico) o para comprobar \(\tfrac12CV^2\).</p>`,
        ejemplo: {
          q: R`Placas de 0,01 m² en aire, a 1 mm, con 100 V. Calcula la energía por los dos caminos.`,
          pasos: [
            R`\(E = 100/10^{-3} = 10^{5}\) V/m. \(u_e = \tfrac12\cdot 8{,}854\times10^{-12}\cdot 10^{10} = 0{,}0443\) J/m³. Volumen: \(10^{-5}\) m³.`,
            R`\(W = 0{,}0443\cdot 10^{-5} = 4{,}43\times10^{-7}\) J.`,
            R`Comprobación: \(C = 88{,}5\) pF, \(\tfrac12CV^2 = 0{,}5\cdot 88{,}5\times10^{-12}\cdot 10^{4} = 4{,}43\times10^{-7}\) J.`,
          ],
          r: R`\(W \approx 0{,}443\) µJ por los dos caminos.`,
        },
        error: R`<p>Usar \(\varepsilon_0\) en una región con dieléctrico. En cada región va su propia permitividad.</p>`,
      },
    },
    {
      id: 'dielectricos', g: 'Capacitores y dieléctricos', m: ['m212'],
      t: 'Polarización, D y carga ligada',
      f: R`\vec D = \varepsilon_0\vec E + \vec P \qquad \vec P = \chi_E\varepsilon_0\vec E \qquad \varepsilon_r = 1 + \chi_E \qquad \rho_{s,b} = P = (\varepsilon_r - 1)\varepsilon_0E`,
      x: {
        idea: R`<p>Un dieléctrico no conduce, pero sus átomos se estiran como pequeños dipolos alineados con el campo. En el interior las cargas de dipolos vecinos se cancelan; en las caras quedan cargas sin pareja, la carga ligada. Esa carga crea un campo opuesto y debilita el campo dentro del material.</p>`,
        pasos: [
          R`Modelo: cada átomo es un dipolo \(\vec p = Q\vec d\). La polarización \(\vec P\) es el momento dipolar por unidad de volumen (Cap. 4, lámina 3).`,
          R`La carga ligada que sale de una superficie cerrada es \(Q_b = -\oint\vec P\cdot d\vec s\), y en forma puntual \(\nabla\cdot\vec P = -\rho_b\).`,
          R`Gauss con toda la carga: \(\nabla\cdot(\varepsilon_0\vec E) = \rho + \rho_b = \rho - \nabla\cdot\vec P\). Juntando: \(\nabla\cdot(\varepsilon_0\vec E + \vec P) = \rho\). A eso se le llama \(\vec D\).`,
          R`En materiales lineales \(\vec P = \chi_E\varepsilon_0\vec E\), así que \(\vec D = \varepsilon_0(1 + \chi_E)\vec E = \varepsilon_0\varepsilon_r\vec E\).`,
          R`En la cara de una lámina, la carga ligada por unidad de área es la componente normal de \(\vec P\): \(\rho_{s,b} = P = (\varepsilon_r - 1)\varepsilon_0E\).`,
        ],
        simbolos: [
          [R`\vec P`, 'polarización [C/m²]'],
          [R`\vec D`, 'densidad de flujo eléctrico [C/m²]'],
          [R`\chi_E`, 'susceptibilidad eléctrica'],
          [R`\rho_b,\ \rho_{s,b}`, 'carga ligada por volumen [C/m³] y por área [C/m²]'],
        ],
        cuando: R`<p>\(\vec D\) solo "ve" la carga libre, por eso con Gauss para \(\vec D\) no necesitas conocer la carga ligada. Después pasas a \(\vec E\) dividiendo por \(\varepsilon\).</p>`,
        ejemplo: {
          q: R`En un dieléctrico de \(\varepsilon_r = 4\) el campo es 2400 V/m. Calcula \(P\), \(D\) y la carga ligada en su cara.`,
          pasos: [
            R`\(P = (4 - 1)\cdot 8{,}854\times10^{-12}\cdot 2400 = 6{,}37\times10^{-8}\) C/m².`,
            R`\(D = 4\cdot 8{,}854\times10^{-12}\cdot 2400 = 8{,}50\times10^{-8}\) C/m².`,
            R`Comprobación: \(\varepsilon_0E + P = 2{,}12\times10^{-8} + 6{,}37\times10^{-8} = 8{,}50\times10^{-8}\).`,
          ],
          r: R`\(P = \rho_{s,b} \approx 63{,}7\) nC/m² y \(D \approx 85{,}0\) nC/m².`,
        },
        error: R`<p>Usar \(\varepsilon_r\) en vez de \(\varepsilon_r - 1\) para la carga ligada. En el vacío (\(\varepsilon_r = 1\)) no hay nada que polarizar y \(P = 0\).</p>`,
      },
    },
    {
      id: 'borde', g: 'Capacitores y dieléctricos', m: ['m212'],
      t: 'Condiciones de frontera entre dieléctricos',
      f: R`E_{tan1} = E_{tan2} \qquad D_{n1} - D_{n2} = \rho_S \quad (\rho_S = 0 \Rightarrow D_{n1} = D_{n2})`,
      x: {
        idea: R`<p>Al cruzar de un material a otro, la parte del campo paralela a la frontera se mantiene, y la parte perpendicular de \(\vec D\) solo cambia si hay carga libre en la frontera. Con estas dos reglas pasas el campo de una región a la otra.</p>`,
        pasos: [
          R`Tangencial: toma un rectángulo muy delgado que cruza la frontera. Como \(\oint\vec E\cdot d\vec l = 0\) y los lados cortos no aportan, \(E_{tan1}\Delta w - E_{tan2}\Delta w = 0\) (Cap. 4, láminas 10 y 11).`,
          R`Normal: toma un cilindro muy chato que cruza la frontera. Gauss para \(\vec D\): solo cuentan las tapas, \(D_{n1}\Delta S - D_{n2}\Delta S = \rho_S\Delta S\).`,
          R`Entre dos dieléctricos sin carga libre, \(\rho_S = 0\) y \(D_n\) es continuo. Entonces \(\varepsilon_1E_{n1} = \varepsilon_2E_{n2}\): el campo normal salta.`,
          R`En la cara de un conductor: \(E_{tan} = 0\) y \(D_n = \rho_S\).`,
        ],
        simbolos: [
          [R`E_{tan}`, 'componente paralela a la frontera [V/m]'],
          [R`D_n`, 'componente normal de D [C/m²]'],
          [R`\rho_S`, 'carga libre por unidad de área en la frontera [C/m²]'],
        ],
        cuando: R`<p>Capacitores con varios dieléctricos y cualquier problema con dos materiales. Capas en serie: usas \(D_n\) continuo. Capas en paralelo: \(E_{tan}\) continuo.</p>`,
        ejemplo: {
          q: R`Campo perpendicular a una frontera aire-dieléctrico (\(\varepsilon_r = 4\)), sin carga libre. Si en el dieléctrico \(E = 2400\) V/m, ¿cuánto vale en el aire?`,
          pasos: [
            R`Planteamiento: \(D_n\) continuo: \(\varepsilon_0E_{aire} = 4\varepsilon_0E_{diel}\).`,
            R`\(E_{aire} = 4\cdot 2400\).`,
          ],
          r: R`\(E_{aire} = 9600\) V/m.`,
        },
        error: R`<p>Decir que \(\vec E\) es continuo en todas sus componentes. Solo la tangencial lo es; la normal salta en un factor \(\varepsilon_2/\varepsilon_1\).</p>`,
      },
    },
  );
})(typeof window !== 'undefined' ? window : globalThis);

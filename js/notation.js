/**
 * notation.js
 * Notación del curso EIE2211 tal como aparece en los apuntes (Cap. 3, 4 y 7),
 * el formulario del profesor Villarroel, la guía de circuitos y el libro de
 * ejercicios. Cada símbolo indica en qué módulos se usa (m) y, si los apuntes
 * lo escriben distinto, la variante (v). Solo datos: el panel lo dibuja panel.js.
 */
(function (root) {
  'use strict';

  const ALL = ['m21', 'm22', 'm23', 'm24', 'm25', 'm26', 'm27', 'm28', 'm29', 'm210', 'm211', 'm212'];
  const CIRC = ['m22', 'm23', 'm24', 'm25', 'm26', 'm27', 'm28', 'm29', 'm210'];

  /* Reglas de escritura que valen para todo el ramo. */
  const conventions = [
    { t: 'Unidades entre corchetes', d: 'Los apuntes y la pauta escriben la unidad entre corchetes: \\(I = 2\\ [\\mathrm{A}]\\), \\(V_0 = 6\\ [\\mathrm{V}]\\). En la prueba hazlo igual.' },
    { t: 'Variable o unidad', d: 'La variable va en cursiva y la unidad en letra recta. \\(A\\) cursiva puede ser un área; A recta es el ampere. Si en el papel no se distinguen, escribe el área como \\(S\\) (así lo hace el Cap. 3).' },
    { t: 'Diferencia de potencial', d: '\\(V_{ab} = V_a - V_b\\): el primer subíndice es el punto que se supone de mayor potencial. Si sale negativo, el punto b está más alto.' },
    { t: 'Referencia pasiva', d: 'Con la corriente entrando por el terminal +, \\(p = v\\,i\\). Si \\(p > 0\\) el elemento recibe energía; si \\(p < 0\\) la entrega. El Cap. 3 la llama convención de las direcciones de referencia asociadas.' },
    { t: 'Corriente convencional', d: 'Se dibuja como si se movieran cargas positivas, del potencial alto al bajo, en el sentido de \\(\\vec E\\). Los electrones reales van al revés.' },
    { t: 'Mallas y nodos', d: 'Corrientes de malla en sentido horario. Tensiones de nodo medidas respecto de la tierra (0 V).' },
    { t: 'Subíndice est', d: '"est" abrevia electrostático. \\(\\vec E_{\\text{est}}\\) es el campo de las cargas y \\(W_{\\text{no est}}\\) el trabajo de la fuerza no electrostática de una fuente (módulo 2.2).' },
  ];

  const groups = [
    {
      id: 'carga', title: 'Carga y corriente', src: 'Cap. 3, láminas 2 a 7',
      items: [
        { s: 'Q,\\ q', n: 'carga eléctrica', u: 'C', m: ['m21', 'm23', 'm29', 'm212'] },
        { s: '\\rho', n: 'densidad volumétrica de carga libre', u: 'C/m³', m: ['m21', 'm23'], v: 'El formulario la escribe \\(\\rho_v\\); para líneas y superficies usa \\(\\rho_\\ell\\) [C/m] y \\(\\rho_s\\) [C/m²].' },
        { s: 'I', n: 'intensidad de corriente (escalar)', u: 'A', m: ALL, v: 'En circuitos con valores que cambian en el tiempo se usa minúscula: \\(i(t)\\).' },
        { s: '\\vec J', n: 'densidad de corriente (vector)', u: 'A/m²', m: ['m21', 'm23', 'm211'] },
        { s: 'd\\vec s', n: 'elemento de superficie, normal hacia afuera', u: 'm²', m: ['m21', 'm23', 'm211'], v: 'La pauta del certamen escribe \\(d\\vec A\\) en la ley de Gauss.' },
        { s: 'S', n: 'sección (área transversal) del conductor', u: 'm²', m: ['m21', 'm211'], v: 'El Cap. 4 usa \\(A\\) para el área de las placas; el formulario usa \\(S\\) en ambos casos.' },
        { s: 'I_{\\text{neta}} = \\oint_S \\vec J\\cdot d\\vec s', n: 'corriente neta que sale de una superficie cerrada', u: 'A', m: ['m23'], v: 'Positiva si sale carga. Es el principio de continuidad del Cap. 3.' },
      ],
    },
    {
      id: 'conductores', title: 'Conductores y resistencia', src: 'Cap. 3, láminas 10 a 20 y 40',
      items: [
        { s: 'q_e', n: 'magnitud de la carga del electrón, \\(1{,}602\\times10^{-19}\\)', u: 'C', m: ['m21'] },
        { s: '\\rho_e', n: 'densidad de electrones de conducción (es carga por volumen y es negativa)', u: 'C/m³', m: ['m21'], v: 'Algunos libros usan \\(n\\,q\\) con \\(n\\) en electrones/m³; \\(\\rho_e = -n\\,q_e\\).' },
        { s: '\\vec U_d', n: 'velocidad de deriva', u: 'm/s', m: ['m21'], v: 'En libros de física general: velocidad de arrastre \\(v_d\\).' },
        { s: '\\mu_e', n: 'movilidad del electrón', u: 'm²/(V·s)', m: ['m21'] },
        { s: '\\rho_h,\\ \\mu_h', n: 'densidad y movilidad de los huecos (semiconductores)', u: 'C/m³, m²/(V·s)', m: ['m21'] },
        { s: '\\sigma', n: 'conductividad', u: 'S/m', m: ['m21', 'm211'] },
        { s: '\\rho_\\Omega', n: 'resistividad, \\(1/\\sigma\\)', u: 'Ω·m', m: ['m21'], v: 'Lleva subíndice Ω para no confundirla con la densidad de carga \\(\\rho\\).' },
        { s: 'L', n: 'largo del conductor', u: 'm', m: ['m21', 'm211'], v: 'El formulario usa \\(\\ell\\). Ojo: en el módulo 2.10 \\(L\\) es la inductancia.' },
        { s: 'R', n: 'resistencia', u: 'Ω', m: ALL },
        { s: 'G', n: 'conductancia, \\(1/R\\)', u: 'S (siemens)', m: ['m21', 'm27'] },
        { s: 'a,\\ b', n: 'radios interno y externo (coaxial, esferas)', u: 'm', m: ['m211', 'm212'] },
      ],
    },
    {
      id: 'potencial', title: 'Campo, potencial y energía', src: 'Cap. 2 y Cap. 3, láminas 35 y 36',
      items: [
        { s: '\\vec E', n: 'intensidad de campo eléctrico', u: 'V/m = N/C', m: ALL },
        { s: 'V_a', n: 'potencial del punto a (respecto de tierra)', u: 'V', m: ['m23', 'm24', 'm25', 'm27'] },
        { s: 'V_{ab}', n: 'diferencia de potencial \\(V_a - V_b = \\int_a^b \\vec E\\cdot d\\vec l\\)', u: 'V', m: ['m21', 'm22', 'm24', 'm28'], v: 'El formulario la escribe \\(V_{AB}\\) con mayúsculas.' },
        { s: 'd\\vec l', n: 'elemento de camino', u: 'm', m: ['m21', 'm22', 'm24'], v: 'El formulario usa \\(d\\vec\\ell\\).' },
        { s: 'p(t)', n: 'potencia instantánea \\(v(t)\\,i(t)\\)', u: 'W', m: ALL },
        { s: 'P', n: 'potencia en régimen continuo (DC)', u: 'W', m: ALL },
        { s: 'W', n: 'energía o trabajo', u: 'J', m: ['m21', 'm22', 'm29', 'm210', 'm212'], v: 'El Cap. 4 escribe la energía del condensador como \\(U\\) o \\(\\mathcal E_E\\); el Cap. 7, la del inductor como \\(\\mathcal E_M\\); el formulario, \\(W_m\\).' },
        { s: '\\varepsilon_0', n: 'permitividad del vacío, \\(8{,}854\\times10^{-12}\\)', u: 'F/m', m: ['m23', 'm212'], v: 'El Cap. 4 la escribe \\(\\epsilon_0\\); es la misma letra. El formulario la aproxima como \\(10^{-9}/36\\pi\\).' },
      ],
    },
    {
      id: 'fuentes', title: 'Fuentes', src: 'Cap. 3 y Cap. 7; libro de ejercicios',
      items: [
        { s: '\\varepsilon', n: 'fuerza electromotriz (fem): energía por unidad de carga que entrega la fuente', u: 'V', m: CIRC, v: 'El libro de ejercicios usa \\(\\xi\\); el formulario escribe f.e.m o \\(V_{fe}\\). No confundir con la permitividad \\(\\varepsilon\\) del módulo 2.12.' },
        { s: '\\vec f_s', n: 'fuerza no electrostática por unidad de carga dentro de la fuente', u: 'N/C', m: ['m22'] },
        { s: 'W_{\\text{no est}}', n: 'trabajo de la fuerza no electrostática (química) sobre la carga', u: 'J', m: ['m22'] },
        { s: 'r', n: 'resistencia interna de la fuente', u: 'Ω', m: ['m22'] },
        { s: 'I_{cc}', n: 'corriente de cortocircuito', u: 'A', m: ['m22', 'm28'] },
        { s: 'I_s,\\ V_s', n: 'fuente independiente de corriente o de tensión', u: 'A, V', m: ['m23', 'm26', 'm27', 'm28'] },
        { s: '4\\,i_x,\\ 2V_0', n: 'fuente dependiente: su valor depende de otra variable del circuito', u: 'V o A', m: ['m26', 'm27'], v: 'Así aparecen en la guía de circuitos del curso (problemas 5 a 10).' },
      ],
    },
    {
      id: 'redes', title: 'Kirchhoff y métodos de análisis', src: 'Cap. 3, láminas 33 y 34; guía de circuitos',
      items: [
        { s: '\\sum I = 0', n: 'ley de corrientes (LCK), con signo según entra o sale', u: 'A', m: ['m23', 'm27'] },
        { s: '\\sum \\Delta V = 0', n: 'ley de voltajes (LVK) en un lazo cerrado', u: 'V', m: ['m24', 'm26'], v: 'El formulario la escribe \\(\\sum V - \\sum RI = 0\\).' },
        { s: 'R_{eq}', n: 'resistencia equivalente', u: 'Ω', m: ['m25', 'm28'], v: 'El Cap. 3 la llama \\(R_O\\).' },
        { s: 'I_0,\\ V_0,\\ i_x,\\ V_x', n: 'incógnitas que marca el enunciado en la figura', u: 'A, V', m: ['m26', 'm27'], v: 'Notación de la guía de circuitos.' },
        { s: 'I_1,\\ I_2', n: 'corrientes de malla (horarias)', u: 'A', m: ['m26'] },
        { s: 'R_{11},\\ R_{12}', n: 'suma de resistencias de la malla 1; resistencia compartida entre mallas 1 y 2', u: 'Ω', m: ['m26'] },
        { s: 'V_1,\\ V_2', n: 'tensiones de nodo respecto de tierra', u: 'V', m: ['m27'] },
        { s: 'R_{ab},\\ R_a', n: 'resistencia del triángulo entre a y b; resistencia de la estrella en el nodo a', u: 'Ω', m: ['m25'] },
        { s: '\\Sigma', n: 'suma de las tres resistencias del triángulo', u: 'Ω', m: ['m25'] },
      ],
    },
    {
      id: 'teoremas', title: 'Teoremas de redes', src: 'Módulo 2.8',
      items: [
        { s: 'V_{th}', n: 'tensión de Thévenin (en circuito abierto)', u: 'V', m: ['m28'] },
        { s: 'R_{th}', n: 'resistencia de Thévenin (fuentes independientes apagadas)', u: 'Ω', m: ['m28', 'm29', 'm210'] },
        { s: 'I_N', n: 'corriente de Norton (en cortocircuito)', u: 'A', m: ['m28'] },
        { s: 'R_L', n: 'resistencia de carga', u: 'Ω', m: ['m28'] },
        { s: '\\eta', n: 'eficiencia: potencia útil sobre potencia entregada', u: '%', m: ['m28'] },
      ],
    },
    {
      id: 'capacitores', title: 'Capacitores y dieléctricos', src: 'Cap. 4',
      items: [
        { s: 'C', n: 'capacitancia, \\(Q/V\\)', u: 'F', m: ['m29', 'm212'] },
        { s: 'C_{eq}', n: 'capacitancia equivalente', u: 'F', m: ['m29', 'm212'] },
        { s: 'v_C,\\ i_C', n: 'tensión y corriente del capacitor', u: 'V, A', m: ['m29'] },
        { s: 'A', n: 'área de cada placa', u: 'm²', m: ['m212'], v: 'El formulario usa \\(S\\). No es el ampere.' },
        { s: 'd,\\ t', n: 'separación entre placas; espesor de la lámina dieléctrica', u: 'm', m: ['m212'] },
        { s: '\\varepsilon_r', n: 'permitividad relativa (sin unidad)', u: '—', m: ['m212'], v: 'El Cap. 4 escribe \\(\\epsilon_r\\); el libro de ejercicios la llama constante dieléctrica \\(K\\).' },
        { s: '\\varepsilon = \\varepsilon_0\\varepsilon_r', n: 'permitividad del material', u: 'F/m', m: ['m212'] },
        { s: '\\chi_E', n: 'susceptibilidad eléctrica, \\(\\varepsilon_r - 1\\)', u: '—', m: ['m212'], v: 'El formulario la escribe \\(\\chi_e\\).' },
        { s: '\\vec D', n: 'densidad de flujo eléctrico', u: 'C/m²', m: ['m212'] },
        { s: '\\vec P', n: 'polarización: momento dipolar por unidad de volumen', u: 'C/m²', m: ['m212'] },
        { s: '\\rho_b', n: 'densidad volumétrica de carga ligada, \\(-\\nabla\\cdot\\vec P\\)', u: 'C/m³', m: ['m212'] },
        { s: '\\rho_{s,b}', n: 'carga ligada por unidad de área en la cara del dieléctrico', u: 'C/m²', m: ['m212'] },
        { s: 'D_n,\\ E_{tan}', n: 'componente normal y tangencial en una frontera', u: 'C/m², V/m', m: ['m212'] },
      ],
    },
    {
      id: 'inductancia', title: 'Inductancia', src: 'Cap. 7',
      items: [
        { s: '\\Phi', n: 'flujo magnético', u: 'Wb', m: ['m210'], v: 'El formulario usa \\(\\phi\\) minúscula.' },
        { s: 'N', n: 'número de vueltas de la bobina', u: '—', m: ['m210'] },
        { s: '\\lambda', n: 'flujo enlazado, \\(N\\Phi = L\\,i\\)', u: 'Wb', m: ['m210'], v: 'Los apuntes no le dan letra propia: escriben \\(N\\Phi\\).' },
        { s: 'L', n: 'inductancia (autoinductancia)', u: 'H', m: ['m210'] },
        { s: 'M', n: 'inductancia mutua', u: 'H', m: ['m210'] },
        { s: 'v_L,\\ i_L', n: 'tensión y corriente del inductor', u: 'V, A', m: ['m210'] },
        { s: '\\vec B,\\ \\mu', n: 'densidad de flujo magnético; permeabilidad', u: 'T, H/m', m: ['m210'] },
      ],
    },
    {
      id: 'transitorios', title: 'Transitorios', src: 'Módulos 2.9 y 2.10',
      items: [
        { s: '\\tau', n: 'constante de tiempo (\\(R_{th}C\\) o \\(L/R_{th}\\))', u: 's', m: ['m29', 'm210'] },
        { s: '0^-,\\ 0^+', n: 'instante justo antes y justo después de mover el interruptor', u: 's', m: ['m29', 'm210'] },
        { s: 'x(\\infty)', n: 'valor final, en régimen permanente', u: 'según la variable', m: ['m29', 'm210'] },
      ],
    },
  ];

  const api = { ALL, conventions, groups };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Notation = api;
})(typeof window !== 'undefined' ? window : globalThis);

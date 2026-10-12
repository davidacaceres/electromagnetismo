/**
 * circuits.js
 * Descripción de cada diagrama como datos para Schematic.render().
 * Las claves coinciden con el atributo data-circuit de cada <figure>.
 * Convención de fuentes: la placa larga y el "+" marcan el terminal positivo.
 */
(function (global) {
  'use strict';

  /* Batería real (ε, r) alimentando una carga R. */
  const fuenteReal = (e = 'ε', r = 'r', R = 'R') => ({
    w: 380, h: 210, title: 'Batería real con resistencia interna conectada a una carga',
    parts: [
      { t: 'V', a: [60, 160], b: [60, 60], plus: 'b', label: e, side: 1, id: 'lbl-e' },
      { t: 'R', a: [60, 60], b: [180, 60], label: r, side: 1, id: 'lbl-r' },
      { t: 'W', a: [180, 60], b: [310, 60] },
      { t: 'R', a: [310, 60], b: [310, 160], label: R, side: -1, id: 'lbl-R' },
      { t: 'W', a: [310, 160], b: [60, 160] },
      { t: 'term', at: [180, 60], label: 'a', dx: -4, dy: 22 },
      { t: 'term', at: [180, 160], label: 'b', dx: -4, dy: -10 },
      { t: 'arrow', at: [250, 60], dir: 'r', label: 'I', id: 'lbl-I' },
      { t: 'text', at: [120, 200], label: 'batería real', cls: 'muted' },
    ],
  });

  /* Nodo con tres ramas a tierra (LCK). */
  const nodo3 = (Is, R1, R2, e) => ({
    w: 400, h: 220, title: 'Nodo a con fuente de corriente y dos ramas a tierra',
    parts: [
      { t: 'I', a: [70, 170], b: [70, 50], label: Is, side: 1 },
      { t: 'W', a: [70, 50], b: [320, 50] },
      { t: 'R', a: [200, 50], b: [200, 170], label: R1, side: -1 },
      { t: 'R', a: [320, 50], b: [320, 110], label: R2, side: -1 },
      { t: 'V', a: [320, 170], b: [320, 110], plus: 'b', label: e, side: -1 },
      { t: 'W', a: [70, 170], b: [320, 170] },
      { t: 'dot', at: [200, 50], label: 'a', dx: -4, dy: -10 },
      { t: 'gnd', at: [200, 170] },
    ],
  });

  /* Nodo con cuatro ramas (ejercicio 2.3). */
  const nodo4 = {
    w: 460, h: 220, title: 'Nodo a con fuente de corriente y tres ramas',
    parts: [
      { t: 'I', a: [60, 170], b: [60, 50], label: '6 A', side: 1 },
      { t: 'W', a: [60, 50], b: [390, 50] },
      { t: 'R', a: [170, 50], b: [170, 170], label: '3 Ω', side: -1 },
      { t: 'R', a: [280, 50], b: [280, 170], label: '6 Ω', side: -1 },
      { t: 'R', a: [390, 50], b: [390, 110], label: '2 Ω', side: -1 },
      { t: 'V', a: [390, 170], b: [390, 110], plus: 'b', label: '4 V', side: -1 },
      { t: 'W', a: [60, 170], b: [390, 170] },
      { t: 'dot', at: [170, 50], label: 'a', dx: -4, dy: -10 },
      { t: 'gnd', at: [225, 170] },
    ],
  };

  /* Lazo simple con dos fuentes enfrentadas (LVK). Puntos a…e en orden horario. */
  const lazo = (e1, R1, e2, R2, R3) => ({
    w: 420, h: 220, title: 'Lazo simple con dos fuentes y tres resistencias',
    parts: [
      { t: 'V', a: [60, 170], b: [60, 50], plus: 'b', label: e1, side: 1, id: 'lz-e1' },
      { t: 'R', a: [60, 50], b: [200, 50], label: R1, side: 1, id: 'lz-R1' },
      { t: 'V', a: [200, 50], b: [360, 50], plus: 'a', label: e2, side: 1, id: 'lz-e2' },
      { t: 'R', a: [360, 50], b: [360, 170], label: R2, side: -1, id: 'lz-R2' },
      { t: 'R', a: [360, 170], b: [60, 170], label: R3, side: 1, id: 'lz-R3' },
      { t: 'dot', at: [60, 170], label: 'a', dx: -14, dy: 16 },
      { t: 'dot', at: [60, 50], label: 'b', dx: -14, dy: -8 },
      { t: 'dot', at: [200, 50], label: 'c', dx: -4, dy: -12 },
      { t: 'dot', at: [360, 50], label: 'd', dx: 8, dy: -8 },
      { t: 'dot', at: [360, 170], label: 'e', dx: 8, dy: 16 },
      { t: 'loop', at: [210, 112], label: 'I', r: 24 },
    ],
  });

  /* Lazo con dos baterías reales (ejercicio 2.4). */
  const lazoBaterias = {
    w: 440, h: 230, title: 'Dos baterías reales en un lazo',
    parts: [
      { t: 'V', a: [60, 180], b: [60, 110], plus: 'b', label: 'ε₁ = 20 V', side: 1 },
      { t: 'R', a: [60, 110], b: [60, 40], label: 'r₁ = 1 Ω', side: 1 },
      { t: 'R', a: [60, 40], b: [220, 40], label: 'R₁ = 4 Ω', side: 1 },
      { t: 'V', a: [220, 40], b: [310, 40], plus: 'a', label: 'ε₂ = 6 V', side: 1 },
      { t: 'R', a: [310, 40], b: [380, 40], label: 'r₂ = 0,5 Ω', side: 1, off: 22 },
      { t: 'R', a: [380, 40], b: [380, 180], label: 'R₂ = 4,5 Ω', side: -1 },
      { t: 'W', a: [380, 180], b: [60, 180] },
      { t: 'dot', at: [220, 40], label: 'p', dx: -4, dy: 22 },
      { t: 'dot', at: [380, 40], label: 'q', dx: 8, dy: -6 },
    ],
  };

  /* Desplaza horizontalmente todos los puntos de un diagrama (deja margen para etiquetas). */
  const shift = (dx, spec) => {
    const mv = q => (q ? [q[0] + dx, q[1]] : q);
    spec.parts = spec.parts.map(p => ({ ...p, a: mv(p.a), b: mv(p.b), at: mv(p.at) }));
    return spec;
  };

  /* Puente con Δ (A, c, d) que no se reduce por serie y paralelo. */
  const puente = (Rac, Rad, Rcd, RcB, RdB, V) => shift(30, {
    w: 430, h: 290, title: 'Red puente alimentada entre A y B',
    parts: [
      { t: 'R', a: [80, 140], b: [200, 50], label: Rac, side: 1 },
      { t: 'R', a: [80, 140], b: [200, 230], label: Rad, side: -1 },
      { t: 'R', a: [200, 50], b: [200, 230], label: Rcd, side: -1, off: 22 },
      { t: 'R', a: [200, 50], b: [320, 140], label: RcB, side: 1 },
      { t: 'R', a: [200, 230], b: [320, 140], label: RdB, side: -1 },
      { t: 'W', a: [80, 140], b: [40, 140] },
      { t: 'V', a: [40, 265], b: [40, 140], plus: 'b', label: V, side: 1, off: 14 },
      { t: 'W', a: [40, 265], b: [360, 265] },
      { t: 'W', a: [360, 265], b: [360, 140] },
      { t: 'W', a: [360, 140], b: [320, 140] },
      { t: 'dot', at: [80, 140], label: 'A', dx: -2, dy: -10 },
      { t: 'dot', at: [320, 140], label: 'B', dx: -12, dy: -10 },
      { t: 'dot', at: [200, 50], label: 'c', dx: 8, dy: -6 },
      { t: 'dot', at: [200, 230], label: 'd', dx: 8, dy: 16 },
    ],
  });

  /* Dos mallas: ε1 | R1 arriba | R3 central | R2 + ε2 a la derecha. */
  const dosMallas = (e1, R1, R3, R2, e2) => ({
    w: 440, h: 230, title: 'Circuito de dos mallas',
    parts: [
      { t: 'V', a: [60, 180], b: [60, 50], plus: 'b', label: e1, side: 1, id: 'dm-e1' },
      { t: 'R', a: [60, 50], b: [220, 50], label: R1, side: 1, id: 'dm-R1' },
      { t: 'W', a: [220, 50], b: [380, 50] },
      { t: 'R', a: [220, 50], b: [220, 180], label: R3, side: -1, id: 'dm-R3' },
      { t: 'R', a: [380, 50], b: [380, 115], label: R2, side: -1, id: 'dm-R2' },
      { t: 'V', a: [380, 180], b: [380, 115], plus: 'b', label: e2, side: -1, id: 'dm-e2' },
      { t: 'W', a: [60, 180], b: [380, 180] },
      { t: 'loop', at: [140, 118], label: 'I₁' },
      { t: 'loop', at: [300, 118], label: 'I₂' },
    ],
  });

  /* Supermalla: fuente de corriente en la rama compartida. */
  const supermalla = {
    w: 440, h: 230, title: 'Dos mallas con fuente de corriente compartida',
    parts: [
      { t: 'V', a: [60, 180], b: [60, 50], plus: 'b', label: '30 V', side: 1 },
      { t: 'R', a: [60, 50], b: [220, 50], label: '4 Ω', side: 1 },
      { t: 'W', a: [220, 50], b: [380, 50] },
      { t: 'I', a: [220, 50], b: [220, 180], label: '3 A', side: -1 },
      { t: 'R', a: [380, 50], b: [380, 180], label: '6 Ω', side: -1 },
      { t: 'R', a: [220, 180], b: [60, 180], label: '2 Ω', side: -1 },
      { t: 'W', a: [220, 180], b: [380, 180] },
      { t: 'dot', at: [220, 50], label: 'x', dx: -4, dy: -10 },
      { t: 'dot', at: [220, 180], label: 'y', dx: 8, dy: 16 },
      { t: 'loop', at: [140, 116], label: 'I₁' },
      { t: 'loop', at: [300, 116], label: 'I₂' },
    ],
  };

  /* Dos nodos de no referencia. */
  const dosNodos = (e, Ra, Rb, Rc, Rd, Is) => ({
    w: 500, h: 220, title: 'Circuito con dos nodos de no referencia',
    parts: [
      { t: 'V', a: [40, 175], b: [40, 50], plus: 'b', label: e, side: 1, id: 'dn-e' },
      { t: 'R', a: [40, 50], b: [180, 50], label: Ra, side: 1, id: 'dn-Ra' },
      { t: 'R', a: [180, 50], b: [180, 175], label: Rb, side: -1, id: 'dn-Rb' },
      { t: 'R', a: [180, 50], b: [340, 50], label: Rc, side: 1, id: 'dn-Rc' },
      { t: 'R', a: [340, 50], b: [340, 175], label: Rd, side: -1, id: 'dn-Rd' },
      { t: 'W', a: [340, 50], b: [460, 50] },
      { t: 'I', a: [460, 175], b: [460, 50], label: Is, side: -1, id: 'dn-Is' },
      { t: 'W', a: [40, 175], b: [460, 175] },
      { t: 'dot', at: [180, 50], label: '1', dx: -4, dy: -10 },
      { t: 'dot', at: [340, 50], label: '2', dx: -4, dy: -10 },
      { t: 'gnd', at: [260, 175] },
    ],
  });

  /* Supernodo (ejercicio 2.7). */
  const supernodo = {
    w: 520, h: 220, title: 'Circuito con supernodo',
    parts: [
      { t: 'I', a: [40, 175], b: [40, 50], label: '2 A', side: 1 },
      { t: 'W', a: [40, 50], b: [160, 50] },
      { t: 'R', a: [160, 50], b: [160, 175], label: '4 Ω', side: -1 },
      { t: 'V', a: [160, 50], b: [330, 50], plus: 'a', label: '8 V', side: 1 },
      { t: 'R', a: [330, 50], b: [330, 175], label: '8 Ω', side: -1 },
      { t: 'R', a: [330, 50], b: [470, 50], label: '4 Ω', side: 1 },
      { t: 'V', a: [470, 175], b: [470, 50], plus: 'b', label: '12 V', side: -1 },
      { t: 'W', a: [40, 175], b: [470, 175] },
      { t: 'dot', at: [160, 50], label: '1', dx: -4, dy: -10 },
      { t: 'dot', at: [330, 50], label: '2', dx: -4, dy: -10 },
      { t: 'gnd', at: [250, 175] },
    ],
  };

  /* Thévenin: ε, R1, R2 y R3 hacia los terminales a-b (opcionalmente con RL). */
  const thev = (e, R1, R2, R3, withLoad) => {
    const parts = [
      { t: 'V', a: [40, 170], b: [40, 50], plus: 'b', label: e, side: 1, id: 'th-e' },
      { t: 'R', a: [40, 50], b: [180, 50], label: R1, side: 1, id: 'th-R1' },
      { t: 'R', a: [180, 50], b: [180, 170], label: R2, side: -1, id: 'th-R2' },
      { t: 'R', a: [180, 50], b: [320, 50], label: R3, side: 1, id: 'th-R3' },
      { t: 'W', a: [40, 170], b: [320, 170] },
      { t: 'term', at: [320, 50], label: 'a', dx: -4, dy: -10 },
      { t: 'term', at: [320, 170], label: 'b', dx: -4, dy: 20 },
    ];
    if (withLoad) parts.push(
      { t: 'W', a: [320, 50], b: [400, 50] },
      { t: 'R', a: [400, 50], b: [400, 170], label: 'R_L', side: -1, id: 'th-RL', cls: 'accent' },
      { t: 'W', a: [400, 170], b: [320, 170] },
    );
    return { w: withLoad ? 480 : 380, h: 210, title: 'Red resistiva vista desde los terminales a y b', parts };
  };

  /* Thévenin con fuente de corriente (ejercicio 2.8). */
  const thevEj = {
    w: 440, h: 210, title: 'Red con fuente de tensión y fuente de corriente',
    parts: [
      { t: 'V', a: [40, 170], b: [40, 50], plus: 'b', label: '12 V', side: 1 },
      { t: 'R', a: [40, 50], b: [180, 50], label: '4 Ω', side: 1 },
      { t: 'I', a: [180, 170], b: [180, 50], label: '2 A', side: -1 },
      { t: 'W', a: [180, 50], b: [380, 50] },
      { t: 'R', a: [290, 50], b: [290, 170], label: '12 Ω', side: -1 },
      { t: 'W', a: [40, 170], b: [380, 170] },
      { t: 'term', at: [380, 50], label: 'a', dx: 8, dy: 4 },
      { t: 'term', at: [380, 170], label: 'b', dx: 8, dy: 4 },
    ],
  };

  /* Serie con interruptor: fuente, SW, R y un elemento reactivo (C o L). */
  const serieSW = (e, R, X, type) => ({
    w: 400, h: 210, title: type === 'C' ? 'Circuito RC serie' : 'Circuito RL serie',
    parts: [
      { t: 'V', a: [40, 170], b: [40, 50], plus: 'b', label: e, side: 1 },
      { t: 'SW', a: [40, 50], b: [160, 50], label: 't = 0', side: 1 },
      { t: 'R', a: [160, 50], b: [320, 50], label: R, side: 1 },
      { t: type, a: [320, 50], b: [320, 170], label: X, side: -1 },
      { t: 'W', a: [320, 170], b: [40, 170] },
    ],
  });

  /* Fuente, SW, R1 en serie y luego R2 en paralelo con C o L. */
  const paraleloSW = (e, R1, R2, X, type) => ({
    w: 460, h: 210, title: 'Transitorio con resistencia en paralelo al elemento reactivo',
    parts: [
      { t: 'V', a: [40, 170], b: [40, 50], plus: 'b', label: e, side: 1 },
      { t: 'SW', a: [40, 50], b: [140, 50], label: 't = 0', side: 1 },
      { t: 'R', a: [140, 50], b: [280, 50], label: R1, side: 1 },
      { t: 'R', a: [280, 50], b: [280, 170], label: R2, side: -1 },
      { t: 'W', a: [280, 50], b: [400, 50] },
      { t: type, a: [400, 50], b: [400, 170], label: X, side: -1 },
      { t: 'W', a: [400, 170], b: [40, 170] },
      { t: 'dot', at: [280, 50], label: 'n', dx: -4, dy: -10 },
    ],
  });

  /* Ejercicio de la clase 1: dos nodos y tres ramas en paralelo. */
  const clase1 = shift(60, {
    w: 500, h: 260, title: 'Dos nodos a y b unidos por tres ramas',
    parts: [
      { t: 'V', a: [70, 220], b: [70, 170], plus: 'b', label: 'ε₁ = 18 V', side: 1 },
      { t: 'R', a: [70, 170], b: [70, 115], label: 'r₁ = 1 Ω', side: 1, off: 22 },
      { t: 'R', a: [70, 115], b: [70, 45], label: 'R₁ = 5 Ω', side: 1 },
      { t: 'W', a: [70, 45], b: [370, 45] },
      { t: 'V', a: [220, 220], b: [220, 150], plus: 'b', label: 'ε₂ = 9 V', side: -1 },
      { t: 'R', a: [220, 150], b: [220, 45], label: 'R₂ = 3 Ω', side: -1 },
      { t: 'R', a: [370, 45], b: [370, 220], label: 'R₃ = 3 Ω', side: -1 },
      { t: 'W', a: [70, 220], b: [370, 220] },
      { t: 'dot', at: [220, 45], label: 'a', dx: -4, dy: -10 },
      { t: 'dot', at: [220, 220], label: 'b', dx: 8, dy: 16 },
    ],
  });

  global.Circuits = {
    'clase1': clase1,
    'fuente-real': fuenteReal('ε = 12 V', 'r = 0,5 Ω', 'R = 5,5 Ω'),
    'fuente-real-sim': fuenteReal('ε', 'r', 'R'),
    'nodo-ej': nodo3('Iₛ = 2 A', 'R₁ = 4 Ω', 'R₂ = 6 Ω', 'ε = 12 V'),
    'nodo-sim': nodo3('Iₛ', 'R₁', 'R₂', 'ε'),
    'nodo-prop': nodo4,
    'lazo-ej': lazo('ε₁ = 15 V', 'R₁ = 2 Ω', 'ε₂ = 4 V', 'R₂ = 5 Ω', 'R₃ = 3 Ω'),
    'lazo-prop': lazoBaterias,
    'puente-ej': puente('6 Ω', '3 Ω', '9 Ω', '7 Ω', '8,5 Ω', '12 V'),
    'puente-prop': puente('12 Ω', '6 Ω', '18 Ω', '4 Ω', '3 Ω', '24 V'),
    'mallas-ej': dosMallas('ε₁ = 10 V', 'R₁ = 2 Ω', 'R₃ = 4 Ω', 'R₂ = 6 Ω', 'ε₂ = 4 V'),
    'mallas-sim': dosMallas('ε₁', 'R₁', 'R₃', 'R₂', 'ε₂'),
    'mallas-prop': supermalla,
    'nodos-ej': dosNodos('ε = 20 V', 'R_a = 4 Ω', 'R_b = 4 Ω', 'R_c = 2 Ω', 'R_d = 4 Ω', 'Iₛ = 3 A'),
    'nodos-sim': dosNodos('ε', 'R_a', 'R_b', 'R_c', 'R_d', 'Iₛ'),
    'nodos-prop': supernodo,
    'thev-ej': thev('ε = 24 V', 'R₁ = 6 Ω', 'R₂ = 3 Ω', 'R₃ = 2 Ω', false),
    'thev-sim': thev('ε', 'R₁', 'R₂', 'R₃', true),
    'thev-prop': thevEj,
    'rc-ej': serieSW('V = 12 V', 'R = 10 kΩ', 'C = 100 µF', 'C'),
    'rc-prop': paraleloSW('18 V', 'R₁ = 6 kΩ', 'R₂ = 3 kΩ', 'C = 50 µF', 'C'),
    'rl-ej': serieSW('V = 12 V', 'R = 4 Ω', 'L = 2 H', 'L'),
    'rl-prop': paraleloSW('36 V', 'R₁ = 4 Ω', 'R₂ = 12 Ω', 'L = 0,5 H', 'L'),
  };
})(window);

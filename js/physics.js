/**
 * physics.js
 * Núcleo de cálculo del sitio. Funciones puras, sin DOM, para que se
 * puedan probar por separado (node js/physics.test.js).
 *
 * Convenciones del curso EIE2211 PUCV que se respetan aquí:
 *  - Corrientes de malla en sentido horario.
 *  - Tensiones de nodo medidas respecto de tierra (V = 0).
 *  - Potencia con referencia pasiva: p = v·i > 0 significa que el elemento absorbe.
 */
(function (global) {
  'use strict';

  /** Permitividad del vacío ε0 [F/m]. */
  const EPS0 = 8.854187817e-12;
  /** Carga elemental [C]. */
  const QE = 1.602176634e-19;

  /**
   * Resuelve A·x = b por eliminación de Gauss con pivoteo parcial.
   * Física: tanto el método de mallas (LVK) como el de nodos (LCK) terminan
   * en un sistema lineal. La linealidad viene de que los medios son óhmicos
   * (J = σE), y por eso también vale la superposición.
   * @param {number[][]} A matriz n×n (resistencias de malla o conductancias de nodo)
   * @param {number[]} b vector de fuentes
   * @returns {number[]} solución x
   */
  function solveLinear(A, b) {
    const n = b.length;
    const M = A.map((row, i) => [...row, b[i]]);
    for (let c = 0; c < n; c++) {
      let p = c;
      for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
      if (Math.abs(M[p][c]) < 1e-14) throw new Error('Sistema singular');
      [M[c], M[p]] = [M[p], M[c]];
      for (let r = c + 1; r < n; r++) {
        const f = M[r][c] / M[c][c];
        for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k];
      }
    }
    const x = new Array(n).fill(0);
    for (let r = n - 1; r >= 0; r--) {
      let s = M[r][n];
      for (let k = r + 1; k < n; k++) s -= M[r][k] * x[k];
      x[r] = s / M[r][r];
    }
    return x;
  }

  /* ---------------- 2.1 Corriente y ley de Ohm ---------------- */

  /**
   * Conductor cilíndrico de largo L, diámetro d y conductividad σ con corriente I.
   * Física: dentro del conductor el campo es uniforme, E = V/L, y la ley de Ohm
   * microscópica J = σE integrada sobre la sección da V = I·L/(σA) = I·R.
   * La velocidad de deriva sale de J = n·q·v_d.
   */
  function wire({ L, d, sigma, I, n = 8.5e28 }) {
    const A = Math.PI * (d / 2) ** 2;
    const R = L / (sigma * A);
    const V = I * R;
    const E = V / L;
    const J = I / A;
    return { A, R, V, E, J, P: I * I * R, vd: J / (n * QE) };
  }

  /* ---------------- 2.2 Fuerza electromotriz ---------------- */

  /**
   * Fuente real (ε, r) con carga R.
   * Física: la fuerza no electrostática de la batería sube a las cargas ε joules
   * por coulomb; parte se pierde en r y el resto llega a R. Por conservación de
   * la energía: ε·I = I²r + I²R.
   */
  function realSource({ emf, r, R }) {
    const I = emf / (r + R);
    return { I, Vt: emf - I * r, Ps: emf * I, Pr: I * I * r, PR: I * I * R, eta: R / (r + R) };
  }

  /* ---------------- 2.3 LCK en un nodo ---------------- */

  /**
   * Nodo a con: fuente de corriente Is entrando, R1 a tierra, y rama R2 en serie con ε
   * (+ hacia a) a tierra.
   * LCK (sale = entra): Va/R1 + (Va − ε)/R2 = Is.
   * Física: en DC la carga no se acumula en el nodo (∮J·dS = −dQ/dt = 0).
   */
  function nodeKCL({ Is, R1, R2, emf }) {
    const Va = (Is + emf / R2) / (1 / R1 + 1 / R2);
    const I1 = Va / R1;            // baja por R1
    const I2 = (emf - Va) / R2;    // sube por la rama de la fuente hacia a
    return { Va, I1, I2, sumIn: Is + I2, sumOut: I1 };
  }

  /* ---------------- 2.4 LVK en un lazo ---------------- */

  /**
   * Lazo serie: ε1 (impulsa horario), R1, ε2 (se opone), R2, R3.
   * LVK: ε1 − I·R1 − ε2 − I·R2 − I·R3 = 0.
   * Devuelve además el perfil de potencial a lo largo del lazo, que es la
   * "altura" de la carga en cada punto: ∮E·dl = 0 obliga a volver a la altura inicial.
   */
  function seriesLoop({ e1, e2, R1, R2, R3 }) {
    const I = (e1 - e2) / (R1 + R2 + R3);
    const steps = [
      { name: 'ε₁', dV: +e1, kind: 'src' },
      { name: 'R₁', dV: -I * R1, kind: 'res' },
      { name: 'ε₂', dV: -e2, kind: 'src' },
      { name: 'R₂', dV: -I * R2, kind: 'res' },
      { name: 'R₃', dV: -I * R3, kind: 'res' },
    ];
    let v = 0;
    const profile = [{ label: 'a', V: 0 }];
    steps.forEach((s, i) => { v += s.dV; profile.push({ label: String.fromCharCode(98 + i), V: v, via: s }); });
    profile[profile.length - 1].label = 'a';
    return { I, steps, profile };
  }

  /* ---------------- 2.5 Δ ↔ Y ---------------- */

  /**
   * Transformación triángulo → estrella. Ra está conectada al nodo a, etc.
   * Física: dos redes son equivalentes si entre cada par de terminales presentan
   * la misma resistencia (misma relación V–I vista desde afuera).
   */
  function deltaToY({ Rab, Rbc, Rca }) {
    const S = Rab + Rbc + Rca;
    return { Ra: (Rab * Rca) / S, Rb: (Rab * Rbc) / S, Rc: (Rbc * Rca) / S };
  }
  function yToDelta({ Ra, Rb, Rc }) {
    const P = Ra * Rb + Rb * Rc + Rc * Ra;
    return { Rab: P / Rc, Rbc: P / Ra, Rca: P / Rb };
  }

  /* ---------------- 2.6 Mallas ---------------- */

  /**
   * Dos mallas horarias. Rama izquierda: ε1 (+ arriba). Rama superior: R1.
   * Rama central compartida: R3. Rama derecha: R2 en serie con ε2 (+ arriba).
   * Malla 1: (R1+R3)I1 − R3·I2 = ε1
   * Malla 2: −R3·I1 + (R2+R3)I2 = −ε2
   */
  function twoMesh({ e1, e2, R1, R2, R3 }) {
    const A = [[R1 + R3, -R3], [-R3, R2 + R3]];
    const b = [e1, -e2];
    const [I1, I2] = solveLinear(A, b);
    const P_e1 = e1 * I1;           // entregada (I1 sale por +)
    const P_e2 = -e2 * I2;          // entregada; negativa = absorbe (se carga)
    const P_R = R1 * I1 ** 2 + R2 * I2 ** 2 + R3 * (I1 - I2) ** 2;
    return { A, b, I1, I2, I3: I1 - I2, P_e1, P_e2, P_R };
  }

  /* ---------------- 2.7 Nodos ---------------- */

  /**
   * Dos nodos de no referencia.
   * Nodo 1: ε a través de Ra; Rb a tierra; Rc hacia nodo 2.
   * Nodo 2: Rd a tierra; fuente de corriente Is entrando.
   * G·V = i (matriz de conductancias por inspección).
   */
  function twoNode({ emf, Is, Ra, Rb, Rc, Rd }) {
    const G = [[1 / Ra + 1 / Rb + 1 / Rc, -1 / Rc], [-1 / Rc, 1 / Rc + 1 / Rd]];
    const i = [emf / Ra, Is];
    const [V1, V2] = solveLinear(G, i);
    return { G, i, V1, V2, Ia: (emf - V1) / Ra, Ib: V1 / Rb, Ic: (V1 - V2) / Rc, Id: V2 / Rd };
  }

  /* ---------------- 2.8 Thévenin ---------------- */

  /**
   * ε con R1 hacia el nodo a, R2 de a a tierra, R3 de a al terminal de salida.
   * Vth = ε·R2/(R1+R2) (circuito abierto), Rth = R1‖R2 + R3 (fuentes apagadas).
   * Potencia en la carga: P = Vth²·RL/(Rth+RL)², máxima en RL = Rth.
   */
  function thevenin({ emf, R1, R2, R3 }) {
    const Vth = (emf * R2) / (R1 + R2);
    const Rth = (R1 * R2) / (R1 + R2) + R3;
    return { Vth, Rth, In: Vth / Rth, Pmax: (Vth * Vth) / (4 * Rth) };
  }
  function loadPower(Vth, Rth, RL) {
    const I = Vth / (Rth + RL);
    return { I, V: I * RL, P: I * I * RL };
  }

  /* ---------------- 2.9 RC ---------------- */

  /**
   * Carga y descarga de un condensador a través de R.
   * Física: LVK con v_C = q/C da R·dq/dt + q/C = V, cuya solución es exponencial
   * con τ = RC. La energía (1/2)CV² queda guardada en el campo eléctrico entre
   * las placas; durante una carga completa R disipa exactamente la misma cantidad.
   */
  function rc({ V, R, C, t, mode = 'carga' }) {
    const tau = R * C;
    const e = Math.exp(-t / tau);
    const vC = mode === 'carga' ? V * (1 - e) : V * e;
    const i = (mode === 'carga' ? 1 : -1) * (V / R) * e;
    return { tau, vC, i, W: 0.5 * C * vC * vC, Wfinal: 0.5 * C * V * V };
  }

  /* ---------------- 2.10 RL ---------------- */

  /**
   * Energización de una inductancia por una fuente V a través de R.
   * Física: la ley de Faraday da v_L = L·di/dt, que se opone al cambio de flujo.
   * LVK: V = R·i + L·di/dt, con τ = L/R. La energía (1/2)L·i² queda en el campo magnético.
   */
  function rl({ V, R, L, t, mode = 'carga' }) {
    const tau = L / R;
    const e = Math.exp(-t / tau);
    const Iinf = V / R;
    const i = mode === 'carga' ? Iinf * (1 - e) : Iinf * e;
    const vL = (mode === 'carga' ? 1 : -1) * V * e;
    return { tau, i, vL, W: 0.5 * L * i * i, Wfinal: 0.5 * L * Iinf * Iinf };
  }

  /* ---------------- 2.11 Geometrías no uniformes ---------------- */

  /**
   * Resistencia radial de un coaxial (corriente del conductor interno al externo).
   * Física: la corriente total I atraviesa cilindros de área 2πrL, así que
   * J = I/(2πrL), E = J/σ ∝ 1/r, y V = ∫E·dr = I·ln(b/a)/(2πσL).
   */
  function coaxialRadial({ a, b, sigma, L }) {
    const R = Math.log(b / a) / (2 * Math.PI * sigma * L);
    return { R, Eof: (r, V) => V / (r * Math.log(b / a)) };
  }
  /** Cascarones esféricos concéntricos: R = (1/a − 1/b)/(4πσ). */
  function sphericalShell({ a, b, sigma }) {
    return { R: (1 / a - 1 / b) / (4 * Math.PI * sigma) };
  }

  /* ---------------- 2.12 Capacitancia con dieléctricos ---------------- */

  /**
   * Placas paralelas (área A, separación d) con una lámina dieléctrica de espesor t
   * y permitividad relativa εr, el resto aire. Las dos capas quedan en serie.
   * Física: D es continuo en la interfaz (no hay carga libre ahí), así que
   * E_aire = εr·E_diel. C = ε0·A / (t/εr + (d − t)).
   */
  function slabCapacitor({ A, d, t, er, V }) {
    const C = (EPS0 * A) / (t / er + (d - t));
    const Q = C * V;
    const D = Q / A;
    const Eair = D / EPS0;
    const Ediel = D / (EPS0 * er);
    return { C, Q, D, Eair, Ediel, W: 0.5 * C * V * V };
  }

  const Physics = {
    EPS0, QE, solveLinear, wire, realSource, nodeKCL, seriesLoop, deltaToY, yToDelta,
    twoMesh, twoNode, thevenin, loadPower, rc, rl, coaxialRadial, sphericalShell, slabCapacitor,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = Physics;
  else global.Physics = Physics;
})(typeof window !== 'undefined' ? window : globalThis);

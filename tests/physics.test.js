// Pruebas de los resultados numéricos que aparecen en los ejemplos y pautas.
// Ejecutar con: node tests/physics.test.js
const P = require('../js/physics.js');
const assert = require('assert');
const near = (a, b, tol = 1e-3) => assert.ok(Math.abs(a - b) <= tol * Math.max(1, Math.abs(b)), `${a} != ${b}`);

const w = P.wire({ L: 1, S: 1e-6, sigma: 5.8e7, I: 1 });   // ejemplo de la lección 2.1
near(w.R, 0.017241); near(w.E, 0.017241); near(w.rhoE, -1.3617e10); near(w.Ud, -7.3438e-5); near(w.mu, 4.2594e-3);
near(P.realSource({ emf: 12, r: 0.5, R: 5.5 }).I, 2);
near(P.nodeKCL({ Is: 2, R1: 4, R2: 6, emf: 12 }).Va, 9.6);
near(P.seriesLoop({ e1: 15, e2: 4, R1: 2, R2: 5, R3: 3 }).I, 1.1);
const y = P.deltaToY({ Rab: 6, Rbc: 9, Rca: 3 }); near(y.Ra, 1); near(y.Rb, 3); near(y.Rc, 1.5);
const m = P.twoMesh({ e1: 10, e2: 4, R1: 2, R2: 6, R3: 4 }); near(m.I1, 21 / 11); near(m.I2, 4 / 11);
near(m.P_e1 + m.P_e2, m.P_R);
const n = P.twoNode({ emf: 20, Is: 3, Ra: 4, Rb: 4, Rc: 2, Rd: 4 }); near(n.V1, 10.5); near(n.V2, 11);
const t = P.thevenin({ emf: 24, R1: 6, R2: 3, R3: 2 }); near(t.Vth, 8); near(t.Rth, 4); near(t.Pmax, 4);
near(P.rc({ V: 12, R: 1e4, C: 1e-4, t: 2 }).vC, 10.376);
near(P.rl({ V: 12, R: 4, L: 2, t: 0.5 }).i, 1.8964);
near(P.coaxialRadial({ a: 1e-3, b: 4e-3, sigma: 1e-4, L: 1 }).R, 2206.356);
near(P.sphericalShell({ a: 0.02, b: 0.06, sigma: 0.01 }).R, 265.258);
near(P.slabCapacitor({ A: 0.01, d: 2e-3, t: 1e-3, er: 4, V: 12 }).C, 70.8335e-12);
near(P.solveLinear([[2, 1], [1, 3]], [3, 5])[0], 0.8);
console.log('physics.js: todas las pruebas pasaron');

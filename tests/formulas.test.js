// Pruebas del panel de notación y del formulario.
// Ejecutar con: node tests/formulas.test.js
// Revisa la estructura de los datos, que los enlaces "Explicar" de index.html apunten
// a fórmulas que existen y recalcula los números de los ejemplos de cada explicación.
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const N = require('../js/notation.js');
['f1-corriente', 'f2-fuentes-kirchhoff', 'f3-metodos-transitorios', 'f4-campos-materiales']
  .forEach(f => require(`../js/formulas/${f}.js`));
const F = globalThis.Formulas;
const near = (a, b, tol = 5e-3) => assert.ok(Math.abs(a - b) <= tol * Math.max(1e-30, Math.abs(b)), `${a} != ${b}`);

/* ---------- estructura ---------- */
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const moduleIds = [...html.matchAll(/<section class="module[^"]*" id="(m2\d+)"/g)].map(m => m[1]);
assert.deepStrictEqual(moduleIds, N.ALL, 'los módulos de notation.js deben coincidir con index.html');

const balanced = s => { let d = 0; for (const c of s) { if (c === '{') d++; if (c === '}') d--; if (d < 0) return false; } return d === 0; };

N.groups.forEach(g => g.items.forEach(it => {
  assert.ok(it.s && it.n && it.u && it.m.length, `símbolo incompleto en ${g.id}`);
  it.m.forEach(m => assert.ok(N.ALL.includes(m), `módulo desconocido ${m} en ${it.s}`));
  assert.ok(balanced(it.s), `llaves desbalanceadas en ${it.s}`);
}));
// cada módulo tiene al menos un símbolo en la notación y una fórmula en el formulario
N.ALL.forEach(m => {
  assert.ok(N.groups.some(g => g.items.some(it => it.m.includes(m))), `sin notación para ${m}`);
  assert.ok(F.some(f => f.m.includes(m)), `sin fórmulas para ${m}`);
});

const ids = new Set();
F.forEach(f => {
  assert.ok(!ids.has(f.id), `id repetido ${f.id}`); ids.add(f.id);
  const x = f.x;
  assert.ok(f.t && f.g && f.f && x.idea && x.pasos.length >= 2 && x.simbolos.length && x.cuando && x.error, `explicación incompleta en ${f.id}`);
  assert.ok(x.ejemplo.q && x.ejemplo.pasos.length && x.ejemplo.r, `ejemplo incompleto en ${f.id}`);
  f.m.forEach(m => assert.ok(N.ALL.includes(m), `módulo desconocido ${m} en ${f.id}`));
  const tex = [f.f, ...x.simbolos.map(s => s[0])];
  tex.forEach(t => assert.ok(balanced(t), `llaves desbalanceadas en ${f.id}`));
  const prose = [x.idea, ...x.pasos, x.cuando, x.ejemplo.q, ...x.ejemplo.pasos, x.ejemplo.r, x.error].join(' ');
  assert.ok(!/—/.test(prose), `raya en la prosa de ${f.id}`);
  assert.strictEqual((prose.match(/\\\(/g) || []).length, (prose.match(/\\\)/g) || []).length, `\\( \\) desbalanceados en ${f.id}`);
});

const links = [...html.matchAll(/<dt data-f="([^"]+)"/g)].map(m => m[1]);
assert.ok(links.length >= 25, 'faltan enlaces Explicar en los bloques de ecuaciones');
links.forEach(id => assert.ok(ids.has(id), `index.html enlaza una fórmula inexistente: ${id}`));

/* ---------- números de los ejemplos ---------- */
const e0 = 8.854e-12;
near(-(-3e-3), 3e-3);                                        // continuidad
near(3 / (Math.PI * 1e-6), 9.55e5);                          // densidad de corriente
near(-4.3e-3 * 0.05, -2.15e-4);                              // deriva
near(-(-8.5e28 * 1.6e-19) * 4.3e-3, 5.85e7);                 // conductividad
near(50 / (3.72e7 * 2e-6), 0.672);                           // resistencia del aluminio
near(8 * 1.5, 12); near(1 / 8, 0.125);                       // Ohm
near(20 ** 2 / 10, 40); near(2 ** 2 * 10, 40);               // Joule
near(54 / 4.5, 12);                                          // fem
near(12 - 4 * 0.5, 10); near(12 + 4 * 0.5, 14);              // batería real
near(144 / 8, 18); near((12 / 6) ** 2 * 4, 16);              // máxima potencia
near(6 * 6 / 9, 4); near(6 * 3 / 9, 2);                      // divisor de corriente
near(12 * 2 / 3, 8);                                         // divisor de tensión
near(6 * 3 / 9, 2);                                          // paralelo
near(9 * 9 / 27, 3); near((3 * 3 * 3) / 3, 9);               // Δ–Y
{ const I1 = 10 / 4.4, I2 = 0.4 * I1; near(6 * I1 - 4 * I2, 10); near(-4 * I1 + 10 * I2, 0); near(I1, 2.273); near(I2, 0.909); near(I1 - I2, 1.364); }
{ const I1 = 4 / 6, I2 = I1 + 2; near(12 - 2 * I1 - 4 * I2, 0); near(I2, 2.667); }   // supermalla
near(3.5 / (1 / 6 + 1 / 4), 8.4);                            // nodos
{ const V1 = 8, V2 = 2; near(V1 / 2 + V2 / 4, 4.5); near(V1 - V2, 6); }             // supernodo
{ const p = 10 / 3, v1 = 10 * p / (5 + p), v2 = 20 * p / (5 + p); near(v1, 4); near(v2, 8); near(v1 + v2, 12); }
near(12 * 12 / 16, 9); near(4 * 12 / 16, 3); near(81 / 12, 6.75);                   // Thévenin
near(10e-6 * 500, 5e-3);                                     // i = C dv/dt
near(10 * (1 - Math.exp(-1)), 6.32); near(10 * (1 - Math.exp(-2)), 8.65);          // RC
near(0.5 * 470e-6 * 625, 0.147);                             // energía capacitor
near(0.05 * 200, 10);                                        // v = L di/dt
near(2 * (1 - Math.exp(-1)), 1.26);                          // RL
near(0.5 * 0.2 * 9, 0.9);                                    // energía inductor
near((1 / 0.1 - 1 / 0.5) / (4 * Math.PI * 0.01), 63.7);      // esferas
near(Math.log(5) / (2 * Math.PI * 1e-5 * 2), 12807, 1e-3);   // coaxial
near(e0 * 2.2 * 0.02 / 1e-3, 390e-12);                       // placas
near(2 * 3 / 5, 1.2);                                        // capacitores en serie
near(e0 * 0.01 / (1e-3 / 5 + 2e-3), 40.2e-12); near(e0 * 0.01 / 3e-3, 29.5e-12);   // capas en serie
near(e0 / 2e-3 * (0.005 + 3 * 0.005), 88.5e-12);             // capas en paralelo
{ const W = 0.5 * e0 * 1e10 * 1e-5; near(W, 4.43e-7); near(0.5 * (e0 * 0.01 / 1e-3) * 1e4, W); }   // energía del campo
near(3 * e0 * 2400, 63.7e-9); near(4 * e0 * 2400, 85.0e-9); near(e0 * 2400 + 3 * e0 * 2400, 4 * e0 * 2400);
near(4 * 2400, 9600);                                        // frontera

console.log(`formulario: ${F.length} fórmulas y ${N.groups.reduce((a, g) => a + g.items.length, 0)} símbolos; todas las pruebas pasaron`);

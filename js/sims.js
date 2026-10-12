/**
 * sims.js
 * Laboratorios interactivos de cada módulo. Cada simulador:
 *  1. arma sus controles a partir de una lista de parámetros,
 *  2. llama a una función pura de Physics,
 *  3. muestra lecturas y gráficos.
 * Los comentarios de cada simulador explican qué ley física se está viendo.
 */
(function (global) {
  'use strict';
  const P = global.Physics;

  /* ---------------- utilidades de interfaz ---------------- */

  const PREFIX = [[1e9, 'G'], [1e6, 'M'], [1e3, 'k'], [1, ''], [1e-3, 'm'], [1e-6, 'µ'], [1e-9, 'n'], [1e-12, 'p']];

  /** Formatea con prefijo SI y coma decimal: 0.0072 J → "7,20 mJ". */
  function si(v, unit, digits = 3) {
    if (!isFinite(v)) return '∞ ' + unit;
    if (v === 0) return '0 ' + unit;
    const a = Math.abs(v);
    const [f, p] = PREFIX.find(([f]) => a >= f * 0.9995) || PREFIX[PREFIX.length - 1];
    return (v / f).toPrecision(digits).replace('.', ',') + ' ' + p + unit;
  }
  function num(v, d = 2) { return v.toFixed(d).replace('.', ','); }
  /** Igual que num, pero con la coma protegida para LaTeX ({,} evita el espacio extra). */
  function tnum(v, d = 2) { return num(v, d).replace(',', '{,}'); }

  /** Sliders accesibles a partir de definiciones. Devuelve un objeto con los valores actuales. */
  function controls(root, defs, onChange) {
    const box = document.createElement('div');
    box.className = 'controls';
    const state = {};
    defs.forEach(d => {
      const id = `${root.dataset.sim}-${d.id}`;
      const wrap = document.createElement('div');
      wrap.className = 'ctl';
      if (d.options) {
        wrap.innerHTML = `<label for="${id}">${d.label}</label>
          <select id="${id}">${d.options.map((o, i) => `<option value="${i}">${o.label}</option>`).join('')}</select>`;
        const s = wrap.querySelector('select');
        state[d.id] = d.options[0].value;
        s.addEventListener('change', () => { state[d.id] = d.options[s.value].value; onChange(state); });
      } else {
        const toV = x => (d.log ? 10 ** x : x);
        const fromV = v => (d.log ? Math.log10(v) : v);
        wrap.innerHTML = `<label for="${id}">${d.label}<output id="${id}-o"></output></label>
          <input type="range" id="${id}" min="${fromV(d.min)}" max="${fromV(d.max)}" step="${d.log ? 0.01 : d.step}" value="${fromV(d.value)}">`;
        const inp = wrap.querySelector('input'), out = wrap.querySelector('output');
        const show = () => { out.textContent = d.fmt ? d.fmt(state[d.id]) : `${num(state[d.id], d.dec ?? 1)} ${d.unit || ''}`; };
        state[d.id] = d.value;
        show();
        inp.addEventListener('input', () => { state[d.id] = toV(+inp.value); show(); onChange(state); });
      }
      box.appendChild(wrap);
    });
    root.querySelector('.sim-controls').appendChild(box);
    return state;
  }

  /** Bloque de lecturas: [{k, v, cls}] */
  function readouts(root, rows) {
    const el = root.querySelector('.sim-readouts');
    el.innerHTML = rows.map(r => `<div class="ro ${r.cls || ''}"><dt>${r.k}</dt><dd>${r.v}</dd></div>`).join('');
  }

  /** Re-renderiza LaTeX dentro de un elemento, encadenando para no solapar llamadas. */
  let mjChain = Promise.resolve();
  function tex(el, html) {
    el.innerHTML = html;
    if (global.MathJax && MathJax.typesetPromise) {
      mjChain = mjChain.then(() => MathJax.typesetPromise([el])).catch(() => {});
    }
  }

  /** Redibuja un canvas cuando cambia su tamaño o el tema. */
  const redrawers = [];
  function onRedraw(fn) { redrawers.push(fn); }
  window.addEventListener('resize', () => redrawers.forEach(f => f()));
  new MutationObserver(() => redrawers.forEach(f => f()))
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => redrawers.forEach(f => f()));

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const T = n => Plot.token(n);

  /* ---------------- simuladores ---------------- */

  const sims = {

    /**
     * 2.1 Conductor óhmico, con la notación del Cap. 3.
     * El campo E = V_ab/L empuja a los electrones de conducción contra E; su velocidad
     * de deriva U_d = J/ρe = −μe·E es de décimas de milímetro por segundo.
     * La animación exagera U_d para que se vea, pero conserva las proporciones.
     */
    ohm(root) {
      const cv = root.querySelector('canvas');
      // Conductividades de la lámina 14 del Cap. 3; n = electrones de conducción por m³.
      const mats = [
        { label: 'Cobre (σ = 5,8·10⁷ S/m)', value: { sigma: 5.8e7, n: 8.5e28 } },
        { label: 'Aluminio (σ = 3,72·10⁷ S/m)', value: { sigma: 3.72e7, n: 18.1e28 } },
        { label: 'Plata (σ = 6,17·10⁷ S/m)', value: { sigma: 6.17e7, n: 5.86e28 } },
      ];
      const s = controls(root, [
        { id: 'mat', label: 'Material', options: mats },
        { id: 'L', label: 'Largo L', unit: 'm', min: 0.5, max: 100, step: 0.5, value: 1, dec: 1 },
        { id: 'S', label: 'Sección S', unit: 'mm²', min: 0.1, max: 10, step: 0.1, value: 1, dec: 1 },
        { id: 'I', label: 'Corriente I', unit: 'A', min: 0.1, max: 10, step: 0.1, value: 1, dec: 1 },
      ], update);
      let res = null;
      const dots = Array.from({ length: 70 }, () => ({ x: Math.random(), y: Math.random(), j: Math.random() * 6 }));
      function update() {
        res = P.wire({ L: s.L, S: s.S * 1e-6, sigma: s.mat.sigma, I: s.I, n: s.mat.n });
        readouts(root, [
          { k: 'R = L/(σS)', v: si(res.R, 'Ω') },
          { k: 'V_ab = RI', v: si(res.V, 'V') },
          { k: 'E = V_ab/L', v: si(res.E, 'V/m'), cls: 'e' },
          { k: 'J = I/S', v: si(res.J, 'A/m²') },
          { k: 'ρe', v: (res.rhoE / 1e10).toFixed(2).replace('.', ',') + '·10¹⁰ C/m³' },
          { k: 'U_d = J/ρe', v: '−' + si(res.vd, 'm/s') },
          { k: 'μe = −σ/ρe', v: si(res.mu, 'm²/(V·s)') },
          { k: 'P = I²R', v: si(res.P, 'W') },
        ]);
      }
      update();
      let last = performance.now();
      function frame(now) {
        const dt = Math.min(0.05, (now - last) / 1000); last = now;
        const dpr = devicePixelRatio || 1, W = cv.clientWidth, H = cv.clientHeight;
        if (W && H && !root.closest('[hidden]')) {
          cv.width = W * dpr; cv.height = H * dpr;
          const c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0);
          const tubeH = Math.max(18, Math.min(H - 30, 14 + Math.sqrt(s.S) * 24));
          const y0 = (H - tubeH) / 2;
          c.fillStyle = T('--surface-2'); c.strokeStyle = T('--line');
          c.beginPath(); c.roundRect(10, y0, W - 20, tubeH, tubeH / 2); c.fill(); c.stroke();
          // flecha de E (de + a −, hacia la derecha)
          c.strokeStyle = T('--e'); c.fillStyle = T('--e'); c.lineWidth = 2;
          c.beginPath(); c.moveTo(W / 2 - 40, 12); c.lineTo(W / 2 + 34, 12); c.stroke();
          c.beginPath(); c.moveTo(W / 2 + 42, 12); c.lineTo(W / 2 + 32, 7); c.lineTo(W / 2 + 32, 17); c.fill();
          c.font = '12px "JetBrains Mono", monospace'; c.fillText('E', W / 2 + 48, 16);
          // electrones: agitación térmica + deriva hacia la izquierda (contra E)
          const drift = reduceMotion ? 0 : res.vd * 1e4 / Math.max(s.L, 1) * 2;
          c.fillStyle = T('--fg');
          dots.forEach(p => {
            p.x -= drift * dt; if (p.x < 0) p.x += 1;
            p.j += dt * 9;
            const jx = reduceMotion ? 0 : Math.sin(p.j * 1.3) * 2, jy = reduceMotion ? 0 : Math.cos(p.j) * 2;
            c.beginPath(); c.arc(14 + p.x * (W - 28) + jx, y0 + 5 + p.y * (tubeH - 10) + jy, 2.2, 0, 7); c.fill();
          });
          c.fillStyle = T('--muted'); c.textAlign = 'left';
          c.fillText('electrones derivan contra E · I va con E', 14, H - 6);
        }
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    },

    /**
     * 2.2 Fuente real.
     * Balance de energía: ε·I = I²r + I²R. La potencia en la carga I²R tiene un máximo
     * cuando R = r, pero ahí la eficiencia es solo 50 %.
     */
    fem(root) {
      const cv = root.querySelector('canvas');
      const s = controls(root, [
        { id: 'e', label: 'ε', unit: 'V', min: 1, max: 24, step: 0.5, value: 12 },
        { id: 'r', label: 'r interna', unit: 'Ω', min: 0.1, max: 5, step: 0.1, value: 0.5 },
        { id: 'R', label: 'R carga', unit: 'Ω', min: 0.1, max: 20, step: 0.1, value: 5.5 },
      ], update);
      function update() {
        const o = P.realSource({ emf: s.e, r: s.r, R: s.R });
        readouts(root, [
          { k: 'I = ε/(r+R)', v: si(o.I, 'A') },
          { k: 'V_ab = ε − Ir', v: si(o.Vt, 'V'), cls: 'e' },
          { k: 'P entregada εI', v: si(o.Ps, 'W') },
          { k: 'P en r', v: si(o.Pr, 'W') },
          { k: 'P en R', v: si(o.PR, 'W'), cls: 'ok' },
          { k: 'Eficiencia', v: num(o.eta * 100, 1) + ' %' },
        ]);
        draw();
      }
      function draw() {
        const Rmax = 20;
        Plot.line(cv, {
          series: [{ pts: Plot.sample(R => P.realSource({ emf: s.e, r: s.r, R }).PR, 0, Rmax), color: T('--e'), fill: true }],
          xLabel: 'R [Ω]', yLabel: 'P en R [W]', xMin: 0, xMax: Rmax,
          vlines: [{ x: s.r, label: 'R = r' }],
          points: [{ x: s.R, y: P.realSource({ emf: s.e, r: s.r, R: s.R }).PR, label: 'tu R', color: T('--accent-2') }],
        });
      }
      onRedraw(draw); update();
    },

    /**
     * 2.3 LCK en el nodo a.
     * La carga que entra por unidad de tiempo es igual a la que sale; la "balanza"
     * compara ambos lados y siempre queda equilibrada, cambie lo que cambie.
     */
    lck(root) {
      const s = controls(root, [
        { id: 'Is', label: 'Iₛ', unit: 'A', min: 0, max: 6, step: 0.1, value: 2 },
        { id: 'R1', label: 'R₁', unit: 'Ω', min: 1, max: 20, step: 0.5, value: 4 },
        { id: 'R2', label: 'R₂', unit: 'Ω', min: 1, max: 20, step: 0.5, value: 6 },
        { id: 'e', label: 'ε', unit: 'V', min: 0, max: 30, step: 0.5, value: 12 },
      ], update);
      const bal = root.querySelector('.balance');
      function update() {
        const o = P.nodeKCL({ Is: s.Is, R1: s.R1, R2: s.R2, emf: s.e });
        readouts(root, [
          { k: 'V_a', v: si(o.Va, 'V'), cls: 'e' },
          { k: 'I₁ (baja por R₁)', v: si(o.I1, 'A') },
          { k: 'I₂ (sube por ε hacia a)', v: si(o.I2, 'A'), cls: o.I2 < 0 ? 'warn' : '' },
          { k: 'Estado de ε', v: o.I2 >= 0 ? 'entrega energía' : 'absorbe energía' },
        ]);
        const inn = [{ k: 'Iₛ', v: s.Is }, { k: 'I₂', v: o.I2 }], out = [{ k: 'I₁', v: o.I1 }];
        // si I2 es negativa, en realidad sale del nodo
        const ins = inn.filter(x => x.v >= 0), outs = out.concat(inn.filter(x => x.v < 0).map(x => ({ k: x.k, v: -x.v })));
        const tot = Math.max(1e-9, ins.reduce((a, x) => a + x.v, 0));
        const bar = arr => arr.map(x => `<span style="flex:${x.v / tot}" title="${x.k}">${x.k} ${num(x.v, 2)} A</span>`).join('');
        bal.innerHTML = `<div class="bal-row"><b>Entra</b><div class="bal-bar in">${bar(ins)}</div></div>
          <div class="bal-row"><b>Sale</b><div class="bal-bar out">${bar(outs)}</div></div>`;
      }
      update();
    },

    /**
     * 2.4 Perfil de potencial a lo largo del lazo.
     * El potencial funciona como la altura de un cerro: la fuente sube a la carga,
     * cada resistencia la baja I·R. Como ∮E·dl = 0, el recorrido termina a la misma
     * altura donde partió.
     */
    lvk(root) {
      const cv = root.querySelector('canvas');
      const s = controls(root, [
        { id: 'e1', label: 'ε₁', unit: 'V', min: 0, max: 30, step: 0.5, value: 15 },
        { id: 'e2', label: 'ε₂', unit: 'V', min: 0, max: 30, step: 0.5, value: 4 },
        { id: 'R1', label: 'R₁', unit: 'Ω', min: 0.5, max: 10, step: 0.5, value: 2 },
        { id: 'R2', label: 'R₂', unit: 'Ω', min: 0.5, max: 10, step: 0.5, value: 5 },
        { id: 'R3', label: 'R₃', unit: 'Ω', min: 0.5, max: 10, step: 0.5, value: 3 },
      ], update);
      let o;
      function update() {
        o = P.seriesLoop(s);
        const sum = o.steps.reduce((a, st) => a + st.dV, 0);
        readouts(root, [
          { k: 'I (horaria)', v: si(o.I, 'A'), cls: o.I < 0 ? 'warn' : '' },
          ...o.steps.map(st => ({ k: 'ΔV en ' + st.name, v: (st.dV >= 0 ? '+' : '') + num(st.dV, 2) + ' V' })),
          { k: 'Σ ΔV en el lazo', v: num(Math.abs(sum) < 1e-9 ? 0 : sum, 2) + ' V', cls: 'ok' },
        ]);
        draw();
      }
      function draw() {
        const pts = o.profile.map((p, i) => [i, p.V]);
        const vals = pts.map(q => q[1]);
        const hi = Math.max(0, ...vals), lo = Math.min(0, ...vals), pad = 0.15 * (hi - lo || 1);
        Plot.line(cv, {
          series: [{ pts, color: T('--e'), fill: true }],
          xLabel: 'recorrido a → b → c → d → e → a', yLabel: 'V − V_a [V]',
          xMin: 0, xMax: 5, yMin: lo - (lo < 0 ? pad : 0), yMax: hi + pad,
          points: o.profile.map((p, i) => ({ x: i, y: p.V, label: `${p.label} ${num(p.V, 1)}`, color: T('--fg') })),
        });
      }
      onRedraw(draw); update();
    },

    /**
     * 2.5 Conversión Δ ↔ Y.
     * Las fórmulas salen de igualar la resistencia vista entre cada par de terminales.
     */
    deltay(root) {
      const s = controls(root, [
        { id: 'Rab', label: 'R_ab (Δ)', unit: 'Ω', min: 1, max: 30, step: 1, value: 6, dec: 0 },
        { id: 'Rbc', label: 'R_bc (Δ)', unit: 'Ω', min: 1, max: 30, step: 1, value: 9, dec: 0 },
        { id: 'Rca', label: 'R_ca (Δ)', unit: 'Ω', min: 1, max: 30, step: 1, value: 3, dec: 0 },
      ], update);
      const out = root.querySelector('.dy-figure');
      function update() {
        const y = P.deltaToY(s);
        const back = P.yToDelta(y);
        readouts(root, [
          { k: 'R_a', v: si(y.Ra, 'Ω') }, { k: 'R_b', v: si(y.Rb, 'Ω') }, { k: 'R_c', v: si(y.Rc, 'Ω') },
          { k: 'Vuelta Y → Δ (R_ab)', v: si(back.Rab, 'Ω'), cls: 'ok' },
          { k: 'R vista a–b en Δ', v: si(s.Rab * (s.Rbc + s.Rca) / (s.Rab + s.Rbc + s.Rca), 'Ω') },
          { k: 'R vista a–b en Y', v: si(y.Ra + y.Rb, 'Ω'), cls: 'ok' },
        ]);
        const f = v => num(v, 2);
        out.innerHTML = `<svg viewBox="0 0 420 170" class="sch" role="img" aria-label="Triángulo y estrella equivalentes">
          <g class="w"><polygon points="60,140 160,140 110,40" fill="none"/></g>
          <text class="node" x="48" y="156">a</text><text class="node" x="164" y="156">b</text><text class="node" x="104" y="30">c</text>
          <text class="lbl" x="110" y="160" text-anchor="middle">${f(s.Rab)} Ω</text>
          <text class="lbl" x="146" y="86">${f(s.Rbc)} Ω</text>
          <text class="lbl" x="74" y="86" text-anchor="end">${f(s.Rca)} Ω</text>
          <text class="lbl muted" x="210" y="96" text-anchor="middle">⇔</text>
          <g class="w"><line x1="310" y1="105" x2="260" y2="140"/><line x1="310" y1="105" x2="360" y2="140"/><line x1="310" y1="105" x2="310" y2="40"/></g>
          <text class="node" x="248" y="156">a</text><text class="node" x="364" y="156">b</text><text class="node" x="304" y="30">c</text>
          <text class="lbl accent" x="276" y="112" text-anchor="end">${f(y.Ra)} Ω</text>
          <text class="lbl accent" x="344" y="112">${f(y.Rb)} Ω</text>
          <text class="lbl accent" x="318" y="72">${f(y.Rc)} Ω</text></svg>`;
      }
      update();
    },

    /**
     * 2.6 Mallas.
     * Cada fila de la matriz es la LVK de una malla: diagonal = suma de resistencias
     * de la malla, fuera de la diagonal = −(resistencia compartida).
     */
    mallas(root) {
      const s = controls(root, [
        { id: 'e1', label: 'ε₁', unit: 'V', min: 0, max: 30, step: 0.5, value: 10 },
        { id: 'e2', label: 'ε₂', unit: 'V', min: 0, max: 30, step: 0.5, value: 4 },
        { id: 'R1', label: 'R₁', unit: 'Ω', min: 0.5, max: 20, step: 0.5, value: 2 },
        { id: 'R2', label: 'R₂', unit: 'Ω', min: 0.5, max: 20, step: 0.5, value: 6 },
        { id: 'R3', label: 'R₃', unit: 'Ω', min: 0.5, max: 20, step: 0.5, value: 4 },
      ], update);
      const eq = root.querySelector('.sim-eq');
      let pending = 0;
      function update() {
        const o = P.twoMesh(s);
        readouts(root, [
          { k: 'I₁', v: si(o.I1, 'A') }, { k: 'I₂', v: si(o.I2, 'A'), cls: o.I2 < 0 ? 'warn' : '' },
          { k: 'I por R₃ (↓)', v: si(o.I3, 'A') },
          { k: 'P entregada ε₁', v: si(o.P_e1, 'W') },
          { k: 'P entregada ε₂', v: si(o.P_e2, 'W'), cls: o.P_e2 < 0 ? 'warn' : '' },
          { k: 'P disipada en R', v: si(o.P_R, 'W'), cls: 'ok' },
        ]);
        cancelAnimationFrame(pending);
        pending = requestAnimationFrame(() => {
          const n = v => tnum(v, 1);
          tex(eq, `$$\\begin{bmatrix} ${n(o.A[0][0])} & ${n(o.A[0][1])} \\\\ ${n(o.A[1][0])} & ${n(o.A[1][1])} \\end{bmatrix}
            \\begin{bmatrix} I_1 \\\\ I_2 \\end{bmatrix} = \\begin{bmatrix} ${n(o.b[0])} \\\\ ${n(o.b[1])} \\end{bmatrix}
            \\;\\Rightarrow\\; I_1 = ${tnum(o.I1, 3)}\\,\\mathrm{A},\\; I_2 = ${tnum(o.I2, 3)}\\,\\mathrm{A}$$`);
        });
      }
      update();
    },

    /**
     * 2.7 Nodos.
     * Cada fila de G·V = i es la LCK de un nodo escrita con la ley de Ohm:
     * diagonal = suma de conductancias conectadas, fuera = −conductancia compartida.
     */
    nodos(root) {
      const s = controls(root, [
        { id: 'emf', label: 'ε', unit: 'V', min: 0, max: 40, step: 0.5, value: 20 },
        { id: 'Is', label: 'Iₛ', unit: 'A', min: 0, max: 8, step: 0.1, value: 3 },
        { id: 'Ra', label: 'R_a', unit: 'Ω', min: 0.5, max: 20, step: 0.5, value: 4 },
        { id: 'Rb', label: 'R_b', unit: 'Ω', min: 0.5, max: 20, step: 0.5, value: 4 },
        { id: 'Rc', label: 'R_c', unit: 'Ω', min: 0.5, max: 20, step: 0.5, value: 2 },
        { id: 'Rd', label: 'R_d', unit: 'Ω', min: 0.5, max: 20, step: 0.5, value: 4 },
      ], update);
      const eq = root.querySelector('.sim-eq');
      let pending = 0;
      function update() {
        const o = P.twoNode(s);
        readouts(root, [
          { k: 'V₁', v: si(o.V1, 'V'), cls: 'e' }, { k: 'V₂', v: si(o.V2, 'V'), cls: 'e' },
          { k: 'I por R_a (→ nodo 1)', v: si(o.Ia, 'A') },
          { k: 'I por R_c (1 → 2)', v: si(o.Ic, 'A'), cls: o.Ic < 0 ? 'warn' : '' },
          { k: 'LCK nodo 1', v: num(o.Ia - o.Ib - o.Ic, 3) + ' A', cls: 'ok' },
          { k: 'LCK nodo 2', v: num(o.Ic + s.Is - o.Id, 3) + ' A', cls: 'ok' },
        ]);
        cancelAnimationFrame(pending);
        pending = requestAnimationFrame(() => {
          const n = v => tnum(v, 3);
          tex(eq, `$$\\begin{bmatrix} ${n(o.G[0][0])} & ${n(o.G[0][1])} \\\\ ${n(o.G[1][0])} & ${n(o.G[1][1])} \\end{bmatrix}
            \\begin{bmatrix} V_1 \\\\ V_2 \\end{bmatrix} = \\begin{bmatrix} ${n(o.i[0])} \\\\ ${n(o.i[1])} \\end{bmatrix}
            \\;[\\mathrm{S}],[\\mathrm{A}]$$`);
        });
      }
      update();
    },

    /**
     * 2.8 Thévenin y máxima transferencia.
     * Desde la carga, toda la red lineal se ve como una fuente Vth con Rth en serie.
     * P(RL) = Vth²RL/(Rth+RL)² crece, llega a Vth²/(4Rth) en RL = Rth y luego baja.
     */
    thevenin(root) {
      const cv = root.querySelector('canvas');
      const s = controls(root, [
        { id: 'emf', label: 'ε', unit: 'V', min: 1, max: 48, step: 1, value: 24, dec: 0 },
        { id: 'R1', label: 'R₁', unit: 'Ω', min: 0.5, max: 20, step: 0.5, value: 6 },
        { id: 'R2', label: 'R₂', unit: 'Ω', min: 0.5, max: 20, step: 0.5, value: 3 },
        { id: 'R3', label: 'R₃', unit: 'Ω', min: 0, max: 20, step: 0.5, value: 2 },
        { id: 'RL', label: 'R_L', unit: 'Ω', min: 0.1, max: 20, step: 0.1, value: 2 },
      ], update);
      let o;
      function update() {
        o = P.thevenin(s);
        const L = P.loadPower(o.Vth, o.Rth, s.RL);
        readouts(root, [
          { k: 'V_th', v: si(o.Vth, 'V'), cls: 'e' }, { k: 'R_th', v: si(o.Rth, 'Ω') },
          { k: 'I_N = V_th/R_th', v: si(o.In, 'A') },
          { k: 'P en R_L', v: si(L.P, 'W') },
          { k: 'P máx (R_L = R_th)', v: si(o.Pmax, 'W'), cls: 'ok' },
          { k: 'P/P máx', v: num(100 * L.P / o.Pmax, 0) + ' %' },
        ]);
        draw();
      }
      function draw() {
        Plot.line(cv, {
          series: [{ pts: Plot.sample(R => P.loadPower(o.Vth, o.Rth, R).P, 0, 20), color: T('--e'), fill: true }],
          xLabel: 'R_L [Ω]', yLabel: 'P [W]', xMin: 0, xMax: 20,
          vlines: [{ x: o.Rth, label: 'R_th' }],
          points: [{ x: s.RL, y: P.loadPower(o.Vth, o.Rth, s.RL).P, label: 'tu R_L', color: T('--accent-2') }],
        });
      }
      onRedraw(draw); update();
    },

    /**
     * 2.9 RC.
     * La corriente que llega a la placa acumula carga y crea el campo entre placas.
     * A medida que v_C sube, queda menos tensión para R y la corriente cae: de ahí la exponencial.
     */
    rc(root) {
      const cv = root.querySelector('canvas');
      const s = controls(root, [
        { id: 'mode', label: 'Proceso', options: [{ label: 'Carga (fuente conectada)', value: 'carga' }, { label: 'Descarga (fuente retirada)', value: 'descarga' }] },
        { id: 'V', label: 'V', unit: 'V', min: 1, max: 30, step: 0.5, value: 12 },
        { id: 'R', label: 'R', min: 1e2, max: 1e5, value: 1e4, log: true, fmt: v => si(v, 'Ω') },
        { id: 'C', label: 'C', min: 1e-6, max: 1e-3, value: 1e-4, log: true, fmt: v => si(v, 'F') },
        { id: 't', label: 't / τ', min: 0, max: 5, step: 0.05, value: 2, dec: 2 },
      ], update);
      let o;
      function update() {
        const tau = s.R * s.C;
        o = P.rc({ V: s.V, R: s.R, C: s.C, t: s.t * tau, mode: s.mode });
        readouts(root, [
          { k: 'τ = RC', v: si(o.tau, 's') }, { k: 't', v: si(s.t * tau, 's') },
          { k: 'v_C(t)', v: si(o.vC, 'V'), cls: 'e' }, { k: 'i(t)', v: si(o.i, 'A') },
          { k: 'Energía en el campo E', v: si(o.W, 'J') },
          { k: 'Energía final ½CV²', v: s.mode === 'carga' ? si(o.Wfinal, 'J') : '0 J' },
        ]);
        draw();
      }
      function draw() {
        const tau = s.R * s.C;
        const f = t => P.rc({ V: s.V, R: s.R, C: s.C, t: t * tau, mode: s.mode }).vC;
        Plot.line(cv, {
          series: [{ pts: Plot.sample(f, 0, 5), color: T('--e'), fill: true }],
          xLabel: 't / τ', yLabel: 'v_C [V]', xMin: 0, xMax: 5, yMin: 0, yMax: s.V * 1.05,
          vlines: [{ x: 1, label: 'τ' }],
          points: [{ x: s.t, y: o.vC, label: `${num(100 * o.vC / s.V, 1)} % de V`, color: T('--accent-2') }],
        });
      }
      onRedraw(draw); update();
    },

    /**
     * 2.10 RL.
     * Al cerrar el interruptor el flujo del inductor debe crecer; por la ley de Faraday
     * aparece v_L = L di/dt que se opone. La corriente no salta: arranca en 0.
     */
    rl(root) {
      const cv = root.querySelector('canvas');
      const s = controls(root, [
        { id: 'mode', label: 'Proceso', options: [{ label: 'Energización', value: 'carga' }, { label: 'Desenergización', value: 'descarga' }] },
        { id: 'V', label: 'V', unit: 'V', min: 1, max: 48, step: 1, value: 12, dec: 0 },
        { id: 'R', label: 'R', unit: 'Ω', min: 0.5, max: 20, step: 0.5, value: 4 },
        { id: 'L', label: 'L', unit: 'H', min: 0.05, max: 5, step: 0.05, value: 2, dec: 2 },
        { id: 't', label: 't / τ', min: 0, max: 5, step: 0.05, value: 1, dec: 2 },
      ], update);
      let o;
      function update() {
        const tau = s.L / s.R;
        o = P.rl({ V: s.V, R: s.R, L: s.L, t: s.t * tau, mode: s.mode });
        readouts(root, [
          { k: 'τ = L/R', v: si(o.tau, 's') }, { k: 'i(t)', v: si(o.i, 'A'), cls: 'b' },
          { k: 'v_L(t)', v: si(o.vL, 'V') },
          { k: 'Energía en el campo B', v: si(o.W, 'J'), cls: 'b' },
          { k: 'Energía final ½LI²', v: s.mode === 'carga' ? si(o.Wfinal, 'J') : '0 J' },
        ]);
        draw();
      }
      function draw() {
        const tau = s.L / s.R;
        const f = t => P.rl({ V: s.V, R: s.R, L: s.L, t: t * tau, mode: s.mode }).i;
        Plot.line(cv, {
          series: [{ pts: Plot.sample(f, 0, 5), color: T('--b'), fill: true }],
          xLabel: 't / τ', yLabel: 'i [A]', xMin: 0, xMax: 5, yMin: 0, yMax: (s.V / s.R) * 1.05,
          vlines: [{ x: 1, label: 'τ' }],
          points: [{ x: s.t, y: o.i, label: si(o.i, 'A'), color: T('--accent-2') }],
        });
      }
      onRedraw(draw); update();
    },

    /**
     * 2.11 Resistencia radial de un coaxial.
     * Las líneas de corriente salen radiales: cerca del conductor interno pasan por
     * un área pequeña, así que ahí J y E son mayores (E ∝ 1/r).
     */
    coax(root) {
      const [cvA, cvB] = root.querySelectorAll('canvas');
      const s = controls(root, [
        { id: 'a', label: 'Radio interno a', unit: 'mm', min: 0.5, max: 5, step: 0.1, value: 1 },
        { id: 'b', label: 'Radio externo b', unit: 'mm', min: 2, max: 20, step: 0.5, value: 4 },
        { id: 'sigma', label: 'σ del relleno', min: 1e-6, max: 1e-2, value: 1e-4, log: true, fmt: v => si(v, 'S/m') },
        { id: 'L', label: 'Largo L', unit: 'm', min: 0.1, max: 10, step: 0.1, value: 1 },
        { id: 'V', label: 'V aplicado', unit: 'V', min: 1, max: 1000, step: 1, value: 100, dec: 0 },
      ], update);
      let o, a, b;
      function update() {
        a = s.a / 1000; b = Math.max(s.b / 1000, a * 1.2);
        o = P.coaxialRadial({ a, b, sigma: s.sigma, L: s.L });
        readouts(root, [
          { k: 'R = ln(b/a)/(2πσL)', v: si(o.R, 'Ω') },
          { k: 'I = V/R', v: si(s.V / o.R, 'A') },
          { k: 'E(a)', v: si(o.Eof(a, s.V), 'V/m'), cls: 'e' },
          { k: 'E(b)', v: si(o.Eof(b, s.V), 'V/m') },
          { k: 'E(a)/E(b) = b/a', v: num(b / a, 2) },
        ]);
        draw();
      }
      function draw() {
        // corte transversal
        const dpr = devicePixelRatio || 1, W = cvA.clientWidth, H = cvA.clientHeight;
        if (W && H) {
          cvA.width = W * dpr; cvA.height = H * dpr;
          const c = cvA.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0);
          const cx = W / 2, cy = H / 2, Rb = Math.min(W, H) / 2 - 8, Ra = Rb * (a / b);
          c.fillStyle = T('--surface-2'); c.beginPath(); c.arc(cx, cy, Rb, 0, 7); c.fill();
          c.strokeStyle = T('--fg'); c.lineWidth = 3; c.stroke();
          c.fillStyle = T('--muted'); c.beginPath(); c.arc(cx, cy, Ra, 0, 7); c.fill();
          c.strokeStyle = T('--e'); c.lineWidth = 1.3;
          for (let k = 0; k < 16; k++) {
            const th = (k / 16) * Math.PI * 2, x1 = Math.cos(th), y1 = Math.sin(th);
            c.beginPath(); c.moveTo(cx + x1 * (Ra + 2), cy + y1 * (Ra + 2)); c.lineTo(cx + x1 * (Rb - 4), cy + y1 * (Rb - 4)); c.stroke();
          }
          c.fillStyle = T('--fg'); c.font = '12px "JetBrains Mono", monospace'; c.textAlign = 'center';
          c.fillText('a', cx, cy + 4); c.fillText('b', cx + Rb - 12, cy - 6);
        }
        Plot.line(cvB, {
          series: [{ pts: Plot.sample(r => o.Eof(r / 1000, s.V), a * 1000, b * 1000), color: T('--e'), fill: true }],
          xLabel: 'r [mm]', yLabel: 'E [V/m]', xMin: a * 1000, xMax: b * 1000, yMin: 0,
        });
      }
      onRedraw(draw); update();
    },

    /**
     * 2.12 Condensador con lámina dieléctrica.
     * D es continuo en la interfaz, así que el campo en el dieléctrico es εr veces menor.
     * Las líneas dibujadas representan E: en el dieléctrico hay menos por unidad de área.
     */
    slab(root) {
      const cv = root.querySelector('canvas');
      const s = controls(root, [
        { id: 'frac', label: 'Espesor lámina t/d', min: 0, max: 1, step: 0.05, value: 0.5, dec: 2 },
        { id: 'er', label: 'εr de la lámina', min: 1, max: 10, step: 0.1, value: 4, dec: 1 },
        { id: 'V', label: 'V aplicado', unit: 'V', min: 1, max: 100, step: 1, value: 12, dec: 0 },
      ], update);
      const A = 0.01, d = 2e-3;
      let o;
      function update() {
        o = P.slabCapacitor({ A, d, t: s.frac * d, er: s.er, V: s.V });
        readouts(root, [
          { k: 'C', v: si(o.C, 'F') }, { k: 'Q = CV', v: si(o.Q, 'C') },
          { k: 'E en aire', v: si(o.Eair, 'V/m'), cls: 'e' },
          { k: 'E en dieléctrico', v: si(o.Ediel, 'V/m') },
          { k: 'Energía ½CV²', v: si(o.W, 'J') },
          { k: 'C / C sin lámina', v: num(o.C / (P.EPS0 * A / d), 3) },
        ]);
        draw();
      }
      function draw() {
        const dpr = devicePixelRatio || 1, W = cv.clientWidth, H = cv.clientHeight;
        if (!W || !H) return;
        cv.width = W * dpr; cv.height = H * dpr;
        const c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0);
        const x0 = 40, x1 = W - 40, yT = 26, yB = H - 26, gap = yB - yT;
        const yInt = yB - s.frac * gap;
        c.fillStyle = T('--diel'); c.fillRect(x0, yInt, x1 - x0, yB - yInt);
        c.fillStyle = T('--fg'); c.fillRect(x0, yT - 6, x1 - x0, 6); c.fillRect(x0, yB, x1 - x0, 6);
        c.font = '12px "JetBrains Mono", monospace'; c.textAlign = 'left';
        c.fillText('+Q', 8, yT); c.fillText('−Q', 8, yB + 8);
        // densidad de líneas proporcional a E en cada región
        const nAir = 18, nDiel = Math.max(2, Math.round(nAir / s.er));
        c.strokeStyle = T('--e'); c.lineWidth = 1.4;
        const lines = (n, ya, yb) => { for (let k = 0; k < n; k++) { const x = x0 + ((k + 0.5) / n) * (x1 - x0); c.beginPath(); c.moveTo(x, ya); c.lineTo(x, yb); c.stroke(); c.beginPath(); c.moveTo(x, yb); c.lineTo(x - 3, yb - 6); c.lineTo(x + 3, yb - 6); c.fillStyle = T('--e'); c.fill(); } };
        if (yInt > yT + 4) lines(nAir, yT + 2, yInt - 2);
        if (yB - yInt > 4) lines(nDiel, yInt + 2, yB - 2);
        c.fillStyle = T('--muted'); c.textAlign = 'right';
        if (s.frac > 0.08) c.fillText(`εr = ${num(s.er, 1)}`, x1 - 6, yB - 6);
        if (s.frac < 0.92) c.fillText('aire', x1 - 6, yT + 16);
      }
      onRedraw(draw); update();
    },
  };

  /** Inicializa cada simulador una sola vez, cuando su módulo se muestra por primera vez. */
  function init(scope) {
    scope.querySelectorAll('[data-sim]:not([data-ready])').forEach(root => {
      root.dataset.ready = '1';
      try { sims[root.dataset.sim](root); } catch (e) { console.error('Simulador', root.dataset.sim, e); }
    });
    redrawers.forEach(f => f());
  }

  global.Sims = { init, si };
})(window);

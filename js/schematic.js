/**
 * schematic.js
 * Dibujante mínimo de circuitos en SVG. Cada circuito se describe como datos
 * (lista de elementos entre dos puntos), así los diagramas quedan versionables
 * y los simuladores pueden actualizar las etiquetas en vivo.
 *
 * Elementos: W (cable), R, V (fuente de tensión), I (fuente de corriente),
 * C, L, SW (interruptor), dot (nodo), gnd (tierra), arrow (sentido de corriente),
 * loop (corriente de malla), text.
 */
(function (global) {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const H = 22; // media longitud del cuerpo de cada elemento [px]

  function el(name, attrs, parent) {
    const n = document.createElementNS(NS, name);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  /** Grupo con origen en el centro del segmento a→b y eje x a lo largo del elemento. */
  function frame(svg, a, b) {
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const len = Math.hypot(dx, dy);
    const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
    const cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2;
    const g = el('g', { transform: `translate(${cx} ${cy}) rotate(${ang})` }, svg);
    return { g, len, ux: dx / len, uy: dy / len, cx, cy };
  }

  function leads(g, len, gap) {
    el('line', { x1: -len / 2, y1: 0, x2: -gap, y2: 0, class: 'w' }, g);
    el('line', { x1: gap, y1: 0, x2: len / 2, y2: 0, class: 'w' }, g);
  }

  function label(svg, f, p) {
    if (!p.label) return null;
    const side = p.side || 1;
    const off = p.off || 26;
    // normal a la izquierda del sentido a→b
    const nx = f.uy * side, ny = -f.ux * side;
    const x = f.cx + nx * off, y = f.cy + ny * off;
    const horiz = Math.abs(f.ux) > 0.5;
    const t = el('text', {
      x, y: y + 4, class: 'lbl ' + (p.cls || ''),
      'text-anchor': horiz ? 'middle' : (nx > 0 ? 'start' : 'end'),
    }, svg);
    t.textContent = p.label;
    if (p.id) t.id = p.id;
    return t;
  }

  const draw = {
    W(svg, p) { el('line', { x1: p.a[0], y1: p.a[1], x2: p.b[0], y2: p.b[1], class: 'w' }, svg); },

    R(svg, p) {
      const f = frame(svg, p.a, p.b);
      leads(f.g, f.len, H);
      const pts = [[-H, 0]];
      for (let i = 0; i < 6; i++) pts.push([-H + (i + 0.5) * (2 * H / 6), i % 2 ? 7 : -7]);
      pts.push([H, 0]);
      el('polyline', { points: pts.map(q => q.join(',')).join(' '), class: 'w body' }, f.g);
      label(svg, f, p);
    },

    /** Fuente de tensión: placa larga = terminal +. p.plus = 'a' | 'b'. */
    V(svg, p) {
      const f = frame(svg, p.a, p.b);
      leads(f.g, f.len, 5);
      const s = p.plus === 'a' ? -1 : 1; // lado de la placa larga
      el('line', { x1: 5 * s, y1: -15, x2: 5 * s, y2: 15, class: 'w src' }, f.g);
      el('line', { x1: -5 * s, y1: -8, x2: -5 * s, y2: 8, class: 'w src thick' }, f.g);
      const plus = el('text', { x: 14 * s, y: -10, class: 'pol', 'text-anchor': 'middle' }, f.g);
      plus.textContent = '+';
      // el texto rotado se ve raro en vertical: lo enderezamos
      const ang = Math.atan2(f.uy, f.ux) * 180 / Math.PI;
      plus.setAttribute('transform', `rotate(${-ang} ${14 * s} -14)`);
      label(svg, f, p);
    },

    /** Fuente de corriente: la flecha apunta de a hacia b (p.dir = 'ba' la invierte). */
    I(svg, p) {
      const f = frame(svg, p.a, p.b);
      leads(f.g, f.len, 15);
      el('circle', { cx: 0, cy: 0, r: 15, class: 'w src fillbg' }, f.g);
      const s = p.dir === 'ba' ? -1 : 1;
      el('line', { x1: -9 * s, y1: 0, x2: 7 * s, y2: 0, class: 'w src' }, f.g);
      el('path', { d: `M ${9 * s} 0 L ${2 * s} -5 L ${2 * s} 5 Z`, class: 'arrowhead src' }, f.g);
      label(svg, f, p);
    },

    C(svg, p) {
      const f = frame(svg, p.a, p.b);
      leads(f.g, f.len, 5);
      el('line', { x1: -5, y1: -15, x2: -5, y2: 15, class: 'w cap' }, f.g);
      el('line', { x1: 5, y1: -15, x2: 5, y2: 15, class: 'w cap' }, f.g);
      label(svg, f, p);
    },

    L(svg, p) {
      const f = frame(svg, p.a, p.b);
      leads(f.g, f.len, H);
      let d = `M ${-H} 0`;
      for (let i = 0; i < 4; i++) d += ` a 5.5 6 0 0 1 11 0`;
      el('path', { d, class: 'w ind' }, f.g);
      label(svg, f, p);
    },

    SW(svg, p) {
      const f = frame(svg, p.a, p.b);
      leads(f.g, f.len, 14);
      el('circle', { cx: -14, cy: 0, r: 2.5, class: 'dotc' }, f.g);
      el('circle', { cx: 14, cy: 0, r: 2.5, class: 'dotc' }, f.g);
      el('line', { x1: -14, y1: 0, x2: 12, y2: -12, class: 'w' }, f.g);
      label(svg, f, p);
    },

    dot(svg, p) {
      el('circle', { cx: p.at[0], cy: p.at[1], r: 3.6, class: 'dotc' }, svg);
      if (p.label) {
        const t = el('text', { x: p.at[0] + (p.dx ?? 8), y: p.at[1] + (p.dy ?? -8), class: 'node' }, svg);
        t.textContent = p.label;
      }
    },

    term(svg, p) {
      el('circle', { cx: p.at[0], cy: p.at[1], r: 4, class: 'term' }, svg);
      if (p.label) {
        const t = el('text', { x: p.at[0] + (p.dx ?? 8), y: p.at[1] + (p.dy ?? 4), class: 'node' }, svg);
        t.textContent = p.label;
      }
    },

    gnd(svg, p) {
      const [x, y] = p.at;
      el('line', { x1: x, y1: y, x2: x, y2: y + 8, class: 'w' }, svg);
      [[12, 8], [8, 13], [4, 18]].forEach(([w, dy]) => el('line', { x1: x - w, y1: y + dy, x2: x + w, y2: y + dy, class: 'w' }, svg));
    },

    /** Flecha de corriente sobre un cable, en el punto at, apuntando en dir (r, l, u, d). */
    arrow(svg, p) {
      const [x, y] = p.at;
      const rot = { r: 0, d: 90, l: 180, u: 270 }[p.dir || 'r'];
      const g = el('g', { transform: `translate(${x} ${y}) rotate(${rot})` }, svg);
      el('path', { d: 'M 7 0 L -5 -5.5 L -5 5.5 Z', class: 'arrowhead cur' }, g);
      if (p.label) {
        const vertical = rot % 180 !== 0;
        const t = el('text', {
          x: x + (vertical ? 10 : 0), y: y + (vertical ? 4 : -10),
          class: 'lbl cur', 'text-anchor': vertical ? 'start' : 'middle',
        }, svg);
        t.textContent = p.label;
        if (p.id) t.id = p.id;
      }
    },

    /** Corriente de malla: arco horario con nombre al centro. */
    loop(svg, p) {
      const [x, y] = p.at; const r = p.r || 22;
      el('path', { d: `M ${x - r * 0.7} ${y - r * 0.7} A ${r} ${r} 0 1 1 ${x - r} ${y + 2}`, class: 'mesh' }, svg);
      el('path', { d: `M ${x - r * 0.7} ${y - r * 0.7} l -1 9 l 8 -6 z`, class: 'arrowhead mesh-h' }, svg);
      const t = el('text', { x, y: y + 5, class: 'lbl mesh-t', 'text-anchor': 'middle' }, svg);
      t.textContent = p.label;
    },

    text(svg, p) {
      const t = el('text', { x: p.at[0], y: p.at[1], class: 'lbl ' + (p.cls || ''), 'text-anchor': p.anchor || 'middle' }, svg);
      t.textContent = p.label;
      if (p.id) t.id = p.id;
    },
  };

  /**
   * Dibuja un circuito dentro de un contenedor.
   * @param {HTMLElement} host contenedor (figure)
   * @param {{w:number,h:number,parts:object[],title?:string}} spec
   */
  function render(host, spec) {
    const svg = el('svg', {
      viewBox: `0 0 ${spec.w} ${spec.h}`, class: 'sch', role: 'img',
      'aria-label': spec.title || 'Diagrama de circuito',
    });
    spec.parts.forEach(p => draw[p.t](svg, p));
    host.prepend(svg);
    return svg;
  }

  global.Schematic = { render };
})(window);

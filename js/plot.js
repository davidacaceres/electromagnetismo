/**
 * plot.js
 * Gráfico de líneas en canvas, sin dependencias. Toma los colores de los
 * tokens CSS para verse bien en tema claro y oscuro.
 */
(function (global) {
  'use strict';

  function token(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#888';
  }

  function niceStep(range, target = 5) {
    const raw = range / target;
    const mag = 10 ** Math.floor(Math.log10(raw));
    const n = raw / mag;
    return (n < 1.5 ? 1 : n < 3 ? 2 : n < 7 ? 5 : 10) * mag;
  }

  function fmt(v) {
    const a = Math.abs(v);
    if (a === 0) return '0';
    if (a >= 1000 || a < 0.01) return v.toExponential(0).replace('e+', 'e');
    return String(+v.toFixed(a < 1 ? 2 : a < 10 ? 1 : 0)).replace('.', ',');
  }

  /**
   * @param {HTMLCanvasElement} cv
   * @param {object} o { series:[{pts:[[x,y]], color, dash, label}], xLabel, yLabel,
   *                     xMin, xMax, yMin, yMax, vlines:[{x,label}], points:[{x,y,label,color}] }
   */
  function line(cv, o) {
    const dpr = window.devicePixelRatio || 1;
    const W = cv.clientWidth, Hh = cv.clientHeight;
    if (!W || !Hh) return;
    cv.width = W * dpr; cv.height = Hh * dpr;
    const c = cv.getContext('2d');
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, W, Hh);

    const pad = { l: 52, r: 14, t: 14, b: 40 };
    const pw = W - pad.l - pad.r, ph = Hh - pad.t - pad.b;
    const all = o.series.flatMap(s => s.pts);
    const xMin = o.xMin ?? Math.min(...all.map(p => p[0]));
    const xMax = o.xMax ?? Math.max(...all.map(p => p[0]));
    let yMin = o.yMin ?? Math.min(0, ...all.map(p => p[1]));
    let yMax = o.yMax ?? Math.max(...all.map(p => p[1]));
    if (yMax - yMin < 1e-12) yMax = yMin + 1;
    const X = x => pad.l + ((x - xMin) / (xMax - xMin)) * pw;
    const Y = y => pad.t + ph - ((y - yMin) / (yMax - yMin)) * ph;

    const ink = token('--muted'), grid = token('--grid');
    c.font = '11px "JetBrains Mono", ui-monospace, monospace';
    c.lineWidth = 1;

    // grilla y ticks
    const ys = niceStep(yMax - yMin), xs = niceStep(xMax - xMin, 6);
    c.fillStyle = ink; c.strokeStyle = grid;
    c.textAlign = 'right'; c.textBaseline = 'middle';
    for (let y = Math.ceil(yMin / ys) * ys; y <= yMax + 1e-9; y += ys) {
      c.beginPath(); c.moveTo(pad.l, Y(y)); c.lineTo(pad.l + pw, Y(y)); c.stroke();
      c.fillText(fmt(y), pad.l - 6, Y(y));
    }
    c.textAlign = 'center'; c.textBaseline = 'top';
    for (let x = Math.ceil(xMin / xs) * xs; x <= xMax + 1e-9; x += xs) {
      c.beginPath(); c.moveTo(X(x), pad.t); c.lineTo(X(x), pad.t + ph); c.stroke();
      c.fillText(fmt(x), X(x), pad.t + ph + 6);
    }
    if (o.xLabel) { c.fillText(o.xLabel, pad.l + pw / 2, pad.t + ph + 22); }
    if (o.yLabel) {
      c.save(); c.translate(12, pad.t + ph / 2); c.rotate(-Math.PI / 2);
      c.textBaseline = 'middle'; c.fillText(o.yLabel, 0, 0); c.restore();
    }

    // líneas verticales de referencia (por ejemplo t = τ)
    (o.vlines || []).forEach(v => {
      c.save(); c.setLineDash([4, 4]); c.strokeStyle = token('--muted');
      c.beginPath(); c.moveTo(X(v.x), pad.t); c.lineTo(X(v.x), pad.t + ph); c.stroke(); c.restore();
      if (v.label) { c.textAlign = 'left'; c.textBaseline = 'top'; c.fillStyle = ink; c.fillText(v.label, X(v.x) + 4, pad.t + 2); }
    });

    // series
    o.series.forEach(s => {
      c.save();
      c.strokeStyle = s.color; c.lineWidth = 2.2;
      if (s.dash) c.setLineDash(s.dash);
      c.beginPath();
      s.pts.forEach((p, i) => (i ? c.lineTo(X(p[0]), Y(p[1])) : c.moveTo(X(p[0]), Y(p[1]))));
      c.stroke();
      if (s.fill) {
        c.globalAlpha = 0.12; c.fillStyle = s.color;
        c.lineTo(X(s.pts[s.pts.length - 1][0]), Y(Math.max(yMin, 0)));
        c.lineTo(X(s.pts[0][0]), Y(Math.max(yMin, 0))); c.closePath(); c.fill();
      }
      c.restore();
    });

    // puntos destacados
    (o.points || []).forEach(p => {
      c.fillStyle = p.color || token('--fg');
      c.beginPath(); c.arc(X(p.x), Y(p.y), 4.5, 0, Math.PI * 2); c.fill();
      if (p.label) {
        c.textAlign = X(p.x) > pad.l + pw * 0.7 ? 'right' : 'left'; c.textBaseline = 'bottom';
        c.fillText(p.label, X(p.x) + (c.textAlign === 'right' ? -8 : 8), Y(p.y) - 6);
      }
    });
  }

  /** Muestrea f en [a, b] con n puntos. */
  function sample(f, a, b, n = 200) {
    const out = [];
    for (let i = 0; i <= n; i++) { const x = a + (i / n) * (b - a); out.push([x, f(x)]); }
    return out;
  }

  global.Plot = { line, sample, token, fmt };
})(window);

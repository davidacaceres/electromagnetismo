/**
 * panel.js
 * Panel de referencia del lado derecho, visible desde cualquier módulo:
 *   - Notación: símbolos del curso con unidad y variantes de los apuntes (datos en notation.js).
 *   - Formulario: todas las fórmulas, cada una con "Explicar paso a paso" (datos en js/formulas/).
 * La explicación se abre en una ventana (<dialog>) y MathJax la compone al abrirla.
 * El panel filtra por el módulo abierto o muestra todo, y tiene buscador.
 */
(function () {
  'use strict';

  const N = window.Notation;
  const F = window.Formulas || [];
  if (!N) return;

  const store = {
    get(k, d) { try { const v = localStorage.getItem('em:' + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem('em:' + k, JSON.stringify(v)); } catch { /* sin almacenamiento */ } },
  };

  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  /* Texto plano para el buscador: sin TeX, sin tildes, en minúscula. */
  const plain = s => String(s)
    .replace(/\\[a-zA-Z]+/g, ' ').replace(/[{}\\^_$()]/g, ' ')
    .normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  /* Las fórmulas con varias partes separadas por \qquad se apilan en líneas para que quepan. */
  const stack = tex => {
    const t = tex.replace(/\\qquad\s*\\Long(left)?rightarrow\s*\\qquad/g, (m, l) => l ? ' \\;\\Longleftrightarrow\\; ' : ' \\;\\Longrightarrow\\; ');
    const parts = t.split('\\qquad').reduce((acc, p) => {
      if (acc.length && /^\s*\[/.test(p)) acc[acc.length - 1] += '\\quad' + p; else acc.push(p); /* la unidad queda junto a su fórmula */
      return acc;
    }, []);
    return parts.length > 1 ? '\\begin{gathered}' + parts.join('\\\\[4pt]') + '\\end{gathered}' : t;
  };
  const modLabel = id => id === 'inicio' ? '' : id.replace(/^m2(\d+)$/, '2.$1');

  /* ---------- estructura ---------- */
  const rail = document.createElement('div');
  rail.className = 'ref-rail';
  rail.innerHTML =
    '<button type="button" data-ref-open="notacion" aria-controls="refpanel">Notación</button>' +
    '<button type="button" data-ref-open="formulario" aria-controls="refpanel">Formulario</button>';

  const panel = document.createElement('aside');
  panel.className = 'refpanel';
  panel.id = 'refpanel';
  panel.setAttribute('aria-label', 'Notación y formulario del curso');
  panel.innerHTML = `
    <header class="ref-head">
      <div class="ref-tabs" role="tablist">
        <button type="button" role="tab" data-ref-tab="notacion">Notación</button>
        <button type="button" role="tab" data-ref-tab="formulario">Formulario</button>
      </div>
      <button type="button" class="ref-close" data-ref-close aria-label="Cerrar panel">×</button>
    </header>
    <div class="ref-tools">
      <div class="ref-scope" role="group" aria-label="Qué mostrar">
        <button type="button" data-scope="mod"></button>
        <button type="button" data-scope="all">Todo el curso</button>
      </div>
      <input type="search" class="ref-search" placeholder="Buscar símbolo o fórmula" aria-label="Buscar en el panel">
    </div>
    <div class="ref-body">
      <section data-ref-pane="notacion">${notationHTML()}</section>
      <section data-ref-pane="formulario">${formulasHTML()}</section>
      <p class="ref-empty" hidden>No hay resultados con ese filtro.</p>
    </div>`;

  const dialog = document.createElement('dialog');
  dialog.className = 'tutor';
  dialog.setAttribute('aria-labelledby', 'tutor-title');

  document.body.append(rail, panel, dialog);

  function notationHTML() {
    const conv = N.conventions.map(c => `<li><b>${esc(c.t)}.</b> ${c.d}</li>`).join('');
    const groups = N.groups.map(g => `
      <div class="ref-group" data-group>
        <h3>${esc(g.title)} <small>${esc(g.src)}</small></h3>
        <table class="ref-table">
          <thead><tr><th scope="col">Símbolo</th><th scope="col">Qué es</th><th scope="col">Unidad</th></tr></thead>
          <tbody>${g.items.map(it => `
            <tr data-item data-mods="${it.m.join(' ')}" data-text="${esc(plain(it.s + ' ' + it.n + ' ' + (it.v || '') + ' ' + g.title))}">
              <td class="sym">\\(${it.s}\\)</td>
              <td>${it.n}${it.v ? `<span class="variant">En tus apuntes: ${it.v}</span>` : ''}</td>
              <td class="unit">${esc(it.u)}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>`).join('');
    return `<details class="ref-conv"><summary>Reglas de escritura del curso</summary><ul>${conv}</ul></details>${groups}`;
  }

  function formulasHTML() {
    const byGroup = new Map();
    F.forEach(f => { if (!byGroup.has(f.g)) byGroup.set(f.g, []); byGroup.get(f.g).push(f); });
    return [...byGroup].map(([g, items]) => `
      <div class="ref-group" data-group>
        <h3>${esc(g)}</h3>
        ${items.map(f => `
          <article class="fcard" data-item data-mods="${f.m.join(' ')}" data-text="${esc(plain(f.t + ' ' + f.g + ' ' + f.f))}">
            <h4>${esc(f.t)}<span class="fmods">Módulo ${f.m.map(modLabel).join(' · ')}</span></h4>
            <div class="fmath">$$${stack(f.f)}$$</div>
            <button type="button" class="fexplain" data-explain="${f.id}">Explicar paso a paso</button>
          </article>`).join('')}
      </div>`).join('');
  }

  /* ---------- explicación tipo tutor ---------- */
  function tutorHTML(f) {
    const x = f.x;
    const sym = x.simbolos.map(([s, d]) => `<tr><td class="sym">\\(${s}\\)</td><td>${d}</td></tr>`).join('');
    return `
      <header class="tutor-head">
        <div><span class="tutor-kicker">${esc(f.g)} · módulo ${f.m.map(modLabel).join(', ')}</span>
        <h2 id="tutor-title">${esc(f.t)}</h2></div>
        <button type="button" class="ref-close" data-tutor-close aria-label="Cerrar explicación">×</button>
      </header>
      <div class="tutor-body">
        <div class="tutor-formula">$$${stack(f.f)}$$</div>
        <section><h3><span>1</span>Qué dice</h3>${x.idea}</section>
        <section><h3><span>2</span>De dónde sale</h3><ol class="tutor-steps">${x.pasos.map(p => `<li>${p}</li>`).join('')}</ol></section>
        <section><h3><span>3</span>Qué es cada símbolo</h3><table class="ref-table"><tbody>${sym}</tbody></table></section>
        <section><h3><span>4</span>Cuándo se usa</h3>${x.cuando}</section>
        <section class="tutor-example"><h3><span>5</span>Ejemplo</h3>
          <p class="tutor-q">${x.ejemplo.q}</p>
          <ol class="tutor-steps">${x.ejemplo.pasos.map(p => `<li>${p}</li>`).join('')}</ol>
          <p class="tutor-r">${x.ejemplo.r}</p>
        </section>
        <section class="tutor-warn"><h3><span>!</span>Error típico en el certamen</h3>${x.error}</section>
      </div>`;
  }

  function openTutor(id) {
    const f = F.find(it => it.id === id);
    if (!f) return;
    if (window.MathJax && MathJax.typesetClear) MathJax.typesetClear([dialog]);
    dialog.innerHTML = tutorHTML(f);
    if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', '');
    dialog.querySelector('.tutor-body').scrollTop = 0;
    typeset([dialog]);
  }
  function closeTutor() { if (dialog.open) dialog.close(); dialog.removeAttribute('open'); }
  dialog.addEventListener('click', e => {
    if (e.target.closest('[data-tutor-close]') || e.target === dialog) closeTutor();
  });

  function typeset(nodes) {
    const MJ = window.MathJax;
    if (!MJ) return;
    const run = () => MJ.typesetPromise ? MJ.typesetPromise(nodes).catch(() => {}) : null;
    if (MJ.startup && MJ.startup.promise) MJ.startup.promise.then(run); else run();
  }

  /* ---------- estado: abierto, pestaña, alcance, búsqueda ---------- */
  const state = {
    /* Sin preferencia guardada, el panel parte abierto si la pantalla tiene espacio para él (≥ 1280 px). */
    open: store.get('ref:open', matchMedia('(min-width: 1280px)').matches),
    tab: store.get('ref:tab', 'notacion'),
    scope: store.get('ref:scope', 'mod'),
    q: '',
  };
  const currentModule = () => (document.querySelector('[data-module]:not([hidden])') || {}).id || 'inicio';

  function render() {
    document.body.classList.toggle('ref-open', state.open);
    panel.setAttribute('aria-hidden', String(!state.open));
    panel.inert = !state.open;
    rail.querySelectorAll('[data-ref-open]').forEach(b => b.setAttribute('aria-expanded', String(state.open && b.dataset.refOpen === state.tab)));

    panel.querySelectorAll('[data-ref-tab]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.refTab === state.tab)));
    panel.querySelectorAll('[data-ref-pane]').forEach(p => { p.hidden = p.dataset.refPane !== state.tab; });

    const mod = currentModule();
    const modBtn = panel.querySelector('[data-scope="mod"]');
    const inModule = mod !== 'inicio';
    modBtn.textContent = inModule ? `Módulo ${modLabel(mod)}` : 'Módulo actual';
    modBtn.disabled = !inModule;
    const scope = inModule ? state.scope : 'all';
    panel.querySelectorAll('[data-scope]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.scope === scope)));

    const q = plain(state.q.trim());
    const pane = panel.querySelector(`[data-ref-pane="${state.tab}"]`);
    let shown = 0;
    pane.querySelectorAll('[data-item]').forEach(el => {
      const okMod = scope === 'all' || el.dataset.mods.split(' ').includes(mod);
      const okQ = !q || el.dataset.text.includes(q);
      el.hidden = !(okMod && okQ);
      if (!el.hidden) shown++;
    });
    pane.querySelectorAll('[data-group]').forEach(g => { g.hidden = !g.querySelector('[data-item]:not([hidden])'); });
    panel.querySelector('.ref-empty').hidden = shown > 0;

    store.set('ref:open', state.open);
    store.set('ref:tab', state.tab);
    store.set('ref:scope', state.scope);
  }

  document.addEventListener('click', e => {
    const open = e.target.closest('[data-ref-open]');
    if (open) {
      const same = state.open && state.tab === open.dataset.refOpen;
      state.open = !same;
      state.tab = open.dataset.refOpen;
      render();
      if (state.open) panel.querySelector(`[data-ref-tab="${state.tab}"]`).focus();
      return;
    }
    if (e.target.closest('[data-ref-close]') && !e.target.closest('dialog')) { state.open = false; render(); return; }
    const tab = e.target.closest('[data-ref-tab]');
    if (tab) { state.tab = tab.dataset.refTab; render(); return; }
    const sc = e.target.closest('[data-scope]');
    if (sc && !sc.disabled) { state.scope = sc.dataset.scope; render(); return; }
    const ex = e.target.closest('[data-explain]');
    if (ex) openTutor(ex.dataset.explain);
  });
  panel.querySelector('.ref-search').addEventListener('input', e => { state.q = e.target.value; render(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && state.open && !dialog.open) { state.open = false; render(); }
  });
  window.addEventListener('hashchange', render);

  /* ---------- enlaces "Explicar" en los bloques "Ecuaciones que usarás" ---------- */
  document.querySelectorAll('dt[data-f]').forEach(dt => {
    if (!F.some(f => f.id === dt.dataset.f)) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'dt-explain';
    b.dataset.explain = dt.dataset.f;
    b.textContent = 'Explicar';
    dt.append(' ', b);
  });

  render();
})();

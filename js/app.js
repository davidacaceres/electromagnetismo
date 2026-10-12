/**
 * app.js
 * Navegación entre módulos, progreso de estudio, tema claro/oscuro y
 * el flujo "pauta bloqueada" de los ejercicios tipo certamen.
 */
(function () {
  'use strict';

  const store = {
    get(k, d) { try { const v = localStorage.getItem('em:' + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem('em:' + k, JSON.stringify(v)); } catch { /* sin almacenamiento */ } },
  };

  const modules = [...document.querySelectorAll('[data-module]')];
  const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];

  /* ---------- diagramas de circuitos ---------- */
  document.querySelectorAll('figure[data-circuit]').forEach(fig => {
    const spec = window.Circuits[fig.dataset.circuit];
    if (spec) window.Schematic.render(fig, spec);
  });

  /* ---------- navegación por hash (#inicio, #m21, …) ---------- */
  function show(id) {
    const target = modules.find(m => m.id === id) || modules[0];
    modules.forEach(m => { m.hidden = m !== target; });
    navLinks.forEach(a => a.setAttribute('aria-current', a.getAttribute('href') === '#' + target.id ? 'page' : 'false'));
    document.body.classList.remove('nav-open');
    window.Sims.init(target);
    const i = modules.indexOf(target);
    const prev = modules[i - 1], next = modules[i + 1];
    const pager = target.querySelector('.pager');
    if (pager) {
      pager.innerHTML =
        (prev ? `<a class="pg prev" href="#${prev.id}"><small>Anterior</small>${prev.dataset.title}</a>` : '<span></span>') +
        (next ? `<a class="pg next" href="#${next.id}"><small>Siguiente</small>${next.dataset.title}</a>` : '<span></span>');
    }
    store.set('last', target.id);
    window.scrollTo({ top: 0 });
  }
  window.addEventListener('hashchange', () => show(location.hash.slice(1)));

  /* ---------- progreso ---------- */
  const done = new Set(store.get('done', []));
  function paintProgress() {
    navLinks.forEach(a => a.classList.toggle('is-done', done.has(a.getAttribute('href').slice(1))));
    document.querySelectorAll('[data-done-toggle]').forEach(b => {
      const id = b.closest('[data-module]').id;
      b.setAttribute('aria-pressed', done.has(id));
      b.textContent = done.has(id) ? 'Módulo estudiado ✓' : 'Marcar módulo como estudiado';
    });
    const total = modules.filter(m => m.id !== 'inicio').length;
    const pct = Math.round((done.size / total) * 100);
    document.querySelectorAll('[data-progress]').forEach(el => { el.style.setProperty('--p', pct + '%'); el.querySelector('span').textContent = `${done.size}/${total}`; });
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-done-toggle]');
    if (!b) return;
    const id = b.closest('[data-module]').id;
    done.has(id) ? done.delete(id) : done.add(id);
    store.set('done', [...done]);
    paintProgress();
  });

  /* ---------- ejercicios: la pauta se libera solo después del desarrollo ---------- */
  document.querySelectorAll('.certamen').forEach(box => {
    const chk = box.querySelector('.gate input[type=checkbox]');
    const ta = box.querySelector('.gate textarea');
    const btn = box.querySelector('.gate button');
    const sol = box.querySelector('.pauta');
    const key = 'draft:' + box.closest('[data-module]').id;
    if (ta) {
      ta.value = store.get(key, '');
      ta.addEventListener('input', () => store.set(key, ta.value));
    }
    const ready = () => { btn.disabled = !(chk.checked && ta.value.trim().length >= 20); };
    chk.addEventListener('change', ready); ta.addEventListener('input', ready); ready();
    btn.addEventListener('click', () => {
      sol.hidden = false;
      btn.disabled = true;
      btn.textContent = 'Pauta abierta';
      if (window.MathJax?.typesetPromise) MathJax.typesetPromise([sol]);
    });
  });

  /* ---------- tema ---------- */
  const root = document.documentElement;
  const saved = store.get('theme', null);
  if (saved) root.dataset.theme = saved;
  document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
    const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    store.set('theme', root.dataset.theme);
  });

  /* ---------- menú móvil ---------- */
  document.querySelector('[data-nav-toggle]')?.addEventListener('click', () => document.body.classList.toggle('nav-open'));

  paintProgress();
  show(location.hash.slice(1) || store.get('last', 'inicio'));
})();

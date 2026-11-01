import './styles/main.css';
import { register, init } from './router.js';
import { renderShell } from './components/shell.js';
import { renderHome } from './pages/home.js';
import { renderCatalog, renderDC } from './pages/catalog.js';
import { renderSourceMap, renderOtBook } from './pages/source-map.js';
import { renderThread } from './pages/thread.js';
import { renderDetail } from './pages/detail.js';
import { renderAbout } from './pages/about.js';
import { renderEntryCard } from './components/card.js';

const app = document.getElementById('app');
let catalog = null;

async function loadCatalog() {
  if (catalog) return catalog;
  const res = await fetch(import.meta.env.BASE_URL + 'data/catalog.json');
  if (!res.ok) throw new Error(`Could not load catalog (${res.status})`);
  catalog = await res.json();
  return catalog;
}

function render(content) {
  app.innerHTML = renderShell(content);
  window.scrollTo(0, 0);
}

function renderError(msg) {
  render(`<p style="color:var(--danger);padding:var(--sp-5) 0">${msg}</p>`);
}

function loading() {
  render('<p style="color:var(--text-muted);padding:var(--sp-8) 0">Loading…</p>');
}

// ---- Global event delegation ----

// Timeline section collapse/expand (home page)
window.toggleSection = function(sectionId) {
  const header = document.getElementById(sectionId + '-header');
  const cards = document.getElementById(sectionId + '-cards');
  if (!header || !cards) return;
  const expanded = header.getAttribute('aria-expanded') === 'true';
  header.setAttribute('aria-expanded', String(!expanded));
  expanded ? cards.setAttribute('hidden', '') : cards.removeAttribute('hidden');
  const toggle = header.querySelector('.timeline-section-header__toggle');
  if (toggle) toggle.textContent = expanded ? '▸' : '▾';
};

// Filter drawer open/close
function openFilterDrawer() {
  const overlay = document.getElementById('filter-drawer-overlay');
  const drawer = document.getElementById('filter-drawer');
  const btn = app.querySelector('[data-action="filter-open"]');
  if (drawer) drawer.classList.add('open');
  if (overlay) overlay.classList.add('open');
  if (btn) btn.setAttribute('aria-expanded', 'true');
  const closeBtn = drawer?.querySelector('[data-action="filter-close"]');
  closeBtn?.focus();
}

function closeFilterDrawer() {
  const overlay = document.getElementById('filter-drawer-overlay');
  const drawer = document.getElementById('filter-drawer');
  const btn = app.querySelector('[data-action="filter-open"]');
  drawer?.classList.remove('open');
  overlay?.classList.remove('open');
  if (btn) { btn.setAttribute('aria-expanded', 'false'); btn.focus(); }
}

// Update filter URL hash
function updateFilterHash(axis, value, checked, route) {
  const hash = window.location.hash || '#/';
  const qmark = hash.indexOf('?');
  const queryStr = qmark >= 0 ? hash.slice(qmark + 1) : '';
  const params = new URLSearchParams(queryStr);
  const current = params.getAll(axis);
  const next = checked
    ? [...new Set([...current, value])]
    : current.filter(v => v !== value);
  params.delete(axis);
  next.forEach(v => params.append(axis, v));
  const qs = params.toString();
  window.location.hash = '#/' + route + (qs ? '?' + qs : '');
}

// Delegated event listener
app.addEventListener('change', e => {
  const cb = e.target.closest('input[data-axis]');
  if (cb) {
    updateFilterHash(cb.dataset.axis, cb.dataset.value, cb.checked, cb.dataset.route);
  }
});

app.addEventListener('click', e => {
  // Shortcut chips
  const chip = e.target.closest('[data-action="shortcut"]');
  if (chip) {
    const params = JSON.parse(chip.dataset.params || '{}');
    const route = chip.dataset.route || 'catalog';
    const qs = Object.entries(params).map(([k, v]) =>
      `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
    ).join('&');
    window.location.hash = '#/' + route + (qs ? '?' + qs : '');
    return;
  }

  // Clear all filters
  const clearBtn = e.target.closest('[data-action="filter-clear"]');
  if (clearBtn) {
    window.location.hash = '#/' + (clearBtn.dataset.route || 'catalog');
    return;
  }

  // Filter drawer open
  if (e.target.closest('[data-action="filter-open"]')) {
    openFilterDrawer();
    return;
  }

  // Filter drawer close
  if (e.target.closest('[data-action="filter-close"]')) {
    closeFilterDrawer();
    return;
  }
});

// ---- Routes ----

register('', async () => {
  try {
    loading();
    const data = await loadCatalog();
    render(renderHome(data));

    // Collapse all sections except the first on mobile
    if (window.innerWidth < 900) {
      app.querySelectorAll('.timeline-section').forEach((section, i) => {
        if (i === 0) return;
        const id = section.id;
        const header = document.getElementById(id + '-header');
        const cards = document.getElementById(id + '-cards');
        if (header && cards) {
          header.setAttribute('aria-expanded', 'false');
          cards.setAttribute('hidden', '');
          const toggle = header.querySelector('.timeline-section-header__toggle');
          if (toggle) toggle.textContent = '▸';
        }
      });
    }
  } catch (e) {
    renderError('Could not load the timeline: ' + e.message);
  }
});

register('catalog', async ({ params }) => {
  try {
    loading();
    const data = await loadCatalog();
    render(renderCatalog(data, params));
  } catch (e) {
    renderError('Could not load entries: ' + e.message);
  }
});

register('dc', async ({ params }) => {
  try {
    loading();
    const data = await loadCatalog();
    render(renderDC(data, params));
  } catch (e) {
    renderError('Could not load D&C entries: ' + e.message);
  }
});

register('source-map', async () => {
  try {
    loading();
    const data = await loadCatalog();
    render(renderSourceMap(data));
  } catch (e) {
    renderError('Could not load source map: ' + e.message);
  }
});

register('thread', async () => {
  try {
    loading();
    const data = await loadCatalog();
    render(renderThread(data));
  } catch (e) {
    renderError('Could not load repeated passages: ' + e.message);
  }
});

register('about', () => {
  render(renderAbout());
});

register('entry', async ({ id }) => {
  try {
    loading();
    const data = await loadCatalog();
    const entry = id
      ? data.quotations?.find(e => e.id.toLowerCase() === id.toLowerCase())
      : null;
    const back = (() => {
      const hash = window.location.hash || '';
      const qi = hash.indexOf('?');
      if (qi < 0) return '#/';
      return new URLSearchParams(hash.slice(qi + 1)).get('back') || '#/';
    })();
    data.backHash = back;
    render(renderDetail(entry, data));
    document.getElementById('main-content')?.focus();
  } catch (e) {
    renderError('Could not load entry: ' + e.message);
  }
});

register('ot-book', async ({ id }) => {
  try {
    loading();
    const data = await loadCatalog();
    render(renderOtBook(data, id || ''));
  } catch (e) {
    renderError('Could not load book view: ' + e.message);
  }
});

register('pattern', async ({ id }) => {
  try {
    loading();
    const data = await loadCatalog();
    const pattern = data.patterns?.find(p => p.id.toLowerCase() === (id || '').toLowerCase());
    if (!pattern) { render('<p style="color:var(--text-muted)">Pattern not found.</p>'); return; }
    const entries = (data.quotations || []).filter(e =>
      (e.pattern_ids || []).some(pid => pid.toLowerCase() === (id || '').toLowerCase()) &&
      e.publication_status === 'approved'
    );
    render(`
      <a href="#/catalog" class="entry-detail__back">← All Entries</a>
      <h1 class="page-title">${pattern.name}</h1>
      <p class="page-subtitle">${pattern.description || ''}</p>
      <p class="text-muted" style="font-size:13px;margin-bottom:var(--sp-5)">Strength: ${pattern.strength || '—'}</p>
      <ul class="card-grid" role="list">
        ${entries.map(e => `<li>${renderEntryCard(e)}</li>`).join('')}
      </ul>
    `);
  } catch (e) {
    renderError('Could not load pattern: ' + e.message);
  }
});

init();

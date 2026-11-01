import { escapeHtml, citationTypeLabel } from '../components/utils.js';
import { renderEntryCard } from '../components/card.js';

const PATTERN_SHORTCUTS = [
  { label: 'Wilderness — Deuteronomy', params: { audience: 'AUD-WILDERNESS' } },
  { label: 'At the cross', params: { audience: 'AUD-CROSS' } },
  { label: 'Isaiah in 3 Nephi', params: { book: 'ISA', audience: 'AUD-NEPHITE' } },
  { label: 'Self-identification', params: { mode: 'self_identification' } },
  { label: 'Corrective teaching', params: { mode: 'corrective_teaching' } },
  { label: 'Lament', params: { mode: 'lament' } },
];

export function renderCatalog(catalog, params) {
  const entries = (catalog.quotations || []).filter(e =>
    e.publication_status === 'approved' && e.segment === 'gospels-3ne'
  );
  return renderCatalogSurface(entries, catalog, params, 'catalog', 'All Entries', 108);
}

export function renderDC(catalog, params) {
  const entries = (catalog.quotations || []).filter(e =>
    e.publication_status === 'approved' && e.segment === 'dc'
  );
  const dcLabel = `
    <div class="dc-section-label">
      <h2 class="dc-section-label__heading">Doctrine and Covenants — Latter-day Revelation</h2>
      <p class="dc-section-label__desc">In the Doctrine and Covenants, Jesus Christ speaks in first person to the Prophet Joseph Smith and early Church leaders. These entries record moments where Christ's words echo or directly quote Old Testament scripture. They are kept here, separate from the mortal-ministry records, because they come from a different source and setting — not the Galilean ministry but ongoing revelation to the Restoration Church.</p>
    </div>
  `;
  return dcLabel + renderCatalogSurface(entries, catalog, params, 'dc', 'Doctrine and Covenants Entries', entries.length);
}

function renderCatalogSurface(entries, catalog, params, route, headingText, totalCount) {
  const activeFilters = parseFilters(params);
  const filtered = applyFilters(entries, activeFilters);
  const otBooks = catalog.ot_books || [];
  const settings = catalog.audience_settings || [];
  const hasActiveFilters = Object.values(activeFilters).some(v => Array.isArray(v) && v.length > 0);

  const cardsHtml = filtered.length > 0
    ? `<ul class="card-grid" role="list">${filtered.map(e => `<li>${renderEntryCard(e, '#/' + route)}</li>`).join('')}</ul>`
    : `<p style="color:var(--text-muted);padding:var(--sp-5) 0">No entries match the selected filters.</p>`;

  const shortcutsHtml = route === 'catalog' ? renderShortcuts(activeFilters, route) : '';

  return `
    <h1 class="page-title">${escapeHtml(headingText)}</h1>

    <button class="filter-toggle-btn"
            data-action="filter-open"
            data-route="${escapeHtml(route)}"
            aria-expanded="false"
            aria-controls="filter-drawer">
      Filter entries${hasActiveFilters ? ' (active)' : ''}
    </button>

    ${shortcutsHtml}

    <div class="catalog-layout">
      <aside class="filter-sidebar" aria-label="Filter entries">
        <div class="filter-panel">
          ${renderFilterPanel(entries, otBooks, settings, activeFilters, route, filtered.length, totalCount, hasActiveFilters)}
        </div>
      </aside>

      <section aria-label="Filtered results">
        <p aria-live="polite" role="status" class="result-count">
          Showing ${filtered.length} of ${totalCount} entries
        </p>
        ${cardsHtml}
      </section>
    </div>

    <!-- Mobile filter drawer -->
    <div class="filter-drawer-overlay" id="filter-drawer-overlay" data-action="filter-close"></div>
    <div class="filter-drawer" id="filter-drawer" role="dialog" aria-modal="true" aria-label="Filter entries">
      <div class="filter-drawer__header">
        <span style="font-weight:600;font-size:16px">Filter entries</span>
        <button class="filter-drawer__close"
                data-action="filter-close"
                aria-label="Close filter panel">✕</button>
      </div>
      ${renderFilterPanel(entries, otBooks, settings, activeFilters, route, filtered.length, totalCount, hasActiveFilters)}
    </div>
  `;
}

function renderShortcuts(activeFilters, route) {
  return `
    <div class="pattern-shortcuts" role="group" aria-label="Quick filters">
      ${PATTERN_SHORTCUTS.map(sc => {
        const isActive = Object.entries(sc.params).every(([k, v]) => {
          const cur = activeFilters[k] || [];
          return cur.includes(v);
        });
        const paramsJson = escapeHtml(JSON.stringify(sc.params));
        return `
          <button class="shortcut-chip"
                  aria-pressed="${isActive}"
                  data-action="shortcut"
                  data-params="${paramsJson}"
                  data-route="${escapeHtml(route)}">
            ${escapeHtml(sc.label)}
          </button>
        `;
      }).join('')}
    </div>
  `;
}

function renderFilterPanel(entries, otBooks, settings, activeFilters, route, filteredCount, totalCount, hasActiveFilters) {
  const booksWithEntries = otBooks.filter(b =>
    (b.entry_ids || []).some(eid => entries.find(e => e.id === eid))
  );

  return `
    <div class="filter-controls">
      <span class="result-count" style="font-size:13px">
        ${filteredCount} of ${totalCount}
      </span>
      ${hasActiveFilters ? `
        <button class="btn-clear"
                data-action="filter-clear"
                data-route="${escapeHtml(route)}">Clear all</button>
      ` : ''}
    </div>

    <fieldset class="filter-group">
      <legend>OT Book</legend>
      ${booksWithEntries.map(book => {
        const count = entries.filter(e => (e.ot_book_ids || []).includes(book.id)).length;
        const checked = (activeFilters.book || []).includes(book.id) ? 'checked' : '';
        return `
          <label class="filter-option">
            <input type="checkbox"
                   ${checked}
                   data-axis="book"
                   data-value="${escapeHtml(book.id)}"
                   data-route="${escapeHtml(route)}">
            ${escapeHtml(book.name)}
            <span class="filter-option__count">${count}</span>
          </label>
        `;
      }).join('')}
    </fieldset>

    <fieldset class="filter-group">
      <legend>Setting</legend>
      ${settings.filter(s => s.id !== 'AUD-DC' || route === 'dc').map(setting => {
        const count = entries.filter(e => (e.audience_setting_ids || []).includes(setting.id)).length;
        if (count === 0) return '';
        const checked = (activeFilters.audience || []).includes(setting.id) ? 'checked' : '';
        return `
          <label class="filter-option">
            <input type="checkbox"
                   ${checked}
                   data-axis="audience"
                   data-value="${escapeHtml(setting.id)}"
                   data-route="${escapeHtml(route)}">
            ${escapeHtml(setting.label)}
            <span class="filter-option__count">${count}</span>
          </label>
        `;
      }).join('')}
    </fieldset>

    <fieldset class="filter-group">
      <legend>Citation Type</legend>
      ${['direct-quotation', 'explicit-citation', 'paraphrase-formula', 'close-allusion', 'full-chapter'].map(type => {
        const count = entries.filter(e => [].concat(e.citation_type || []).includes(type)).length;
        if (count === 0) return '';
        const checked = (activeFilters.type || []).includes(type) ? 'checked' : '';
        return `
          <label class="filter-option">
            <input type="checkbox"
                   ${checked}
                   data-axis="type"
                   data-value="${escapeHtml(type)}"
                   data-route="${escapeHtml(route)}">
            ${escapeHtml(citationTypeLabel(type))}
            <span class="filter-option__count">${count}</span>
          </label>
        `;
      }).join('')}
    </fieldset>

    <fieldset class="filter-group">
      <legend>Citation Mode</legend>
      ${[
        { value: 'corrective_teaching', label: 'Corrective teaching' },
        { value: 'self_identification', label: 'Self-identification' },
        { value: 'lament', label: 'Lament' },
        { value: 'composite', label: 'Composite' },
      ].map(({ value, label }) => {
        const count = entries.filter(e => e.citation_mode === value).length;
        if (count === 0) return '';
        const checked = (activeFilters.mode || []).includes(value) ? 'checked' : '';
        return `
          <label class="filter-option">
            <input type="checkbox"
                   ${checked}
                   data-axis="mode"
                   data-value="${escapeHtml(value)}"
                   data-route="${escapeHtml(route)}">
            ${escapeHtml(label)}
            <span class="filter-option__count">${count}</span>
          </label>
        `;
      }).join('')}
    </fieldset>
  `;
}

export function parseFilters(params) {
  const ensure = v => v ? (Array.isArray(v) ? v : [v]) : [];
  return {
    book:     ensure(params.book),
    audience: ensure(params.audience),
    type:     ensure(params.type),
    mode:     ensure(params.mode),
  };
}

export function applyFilters(entries, filters) {
  return entries.filter(entry => {
    if (filters.book.length && !filters.book.some(b => (entry.ot_book_ids || []).includes(b))) return false;
    if (filters.audience.length && !filters.audience.some(a => (entry.audience_setting_ids || []).includes(a))) return false;
    if (filters.type.length) {
      const types = [].concat(entry.citation_type || []);
      if (!filters.type.some(t => types.includes(t))) return false;
    }
    if (filters.mode.length && !filters.mode.includes(entry.citation_mode)) return false;
    return true;
  });
}

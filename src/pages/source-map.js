import { escapeHtml } from '../components/utils.js';
import { renderEntryCard } from '../components/card.js';

function sizeClass(occasions, max) {
  const ratio = occasions / max;
  if (ratio >= 0.85) return 'size-xl';
  if (ratio >= 0.57) return 'size-l';
  if (ratio >= 0.36) return 'size-m';
  if (ratio >= 0.21) return 'size-s';
  return 'size-xs';
}

export function renderSourceMap(catalog) {
  const otBooks = (catalog.ot_books || []).filter(b => b.unique_occasions > 0);
  const sorted = [...otBooks].sort((a, b) => b.unique_occasions - a.unique_occasions);
  const max = sorted[0]?.unique_occasions || 1;

  const tilesHtml = sorted.map(book => {
    const cls = sizeClass(book.unique_occasions, max);
    return `
      <a href="#/ot-book/${book.id.toLowerCase()}"
         class="ot-book-tile ${cls}"
         aria-label="${escapeHtml(book.name)}, ${book.unique_occasions} distinct citation occasions">
        <span class="ot-book-tile__name">${escapeHtml(book.name)}</span>
        <span class="ot-book-tile__count">${book.unique_occasions} occasion${book.unique_occasions !== 1 ? 's' : ''}</span>
      </a>
    `;
  }).join('');

  const barsHtml = sorted.map(book => `
    <a href="#/ot-book/${book.id.toLowerCase()}" class="bar-item">
      <span class="bar-item__name">${escapeHtml(book.name)}</span>
      <span class="bar-item__bar-wrap" aria-hidden="true">
        <span class="bar-item__bar" style="width:${Math.round((book.unique_occasions / max) * 100)}%"></span>
      </span>
      <span class="bar-item__count">${book.unique_occasions}</span>
    </a>
  `).join('');

  return `
    <h1 class="page-title">By Scripture</h1>
    <p class="page-subtitle">Old Testament books Christ cited, organized by how often he returned to each one. Select a book to see all entries from it.</p>
    <p class="text-muted" style="font-size:13px;font-style:italic;margin-bottom:var(--sp-5)">Tile size reflects the number of distinct citation occasions — not the theological weight of each book.</p>

    <div class="source-map-grid" aria-label="Old Testament books by citation frequency">
      ${tilesHtml}
    </div>

    <ol class="source-map-bars" aria-label="Old Testament books by citation frequency">
      ${barsHtml}
    </ol>
  `;
}

export function renderOtBook(catalog, bookId) {
  const book = catalog.ot_books?.find(b => b.id === bookId.toUpperCase());
  if (!book) return `<p style="color:var(--text-muted)">Book not found.</p>`;

  const entries = (catalog.quotations || []).filter(e =>
    e.publication_status === 'approved' &&
    (e.ot_book_ids || []).includes(book.id)
  );

  const settings = catalog.audience_settings || [];
  const settingMap = new Map();
  for (const entry of entries) {
    for (const sid of (entry.audience_setting_ids || ['other'])) {
      if (!settingMap.has(sid)) settingMap.set(sid, []);
      settingMap.get(sid).push(entry);
    }
  }

  const swimlanesHtml = Array.from(settingMap.entries()).map(([sid, sEntries]) => {
    const setting = settings.find(s => s.id === sid);
    const label = setting ? setting.label : 'Other';
    return `
      <div class="setting-swimlane">
        <h2>${escapeHtml(label)}</h2>
        <ul class="card-grid" role="list">
          ${sEntries.map(e => `<li>${renderEntryCard(e, '#/source-map')}</li>`).join('')}
        </ul>
      </div>
    `;
  }).join('');

  return `
    <a href="#/source-map" class="entry-detail__back">← By Scripture</a>
    <div class="ot-book-header">
      <h1 class="ot-book-header__name">${escapeHtml(book.name)}</h1>
      <p class="ot-book-header__stat">${entries.length} ${entries.length === 1 ? 'entry' : 'entries'} · ${book.unique_occasions} distinct citation occasion${book.unique_occasions !== 1 ? 's' : ''}</p>
    </div>
    ${swimlanesHtml}
  `;
}

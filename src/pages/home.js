import { escapeHtml } from '../components/utils.js';
import { renderEntryCard } from '../components/card.js';

const SETTING_ORDER = [
  'AUD-WILDERNESS',
  'AUD-SERMON',
  'AUD-CROWD',
  'AUD-HOSTILE',
  'AUD-DISCIPLES',
  'AUD-LAST-SUPPER',
  'AUD-PASSION',
  'AUD-TRIAL',
  'AUD-CROSS',
  'AUD-NEPHITE',
  'AUD-DC',
];

export function renderHome(catalog) {
  const entries = (catalog.quotations || []).filter(e => e.publication_status === 'approved');
  const settings = catalog.audience_settings || [];
  const otBooks = catalog.ot_books || [];

  // Group entries by their primary audience setting
  const grouped = new Map();
  for (const settingId of SETTING_ORDER) {
    const setting = settings.find(s => s.id === settingId);
    if (!setting) continue;
    const settingEntries = entries.filter(e =>
      (e.audience_setting_ids || []).includes(settingId)
    );
    if (settingEntries.length > 0) {
      grouped.set(settingId, { setting, entries: settingEntries });
    }
  }

  // Catch any entries not mapped to a known setting
  const mappedIds = new Set(entries.flatMap(e => e.audience_setting_ids || []));
  const unmapped = entries.filter(e =>
    !(e.audience_setting_ids || []).some(id => SETTING_ORDER.includes(id))
  );

  const sectionsHtml = Array.from(grouped.entries()).map(([settingId, { setting, entries: sEntries }], i) => {
    // Inline OT book breakdown
    const bookCounts = {};
    for (const entry of sEntries) {
      for (const bookId of (entry.ot_book_ids || [])) {
        bookCounts[bookId] = (bookCounts[bookId] || 0) + 1;
      }
    }
    const topBooks = Object.entries(bookCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([id, count]) => {
        const book = otBooks.find(b => b.id === id);
        return book ? `${book.abbreviation || book.name} ${count}` : '';
      })
      .filter(Boolean)
      .join(' · ');

    const isFirstOnMobile = i === 0;
    const sectionId = `section-${settingId.toLowerCase()}`;

    return `
      <section class="timeline-section" id="${sectionId}" aria-labelledby="${sectionId}-header">
        <div class="timeline-section-header timeline-section-header--collapsible"
             role="button"
             tabindex="0"
             aria-expanded="${isFirstOnMobile ? 'true' : 'true'}"
             aria-controls="${sectionId}-cards"
             id="${sectionId}-header"
             onclick="toggleSection('${sectionId}')"
             onkeydown="if(event.key==='Enter'||event.key===' ')toggleSection('${sectionId}')">
          <h2 class="timeline-section-header__title">${escapeHtml(setting.label)}</h2>
          <span class="timeline-section-header__count">${sEntries.length} ${sEntries.length === 1 ? 'entry' : 'entries'}</span>
          ${topBooks ? `<span class="timeline-section-header__books">${escapeHtml(topBooks)}</span>` : ''}
          <span class="timeline-section-header__toggle" aria-hidden="true">▾</span>
        </div>
        <ul class="card-grid timeline-section__cards" id="${sectionId}-cards" role="list">
          ${sEntries.map(e => `<li>${renderEntryCard(e, '#/')}</li>`).join('')}
        </ul>
      </section>
    `;
  }).join('');

  return `
    <h1 class="page-title">The Chosen Word</h1>
    <p class="page-subtitle">Old Testament scriptures Jesus Christ chose to quote — across the Gospels, 3 Nephi, and the Doctrine and Covenants.</p>
    <p class="timeline-note">These entries are organized by the setting and audience of each citation. The sequence is not a strict chronological record — it reflects the broad arc of Christ's ministry rather than a dateable timeline.</p>

    <div role="status" aria-live="polite" class="visually-hidden" id="timeline-status"></div>

    ${sectionsHtml}

    ${unmapped.length > 0 ? `
      <section class="timeline-section">
        <div class="timeline-section-header">
          <h2 class="timeline-section-header__title">Other</h2>
          <span class="timeline-section-header__count">${unmapped.length} entries</span>
        </div>
        <ul class="card-grid" role="list">
          ${unmapped.map(e => `<li>${renderEntryCard(e)}</li>`).join('')}
        </ul>
      </section>
    ` : ''}
  `;
}

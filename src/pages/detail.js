import { escapeHtml, externalLink, citationTypeLabel, citationModeTag } from '../components/utils.js';

export function renderDetail(entry, catalog) {
  if (!entry) {
    return `<p style="color:var(--text-muted)">Entry not found.</p>`;
  }

  const types = Array.isArray(entry.citation_type) ? entry.citation_type : [entry.citation_type];
  const isTentative = entry.confidence === 'tentative';

  const backLink = `<a href="${escapeHtml(catalog.backHash || '#/')}" class="entry-detail__back">← Back</a>`;

  const tentativeBlock = isTentative ? `
    <span class="badge tentative-label" aria-label="Tentative classification">Tentative</span>
  ` : '';

  const tentativeExplanation = isTentative ? `
    <div class="rp-note" style="margin-top:var(--sp-4)">
      <em>This entry is marked "tentative." The allusion is plausible and consistent with the language, but no single Old Testament source is an exact match. It is included because the language is specific enough to suggest scriptural influence. Further study may clarify the relationship.</em>
    </div>
  ` : '';

  const rpLinks = (entry.repeated_passage_ids || []).map(rpId => {
    const rp = catalog.repeated_passage_groups?.find(r => r.id === rpId);
    if (!rp) return '';
    return `<a href="#/thread#${rpId.toLowerCase()}" class="connection-link">↔ Cited ${rp.distinct_occasions}× — ${escapeHtml(rp.ot_ref)}</a>`;
  }).join('');

  const otBookLinks = (entry.ot_book_ids || []).map(bookId => {
    const book = catalog.ot_books?.find(b => b.id === bookId);
    if (!book) return '';
    return `<a href="#/ot-book/${bookId.toLowerCase()}" class="connection-link">${escapeHtml(book.name)}</a>`;
  }).join('');

  const patternLinks = (entry.pattern_ids || []).map(patId => {
    const pat = catalog.patterns?.find(p => p.id === patId);
    if (!pat) return '';
    return `<a href="#/pattern/${patId.toLowerCase()}" class="connection-link">${escapeHtml(pat.name)}</a>`;
  }).join('');

  const studyNotesHtml = (entry.study_questions || []).map(note =>
    `<p class="study-note">${escapeHtml(note)}</p>`
  ).join('');

  const ntChurchLink = entry.church_url_nt
    ? externalLink(entry.church_url_nt, 'Read on Church website')
    : '';
  const otChurchLink = entry.church_url_ot
    ? externalLink(entry.church_url_ot, 'Read on Church website')
    : '';
  const ntEsvLink = entry.esv_link_url
    ? externalLink(entry.esv_link_url, 'Compare ESV')
    : '';
  const otEsvLink = entry.esv_ot_link_url
    ? externalLink(entry.esv_ot_link_url, 'Compare ESV')
    : '';

  return `
    <div class="entry-detail">
      ${backLink}

      <header class="entry-detail__header">
        <h1 class="entry-detail__key">${escapeHtml(entry.key_words)}</h1>
        <div class="entry-detail__refs">
          <span class="badge badge--type" style="font-size:13px">${escapeHtml(entry.nt_bom_ref)}</span>
          ${(entry.ot_source_refs || []).map(r => `<span class="badge" style="font-size:13px">${escapeHtml(r)}</span>`).join('')}
        </div>
        <div class="entry-detail__badges">
          ${types.map(t => `<span class="badge badge--type">${escapeHtml(citationTypeLabel(t))}</span>`).join('')}
          ${entry.citation_mode ? citationModeTag(entry.citation_mode) : ''}
          ${tentativeBlock}
        </div>
      </header>

      ${tentativeExplanation}

      <hr class="entry-detail__divider" />

      <section aria-label="Christ's quotation">
        <p class="entry-detail__section-label">The Quotation</p>
        <div class="scripture-panel">
          <p class="scripture-label">New Testament / 3 Nephi / D&C</p>
          <figure class="scripture-figure">
            <blockquote class="scripture-text">${escapeHtml(entry.church_scripture_text_nt || '—')}</blockquote>
            <figcaption class="scripture-caption">
              <span class="scripture-ref">${escapeHtml(entry.nt_bom_ref)}</span>
              <span style="display:flex;gap:var(--sp-3);flex-wrap:wrap">${ntChurchLink}${ntEsvLink}</span>
            </figcaption>
          </figure>
        </div>

        <div class="scripture-panel">
          <p class="scripture-label">Old Testament Source</p>
          <figure class="scripture-figure">
            <blockquote class="scripture-text">${escapeHtml(entry.church_scripture_text_ot || '—')}</blockquote>
            <figcaption class="scripture-caption">
              <span class="scripture-ref">${escapeHtml((entry.ot_source_refs || []).join('; '))}</span>
              <span style="display:flex;gap:var(--sp-3);flex-wrap:wrap">${otChurchLink}${otEsvLink}</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <hr class="entry-detail__divider" />

      <section aria-label="Study notes">
        <p class="entry-detail__section-label">Study Notes</p>
        <div class="study-notes">
          ${studyNotesHtml || '<p class="study-note text-muted">Notes not yet added for this entry.</p>'}
        </div>
      </section>

      ${(rpLinks || otBookLinks || patternLinks) ? `
        <hr class="entry-detail__divider" />
        <section aria-label="Connections">
          <p class="entry-detail__section-label">Connections</p>
          <div class="connections-panel">
            ${rpLinks}
            ${otBookLinks}
            ${patternLinks}
          </div>
        </section>
      ` : ''}
    </div>
  `;
}

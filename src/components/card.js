import { escapeHtml, citationTypeLabel } from './utils.js';

export function renderEntryCard(entry, backHash = '') {
  const href = `#/entry/${entry.id.toLowerCase()}${backHash ? '?back=' + encodeURIComponent(backHash) : ''}`;
  const types = Array.isArray(entry.citation_type) ? entry.citation_type : [entry.citation_type];
  const isTentative = entry.confidence === 'tentative';

  const ariaLabel = `${escapeHtml(entry.key_words)}, ${escapeHtml(entry.nt_bom_ref)}, from ${escapeHtml(entry.ot_source_refs?.join(', '))}`;

  return `
    <article>
      <a href="${href}"
         class="entry-card"
         aria-label="${ariaLabel}">
        <div class="entry-card__key">${escapeHtml(entry.key_words)}</div>
        <div class="entry-card__refs" aria-hidden="true">
          <span class="entry-card__ref entry-card__ref--nt">${escapeHtml(entry.nt_bom_ref)}</span>
          ${(entry.ot_source_refs || []).map(r => `<span class="entry-card__ref">${escapeHtml(r)}</span>`).join('')}
        </div>
        <p class="entry-card__summary">${escapeHtml(entry.summary)}</p>
        <div class="entry-card__meta">
          ${types.map(t => `<span class="badge badge--type">${escapeHtml(citationTypeLabel(t))}</span>`).join('')}
          ${isTentative ? '<span class="tentative-label" aria-label="Tentative classification">Tentative</span>' : ''}
        </div>
      </a>
    </article>
  `;
}

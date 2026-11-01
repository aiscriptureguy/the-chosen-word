import { escapeHtml, externalLink } from '../components/utils.js';

const PRIORITY_LABELS = {
  P1: 'Cited on 4 or more distinct occasions',
  P2: 'Cited on 2–3 distinct occasions',
  P3: 'Multiple Gospel accounts of the same event',
  P4: 'Parallel accounts — single occasion',
};

export function renderThread(catalog) {
  const rpGroups = catalog.repeated_passage_groups || [];
  const quotations = catalog.quotations || [];

  const byPriority = { P1: [], P2: [], P3: [], P4: [] };
  for (const rp of rpGroups) {
    if (byPriority[rp.priority]) byPriority[rp.priority].push(rp);
  }

  const sectionsHtml = Object.entries(byPriority).map(([priority, groups]) => {
    if (groups.length === 0) return '';
    return `
      <div class="thread-priority-group">
        <h2 class="thread-priority-header">${escapeHtml(PRIORITY_LABELS[priority] || priority)}</h2>
        ${groups.map(rp => renderRpCard(rp, quotations, priority)).join('')}
      </div>
    `;
  }).join('');

  return `
    <h1 class="page-title">Repeated Passages</h1>
    <p class="page-subtitle">Old Testament passages Christ cited on more than one occasion — ranked by how many genuinely distinct times he returned to each one.</p>
    ${sectionsHtml}
  `;
}

function renderRpCard(rp, quotations, priority) {
  const entries = (rp.entry_ids || []).map(id => quotations.find(e => e.id === id)).filter(Boolean);
  const isParallel = priority === 'P3' || priority === 'P4';

  // Use the first entry's OT source text for the shared OT scripture box
  const firstEntry = entries[0];
  const otText = firstEntry?.church_scripture_text_ot;
  const otRefs = firstEntry?.ot_source_refs || [];
  const otUrl = firstEntry?.church_url_ot;
  const esvOtUrl = firstEntry?.esv_ot_link_url;

  const otScriptureBox = otText ? `
    <div class="rp-ot-source">
      <p class="rp-ot-source__label">Old Testament source</p>
      <figure class="scripture-figure" style="margin-bottom:0">
        <blockquote class="scripture-text">${escapeHtml(otText)}</blockquote>
        <figcaption class="scripture-caption">
          <span class="scripture-ref">${escapeHtml(otRefs.join('; '))}</span>
          <span style="display:flex;gap:var(--sp-3);flex-wrap:wrap">
            ${otUrl ? externalLink(otUrl, 'Read on Church website') : ''}
            ${esvOtUrl ? externalLink(esvOtUrl, 'Compare ESV') : ''}
          </span>
        </figcaption>
      </figure>
    </div>
  ` : '';

  const occasionsHtml = entries.map(entry => `
    <article class="occasion-panel">
      <h3 class="occasion-panel__heading">${escapeHtml(entry.nt_bom_ref)}</h3>
      <p class="occasion-panel__text">${escapeHtml(entry.church_scripture_text_nt || '—')}</p>
      <p class="occasion-panel__ref">${escapeHtml(entry.nt_bom_ref)}</p>
      ${entry.church_url_nt ? `
        <a href="${escapeHtml(entry.church_url_nt)}"
           class="scripture-link"
           style="font-size:11px;margin-top:var(--sp-1)"
           target="_blank"
           rel="noopener noreferrer">
          Read in context<span class="visually-hidden"> (opens in new tab)</span>
        </a>
      ` : ''}
    </article>
  `).join('');

  return `
    <div class="rp-card" id="${rp.id.toLowerCase()}">
      <div class="rp-card__key">${escapeHtml(rp.key_words || rp.ot_ref)}</div>
      <div class="rp-card__ref">${escapeHtml(rp.ot_ref)} · ${rp.distinct_occasions} distinct occasion${rp.distinct_occasions !== 1 ? 's' : ''}</div>

      ${otScriptureBox}

      ${rp.observation ? `<p class="rp-observation">${escapeHtml(rp.observation)}</p>` : ''}

      <p class="rp-occasions-label">Christ's citations</p>
      <div class="occasion-strip">
        ${occasionsHtml}
      </div>
      ${isParallel ? `
        <p class="rp-note">These entries record parallel Gospel accounts of the same event, not separate occasions in Christ's ministry.</p>
      ` : ''}
    </div>
  `;
}

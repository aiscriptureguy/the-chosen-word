export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function externalLink(href, text, extraClass = '') {
  return `<a href="${escapeHtml(href)}"
     class="scripture-link ${extraClass}"
     target="_blank"
     rel="noopener noreferrer">${escapeHtml(text)}<span class="visually-hidden"> (opens in new tab)</span></a>`;
}

const CITATION_TYPE_LABELS = {
  'direct-quotation':    'Direct quotation',
  'paraphrase-formula':  'Paraphrase',
  'close-allusion':      'Close allusion',
  'explicit-citation':   'Explicit citation',
  'full-chapter':        'Full chapter',
};

export function citationTypeLabel(type) {
  return CITATION_TYPE_LABELS[type] || type;
}

const CITATION_MODE_LABELS = {
  corrective_teaching: 'Corrective teaching',
  self_identification:  'Self-identification',
  lament:               'Lament',
  composite:            'Composite',
};

const CITATION_MODE_TOOLTIPS = {
  corrective_teaching: 'Christ cites the Old Testament to reframe, fulfill, or correct a misunderstanding — often in a dispute or a teaching moment where the text is the common ground.',
  self_identification:  'Christ cites the Old Testament to describe who he is, what he is doing, or why he has come — using scripture as a lens through which to read his own identity and mission.',
  lament:               'Christ cites the Old Testament to voice profound sorrow, abandonment, or suffering — most starkly in the cross citations from the Psalms.',
  composite:            'This entry blends more than one mode, or the citation does not fit cleanly into the other three categories; it is retained to avoid forcing a classification that would mislead.',
};

export function citationModeTag(mode) {
  const label = CITATION_MODE_LABELS[mode] || mode;
  const tip = CITATION_MODE_TOOLTIPS[mode] || '';
  return `
    <span class="tooltip-wrapper badge badge--type">
      ${escapeHtml(label)}
      <span class="tooltip-text" role="tooltip">${escapeHtml(tip)}</span>
    </span>
  `;
}

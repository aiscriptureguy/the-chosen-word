#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const catalogPath = join(__dirname, '..', 'public', 'data', 'catalog.json');

let errors = 0;
function fail(msg) { console.error('  FAIL:', msg); errors++; }
function warn(msg) { console.warn('  WARN:', msg); }

console.log('Validating catalog.json…\n');

let catalog;
try {
  catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));
} catch (e) {
  console.error('Cannot parse catalog.json:', e.message);
  process.exit(1);
}

const { quotations = [], ot_books = [], gospel_sources = [], audience_settings = [],
        repeated_passage_groups = [], patterns = [], sources = [] } = catalog;

// Build lookup sets
const otBookIds = new Set(ot_books.map(b => b.id));
const settingIds = new Set(audience_settings.map(s => s.id));
const rpIds = new Set(repeated_passage_groups.map(r => r.id));
const patternIds = new Set(patterns.map(p => p.id));
const sourceIds = new Set(sources.map(s => s.id));
const entryIds = new Set(quotations.map(e => e.id));

// Check for duplicate IDs
const seen = new Set();
for (const e of quotations) {
  if (seen.has(e.id)) fail(`Duplicate entry ID: ${e.id}`);
  seen.add(e.id);
}

// Validate each entry
const VALID_SEGMENTS = ['gospels-3ne', 'dc'];
const VALID_CITATION_TYPES = ['direct-quotation', 'paraphrase-formula', 'close-allusion', 'explicit-citation', 'full-chapter'];
const VALID_CITATION_MODES = ['corrective_teaching', 'self_identification', 'lament', 'composite'];
const VALID_CONFIDENCE = ['high', 'supported', 'tentative'];
const VALID_PUB_STATUS = ['draft', 'reviewed', 'approved'];

for (const e of quotations) {
  const id = e.id;

  if (!VALID_SEGMENTS.includes(e.segment)) fail(`${id}: invalid segment "${e.segment}"`);
  if (e.segment === 'dc' && !id.startsWith('DC-')) warn(`${id}: DC segment but ID doesn't start with DC-`);

  if (!e.nt_bom_ref) fail(`${id}: missing nt_bom_ref`);
  if (!e.ot_source_refs?.length) fail(`${id}: missing ot_source_refs`);
  if (!e.ot_book_ids?.length) fail(`${id}: missing ot_book_ids`);
  if (!e.key_words) fail(`${id}: missing key_words`);
  if (!e.summary) fail(`${id}: missing summary`);
  if (!e.citation_mode) fail(`${id}: missing citation_mode`);
  if (e.citation_mode && !VALID_CITATION_MODES.includes(e.citation_mode)) fail(`${id}: invalid citation_mode "${e.citation_mode}"`);
  if (!VALID_CONFIDENCE.includes(e.confidence)) fail(`${id}: invalid confidence "${e.confidence}"`);
  if (!VALID_PUB_STATUS.includes(e.publication_status)) fail(`${id}: invalid publication_status "${e.publication_status}"`);

  // Citation type
  const types = [].concat(e.citation_type || []);
  for (const t of types) {
    if (!VALID_CITATION_TYPES.includes(t)) fail(`${id}: invalid citation_type "${t}"`);
  }

  // Reference integrity
  for (const bookId of (e.ot_book_ids || [])) {
    if (!otBookIds.has(bookId)) fail(`${id}: ot_book_id "${bookId}" not in ot_books`);
  }
  for (const sid of (e.audience_setting_ids || [])) {
    if (!settingIds.has(sid)) fail(`${id}: audience_setting_id "${sid}" not in audience_settings`);
  }
  for (const rpId of (e.repeated_passage_ids || [])) {
    if (!rpIds.has(rpId)) fail(`${id}: repeated_passage_id "${rpId}" not in repeated_passage_groups`);
  }
  for (const patId of (e.pattern_ids || [])) {
    if (!patternIds.has(patId)) fail(`${id}: pattern_id "${patId}" not in patterns`);
  }
  for (const srcId of (e.source_ids || [])) {
    if (!sourceIds.has(srcId)) fail(`${id}: source_id "${srcId}" not in sources`);
  }

  // ESV policy: no ESV text in scripture fields
  const esvDomains = ['esv.org'];
  const scriptureFields = ['church_scripture_text_nt', 'church_scripture_text_ot'];
  for (const field of scriptureFields) {
    if (e[field] && esvDomains.some(d => e[field].includes(d))) {
      fail(`${id}: ESV domain found in scripture text field "${field}"`);
    }
  }

  // ESV link fields should only contain URLs, not text
  for (const field of ['esv_link_url', 'esv_ot_link_url']) {
    if (e[field] && !e[field].startsWith('http')) {
      warn(`${id}: ${field} does not look like a URL: "${e[field]}"`);
    }
  }
}

// Check RP group entry_ids resolve
for (const rp of repeated_passage_groups) {
  for (const eid of (rp.entry_ids || [])) {
    if (!entryIds.has(eid)) warn(`RP ${rp.id}: entry_id "${eid}" not found in quotations`);
  }
}

// Check pattern entry_ids resolve
for (const pat of patterns) {
  for (const eid of (pat.entry_ids || [])) {
    if (!entryIds.has(eid)) warn(`Pattern ${pat.id}: entry_id "${eid}" not found in quotations`);
  }
}

// Summary
console.log(`  ${quotations.length} entries checked`);
console.log(`  ${ot_books.length} OT books · ${audience_settings.length} settings · ${repeated_passage_groups.length} RP groups · ${patterns.length} patterns\n`);

if (errors === 0) {
  console.log('Validation passed.\n');
  process.exit(0);
} else {
  console.error(`\nValidation failed with ${errors} error${errors !== 1 ? 's' : ''}.\n`);
  process.exit(1);
}

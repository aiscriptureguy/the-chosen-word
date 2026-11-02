# The Chosen Word — Project CLAUDE.md

Scripture study explorer: 108 OT passages Christ quoted across Gospels, 3 Nephi, and D&C.

## Local development

No build step. Open with any static file server:

```bash
# From the project directory:
python3 -m http.server 8080
# open http://localhost:8080/

# Or use the workspace script:
bash ../scripts/dev-server.sh .
```

To validate the catalog:

```bash
node scripts/validate-catalog.js
```

## Architecture

**Stack:** Plain HTML + vanilla JavaScript (ES modules). No framework, no bundler.
**Routing:** Hash-based — `/#/`, `/#/catalog`, `/#/entry/q-001`, etc.
**Base path:** `/the-chosen-word/` set via `<base>` tag in `index.html`

```
index.html
404.html
data/
  catalog.json      ← source of truth for all content
  annotations.json
src/
  main.js           ← entry point, router registration
  router.js         ← hash router
  components/
    card.js         ← EntryCard component
    nav.js          ← GlobalNav
    shell.js        ← SiteShell (nav + main + footer)
    utils.js        ← escapeHtml, citationTypeLabel, citationModeTag
  pages/
    home.js         ← Timeline (ministry setting groups)
    catalog.js      ← All Entries + D&C (filter system)
    source-map.js   ← By Scripture (OT book tiles) + OT book detail
    thread.js       ← Repeated Passages (RP groups)
    detail.js       ← Entry detail page
    about.js        ← About page
  styles/
    main.css        ← All CSS (custom properties, components)
scripts/
  validate-catalog.js  ← schema + reference integrity checks
.github/workflows/
  deploy.yml        ← GitHub Actions → GitHub Pages (deploys repo root directly)
```

## Content updates

To add or correct an entry: edit `data/catalog.json` directly. The schema is in `architecture/content-model.md`. After editing, run `node scripts/validate-catalog.js` to check integrity.

**Required fields per entry:** `id`, `segment`, `nt_bom_ref`, `ot_source_refs`, `ot_book_ids`, `citation_type`, `citation_mode`, `audience_setting_ids`, `key_words`, `summary`, `confidence`, `publication_status`.

Only entries with `publication_status: "approved"` are rendered on the site.

## Key design decisions

- **Dark mode default** — cool dark palette (`--bg: #0f1318`), steel blue accent (`--accent: #7d9ec0`)
- **Typography** — Lora (scripture text, serif), DM Sans (UI, sans-serif), loaded via Google Fonts
- **ESV policy** — outbound links only (`esv_link_url` fields); no ESV text in any content field
- **D&C section** — separate route `/#/dc`; entries with `segment: "dc"` only appear there and in full timeline

## Phase status

Gate 2 approved 2026-10-22. Currently in Phase 3 (Development).

- Study documents: `study/`
- Architecture documents: `architecture/`
- Writing standard: `../AI-writing-pitfalls.md`
- Full workflow: `../SCRIPTURE_STUDY_SITE_WORKFLOW.md`

## Deployment

GitHub Pages via Actions workflow. The workflow triggers on push to `main` and deploys the repository root directly — no build step.

Published at: `https://aiscriptureguy.github.io/the-chosen-word/` (after repository is created and Pages is configured)

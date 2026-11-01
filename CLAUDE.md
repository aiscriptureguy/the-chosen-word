# The Chosen Word — Project CLAUDE.md

Scripture study explorer: 108 OT passages Christ quoted across Gospels, 3 Nephi, and D&C.

## Build commands

```bash
npm install         # install dependencies
npm run dev         # dev server at http://localhost:5174/the-chosen-word/
npm run build       # validate + production build → dist/
npm run validate    # catalog.json schema check (run before build)
npm run preview     # preview production build locally
```

## Architecture

**Stack:** Vite + vanilla JavaScript. No framework.
**Routing:** Hash-based — `/#/`, `/#/catalog`, `/#/entry/q-001`, etc.
**Base path:** `/the-chosen-word/` (GitHub Pages project site)

```
src/
  main.js          ← entry point, router registration
  router.js        ← hash router
  components/
    card.js        ← EntryCard component
    nav.js         ← GlobalNav
    shell.js       ← SiteShell (nav + main + footer)
    utils.js       ← escapeHtml, citationTypeLabel, citationModeTag
  pages/
    home.js        ← Timeline (ministry setting groups)
    catalog.js     ← All Entries + D&C (filter system)
    source-map.js  ← By Scripture (OT book tiles) + OT book detail
    thread.js      ← Repeated Passages (RP groups)
    detail.js      ← Entry detail page
    about.js       ← About page
  styles/
    main.css       ← All CSS (custom properties, components)
public/
  data/
    catalog.json   ← source of truth for all content (108 entries at full population)
    annotations.json
  404.html
scripts/
  validate-catalog.js  ← schema + reference integrity checks
.github/workflows/
  deploy.yml       ← GitHub Actions → GitHub Pages
```

## Content updates

To add or correct an entry: edit `public/data/catalog.json` directly. The schema is in `architecture/content-model.md`. After editing, run `npm run validate` to check integrity.

**Required fields per entry:** `id`, `segment`, `nt_bom_ref`, `ot_source_refs`, `ot_book_ids`, `citation_type`, `citation_mode`, `audience_setting_ids`, `key_words`, `summary`, `confidence`, `publication_status`.

Only entries with `publication_status: "approved"` are rendered on the site.

## Key design decisions

- **Dark mode default** — warm brown-black palette (`--bg: #16120e`), gold accent (`--accent: #c89b4a`)
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

GitHub Pages via Actions workflow. The workflow triggers on push to `main`, runs `npm run validate && npm run build`, and deploys `dist/` via the official `actions/deploy-pages` action.

Published at: `https://aiscriptureguy.github.io/the-chosen-word/` (after repository is created and Pages is configured)

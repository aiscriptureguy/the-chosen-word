# The Chosen Word — Technical Plan

**Status:** Draft — Phase 2
**Last updated:** 2026-10-22

---

## 1. Constraints That Drive the Stack Decision

Before selecting any tool, these constraints are fixed:

1. **GitHub Pages static hosting** — no server-side logic, no databases, no backend. All content must be pre-rendered or loaded client-side from static files.
2. **Base path:** `https://aiscriptureguy.github.io/the-chosen-word/` — all asset paths, internal links, and routing must handle the `/the-chosen-word/` base path correctly.
3. **No unapproved remote APIs, analytics, or third-party fonts** — per the project's source policy.
4. **Data-driven content** — scripture text, entry metadata, and relationships live in JSON data files, not in HTML templates. This keeps content updates separate from code changes.
5. **No ESV text in the repository** — outbound links only.
6. **Desktop primary, mobile-friendly** — not a mobile-first design, but mobile layouts must work.

---

## 2. Inspecting scripture-atlas for Reusable Patterns

The scripture-atlas project is a single-file vanilla JavaScript site:

- `index.html` — the entire UI in one HTML file
- `site-data.js` — all content as a JavaScript module (`window.ScriptureAtlasData = ...`)
- `site.js` — DOM manipulation, filtering logic, rendering
- `styles.css` — all styles in one file
- No build step, no package.json, no framework

**What this approach accomplishes well:**
- Zero build dependencies. The site works by opening `index.html` in a browser.
- Deployment is trivial: push the files, enable GitHub Pages, done.
- The base-path problem is avoided because all resources are in the same directory.

**What this approach cannot scale to for The Chosen Word:**
- 108 entries with detailed content per entry cannot be managed as inline JavaScript objects without the file becoming unwieldy.
- The Chosen Word needs approximately 130 distinct URL-addressable pages (catalog, detail pages, OT book pages, pattern pages, about). A single-file approach means all of these are hash-routed or JS-rendered — which works but makes direct-link sharing fragile and degrades SSR/SEO and screen-reader behavior.
- Content updates (adding a new entry, correcting a verse text, adding a study note) require editing a JavaScript data file, which requires programming context. A JSON data file is more accessible and more separable from code.
- The filter state, which must be encoded in the URL for shareable links, is easier to manage with a router than with hand-written URL manipulation.

**Reusable patterns from scripture-atlas:**
- The CSS custom property palette approach (CSS variables for colors, spacing, radius) is clean and should be carried forward.
- The `escapeHtml` function and the Church website search URL pattern are worth reusing.
- The intersection-observer reveal animation pattern is a useful pattern — used with a `prefers-reduced-motion` gate that scripture-atlas currently lacks.
- Google Fonts are loaded in scripture-atlas. The Chosen Word must use system fonts or self-hosted fonts instead (no unapproved remote fonts).

---

## 3. Recommended Stack

### Core recommendation: Vite + vanilla JavaScript with JSON data files

**No framework is required.** The Chosen Word does not need React, Vue, or Svelte. The site's UI patterns — a filterable list, detail pages, cross-reference links — are achievable with straightforward DOM manipulation and a small amount of client-side routing. Adding a framework adds complexity, build time, and a larger dependency footprint without a clear benefit for this use case.

**Vite** provides:
- A development server with hot module replacement for fast local development.
- A production build step that handles: base path injection (`base: '/the-chosen-word/'`), asset hashing for cache busting, and module bundling.
- Zero-config static file handling — JSON data files in `public/` are served as-is.
- The smallest dependency footprint of any build tool that handles the base-path requirement cleanly.

**What this looks like in practice:**

```
the-chosen-word/
  src/
    main.js         ← entry point; router initialization
    router.js       ← client-side hash or history router
    pages/
      catalog.js    ← renders the filterable catalog
      detail.js     ← renders a single entry detail page
      ot-book.js    ← renders an OT book page
      pattern.js    ← renders a pattern page
      about.js      ← renders the about page
      dc.js         ← renders the D&C catalog
    components/
      card.js       ← entry card HTML template function
      filters.js    ← filter panel rendering and state
      nav.js        ← global navigation
    styles/
      main.css      ← CSS custom properties + global styles
      components/   ← per-component styles
  data/
    catalog.json    ← the 108 quotation entries + all reference data
    annotations.json ← annotations and notes
  public/
    index.html      ← the shell HTML with <div id="app">
    404.html        ← GitHub Pages custom 404
  vite.config.js
  package.json
```

### Why not a static site generator (Eleventy, Astro, Hugo)?

A static site generator (SSG) would pre-render all 130+ pages as HTML files, which is better for accessibility (content exists in HTML without JavaScript) and for direct-link reliability. It is the theoretically superior choice for this use case.

However:
- Eleventy and Astro add meaningful setup complexity: template syntax, data cascade rules, build pipelines.
- For a catalog of 108 entries with no server, no SEO requirement, and a primary user who is the site's author, the practical benefit of pre-rendered HTML over client-side rendering is small.
- The accessibility concern (content requires JS) is mitigated by a `<noscript>` fallback message directing users to churchofjesuschrist.org.

**Recommendation:** Start with Vite + vanilla JS. If a second study site is built in this workspace and the pattern becomes clear, evaluate migrating to Astro or Eleventy for the shared component pattern. Do not add a framework to solve a problem that does not yet exist.

### Why not the scripture-atlas approach (no build step)?

A no-build approach is viable for 10–20 entries and one page. With 108 entries and ~130 URL-addressable pages, managing the data and routing in raw JavaScript without a build step creates:
- A `site-data.js` file that would be several thousand lines of JavaScript object literals.
- No content/code separation — adding a new entry requires editing JavaScript.
- No base-path handling — GitHub Pages project sites require `/the-chosen-word/` as a prefix on all links and asset references. Without a build tool, this must be managed manually throughout the codebase.
- No cache busting for assets.

The no-build approach was appropriate for scripture-atlas. It is not appropriate for this catalog's scale.

---

## 4. Data Architecture

### 4a. Content as JSON

All 108 entries are stored in `data/catalog.json` following the schema in `content-model.md`. The JSON file is loaded once at runtime and cached in memory. It is not fetched on each page navigation.

```javascript
// In main.js
import catalogData from '../data/catalog.json';
```

With Vite, `import catalogData from '...'` works natively and Vite will bundle the JSON into the JavaScript output. Alternatively, place the JSON in `public/data/catalog.json` and fetch it at startup — this keeps the data file separate from the build output, which makes content updates easier without a rebuild. The fetch approach is recommended.

### 4b. Content updates

To add an entry, a study note, or a correction: edit `data/catalog.json`. No JavaScript changes required. The build step (or a browser reload in development) picks up the changes automatically.

### 4c. Data validation

A small Node.js script (`scripts/validate-catalog.js`) runs at build time and checks:
- No duplicate IDs.
- All `ot_book_ids` reference valid OT book records.
- All `repeated_passage_ids` reference valid RP group records.
- All `pattern_ids` reference valid pattern records.
- All `source_ids` reference valid source records.
- All entries have `publication_status` set.
- No ESV text is stored in any `church_scripture_text_*` field.
- D&C entries have `segment: "dc"`.

This validation runs as a pre-build step: `npm run build` fails if validation fails.

---

## 5. Routing

### 5a. Client-side routing strategy

The site uses hash-based routing (`/#/entry/q-001/`) rather than history-based routing (`/entry/q-001/`).

**Reason:** GitHub Pages does not support server-side URL rewriting. History-based routing on GitHub Pages requires a `404.html` redirect trick (redirect all 404s to `index.html` with the path encoded in a query parameter). This trick works but adds fragility. Hash-based routing avoids the problem entirely — the server always serves `index.html` regardless of the hash fragment.

**Trade-off:** Hash URLs are less clean and are not always indexed by search engines. For a personal study tool, this trade-off is acceptable.

**Implementation:** A minimal router in `src/router.js` that:
- Reads `window.location.hash` to determine the current route.
- Maps routes to page renderer functions.
- Listens to `hashchange` events to re-render when the route changes.
- Encodes filter state as additional hash parameters: `/#/catalog?book=ISA&type=direct-quotation`.

### 5b. Base path

Vite's `vite.config.js` sets `base: '/the-chosen-word/'`. This automatically prepends the base path to all static asset URLs in the build output. Internal `href` links in JavaScript must be written as root-relative paths (`/entry/q-001/`) — Vite does not rewrite `href` attributes in dynamically generated HTML.

For hash routing, all internal links are `#/entry/q-001/` — the base path is irrelevant to hash fragments, so this is a non-issue.

### 5c. 404 handling

A `public/404.html` page is required for GitHub Pages. It should display a graceful "page not found" message and a link back to the home page. The link uses the hash-based root: `<a href="/the-chosen-word/">Return to The Chosen Word</a>`.

---

## 6. Fonts and Visual Assets

**No Google Fonts or remote font loading.** The project source policy prohibits unapproved remote resources.

**System font stack:**

```css
font-family:
  'Georgia', 'Times New Roman', 'Palatino Linotype', serif;   /* for scripture text */
font-family:
  -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; /* for UI text */
```

The system serif stack (Georgia or Palatino) gives scripture text a warm, traditional appearance appropriate to the content without requiring a remote font load. The system sans-serif stack covers all UI elements.

**If a custom font is desired** (for the 2-word key display or headings), the font file must be self-hosted in `public/fonts/` and declared with `@font-face`. This requires license review for the chosen typeface before any code is written.

---

## 7. Styles

CSS custom properties following the pattern established in scripture-atlas, adapted for a light-primary palette:

```css
:root {
  --bg: #faf8f4;           /* warm off-white */
  --bg-2: #f4f0ea;         /* subtle card background */
  --surface: #ffffff;
  --text: #1a1713;         /* near-black with warm tint */
  --muted: #6b6560;
  --faint: #9a9590;
  --line: rgba(0, 0, 0, 0.10);
  --accent: [TBD at design-direction stage];
  --radius: 12px;
  --radius-sm: 8px;
  --max: 1200px;
}
```

A `prefers-color-scheme: dark` block swaps the palette for dark mode. Exact dark values are specified in `design-direction.md`.

No CSS preprocessors required. Plain CSS with custom properties and cascade layers is sufficient.

---

## 8. Build and Deployment

### 8a. Local development

```bash
npm install
npm run dev
# Opens http://localhost:5173/the-chosen-word/
```

The dev server handles the `/the-chosen-word/` base path — same URL structure as production.

### 8b. Production build

```bash
npm run build
# Outputs to dist/
```

The `dist/` directory contains the complete static site ready for deployment.

### 8c. Validation and linting

```bash
npm run validate     # runs scripts/validate-catalog.js
npm run lint         # ESLint for JavaScript
npm run build        # includes validate as a pre-build hook
```

No test runner is required for v1. The validation script replaces unit tests for content integrity. If JavaScript logic grows complex (the filter engine, the router), add tests with Vitest (same ecosystem as Vite, zero additional config).

### 8d. GitHub Pages deployment

Two options:

**Option 1 (simpler): Deploy from `dist/` on `gh-pages` branch**

A GitHub Actions workflow:
1. On push to `main`, run `npm run build`.
2. Push the `dist/` directory to a `gh-pages` branch.
3. GitHub Pages serves the `gh-pages` branch.

**Option 2: Deploy from `docs/` on `main`**

Build output goes to `docs/` instead of `dist/`. GitHub Pages serves `docs/` on the `main` branch. Simpler than a separate branch but mixes build output into the source branch.

**Recommendation:** Option 1 (gh-pages branch) is cleaner. The Actions workflow uses the official `actions/deploy-pages` or `peaceiris/actions-gh-pages` action (the latter is widely used and has a clear permissions model). The workflow YAML is straightforward:

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run validate
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

This is the same deployment pattern used by most Vite-based GitHub Pages projects. The `GITHUB_TOKEN` is automatically available — no additional secrets required.

---

## 9. Shared Components and Future Studies

The workspace will eventually contain multiple study sites. The technical plan should not prevent future code sharing.

**Approach for v1:** Build The Chosen Word as a self-contained project. Extract shared utilities (the `escapeHtml` function, the Church scripture URL builder, the filter engine logic, the router) into a `shared/` directory at the workspace level only when a second site is being built and the shared pattern is confirmed. Do not prematurely abstract.

**If a shared library becomes worthwhile:** Use a workspace-level `npm` workspaces setup (`scripts/` or a `packages/shared/` directory). Vite handles workspace packages cleanly.

---

## 10. Dependencies

All dependencies must be justified. None are added speculatively.

| Package | Purpose | Justification |
|---------|---------|--------------|
| `vite` | Build tool and dev server | Required for base-path handling, module bundling, and hot reload. No framework alternative handles the GitHub Pages base-path requirement as cleanly. |
| `eslint` | JavaScript linting | Catches bugs and style issues in JS code. Required for code quality. |

No other runtime or build dependencies are required for v1.

**Explicitly not included:**

| Excluded package | Reason |
|-----------------|--------|
| React / Vue / Svelte | No component tree complexity that justifies a framework. Vanilla JS templates are sufficient. |
| Tailwind CSS | No utility-class system needed. CSS custom properties + plain CSS handles the design system. Adding Tailwind adds build complexity and a large dependency. |
| Fuse.js or other search library | The filter logic operates on a catalog of 108 in-memory objects. Fuzzy search is not needed. A simple `Array.filter` over normalized strings is sufficient. |
| marked / remark | No Markdown rendering needed in the UI. Content is stored as plain text in JSON. |
| Chart.js or D3 | If visualizations are needed (OT book tile grid, frequency bars), they are achievable with CSS grid and custom properties — no charting library required for the tile sizes and bar charts described in the UX concepts. |
| Google Analytics or any analytics | Explicitly prohibited. |
| Intersection Observer polyfill | Not needed — all target browsers support Intersection Observer natively. |

---

## 11. Performance Targets

- First Contentful Paint (FCP): under 1.5 seconds on a mid-range mobile device over a 4G connection.
- The catalog.json data file should remain under 200KB uncompressed (108 entries with full scripture text is estimated at 80–120KB uncompressed). This fits in a single HTTP request.
- No blocking third-party scripts.
- Images: the site has no decorative images by design. Any image used (e.g., a favicon or social preview image) is compressed and served at an appropriate size.

---

## 12. Open Technical Questions

- **OQ-TECH-1:** Should `catalog.json` store the full Church scripture text for each entry, or should it store only the reference and URL? Storing full text enables offline reading and avoids external dependencies; it requires re-verification if Church text is updated. Given the verification-by-session approach in Phase 1, storing the verified text locally is appropriate. Text should carry a `verified_date` field.
- **OQ-TECH-2:** Hash routing vs. history routing — the recommendation above is hash routing for simplicity. If Chase prefers clean URLs (`/entry/q-001/` instead of `/#/entry/q-001/`), the 404-redirect trick is well-documented and reliable enough to adopt. Decide at Gate 2.
- **OQ-TECH-3:** The GitHub Actions workflow assumes `npm`. If the workspace uses a different package manager (`pnpm`, `yarn`), the workflow must be adjusted. The current `scriptureStudies` workspace has no `package.json` at the root level, so no conflict exists.

# The Chosen Word — Design Direction

**Status:** Approved — Gate 2
**Last updated:** 2026-10-22
**Approved by:** Chase

---

## 1. Selected Concept: Multi-Surface Explorer

Chase approved a four-surface architecture. The site is not a single-page app with one catalog view. It is a multi-surface explorer where each surface foregrounds a different analytical lens. The surfaces are:

| Surface | Concept origin | Route | Primary purpose |
|---------|---------------|-------|----------------|
| Home / Timeline ("The Moment") | Concept C | `/#/` | Ministry settings as primary structure; the Passion-arc pattern is discoverable by scrolling |
| All Entries ("The Catalog") | Concept A | `/#/catalog` | Flat filterable grid; the full 108 entries with all filter axes |
| By Scripture ("The Source Map") | Concept B | `/#/source-map` | OT book tiles sized by frequency; entry through the Old Testament |
| Repeated Passages ("The Thread") | Concept D | `/#/thread` | Side-by-side comparison of the OT passages Christ returned to across distinct occasions |

The Home / Timeline is the default landing experience. The other three surfaces are full pages reachable from the primary navigation.

---

## 2. Accepted Elements from Other Concepts

The following elements from the UX concept documents are formally adopted:

**From Concept A (The Catalog):**
- The filter panel and filter chip model for the Catalog surface, including the `role="status"` live region for result count changes.
- The pre-set pattern shortcut row (horizontal scrolling chips that activate filter combinations).
- Filter state encoded in hash parameters: `/#/catalog?book=ISA&type=direct-quotation`.
- The OT-book frequency bars inside the filter panel (showing count before selection).

**From Concept B (The Source Map):**
- The OT-book tile grid with tiles sized by citation-occasion frequency — used on the Source Map surface.
- The per-section OT-book micro-breakdown in section headers on the Timeline surface ("Psalms 6 · Isaiah 4" inline within each setting header).
- Mobile fallback: ranked horizontal bar chart replacing the tile grid on narrow screens.

**From Concept C (The Moment):**
- The vertical timeline as the home page. Ministry settings are the primary organizing structure.
- Sticky section headers with the setting label always visible while scrolling.
- Section header entry counts and inline OT-book breakdown.
- The "not a strict chronological sequence" caveat — short, plain-language, placed at the top of the home page.

**From Concept D (The Thread):**
- The Thread surface as its own full page with the ranked RP list and side-by-side occasion comparison panels.
- On entry detail pages: a "This passage appears N times →" link to the comparison view for any entry that belongs to a RepeatedPassage group.

---

## 3. Rejected Ideas and Why

**Concept C as the only surface (single-view approach):** Rejected because limiting the site to a timeline-only home page would hide the Source Map and Thread findings behind navigation steps. Each surface reveals a distinct analytical insight; all four belong at the navigation level.

**Concept B as the home/landing page:** The OT book tile map is powerful but requires the visitor to already think in terms of OT books. The timeline home page provides an orienting frame (Christ's ministry arc) that works for both first-time visitors and returning researchers. The Source Map is better experienced as a secondary destination.

**Concept D as the home/landing page:** The repeated-passages frame as a front door implies that repetition is the site's central claim. The audience-arc finding — that Christ's OT citations shift systematically across his ministry — is the deeper and more broadly applicable insight. That belongs at the home page.

**Confidence filter axis on the Catalog surface:** Rejected for the filter panel. The confidence label is meaningful for the ~5 tentative entries, but making it a filter axis implies users would want to filter out tentative entries — which is not a useful study behavior. Confidence is displayed on individual cards and detail pages only.

**Previous / Next entry navigation on detail pages:** Deferred. It adds state management complexity and navigates by raw catalog order, which is not the most useful path from an entry detail. Cross-reference links (OT book, pattern, RP group) serve the discovery need more usefully.

**History-based routing (`/entry/q-001/`):** Rejected. The 404-redirect trick is fragile. Hash routing is simpler and fully reliable for GitHub Pages. Clean URLs are a cosmetic preference; reliability is a functional requirement.

**Google Analytics or any analytics script:** Explicitly excluded per project source policy.

---

## 4. Routing Model

The site uses hash-based routing throughout. The base URL is:

```
https://aiscriptureguy.github.io/the-chosen-word/
```

The router reads `window.location.hash` and maps to the appropriate page renderer. All internal links use hash-prefixed paths.

### Surface routes

| Surface | Hash route |
|---------|-----------|
| Home / Timeline | `/#/` (or bare `/#`) |
| All Entries | `/#/catalog` |
| By Scripture | `/#/source-map` |
| Repeated Passages | `/#/thread` |
| About | `/#/about` |

### Entry and secondary routes

| Page type | Hash route | Example |
|-----------|-----------|---------|
| Entry detail (Gospels/3 Ne) | `/#/entry/q-[nnn]` | `/#/entry/q-001` |
| Entry detail (D&C) | `/#/entry/dc-[nnn]` | `/#/entry/dc-001` |
| D&C catalog | `/#/dc` | |
| OT Book view | `/#/ot-book/[id]` | `/#/ot-book/isa` |
| Pattern view | `/#/pattern/[id]` | `/#/pattern/pat-001` |

### Filter state in URLs

Filter state on the Catalog and D&C surfaces is encoded as query-style parameters after the hash route:

```
/#/catalog?book=ISA&audience=AUD-HOSTILE&type=direct-quotation
```

The router parses the hash fragment for both the route segment and any parameters. This allows shareable filtered views without server-side support.

### 404 handling

`public/404.html` provides a graceful fallback for any unrecognized URL. It links to `/#/` (the home route).

---

## 5. Full Page Inventory

| Page | Route | Source surface |
|------|-------|---------------|
| Home / Timeline | `/#/` | Concept C |
| All Entries / Catalog | `/#/catalog` | Concept A |
| Catalog — D&C | `/#/dc` | Concept A + D&C segment |
| By Scripture / Source Map | `/#/source-map` | Concept B |
| Repeated Passages / Thread | `/#/thread` | Concept D |
| Entry detail (Q-001 … Q-092) | `/#/entry/q-[nnn]` | all concepts |
| Entry detail (DC-001 … DC-017) | `/#/entry/dc-[nnn]` | all concepts |
| OT Book view (~19 pages) | `/#/ot-book/[id]` | Concept B/A |
| Pattern view (~9 pages) | `/#/pattern/[id]` | all concepts |
| About | `/#/about` | — |
| 404 | `/the-chosen-word/404.html` | — |

---

## 6. Component Inventory

Components are organized by scope. Each component is a JavaScript function that returns an HTML string or DOM node. No framework required.

### 6a. Global shell components

| Component | Description |
|-----------|-------------|
| `SiteShell` | Wraps every page: skip link, `<header>`, `<main>`, `<footer>` |
| `GlobalNav` | Site title + four surface links + About + D&C tab; shows active surface |
| `SkipLink` | Visually hidden `<a href="#main-content">` visible on focus |

### 6b. Catalog / timeline components

| Component | Description |
|-----------|-------------|
| `TimelineSectionHeader` | Setting name, entry count, inline OT-book micro-breakdown, collapsible on mobile |
| `FilterPanel` | Left sidebar (desktop) / bottom-sheet drawer (mobile); contains all `FilterGroup` instances |
| `FilterGroup` | `<fieldset>` + `<legend>` + checkboxes for one filter axis |
| `FilterChip` | Active filter display with a remove `<button>` |
| `FilterChipList` | `<ul aria-label="Active filters">` wrapper for active chips |
| `PatternShortcutRow` | Horizontal scrolling row of pre-set filter bundles; `<button>` elements with `aria-pressed` |
| `ResultCount` | "Showing N of 108 entries" text + `role="status"` live region |
| `ClearFiltersButton` | Resets all active filters |
| `EntryCard` | Card component used in all surfaces — see §6d |
| `EntryCardList` | `<ul>` wrapper for a set of entry cards; uses CSS grid layout |

### 6c. Source Map components

| Component | Description |
|-----------|-------------|
| `OtBookTileGrid` | CSS grid of `OtBookTile` elements; tiles sized by citation-occasion frequency |
| `OtBookTile` | Single book tile: book name, occasion count, entry count; navigates to `/#/ot-book/[id]` |
| `OtBookBarList` | Mobile fallback: ranked `<ol>` with horizontal bar per book |
| `OtBookViewHeader` | Heading for an individual OT book page: name, occasion count, brief observation |
| `SettingSwimlanGroup` | Within an OT book page: entries grouped by audience setting with `<h2>` setting labels |

### 6d. Entry card

| Component | Description |
|-----------|-------------|
| `EntryCard` | 2-word key; NT/3Ne/D&C reference; OT source reference(s); citation type badge; audience/setting label; summary; tentative label if applicable; `<a>` linking to entry detail |

The card's accessible name (via `aria-label` or `aria-labelledby`) includes the 2-word key and both scripture references so screen readers announce them without reading the full card.

### 6e. Entry detail components

| Component | Description |
|-----------|-------------|
| `EntryDetailHeader` | 2-word key (`<h1>`), full NT reference, audience/setting label, tentative label if applicable |
| `ScripturePanel` | `<figure>` + `<blockquote>` + `<figcaption>` for one scripture passage; used twice (NT and OT) |
| `ExternalLink` | Reusable link component with `target="_blank" rel="noopener noreferrer"` and "(opens in new tab)" visually hidden text |
| `CitationTypeBadge` | Badge + brief definition of the citation type; tooltip-accessible |
| `CitationModeTag` | Small tag showing the citation mode (corrective teaching / self-identification / lament / composite) with tooltip explaining the classification |
| `StudyNotes` | The answered study questions; labeled as study observations, not doctrinal statements |
| `ConnectionsPanel` | OT book link, RP group link, pattern links |
| `RelatedEntriesRow` | 2–4 `EntryCard` instances linking to entries in the same RP group or same audience setting |
| `BackToCatalogLink` | Preserves filter state via the URL hash on return |
| `TentativeLabel` | Small italic "tentative" tag — appears only on the ~5 tentative entries |

### 6f. Thread (repeated passages) components

| Component | Description |
|-----------|-------------|
| `ThreadSectionHeader` | Priority group header: "Cited on 4 distinct occasions" (P1), "Cited on 2–3 distinct occasions" (P2), etc. |
| `RepeatGroupCard` | Summary card for one RP group: OT ref, key words, distinct-occasion count, occasion previews; links to the comparison view |
| `OccasionComparisonStrip` | The side-by-side comparison layout for one RP group: one `OccasionPanel` per distinct occasion |
| `OccasionPanel` | `<article>` with `<h3>` occasion heading; NT scripture text; audience/setting label; brief note |

### 6g. Utility components

| Component | Description |
|-----------|-------------|
| `TooltipWrapper` | Accessible tooltip via `aria-describedby` and a visually hidden definition `<span>`; used for citation mode tags and tile size explanations |
| `DcSectionLabel` | The approved D&C section header block (§8 below) |
| `ConfidenceExplanation` | Used on the About page and on tentative entry detail pages to explain what "tentative" means |
| `PageNotFound` | 404 page content: graceful message and link to `/#/` |

---

## 7. Typography

### 7a. Typeface selection

**Scripture text — Lora (serif)**

Lora is the recommended typeface for all displayed scripture. Justification:
- Lora is a contemporary serif with calligraphic roots, designed for reading long-form text on screens. Its stroke contrast is moderate — not as thin and fragile as EB Garamond at small sizes, not as heavy as some transitional serifs.
- Lora's lowercase descenders and ascenders are generously proportioned, which aids legibility at the reading lengths common on scripture detail pages (one to four verses at a time).
- Compared to Crimson Pro: Lora has a slightly larger x-height, which reads more comfortably on mobile screens without requiring a compensating size increase.
- Compared to EB Garamond: Lora is more reliably legible at 16–18px on lower-resolution screens and renders more consistently across macOS and Windows.
- Lora is available via Google Fonts, which is an approved CDN for this project (Google Fonts delivers CSS and font files with no tracking; they are acceptable static assets). Loaded with `<link rel="preconnect">` for performance.

**Headings and UI — DM Sans (sans-serif)**

DM Sans is the recommended typeface for all navigation, labels, filters, cards, and headings. Justification:
- DM Sans is a low-contrast geometric sans-serif with a calm, considered character. It does not impose personality on the content. It reads as modern without feeling technical or cold.
- Compared to Inter: DM Sans has slightly more optical warmth at heading sizes. Inter is slightly more legible at very small UI sizes (9–11px), but the site's minimum UI text is 12px, at which size the difference is negligible.
- Compared to Nunito: Nunito's rounded terminals feel informal — appropriate for a children's app or a casual tool, less appropriate for a reverent scripture study site.
- DM Sans is available via Google Fonts, loaded with preconnect.

**The 2-word key display** — uses DM Sans Bold at a large size (32–40px on desktop, 24–28px on mobile). The 2-word key is a UI label, not scripture text; DM Sans is correct for this role.

### 7b. Type scale (dark mode)

| Role | Typeface | Size | Weight | Line height |
|------|---------|------|--------|------------|
| Site title | DM Sans | 20px | 700 | 1.2 |
| 2-word key (card) | DM Sans | 18px | 700 | 1.2 |
| 2-word key (detail `<h1>`) | DM Sans | 36px desktop / 28px mobile | 700 | 1.15 |
| Section heading `<h2>` | DM Sans | 22px desktop / 18px mobile | 600 | 1.3 |
| Nav links | DM Sans | 15px | 500 | 1 |
| Card metadata (references, badge text) | DM Sans | 13px | 400–500 | 1.4 |
| Card summary | DM Sans | 14px | 400 | 1.5 |
| Scripture text (`<blockquote>`) | Lora | 18px desktop / 16px mobile | 400 | 1.7 |
| Scripture reference (`<figcaption>`) | DM Sans | 12px | 500 | 1.4 |
| Body / study notes | DM Sans | 15px | 400 | 1.6 |
| Small labels / tags | DM Sans | 11–12px | 500 | 1.3 |

### 7c. Google Fonts loading

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Lora:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
```

The `display=swap` parameter ensures text is visible immediately using system fallbacks while the font loads. If Google Fonts is unavailable, the fallback stack applies: `'Georgia', 'Times New Roman', serif` for scripture text; `-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif` for UI text.

---

## 8. Color Palette — Dark Mode (Default)

Dark mode is the default. Light mode is deferred to a future version. The palette targets a warm, reverent atmosphere: deep backgrounds with warm text and gold/amber accents rather than harsh blue-white contrasts.

### 8a. Color roles and values

| Role | CSS variable | Value | Notes |
|------|-------------|-------|-------|
| Page background | `--bg` | `#16120e` | Deep warm brown-black; not a pure `#000` — avoids harshness |
| Surface (cards, panels) | `--surface` | `#201b15` | Slightly lighter than background; warm brown tint |
| Surface elevated (modals, drawers) | `--surface-2` | `#2c241c` | Third elevation level |
| Divider / border | `--line` | `rgba(255, 235, 205, 0.10)` | Warm white at low opacity |
| Primary text | `--text` | `#f0e6d4` | Warm cream; not pure white; comfortable for long reading |
| Secondary text | `--text-2` | `#b8a898` | Muted warm gray for metadata, captions, labels |
| Muted text | `--text-muted` | `#7a6e62` | For placeholder text, disabled states |
| Accent (interactive) | `--accent` | `#c89b4a` | Gold/amber; used for links, active states, focus rings |
| Accent hover | `--accent-hover` | `#dbb060` | Lighter amber on hover |
| Accent muted (tag backgrounds) | `--accent-muted` | `rgba(200, 155, 74, 0.15)` | Low-opacity amber for tag backgrounds |
| Scripture text color | `--scripture` | `#e8dcc8` | Slightly warmer than `--text`; scripture panels are visually distinct |
| Scripture panel background | `--scripture-bg` | `#1c1710` | Slightly darker than `--surface`; frames scripture as a distinct zone |
| Tag background (badges) | `--tag-bg` | `rgba(255, 235, 205, 0.08)` | Very subtle warm wash |
| Tag text | `--tag-text` | `#c0aa88` | Legible on `--tag-bg` |
| Tentative label | `--tentative` | `#a08050` | Understated amber-brown; visually quiet, not alarming |
| Focus ring | `--focus` | `#c89b4a` | Same as accent; 3:1+ against all background surfaces |
| Danger / error (form validation) | `--danger` | `#c07050` | Warm orange-red; used only for form or data errors |

### 8b. Contrast verification targets

| Text combination | Target ratio | Requirement |
|-----------------|-------------|-------------|
| `--text` on `--bg` | ≥ 10:1 | Exceeds AA |
| `--text` on `--surface` | ≥ 8:1 | Exceeds AA |
| `--text-2` on `--surface` | ≥ 4.5:1 | AA normal text |
| `--tag-text` on `--tag-bg` | ≥ 4.5:1 | AA (badges are small text) |
| `--scripture` on `--scripture-bg` | ≥ 8:1 | Exceeds AA |
| `--accent` on `--bg` | ≥ 3:1 | AA for UI components and large text |
| `--focus` as focus ring | ≥ 3:1 against surrounding surface | AA non-text |
| `--tentative` on `--surface` | ≥ 4.5:1 | AA normal text (small labels) |

All values must be verified with a contrast checker before the first review round. If any combination falls short, adjust the value — do not adjust the requirement.

---

## 9. Spacing and Motion Direction

### 9a. Spacing scale

A 4px base unit. The spacing scale uses CSS custom properties:

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 24px;
--space-6: 32px;
--space-7: 48px;
--space-8: 64px;
--space-9: 96px;
```

Card padding: `--space-5` (24px) on desktop, `--space-4` (16px) on mobile.
Section spacing between timeline sections: `--space-8` (64px) on desktop, `--space-7` (48px) on mobile.
Global max-width: `1280px`, centered with `margin: 0 auto`.

Border radius: `--radius` = 10px for cards and panels; `--radius-sm` = 6px for tags and badges; `--radius-xs` = 4px for small UI elements.

### 9b. Motion

The site uses minimal, purposeful motion only. No decorative transitions.

**Approved transitions:**
- Filter application: cards that disappear on filter change fade out at `opacity: 0` over `150ms ease`. Cards that appear fade in at `opacity: 1` over `200ms ease`. The result is a clean, low-distraction update.
- Bottom-sheet filter drawer: slides up from the bottom over `250ms ease-out` on open; slides down on close at `200ms ease-in`.
- Card hover: a `box-shadow` shift and a `2px` `translateY` on hover — `150ms ease`. No scale transforms.
- Sticky section header: no animation. Simply sticky positioning.
- OT book tile hover: a `box-shadow` shift only. No scale.

**All transitions must be suppressed under `prefers-reduced-motion: reduce`.** Under reduced motion, transitions are `0.01ms`. This must be implemented globally:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

No parallax, no scroll-triggered reveal animations, no IntersectionObserver-based entry animations.

---

## 10. Visualization Behavior

### 10a. Timeline surface — section expand/collapse on mobile

On desktop (≥900px): all timeline sections are fully expanded. No collapse. The full timeline is the primary experience.

On tablet (600–899px): timeline sections are expanded by default. The section header acts as a collapse toggle — tapping it collapses/expands the card group within that section. An expand/collapse icon (`▾` / `▸`) appears on the right of the section header with `aria-expanded` state. The section header has `cursor: pointer` and a minimum touch target of 44px height.

On mobile (<600px): same as tablet. The default state is all sections collapsed except the first (Wilderness). This prevents the full timeline from being an overwhelming initial scroll. A "Expand all sections" button appears below the nav area.

The collapsed/expanded state is not persisted across page loads — it resets on each visit. Collapsed sections are hidden with `display: none` (removed from the layout flow) rather than `visibility: hidden` — this keeps the section header in the tab order without the hidden cards consuming keyboard focus.

Section header sticky behavior: `position: sticky; top: 0` with a `z-index` above the cards. The sticky header uses the `--surface` background with a subtle bottom border so it does not bleed into the cards below it.

### 10b. Source Map — OT book tile sizing

Tile sizes are derived from `unique_occasions` counts for each OT book. The mapping is:

- The largest book (Isaiah, 14 occasions) sets the maximum tile area.
- Each other book's tile area is proportional: `tile_area = (book_occasions / max_occasions) * max_area`.
- Area is expressed via CSS `grid-area` spans or explicit `width` + `height` on a CSS grid.

Practical implementation: each tile is assigned a size class (`size-xl`, `size-l`, `size-m`, `size-s`, `size-xs`) derived from the occasion count:

| Occasions | Size class | Approximate visual size |
|-----------|-----------|------------------------|
| 12–14 | `size-xl` | ~200 × 120px |
| 8–11 | `size-l` | ~160 × 100px |
| 5–7 | `size-m` | ~120 × 80px |
| 3–4 | `size-s` | ~100 × 70px |
| 1–2 | `size-xs` | ~80 × 60px |

All tiles are `<a>` elements. The tile text (book name + occasion count) is always visible — it is not a tooltip. Tile size is decorative and supplementary; the text conveys the same information to screen readers.

A short note above the tile grid reads: "Tile size reflects the number of distinct citation occasions — not the theological weight of each book."

**Mobile fallback for Source Map:** On screens narrower than 600px, the tile grid is replaced by a ranked `<ol>` list with a horizontal bar per book (a CSS `width` percentage driven by the occasion count). This is a pure CSS bar chart — no charting library required.

### 10c. Thread — comparison strip

The comparison strip shows all distinct occasions for one RepeatedPassage group side by side.

**Desktop layout:** A horizontal row of `OccasionPanel` cards. Each panel is an `<article>` with:
- `<h3>`: the occasion label (e.g., "Galilee — Sermon on the Mount")
- The NT/3Ne scripture text (the citation itself)
- Audience/setting label
- A brief note from the `observation` field of the RP group record

For RP groups with 4+ occasions (Lev 19:18 has 7 catalog entries across 4 distinct occasions), the panels wrap into a 2-row layout rather than forcing a single row to be very narrow.

**Mobile layout:** The occasion panels stack vertically. Each `<h3>` heading makes the occasion clear. No side-by-side layout on mobile — vertical stacking is more readable.

**Accessible panel structure:** Each `OccasionPanel` is an `<article>` so screen readers can navigate among them as distinct content regions. The scripture text uses `<blockquote>` as specified in `accessibility-plan.md`.

For P3 and P4 groups (parallel Gospel accounts of the same event rather than genuinely distinct occasions), the comparison view is rendered but a note below the heading clarifies: "These entries record parallel Gospel accounts of the same event, not separate occasions in Christ's ministry."

---

## 11. Responsive Rules

Three breakpoint tiers. All values are `min-width` thresholds (mobile-first CSS):

| Tier | Breakpoint | Target |
|------|-----------|--------|
| Mobile | default (no min-width) | Single-column layout; filter drawer as bottom sheet |
| Tablet | `min-width: 600px` | Two-column card grid; timeline sections collapsible; Source Map tiles appear (smaller sizes) |
| Desktop | `min-width: 900px` | Three-column card grid; filter panel as persistent left sidebar; full timeline always expanded; full tile grid |

### Specific breakpoint behaviors

**Navigation:**
- Mobile: hamburger or simple stacked nav links below the site title.
- Tablet/Desktop: horizontal nav bar with four surface links + About.

**Catalog surface — card grid:**
- Mobile: 1 column.
- Tablet (600px+): 2 columns.
- Desktop (900px+): 3 columns, with filter sidebar taking ~280px on the left.

**Filter panel:**
- Mobile: hidden; activated by a "Filter" button fixed or sticky at the top of the main content area. Opens as a bottom-sheet drawer.
- Tablet: same as mobile.
- Desktop: persistent left sidebar, always visible. No drawer needed.

**Timeline section headers:**
- Mobile: sticky, collapse toggle visible, sections collapsed by default except first.
- Tablet: sticky, collapse toggle visible, all sections expanded by default.
- Desktop: sticky, no collapse toggle — full sections always shown.

**Inline OT-book breakdown (within section headers):**
- Mobile: hidden by default; a "View books" tap reveals it in a small popover or inline expansion.
- Tablet/Desktop: shown inline: "Psalms 6 · Isaiah 4 · Deuteronomy 2".

**Source Map tile grid:**
- Mobile: replaced by ranked bar list.
- Tablet: tile grid with `size-s` and `size-xs` at minimum 80px wide.
- Desktop: full proportional tile grid.

**Thread comparison strip:**
- Mobile: vertical stack of occasion panels.
- Tablet/Desktop: horizontal row with wrapping for large groups.

---

## 12. Accessibility Targets

The following are the binding accessibility commitments for Gate 2 and Phase 3. These come directly from `accessibility-plan.md` and are not optional.

**Standard:** WCAG 2.1 Level AA throughout. No documented AA exceptions are planned.

**Contrast:**
- Body text: 4.5:1 minimum on all background surfaces.
- Large text (≥24px regular, ≥18.67px bold): 3:1 minimum.
- UI component boundaries (card borders, input borders): 3:1.
- Focus rings: 3:1 against all adjacent surfaces.
- Badge and tag text: 4.5:1 (small text).
- Muted/secondary text: 4.5:1 — no exception for "looks subtle."

**Semantic structure:** Every page must have exactly one `<h1>`. The heading hierarchy must not skip levels. Filter groups use `<fieldset>` + `<legend>`. Entry cards are `<article>` or `<li>` within a `<ul>`.

**Keyboard navigation:** Every mouse-accessible action is keyboard-accessible. Tab order follows visual reading order. Focus is never lost. The bottom-sheet filter drawer traps focus while open and returns focus to the trigger on close.

**Screen reader:** Tested against VoiceOver (macOS/iOS) as primary. NVDA on Windows as secondary target. A `role="status"` live region announces filter result count changes without focus disruption.

**Reduced motion:** All transitions and animations are suppressed under `prefers-reduced-motion: reduce`. The global suppression rule from §9b is non-negotiable.

**Touch targets:** 44×44px CSS pixels minimum for all interactive elements on mobile.

**Skip link:** `<a href="#main-content" class="skip-link">Skip to main content</a>` is the first tabbable element on every page. It is visually hidden by default and becomes visible on focus (not `display: none`).

**External links:** All links to Church website and ESV use `target="_blank" rel="noopener noreferrer"` and include a visually hidden "(opens in new tab)" span.

**Scripture text:** Displayed in `<figure>` + `<blockquote>` + `<figcaption>` as specified in `accessibility-plan.md §2g`.

---

## 13. D&C Section Label and Treatment

The approved D&C section label, to be displayed at the top of the D&C catalog surface (`/#/dc`) and in the global navigation as a subtitle:

### Navigation label (short form)
> **Doctrine and Covenants — Latter-day Revelation**
> *Christ speaks in first person in latter-day revelation — a different source and setting from the mortal ministry records.*

### Section page header (full form)
Displayed as the introductory block at the top of `/#/dc`:

> **Doctrine and Covenants — Latter-day Revelation**
>
> In the Doctrine and Covenants, Jesus Christ speaks in first person to the Prophet Joseph Smith and early Church leaders. These 17 entries record moments where Christ's words echo or directly quote Old Testament scripture. They are kept here, separate from the mortal-ministry records, because they come from a different source and setting — not the Galilean ministry but ongoing revelation to the Restoration Church.

This text is implemented as the `DcSectionLabel` component (see §6g). It appears above the filter panel and entry list on the D&C surface.

**What to avoid:** Do not label the D&C section as "Additional entries," "Modern scripture," "less reliable," or anything implying reduced authority. The separation is about source and setting, not reliability.

---

## 14. Confidence Indicator Treatment

Confidence is shown only on the approximately five tentative entries. High and supported entries receive no indicator.

**On entry cards (catalog and timeline views):**
A small italic tag reading "Tentative" appears in the bottom-left corner of the card, rendered in `--tentative` color (`#a08050`). It does not use an icon, a warning symbol, or a colored badge. It is visually quiet.

**On entry detail pages:**
The tentative label appears next to the `<h1>` 2-word key, in the same italic small-label style. Below the label, a short explanation renders (the `ConfidenceExplanation` component):

> *This entry is marked "tentative." The allusion is plausible and consistent with the language, but no single OT source is an exact match. It is included because the language is specific enough to suggest scriptural influence. Further study may clarify the relationship.*

**On the About page:**
A brief section explains the three confidence levels:
- High: a direct quotation or an explicit citation with a close verbal match.
- Supported: a strong allusion where the language clearly echoes a specific OT text.
- Tentative: a plausible allusion retained in the catalog because the language is specific enough to warrant study, but the match is not definitive.

**What to avoid:** No red icon, no warning badge, no disclaimer on every card, no filtering by confidence in the main filter panel.

---

## 15. Citation Mode Filter — Field Values and Tooltip Text

The `citation_mode` field is added to the Quotation Entry schema (see `content-model.md`). It is a separate filter axis on the Catalog surface, appearing in the filter panel after Citation Type.

### Field values

| Value | Display label |
|-------|--------------|
| `corrective_teaching` | Corrective teaching |
| `self_identification` | Self-identification |
| `lament` | Lament |
| `composite` | Composite |

### Tooltip text (one sentence each)

These tooltips appear on the Citation Mode filter labels and on the `CitationModeTag` component on entry detail pages. They are implemented via the `TooltipWrapper` component.

**Corrective teaching:**
> Christ cites the Old Testament to reframe, fulfill, or correct a misunderstanding — often in a dispute or a teaching moment where the text is the common ground.

**Self-identification:**
> Christ cites the Old Testament to describe who he is, what he is doing, or why he has come — using scripture as a lens through which to read his own identity and mission.

**Lament:**
> Christ cites the Old Testament to voice profound sorrow, abandonment, or suffering — most starkly in the cross citations from the Psalms.

**Composite:**
> This entry blends more than one mode, or the citation does not fit cleanly into the other three categories; it is retained to avoid forcing a classification that would mislead.

The tooltip is accessible via `aria-describedby` pointing to a visually hidden `<span>` containing the tooltip text. On mobile, the tooltip is triggered by a tap on a small information icon adjacent to the label.

---

## 16. Prioritized Implementation Backlog

Tasks are ordered by dependency and risk. Build in thin vertical slices — each slice should produce something reviewable.

### Slice 1 — Project shell and build configuration
1. Initialize the project directory with `package.json`, Vite config, and `.gitignore`.
2. Configure `vite.config.js` with `base: '/the-chosen-word/'`.
3. Create `public/index.html` with the site shell: skip link, global nav placeholder, `<main id="main-content">`, footer.
4. Create `src/main.js` entry point and `src/router.js` with hash routing for the five surface routes.
5. Create `src/styles/main.css` with all CSS custom properties (palette, spacing, radius, typography).
6. Verify the dev server works at `http://localhost:5173/the-chosen-word/`.

### Slice 2 — Data schema and validation
7. Create `data/catalog.json` following the approved schema in `content-model.md` (including the new `citation_mode` field). Populate with a representative subset of approved entries (10–15 entries across different settings).
8. Create `data/annotations.json` for annotation records.
9. Create `scripts/validate-catalog.js` with all validation checks from `technical-plan.md §4c`.
10. Confirm `npm run validate` passes on the initial data file.

### Slice 3 — Global navigation and shell
11. Build the `GlobalNav` component: site title, four surface links, About, D&C tab. Correct `aria-current` on the active surface.
12. Build the `SiteShell` wrapper.
13. Verify keyboard tab order through the nav. Verify `aria-current` is announced by VoiceOver.

### Slice 4 — Entry card and detail page (first complete journey)
14. Build the `EntryCard` component with all specified fields.
15. Build the entry detail page renderer (`src/pages/detail.js`) with `ScripturePanel`, `CitationTypeBadge`, `CitationModeTag`, `StudyNotes`, `ConnectionsPanel`, `TentativeLabel`.
16. Wire the router so `/#/entry/q-001` renders the detail page for Q-001 from the data.
17. Verify the detail page against the accessibility plan: heading hierarchy, `<blockquote>` structure, external link labels, keyboard navigation.

### Slice 5 — Home / Timeline surface
18. Build the `TimelineSectionHeader` component with the setting name, entry count, and inline OT-book micro-breakdown.
19. Build the timeline page renderer (`src/pages/home.js`) that groups entries by `audience_setting_ids` and renders section headers + card lists.
20. Implement sticky section headers.
21. Implement mobile collapse/expand behavior with `aria-expanded`.
22. Add the "not a strict chronological sequence" note at the top of the page.
23. Verify the timeline with all available entries. Check that the Passion-arc pattern (Pentateuch → Psalms/Isaiah) is visible from the section headers alone.

### Slice 6 — Catalog surface and filter system
24. Build the `FilterPanel`, `FilterGroup`, `FilterChip`, `FilterChipList`, `PatternShortcutRow`, `ResultCount`, and `ClearFiltersButton` components.
25. Build the Catalog page renderer (`src/pages/catalog.js`) with the full filter logic (AND across axes, OR within an axis).
26. Implement filter state encoding in the URL hash (`/#/catalog?book=ISA`).
27. Implement the `role="status"` live region for result count announcements.
28. Build the mobile bottom-sheet filter drawer with focus trapping and focus return.
29. Test all filter axes with the full 108-entry dataset. Verify the pattern shortcut row activates correct filter combinations.

### Slice 7 — Source Map surface
30. Build the `OtBookTileGrid` and `OtBookTile` components with size-class logic.
31. Build the `OtBookBarList` mobile fallback.
32. Build the Source Map page renderer (`src/pages/source-map.js`).
33. Build the OT Book detail page renderer (`src/pages/ot-book.js`) with `SettingSwimlanGroup`.
34. Add the tile-size explanation note above the grid.
35. Verify tile sizes are derived from data, not hard-coded.

### Slice 8 — Thread surface
36. Build the `OccasionComparisonStrip` and `OccasionPanel` components.
37. Build the Thread page renderer (`src/pages/thread.js`) with the ranked RP list grouped by priority tier.
38. Wire the "This passage appears N times →" links on entry detail pages to the comparison view.
39. Handle P3/P4 groups with the parallel-accounts clarification note.
40. Verify the comparison strip is keyboard-navigable and correctly structured for screen readers.

### Slice 9 — D&C surface
41. Build the D&C catalog page renderer (`src/pages/dc.js`) with the `DcSectionLabel` component and the approved section label text.
42. Verify D&C entry detail pages use the correct `AUD-DC` audience labels and revelation context.
43. Verify cross-links between D&C entries and Gospel entries that share OT sources (e.g., Mal 4:1 in both segments).

### Slice 10 — About page and supporting pages
44. Build the About page with: project description, how to read an entry, source policy, confidence explanation, D&C section explanation, interpretation disclaimer.
45. Build `public/404.html`.
46. Add the Pattern pages (`src/pages/pattern.js`).

### Slice 11 — Responsive refinements
47. Test all surfaces at 375px (mobile), 768px (tablet), and 1280px (desktop). Fix any layout issues.
48. Verify touch targets at 375px using DevTools mobile emulation.
49. Verify the Source Map tile grid at all three breakpoints.

### Slice 12 — Accessibility and quality pass
50. Run axe browser extension on every page type. Resolve all issues.
51. Full keyboard-only tab-through of the catalog surface, filter drawer, entry detail, and Thread comparison.
52. VoiceOver test: Scenario 1 (filter catalog), Scenario 2 (read entry detail), Scenario 3 (mobile filter drawer) from `accessibility-plan.md §7`.
53. Set `prefers-reduced-motion: reduce` in browser settings and verify all transitions suppress.

### Slice 13 — Citation, source, and data integrity
54. Populate `data/catalog.json` with the full 108 approved entries.
55. Run `npm run validate` on the complete dataset. Resolve all validation failures.
56. Verify every entry has `publication_status: "approved"` before the first review round.

### Slice 14 — Build, deployment configuration, and metadata
57. Add `<title>`, `<meta description>`, Open Graph tags, and favicon to `public/index.html`.
58. Create the GitHub Actions deploy workflow (`/.github/workflows/deploy.yml`) following the approved pattern from `technical-plan.md §8d`.
59. Run `npm run build` and verify the `dist/` output. Test the production build locally at `http://localhost:4173/the-chosen-word/`.
60. Verify all internal links work correctly at the production base path.

---

## 17. Acceptance Criteria for Gate 2

Gate 2 is closed when all of the following are satisfied. These criteria carry forward as acceptance criteria for development and review.

**Content model:**
- [ ] `data/catalog.json` schema includes the `citation_mode` field with values: `corrective_teaching | self_identification | lament | composite`.
- [ ] All 108 entries have `publication_status` set. No entry with `"draft"` status is rendered on the public site.
- [ ] No ESV text is stored in any field. ESV fields hold URLs only.
- [ ] All D&C entries have `segment: "dc"`.

**Architecture:**
- [ ] Four surfaces are implemented: Home/Timeline, Catalog, Source Map, Thread.
- [ ] Hash routing works for all routes defined in §4.
- [ ] Filter state is encoded in the URL hash and survives a page reload.
- [ ] The D&C surface uses the approved section label and short descriptor exactly as written in §13.

**Typography and palette:**
- [ ] Lora is loaded for scripture text. DM Sans is loaded for all UI and headings.
- [ ] Google Fonts are loaded with `preconnect` and `display=swap`.
- [ ] System font fallbacks are specified in CSS.
- [ ] All CSS custom properties from §8a are defined.

**Contrast:**
- [ ] All text/background combinations in §8b meet their stated ratio targets, verified with a contrast checker before Round 1 review.

**Accessibility:**
- [ ] Every page has exactly one `<h1>`.
- [ ] Skip link is present, keyboard-visible, and functional on every page.
- [ ] Filter groups use `<fieldset>` + `<legend>`.
- [ ] Scripture text uses `<figure>` + `<blockquote>` + `<figcaption>`.
- [ ] External links include "(opens in new tab)" text.
- [ ] `role="status"` live region announces filter result count changes.
- [ ] Mobile filter drawer traps focus while open and returns focus to the trigger on close.
- [ ] All transitions are suppressed under `prefers-reduced-motion: reduce`.
- [ ] Touch targets are 44×44px minimum on mobile.

**Confidence and citation mode:**
- [ ] Tentative entries display the small italic "tentative" tag. No other confidence indicators appear on cards.
- [ ] The `ConfidenceExplanation` component appears on tentative detail pages and on the About page.
- [ ] Citation mode tags appear on entry detail pages with correct tooltip text from §15.
- [ ] Citation mode is a filter axis on the Catalog surface.

**Visualization:**
- [ ] Timeline section headers are sticky and include the inline OT-book micro-breakdown.
- [ ] Mobile collapse/expand behavior works with correct `aria-expanded` state.
- [ ] Source Map tile sizes are derived from data (`unique_occasions`), not hard-coded.
- [ ] Source Map mobile fallback (bar list) renders at <600px.
- [ ] Thread comparison strips are structured as `<article>` elements with `<h3>` headings.
- [ ] P3/P4 groups display the parallel-accounts clarification note.

**Build and deployment:**
- [ ] `npm run validate` passes on the complete dataset.
- [ ] `npm run build` completes without errors.
- [ ] All internal links resolve correctly at the production base path (`/the-chosen-word/`).
- [ ] The GitHub Actions deploy workflow is present and syntactically valid.
- [ ] `public/404.html` exists and links back to `/#/`.

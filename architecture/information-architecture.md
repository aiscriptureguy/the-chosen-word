# The Chosen Word — Information Architecture

**Status:** Draft — Phase 2
**Last updated:** 2026-10-22

---

## 1. Site Purpose and Scope

The site is a filterable, cross-linked catalog of 108 quotation entries: 91 from the Gospels and 3 Nephi, plus 17 from the Doctrine and Covenants. The D&C entries are kept in a distinct section with clear labeling. The site is not a linear reading experience. It is a personal research tool for deep scripture study, with a secondary audience of Church members seeking to explore the same topic.

---

## 2. Page Inventory

| Page | Description | URL |
|------|-------------|-----|
| Home / Catalog | Primary landing page. The filterable catalog of all entries. Default view shows Gospels/3 Nephi section. | `/` |
| D&C Section | The 17 D&C entries, displayed in the same catalog format with D&C-specific context. | `/dc/` |
| Entry Detail | Full detail view for a single quotation entry. | `/entry/[id]/` (e.g., `/entry/q-001/`) |
| OT Book View | All entries citing a given OT book, with frequency context. | `/ot-book/[book-id]/` (e.g., `/ot-book/isa/`) |
| Pattern View | A named pattern with its supporting entries and evidence. | `/pattern/[pattern-id]/` (e.g., `/pattern/pat-001/`) |
| About / How to Use | Brief explanation of the project, scope, source policy, confidence labels, and how to read an entry. | `/about/` |
| 404 | Graceful not-found page. | `/404.html` |

Total page types: 7 (counting 404). Distinct rendered pages at build time: approximately 130+ (1 home, 1 DC, 92 entry pages, 1 DC entry per ID, ~16 OT book pages, ~9 pattern pages, 1 about, 1 404).

---

## 3. URL Structure

The site deploys to:
```
https://aiscriptureguy.github.io/the-chosen-word/
```

All internal URLs are relative to the base path `/the-chosen-word/`. Client-side routing or a build tool must inject the correct base path.

| Page | URL Pattern | Example |
|------|------------|---------|
| Home | `/` | `https://aiscriptureguy.github.io/the-chosen-word/` |
| D&C Section | `/dc/` | `.../the-chosen-word/dc/` |
| Entry Detail (Q-xxx) | `/entry/q-[nnn]/` | `.../the-chosen-word/entry/q-001/` |
| Entry Detail (DC-xxx) | `/entry/dc-[nnn]/` | `.../the-chosen-word/entry/dc-001/` |
| OT Book | `/ot-book/[id]/` | `.../the-chosen-word/ot-book/isa/` |
| Pattern | `/pattern/[id]/` | `.../the-chosen-word/pattern/pat-001/` |
| About | `/about/` | `.../the-chosen-word/about/` |

IDs in URLs are lowercase. `Q-001` becomes `q-001`; `DC-009` becomes `dc-009`; `PAT-001` becomes `pat-001`; `ISA` becomes `isa`.

---

## 4. Navigation Model

### 4a. Global Navigation

Persistent header on every page. Contains:
- Site title: "The Chosen Word"
- Two primary section links: "Gospels & 3 Nephi" and "Doctrine & Covenants"
- Link to "About"
- No search bar in the global nav — search lives on the catalog page itself.

### 4b. Catalog Navigation (Home and D&C pages)

The catalog page is the primary navigation surface. Users find entries through:

1. **Filter panel** — multiselect filters for: OT Book, Gospel/Book source, Audience/Setting, Citation Type, Confidence (optional, see QO-13 discussion in `visualization-options.md`).
2. **Active filter chips** — displayed above the result list; each chip is dismissable.
3. **Quick-access pattern links** — a horizontal row of pattern labels (e.g., "Passion Arc," "Wilderness," "Hosea Diagnostic") that activate a pre-set filter combination when clicked.
4. **Result count** — "Showing 14 of 91 entries" keeps users oriented.

### 4c. Entry Detail Navigation

Each detail page contains:
- **Back to catalog** link (preserves filter state via URL params or session storage)
- **Related entries** section: other entries in the same RepeatedPassage group, if any
- **Pattern membership** links: which patterns this entry belongs to
- **OT Book link**: link to the OT Book view for this entry's source book
- **Previous / Next entry** navigation by catalog order (optional — skip if it distracts from the content)

### 4d. Cross-Reference Navigation

- An OT Book view links to all entries citing that book.
- A Pattern view links to all participating entries.
- Each entry detail links back to the relevant OT book and pattern pages.
- The D&C section entry detail pages link to the main catalog if the same OT passage appears in Gospel entries (e.g., Mal 4:1 appears in both Q-092 and DC-001/DC-017).

---

## 5. D&C Section — Separation and Labeling

### 5a. Structural separation

The D&C section is a distinct page (`/dc/`) and a distinct segment in the data model (`segment: "dc"`). It is not mixed into the Gospels/3 Nephi catalog by default. Users can reach it via the global nav tab "Doctrine & Covenants."

The D&C section has its own filter panel and uses the same entry detail page template as Gospel entries.

### 5b. Section label and framing (resolves QO-12)

The section needs a label that communicates:
- These are Christ speaking in first person in latter-day revelation (not the mortal ministry)
- The setting and speaker attribution are based on section headings and first-person context
- This is not a different Christ — it is the same Lord speaking in a different dispensation

**Proposed label and short descriptor to display at the top of the D&C section:**

> **Doctrine and Covenants — Latter-day Revelation**
>
> In the Doctrine and Covenants, Jesus Christ speaks in first person to the Prophet Joseph Smith and early Church leaders. These 17 entries record moments where Christ's words echo or directly quote Old Testament scripture. They are kept here, separate from the mortal-ministry records, because they come from a different source and setting — not the Galilean ministry but ongoing revelation to the Restoration Church.

This framing does not require the reader to know Church history to understand the distinction. It explains itself. The word "Restoration" anchors it in LDS vocabulary without requiring a canonical-history explanation. The phrase "a different source and setting" sets the expectation without casting doubt on the content.

**What to avoid:** Do not use "latter-day saints" as the audience label (that would imply the other section is for a different audience). Do not use "vision" or "dream" — the word "revelation" is precise and Church-standard. Do not describe D&C as "less reliable" — that is inaccurate and unfaithful to the source.

### 5c. Routing for D&C entries

D&C entry detail pages use the same `/entry/dc-[nnn]/` URL pattern. The detail page template shows the revelation section/verse reference instead of a Gospel reference, and the audience/setting label uses the D&C-specific `AUD-DC` descriptions (e.g., "Revelation to Joseph Smith and others, Missouri, 1830").

---

## 6. Filtering Model

### 6a. Filter axes

| Axis | Values | Type |
|------|--------|------|
| OT Book | ISA, DEUT, PSA, EXOD, LEV, GEN, MAL, DAN, HOS, ZECH, MIC, 1SAM, JONAH, JER, NUM, EZEK, JOEL | Multiselect checkbox |
| Gospel/Book source | Matthew, Mark, Luke, John, 3 Nephi (only on main catalog) | Multiselect |
| Audience / Setting | Wilderness, Hostile questioners, Sermon on the Mount, Private disciples, Passion week, Last Supper, Trial, Cross, Nephite multitude | Multiselect |
| Citation type | Direct quotation, Paraphrase, Close allusion, Explicit citation, Full chapter | Multiselect |
| Confidence | High, Supported, Tentative | Multiselect (shown only if Chase confirms — see QO-13 discussion) |

### 6b. Filter behavior

- Filters within the same axis combine with OR logic. Filters across different axes combine with AND logic. (Standard faceted search: "show me Isaiah OR Deuteronomy entries that are from Hostile settings.")
- Active filters are displayed as dismissable chips above the result list.
- "Clear all filters" button resets the full filter state.
- Filter counts update to show how many entries match each additional selection before the user applies it.
- Filter state is encoded in URL query parameters so users can share or bookmark filtered views.

### 6c. Pre-set filter bundles (pattern shortcuts)

A horizontal row of named shortcuts provides fast access to the study patterns found in Phase 1. These are pre-loaded filter combinations:

| Shortcut Label | Filter combination |
|---------------|-------------------|
| Wilderness | Audience = Wilderness |
| Passion Arc | Audience = Passion week + Last Supper + Trial + Cross |
| Against Opponents | Audience = Hostile questioners |
| Isaiah Saturation | OT Book = Isaiah |
| Psalms at the Cross | OT Book = Psalms + Audience = Cross |
| Hosea Diagnostic | OT Book = Hosea |
| Repeated Passages | (links to a separate view listing RP groups, not a filter) |

---

## 7. Entry Card Format (catalog view)

Each entry in the catalog list displays:

- 2-word key (large, prominent)
- NT/3Ne/D&C reference
- OT source reference(s)
- Citation type badge
- Audience/Setting label
- Summary (1–2 sentences)
- Confidence indicator (if shown — see QO-13)

Clicking the card navigates to the entry detail page.

---

## 8. Entry Detail Page Structure

```
[Back to catalog — preserves filter state]

[2-Word Key]                              [Confidence badge if tentative]
[Full NT/3Ne/D&C reference]
[Audience / Setting]

── NT/3Ne/D&C Scripture Text (Church source) ──────────────────────────────
[Verse text]
[Link: Read in context on churchofjesuschrist.org → opens new tab]

── OT Source ───────────────────────────────────────────────────────────────
[OT reference]
[OT verse text (Church source)]
[Link: Read in context on churchofjesuschrist.org → opens new tab]
[Link: Compare in ESV → opens new tab]

── Citation Type ────────────────────────────────────────────────────────────
[Badge + brief definition]

── Study Notes ──────────────────────────────────────────────────────────────
[Answered study questions — labeled "What this citation does" or similar]
[Cautions or interpretive notes if present]

── Connections ──────────────────────────────────────────────────────────────
[OT Book link: "See all [n] Isaiah citations →"]
[Repeated passage group link if applicable: "This passage appears [n] times →"]
[Pattern links: "Part of: Passion Arc, Psalms at the Cross"]

── Related Entries ──────────────────────────────────────────────────────────
[2–4 cards: other entries in the same RP group or same audience setting]
```

---

## 9. OT Book View Structure

```
[OT Book name] — [n] citation occasions, [n] catalog entries

[Brief observation from ot-book-patterns.md]

[Tabular or card list of entries, grouped by audience/setting]

[Link to Pattern pages that feature this book prominently]
```

---

## 10. Pattern View Structure

```
[Pattern name]
[Strength label: Tentative / Supported / Strong]

[Pattern description — the observation and evidence]

[Entries that participate in this pattern — card list]

[Open questions if present — labeled clearly as "Questions for further study"]
```

---

## 11. About Page Structure

- What this project is and who made it
- How to read an entry (explains 2-word key, citation type labels, confidence levels)
- Source policy: Church scripture text from churchofjesuschrist.org; ESV outbound links only
- What "confidence" means: high = well-supported direct quotation; supported = strong allusion; tentative = plausible but requires further study
- What the D&C section is and how it differs from the Gospels/3 Nephi section
- A note that interpretive observations in the study notes are labeled as such and are not official Church doctrine

---

## 12. Site Map

```
/                             ← Catalog (Gospels + 3 Nephi, 91 entries)
  /entry/q-001/ ... q-092/   ← 92 entry detail pages
  /ot-book/isa/ ... /num/     ← ~16 OT book views
  /pattern/pat-001/ ... /     ← ~9 pattern views
/dc/                          ← D&C catalog (17 entries)
  /entry/dc-001/ ... dc-017/  ← 17 entry detail pages
/about/
/404.html
```

---

## 13. Open Questions

- **QO-IA-1:** Should OT Book views and Pattern views be statically generated pages (built at compile time) or dynamically rendered via client-side JavaScript filtering? Static pages provide better performance and direct-link sharing; dynamic rendering avoids a build step for these secondary views. Given the site is static by default, static generation is preferred.
- **QO-IA-2:** Should the catalog default to showing all 91 entries at once, or a paginated/windowed view? Given 91 entries as cards, a single scrollable list is manageable but should be tested at mobile widths. Pagination adds complexity; virtual scrolling is an option but adds dependencies.
- **QO-IA-3:** The "Previous / Next entry" navigation on detail pages is convenient but navigates by raw catalog order. Consider whether navigating "within the current filter set" would be more useful, or whether this adds too much state management complexity.

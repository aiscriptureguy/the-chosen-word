# The Chosen Word — Visualization Options and UX Concepts

**Status:** Draft — Phase 2
**Last updated:** 2026-10-22

---

## Addressing Phase 2 Open Questions First

### QO-12: How to label the D&C section for general LDS visitors

**The problem:** Visitors who know Church history well will immediately understand "D&C" and "latter-day revelation." Visitors who are less familiar may not know why these entries are in a separate section or what makes them different from the Gospel accounts.

**Proposed solution:** Use a two-line label in the global nav and at the top of the D&C section. The first line is the formal identifier. The second line is a plain-English context sentence.

> **Doctrine and Covenants**
> Christ speaks in first person in latter-day revelation — a different source and setting than the mortal ministry.

This framing:
- Does not assume the visitor knows when D&C was written or by whom it was received.
- Does not imply the content is less authoritative — it explains the separation is about source and setting, not reliability.
- The phrase "mortal ministry" is standard LDS vocabulary and distinguishes the D&C from the Gospel accounts without requiring a lecture on Church history.
- The word "revelation" is Church-standard and accurate.

On the D&C section page itself, a slightly longer introductory paragraph expands this (see `information-architecture.md` §5b).

**What to avoid:** Do not label it "Additional entries" or "Modern scripture" — those phrasings either minimize it or require the visitor to already know what modern scripture means. Do not use "restoration" without context on the nav label — save that word for the full introductory paragraph.

---

### QO-13: Whether to show confidence indicators for tentative entries

**The problem:** Five D&C entries are classified "tentative" (DC-003, DC-007, DC-010, DC-011, DC-014). A few Gospel allusions are also close calls. Suppressing confidence information keeps the catalog cleaner but is intellectually dishonest. Showing confidence risks making the study feel uncertain or fragile in ways that undermine the reader's engagement.

**Proposed solution:** Show confidence — but only flag the tentative entries, and only as a small, visually understated badge. High and supported entries receive no badge. Tentative entries receive a small label ("Tentative" or a small icon) and the detail page explains what tentative means.

Reasoning:
- The study's authority comes from intellectual honesty. Hiding the distinction would undermine that.
- Most entries (103 of 108) are high or supported. A badge on 5 entries is not a signal that the whole catalog is shaky.
- The About page and the detail page for tentative entries both explain what "tentative" means: "The allusion is plausible and consistent with the language but no single OT source is an exact match. It is retained because the language is specific enough to indicate a scriptural influence."
- Hiding confidence levels entirely would require removing the intellectual work of Phase 1 from the site. That would be a loss.

**What to avoid:** Do not use a red warning icon — that would signal alarm rather than scholarly nuance. Do not add a lengthy confidence disclaimer to every card — that would clutter the catalog. A small, neutral "Tentative" label on the handful of entries that need it is sufficient.

---

## Three UX Concepts

All three concepts share the same data model and URL structure. What differs is the primary landing experience, how the catalog is entered, and what the main visual surface communicates.

---

## Concept A — "The Catalog"

### Memorable concept name
**The Catalog** — a direct, filterable card grid that puts the full entry list in front of the user immediately, with a pattern sidebar for context.

### Primary user journey

1. User arrives at the home page and sees all 91 entries as compact cards in a scrollable grid.
2. A filter panel on the left (desktop) or in a collapsible drawer (mobile) offers all filter axes.
3. User selects a filter — e.g., "OT Book: Isaiah" — and the grid updates in place. 19 cards remain.
4. User clicks a card to open the entry detail page.
5. On the detail page, the user sees the scripture text, citation type, study notes, and connections to repeated passages and patterns.
6. The user clicks a pattern link ("Passion Arc") and reaches a pattern summary page that lists all entries in that pattern.

### Information hierarchy

1. Entry cards — the catalog itself is the primary surface
2. Filters — the means of navigation
3. Patterns — secondary, accessible via sidebar links and detail page connections
4. D&C entries — accessible via global nav tab, not shown on the default catalog page

### Navigation model

- Left column: filter panel (persistent on desktop, drawer on mobile)
- Right / main area: scrollable card grid
- Horizontal strip at the top of the grid: pattern shortcut chips ("Wilderness," "Passion Arc," "Isaiah Saturation," etc.)
- Global nav: site title, Gospels/3 Nephi tab (active), Doctrine & Covenants tab, About

### Major page types

- Catalog page (home) — filterable grid
- D&C catalog page — same layout, different segment
- Entry detail page
- OT Book page — same grid filtered to one book, with an introductory paragraph
- Pattern page — description + filtered grid
- About page

### Visualization strategy

**Primary:** The card grid itself is the visualization. When filters are applied, the count of visible cards versus total is the immediate signal of frequency. Selecting "Isaiah" and seeing 19 of 91 remain is more immediately readable than a bar chart.

**Secondary:** A small frequency bar chart in the filter panel shows relative frequency of each OT book (Isaiah: 19, Deuteronomy: 12, Psalms: 12, etc.) so users can see relative weight before filtering.

**What understanding it creates:** The reader sees the breadth of the catalog at a glance and can narrow to any combination of axes quickly. The frequency bars make the Isaiah-Deuteronomy-Psalms dominance immediately apparent.

**What misunderstanding it risks:** The grid displays all entries with equal visual weight, which could imply that "Bread Alone" (Q-001) is as significant as "My God" (Q-033). Repeated-passage badges and confidence labels partially address this, but the grid format inherently equalizes.

### Mobile behavior

- Filter panel collapses into a bottom sheet triggered by a "Filter" button above the grid.
- Cards reflow from a 3-column grid to a 1-column stack on narrow screens.
- Pattern shortcut chips scroll horizontally.
- The filter panel bottom sheet is full-width with large touch targets.

### Accessibility considerations

- Filter checkboxes are `<fieldset>` + `<legend>` groups with ARIA labels.
- Active filter chips include a visible "remove" button with an accessible label: "Remove filter: Isaiah."
- Card grid uses a `<ul>` with `<li>` items; each card is a `<a>` tag for keyboard navigation.
- Focus is managed when the filter drawer opens on mobile: focus moves to the first focusable element inside the drawer.

### How citations and source context appear

On the card: the OT source reference is displayed below the NT reference. No scripture text on the card — summary text only.

On the detail page: full scripture text for both the NT citation and the OT source, displayed in adjacent panels. Links to Church website open in a new tab. ESV link is a small secondary link labeled "Compare in ESV."

### Strengths

- Immediate access to the full catalog — no gatekeeping, no required entry path.
- Familiar pattern for researchers: a catalog is what the content is.
- Filters are the primary discovery mechanism, which matches the content's filtering axes well.
- Extremely clear and functional — no metaphorical overhead.

### Trade-offs

- Does not communicate the "story" of the catalog: that Christ's OT citations cluster around distinct moments, shift across the Passion arc, or follow recognizable patterns by audience.
- The grid treats all entries as equal — there is no visual signal that Lev 19:18 (RP-001, P1) is the most-cited passage.
- First-time visitors have no on-ramp. They see 91 cards and must know they want to filter.

### Content or technical risks

- Rendering 91 cards initially may feel overwhelming without an effective visual hierarchy.
- Filter state management in URL params requires careful implementation for base-path handling.
- If the catalog grows (future study loops add entries), the grid grows with it — which is a feature, not a risk.

### Why this concept fits this study

The catalog is organized primarily as a filterable reference tool for deep personal study. The content itself is a database: 108 entries with multiple dimensions. Concept A is the most direct translation of that content into a UI. It does not editorialize — it presents the catalog and lets the user navigate.

---

### Text wireframe

```
┌─────────────────────────────────────────────────────────────────────────┐
│  THE CHOSEN WORD        [Gospels & 3 Nephi] [Doctrine & Covenants] [About] │
└─────────────────────────────────────────────────────────────────────────┘

┌──── Filters ────┐  ┌──── Pattern shortcuts ──────────────────────────────┐
│ OT Book         │  │ [Wilderness] [Passion Arc] [Against Opponents]       │
│ □ Isaiah (19)   │  │ [Isaiah Saturation] [Hosea Diagnostic]               │
│ □ Deuteronomy(12│  └─────────────────────────────────────────────────────┘
│ □ Psalms (12)   │
│ □ Exodus (9)    │  Showing 91 of 91 entries  [Clear filters]
│ □ Leviticus (5) │
│ □ Daniel (4)    │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ ...             │  │ Bread Alone  │ │ Tempt Not    │ │ Worship Only │
│                 │  │ Matt 4:4     │ │ Matt 4:7     │ │ Matt 4:10    │
│ Source          │  │ Deut 8:3     │ │ Deut 6:16    │ │ Deut 6:13    │
│ □ Matthew (33)  │  │ Direct quot. │ │ Direct quot. │ │ Direct quot. │
│ □ Mark (15)     │  │ Wilderness   │ │ Wilderness   │ │ Wilderness   │
│ □ Luke (18)     │  │ ...          │ │ ...          │ │ ...          │
│ □ John (6)      │  └──────────────┘ └──────────────┘ └──────────────┘
│ □ 3 Nephi (20)  │
│                 │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Audience        │  │ Kill Not     │ │ Commit Not   │ │ Forsaken Me  │
│ □ Wilderness    │  │ Matt 5:21    │ │ Matt 5:27    │ │ Matt 27:46   │
│ □ Hostile (38)  │  │ Exod 20:13   │ │ Exod 20:14   │ │ Ps 22:1      │
│ □ Sermon (12)   │  │ Paraphrase   │ │ Paraphrase   │ │ Direct quot. │
│ □ Disciples(14) │  │ Sermon       │ │ Sermon       │ │ Cross        │
│ □ Passion (18)  │  │ ...          │ │ ...          │ ...            │
│ □ Nephite (20)  │  └──────────────┘ └──────────────┘ └──────────────┘
└─────────────────┘
```

---

## Concept B — "The Source Map"

### Memorable concept name
**The Source Map** — a visual landscape organized by OT book. Users enter the catalog through the books of scripture Christ cited, not through a flat list.

### Primary user journey

1. User arrives at the home page and sees a visual grid of OT books, sized by the number of citation occasions — Isaiah is the largest tile, Jonah is the smallest.
2. User clicks "Isaiah" and enters a focused view: all 19 Isaiah entries, grouped by Christ's ministry setting (Nazareth synagogue, Passion week, 3 Nephi discourse).
3. Within the Isaiah view, the user sees the entries shift across settings — Isaiah appears early (Nazareth), in disputes (Isa 29:13), and massively in 3 Nephi (Isaiah 52, 54) — the clustering by setting is itself a discovery.
4. The user clicks an entry card to reach the detail page.
5. From the detail page, the user can navigate to other OT books or to a pattern page.

### Information hierarchy

1. OT Book grid — the visual landing surface communicates frequency before any reading
2. Within-book view — entries grouped by audience/setting, showing the distribution of Christ's use of that book
3. Entry detail — the full text and study content
4. Patterns and repeated passages — secondary, linked from the within-book view and detail pages

### Navigation model

- Home page: OT book tile grid (visual map)
- Second level: within-book filtered view with setting groupings
- Third level: entry detail
- D&C section: parallel structure reachable from global nav
- Global nav: site title, Gospels/3 Nephi (active), Doctrine & Covenants, About

### Major page types

- OT Book Map (home) — the visual tile grid
- OT Book View — entries for a single book, grouped by setting
- Entry detail
- D&C section (reachable via global nav — same structure as OT Book Map but for DC entries)
- Pattern pages — linked from within-book views and detail pages
- About page

### Visualization strategy

**Primary:** A responsive tile grid where tile size is proportional to the number of unique citation occasions. Isaiah (14 occasions) is roughly 3x the visual weight of Zechariah (1 occasion). This makes the Isaiah-Psalms-Deuteronomy hierarchy immediately visible on the landing page.

**Implementation:** CSS grid with `grid-area` or `flex-wrap` to allow tiles to scale. On mobile, a horizontal bar-chart alternative replaces the tile grid.

**Secondary within-book view:** Entries are grouped into horizontal swimlanes by audience setting. The Wilderness entries appear as a tight cluster of three (all Deuteronomy, as the pattern notes). The 3 Nephi entries for Isaiah appear as a long cluster at the bottom.

**What understanding it creates:** The relationship between OT books and Christ's ministry settings becomes immediately visible. The user sees — before reading a single entry — that Deuteronomy belongs to the Wilderness, Psalms belongs to the cross, and Isaiah fills 3 Nephi. These are the central findings of Phase 1, communicated visually before any text.

**What misunderstanding it risks:** Tile size communicates raw frequency, which the visitor might read as "importance." A small tile for Hosea might suggest Hosea is barely relevant — but the Hosea pattern (diagnostic for Pharisees, only in Matthew) is one of the most analytically interesting findings. A caption or tooltip must clarify that tile size is frequency, not theological significance.

### Mobile behavior

- The proportional tile grid collapses to a ranked list with horizontal frequency bars (a bar chart in list form).
- Each OT book name is a large touch target.
- The within-book setting swimlanes collapse to a plain filtered list on mobile.

### Accessibility considerations

- Each tile in the OT book grid is a `<a>` element with text content (the book name and entry count).
- Tile size is decorative — the accessible text conveys the same information: "Isaiah — 14 occasions."
- Screen readers receive the frequency count as text, not as visual size.
- High-contrast mode: tile sizes remain, but the visual distinction relies on text and borders, not color alone.
- The within-book swimlane groupings use `<section>` elements with `<h2>` headings for each setting.

### How citations and source context appear

On the OT Book tile: just the book name and count. No scripture text.

In the within-book view: compact cards identical to Concept A's cards.

On the detail page: identical to Concept A.

### Strengths

- The home page communicates a key finding (Isaiah-Psalms-Deuteronomy dominance) before the user reads anything.
- Entering by OT book is a natural path for someone who wants to study, say, Isaiah or the Psalms.
- The within-book setting groupings make the audience-pattern findings visible without requiring the user to read the pattern pages first.
- Memorable and distinctive — no other scripture study tool presents content this way.

### Trade-offs

- Adds a layer between the user and the catalog entries. Someone who wants to go directly to "Matt 27:46 — Forsaken Me" must first know it is a Psalms entry, click the Psalms tile, then scroll to find it.
- The proportional tile grid requires care with small OT books. Jonah, Numbers, and 1–2 Kings have a single entry each — their tiles must be legible and useful even at small sizes.
- The visual metaphor of "a map of the Old Testament as Christ used it" is not immediately obvious. It requires a short explanation on the page.

### Content or technical risks

- Tile sizing is cosmetic. If the entry counts change (new study loop adds entries), the tile sizes must recalculate. This is manageable if sizes are derived from data, not hard-coded.
- The within-book grouping by setting requires the audience_setting_ids to be accurate for every entry. Misclassified entries would appear in the wrong swimlane.
- If no direct-URL entry is provided, deep-linked OT book pages may feel decontextualized without the home page frame.

### Why this concept fits this study

The Phase 1 OT-book patterns document is one of the most developed findings in the study. The insight that Deuteronomy is the wilderness book, Psalms is the cross book, and Isaiah dominates 3 Nephi is a genuine discovery. Concept B is designed to make that discovery visible at the landing page level, not buried in a pattern description. It treats the OT-book distribution as the organizing frame of the entire site.

---

### Text wireframe

```
┌─────────────────────────────────────────────────────────────────────────┐
│  THE CHOSEN WORD        [Gospels & 3 Nephi] [Doctrine & Covenants] [About] │
└─────────────────────────────────────────────────────────────────────────┘

  Where did Christ go in the Old Testament?
  Each book below is sized by the number of distinct citation occasions.

  ┌─────────────────────────────┐  ┌───────────────┐  ┌───────────────┐
  │                             │  │               │  │               │
  │         ISAIAH              │  │  DEUTERONOMY  │  │    PSALMS     │
  │         14 occasions        │  │  9 occasions  │  │  9 occasions  │
  │         19 entries          │  │  12 entries   │  │  12 entries   │
  │                             │  │               │  │               │
  └─────────────────────────────┘  └───────────────┘  └───────────────┘

  ┌──────────┐ ┌──────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌──────┐
  │  EXODUS  │ │LEVITICUS │ │ DANIEL │ │MALACHI │ │GENESIS │ │HOSEA │
  │ 7 occ.   │ │ 4 occ.   │ │ 2 occ. │ │ 2 occ. │ │ 2 occ. │ │2 occ.│
  └──────────┘ └──────────┘ └────────┘ └────────┘ └────────┘ └──────┘

  ┌────────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
  │ZECHAR. │ │1SAM. │ │MICAH │ │JONAAH│ │ JER. │ │ NUM. │
  │ 1 occ. │ │1 occ.│ │1 occ.│ │1 occ.│ │1 occ.│ │1 occ.│
  └────────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘


─── [Clicking Isaiah opens the within-book view] ──────────────────────────

  Isaiah — 14 occasions, 19 entries

  WILDERNESS     (none — Isaiah appears nowhere in the wilderness accounts)

  HOSTILE        ─────────────────────────────────────────────
    [Isa 29:13 — Lips Heart]  [Isa 6:9–10 — Seeing Unseeing]

  NAZARETH       ─────────────────────────────────────────────
    [Isa 61:1–2 — Spirit Anointed]

  PASSION WEEK   ─────────────────────────────────────────────
    [Isa 56:7 — House Prayer]  [Isa 53:12 — Transgressors Numbered]

  NEPHITE        ─────────────────────────────────────────────
    [Isa 52 — Watchmen Sing] [Isa 52 — Watchmen Lift] [Isa 52 — Awake Zion]
    [Isa 52 — Sold Redeemed] [Isa 52 — Beautiful Mountains] [Isa 52 — Servant High]
    [Isa 52:12 — Haste Rearward] [Isa 54 — Sing Barren (full chapter)]
    [Isa 66:24 — Worm Fire]  [Isa 6:9 — Seeing Understanding]
```

---

## Concept C — "The Moment"

### Memorable concept name
**The Moment** — the catalog is organized not by OT book and not as a flat list, but by the settings and moments of Christ's ministry. The user enters through the scene, not the citation.

### Primary user journey

1. User arrives at the home page and sees a vertical timeline of ministry settings: Wilderness — Galilean Ministry — Passion Week — Cross — Nephite Visit. Each setting is a section header with an entry count.
2. Within each setting, entries appear as compact cards. The Wilderness section has 3 entry cards. The Passion Week section has a long scroll of entries. The Nephite visit has a dense block of Isaiah entries.
3. User sees the Passion Week section and notices the shift from Deuteronomy/Exodus law texts to Psalms and Isaiah — exactly the finding from the audience-patterns file — visible as they scroll.
4. User clicks a card to reach the entry detail page.
5. The entry detail links back to its setting section and to OT book and pattern pages.
6. A persistent filter panel (desktop) or filter drawer (mobile) allows the user to filter within or across settings.

### Information hierarchy

1. Ministry setting — the primary organizing frame, visible as section headers
2. Entry cards within each setting
3. OT book and pattern context — secondary, accessible from within-setting headers and detail pages
4. D&C section — reachable from global nav, structured identically

### Navigation model

- Home page: vertical timeline of settings with cards grouped within each
- Secondary: OT book pages and pattern pages (linked from within-setting context and detail pages)
- Filter panel: narrows within the timeline, or jumps to a specific setting via anchor navigation
- Global nav: site title, Gospels/3 Nephi (active), Doctrine & Covenants, About

### Major page types

- Timeline home — the vertical setting-grouped catalog
- Entry detail
- OT Book page
- Pattern page
- D&C section (parallel structure)
- About page

### Visualization strategy

**Primary:** A vertical chronological/narrative layout where the section headers and the density of cards within each section communicate the distribution of Christ's OT citations across his ministry.

The reader does not need to apply a filter to see the Passion arc finding — they scroll from the Sermon section (dense with Pentateuch law entries) into the Passion Week section (sparse law texts, Psalms emerging) and then the Cross section (Psalms only). The scroll itself is the argument.

**Secondary:** Each setting section header displays a small inline breakdown: "Psalms 4, Isaiah 2, Daniel 1" — a micro-bar chart showing which OT books appear within this setting. No clicks required to see the book distribution per setting.

**What understanding it creates:** The reader experiences the same arc that the audience-patterns analysis describes. The shift from Pentateuch to Psalms/Isaiah is visible as a spatial change in the scroll — not described but felt. This is the only concept that makes the Passion-arc pattern perceptible without requiring the user to navigate to a separate pattern page.

**What misunderstanding it risks:** Presenting entries in a timeline implies a chronological order Christ followed in citing the OT. This is not the catalog's claim. The settings are setting types, not a strict timeline. Matthew and Luke disagree on the order of the wilderness temptations. The UI must make clear that "setting" is not the same as "chronological sequence." A short disclaimer on the home page and careful section header wording ("In the Wilderness," not "First, in the Wilderness") help mitigate this.

### Mobile behavior

- The vertical timeline translates naturally to mobile — it is already a vertical scroll.
- Section headers are sticky so the user always knows which setting they are in.
- The inline OT-book breakdown per section header collapses to a single count on narrow screens: "7 entries" with a tap to expand the book breakdown.
- Filter drawer accessible from a persistent "Filter" button at the top of the page.

### Accessibility considerations

- Each setting section is a `<section>` with a `<h2>` heading.
- Sticky section headers remain in the accessibility tree — they do not use `position: sticky` tricks that remove content from flow.
- The inline OT-book micro chart is supplemented with an accessible text summary: "This section includes entries citing Isaiah, Psalms, and Daniel."
- Skip-to-section navigation: a small "Jump to section" dropdown or anchor list for keyboard users who don't want to scroll through all sections.
- Reduced motion: the sticky headers do not animate. No parallax or scroll-triggered transitions.

### How citations and source context appear

On cards within the timeline: same as Concept A cards — 2-word key, references, type badge, summary.

On the detail page: same as Concepts A and B.

### Strengths

- The primary finding of the study — that Christ's OT citation patterns shift across his ministry — is built into the structure of the home page. The reader discovers it by scrolling, not by reading a pattern description.
- The timeline structure gives the user an orienting frame even before they start filtering. They know where they are in Christ's ministry at all times.
- The density variation across sections (sparse Wilderness, dense Passion Week, very dense Nephite section) is itself informative and honest to the data.

### Trade-offs

- Scrolling through the full home page to find a specific entry is slower than a filtered grid. A user who wants to find "Forsaken Me" must either know it is in the Cross section or use the filter.
- The timeline implies more narrative sequence than the data warrants. Some entries span settings (e.g., the repeated Psalm 118:26 appears in both Galilean ministry and Passion Week). These cross-setting entries do not fit cleanly into one section.
- The Nephite section is a very dense block of Isaiah entries — Christ quotes Isaiah 52 five times in 3 Nephi 20–21. This density may make the Nephite section feel repetitive to a first-time reader.

### Content or technical risks

- Entries with multiple audience settings (e.g., Q-033 — the Cross — is both "Cross" and "Trial" in some readings) must be assigned a primary setting for placement. Secondary settings should be displayed as tags, not as duplicate card placement.
- The visual density of the Nephite section requires careful card design to prevent it feeling like a wall of text.
- The "not a strict timeline" caveat must be persistent and visible, not buried in the About page.

### Why this concept fits this study

The audience-patterns document is the richest pattern file in the study, and its central finding — that Christ's OT choices shift systematically across his ministry settings — is most visible in a setting-organized layout. Concept C is built around that finding. It does not require the user to know about the finding before they arrive; they experience it as they scroll.

---

### Text wireframe

```
┌─────────────────────────────────────────────────────────────────────────┐
│  THE CHOSEN WORD        [Gospels & 3 Nephi] [Doctrine & Covenants] [About] │
└─────────────────────────────────────────────────────────────────────────┘

  The words Christ chose — 91 recorded citations across the Gospels and
  3 Nephi, grouped by the setting in which he spoke them.

  ───────────────────────────────────────────────────────────────────────
  IN THE WILDERNESS                                              3 entries
  Against temptation. Deuteronomy only.
  ───────────────────────────────────────────────────────────────────────

  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
  │ Bread Alone │  │  Tempt Not  │  │ Worship Only│
  │ Matt 4:4    │  │  Matt 4:7   │  │  Matt 4:10  │
  │ Deut 8:3    │  │  Deut 6:16  │  │  Deut 6:13  │
  └─────────────┘  └─────────────┘  └─────────────┘

  ───────────────────────────────────────────────────────────────────────
  IN PUBLIC TEACHING — SERMON ON THE MOUNT                      12 entries
  Pentateuch law as the "before" state. No Psalms, no Isaiah.
  Exodus 6 · Leviticus 3 · Deuteronomy 2 · Numbers 1
  ───────────────────────────────────────────────────────────────────────

  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
  │  Kill Not   │  │ Commit Not  │  │  Eye Tooth  │  │Love Neighbor│
  │ Matt 5:21   │  │  Matt 5:27  │  │  Matt 5:38  │  │  Matt 5:43  │
  │ Exod 20:13  │  │  Exod 20:14 │  │  Exod 21:24 │  │  Lev 19:18  │
  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
  ... [8 more]

  ───────────────────────────────────────────────────────────────────────
  AGAINST HOSTILE QUESTIONERS                                   38 entries
  The widest variety of OT sources. "Have ye not read?"
  Isaiah 5 · Psalms 5 · Exodus 5 · Deuteronomy 4 · Hosea 2 · ...
  ───────────────────────────────────────────────────────────────────────
  ... [cards]

  ───────────────────────────────────────────────────────────────────────
  WITH PRIVATE DISCIPLES                                        14 entries
  Daniel and Zechariah appear only here. Isaiah for parables.
  Daniel 2 · Isaiah 3 · Zechariah 2 · Deuteronomy 2 · ...
  ───────────────────────────────────────────────────────────────────────
  ... [cards]

  ───────────────────────────────────────────────────────────────────────
  PASSION WEEK — TEMPLE COURTS                                  12 entries
  Isaiah and Psalms take over. No Pentateuch law texts.
  Psalms 6 · Isaiah 4 · Jeremiah 1 (composite) ...
  ───────────────────────────────────────────────────────────────────────
  ... [cards]

  ───────────────────────────────────────────────────────────────────────
  LAST SUPPER AND GETHSEMANE                                     5 entries
  Zechariah, Isaiah, Psalms — personal and predictive.
  ───────────────────────────────────────────────────────────────────────
  ... [cards]

  ───────────────────────────────────────────────────────────────────────
  TRIAL AND CROSS                                                4 entries
  Psalms only. The last words are both Psalms, addressed to the Father.
  ───────────────────────────────────────────────────────────────────────

  ┌─────────────────┐  ┌─────────────┐  ┌───────────────┐  ┌────────────┐
  │  Power Coming   │  │ Right Hand  │  │  Forsaken Me  │  │Father Hands│
  │  Matt 26:64     │  │  Mark 14:62 │  │  Matt 27:46   │  │ Luke 23:46 │
  │  Dan 7:13+Ps110 │  │  Dan 7:13   │  │  Ps 22:1      │  │ Ps 31:5    │
  └─────────────────┘  └─────────────┘  └───────────────┘  └────────────┘

  ───────────────────────────────────────────────────────────────────────
  THE NEPHITE VISIT — 3 NEPHI                                   20 entries
  Sermon at Bountiful mirrors Galilee. Then: Isaiah fills the record.
  Isaiah 10 · Malachi 3 · Micah 2 · Deuteronomy 1 · Genesis 1 ...
  ───────────────────────────────────────────────────────────────────────
  ... [cards]
```

---

## Concept D — "The Thread" (fourth option)

This concept emerged directly from the repeated-passages data. No other concept makes RP-001 through RP-026 the primary organizing structure.

### Memorable concept name
**The Thread** — the catalog is organized around the OT passages Christ returned to more than once. The repeated passages are the front door. Everything else is reachable from them.

### Primary user journey

1. User arrives at the home page and sees a ranked list of repeated passages — starting with Lev 19:18 (P1 — 4 distinct occasions) and working down through P2, P3, and P4 groups.
2. A brief framing sentence: "These are the scriptures Christ cited more than once — across different audiences, ministries, and years."
3. User clicks "Love your neighbor" (Lev 19:18) and reaches a comparison page that shows all four occasions side by side: the Galilean Sermon, Bountiful, the Lawyer's question, the Rich Ruler. Each is a card with the scripture text. A short observation beneath them notes what the repetition reveals.
4. User sees the full catalog via a secondary "Browse all entries" link or via filters on the repeated-passage page.
5. From any entry detail page, the user can see whether that entry is part of a repeated-passage group.

### Information hierarchy

1. Repeated passage groups — the primary surface
2. The comparison view per group — the analytical payoff
3. The full catalog — secondary, accessible from a persistent link
4. OT book and pattern pages — tertiary

### Navigation model

- Home: ranked list of repeated passage groups
- Second level: comparison view for one repeated passage (all occasions side by side)
- Third level: entry detail for a single occasion
- "Browse all 91 entries" link leads to the Concept A-style catalog
- Global nav: site title, Gospels/3 Nephi (active), Doctrine & Covenants, About

### Major page types

- Repeated passages home (landing)
- Comparison view (per RP group)
- Full catalog (secondary — linked from home and nav)
- Entry detail
- D&C section
- About

### Visualization strategy

**Primary:** A side-by-side comparison layout for repeated passage occasions. For Lev 19:18 (4 occasions), a 4-column or 2x2 grid shows each occasion as a text panel with the scripture quote, reference, audience, and a brief note. The layout is designed to make comparison the default activity.

**Secondary:** A priority indicator for each RP group (P1 = 4 distinct occasions, P2 = 2–3, etc.) communicates the intensity of Christ's return to that passage.

**What understanding it creates:** The reader's first experience is the most analytically significant finding in the study: that Lev 19:18 is the passage Christ cited most across distinct settings, and that Hos 6:6 is the only passage he returned to twice within a single Gospel in two different disputes. This is the "so what?" of the catalog made into the front door.

**What misunderstanding it risks:** The repeated-passages front door may give the impression that non-repeated passages are less important. A visitor looking for "Forsaken Me" (Q-033 — a single cross citation) may feel it is buried. The "Browse all 91 entries" link and a clear explanation that most single occasions are profoundly significant mitigate this.

### Mobile behavior

- The side-by-side comparison collapses to a vertical stack of occasion panels on mobile.
- The P1/P2/P3/P4 label serves as a touch-friendly priority indicator.
- The full catalog browse is accessible from a prominent button.

### Accessibility considerations

- Comparison panels are distinct `<article>` elements with `<h3>` headings identifying each occasion.
- The priority labels (P1, P2, etc.) include an accessible expanded text: "Cited on 4 distinct occasions" rather than just "P1."
- Color coding for priority levels uses shape or text distinctions in addition to color.

### How citations and source context appear

On the comparison view: each panel shows the scripture text of that specific occasion (the NT/3Ne text) with its OT source reference. Full text is visible without clicking through — comparison is the point.

On the entry detail: same as other concepts.

### Strengths

- The most analytically focused concept. It leads with the study's most distinctive finding.
- Side-by-side comparison of the same OT passage in different settings is not available in any other concept without custom filtering.
- Well suited to Chase's personal study use case — he has done the work of identifying repeated passages, and this concept lets him see the fruit of that work immediately.

### Trade-offs

- The repeated-passages landing page is a significant editorial choice: it implies that repetition is the primary frame of the catalog. Visitors interested in a specific entry (e.g., the Isaiah 61 Nazareth reading — Q-052 — which is not a repeated passage) have a more indirect path.
- The comparison view is most useful for P1 and P2 groups. P3 and P4 groups (parallel Gospel accounts of the same event) are less interesting to compare and may clutter the landing page.
- Of the 27 RP groups, only about 13 (P1 + P2) represent genuinely distinct occasions. The P3 and P4 entries may need to be visually distinguished or placed on a secondary page to avoid overstating the significance of parallel Gospel accounts.

### Content or technical risks

- The comparison view requires scripture text for every occasion in every RP group. If any entry's `church_scripture_text_nt` is missing, the comparison panel will be incomplete.
- Maintaining the comparison layout for groups with 4+ occasions (Lev 19:18 has 7 catalog entries across 4 occasions) requires careful layout decisions.

### Why this concept fits this study

The repeated-passages analysis is the most developed and distinctive product of Phase 1. No publicly available scripture study tool presents a catalog of Christ's OT citations organized by his deliberate returns to the same passages. Concept D foregrounds that finding and makes the comparison the primary activity. It is the most original concept of the four and the most directly aligned with the analytical depth of the study.

---

### Text wireframe

```
┌─────────────────────────────────────────────────────────────────────────┐
│  THE CHOSEN WORD        [Gospels & 3 Nephi] [Doctrine & Covenants] [About] │
└─────────────────────────────────────────────────────────────────────────┘

  These are the scriptures Christ returned to.
  27 OT passages appear more than once in the catalog — across different
  audiences, settings, and even separate ministries.

  ── P1 — Cited on 4 distinct occasions ────────────────────────────────

  ┌───────────────────────────────────────────────────────────────────┐
  │ Love your neighbor · Lev 19:18                                    │
  │ "Thou shalt love thy neighbour as thyself."                       │
  │                                                                    │
  │ Galilee, Sermon  │  Bountiful, Sermon  │  Jerusalem, Lawyer  │  Judea, Rich Ruler │
  │ Matt 5:43        │  3 Ne 12:43         │  Matt 22:39          │  Matt 19:19        │
  │ [View comparison →]                                               │
  └───────────────────────────────────────────────────────────────────┘

  ── P2 — Cited on 2–3 distinct occasions ──────────────────────────────

  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
  │ Mercy, Not       │ │  Sit at My Right │ │  Son of Man      │
  │ Sacrifice        │ │  Hand            │ │  in Clouds       │
  │ Hos 6:6          │ │  Ps 110:1        │ │  Dan 7:13        │
  │ 2 occasions      │ │  2 occasions     │ │  2 occasions     │
  │ Both in Matthew  │ │  Temple + Trial  │ │  Olivet + Trial  │
  │ [Compare →]      │ │  [Compare →]     │ │  [Compare →]     │
  └──────────────────┘ └──────────────────┘ └──────────────────┘

  ── Browse all 91 entries ─────────────────────────────────────────────

  [Browse the full catalog →]   [Filter by OT book, audience, citation type]
```

---

## Comparison Summary

| | A — The Catalog | B — The Source Map | C — The Moment | D — The Thread |
|---|---|---|---|---|
| Front door | Flat filterable card grid | OT book tile map | Ministry settings timeline | Repeated passages ranked list |
| Primary discovery path | Filter → card → detail | OT book → setting group → detail | Scroll timeline → card → detail | RP group → comparison → detail |
| Shows Passion arc? | Only if user filters | Partially (setting swimlanes) | Yes — built into the scroll | No (unless user navigates to patterns) |
| Shows book frequency? | Via filter count labels | Yes — tile sizes communicate it | Via per-section book breakdown | No |
| Shows repetition? | Via RP badges on cards | No | Via RP badges on cards | Yes — it is the front door |
| Most useful for | Fast search / filter | Book-level exploration | Following Christ's ministry arc | Analytical comparison of repetitions |
| Complexity | Low | Medium | Medium | Medium-High (comparison view) |
| Mobile suitability | High | Medium (tiles need redesign) | High (vertical scroll) | High |

---

## Recommendation

**Concept C (The Moment) with elements from Concept A** is the strongest fit for this study.

The core analytical finding of Phase 1 is the audience-pattern arc: Christ's OT choices shift from Pentateuch law texts in the Sermon, to Hosea and broad OT in disputes, to Psalms and Isaiah in the final hours, to massive Isaiah in 3 Nephi. Concept C makes that arc the structure of the site. The visitor discovers the pattern by scrolling — it requires no prior knowledge, no filter selection, no navigation to a pattern page. It is built in.

Adding the filter panel from Concept A (on the right as a collapsible drawer) gives power users the fast search capability without making the filter the primary surface.

**From Concept B:** The within-setting OT book frequency breakdown (the per-section micro-bar) should be adopted. It communicates "Psalms 6 · Isaiah 4" at a glance within each section header, adding the book-frequency insight without a separate OT book home page.

**From Concept D:** The comparison view for P1 and P2 repeated passages should be adopted as a secondary feature — a "See this passage across occasions" link on entry detail pages that shows the same OT text in its other settings side by side. It does not need to be the home page, but it should exist somewhere.

The risk to manage for Concept C is the false-timeline impression. The section headers must use setting labels ("Against Hostile Questioners," not "Week 12 of the Ministry"). A short note at the top of the page clarifies that the sections represent types of setting, not strict chronological order.

This recommendation is for discussion at Gate 2. Chase should choose the concept that best fits how he personally studies and wants others to experience the material.

# The Chosen Word — Accessibility Plan

**Status:** Draft — Phase 2
**Last updated:** 2026-10-22

---

## 1. Targets and Standards

- **WCAG 2.1 Level AA** — the minimum target. Aim for AA throughout; document any AA exceptions and the reason.
- **Color contrast:** 4.5:1 minimum for normal text; 3:1 minimum for large text (18px bold or 24px regular) and UI components such as input borders and focus rings.
- **Keyboard accessibility:** every user action achievable by mouse must also be achievable by keyboard alone.
- **Screen reader compatibility:** tested against VoiceOver on macOS/iOS and NVDA on Windows as the primary targets. JAWS compatibility considered but not a required test target for v1.
- **Reduced motion:** all transitions and animations must be suppressible via `prefers-reduced-motion: reduce`.
- **Touch targets:** minimum 44x44 CSS pixels on interactive elements for mobile (WCAG 2.5.5 AAA guideline, used as a practical target).

---

## 2. Semantic HTML Requirements

### 2a. Page structure

Every page must use a predictable landmark structure:

```html
<header role="banner">          <!-- site navigation -->
<main>                          <!-- primary content -->
<footer>                        <!-- site footer -->
```

Skip navigation link at the top of every page:
```html
<a href="#main-content" class="skip-link">Skip to main content</a>
```

The skip link is visually hidden by default and becomes visible on focus (not `display:none` — that removes it from tab order).

### 2b. Heading hierarchy

Each page has exactly one `<h1>`. Section headings use `<h2>`. Subsection headings within sections use `<h3>`. No heading levels skipped. No headings used for styling purposes.

- Home page `<h1>`: "The Chosen Word" or the page's primary label (e.g., "Gospels and 3 Nephi — 91 entries")
- Detail page `<h1>`: the 2-word key (e.g., "Bread Alone")
- OT Book page `<h1>`: the book name (e.g., "Isaiah")
- Pattern page `<h1>`: the pattern name

### 2c. Filter checkboxes

Filter groups are `<fieldset>` elements with a `<legend>` that names the filter axis:

```html
<fieldset>
  <legend>OT Book</legend>
  <label><input type="checkbox" value="ISA"> Isaiah (19)</label>
  <label><input type="checkbox" value="DEUT"> Deuteronomy (12)</label>
  ...
</fieldset>
```

Do not use `<div>` elements styled as checkboxes. Use real `<input type="checkbox">` elements.

### 2d. Entry cards

Each card in the catalog is an `<article>` or an `<li>` within a `<ul>`. The primary action (navigating to the detail page) is the card's `<a>` tag wrapping the card content or a clearly labeled link within the card.

Avoid nested interactive elements — do not put a button inside a `<a>` tag. If a card has a secondary action (e.g., "add to study list"), place it after the primary link in the DOM.

Accessible name for each card link must include meaningful context:
```html
<a href="/entry/q-001/" aria-label="Bread Alone — Matthew 4:4, Deuteronomy 8:3">
```

Or use `aria-labelledby` referencing the card's heading.

### 2e. Active filter chips

Each active filter chip has a `<button>` inside it for removal:
```html
<li class="filter-chip">
  Isaiah
  <button type="button" aria-label="Remove filter: Isaiah">×</button>
</li>
```

The chip list is a `<ul aria-label="Active filters">`. If no filters are active, the list is hidden or replaced with a "No filters applied" message (or the list is empty and screen readers skip it naturally).

### 2f. Status announcements

When filters are applied and the result count changes, announce the new count to screen readers using a live region:

```html
<div role="status" aria-live="polite" aria-atomic="true" class="sr-only">
  Showing 19 of 91 entries
</div>
```

The `role="status"` region is always present in the DOM. Its text content updates when the filter result changes. This avoids focus disruption while still announcing the change.

### 2g. Scripture text

Scripture text displayed in the entry detail page should use `<blockquote>` when the text is a quotation from an external source (the scriptures). Include a `<cite>` element or a caption identifying the reference:

```html
<figure>
  <blockquote>
    <p>Man shall not live by bread alone, but by every word that proceedeth
    out of the mouth of God.</p>
  </blockquote>
  <figcaption>Matthew 4:4</figcaption>
</figure>
```

### 2h. External links

All links to churchofjesuschrist.org and the ESV site must include `rel="noopener noreferrer"` and `target="_blank"`. They must also include an accessible label indicating they open in a new tab:

```html
<a href="..." target="_blank" rel="noopener noreferrer"
   aria-label="Read Matthew 4:4 in context on Church website (opens in new tab)">
  Read in context →
</a>
```

Or use a visually hidden span:
```html
<a href="..." target="_blank" rel="noopener noreferrer">
  Read in context
  <span class="sr-only">(opens in new tab)</span>
</a>
```

---

## 3. Keyboard Navigation

### 3a. Tab order

The tab order must follow the visual reading order. Focus must never disappear (trapped or lost to an invisible element).

- Skip link is the first tabbable element.
- Global nav links follow.
- Filter panel (if persistent sidebar) receives focus before the result list.
- Result list cards are tabbable in visual order.
- Within a card, the primary link is the only tabbable element unless there is a secondary action.

### 3b. Filter panel keyboard behavior

On desktop (persistent sidebar): the filter panel is always visible. Tab navigates through filter checkboxes in document order. No special keyboard management needed.

On mobile (bottom sheet drawer): when the drawer opens, focus moves to the first focusable element inside it (the "Close" button or the first filter checkbox). Tab is trapped within the drawer while it is open. When the drawer closes, focus returns to the "Filter" button that opened it.

This pattern follows the ARIA modal dialog pattern without requiring `role="dialog"` — the drawer is not a dialog, but a disclosed panel. Use `aria-expanded` on the trigger button and `aria-hidden` on the drawer when closed.

### 3c. Pattern shortcut chips

Pattern shortcut chips (horizontal scroll row in Concept A and C) are `<button>` elements or `<a>` elements depending on whether they navigate or filter. If they activate a filter combination, use `<button type="button">` with `aria-pressed` state. If they navigate to a separate page, use `<a>`.

Horizontal scroll row: keyboard users must be able to scroll through the chips with arrow keys. This requires either `role="tablist"` + `aria-orientation="horizontal"` + arrow key handling, or simply ensuring all chips are individually tabbable (which works but may result in many tab stops). Preferred: individual tab stops are simpler and more robust than a custom roving tabindex.

### 3d. Entry detail navigation

"Back to catalog" is the first `<a>` in `<main>` on the detail page. "Related entries" links appear after the main content in the DOM. "Previous / Next entry" (if implemented) is placed after the related entries.

### 3e. Focus styles

Focus rings must be visible in all states. Do not use `outline: none` without providing a custom focus style that meets 3:1 contrast against the adjacent background.

Recommended approach: use `:focus-visible` to provide a clear focus ring only for keyboard navigation, not for mouse clicks:
```css
:focus-visible {
  outline: 2px solid var(--focus-ring-color);
  outline-offset: 2px;
}
```

The focus ring color must contrast at least 3:1 against the surrounding surface.

---

## 4. Color and Contrast

### 4a. Palette targets

The color scheme is light by default (see design direction for the full palette). Contrast requirements:

| Use | Minimum ratio | Notes |
|-----|--------------|-------|
| Body text on background | 4.5:1 | AA for normal text |
| Large headings (≥24px or ≥18.67px bold) | 3:1 | AA large text |
| UI component boundaries (input borders, card borders) | 3:1 | AA non-text |
| Focus rings | 3:1 against adjacent colors | AA non-text |
| Badge text on badge background | 4.5:1 | Badges are small, treat as normal text |
| Muted / secondary text (metadata, captions) | 4.5:1 | Do not use gray text that fails contrast to "look subtle" |
| Disabled state (if any) | No requirement — but prefer to avoid visually confusing disabled states |

### 4b. Color-only communication

No information must be communicated by color alone. Examples:

- Confidence levels: the "Tentative" label uses text + a small icon (a circle or a small symbol), not only a color change.
- Citation type badges: use text labels, not only color-coded dots.
- Active filter chips: use both a border/background change and an "×" icon to indicate they are active and removable.
- The OT book tile sizes in Concept B communicate frequency by size and text, not only color.

### 4c. Dark mode

If dark mode is supported (`prefers-color-scheme: dark`), contrast requirements apply equally. Do not assume that lighter text on a dark background automatically passes — verify each combination. The scripture-atlas palette is dark-primary; The Chosen Word targets a light-primary palette with a dark mode option. The dark mode palette must be specified in `design-direction.md` and tested for contrast.

---

## 5. Reduced Motion

All transitions and animations must respect `prefers-reduced-motion: reduce`.

Affected interactions to plan for:

- Filter application: the card list updates — no animated fade or reflow transition under reduced motion. Items appear/disappear immediately.
- Bottom sheet drawer: opens and closes immediately (no slide animation).
- Sticky section headers (Concept C): no parallax or scroll-driven transitions. Section headers are simply sticky — no motion involved.
- Card hover states: subtle scale or shadow effects on hover must be removed or replaced with a color change under reduced motion.
- The "reveal on scroll" animation used in scripture-atlas (`IntersectionObserver` + `.show` class) must not be used here without a `prefers-reduced-motion` gate.

Implementation:
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

---

## 6. Mobile Touch Targets

Minimum touch target size: 44x44 CSS pixels for any interactive element.

Elements to check:
- Filter checkboxes: the `<label>` extends the touch target to at least 44px height.
- Filter chip "remove" buttons: explicitly sized to at least 44x44px.
- Pattern shortcut chips: minimum height 44px.
- Card links: cards should be tall enough that the tap target is comfortable (cards with multiple lines of text will naturally meet this).
- Nav links: at least 44px height in the global nav.
- "Read in context" links on detail pages: minimum 44px height.

---

## 7. Screen Reader Behavior — Key Scenarios

### Scenario 1: Filtering the catalog

1. User arrives. Screen reader announces the page title and landmark regions.
2. User navigates to the filter panel (`<fieldset>` groups).
3. User checks "Isaiah." The `role="status"` region announces "Showing 19 of 91 entries."
4. User navigates to the card list. Cards are announced as links with their accessible names.
5. User activates a card link and navigates to the detail page.

### Scenario 2: Reading an entry detail

1. Screen reader announces the `<h1>` (2-word key) and page title.
2. Navigating by heading: `<h2>` sections for "NT Scripture Text," "OT Source," "Citation Type," "Study Notes," "Connections," "Related Entries."
3. Scripture text is inside `<blockquote>` with a `<figcaption>`. Screen reader announces the citation.
4. External links announce the destination context and "opens in new tab."

### Scenario 3: Mobile filter drawer

1. User taps "Filter" button. Drawer opens. Focus moves to first element inside drawer (per keyboard §3b).
2. User navigates filter checkboxes by swiping or using swipe-to-select gestures.
3. User closes drawer. Focus returns to "Filter" button. `role="status"` announces updated count.

---

## 8. Testing Plan

Before each review round, run the following:

| Check | Method |
|-------|--------|
| Color contrast | Use browser DevTools contrast checker and axe extension |
| Keyboard navigation — full tab-through | Manual: keyboard only, no mouse |
| Screen reader — catalog, filter, detail | VoiceOver on Safari (macOS) |
| Screen reader — mobile | VoiceOver on iOS |
| Reduced motion | Set `prefers-reduced-motion: reduce` in browser and verify |
| Touch targets | DevTools mobile emulation; measure touch target sizes |
| Heading hierarchy | Accessibility tree in DevTools or axe extension |
| Skip link | Tab once from page load; verify skip link is visible and functional |
| Focus management — drawers and modals | Keyboard only — open and close every overlay |
| ARIA live region | Apply a filter and verify screen reader announces the count change |

---

## 9. Open Accessibility Questions

- **OQ-A11Y-1:** If a comparison view (Concept D's side-by-side layout) is adopted, the multi-column layout needs careful heading and ARIA annotation to be usable with a screen reader that linearizes content. A column-per-occasion layout would read as disconnected fragments without `aria-describedby` or explicit column headings. This needs to be designed at the component level.
- **OQ-A11Y-2:** The proportional OT-book tiles in Concept B communicate frequency visually. This needs testing with a screen reader to confirm the text content (name + count) fully conveys the same information as the visual size difference.
- **OQ-A11Y-3:** Citation type badges use short labels ("Direct quotation," "Close allusion"). These are clear for sighted users but should be tested with a screen reader in context — reading "Bread Alone · Matt 4:4 · Deut 8:3 · Direct quotation" should parse naturally.

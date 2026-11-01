# The Chosen Word — Content Model

**Status:** Approved — Gate 2
**Last updated:** 2026-10-22

---

## 1. Design Principles for the Data Model

- IDs must be stable across site builds. Do not use array indices as IDs.
- Scripture text is the primary content. All other fields exist to help a reader understand and navigate that text.
- Relationships are bidirectional where possible so any page can discover its related content without scanning the full catalog.
- The D&C section is a first-class segment of the catalog, not an afterthought. Its entries share the same field schema as Gospel/3 Nephi entries but carry a `segment` discriminator so the site can display and route them separately.
- Confidence is recorded as a fact, not suppressed. How it is displayed is a design decision handled in the UI layer.

---

## 2. Entity Types and Stable IDs

### 2a. Quotation Entry (primary record)

Every row in the catalog is a Quotation Entry. It is the unit of everything: the card, the detail page, the filter result.

**ID format:** `Q-001` through `Q-092` (Gospels / 3 Nephi) and `DC-001` through `DC-017` (Doctrine and Covenants).

**Segment discriminator:** `"gospels-3ne"` or `"dc"`. Controls which section of the site the entry appears in.

**Fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | Stable ID: `Q-001`, `DC-001`, etc. |
| `segment` | enum | `"gospels-3ne"` or `"dc"` |
| `nt_bom_ref` | string | The NT, 3 Ne, or D&C reference (e.g., `"Matt 4:4"`) |
| `ot_source_refs` | string[] | One or more OT references (e.g., `["Deut 8:3"]`) |
| `ot_book_ids` | string[] | Normalized OT book IDs (e.g., `["DEUT"]`) — for filtering |
| `citation_type` | enum | See §2d |
| `audience_setting_ids` | string[] | References to AudienceSetting records (§2e) |
| `key_words` | string | The 2-word key (e.g., `"Bread Alone"`) |
| `summary` | string | 1–2 sentence summary |
| `church_scripture_text_nt` | string | NT/3Ne/D&C scripture text (Church source) |
| `church_scripture_text_ot` | string | OT source text (Church source) |
| `church_url_nt` | string | Canonical URL to the NT/3Ne/D&C verse on churchofjesuschrist.org |
| `church_url_ot` | string | Canonical URL to the OT source verse on churchofjesuschrist.org |
| `esv_link_url` | string | Outbound link to ESV for NT verse (no ESV text stored) |
| `esv_ot_link_url` | string | Outbound link to ESV for OT source (no ESV text stored) |
| `study_questions` | string[] | The answered study questions from research notes |
| `source_ids` | string[] | References to Source records (§2g) |
| `repeated_passage_ids` | string[] | References to RepeatedPassage group records (§2f), if any |
| `pattern_ids` | string[] | References to Pattern records (§2h), if any |
| `citation_mode` | enum | `"corrective_teaching"`, `"self_identification"`, `"lament"`, `"composite"` — see §2j |
| `confidence` | enum | `"high"`, `"supported"`, `"tentative"` |
| `notes` | string | Research notes and verification flags |
| `publication_status` | enum | `"draft"`, `"reviewed"`, `"approved"` |

---

### 2b. OT Book

Used as filter facets. Not a page type in itself, but supports the "filter by OT book" axis and the OT Book visualization.

**ID format:** Uppercase abbreviation — `ISA`, `DEUT`, `PSA`, `EXOD`, `LEV`, `DAN`, `GEN`, `MAL`, `HOS`, `ZECH`, `MIC`, `1SAM`, `JONAH`, `JER`, `NUM`, `1KGS`, `2KGS`, `EZEK`, `JOEL`.

**Fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | e.g., `"ISA"` |
| `name` | string | e.g., `"Isaiah"` |
| `abbreviation` | string | Display form: `"Isa."` |
| `testament` | enum | `"ot"` |
| `unique_occasions` | number | Derived statistic: distinct citation occasions |
| `entry_ids` | string[] | All quotation entry IDs that cite this book |

---

### 2c. Gospel Source (the NT/BoM/D&C book where the citation appears)

Used as filter facets.

**ID format:** `MAT`, `MRK`, `LUK`, `JHN`, `3NE`, `DC`

**Fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | e.g., `"MAT"` |
| `name` | string | e.g., `"Matthew"` |
| `segment` | enum | `"gospels-3ne"` or `"dc"` |
| `sort_order` | number | For consistent UI ordering |
| `entry_ids` | string[] | All quotation entry IDs from this source book |

---

### 2d. Citation Type

An enum, not a separate record. Used as a filter axis and displayed on entry cards.

| Value | Display Label |
|-------|--------------|
| `"direct-quotation"` | Direct quotation |
| `"paraphrase-formula"` | Paraphrase with citation formula |
| `"close-allusion"` | Close verbal allusion |
| `"explicit-citation"` | Explicit citation (names OT author or book) |
| `"full-chapter"` | Full chapter quotation |

A single entry may carry more than one type (e.g., `"direct-quotation"` + `"explicit-citation"`). The field is therefore `string[]`, not a single value.

---

### 2e. Audience / Setting

Used as a filter axis. Each AudienceSetting record represents a meaningful context category — not a raw audience label.

**ID format:** `AUD-WILDERNESS`, `AUD-HOSTILE`, `AUD-SERMON`, `AUD-CROWD`, `AUD-DISCIPLES`, `AUD-PASSION`, `AUD-LAST-SUPPER`, `AUD-TRIAL`, `AUD-CROSS`, `AUD-NEPHITE`, `AUD-DC`

**Fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | e.g., `"AUD-HOSTILE"` |
| `label` | string | Display name: `"Hostile questioners"` |
| `description` | string | 1–2 sentence explanation for UI tooltip |
| `entry_ids` | string[] | All quotation entry IDs in this setting |

---

### 2f. Repeated Passage Group

Groups quotation entries that share the same OT source across distinct citation occasions. Corresponds to the RP-001 through RP-026 records in `study/patterns/repeated-passages.md`.

**ID format:** `RP-001` through `RP-026`

**Fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | e.g., `"RP-001"` |
| `ot_ref` | string | Human-readable OT reference: `"Lev 19:18"` |
| `ot_book_id` | string | e.g., `"LEV"` |
| `key_words` | string | 2-word label for the group: `"Love Neighbor"` |
| `priority` | enum | `"P1"`, `"P2"`, `"P3"`, `"P4"` |
| `distinct_occasions` | number | Number of genuinely separate citation occasions |
| `entry_ids` | string[] | All quotation entry IDs in this group |
| `observation` | string | The research observation about this repetition |
| `open_questions` | string[] | Questions flagged for future study |

---

### 2g. Source

Corresponds to the SRC-xxxx records in `study/sources.md`. Referenced by quotation entries to keep claims traceable.

**ID format:** `SRC-0001`, `SRC-0002`, etc.

**Fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | e.g., `"SRC-0001"` |
| `title` | string | |
| `author` | string | |
| `publisher` | string | |
| `canonical_url` | string | |
| `domain` | string | e.g., `"churchofjesuschrist.org"` |
| `source_type` | string | e.g., `"scripture"`, `"general-conference"`, `"institute-manual"` |
| `publication_date` | string | If stated |
| `date_accessed` | string | ISO date |
| `approval_status` | enum | `"approved"`, `"pending"`, `"rejected"` |
| `quotation_limits` | string | Any copyright/permissions notes |

---

### 2h. Pattern

Records the thematic and structural patterns identified in the audience-patterns and ot-book-patterns files. These are distinct from RepeatedPassage groups (which are purely about the same OT text appearing multiple times). Patterns describe behaviors, rhetorical strategies, and contextual observations.

**ID format:** `PAT-001` through `PAT-00n`

| PAT ID | Pattern Name |
|--------|-------------|
| `PAT-001` | Wilderness — Deuteronomy exclusively |
| `PAT-002` | Hostile questioners — meeting them in their own texts |
| `PAT-003` | Sermon — Pentateuch only, no prophetic books |
| `PAT-004` | Private disciples — Daniel and Zechariah appear only here |
| `PAT-005` | Passion arc — shift from law texts to Psalms and Isaiah |
| `PAT-006` | Nephite discourse — Isaiah saturation |
| `PAT-007` | Hosea as Pharisee-specific diagnostic (Matthew only) |
| `PAT-008` | Cross citations — Psalms only, addressed to the Father |
| `PAT-009` | Three citation modes: corrective teaching, self-identification, lament |

**Fields:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | e.g., `"PAT-001"` |
| `name` | string | Short name |
| `description` | string | The observation and supporting evidence |
| `entry_ids` | string[] | Quotation entries that participate in this pattern |
| `strength` | enum | `"tentative"`, `"supported"`, `"strong"` |
| `open_questions` | string[] | Unresolved questions about this pattern |

---

### 2i. Annotation

Free-form notes attached to a quotation entry that are labeled by type. Used for flagged verification concerns, pending decisions, and future study notes.

**Fields:**

| Field | Type | Notes |
|-------|------|-------|
| `entry_id` | string | Parent quotation entry |
| `annotation_type` | enum | `"verification-note"`, `"interpretation-caution"`, `"future-loop"`, `"confidence-note"` |
| `text` | string | The annotation text |
| `author` | string | Who wrote it: `"study-agent"` or `"chase"` |
| `date` | string | ISO date |

---

### 2j. Citation Mode

An enum field on the Quotation Entry. Added at Gate 2 based on the three citation-mode taxonomy identified in PAT-009 and approved as a filter axis in `design-direction.md §15`.

A single entry carries exactly one `citation_mode` value. Use `"composite"` when an entry genuinely blends modes or resists clean classification — do not force a primary-mode assignment that would mislead.

| Value | Display label | Definition |
|-------|--------------|-----------|
| `"corrective_teaching"` | Corrective teaching | Christ cites the OT to reframe, fulfill, or correct a misunderstanding — often in a dispute or teaching moment where the text is common ground between Christ and his audience. |
| `"self_identification"` | Self-identification | Christ cites the OT to describe who he is, what he is doing, or why he has come — using scripture as a lens for his own identity and mission. |
| `"lament"` | Lament | Christ cites the OT to voice sorrow, abandonment, or suffering — most starkly in the cross citations from the Psalms. |
| `"composite"` | Composite | The entry blends more than one mode, or the citation does not fit cleanly into the other three categories. Retained to avoid forcing a classification that would mislead. |

**Tooltip text for the UI** (from `design-direction.md §15`):
- Corrective teaching: "Christ cites the Old Testament to reframe, fulfill, or correct a misunderstanding — often in a dispute or a teaching moment where the text is the common ground."
- Self-identification: "Christ cites the Old Testament to describe who he is, what he is doing, or why he has come — using scripture as a lens through which to read his own identity and mission."
- Lament: "Christ cites the Old Testament to voice profound sorrow, abandonment, or suffering — most starkly in the cross citations from the Psalms."
- Composite: "This entry blends more than one mode, or the citation does not fit cleanly into the other three categories; it is retained to avoid forcing a classification that would mislead."

---

## 3. Relationships Summary

```
QuotationEntry
  → OtBook (via ot_book_ids)             [many-to-many]
  → GospelSource (derived from nt_bom_ref)  [many-to-one]
  → AudienceSetting (via audience_setting_ids) [many-to-many]
  → RepeatedPassageGroup (via repeated_passage_ids) [many-to-many]
  → Pattern (via pattern_ids)            [many-to-many]
  → Source (via source_ids)              [many-to-many]
  → Annotation (via entry_id on annotation) [one-to-many]

RepeatedPassageGroup
  → OtBook (via ot_book_id)              [many-to-one]
  → QuotationEntry (via entry_ids)       [one-to-many]

Pattern
  → QuotationEntry (via entry_ids)       [one-to-many]

OtBook
  → QuotationEntry (via entry_ids)       [one-to-many]

AudienceSetting
  → QuotationEntry (via entry_ids)       [one-to-many]
```

---

## 4. Data Storage Format

All content is stored in a single `data/catalog.json` file at build time, structured as:

```json
{
  "quotations": [ ... ],
  "ot_books": [ ... ],
  "gospel_sources": [ ... ],
  "audience_settings": [ ... ],
  "repeated_passage_groups": [ ... ],
  "patterns": [ ... ],
  "sources": [ ... ]
}
```

Annotations are stored in a separate `data/annotations.json` for clarity.

The data files are the single source of truth. The application reads them at build time or runtime and never hard-codes content into HTML.

---

## 5. D&C-Specific Considerations

D&C entries share the same schema as Gospel/3 Nephi entries with the following differences:

- `segment` is always `"dc"`
- `audience_setting_ids` always includes `"AUD-DC"` and describes the revelation context rather than a physical audience
- Confidence values are meaningful for D&C: five entries are `"tentative"`, the rest `"supported"` or `"high"`
- The `notes` field on D&C entries carries speaker-attribution reasoning (section heading + first-person pronouns)

---

## 6. ESV Policy in the Data Model

No ESV scripture text is stored in any data field. The fields `esv_link_url` and `esv_ot_link_url` hold outbound URLs only. If these fields are absent or empty, the UI omits the ESV link silently — no broken UI state.

---

## 7. Open Data Questions

- **OQ-DATA-1:** Should `church_scripture_text_nt` and `church_scripture_text_ot` be full verse text stored in the data file, or should they be fetched at build time from churchofjesuschrist.org? Storing them locally is simpler and avoids external dependencies; it also requires manual updates if Church text changes. Recommendation: store locally, note the date of verification.
- **OQ-DATA-2:** For entries with composite OT sources (e.g., Q-022 cites both Isa 56:7 and Jer 7:11), `ot_source_refs` will hold two values and `ot_book_ids` will hold two IDs. The UI should handle the display gracefully. No invented merging of the texts.
- **OQ-DATA-3:** Resolved at Gate 2. The `citation_mode` field is now a formal field on the Quotation Entry schema (§2j) with values `corrective_teaching | self_identification | lament | composite`. It is a separate filter axis on the Catalog surface. See `design-direction.md §15` for tooltip text and UI treatment.

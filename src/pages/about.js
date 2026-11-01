export function renderAbout() {
  return `
    <div class="about-content">
      <h1 class="page-title">About</h1>

      <h2>What this is</h2>
      <p>A personal scripture study explorer. It catalogs every instance where Jesus Christ directly quotes or closely alludes to an Old Testament scripture — across the four Gospels, 3 Nephi in the Book of Mormon, and the Doctrine and Covenants.</p>
      <p>The central question driving the study: why did Christ, the most perfect being ever to live and fully aligned with the Father, choose these particular scriptures? What does each choice reveal about his mission, his priorities, and the spiritual importance of the underlying text?</p>

      <h2>How to read an entry</h2>
      <p>Each entry has a two-word key — a short label for quick scanning. Below the key are the New Testament or Restoration scripture reference and the Old Testament source, followed by a summary of what Christ said and why it matters in that moment.</p>
      <p>On an entry's detail page you will find the full scripture text for both the citation and the Old Testament source, along with study notes answering the questions this project set out to investigate.</p>

      <h2>Sources</h2>
      <p>Scripture text is from <a href="https://www.churchofjesuschrist.org" target="_blank" rel="noopener noreferrer">The Church of Jesus Christ of Latter-day Saints<span class="visually-hidden"> (opens in new tab)</span></a>. This is the primary and default source for all scriptural content on this site.</p>
      <p>Where provided, links to the <a href="https://www.esv.org" target="_blank" rel="noopener noreferrer">English Standard Version (ESV)<span class="visually-hidden"> (opens in new tab)</span></a> allow comparison of biblical wording. No ESV text is reproduced on this site — the links open on the ESV website.</p>
      <p>All doctrinal claims are traced to approved official sources. Interpretive observations are labeled as such and are not presented as settled doctrine or official Church teaching.</p>

      <h2>The Doctrine and Covenants section</h2>
      <p>The D&C entries are kept separate from the mortal-ministry records. In the Doctrine and Covenants, Christ speaks in first person to the Prophet Joseph Smith and early Church leaders. These passages come from a different source and setting than the Galilean ministry — they are latter-day revelation, not eyewitness accounts. The separation is about source, not authority.</p>

      <h2>Confidence levels</h2>
      <p>Most entries in the catalog are well-established direct quotations or explicit citations. A small number are marked "tentative" — the allusion is plausible and the language is specific enough to suggest scriptural influence, but no single Old Testament source is an exact match. These entries are retained for study rather than excluded.</p>
      <ul>
        <li><strong>High:</strong> A direct quotation or an explicit citation formula with a close verbal match.</li>
        <li><strong>Supported:</strong> A strong allusion where the language clearly echoes a specific Old Testament text.</li>
        <li><strong>Tentative:</strong> A plausible allusion retained because the language is specific enough to warrant study, but the match is not definitive.</li>
      </ul>

      <h2>Interpretive labels</h2>
      <p>Study notes distinguish between observations (what the text says) and interpretations (what it may mean). Neither replaces your own study and spiritual discernment.</p>
    </div>
  `;
}

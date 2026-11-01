import { renderNav } from './nav.js';

export function renderShell(pageContent) {
  return `
    ${renderNav()}
    <main class="site-main" id="main-content" tabindex="-1">
      <div class="page-wrap">
        ${pageContent}
      </div>
    </main>
    <footer class="site-footer">
      <span>Scripture text from <a href="https://www.churchofjesuschrist.org" target="_blank" rel="noopener noreferrer">The Church of Jesus Christ of Latter-day Saints<span class="visually-hidden"> (opens in new tab)</span></a></span>
      <span aria-hidden="true">·</span>
      <span>A personal scripture study</span>
    </footer>
  `;
}

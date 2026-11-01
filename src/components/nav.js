import { getCurrentRoute } from '../router.js';

const LINKS = [
  { label: 'Timeline', hash: '#/', routes: [''] },
  { label: 'All Entries', hash: '#/catalog', routes: ['catalog'] },
  { label: 'By Scripture', hash: '#/source-map', routes: ['source-map'] },
  { label: 'Repeated Passages', hash: '#/thread', routes: ['thread'] },
  { label: 'D&C', hash: '#/dc', routes: ['dc'] },
  { label: 'About', hash: '#/about', routes: ['about'] },
];

export function renderNav() {
  const { segments } = getCurrentRoute();
  const active = segments[0] || '';

  return `
    <nav class="site-nav" aria-label="Site navigation">
      <div class="site-nav__inner">
        <a href="#/" class="site-nav__title">The Chosen Word</a>
        <ul class="site-nav__links" role="list">
          ${LINKS.map(link => `
            <li>
              <a href="${link.hash}"
                 class="nav-link"
                 ${link.routes.includes(active) ? 'aria-current="page"' : ''}>
                ${link.label}
              </a>
            </li>
          `).join('')}
        </ul>
      </div>
    </nav>
  `;
}

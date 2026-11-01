/**
 * Minimal hash-based router.
 * Routes: /#/ | /#/catalog | /#/source-map | /#/thread | /#/dc
 *         /#/entry/q-001 | /#/entry/dc-001
 *         /#/ot-book/isa | /#/pattern/pat-001 | /#/about
 *
 * Filter state is encoded as query params after the route:
 *   /#/catalog?book=ISA&type=direct-quotation
 */

const routes = {};

export function register(pattern, handler) {
  routes[pattern] = handler;
}

export function navigate(hash) {
  window.location.hash = hash;
}

export function getCurrentRoute() {
  return parseHash(window.location.hash);
}

function parseHash(hash) {
  const raw = hash.replace(/^#\/?/, '') || '';
  const [pathPart, queryPart] = raw.split('?');
  const segments = pathPart.split('/').filter(Boolean);
  const params = {};
  if (queryPart) {
    for (const pair of queryPart.split('&')) {
      const [k, v] = pair.split('=');
      if (k) {
        const key = decodeURIComponent(k);
        const val = decodeURIComponent(v || '');
        if (params[key]) {
          params[key] = [].concat(params[key], val);
        } else {
          params[key] = val;
        }
      }
    }
  }
  return { segments, params, raw: pathPart };
}

export function buildHash(route, params = {}) {
  const query = Object.entries(params)
    .flatMap(([k, v]) => {
      const vals = Array.isArray(v) ? v : [v];
      return vals.filter(Boolean).map(val => `${encodeURIComponent(k)}=${encodeURIComponent(val)}`);
    })
    .join('&');
  return `#/${route}${query ? '?' + query : ''}`;
}

function dispatch() {
  const { segments, params } = parseHash(window.location.hash);
  const root = segments[0] || '';
  const id = segments[1] || null;

  if (routes[root] !== undefined) {
    routes[root]({ segments, params, id });
    return;
  }

  // Default to home
  routes['']?.({ segments, params, id: null });
}

export function init() {
  window.addEventListener('hashchange', dispatch);
  dispatch();
}

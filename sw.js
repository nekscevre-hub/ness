/**
 * NEKS Çevre Teknolojileri - Service Worker
 * ------------------------------------------------------------------
 * Strategy:
 *   - HTML navigations  -> NETWORK-FIRST  (content is always fresh;
 *                          falls back to cache only when offline)
 *   - Static assets     -> CACHE-FIRST    (css/js/images/fonts served
 *                          instantly on repeat visits)
 *
 * IMPORTANT: When you change the CSS or JS, bump CACHE_VERSION below
 * (e.g. 'v1' -> 'v2'). This clears the old cached assets on the next
 * visit so users never get stale styles/scripts.
 */

const CACHE_VERSION = 'v1';
const STATIC_CACHE = 'neks-static-' + CACHE_VERSION;
const PAGES_CACHE = 'neks-pages-' + CACHE_VERSION;

// Assets safe to pre-cache on install
const PRECACHE_URLS = [
  '/',
  '/neks-styles-optimized.css',
  '/neks-scripts-optimized.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys
        .filter((k) => k !== STATIC_CACHE && k !== PAGES_CACHE)
        .map((k) => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle GET, same-origin requests. Leave POST (Netlify form),
  // analytics and cross-origin fonts to the network untouched.
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const isHTML = req.mode === 'navigate' ||
    (req.headers.get('accept') || '').includes('text/html');

  if (isHTML) {
    // NETWORK-FIRST for pages
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(PAGES_CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match('/')))
    );
    return;
  }

  // CACHE-FIRST for static assets
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(STATIC_CACHE).then((c) => c.put(req, copy));
        }
        return res;
      });
    })
  );
});

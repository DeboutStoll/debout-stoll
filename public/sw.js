/* Debout, Stoll ! — service worker
   Progressive offline support: cache-first for images/static assets,
   network-first (with cache fallback) for pages. Non-critical: registration
   failure never breaks the site. */
const VERSION = 'debout-stoll-v1';
const STATIC_CACHE = `${VERSION}-static`;
const PAGE_CACHE = `${VERSION}-pages`;

const PRECACHE = ['/fr', '/en', '/img/crest.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      cache.addAll(PRECACHE).catch(() => {}),
    ),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // Never cache the API (dynamic data).
  if (url.pathname.startsWith('/api/')) return;
  // Only handle same-origin requests.
  if (url.origin !== self.location.origin) return;

  const isAsset =
    url.pathname.startsWith('/img/') ||
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/og/');

  if (isAsset) {
    // Cache-first for immutable assets.
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            const copy = res.clone();
            caches.open(STATIC_CACHE).then((c) => c.put(request, copy));
            return res;
          }),
      ),
    );
    return;
  }

  // Network-first for navigations / pages, fall back to cache then offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(PAGE_CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() =>
          caches.match(request).then((c) => c || caches.match('/fr')),
        ),
    );
  }
});

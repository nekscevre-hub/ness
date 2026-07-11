/**
 * NEKS Service Worker
 * Offline support, caching strategy, background sync
 */

const CACHE_NAME = 'neks-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/hakkimizda',
  '/hizmetler',
  '/yetkinlik',
  '/ortaklar',
  '/iletisim',
  '/neks-styles-optimized.css',
  '/neks-scripts-optimized.js',
  '/Neks_icon.png'
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .catch(err => {
        console.log('Cache installation failed:', err);
      })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip Netlify Functions and external APIs
  if (url.origin !== location.origin) {
    return;
  }

  // HTML files - Network first, fallback to cache
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (!response || response.status !== 200) {
            return response;
          }
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request)
            .then(response => response || new Response('Offline', { status: 503 }));
        })
    );
  } else {
    // CSS, JS, Images - Cache first, fallback to network
    event.respondWith(
      caches.match(request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(request).then(response => {
            if (!response || response.status !== 200) {
              return response;
            }
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseClone);
            });
            return response;
          });
        })
        .catch(() => {
          // Return placeholder for images
          if (request.destination === 'image') {
            return new Response(
              '<svg><rect fill="#f0f0f0"/></svg>',
              { headers: { 'Content-Type': 'image/svg+xml' } }
            );
          }
          return new Response('Offline', { status: 503 });
        })
    );
  }
});

// Background sync for form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'sync-forms') {
    event.waitUntil(syncForms());
  }
});

async function syncForms() {
  try {
    const db = await openIndexedDB();
    const forms = await db.getAll('pending-forms');
    
    for (const form of forms) {
      try {
        await fetch('/', {
          method: 'POST',
          body: new FormData(form.data)
        });
        await db.delete('pending-forms', form.id);
      } catch (err) {
        console.log('Form sync failed:', err);
      }
    }
  } catch (err) {
    console.log('Sync failed:', err);
  }
}

// Messaging from clients
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

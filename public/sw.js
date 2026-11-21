// Service Worker do INFECTED: app shell em cache, dados sempre na rede.
// Estratégia: navegação -> rede com fallback em cache; assets -> cache primeiro
// com atualização em segundo plano; /api/ -> sempre rede (nada de dado velho).

const CACHE = 'infected-v1';

const SHELL = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  '/js/game.js',
  '/js/save.js',
  '/js/local.js',
  '/js/scene.js',
  '/manifest.webmanifest',
  '/assets/kennedy.jpg',
  '/assets/fonts/press-start-2p.woff2',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  // API sempre na rede; se estiver offline, avisa em vez de travar.
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request).catch(
        () =>
          new Response(JSON.stringify({ error: 'OFFLINE' }), {
            status: 503,
            headers: { 'content-type': 'application/json' },
          })
      );
    return;
  }

  // Navegação: rede primeiro; sem rede, serve o shell salvo.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put('/index.html', copy));
          return response;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Demais assets: cache primeiro, rede atualiza o cache em segundo plano.
  event.respondWith(
    caches.match(request).then((hit) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => hit);
      return hit || network;
    })
  );
});

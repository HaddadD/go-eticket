var CACHE = 'go-ticket-v3';
var ASSETS = [
  './',
  './index.html',
  './union-to-kitchener.html',
  './kitchener-to-union.html',
  './manifest.json',
  './icon-512.png'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(c) { return c.addAll(ASSETS); })
      .then(function() { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k) { return k !== CACHE; })
        .map(function(k) { return caches.delete(k); }));
    }).then(function() { return self.clients.claim(); })
  );
});

// Cache-first: serve from cache, fall back to network (offline-proof)
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(function(r) {
      return r || fetch(e.request);
    })
  );
});

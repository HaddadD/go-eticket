var CACHE = 'go-ticket-v4';
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

// Pages: network-first so updates show immediately when online,
// falling back to cache when offline. Other assets: cache-first.
self.addEventListener('fetch', function(e) {
  if (e.request.mode === 'navigate' || e.request.destination === 'document') {
    e.respondWith(
      fetch(e.request).then(function(resp) {
        var copy = resp.clone();
        caches.open(CACHE).then(function(c) { c.put(e.request, copy); });
        return resp;
      }).catch(function() {
        return caches.match(e.request, { ignoreSearch: true });
      })
    );
    return;
  }
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(function(r) {
      return r || fetch(e.request);
    })
  );
});

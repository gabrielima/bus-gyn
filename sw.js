
// https://www.smashingmagazine.com/2016/08/a-beginners-guide-to-progressive-web-apps/

// Use a cacheName for cache versioning
var cacheName = 'v1:static';

// During the installation phase, you'll usually want to cache static assets.
self.addEventListener('install', function(e) {
// Once the service worker is installed, go ahead and fetch the resources to make this work offline.
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll([
        './',
        './styles.css',
        './scripts.js',
        './imgs/icon-144.png',
        './imgs/icon-192.png',
        './imgs/icon-36.png',
        './imgs/icon-48.png',
        './imgs/icon-72.png',
        './imgs/icon-96.png',
        ]).then(function() {
          self.skipWaiting();
        });
    })
  );
});

// when the browser fetches a URL…
self.addEventListener('fetch', function(event) {
// … either respond with the cached object or go ahead and fetch the actual URL
event.respondWith(
  caches.match(event.request).then(function(response) {
    if (response) {
      // retrieve from cache
      return response;
    }
    // fetch as normal
    return fetch(event.request);
    })
  );
});
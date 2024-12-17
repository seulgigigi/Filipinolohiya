// Cache name
const CACHE_NAME = 'word-scramble-v1';

// Files to cache
const urlsToCache = [
    '/',
    '/index.html',
    '/main-menu.html',
    '/panitikan.html',
    '/story1.html',
    '/story2.html',
    '/assessment.html',
    '/style.css',
    '/panitikan.css',
    '/script.js',
    '/panitikan.js',
    '/words.csv',
    '/icon.png' // Add any other assets
];

// Install the service worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch cached assets
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached response if found
                if (response) {
                    return response;
                }
                // Otherwise, fetch from the network
                return fetch(event.request);
            })
    );
});

// Update the cache when a new version is available
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
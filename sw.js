const VERSION = 'v1.0.0'
const CACHE_NAME = `workout-e-${VERSION}`

const PRECACHE = [
    './',
    './index.html',
    './index.js',
    './main.js',
    './style.css',
    './manifest.json',
    './dates-utils.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js',
    'https://unpkg.com/vue@3',
    'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.0/chart.min.js',
]

// Install: pre-cache resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE))
    )
    self.skipWaiting()
})

// Activate: delete all caches from previous versions
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key.startsWith('workout-e-') && key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    )
    self.clients.claim()
})

// Fetch: network first, fallback to cache
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                const clone = response.clone()
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone))
                return response
            })
            .catch(() => caches.match(event.request))
    )
})

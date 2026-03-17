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

const BYPASS_HOSTS = [
    'identitytoolkit.googleapis.com',
    'securetoken.googleapis.com',
    'accounts.google.com',
    'oauth2.googleapis.com',
    'firebaseapp.com',
    'googleapis.com',
]

function shouldBypass(url) {
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return true
    return BYPASS_HOSTS.some(host => url.hostname.endsWith(host))
}

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
// Bypass Firebase/Google auth endpoints entirely
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url)

    if (shouldBypass(url)) return

    event.respondWith(
        fetch(event.request)
            .then(response => {
                if (event.request.method === 'GET') {
                    const clone = response.clone()
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone))
                }
                return response
            })
            .catch(() => caches.match(event.request))
    )
})

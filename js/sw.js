// Service Worker для кешування ресурсів та покращення продуктивності
const CACHE_NAME = 'u10-discount-v1'
const urlsToCache = [
	'/',
	'/assets/css/style.css',
	'/js/main.js',
	'/assets/images/main-bg.svg',
	'/assets/images/telegram.svg',
]

// Встановлення service worker
self.addEventListener('install', function (event) {
	event.waitUntil(
		caches.open(CACHE_NAME).then(function (cache) {
			return cache.addAll(urlsToCache)
		})
	)
})

// Обробка запитів
self.addEventListener('fetch', function (event) {
	event.respondWith(
		caches.match(event.request).then(function (response) {
			// Повертаємо кешовану версію або робимо мережевий запит
			if (response) {
				return response
			}
			return fetch(event.request)
		})
	)
})

// Активація нової версії service worker
self.addEventListener('activate', function (event) {
	event.waitUntil(
		caches.keys().then(function (cacheNames) {
			return Promise.all(
				cacheNames.map(function (cacheName) {
					if (cacheName !== CACHE_NAME) {
						return caches.delete(cacheName)
					}
				})
			)
		})
	)
})

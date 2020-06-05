self.addEventListener("install", event => {

	event.waitUntil(
		caches.open('v5').then(function (cache) {
			return cache.addAll([
				'home.html',
				'main.js',
				'design.css',
				'touchmove.js',
				'Sliders.js',
				'NavNode.js',
				'loadWiki.js',
				'HtmlToNavNode.js',
				'ElementPositioning.js',
				'OfflineStorage.js',
				'SearchPage.js',
				'Hashes.js',
				'RangeLabeledSlider.js',
				'settings.html',
				'general.js',
				'SlideNavigator.js',
				'tabToNode.js'
			]);
		})
	);
});
self.addEventListener('fetch', function (event) {
	event.respondWith(caches.match(event.request).then(function (response) {
		// caches.match() always resolves
		// but in case of success response will have value
		if (response !== undefined) {
			return response;
		} else {
			return fetch(event.request);
		}
	}));
});
let expectedCaches = ["v5"];
self.addEventListener('activate', event => {
	// delete any caches that aren't in expectedCaches
	// which will get rid of static-v1
	event.waitUntil(
		caches.keys().then(keys => Promise.all(
			keys.map(key => {
				if (!expectedCaches.includes(key)) {
					return caches.delete(key);
				}
			})
		)).then(() => {
			console.log('v5 now ready to handle fetches!');
		})
	);
});
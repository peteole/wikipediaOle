self.addEventListener("install", event => {

    event.waitUntil(
        caches.open('v1').then(function (cache) {
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
                'general.js'
            ]);
        })
    )
})
self.addEventListener('fetch', function (event) {
    event.respondWith(caches.match(event.request).then(function (response) {
        // caches.match() always resolves
        // but in case of success response will have value
        if (response !== undefined) {
            return response;
        } else {
            return fetch(event.request).then(function (response) {
                // response may be used only once
                // we need to save clone to put one copy in cache
                // and serve second one
                let responseClone = response.clone();
                caches.open('v1').then(function (cache) {
                    cache.put(event.request, responseClone);
                });
                return response;
            }).catch(function () {
                return null;
            });
        }
    }));
});
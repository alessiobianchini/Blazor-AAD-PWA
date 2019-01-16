var version = '1.0.0';
var cache_name = 'blazor-cache-' + version;
var cached_urls = [
    './',
    //Html and css files
    //'./index.html',
    //'./css/site.css',
    './css/bootstrap/bootstrap.min.css',
    './css/open-iconic/font/css/open-iconic-bootstrap.min.css',
    './css/open-iconic/font/fonts/open-iconic.woff',
    //Blazor framework
    './_framework/blazor.webassembly.js',
    './_framework/blazor.boot.json',
    //Our additional files
    //'./manifest.json',
    //'./serviceworker.js',
    './icons/icon-192x192.png',
    './icons/icon-512x512.png',
    //The web assembly/.net dll's
    './_framework/wasm/mono.js',
    './_framework/wasm/mono.wasm',
    './_framework/_bin/Microsoft.AspNetCore.Blazor.Browser.dll',
    './_framework/_bin/Microsoft.AspNetCore.Blazor.dll',
    './_framework/_bin/Microsoft.Extensions.DependencyInjection.Abstractions.dll',
    './_framework/_bin/Microsoft.Extensions.DependencyInjection.dll',
    './_framework/_bin/Microsoft.JSInterop.dll',
    './_framework/_bin/mscorlib.dll',
    './_framework/_bin/System.Net.Http.dll',
    './_framework/_bin/Mono.WebAssembly.Interop.dll',
    './_framework/_bin/System.dll',
    './_framework/_bin/System.Core.dll',
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(cache_name)
            .then(function (cache) {
                return cache.addAll(cached_urls);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request, { ignoreSearch: true }).then(response => {
            return response || fetch(event.request);
        })
    );
});

function clearCaches() {
    return caches.keys().then(function (keys) {
        return Promise.all(keys.filter(function (key) {
            return key.indexOf(version) !== 0;
        }).map(function (key) {
            return caches.delete(key);
        })
        );
    });
}

self.addEventListener('activate', event => {
    event.waitUntil(
        clearCaches().then(() => {
            return self.clients.claim();
        })
    );
});

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

self.addEventListener('push', function (event) {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    const title = 'Blazor PWA';
    const options = {
        body: event.data.text(),
        vibrate: [200, 100, 200, 100, 200],
        icon: 'img/icon-192x192.png',
        badge: 'img/badge.png'
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
    console.log('[Service Worker] Notification click Received.');

    event.notification.close();

    event.waitUntil(
        clients.openWindow('https://developers.google.com/web/')
    );
});

self.addEventListener('pushsubscriptionchange', function (event) {
    console.log('[Service Worker]: \'pushsubscriptionchange\' event fired.');
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    event.waitUntil(
        self.registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
        })
            .then(function (newSubscription) {
                // TODO: Send to application server
                console.log('[Service Worker] New subscription: ', newSubscription);
            })
    );
});

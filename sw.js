// खेल खेल में — offline support. Change the version number whenever you upload a new index.html.
const CACHE = 'kkm-v2';
const FILES = ['./', './index.html', './manifest.webmanifest', './Baloo2.ttf', './icon-192.png', './icon-512.png', './apple-touch-icon.png',
  // कथा कोड
  './katha-code/index.html',
  './katha-code/css/katha.css',
  './katha-code/js/art-people.js',
  './katha-code/js/art-places.js',
  './katha-code/js/art.js',
  './katha-code/js/audio.js',
  './katha-code/js/blocks.js',
  './katha-code/js/editor.js',
  './katha-code/js/games.js',
  './katha-code/js/home.js',
  './katha-code/js/kits-gita.js',
  './katha-code/js/kits-ramayan.js',
  './katha-code/js/kits-upanishad.js',
  './katha-code/js/kits.js',
  './katha-code/js/main.js',
  './katha-code/js/parents.js',
  './katha-code/js/picker.js',
  './katha-code/js/runtime.js',
  './katha-code/js/store.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, {ignoreSearch: true}).then(hit => hit || fetch(e.request).then(res => {
      if (res.ok && new URL(e.request.url).origin === location.origin) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});

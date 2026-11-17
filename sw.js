// Offline cache. VERSION and FILES are written by tools/stamp.mjs.
const VERSION = '20261117-b6702ac';
const FILES = [
 "./",
 "./css/app.css",
 "./fonts/archivo-latin-ext-wght-normal.woff2",
 "./fonts/archivo-latin-wght-normal.woff2",
 "./fonts/big-shoulders-latin-ext-wght-normal.woff2",
 "./fonts/big-shoulders-latin-wght-normal.woff2",
 "./icons/apple-touch-icon.png",
 "./icons/icon-192.png",
 "./icons/icon-512.png",
 "./icons/icon-maskable-512.png",
 "./index.html",
 "./js/app.js",
 "./js/data/ex-core-legs.js",
 "./js/data/ex-mobility.js",
 "./js/data/ex-pull.js",
 "./js/data/ex-push.js",
 "./js/data/ex-skills.js",
 "./js/data/exercises.js",
 "./js/data/figures.js",
 "./js/data/lessons.js",
 "./js/data/routines.js",
 "./js/data/tracks.js",
 "./js/engine/game.js",
 "./js/engine/plan.js",
 "./js/engine/progress.js",
 "./js/figure.js",
 "./js/i18n.js",
 "./js/sound.js",
 "./js/store.js",
 "./js/sync.js",
 "./js/ui/anim.js",
 "./js/ui/common.js",
 "./js/ui/learn.js",
 "./js/ui/nav.js",
 "./js/ui/player.js",
 "./js/ui/progress.js",
 "./js/ui/setup.js",
 "./js/ui/skills.js",
 "./js/ui/summary.js",
 "./js/ui/today.js",
 "./js/version.js",
 "./manifest.webmanifest"
];
const CACHE = 'chalk-' + VERSION;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('chalk-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit => hit ?? fetch(e.request).catch(() =>
    e.request.mode === 'navigate' ? caches.match('./index.html') : Response.error())));
});

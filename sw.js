/* French Master Academy — Service Worker (النسخة الثابتة المستقلة)
   الاستراتيجية: كاش-أولاً لكل ملفات التطبيق (تعمل دون إنترنت بالكامل)
   الفيديوهات (يوتيوب/ytimg) تتجاوز الكاش دائماً */
const CACHE = 'fma-static-v12';
const ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/data.js',
  './js/app.js',
  './manifest.webmanifest',
  './icons/favicon-64.png',
  './icons/apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
  './fonts/_faces.css',
  './fonts/amiri-400-arabic.woff2',
  './fonts/amiri-400-latin.woff2',
  './fonts/amiri-400i-arabic.woff2',
  './fonts/amiri-400i-latin.woff2',
  './fonts/amiri-700-arabic.woff2',
  './fonts/amiri-700-latin.woff2',
  './fonts/notokufiarabic-400-arabic.woff2',
  './fonts/notokufiarabic-400-latin.woff2',
  './fonts/notokufiarabic-500-arabic.woff2',
  './fonts/notokufiarabic-500-latin.woff2',
  './fonts/notokufiarabic-600-arabic.woff2',
  './fonts/notokufiarabic-600-latin.woff2',
  './fonts/notokufiarabic-700-arabic.woff2',
  './fonts/notokufiarabic-700-latin.woff2'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  // يوتيوب وموارده: تجاوز دائم (محتوى مرئي يتطلب اتصالاً)
  if (url.hostname.indexOf('youtube') >= 0 || url.hostname.indexOf('ytimg') >= 0 ||
      url.hostname.indexOf('googlevideo') >= 0) return;
  if (url.origin !== location.origin) return;

  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      return fetch(e.request).then((res) => {
        if (res && res.ok && (url.pathname.endsWith('.html') || url.pathname.endsWith('.css') ||
            url.pathname.endsWith('.js') || url.pathname.endsWith('.woff2') || url.pathname.endsWith('.png') ||
            url.pathname.endsWith('.webmanifest') || url.pathname === '/' )) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      }).catch(() => {
        if (e.request.mode === 'navigate') return caches.match('./index.html');
        return Response.error();
      });
    })
  );
});

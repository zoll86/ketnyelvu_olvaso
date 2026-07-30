/* Kétnyelvű olvasó — service worker
   Stratégia:
   - HTML (navigáció, index.html): HÁLÓZAT ELŐSZÖR. Frissítés után azonnal az új változat jön,
     offline esetben a cache-elt példány.
   - ikonok, manifest, betűtípusok: cache először (ezek ritkán változnak).
   - fordítókérések: soha nem cache-elve. */

const VER   = 'olvaso-v82';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
  './icons/apple-180.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VER)
      .then(c => c.addAll(SHELL).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== VER && k !== VER + '-ext').map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
  if (e.data === 'version') e.source && e.source.postMessage({ version: VER });
});

const isHtml = req =>
  req.mode === 'navigate' ||
  req.destination === 'document' ||
  /\.html($|\?)/.test(new URL(req.url).pathname);

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  /* külső kérések */
  if (url.origin !== self.location.origin) {
    if (/fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net/.test(url.host)) {
      e.respondWith(
        caches.open(VER + '-ext').then(async c => {
          const hit = await c.match(req);
          if (hit) return hit;
          const res = await fetch(req);
          if (res && (res.ok || res.type === 'opaque')) c.put(req, res.clone());
          return res;
        }).catch(() => fetch(req))
      );
    }
    return;                       /* fordítás, szótár API: érintetlenül a hálózatra */
  }

  /* saját HTML: hálózat először */
  if (isHtml(req)) {
    e.respondWith(
      fetch(req, { cache: 'no-store' })
        .then(res => {
          if (res && res.ok) caches.open(VER).then(c => c.put('./index.html', res.clone()));
          return res;
        })
        .catch(() => caches.match('./index.html', { ignoreSearch: true })
          .then(hit => hit || new Response('Offline', { status: 503 })))
    );
    return;
  }

  /* saját statikus fájlok: cache először, csendes frissítéssel */
  e.respondWith(
    caches.open(VER).then(async c => {
      const hit = await c.match(req, { ignoreSearch: true });
      const net = fetch(req).then(res => {
        if (res && res.ok) c.put(req, res.clone());
        return res;
      }).catch(() => null);
      return hit || (await net) || new Response('Offline', { status: 503 });
    })
  );
});

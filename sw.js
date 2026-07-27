/* Kétnyelvű olvasó — service worker
   Cél: a program maga offline is induljon, a fordítókérések viszont
   soha ne kerüljenek cache-be (mindig friss válasz kell). */

const VER   = 'olvaso-v18';
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
      .then(c => c.addAll(SHELL).catch(() => {/* egy-egy fájl hiánya ne blokkolja */}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== VER).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  /* Külső hívások: fordítómotorok, szótár API, betűtípusok.
     A fordítás soha nem cache-elhető, a betűtípus igen. */
  if (!sameOrigin) {
    const isFont = /fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com/.test(url.host);
    if (isFont) {
      e.respondWith(
        caches.open(VER + '-ext').then(async c => {
          const hit = await c.match(req);
          if (hit) return hit;
          const res = await fetch(req);
          if (res.ok || res.type === 'opaque') c.put(req, res.clone());
          return res;
        }).catch(() => fetch(req))
      );
    }
    return;   /* minden más külső kérés érintetlenül megy a hálózatra */
  }

  /* Saját fájlok: cache először, mellette csendes frissítés */
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

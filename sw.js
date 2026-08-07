/* Kétnyelvű hallgató — service worker
   FIGYELEM: minden kiadásnál át kell írni a verziót itt IS és az index.html
   APP_VER sorában. Ha csak az egyik változik, a telefon a régi, cache-elt
   változatot mutatja, és a hibajavítás nem jut el a készülékig. */
const VER='hallgato-v56';
const FILES=['./','index.html','manifest.webmanifest',
  'icons/icon-192.png','icons/icon-512.png','icons/maskable-512.png','icons/apple-180.png'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(VER).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()).catch(()=>{}));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VER).map(k=>caches.delete(k))))
    .then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='POST'&&r.method!=='PUT'){
    const u=new URL(r.url);
    /* a saját fájlok: előbb a hálózat, hogy a frissítés átjöjjön, de hiba esetén
       a cache — így repülőgépen és metrón is elindul a program */
    if(u.origin===location.origin){
      e.respondWith(
        /* cache:'no-cache': a böngésző HTTP-gyorsítótára ne adhasson régit —
           e nélkül a GitHub Pages 10 perces max-age szabálya miatt a frissítés
           akár úgy is elmaradhatott, hogy a hálózat elérhető volt */
        fetch(r.url,{cache:'no-cache'}).then(res=>{
          if(res&&res.ok) caches.open(VER).then(c=>c.put(r,res.clone())).catch(()=>{});
          return res;
        }).catch(()=>caches.match(r).then(m=>m||caches.match('index.html')))
      );
      return;
    }
    /* a betűtípusok: cache-first, mert nem változnak */
    if(/fonts\.(googleapis|gstatic)\.com/.test(u.host)){
      e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{
        caches.open(VER).then(c=>c.put(r,res.clone())).catch(()=>{});
        return res;
      }).catch(()=>m)));
      return;
    }
  }
  /* a felismerő és a fordító hívásait soha nem tároljuk */
});

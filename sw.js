/* V14.2: caché diferenciada para esta versión de revisión. */
const CACHE = "porteria-solsticio4-v14-2";
const OLD_APP_CACHES = ["solcicio4-correcta-v4"];
self.addEventListener("install", event => { self.skipWaiting(); });
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => OLD_APP_CACHES.includes(key) || (key.startsWith("porteria-solsticio4-") && key !== CACHE)).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request, { cache: "no-store" })
      .then(response => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy)).catch(() => {});
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

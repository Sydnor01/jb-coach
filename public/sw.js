const CACHE_NAME = "jb-cache-v1";
const urlsToCache = ["/", "/index.html", "/manifest.webmanifest"];
//Install the service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME) .then((cache) => {
      return cache.addAll(urlsToCache);
    })  
  ); 
});
// Activate the service worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      ) 
    ) 
   );
});
// Fetch requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

const CACHE_NAME = "impact-shell-v0.1";
const BASE_PATH = new URL("./", self.location.href).pathname;
const SHELL_URLS = [
  BASE_PATH,
  new URL("manifest.webmanifest", self.location.href).pathname,
  new URL("icons/impact.svg", self.location.href).pathname,
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith("impact-shell-") && key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      ))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(request).then((response) => {
        if (response.ok && response.type === "basic") {
          return caches.open(CACHE_NAME).then((cache) =>
            cache.put(request, response.clone()).then(() => response),
          );
        }
        return response;
      }).catch(() => {
        if (request.mode === "navigate") return caches.match(BASE_PATH);
        throw new Error("Ressource indisponible hors ligne.");
      });
    }),
  );
});

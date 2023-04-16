const CACHE_NAME = "animeflv-cache-v1";
const appShellFiles = [
  "/",
  "/index.html",
  "/scripts/main.js",
  "/styles/main.css",
];

self.addEventListener("install", (event) => {
  console.log("Service worker installed");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching app shell files");
      return cache.addAll(appShellFiles);
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("Service worker activated");
});

const cacheFirst = async (request) => {
  const cacheResponse = await caches.match(request);
  if (cacheResponse) {
    console.log("Returning response from cache");
    return cacheResponse;
  }

  console.log("Fetching response from network");
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      console.log("Caching network response");
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log("Network request failed. Serving offline page.");
    return new Response("<html><body style='background-color: #000000'><h1>You are offline</h1></body></html>", {
      headers: { "Content-Type": "text/html" },
    });
  }
};

self.addEventListener("fetch", (event) => {
  event.respondWith(cacheFirst(event.request));
});

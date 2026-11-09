// Boutique Applis Croizat — cache simple pour fonctionner hors connexion
const CACHE = "applis-croizat-v5";
const FICHIERS = ["./", "index.html", "manifest.webmanifest",
  "img/icone-192.png", "img/icone-512.png", "img/apple-touch-icon.png",
  "img/fromages-aop.png", "img/regions-de-france.png", "img/socle-cocktails.png", "img/restaurant.png",
  "img/captures/fromages-1.webp", "img/captures/fromages-2.webp", "img/captures/regions-1.webp", "img/captures/regions-2.webp", "img/captures/cocktails-1.webp", "img/captures/cocktails-2.webp"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
// Réseau d'abord (pour voir tout de suite les nouvelles applis), cache si pas de réseau
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => {
    const copie = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copie)); return r;
  }).catch(() => caches.match(e.request)));
});

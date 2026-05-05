const CACHE_NAME = 'barberdash-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './assets/images/logo_barber.jpg'
];

// Instalação do Service Worker e cache dos arquivos básicos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Estratégia Network-First: Tenta a rede, se falhar usa o cache
self.addEventListener('fetch', event => {
  // Ignora requisições de API (Apps Script) para garantir dados sempre frescos
  if (event.request.url.includes('google.com') || event.request.url.includes('script.google')) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

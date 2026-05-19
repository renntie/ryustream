const CACHE_NAME = 'ryustream-v1'
self.addEventListener('install', e => { self.skipWaiting() })
self.addEventListener('activate', e => { self.clients.claim() })
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return
  if (e.request.url.includes('supabase.co')) return
  if (e.request.url.includes('daunscode.com')) return
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request).then(c => c || caches.match('/index.html')))
  )
})

/**
 * COCINA PARA UNO - SERVICE WORKER
 * PWA Service Worker for offline functionality and caching
 * Author: CDA Front Developer
 * Date: 2024
 * Version: 2.0.0
 */

const CACHE_NAME = 'cocina-para-uno-v2.0.0';
const STATIC_CACHE = `${CACHE_NAME}-static`;
const DYNAMIC_CACHE = `${CACHE_NAME}-dynamic`;
const IMAGE_CACHE = `${CACHE_NAME}-images`;

// Files to cache immediately (App Shell)
const STATIC_FILES = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/main.js',
  '/js/objects.js',
  '/js/patterns.js',
  '/manifest.json',
  // Google Fonts (with fallbacks)
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lora:wght@400;500&display=swap',
  // Offline page
  '/offline.html'
];

// Routes that should always try network first
const NETWORK_FIRST_ROUTES = [
  '/api/',
  '.json'
];

// Image file extensions to cache
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'svg', 'gif'];

/**
 * Service Worker Installation
 */
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static files
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('📦 Caching static files');
        return cache.addAll(STATIC_FILES.filter(url => !url.startsWith('http')));
      }),
      
      // Cache external resources separately
      cacheExternalResources(),
      
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

/**
 * Service Worker Activation
 */
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activated');
  
  event.waitUntil(
    Promise.all([
      // Clean old caches
      cleanOldCaches(),
      
      // Take control of all pages
      self.clients.claim(),
      
      // Notify clients about update
      notifyClientsAboutUpdate()
    ])
  );
});

/**
 * Fetch Event Handler - Network strategies
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip Chrome extensions and other schemes
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Apply different caching strategies based on resource type
  if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
  } else if (isApiRequest(request)) {
    event.respondWith(handleApiRequest(request));
  } else if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(request));
  } else {
    event.respondWith(handleStaticRequest(request));
  }
});

/**
 * Background Sync Event (for offline data sync)
 */
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'recipe-sync') {
    event.waitUntil(syncRecipes());
  }
});

/**
 * Push Event Handler (for notifications)
 */
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'Nueva receta disponible 🍲',
      icon: '/assets/icons/icon-192x192.png',
      badge: '/assets/icons/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: data.data || {},
      actions: [
        {
          action: 'view',
          title: 'Ver receta',
          icon: '/assets/icons/view-action.png'
        },
        {
          action: 'close',
          title: 'Cerrar'
        }
      ],
      requireInteraction: false,
      tag: 'recipe-notification'
    };
    
    event.waitUntil(
      self.registration.showNotification(
        data.title || '🍲 Cocina para Uno',
        options
      )
    );
  }
});

/**
 * Notification Click Handler
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/') // Open the app
    );
  }
});

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Cache external resources with error handling
 */
async function cacheExternalResources() {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const externalUrls = STATIC_FILES.filter(url => url.startsWith('http'));
    
    await Promise.allSettled(
      externalUrls.map(async (url) => {
        try {
          const response = await fetch(url, { mode: 'cors' });
          if (response.ok) {
            await cache.put(url, response);
          }
        } catch (error) {
          console.warn('⚠️ Failed to cache external resource:', url, error);
        }
      })
    );
  } catch (error) {
    console.error('❌ Error caching external resources:', error);
  }
}

/**
 * Clean old cache versions
 */
async function cleanOldCaches() {
  try {
    const cacheNames = await caches.keys();
    const oldCaches = cacheNames.filter(name => 
      name.startsWith('cocina-para-uno-') && name !== CACHE_NAME
    );
    
    await Promise.all(
      oldCaches.map(cacheName => {
        console.log('🗑️ Deleting old cache:', cacheName);
        return caches.delete(cacheName);
      })
    );
  } catch (error) {
    console.error('❌ Error cleaning old caches:', error);
  }
}

/**
 * Notify clients about Service Worker update
 */
async function notifyClientsAboutUpdate() {
  try {
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'UPDATE_AVAILABLE',
        version: CACHE_NAME
      });
    });
  } catch (error) {
    console.error('❌ Error notifying clients:', error);
  }
}

/**
 * Handle image requests with cache-first strategy
 */
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Clone response before caching
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('❌ Image request failed:', error);
    
    // Return fallback image if available
    const fallbackImage = await caches.match('/assets/img/recipe-placeholder.png');
    return fallbackImage || new Response('', { status: 404 });
  }
}

/**
 * Handle API requests with network-first strategy
 */
async function handleApiRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.warn('🌐 Network failed, trying cache for API request');
    
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline indicator
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'No network connection available' 
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

/**
 * Handle navigation requests with cache-first for HTML
 */
async function handleNavigationRequest(request) {
  try {
    // Try cache first for HTML files
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      // Try to update cache in background
      fetchAndCache(request);
      return cachedResponse;
    }
    
    // If not in cache, try network
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.warn('🌐 Navigation request failed, showing offline page');
    
    // Show offline page as fallback
    const offlinePage = await caches.match('/offline.html');
    return offlinePage || new Response('App offline', { status: 503 });
  }
}

/**
 * Handle static asset requests
 */
async function handleStaticRequest(request) {
  try {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('❌ Static request failed:', error);
    return new Response('', { status: 404 });
  }
}

/**
 * Background fetch and cache update
 */
async function fetchAndCache(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response);
    }
  } catch (error) {
    console.warn('⚠️ Background cache update failed:', error);
  }
}

/**
 * Sync recipes when back online
 */
async function syncRecipes() {
  try {
    console.log('🔄 Syncing recipes...');
    
    // Get pending recipes from IndexedDB
    const pendingRecipes = await getPendingRecipes();
    
    if (pendingRecipes.length > 0) {
      await Promise.all(
        pendingRecipes.map(recipe => syncRecipe(recipe))
      );
      
      // Clear pending recipes after successful sync
      await clearPendingRecipes();
      
      console.log('✅ Recipe sync completed');
    }
  } catch (error) {
    console.error('❌ Recipe sync failed:', error);
  }
}

/**
 * Mock functions for recipe sync (replace with actual implementation)
 */
async function getPendingRecipes() {
  // TODO: Implement IndexedDB operations
  return [];
}

async function syncRecipe(recipe) {
  // TODO: Implement server sync
  console.log('Syncing recipe:', recipe.title);
}

async function clearPendingRecipes() {
  // TODO: Implement IndexedDB cleanup
}

// =============================================================================
// REQUEST TYPE HELPERS
// =============================================================================

function isImageRequest(request) {
  return IMAGE_EXTENSIONS.some(ext => 
    request.url.toLowerCase().includes(`.${ext}`)
  );
}

function isApiRequest(request) {
  return NETWORK_FIRST_ROUTES.some(route => 
    request.url.includes(route)
  );
}

function isNavigationRequest(request) {
  return request.mode === 'navigate' || 
         (request.method === 'GET' && request.headers.get('accept').includes('text/html'));
}

console.log('🎉 Service Worker loaded successfully');

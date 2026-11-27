'use strict';
// Verziózott, útvonalhoz kötött gyorsítótár: GitHub Pages alkönyvtárban is működik.
const SCOPE=self.registration.scope;
const PREFIX='mitfozzek-pages:'+SCOPE+':';
const CACHE=PREFIX+'3.1-pwa-1';
const PATHS=[
  "./",
  "index.html",
  "app.js",
  "bakery.js",
  "v3.js",
  "pwa.js",
  "recipes.js",
  "style.css",
  "manifest.webmanifest",
  "icons/icon-180.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "photos/airfryer.jpg",
  "photos/bake-cake.jpg",
  "photos/bake-cookie.jpg",
  "photos/bake-fruit.jpg",
  "photos/bake-layer.jpg",
  "photos/bake-nobake.jpg",
  "photos/bake-pogacsa.jpg",
  "photos/bake-roll.jpg",
  "photos/bake-savory.jpg",
  "photos/bake-sticks.jpg",
  "photos/beef.jpg",
  "photos/beigli.jpg",
  "photos/breakfast.jpg",
  "photos/dessert.jpg",
  "photos/easter.jpg",
  "photos/fish.jpg",
  "photos/holiday.jpg",
  "photos/paprikas.jpg",
  "photos/pasta.jpg",
  "photos/plant.jpg",
  "photos/pork.jpg",
  "photos/poultry.jpg",
  "photos/salad.jpg",
  "photos/seafood.jpg",
  "photos/soup.jpg",
  "ocr/core/tesseract-core-lstm.wasm.js",
  "ocr/core/tesseract-core-simd-lstm.wasm.js",
  "ocr/core/tesseract-core-simd.wasm.js",
  "ocr/core/tesseract-core.wasm.js",
  "ocr/lang/eng.traineddata.gz",
  "ocr/tesseract.min.js",
  "ocr/worker.min.js"
];
const URLS=PATHS.map(x=>new URL(x,SCOPE).href);
self.addEventListener('install',event=>{
 event.waitUntil((async()=>{
  const c=await caches.open(CACHE);
  // A cache csak akkor válik használhatóvá, ha az összes erőforrás elérhető.
  try{await c.addAll(URLS.map(u=>new Request(u,{cache:'reload'})));await self.skipWaiting()}
  catch(e){await caches.delete(CACHE);throw e}
 })());
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{for(const key of await caches.keys()){if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key)}await self.clients.claim()})());
});
self.addEventListener('fetch',event=>{
 const req=event.request,u=new URL(req.url);
 if(req.method!=='GET'||!u.href.startsWith(SCOPE))return;
 event.respondWith((async()=>{
  const c=await caches.open(CACHE);
  if(req.mode==='navigate'){const index=await c.match(new URL('index.html',SCOPE).href);if(index)return index;return fetch(req)}
  // Csak a telepítőcsomagban felsorolt statikus állományokat tartjuk gyorsítótárban.
  const key=u.origin+u.pathname;const hit=URLS.includes(key)?await c.match(key):undefined;
  return hit||fetch(req);
 })());
});

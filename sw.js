if(!self.define){let e,i={};const n=(n,s)=>(n=new URL(n+".js",s).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(s,r)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(i[c])return;let o={};const t=e=>n(e,c),f={module:{uri:c},exports:o,require:t};i[c]=Promise.all(s.map((e=>f[e]||t(e)))).then((e=>(r(...e),o)))}}define(["./workbox-3e911b1d"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-Cm8-G_zR.css",revision:null},{url:"assets/index-DtZ40o3S.js",revision:null},{url:"index.html",revision:"8641391b9edc476bb48df1301266d555"},{url:"registerSW.js",revision:"6d296ecf1f6008bdf1aabfba05803740"},{url:"favicon.ico",revision:"512103ceb0877b1b51d84a560f689cc6"},{url:"pwa-64x64.png",revision:"6be9c202c53882bb7b200bd6e7f17fcc"},{url:"pwa-192x192.png",revision:"fa1f4dcc2b1fe1466144d8a6f771051b"},{url:"pwa-512x512.png",revision:"5fc0276dd38aee1d59c1ec06f2dcef35"},{url:"maskable-icon-512x512.png",revision:"555ee220a31ce3aabeca07b92a73080b"},{url:"manifest.webmanifest",revision:"85cc3e0147ba8f5d13b2c98bb916676f"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));

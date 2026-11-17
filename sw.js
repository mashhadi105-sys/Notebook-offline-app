const C='nb-v3',F=['./','index.html','manifest.json','icon.svg'],L=['https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js','https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js','https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F).then(()=>Promise.all(L.map(u=>c.add(u).catch(()=>{}))))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=C&&x!='nb-share').map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);
if(r.method==='POST'&&u.pathname.endsWith('/share-target')){e.respondWith((async()=>{try{const fd=await r.formData(),c=await caches.open('nb-share');for(const k of await c.keys())await c.delete(k);
await c.put('meta',new Response(JSON.stringify({title:fd.get('title')||'',text:fd.get('text')||'',url:fd.get('url')||''})));
let i=0;for(const f of fd.getAll('files')){if(f&&f.name!==undefined){await c.put('f'+i,new Response(f,{headers:{'X-Name':encodeURIComponent(f.name),'Content-Type':f.type||'application/octet-stream'}}));i++}}}catch(_){}
return Response.redirect(new URL('./?share=1',self.registration.scope).href,303)})());return}
if(r.method!=='GET')return;const same=u.origin===location.origin;
e.respondWith(same?fetch(r).then(x=>{const c=x.clone();caches.open(C).then(k=>k.put(r,c));return x}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))):caches.match(r).then(m=>m||fetch(r).then(x=>{const c=x.clone();caches.open(C).then(k=>k.put(r,c));return x})))});

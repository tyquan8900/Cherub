'use strict';
(async()=>{
  async function manifest(){
    try{return await fetch(`data/manifest.json?t=${Date.now()}`,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error(r.status);return r.json()})}
    catch{return {appVersion:'2026.09.10.4'}}
  }
  const m=await manifest();
  window.CHERUB_MANIFEST=m;
  const loadScript=(src)=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.head.appendChild(s)});
  try{
    await loadScript(`js/runtime.js?v=${encodeURIComponent(m.appVersion||Date.now())}`);
    window.CHERUB_RUNTIME_LOADED=true;
    await loadScript(`js/repair.js?v=${encodeURIComponent(m.appVersion||Date.now())}`);
    await loadScript(`js/health.js?v=${encodeURIComponent(m.appVersion||Date.now())}`);
  }catch{alert('Cherub could not load the complete study engine. Refresh once while online.');}
  let current=m.appVersion;
  async function check(){const n=await manifest();if(n.appVersion&&current&&n.appVersion!==current){current=n.appVersion;location.reload();}}
  setInterval(check,300000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)check()});
})();
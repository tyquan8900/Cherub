'use strict';
(async()=>{
  async function manifest(){
    try{return await fetch(`data/manifest.json?t=${Date.now()}`,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error(r.status);return r.json()})}
    catch{return {appVersion:'2026.09.10.4'}}
  }
  const m=await manifest();
  window.CHERUB_MANIFEST=m;
  const s=document.createElement('script');
  s.src=`js/runtime.js?v=${encodeURIComponent(m.appVersion||Date.now())}`;
  s.onload=()=>{
    window.CHERUB_RUNTIME_LOADED=true;
    const p=document.createElement('script');
    p.src=`js/repair.js?v=${encodeURIComponent(m.appVersion||Date.now())}`;
    document.head.appendChild(p);
  };
  s.onerror=()=>alert('Cherub could not load the study engine. Refresh once while online.');
  document.head.appendChild(s);
  let current=m.appVersion;
  async function check(){
    const n=await manifest();
    if(n.appVersion&&current&&n.appVersion!==current){current=n.appVersion;location.reload();}
  }
  setInterval(check,300000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)check()});
})();
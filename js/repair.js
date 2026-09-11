'use strict';
(()=>{
const PK='cherub.progress.v7',SK='cherub.session.v7',NK='cherub.notes.v1',ONK='cherub.object-notes.v1';
const $=id=>document.getElementById(id);
function exportBackup(){let p={};try{p=JSON.parse(localStorage.getItem(PK)||'{}')}catch{}const blob=new Blob([JSON.stringify({appVersion:window.CHERUB_MANIFEST?.appVersion||'unknown',exported:new Date().toISOString(),progress:p,notes:localStorage.getItem(NK)||'',objectNotes:localStorage.getItem(ONK)||''},null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`cherub-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function importBackup(file){if(!file)return;const fr=new FileReader();fr.onload=()=>{try{const x=JSON.parse(fr.result),p=x.progress||x.data||x;if(!Array.isArray(p.attempts))throw Error('invalid');localStorage.setItem(PK,JSON.stringify(p));if(typeof x.notes==='string')localStorage.setItem(NK,x.notes);if(typeof x.objectNotes==='string')localStorage.setItem(ONK,x.objectNotes);localStorage.removeItem(SK);alert('Cherub backup imported. Reloading now.');location.reload()}catch{alert('That file is not a valid Cherub backup.')}};fr.readAsText(file)}
function fixProgress(){const ex=$('exportProgress'),im=$('importProgress'),f=$('importFile');if(ex)ex.onclick=exportBackup;if(im&&f){im.onclick=()=>f.click();f.onchange=e=>importBackup(e.target.files?.[0])}}
function fixNotes(){const b=$('saveNotes'),t=$('notesBox');if(b&&t)b.onclick=()=>{localStorage.setItem(NK,t.value);alert('Notes saved.')}}
function fixSettings(){const ex=$('sx'),im=$('si'),f=$('sf'),reset=$('resetAll');if(ex)ex.onclick=exportBackup;if(im&&f){im.onclick=()=>f.click();f.onchange=e=>importBackup(e.target.files?.[0])}if(reset)reset.onclick=()=>{if(confirm('Reset ALL Cherub progress and notes on this browser?')){localStorage.removeItem(PK);localStorage.removeItem(SK);localStorage.removeItem(NK);localStorage.removeItem(ONK);location.reload()}}}
function fix(){fixProgress();fixNotes();fixSettings()}
const orig=window.show;if(typeof orig==='function')window.show=function(id){orig(id);setTimeout(fix,0)};
setTimeout(fix,0);
})();

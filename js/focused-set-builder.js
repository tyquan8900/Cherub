'use strict';
(() => {
  const domain = { D1: 'Governance', D2: 'Risk Management', D3: 'Program Development', D4: 'Incident Management' };
  function unlocked() { try { return !!JSON.parse(localStorage.getItem('cherub.progress.v7') || '{}').completedPretest; } catch { return false; } }
  function show(focus) {
    const host = document.getElementById('indexContent'); if (!host) return;
    const ready = unlocked(), label = focus.concept || `${domain[focus.domain]} decision path`;
    host.insertAdjacentHTML('afterbegin', `<div class="notice cherub-builder"><h2 style="margin:0 0 6px">Build a focused practice set</h2><p><b>${label}</b> • ${domain[focus.domain] || focus.domain}</p><label>Questions: <b id="setCount">10</b></label><input id="setCountRange" type="range" min="5" max="150" step="5" value="10" style="width:100%"><label>Challenge level: <b id="setLevel">10</b> / 20</label><input id="setLevelRange" type="range" min="1" max="20" value="10" style="width:100%"><p class="tiny">Higher levels use more difficult scenario variants. This set is resumable and keeps answer, confidence, reasoning, and distractor analysis.</p><button class="enginebtn" id="startFocusedSet" ${ready ? '' : 'disabled'}>${ready ? 'Start focused set' : 'Complete 150Q baseline to unlock'}</button></div>`);
    const count = host.querySelector('#setCountRange'), level = host.querySelector('#setLevelRange');
    count.oninput = () => host.querySelector('#setCount').textContent = count.value; level.oninput = () => host.querySelector('#setLevel').textContent = level.value;
    host.querySelector('#startFocusedSet').onclick = () => window.CherubStartFocused({ domain: +focus.domain.replace('D',''), concept: label, path: focus.path, count: +count.value, level: +level.value });
  }
  window.addEventListener('cherub:focus', e => show(e.detail));
})();

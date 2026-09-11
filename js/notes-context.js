'use strict';
(() => {
  const key = 'cherub.object-notes.v1';
  const read = () => { try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; } };
  const idFor = f => [f?.domain || 'D1', f?.concept || f?.path || 'general'].join('::');
  window.addEventListener('cherub:view', e => {
    if (e.detail.id !== 'notes') return;
    const card = document.querySelector('#notes .placeholder');
    if (!card || card.querySelector('#cherubObjectNotes')) return;
    const focus = window.Cherub?.getFocus(), id = idFor(focus), notes = read();
    const title = focus?.concept || focus?.path || 'General study notes';
    card.insertAdjacentHTML('beforeend', `<section id="cherubObjectNotes"><p class="tiny">Attached to: <b>${title}</b>. This note appears again whenever you reopen this learning object.</p><textarea id="cherubNotes" style="width:100%;min-height:260px;padding:12px;border:1px solid #d4deeb;border-radius:9px" placeholder="Write the decision rule, why the best answer wins, and why the tempting option loses."></textarea><p><button class="enginebtn" id="saveCherubNotes">Save note for this object</button></p><div id="noteList"></div></section>`);
    const box = card.querySelector('#cherubNotes'); box.value = notes[id] || '';
    const list = card.querySelector('#noteList');
    list.innerHTML = Object.entries(notes).slice(-8).reverse().map(([k, v]) => `<button class="atlas-link" data-note-id="${k}">${k.split('::').slice(1).join('::')}<b>${v.length} chars</b></button>`).join('');
    card.querySelector('#saveCherubNotes').onclick = () => { const n = read(); n[id] = box.value.trim(); localStorage.setItem(key, JSON.stringify(n)); list.innerHTML = '<p class="tiny">Saved to this knowledge object.</p>'; };
    list.onclick = ev => { const b = ev.target.closest('[data-note-id]'); if (!b) return; const parts = b.dataset.noteId.split('::'); window.Cherub?.setFocus({ domain: parts[0], concept: parts.slice(1).join('::') }); window.show('notes'); };
  });
})();

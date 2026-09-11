'use strict';
(() => {
  window.addEventListener('cherub:view', e => {
    if (e.detail.id !== 'notes') return;
    const card = document.querySelector('#notes .placeholder');
    if (!card || card.querySelector('#cherubNotes')) return;
    const focus = window.Cherub && window.Cherub.getFocus();
    card.insertAdjacentHTML('beforeend', `<p class="tiny">${focus ? `Current learning focus: ${focus.concept}` : 'Choose an Index concept or Study Map path to attach a focus here.'}</p><textarea id="cherubNotes" style="width:100%;min-height:260px;padding:12px;border:1px solid #d4deeb;border-radius:9px" placeholder="Write the decision rule, why the best answer wins, and why the tempting option loses."></textarea><p><button class="enginebtn" id="saveCherubNotes">Save Notes</button></p>`);
    const box = card.querySelector('#cherubNotes'); box.value = localStorage.getItem('cherub.notes.v1') || '';
    card.querySelector('#saveCherubNotes').onclick = () => { localStorage.setItem('cherub.notes.v1', box.value); };
  });
})();

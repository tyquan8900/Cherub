'use strict';
(() => {
  document.addEventListener('click', event => {
    const button = event.target.closest('.atlas-button[data-domain]');
    if (!button || !window.Cherub) return;
    event.preventDefault(); event.stopImmediatePropagation();
    const domain = `D${button.dataset.domain}`;
    window.Cherub.setFocus({ domain, concept: `${domain} decision path` });
    window.Cherub.open('practice');
  }, true);
  window.addEventListener('cherub:view', event => {
    if (event.detail.id !== 'practice') return;
    const focus = window.Cherub.getFocus();
    if (!focus) return;
    const card = document.querySelector('#practice .placeholder');
    if (!card || card.querySelector('.cherub-focus')) return;
    const note = document.createElement('div');
    note.className = 'notice cherub-focus';
    note.innerHTML = `<b>Training focus:</b> ${focus.concept}. Start the pre-test first; after it unlocks, adaptive practice will use this path.`;
    card.prepend(note);
  });
})();

'use strict';
(() => {
  window.addEventListener('cherub:view', e => {
    if (e.detail.id !== 'resources') return;
    const card = document.querySelector('#resources .placeholder');
    if (!card || card.querySelector('.cherub-resources')) return;
    const block = document.createElement('div'); block.className = 'cherub-resources';
    block.innerHTML = '<h3>How to use Cherub</h3><ol><li>Use the Index to understand a term and its connected decision path.</li><li>Use Study Map to see where the decision sits in the larger flow.</li><li>Practice scenarios; record confidence, reasoning, and eliminated choices.</li><li>Return to Progress and then retrain the weak relationship.</li></ol><p class="tiny">Cherub contains original study aids and transformed reference data; it does not include licensed manual pages or recordings.</p>';
    card.append(block);
  });
})();

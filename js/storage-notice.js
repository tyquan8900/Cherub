'use strict';
(() => {
  window.addEventListener('cherub:view', e => {
    if (e.detail.id !== 'settings') return;
    const card = document.querySelector('#settings .placeholder');
    if (!card || card.querySelector('.cherub-storage-notice')) return;
    const notice = document.createElement('div'); notice.className = 'notice cherub-storage-notice';
    notice.innerHTML = '<b>Your progress stays in this browser.</b> Export a backup before changing devices, clearing browser data, or using private browsing.';
    card.prepend(notice);
  });
})();

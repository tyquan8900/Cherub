'use strict';
(() => {
  function render() {
    const target = document.querySelector('#dashboard .lefttop');
    if (!target || target.querySelector('.cherub-next')) return;
    const hasProgress = (() => { try { return JSON.parse(localStorage.getItem('cherub.progress.v7') || '{}').attempts?.length; } catch { return false; } })();
    const card = document.createElement('div'); card.className = 'notice cherub-next';
    card.innerHTML = hasProgress ? '<b>Next best action:</b> Resume your pre-test to complete the baseline.' : '<b>Start here:</b> Take the resumable 150-question cold pre-test. It unlocks your baseline, weak paths, and adaptive practice.';
    target.append(card);
  }
  window.addEventListener('cherub:view', e => { if (e.detail.id === 'dashboard') render(); });
  setTimeout(render, 300);
})();

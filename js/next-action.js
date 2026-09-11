'use strict';
(() => {
  function render() {
    const target = document.querySelector('#dashboard .lefttop');
    if (!target || target.querySelector('.cherub-next')) return;
    let p = {}; try { p = JSON.parse(localStorage.getItem('cherub.progress.v7') || '{}'); } catch {}
    const hasProgress = p.attempts?.length;
    const card = document.createElement('div'); card.className = 'notice cherub-next';
    const misses = (p.attempts || []).filter(a => !a.ok); const weak = misses.sort((a,b) => (b.confidence || 0) - (a.confidence || 0))[0];
    const currentBaseline = p.completedPretest && p.pretestVersion === '20q-cism-format-v2';
    card.innerHTML = !hasProgress ? '<b>Start here:</b> Take the resumable 20-question cold diagnostic. It unlocks your baseline, weak paths, and adaptive practice.' : !currentBaseline ? '<b>Next best action:</b> Resume your 20-question diagnostic to complete the baseline.' : weak ? `<b>Next best action:</b> Retrain <button class="enginebtn secondary" data-weak="1">${weak.concept || weak.relation}</button>` : '<b>Next best action:</b> Start an adaptive practice set.';
    card.querySelector('[data-weak]')?.addEventListener('click', () => window.dispatchEvent(new CustomEvent('cherub:knowledge', { detail: { domain: `D${weak.d}`, concept: weak.concept, path: weak.relation } })));
    target.append(card);
  }
  window.addEventListener('cherub:view', e => { if (e.detail.id === 'dashboard') render(); });
  setTimeout(render, 300);
})();

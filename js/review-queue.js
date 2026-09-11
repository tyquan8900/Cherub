'use strict';
(() => {
  const domain = { 1: 'D1', 2: 'D2', 3: 'D3', 4: 'D4' };
  function render() {
    const host = document.getElementById('progressContent');
    if (!host || host.querySelector('.cherub-review-queue')) return;
    let p = {}; try { p = JSON.parse(localStorage.getItem('cherub.progress.v7') || '{}'); } catch {}
    if (!p.completedPretest || p.pretestVersion !== '20q-neutral-v1') return;
    const attempts = p.attempts || [];
    const priority = attempts.filter(a => !a.ok || (a.ok && a.confidence <= 25)).sort((a, b) => ((b.confidence || 0) - (a.confidence || 0))).slice(0, 12);
    const section = document.createElement('section'); section.className = 'card progresscard cherub-review-queue';
    section.innerHTML = `<h3>Review queue</h3><p class="tiny">Wrong answers come first; low-confidence correct answers remain for reinforcement.</p>${priority.length ? priority.map(a => `<button class="atlas-link" data-concept="${a.concept || a.topic}" data-path="${a.relation || ''}" data-domain="${domain[a.d] || 'D1'}">${a.concept || a.topic}<b>${a.ok ? 'reinforce' : `${a.confidence || 0}% wrong`}</b></button>`).join('') : '<p class="tiny">Your reviewed misses and uncertain correct answers will appear here.</p>'}`;
    host.append(section);
    section.onclick = e => { const b = e.target.closest('[data-concept]'); if (b) window.dispatchEvent(new CustomEvent('cherub:knowledge', { detail: { domain: b.dataset.domain, concept: b.dataset.concept, path: b.dataset.path } })); };
  }
  window.addEventListener('cherub:view', e => { if (e.detail.id === 'progress') setTimeout(render, 140); });
})();

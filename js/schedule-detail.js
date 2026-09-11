'use strict';
(() => {
  const plan = [
    ['Week 1', 'Complete the resumable 150-question cold pre-test.'],
    ['Week 2', 'Take adaptive Hard/Harder checkpoints every 2–3 days.'],
    ['Weeks 3–6', 'Take one fresh 150-question exam each week, in one sitting.']
  ];
  window.addEventListener('cherub:view', e => {
    if (e.detail.id !== 'schedule') return;
    const card = document.querySelector('#schedule .placeholder');
    if (!card || card.querySelector('.cherub-schedule')) return;
    const block = document.createElement('div'); block.className = 'cherub-schedule';
    block.innerHTML = plan.map(([week, detail]) => `<div class="topicline" style="padding:10px 0;border-bottom:1px solid #edf0f4"><b>${week}</b><span>${detail}</span></div>`).join('');
    card.append(block);
  });
})();

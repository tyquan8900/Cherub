'use strict';
(() => {
  const key = 'cherub.schedule-start.v1';
  const fmt = date => date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  window.addEventListener('cherub:view', e => {
    if (e.detail.id !== 'schedule') return;
    setTimeout(() => {
      const card = document.querySelector('#schedule .placeholder');
      if (!card || card.querySelector('.cherub-schedule-state')) return;
      const saved = localStorage.getItem(key) || new Date().toISOString().slice(0, 10);
      const block = document.createElement('section'); block.className = 'card progresscard cherub-schedule-state';
      block.innerHTML = `<h2>Study timeline</h2><p class="tiny">Choose the day you start the cold baseline. Cherub will calculate your six-week sequence; changing it does not erase progress.</p><label>Start date <input id="cherubStartDate" type="date" value="${saved}"></label><div id="cherubTimeline" style="margin-top:12px"></div>`;
      card.prepend(block);
      const draw = () => { const start = new Date(`${block.querySelector('#cherubStartDate').value}T12:00:00`); const rows = [[0, 'Week 1', '150-question cold baseline'], [7, 'Week 2', 'Adaptive focused checkpoints'], [14, 'Week 3', 'Fresh 150-question full exam'], [21, 'Week 4', 'Fresh 150-question full exam'], [28, 'Week 5', 'Fresh 150-question full exam'], [35, 'Week 6', 'Fresh 150-question full exam']]; block.querySelector('#cherubTimeline').innerHTML = rows.map(([days, week, detail]) => { const d = new Date(start); d.setDate(d.getDate() + days); return `<div class="topicline"><span><b>${week}</b> — ${detail}</span><span class="epill">${fmt(d)}</span></div>`; }).join(''); };
      block.querySelector('#cherubStartDate').onchange = e => { localStorage.setItem(key, e.target.value); draw(); }; draw();
    }, 90);
  });
})();

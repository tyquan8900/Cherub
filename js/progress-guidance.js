'use strict';
(() => {
  window.addEventListener('cherub:view', e => {
    if (e.detail.id !== 'progress') return;
    setTimeout(() => {
      const host = document.getElementById('progressContent');
      if (!host || host.querySelector('.cherub-progress-guide')) return;
      const guide = document.createElement('div'); guide.className = 'notice cherub-progress-guide';
      guide.innerHTML = '<b>How to use your results:</b> Accuracy shows what you got right. Confidence shows calibration; fresh-question coverage and pace show whether the result is durable. Use the Study Map to retrain the relationship behind repeated misses.';
      host.prepend(guide);
    }, 80);
  });
})();

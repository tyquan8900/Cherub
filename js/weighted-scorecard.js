'use strict';
(() => {
  const domains = [
    { id: 1, name: 'Governance', weight: 17, planned: 26, t600: 18, t650: 20 },
    { id: 2, name: 'Risk Management', weight: 20, planned: 30, t600: 20, t650: 23 },
    { id: 3, name: 'Program Development', weight: 33, planned: 49, t600: 33, t650: 37 },
    { id: 4, name: 'Incident Management', weight: 30, planned: 45, t600: 30, t650: 34 },
  ];
  const progress = () => {
    try { return JSON.parse(localStorage.getItem('cherub.progress.v7') || '{}'); }
    catch { return {}; }
  };
  const band = (correct, planned, row) => {
    if (!planned) return 'Not started';
    const normalized = correct / planned;
    if (normalized >= row.t650 / row.planned) return '650 target';
    if (normalized >= row.t600 / row.planned) return '600–649 target';
    return 'Below 600 target';
  };
  function render() {
    const host = document.getElementById('progressContent');
    if (!host || host.querySelector('.cherub-weighted-scorecard')) return;
    const attempts = progress().attempts || [];
    const rows = domains.map(row => {
      const a = attempts.filter(x => +x.d === row.id);
      const correct = a.filter(x => x.ok).length;
      const shownCorrect = a.length ? correct : '—';
      const status = a.length ? band(correct, a.length, row) : 'Target pending baseline';
      const percent = a.length ? Math.round(correct / a.length * 100) : 0;
      return `<tr><td><b>D${row.id}</b><br><span class="tiny">${row.name}</span></td><td>${row.weight}%<br><span class="tiny">${row.planned} planned</span></td><td><b>${shownCorrect}</b> / ${a.length || '—'}<br><span class="tiny">${a.length ? percent + '%' : 'no answers yet'}</span></td><td>${row.t600} / ${row.planned}</td><td>${row.t650} / ${row.planned}</td><td><span class="epill">${status}</span></td></tr>`;
    }).join('');
    const correct = attempts.filter(x => x.ok).length;
    const weighted = domains.reduce((sum, row) => {
      const a = attempts.filter(x => +x.d === row.id);
      return sum + (a.length ? (a.filter(x => x.ok).length / a.length) * row.weight : 0);
    }, 0);
    const covered = domains.filter(row => attempts.some(x => +x.d === row.id)).reduce((sum, row) => sum + row.weight, 0);
    const readiness = covered ? Math.round(200 + (weighted / covered) * 600) : null;
    const card = document.createElement('section');
    card.className = 'card progresscard cherub-weighted-scorecard';
    card.innerHTML = `<h2 style="margin-top:0">Weighted CISM readiness</h2><p class="tiny">Cherub planning model: current domain weights 17% / 20% / 33% / 30%. The 600 and 650 lines are study-readiness targets, not ISACA’s unpublished scaled-score conversion.</p><div class="progressgrid"><div class="card progresscard"><b>Current Cherub readiness</b><div style="font-size:28px;font-weight:800;margin:8px 0">${readiness ?? '—'}</div><span class="tiny">${attempts.length ? `${correct} correct of ${attempts.length} answered` : 'Complete the baseline to establish your score.'}</span></div><div class="card progresscard"><b>600 readiness line</b><div style="font-size:28px;font-weight:800;margin:8px 0">101 / 150</div><span class="tiny">About 67% weighted accuracy</span></div><div class="card progresscard"><b>650 readiness line</b><div style="font-size:28px;font-weight:800;margin:8px 0">114 / 150</div><span class="tiny">About 75% weighted accuracy</span></div></div><div style="overflow:auto;margin-top:12px"><table style="width:100%;border-collapse:collapse;text-align:left"><thead><tr><th>Domain</th><th>Weight</th><th>Current</th><th>600 line</th><th>650 line</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></div>`;
    host.prepend(card);
  }
  window.addEventListener('cherub:view', e => { if (e.detail.id === 'progress') setTimeout(render, 25); });
})();

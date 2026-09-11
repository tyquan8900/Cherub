'use strict';
(() => {
  const domain = {
    1: { name: 'Governance', color: '#2f72e6', steps: ['Business value', 'Authority', 'Strategy', 'Outcome metrics'] },
    2: { name: 'Risk Management', color: '#2eb06a', steps: ['Risk context', 'Risk criteria', 'Owner decision', 'Monitor & reassess'] },
    3: { name: 'Program Development', color: '#8b42d3', steps: ['Requirements', 'Control design', 'Operate', 'Test effectiveness'] },
    4: { name: 'Incident Management', color: '#e4770d', steps: ['Readiness', 'Classify', 'Contain', 'Recover & improve'] }
  };

  const relationships = {
    1: ['Business objectives → Governance / authority → Security strategy → Metrics / reporting', 'Enterprise governance → Decision rights → Accountability → Security program oversight', 'Security strategy → Policies / standards → Business alignment → Leadership reporting'],
    2: ['Threat / vulnerability → Risk assessment → Risk treatment → Residual risk → Risk owner → Monitoring / reassessment', 'Risk capacity → Risk appetite → Risk tolerance → Risk criteria', 'Asset criticality → Threat scenario → Risk analysis → Risk response → Risk acceptance'],
    3: ['Requirements → Program objective → Control design → Implementation → Operation → Testing → Effectiveness → Metrics', 'Business requirements → Security architecture → Policies / procedures → Control operation', 'Awareness → Third-party requirements → Control evidence → Program metrics → Improvement'],
    4: ['BIA → RTO / RPO → Recovery strategy → Recovery plan → Recovery testing → Measured capability → Deficiency → Corrective action → Retest', 'Incident readiness → Classification → Containment → Eradication → Recovery → Post-incident review', 'Incident response plan → Business continuity plan → Disaster recovery plan → Training / testing → Corrective action']
  };

  function score(path) {
    try {
      const progress = JSON.parse(localStorage.getItem('cherub.progress.v7') || '{}');
      const attempts = (progress.attempts || []).filter(a => a.relation === path);
      if (!attempts.length) return '--';
      const correct = attempts.filter(a => a.ok).length / attempts.length;
      const overconfident = attempts.filter(a => !a.ok && a.confidence === 100).length;
      return `${Math.max(0, Math.round(correct * 100 - overconfident * 7))}%`;
    } catch { return '--'; }
  }

  function render() {
    const host = document.getElementById('mapContent');
    if (!host) return;
    host.innerHTML = `<style>
      .cherub-atlas{display:grid;gap:14px}.atlas-hero{padding:19px;border-radius:14px;background:linear-gradient(135deg,#10223b,#285fa9);color:#fff}.atlas-hero h2{margin:0 0 7px;font-size:22px}.atlas-hero p{margin:0;color:#d8e7ff;line-height:1.5}.atlas-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.atlas-card{padding:16px;border-left:5px solid var(--atlas-color)}.atlas-top{display:flex;justify-content:space-between;gap:8px}.atlas-card h3{margin:5px 0 10px;font-size:16px}.atlas-badge{background:#f1f5f9;border-radius:999px;padding:5px 8px;font-size:11px;font-weight:800}.atlas-step{display:grid;grid-template-columns:24px 1fr;gap:8px;margin:8px 0;font-size:12px}.atlas-number{display:grid;place-items:center;width:22px;height:22px;border-radius:50%;background:var(--atlas-color);color:#fff;font-size:11px;font-weight:800}.atlas-link{padding:8px 9px;margin:4px 0;border:1px solid #dce6f3;border-radius:8px;background:#fafcff;font-size:11px}.atlas-link b{float:right}.atlas-button{margin-top:12px;border:0;border-radius:8px;background:#edf3ff;color:#1f5bb9;font-weight:800;padding:9px 11px;cursor:pointer}@media(max-width:760px){.atlas-grid{grid-template-columns:1fr}}</style>
      <div class="cherub-atlas"><div class="atlas-hero"><h2>Security Leadership Map</h2><p>Follow the verified four-domain source paths. Click a step or relationship to open its lesson, connected terms, and focused training route.</p></div><div class="atlas-grid">${[1,2,3,4].map(id => `<article class="card atlas-card" style="--atlas-color:${domain[id].color}"><div class="atlas-top"><div><span class="epill">Domain ${id}</span><h3>${domain[id].name}</h3></div><span class="atlas-badge">${relationships[id].length} linked paths</span></div>${domain[id].steps.map((step, i) => `<button class="atlas-step atlas-link" data-step="${step}" data-map-domain="D${id}"><span class="atlas-number">${i + 1}</span><span>${step}</span></button>`).join('')}<div>${relationships[id].map(path => `<button class="atlas-link" data-path="${path}" data-map-domain="D${id}">${path}<b>${score(path)}</b></button>`).join('')}</div><button class="atlas-button" data-domain="${id}">Train this decision path</button></article>`).join('')}</div></div>`;
    host.querySelectorAll('[data-domain]').forEach(button => button.onclick = () => window.show('practice'));
    host.querySelectorAll('[data-path]').forEach(button => button.onclick = () => window.dispatchEvent(new CustomEvent('cherub:knowledge', { detail: { domain: button.dataset.mapDomain, path: button.dataset.path } })));
    host.querySelectorAll('[data-step]').forEach(button => button.onclick = () => window.dispatchEvent(new CustomEvent('cherub:knowledge', { detail: { domain: button.dataset.mapDomain, concept: button.dataset.step } })));
  }

  const wait = setInterval(() => {
    if (typeof window.show !== 'function') return;
    clearInterval(wait);
    const originalShow = window.show;
    window.show = id => { originalShow(id); if (id === 'map') render(); };
  }, 50);
})();

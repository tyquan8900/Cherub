'use strict';
(() => {
  const domain = {
    1: { name: 'Governance', color: '#2f72e6', steps: ['Business value', 'Authority', 'Strategy', 'Outcome metrics'] },
    2: { name: 'Risk Management', color: '#2eb06a', steps: ['Risk context', 'Risk criteria', 'Owner decision', 'Monitor & reassess'] },
    3: { name: 'Information Security Program', color: '#8b42d3', steps: ['Requirements', 'Control design', 'Operate', 'Test effectiveness'] },
    4: { name: 'Incident Management', color: '#e4770d', steps: ['Readiness', 'Classify', 'Contain', 'Recover & improve'] }
  };

  const relationships = {
    1: ['Business objectives → Governance / authority → Security strategy → Metrics / reporting', 'Enterprise governance → Decision rights → Accountability → Security program oversight', 'Security strategy → Policies / standards → Business alignment → Leadership reporting', 'Due care → Due diligence → Business case → Executive reporting', 'Policy governance → Guidelines → Procedures → Governed exceptions'],
    2: ['Threat / vulnerability → Risk assessment → Risk treatment → Residual risk → Risk owner → Monitoring / reassessment', 'Risk capacity → Risk appetite → Risk tolerance → Risk criteria', 'Asset criticality → Threat scenario → Risk analysis → Risk response → Risk acceptance', 'Risk register → Risk escalation → Accountable decision → Risk monitoring', 'Third-party assurance → Requirements → Risk criteria → Risk owner decision'],
    3: ['Requirements → Program objective → Control design → Implementation → Operation → Testing → Effectiveness → Metrics', 'Business requirements → Security architecture → Policies / procedures → Control operation', 'Awareness → Third-party requirements → Control evidence → Program metrics → Improvement', 'Data protection → Security standards → Control evidence → Effectiveness', 'Change management → Change integration → Control operation → Resilience'],
    4: ['BIA → RTO / RPO → Recovery strategy → Recovery plan → Recovery testing → Measured capability → Deficiency → Corrective action → Retest', 'Incident readiness → Classification → Containment → Eradication → Recovery → Post-incident review', 'Incident response plan → Business continuity plan → Disaster recovery plan → Training / testing → Corrective action', 'Evidence handling → Incident classification → Notification → Authorized communication', 'Disaster declaration → Recovery strategy → Recovery validation → Post-incident improvement']
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
  function state(path) {
    const value = score(path);
    if (value === '--') return 'new';
    const number = +value.replace('%', '');
    return number >= 75 ? 'mastered' : number >= 60 ? 'building' : 'review';
  }

  function render() {
    const host = document.getElementById('mapContent');
    if (!host) return;
    host.innerHTML = `<style>
      .cherub-atlas{display:grid;gap:16px}.atlas-hero{padding:22px;border-radius:18px;background:linear-gradient(135deg,#18385f,#4b87e8 55%,#7a55d8);color:#fff;box-shadow:0 12px 24px rgba(47,114,230,.2)}.atlas-hero h2{margin:0 0 7px;font-size:24px}.atlas-hero p{margin:0;color:#eef5ff;line-height:1.5}.atlas-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.atlas-card{padding:17px;border:1px solid color-mix(in srgb,var(--atlas-color) 24%,#fff);border-left:6px solid var(--atlas-color);background:linear-gradient(145deg,#fff,#f9fbff);box-shadow:0 8px 18px rgba(26,54,93,.08)}.atlas-top{display:flex;justify-content:space-between;gap:8px}.atlas-card h3{margin:5px 0 10px;font-size:17px}.atlas-badge{background:color-mix(in srgb,var(--atlas-color) 13%,#fff);color:#173151;border-radius:999px;padding:5px 8px;font-size:11px;font-weight:800}.atlas-step{display:grid;grid-template-columns:24px 1fr;gap:8px;margin:8px 0;font-size:12px}.atlas-number{display:grid;place-items:center;width:22px;height:22px;border-radius:50%;background:var(--atlas-color);color:#fff;font-size:11px;font-weight:800}.atlas-link{padding:9px 10px;margin:5px 0;border:1px solid #dce6f3;border-radius:10px;background:#fff;color:#173151;font-size:11px;text-align:left;cursor:pointer;transition:transform .15s,box-shadow .15s,border-color .15s}.atlas-link:hover,.atlas-link:focus-visible{transform:translateY(-1px);border-color:var(--atlas-color);box-shadow:0 6px 14px rgba(31,74,130,.12);outline:3px solid color-mix(in srgb,var(--atlas-color) 22%,transparent)}.atlas-link b{float:right}.atlas-path{position:relative;padding-right:70px}.atlas-path:after{content:'Open ↗';position:absolute;right:10px;bottom:8px;font-size:10px;font-weight:800;color:var(--atlas-color)}.atlas-path.mastered{background:#f1fff7;border-color:#83d8a8}.atlas-path.building{background:#fffbe9;border-color:#f2cf63}.atlas-path.review{background:#fff3ef;border-color:#f3a27d}.atlas-path.new{background:#f8fbff}.atlas-button{width:100%;margin-top:12px;border:0;border-radius:10px;background:color-mix(in srgb,var(--atlas-color) 14%,#fff);color:#173151;font-weight:800;padding:10px 11px;cursor:pointer;transition:transform .15s}.atlas-button:hover{transform:translateY(-1px)}@media(max-width:760px){.atlas-grid{grid-template-columns:1fr}}</style>
      <div class="cherub-atlas"><div class="atlas-hero"><h2>Security Leadership Map</h2><p>Choose a colorful path, open its lesson, then turn it into focused practice. Green means strong, gold means building, and coral means review.</p></div><div class="atlas-grid">${[1,2,3,4].map(id => `<article class="card atlas-card" style="--atlas-color:${domain[id].color}"><div class="atlas-top"><div><span class="epill">Domain ${id}</span><h3>${domain[id].name}</h3></div><span class="atlas-badge">${relationships[id].length} paths</span></div>${domain[id].steps.map((step, i) => `<button class="atlas-step atlas-link" data-step="${step}" data-map-domain="D${id}"><span class="atlas-number">${i + 1}</span><span>${step}<small style="display:block;color:#5b6b82">Open lesson</small></span></button>`).join('')}<div>${relationships[id].map(path => `<button class="atlas-link atlas-path ${state(path)}" data-path="${path}" data-map-domain="D${id}">${path}<b>${score(path)}</b></button>`).join('')}</div><button class="atlas-button" data-domain="${id}">Practice this path</button></article>`).join('')}</div></div>`;
    host.querySelectorAll('[data-domain]').forEach(button => button.onclick = () => { const d = +button.dataset.domain; window.dispatchEvent(new CustomEvent('cherub:focus', { detail: { domain: `D${d}`, path: relationships[d][0] } })); });
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

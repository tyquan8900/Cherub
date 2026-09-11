'use strict';
(() => {
  const visual = {
    D1: ['Governance decision map', 'Business objective → Decision right → Security strategy → Metric / leadership decision', [['Objective alignment table','Business outcome, owner, measure'],['Accountability map','Authority and escalation path']]],
    D2: ['Risk decision chain', 'Threat / weakness → Assess → Treat → Residual risk → Owner monitors', [['Risk register','Risk, treatment, accountable owner'],['Residual-risk comparison','Whether treatment reduced exposure enough']]],
    D3: ['Control effectiveness chain', 'Requirement → Control design → Operation → Evidence → Effectiveness → Metric', [['Design requirement','What the control must achieve'],['Test results','Evidence, deficiency, and corrective action']]],
    D4: ['Recovery objectives and incident flow', 'BIA → RTO / RPO → Recovery strategy → Plan and test → Correct and retest', [['Critical process / dependency','Recovery priority'],['Maximum downtime','RTO restoration-time target'],['Acceptable data loss','RPO recovery-point target'],['Test deficiency','Corrective action and retest']]]
  };
  function openVisual(domain, card, selected) {
    const v = visual[domain] || visual.D4;
    card.querySelector('.cherub-visual-aid')?.remove();
    const box = document.createElement('section'); box.className='card cherub-visual-aid'; box.style.marginTop='14px'; box.style.padding='15px';
    box.innerHTML = `<h2>${v[0]}</h2>${selected?`<p class="tiny"><b>Opened reference:</b> ${selected}</p>`:''}<p class="tiny">Original Cherub study visual based on the mapped relationship data.</p><div style="display:flex;flex-wrap:wrap;gap:7px;align-items:center;margin:12px 0">${v[1].split('→').map((x,i)=>`<span style="display:flex;align-items:center;gap:7px"><b style="padding:8px 10px;border-radius:9px;background:${i===0?'#e7f0ff':i===v[1].split('→').length-1?'#e8f8ee':'#f4efff'};font-size:12px">${x.trim()}</b>${i<v[1].split('→').length-1?'<strong style="color:#2f72e6">→</strong>':''}</span>`).join('')}</div><table style="width:100%;border-collapse:collapse;font-size:13px"><thead><tr><th style="padding:8px;border:1px solid #dce6f3;background:#edf5ff;text-align:left">Visual reference</th><th style="padding:8px;border:1px solid #dce6f3;background:#edf5ff;text-align:left">What it shows</th></tr></thead><tbody>${v[2].map(r=>`<tr${selected&&r[0].toLowerCase().includes(selected.split(' ')[0].toLowerCase())?' style="background:#fff8df"':''}><td style="padding:8px;border:1px solid #dce6f3">${r[0]}</td><td style="padding:8px;border:1px solid #dce6f3">${r[1]}</td></tr>`).join('')}</tbody></table>`;
    card.append(box); box.scrollIntoView({behavior:'smooth',block:'nearest'});
  }
  window.CherubVisualCatalog = { open(domain, selected) { window.show('resources'); setTimeout(() => { const card=document.querySelector('#resources .placeholder'); if (card) openVisual(domain, card, selected); }, 80); } };
  window.addEventListener('cherub:view', e => {
    if (e.detail.id !== 'resources') return;
    const card = document.querySelector('#resources .placeholder');
    if (!card || card.querySelector('.cherub-resources')) return;
    const block = document.createElement('div'); block.className = 'cherub-resources';
    block.innerHTML = '<h3>How to use Cherub</h3><ol><li>Use the Index to understand a term and its connected decision path.</li><li>Use Study Map to see where the decision sits in the larger flow.</li><li>Practice scenarios; record confidence, reasoning, and eliminated choices.</li><li>Return to Progress and then retrain the weak relationship.</li></ol><p class="tiny">Cherub contains original study aids and transformed reference data; it does not include licensed manual pages or recordings.</p><section class="card cherub-visual-catalog" style="margin-top:14px;padding:14px"><h2>Visual learning catalog</h2><p class="tiny">Original Cherub diagrams and decision tables organized by domain.</p><button class="enginebtn secondary" data-visual-domain="D1">D1 Governance</button> <button class="enginebtn secondary" data-visual-domain="D2">D2 Risk</button> <button class="enginebtn secondary" data-visual-domain="D3">D3 Program</button> <button class="enginebtn secondary" data-visual-domain="D4">D4 Incident / Recovery</button></section>';
    card.append(block);
    block.insertAdjacentHTML('afterbegin', '<section class="card" style="margin-top:14px;padding:14px"><h2>Source references and rights</h2><p class="tiny"><b>ISACA-owned reference material:</b> CISM content-outline domains, index, glossary, acronym and subknowledge recordings supplied by the learner. These are referenced for scope alignment only and are not hosted, reproduced, or distributed by Cherub.</p><p class="tiny"><b>Cherub-owned study material:</b> original relationship maps, diagrams, tables, explanations, and practice questions built from transformed learning relationships.</p></section>');
    block.insertAdjacentHTML('afterbegin', '<section class="card" style="margin-top:14px;padding:14px"><h2>Four-domain relationship overview</h2><img src="assets/domain-relationship-overview.svg" alt="Original Cherub diagram connecting the four CISM study domains" style="display:block;width:100%;height:auto;border-radius:10px;border:1px solid #dce6f3"><p class="tiny">Domain scope aligned to the ISACA CISM content outline. Visual interpretation created by Cherub; it is not an ISACA figure.</p></section>');
    block.querySelectorAll('[data-visual-domain]').forEach(button => button.onclick = () => openVisual(button.dataset.visualDomain, card));
  });
})();

'use strict';
(() => {
  const visual = {
    D1: ['Governance decision map', 'Business objective → Decision right → Security strategy → Metric / leadership decision', [['Objective alignment table','Business outcome, owner, measure'],['Accountability map','Authority and escalation path']]],
    D2: ['Risk decision chain', 'Threat / weakness → Assess → Treat → Residual risk → Owner monitors', [['Risk register','Risk, treatment, accountable owner'],['Residual-risk comparison','Whether treatment reduced exposure enough']]],
    D3: ['Control effectiveness chain', 'Requirement → Control design → Operation → Evidence → Effectiveness → Metric', [['Design requirement','What the control must achieve'],['Test results','Evidence, deficiency, and corrective action']]],
    D4: ['Recovery objectives and incident flow', 'BIA → RTO / RPO → Recovery strategy → Plan and test → Correct and retest', [['Critical process / dependency','Recovery priority'],['Maximum downtime','RTO restoration-time target'],['Acceptable data loss','RPO recovery-point target'],['Test deficiency','Corrective action and retest']]]
  };
  const variants = {
    D1: {
      'Business-objective alignment table':'Business objectives → Security strategy → Governance framework → Executive reporting',
      'Decision-rights and accountability diagram':'Decision rights → Accountable owner → Responsible role → Escalation decision',
      'Leadership metrics trend chart':'Security metric → Trend / exception → Leadership review → Business decision'
    },
    D2: {
      'Risk register and treatment table':'Risk scenario → Risk analysis → Treatment decision → Risk register → Owner',
      'Inherent-to-residual risk comparison chart':'Inherent risk → Control selection → Control effectiveness → Residual risk → Acceptance',
      'Risk trend and reassessment dashboard':'Risk criteria → Monitoring signal → Reassessment → Escalation → Owner decision'
    },
    D3: {
      'Control design-to-evidence table':'Business requirement → Control design → Control operation → Evidence → Test result',
      'Control effectiveness test-results chart':'Test scope → Evidence review → Effectiveness result → Deficiency → Corrective action',
      'Program metrics trend dashboard':'Program objective → Metric → Leadership trend → Improvement decision → Program update'
    },
    D4: {
      'BIA impact and dependency table':'Business process → Impact / dependency → Priority → RTO / RPO → Recovery strategy',
      'RTO/RPO recovery-objective matrix':'Disruption → Acceptable data loss (RPO) → Maximum downtime (RTO) → Recovery target',
      'Recovery-test results and deficiency trend chart':'Recovery test → Measured result → Gap / deficiency → Corrective action → Retest'
    }
  };
  const official = {
    D1: [{ label:'COBIT 2019 structural governance framework', url:'https://www.linkedin.com/pulse/introduction-cobit-2019-framework-effective-governance-n4oce' }],
    D2: [{ label:'NIST SP 800-30 Rev. 1 threat and risk methodology', url:'https://csrc.nist.gov/pubs/sp/800/30/r1/final' }],
    D3: [{ label:'ISO/IEC 27001 ISMS operational cycle', url:'https://www.iso.org/standard/27001' }, { label:'CIS Controls continuous control engineering', url:'https://www.cisecurity.org/controls/cis-controls-list' }],
    D4: [{ label:'NIST SP 800-61 Rev. 2 incident-handling phases', url:'https://csrc.nist.gov/pubs/sp/800/61/r2/final' }, { label:'Ready.gov business-impact-analysis timeline', url:'https://www.ready.gov/business-impact-analysis' }]
  };
  function openVisual(domain, card, selected, focus) {
    const v = visual[domain] || visual.D4;
    card.querySelector('.cherub-visual-aid')?.remove();
    const box = document.createElement('section'); box.className='card cherub-visual-aid'; box.style.marginTop='14px'; box.style.padding='15px';
    const src=official[domain]||official.D4;
    const nearby=focus?.related||[];
    const offset=focus?.variant||0;
    const rotated=nearby.slice(offset).concat(nearby.slice(0,offset));
    const focusedFlow = focus?.concept ? [focus.concept, selected, ...rotated.slice(0,2)].filter(Boolean).join(' → ') : '';
    const flow=focusedFlow||(variants[domain]||{})[selected]||v[1];
    const steps=flow.split('→').map(x=>x.trim());
    const width=Math.max(720, steps.length*175), height=250;
    const boxes=steps.map((step,i)=>{const x=22+i*(width-170)/(Math.max(steps.length-1,1));const fill=i===0?'#dcecff':i===steps.length-1?'#dff6e5':'#eee7ff';const text=step.length>19?step.replace(' ','\n'):step;return `<g><rect x="${x}" y="80" width="148" height="82" rx="16" fill="${fill}" stroke="#3a74cf" stroke-width="2"/><text x="${x+74}" y="112" text-anchor="middle" font-family="system-ui, sans-serif" font-size="15" font-weight="700" fill="#18375e">${text.split('\n').map((line,j)=>`<tspan x="${x+74}" dy="${j?'19':'0'}">${line}</tspan>`).join('')}</text>${i<steps.length-1?`<path d="M ${x+148} 121 L ${x+170} 121" stroke="#2876d2" stroke-width="4" marker-end="url(#arrow)"/>`:''}</g>`}).join('');
    const title=focus?.concept ? `${focus.concept}: ${selected||'connected decision map'}` : (selected||v[0]);
    const svg=`<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${title} diagram" style="display:block;width:100%;min-width:700px;background:linear-gradient(135deg,#f9fcff,#f1edff);border:1px solid #d8e4f2;border-radius:14px"><defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#2876d2"/></marker></defs><text x="22" y="38" font-family="system-ui, sans-serif" font-size="19" font-weight="800" fill="#142d52">${title}</text><text x="22" y="61" font-family="system-ui, sans-serif" font-size="13" fill="#49617f">Start at blue, follow the connected decision sequence, and finish at green.</text>${boxes}</svg>`;
    const sourceImage = domain === 'D2' ? `<figure style="margin:16px 0"><img src="assets/nist-sp800-30-risk-methodology.png" alt="NIST SP 800-30 risk assessment methodology flowchart" style="display:block;width:min(100%,660px);margin:auto;border:1px solid #d8e4f2;border-radius:12px;background:white"><figcaption class="tiny" style="margin-top:7px">External visual: <a href="https://commons.wikimedia.org/wiki/File:NIST_SP_800-30_Figure_3-1.png" target="_blank" rel="noopener noreferrer">NIST SP 800-30 Figure 3-1, via Wikimedia Commons ↗</a>. Marked there as U.S. Government/public-domain material; source page and attribution are linked.</figcaption></figure>` : '';
    box.innerHTML = `<h2>${v[0]}</h2>${selected?`<p class="tiny"><b>Opened visual:</b> ${selected}</p>`:''}<p class="tiny">This is an original Cherub relationship diagram — not a copied exam figure.</p><div style="overflow-x:auto;margin:12px 0">${svg}</div>${sourceImage}<p class="tiny"><b>Domain visual blueprints:</b> ${src.map(s=>`<a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.label} ↗</a>`).join(' &nbsp;•&nbsp; ')}</p><table style="width:100%;border-collapse:collapse;font-size:13px"><thead><tr><th style="padding:8px;border:1px solid #dce6f3;background:#edf5ff;text-align:left">Visual reference</th><th style="padding:8px;border:1px solid #dce6f3;background:#edf5ff;text-align:left">What it shows</th></tr></thead><tbody>${v[2].map(r=>`<tr${selected&&r[0].toLowerCase().includes(selected.split(' ')[0].toLowerCase())?' style="background:#fff8df"':''}><td style="padding:8px;border:1px solid #dce6f3">${r[0]}</td><td style="padding:8px;border:1px solid #dce6f3">${r[1]}</td></tr>`).join('')}</tbody></table>`;
    card.append(box); box.scrollIntoView({behavior:'smooth',block:'nearest'});
  }
  window.CherubVisualCatalog = { open(domain, selected, focus) { window.show('resources'); setTimeout(() => { const card=document.querySelector('#resources .placeholder'); if (card) openVisual(domain, card, selected, focus); }, 80); } };
  window.addEventListener('cherub:view', e => {
    if (e.detail.id !== 'resources') return;
    const card = document.querySelector('#resources .placeholder');
    if (!card || card.querySelector('.cherub-resources')) return;
    const block = document.createElement('div'); block.className = 'cherub-resources';
    block.innerHTML = '<h3>How to use Cherub</h3><ol><li>Use the Index to understand a term and its connected decision path.</li><li>Use Study Map to see where the decision sits in the larger flow.</li><li>Practice scenarios; record confidence, reasoning, and eliminated choices.</li><li>Return to Progress and then retrain the weak relationship.</li></ol><p class="tiny">Cherub contains original study aids and transformed reference data; it does not include licensed manual pages or recordings.</p><section class="card cherub-visual-catalog" style="margin-top:14px;padding:14px"><h2>Visual learning catalog</h2><p class="tiny">Open a domain map, then open its attributed official public reference.</p><button class="enginebtn secondary" data-visual-domain="D1">D1 Governance</button> <button class="enginebtn secondary" data-visual-domain="D2">D2 Risk</button> <button class="enginebtn secondary" data-visual-domain="D3">D3 Program</button> <button class="enginebtn secondary" data-visual-domain="D4">D4 Incident / Recovery</button></section>';
    card.append(block);
    block.insertAdjacentHTML('afterbegin', '<section class="card" style="margin-top:14px;padding:14px"><h2>Source references and rights</h2><p class="tiny"><b>ISACA-owned reference material:</b> CISM content-outline domains, index, glossary, acronym and subknowledge recordings supplied by the learner. These are referenced for scope alignment only and are not hosted, reproduced, or distributed by Cherub.</p><p class="tiny"><b>Cherub-owned study material:</b> original relationship maps, diagrams, tables, explanations, and practice questions built from transformed learning relationships.</p></section>');
    block.insertAdjacentHTML('afterbegin', '<section class="card" style="margin-top:14px;padding:14px"><h2>Four-domain relationship overview</h2><img src="assets/domain-relationship-overview.svg" alt="Original Cherub diagram connecting the four CISM study domains" style="display:block;width:100%;height:auto;border-radius:10px;border:1px solid #dce6f3"><p class="tiny">Domain scope aligned to the ISACA CISM content outline. Visual interpretation created by Cherub; it is not an ISACA figure.</p></section>');
    block.querySelectorAll('[data-visual-domain]').forEach(button => button.onclick = () => openVisual(button.dataset.visualDomain, card));
  });
})();

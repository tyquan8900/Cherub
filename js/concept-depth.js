'use strict';
(() => {
  const sequence = {
    D1: ['Business objectives', 'Governance framework', 'Decision rights', 'Security strategy', 'Policies', 'Standards', 'Security metrics', 'Executive reporting'],
    D2: ['Risk capacity', 'Risk appetite', 'Risk tolerance', 'Risk criteria', 'Risk assessment', 'Risk analysis', 'Risk treatment', 'Residual risk', 'Risk owner', 'Risk monitoring'],
    D3: ['Program objectives', 'Information security program', 'Security architecture', 'Control design', 'Control implementation', 'Control operation', 'Control evidence', 'Control effectiveness', 'Program metrics'],
    D4: ['Incident readiness', 'Incident response plan', 'Incident classification', 'Containment authority', 'Containment', 'Eradication', 'Recovery', 'Post-incident review', 'Corrective action']
  };
  const lens = {
    D1: 'Ask who is accountable, how the decision aligns to business objectives, and what leadership needs to decide.',
    D2: 'Ask what risk evidence is needed before treatment, who owns the decision, and when reassessment is required.',
    D3: 'Ask whether the program/control is designed, operating, evidenced, and effective against the intended outcome.',
    D4: 'Ask what must be established first: readiness, classification, authority, evidence, containment, recovery, or corrective action.'
  };
  function profile(term, domain) {
    const line = sequence[domain] || [], at = line.indexOf(term);
    const before = at > 0 ? line[at - 1] : 'Business context and accountable ownership';
    const after = at >= 0 && at < line.length - 1 ? line[at + 1] : 'Measured outcome and continual improvement';
    return { prerequisite: before, outcome: after, lens: lens[domain] || lens.D1, prompt: `Explain why ${term} matters, identify the accountable decision, then compare the best action with the tempting shortcut.` };
  }
  window.CherubDepth = { profile };
})();

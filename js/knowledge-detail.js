"use strict";
(() => {
  let g = {}, a = {}, concepts = {};
  Promise.all([
    fetch("data/glossary.json").then((r) => r.json()),
    fetch("data/acronyms.json").then((r) => r.json()),
    fetch("data/concepts.json").then((r) => r.json()),
  ]).then((x) => {
    [g, a, concepts] = x;
  });
  const n = {
    D1: "Governance",
    D2: "Risk Management",
    D3: "Information Security Program",
    D4: "Incident Management",
  };
  const links = {
    "Risk appetite": ["Risk capacity", "Risk tolerance", "Risk criteria"],
    "Risk tolerance": ["Risk appetite", "Risk criteria", "Risk acceptance"],
    "Residual risk": ["Control effectiveness", "Risk owner", "Risk treatment"],
    "Control effectiveness": ["Control design", "Control operation", "Control evidence", "Residual risk"],
    "BIA": ["RTO", "RPO", "Recovery strategy", "Business continuity plan"],
    "RTO": ["BIA", "RPO", "Recovery strategy", "Recovery testing"],
    "RPO": ["BIA", "RTO", "Recovery strategy", "Disaster recovery plan"],
    "Incident response plan": ["Incident readiness", "Incident classification", "Containment", "Post-incident review"],
    "Business objectives": ["Security strategy", "Governance framework", "Executive reporting"],
    "Security strategy": ["Business objectives", "Policies", "Security metrics"],
    "Risk assessment": ["Risk analysis", "Risk criteria", "Risk treatment", "Risk register"],
    "Recovery strategy": ["BIA", "RTO", "RPO", "Recovery testing"],
  };
  const pathLessons = {
    "BIA → RTO / RPO → Recovery strategy → Recovery plan → Recovery testing → Measured capability → Deficiency → Corrective action → Retest": {
      meaning: "This is the recovery decision chain. A business impact analysis identifies what matters and its dependencies; RTO and RPO turn that impact into time and data-loss requirements; the recovery strategy and plan must then be tested and improved.",
      action: "Start with business impact and approved recovery requirements. Do not select a technology recovery option before those requirements are known.",
      outcome: "A tested, measurable recovery capability with deficiencies corrected and retested.",
      trap: "Starting recovery planning with tools or a plan template instead of business impact, recovery objectives, and accountable approval."
    },
    "Incident readiness → Classification → Containment → Eradication → Recovery → Post-incident review": {
      meaning: "This is the incident-management sequence: prepare authority and playbooks, classify the event, contain harm, remove the cause, restore safely, then convert lessons into improvements.",
      action: "Choose the earliest missing management action. Preserve evidence and confirm authority before irreversible containment or recovery decisions.",
      outcome: "A controlled response that restores operations and strengthens future readiness.",
      trap: "Jumping directly to eradication or recovery before classification, authority, evidence, and containment needs are established."
    }
  };
  function related(t, domain) {
    const direct = links[t] || [];
    const inDomain = concepts[domain] || [];
    return [...new Set([...direct, ...inDomain.filter(v => v !== t && !direct.includes(v)).slice(0, 4)])].slice(0, 5);
  }
  window.addEventListener("cherub:knowledge", (e) => {
    let x = e.detail,
      mapHost = document.getElementById("mapContent"),
      indexHost = document.getElementById("indexContent"),
      h = mapHost?.closest(".view")?.classList.contains("active") ? mapHost : indexHost?.closest(".view")?.classList.contains("active") ? indexHost : mapHost || indexHost;
    if (!h) return;
    h.querySelector(".cherub-detail")?.remove();
    let t = x.concept || x.path || x.term,
      d =
        g[t] ||
        a[t] ||
        "Study this through accountable ownership, decision threshold, evidence, business outcome, and connected relationships.",
      c = window.CherubCatalog?.card({ domain: x.domain, concept: t });
    const steps = String(t).split('→').map(v => v.trim()).filter(Boolean);
    const genericPath = steps.length > 1 ? { meaning: `This is a connected decision path: ${steps[0]} establishes the input, each following step turns it into an approved and measurable decision, and ${steps[steps.length - 1]} confirms the outcome.`, action: `Identify which prerequisite is missing before acting. Do not skip from ${steps[0]} directly to ${steps[steps.length - 1]}.`, outcome: `${steps[steps.length - 1]} is supported by evidence and accountable follow-through.`, trap: 'Selecting a later operational action before the earlier management requirement has been established.' } : null;
    const lesson = pathLessons[t] || genericPath;
    d = lesson?.meaning || g[t] || a[t] || c?.definition || d;
    const rel = related(t, x.domain || c?.domain || "D1");
    const depth = window.CherubDepth?.profile(t, x.domain || c?.domain || "D1") || {};
    h.insertAdjacentHTML(
      "afterbegin",
      `<aside class="card cherub-detail" role="dialog" aria-label="${t}" style="position:sticky;top:12px;z-index:5;width:min(620px,calc(100vw - 46px));padding:15px 52px 15px 15px;margin:0 0 14px;border-left:5px solid #2f72e6;box-shadow:0 12px 28px rgba(15,31,58,.18);overflow-wrap:anywhere"><button data-close aria-label="Close" style="position:absolute;right:12px;top:12px;border:0;background:#edf2f8;border-radius:7px;width:34px;height:34px;font-size:22px;line-height:1;cursor:pointer">x</button><span class="epill">${c?.domainName || n[x.domain] || x.domain || "Knowledge detail"}</span><h2 style="margin:8px 0 5px">${t}</h2><p style="margin:7px 0"><b>Meaning:</b> ${d}</p><p class="tiny"><b>What to do:</b> ${lesson?.action || c?.rule || 'Choose the action that respects ownership, sequence, evidence, and business value.'}</p><p class="tiny"><b>Where it fits:</b> ${c?.path || 'Open Study Map for the connected decision path.'}</p><p class="tiny"><b>Decision sequence:</b> establish <b>${depth.prerequisite || 'the required context'}</b> → apply <b>${t}</b> → drive <b>${lesson?.outcome || depth.outcome || 'a measurable outcome'}</b>.</p><p class="tiny"><b>Question lens:</b> ${depth.lens || 'Choose the answer that follows the required management sequence.'}</p><p class="tiny"><b>Common trap:</b> ${lesson?.trap || c?.trap || 'Choosing technical activity before the required decision context is established.'}</p><p class="tiny"><b>Related:</b> ${rel.map(v => `<button data-related="${v}" class="epill" style="cursor:pointer;border:0;margin:2px">${v}</button>`).join(' ') || 'Open the Study Map for connected decision paths.'}</p><button class="enginebtn" data-train>Build focused set</button> <button class="enginebtn secondary" data-map>Open Study Map</button> <button class="enginebtn secondary" data-note>Add note</button></aside>`,
    );
    let card = h.querySelector(".cherub-detail");
    if (steps.length > 1) {
      const nodes = steps.map((step, index) => `<span style="display:inline-flex;align-items:center;gap:6px;margin:3px 0"><span style="display:inline-flex;max-width:150px;padding:7px 9px;border-radius:9px;background:${index === 0 ? '#e7f0ff' : index === steps.length - 1 ? '#e8f8ee' : '#f4efff'};border:1px solid #cfdcf0;font-size:12px;font-weight:700">${step}</span>${index < steps.length - 1 ? '<b style="color:#2f72e6">→</b>' : ''}</span>`).join('');
      card.insertAdjacentHTML('beforeend', `<section aria-label="Connection diagram" style="margin-top:12px;padding:11px;border-radius:10px;background:#f8fbff;border:1px solid #dce6f3"><b style="font-size:13px">Connection diagram</b><div style="display:flex;flex-wrap:wrap;align-items:center;gap:3px;margin-top:7px">${nodes}</div><p class="tiny" style="margin:8px 0 0">Blue is the starting input, purple steps translate the decision, and green is the measurable outcome.</p></section>`);
    }
    card.scrollIntoView({ behavior: "smooth", block: "nearest" });
    card.querySelector("[data-close]").onclick = () => card.remove();
    card.querySelectorAll("[data-related]").forEach((button) => button.onclick = () => window.dispatchEvent(new CustomEvent("cherub:knowledge", { detail: { domain: x.domain || "D1", concept: button.dataset.related } })));
    card.querySelector("[data-map]").onclick = () => { window.Cherub?.setFocus({ domain: x.domain || "D1", concept: t, path: x.path || c?.path }); window.show("map"); };
    card.querySelector("[data-note]").onclick = () => { window.Cherub?.setFocus({ domain: x.domain || "D1", concept: t, path: x.path || c?.path }); window.show("notes"); };
    card.querySelector("[data-train]").onclick = () => {
      card.remove();
      window.dispatchEvent(
        new CustomEvent("cherub:focus", {
          detail: { domain: x.domain || "D1", concept: t, path: x.path || c?.path },
        }),
      );
      setTimeout(
        () =>
          h
            .querySelector(".cherub-builder")
            ?.scrollIntoView({ behavior: "smooth", block: "nearest" }),
        40,
      );
    };
  });
})();

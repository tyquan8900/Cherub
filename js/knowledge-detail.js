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
    D3: "Program Development",
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
  function related(t, domain) {
    const direct = links[t] || [];
    const inDomain = concepts[domain] || [];
    return [...new Set([...direct, ...inDomain.filter(v => v !== t && !direct.includes(v)).slice(0, 4)])].slice(0, 5);
  }
  window.addEventListener("cherub:knowledge", (e) => {
    let x = e.detail,
      h =
        document.getElementById("indexContent") ||
        document.getElementById("mapContent");
    if (!h) return;
    h.querySelector(".cherub-detail")?.remove();
    let t = x.concept || x.path || x.term,
      d =
        g[t] ||
        a[t] ||
        "Study this through accountable ownership, decision threshold, evidence, business outcome, and connected relationships.",
      c = window.CherubCatalog?.card({ domain: x.domain, concept: t });
    d = g[t] || a[t] || c?.definition || d;
    const rel = related(t, x.domain || c?.domain || "D1");
    h.insertAdjacentHTML(
      "afterbegin",
      `<aside class="card cherub-detail" role="dialog" aria-label="${t}" style="position:sticky;top:12px;z-index:5;width:min(620px,calc(100vw - 46px));padding:15px 52px 15px 15px;margin:0 0 14px;border-left:5px solid #2f72e6;box-shadow:0 12px 28px rgba(15,31,58,.18);overflow-wrap:anywhere"><button data-close aria-label="Close" style="position:absolute;right:12px;top:12px;border:0;background:#edf2f8;border-radius:7px;width:34px;height:34px;font-size:22px;line-height:1;cursor:pointer">×</button><span class="epill">${c?.domainName || n[x.domain] || x.domain || "Knowledge detail"}</span><h2 style="margin:8px 0 5px">${t}</h2><p style="margin:7px 0"><b>Meaning:</b> ${d}</p><p class="tiny"><b>Where it fits:</b> ${c?.path || 'Open Study Map for the connected decision path.'}</p><p class="tiny"><b>Reasoning rule:</b> ${c?.rule || 'Choose the action that respects ownership, sequence, evidence, and business value.'}</p><p class="tiny"><b>Common trap:</b> ${c?.trap || 'Choosing technical activity before the required decision context is established.'}</p><p class="tiny"><b>Related:</b> ${rel.map(v => `<button data-related="${v}" class="epill" style="cursor:pointer;border:0;margin:2px">${v}</button>`).join(' ') || 'Open the Study Map for connected decision paths.'}</p><button class="enginebtn" data-train>Build focused set</button> <button class="enginebtn secondary" data-map>Open Study Map</button> <button class="enginebtn secondary" data-note>Add note</button></aside>`,
    );
    let card = h.querySelector(".cherub-detail");
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

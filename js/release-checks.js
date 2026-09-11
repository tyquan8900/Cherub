'use strict';
(() => {
  const required = ['data/concepts.json', 'data/glossary.json', 'data/acronyms.json', 'data/relationships.json'];
  window.CherubReleaseCheck = async () => {
    const results = await Promise.all(required.map(async path => ({ path, ok: await fetch(path).then(r => r.ok).catch(() => false) })));
    const map = window.CherubCatalog, terms = Object.values((await fetch('data/concepts.json').then(r => r.json()))).flat();
    results.push({ path: '80 concept cards', ok: terms.length === 80 && terms.every(term => !!map?.card({ concept: term, domain: term === 'BIA' ? 'D4' : undefined }).definition) });
    return results;
  };
})();

'use strict';
(() => {
  const names = { D1: 'Governance', D2: 'Risk Management', D3: 'Program Development', D4: 'Incident Management' };
  let data;
  async function load() {
    if (data) return data;
    const [concepts, paths, terms] = await Promise.all([
      fetch('data/concepts.json').then(r => r.json()),
      fetch('data/relationships.json').then(r => r.json()),
      fetch('data/index-map.json').then(r => r.json())
    ]);
    return data = { concepts, paths: paths.paths, terms: terms.terms };
  }
  function render(filter = '') {
    const host = document.getElementById('indexContent');
    if (!host) return;
    const query = filter.toLowerCase();
    const match = value => !query || value.toLowerCase().includes(query);
    const concepts = Object.entries(data.concepts).map(([id, items]) => {
      const shown = items.filter(match);
      return shown.length ? `<article class="card cherub-index-card"><h3>${names[id]} <small>${shown.length} concepts</small></h3>${shown.map(item => `<button data-focus="${id}" data-concept="${item}">${item}</button>`).join('')}</article>` : '';
    }).join('');
    const paths = data.paths.filter(p => match(p.path.join(' '))).map(p => `<button class="cherub-path" data-focus="${p.domain}">${p.domain}: ${p.path.join(' → ')}</button>`).join('');
    host.innerHTML = `<style>.cherub-index-search{width:100%;padding:11px;border:1px solid #ccd8e8;border-radius:9px;font:inherit}.cherub-index-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:14px}.cherub-index-card{padding:13px}.cherub-index-card h3{margin:0 0 9px;font-size:15px}.cherub-index-card small{color:#617392;font-weight:400}.cherub-index-card button,.cherub-path{margin:3px;border:1px solid #d9e4f2;border-radius:7px;background:#f8fbff;padding:7px;color:#234d8e;cursor:pointer}.cherub-path{display:block;width:100%;text-align:left;margin:7px 0}@media(max-width:760px){.cherub-index-grid{grid-template-columns:1fr}}</style><input class="cherub-index-search" id="indexSearch" placeholder="Search a concept, e.g. residual risk, recovery, metrics" value="${filter}"><div class="cherub-index-grid">${concepts}</div><h3 style="margin-top:18px">Decision paths</h3>${paths}`;
    host.querySelector('#indexSearch').oninput = e => render(e.target.value);
    host.querySelectorAll('[data-focus]').forEach(button => button.onclick = () => {
      const focus = { domain: button.dataset.focus, concept: button.dataset.concept || button.textContent };
      window.Cherub.setFocus(focus); window.dispatchEvent(new CustomEvent('cherub:focus', { detail: focus }));
    });
  }
  window.addEventListener('cherub:view', async e => { if (e.detail.id === 'index') { await load(); render(); } });
})();

'use strict';
(() => {
  const wait = setInterval(() => {
    if (typeof window.show !== 'function') return;
    clearInterval(wait);
    const original = window.show;
    window.show = (id) => {
      original(id);
      window.dispatchEvent(new CustomEvent('cherub:view', { detail: { id } }));
    };
    window.Cherub = {
      open(id) { window.show(id); },
      setFocus(focus) { localStorage.setItem('cherub.focus.v1', JSON.stringify(focus)); },
      getFocus() { try { return JSON.parse(localStorage.getItem('cherub.focus.v1') || 'null'); } catch { return null; } }
    };
  }, 50);
})();

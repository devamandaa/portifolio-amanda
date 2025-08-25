
// assets/js/imageScroll.js
document.addEventListener('DOMContentLoaded', () => {
  // Todos os elementos com data-parallax
  const els = document.querySelectorAll('[data-parallax]');
  if (!els.length) return;

  // Respeita usuários que pedem menos movimento
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach(el => { el.style.transform = 'none'; el.style.opacity = ''; });
    return;
  }

  let ticking = false;

  const apply = () => {
    // Progresso global simples (baseado no scrollY, igual ao seu original)
    const p = Math.min((window.scrollY || window.pageYOffset) / 400, 1);

    els.forEach(el => {
      const max  = Number(el.dataset.max)  || 60;   // px
      const fade = Number(el.dataset.fade) || 0.2;  // 0 a 1

      el.style.transform = `translateY(${p * max}px)`;
      el.style.opacity   = String(1 - p * fade);
      // Opcional: el.style.willChange = 'transform, opacity';
    });

    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(apply);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  apply(); // estado inicial
});

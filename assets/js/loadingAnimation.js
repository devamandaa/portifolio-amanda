// assets/js/loadingScreen.js
document.addEventListener('DOMContentLoaded', () => {
  const loadingScreen     = document.getElementById('loading-screen');
  const loadingPercentage = document.getElementById('loading-percentage');

  // Se não existir, sai sem quebrar
  if (!loadingScreen || !loadingPercentage) return;

  // Lê variáveis CSS (com fallback)
  const rootStyles = getComputedStyle(document.documentElement);
  const BLUE  = (rootStyles.getPropertyValue('--blue')  || '#3b82f6').trim();
  const BLACK = (rootStyles.getPropertyValue('--black') || '#0b0b0b').trim();

  // Duração total da “carga” (ms) — ajuste à vontade
  const DURATION = 1200;

  let start = null;

  const animate = (ts) => {
    if (start == null) start = ts;
    const elapsed = ts - start;

    // Progresso de 0 a 1
    const p = Math.min(elapsed / DURATION, 1);
    const pct = Math.round(p * 100);

    // Atualiza UI
    loadingPercentage.textContent = `${pct}%`;
    loadingScreen.style.backgroundImage =
      `linear-gradient(to bottom, ${BLUE} ${pct}%, ${BLACK} ${pct}%)`;

    if (p < 1) {
      requestAnimationFrame(animate);
    } else {
      // Esconde com transição suave (se houver CSS), depois remove da tela
      loadingScreen.classList.add('loading-hidden');

      // Remove do fluxo após a transição (fallback por tempo, caso não haja CSS)
      const done = () => { loadingScreen.style.display = 'none'; };
      loadingScreen.addEventListener('transitionend', done, { once: true });
      setTimeout(done, 400); // fallback
    }
  };

  requestAnimationFrame(animate);
});

document.addEventListener('DOMContentLoaded', function () {
  const body     = document.body;
  const navLinks = document.querySelectorAll('.lista-navegacao a');
  const loader   = document.querySelector('.loader');

  // duração do fade (em ms). deixe igual ao CSS, se você também animar por lá
  const FADE_MS = 600;

  // evita navegação dupla (ex.: toques/clicks repetidos)
  let isNavigating = false;

  function isInternalUrl(url) {
    // resolve URL relativa e confere se é do mesmo domínio
    const target = new URL(url, window.location.href);
    return target.origin === window.location.origin;
  }

  function fadeOutAndGo(url) {
    // anima o body via JS
    body.style.transition = `opacity ${FADE_MS}ms ease`;
    body.style.opacity = 0;

    // anima o loader com segurança (só se existir)
    if (loader) {
      loader.style.transition = `transform ${FADE_MS}ms ease`;
      loader.style.transform = 'translateX(0%)';
    }

    // navega exatamente quando o fade termina
    setTimeout(() => {
      window.location.href = url;
    }, FADE_MS);
  }

  function handleNavLinkActivation(e) {
    // permitir abrir em nova aba/janela
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;

    const url = this.getAttribute('href');

    // ignorar links sem href ou âncoras (#)
    if (!url || url.startsWith('#')) return;

    // ignorar links externos (só anima links internos)
    if (!isInternalUrl(url)) return;

    // se já estamos navegando, não repete
    if (isNavigating) return;
    isNavigating = true;

    e.preventDefault();
    fadeOutAndGo(url);
  }

  // use apenas 'click' para evitar duplicidade com touchstart em alguns devices
  navLinks.forEach(link => {
    link.addEventListener('click', handleNavLinkActivation);
  });

  // se você inicia o body com opacity: 0 no CSS, isto faz o fade-in após o load
  window.addEventListener('load', () => {
    body.style.opacity = 1;
  });
});

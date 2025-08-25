// assets/js/menu.js
document.addEventListener('DOMContentLoaded', () => {
  const body      = document.body;
  const menu      = document.getElementById('menu');
  const menuIcon  = document.querySelector('.menu-icon');
  const closeIcon = document.querySelector('.close-icon');
  const backdrop  = document.querySelector('.menu-backdrop'); // opcional, se você usar
  const TRANSITION_MS = 300; // mantenha igual ao CSS

  if (!menu || !menuIcon) return; // elementos essenciais

  // Acessibilidade básica
  menu.setAttribute('aria-hidden', 'true');
  menuIcon.setAttribute('aria-expanded', 'false');

  let isOpen = false;
  let closeTimer;

  function openMenu() {
    if (isOpen) return;
    isOpen = true;
    clearTimeout(closeTimer);

    // estado visível
    menu.classList.add('open');
    body.classList.add('no-scroll');
    menu.setAttribute('aria-hidden', 'false');
    menuIcon.setAttribute('aria-expanded', 'true');

    // força reflow para garantir transição ao adicionar slide-in
    void menu.offsetWidth;
    menu.classList.add('slide-in');

    // foco no primeiro foco possível (opcional)
    const firstFocusable = menu.querySelector('a, button, input, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) firstFocusable.focus({ preventScroll: true });

    document.addEventListener('keydown', onKeyDown);
  }

  function closeMenu() {
    if (!isOpen) return;
    isOpen = false;

    menu.classList.remove('slide-in');
    menu.setAttribute('aria-hidden', 'true');
    menuIcon.setAttribute('aria-expanded', 'false');

    const onEnd = () => {
      menu.classList.remove('open');
      body.classList.remove('no-scroll');
      menu.removeEventListener('transitionend', onEnd);
    };

    // usa transitionend, com fallback por tempo
    menu.addEventListener('transitionend', onEnd);
    closeTimer = setTimeout(onEnd, TRANSITION_MS + 50);

    document.removeEventListener('keydown', onKeyDown);
    menuIcon.focus({ preventScroll: true });
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') closeMenu();
  }

  // abre
  menuIcon.addEventListener('click', openMenu);

  // fecha (se existir ícone)
  if (closeIcon) closeIcon.addEventListener('click', closeMenu);

  // fecha ao clicar no backdrop (se você tiver um)
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  // fecha ao clicar em qualquer link do menu
  menu.querySelectorAll('a[href]').forEach(a => {
    a.addEventListener('click', () => closeMenu());
  });
});

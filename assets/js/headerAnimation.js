document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  if (!header) return;

  let ticking = false;
  const update = () => {
    header.classList.toggle('header-fixed', (window.scrollY || window.pageYOffset) > 50);
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  };

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
});

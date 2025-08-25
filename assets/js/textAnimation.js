// /assets/js/textAnimation.js
document.addEventListener('DOMContentLoaded', () => {
  const el = document.querySelector('.texto-animado');
  if (!el) return;

  // 1) Frases por data-attribute (ex.: data-words="Front-End|Fullstack|de Software")
  //    fallback para o array fixo:
  const wordsAttr = el.getAttribute('data-words');
  const textArray = (wordsAttr
    ? wordsAttr.split('|').map(s => s.trim()).filter(Boolean)
    : ['Web']
  );

  // 2) Velocidades por data-attribute, com fallback:
  const typingDelay   = parseInt(el.getAttribute('data-typing'), 10)   || 100;
  const erasingDelay  = parseInt(el.getAttribute('data-erasing'), 10)  || 150;
  const newTextDelay  = parseInt(el.getAttribute('data-pause'), 10)    || 1000;

  // 3) Acessibilidade: reduz movimento
  const reduceMotion = window.matchMedia &&
                       window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let textArrayIndex = 0;
  let charIndex = 0;

  // desacelera quando aba está oculta (economia)
  function schedule(fn, delay) {
    const multiplier = document.hidden ? 4 : 1;
    setTimeout(fn, delay * multiplier);
  }

  function type() {
    const current = textArray[textArrayIndex] || '';
    if (charIndex < current.length) {
      el.textContent += current.charAt(charIndex);
      charIndex++;
      schedule(type, typingDelay);
    } else {
      schedule(erase, newTextDelay);
    }
  }

  function erase() {
    const current = textArray[textArrayIndex] || '';
    if (charIndex > 0) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      schedule(erase, erasingDelay);
    } else {
      // próxima palavra (loop)
      textArrayIndex = (textArrayIndex + 1) % textArray.length;
      schedule(type, typingDelay + 500);
    }
  }

  function init() {
    if (reduceMotion) {
      el.textContent = textArray[0] || '';
      return;
    }
    el.textContent = '';
    charIndex = 0;
    schedule(type, 300);
  }

  init();
});

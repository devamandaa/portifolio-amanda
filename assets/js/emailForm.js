// assets/js/emailForm.js
(() => {
  function onReady() {
    const form = document.getElementById('contact-form');
    if (!form) return; // não está na página de contato → evita erro

    const successMsg = document.getElementById('form-success');
    const submitBtn = form.querySelector('button[type="submit"]');

    // ======== CONFIG DO EMAILJS (preencha com os seus) ========
    const EMAILJS_PUBLIC_KEY = 'SUA_PUBLIC_KEY';
    const SERVICE_ID  = 'SEU_SERVICE_ID';
    const TEMPLATE_ID = 'SEU_TEMPLATE_ID';
    // ==========================================================

    // Garante que a lib v4 está presente sem quebrar a página
    if (!(window.emailjs && typeof emailjs.init === 'function')) {
      console.warn('EmailJS v4 não carregado. Confira a tag no <head>.');
      return; // sai silenciosamente (some o "erro" visual)
    }

    try {
      emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    } catch (e) {
      console.warn('Falha ao inicializar o EmailJS:', e);
      return;
    }

    // Utils
    const getDigits = (s) => (s || '').replace(/\D/g, '');
    const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
    const isValidWhatsappMasked = (v) => getDigits(v).length === 11;
    const setSending = (sending) => {
      if (!submitBtn) return;
      submitBtn.disabled = sending;
      submitBtn.textContent = sending ? 'Enviando...' : 'Enviar Mensagem';
    };

    const validateForm = () => {
      const nome    = form.user_name?.value.trim();
      const email   = form.user_email?.value.trim();
      const phone   = form.user_phone?.value;
      const message = form.message?.value.trim();

      if (!nome)                         { alert('Por favor, preencha seu nome.'); return false; }
      if (!email || !isValidEmail(email)){ alert('Informe um e-mail válido.');    return false; }
      if (!isValidWhatsappMasked(phone)) { alert('Informe um WhatsApp válido no formato (DD) 9XXXX-XXXX.'); return false; }
      if (!message)                      { alert('Escreva sua mensagem.');        return false; }
      return true;
    };

    // Envio
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      successMsg?.classList.remove('show');

      try {
        setSending(true);
        // Usa os name="" do formulário: user_name, user_phone, user_email, subject, message
        await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form);

        form.reset();
        if (successMsg) {
          successMsg.classList.add('show');
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          alert('Mensagem enviada com sucesso!');
        }
      } catch (err) {
        console.error('Erro no envio:', err);
        alert('Ops! Não foi possível enviar agora. Tente novamente em instantes.');
      } finally {
        setSending(false);
      }
    });

    // Máscara simples / força 11 dígitos (DD + 9 + 8 números)
    document.addEventListener('input', (e) => {
      if (e.target && e.target.id === 'whatsapp') {
        const digits = getDigits(e.target.value).slice(0, 11);
        let masked = digits;

        if (digits.length > 2) masked = `(${digits.slice(0,2)}) ${digits.slice(2)}`;
        if (digits.length > 7) masked = masked.replace(/^(\(\d{2}\))\s?(\d{5})(\d{0,4}).*/, '$1 $2-$3');

        e.target.value = masked.trim();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();

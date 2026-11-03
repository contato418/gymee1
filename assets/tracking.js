// GYMEE — conversões do Google Ads.
// Único lugar do site que dispara essas conversões: não duplicar em snippets
// do Google Ads, no Google Tag Manager ou em outra tag.
const WHATSAPP_SEND_TO = 'AW-17490155869/YB69CJz6rrEdEN2y-pNB';
const FORM_SEND_TO = 'AW-17490155869/B7VqCOaNprEdEN2y-pNB';

(function () {
  // Com bloqueador de anúncios o gtag pode não existir: o site segue funcionando.
  function canTrack() {
    return typeof gtag === 'function';
  }

  // "(51) 99525-2314" -> "+5551995252314". Retorna '' se não for um número válido.
  function toE164BR(raw) {
    let digits = String(raw || '').replace(/\D/g, '');
    if (digits.length >= 12 && digits.startsWith('55')) digits = digits.slice(2);
    digits = digits.replace(/^0+/, '');
    if (digits.length !== 10 && digits.length !== 11) return '';
    return '+55' + digits;
  }

  // Conversão: clique em qualquer link de WhatsApp (hero, CTA, flutuante, formulário...).
  // Fase de captura para registrar mesmo se outro handler parar a propagação.
  document.addEventListener('click', function (e) {
    const link = e.target && e.target.closest ? e.target.closest('a[href*="wa.me"]') : null;
    if (!link || !canTrack()) return;
    gtag('event', 'conversion', {
      'send_to': WHATSAPP_SEND_TO
    });
  }, true);

  // " Ana@Empresa.com " -> "ana@empresa.com". Retorna '' se não parecer um e-mail.
  function normalizeEmail(raw) {
    const email = String(raw || '').replace(/\s+/g, '').toLowerCase();
    return /^[^@]+@[^@]+\.[^@]+$/.test(email) ? email : '';
  }

  // Conversão: envio do formulário. Chamar só depois do envio bem-sucedido.
  // Os dois parâmetros são opcionais: envia em user_data só o que for válido.
  window.gymeeTrackFormSuccess = function (telefone, email) {
    if (!canTrack()) return;
    const userData = {};
    const mail = normalizeEmail(email);
    const phone = toE164BR(telefone);
    if (mail) userData.email = mail;
    if (phone) userData.phone_number = phone;
    if (mail || phone) {
      gtag('set', 'user_data', userData);
    }
    gtag('event', 'conversion', {
      'send_to': FORM_SEND_TO
    });
  };
})();

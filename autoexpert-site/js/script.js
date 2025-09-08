// Простой скрипт для отправки формы (можно расширить)
document.querySelector('.contact-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  alert('Спасибо! Я свяжусь с вами в ближайшее время.');
  this.reset();
});
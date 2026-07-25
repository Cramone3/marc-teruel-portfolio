document.getElementById('year').textContent = new Date().getFullYear();

const form = document.getElementById('volunteer-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Thanks! Wire this form up to your email/CRM tool to start capturing real applications.');
  form.reset();
});

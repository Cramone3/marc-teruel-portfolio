document.getElementById('year').textContent = new Date().getFullYear();

const amountInput = document.getElementById('donation_amount');
document.querySelectorAll('.amount-pill').forEach((pill) => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.amount-pill').forEach((p) => p.classList.remove('is-selected'));
    pill.classList.add('is-selected');
    amountInput.value = pill.dataset.amount;
  });
});

const form = document.getElementById('donation-form');
const thankYou = document.getElementById('thank-you');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  form.hidden = true;
  thankYou.hidden = false;
});

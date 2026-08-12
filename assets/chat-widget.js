(function () {
  const toggle = document.getElementById('chat-toggle');
  const box = document.getElementById('chat-box');
  const messagesEl = document.getElementById('chat-messages');
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');

  const WEBHOOK_URL = 'https://n8n.mkteruel.com/webhook/portfolio-chat-bot';
  const WEBHOOK_SECRET = 'cd6f57143bae8647eada8f7ea05756633c5742522297fbd1cf6d4887307a87a6';

  toggle.onclick = () => {
    box.style.display = box.style.display === 'none' ? 'flex' : 'none';
  };

  function getSessionId() {
    let id = sessionStorage.getItem('chatSessionId');
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem('chatSessionId', id);
    }
    return id;
  }

  function appendMessage(text, sender) {
    const div = document.createElement('div');
    div.style.margin = '6px 0';
    div.style.textAlign = sender === 'user' ? 'right' : 'left';
    div.innerHTML = `<span style="display:inline-block;padding:6px 10px;border-radius:6px;background:${sender === 'user' ? '#111' : '#eee'};color:${sender === 'user' ? '#fff' : '#000'};max-width:80%;word-wrap:break-word;">${text}</span>`;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    appendMessage(text, 'user');
    input.value = '';

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Secret': WEBHOOK_SECRET
        },
        body: JSON.stringify({ message: text, sessionId: getSessionId() })
      });
      const data = await res.json();
      appendMessage(data.reply, 'bot');
    } catch (err) {
      appendMessage('Sorry, something went wrong.', 'bot');
    }
  }

  sendBtn.onclick = sendMessage;
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
})();

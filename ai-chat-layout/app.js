(function(){
  // Minimal DOM-based chat UI to avoid JSX/transpilation issues
  const root = document.getElementById('root');
  root.innerHTML = '';

  const container = document.createElement('main');
  container.className = 'chatbot';

  const box = document.createElement('div');
  box.className = 'chatbot__container';

  const welcome = document.createElement('div');
  welcome.className = 'chatbot__welcome';

  const title = document.createElement('h1');
  title.className = 'chatbot__title';
  title.textContent = 'Asking with AI suggestions';

  const suggestionsBox = document.createElement('div');
  suggestionsBox.className = 'chatbot__suggestions-box';

  const suggestions = [
    'Write an email to the marketing team',
    'Summarize key points',
    'Create a follow-up checklist'
  ];

  const inputWrapper = document.createElement('div');
  inputWrapper.className = 'chatbot__input-wrapper';

  const input = document.createElement('input');
  input.id = 'chat-input';
  input.className = 'chatbot__input';
  input.placeholder = 'Ask anything…';

  const submit = document.createElement('button');
  submit.className = 'chatbot__submit';
  submit.textContent = '→';

  const messagesWrap = document.createElement('div');
  messagesWrap.className = 'chatbot__chat';
  messagesWrap.style.display = 'none';

  const messagesList = document.createElement('div');
  messagesList.className = 'chatbot__messages';

  messagesWrap.appendChild(messagesList);

  suggestions.forEach(s => {
    const btn = document.createElement('button');
    btn.className = 'chatbot__suggestion';
    btn.textContent = s;
    btn.addEventListener('click', () => submitMessage(s));
    suggestionsBox.appendChild(btn);
  });

  inputWrapper.appendChild(input);
  inputWrapper.appendChild(submit);

  welcome.appendChild(title);
  welcome.appendChild(suggestionsBox);
  welcome.appendChild(inputWrapper);

  box.appendChild(welcome);
  box.appendChild(messagesWrap);
  container.appendChild(box);
  root.appendChild(container);

  function addMessage(text, cls) {
    messagesWrap.style.display = '';
    const m = document.createElement('div');
    m.className = 'chatbot__message ' + (cls ? 'chatbot__message--' + cls : '');
    const c = document.createElement('div');
    c.className = 'chatbot__message-content';
    const p = document.createElement('p');
    p.className = 'chatbot__message-text';
    p.textContent = text;
    c.appendChild(p);
    m.appendChild(c);
    messagesList.appendChild(m);
    messagesWrap.scrollTop = messagesWrap.scrollHeight;
  }

  function findMockResponse(input) {
    const t = input.toLowerCase();
    if (t.includes('marketing')) return 'Simulated AI: I suggest contacting the marketing team with a clear brief.';
    if (t.includes('summarize')) return 'Simulated AI: Paste the text and I will summarize.';
    if (t.includes('checklist')) return 'Simulated AI: 1) Review notes 2) Identify value 3) Send follow-up';
    return 'Simulated AI response to: ' + input;
  }

  function submitMessage(text) {
    const msg = text || input.value.trim();
    if (!msg) return;
    addMessage(msg, 'user');
    input.value = '';
    setTimeout(() => {
      addMessage(findMockResponse(msg), 'ai');
    }, 800);
  }

  submit.addEventListener('click', () => submitMessage());
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitMessage();
  });

  console.log('ai-chat-layout: plain JS chat loaded');
})();

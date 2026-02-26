(function () {
  // DOM-based chat UI that mirrors the original visual structure.
  const root = document.getElementById("root");
  root.innerHTML = "";

  const container = document.createElement("main");
  container.className = "chatbot";

  const box = document.createElement("div");
  box.className = "chatbot__container";

  const welcome = document.createElement("div");
  welcome.className = "chatbot__welcome";

  const iconWrap = document.createElement("div");
  iconWrap.className = "chatbot__icon-wrapper";

  const welcomeIcon = document.createElement("div");
  welcomeIcon.className = "chatbot__icon chatbot__icon--gradient";
  welcomeIcon.innerHTML =
    '<svg class="chatbot__icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M12 3l1.9 4.1L18 9l-4.1 1.9L12 15l-1.9-4.1L6 9l4.1-1.9L12 3z"></path>' +
    '<path d="M19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14z"></path>' +
    '<path d="M5 14l.9 2.1L8 17l-2.1.9L5 20l-.9-2.1L2 17l2.1-.9L5 14z"></path>' +
    "</svg>";
  iconWrap.appendChild(welcomeIcon);

  const title = document.createElement("h1");
  title.className = "chatbot__title";
  title.textContent = "Asking with AI suggestions";

  const suggestionsBox = document.createElement("div");
  suggestionsBox.className = "chatbot__suggestions-box";

  const suggestions = [
    "Write an email to the marketing team",
    "Summarize key points",
    "Create a follow-up checklist",
  ];

  const inputWrapper = document.createElement("div");
  inputWrapper.className = "chatbot__input-wrapper";

  const input = document.createElement("input");
  input.id = "chat-input";
  input.className = "chatbot__input";
  input.placeholder = "Ask anything...";

  const submit = document.createElement("button");
  submit.className = "chatbot__submit";
  submit.setAttribute("aria-label", "Submit");
  submit.innerHTML =
    '<svg class="chatbot__submit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path>' +
    "</svg>";

  const messagesWrap = document.createElement("div");
  messagesWrap.className = "chatbot__chat";
  messagesWrap.style.display = "none";

  const messagesList = document.createElement("div");
  messagesList.className = "chatbot__messages";

  messagesWrap.appendChild(messagesList);

  suggestions.forEach((s) => {
    const btn = document.createElement("button");
    btn.className = "chatbot__suggestion";
    btn.textContent = s;
    btn.addEventListener("click", () => submitMessage(s));
    suggestionsBox.appendChild(btn);
  });

  inputWrapper.appendChild(input);
  inputWrapper.appendChild(submit);

  welcome.appendChild(iconWrap);
  welcome.appendChild(title);
  welcome.appendChild(suggestionsBox);
  welcome.appendChild(inputWrapper);

  box.appendChild(welcome);
  box.appendChild(messagesWrap);
  container.appendChild(box);
  root.appendChild(container);

  function addMessage(text, cls) {
    messagesWrap.style.display = "";
    const m = document.createElement("div");
    m.className = "chatbot__message " + (cls ? "chatbot__message--" + cls : "");

    if (cls === "ai") {
      const iconHolder = document.createElement("div");
      iconHolder.className = "chatbot__message-icon";
      const aiIcon = document.createElement("div");
      aiIcon.className = "chatbot__icon chatbot__icon--gradient chatbot__icon--small";
      aiIcon.innerHTML =
        '<svg class="chatbot__icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M4 16v-2a8 8 0 0 1 16 0v2"></path>' +
        '<rect x="2" y="14" width="4" height="6" rx="2"></rect>' +
        '<rect x="18" y="14" width="4" height="6" rx="2"></rect>' +
        "</svg>";
      iconHolder.appendChild(aiIcon);
      m.appendChild(iconHolder);
    }

    const c = document.createElement("div");
    c.className = "chatbot__message-content";
    const p = document.createElement("p");
    p.className = "chatbot__message-text";
    p.textContent = text;
    c.appendChild(p);
    m.appendChild(c);
    messagesList.appendChild(m);
    messagesWrap.scrollTop = messagesWrap.scrollHeight;
  }

  function findMockResponse(messageInput) {
    const t = messageInput.toLowerCase();
    if (t.includes("marketing")) return "Simulated AI: I suggest contacting the marketing team with a clear brief.";
    if (t.includes("summarize")) return "Simulated AI: Paste the text and I will summarize.";
    if (t.includes("checklist")) return "Simulated AI: 1) Review notes 2) Identify value 3) Send follow-up";
    return "Simulated AI response to: " + messageInput;
  }

  function submitMessage(text) {
    const msg = text || input.value.trim();
    if (!msg) return;
    addMessage(msg, "user");
    input.value = "";
    setTimeout(() => {
      addMessage(findMockResponse(msg), "ai");
    }, 800);
  }

  submit.addEventListener("click", () => submitMessage());
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") submitMessage();
  });
})();

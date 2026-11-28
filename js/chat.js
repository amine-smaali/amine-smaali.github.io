
/* Chat assistant. Set CHAT_URL to the address of your deployed Worker. */
const CHAT_URL = "https://amine-chat.rede28833.workers.dev";
const CHAT_EMAIL = "smaaliamine5@gmail.com", MAX_USER_MESSAGES = 15;

(async function () {
  let faq = [];
  try { faq = (await (await fetch("data/faq.json")).json()).items; } catch {}

  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const history = []; let userCount = 0, busy = false, greeted = false;

  const launch = el("button", "chat-launch");
  launch.setAttribute("aria-label", "Ask about Amine"); launch.setAttribute("aria-expanded", "false");
  launch.innerHTML = '<i class="ph ph-chat-circle-text icon"></i>';

  const panel = el("section", "chat-panel");
  panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Ask about Amine");
  const head = el("div", "chat-head"), titles = el("div");
  titles.append(el("h2", "title-2", "Ask about Amine"), el("p", "caption-4", "AI assistant. Answers can be wrong."));
  const close = el("button", "chat-x"); close.setAttribute("aria-label", "Close chat"); close.innerHTML = '<i class="ph ph-x icon"></i>';
  head.append(titles, close);
  const log = el("div", "chat-log body-6"); log.setAttribute("role", "log"); log.setAttribute("aria-live", "polite");
  const form = el("form", "chat-form"), input = el("input");
  input.type = "text"; input.maxLength = 300; input.placeholder = "Ask a question"; input.setAttribute("aria-label", "Your question");
  const send = el("button"); send.type = "submit"; send.setAttribute("aria-label", "Send"); send.innerHTML = '<i class="ph ph-paper-plane-tilt icon"></i>';
  form.append(input, send);
  panel.append(head, log, form);
  document.body.append(launch, panel);

  const add = (role, text) => { const m = el("div", "msg " + role, text); log.append(m); log.scrollTop = log.scrollHeight; return m; };
  const mailFallback = (m, lead) => { m.classList.remove("typing"); m.textContent = lead; const a = el("a", null, CHAT_EMAIL); a.href = "mailto:" + CHAT_EMAIL; m.append(a); };

  function toggle(open) {
    panel.classList.toggle("open", open); launch.setAttribute("aria-expanded", open);
    if (open) {
      if (!greeted) { greeted = true; showGreeting(); }
      setTimeout(() => input.focus(), 300);
    } else launch.focus();
  }
  function showGreeting() {
    add("bot", "Hi, I'm Amine's AI assistant. Ask me about his skills, projects or availability.");
    if (!faq.length) return;
    const chips = el("div", "chips title-4");
    faq.forEach((f) => {
      const b = el("button", "chip-btn", f.q); b.type = "button";
      b.addEventListener("click", () => { chips.remove(); add("user", f.q); add("bot", f.a); history.push({ role: "user", content: f.q }, { role: "assistant", content: f.a }); });
      chips.append(b);
    });
    log.append(chips);
  }

  async function ask() {
    busy = true; send.disabled = true;
    const bubble = add("bot", ""); bubble.classList.add("typing");
    try {
      const res = await fetch(CHAT_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: history.slice(-6) }) });
      if (!res.ok) { console.warn("Chat error", res.status, await res.text().catch(() => "")); throw new Error(res.status); }
      const text = String((await res.json()).text || "").trim();
      if (!text) throw new Error("empty");
      const delay = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 25;
      let shown = "";
      for (const word of text.split(/\s+/)) {
        shown += (shown ? " " : "") + word; bubble.textContent = shown; log.scrollTop = log.scrollHeight;
        if (delay) await new Promise((r) => setTimeout(r, delay));
      }
      bubble.classList.remove("typing"); history.push({ role: "assistant", content: text });
    } catch (err) {
      console.warn("Chat failed:", err);
      history.pop();
      mailFallback(bubble, "I can't answer right now. Please email Amine directly at ");
    }
    busy = false; send.disabled = false; input.focus();
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = input.value.trim(); if (!q || busy) return;
    input.value = ""; add("user", q);
    if (++userCount > MAX_USER_MESSAGES) { mailFallback(add("bot", ""), "That's the limit for this chat. For more questions, email Amine at "); return; }
    history.push({ role: "user", content: q }); ask();
  });
  launch.addEventListener("click", () => toggle(!panel.classList.contains("open")));
  close.addEventListener("click", () => toggle(false));
  addEventListener("keydown", (e) => { if (e.key === "Escape" && panel.classList.contains("open")) toggle(false); });
})();

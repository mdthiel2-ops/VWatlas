
const chatEl = document.getElementById("chat");
const inputEl = document.getElementById("input");
const sendEl = document.getElementById("send");
const chipsEl = document.getElementById("chips");

// --- Mock “notebook” snippets (purely illustrative for vision demo)
const NOTEBOOK = {
  positioningPrinciples: [
    "Lead with needs: seating, cargo, towing, tech, safety, ownership experience.",
    "Translate specs into outcomes: 'more room for hockey bags' > 'X cu ft'.",
    "Ask a discovery question before comparing: 'What matters most: space, price, or features?'",
    "Use 'agree + reframe + proof': validate, reposition, then anchor on benefits."
  ],
  competitorShortcuts: {
    palisade: ["Family comfort angle", "Tech/trim confusion → simplify into outcomes"],
    pilot: ["Reliability perception", "Emphasize daily usability + packaging clarity"],
    grandHighlander: ["Value narrative", "Hybrid curiosity → pivot to total-fit & availability"]
  }
};

function nowStamp() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function addMessage(role, text) {
  const wrap = document.createElement("div");
  wrap.className = `msg ${role}`;

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = role === "user" ? "You" : "Coach";

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  const col = document.createElement("div");
  col.style.display = "flex";
  col.style.flexDirection = "column";
  col.style.gap = "2px";

  const meta = document.createElement("div");
  meta.className = "meta";
  meta.textContent = `${role === "user" ? "Sent" : "Suggested"} • ${nowStamp()}`;

  col.appendChild(bubble);
  col.appendChild(meta);

  if (role === "user") {
    wrap.appendChild(col);
    wrap.appendChild(avatar);
    wrap.style.justifyContent = "flex-end";
  } else {
    wrap.appendChild(avatar);
    wrap.appendChild(col);
  }

  chatEl.appendChild(wrap);
  chatEl.scrollTop = chatEl.scrollHeight;
}

function typingIndicator(show) {
  let el = document.getElementById("typing");
  if (show && !el) {
    el = document.createElement("div");
    el.id = "typing";
    el.className = "msg assistant";
    el.innerHTML = `
      <div class="avatar">Coach</div>
      <div class="bubble" style="opacity:.85">Typing…</div>
    `;
    chatEl.appendChild(el);
    chatEl.scrollTop = chatEl.scrollHeight;
  }
  if (!show && el) el.remove();
}

// --- Mock coach logic (for demo only)
function mockCoachReply(userText) {
  const t = userText.toLowerCase();

  const discovery = [
    "Quick check: what’s the shopper’s #1 priority—space, features, price, or driving feel?",
    "Before we compare: are they replacing a vehicle, and what do they love/hate about it?"
  ];

  const principles = NOTEBOOK.positioningPrinciples.map(p => `• ${p}`).join("\n");

  if (t.includes("palisade")) {
    return `Here’s a 20-second talk track vs Palisade (demo):\n\n` +
      `1) Align: “If comfort and family usability matter most, great.”\n` +
      `2) Reframe: “Let’s match what you *do* every week—car seats, cargo, road trips.”\n` +
      `3) Anchor Atlas outcome: “Atlas is built around easy daily use: clear packaging, strong space story, and a confident highway feel.”\n` +
      `4) Close with a question: “Which matters more—3rd-row comfort or cargo behind the 3rd row?”\n\n` +
      `Coach principles:\n${principles}`;
  }

  if (t.includes("pilot")) {
    return `For a Pilot shopper, qualify fast (demo):\n\n` +
      `Ask these 5:\n` +
      `• “How often is the 3rd row used—kids daily or occasional adults?”\n` +
      `• “Any must-have tech: CarPlay, driver assist, camera views?”\n` +
      `• “Road-trip frequency? What annoys you on long drives?”\n` +
      `• “Cargo: strollers/sports gear? What’s the ‘big item’?”\n` +
      `• “Timing: are you shopping availability or waiting for a specific trim?”\n\n` +
      `${discovery[Math.floor(Math.random() * discovery.length)]}`;
  }

  if (t.includes("grand highlander") || t.includes("highlander") || t.includes("value")) {
    return `Handling “Grand Highlander is better value” (demo):\n\n` +
      `1) Agree: “Totally fair—value matters.”\n` +
      `2) Define value: “Is value lowest payment, best features, or best fit for your family?”\n` +
      `3) Reframe: “If the vehicle fits your life better—space, comfort, day-to-day ease—that’s the best value.”\n` +
      `4) Proof step: “Let’s do a 3-minute ‘real-life test’: 3rd row access + cargo behind 3rd row + driver visibility.”\n` +
      `5) Close: “If Atlas wins 2 of those 3, would it be worth a closer look?”`;
  }

  if (t.includes("outline") || t.includes("side-by-side") || t.includes("comparison")) {
    return `Side-by-side comparison outline (demo):\n\n` +
      `A) Customer priorities (rank 1–3)\n` +
      `B) Space & usability (3rd row access, cargo, kid-friendliness)\n` +
      `C) Driving & comfort (road noise, ride, visibility)\n` +
      `D) Tech & safety (must-have features → show outcomes)\n` +
      `E) Ownership story (warranty/service/availability—whatever applies)\n` +
      `F) Decision close (2-option summary + next step)\n\n` +
      `Want this tailored to a “family of 5 + sports gear” scenario?`;
  }

  // default
  return `Got it. Here’s a coaching approach (demo):\n\n` +
    `${discovery[Math.floor(Math.random() * discovery.length)]}\n\n` +
    `Then use:\n${principles}\n\n` +
    `If you tell me which competitor came up (Palisade, Pilot, or Grand Highlander), I’ll generate a talk track + 2 objection handlers.`;
}

/**
 * Future-ready: swap mock replies to a real proxy.
 * Keep secrets server-side. Rise/iframe calls YOUR endpoint, not the LLM directly.
 */
async function getCoachReply(userText) {
  // Toggle for demo
  const USE_PROXY = false;

  if (!USE_PROXY) return mockCoachReply(userText);

  // Example proxy call (placeholder)
  const res = await fetch("https://YOUR-PROXY-DOMAIN/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userText,
      context: { brand: "Volkswagen Atlas", demoMode: true }
    })
  });

  if (!res.ok) throw new Error(`Proxy error: ${res.status}`);
  const data = await res.json();
  return data.reply;
}

async function onSend(text) {
  const trimmed = (text || "").trim();
  if (!trimmed) return;

  addMessage("user", trimmed);
  inputEl.value = "";
  inputEl.style.height = "auto";

  typingIndicator(true);
  try {
    // small delay for realism
    await new Promise(r => setTimeout(r, 450));
    const reply = await getCoachReply(trimmed);
    typingIndicator(false);
    addMessage("assistant", reply);
  } catch (e) {
    typingIndicator(false);
    addMessage("assistant", `Sorry — I hit a snag (demo).\n\n${String(e.message || e)}`);
  }
}

sendEl.addEventListener("click", () => onSend(inputEl.value));
inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    onSend(inputEl.value);
  }
});

inputEl.addEventListener("input", () => {
  inputEl.style.height = "auto";
  inputEl.style.height = Math.min(inputEl.scrollHeight, 120) + "px";
});

chipsEl.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-prompt]");
  if (!btn) return;
  onSend(btn.getAttribute("data-prompt"));
});

// Seed opening message
addMessage("assistant",
  "Hi — I’m your Volkswagen Atlas Performance Coach (vision demo).\n\n" +
  "Ask for:\n" +
  "• competitor talk tracks\n" +
  "• objection handling\n" +
  "• qualifying questions\n" +
  "• side-by-side comparison structure\n\n" +
  "Tip: try the quick buttons below."
);

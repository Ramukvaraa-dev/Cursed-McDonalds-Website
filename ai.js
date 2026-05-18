const chatBox = document.getElementById("chat-box");

function addMessage(sender, text, className) {
  const msg = document.createElement("div");
  msg.classList.add("message", className);
  const label = document.createElement("strong");
  label.textContent = `${sender}: `;
  msg.appendChild(label);
  msg.appendChild(document.createTextNode(String(text)));
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}

async function sendMessage() {
  const input = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  const message = input.value.trim();

  if (!message) return;

  addMessage("You", message, "user");
  input.value = "";
  input.disabled = true;
  sendBtn.disabled = true;

  // Show loading indicator
  if (window.location.protocol === "file:") {
    addMessage(
      "System",
      "Tip: open this site via http:// (not file://) so browsers don’t block requests/caching. If you’re testing locally, run a local server.",
      "bot"
    );
  }

  const loadingMsg = addMessage("AI", "⏳ Connecting to cursed systems...", "bot loading");

  // Timeout after 65 seconds (Render cold start can take ~60s)
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 65000);

  try {
    const response = await fetch(
      "https://cursed-mcdonalds-website-ai-backend.onrender.com/chat",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
        signal: controller.signal
      }
    );

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    loadingMsg.remove();
    addMessage("AI", data.reply, "bot");

  } catch (error) {
    clearTimeout(timeout);
    loadingMsg.remove();

    if (error.name === "AbortError") {
      addMessage(
        "System",
        "⚠️ The cursed server is waking up (Render free tier sleeps). Try again in 30 seconds.",
        "bot"
      );
    } else if (error.message.includes("Failed to fetch")) {
      addMessage(
        "System",
        "⚠️ Cannot reach the backend. Make sure your Render server is deployed and the OPENAI_API_KEY is set in Render's environment variables.",
        "bot"
      );
    } else {
      addMessage("System", `⚠️ Error: ${error.message}`, "bot");
    }
  } finally {
    input.disabled = false;
    sendBtn.disabled = false;
    input.focus();
  }
}

function handleKey(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
}

const chatBox = document.getElementById("chat-box");

function addMessage(sender, text, className) {
  const msg = document.createElement("div");
  msg.classList.add("message", className);
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();

  if (!message) return;

  addMessage("You", message, "user");
  input.value = "";

  try {
    const response = await fetch(
      "https://cursed-mcdonalds-website-ai-backend.onrender.com/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      }
    );

    const data = await response.json();
    addMessage("AI", data.reply, "bot");
  } catch (error) {
    addMessage("System", "Backend connection failed.", "bot");
  }
}

function handleKey(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
}
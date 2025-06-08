const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");

// Load theme on startup
window.onload = () => {
  loadChatHistory();
  loadTheme();
  addBotMessage("Hello! I'm Nova. How can I assist you today?");
};

function sendMessage() {
  const msg = input.value.trim();
  if (msg === "") return;
  addUserMessage(msg);
  getBotResponse(msg);
  input.value = "";
  saveToHistory("user", msg);
}

function addUserMessage(message) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("user-msg");
  msgDiv.textContent = message;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function addBotMessage(message) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("bot-msg");
  msgDiv.textContent = message;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  speak(message);
  saveToHistory("bot", message);
}

function getBotResponse(input) {
  const msg = input.toLowerCase();

  if (msg.includes("your name")) {
    addBotMessage("My name is Nova, your virtual assistant.");
  } else if (msg.includes("how are you")) {
    addBotMessage("I'm just code, but I'm functioning perfectly!");
  } else if (msg.includes("who made you")) {
    addBotMessage("I was created by Kashish Sharma.");
  } else if (msg.includes("open google")) {
    addBotMessage("Opening Google...");
    window.open("https://www.google.com", "_blank");
  } else if (msg.includes("open youtube")) {
    addBotMessage("Opening YouTube...");
    window.open("https://www.youtube.com", "_blank");
  } else if (msg.includes("search") || msg.includes("find")) {
    const query = input.replace(/search|find|please|can you/g, "").trim();
    const googleURL = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    addBotMessage(`Here’s what I found on Google for: "${query}"`);
    window.open(googleURL, "_blank");
  } else {
    const fallbackSearch = `https://www.google.com/search?q=${encodeURIComponent(input)}`;
    addBotMessage(`I'm not sure about that. Here's a Google search result:`);
    window.open(fallbackSearch, "_blank");
  }
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}

function startListening() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-IN';
  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    input.value = transcript;
    sendMessage();
  };
  recognition.start();
}

function saveToHistory(sender, message) {
  let history = JSON.parse(localStorage.getItem("chatHistory")) || [];
  history.push({ sender, message });
  localStorage.setItem("chatHistory", JSON.stringify(history));
}

function loadChatHistory() {
  let history = JSON.parse(localStorage.getItem("chatHistory")) || [];
  history.forEach(entry => {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add(entry.sender === "user" ? "user-msg" : "bot-msg");
    msgDiv.textContent = entry.message;
    chatBox.appendChild(msgDiv);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
}

function clearChat() {
  chatBox.innerHTML = "";
  localStorage.removeItem("chatHistory");
  addBotMessage("Chat cleared. Ask me anything else.");
}

// Dark/Light theme toggle
function toggleTheme() {
  document.body.classList.toggle("light");
  localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");

  const toggleBtn = document.getElementById("theme-toggle");
  toggleBtn.textContent = document.body.classList.contains("light") ? "☀️" : "🌙";
}

function loadTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "light") {
    document.body.classList.add("light");
    document.getElementById("theme-toggle").textContent = "☀️";
  } else {
    document.body.classList.remove("light");
    document.getElementById("theme-toggle").textContent = "🌙";
  }
}

const sukiFallbacks = [
  "Hah? Maksud lu apa sih?! 🤨",
  "Gak ngerti lu ngomong apa deh!",
  "Ulangi yang bener napa.",
  "Apaan tuh? Bahasa planet Mars?!"
];

function sendInput() {
  const inputField = document.getElementById("userInput");
  const userText = inputField.value.trim();
  if (!userText) return;

  fetch("https://yanshs-cgi.github.io/cgi-all/cgi-ai-yansh.json")
    .then(res => res.json())
    .then(data => {
      const cmd = userText.toLowerCase();
      if (data[cmd]) {
        displayResponse(data[cmd]);
      } else {
        const fallback = sukiFallbacks[Math.floor(Math.random() * sukiFallbacks.length)];
        displayResponse(fallback);
      }
    });
}

function displayResponse(response) {
  const chatBox = document.getElementById("chatBox");
  const botMessage = document.createElement("div");
  botMessage.className = "bot-message";
  botMessage.textContent = response;
  chatBox.appendChild(botMessage);
}

function sendInput() {
  const inputField = document.getElementById("userInput");
  if (!inputField || typeof inputField.value !== "string") {
    displayResponse("⚠️ Input tidak valid.");
    return;
  }

  const userInput = inputField.value.trim();

  if (!userInput) return;

  fetch("https://yanshs-cgi.github.io/cgi-all/cgi-ai-yansh.json")
    .then(res => res.json())
    .then(data => {
      const cmd = userInput.toLowerCase();
      if (data[cmd]) {
        displayResponse(data[cmd]);
      } else {
        const fallback = sukiFallbacks[Math.floor(Math.random() * sukiFallbacks.length)];
        displayResponse(fallback);
      }
    })
    .catch(err => {
      displayResponse("⚠️ Gagal terhubung ke AI, coba lagi nanti.");
      console.error(err);
    });
}

function sendInput() {
  const inputField = document.getElementById("userInput");
  const userText = inputField.value.trim(); // 👉 ambil valuenya

  fetch("https://yanshs-cgi.github.io/cgi-all/cgi-ai-yansh.json")
    .then(res => res.json())
    .then(data => {
      const cmd = userText.toLowerCase(); // sekarang sudah string, aman!
      if (data[cmd]) {
        displayResponse(data[cmd]);
      } else {
        const fallback = sukiFallbacks[Math.floor(Math.random() * sukiFallbacks.length)];
        displayResponse(fallback);
      }
    });
}

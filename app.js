async function sendInput() {
  const inputElement = document.getElementById("userInput");
  const userText = inputElement.value.trim();

  if (!userText) return;

  inputElement.value = "";
  displayResponse("🧑 Kamu: " + userText);

  try {
    const res = await fetch("https://yanshs-cgi.github.io/cgi-all/cgi-ai-yansh.json");
    const json = await res.json();

    const userLower = userText.toLowerCase();
    const match = json.find(cmd => userLower.includes(cmd.tanya.toLowerCase()));

    if (match) {
      displayResponse("🤖 Suki: " + match.jawab);
    } else {
      displayResponse("🤖 Suki: Maaf, aku nggak paham maksudmu.");
    }
  } catch (err) {
    displayResponse("⚠️ Error saat memproses jawaban.");
    console.error(err);
  }
}

function displayResponse(text) {
  const resBox = document.getElementById("response");
  resBox.innerHTML += text + "\n";
}

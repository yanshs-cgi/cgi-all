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
  });

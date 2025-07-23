let commands = [];
fetch('https://yanshs-cgi.github.io/cgi-all/cgi-ai-yansh.json')
  .then(res => { if (!res.ok) throw new Error('File JSON tidak ditemukan atau tidak bisa diakses.'); return res.json(); })
  .then(data => { commands = data; console.log("Commands loaded:", commands); })
  .catch(err => { console.error("Gagal load JSON:", err.message); alert("Gagal load data perintah. Pastikan URL file JSON benar dan valid."); });

const form = document.getElementById('command-form');
const input = document.getElementById('command-input');
const chatBox = document.getElementById('chat-box');
const fallbackResponses = ["Maaf, aku nggak ngerti perintah itu.","Perintah itu nggak ada di daftar, coba yang lain ya.","Hmmm... itu bukan sesuatu yang aku tahu.","Coba lagi, yang ini nggak nyambung 😅","Yah, aku belum ngerti maksud kamu 🫠","Gagal diproses. Mungkin typo?","Apa sih maksud kamu? Aku bukan cenayang.","Gak jelas, ulangin yang bener dong.","Serius? Perintah kayak gitu mana ada.","Kepala aku cenat-cenut liat perintah aneh gini 😩","Perintahmu kek mistik, ga bisa aku baca 😒","Tolong ya, yang masuk akal dikit napa.","Command kayak gini bikin otakku nge-lag.","Nope. Gak ketemu tuh di sistem.","Kayaknya kamu ngasal ngetik deh.","Coba pake perintah yang bener dong, bro.","Yakin itu perintah valid? Aku sih ragu.","Yang kamu ketik itu cuma cocok buat alien.","Lu kira aku Google Translate? Gak paham.","Buset... perintah apaan tuh?!","Perintah kayak gitu cuma ada di mimpi.","Gak bisa, bro. Reset otak kamu dulu coba.","Kok aneh sih? Bikin AI bingung aja.","Bodo amat, aku skip yang gini.","Next... aku males jawab yang gak jelas.","Perintah tidak ditemukan. Tapi kamu keren kok 😎","404: Command Not Found (dan gak mau dicari).","Hmm... ngarang ya kamu? Gak valid cuy.","Ealah... ini command atau sandi rahasia?","Salah tempat bro, ini bukan tempat ritual.","Plis, yang bener dong. Kasian aku loading terus.","Otakku mumet. Command itu kayak puisi surealis.","Lu kira aku peramal? Coba lagi lah.","Error di kamu, bukan aku.","Perintah kayak gitu cuma bisa di dunia mimpi.","Salah ketik ya? Atau kamu emang random?","Kayak gini nih yang bikin server panas.","Yang kamu ketik barusan... nonsense 😶","Aduh... perintah kamu kayak sinyal ilang.","Gagal konek sama logika kamu 😵‍💫","AI-nya nyerah sama kamu 😭","Bahkan Google aja bingung kalo liat gitu.","Aku bukan pesulap, jangan nyuruh aneh-aneh.","Sumpah... itu barusan bikin aku freeze 2 detik.","Coba lagi... dan kali ini jangan ngawur.","Apaan sih itu? Aku sampe ngedip dua kali bacanya.","Yaaah... itu bukan command. Itu lelucon ya?"];

function sanitizeInput(input) {
  return input.replace(/<[^>]*>/g, '').replace(/javascript:/gi, '').replace(/on\w+=/gi, '').trim();
}

function levenshteinDistance(str1, str2) {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(0));
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      if (str1[i - 1] === str2[j - 1]) {
        matrix[j][i] = matrix[j - 1][i - 1];
      } else {
        matrix[j][i] = Math.min(matrix[j - 1][i - 1] + 1, matrix[j][i - 1] + 1, matrix[j - 1][i] + 1);
      }
    }
  }
  return matrix[str2.length][str1.length];
}

function findBestMatch(userInput, commands) {
  let bestMatch = null;
  let bestScore = 0;
  const cleanInput = userInput.toLowerCase().trim();
  
  commands.forEach(cmd => {
    const cleanCommand = cmd.command.toLowerCase().trim();
    let score = 0;
    
    if (cleanInput === cleanCommand) {
      score = 1.0;
    } else if (cleanCommand.includes(cleanInput) || cleanInput.includes(cleanCommand)) {
      score = 0.8;
    } else {
      const distance = levenshteinDistance(cleanInput, cleanCommand);
      const maxLen = Math.max(cleanInput.length, cleanCommand.length);
      score = maxLen > 0 ? 1 - (distance / maxLen) : 0;
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = { command: cmd, score: score };
    }
  });
  
  return bestMatch;
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const userInput = sanitizeInput(input.value.trim());
  if (!userInput) return;
  
  addMessage(userInput, 'user');
  input.value = '';
  
  if (commands.length === 0) {
    setTimeout(() => addMessage("Data perintah belum dimuat. Silakan tunggu sebentar.", 'bot'), 300);
    return;
  }
  
  const bestMatch = findBestMatch(userInput, commands);
  
  if (bestMatch && bestMatch.score > 0.5) {
    const matched = commands.filter(cmd => cmd.command.toLowerCase() === bestMatch.command.command.toLowerCase());
    const randomResponse = matched[Math.floor(Math.random() * matched.length)].response;
    setTimeout(() => addMessage(randomResponse, 'bot'), 300);
  } else {
    const randomFallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    setTimeout(() => addMessage(randomFallback, 'bot'), 300);
  }
});

function addMessage(text, type) {
  const div = document.createElement('div');
  div.className = `message ${type}`;
  div.innerText = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

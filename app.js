let commands = [];
fetch('https://yanshs-cgi.github.io/cgi-all/cgi-ai-yansh.json')
  .then(res => { if (!res.ok) throw new Error('File JSON tidak ditemukan atau tidak bisa diakses.'); return res.json(); })
  .then(data => { commands = data; console.log("Commands loaded:", commands); })
  .catch(err => { console.error("Gagal load JSON:", err.message); alert("Gagal load data perintah. Pastikan URL file JSON benar dan valid."); });

const form = document.getElementById('command-form');
const input = document.getElementById('command-input');
const chatBox = document.getElementById('chat-box');
const fallbackResponses = ["Maaf, aku nggak ngerti perintah itu.","Perintah itu nggak ada di daftar, coba yang lain ya.","Hmmm... itu bukan sesuatu yang aku tahu.","Coba lagi, yang ini nggak nyambung 😅","Yah, aku belum ngerti maksud kamu 🫠","Gagal diproses. Mungkin typo?","Apa sih maksud kamu? Aku bukan cenayang.","Gak jelas, ulangin yang bener dong.","Serius? Perintah kayak gitu mana ada.","Kepala aku cenat-cenut liat perintah aneh gini 😩","Perintahmu kek mistik, ga bisa aku baca 😒","Tolong ya, yang masuk akal dikit napa.","Command kayak gini bikin otakku nge-lag.","Nope. Gak ketemu tuh di sistem.","Kayaknya kamu ngasal ngetik deh.","Coba pake perintah yang bener dong, bro.","Yakin itu perintah valid? Aku sih ragu.","Yang kamu ketik itu cuma cocok buat alien.","Lu kira aku Google Translate? Gak paham.","Buset... perintah apaan tuh?!","Perintah kayak gitu cuma ada di mimpi.","Gak bisa, bro. Reset otak kamu dulu coba.","Kok aneh sih? Bikin AI bingung aja.","Bodo amat, aku skip yang gini.","Next... aku males jawab yang gak jelas.","Perintah tidak ditemukan. Tapi kamu keren kok 😎","404: Command Not Found (dan gak mau dicari).","Hmm... ngarang ya kamu? Gak valid cuy.","Ealah... ini command atau sandi rahasia?","Salah tempat bro, ini bukan tempat ritual.","Plis, yang bener dong. Kasian aku loading terus.","Otakku mumet. Command itu kayak puisi surealis.","Lu kira aku peramal? Coba lagi lah.","Error di kamu, bukan aku.","Perintah kayak gitu cuma bisa di dunia mimpi.","Salah ketik ya? Atau kamu emang random?","Kayak gini nih yang bikin server panas.","Yang kamu ketik barusan... nonsense 😶","Aduh... perintah kamu kayak sinyal ilang.","Gagal konek sama logika kamu 😵‍💫","AI-nya nyerah sama kamu 😭","Bahkan Google aja bingung kalo liat gitu.","Aku bukan pesulap, jangan nyuruh aneh-aneh.","Sumpah... itu barusan bikin aku freeze 2 detik.","Coba lagi... dan kali ini jangan ngawur.","Apaan sih itu? Aku sampe ngedip dua kali bacanya.","Yaaah... itu bukan command. Itu lelucon ya?"];

form.addEventListener('submit', e => {
  e.preventDefault();
  const userInput = input.value.trim().toLowerCase();
  if (!userInput) return;
  addMessage(userInput, 'user');
  input.value = '';
  const allCommands = commands.map(cmd => cmd.command.toLowerCase());
  const bestMatch = stringSimilarity.findBestMatch(userInput, allCommands);
  const bestCommand = bestMatch.bestMatch.target;
  const bestScore = bestMatch.bestMatch.rating;
  if (bestScore > 0.6) {
    const matched = commands.filter(cmd => cmd.command.toLowerCase() === bestCommand);
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

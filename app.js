let commands=[];
fetch('https://yanshs-cgi.github.io/cgi-all/cgi-ai-yansh.json')
.then(res=>{if(!res.ok)throw new Error('File JSON tidak ditemukan atau tidak bisa diakses.');return res.json();})
.then(data=>{commands=data;console.log("Commands loaded:",commands);})
.catch(err=>{console.error("Gagal load JSON:",err.message);commands=[{command:"halo",response:"Halo juga! Gimana kabarnya hari ini?"},{command:"apa kabar",response:"Kabar baik! Saya siap membantu Anda."},{command:"selamat pagi",response:"Selamat pagi! Semoga hari ini menyenangkan."},{command:"selamat siang",response:"Selamat siang! Ada yang bisa saya bantu?"},{command:"selamat sore",response:"Selamat sore! Bagaimana hari Anda?"},{command:"selamat malam",response:"Selamat malam! Semoga istirahat yang nyenyak."},{command:"terima kasih",response:"Sama-sama! Senang bisa membantu."},{command:"makasih",response:"Dengan senang hati! Ada lagi yang perlu bantuan?"},{command:"bye",response:"Sampai jumpa! Jangan lupa balik lagi ya."},{command:"dadah",response:"Dadah! Take care dan sampai ketemu lagi."},{command:"siapa kamu",response:"Saya Suki AI, asisten virtual yang siap membantu Anda."},{command:"nama kamu",response:"Nama saya Suki AI. Saya di sini untuk membantu Anda."},{command:"kamu bisa apa",response:"Saya bisa chat dengan Anda, menjawab pertanyaan, dan membantu berbagai hal."},{command:"how are you",response:"I'm doing great! Ready to help you anytime."},{command:"good morning",response:"Good morning! Hope you have a wonderful day ahead."},{command:"good night",response:"Good night! Sweet dreams and rest well."},{command:"thank you",response:"You're very welcome! Happy to help anytime."},{command:"help",response:"Saya siap membantu! Coba ketik perintah atau pertanyaan Anda."},{command:"bantuan",response:"Tentu! Silakan ketik apa yang ingin Anda tanyakan atau lakukan."},{command:"testing",response:"Test berhasil! Sistem berjalan dengan baik."},{command:"test",response:"Testing complete! Semua sistem normal."},{command:"ping",response:"Pong! Koneksi lancar dan sistem aktif."},{command:"hello world",response:"Hello World! Classic greeting in programming."},{command:"tes mic",response:"Mic check 1, 2, 3... Suara jernih dan jelas!"},{command:"coba",response:"Silakan dicoba! Saya siap menangani berbagai perintah."},{command:"yo",response:"Yo! What's up? Ada yang bisa dibantu?"},{command:"hai",response:"Hai juga! Senang bertemu dengan Anda."},{command:"hi",response:"Hi there! Bagaimana saya bisa membantu hari ini?"},{command:"ok",response:"Oke! Lanjut aja, ada yang mau ditanyakan lagi?"},{command:"okay",response:"Okay! Siap untuk perintah atau pertanyaan selanjutnya."},{command:"mantap",response:"Mantap jiwa! Senang kalau Anda puas dengan hasilnya."},{command:"keren",response:"Makasih! Saya usahakan selalu memberikan yang terbaik."},{command:"bagus",response:"Terima kasih! Saya akan terus berusaha membantu dengan baik."},{command:"good",response:"Great! Glad everything is working well for you."},{command:"nice",response:"Nice! Thanks for the positive feedback."},{command:"cool",response:"Cool! Anything else I can help you with?"},{command:"awesome",response:"Awesome! Happy to hear that from you."},{command:"lol",response:"Haha! Senang bisa bikin Anda ketawa."},{command:"wkwk",response:"Wkwkwk! Lucu ya? Ada lagi yang mau dibahas?"},{command:"hehe",response:"Hehe! Seru nih ngobrolnya."},{command:"funny",response:"Glad I could make you smile! Humor makes everything better."},{command:"joke",response:"Why don't scientists trust atoms? Because they make up everything!"},{command:"lelucon",response:"Kenapa ayam menyeberang jalan? Karena mau ke seberang!"},{command:"lucu",response:"Hehe! Senang kalau bisa menghibur Anda sedikit."},{command:"ngakak",response:"Wkwkwk! Sampai ngakak segala. Ada lagi yang lucu?"},{command:"capek",response:"Wah, capek ya? Istirahat dulu aja, jangan dipaksain."},{command:"bosan",response:"Bosan nih? Mau ngobrol apa aja boleh, siapa tau jadi seru."},{command:"gabut",response:"Gabut ya? Yuk ngobrol-ngobrol aja, siapa tau ada yang menarik."},{command:"stress",response:"Stress? Take it easy, istirahat sebentar dan tarik napas dalam-dalam."},{command:"sedih",response:"Sedih kenapa? Cerita aja kalau mau, kadang sharing bisa bikin lega."},{command:"senang",response:"Wah senang dong! Senang juga lihat Anda happy."},{command:"happy",response:"That's wonderful! Your happiness makes me happy too."},{command:"excited",response:"Exciting! What's got you so pumped up today?"},{command:"tired",response:"Take some rest! Don't push yourself too hard."},{command:"sleepy",response:"Sleepy? Maybe it's time for a little nap or some coffee."},{command:"hungry",response:"Hungry? Time to grab some delicious food!"},{command:"lapar",response:"Lapar nih? Waktunya makan yang enak-enak!"}];console.log("Fallback commands loaded:",commands.length);});
const form=document.getElementById('command-form');
const input=document.getElementById('command-input');
const chatBox=document.getElementById('chat-box');
const fallbackResponses=["Maaf, aku nggak ngerti perintah itu.","Perintah itu nggak ada di daftar, coba yang lain ya.","Hmmm... itu bukan sesuatu yang aku tahu.","Coba lagi, yang ini nggak nyambung 😅","Yah, aku belum ngerti maksud kamu 🫠","Gagal diproses. Mungkin typo?","Apa sih maksud kamu? Aku bukan cenayang.","Gak jelas, ulangin yang bener dong.","Serius? Perintah kayak gitu mana ada.","Kepala aku cenat-cenut liat perintah aneh gini 😩","Perintahmu kek mistik, ga bisa aku baca 😒","Tolong ya, yang masuk akal dikit napa.","Command kayak gini bikin otakku nge-lag.","Nope. Gak ketemu tuh di sistem.","Kayaknya kamu ngasal ngetik deh.","Coba pake perintah yang bener dong, bro.","Yakin itu perintah valid? Aku sih ragu.","Yang kamu ketik itu cuma cocok buat alien.","Lu kira aku Google Translate? Gak paham.","Buset... perintah apaan tuh?!","Perintah kayak gitu cuma ada di mimpi.","Gak bisa, bro. Reset otak kamu dulu coba.","Kok aneh sih? Bikin AI bingung aja.","Bodo amat, aku skip yang gini.","Next... aku males jawab yang gak jelas.","Perintah tidak ditemukan. Tapi kamu keren kok 😎","404: Command Not Found (dan gak mau dicari).","Hmm... ngarang ya kamu? Gak valid cuy.","Ealah... ini command atau sandi rahasia?","Salah tempat bro, ini bukan tempat ritual.","Plis, yang bener dong. Kasian aku loading terus.","Otakku mumet. Command itu kayak puisi surealis.","Lu kira aku peramal? Coba lagi lah.","Error di kamu, bukan aku.","Perintah kayak gitu cuma bisa di dunia mimpi.","Salah ketik ya? Atau kamu emang random?","Kayak gini nih yang bikin server panas.","Yang kamu ketik barusan... nonsense 😶","Aduh... perintah kamu kayak sinyal ilang.","Gagal konek sama logika kamu 😵‍💫","AI-nya nyerah sama kamu 😭","Bahkan Google aja bingung kalo liat gitu.","Aku bukan pesulap, jangan nyuruh aneh-aneh.","Sumpah... itu barusan bikin aku freeze 2 detik.","Coba lagi... dan kali ini jangan ngawur.","Apaan sih itu? Aku sampe ngedip dua kali bacanya.","Yaaah... itu bukan command. Itu lelucon ya?","Wah, perintah ini agak asing buat saya. Coba dieja ulang?","Kayaknya ada salah ketik nih. Bisa diperjelas lagi?","Hmm, saya belum paham maksudnya. Coba dengan kata lain?","Perintah ini belum terdaftar di sistem. Yakin udah bener?","Maaf ya, saya masih bingung sama perintah ini.","Sepertinya typo atau memang perintah baru. Coba lagi dong.","Input tidak dikenali sistem. Mohon dicek kembali.","Saya butuh penjelasan lebih detail tentang maksud Anda.","Perintah kurang jelas, bisa diulangi dengan lebih spesifik?","Hmm, ini perintah apa ya? Saya belum familiar.","Kayaknya ada kesalahan penulisan. Coba diperbaiki.","Maaf, perintah ini di luar jangkauan pemahaman saya.","Bisa dijelaskan dengan cara yang berbeda?","Saya tidak mengerti maksud dari perintah tersebut.","Input terdeteksi tidak valid. Silakan coba lagi.","Perintah ini belum ada di database pengetahuan saya.","Mohon diulang dengan ejaan yang benar.","Sepertinya ada typo. Bisa dicek lagi?","Saya masih belum paham. Coba dengan kalimat lain.","Perintah tidak dikenal. Apakah ada kesalahan pengetikan?","Maaf, ini di luar kemampuan pemahaman saya saat ini.","Bisa dijabarkan lebih detail maksud perintahnya?","Hmm, perintah ini agak aneh. Yakin udah benar?","Saya butuh penjelasan lebih lanjut tentang ini.","Perintah kurang spesifik. Bisa diperjelas?","Maaf ya, saya belum bisa memproses permintaan ini.","Sepertinya ada kesalahan dalam penulisan perintah.","Input tidak dapat diinterpretasikan dengan benar.","Perintah ini belum familiar buat saya.","Bisa diulangi dengan format yang lebih jelas?","Hmm, saya kesulitan memahami konteks perintah ini.","Maaf, perintah tersebut belum bisa saya tangani.","Sepertinya perlu penjelasan tambahan untuk perintah ini.","Saya tidak dapat memproses input yang tidak jelas.","Perintah kurang lengkap. Bisa ditambahkan detail?","Hmm, ini perintah baru atau ada typo ya?","Maaf, saya belum mengerti maksud dari permintaan ini.","Bisa dijelaskan dengan bahasa yang lebih sederhana?","Perintah tidak dapat diidentifikasi dengan tepat.","Saya butuh informasi lebih detail tentang maksud Anda.","Sepertinya ada kesalahan dalam format penulisan.","Maaf ya, perintah ini agak membingungkan buat saya.","Input terdeteksi ambigu. Mohon diperjelas.","Perintah belum bisa dipahami sistem saat ini.","Hmm, bisa diulangi dengan cara yang berbeda?","Saya masih belajar tentang perintah seperti ini.","Maaf, permintaan kurang spesifik untuk diproses.","Sepertinya perlu reformulasi perintah yang lebih jelas.","Perintah tidak sesuai dengan pola yang saya kenali.","Bisa dijelaskan step by step maksud perintahnya?","Hmm, saya belum familiar dengan istilah tersebut.","Maaf, perintah ini di luar scope pemahaman saya.","Input memerlukan klarifikasi lebih lanjut.","Perintah kurang detail untuk dapat dieksekusi.","Sepertinya ada ambiguitas dalam perintah tersebut.","Saya tidak dapat menginterpretasi maksud yang dimaksud.","Bisa diparafrase dengan kata-kata yang berbeda?","Hmm, perintah ini agak kompleks. Bisa disederhanakan?","Maaf, saya belum bisa menangani jenis perintah ini.","Input tidak cocok dengan database perintah yang ada.","Perintah memerlukan konteks yang lebih spesifik.","Sepertinya ada inkonsistensi dalam format perintah.","Saya kesulitan menerjemahkan maksud dari input tersebut.","Maaf ya, perintah ini belum bisa saya eksekusi.","Bisa dijelaskan dengan contoh yang lebih konkret?","Hmm, sepertinya ada kesalahan dalam struktur perintah.","Perintah tidak dapat divalidasi dengan benar.","Saya butuh penjelasan yang lebih eksplisit."];
function levenshteinDistance(str1,str2){
const matrix=Array(str2.length+1).fill(null).map(()=>Array(str1.length+1).fill(0));
for(let i=0;i<=str1.length;i++)matrix[0][i]=i;
for(let j=0;j<=str2.length;j++)matrix[j][0]=j;
for(let j=1;j<=str2.length;j++){for(let i=1;i<=str1.length;i++){if(str1[i-1]===str2[j-1]){matrix[j][i]=matrix[j-1][i-1];}else{matrix[j][i]=Math.min(matrix[j-1][i-1]+1,matrix[j][i-1]+1,matrix[j-1][i]+1);}}}
return matrix[str2.length][str1.length];
}
function jaroWinklerSimilarity(str1,str2){
if(str1===str2)return 1;
const len1=str1.length;const len2=str2.length;const matchWindow=Math.floor(Math.max(len1,len2)/2)-1;
const str1Matches=new Array(len1).fill(false);const str2Matches=new Array(len2).fill(false);
let matches=0;let transpositions=0;
for(let i=0;i<len1;i++){const start=Math.max(0,i-matchWindow);const end=Math.min(i+matchWindow+1,len2);for(let j=start;j<end;j++){if(str2Matches[j]||str1[i]!==str2[j])continue;str1Matches[i]=str2Matches[j]=true;matches++;break;}}
if(matches===0)return 0;
let k=0;for(let i=0;i<len1;i++){if(!str1Matches[i])continue;while(!str2Matches[k])k++;if(str1[i]!==str2[k])transpositions++;k++;}
const jaro=(matches/len1+matches/len2+(matches-transpositions/2)/matches)/3;
let prefix=0;for(let i=0;i<Math.min(len1,len2,4);i++){if(str1[i]===str2[i])prefix++;else break;}
return jaro+(0.1*prefix*(1-jaro));
}
function soundex(str){
str=str.toUpperCase().replace(/[^A-Z]/g,'');
if(!str)return '0000';
const soundexMap={'B':'1','F':'1','P':'1','V':'1','C':'2','G':'2','J':'2','K':'2','Q':'2','S':'2','X':'2','Z':'2','D':'3','T':'3','L':'4','M':'5','N':'5','R':'6'};
let result=str[0];let prevCode=soundexMap[str[0]]||'0';
for(let i=1;i<str.length&&result.length<4;i++){const code=soundexMap[str[i]]||'0';if(code!=='0'&&code!==prevCode)result+=code;if(code!=='0')prevCode=code;}
return result.padEnd(4,'0');
}
function getMatchScore(input,command){
input=input.toLowerCase().trim();command=command.toLowerCase().trim();
if(input===command)return 1.0;
if(command.includes(input))return 0.95-(Math.abs(input.length-command.length)*0.02);
if(input.includes(command))return 0.90-(Math.abs(input.length-command.length)*0.02);
const levDistance=levenshteinDistance(input,command);const maxLen=Math.max(input.length,command.length);
const levSimilarity=maxLen>0?1-(levDistance/maxLen):0;
const jaroSimilarity=jaroWinklerSimilarity(input,command);
const soundexMatch=soundex(input)===soundex(command)?0.4:0;
const inputWords=input.split(/\s+/);const commandWords=command.split(/\s+/);
let wordMatches=0;let totalWords=Math.max(inputWords.length,commandWords.length);
inputWords.forEach(inputWord=>{let bestWordMatch=0;commandWords.forEach(commandWord=>{if(inputWord===commandWord){bestWordMatch=Math.max(bestWordMatch,1.0);}else if(commandWord.includes(inputWord)||inputWord.includes(commandWord)){bestWordMatch=Math.max(bestWordMatch,0.8);}else{const wordLevSim=1-(levenshteinDistance(inputWord,commandWord)/Math.max(inputWord.length,commandWord.length));bestWordMatch=Math.max(bestWordMatch,wordLevSim);}});wordMatches+=bestWordMatch;});
const wordSimilarity=totalWords>0?wordMatches/totalWords:0;
const lengthPenalty=Math.abs(input.length-command.length)>Math.max(input.length,command.length)*0.5?0.1:0;
const finalScore=(levSimilarity*0.25)+(jaroSimilarity*0.35)+(wordSimilarity*0.25)+(soundexMatch*0.15)-lengthPenalty;
return Math.max(0,Math.min(1,finalScore));
}
form.addEventListener('submit',e=>{
e.preventDefault();
const userInput=input.value.trim().toLowerCase();
if(!userInput)return;
addMessage(userInput,'user');
input.value='';
let bestMatch=null;let bestScore=0;
commands.forEach(cmd=>{const score=getMatchScore(userInput,cmd.command);if(score>bestScore){bestScore=score;bestMatch=cmd;}});
if(bestScore>0.4&&bestMatch){
const matched=commands.filter(cmd=>cmd.command.toLowerCase()===bestMatch.command.toLowerCase());
const randomResponse=matched[Math.floor(Math.random()*matched.length)].response;
setTimeout(()=>addMessage(randomResponse,'bot'),300);
}else{
const randomFallback=fallbackResponses[Math.floor(Math.random()*fallbackResponses.length)];
setTimeout(()=>addMessage(randomFallback,'bot'),300);
}
});
function addMessage(text,type){
const div=document.createElement('div');
div.className=`message ${type}`;
div.innerText=text;
chatBox.appendChild(div);
chatBox.scrollTop=chatBox.scrollHeight;
}

const SECURITY_CONFIG={MAX_INPUT_LENGTH:500,RATE_LIMIT_MS:1000,XSS_PATTERNS:[/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,/javascript:/gi,/on\w+\s*=/gi],SQL_INJECTION_PATTERNS:[/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)\b)/gi,/(UNION|OR|AND)\s+\d+\s*=\s*\d+/gi]};
let commands=[];
let lastRequestTime=0;
let sessionData={id:`session_${Date.now()}_${Math.random().toString(36).substr(2,9)}`,startTime:Date.now(),messageCount:0};
class AdvancedTypoDetector{
static levenshteinDistance(str1,str2){
const matrix=Array(str2.length+1).fill(null).map(()=>Array(str1.length+1).fill(0));
for(let i=0;i<=str1.length;i++)matrix[0][i]=i;
for(let j=0;j<=str2.length;j++)matrix[j][0]=j;
for(let j=1;j<=str2.length;j++){
for(let i=1;i<=str1.length;i++){
if(str1[i-1]===str2[j-1]){
matrix[j][i]=matrix[j-1][i-1];
}else{
matrix[j][i]=Math.min(matrix[j-1][i-1]+1,matrix[j][i-1]+1,matrix[j-1][i]+1);
}
}
}
return matrix[str2.length][str1.length];
}
static jaroWinklerSimilarity(str1,str2){
if(str1===str2)return 1;
const len1=str1.length;
const len2=str2.length;
const matchWindow=Math.floor(Math.max(len1,len2)/2)-1;
const str1Matches=new Array(len1).fill(false);
const str2Matches=new Array(len2).fill(false);
let matches=0;
let transpositions=0;
for(let i=0;i<len1;i++){
const start=Math.max(0,i-matchWindow);
const end=Math.min(i+matchWindow+1,len2);
for(let j=start;j<end;j++){
if(str2Matches[j]||str1[i]!==str2[j])continue;
str1Matches[i]=str2Matches[j]=true;
matches++;
break;
}
}
if(matches===0)return 0;
let k=0;
for(let i=0;i<len1;i++){
if(!str1Matches[i])continue;
while(!str2Matches[k])k++;
if(str1[i]!==str2[k])transpositions++;
k++;
}
const jaro=(matches/len1+matches/len2+(matches-transpositions/2)/matches)/3;
let prefix=0;
for(let i=0;i<Math.min(len1,len2,4);i++){
if(str1[i]===str2[i])prefix++;
else break;
}
return jaro+(0.1*prefix*(1-jaro));
}
static soundex(str){
str=str.toUpperCase().replace(/[^A-Z]/g,'');
if(!str)return '0000';
const soundexMap={'B':'1','F':'1','P':'1','V':'1','C':'2','G':'2','J':'2','K':'2','Q':'2','S':'2','X':'2','Z':'2','D':'3','T':'3','L':'4','M':'5','N':'5','R':'6'};
let result=str[0];
let prevCode=soundexMap[str[0]]||'0';
for(let i=1;i<str.length&&result.length<4;i++){
const code=soundexMap[str[i]]||'0';
if(code!=='0'&&code!==prevCode){
result+=code;
}
if(code!=='0')prevCode=code;
}
return result.padEnd(4,'0');
}
static getMatchScore(input,command){
input=input.toLowerCase().trim();
command=command.toLowerCase().trim();
if(input===command)return 1.0;
if(command.includes(input))return 0.95-(Math.abs(input.length-command.length)*0.02);
if(input.includes(command))return 0.90-(Math.abs(input.length-command.length)*0.02);
const levDistance=this.levenshteinDistance(input,command);
const maxLen=Math.max(input.length,command.length);
const levSimilarity=maxLen>0?1-(levDistance/maxLen):0;
const jaroSimilarity=this.jaroWinklerSimilarity(input,command);
const soundexMatch=this.soundex(input)===this.soundex(command)?0.4:0;
const inputWords=input.split(/\s+/);
const commandWords=command.split(/\s+/);
let wordMatches=0;
let totalWords=Math.max(inputWords.length,commandWords.length);
inputWords.forEach(inputWord=>{
let bestWordMatch=0;
commandWords.forEach(commandWord=>{
if(inputWord===commandWord){
bestWordMatch=Math.max(bestWordMatch,1.0);
}else if(commandWord.includes(inputWord)||inputWord.includes(commandWord)){
bestWordMatch=Math.max(bestWordMatch,0.8);
}else{
const wordLevSim=1-(this.levenshteinDistance(inputWord,commandWord)/Math.max(inputWord.length,commandWord.length));
bestWordMatch=Math.max(bestWordMatch,wordLevSim);
}
});
wordMatches+=bestWordMatch;
});
const wordSimilarity=totalWords>0?wordMatches/totalWords:0;
const lengthPenalty=Math.abs(input.length-command.length)>Math.max(input.length,command.length)*0.5?0.1:0;
const finalScore=(levSimilarity*0.25)+(jaroSimilarity*0.35)+(wordSimilarity*0.25)+(soundexMatch*0.15)-lengthPenalty;
return Math.max(0,Math.min(1,finalScore));
}
}
function sanitizeInput(input){
if(typeof input!=='string')return '';
let sanitized=input;
SECURITY_CONFIG.XSS_PATTERNS.forEach(pattern=>{
sanitized=sanitized.replace(pattern,'');
});
SECURITY_CONFIG.SQL_INJECTION_PATTERNS.forEach(pattern=>{
sanitized=sanitized.replace(pattern,'');
});
sanitized=sanitized.replace(/[<>"'&]/g,'').replace(/javascript:/gi,'').replace(/data:/gi,'').trim();
return sanitized.substring(0,SECURITY_CONFIG.MAX_INPUT_LENGTH);
}
function isRateLimited(){
const now=Date.now();
if(now-lastRequestTime<SECURITY_CONFIG.RATE_LIMIT_MS){
console.warn("Rate limit exceeded");
return true;
}
lastRequestTime=now;
return false;
}
function validateSession(){
sessionData.messageCount++;
if(sessionData.messageCount>1000){
console.warn("Session message limit exceeded");
return false;
}
if(Date.now()-sessionData.startTime>24*60*60*1000){
console.warn("Session expired");
return false;
}
return true;
}
const enhancedFallbackResponses=["Maaf, saya tidak dapat memahami perintah tersebut. Coba periksa ejaan atau gunakan kata yang lebih sederhana?","Hmm, sepertinya ada typo atau perintah yang tidak dikenal. Bisa diulang dengan kata lain?","Saya kesulitan memahami maksud Anda. Mungkin bisa dijelaskan dengan cara yang berbeda?","Perintah ini belum ada dalam database saya. Apakah Anda yakin ejaannya benar?","Maaf, saya belum bisa memproses perintah itu. Coba gunakan perintah yang lebih umum?","Sepertinya ada kesalahan ketik atau perintah baru. Bisa dicoba lagi dengan ejaan yang berbeda?","Sistem keamanan mendeteksi input yang tidak dikenal. Silakan coba dengan format yang benar.","AI saya sedang belajar dari input Anda. Mohon ulangi dengan ejaan yang lebih jelas.","Wah, perintah ini agak asing buat saya. Coba dieja ulang?","Kayaknya ada salah ketik nih. Bisa diperjelas lagi?","Hmm, saya belum paham maksudnya. Coba dengan kata lain?","Perintah ini belum terdaftar di sistem. Yakin udah bener?","Maaf ya, saya masih bingung sama perintah ini.","Sepertinya typo atau memang perintah baru. Coba lagi dong.","Input tidak dikenali sistem. Mohon dicek kembali.","Saya butuh penjelasan lebih detail tentang maksud Anda.","Perintah kurang jelas, bisa diulangi dengan lebih spesifik?","Hmm, ini perintah apa ya? Saya belum familiar.","Kayaknya ada kesalahan penulisan. Coba diperbaiki.","Maaf, perintah ini di luar jangkauan pemahaman saya.","Bisa dijelaskan dengan cara yang berbeda?","Saya tidak mengerti maksud dari perintah tersebut.","Input terdeteksi tidak valid. Silakan coba lagi.","Perintah ini belum ada di database pengetahuan saya.","Mohon diulang dengan ejaan yang benar.","Sepertinya ada typo. Bisa dicek lagi?","Saya masih belum paham. Coba dengan kalimat lain.","Perintah tidak dikenal. Apakah ada kesalahan pengetikan?","Maaf, ini di luar kemampuan pemahaman saya saat ini.","Bisa dijabarkan lebih detail maksud perintahnya?","Hmm, perintah ini agak aneh. Yakin udah benar?","Saya butuh penjelasan lebih lanjut tentang ini.","Perintah kurang spesifik. Bisa diperjelas?","Maaf ya, saya belum bisa memproses permintaan ini.","Sepertinya ada kesalahan dalam penulisan perintah.","Input tidak dapat diinterpretasikan dengan benar.","Perintah ini belum familiar buat saya.","Bisa diulangi dengan format yang lebih jelas?","Hmm, saya kesulitan memahami konteks perintah ini.","Maaf, perintah tersebut belum bisa saya tangani.","Sepertinya perlu penjelasan tambahan untuk perintah ini.","Saya tidak dapat memproses input yang tidak jelas.","Perintah kurang lengkap. Bisa ditambahkan detail?","Hmm, ini perintah baru atau ada typo ya?","Maaf, saya belum mengerti maksud dari permintaan ini.","Bisa dijelaskan dengan bahasa yang lebih sederhana?","Perintah tidak dapat diidentifikasi dengan tepat.","Saya butuh informasi lebih detail tentang maksud Anda.","Sepertinya ada kesalahan dalam format penulisan.","Maaf ya, perintah ini agak membingungkan buat saya.","Input terdeteksi ambigu. Mohon diperjelas.","Perintah belum bisa dipahami sistem saat ini.","Hmm, bisa diulangi dengan cara yang berbeda?","Saya masih belajar tentang perintah seperti ini.","Maaf, permintaan kurang spesifik untuk diproses.","Sepertinya perlu reformulasi perintah yang lebih jelas.","Perintah tidak sesuai dengan pola yang saya kenali.","Bisa dijelaskan step by step maksud perintahnya?","Hmm, saya belum familiar dengan istilah tersebut.","Maaf, perintah ini di luar scope pemahaman saya.","Input memerlukan klarifikasi lebih lanjut.","Perintah kurang detail untuk dapat dieksekusi.","Sepertinya ada ambiguitas dalam perintah tersebut.","Saya tidak dapat menginterpretasi maksud yang dimaksud.","Bisa diparafrase dengan kata-kata yang berbeda?","Hmm, perintah ini agak kompleks. Bisa disederhanakan?","Maaf, saya belum bisa menangani jenis perintah ini.","Input tidak cocok dengan database perintah yang ada.","Perintah memerlukan konteks yang lebih spesifik.","Sepertinya ada inkonsistensi dalam format perintah.","Saya kesulitan menerjemahkan maksud dari input tersebut.","Maaf ya, perintah ini belum bisa saya eksekusi.","Bisa dijelaskan dengan contoh yang lebih konkret?","Hmm, sepertinya ada kesalahan dalam struktur perintah.","Perintah tidak dapat divalidasi dengan benar.","Saya butuh penjelasan yang lebih eksplisit.","Maaf, input terdeteksi tidak lengkap.","Sepertinya perlu reformulasi dengan pendekatan berbeda.","Perintah belum sesuai dengan standar yang dikenal.","Hmm, bisa diperjelas lagi maksud sebenarnya?","Saya masih memerlukan informasi tambahan.","Maaf, perintah ini agak ambigu untuk diproses.","Input memerlukan spesifikasi yang lebih detail.","Perintah tidak dapat dipetakan ke fungsi yang tersedia.","Sepertinya ada mismatch antara input dan ekspektasi.","Saya belum bisa memahami konteks lengkap perintah.","Maaf ya, permintaan ini di luar kapabilitas saat ini.","Bisa diulangi dengan terminologi yang lebih familiar?","Hmm, perintah ini memerlukan parsing ulang.","Perintah tidak dapat diinterpretasi secara akurat.","Saya butuh guidance lebih lanjut untuk memahami ini.","Maaf, input terdeteksi tidak standar.","Sepertinya perlu pendekatan yang berbeda untuk perintah ini.","Perintah belum bisa disesuaikan dengan sistem.","Hmm, bisa dijelaskan dengan analogi yang lebih mudah?","Saya masih mencoba memahami maksud dari permintaan ini.","Maaf, perintah ini agak kompleks untuk diproses langsung.","Input memerlukan dekonstruksi lebih lanjut.","Perintah tidak sesuai dengan pola standar yang ada.","Sepertinya ada gap dalam pemahaman konteks.","Saya belum bisa mengekstrak informasi yang dibutuhkan.","Maaf ya, permintaan ini memerlukan klarifikasi tambahan.","Bisa dijabarkan dengan langkah-langkah yang lebih jelas?","Hmm, perintah ini di luar range pemahaman normal.","Perintah tidak dapat dikonversi ke aksi yang tepat.","Saya butuh bantuan untuk memahami maksud sebenarnya.","Maaf, input terdeteksi tidak konsisten.","Sepertinya perlu rekonstruksi perintah yang lebih sistematis.","Perintah belum bisa diadaptasi ke sistem yang ada.","Hmm, bisa diperjelas dengan definisi yang lebih spesifik?","Saya masih memproses untuk memahami permintaan ini."];

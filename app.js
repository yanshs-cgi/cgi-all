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
const enhancedFallbackResponses=["Maaf, saya tidak dapat memahami perintah tersebut. Coba periksa ejaan atau gunakan kata yang lebih sederhana?","Hmm, sepertinya ada typo atau perintah yang tidak dikenal. Bisa diulang dengan kata lain?","Saya kesulitan memahami maksud Anda. Mungkin bisa dijelaskan dengan cara yang berbeda?","Perintah ini belum ada dalam database saya. Apakah Anda yakin ejaannya benar?","Maaf, saya belum bisa memproses perintah itu. Coba gunakan perintah yang lebih umum?","Sepertinya ada kesalahan ketik atau perintah baru. Bisa dicoba lagi dengan ejaan yang berbeda?","Sistem keamanan mendeteksi input yang tidak dikenal. Silakan coba dengan format yang benar.","AI saya sedang belajar dari input Anda. Mohon ulangi dengan ejaan yang lebih jelas."];
async function loadCommands(){
try{
console.log("Loading commands...");
const response=await fetch('https://yanshs-cgi.github.io/cgi-all/cgi-ai-yansh.json',{method:'GET',headers:{'Accept':'application/json','Cache-Control':'no-cache'},timeout:10000});
if(!response.ok){
throw new Error(`HTTP ${response.status}: ${response.statusText}`);
}
const data=await response.json();
if(!Array.isArray(data)){
throw new Error('Invalid data format: expected array');
}
commands=data.filter(cmd=>cmd&&typeof cmd.command==='string'&&typeof cmd.response==='string'&&cmd.command.length>0&&cmd.response.length>0).map(cmd=>({command:sanitizeInput(cmd.command),response:sanitizeInput(cmd.response)}));
console.log(`Commands loaded: ${commands.length} valid commands`);
try{
const cacheData={commands:commands,timestamp:Date.now(),version:'2.0',checksum:btoa(JSON.stringify(commands)).slice(0,16)};
localStorage.setItem('suki_secure_cache',JSON.stringify(cacheData));
}catch(cacheError){
console.warn("Cache storage failed:",cacheError);
}
}catch(error){
console.error("Command loading failed:",error);
try{
const cachedData=JSON.parse(localStorage.getItem('suki_secure_cache')||'{}');
if(cachedData.commands&&Array.isArray(cachedData.commands)){
commands=cachedData.commands;
console.log(`Loaded from cache: ${commands.length} commands`);
showToast("Data dimuat dari cache lokal","warning");
}else{
throw new Error('No valid cache found');
}
}catch(cacheError){
console.error("Cache fallback failed:",cacheError);
showToast("Gagal memuat data perintah. Beberapa fitur tidak tersedia.","error");
}
}
}
async function processCommand(userInput){
if(isRateLimited()){
showToast("Mohon tunggu sebentar sebelum mengirim pesan berikutnya","warning");
return;
}
if(!validateSession()){
showToast("Sesi tidak valid. Silakan refresh halaman.","error");
return;
}
const sanitizedInput=sanitizeInput(userInput);
if(!sanitizedInput||sanitizedInput.length<1){
showToast("Input tidak valid","error");
return;
}
addMessage(sanitizedInput,'user');
showTypingIndicator();
try{
if(commands.length===0){
hideTypingIndicator();
addMessage("Data perintah belum dimuat. Silakan tunggu atau refresh halaman.",'bot');
return;
}
let bestMatch=null;
let bestScore=0;
const suggestions=[];
commands.forEach(cmd=>{
const score=AdvancedTypoDetector.getMatchScore(sanitizedInput,cmd.command);
if(score>bestScore){
bestScore=score;
bestMatch=cmd;
}
if(score>0.3){
suggestions.push({command:cmd.command,score});
}
});
await new Promise(resolve=>setTimeout(resolve,800+Math.random()*1200));
hideTypingIndicator();
if(bestScore>0.4&&bestMatch){
const similarCommands=commands.filter(cmd=>cmd.command.toLowerCase()===bestMatch.command.toLowerCase());
const randomResponse=similarCommands[Math.floor(Math.random()*similarCommands.length)];
let responseText=randomResponse.response;
if(bestScore<0.8){
responseText+=`\n\nTingkat kepercayaan: ${Math.round(bestScore*100)}%`;
}
if(bestScore<0.95&&sanitizedInput.toLowerCase()!==bestMatch.command.toLowerCase()){
responseText+=`\nMungkin maksud Anda: "${bestMatch.command}"`;
}
addMessage(responseText,'bot');
}else{
let fallbackResponse=enhancedFallbackResponses[Math.floor(Math.random()*enhancedFallbackResponses.length)];
if(suggestions.length>0){
suggestions.sort((a,b)=>b.score-a.score);
const topSuggestions=suggestions.slice(0,3).map(s=>s.command);
fallbackResponse+=`\n\nSaran perintah: ${topSuggestions.join(', ')}`;
}
addMessage(fallbackResponse,'bot');
}
}catch(error){
hideTypingIndicator();
console.error("Command processing error:",error);
addMessage("Terjadi kesalahan sistem. Silakan coba lagi.",'bot');
}
}
function addMessage(text,type){
const chatBox=document.getElementById('chat-box');
const div=document.createElement('div');
div.className=`message ${type}`;
div.innerHTML=escapeHtml(text);
const timestamp=document.createElement('span');
timestamp.className='timestamp';
timestamp.textContent=new Date().toLocaleTimeString();
div.appendChild(timestamp);
chatBox.appendChild(div);
chatBox.scrollTop=chatBox.scrollHeight;
div.style.opacity='0';
div.style.transform='translateY(10px)';
setTimeout(()=>{
div.style.transition='all 0.3s ease';
div.style.opacity='1';
div.style.transform='translateY(0)';
},50);
}
function showTypingIndicator(){
const chatBox=document.getElementById('chat-box');
const indicator=document.createElement('div');
indicator.id='typing-indicator';
indicator.className='message bot typing';
indicator.innerHTML='<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
chatBox.appendChild(indicator);
chatBox.scrollTop=chatBox.scrollHeight;
}
function hideTypingIndicator(){
const indicator=document.getElementById('typing-indicator');
if(indicator){
indicator.remove();
}
}
function showToast(message,type='info'){
const toast=document.createElement('div');
toast.className=`toast toast-${type}`;
toast.textContent=message;
document.body.appendChild(toast);
setTimeout(()=>{
toast.classList.add('show');
},100);
setTimeout(()=>{
toast.classList.remove('show');
setTimeout(()=>toast.remove(),300);
},3000);
}
function escapeHtml(text){
const div=document.createElement('div');
div.textContent=text;
return div.innerHTML;
}
document.addEventListener('DOMContentLoaded',function(){
console.log("Suki AI Enhanced Security System Initialized");
loadCommands();
setTimeout(()=>{
addMessage('Halo! Saya Suki AI dengan sistem keamanan tingkat tinggi dan deteksi typo yang sangat canggih. Kirim perintah Anda, saya akan memahami maksud Anda meskipun ada typo!','bot');
},1000);
const form=document.getElementById('command-form');
const input=document.getElementById('command-input');
form.addEventListener('submit',e=>{
e.preventDefault();
const userInput=input.value.trim();
if(!userInput)return;
input.value='';
processCommand(userInput);
});
input.addEventListener('input',e=>{
const value=e.target.value;
if(value.length>SECURITY_CONFIG.MAX_INPUT_LENGTH){
e.target.value=value.substring(0,SECURITY_CONFIG.MAX_INPUT_LENGTH);
showToast(`Maksimal ${SECURITY_CONFIG.MAX_INPUT_LENGTH} karakter`,'warning');
}
});
setInterval(()=>{
if(!validateSession()){
showToast("Sesi keamanan tidak valid. Silakan refresh halaman.","error");
}
},60000);
});
window.addEventListener('error',function(e){
console.error('Global error:',e.error);
showToast("Terjadi kesalahan sistem","error");
});
console.log("Suki AI Enhanced Security & Typo Detection System Loaded");

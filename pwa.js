'use strict';
// iPhone/web adapter. Minden személyes adat helyben marad.
let offlineState='pending', onlineError='', ocrScript, ocrBusy=false, ocrWorker=null;
const pwaRoot=new URL('./',location.href);
const pwaUrl=name=>new URL(name,pwaRoot).href;
const standalone=()=>window.navigator.standalone===true||matchMedia('(display-mode: standalone)').matches;
function updatePwaStatus(){
 const el=$('pwaStatus');if(!el)return;
 if(offlineState==='ready'){el.innerHTML='<div class="pwa-status-row"><span>✓ Offline használatra kész</span>'+(standalone()?'':'<button class="link" onclick="showPwaHelp()">Főképernyőre</button>')+'</div>';el.className='pwa-ready';return}
 if(offlineState==='error'){el.innerHTML='<div class="pwa-status-row"><span>'+esc(onlineError||'Az offline letöltés nem sikerült.')+'</span><button class="link" onclick="showPwaHelp()">Segítség</button></div>';el.className='pwa-error';return}
 el.innerHTML='<div class="pwa-status-row"><span><i class="pwa-dot"></i> Offline receptek és képfelismerés előkészítése…</span></div>';el.className='pwa-pending';
}
async function initializeOffline(){
 updatePwaStatus();
 if(!('serviceWorker' in navigator)||!isSecureContext){offlineState='error';onlineError='Az offline használathoz HTTPS-kapcsolat szükséges.';updatePwaStatus();return}
 try {
  const reg=await navigator.serviceWorker.register(pwaUrl('sw.js'),{scope:'./',updateViaCache:'none'});
  if(reg.active){offlineState='ready';updatePwaStatus()}
  const worker=reg.installing;
  if(worker)worker.addEventListener('statechange',()=>{
   if(worker.state==='activated'){offlineState='ready';updatePwaStatus()}
   if(worker.state==='redundant'&&!reg.active){offlineState='error';onlineError='Az offline mentés nem készült el. Interneten nyisd meg újra.';updatePwaStatus()}
  });
  navigator.serviceWorker.ready.then(()=>{offlineState='ready';updatePwaStatus()});
 }catch(e){offlineState='error';onlineError='Az offline mentés nem indult el. Interneten próbáld újra.';updatePwaStatus()}
}
function showPwaHelp(){
 modal(modalHead('Segítség az alkalmazáshoz')+'<div class="stack section"><div class="notice"><b>'+ (standalone()?'Az alkalmazás ikonról fut.':'Így kerül az iPhone főképernyőjére:')+'</b><ol class="pwa-steps"><li>Nyisd meg ezt az oldalt a Safari böngészőben.</li><li>Koppints a Megosztás ikonra (négyzet, felfelé nyíl).</li><li>Válaszd: Főképernyőhöz adás.</li><li>Ha látszik, kapcsold be a „Megnyitás webappként” lehetőséget, majd koppints a Hozzáadásra.</li><li>A főképernyőn keresd a zöld, főzőedényes „Mit főzzek?” ikont.</li></ol></div><div class="card"><h3>Első indítás és internet</h3><p class="small section">Nyisd meg az ikonról egyszer internet mellett, és várd meg az „Offline használatra kész” jelzést. Utána a receptek, a mentések és a képről történő dátumfelismerés internet nélkül is működhetnek.</p><p class="small section">Az offline állapot: <b>'+({pending:'Előkészítés',ready:'Kész',error:'Nem kész'}[offlineState])+'</b>.</p></div><div class="card"><h3>Mit főzzek ma?</h3><p class="small section">A Főoldalon sorsolhatsz ételt, a Receptek között kereshetsz, a Süteményeknél édes és sós finomságokat találsz. A szívvel kedvencet mentesz.</p></div><div class="card"><h3>Mentések</h3><p class="small section">A Beállításokban készíts biztonsági mentést, és mentsd a Fájlok alkalmazásba. Itt Androidról exportált JSON-mentést is visszaállíthatsz. A Safari és a főképernyős app adatai elkülönülhetnek; a mentést az ikonról megnyitott alkalmazásba importáld. A böngésző tárhelye törölhető, ezért a rendszeres mentés fontos.</p></div></div>'+btn('Rendben','closeModal()','primary block'),'pwa-help');
}
// A megosztási lap iPhone-on a Fájlokba mentés opciót is adhatja.
function exportBackup(){
 const text=JSON.stringify(data,null,2),name='MitFozzek-mentes-'+today()+'.json';
 const blob=new Blob([text],{type:'application/json'});
 function download(){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);notify('A mentési fájl elkészült.')}
 try{
  const f=new File([blob],name,{type:'application/json'});
  if(navigator.share&&navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f],title:'Mit főzzek? – biztonsági mentés'}).catch(e=>{if(e?.name!=='AbortError')download()});return}
 }catch(e){}
 download();
}
function loadOCR(){
 if(window.Tesseract)return Promise.resolve(window.Tesseract);
 if(ocrScript)return ocrScript;
 ocrScript=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=pwaUrl('ocr/tesseract.min.js');s.onload=()=>window.Tesseract?resolve(window.Tesseract):reject(Error('OCR'));s.onerror=()=>reject(Error('OCR'));document.head.appendChild(s)}).catch(e=>{ocrScript=null;throw e});
 return ocrScript;
}
function scanStatus(message){scanMessage=message;const n=document.querySelector('#modal [role="status"]');if(n&&S.modal==='pantry-edit')n.textContent=message}
function preparePhoto(file){
 return new Promise((resolve,reject)=>{
  const u=URL.createObjectURL(file),im=new Image();
  im.onload=()=>{try{const max=1800,f=Math.min(1,max/Math.max(im.naturalWidth,im.naturalHeight)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(im.naturalWidth*f));canvas.height=Math.max(1,Math.round(im.naturalHeight*f));const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(im,0,0,canvas.width,canvas.height);resolve(canvas)}catch(e){reject(e)}finally{URL.revokeObjectURL(u)}};
  im.onerror=()=>{URL.revokeObjectURL(u);reject(Error('A képfájl nem olvasható.'))};im.src=u;
 });
}
async function runDateOCR(file){
 const canvas=await preparePhoto(file);
 const T=await loadOCR();
 let w;
 try{
  w=await T.createWorker('eng',1,{workerPath:pwaUrl('ocr/worker.min.js'),corePath:pwaUrl('ocr/core/'),langPath:pwaUrl('ocr/lang'),workerBlobURL:false,gzip:true,cacheMethod:'none',logger:m=>{if(m.status==='recognizing text')scanStatus('Dátum felismerése: '+Math.round((m.progress||0)*100)+'%');else scanStatus('Képfelismerő előkészítése…')}});
  ocrWorker=w;
  await w.setParameters({tessedit_char_whitelist:'0123456789./- ',tessedit_pageseg_mode:'6',preserve_interword_spaces:'1'});
  const first=await w.recognize(canvas);
  let text=first.data.text||'';
  if(!extractDates(text).length){await w.setParameters({tessedit_pageseg_mode:'7'});const next=await w.recognize(canvas);text+='\n'+(next.data.text||'')}
  return text;
 }finally{if(w)await w.terminate();ocrWorker=null}
}
// File picker must be launched directly from a user's gesture.
function requestScan(kind,gallery){
 if(kind!=='expiry'||scanPending||ocrBusy){notify('A beolvasás már folyamatban van.');return}
 if(!isSecureContext){notify('A dátumfelismeréshez nyisd meg az alkalmazást HTTPS-kapcsolaton.');return}
 captureDraft();const input=$(gallery?'pwaGallery':'pwaCamera');input.value='';input.click();
}
async function handlePhotoChange(e){
 const file=e.target.files?.[0];e.target.value='';
 if(!file||ocrBusy||!pantryDraft||S.modal!=='pantry-edit')return;
 if(file.size>30*1024*1024){notify('A kép túl nagy. Készíts közelebbi, kisebb felbontású képet.');return}
 captureDraft();const token=panId();scanPending={kind:'expiry',token};ocrBusy=true;dateChoices=[];scanMessage='Lejárati dátum felismerése…';renderPantryEditor();
 let timer;
 try{
  const result=await Promise.race([runDateOCR(file),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('A felismerés túl sokáig tart. Írd be kézzel, vagy próbálkozz kisebb képpel.')),90000)})]);
  window.receiveScan(token,'expiry',result,result.trim()?'':'Nem találtam olvasható dátumot. Próbáld közelebbről fényképezni.');
 }catch(err){if(ocrWorker)try{await ocrWorker.terminate()}catch{};window.receiveScan(token,'expiry','',err?.message?.startsWith('A ') ? err.message : 'A képfelismerés nem sikerült. Írd be kézzel, vagy próbáld újra.')}
 finally{clearTimeout(timer);ocrBusy=false;}
}
$('pwaCamera').addEventListener('change',handlePhotoChange);$('pwaGallery').addEventListener('change',handlePhotoChange);
initializeOffline();

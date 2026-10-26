// Prueba únicamente la aplicación local en una instancia aislada de Chrome.
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
(async()=>{
 const targets=await (await fetch('http://127.0.0.1:9333/json/list')).json();
 const target=targets.find(t=>t.type==='page'&&(t.url==='about:blank'||t.url==='http://localhost:4173/'));
 if(!target)throw new Error('No se encontró la página vacía del navegador de prueba.');
 const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));
 let id=0;const pending=new Map();ws.addEventListener('message',e=>{const msg=JSON.parse(e.data);if(pending.has(msg.id)){const [resolve,reject]=pending.get(msg.id);pending.delete(msg.id);msg.error?reject(new Error(msg.error.message)):resolve(msg.result);}});
 const call=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,[resolve,reject]);ws.send(JSON.stringify({id,method,params}));});
 const evalJS=async expression=>{const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw new Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
 const wait=ms=>new Promise(r=>setTimeout(r,ms));
 const output=path.join(__dirname,'../reference-frames',process.env.QA_OUTPUT||'');
 fs.mkdirSync(output,{recursive:true});
 const localPage='http://localhost:4173'+(process.env.PREVIEW_PAGE||'/');
 async function screenshot(name){const result=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(output,name),Buffer.from(result.data,'base64'));}
 await call('Emulation.setDeviceMetricsOverride',{width:1440,height:1100,deviceScaleFactor:1,mobile:false});
 await call('Page.navigate',{url:localPage});await wait(800);
 await screenshot('local-desktop.png');
 await call('Emulation.setDeviceMetricsOverride',{width:390,height:1040,deviceScaleFactor:1,mobile:true});await wait(200);
 assert.ok(await evalJS('document.documentElement.scrollWidth <= innerWidth'),'El formulario no debe desbordar en celular.');
 await screenshot('local-mobile.png');
 await evalJS("document.getElementById('name').value='Persona de prueba';document.getElementById('department').value='Dependencia de prueba';document.getElementById('start').click();document.querySelector('input[name=answer][value=\"4\"]').click();document.getElementById('next').click();document.getElementById('previous').click();");
 assert.equal(await evalJS("document.querySelector('input[name=answer]:checked').value"),'4');
 await wait(500);await screenshot('local-question.png');
 await call('Page.navigate',{url:localPage+'?demo=diploma'});await wait(800);
 assert.ok(await evalJS("document.getElementById('diploma').naturalWidth===2160 && document.getElementById('diploma').naturalHeight===2160"),'La insignia debe generarse como un PNG cuadrado de alta resolución.');
 assert.ok(await evalJS('document.documentElement.scrollWidth <= innerWidth'),'El comprobante no debe desbordar.');
 await screenshot('local-result-mobile.png');
 await call('Emulation.setDeviceMetricsOverride',{width:1100,height:1100,deviceScaleFactor:1,mobile:false});await wait(200);await screenshot('local-diploma.png');
 for(const score of [18,28,37,45]){
  const png=await evalJS(`(async()=>{const profile=leadershipVisual(${score});await showDiploma({id:'muestra-00000000',name:'María Fernanda López',department:'Dirección de Atención al Vecino',score:${score},level:profile.label,description:profile.description,date:'26/10/2026'},true);return diplomaCanvas.toDataURL('image/png');})()`);
  fs.writeFileSync(path.join(output,'receipt-'+score+'.png'),Buffer.from(png.split(',')[1],'base64'));
 }
 console.log('OK: formulario sin desbordamiento móvil, respuesta conservada al regresar, insignias PNG de 2160 × 2160. Sin envíos a Google Sheets.');
 await call('Browser.close');ws.close();
})().catch(e=>{console.error(e);process.exit(1)});

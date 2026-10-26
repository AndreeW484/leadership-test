const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const targets=await(await fetch('http://127.0.0.1:9333/json/list')).json();
 const target=targets.find(t=>t.type==='page'&&t.url==='about:blank');
 const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));
 let id=0;const pending=new Map();ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(pending.has(m.id)){pending.get(m.id)(m.result);pending.delete(m.id);}});
 const call=(method,params={})=>new Promise(resolve=>{pending.set(++id,resolve);ws.send(JSON.stringify({id,method,params}));});
 const evaluate=async expression=>{const result=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw new Error(JSON.stringify(result.exceptionDetails));return result.result.value;};
 const wait=ms=>new Promise(r=>setTimeout(r,ms));
 const output=path.join(__dirname,'../reference-frames');
 async function screenshot(name){const result=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(output,name),Buffer.from(result.data,'base64'));}
 await call('Emulation.setDeviceMetricsOverride',{width:1200,height:1100,deviceScaleFactor:1,mobile:false});
 await call('Page.navigate',{url:'http://localhost:4173/badges.html'});await wait(500);
 assert.equal(await evaluate('document.querySelectorAll(".badge").length'),4);await screenshot('badge-gallery.png');
 await call('Page.navigate',{url:'http://localhost:4173/qr.html'});await wait(600);
 assert.equal(await evaluate('document.getElementById("download").disabled'),false);await screenshot('qr-design.png');
 await call('Emulation.setDeviceMetricsOverride',{width:390,height:1100,deviceScaleFactor:1,mobile:true});await wait(100);
 assert.ok(await evaluate('document.documentElement.scrollWidth<=innerWidth'));await screenshot('qr-design-mobile.png');
 assert.equal(await evaluate("document.getElementById('url').value"),'https://leadership-test-munig.netlify.app/');
 assert.equal(await evaluate('document.getElementById("download").disabled'),false);
 for(const [variable,name] of [['qrCanvas','qr-validation.png'],['posterCanvas','qr-poster-validation.png']]){
  const data=await evaluate(variable+'.toDataURL("image/png")');fs.writeFileSync(path.join(output,name),Buffer.from(data.split(',')[1],'base64'));
  const finalName=variable==='qrCanvas'?'QR-liderazgo.png':'QR-liderazgo-afiche.png';
  fs.writeFileSync(path.join(__dirname,'dist/assets',finalName),Buffer.from(data.split(',')[1],'base64'));
 }
 await call('Browser.close');ws.close();console.log('OK: galería de 4 insignias, diseño móvil y QR definitivo exportado a Netlify.');
})().catch(e=>{console.error(e);process.exit(1)});

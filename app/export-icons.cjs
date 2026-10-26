const fs=require('node:fs');
const path=require('node:path');
(async()=>{
 const targets=await(await fetch('http://127.0.0.1:9333/json/list')).json();
 const page=targets.find(t=>t.type==='page'&&t.url==='about:blank');
 if(!page)throw new Error('Se requiere una página de prueba vacía.');
 const ws=new WebSocket(page.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));
 let id=0;const pending=new Map();ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id);}});
 const call=(method,params={})=>new Promise(resolve=>{pending.set(++id,resolve);ws.send(JSON.stringify({id,method,params}));});
 const code=fs.readFileSync(path.join(__dirname,'draw-leadership-icons.js'),'utf8');
 await call('Runtime.evaluate',{expression:code});
 for(const type of ['compass','gear','sprout','beacon']){
  const r=await call('Runtime.evaluate',{expression:`drawLeadershipIcon('${type}').toDataURL('image/png')`,returnByValue:true});
  if(r.result.exceptionDetails)throw new Error(JSON.stringify(r.result.exceptionDetails));
  fs.writeFileSync(path.join(__dirname,'dist/assets/leadership-'+type+'.png'),Buffer.from(r.result.result.value.split(',')[1],'base64'));
 }
 await call('Browser.close');ws.close();console.log('4 iconos PNG transparentes exportados.');
})().catch(e=>{console.error(e);process.exit(1)});

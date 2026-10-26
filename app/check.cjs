const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const html = fs.readFileSync('dist/index.html', 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
new vm.Script(script);
const server = fs.readFileSync('google-apps-script/Code.gs', 'utf8');
new vm.Script(server);
const context = vm.createContext({});
vm.runInContext(script.slice(0, script.indexOf('const el=')) + '\nglobalThis.questions=QUESTIONS;globalThis.scale=SCALE;', context);
assert.equal(context.questions.length, 10);
assert.deepEqual(Array.from(context.scale, x=>x[0]), [5,4,3,2,1]);
// Server validation rejects incomplete or invalid submissions before accessing Sheets.
const serverContext = vm.createContext({});
vm.runInContext(server, serverContext);
for (const data of [null, {}, {id:'valid-id-123',name:'Persona',department:'Área',answers:[5]}, {id:'valid-id-123',name:'Persona',department:'Área',answers:Array(10).fill(6)}]) {
  assert.throws(()=>serverContext.submitResponse(data), /Datos inválidos/);
}
// Revisa todos los puntajes posibles y los límites de la rúbrica de la imagen.
for (let total=10; total<=50; total++) {
  const values=Array(10).fill(1);
  let extra=total-10;
  for(let i=0;i<10;i++){const add=Math.min(extra,4);values[i]+=add;extra-=add;}
  const result=serverContext.leadershipResult_(values);
  assert.equal(result.score,total);
  assert.equal(context.leadershipVisual(total).label,result.level,'El icono debe corresponder al nivel del servidor');
  assert.equal(context.leadershipVisual(total).description,result.description,'La descripción debe coincidir con la rúbrica original');
  assert.equal(result.level,total>=42?'Líder con propósito inspirador':total>=33?'Líder con propósito en desarrollo':total>=24?'Líder funcional':'Liderazgo sin propósito definido');
}
assert.equal(fs.readFileSync('google-apps-script/Index.html','utf8'),html,'Las dos versiones HTML deben coincidir');
assert.ok(script.includes('showDiploma(result)'));
assert.ok(script.includes("'image/png'"));
assert.equal(new Set([10,24,33,42].map(score=>context.leadershipVisual(score).icon)).size,4);
console.log('OK: sintaxis, 10 preguntas, escala, validación, 41 puntajes posibles y sincronización de HTML.');

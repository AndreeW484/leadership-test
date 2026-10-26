const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const {handler}=require('./netlify/functions/responses.js');
const root=path.join(__dirname,'dist');
const server=http.createServer(async(req,res)=>{
  const pathname=new URL(req.url,'http://localhost').pathname;
  if(pathname==='/api/responses'){
    let body='';
    for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>12000){res.writeHead(413);res.end();return;}}
    const result=await handler({httpMethod:req.method,body});
    res.writeHead(result.statusCode,result.headers);res.end(result.body);return;
  }
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
  const file=path.resolve(root,'.'+decodeURIComponent(pathname==='/'?'/index.html':pathname));
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg','.ttf':'font/ttf'};
  try{const data=fs.readFileSync(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(req.method==='HEAD'?'':data);}catch{res.writeHead(404);res.end('No encontrado');}
});
server.listen(4173,'127.0.0.1',()=>console.log('Vista local: http://localhost:4173'));

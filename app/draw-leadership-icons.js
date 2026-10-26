// Ilustraciones originales, exportadas a PNG transparente de 1536 × 1536.
// La misma paleta del formulario: azul petróleo, menta y verde lima.
function drawLeadershipIcon(type) {
 const canvas=document.createElement('canvas');canvas.width=1536;canvas.height=1536;
 const c=canvas.getContext('2d');c.scale(3,3);c.lineCap='round';c.lineJoin='round';
 const mint='#a6c68b',lime='#b9e56b',blue='#0b151c',light='#e0edca';
 function shape(points,fill,stroke,width=5){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}}
 function circle(x,y,r,fill,stroke,width=5){c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}}
 function line(points,color,width){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle=color;c.lineWidth=width;c.stroke();}
 function gradient(x,y,x2,y2,a,b){const g=c.createLinearGradient(x,y,x2,y2);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
 function sparkle(x,y,r){shape([[x,y-r],[x+r*.28,y-r*.28],[x+r,y],[x+r*.28,y+r*.28],[x,y+r],[x-r*.28,y+r*.28],[x-r,y],[x-r*.28,y-r*.28]],lime);}
 // Sombra tonal tenue para mantener transparencia real fuera del dibujo.
 c.fillStyle='#00000030';c.beginPath();c.ellipse(256,441,153,20,0,0,Math.PI*2);c.fill();
 if(type==='compass'){
  circle(256,74,29,mint,blue,9);circle(256,74,13,blue);
  circle(256,265,165,gradient(100,100,400,430,mint,'#789a61'),blue,10);
  circle(256,265,139,blue);circle(256,265,120,'#1b2a30','#5d7352',3);
  for(let i=0;i<12;i++){const a=i*Math.PI/6;c.save();c.translate(256,265);c.rotate(a);line([[0,-104],[0,i%3===0?-88:-96]],i%3===0?lime:'#879a7d',i%3===0?5:3);c.restore();}
  shape([[215,292],[300,171],[278,312]],gradient(230,170,300,310,light,lime),blue,5);
  shape([[215,292],[278,312],[210,371]],mint,blue,5);circle(256,280,12,light,blue,4);sparkle(428,130,20);
 } else if(type==='gear'){
  const points=[];for(let i=0;i<48;i++){const a=i*Math.PI*2/48;const r=i%6<3?171:145;points.push([256+Math.cos(a)*r,261+Math.sin(a)*r]);}
  shape(points,gradient(100,90,420,420,mint,'#789a61'),blue,9);circle(256,261,106,blue);circle(256,261,88,'#213138','#6d8759',3);
  line([[209,263],[245,299],[307,228]],'#0e1c22',29);line([[209,255],[245,291],[307,220]],lime,22);sparkle(414,104,25);sparkle(100,382,14);
 } else if(type==='sprout'){
  c.fillStyle='#1b2b30';c.beginPath();c.ellipse(256,397,131,32,0,0,Math.PI*2);c.fill();line([[256,397],[256,273],[286,197]],mint,17);
  c.beginPath();c.moveTo(255,310);c.bezierCurveTo(154,327,102,247,115,169);c.bezierCurveTo(212,164,260,214,255,310);c.fillStyle=gradient(120,170,255,310,light,'#95b961');c.fill();c.strokeStyle=blue;c.lineWidth=6;c.stroke();
  line([[161,216],[246,299]],'#607d43',5);
  c.beginPath();c.moveTo(269,249);c.bezierCurveTo(244,139,313,88,409,100);c.bezierCurveTo(417,194,365,260,269,249);c.fillStyle=gradient(280,100,400,260,light,mint);c.fill();c.strokeStyle=blue;c.lineWidth=6;c.stroke();
  line([[287,230],[368,141]],'#66814c',5);
  c.beginPath();c.moveTo(139,403);c.quadraticCurveTo(256,379,373,403);c.strokeStyle=lime;c.lineWidth=12;c.stroke();sparkle(141,112,20);sparkle(409,306,17);
 } else if(type==='beacon'){
  shape([[241,133],[65,91],[65,205],[241,169]],gradient(65,140,241,140,'#b9e56b00','#b9e56b90'));
  shape([[271,133],[447,91],[447,205],[271,169]],gradient(271,140,447,140,'#b9e56b90','#b9e56b00'));
  shape([[222,203],[290,203],[323,415],[189,415]],gradient(190,200,320,415,light,mint),blue,8);
  shape([[216,251],[297,251],[305,299],[209,299]],'#4f6b4a');shape([[201,348],[312,348],[320,394],[194,394]],'#4f6b4a');
  shape([[209,122],[303,122],[303,202],[209,202]],blue,blue,8);shape([[224,133],[288,133],[288,184],[224,184]],lime);line([[256,136],[256,184]],blue,7);
  shape([[199,120],[256,71],[313,120]],mint,blue,7);line([[256,72],[256,52]],lime,7);line([[196,207],[316,207]],mint,13);
  shape([[170,419],[342,419],[355,439],[157,439]],mint,blue,7);sparkle(382,62,23);sparkle(105,296,16);
 }
 return canvas;
}

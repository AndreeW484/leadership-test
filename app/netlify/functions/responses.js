const DEFAULT_URL = 'https://script.google.com/macros/s/AKfycby4F2xOAa6AGJNydsLnMNlMJHCJ0yl-H_LDHFLl_L_T_P1RGjr-rfQR2z40M5XE5PfE/exec';

exports.handler = async (event) => {
  const response = (statusCode, body) => ({statusCode, headers: {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}, body: JSON.stringify(body)});
  if (event.httpMethod !== 'POST') return response(405, {ok:false});
  if (!event.body || Buffer.byteLength(event.body) > 12000) return response(400, {ok:false});
  let data;
  try { data=JSON.parse(event.body); } catch { return response(400,{ok:false}); }
  if (!data || typeof data.name !== 'string' || typeof data.department !== 'string' || !data.name.trim() || !data.department.trim() || data.name.length>150 || data.department.length>150 || typeof data.id!=='string' || !/^[a-zA-Z0-9-]{10,80}$/.test(data.id) || !Array.isArray(data.answers) || data.answers.length!==10 || !data.answers.every(n=>Number.isInteger(n)&&n>=1&&n<=5)) return response(400,{ok:false});
  try {
    const upstream = await fetch(process.env.APPS_SCRIPT_URL || DEFAULT_URL, {
      method: 'POST', headers:{'Content-Type':'text/plain;charset=utf-8'},
      body:JSON.stringify({id:data.id,name:data.name,department:data.department,answers:data.answers}),
      redirect:'follow',signal:AbortSignal.timeout(25000)
    });
    if(!upstream.ok) throw new Error('Error de Apps Script');
    const result=await upstream.json();
    if(!result.ok || typeof result.score!=='number' || typeof result.level!=='string') throw new Error('Respuesta inválida');
    return response(200,result);
  } catch {return response(502,{ok:false,error:'No se pudo confirmar el guardado. Reintenta con la misma evaluación.'});}
};

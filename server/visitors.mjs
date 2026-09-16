const initialized=new WeakMap();
const cookieName='__Host-laliga_visitor';
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function dayInBrasilia(now=Date.now()){return new Date(now-10800000).toISOString().slice(0,10)}
async function initialize(db){
  if(!initialized.has(db))initialized.set(db,db.batch([
    db.prepare('CREATE TABLE IF NOT EXISTS visitors (id TEXT PRIMARY KEY NOT NULL, first_day TEXT NOT NULL)'),
    db.prepare('CREATE TABLE IF NOT EXISTS daily_visitors (day TEXT NOT NULL, visitor_id TEXT NOT NULL, PRIMARY KEY (day, visitor_id))'),
  ]).catch(e=>{initialized.delete(db);throw e}));
  await initialized.get(db);
}
export async function visitorResponse(request,env,now=Date.now()){
  const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'private, no-store','Vary':'Cookie'};
  const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
  if(!['GET','POST'].includes(request.method))return json({error:'Método não permitido'},405);
  const origin=request.headers.get('Origin');
  if(request.method==='POST'&&((origin&&origin!==new URL(request.url).origin)||request.headers.get('Sec-Fetch-Site')==='cross-site'))return json({error:'Origem não permitida'},403);
  if(!env.DB)return json({error:'Contagem temporariamente indisponível'},503);
  try{
    await initialize(env.DB);
    const day=dayInBrasilia(now);
    const statements=[];
    const bot=/bot\b|crawler|spider|preview|headless/i.test(request.headers.get('User-Agent')||'');
    if(request.method==='POST'&&!bot){
      let id=(request.headers.get('Cookie')||'').split(';').map(s=>s.trim()).find(s=>s.startsWith(cookieName+'='))?.slice(cookieName.length+1);
      if(!uuid.test(id||''))id=crypto.randomUUID();
      headers['Set-Cookie']=`${cookieName}=${id}; Path=/; Max-Age=31536000; HttpOnly; Secure; SameSite=Lax`;
      statements.push(env.DB.prepare('INSERT OR IGNORE INTO visitors (id, first_day) VALUES (?, ?)').bind(id,day));
      statements.push(env.DB.prepare('INSERT OR IGNORE INTO daily_visitors (day, visitor_id) VALUES (?, ?)').bind(day,id));
    }
    statements.push(env.DB.prepare('SELECT (SELECT COUNT(*) FROM visitors) AS total, (SELECT COUNT(*) FROM daily_visitors WHERE day = ?) AS today, (SELECT MIN(first_day) FROM visitors) AS since').bind(day));
    const results=await env.DB.batch(statements),counts=results.at(-1).results[0];
    return json({...counts,day});
  }catch{return json({error:'Contagem temporariamente indisponível'},503)}
}

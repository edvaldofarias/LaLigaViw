import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {visitorResponse} from '../server/visitors.mjs';

function database(){
  const sql=new DatabaseSync(':memory:');
  return {prepare(text){return {text,args:[],bind(...args){return {...this,args}}}},async batch(statements){
    sql.exec('BEGIN');try{const results=statements.map(s=>({results:sql.prepare(s.text).all(...s.args)}));sql.exec('COMMIT');return results}catch(e){sql.exec('ROLLBACK');throw e}
  }};
}
const request=(cookie='',method='POST',extra={})=>new Request('https://example.com/api/visitors',{method,headers:{Cookie:cookie,Origin:'https://example.com','User-Agent':'Mozilla/5.0',...extra}});
test('counts anonymous browsers once overall and once per Brasília day',async()=>{
  const env={DB:database()},now=Date.parse('2026-09-17T02:59:00Z');
  const first=await visitorResponse(request(),env,now),cookie=first.headers.get('Set-Cookie').split(';')[0];
  assert.deepEqual(await first.json(),{total:1,today:1,since:'2026-09-16',day:'2026-09-16'});
  assert.match(first.headers.get('Set-Cookie'),/HttpOnly; Secure; SameSite=Lax/);
  const same=await visitorResponse(request(cookie),env,now);assert.equal((await same.json()).total,1);
  const another=await visitorResponse(request(),env,now);assert.equal((await another.json()).today,2);
  const tomorrow=await visitorResponse(request(cookie),env,now+120000);
  assert.deepEqual(await tomorrow.json(),{total:2,today:1,since:'2026-09-16',day:'2026-09-17'});
  assert.match(tomorrow.headers.get('Cache-Control'),/no-store/);
});
test('read-only requests and recognizable bots do not inflate counts',async()=>{
  const env={DB:database()};
  for(const req of [request('','GET'),request('','POST',{'User-Agent':'Googlebot'})]){
    const res=await visitorResponse(req,env);assert.equal((await res.json()).total,0);assert.equal(res.headers.get('Set-Cookie'),null);
  }
});
test('blocks cross-site writes and never reports fake counts on failure',async()=>{
  assert.equal((await visitorResponse(request('','POST',{Origin:'https://elsewhere.com'}),{DB:database()})).status,403);
  assert.equal((await visitorResponse(request('','DELETE'),{DB:database()})).status,405);
  const res=await visitorResponse(request(),{});assert.equal(res.status,503);assert.equal((await res.json()).total,undefined);
});

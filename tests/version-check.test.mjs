import test from 'node:test';
import assert from 'node:assert/strict';
import {createVersionCheck,reloadURL} from '../dist/version-check.mjs';
test('detects an update against the loaded page even on the first check, and announces once',async()=>{
  const notices=[];const check=createVersionCheck('aaaaaaaaaaaaaaaa',async()=>({version:'bbbbbbbbbbbbbbbb',forceReload:false}),v=>notices.push(v));
  await check();await check();assert.equal(notices.length,1);
});
test('offline and malformed results do not prompt; a later valid update still does',async()=>{
  let call=0;const notices=[];
  const check=createVersionCheck('aaaaaaaaaaaaaaaa',async()=>{call++;if(call===1)throw Error();return call===2?{}:{version:'bbbbbbbbbbbbbbbb',forceReload:true}},v=>notices.push(v));
  await check();await check();assert.equal(notices.length,0);await check();assert.equal(notices[0].forceReload,true);
});
test('same version stays quiet and reloading preserves the selected tab',async()=>{
  let count=0;await createVersionCheck('aaaaaaaaaaaaaaaa',async()=>({version:'aaaaaaaaaaaaaaaa'}),()=>count++)();assert.equal(count,0);
  assert.equal(reloadURL('https://example.com/?v=old#matches','bbbbbbbbbbbbbbbb'),'https://example.com/?v=bbbbbbbbbbbbbbbb#matches');
});

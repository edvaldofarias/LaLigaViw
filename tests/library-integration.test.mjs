import test from 'node:test';import assert from 'node:assert/strict';import vm from 'node:vm';import fs from 'node:fs';
test('Day.js integration respects Brasília across UTC midnight',()=>{
 const context=vm.createContext({Intl,Date});
 for(const file of ['dayjs-1.11.13.min.js','dayjs-utc.js','dayjs-timezone.js','dayjs-pt-br.js'])vm.runInContext(fs.readFileSync(new URL('../dist/vendor/'+file,import.meta.url),'utf8'),context);
 vm.runInContext(fs.readFileSync(new URL('../dist/date-utils.mjs',import.meta.url),'utf8').replace(/export /g,''),context);
 assert.equal(vm.runInContext(`brasiliaTime('2026-10-12T01:00:00Z')`,context),'22:00');
 assert.match(vm.runInContext(`brasiliaDate('2026-10-12T01:00:00Z',{day:'2-digit',month:'short'})`,context),/^11 de out/);
});
test('Fuse search recognizes a misspelled name and accented names without changing identity',()=>{
 const c=vm.createContext({});vm.runInContext(fs.readFileSync(new URL('../dist/vendor/fuse-7.1.0.min.js',import.meta.url),'utf8'),c);
 assert.equal(vm.runInContext(`new Fuse([{text:'Edvaldo Barcelona',id:42}],{keys:['text'],ignoreLocation:true,ignoreDiacritics:true,threshold:.32}).search('Edvado')[0].item.id`,c),42);
 assert.equal(vm.runInContext(`new Fuse([{text:'Ênio',id:1}],{keys:['text'],ignoreDiacritics:true}).search('Enio')[0].item.id`,c),1);
});

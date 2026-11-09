import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {simulateRoundSeven} from '../dist/round-simulation.mjs';
const data=JSON.parse(fs.readFileSync(new URL('../dist/data.json',import.meta.url)));
// A sétima rodada já está encerrada no snapshot; os cenários hipotéticos partem de uma cópia sem os resultados dela.
const pending=structuredClone(data);
for(const m of simulateRoundSeven(data).fixtures){const source=pending.matchs[m.id];delete source.dt;delete source.finished;source.st=0;}
test('round seven simulation changes points and goals without modifying official source',()=>{
 const before=JSON.stringify(pending),base=simulateRoundSeven(pending),m=base.fixtures[0];
 assert.equal(base.total,6);assert.equal(base.entered,0);
 const r=simulateRoundSeven(pending,{[m.id]:{home:4,away:1}});
 const home=r.rows.find(t=>t.id===m.team1),old=base.rows.find(t=>t.id===m.team1),away=r.rows.find(t=>t.id===m.team2),oldAway=base.rows.find(t=>t.id===m.team2);
 assert.equal(home.pts,old.pts+3);assert.equal(home.sg,old.sg+3);assert.equal(home.gp,old.gp+4);assert.equal(home.j,old.j+1);assert.equal(away.pts,oldAway.pts);assert.equal(away.gc,oldAway.gc+4);assert.equal(JSON.stringify(pending),before);
 const draw=simulateRoundSeven(pending,{[m.id]:{home:0,away:0}});assert.equal(draw.rows.find(t=>t.id===m.team1).pts,old.pts+1);assert.equal(draw.rows.find(t=>t.id===m.team2).pts,oldAway.pts+1);
});
test('blank and invalid scores are not counted; official results can be restored or overridden',()=>{
 const m=simulateRoundSeven(pending).fixtures[0];
 for(const value of [{home:null,away:1},{home:1.5,away:0},{home:-1,away:0},{home:100,away:0}])assert.equal(simulateRoundSeven(pending,{[m.id]:value}).entered,0);
 const d=structuredClone(pending);Object.assign(d.matchs[m.id],{st:3,dt:{qt_g1:2,qt_g2:0}});
 assert.equal(simulateRoundSeven(d).entered,1);assert.equal(simulateRoundSeven(d,{[m.id]:{home:null,away:null}}).entered,0);
 const r=simulateRoundSeven(d,{[m.id]:{home:0,away:3}});assert.equal(r.fixtures[0].custom,true);assert.equal(r.fixtures[0].away,3);
});
test('the completed round seven applies the official results and still accepts overrides',()=>{
 const base=simulateRoundSeven(data);
 assert.equal(base.total,6);assert.equal(base.entered,6);
 assert.ok(base.fixtures.every(f=>f.official&&!f.custom));
 const m=base.fixtures[0];
 const r=simulateRoundSeven(data,{[m.id]:{home:9,away:0}});
 assert.equal(r.fixtures[0].custom,true);assert.equal(r.fixtures[0].home,9);
 assert.equal(r.rows.find(t=>t.id===m.team1).gp,base.rows.find(t=>t.id===m.team1).gp-m.dt.qt_g1+9);
});

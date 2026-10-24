import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {simulateRoundSeven} from '../dist/round-simulation.mjs';
const data=JSON.parse(fs.readFileSync(new URL('../dist/data.json',import.meta.url)));
test('round seven simulation changes points and goals without modifying official source',()=>{
 const before=JSON.stringify(data),base=simulateRoundSeven(data),m=base.fixtures[0];
 assert.equal(base.total,6);assert.equal(base.entered,0);
 const r=simulateRoundSeven(data,{[m.id]:{home:4,away:1}});
 const home=r.rows.find(t=>t.id===m.team1),old=base.rows.find(t=>t.id===m.team1),away=r.rows.find(t=>t.id===m.team2),oldAway=base.rows.find(t=>t.id===m.team2);
 assert.equal(home.pts,old.pts+3);assert.equal(home.sg,old.sg+3);assert.equal(home.gp,old.gp+4);assert.equal(home.j,old.j+1);assert.equal(away.pts,oldAway.pts);assert.equal(away.gc,oldAway.gc+4);assert.equal(JSON.stringify(data),before);
 const draw=simulateRoundSeven(data,{[m.id]:{home:0,away:0}});assert.equal(draw.rows.find(t=>t.id===m.team1).pts,old.pts+1);assert.equal(draw.rows.find(t=>t.id===m.team2).pts,oldAway.pts+1);
});
test('blank and invalid scores are not counted; official results can be restored or overridden',()=>{
 const m=simulateRoundSeven(data).fixtures[0];
 for(const value of [{home:null,away:1},{home:1.5,away:0},{home:-1,away:0},{home:100,away:0}])assert.equal(simulateRoundSeven(data,{[m.id]:value}).entered,0);
 const d=structuredClone(data);Object.assign(d.matchs[m.id],{st:3,dt:{qt_g1:2,qt_g2:0}});
 assert.equal(simulateRoundSeven(d).entered,1);assert.equal(simulateRoundSeven(d,{[m.id]:{home:null,away:null}}).entered,0);
 const r=simulateRoundSeven(d,{[m.id]:{home:0,away:3}});assert.equal(r.fixtures[0].custom,true);assert.equal(r.fixtures[0].away,3);
});

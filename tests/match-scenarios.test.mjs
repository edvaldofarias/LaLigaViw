import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {matchQualificationScenarios,TRIALS} from '../dist/forecast.mjs';
const data=JSON.parse(fs.readFileSync(new URL('../dist/data.json',import.meta.url)));
const games=Object.entries(data.matchs).filter(([,m])=>m.fs==='1780479913323').sort(([,a],[,b])=>a.d_i-b.d_i);
const round=[...new Set(games.map(([,m])=>m.m_set))][6];
const [id,target]=games.find(([,m])=>m.m_set===round);
test('conditional projections appear only in round seven, keep G4 inside G8 and compare both sides',()=>{
 assert.equal(matchQualificationScenarios(data,games[0][0]),null);
 const r=matchQualificationScenarios(data,id);
 assert.equal(r.trials,TRIALS);assert.equal(r.teams.length,2);
 for(const team of r.teams){assert.deepEqual(team.scenarios.map(s=>s.outcome),[1,0,-1]);for(const row of team.scenarios){assert.ok(row.top4>=0&&row.top4<=row.top8&&row.top8<=1);for(const item of [...row.favorable4,...row.favorable8])assert.notEqual(item.matchId,id);}}
 assert.equal(matchQualificationScenarios(data,id),r,'unchanged live data reuse the cached projection');
});
test('a final result replaces hypothetical outcomes and newly finished games refresh the projection',()=>{
 const updated=structuredClone(data);Object.assign(updated.matchs[id],{st:3,dt:{qt_g1:4,qt_g2:1}});
 const r=matchQualificationScenarios(updated,id);
 assert.equal(r.final,true);assert.deepEqual(r.teams.map(t=>t.scenarios.map(s=>s.outcome)),[[1],[-1]]);
 const other=games.find(([other,m])=>other!==id&&m.m_set===round);
 Object.assign(updated.matchs[other[0]],{st:3,dt:{qt_g1:0,qt_g2:8}});
 const next=matchQualificationScenarios(updated,id);assert.notEqual(next,r);assert.equal(next.remaining,r.remaining-1);
 assert.equal(data.matchs[id].st,undefined,'the source stays unchanged');
});

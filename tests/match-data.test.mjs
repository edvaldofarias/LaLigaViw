import test from 'node:test';import assert from 'node:assert/strict';
import {normalizeMatch,normalizeCompetition} from '../dist/match-data.mjs';
import {calculateScores} from '../dist/player-score.mjs';
import {coachStatistics,coachAssignments} from '../dist/coaches.mjs';
import {matchAwards} from '../dist/awards.mjs';
import {readFileSync} from 'node:fs';
test('completed sparse scores supply only the missing zero and do not mutate source',()=>{
 const m={st:3,dt:{qt_g1:3}};assert.deepEqual(normalizeMatch(m).dt,{qt_g1:3,qt_g2:0});assert.deepEqual(m.dt,{qt_g1:3});
 assert.deepEqual(normalizeMatch({st:3,dt:{qt_g2:2}}).dt,{qt_g1:0,qt_g2:2});
 for(const m of [{st:0,dt:{qt_g1:3}},{st:3},{st:3,dt:{}},{st:3,dt:{qt_g1:3,qt_g2:null}},{st:3,dt:{qt_g1:'3'}},{st:3,dt:{qt_g1:-1}}])assert.equal(normalizeMatch(m),m);
});
test('round two scores, five awards and ten coach assignments are coherent',()=>{
 const data=JSON.parse(readFileSync(new URL('../dist/data.json',import.meta.url),'utf8'));
 // Simulate the sparse live response, rather than relying on the repaired snapshot.
 delete data.matchs['1780480363729'].dt.qt_g2;delete data.matchs['1786231940049'].dt.qt_g2;
 const d=normalizeCompetition(data);
 assert.equal(d.matchs['1780480363729'].dt.qt_g2,0);assert.equal(d.matchs['1786231940049'].dt.qt_g2,0);
 const picks=matchAwards.filter(a=>a.round===2);assert.equal(picks.length,5);
 for(const a of picks){assert.equal(d.player[a.playerId].team,a.teamId);assert.ok([d.matchs[a.matchId].team1,d.matchs[a.matchId].team2].includes(a.teamId));}
 const rows=calculateScores(d,matchAwards);
 assert.equal(rows.find(p=>p.id==='1789257941190').counts.goalkeeperCleanSheets,1);
 assert.equal(rows.find(p=>p.id==='1789257954893').counts.outfieldCleanSheets,1);
 assert.equal(rows.find(p=>p.id==='1789194951922').counts.goalkeeperCleanSheets,1);
 const secondRoundIds=new Set(picks.map(a=>a.matchId)),assignments=coachAssignments.filter(a=>secondRoundIds.has(a.matchId));assert.equal(assignments.length,10);
 const stats=coachStatistics(d,assignments);assert.deepEqual(stats.filter(c=>c.played).map(c=>[c.id,c.played,c.wins,c.draws,c.losses,c.gf,c.ga]),[['patrick',2,1,1,0,6,4],['enio',2,0,1,1,4,6],['renan',3,0,0,3,5,10],['guto',3,3,0,0,10,5]]);
});

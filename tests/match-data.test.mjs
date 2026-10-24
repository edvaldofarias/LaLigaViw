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
test('round six preserves the five organizer awards and grants four MVP points after completion',()=>{
 const data=JSON.parse(readFileSync(new URL('../dist/data.json',import.meta.url),'utf8'));
 const picks=matchAwards.filter(a=>a.round===6);
 assert.deepEqual(picks.map(a=>[a.matchId,a.playerId,a.teamId,a.name]),[
  ['1786247139164','1789196253284','-OuCECnOQDCHySBDLAxx','Nanddo'],
  ['1780480368454','1789172821599','-OuCE2n4ni8czw1OPXtQ','Edvaldo'],
  ['1786247139523','1789199583001','-OuCEBQOxXueVsu4_Pbt','Igor'],
  ['1786247140006','1789220349061','-OuCE8ygQVY-3BXzP80H','Reinaldo'],
  ['1786247139815','1789257889097','-OuCEIPXbahnsYG98j_K','Igor'],
 ]);
 assert.equal(new Set(matchAwards.map(a=>a.matchId)).size,matchAwards.length);
 for(const a of picks){
  const match=data.matchs[a.matchId];
  assert.equal(match.m_set,'1780480354570');
  assert.equal(data.player[a.playerId].team,a.teamId);
  assert.equal(data.player[a.playerId].name.trim().toLocaleLowerCase('pt-BR'),a.name.toLocaleLowerCase('pt-BR'));
  assert.ok([match.team1,match.team2].includes(a.teamId));
  data.matchs[a.matchId]={...match,st:3,dt:{qt_g1:0,qt_g2:0}};
 }
 const baseline=new Map(calculateScores(data).map(p=>[p.id,p.total]));
 const rows=calculateScores(data,picks);
 for(const a of picks){
  const player=rows.find(p=>p.id===a.playerId);
  assert.equal(player.counts.motm,1);
  assert.equal(player.total-baseline.get(a.playerId),4);
 }
 for(const a of picks)data.matchs[a.matchId]={...data.matchs[a.matchId],st:0,finished:false};
 for(const player of calculateScores(data,picks))assert.equal(player.counts.motm,0);
});

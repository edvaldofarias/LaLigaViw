import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {isSuspendedForMatch,roundCartola} from '../dist/cartola.mjs';
import {matchAwards} from '../dist/awards.mjs';
import {championshipSelections} from '../dist/selections.mjs';
import {relatedPlayers,SCORE_RULES} from '../dist/player-score.mjs';
import {summarizeMatch} from '../dist/match-stats.mjs';
const data=JSON.parse(fs.readFileSync(new URL('../dist/data.json',import.meta.url)));
test('round teams contain one goalkeeper and six outfield players with only round attendance and points',()=>{
 const round=championshipSelections[0].roundId,r=roundCartola(data,round,matchAwards,championshipSelections);
 for(const rows of [r.best,r.worst]){
  assert.equal(rows.length,7);assert.equal(rows.filter(p=>p.goalkeeper).length,1);
  for(const p of rows){
   let goals=0,yellow=0,red=0,present=false;
   for(const [id,m] of Object.entries(data.matchs))if(m.m_set===round){const sheet=data.matchDetails[id]?.data;for(const ids of relatedPlayers(sheet,m).values())if(ids.has(p.id))present=true;for(const row of summarizeMatch(sheet,m,data.player).players)if(row.playerId===p.id){goals+=row.goals;yellow+=row.yellow;red+=row.red;}}
   assert.ok(present);assert.equal(p.counts.goals,goals);assert.equal(p.counts.yellow,yellow);assert.equal(p.counts.red,red);
   assert.equal(p.total,SCORE_RULES.reduce((sum,rule)=>sum+p.counts[rule.key]*rule.points,0));
   assert.equal(p.counts.selections,championshipSelections.filter(s=>s.roundId===round&&s.players.some(x=>x.playerId===p.id)).length);
  }
 }
});
test('missing sheets do not fabricate zero-point players',()=>{const r=roundCartola({...data,matchDetails:{}},championshipSelections[0].roundId);assert.equal(r.best.length,0);assert.ok(r.pending>0)});

test('active suspensions exclude the player only from the next team match',()=>{
 const celo=data.player['1789196749177'];
 const matches=Object.values(data.matchs).filter(m=>m.team1===celo.team||m.team2===celo.team).sort((a,b)=>a.d_i-b.d_i);
 const suspendedIndex=matches.findIndex(m=>m.d_i===celo.SUSP);
 assert.ok(suspendedIndex>=0);
 assert.equal(isSuspendedForMatch(celo,matches[suspendedIndex+1],data.matchs),true);
 assert.equal(isSuspendedForMatch(celo,matches[suspendedIndex+2],data.matchs),false);
 assert.equal(isSuspendedForMatch({...celo,SUSP2:undefined},matches[suspendedIndex+1],data.matchs),false);
});

test('future suggestions select seven distinct eligible athletes with one goalkeeper and exclude byes',async()=>{
 const {suggestCartola,suggestCartolaGroups}=await import('../dist/cartola.mjs');
 const rounds=[...new Set(Object.values(data.matchs).map(m=>m.m_set))];
 for(const round of rounds.slice(4,7).filter(id=>Object.values(data.matchs).filter(m=>m.m_set===id).every(m=>!(Number(m.st)===3||m.finished)))){
  const rows=suggestCartola(data,round,matchAwards,championshipSelections);assert.equal(rows.length,7);assert.equal(new Set(rows.map(p=>p.id)).size,7);assert.equal(rows.filter(p=>p.goalkeeper).length,1);
  for(const p of rows){assert.ok(p.games>0);assert.ok(Number.isFinite(p.average));const match=Object.values(data.matchs).find(m=>m.m_set===round&&[m.team1,m.team2].includes(p.team));assert.ok(match);assert.equal(isSuspendedForMatch(p,match,data.matchs),false);}
  const groups=suggestCartolaGroups(data,round,matchAwards,championshipSelections);
  for(const group of [groups.ideal,groups.avoid]){assert.equal(group.length,7);assert.equal(group.filter(p=>p.goalkeeper).length,1);}
  assert.equal(new Set([...groups.ideal,...groups.avoid].map(p=>p.id)).size,14);
 }
});

test('Celo earns no positive or negative round-six points while suspended, even if listed',()=>{
 const id='1789196749177',p=data.player[id];
 const matches=Object.entries(data.matchs).filter(([,m])=>[m.team1,m.team2].includes(p.team)).sort(([,a],[,b])=>a.d_i-b.d_i);
 const index=matches.findIndex(([,m])=>m.d_i===p.SUSP),[mid,next]=matches[index+1];
 const m={...next,st:3,dt:{qt_g1:4,qt_g2:3}};
 const d={...data,matchs:{...data.matchs,[mid]:m},matchDetails:{...data.matchDetails,[mid]:{data:{list:{celo:{ac:7,team1:p.team,pl_id1:id,val1:0}}}}}};
 const r=roundCartola(d,m.m_set,matchAwards,championshipSelections);
 assert.equal(r.rows.find(p=>p.id===id)?.total??0,0);
 assert.equal(r.best.some(p=>p.id===id),false);
 assert.equal(r.worst.some(p=>p.id===id),false);
 const prior=roundCartola(d,matches[index][1].m_set,matchAwards,championshipSelections);
 assert.ok(prior.rows.some(p=>p.id===id),'the earlier match and its card remain in history');
});

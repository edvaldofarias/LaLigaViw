import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {roundCartola} from '../dist/cartola.mjs';
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

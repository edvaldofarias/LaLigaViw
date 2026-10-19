import test from 'node:test';
import assert from 'node:assert/strict';
import { championshipSelections, selectionsForPlayer } from '../dist/selections.mjs';

test('first-round choices preserve the seven supplied players and historical clubs',()=>{
  const round=championshipSelections.find(r=>r.id==='2026-round-1');
  assert.deepEqual(round.players.map(p=>[p.name,p.teamName]),[
    ['Gusthavo','Real Bétis'],['Edvaldo','Barcelona'],['Jonas','Sevilla'],
    ['Raffa Marum','Getafe'],['Lucas','Sevilla'],['Ricardinho','Villareal'],['Jeferson','Getafe'],
  ]);
  assert.equal(new Set(round.players.map(p=>p.playerId)).size,7);
  assert.equal(round.players.find(p=>p.name==='Lucas').playerId,'1789220929755');
});

test('history counts rounds by player ID and keeps the team from each selection',()=>{
  const history=[
    {id:'r1',players:[{playerId:'p',name:'Lucas',teamName:'Sevilla'}]},
    {id:'r2',players:[{playerId:'q',name:'Lucas',teamName:'Valência'}]},
    {id:'r3',players:[{playerId:'p',name:'Lucas',teamName:'Getafe'}]},
  ];
  assert.deepEqual(selectionsForPlayer('p',history).map(r=>r.id),['r1','r3']);
  assert.equal(selectionsForPlayer('p',history)[0].players[0].teamName,'Sevilla');
  assert.equal(selectionsForPlayer('q',history).length,1);
  assert.equal(selectionsForPlayer('missing',history).length,0);
});

test('every published selection has at most one goalkeeper',async()=>{
  const {isGoalkeeper}=await import('../dist/goalkeepers.mjs');
  for(const round of championshipSelections){
    assert.ok(round.players.filter(p=>isGoalkeeper(p.playerId,p.teamId)).length<=1,round.id);
  }
});

test('round two credits Gustavo Marques instead of the Real Madrid goalkeeper',async()=>{
  const {calculateScores}=await import('../dist/player-score.mjs');
  const {readFileSync}=await import('node:fs');
  const data=JSON.parse(readFileSync(new URL('../dist/data.json',import.meta.url)));
  const round=championshipSelections.find(r=>r.id==='2026-round-2');
  assert.equal(round.players.find(p=>p.teamName==='Real Madrid').playerId,'1789193447398');
  const scores=calculateScores(data,[],[round]);
  assert.equal(scores.find(p=>p.id==='1789193447398').components.find(c=>c.key==='selections').earned,6);
  assert.equal(scores.find(p=>p.id==='1789193322187').counts.selections,0);
});

test('round four credits the confirmed goalkeeper and seven distinct players',async()=>{
 const {calculateScores}=await import('../dist/player-score.mjs');
 const {readFileSync}=await import('node:fs');
 const data=JSON.parse(readFileSync(new URL('../dist/data.json',import.meta.url)));
 const round=championshipSelections.find(r=>r.id==='2026-round-4');
 assert.equal(round.players.length,7);
 assert.equal(new Set(round.players.map(p=>p.playerId)).size,7);
 assert.equal(round.players[0].playerId,'1789193322187');
 assert.equal(round.players[2].playerId,'1789220355162');
 const scores=calculateScores(data,[],[round]);
 for(const p of round.players)assert.equal(scores.find(s=>s.id===p.playerId).components.find(c=>c.key==='selections').earned,6);
});

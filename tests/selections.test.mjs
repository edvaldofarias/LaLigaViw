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

import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateScores} from '../dist/player-score.mjs';
const data={player:{a:{name:'Ana',team:'h',dt:'0=2#14=1'},b:{name:'Bia',team:'h'},c:{name:'Caio',team:'a',dt:'16=1'},d:{name:'Davi',team:'new'}},
  matchs:{m:{team1:'h',team2:'a',st:3,dt:{qt_g1:2,qt_g2:0}},scheduled:{team1:'h',team2:'a',dt:{qt_g1:5,qt_g2:0}}}};
test('uses exact weights, includes every registered teammate, and excludes unfinished matches',()=>{
  const awards=[{matchId:'m',playerId:'a'},{matchId:'m',playerId:'a'}];
  const picks=[{id:'r1',players:[{playerId:'a'},{playerId:'a'}]}];
  const rows=calculateScores(data,awards,picks),a=rows.find(p=>p.id==='a');
  assert.equal(a.total,17);assert.equal(a.components.reduce((n,c)=>n+c.earned,0),a.total);
  assert.equal(rows.find(p=>p.id==='b').total,3,'all registered teammates get the win');
  assert.equal(rows.find(p=>p.id==='c').total,-10);
  assert.equal(rows.find(p=>p.id==='d').rank,null);
});
test('ties share a rank and a draw earns one point without goal assumptions',()=>{
  const rows=calculateScores({...data,player:{a:{name:'Ana',team:'h'},b:{name:'Bia',team:'a'}},matchs:{m:{team1:'h',team2:'a',st:3,dt:{qt_g1:0,qt_g2:0}}}});
  assert.deepEqual(rows.map(p=>p.total),[1,1]);assert.deepEqual(rows.map(p=>p.rank),[1,1]);
});

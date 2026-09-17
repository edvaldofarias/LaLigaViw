import {goalkeepers,isGoalkeeper} from '../dist/goalkeepers.mjs';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateScores} from '../dist/player-score.mjs';
const data={player:{a:{name:'Ana',team:'h',dt:'0=2#14=1'},b:{name:'Bia',team:'h'},c:{name:'Caio',team:'a',dt:'16=1'},d:{name:'Davi',team:'new'}},
  matchs:{m:{team1:'h',team2:'a',st:3,dt:{qt_g1:2,qt_g2:0}},scheduled:{team1:'h',team2:'a',dt:{qt_g1:5,qt_g2:0}}}};
test('uses exact weights, includes every registered teammate, and excludes unfinished matches',()=>{
  const awards=[{matchId:'m',playerId:'a'},{matchId:'m',playerId:'a'}];
  const picks=[{id:'r1',players:[{playerId:'a'},{playerId:'a'}]}];
  const rows=calculateScores(data,awards,picks),a=rows.find(p=>p.id==='a');
  assert.equal(a.total,19);assert.equal(a.components.reduce((n,c)=>n+c.earned,0),a.total);
  assert.equal(rows.find(p=>p.id==='b').total,5,'all registered teammates get the win');
  assert.equal(rows.find(p=>p.id==='c').total,-12);
  assert.equal(rows.find(p=>p.id==='d').rank,null);
});
test('ties share a rank and a draw earns one point without goal assumptions',()=>{
  const rows=calculateScores({...data,player:{a:{name:'Ana',team:'h'},b:{name:'Bia',team:'a'}},matchs:{m:{team1:'h',team2:'a',st:3,dt:{qt_g1:0,qt_g2:0}}}});
  assert.deepEqual(rows.map(p=>p.total),[3,3]);assert.deepEqual(rows.map(p=>p.rank),[1,1]);
});

test('keeper clean sheets earn five instead of two, and every conceded goal deducts one for everyone',()=>{
  const keeper=goalkeepers[0],h=keeper.teamId;
  const player={[keeper.playerId]:{name:'Felipe',team:h},line:{name:'Colega',team:h}};
  const match=(a,b)=>({team1:h,team2:'away',st:3,dt:{qt_g1:a,qt_g2:b}});
  const d={player,matchs:{win:match(2,0),draw:match(0,0),loss:match(1,3),scheduled:{...match(0,0),st:0},missing:{...match(0,0),dt:{}},invalid:match(1,-1)}};
  const rows=calculateScores(d),g=rows.find(p=>p.id===keeper.playerId),l=rows.find(p=>p.id==='line');
  assert.equal(g.total,9); // results +2, two clean sheets +10, conceded -3
  assert.equal(l.total,3); // results +2, two clean sheets +4, conceded -3
  assert.equal(g.shirtNumber,1);assert.equal(g.teamGames,3);
  assert.equal(g.counts.goalkeeperCleanSheets,2);assert.equal(g.counts.outfieldCleanSheets,0);
  assert.equal(g.components.find(c=>c.key==='goalsAgainst').earned,-3);
  assert.equal(l.components.find(c=>c.key==='goalsAgainst').earned,-3);
  assert.ok(!g.components.some(c=>c.key==='outfieldCleanSheets'));
});
test('all twelve keepers match their registered teams and namesakes remain outfield',()=>{
  const d=JSON.parse(readFileSync(new URL('../dist/data.json',import.meta.url),'utf8'));
  assert.equal(goalkeepers.length,12);assert.equal(new Set(goalkeepers.map(p=>p.teamId)).size,12);
  for(const k of goalkeepers){assert.equal(d.player[k.playerId].team,k.teamId);assert.equal(d.player[k.playerId].name.trim().toLocaleLowerCase('pt-BR'),k.name.toLocaleLowerCase('pt-BR'));assert.ok(isGoalkeeper(k.playerId,k.teamId));}
  assert.equal(isGoalkeeper('1789220352095','-OuCE8ygQVY-3BXzP80H'),false); // Felipe, Rayo
  assert.equal(isGoalkeeper('1789199136075','-OuCE3jNN_OU-QexjdHw'),false); // Will, Valencia
  const rows=calculateScores(d);
  assert.equal(rows.find(p=>p.id==='1789220893017').total,8,'Will: win +3 and clean sheet +5');
  assert.equal(rows.find(p=>p.id==='1789172492805').total,0,'Felipe: win +3 and three conceded goals -3');
});

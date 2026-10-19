import {goalkeepers,isGoalkeeper} from '../dist/goalkeepers.mjs';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateScores,scoreDataStatus} from '../dist/player-score.mjs';
import {matchAwards} from '../dist/awards.mjs';
import {championshipSelections} from '../dist/selections.mjs';
const sheet=(...players)=>({data:{list:Object.fromEntries(players.map(([id,team,val1=0],i)=>[i,{ac:7,pl_id1:id,team1:team,val1}]))}});
const data={player:{a:{name:'Ana',team:'h',dt:'0=2#14=1'},b:{name:'Bia',team:'h'},c:{name:'Caio',team:'a',dt:'16=1'},d:{name:'Davi',team:'new'}},
  matchs:{m:{team1:'h',team2:'a',st:3,dt:{qt_g1:2,qt_g2:0}},scheduled:{team1:'h',team2:'a',dt:{qt_g1:5,qt_g2:0}}},matchDetails:{m:sheet(['a','h'],['c','a'])}};
test('uses exact weights only for related players and excludes unfinished matches',()=>{
  const awards=[{matchId:'m',playerId:'a'},{matchId:'m',playerId:'a'}];
  const picks=[{id:'r1',players:[{playerId:'a'},{playerId:'a'}]}];
  const rows=calculateScores(data,awards,picks),a=rows.find(p=>p.id==='a');
  assert.equal(a.total,33);assert.equal(a.components.reduce((n,c)=>n+c.earned,0),a.total);
  assert.equal(rows.find(p=>p.id==='b').total,0,'an unlisted teammate gets neither win nor clean-sheet bonus');
  assert.equal(rows.find(p=>p.id==='c').total,-5);
  assert.equal(rows.find(p=>p.id==='d').rank,null);
});
test('ties share a rank and a draw earns one point without goal assumptions',()=>{
  const rows=calculateScores({...data,matchDetails:{m:sheet(['a','h'],['b','a',0])},player:{a:{name:'Ana',team:'h'},b:{name:'Bia',team:'a'}},matchs:{m:{team1:'h',team2:'a',st:3,dt:{qt_g1:0,qt_g2:0}}}});
  assert.deepEqual(rows.map(p=>p.total),[7,7]);assert.deepEqual(rows.map(p=>p.rank),[1,1]);
});

test('keeper clean sheets earn seven instead of three, and every conceded goal deducts one only for related players',()=>{
  const keeper=goalkeepers[0],h=keeper.teamId;
  const player={[keeper.playerId]:{name:'Felipe',team:h},line:{name:'Colega',team:h},absent:{name:'Ausente',team:h}};
  const match=(a,b)=>({team1:h,team2:'away',st:3,dt:{qt_g1:a,qt_g2:b}});
  const d={player,matchs:{win:match(2,0),draw:match(0,0),loss:match(1,3),scheduled:{...match(0,0),st:0},missing:{...match(0,0),dt:{}},invalid:match(1,-1)}};
  d.matchDetails=Object.fromEntries(Object.keys(d.matchs).map(id=>[id,sheet([keeper.playerId,h],['line',h,0])]));
  const rows=calculateScores(d),g=rows.find(p=>p.id===keeper.playerId),l=rows.find(p=>p.id==='line');
  assert.equal(rows.find(p=>p.id==='absent').total,0);
  assert.equal(g.total,24); // appearances +6, results +7, clean sheets +14, conceded -3
  assert.equal(l.total,16); // appearances +6, results +7, clean sheets +6, conceded -3
  assert.equal(g.shirtNumber,1);assert.equal(g.teamGames,3);
  assert.equal(g.counts.goalkeeperCleanSheets,2);assert.equal(g.counts.outfieldCleanSheets,0);
  assert.equal(g.components.find(c=>c.key==='goalsAgainst').earned,-3);
  assert.equal(l.components.find(c=>c.key==='goalsAgainst').earned,-3);
  assert.ok(!g.components.some(c=>c.key==='outfieldCleanSheets'));
});
test('all twelve keepers match their registered teams and namesakes remain outfield',()=>{
  const d=JSON.parse(readFileSync(new URL('./fixtures/round-1.json',import.meta.url),'utf8'));
  assert.equal(goalkeepers.length,12);assert.equal(new Set(goalkeepers.map(p=>p.teamId)).size,12);
  for(const k of goalkeepers){assert.equal(d.player[k.playerId].team,k.teamId);assert.equal(d.player[k.playerId].name.trim().toLocaleLowerCase('pt-BR'),k.name.toLocaleLowerCase('pt-BR'));assert.ok(isGoalkeeper(k.playerId,k.teamId));}
  assert.equal(isGoalkeeper('1789220352095','-OuCE8ygQVY-3BXzP80H'),false); // Felipe, Rayo
  assert.equal(isGoalkeeper('1789199136075','-OuCE3jNN_OU-QexjdHw'),false); // Will, Valencia
  d.matchDetails=JSON.parse(readFileSync(new URL('../dist/data.json',import.meta.url),'utf8')).matchDetails;
  const rows=calculateScores(d);
  assert.equal(rows.find(p=>p.id==='1789220893017').total,14,'Will: attendance +2, win +5 and clean sheet +7');
  assert.equal(rows.find(p=>p.id==='1789172492805').total,4,'Felipe: attendance +2, win +5 and three conceded goals -3');
});


test('missing relations stay pending, goals are not proof of attendance, and duplicates count once',()=>{
  const noSheet=calculateScores({...data,matchDetails:{}});
  assert.equal(noSheet.find(p=>p.id==='a').total,13,'only individual goals/cards remain');
  assert.deepEqual(scoreDataStatus({...data,matchDetails:{}}),{pending:1,stale:0});
  const entry=sheet(['a','h',0],['a','h',0],['c','a']);
  entry.data.list.goal={ac:1,pl_id1:'b',team1:'h'};
  entry.data.list.foreign={ac:7,pl_id1:'b',team1:'other'};
  const rows=calculateScores({...data,matchDetails:{m:entry}});
  assert.equal(rows.find(p=>p.id==='a').total,23);
  assert.equal(rows.find(p=>p.id==='a').teamGames,1);
  assert.equal(rows.find(p=>p.id==='b').total,0);
  assert.deepEqual(scoreDataStatus({...data,matchDetails:{m:{...entry,error:true}}}),{pending:0,stale:1});
});

test('results follow the team in the match sheet after a transfer',()=>{
  const keeper=goalkeepers[0];
  const d={player:{[keeper.playerId]:{name:'Felipe',team:'new'}},
    matchs:{m:{team1:keeper.teamId,team2:'away',st:3,dt:{qt_g1:1,qt_g2:0}}},
    matchDetails:{m:sheet([keeper.playerId,keeper.teamId])}};
  const p=calculateScores(d)[0];
  assert.equal(p.total,14);assert.equal(p.counts.goalkeeperCleanSheets,1);
  assert.equal(p.components.find(c=>c.key==='goalkeeperCleanSheets').earned,7);
});

test('reserve means absent even when the source cumulative games include that match',()=>{
  const d=JSON.parse(readFileSync(new URL('./fixtures/attendance-rounds-1-2.json',import.meta.url),'utf8'));
  const rows=calculateScores(d);
  const indio=rows.find(p=>p.id==='1789194958115');
  assert.equal(indio.teamGames,0,'Índio was reserve/absent in both rounds');
  assert.equal(indio.counts.wins,0);assert.equal(indio.counts.goalsAgainst,0);
  const valtinho=rows.find(p=>p.id==='1789193346099');
  assert.equal(valtinho.teamGames,1,'Valtinho was absent in round two');
  assert.equal(valtinho.counts.goalsAgainst,4,'only round-one goals conceded');
});

test('absent reserves earn no result or defense points and known absences are not pending',()=>{
  const absent=sheet(['a','h',1],['b','h',1],['c','a',1]);
  const d={...data,matchDetails:{m:absent}};
  const rows=calculateScores(d);
  for(const p of rows){
    assert.equal(p.teamGames,0);
    for(const key of ['wins','draws','losses','goalkeeperCleanSheets','outfieldCleanSheets','goalsAgainst'])assert.equal(p.counts[key],0);
  }
  assert.deepEqual(scoreDataStatus(d),{pending:0,stale:0});
});

test('positive-priority formula keeps negative active players at ten percent or less',()=>{
  const real=JSON.parse(readFileSync(new URL('../dist/data.json',import.meta.url),'utf8'));
  const active=calculateScores(real,matchAwards,championshipSelections).filter(p=>p.active);
  const negative=active.filter(p=>p.total<0);
  assert.ok(negative.length/active.length<=0.1,`${negative.length} of ${active.length} active players are negative`);
  assert.ok(active.filter(p=>p.total>0).length/active.length>=0.85);
});

test('confirmed appearances deduplicate rosters, follow historical teams and ignore future matches',async()=>{
  const {playerAppearances}=await import('../dist/player-score.mjs');
  const d={player:{a:{team:'new',dt:'2=99'}},matchs:{
    past:{team1:'h',team2:'a',st:3,fs:'one'},
    absent:{team1:'h',team2:'a',st:3,fs:'one'},
    later:{team1:'new',team2:'a',finished:true,fs:'two'},
    future:{team1:'new',team2:'a',st:0,fs:'two'},
    missing:{team1:'new',team2:'a',st:3,fs:'two'}
  },matchDetails:{past:sheet(['a','h'],['a','h']),absent:sheet(['a','h',1]),later:sheet(['a','new']),future:sheet(['a','new'])}};
  assert.deepEqual(playerAppearances(d).get('a'),{total:2,byPhase:{one:1,two:1}});
  assert.equal(d.player.a.dt,'2=99');
});

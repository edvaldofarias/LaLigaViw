import test from 'node:test';
import assert from 'node:assert/strict';
import {buildStatistics} from '../dist/statistics.mjs';

const data={
  teams:{a:{name:'Time A'},b:{name:'Time B'},c:{name:'Time C'}},
  player:{
    a1:{name:'A Um',team:'a',dt:'0=5#14=1'},
    a2:{name:'A Dois',team:'a',dt:'0=3#16=1'},
    b1:{name:'B Um',team:'b',dt:'0=2#14=2'},
    c1:{name:'C Um',team:'c',dt:'0=1'},
  },
  matchs:{
    one:{st:3,d_i:1,team1:'a',team2:'b',dt:{qt_g1:4,qt_g2:0}},
    two:{st:3,d_i:2,team1:'c',team2:'a',dt:{qt_g1:1,qt_g2:2}},
    pending:{st:0,d_i:3,team1:'b',team2:'c'},
  },
};
const ranking=[
  {id:'a1',name:'A Um',team:'a',active:true,total:20,goalkeeper:false,counts:{}},
  {id:'b1',name:'B Um',team:'b',active:true,total:10,goalkeeper:true,counts:{appearances:1,goalsAgainst:4,goalkeeperCleanSheets:0}},
];
const staff=[{id:'coach',name:'Técnico',played:2,percent:67,points:4,gd:2}];

test('builds rankings only from completed matches with valid scores',()=>{
  const stats=buildStatistics(data,ranking,staff);
  assert.deepEqual(stats.summary,{matches:2,goals:7,average:3.5,cleanSheets:1,scorers:4,cards:4});
  assert.equal(stats.attacks[0].id,'a');
  assert.equal(stats.defenses[0].id,'a');
  assert.equal(stats.worstDefenses[0].id,'b');
  assert.equal(stats.biggestWins[0].id,'one');
  assert.equal(stats.highestScoring[0].id,'one');
});

test('selects MVP, scorers, discipline, goalkeepers, coaches and each team duo',()=>{
  const stats=buildStatistics(data,ranking,staff);
  assert.equal(stats.players[0].id,'a1');
  assert.deepEqual(stats.scorers.map(player=>player.id),['a1','a2','b1']);
  assert.equal(stats.indiscipline[0].id,'a2');
  assert.equal(stats.goalkeepers[0].average,4);
  assert.equal(stats.coaches[0].id,'coach');
  assert.equal(stats.indiscipline[0].discipline,1);
  assert.deepEqual(stats.duos.find(duo=>duo.teamId==='a').members.map(player=>player.id),['a1','a2']);
  assert.equal(stats.duos.find(duo=>duo.teamId==='a').goals,8);
});

test('counts selection, cartola and team award appearances without duplicating a round',()=>{
  const selections=[
    {roundId:'round',players:[{playerId:'a1',teamId:'a'},{playerId:'a1',teamId:'a'},{playerId:'b1',teamId:'b'}]},
    {roundId:'other',players:[{playerId:'a1',teamId:'a'}]},
  ];
  const awards=[{matchId:'one',playerId:'a2',teamId:'a'}];
  const stats=buildStatistics(data,ranking,staff,awards,selections);
  assert.equal(stats.selectionAppearances[0].id,'a1');
  assert.equal(stats.selectionAppearances[0].count,2);
  assert.equal(stats.teamHonors[0].id,'a');
  assert.equal(stats.teamHonors[0].players,2);
  assert.equal(stats.teamHonors[0].appearances,4);
  assert.deepEqual(stats.cartolaIdealAppearances,[]);
  assert.deepEqual(stats.cartolaWorstAppearances,[]);
});


test('worst defenses rank total goals conceded above per-game average',()=>{
  const matches={
    one:{st:3,team1:'c',team2:'b',dt:{qt_g1:4,qt_g2:0}},
    two:{st:3,team1:'c',team2:'a',dt:{qt_g1:2,qt_g2:0}},
    three:{st:3,team1:'c',team2:'a',dt:{qt_g1:2,qt_g2:0}},
    four:{st:3,team1:'c',team2:'a',dt:{qt_g1:2,qt_g2:0}},
  };
  const stats=buildStatistics({...data,matchs:matches},[],[]);
  assert.deepEqual(stats.worstDefenses.map(t=>[t.id,t.ga]),[['a',6],['b',4],['c',0]]);
  assert.equal(stats.worstDefenses[0].gaAverage,2);
  assert.equal(stats.worstDefenses[1].gaAverage,4);
});


test('most awarded teams rank award totals above distinct player counts',()=>{
  const selections=[
    {id:'r1',players:[{playerId:'a1',teamId:'a'},{playerId:'a2',teamId:'a'},{playerId:'b1',teamId:'b'}]},
    {id:'r2',players:[{playerId:'b1',teamId:'b'}]},
    {id:'r3',players:[{playerId:'b1',teamId:'b'}]},
  ];
  const stats=buildStatistics(data,ranking,staff,[],selections);
  assert.deepEqual(stats.teamHonors.map(t=>[t.id,t.appearances,t.players]),[['b',3,1],['a',2,2]]);
});

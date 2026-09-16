import test from 'node:test';
import assert from 'node:assert/strict';
import { summarizeMatch } from '../dist/match-stats.mjs';

const match = { team1:'home', team2:'away', dt:{qt_g1:2,qt_g2:1} };
const players = {
  p1:{name:'Ana',team:'away',dt:'0=50#14=10#16=3'},
  p2:{name:'Bia',team:'away',dt:'0=20#14=5#16=2'},
};
const sheet = {list:{
  a:{ac:1,pl_id1:'p1',team1:'home'},
  b:{ac:1,pl_id1:'p1',team1:'home'},
  c:{ac:3,pl_id1:'p1',team1:'home'},
  d:{ac:4,pl_id1:'p2',team1:'away'},
  lineup:{ac:7,pl_id1:'p3',team1:'home'},
  team:{ac:9,team1:'home'},
}};

test('counts only match events, groups repeated goals, and ignores lineups',()=>{
  const result=summarizeMatch(sheet,match,players);
  assert.equal(result.players.length,2);
  assert.deepEqual(result.totals,{goals:2,yellow:1,red:1,blue:0,ownGoals:0});
  const ana=result.players.find(p=>p.playerId==='p1');
  assert.equal(ana.goals,2);
  assert.equal(ana.yellow,1);
  assert.equal(ana.red,0);
  assert.equal(ana.teamId,'home','historical match team survives a transfer');
  assert.equal(result.goalDifference,1,'a missing scorer is not invented');
});

test('aggregate player statistics cannot leak into a match without events',()=>{
  for(const data of [null,{}, {list:{a:{ac:7,pl_id1:'p1',team1:'home'}}}]){
    const result=summarizeMatch(data,match,players);
    assert.equal(result.hasEvents,false);
    assert.equal(result.recordedGoals,0);
    assert.equal(result.totals.red,0);
  }
});

test('preserves unidentified players and teams without guessing attribution',()=>{
  const result=summarizeMatch({list:{
    a:{ac:1,pl_id1:'missing',team1:'home'},
    b:{ac:4,pl_id1:'p2',team1:'unknown'},
    c:null,
  }},match,players);
  assert.equal(result.players.find(p=>p.playerId==='missing').name,'Jogador não identificado');
  assert.equal(result.players.find(p=>p.playerId==='p2').teamId,null);
  assert.equal(result.unassigned,1);
});

test('distinguishes own goals and blue cards and detects excess goal records',()=>{
  const result=summarizeMatch({list:{
    a:{ac:8,pl_id1:'p1',team1:'home'},
    b:{ac:5,pl_id1:'p2',team1:'away'},
  }},{...match,dt:{qt_g1:0,qt_g2:0}},players);
  assert.equal(result.totals.goals,0);
  assert.equal(result.totals.ownGoals,1);
  assert.equal(result.recordedGoals,1);
  assert.equal(result.totals.blue,1);
  assert.equal(result.goalDifference,-1);
  assert.equal(summarizeMatch(null,{team1:'home',team2:'away'}).goalDifference,null);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildForecast, simulate, forecastContext, projectQualification } from '../dist/forecast.mjs';

const now = Date.parse('2026-09-16T21:00:00Z');
const cutoff = Date.parse('2026-09-14T12:00:00Z');
const fixture = {
  teams: { a: {name:'A'}, b: {name:'B'}, c: {name:'C'}, d: {name:'D'} },
  matchs: {
    past: {team1:'a',team2:'b',m_set:'r1',fs:'f1',d_i:cutoff-86400000,finished:cutoff-3600000,st:3,dt:{qt_g1:4,qt_g2:1}},
    other: {team1:'c',team2:'b',m_set:'r1',fs:'f1',d_i:cutoff-172800000,finished:cutoff-86400000,st:3,dt:{qt_g1:1,qt_g2:2}},
    next: {team1:'a',team2:'c',d_i:now+86400000,m_set:'r2',fs:'f1'},
    neutral: {team1:'b',team2:'d',d_i:now+86400000,m_set:'r2',fs:'f1'},
    later: {team1:'a',team2:'b',d_i:now+864000000,m_set:'r3',fs:'f1'},
  }
};

test('editions wait for the whole round, including delayed Saturday games and missing scores', () => {
  const copy=structuredClone(fixture);
  copy.matchs.next={...copy.matchs.next,d_i:now-2000,st:3,dt:{qt_g1:2,qt_g2:1}};
  copy.matchs.neutral.d_i=now-1000;
  assert.equal(buildForecast(copy,now).historyCount,2);
  copy.matchs.neutral.st=3;
  assert.equal(buildForecast(copy,now).historyCount,2);
  copy.matchs.neutral.dt={qt_g1:0,qt_g2:0};
  assert.equal(buildForecast(copy,now).historyCount,4);
  assert.equal(buildForecast(copy,now).completedRounds.length,2);
  assert.deepEqual(buildForecast(copy,now),buildForecast(copy,now+60000));
});

test('probabilities sum to one and fair odds equal their reciprocal', () => {
  const s=simulate(3,2,'test');
  assert.equal(s.trials,20000);
  assert.ok(Math.abs(s.probabilities.reduce((a,b)=>a+b,0)-1)<1e-12);
  s.probabilities.forEach((p,i)=>{assert.ok(p>0&&p<1);assert.equal(s.odds[i],1/p)});
  assert.ok(s.probabilities[0]>s.probabilities[2]);
  assert.deepEqual(s,simulate(3,2,'test'));
});

test('equally rated teams have no invented home advantage', () => {
  const s=simulate(2.9,2.9,'neutral');
  assert.equal(s.probabilities[0],s.probabilities[2]);
  const reverse=simulate(2,3,'test');
  assert.deepEqual(reverse.probabilities,simulate(3,2,'test').probabilities.toReversed());
});

test('only the next scheduled round receives forecasts', () => {
  const f=buildForecast(fixture,now);
  assert.equal(f.predictions.length,2);
  assert.equal(f.roundId,'r2');
  assert.equal(f.historyCount,2);
  assert.ok(f.predictions.every(p=>p.status==='ready'&&p.limitedHistory));
  assert.ok(f.predictions.find(p=>p.matchId==='neutral').teamGames.includes(0));
  assert.deepEqual(f,buildForecast(fixture,now+60000));
});

test('future results never leak and corrections to completed rounds trigger a new edition', () => {
  const copy=structuredClone(fixture);
  copy.matchs.future={team1:'a',team2:'c',d_i:now+1,finished:now+2,st:3,dt:{qt_g1:40,qt_g2:0}};
  assert.deepEqual(buildForecast(copy,now).predictions,buildForecast(fixture,now).predictions);
  copy.matchs.past.dt.qt_g1=5;
  assert.notEqual(buildForecast(copy,now).historyFingerprint,buildForecast(fixture,now).historyFingerprint);
});

test('missing history and undefined teams do not produce fabricated odds', () => {
  const copy=structuredClone(fixture);
  delete copy.matchs.past;delete copy.matchs.other;
  assert.ok(buildForecast(copy,now).predictions.every(p=>p.status==='insufficient_history'));
  delete copy.matchs.next.team2;
  assert.equal(buildForecast(copy,now).predictions.find(p=>p.matchId==='next').status,'awaiting_teams');
});

test('finished and started games never receive pre-match odds', () => {
  const copy=structuredClone(fixture);
  copy.matchs.next.st=3;copy.matchs.neutral.d_i=now-1;
  assert.deepEqual(buildForecast(copy,now).predictions.map(p=>p.matchId),['later']);
  assert.equal(buildForecast(copy,now+9999999999).predictions.length,0);
});

test('all zero historical scores are handled without division by zero', () => {
  const copy=structuredClone(fixture);
  for(const m of Object.values(copy.matchs))if(m.dt)m.dt={qt_g1:0,qt_g2:0};
  assert.ok(buildForecast(copy,now).predictions.every(p=>p.expectedGoals.every(Number.isFinite)));
});

test('league snapshot yields normalized valid forecasts', async () => {
  const data=JSON.parse(await readFile(new URL('../dist/data.json',import.meta.url)));
  const f=buildForecast(data,now);
  assert.ok(Array.isArray(f.predictions));
  for(const p of f.predictions.filter(p=>p.status==='ready'))assert.ok(Math.abs(p.probabilities.reduce((a,b)=>a+b,0)-1)<1e-12);
});

function league(){
  const teams=Object.fromEntries(Array.from({length:12},(_,i)=>['t'+i,{name:'Time '+i}]));
  const matchs={};
  for(let i=0;i<6;i++){
    matchs['past'+i]={team1:'t'+(2*i),team2:'t'+(2*i+1),fs:'phase',m_set:'first',d_i:now-86400000,st:3,dt:{qt_g1:2,qt_g2:1}};
    matchs['next'+i]={team1:'t'+i,team2:'t'+(i+6),fs:'phase',m_set:'second',d_i:now+86400000};
  }
  return {teams,matchs};
}
test('20,000 season simulations fill exactly four and eight places and preserve nested probabilities',()=>{
  const data=league(),before=JSON.stringify(data),q=projectQualification(data,forecastContext(data,now));
  assert.equal(q.status,'ready');assert.equal(q.trials,20000);assert.equal(q.remainingGames,6);
  assert.ok(Math.abs(q.teams.reduce((s,t)=>s+t.top4,0)-4)<1e-10);
  assert.ok(Math.abs(q.teams.reduce((s,t)=>s+t.top8,0)-8)<1e-10);
  for(const t of q.teams){assert.ok(t.top4>=0&&t.top4<=t.top8&&t.top8<=1);assert.equal(t.totalGames,2)}
  for(const c of Object.values(q.cutoffs)){assert.ok(c.low<=c.median&&c.median<=c.high);assert.ok(c.high<=6)}
  assert.ok(q.cutoffs.top4.median>=q.cutoffs.top8.median);
  assert.equal(JSON.stringify(data),before);
  assert.deepEqual(q,projectQualification(data,forecastContext(data,now+3600000)));
});
test('partial round results do not change chances until its final valid score arrives',()=>{
  const data=league(),q=projectQualification(data,forecastContext(data,now));
  data.matchs.next0={...data.matchs.next0,d_i:now-5000,st:3,dt:{qt_g1:12,qt_g2:0}};
  const partial=projectQualification(data,forecastContext(data,now));
  assert.deepEqual(partial.teams,q.teams);assert.equal(partial.partialRoundResults,1);
  for(let i=1;i<6;i++)data.matchs['next'+i]={...data.matchs['next'+i],d_i:now-1000,st:3,dt:{qt_g1:i,qt_g2:0}};
  const final=projectQualification(data,forecastContext(data,now));
  assert.equal(final.remainingGames,0);assert.equal(final.completedRounds,2);assert.notDeepEqual(final.teams,q.teams);
});
test('no history or undefined schedule means no invented qualification percentages',()=>{
  const data=league();delete data.matchs.next0.team2;
  assert.equal(projectQualification(data,forecastContext(data,now)).status,'incomplete_schedule');
  const empty=league();for(const m of Object.values(empty.matchs)){delete m.st;delete m.dt}
  assert.equal(projectQualification(empty,forecastContext(empty,now)).status,'insufficient_history');
});
test('a fully completed phase uses final official positions and exact qualification outcomes',()=>{
  const data=league();
  for(const m of Object.values(data.matchs)){m.st=3;m.d_i=now-1000;m.dt={qt_g1:0,qt_g2:0}}
  for(let i=0;i<12;i++)data.teams['t'+i].dt={phase:{col:i}};
  const q=projectQualification(data,forecastContext(data,now));
  assert.equal(q.officialFinal,true);assert.equal(q.remainingGames,0);
  for(let i=0;i<12;i++){const row=q.teams.find(t=>t.id==='t'+i);assert.equal(row.top4,i<4?1:0);assert.equal(row.top8,i<8?1:0)}
  assert.deepEqual(q.cutoffs.top4,{median:2,low:2,high:2});
});
test('match order in JSON cannot bias the projection',()=>{
  const a=league(),b={...a,matchs:Object.fromEntries(Object.entries(a.matchs).reverse())};
  assert.deepEqual(projectQualification(a,forecastContext(a,now)),projectQualification(b,forecastContext(b,now)));
});

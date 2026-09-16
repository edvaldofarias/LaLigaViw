import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildWeeklyForecast, simulate, weekCutoff } from '../dist/forecast.mjs';

const now = Date.parse('2026-09-16T21:00:00Z');
const cutoff = Date.parse('2026-09-14T12:00:00Z');
const fixture = {
  teams: { a: {name:'A'}, b: {name:'B'}, c: {name:'C'}, d: {name:'D'} },
  matchs: {
    past: {team1:'a',team2:'b',d_i:cutoff-86400000,finished:cutoff-3600000,st:3,dt:{qt_g1:4,qt_g2:1}},
    other: {team1:'c',team2:'b',d_i:cutoff-172800000,finished:cutoff-86400000,st:3,dt:{qt_g1:1,qt_g2:2}},
    next: {team1:'a',team2:'c',d_i:now+86400000,m_set:'r2',fs:'f1'},
    neutral: {team1:'b',team2:'d',d_i:now+86400000,m_set:'r2',fs:'f1'},
    later: {team1:'a',team2:'b',d_i:now+864000000,m_set:'r3',fs:'f1'},
  }
};

test('the edition switches only on Monday 09:00 Brasília', () => {
  assert.equal(weekCutoff(now),cutoff);
  assert.equal(weekCutoff(cutoff-1),cutoff-7*86400000);
  assert.equal(weekCutoff(cutoff),cutoff);
  assert.equal(weekCutoff(cutoff+7*86400000),cutoff+7*86400000);
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
  const f=buildWeeklyForecast(fixture,now);
  assert.equal(f.predictions.length,2);
  assert.equal(f.roundId,'r2');
  assert.equal(f.historyCount,2);
  assert.ok(f.predictions.every(p=>p.status==='ready'&&p.limitedHistory));
  assert.ok(f.predictions.find(p=>p.matchId==='neutral').teamGames.includes(0));
  assert.deepEqual(f,buildWeeklyForecast(fixture,now+60000));
});

test('future results and results recorded after the weekly cutoff never leak into training', () => {
  const copy=structuredClone(fixture);
  copy.matchs.late={team1:'a',team2:'c',d_i:cutoff-86400000,finished:cutoff+1,st:3,dt:{qt_g1:40,qt_g2:0}};
  copy.matchs.future={team1:'a',team2:'c',d_i:now+1,finished:now+2,st:3,dt:{qt_g1:40,qt_g2:0}};
  assert.deepEqual(buildWeeklyForecast(copy,now).predictions,buildWeeklyForecast(fixture,now).predictions);
});

test('missing history and undefined teams do not produce fabricated odds', () => {
  const copy=structuredClone(fixture);
  delete copy.matchs.past;delete copy.matchs.other;
  assert.ok(buildWeeklyForecast(copy,now).predictions.every(p=>p.status==='insufficient_history'));
  delete copy.matchs.next.team2;
  assert.equal(buildWeeklyForecast(copy,now).predictions.find(p=>p.matchId==='next').status,'awaiting_teams');
});

test('finished and started games never receive pre-match odds', () => {
  const copy=structuredClone(fixture);
  copy.matchs.next.st=3;copy.matchs.neutral.d_i=now-1;
  assert.deepEqual(buildWeeklyForecast(copy,now).predictions.map(p=>p.matchId),['later']);
  assert.equal(buildWeeklyForecast(copy,now+9999999999).predictions.length,0);
});

test('all zero historical scores are handled without division by zero', () => {
  const copy=structuredClone(fixture);
  for(const m of Object.values(copy.matchs))if(m.dt)m.dt={qt_g1:0,qt_g2:0};
  assert.ok(buildWeeklyForecast(copy,now).predictions.every(p=>p.expectedGoals.every(Number.isFinite)));
});

test('league snapshot yields normalized valid forecasts', async () => {
  const data=JSON.parse(await readFile(new URL('../dist/data.json',import.meta.url)));
  const f=buildWeeklyForecast(data,now);
  assert.ok(Array.isArray(f.predictions));
  for(const p of f.predictions.filter(p=>p.status==='ready'))assert.ok(Math.abs(p.probabilities.reduce((a,b)=>a+b,0)-1)<1e-12);
});

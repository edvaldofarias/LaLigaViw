import test from 'node:test';
import assert from 'node:assert/strict';
import { brasiliaDate, refreshPolicy, nextPolicyCheck, MATCH_DAY_INTERVAL, REST_DAY_INTERVAL } from '../dist/schedule.mjs';
const t=s=>Date.parse(s);

test('match days follow Brasília rather than the UTC or viewer date',()=>{
  const matches=[{d_i:t('2026-09-19T01:00:00Z')}];
  assert.equal(brasiliaDate(matches[0].d_i),'2026-09-18');
  assert.equal(refreshPolicy(matches,t('2026-09-18T18:00:00Z')).interval,MATCH_DAY_INTERVAL);
  assert.equal(refreshPolicy(matches,t('2026-09-19T15:00:00Z')).interval,REST_DAY_INTERVAL);
});

test('a 12-hour wait stops at midnight to detect a match day',()=>{
  const matches=[{d_i:t('2026-09-18T20:00:00Z')}];
  const last=t('2026-09-18T02:00:00Z');
  const midnight=t('2026-09-18T03:00:00Z');
  assert.equal(nextPolicyCheck(matches,last,last),midnight);
  assert.equal(refreshPolicy(matches,midnight).interval,10*60*1000);
  assert.ok(nextPolicyCheck(matches,last,midnight)<=midnight);
});

test('leaving a match day changes to twelve hours from the last attempt',()=>{
  const matches=[{d_i:t('2026-09-18T20:00:00Z'),st:3}];
  const last=t('2026-09-19T02:55:00Z'),midnight=t('2026-09-19T03:00:00Z');
  assert.equal(nextPolicyCheck(matches,last,last),midnight);
  assert.equal(nextPolicyCheck(matches,last,midnight),last+12*60*60*1000);
});

test('ordinary checks wait the full interval and finished matches still count for that day',()=>{
  const now=t('2026-09-18T21:00:00Z');
  assert.equal(nextPolicyCheck([{d_i:now-3600000,st:3}],now,now),now+10*60*1000);
  assert.equal(nextPolicyCheck([],now,now),t('2026-09-19T03:00:00Z'));
  assert.equal(refreshPolicy([{d_i:null},{d_i:'invalid'}],now).interval,REST_DAY_INTERVAL);
});

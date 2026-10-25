import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {matchReplays,replayForMatch,REPLAY_PLAYLIST_URL} from '../dist/replays.mjs';

const data=JSON.parse(readFileSync(new URL('../dist/data.json',import.meta.url),'utf8'));

test('playlist maps one unique replay to every match in rounds one through six',()=>{
  const firstSixRounds=[...new Map(Object.values(data.matchs)
    .filter(match=>match.fs==='1780479913323')
    .sort((a,b)=>a.d_i-b.d_i)
    .map(match=>[match.m_set,match.d_i])).keys()].slice(0,6);
  const expected=new Set(Object.entries(data.matchs)
    .filter(([,match])=>firstSixRounds.includes(match.m_set))
    .map(([id])=>id));
  assert.equal(expected.size,30);
  assert.equal(matchReplays.length,30);
  assert.equal(new Set(matchReplays.map(replay=>replay.matchId)).size,30);
  assert.equal(new Set(matchReplays.map(replay=>replay.videoId)).size,30);
  assert.deepEqual(new Set(matchReplays.map(replay=>replay.matchId)),expected);
  for(const replay of matchReplays){
    assert.equal(replayForMatch(replay.matchId),replay);
    assert.match(replay.embedUrl,/^https:\/\/www\.youtube-nocookie\.com\/embed\/[\w-]+$/);
    assert.match(replay.watchUrl,/^https:\/\/www\.youtube\.com\/watch\?v=[\w-]+&list=PLAnm2-TwxnXw$/);
  }
  assert.equal(replayForMatch('unknown'),null);
  assert.equal(REPLAY_PLAYLIST_URL,'https://www.youtube.com/playlist?list=PLAnm2-TwxnXw');
});

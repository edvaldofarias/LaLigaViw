import test from 'node:test';
import assert from 'node:assert/strict';
import {matchPreview,nextRoundMatches,VENUE} from '../dist/match-preview.mjs';
const now=Date.parse('2026-09-16T15:00:00Z');
const old=now-86400000,future=now+86400000;
const game={id:'next',team1:'b',team2:'c',fs:'f',m_set:'r2',d_i:future};
const data={teams:{b:{name:'Barcelona'},c:{name:'Celta'},r:{name:'Real Madrid'},s:{name:'Sevilla'}},
  player:{p:{name:'Edvaldo',team:'b',dt:'0=99'}},
  matchs:{next:game,later:{...game,m_set:'r3',d_i:future+86400000},
    previous:{team1:'r',team2:'b',fs:'f',m_set:'r1',d_i:old,st:3,dt:{qt_g1:3,qt_g2:4}},
    celta:{team1:'c',team2:'s',fs:'f',m_set:'r1',d_i:old,st:3,dt:{qt_g1:1,qt_g2:3}}},
  matchDetails:{previous:{data:{list:{g:{ac:1,pl_id1:'p',team1:'b'}}}}},
};
const picks=[{phaseId:'f',roundId:'r1',roundNumber:1,players:[{playerId:'p',teamId:'b',name:'Edvaldo'}]}];
test('preview combines real previous result and selection with match-specific goals',()=>{
  const p=matchPreview(game,data,picks,now);
  assert.match(p.stories[0],/venceu Real Madrid por 4 a 3/);
  assert.match(p.stories[1],/busca a reação/);
  assert.match(p.highlights[0].text,/Edvaldo: seleção da 1ª rodada · 1 gol no último jogo/);
  assert.doesNotMatch(p.highlights[0].text,/99/);
});
test('no invented result or scorer when history is absent; no future results leak',()=>{
  const p=matchPreview(game,{...data,matchs:{next:game},matchDetails:{}},picks,now);
  assert.equal(p.highlights.length,0);assert.match(p.stories[0],/ainda não há resultado/);
  assert.equal(matchPreview({...game,st:3},data,picks,now),null);
});
test('flyer eligibility follows only the next round and advances automatically',()=>{
  assert.deepEqual(nextRoundMatches(data,now).map(m=>m.id),['next']);
  assert.deepEqual(nextRoundMatches(data,future+1).map(m=>m.id),['later']);
  assert.equal(VENUE.name,'Pro Beach');assert.match(VENUE.address,/840.*09694-000/);
});

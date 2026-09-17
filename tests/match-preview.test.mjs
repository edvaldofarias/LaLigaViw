import test from 'node:test';
import assert from 'node:assert/strict';
import {matchPreview,nextRoundMatches,VENUE} from '../dist/match-preview.mjs';
const now=Date.parse('2026-09-16T15:00:00Z');
const old=now-86400000,future=now+86400000;
const game={id:'next',team1:'b',team2:'c',fs:'f',m_set:'r2',d_i:future};
const data={teams:{b:{name:'Barcelona'},c:{name:'Celta'},r:{name:'Real Madrid'},s:{name:'Sevilla'}},
  player:{p:{name:'Edvaldo',team:'b',dt:'0=1'}},
  matchs:{next:game,later:{...game,m_set:'r3',d_i:future+86400000},
    previous:{team1:'r',team2:'b',fs:'f',m_set:'r1',d_i:old,st:3,dt:{qt_g1:3,qt_g2:4}},
    celta:{team1:'c',team2:'s',fs:'f',m_set:'r1',d_i:old,st:3,dt:{qt_g1:1,qt_g2:3}}},
  matchDetails:{previous:{data:{list:{g:{ac:1,pl_id1:'p',team1:'b'}}}}},
};
const picks=[{phaseId:'f',roundId:'r1',roundNumber:1,players:[{playerId:'p',teamId:'b',name:'Edvaldo'}]}];
test('preview combines real previous result and selection with match-specific goals',()=>{
  const p=matchPreview(game,data,picks,now);
  assert.match(p.stories[0],/vitória por 4 a 3 sobre Real Madrid/);
  assert.match(p.stories[1],/busca a reação/);
  assert.match(p.highlights[0].text,/Edvaldo foi escolhido para a seleção da 1ª rodada/);
  assert.match(p.highlights[0].text,/Na última partida, marcou 1 gol/);
});
test('no invented result or scorer when history is absent; no future results leak',()=>{
  const p=matchPreview(game,{...data,player:{},matchs:{next:game},matchDetails:{}},picks,now);
  assert.equal(p.highlights.length,0);assert.match(p.headline,/estreia das duas equipes/);
  assert.equal(matchPreview({...game,st:3},data,picks,now),null);
});
test('flyer eligibility follows only the next round and advances automatically',()=>{
  assert.deepEqual(nextRoundMatches(data,now).map(m=>m.id),['next']);
  assert.deepEqual(nextRoundMatches(data,future+1).map(m=>m.id),['later']);
  assert.equal(VENUE.name,'Pro Beach');assert.match(VENUE.address,/840.*09694-000/);
});

test('highlights recognize tied top scorers and never exceed two athletes per team',()=>{
  const players={p:{name:'Edvaldo',team:'b',dt:'0=2'},q:{name:'Outro',team:'b',dt:'0=2'},third:{name:'Terceiro',team:'b',dt:'0=1'},c:{name:'Rival',team:'c',dt:'0=2'}};
  const selections=[{...picks[0],players:[...picks[0].players,{playerId:'third',teamId:'b',name:'Terceiro'}]}];
  const p=matchPreview(game,{...data,player:players},selections,now);
  assert.equal(p.columns[0].highlights.length,2);
  assert.equal(p.columns[1].highlights.length,1);
  assert.match(p.columns[0].highlights[0].text,/divide a artilharia do campeonato, com 2 gols/);
  assert.match(p.columns[1].highlights[0].text,/Rival divide a artilharia/);
});

test('an earlier match without a score is not misrepresented as a debut',()=>{
  const p=matchPreview(game,{...data,player:{},matchDetails:{},matchs:{next:game,previous:{...data.matchs.previous,dt:null}}},[],now);
  assert.equal(p.columns[0].debut,false);
  assert.doesNotMatch(p.headline,/estreia das duas/);
  assert.equal(p.highlights.length,0);
});

test('a published selection can be cited beyond the immediately previous match',()=>{
  const d={...data,matchs:{...data.matchs,moreRecent:{...data.matchs.previous,m_set:'different',d_i:old+1000}}};
  assert.match(matchPreview(game,d,picks,now).highlights[0].text,/seleção da 1ª rodada/);
});

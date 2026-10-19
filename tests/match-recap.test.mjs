import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {matchRecap} from '../dist/match-recap.mjs';
import {matchAwards} from '../dist/awards.mjs';
const m={team1:'h',team2:'a',st:3,dt:{qt_g1:0,qt_g2:2}};
const d={teams:{h:{name:'Casa'},a:{name:'Fora'}},player:{p:{name:'Lucas'}}};
test('recap reports score, scorers, cards and supplied award without inventing chronology',()=>{
  const recap=matchRecap(m,d,{list:{g:{ac:1,team1:'a',pl_id1:'p'},g2:{ac:1,team1:'a',pl_id1:'p'},c:{ac:3,team1:'a',pl_id1:'p'}}},{playerId:'p',teamId:'a'});
  assert.equal(recap.headline,'Fora bate Casa por 2 a 0!');
  const story=recap.columns.find(c=>c.teamId==='a').paragraphs.join(' ');
  assert.match(story,/Lucas \(dois gols\)/);
  assert.match(story,/Lucas recebeu cartão amarelo/);
  assert.match(recap.intro,/Lucas foi eleito o melhor em campo/);
});
test('missing sheet, award and score remain unavailable, scheduled games get no recap',()=>{
  const recap=matchRecap(m,d,null,null);assert.match(recap.columns[0].paragraphs[0],/Aguardando/);assert.match(recap.awardText,/ainda não foi informado/);
  assert.equal(matchRecap({...m,st:0},d,null,null),null);
  assert.match(matchRecap({...m,dt:{}},d,null,null).intro,/placar final ainda não/);
});
test('first-round newspaper preserves factual scorers, cards, awards and incomplete attribution',()=>{
  const data=JSON.parse(readFileSync(new URL('../dist/data.json',import.meta.url),'utf8'));
  const recaps=matchAwards.filter(a=>a.round===1).map(a=>matchRecap(data.matchs[a.matchId],data,data.matchDetails[a.matchId].data,a));
  const classic=recaps[0],text=[classic.intro,...classic.columns.flatMap(c=>c.paragraphs)].join(' ');
  assert.equal(classic.headline,'Em clássico eletrizante de 7 gols, Barcelona bate Real Madrid por 4 a 3!');
  for(const name of ['Rapha','Edvaldo','Mosca','Severo','Bruno Henrique','Robertinho','Tiago Bianco'])assert.ok(text.includes(name));
  assert.match(text,/Edvaldo recebeu cartão amarelo/);assert.match(text,/Valtinho recebeu cartão vermelho/);
  assert.doesNotMatch(text,/direto|virada|acréscimos|prejudicad/);
  assert.match(recaps[1].intro,/Gusthavo foi eleito/);assert.doesNotMatch(recaps[1].columns.flatMap(c=>c.paragraphs).join(' '),/Gusthavo/);
  assert.match(recaps[2].headline,/Chuva de gols/);assert.match(recaps[2].coverageNote,/9 dos 10/);
  assert.match(recaps[3].headline,/goleia/);
});
test('goalless draws never invent scorers or disciplinary events',()=>{
  const r=matchRecap({...m,dt:{qt_g1:0,qt_g2:0}},d,{list:{}},null);
  assert.match(r.headline,/0 a 0/);assert.equal(r.intro,null);
  assert.doesNotMatch(r.columns.flatMap(c=>c.paragraphs).join(' '),/cartão|balançou|balançaram/);
});

test('recap reports table movement, G8 impact and scorer ranking changes without obvious points copy',()=>{
  const teams=Object.fromEntries(['A','B','C','D','E','F','G','H','I','J'].map(name=>[name.toLowerCase(),{name:`Time ${name}`}]));
  const target={id:'target',team1:'a',team2:'c',fs:'f',m_set:'r2',d_i:200,st:3,dt:{qt_g1:2,qt_g2:0}};
  const matchs={
    target,
    adraw:{team1:'a',team2:'d',fs:'f',m_set:'r1',d_i:100,st:3,dt:{qt_g1:1,qt_g2:1}},
    bwin:{team1:'b',team2:'a',fs:'f',m_set:'r1',d_i:101,st:3,dt:{qt_g1:2,qt_g2:0}},
    cwin:{team1:'c',team2:'e',fs:'f',m_set:'r1',d_i:102,st:3,dt:{qt_g1:1,qt_g2:0}},
    fwin:{team1:'f',team2:'g',fs:'f',m_set:'r1',d_i:103,st:3,dt:{qt_g1:1,qt_g2:0}},
    hwin:{team1:'h',team2:'i',fs:'f',m_set:'r1',d_i:104,st:3,dt:{qt_g1:1,qt_g2:0}},
  };
  const player={p:{name:'Pedro',team:'a'},q:{name:'Quico',team:'b'}};
  const matchDetails={
    adraw:{data:{list:{p:{ac:1,team1:'a',pl_id1:'p'}}}},
    bwin:{data:{list:{q1:{ac:1,team1:'b',pl_id1:'q'},q2:{ac:1,team1:'b',pl_id1:'q'}}}},
    target:{data:{list:{p1:{ac:1,team1:'a',pl_id1:'p'},p2:{ac:1,team1:'a',pl_id1:'p'}}}},
  };
  const recap=matchRecap(target,{teams,player,matchs,matchDetails},matchDetails.target.data,null);
  const text=recap.columns.flatMap(column=>column.paragraphs).join(' ');
  assert.match(text,/subiu \d+ posições?/);
  assert.match(text,/G8|quartas de final/);
  assert.match(text,/Pedro chegou a 3 gols e assumiu a liderança da artilharia/);
  assert.doesNotMatch(text,/garantiu os três pontos|sem pontuar/);
});

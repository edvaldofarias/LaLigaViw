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
  assert.match(recap.intro,/Lucas eleito o craque do jogo/);
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
  assert.match(recaps[1].intro,/Gusthavo eleito/);assert.doesNotMatch(recaps[1].columns.flatMap(c=>c.paragraphs).join(' '),/Gusthavo/);
  assert.match(recaps[2].headline,/Chuva de gols/);assert.match(recaps[2].coverageNote,/9 dos 10/);
  assert.match(recaps[3].headline,/goleia/);
});
test('goalless draws never invent scorers or disciplinary events',()=>{
  const r=matchRecap({...m,dt:{qt_g1:0,qt_g2:0}},d,{list:{}},null);
  assert.match(r.headline,/0 a 0/);assert.match(r.intro,/um ponto cada/);
  assert.doesNotMatch(r.columns.flatMap(c=>c.paragraphs).join(' '),/cartão|balançou|balançaram/);
});

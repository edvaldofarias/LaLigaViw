import test from 'node:test';
import assert from 'node:assert/strict';
import {matchRecap} from '../dist/match-recap.mjs';
const m={team1:'h',team2:'a',st:3,dt:{qt_g1:0,qt_g2:2}};
const d={teams:{h:{name:'Casa'},a:{name:'Fora'}},player:{p:{name:'Lucas'}}};
test('recap reports score, scorers, cards and supplied award without inventing chronology',()=>{
  const recap=matchRecap(m,d,{list:{g:{ac:1,team1:'a',pl_id1:'p'},g2:{ac:1,team1:'a',pl_id1:'p'},c:{ac:3,team1:'a',pl_id1:'p'}}},{playerId:'p'});
  assert.equal(recap.headline,'Fora vence Casa por 2 a 0');
  assert.match(recap.columns[1].paragraphs.join(' '),/Lucas \(2\)/);
  assert.match(recap.columns[1].paragraphs.join(' '),/1 amarelo/);
  assert.match(recap.awardText,/Lucas foi eleito/);
});
test('missing sheet and award remain explicitly unavailable',()=>{
  const recap=matchRecap(m,d,null,null);assert.match(recap.columns[0].paragraphs[0],/Aguardando/);assert.match(recap.awardText,/ainda não foi informado/);
  assert.equal(matchRecap({...m,st:0},d,null,null),null);
});

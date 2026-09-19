import {normalizeCompetition} from '../dist/match-data.mjs';
import {coaches,coachFor,coachStatistics} from '../dist/coaches.mjs';
import {isGoalkeeper} from '../dist/goalkeepers.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import * as forecast from '../dist/forecast.mjs';
import * as schedule from '../dist/schedule.mjs';
import { summarizeMatch } from '../dist/match-stats.mjs';
import { championshipSelections, selectionsForPlayer } from '../dist/selections.mjs';
import {matchPreview,nextRoundMatches,VENUE} from '../dist/match-preview.mjs';
import {matchAwards} from '../dist/awards.mjs';
import {calculateScores,SCORE_RULES} from '../dist/player-score.mjs';
import {matchRecap} from '../dist/match-recap.mjs';

const source=(await readFile(new URL('../dist/app.js',import.meta.url),'utf8'))
  .replace(/^import .*;\n/gm,'').replace(/\ninit\(\);\s*$/,'');
function harness(fetch){
  const elements=new Map();
  const element=selector=>{
    if(!elements.has(selector))elements.set(selector,{
      innerHTML:'',open:false,scrollTop:0,addEventListener(){},setAttribute(){},
      focus(){},showModal(){this.open=true},close(){this.open=false},
    });
    return elements.get(selector);
  };
  const context=vm.createContext({...forecast,...schedule,normalizeCompetition,summarizeMatch,championshipSelections,selectionsForPlayer,matchPreview,nextRoundMatches,VENUE,matchAwards,calculateScores,SCORE_RULES,matchRecap,isGoalkeeper,coaches,coachFor,coachStatistics,updateVisitors(){},fetch,AbortSignal,URL,
    document:{querySelector:element,addEventListener(){}},window:{addEventListener(){}},
  });
  const run=code=>vm.runInContext(code,context);
  run(source);
  run(`prepare({teams:{h:{name:'Casa'},a:{name:'Visitante'}},
    player:{p:{name:'Ana',team:'h',dt:'0=99#16=4'}},
    matchs:{first:{team1:'h',team2:'a',st:3,dt:{qt_g1:1,qt_g2:0}},
            second:{team1:'a',team2:'h',st:3,dt:{qt_g1:0,qt_g2:0}}}})`);
  return {run,html:()=>element('#detail-content').innerHTML};
}
const response=data=>({ok:true,json:async()=>data});
const sheet={list:{a:{ac:1,pl_id1:'p',team1:'h'},b:{ac:4,pl_id1:'p',team1:'h'}}};

test('shows match goals and red cards, not a lineup or cumulative totals',async()=>{
  const app=harness(async()=>response(sheet));
  app.run("openMatch('first')");
  await app.run("loadMatchSheet('first')");
  assert.match(app.html(),/1 gol<\/span>/);
  assert.match(app.html(),/1 vermelho<\/span>/);
  assert.match(app.html(),/Ana/);
  assert.doesNotMatch(app.html(),/Escalação|99 gols|4 vermelhos/);
});

test('late responses cannot replace another match or a player profile',async()=>{
  const pending=[];
  const app=harness(()=>new Promise(resolve=>pending.push(resolve)));
  app.run("openMatch('first')");
  const first=app.run("loadMatchSheet('first')");
  app.run("openMatch('second')");
  const second=app.run("loadMatchSheet('second')");
  const secondHTML=app.html();
  pending[0](response(sheet));await first;
  assert.equal(app.html(),secondHTML);
  app.run("openPlayer('p')");
  const playerHTML=app.html();
  pending[1](response(null));await second;
  assert.equal(app.html(),playerHTML);
});

test('a failed refresh preserves the last match sheet with an explicit warning',async()=>{
  let count=0;
  const app=harness(async()=>{
    if(count++)throw new Error('Offline');
    return response(sheet);
  });
  app.run("openMatch('first')");await app.run("loadMatchSheet('first')");
  await app.run("loadMatchSheet('first',true)");
  assert.match(app.html(),/última consulta disponível/);
  assert.match(app.html(),/1 vermelho/);
});

test('award download and historical coaches appear in cards and coach profiles',async()=>{
  const data=JSON.parse(await readFile(new URL('../dist/data.json',import.meta.url),'utf8'));
  const app=harness(async()=>response(null));app.run(`prepare(${JSON.stringify(data)})`);
  assert.equal(app.run('motmView().split("data-motm-poster=").length-1'),matchAwards.length);
  const caption=app.run("fixture(matches.find(m=>m.id==='1780480362137'))");
  assert.match(caption,/Patrick/);assert.match(caption,/Ênio/);
  assert.doesNotMatch(app.run("fixture({...matches[0],id:'new',st:0,finished:false})"),/fixture-coaches/);
  app.run("openCoach('renan')");assert.match(app.html(),/Renan/);assert.match(app.html(),/Histórico de partidas/);
  assert.match(app.html(),/Real Bétis/);assert.match(app.html(),/Sevilla/);
  assert.equal((app.html().match(/data-match=/g)||[]).length,coachStatistics(data).find(c=>c.id==='renan').played);
  assert.equal(app.run('coachesView().split("coach-placeholder.svg").length-1'),4);
});

test('sparse completed scores render the zero and award points; absent score stays pending',()=>{
 const app=harness(async()=>response(null));
 app.run(`prepare({teams:{h:{name:'Casa'},a:{name:'Visitante'}},player:{p:{name:'Jogador',team:'h'}},matchs:{m:{team1:'h',team2:'a',st:3,dt:{qt_g1:3}}}})`);
 assert.match(app.run('fixture(matches[0])'),/3<small>:<\/small>0/);
 assert.equal(app.run("ranking.find(p=>p.id==='p').total"),5);
 assert.match(app.run('matchHTML(matches[0])'),/3 a 0/);
 assert.match(app.run("fixture({id:'pending',st:3,team1:'h',team2:'a'})"),/placar pendente/);
});

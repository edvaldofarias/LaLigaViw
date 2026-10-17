import * as liveMatch from '../dist/live-match.mjs';
import {brasiliaDate,brasiliaTime} from '../dist/date-utils.mjs';
import * as evolution from '../dist/evolution.mjs';
import {roundCartola,suggestCartola} from '../dist/cartola.mjs';
import {predictMatchCoaches} from '../dist/coach-predictions.mjs';
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
import {calculateScores,SCORE_RULES,scoreDataStatus,playerAppearances} from '../dist/player-score.mjs';
import {matchRecap} from '../dist/match-recap.mjs';

const source=(await readFile(new URL('./fixtures/legacy-ui.js',import.meta.url),'utf8'))
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
  const context=vm.createContext({...liveMatch,updateLiveData(){},markLiveUnavailable(){},brasiliaDate,brasiliaTime,...evolution,roundCartola,suggestCartola,...forecast,...schedule,predictMatchCoaches,normalizeCompetition,summarizeMatch,championshipSelections,selectionsForPlayer,matchPreview,nextRoundMatches,VENUE,matchAwards,calculateScores,SCORE_RULES,scoreDataStatus,playerAppearances,matchRecap,isGoalkeeper,coaches,coachFor,coachStatistics,updateVisitors(){},fetch,AbortSignal,URL,
    document:{querySelector:element,querySelectorAll:()=>[],addEventListener(){}},window:{addEventListener(){}},
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
  assert.equal(app.run(`coachesView().split('src="'+PHOTO_PLACEHOLDER).length-1`),coachStatistics(data).filter(c=>!c.photo).length);
});

test('sparse completed scores render the zero and award points; absent score stays pending',()=>{
 const app=harness(async()=>response(null));
 app.run(`prepare({teams:{h:{name:'Casa'},a:{name:'Visitante'}},player:{p:{name:'Jogador',team:'h'}},matchs:{m:{team1:'h',team2:'a',st:3,dt:{qt_g1:3}}},matchDetails:{m:{data:{list:{p:{ac:7,pl_id1:'p',team1:'h'}}}}}})`);
 assert.match(app.run('fixture(matches[0])'),/3<small>:<\/small>0/);
 assert.equal(app.run("ranking.find(p=>p.id==='p').total"),5);
 assert.match(app.run('matchHTML(matches[0])'),/3 a 0/);
 assert.match(app.run("fixture({id:'pending',st:3,team1:'h',team2:'a'})"),/placar pendente/);
});


test('live roster updates recalculate scores and a top-level refresh preserves roster data',async()=>{
  const app=harness(async()=>response({list:{p:{ac:7,pl_id1:'p',team1:'h',val1:0}}}));
  const before=app.run("ranking.find(p=>p.id==='p').total");
  await app.run("loadMatchSheet('first',true)");
  assert.equal(app.run("ranking.find(p=>p.id==='p').total"),before+5);
  app.run('prepare({teams:db.teams,player:db.player,matchs:db.matchs})');
  assert.equal(app.run("ranking.find(p=>p.id==='p').total"),before+5);
  assert.match(app.run('scoreView()'),/Pontuação parcial/);
  assert.match(app.run('playerScoreHTML("p")'),/apenas nos jogos em que o atleta foi relacionado/);
});

test('all completed match sheets are loaded for scoring, even without opening match details',async()=>{
  const urls=[];
  const app=harness(async url=>{urls.push(url);return response({list:{p:{ac:7,pl_id1:'p',team1:'h'}}})});
  await app.run('updateCompletedDetails()');
  assert.equal(urls.length,2);
  assert.equal(app.run("ranking.find(p=>p.id==='p').teamGames"),2);
});


test('correcting a roster entry to reserve removes collective points from the ranking',async()=>{
  let val1=0;
  const app=harness(async()=>response({list:{p:{ac:7,pl_id1:'p',team1:'h',val1}}}));
  const before=app.run("ranking.find(p=>p.id==='p').total");
  await app.run("loadMatchSheet('first',true)");
  assert.equal(app.run("ranking.find(p=>p.id==='p').total"),before+5);
  val1=1;await app.run("loadMatchSheet('first',true)");
  assert.equal(app.run("ranking.find(p=>p.id==='p').total"),before);
  assert.match(app.run('scoreView()'),/Reservas e jogadores não relacionados não ganham nem perdem pontos/);
});

test('Índio displays zero games in the list, team roster and profile despite source total 2',async()=>{
  const data=JSON.parse(await readFile(new URL('./fixtures/attendance-rounds-1-2.json',import.meta.url),'utf8'));
  const app=harness(async()=>response(null));app.run(`prepare(${JSON.stringify(data)})`);
  const id='1789194958115';
  assert.equal(app.run(`statValue(players.find(p=>p.id==='${id}'),2)`),0);
  const row=app.run(`playerTable(players.filter(p=>p.id==='${id}'))`);
  assert.match(row,/<td>0<\/td>/);assert.doesNotMatch(row,/<td>2<\/td>/);
  app.run(`openPlayer('${id}')`);
  assert.match(app.html(),/<b>0<\/b>Jogos/);
  assert.match(app.html(),/Média de gols por jogo<\/span>Não disponível/);
  assert.match(app.html(),/Primeira Fase<\/td><td>0<\/td><td>0<\/td>/);
  assert.match(app.html(),/Reservas e não relacionados não contam/);
  app.run(`openTeam(db.player['${id}'].team)`);
  const indioRow=app.html().split('<tr>').find(row=>row.includes(`data-player="${id}"`));
  assert.doesNotMatch(indioRow,/<td>2<\/td>/);
});

test('presence correction updates games, phase totals and average in an already open profile',async()=>{
  let val1=0;
  const app=harness(async()=>response({list:{p:{ac:7,pl_id1:'p',team1:'h',val1}}}));
  app.run("db.matchs.first.fs='phase';db.player.p.dt='0=2#2=99';db.player.p.fs={phase:{dt:'0=2#2=99'}};recalculateScores()");
  app.run("openPlayer('p')");
  await app.run("loadMatchSheet('first',true)");
  assert.match(app.html(),/<b>1<\/b>Jogos/);
  assert.match(app.html(),/Média de gols por jogo<\/span>2/);
  assert.equal(app.run("players[0].appearances.byPhase.phase"),1);
  val1=1;await app.run("loadMatchSheet('first',true)");
  assert.match(app.html(),/<b>0<\/b>Jogos/);
  assert.match(app.html(),/Média de gols por jogo<\/span>Não disponível/);
  assert.equal(app.run("players[0].stats[2]"),0);
});

test('qualification chances appear only in the full Phase 1 standings with cutoff explanations',async()=>{
  const data=JSON.parse(await readFile(new URL('../dist/data.json',import.meta.url),'utf8'));
  const app=harness(async()=>response(null));app.run(`prepare(${JSON.stringify(data)})`);
  const full=app.run('tableHTML(true,phases[0])');
  assert.match(full,/Chance G4/);assert.match(full,/Chance G8/);
  assert.equal((full.match(/class="qualification-probability"/g)||[]).length,24);
  assert.doesNotMatch(app.run('tableHTML()'),/Chance G4|Chance G8/);
  assert.doesNotMatch(app.run('tableHTML(true,phases[1])'),/Chance G4|Chance G8/);
  const summary=app.run('qualificationSummary(phases[0])');
  assert.match(summary,/20.000 simulações/);assert.match(summary,/não garante/);
  assert.match(summary,/G8 inclui as equipes do G4/);
  assert.doesNotMatch(app.run('oddsView()'),/9h|EDIÇÃO SEMANAL/);
});

test('phase names are stable, standings only exist in the first phase and only next-round match badges use current official ranks',async()=>{
  const data=JSON.parse(await readFile(new URL('../dist/data.json',import.meta.url),'utf8'));
  const app=harness(async()=>response(null));app.run(`prepare(${JSON.stringify(data)})`);
  assert.equal(app.run('phases.map(phaseLabel).join("|")'),'Primeira Fase|Repescagem|Quartas de Finais|Semi Finais|Grande FINAL');
  assert.doesNotMatch(app.run('standingsView()'),/Fase da classificação|data-filter="phase"/);
  assert.equal(app.run('standings(phases[1]).length'),0);
  assert.equal(app.run('tableHTML(true,phases[1])'),'');
  app.run("const nextMatch=nextRoundMatches(db)[0]");
  const badge=app.run("fixtureCrest(nextMatch,'-OuCEAFLB6cDtcv8W1dI')");
  const homeRank=data.teams['-OuCEAFLB6cDtcv8W1dI'].dt['1780479913323'].col+1;
  assert.ok(badge.includes(`${homeRank}º lugar na classificação atual`));
  assert.ok(badge.indexOf(`${homeRank}º</small>`)<badge.indexOf('<img'));
  const away=app.run("fixtureCrest(nextMatch,'-OuCEBQOxXueVsu4_Pbt',true)");
  const awayRank=data.teams['-OuCEBQOxXueVsu4_Pbt'].dt['1780479913323'].col+1;
  assert.ok(away.includes(`${awayRank}º</small>`));assert.ok(away.indexOf('<img')<away.indexOf(`${awayRank}º</small>`));
  for(const expression of ["matches.find(isFinished)","{...nextMatch,st:3}","matches.find(m=>!isFinished(m)&&m.fs===FIRST_PHASE&&m.m_set!==nextMatch.m_set&&m.d_i>nextMatch.d_i)"]){
    assert.doesNotMatch(app.run(`fixture(${expression})`),/class="fixture-position"/);
    assert.doesNotMatch(app.run(`matchHTML(${expression})`),/class="fixture-position"/);
  }
  assert.match(app.run('fixture(nextMatch)'),/class="fixture-position"/);
  assert.match(app.run('matchHTML(nextMatch)'),/class="fixture-position"/);
  assert.doesNotMatch(app.run("fixture({...matches[0],fs:phases[1]})"),/fixture-position/);
  assert.doesNotMatch(app.run("matchHTML({...matches[0],fs:phases[1]})"),/As equipes nesta fase|fixture-position/);
});

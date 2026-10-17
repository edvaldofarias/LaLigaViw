import {Injectable,computed,signal,DestroyRef,inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom,forkJoin,timeout} from 'rxjs';
import {CompetitionData,DetailSelection,FIRST_PHASE,PHASE_NAMES,parseStats,displayName,finished,scored} from './models';
import {normalizeCompetition} from '../../../dist/match-data.mjs';
import {calculateScores,playerAppearances,scoreDataStatus,SCORE_RULES} from '../../../dist/player-score.mjs';
import {buildForecast} from '../../../dist/forecast.mjs';
import {isLiveMatch,liveScore,provisionalStandings} from '../../../dist/live-match.mjs';
import {updateLiveData,markLiveUnavailable} from '../../../dist/live-scoreboard.mjs';
import {matchAwards} from '../../../dist/awards.mjs';
import {championshipSelections} from '../../../dist/selections.mjs';
import {coaches,coachFor,coachStatistics} from '../../../dist/coaches.mjs';
import {predictMatchCoaches} from '../../../dist/coach-predictions.mjs';
import {isGoalkeeper} from '../../../dist/goalkeepers.mjs';
import {roundCartola,suggestCartola} from '../../../dist/cartola.mjs';
import {completedRoundGroups,playerEvolution,teamEvolution,chartColors} from '../../../dist/evolution.mjs';
import {summarizeMatch} from '../../../dist/match-stats.mjs';
import {matchPreview,nextRoundMatches,VENUE} from '../../../dist/match-preview.mjs';
import {matchRecap} from '../../../dist/match-recap.mjs';
import {refreshPolicy,courtLabel} from '../../../dist/schedule.mjs';
import {brasiliaDate,brasiliaTime} from '../../../dist/date-utils.mjs';
@Injectable({providedIn:'root'})
export class CompetitionService {
 private http=inject(HttpClient);private destroy=inject(DestroyRef);private requests=new Set<string>();private started=false;private lastFull=0;private polling=false;
 readonly base='https://copafacil-web.firebaseio.com/events/-ciddy';
 readonly data=signal<CompetitionData>({teams:{},player:{},matchs:{},matchDetails:{}});readonly busy=signal(false);readonly notice=signal('');readonly sync=signal('Carregando a competição…');readonly detail=signal<DetailSelection|null>(null);readonly visitors=signal('Carregando visitantes…');
 readonly name=displayName;readonly finished=finished;readonly scored=scored;readonly phaseNames=PHASE_NAMES;readonly firstPhase=FIRST_PHASE;readonly rules=SCORE_RULES;readonly selections=championshipSelections;readonly awards=matchAwards;readonly venue=VENUE;readonly coaches=coaches;readonly isLive=isLiveMatch;readonly goalkeeper=isGoalkeeper;readonly court=courtLabel;
 readonly teams=computed<any[]>(()=>Object.entries(this.data().teams).map(([id,t])=>({id,...t})));
 readonly matches=computed<any[]>(()=>Object.entries(this.data().matchs).map(([id,m])=>({id,...m})).sort((a,b)=>(a.d_i||Infinity)-(b.d_i||Infinity)));
 readonly rounds=computed<any[]>(()=>[...new Map(this.matches().filter(m=>m.m_set).map(m=>[m.m_set,{id:m.m_set,fs:m.fs}])).values()]);
 readonly phases=computed(()=>[...new Set(this.matches().map(m=>m.fs))]);
 readonly players=computed<any[]>(()=>{const counts=playerAppearances(this.data());return Object.entries(this.data().player).map(([id,p])=>{const appearances=counts.get(id)||{total:0,byPhase:{}};return {id,...p,appearances,stats:{...parseStats(p.dt),2:appearances.total}};});});
 readonly ranking=computed<any[]>(()=>calculateScores(this.data(),this.awards,this.selections));readonly forecast=computed<any>(()=>buildForecast(this.data()));readonly scoreStatus=computed(()=>scoreDataStatus(this.data()));readonly staff=computed<any[]>(()=>coachStatistics(this.data()));
 readonly upcoming=computed<any[]>(()=>nextRoundMatches(this.data()));readonly latestCompleted=computed(()=>completedRoundGroups(this.data()).at(-1)?.id||'');
 readonly policy=computed(()=>refreshPolicy(this.matches()).label);
 readonly standings=computed<any[]>(()=>{const live=provisionalStandings(this.data(),FIRST_PHASE);if(live)return live;return this.teams().map(t=>{const source=t.dt?.[FIRST_PHASE],s=parseStats(source?.dt);const ms=this.matches().filter(m=>m.fs===FIRST_PHASE&&finished(m)&&scored(m)&&[m.team1,m.team2].includes(t.id));let v=0,e=0,d=0,gp=0,gc=0;const form=ms.map(m=>{const a=m.team1===t.id?m.dt.qt_g1:m.dt.qt_g2,b=m.team1===t.id?m.dt.qt_g2:m.dt.qt_g1;gp+=a;gc+=b;if(a>b){v++;return 'V'}if(a===b){e++;return 'E'}d++;return 'D'});return {...t,rank:source?.col,pts:s[0]??v*3+e,j:s[1]??ms.length,v:s[2]??v,e:s[3]??e,d:s[4]??d,gp:s[5]??gp,gc:s[6]??gc,sg:s[7]??gp-gc,percent:s[8]??(ms.length?Math.round((v*3+e)/ms.length/3*100):0),form:form.slice(-5)};}).sort((a,b)=>(a.rank??999)-(b.rank??999)||b.pts-a.pts||b.v-a.v||b.sg-a.sg||b.gp-a.gp);});
 async start(){if(this.started)return;this.started=true;try{this.commit(await firstValueFrom(this.http.get<CompetitionData>('data.json')));this.sync.set('Dados consultados em '+new Date(this.data().fetchedAt||Date.now()).toLocaleDateString('pt-BR'));}catch{}await this.refresh();const timer=setInterval(()=>this.tick(),15000);const visible=()=>{if(!document.hidden)this.tick();};document.addEventListener('visibilitychange',visible);this.destroy.onDestroy(()=>{clearInterval(timer);document.removeEventListener('visibilitychange',visible);});}
 private commit(value:CompetitionData){const old=this.data().matchDetails||{};const normalized=normalizeCompetition({...value,matchDetails:{...old,...value.matchDetails}});this.data.set(normalized);updateLiveData(normalized);}
 async refresh(){if(this.busy())return;this.busy.set(true);this.lastFull=Date.now();try{const [matchs,teams,player]=await firstValueFrom(forkJoin(['matchs','teams','player'].map(key=>this.http.get<any>(`${this.base}/${key}.json`).pipe(timeout(15000)))));for(const value of [matchs,teams,player])if(!value||typeof value!=='object'||Array.isArray(value))throw Error('Dados indisponíveis');this.commit({...this.data(),matchs,teams,player,fetchedAt:new Date().toISOString()});this.notice.set('');this.sync.set('Atualizado às '+brasiliaTime(Date.now()));void this.loadCompletedSheets();}catch{this.notice.set('Não foi possível atualizar. Exibindo os últimos dados disponíveis.');this.sync.set('Sem conexão com a fonte');}finally{this.busy.set(false);void this.countVisitors();}}
 private async tick(){if(document.hidden||this.busy()||this.polling)return;const now=Date.now();if(now-this.lastFull>=refreshPolicy(this.matches()).interval){await this.refresh();return;}const live=this.matches().some(m=>isLiveMatch(m)||!finished(m)&&m.d_i&&now>=m.d_i-900000&&now<=m.d_i+10800000);if(!live)return;this.polling=true;try{const [matchs,teams]=await firstValueFrom(forkJoin(['matchs','teams'].map(k=>this.http.get<any>(`${this.base}/${k}.json`).pipe(timeout(10000)))));if(!matchs||!teams)throw Error();this.commit({...this.data(),matchs,teams,fetchedAt:new Date().toISOString()});void this.loadCompletedSheets();}catch{markLiveUnavailable();}finally{this.polling=false;}}
 async loadSheet(id:string,force=false){if(this.requests.has(id))return;const old=this.data().matchDetails?.[id];if(!force&&old?.data&&Date.now()-old.fetchedAt<600000)return;this.requests.add(id);try{const sheet=await firstValueFrom(this.http.get<any>(`${this.base}/details/${encodeURIComponent(id)}.json`).pipe(timeout(12000)));this.commit({...this.data(),matchDetails:{[id]:{data:sheet,fetchedAt:Date.now(),error:false}}});}catch{if(old)this.commit({...this.data(),matchDetails:{[id]:{...old,error:true}}});}finally{this.requests.delete(id);}}
 private async loadCompletedSheets(){const ids=this.matches().filter(finished).map(m=>m.id);let cursor=0;await Promise.all(Array.from({length:Math.min(4,ids.length)},async()=>{while(cursor<ids.length)await this.loadSheet(ids[cursor++]);}));}
 private async countVisitors(){try{const v=await firstValueFrom(this.http.post<any>('/api/visitors',{}, {withCredentials:true}).pipe(timeout(10000)));if(Number.isInteger(v.total)&&Number.isInteger(v.today))this.visitors.set(`${v.total.toLocaleString('pt-BR')} visitantes no site · ${v.today.toLocaleString('pt-BR')} hoje`);}catch{if(this.visitors().startsWith('Carregando'))this.visitors.set('Contagem de visitantes indisponível');}}
 open(kind:DetailSelection['kind'],id:string){this.detail.set({kind,id});if(kind==='match')void this.loadSheet(id);}
 close(){this.detail.set(null);}
 team(id:string){return this.data().teams[id];}player(id:string){return this.players().find(p=>p.id===id);}match(id:string){return this.matches().find(m=>m.id===id);}
 phase(id:string){return PHASE_NAMES[id]||'Fase não identificada';}round(m:any){return 'Rodada '+(this.rounds().filter(r=>r.fs===m.fs).findIndex(r=>r.id===m.m_set)+1);}
 date(m:any){return brasiliaDate(m.d_i);}time(m:any){return brasiliaTime(m.d_i);}
 score(m:any){const live=liveScore(m);return live?live.every(Number.isInteger)?`${live[0]} × ${live[1]}`:'Placar pendente':scored(m)?`${m.dt.qt_g1} × ${m.dt.qt_g2}`:finished(m)?'—':'×';}
 status(m:any){return isLiveMatch(m)?'Ao vivo':finished(m)?scored(m)?'Encerrado':'Encerrado · placar pendente':m.st?'Status não identificado':'Agendado';}
 award(id:string){return this.awards.find(a=>a.matchId===id);}coach(id:string,team:string){return coachFor(id,team);}prediction(m:any){return isLiveMatch(m)?null:this.forecast().predictions.find(p=>p.matchId===m.id);}
 chance(id:string,key:string){const row=this.forecast().qualification?.teams?.find(t=>t.id===id);return row?.[key]!=null?(row[key]*100).toFixed(1)+'%':'—';}
 preview(m:any){return matchPreview(m,this.data(),this.selections);}recap(m:any){return matchRecap(m,this.data(),this.data().matchDetails?.[m.id]?.data,this.award(m.id));}
 summary(m:any){return summarizeMatch(this.data().matchDetails?.[m.id]?.data,m,this.data().player);}predictedCoaches(m:any){return predictMatchCoaches(m,this.data());}
 cartola(id:string){return roundCartola(this.data(),id,this.awards,this.selections);}suggestions(id:string){return suggestCartola(this.data(),id,this.awards,this.selections);}
 history(id:string){return playerEvolution(this.data(),id,this.awards,this.selections);}teamHistory(){return teamEvolution(this.data(),FIRST_PHASE);}colors=chartColors;
}

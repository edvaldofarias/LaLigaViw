import {buildForecast,forecastContext} from './forecast.mjs';
import {isGoalkeeper} from './goalkeepers.mjs';
import {calculateScores,relatedPlayers} from './player-score.mjs';
import {summarizeMatch} from './match-stats.mjs';
export function isSuspendedForMatch(player,match,matches){
 const suspendedAt=Number(player?.SUSP);
 if(!Number(player?.SUSP2)||!Number.isFinite(suspendedAt)||!Number.isFinite(match?.d_i)||match.d_i<=suspendedAt)return false;
 const next=[...Object.values(matches||{})]
  .filter(m=>Number.isFinite(m?.d_i)&&m.d_i>suspendedAt&&(m.team1===player.team||m.team2===player.team))
  .sort((a,b)=>a.d_i-b.d_i)[0];
 return next===match;
}
export function roundCartola(data,roundId,awards=[],selections=[]){
 const matchs=Object.fromEntries(Object.entries(data.matchs||{}).filter(([,m])=>m.m_set===roundId));
 const player={},present=new Set();let pending=0;
 for(const [id,m] of Object.entries(matchs)){
  if(!(Number(m.st)===3||m.finished))continue;
  const sheet=data.matchDetails?.[id]?.data;
  if(!sheet){pending++;continue;}
  const related=relatedPlayers(sheet,m);
  if([...related.values()].some(ids=>!ids.size))pending++;
  for(const [team,ids] of related)for(const pid of ids){present.add(pid);player[pid] ||= {...data.player?.[pid],team,dt:'0=0#14=0#16=0'};}
  for(const row of summarizeMatch(sheet,m,data.player).players){
   if(!present.has(row.playerId)||!related.get(row.teamId)?.has(row.playerId))continue;
   const p=player[row.playerId],stats=Object.fromEntries(p.dt.split('#').map(s=>s.split('=')));
   p.dt=`0=${Number(stats[0])+row.goals}#14=${Number(stats[14])+row.yellow}#16=${Number(stats[16])+row.red}`;
  }
 }
 const selected=selections.filter(s=>s.roundId===roundId);
 const rows=calculateScores({...data,matchs,player},awards,selected);
 const choose=reverse=>{const sorted=[...rows].sort((a,b)=>(reverse?a.total-b.total:b.total-a.total)||String(a.name).localeCompare(String(b.name),'pt-BR'));return [...sorted.filter(p=>p.goalkeeper).slice(0,1),...sorted.filter(p=>!p.goalkeeper).slice(0,6)];};
 return {rows,best:choose(false),worst:choose(true),pending,players:rows.length,complete:Object.values(matchs).every(m=>Number(m.st)===3||m.finished)};
}

// Suggestions are separate from earned points; keep the official forecast untouched.
function cartolaCandidates(data,roundId,awards=[],selections=[]){
 const targets=Object.entries(data.matchs||{}).filter(([,m])=>m.m_set===roundId);
 const start=Math.min(...targets.map(([,m])=>m.d_i||Infinity));
 const history=forecastContext(data,Math.min(Date.now(),start-1)).history;
 const leagueMean=history.length?history.reduce((sum,m)=>sum+m.dt.qt_g1+m.dt.qt_g2,0)/(history.length*2):1;
 const ids=new Set(history.map(m=>m.id));
 const base={...data,matchs:Object.fromEntries(Object.entries(data.matchs).filter(([id])=>ids.has(id)))};
 const estimates=buildForecast({...base,matchs:{...base.matchs,...Object.fromEntries(targets)}}).predictions;
 const totals=new Map();
 for(const r of new Set(history.map(m=>m.m_set))){// Use all confirmed participants from each completed round.
  const roundMatches=Object.fromEntries(Object.entries(base.matchs).filter(([,m])=>m.m_set===r));
  const players={};
  for(const [id,m] of Object.entries(roundMatches))for(const [team,people] of relatedPlayers(base.matchDetails?.[id]?.data,m))for(const pid of people)players[pid]={...data.player[pid],team,dt:'0=0#14=0#16=0'};
  for(const [id,m] of Object.entries(roundMatches))for(const event of summarizeMatch(base.matchDetails?.[id]?.data,m,data.player).players)if(players[event.playerId]&&relatedPlayers(base.matchDetails?.[id]?.data,m).get(event.teamId)?.has(event.playerId)){
   const p=players[event.playerId],v=Object.fromEntries(p.dt.split('#').map(x=>x.split('=')));p.dt=`0=${+v[0]+event.goals}#14=${+v[14]+event.yellow}#16=${+v[16]+event.red}`;
  }
  for(const p of calculateScores({...base,matchs:roundMatches,player:players},awards,selections.filter(s=>s.roundId===r))){const t=totals.get(p.id)||{points:0,games:0,goals:0};t.points+=p.total;t.games+=p.teamGames;t.goals+=p.counts.goals;totals.set(p.id,t);}
 }
 const candidates=[];
 for(const [id,p] of Object.entries(data.player||{})){
  const t=totals.get(id);if(!t?.games)continue;
  const target=targets.find(([,m])=>m.team1===p.team||m.team2===p.team);if(!target)continue;
  const [mid,m]=target,pred=estimates.find(p=>p.matchId===mid&&p.status==='ready');if(!pred)continue;
   if(isSuspendedForMatch(p,m,data.matchs))continue;
   const side=m.team1===p.team?0:1,against=1-side;
  const average=t.points/t.games,win=pred.probabilities[side?2:0],draw=pred.probabilities[1],loss=pred.probabilities[side?0:2],ga=pred.expectedGoals[against];
  const goalkeeper=isGoalkeeper(id,p.team);
  const matchup=3*win+draw-2*loss-ga+(goalkeeper?5:2)*Math.exp(-ga)+(goalkeeper?0:5*(t.goals/t.games)*(pred.expectedGoals[side]/Math.max(0.1,leagueMean)-1));
  candidates.push({id,...p,goalkeeper,average,games:t.games,opponentId:m.team1===p.team?m.team2:m.team1,win,expectedAgainst:ga,recommendation:average+matchup});
 }
 candidates.sort((a,b)=>b.recommendation-a.recommendation||a.name.localeCompare(b.name,'pt-BR'));
 return candidates;
}
const selectSuggestions=(candidates,reverse=false)=>{
 const sorted=[...candidates].sort((a,b)=>(reverse?a.recommendation-b.recommendation:b.recommendation-a.recommendation)||a.name.localeCompare(b.name,'pt-BR'));
 return [...sorted.filter(p=>p.goalkeeper).slice(0,1),...sorted.filter(p=>!p.goalkeeper).slice(0,6)];
};
export function suggestCartola(data,roundId,awards=[],selections=[]){
 return selectSuggestions(cartolaCandidates(data,roundId,awards,selections));
}
export function suggestCartolaGroups(data,roundId,awards=[],selections=[]){
 const candidates=cartolaCandidates(data,roundId,awards,selections);
 const ideal=selectSuggestions(candidates);
 const used=new Set(ideal.map(p=>p.id));
 return {ideal,avoid:selectSuggestions(candidates.filter(p=>!used.has(p.id)),true)};
}

import {calculateScores,relatedPlayers} from './player-score.mjs';
import {summarizeMatch} from './match-stats.mjs';
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
 return {best:choose(false),worst:choose(true),pending,players:rows.length,complete:Object.values(matchs).every(m=>Number(m.st)===3||m.finished)};
}

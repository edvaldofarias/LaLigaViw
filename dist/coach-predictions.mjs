import {coaches,coachAssignments,coachFor} from './coaches.mjs';
import {nextRoundMatches} from './match-preview.mjs';
import {brasiliaDate,courtLabel} from './schedule.mjs';
const finished=m=>Number(m.st)===3||Boolean(m.finished);
const roundKey=m=>`${m.fs}:${m.m_set||brasiliaDate(m.d_i)}`;
const court=m=>{const label=courtLabel(m.title);return label==='Quadra 1'?1:label==='Quadra 2'?2:null};
// Predictions never become historical assignments or contribute to statistics.
export function predictMatchCoaches(match,data,assignments=coachAssignments,now=Date.now()){
 const next=nextRoundMatches(data,now);
 if(finished(match)||!next.some(m=>m.id===match.id))return null;
 const all=Object.entries(data.matchs||{}).map(([id,m])=>({...m,id}));
 const start=Math.min(...next.map(m=>m.d_i));
 const earlier=all.filter(m=>m.d_i<start&&roundKey(m)!==roundKey(match));
 const latest=[...earlier].sort((a,b)=>b.d_i-a.d_i)[0];
 const previous=latest?earlier.filter(m=>roundKey(m)===roundKey(latest)):[];
 const previousIds=new Set(previous.map(m=>m.id));
 const history=assignments.filter(a=>earlier.some(m=>m.id===a.matchId&&finished(m)&&[m.team1,m.team2].includes(a.teamId)));
 const targetCourt=court(match);
 const eligible=coaches.filter(c=>{
  const courts=new Set(history.filter(a=>a.coachId===c.id&&previousIds.has(a.matchId)).map(a=>court(data.matchs[a.matchId])));
  return previous.length&&previous.every(finished)&&targetCourt&&courts.size===1&&courts.has(3-targetCourt);
 });
 const teams=[match.team1,match.team2];
 const confirmed=teams.map(id=>coachFor(match.id,id,assignments));
 const sides=teams.map((teamId,i)=>({teamId,confirmed:confirmed[i],candidates:confirmed[i]?[confirmed[i]]:eligible.filter(c=>c.id!==confirmed[1-i]?.id&&history.some(a=>a.teamId===teamId&&a.coachId===c.id))}));
 const shared=sides[0].candidates.filter(c=>sides[1].candidates.some(other=>other.id===c.id));
 const resolved=sides.map(s=>({...s,coach:s.confirmed||(!shared.length&&s.candidates.length===1?s.candidates[0]:null)}));
 // Once history fixes one side, the only other coach on this court takes the
 // opponent, even without a prior assignment to that team. Never break a tie.
 if(!shared.length)for(const [i,side] of resolved.entries()){
  const opponent=resolved[1-i].coach;
  if(side.coach||side.candidates.length||!opponent)continue;
  const remaining=eligible.filter(c=>c.id!==opponent.id);
  if(remaining.length===1)side.coach=remaining[0];
 }
 return {sides:resolved,shared};
}

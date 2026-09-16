import {summarizeMatch} from './match-stats.mjs';
export const VENUE={name:'Pro Beach',address:'Av. Cézar Magnani, N° 840 - Paulicéia, São Bernardo do Campo - SP, 09694-000'};
const finished=m=>Number(m.st)===3||Boolean(m.finished);
const scored=m=>[m.dt?.qt_g1,m.dt?.qt_g2].every(v=>Number.isFinite(v)&&v>=0);
const label=v=>String(v||'Equipe a definir').trim().toLocaleLowerCase('pt-BR').replace(/(^|\s)\S/g,c=>c.toLocaleUpperCase('pt-BR'));
export function nextRoundMatches(data,now=Date.now()){
  const future=Object.entries(data.matchs||{}).map(([id,m])=>({...m,id})).filter(m=>!finished(m)&&Number.isFinite(m.d_i)&&m.d_i>now).sort((a,b)=>a.d_i-b.d_i||a.id.localeCompare(b.id));
  const first=future[0];
  return first?future.filter(m=>m.fs===first.fs&&(first.m_set?m.m_set===first.m_set:Math.floor((m.d_i-10800000)/86400000)===Math.floor((first.d_i-10800000)/86400000))):[];
}
export function matchPreview(match,data,selections=[],now=Date.now()){
  if(finished(match)||!match.team1||!match.team2||!Number.isFinite(match.d_i)||match.d_i<=now)return null;
  const history=Object.entries(data.matchs||{}).map(([id,m])=>({...m,id})).filter(m=>m.fs===match.fs&&finished(m)&&scored(m)&&m.d_i<Math.min(now,match.d_i)).sort((a,b)=>a.d_i-b.d_i||a.id.localeCompare(b.id));
  const points={};
  for(const m of history){points[m.team1]=(points[m.team1]||0)+(m.dt.qt_g1>m.dt.qt_g2?3:m.dt.qt_g1===m.dt.qt_g2?1:0);points[m.team2]=(points[m.team2]||0)+(m.dt.qt_g2>m.dt.qt_g1?3:m.dt.qt_g2===m.dt.qt_g1?1:0);}
  const leadingPoints=Math.max(0,...Object.values(points));
  const highlights=[];
  const stories=[match.team1,match.team2].map(teamId=>{
    const teamName=label(data.teams?.[teamId]?.name);
    const games=history.filter(m=>m.team1===teamId||m.team2===teamId),last=games.at(-1);
    if(!last)return `${teamName} busca um bom início; ainda não há resultado anterior registrado nesta fase.`;
    const home=last.team1===teamId,gf=home?last.dt.qt_g1:last.dt.qt_g2,ga=home?last.dt.qt_g2:last.dt.qt_g1;
    const opponent=label(data.teams?.[home?last.team2:last.team1]?.name);
    const outcome=gf>ga?'venceu':gf<ga?'perdeu para':'empatou com';
    const aim=gf<ga?'busca a reação':gf===ga?'busca a vitória':leadingPoints>0&&(points[teamId]||0)===leadingPoints?'busca se manter entre os líderes':'quer embalar mais uma vitória';
    let story=`${teamName} ${aim}: ${outcome} ${opponent} por ${gf} a ${ga} no último jogo.`;
    if((points[teamId]||0)<leadingPoints&&(points[teamId]||0)+3>=leadingPoints)story+=` Uma vitória pode levar a equipe à pontuação atual da liderança (${leadingPoints} pontos).`;
    const selected=selections.filter(r=>r.roundId===last.m_set&&r.phaseId===last.fs).flatMap(r=>r.players.filter(p=>p.teamId===teamId).map(p=>({...p,roundNumber:r.roundNumber})));
    const detail=data.matchDetails?.[last.id]?.data;
    const stats=summarizeMatch(detail,last,data.player||{});
    const candidates=stats.players.filter(p=>p.teamId===teamId&&p.goals>0).sort((a,b)=>b.goals-a.goals);
    const ids=[...new Set([...selected.map(p=>p.playerId),...candidates.map(p=>p.playerId)])].slice(0,2);
    for(const playerId of ids){
      const pick=selected.find(p=>p.playerId===playerId),p=stats.players.find(p=>p.playerId===playerId&&p.teamId===teamId);
      const playerName=label(data.player?.[playerId]?.name||pick?.name||p?.name);
      const facts=[];
      if(pick)facts.push(`seleção da ${pick.roundNumber}ª rodada`);
      if(p?.goals)facts.push(`${p.goals} ${p.goals===1?'gol':'gols'} no último jogo`);
      if(p?.yellow)facts.push(`${p.yellow} ${p.yellow===1?'cartão amarelo':'cartões amarelos'}`);
      if(p?.red)facts.push(`${p.red} ${p.red===1?'cartão vermelho':'cartões vermelhos'} registrado${p.red===1?'':'s'}`);
      if(facts.length)highlights.push({playerId,teamId,text:`${playerName}: ${facts.join(' · ')}.`});
    }
    return story;
  });
  return {stories,highlights,historyCount:history.length};
}

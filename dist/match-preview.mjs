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
const parseStats=value=>Object.fromEntries(String(value||'').split('#').filter(s=>s.includes('=')).map(s=>{const [key,value]=s.split('=');return [key,Number(value)]}));
export function matchPreview(match,data,selections=[],now=Date.now()){
  if(finished(match)||!match.team1||!match.team2||!Number.isFinite(match.d_i)||match.d_i<=now)return null;
  const all=Object.entries(data.matchs||{}).map(([id,m])=>({...m,id}));
  const past=all.filter(m=>m.fs===match.fs&&finished(m)&&m.d_i<Math.min(now,match.d_i)).sort((a,b)=>a.d_i-b.d_i||a.id.localeCompare(b.id));
  const history=past.filter(scored),completedRounds=new Set(past.map(m=>m.m_set));
  const points={};
  for(const m of history){points[m.team1]=(points[m.team1]||0)+(m.dt.qt_g1>m.dt.qt_g2?3:m.dt.qt_g1===m.dt.qt_g2?1:0);points[m.team2]=(points[m.team2]||0)+(m.dt.qt_g2>m.dt.qt_g1?3:m.dt.qt_g2===m.dt.qt_g1?1:0);}
  const leadingPoints=Math.max(0,...Object.values(points));
  const athletes=Object.entries(data.player||{}).map(([id,p])=>({...p,id,goals:parseStats(p.dt)[0]}));
  const topGoals=Math.max(0,...athletes.map(p=>Number.isFinite(p.goals)?p.goals:0));
  const topScorers=athletes.filter(p=>topGoals>0&&p.goals===topGoals);
  const columns=[match.team1,match.team2].map(teamId=>{
    const teamName=label(data.teams?.[teamId]?.name),games=history.filter(m=>m.team1===teamId||m.team2===teamId),last=games.at(-1);
    const earlier=all.some(m=>m.fs===match.fs&&Number.isFinite(m.d_i)&&m.d_i<match.d_i&&(m.team1===teamId||m.team2===teamId));
    const debut=!earlier&&!(parseStats(data.teams?.[teamId]?.dt?.[match.fs]?.dt)[1]>0);
    let story;
    if(!last)story=debut?`${teamName} faz sua estreia e busca os primeiros pontos no campeonato.`:`${teamName} volta a campo em busca de pontos. Os resultados anteriores ainda não estão disponíveis para uma análise da equipe.`;
    else{
      const home=last.team1===teamId,gf=home?last.dt.qt_g1:last.dt.qt_g2,ga=home?last.dt.qt_g2:last.dt.qt_g1;
      const opponent=label(data.teams?.[home?last.team2:last.team1]?.name);
      story=gf>ga?`${teamName} chega embalado pela vitória por ${gf} a ${ga} sobre ${opponent} e quer repetir o resultado.`:gf<ga?`${teamName} busca a reação após a derrota por ${gf} a ${ga} para ${opponent}. A equipe tenta responder com uma vitória.`:`Depois do empate por ${gf} a ${ga} com ${opponent}, ${teamName} vai em busca de uma vitória.`;
      if(leadingPoints>0&&(points[teamId]||0)===leadingPoints)story+=Object.values(points).filter(p=>p===leadingPoints).length>1?` Com ${points[teamId]} pontos, a equipe está no grupo que divide a maior pontuação da fase.`:` A equipe lidera a fase em pontos, com ${points[teamId]}.`;
    }
    const selected=selections.filter(r=>r.phaseId===match.fs&&completedRounds.has(r.roundId)).flatMap(r=>r.players.filter(p=>p.teamId===teamId&&(!data.player?.[p.playerId]?.team||data.player[p.playerId].team===teamId)).map(p=>({...p,roundNumber:r.roundNumber}))).sort((a,b)=>b.roundNumber-a.roundNumber);
    const stats=last?summarizeMatch(data.matchDetails?.[last.id]?.data,last,data.player||{}):{players:[]};
    const scorers=stats.players.filter(p=>p.teamId===teamId&&p.goals>0&&(!data.player?.[p.playerId]?.team||data.player[p.playerId].team===teamId));
    const candidates=[...new Set([...selected.map(p=>p.playerId),...topScorers.filter(p=>p.team===teamId).map(p=>p.id),...scorers.map(p=>p.playerId)])].filter(id=>id&&(data.player?.[id]?.name||selected.find(p=>p.playerId===id)?.name));
    const weight=id=>(selected.some(p=>p.playerId===id)?2:0)+(topScorers.some(p=>p.id===id)?3:0);
    candidates.sort((a,b)=>weight(b)-weight(a)||(scorers.find(p=>p.playerId===b)?.goals||0)-(scorers.find(p=>p.playerId===a)?.goals||0));
    const highlights=candidates.slice(0,2).map(playerId=>{
      const pick=selected.find(p=>p.playerId===playerId),p=stats.players.find(p=>p.playerId===playerId&&p.teamId===teamId);
      const playerName=label(data.player?.[playerId]?.name||pick?.name),sentences=[];
      if(pick)sentences.push(`${playerName} foi escolhido para a seleção da ${pick.roundNumber}ª rodada.`);
      if(topScorers.some(p=>p.id===playerId))sentences.push(`${sentences.length?'Também '+(topScorers.length>1?'divide':'lidera'):playerName+(topScorers.length>1?' divide':' lidera')} a artilharia do campeonato, com ${topGoals} ${topGoals===1?'gol':'gols'}.`);
      if(p?.goals)sentences.push(`${sentences.length?'Na última partida, marcou':playerName+' marcou'} ${p.goals} ${p.goals===1?'gol':'gols'}${sentences.length?'':' na última partida'}.`);
      return {playerId,teamId,name:playerName,text:sentences.join(' ')};
    }).filter(p=>p.text);
    return {teamId,name:teamName,story,highlights,debut};
  });
  const [home,away]=columns;
  const headline=home.debut&&away.debut?`${home.name} enfrenta ${away.name} na estreia das duas equipes`:`${home.name} enfrenta ${away.name} em busca de pontos`;
  return {headline,columns,stories:columns.map(c=>c.story),highlights:columns.flatMap(c=>c.highlights),historyCount:history.length};
}

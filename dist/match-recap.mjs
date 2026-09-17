import {summarizeMatch} from './match-stats.mjs';
const label=v=>String(v||'Equipe não informada').trim().toLocaleLowerCase('pt-BR').replace(/(^|\s)\S/g,c=>c.toLocaleUpperCase('pt-BR'));
export function matchRecap(match,data,sheet,award){
  if(!(Number(match.st)===3||match.finished))return null;
  const a=label(data.teams?.[match.team1]?.name),b=label(data.teams?.[match.team2]?.name);
  const [ga,gb]=[match.dt?.qt_g1,match.dt?.qt_g2];
  const hasScore=[ga,gb].every(Number.isFinite),summary=summarizeMatch(sheet,match,data.player||{});
  const headline=!hasScore?`${a} e ${b}: partida encerrada`:ga===gb?`${a} e ${b} empatam em ${ga} a ${gb}`:ga>gb?`${a} vence ${b} por ${ga} a ${gb}`:`${b} vence ${a} por ${gb} a ${ga}`;
  const intro=!hasScore?'O placar final ainda não foi informado.':ga===gb?'As equipes somaram um ponto cada.':`${ga>gb?a:b} somou três pontos; ${ga>gb?b:a} terminou a partida sem pontuar.`;
  const columns=[match.team1,match.team2].map(teamId=>{
    const ps=summary.players.filter(p=>p.teamId===teamId),goals=ps.filter(p=>p.goals),cards=ps.filter(p=>p.yellow||p.red||p.blue),own=ps.filter(p=>p.ownGoals);
    const paragraphs=[];
    if(!summary.hasSheet)paragraphs.push('Aguardando a súmula com os autores dos gols e cartões.');
    else{
      if(goals.length)paragraphs.push('Gols de '+goals.map(p=>`${label(p.name)} (${p.goals})`).join(', ')+'.');
      else paragraphs.push((teamId===match.team1?ga:gb)===0?'A equipe não marcou.':'A súmula ainda não identifica os autores dos gols desta equipe.');
      if(own.length)paragraphs.push('Gols contra registrados: '+own.map(p=>`${label(p.name)} (${p.ownGoals})`).join(', ')+'.');
      if(cards.length)paragraphs.push('Cartões: '+cards.map(p=>`${label(p.name)} — ${[[p.yellow,'amarelo'],[p.red,'vermelho'],[p.blue,'azul']].filter(([n])=>n).map(([n,l])=>`${n} ${l}${n>1?'s':''}`).join(' e ')}`).join('; ')+'.');
      else paragraphs.push('Nenhum cartão registrado para a equipe.');
    }
    return {teamId,name:label(data.teams?.[teamId]?.name),paragraphs};
  });
  const awardText=award?`${label(data.player?.[award.playerId]?.name||award.name)} foi eleito o melhor em campo pela organização.`:'O melhor em campo ainda não foi informado pela organização.';
  return {headline,intro,columns,awardText,goalDifference:summary.goalDifference,recordedGoals:summary.recordedGoals,scoreTotal:summary.scoreTotal};
}

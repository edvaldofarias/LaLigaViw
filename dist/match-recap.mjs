import {summarizeMatch} from './match-stats.mjs';
const label=v=>String(v||'Equipe não informada').trim().toLocaleLowerCase('pt-BR').replace(/(^|\s)\S/g,c=>c.toLocaleUpperCase('pt-BR'));
const join=items=>items.length<2?items[0]||'':`${items.slice(0,-1).join(', ')} e ${items.at(-1)}`;
const quantity=n=>({1:'um',2:'dois',3:'três'}[n]||String(n));
const scorer=p=>`${label(p.name)}${p.goals>1?` (${quantity(p.goals)} gols)`:''}`;

function cardStory(players){
  const sentences=[];
  for(const [key,color] of [['yellow','amarelo'],['red','vermelho'],['blue','azul']]){
    const booked=players.filter(p=>p[key]);
    if(!booked.length)continue;
    const allOne=booked.every(p=>p[key]===1);
    const names=join(booked.map(p=>label(p.name)));
    if(allOne)sentences.push(`${names} ${booked.length===1?'recebeu':'receberam'} cartão ${color}${booked.length>1?' cada':''}.`);
    else sentences.push(`Nos cartões ${color}s, a súmula registra ${join(booked.map(p=>`${quantity(p[key])} para ${label(p.name)}`))}.`);
  }
  return sentences.join(' ');
}

export function matchRecap(match,data,sheet,award){
  if(!(Number(match.st)===3||match.finished))return null;
  const ids=[match.team1,match.team2],names=ids.map(id=>label(data.teams?.[id]?.name));
  const [a,b]=names,[ga,gb]=[match.dt?.qt_g1,match.dt?.qt_g2];
  const hasScore=[ga,gb].every(Number.isFinite),draw=hasScore&&ga===gb;
  const winner=hasScore&&!draw?(ga>gb?0:1):null,loser=winner===null?null:1-winner;
  const total=hasScore?ga+gb:null,scores=[ga,gb];
  const summary=summarizeMatch(sheet,match,data.player||{});
  const classic=names.map(n=>n.toLowerCase()).sort().join('|')==='barcelona|real madrid';
  let headline;
  if(!hasScore)headline=`${a} e ${b}: partida encerrada`;
  else if(draw)headline=total===0?`Redes intactas: ${a} e ${b} ficam no 0 a 0`:
    total>=6?`Chuva de gols! ${a} e ${b} empatam em ${ga} a ${gb}`:`Tudo igual: ${a} e ${b} empatam em ${ga} a ${gb}`;
  else{
    const result=`${names[winner]} bate ${names[loser]} por ${scores[winner]} a ${scores[loser]}`;
    headline=classic&&total>=6?`Em clássico eletrizante de ${total} gols, ${result}!`:
      total>=6?`Em duelo de ${total} gols, ${result}!`:
      Math.abs(ga-gb)>=3?`${names[winner]} goleia ${names[loser]} por ${scores[winner]} a ${scores[loser]}!`:
      Math.abs(ga-gb)===1?`Na conta certa: ${result}!`:`${result}!`;
  }
  const awardPlayer=award?label(data.player?.[award.playerId]?.name||award.name):null;
  // The award belongs to this match; never infer its team from a later transfer.
  const awardTeam=award?.teamId||summary.players.find(p=>p.playerId===award?.playerId)?.teamId;
  const awardText=award?`${awardPlayer} foi eleito o melhor em campo pela organização.`:'O melhor em campo ainda não foi informado pela organização.';
  let intro=!hasScore?'O placar final ainda não foi informado.':draw?
    `${total>=6?`As redes balançaram ${total} vezes, mas ninguém ficou com a vitória. `:''}${a} e ${b} somaram um ponto cada.`:
    `${names[winner]} garantiu os três pontos${Math.abs(ga-gb)===1?' com uma vitória pela diferença mínima':''}, enquanto ${names[loser]} terminou a partida sem pontuar.`;
  if(awardPlayer){
    intro=winner!==null&&awardTeam===ids[winner]?`Com ${awardPlayer} eleito o craque do jogo, ${intro}`:`${intro} ${awardText}`;
  }
  const order=winner===null?[0,1]:[winner,loser];
  const columns=order.map(index=>{
    const teamId=ids[index],teamName=names[index];
    const ps=summary.players.filter(p=>p.teamId===teamId),goals=ps.filter(p=>p.goals),own=ps.filter(p=>p.ownGoals);
    const sentences=[];
    if(!summary.hasSheet)sentences.push('Aguardando a súmula com os autores dos gols e cartões.');
    else{
      const star=goals.find(p=>p.playerId===award?.playerId),others=goals.filter(p=>p!==star);
      if(star&&others.length){
        sentences.push(`${label(star.name)} também deixou sua marca no placar${star.goals>1?`, com ${quantity(star.goals)} gols`:''}. Além do craque do jogo, ${join(others.map(scorer))} ${others.length===1?'balançou':'balançaram'} as redes ${index===winner?'na vitória':`pelo ${teamName}`}.`);
      }else if(goals.length){
        const namesList=join(goals.map(scorer)),plural=goals.length>1;
        sentences.push(index===loser?`Pelo lado do ${teamName}, ${namesList} ${plural?'marcaram':'marcou'}, mas ${goals.reduce((n,p)=>n+p.goals,0)===1?'o gol não foi suficiente':'os gols não foram suficientes'} para evitar a derrota.`:
          `${namesList} ${plural?'balançaram':'balançou'} as redes pelo ${teamName}${draw?', que dividiu os pontos com o adversário':''}.`);
      }else if(scores[index]===0)sentences.push(`${teamName} passou em branco${index===loser?' e saiu da partida sem pontuar':draw?', mas somou um ponto com o empate':''}.`);
      else sentences.push(`Os autores dos gols do ${teamName} ainda não estão identificados na súmula.`);
      if(own.length)sentences.push(`A súmula também registra ${join(own.map(p=>`${quantity(p.ownGoals)} ${p.ownGoals===1?'gol contra':'gols contra'} de ${label(p.name)}`))}.`);
      const cards=cardStory(ps);
      if(cards)sentences.push(cards);
    }
    return {teamId,name:teamName,paragraphs:[sentences.join(' ')]};
  });
  const coverageNote=summary.hasSheet&&summary.goalDifference!==null&&summary.goalDifference!==0?
    summary.goalDifference<0?`Há uma divergência nos registros: a súmula traz ${summary.recordedGoals} gols, enquanto o placar soma ${summary.scoreTotal}.`:`A súmula identifica ${summary.recordedGoals} dos ${summary.scoreTotal} gols do placar; a autoria dos demais ainda não foi informada.`:null;
  return {headline,intro,columns,awardText,coverageNote,goalDifference:summary.goalDifference,recordedGoals:summary.recordedGoals,scoreTotal:summary.scoreTotal};
}

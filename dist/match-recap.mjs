import {summarizeMatch} from './match-stats.mjs';
const label=v=>String(v||'Equipe não informada').trim().toLocaleLowerCase('pt-BR').replace(/(^|\s)\S/g,c=>c.toLocaleUpperCase('pt-BR'));
const join=items=>items.length<2?items[0]||'':`${items.slice(0,-1).join(', ')} e ${items.at(-1)}`;
const quantity=n=>({1:'um',2:'dois',3:'três'}[n]||String(n));
const scorer=p=>`${label(p.name)}${p.goals>1?` (${quantity(p.goals)} gols)`:''}`;
const finished=m=>Number(m?.st)===3||Boolean(m?.finished);
const scored=m=>[m?.dt?.qt_g1,m?.dt?.qt_g2].every(Number.isFinite);

function matchesAt(data,match,includeCurrent){
  if(!match.id||!match.fs||!Number.isFinite(match.d_i))return [];
  return Object.entries(data.matchs||{}).map(([id,m])=>({id,...m})).filter(m=>
    m.fs===match.fs&&finished(m)&&scored(m)&&
    (m.d_i<match.d_i||(includeCurrent&&m.id===match.id))
  ).sort((a,b)=>a.d_i-b.d_i||a.id.localeCompare(b.id));
}

function standings(data,matches){
  return Object.entries(data.teams||{}).map(([id,team])=>{
    let pts=0,wins=0,gf=0,ga=0,games=0;
    for(const m of matches){
      if(m.team1!==id&&m.team2!==id)continue;
      const home=m.team1===id,forGoals=home?m.dt.qt_g1:m.dt.qt_g2,against=home?m.dt.qt_g2:m.dt.qt_g1;
      games++;gf+=forGoals;ga+=against;
      if(forGoals>against){pts+=3;wins++;}else if(forGoals===against)pts++;
    }
    return {id,name:label(team.name),pts,wins,gf,gd:gf-ga,games};
  }).sort((a,b)=>b.pts-a.pts||b.wins-a.wins||b.gd-a.gd||b.gf-a.gf||a.name.localeCompare(b.name,'pt-BR'))
    .map((team,index)=>({...team,rank:index+1}));
}

function teamImpact(teamId,data,beforeMatches,afterMatches){
  if(!beforeMatches.length)return null;
  const before=standings(data,beforeMatches),after=standings(data,afterMatches);
  const oldRow=before.find(team=>team.id===teamId),newRow=after.find(team=>team.id===teamId);
  if(!oldRow||!newRow)return null;
  const moved=oldRow.rank-newRow.rank,parts=[];
  if(moved>0)parts.push(`${newRow.name} subiu ${moved} ${moved===1?'posição':'posições'}, da ${oldRow.rank}ª para a ${newRow.rank}ª colocação`);
  else if(moved<0)parts.push(`${newRow.name} caiu ${Math.abs(moved)} ${moved===-1?'posição':'posições'}, da ${oldRow.rank}ª para a ${newRow.rank}ª colocação`);
  else parts.push(`${newRow.name} permaneceu na ${newRow.rank}ª colocação`);
  if(newRow.rank===1&&oldRow.rank!==1)parts.push('assumiu a liderança');
  else if(newRow.rank===1)parts.push('segue na liderança');
  if(oldRow.rank>8&&newRow.rank<=8)parts.push('entrou no G8');
  else if(oldRow.rank<=8&&newRow.rank>8)parts.push('saiu da zona de classificação, tornando mais difícil a luta por uma vaga');
  else if(newRow.rank>8){
    const cutoff=after[7],gap=Math.max(0,(cutoff?.pts||0)-newRow.pts);
    parts.push(gap?`ficou a ${gap} ${gap===1?'ponto':'pontos'} do G8`:'segue fora do G8 pelos critérios de desempate');
  }else if(newRow.rank<=4)parts.push('continua na faixa de classificação direta às quartas de final');
  else parts.push('continua no G8');
  return `${parts.join(' e ')}.`;
}

function goalTable(data,matches){
  const goals=new Map();
  for(const m of matches){
    const raw=data.matchDetails?.[m.id]?.data;
    const summary=summarizeMatch(raw,m,data.player||{});
    for(const player of summary.players){
      if(player.playerId&&player.goals)goals.set(player.playerId,(goals.get(player.playerId)||0)+player.goals);
    }
  }
  const rows=[...goals].map(([id,total])=>({id,total,name:label(data.player?.[id]?.name)}))
    .sort((a,b)=>b.total-a.total||a.name.localeCompare(b.name,'pt-BR'));
  let previousGoals=null,rank=0;
  return rows.map((row,index)=>{
    if(row.total!==previousGoals)rank=index+1;
    previousGoals=row.total;
    return {...row,rank};
  });
}

function scorerImpact(player,data,beforeMatches,afterMatches){
  if(!player.playerId||!player.goals)return null;
  const before=goalTable(data,beforeMatches),after=goalTable(data,afterMatches);
  const oldRow=before.find(row=>row.id===player.playerId),newRow=after.find(row=>row.id===player.playerId);
  if(!newRow)return null;
  const leaders=after.filter(row=>row.rank===1).length;
  if(newRow.rank===1&&oldRow?.rank!==1)return `${label(player.name)} chegou a ${newRow.total} ${newRow.total===1?'gol':'gols'} e ${leaders>1?'passou a dividir':'assumiu'} a liderança da artilharia.`;
  if(newRow.rank===1)return `${label(player.name)} marcou ${player.goals===1?'mais um gol':`${player.goals} gols`} e ${leaders>1?'segue dividindo':'ampliou sua marca na'} liderança da artilharia, agora com ${newRow.total}.`;
  if(oldRow&&newRow.rank<oldRow.rank)return `${label(player.name)} chegou a ${newRow.total} ${newRow.total===1?'gol':'gols'} e subiu da ${oldRow.rank}ª para a ${newRow.rank}ª posição na artilharia.`;
  if(!oldRow)return `${label(player.name)} entrou na disputa pela artilharia com ${newRow.total} ${newRow.total===1?'gol':'gols'}.`;
  return `${label(player.name)} chegou a ${newRow.total} ${newRow.total===1?'gol':'gols'} no campeonato.`;
}

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
  const beforeMatches=matchesAt(data,match,false),afterMatches=matchesAt(data,match,true);
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
  const intro=!hasScore?'O placar final ainda não foi informado.':awardPlayer?awardText:null;
  const order=winner===null?[0,1]:[winner,loser];
  const columns=order.map(index=>{
    const teamId=ids[index],teamName=names[index];
    const ps=summary.players.filter(p=>p.teamId===teamId),goals=ps.filter(p=>p.goals),own=ps.filter(p=>p.ownGoals);
    const sentences=[];
    const impact=teamImpact(teamId,data,beforeMatches,afterMatches);
    if(impact)sentences.push(impact);
    if(!summary.hasSheet)sentences.push('Aguardando a súmula com os autores dos gols e cartões.');
    else{
      const star=goals.find(p=>p.playerId===award?.playerId),others=goals.filter(p=>p!==star);
      if(star&&others.length){
        sentences.push(`${label(star.name)} também deixou sua marca no placar${star.goals>1?`, com ${quantity(star.goals)} gols`:''}. Além do craque do jogo, ${join(others.map(scorer))} ${others.length===1?'balançou':'balançaram'} as redes ${index===winner?'na vitória':`pelo ${teamName}`}.`);
      }else if(goals.length){
        const namesList=join(goals.map(scorer)),plural=goals.length>1;
        sentences.push(index===loser?`Pelo lado do ${teamName}, ${namesList} ${plural?'marcaram':'marcou'}, mas ${goals.reduce((n,p)=>n+p.goals,0)===1?'o gol não foi suficiente':'os gols não foram suficientes'} para evitar a derrota.`:
          `${namesList} ${plural?'balançaram':'balançou'} as redes pelo ${teamName}${draw?', que dividiu os pontos com o adversário':''}.`);
      }else if(scores[index]===0&&!impact)sentences.push(`${teamName} passou em branco.`);
      else sentences.push(`Os autores dos gols do ${teamName} ainda não estão identificados na súmula.`);
      if(own.length)sentences.push(`A súmula também registra ${join(own.map(p=>`${quantity(p.ownGoals)} ${p.ownGoals===1?'gol contra':'gols contra'} de ${label(p.name)}`))}.`);
      for(const player of goals){
        const impactText=scorerImpact(player,data,beforeMatches,afterMatches);
        if(impactText)sentences.push(impactText);
      }
      const cards=cardStory(ps);
      if(cards)sentences.push(cards);
    }
    return {teamId,name:teamName,paragraphs:[sentences.join(' ')]};
  });
  const coverageNote=summary.hasSheet&&summary.goalDifference!==null&&summary.goalDifference!==0?
    summary.goalDifference<0?`Há uma divergência nos registros: a súmula traz ${summary.recordedGoals} gols, enquanto o placar soma ${summary.scoreTotal}.`:`A súmula identifica ${summary.recordedGoals} dos ${summary.scoreTotal} gols do placar; a autoria dos demais ainda não foi informada.`:null;
  return {headline,intro,columns,awardText,coverageNote,goalDifference:summary.goalDifference,recordedGoals:summary.recordedGoals,scoreTotal:summary.scoreTotal};
}

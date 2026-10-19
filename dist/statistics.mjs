const parsedStats=value=>Object.fromEntries(String(value||'').split('#').filter(item=>item.includes('=')).map(item=>{const [key,count]=item.split('=');return [key,Math.max(0,Number(count)||0)]}));
const validMatch=match=>(Number(match?.st)===3||match?.finished)&&[match?.dt?.qt_g1,match?.dt?.qt_g2].every(Number.isFinite)&&match.team1&&match.team2&&match.team1!==match.team2;
const rate=(total,games)=>games?total/games:0;

export function buildStatistics(data,ranking=[],staff=[],awards=[],selections=[]){
  const matches=Object.entries(data.matchs||{}).map(([id,match])=>({id,...match})).filter(validMatch);
  const teams=Object.entries(data.teams||{}).map(([id,team])=>({
    id,...team,played:0,wins:0,draws:0,losses:0,gf:0,ga:0,cleanSheets:0,unbeaten:0,
  }));
  const byTeam=new Map(teams.map(team=>[team.id,team]));

  for(const match of matches){
    [[match.team1,match.dt.qt_g1,match.dt.qt_g2],[match.team2,match.dt.qt_g2,match.dt.qt_g1]].forEach(([teamId,gf,ga])=>{
      const team=byTeam.get(teamId);if(!team)return;
      team.played++;team.gf+=gf;team.ga+=ga;if(ga===0)team.cleanSheets++;
      if(gf>ga)team.wins++;else if(gf===ga)team.draws++;else team.losses++;
    });
  }
  for(const team of teams){
    let sequence=0,best=0;
    matches.filter(match=>[match.team1,match.team2].includes(team.id)).sort((a,b)=>(a.d_i||0)-(b.d_i||0)).forEach(match=>{
      const home=match.team1===team.id;
      const gf=home?match.dt.qt_g1:match.dt.qt_g2,ga=home?match.dt.qt_g2:match.dt.qt_g1;
      sequence=gf>=ga?sequence+1:0;best=Math.max(best,sequence);
    });
    team.unbeaten=best;
    team.gfAverage=rate(team.gf,team.played);
    team.gaAverage=rate(team.ga,team.played);
  }
  const eligibleTeams=teams.filter(team=>team.played);
  const players=Object.entries(data.player||{}).map(([id,player])=>{
    const stats=parsedStats(player.dt);
    return {id,...player,goals:stats[0]||0,yellow:stats[14]||0,red:stats[16]||0,discipline:(stats[14]||0)*0.5+(stats[16]||0)};
  });
  const duos=teams.map(team=>{
    const members=players.filter(player=>player.team===team.id).sort((a,b)=>b.goals-a.goals||String(a.name).localeCompare(String(b.name),'pt-BR')).slice(0,2);
    return {teamId:team.id,team,members,goals:members.reduce((sum,player)=>sum+player.goals,0)};
  }).sort((a,b)=>b.goals-a.goals||String(a.team.name).localeCompare(String(b.team.name),'pt-BR'));
  const goalkeepers=ranking.filter(player=>player.active&&player.goalkeeper&&player.counts.appearances).map(player=>({
    ...player,appearances:player.counts.appearances,goalsAgainst:player.counts.goalsAgainst,
    average:rate(player.counts.goalsAgainst,player.counts.appearances),
    cleanSheets:player.counts.goalkeeperCleanSheets,
  })).sort((a,b)=>a.average-b.average||b.cleanSheets-a.cleanSheets||b.appearances-a.appearances).slice(0,3);
  const matchRow=match=>{
    const home=byTeam.get(match.team1),away=byTeam.get(match.team2);
    return {...match,home,away,homeGoals:match.dt.qt_g1,awayGoals:match.dt.qt_g2,totalGoals:match.dt.qt_g1+match.dt.qt_g2,margin:Math.abs(match.dt.qt_g1-match.dt.qt_g2)};
  };
  const matchRows=matches.map(matchRow);
  const top=(rows,compare)=>[...rows].sort(compare).slice(0,3);
  const playerById=new Map(players.map(player=>[player.id,player]));
  const appearanceRanking=entries=>{
    const counts=new Map();
    for(const entry of entries)for(const id of new Set(entry.playerIds)){
      const row=counts.get(id)||{id,count:0};row.count++;counts.set(id,row);
    }
    return top([...counts.values()].map(row=>({...playerById.get(row.id),...row})).filter(row=>row.name),(a,b)=>b.count-a.count||String(a.name).localeCompare(String(b.name),'pt-BR'));
  };
  const selectionEntries=selections.map(selection=>({playerIds:(selection.players||[]).map(player=>player.playerId)}));
  const completedRounds=[...new Set(matches.map(match=>match.m_set).filter(Boolean))].filter(roundId=>{
    const roundMatches=Object.values(data.matchs||{}).filter(match=>match.m_set===roundId);
    return roundMatches.length&&roundMatches.every(validMatch);
  });
  const cartolaRounds=completedRounds.map(roundId=>roundCartola(data,roundId,awards,selections));
  const teamHonorMap=new Map(teams.map(team=>[team.id,{...team,appearances:0,awards:0,players:new Set()}]));
  for(const selection of selections)for(const player of selection.players||[]){
    const team=teamHonorMap.get(player.teamId);if(!team)continue;
    team.appearances++;team.players.add(player.playerId);
  }
  for(const award of awards){
    const team=teamHonorMap.get(award.teamId);if(!team)continue;
    team.appearances++;team.awards++;team.players.add(award.playerId);
  }
  const teamHonors=top([...teamHonorMap.values()].map(team=>({...team,players:team.players.size})).filter(team=>team.appearances),(a,b)=>b.appearances-a.appearances||b.awards-a.awards||b.players-a.players);

  return {
    summary:{
      matches:matches.length,
      goals:matchRows.reduce((sum,match)=>sum+match.totalGoals,0),
      average:rate(matchRows.reduce((sum,match)=>sum+match.totalGoals,0),matches.length),
      cleanSheets:matchRows.filter(match=>match.homeGoals===0||match.awayGoals===0).length,
      scorers:players.filter(player=>player.goals).length,
      cards:players.reduce((sum,player)=>sum+player.yellow+player.red,0),
    },
    players:ranking.filter(player=>player.active).slice(0,3),
    scorers:top(players.filter(player=>player.goals),(a,b)=>b.goals-a.goals||String(a.name).localeCompare(String(b.name),'pt-BR')),
    attacks:top(eligibleTeams,(a,b)=>b.gf-a.gf||b.gfAverage-a.gfAverage),
    defenses:top(eligibleTeams,(a,b)=>a.gaAverage-b.gaAverage||a.ga-b.ga||b.cleanSheets-a.cleanSheets),
    worstDefenses:top(eligibleTeams,(a,b)=>b.ga-a.ga||String(a.name).localeCompare(String(b.name),'pt-BR')),
    cleanSheets:top(eligibleTeams,(a,b)=>b.cleanSheets-a.cleanSheets||a.gaAverage-b.gaAverage),
    unbeaten:top(eligibleTeams,(a,b)=>b.unbeaten-a.unbeaten||b.wins-a.wins),
    goalkeepers,
    coaches:top(staff.filter(coach=>coach.played),(a,b)=>b.percent-a.percent||b.points-a.points||b.gd-a.gd),
    indiscipline:top(players.filter(player=>player.discipline),(a,b)=>b.discipline-a.discipline||b.red-a.red||b.yellow-a.yellow),
    selectionAppearances:appearanceRanking(selectionEntries),
    cartolaIdealAppearances:appearanceRanking(cartolaRounds.map(round=>({playerIds:round.best.map(player=>player.id)}))),
    cartolaWorstAppearances:appearanceRanking(cartolaRounds.map(round=>({playerIds:round.worst.map(player=>player.id)}))),
    teamHonors,
    duos,
    biggestWins:top(matchRows.filter(match=>match.margin),(a,b)=>b.margin-a.margin||b.totalGoals-a.totalGoals),
    highestScoring:top(matchRows,(a,b)=>b.totalGoals-a.totalGoals||b.margin-a.margin),
  };
}
import {roundCartola} from './cartola.mjs';

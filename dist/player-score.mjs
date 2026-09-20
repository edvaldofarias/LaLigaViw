import {isGoalkeeper} from './goalkeepers.mjs';
export const SCORE_RULES=[
  {key:'goals',label:'Gol',points:5},
  {key:'yellow',label:'Cartão amarelo',points:-2},
  {key:'red',label:'Cartão vermelho',points:-8},
  {key:'wins',label:'Vitória da equipe',points:3},
  {key:'draws',label:'Empate da equipe',points:1},
  {key:'losses',label:'Derrota da equipe',points:-2},
  {key:'goalkeeperCleanSheets',label:'Sem sofrer gols · goleiro',points:5},
  {key:'outfieldCleanSheets',label:'Sem sofrer gols · linha',points:2},
  {key:'goalsAgainst',label:'Gol sofrido pela equipe',points:-1},
  {key:'motm',label:'Melhor em campo',points:2},
  {key:'selections',label:'Seleção da rodada',points:4},
];
const stats=value=>Object.fromEntries(String(value||'').split('#').filter(s=>s.includes('=')).map(s=>{const [k,v]=s.split('=');return[k,Math.max(0,Number(v)||0)]}));
// Organization rule: ac=7 / val1=1 (reserve) means absent in this league.
// Only val1=0 (or the source default when omitted) counts as attendance.
export function relatedPlayers(sheet,match,includeAbsent=false){
  const byTeam=new Map([[match.team1,new Set()],[match.team2,new Set()]]);
  for(const event of Object.values(sheet?.list||{})){
    if(Number(event?.ac)!==7||!event.pl_id1||!byTeam.has(event.team1))continue;
    const role=Number(event.val1??0);
    if(role!==0&&!(includeAbsent&&role===1))continue;
    byTeam.get(event.team1).add(String(event.pl_id1));
  }
  return byTeam;
}
const finishedWithScore=m=>(Number(m.st)===3||m.finished)&&[m.dt?.qt_g1,m.dt?.qt_g2].every(n=>Number.isInteger(n)&&n>=0)&&m.team1&&m.team2&&m.team1!==m.team2;
export function scoreDataStatus(data){
  let pending=0,stale=0;
  for(const [id,m] of Object.entries(data.matchs||{})){
    if(!finishedWithScore(m))continue;
    const entry=data.matchDetails?.[id];
    if([...relatedPlayers(entry?.data,m,true).values()].some(ids=>!ids.size))pending++;
    if(entry?.error&&entry.data)stale++;
  }
  return {pending,stale};
}
const emptyResults=()=>({wins:0,draws:0,losses:0,cleanSheets:0,goalkeeperCleanSheets:0,outfieldCleanSheets:0,goalsAgainst:0});
export function calculateScores(data,awards=[],selections=[]){
  const results=new Map();
  for(const [matchId,m] of Object.entries(data.matchs||{})){
    if(!finishedWithScore(m))continue;
    const related=relatedPlayers(data.matchDetails?.[matchId]?.data,m);
    [m.team1,m.team2].forEach((teamId,i)=>{
      const gf=i?m.dt.qt_g2:m.dt.qt_g1,ga=i?m.dt.qt_g1:m.dt.qt_g2;
      for(const playerId of related.get(teamId)){
        const row=results.get(playerId)||emptyResults();
        row[gf>ga?'wins':gf===ga?'draws':'losses']++;
        if(ga===0){
          row.cleanSheets++;
          row[isGoalkeeper(playerId,teamId)?'goalkeeperCleanSheets':'outfieldCleanSheets']++;
        }
        row.goalsAgainst+=ga;
        results.set(playerId,row);
      }
    });
  }
  const uniqueAwards=[...new Map(awards.map(a=>[a.matchId,a])).values()].filter(a=>{
    const m=data.matchs?.[a.matchId];return m&&(Number(m.st)===3||m.finished);
  });
  const rows=Object.entries(data.player||{}).map(([id,p])=>{
    const s=stats(p.dt),r=results.get(id)||emptyResults();
    const goalkeeper=isGoalkeeper(id,p.team);
    const counts={goals:s[0]||0,yellow:s[14]||0,red:s[16]||0,...r,
      motm:uniqueAwards.filter(a=>a.playerId===id).length,
      selections:new Set(selections.filter(r=>r.players.some(p=>p.playerId===id)).map(r=>r.id)).size};
    const components=SCORE_RULES.filter(rule=>rule.key!==(goalkeeper?'outfieldCleanSheets':'goalkeeperCleanSheets')||counts[rule.key]>0).map(rule=>({...rule,count:counts[rule.key],earned:counts[rule.key]*rule.points}));
    return {id,...p,goalkeeper,shirtNumber:goalkeeper?1:null,counts,components,total:components.reduce((n,c)=>n+c.earned,0),hasStats:p.dt!=null,
      active:Object.values(counts).some(n=>n>0),teamGames:r.wins+r.draws+r.losses};
  });
  rows.sort((a,b)=>b.total-a.total||String(a.name).localeCompare(String(b.name),'pt-BR'));
  let position=0,lastScore=null,seen=0;
  for(const row of rows){if(!row.active){row.rank=null;continue}seen++;if(row.total!==lastScore)position=seen;row.rank=position;lastScore=row.total;}
  return rows;
}

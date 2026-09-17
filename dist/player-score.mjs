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
export function calculateScores(data,awards=[],selections=[]){
  const results={};
  for(const m of Object.values(data.matchs||{})){
    if(!(Number(m.st)===3||m.finished)||![m.dt?.qt_g1,m.dt?.qt_g2].every(n=>Number.isInteger(n)&&n>=0)||!m.team1||!m.team2||m.team1===m.team2)continue;
    [m.team1,m.team2].forEach((id,i)=>{
      const row=results[id]??={wins:0,draws:0,losses:0,cleanSheets:0,goalsAgainst:0};
      const gf=i?m.dt.qt_g2:m.dt.qt_g1,ga=i?m.dt.qt_g1:m.dt.qt_g2;
      row[gf>ga?'wins':gf===ga?'draws':'losses']++;
      if(ga===0)row.cleanSheets++;
      row.goalsAgainst+=ga;
    });
  }
  const uniqueAwards=[...new Map(awards.map(a=>[a.matchId,a])).values()].filter(a=>{
    const m=data.matchs?.[a.matchId];return m&&(Number(m.st)===3||m.finished);
  });
  const rows=Object.entries(data.player||{}).map(([id,p])=>{
    const s=stats(p.dt),r=results[p.team]||{wins:0,draws:0,losses:0,cleanSheets:0,goalsAgainst:0};
    const goalkeeper=isGoalkeeper(id,p.team);
    const counts={goalkeeperCleanSheets:goalkeeper?r.cleanSheets:0,outfieldCleanSheets:goalkeeper?0:r.cleanSheets,goals:s[0]||0,yellow:s[14]||0,red:s[16]||0,...r,
      motm:uniqueAwards.filter(a=>a.playerId===id).length,
      selections:new Set(selections.filter(r=>r.players.some(p=>p.playerId===id)).map(r=>r.id)).size};
    const components=SCORE_RULES.filter(rule=>rule.key!==(goalkeeper?'outfieldCleanSheets':'goalkeeperCleanSheets')).map(rule=>({...rule,count:counts[rule.key],earned:counts[rule.key]*rule.points}));
    return {id,...p,goalkeeper,shirtNumber:goalkeeper?1:null,counts,components,total:components.reduce((n,c)=>n+c.earned,0),hasStats:p.dt!=null,
      active:Object.values(counts).some(n=>n>0),teamGames:r.wins+r.draws+r.losses};
  });
  rows.sort((a,b)=>b.total-a.total||String(a.name).localeCompare(String(b.name),'pt-BR'));
  let position=0,lastScore=null,seen=0;
  for(const row of rows){if(!row.active){row.rank=null;continue}seen++;if(row.total!==lastScore)position=seen;row.rank=position;lastScore=row.total;}
  return rows;
}

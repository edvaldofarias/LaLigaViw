import {normalizeCompetition} from './match-data.mjs';
const valid=n=>Number.isInteger(n)&&n>=0&&n<=99;
const complete=m=>(Number(m.st)===3||m.finished)&&valid(m.dt?.qt_g1)&&valid(m.dt?.qt_g2);
const sortRows=rows=>rows.sort((a,b)=>b.pts-a.pts||b.v-a.v||b.sg-a.sg||b.gp-a.gp||a.name.localeCompare(b.name,'pt-BR'));
// Pure what-if calculation: never modifies the source, official standings or odds.
export function simulateRoundSeven(source,inputs={}) {
 const data=normalizeCompetition(source);
 const all=Object.entries(data.matchs||{}).map(([id,m])=>({id,...m})).sort((a,b)=>a.d_i-b.d_i);
 const phase=all.find(m=>m.fs)?.fs,games=all.filter(m=>m.fs===phase);
 const rounds=[...new Set(games.map(m=>m.m_set))],roundId=rounds[6];
 const matches=roundId?games.filter(m=>m.m_set===roundId):[];
 const ids=new Set(games.flatMap(m=>[m.team1,m.team2]).filter(id=>data.teams?.[id]));
 const rows=[...ids].map(id=>({id,team:id,name:data.teams[id].name,pts:0,j:0,v:0,e:0,d:0,gp:0,gc:0,sg:0}));
 const byId=new Map(rows.map(r=>[r.id,r]));
 const apply=(m,h,a)=>[m.team1,m.team2].forEach((id,i)=>{const r=byId.get(id);if(!r)return;const gf=i?a:h,ga=i?h:a;r.j++;r.gp+=gf;r.gc+=ga;r.sg=r.gp-r.gc;r[gf>ga?'v':gf===ga?'e':'d']++;r.pts+=gf>ga?3:gf===ga?1:0;});
 games.filter(m=>m.m_set!==roundId&&rounds.indexOf(m.m_set)<6&&complete(m)).forEach(m=>apply(m,m.dt.qt_g1,m.dt.qt_g2));
 const baseline=new Map(sortRows([...rows]).map((r,i)=>[r.id,i+1]));let entered=0,invalid=0;
 const fixtures=matches.map(m=>{
   const custom=Object.hasOwn(inputs,m.id),value=custom?inputs[m.id]:complete(m)?{home:m.dt.qt_g1,away:m.dt.qt_g2}:{};
   const ready=valid(value.home)&&valid(value.away),hasValue=value.home!=null||value.away!=null;
   if(ready){apply(m,value.home,value.away);entered++;}else if(hasValue)invalid++;
   return {...m,home:value.home??null,away:value.away??null,custom,ready,official:complete(m)};
 });
 sortRows(rows).forEach((r,i)=>{r.rank=i+1;r.movement=baseline.get(r.id)-r.rank;r.change=r.movement>0?`↑ ${r.movement}`:r.movement<0?`↓ ${-r.movement}`:'—';r._rowClass=i<4?'g4':i<8?'g8':'';});
 return {roundId,fixtures,rows,entered,invalid,total:matches.length,pendingEarlier:games.filter(m=>rounds.indexOf(m.m_set)<6&&!complete(m)).length};
}

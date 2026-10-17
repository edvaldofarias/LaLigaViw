// Copa Fácil st=1 is confirmed in-progress. Unknown codes never imply kickoff.
export const isLiveMatch=m=>Number(m?.st)===1&&!m?.finished;
export function liveScore(m){if(!isLiveMatch(m))return null;return ['qt_g1','qt_g2'].map(k=>!Object.hasOwn(m.dt||{},k)?0:Number.isInteger(m.dt[k])&&m.dt[k]>=0?m.dt[k]:null);}
export function provisionalStandings(data,phase){
 const all=Object.values(data.matchs||{}).filter(m=>m.fs===phase);
 if(!all.some(isLiveMatch))return null;
 const rows=Object.entries(data.teams||{}).map(([id,t])=>({id,...t,j:0,v:0,e:0,d:0,gp:0,gc:0,pts:0,sg:0,form:[],live:false}));
 const byId=new Map(rows.map(t=>[t.id,t]));
 for(const m of all.sort((a,b)=>a.d_i-b.d_i)){
  const live=isLiveMatch(m),score=live?liveScore(m):Number(m.st)===3||m.finished?[m.dt?.qt_g1,m.dt?.qt_g2]:null;
  if(!score||score.some(v=>!Number.isInteger(v)||v<0))continue;
  [m.team1,m.team2].forEach((id,i)=>{const t=byId.get(id);if(!t)return;const gf=score[i],ga=score[1-i];t.j++;t.gp+=gf;t.gc+=ga;t[gf>ga?'v':gf===ga?'e':'d']++;t.live ||=live;t.form.push(gf>ga?'V':gf===ga?'E':'D');});
 }
 for(const t of rows){t.pts=t.v*3+t.e;t.sg=t.gp-t.gc;t.percent=t.j?Math.round(t.pts/(t.j*3)*100):0;t.form=t.form.slice(-5);}
 rows.sort((a,b)=>b.pts-a.pts||b.v-a.v||b.sg-a.sg||b.gp-a.gp||a.name.localeCompare(b.name,'pt-BR'));rows.forEach((t,i)=>t.rank=i);return rows;
}

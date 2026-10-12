import {roundCartola} from './cartola.mjs';
const done=m=>(Number(m.st)===3||m.finished)&&[m.dt?.qt_g1,m.dt?.qt_g2].every(Number.isFinite);
export function completedRoundGroups(data,phase){
 const groups=new Map();
 for(const [id,m] of Object.entries(data.matchs||{})){if(phase&&m.fs!==phase)continue;const key=`${m.fs}:${m.m_set}`;if(!groups.has(key))groups.set(key,{id:m.m_set,phase:m.fs,matches:[]});groups.get(key).matches.push({id,...m});}
 return [...groups.values()].sort((a,b)=>Math.min(...a.matches.map(m=>m.d_i))-Math.min(...b.matches.map(m=>m.d_i))).map((g,i)=>({...g,number:i+1})).filter(g=>g.matches.length&&g.matches.every(done));
}
export function playerEvolution(data,playerId,awards=[],selections=[]){
 const total=new Map(),history=[];
 for(const group of completedRoundGroups(data)){
  const result=roundCartola(data,group.id,awards,selections);
  for(const p of result.rows)total.set(p.id,(total.get(p.id)||0)+p.total);
  const own=result.rows.find(p=>p.id===playerId),sum=total.get(playerId);
  history.push({round:group.number,points:own?own.total:0,present:!!own,cumulative:sum??0,rank:sum==null?null:1+[...total.values()].filter(v=>v>sum).length,pending:result.pending>0});
 }
 return history;
}
export function teamEvolution(data,phase){
 const stats=new Map(Object.keys(data.teams||{}).map(id=>[id,{id,points:0,wins:0,gf:0,ga:0}]));
 const series=new Map([...stats.keys()].map(id=>[id,[]]));
 for(const group of completedRoundGroups(data,phase)){
  for(const m of group.matches)[m.team1,m.team2].forEach((id,i)=>{const t=stats.get(id);if(!t)return;const gf=i?m.dt.qt_g2:m.dt.qt_g1,ga=i?m.dt.qt_g1:m.dt.qt_g2;t.gf+=gf;t.ga+=ga;t.points+=gf>ga?3:gf===ga?1:0;if(gf>ga)t.wins++;});
  const sorted=[...stats.values()].sort((a,b)=>b.points-a.points||b.wins-a.wins||(b.gf-b.ga)-(a.gf-a.ga)||b.gf-a.gf||a.id.localeCompare(b.id));
  sorted.forEach((t,i)=>series.get(t.id).push({round:group.number,points:t.points,rank:i+1}));
 }
 return series;
}
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const logoURL=u=>{try{const url=new URL(u);return url.protocol==='https:'?esc(url.href):''}catch{return ''}};
export const chartColors=['#527428','#2563eb','#dc2626','#8b5cf6','#0891b2','#c27803','#db2777','#334155','#059669','#7c2d12','#4338ca','#a16207'];
export function lineChart(series,{title,rank=false}={}){
 if(!series.flatMap(s=>s.values).some(p=>Number.isFinite(p.value)))return '<p class="subtle">Aguardando rodadas completas para o gráfico.</p>';
 const safe=series.map((s,i)=>({...s,color:s.color||chartColors[i%chartColors.length],logo:logoURL(s.logo)?s.logo:null}));
 return `<figure class="evolution-chart"><figcaption>${esc(title)}</figcaption><div class="chart-canvas-wrap"><canvas data-evolution-chart="${esc(JSON.stringify({series:safe,rank}))}" role="img" aria-label="${esc(title)}"></canvas></div><div class="chart-legend">${safe.map((s,i)=>`<button type="button" data-chart-series="${i}" aria-pressed="true" aria-label="Mostrar ou ocultar ${esc(s.name)}"><i style="background:${s.color}"></i>${logoURL(s.logo)?`<img src="${logoURL(s.logo)}" alt="" loading="lazy">`:''}${esc(s.name)}</button>`).join('')}</div><details class="chart-values"><summary>Consultar valores do gráfico</summary>${safe.map(s=>`<p><b>${esc(s.name)}</b>: ${s.values.map(p=>`R${p.round}: ${Number.isFinite(p.value)?p.value+(rank?'º':' pontos'):'—'}`).join(' · ')}</p>`).join('')}</details></figure>`;
}

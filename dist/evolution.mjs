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
 const entries=series.flatMap(s=>s.values);if(!entries.length)return '<p class="subtle">Aguardando rodadas completas para o gráfico.</p>';
 const vals=entries.map(p=>p.value).filter(Number.isFinite);if(!vals.length)return '<p class="subtle">Ainda não há posição registrada.</p>';
 const maxRound=Math.max(...entries.map(p=>p.round)),min=rank?1:Math.min(0,...vals),max=rank?Math.max(2,...vals):Math.max(1,...vals),w=720,h=280,left=72,right=26,top=26,bottom=45;
 const x=r=>left+(r-1)/Math.max(1,maxRound-1)*(w-left-right),y=v=>top+(rank?(v-min)/(max-min):(max-v)/(max-min))*(h-top-bottom);
 let svg='';for(let i=0;i<=4;i++){const v=min+(max-min)*i/4,py=y(v);svg+=`<line x1="${left}" y1="${py}" x2="${w-right}" y2="${py}" stroke="#e1e6ed"/><text x="${left-10}" y="${py+4}" text-anchor="end">${rank?Math.round(v)+'°':Math.round(v)}</text>`;}
 for(let r=1;r<=maxRound;r++)svg+=`<text x="${x(r)}" y="${h-16}" text-anchor="middle">R${r}</text>`;
 series.forEach((s,i)=>{const color=s.color||chartColors[i%chartColors.length];let path='';for(const p of s.values){if(!Number.isFinite(p.value)){path+=' ';continue;}path+=`${path.trim()?' L':'M'}${x(p.round)},${y(p.value)}`;svg+=`<circle cx="${x(p.round)}" cy="${y(p.value)}" r="2.5" fill="${color}"><title>${esc(s.name)} · Rodada ${p.round}: ${p.value}${rank?'º':' pontos'}</title></circle>`;}const first=s.values.find(p=>Number.isFinite(p.value));if(first&&logoURL(s.logo))svg+=`<image href="${logoURL(s.logo)}" x="${x(first.round)-22}" y="${y(first.value)-7}" width="14" height="14" preserveAspectRatio="xMidYMid meet"><title>${esc(s.name)}</title></image>`;svg+=`<path d="${path}" fill="none" stroke="${color}" stroke-width="1.15" vector-effect="non-scaling-stroke"/>`;});
 return `<figure class="evolution-chart"><figcaption>${esc(title)}</figcaption><svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}"><title>${esc(title)}</title>${svg}</svg><div class="chart-legend">${series.map((s,i)=>`<span><i style="background:${s.color||chartColors[i%chartColors.length]}"></i>${logoURL(s.logo)?`<img src="${logoURL(s.logo)}" alt="" loading="lazy" referrerpolicy="no-referrer">`:""}${esc(s.name)}</span>`).join('')}</div></figure>`;
}

// Chart.js owns drawing, interactions and resizing. Domain calculations stay in evolution.mjs.
const instances=new Map();
function enhanceCharts(){
 for(const [canvas,chart] of instances)if(!canvas.isConnected){chart.destroy();instances.delete(canvas);}
 if(!globalThis.Chart)return;
 for(const canvas of document.querySelectorAll('canvas[data-evolution-chart]')){
  if(instances.has(canvas))continue;
  const spec=JSON.parse(canvas.dataset.evolutionChart),maxRound=Math.max(...spec.series.flatMap(s=>s.values.map(v=>v.round)));
  const logos=spec.series.map(s=>{if(!s.logo)return null;const img=new Image();img.src=s.logo;return img;});
  const chart=new Chart(canvas,{type:'line',data:{labels:Array.from({length:maxRound},(_,i)=>'R'+(i+1)),datasets:spec.series.map(s=>({label:s.name,data:Array.from({length:maxRound},(_,i)=>s.values.find(v=>v.round===i+1)?.value??null),borderColor:s.color,backgroundColor:s.color,borderWidth:1.2,pointRadius:2,pointHoverRadius:5,tension:0,spanGaps:false}))},options:{responsive:true,maintainAspectRatio:false,animation:false,interaction:{mode:'index',intersect:false},layout:{padding:{left:20}},plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>`${ctx.dataset.label}: ${ctx.parsed.y}${spec.rank?'º':' pontos'}`}}},scales:{x:{grid:{display:false}},y:{reverse:spec.rank,min:spec.rank?1:undefined,beginAtZero:!spec.rank,ticks:{precision:0,callback:v=>spec.rank?v+'º':v}}}},plugins:[{id:'teamLogos',afterDatasetsDraw(chart){logos.forEach((img,i)=>{if(!img?.complete||!img.naturalWidth||!chart.isDatasetVisible(i))return;const pt=chart.getDatasetMeta(i).data.find((_,j)=>chart.data.datasets[i].data[j]!=null);if(pt)chart.ctx.drawImage(img,pt.x-20,pt.y-7,14,14);});}}]});
  logos.forEach(img=>{if(img)img.onload=()=>{if(canvas.isConnected)chart.draw();};});
  instances.set(canvas,chart);
  canvas.closest('figure').querySelectorAll('[data-chart-series]').forEach(button=>button.addEventListener('click',()=>{const i=+button.dataset.chartSeries,visible=chart.isDatasetVisible(i);chart.setDatasetVisibility(i,!visible);button.setAttribute('aria-pressed',String(!visible));chart.update();}));
 }
}
let scheduled=false;function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(()=>{scheduled=false;enhanceCharts();});}}
const observer=new MutationObserver(schedule);for(const id of ['content','detail-content']){const root=document.getElementById(id);if(root)observer.observe(root,{childList:true,subtree:true});}
document.getElementById('detail')?.addEventListener('close',()=>{for(const [canvas,chart] of instances)if(canvas.closest('#detail')){chart.destroy();instances.delete(canvas);}});schedule();

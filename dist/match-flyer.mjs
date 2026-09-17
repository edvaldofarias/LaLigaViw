import {contain,VIW_LOGO} from './poster-assets.mjs';
import {nextRoundMatches,VENUE} from './match-preview.mjs';
import {courtLabel} from './schedule.mjs';
function browserImage(url){return new Promise((resolve,reject)=>{const img=new Image();img.crossOrigin='anonymous';img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('Não foi possível carregar o escudo.'));img.src=url})}
function textLines(ctx,text,x,y,maxWidth,lineHeight){
  const words=text.split(/\s+/);let line='';
  for(const word of words){const next=line?line+' '+word:word;if(ctx.measureText(next).width>maxWidth&&line){ctx.fillText(line,x,y);y+=lineHeight;line=word}else line=next}
  ctx.fillText(line,x,y);return y;
}
export async function makeMatchFlyer(match,data,roundLabel,{now=Date.now(),canvas=document.createElement('canvas'),loadImage=browserImage}={}){
  if(!nextRoundMatches(data,now).some(m=>m.id===match.id))throw new Error('O panfleto está disponível apenas para a próxima rodada.');
  const teams=[data.teams?.[match.team1],data.teams?.[match.team2]];
  if(teams.some(t=>!t))throw new Error('Aguardando a definição das equipes.');
  const assets=await Promise.all([loadImage('images/match-background.png'),...[match.team1,match.team2].map(async(id,i)=>{
    const ext=teams[i].url?.includes('.png?')?'png':'jpg';
    try{return await loadImage(`images/teams/${encodeURIComponent(id)}.${ext}`)}catch{return loadImage(teams[i].url)}
  }),loadImage(VIW_LOGO)]);
  canvas.width=1080;canvas.height=1350;
  const ctx=canvas.getContext('2d'),lime='#c7ef60';
  ctx.drawImage(assets[0],0,0,1080,1350);
  ctx.textAlign='center';ctx.fillStyle='#fff';ctx.font='bold 30px Arial';ctx.fillText('LA LIGA VIW',540,76);
  ctx.fillStyle=lime;ctx.font='bold 66px Arial';ctx.fillText('PRÓXIMA RODADA',540,179);
  ctx.fillStyle='#c9d1df';ctx.font='30px Arial';ctx.fillText(roundLabel,540,235);
  contain(ctx,assets[3],45,30,115,115);
  for(let i=0;i<2;i++){
    const cx=i?804:276,img=assets[i+1],scale=Math.min(280/img.width,280/img.height);
    ctx.fillStyle='#fff';ctx.beginPath();ctx.roundRect(cx-165,298,330,330,26);ctx.fill();
    ctx.drawImage(img,cx-img.width*scale/2,463-img.height*scale/2,img.width*scale,img.height*scale);
    ctx.fillStyle='#fff';ctx.font='bold 41px Arial';textLines(ctx,teams[i].name.trim().toUpperCase(),cx,693,440,49);
  }
  ctx.fillStyle=lime;ctx.font='bold 64px Arial';ctx.fillText('×',540,481);
  ctx.fillStyle='#fff';ctx.font='bold 42px Arial';
  const date=new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',weekday:'long',day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date(match.d_i));
  ctx.fillText(date.toUpperCase(),540,841);
  const time=new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',hour:'2-digit',minute:'2-digit'}).format(new Date(match.d_i));
  ctx.fillStyle=lime;ctx.font='bold 96px Arial';ctx.fillText(time,540,947);
  ctx.fillStyle='#c9d1df';ctx.font='27px Arial';ctx.fillText('HORÁRIO DE BRASÍLIA'+(match.title?'  •  '+courtLabel(match.title).toUpperCase():''),540,993);
  ctx.fillStyle=lime;ctx.fillRect(462,1037,156,4);
  ctx.fillStyle='#fff';ctx.font='bold 46px Arial';ctx.fillText(VENUE.name.toUpperCase(),540,1113);
  ctx.font='29px Arial';ctx.fillText('Av. Cézar Magnani, N° 840 - Paulicéia',540,1166);
  ctx.fillText('São Bernardo do Campo - SP',540,1210);ctx.fillText('09694-000',540,1254);
  ctx.font='18px Arial';ctx.fillStyle='#bac8d9';ctx.fillText('Confira possíveis atualizações de horário no site da La Liga Viw.',540,1311);
  return canvas;
}

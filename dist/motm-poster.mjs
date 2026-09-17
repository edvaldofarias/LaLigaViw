import {browserImage,contain,fitText,VIW_LOGO} from './poster-assets.mjs';
import {courtLabel} from './schedule.mjs';
export async function makeMotmPoster(match,data,award,{canvas=document.createElement('canvas'),loadImage=browserImage}={}){
  if(!award||award.matchId!==match.id||!(Number(match.st)===3||match.finished))throw new Error('O prêmio desta partida ainda não foi informado.');
  const p=data.player?.[award.playerId],teams=[data.teams?.[match.team1],data.teams?.[match.team2]];
  if(!p?.url)throw new Error('A foto original do jogador ainda não está disponível.');
  const [background,logo,photo,...crests]=await Promise.all([
    loadImage('images/match-background.png'),loadImage(VIW_LOGO),
    loadImage(`images/players/${award.playerId}.${p.url.includes('.png?')?'png':'jpg'}`).catch(()=>loadImage(p.url)),
    ...[match.team1,match.team2].map((id,i)=>loadImage(`images/teams/${id}.${teams[i]?.url?.includes('.png?')?'png':'jpg'}`).catch(()=>loadImage(teams[i]?.url)))
  ]);
  canvas.width=1080;canvas.height=1350;const ctx=canvas.getContext('2d'),cyan='#2bc5ef';
  ctx.drawImage(background,0,0,1080,1350);
  ctx.fillStyle='rgba(8,18,30,.48)';ctx.fillRect(0,0,1080,1350);
  contain(ctx,logo,58,38,125,125);
  ctx.textAlign='left';fitText(ctx,'LA LIGA VIW',215,92,790,34);fitText(ctx,`RODADA ${award.round} · CRAQUE DO JOGO`,215,134,790,24,cyan);
  ctx.textAlign='center';fitText(ctx,'MAN OF THE MATCH',540,235,970,76);
  // Preserve the entire original photograph, with no retouching or cropping.
  ctx.fillStyle='#ffffff';ctx.fillRect(287,274,506,530);contain(ctx,photo,300,287,480,504);
  ctx.fillStyle=cyan;ctx.fillRect(287,800,506,5);
  fitText(ctx,(p.name||award.name).trim().toUpperCase(),540,890,960,68);
  fitText(ctx,(data.teams?.[award.teamId]?.name||'').trim().toUpperCase(),540,938,900,29,cyan);
  ctx.fillStyle='rgba(255,255,255,.08)';ctx.beginPath();ctx.roundRect(58,982,964,220,20);ctx.fill();
  contain(ctx,crests[0],146,1005,85,85);contain(ctx,crests[1],849,1005,85,85);
  const score=[match.dt?.qt_g1,match.dt?.qt_g2].every(Number.isFinite)?`${match.dt.qt_g1} : ${match.dt.qt_g2}`:'PLACAR NÃO INFORMADO';
  fitText(ctx,score,540,1075,410,72);
  fitText(ctx,(teams[0]?.name||'Equipe').trim().toUpperCase(),284,1150,425,28);
  fitText(ctx,(teams[1]?.name||'Equipe').trim().toUpperCase(),796,1150,425,28);
  const date=match.d_i?new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(match.d_i)):'Data não informada';
  fitText(ctx,`${date} · BRASÍLIA${match.title?' · '+courtLabel(match.title):''}`,540,1242,970,23,'#d1dae5','normal');
  fitText(ctx,'PRO BEACH · ORGANIZAÇÃO VIW FUNCIONAL SOCCER',540,1293,970,21,cyan);
  return canvas;
}

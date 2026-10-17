import {isLiveMatch,liveScore} from './live-match.mjs';
let current=null,updated=0,failed=false;const listeners=new Set();
export function updateLiveData(data){current=data;updated=Date.now();failed=false;listeners.forEach(fn=>fn());}
export function markLiveUnavailable(){failed=true;listeners.forEach(fn=>fn());}
export function mountScoreboard(stage,court){
 const box=document.createElement('div');box.className='live-scoreboard';box.setAttribute('aria-live','polite');stage.append(box);let previousId=null;
 const refresh=()=>{box.replaceChildren();const candidates=Object.entries(current?.matchs||{}).filter(([,m])=>Number(String(m.title||'').match(/(?:Q|Quadra\s*)([12])/i)?.[1])===court);const active=candidates.find(([,m])=>isLiveMatch(m))||candidates.find(([id])=>id===previousId);
  const label=document.createElement('small');label.textContent=failed?'Sem atualização · último placar recebido':active?(isLiveMatch(active[1])?'AO VIVO · Copa Fácil':'ENCERRADO · Copa Fácil'):'Aguardando partida iniciada no Copa Fácil';box.append(label);
  if(!active)return;const [id,m]=active;previousId=id;const score=liveScore(m)||[m.dt?.qt_g1,m.dt?.qt_g2];const line=document.createElement('div');line.className='live-score-line';
  for(let i=0;i<2;i++){const t=current.teams?.[i?m.team2:m.team1];const name=document.createElement('span');name.textContent=t?.name?.trim()||'Equipe';if(i===1){const goals=document.createElement('b');goals.textContent=score.every(Number.isInteger)?`${score[0]} × ${score[1]}`:'Placar pendente';line.append(goals);}line.append(name);}box.append(line);
  const stamp=document.createElement('small');stamp.textContent='Atualizado '+new Date(updated).toLocaleTimeString('pt-BR',{timeZone:'America/Sao_Paulo',hour:'2-digit',minute:'2-digit',second:'2-digit'});box.append(stamp);
 };listeners.add(refresh);refresh();return ()=>{listeners.delete(refresh);box.remove();};
}

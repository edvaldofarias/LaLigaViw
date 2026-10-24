export function isSuspendedForMatch(player,match,matches){
 const suspendedAt=Number(player?.SUSP);
 if(!Number(player?.SUSP2)||!Number.isFinite(suspendedAt)||!Number.isFinite(match?.d_i)||match.d_i<=suspendedAt)return false;
 const next=[...Object.values(matches||{})]
  .filter(m=>Number.isFinite(m?.d_i)&&m.d_i>suspendedAt&&(m.team1===player.team||m.team2===player.team))
  .sort((a,b)=>a.d_i-b.d_i)[0];
 return !!next&&next.d_i===match.d_i&&next.team1===match.team1&&next.team2===match.team2;
}

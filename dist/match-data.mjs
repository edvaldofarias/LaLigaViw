// Copa Fácil omits a zero-valued goal field in some completed match records.
// Only fill one absent side when the other side explicitly contains a valid score.
// An entirely absent score, null/invalid values, or scheduled match stay unknown.
export function normalizeMatch(match){
  if(!match||!(Number(match.st)===3||match.finished)||!match.dt||typeof match.dt!=='object')return match;
  const valid=n=>Number.isInteger(n)&&n>=0;
  const dt={...match.dt};let changed=false;
  for(const [side,other] of [['qt_g1','qt_g2'],['qt_g2','qt_g1']]){
    if(!Object.hasOwn(dt,side)&&valid(match.dt[other])){dt[side]=0;changed=true;}
  }
  return changed?{...match,dt}:match;
}
export function normalizeCompetition(data){return {...data,matchs:Object.fromEntries(Object.entries(data.matchs||{}).map(([id,m])=>[id,normalizeMatch(m)]))};}

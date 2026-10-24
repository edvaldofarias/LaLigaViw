// Shared deterministic model. A new edition incorporates only fully completed rounds.
export const MODEL_VERSION = 'poisson-shrinkage-v1';
export const TRIALS = 20000;
const DAY = 86400000;
const PRIOR_MATCHES = 4;
const TEAM_WINDOW = 8;
const finished = m => Number(m.st) === 3 || Boolean(m.finished);
const validScore = m => [m.dt?.qt_g1, m.dt?.qt_g2].every(x => Number.isInteger(x) && x >= 0 && x <= 100);


function hash(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

function random(seed) {
  return () => {
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function poissonCDF(mean) {
  let probability = Math.exp(-mean), sum = probability;
  const cdf = [sum];
  for (let k = 1; sum < 1 - 1e-13 && k < 150; k++) {
    probability *= mean / k;
    sum += probability;
    cdf.push(sum);
  }
  cdf[cdf.length - 1] = 1;
  return cdf;
}

function sample(cdf, u) {
  let k = 0;
  while (k < cdf.length - 1 && u > cdf[k]) k++;
  return k;
}

export function simulate(homeMean, awayMean, seed, trials = TRIALS) {
  if (![homeMean, awayMean].every(x => Number.isFinite(x) && x >= 0 && x <= 30)) throw new Error('Invalid goal mean');
  if (!Number.isInteger(trials) || trials < 2 || trials % 2) throw new Error('Simulation count must be positive and even');
  const rng = random(hash(String(seed))), h = poissonCDF(homeMean), a = poissonCDF(awayMean);
  const outcomes = [0, 0, 0], scores = new Map();
  const record = (x, y) => {
    outcomes[x > y ? 0 : x === y ? 1 : 2]++;
    const key = `${x}-${y}`;
    scores.set(key, (scores.get(key) || 0) + 1);
  };
  for (let i = 0; i < trials; i += 2) {
    const u = rng(), v = rng();
    record(sample(h, u), sample(a, v));
    record(sample(h, v), sample(a, u));
  }
  const probabilities = outcomes.map(n => n / trials);
  const topScores = [...scores.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 3)
    .map(([score, count]) => ({ score, probability: count / trials }));
  return { probabilities, odds: probabilities.map(p => p > 0 ? 1 / p : null), topScores, trials };
}

export function forecastContext(data, now = Date.now()) {
  const all = Object.entries(data.matchs || {}).map(([id, m]) => ({ ...m, id }))
    .sort((a, b) => (a.d_i || Infinity) - (b.d_i || Infinity) || a.id.localeCompare(b.id));
  const groups = new Map();
  for (const m of all) {
    const key = `${m.fs || ''}:${m.m_set || (Number.isFinite(m.d_i) ? Math.floor((m.d_i - 10800000) / DAY) : m.id)}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(m);
  }
  const completedRounds = [...groups.entries()].filter(([, games]) => games.every(m =>
    finished(m) && validScore(m) && m.team1 && m.team2 && m.team1 !== m.team2 &&
    Number.isFinite(m.d_i) && m.d_i <= now && (!Number.isFinite(m.finished) || m.finished <= now)));
  const ids = new Set(completedRounds.flatMap(([, games]) => games.map(m => m.id)));
  const history = all.filter(m => ids.has(m.id));
  const fingerprint = hash(history.map(m => `${m.id}:${m.team1}:${m.team2}:${m.dt.qt_g1}:${m.dt.qt_g2}`).join('|')).toString(16);
  const cutoff = history.length ? Math.max(...history.map(m => Number.isFinite(m.finished) ? Math.max(m.d_i,m.finished) : m.d_i)) : null;
  return { all, history, fingerprint, cutoff, completedRounds: completedRounds.map(([key, games]) => ({key, phaseId:games[0].fs, roundId:games[0].m_set})) };
}

function goalModel(history) {
  const average = history.length ? history.reduce((n, m) => n + m.dt.qt_g1 + m.dt.qt_g2, 0) / (history.length * 2) : null;
  const strengths = new Map();
  const strength = id => {
    if (strengths.has(id)) return strengths.get(id);
    const games = history.filter(m => m.team1 === id || m.team2 === id).slice(-TEAM_WINDOW);
    const gf = games.reduce((n, m) => n + (m.team1 === id ? m.dt.qt_g1 : m.dt.qt_g2), 0);
    const ga = games.reduce((n, m) => n + (m.team1 === id ? m.dt.qt_g2 : m.dt.qt_g1), 0);
    const base = Math.max(average, 0.1);
    const value = { games: games.length, attack: (gf + PRIOR_MATCHES * base) / (games.length + PRIOR_MATCHES),
      defense: (ga + PRIOR_MATCHES * base) / (games.length + PRIOR_MATCHES) };
    strengths.set(id,value);return value;
  };
  return { average, means(m) {
    const h = strength(m.team1), a = strength(m.team2), base = Math.max(average, 0.1);
    return { expectedGoals: [Math.max(0.05, Math.min(15, h.attack * a.defense / base)), Math.max(0.05, Math.min(15, a.attack * h.defense / base))], teamGames: [h.games,a.games] };
  }};
}

let seasonCache;
export function projectQualification(data, context = forecastContext(data)) {
  const {all,history} = context;
  const phaseId = all.find(m=>m.fs)?.fs;
  const games = all.filter(m=>m.fs===phaseId);
  const teamIds = Object.keys(data.teams||{}).filter(id=>data.teams[id].dt?.[phaseId] || games.some(m=>m.team1===id||m.team2===id)).sort();
  const base = {phaseId, trials:TRIALS, teamCount:teamIds.length, scheduledGames:games.length};
  if (!phaseId || teamIds.length<8 || !games.length || games.some(m=>!teamIds.includes(m.team1)||!teamIds.includes(m.team2)||m.team1===m.team2))
    return {...base,status:'incomplete_schedule',teams:[]};
  const past = history.filter(m=>m.fs===phaseId), pastIds = new Set(past.map(m=>m.id));
  const remaining = games.filter(m=>!pastIds.has(m.id));
  if (!past.length) return {...base,status:'insufficient_history',teams:[]};
  const officialRanks = teamIds.map(id=>data.teams[id].dt?.[phaseId]?.col);
  const key = JSON.stringify([past.map(m=>[m.id,m.team1,m.team2,m.dt]),games.map(m=>[m.id,m.team1,m.team2]),teamIds,remaining.length===0?officialRanks:null]);
  if(seasonCache?.key===key)return {...seasonCache.value,partialRoundResults:games.filter(m=>finished(m)&&!pastIds.has(m.id)).length};
  const model = goalModel(past),index = new Map(teamIds.map((id,i)=>[id,i]));
  const initial = teamIds.map(id=>({id,points:0,wins:0,gf:0,ga:0,played:0}));
  const apply = (rows,m,h,a) => {
    const x=rows[index.get(m.team1)],y=rows[index.get(m.team2)];
    x.played++;y.played++;x.gf+=h;x.ga+=a;y.gf+=a;y.ga+=h;
    if(h>a){x.points+=3;x.wins++}else if(h<a){y.points+=3;y.wins++}else{x.points++;y.points++}
  };
  for(const m of past)apply(initial,m,m.dt.qt_g1,m.dt.qt_g2);
  const distributions = remaining.map(m=>({m,cdf:model.means(m).expectedGoals.map(poissonCDF)}));
  const counts = teamIds.map(()=>({top4:0,top8:0})),cuts4=[],cuts8=[];
  const officialFinal = remaining.length===0 && officialRanks.every(Number.isInteger) && new Set(officialRanks).size===teamIds.length && Math.min(...officialRanks)===0 && Math.max(...officialRanks)===teamIds.length-1;
  const rng=random(hash(`qualification-v1:${key}`));
  for(let n=0;n<TRIALS;n++){
    const rows=initial.map(row=>({...row,tie:rng()}));
    for(const {m,cdf} of distributions)apply(rows,m,sample(cdf[0],rng()),sample(cdf[1],rng()));
    rows.sort(officialFinal ? (a,b)=>officialRanks[index.get(a.id)]-officialRanks[index.get(b.id)] :
      (a,b)=>b.points-a.points||b.wins-a.wins||(b.gf-b.ga)-(a.gf-a.ga)||b.gf-a.gf||a.tie-b.tie);
    for(let i=0;i<8;i++){const c=counts[index.get(rows[i].id)];c.top8++;if(i<4)c.top4++}
    cuts4.push(rows[3].points);cuts8.push(rows[7].points);
  }
  const summarize = values => {values.sort((a,b)=>a-b);const q=p=>values[Math.floor((values.length-1)*p)];return {median:q(.5),low:q(.1),high:q(.9)};};
  const value = {...base,status:'ready',historyCount:past.length,remainingGames:remaining.length,
    completedRounds:context.completedRounds.filter(r=>r.phaseId===phaseId).length,
    partialRoundResults:games.filter(m=>finished(m)&&!pastIds.has(m.id)).length,
    officialFinal,cutoffs:{top4:summarize(cuts4),top8:summarize(cuts8)},
    teams:initial.map((row,i)=>({...row,top4:counts[i].top4/TRIALS,top8:counts[i].top8/TRIALS,totalGames:games.filter(m=>m.team1===row.id||m.team2===row.id).length}))};
  seasonCache={key,value};return value;
}

export function buildForecast(data, now = Date.now()) {
  const context=forecastContext(data,now),{all,history,fingerprint,cutoff}=context;
  const first = all.find(m => !finished(m) && Number.isFinite(m.d_i) && m.d_i > now);
  const upcoming = first ? all.filter(m => !finished(m) && m.d_i > now && m.fs === first.fs
    && (first.m_set ? m.m_set === first.m_set : Math.floor((m.d_i - 10800000) / DAY) === Math.floor((first.d_i - 10800000) / DAY))) : [];
  const model=goalModel(history);
  const predictions = upcoming.map(m => {
    const identity = { matchId: m.id, team1: m.team1 || null, team2: m.team2 || null, startsAt: m.d_i };
    if (!m.team1 || !m.team2 || !data.teams?.[m.team1] || !data.teams?.[m.team2] || m.team1 === m.team2)
      return { ...identity, status: 'awaiting_teams' };
    if (!history.length) return { ...identity, status: 'insufficient_history' };
    const {expectedGoals,teamGames}=model.means(m);
    const simulation = simulate(...expectedGoals, `${MODEL_VERSION}:${fingerprint}:${m.id}`);
    return { ...identity, status: 'ready', ...simulation, expectedGoals,teamGames,
      limitedHistory: history.length < 30 || Math.min(...teamGames) < 5 };
  });
  return { modelVersion: MODEL_VERSION, updatePolicy:'completed-round',cutoff,completedRounds:context.completedRounds,
    historyCount: history.length,historyFingerprint: fingerprint, leagueGoalsPerTeam: model.average, trials: TRIALS,
    priorMatches: PRIOR_MATCHES, teamWindow: TEAM_WINDOW, roundId: first?.m_set || null,
    phaseId: first?.fs || null, predictions,qualification:projectQualification(data,context) };
}

// Conditional view for the last league round; the official completed-round model stays unchanged.
const matchScenarioCache = new Map();
export function matchQualificationScenarios(data, matchId) {
  const context=forecastContext(data), target=context.all.find(m=>m.id===matchId);
  const phase=context.all.find(m=>m.fs)?.fs;
  const rounds=[...new Set(context.all.filter(m=>m.fs===phase).map(m=>m.m_set))];
  if(!target||target.fs!==phase||rounds.indexOf(target.m_set)!==6)return null;
  const games=context.all.filter(m=>m.fs===phase),ids=Object.keys(data.teams||{}).sort();
  if(ids.length<8||games.some(m=>!ids.includes(m.team1)||!ids.includes(m.team2)))return null;
  const history=context.history.filter(m=>m.fs===phase);
  if(!history.length)return null;
  const key=JSON.stringify([matchId,games.map(m=>[m.id,m.st,m.finished,m.dt?.qt_g1,m.dt?.qt_g2])]);
  if(matchScenarioCache.has(key))return matchScenarioCache.get(key);
  const model=goalModel(history),index=new Map(ids.map((id,i)=>[id,i]));
  const fixed=games.filter(m=>m.id!==matchId&&finished(m)&&validScore(m));
  const pending=games.filter(m=>m.id!==matchId&&!fixed.includes(m));
  const distributions=pending.map(m=>({m,cdf:model.means(m).expectedGoals.map(poissonCDF)}));
  const targetCDF=model.means(target).expectedGoals.map(poissonCDF);
  const apply=(rows,m,h,a)=>{const x=rows[index.get(m.team1)],y=rows[index.get(m.team2)];x.gf+=h;x.ga+=a;y.gf+=a;y.ga+=h;if(h>a){x.points+=3;x.wins++}else if(h<a){y.points+=3;y.wins++}else{x.points++;y.points++}};
  const initial=ids.map(id=>({id,points:0,wins:0,gf:0,ga:0}));
  fixed.forEach(m=>apply(initial,m,m.dt.qt_g1,m.dt.qt_g2));
  const rng=random(hash(key));
  const outcomes=finished(target)&&validScore(target)?[Math.sign(target.dt.qt_g1-target.dt.qt_g2)]:[1,0,-1];
  const teams=[target.team1,target.team2].map(id=>({id,scenarios:[]}));
  for(const outcome of outcomes){
    const counts=teams.map(()=>({top4:0,top8:0,help:distributions.map(()=>Array.from({length:3},()=>({n:0,g4:0,g8:0})))}));
    // Exact conditional score distribution, including margin-dependent tie breakers.
    const scores=[];let mass=0;
    for(let h=0;h<targetCDF[0].length;h++)for(let a=0;a<targetCDF[1].length;a++)if(Math.sign(h-a)===outcome){mass+=(targetCDF[0][h]-(targetCDF[0][h-1]||0))*(targetCDF[1][a]-(targetCDF[1][a-1]||0));scores.push({h,a,cdf:mass});}
    for(let n=0;n<TRIALS;n++){
      const rows=initial.map(r=>({...r,tie:rng()})),results=[];
      for(const {m,cdf} of distributions){const h=sample(cdf[0],rng()),a=sample(cdf[1],rng());apply(rows,m,h,a);results.push(1-Math.sign(h-a));}
      let h,a;
      if(finished(target)&&validScore(target)){h=target.dt.qt_g1;a=target.dt.qt_g2}else{const u=rng()*mass;let lo=0,hi=scores.length-1;while(lo<hi){const mid=(lo+hi)>>1;if(scores[mid].cdf<u)lo=mid+1;else hi=mid;}({h,a}=scores[lo]);}
      apply(rows,target,h,a);
      rows.sort((a,b)=>b.points-a.points||b.wins-a.wins||(b.gf-b.ga)-(a.gf-a.ga)||b.gf-a.gf||a.tie-b.tie);
      teams.forEach((team,i)=>{const rank=rows.findIndex(r=>r.id===team.id),c=counts[i];if(rank<4)c.top4++;if(rank<8)c.top8++;results.forEach((r,j)=>{const v=c.help[j][r];v.n++;if(rank<4)v.g4++;if(rank<8)v.g8++;});});
    }
    teams.forEach((team,i)=>{
      const c=counts[i],favorable=field=>c.help.flatMap((b,j)=>{const candidates=b.map((v,k)=>({k,n:v.n,p:v.n?v[field]/v.n:0})).filter(v=>v.n>=100);const best=candidates.sort((a,b)=>b.p-a.p)[0],base=c[field==='g4'?'top4':'top8']/TRIALS;return best&&best.p>base+.02?[{matchId:distributions[j].m.id,home:distributions[j].m.team1,away:distributions[j].m.team2,outcome:1-best.k,chance:best.p}]:[];});
      team.scenarios.push({outcome:(i?-outcome:outcome)||0,top4:c.top4/TRIALS,top8:c.top8/TRIALS,favorable4:favorable('g4'),favorable8:favorable('g8')});
    });
  }
  teams.forEach(t=>t.scenarios.sort((a,b)=>b.outcome-a.outcome));
  const value={teams,trials:TRIALS,remaining:pending.length,final:finished(target)&&validScore(target),live:games.some(m=>!finished(m)&&Number(m.st)===1)};
  if(matchScenarioCache.size>20)matchScenarioCache.clear();matchScenarioCache.set(key,value);return value;
}

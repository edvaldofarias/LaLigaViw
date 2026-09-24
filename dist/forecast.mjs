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

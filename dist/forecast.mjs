// The same deterministic model runs in the page and in the weekly refresh.
export const MODEL_VERSION = 'poisson-shrinkage-v1';
export const TRIALS = 20000;
const DAY = 86400000;
const PRIOR_MATCHES = 4;
const TEAM_WINDOW = 8;
const finished = m => Number(m.st) === 3 || Boolean(m.finished);
const validScore = m => [m.dt?.qt_g1, m.dt?.qt_g2].every(x => Number.isInteger(x) && x >= 0 && x <= 100);

// Current competition dates use Brasília UTC-3. The weekly edition changes on
// Monday at 09:00 Brasília (12:00 UTC), not at the viewer's local midnight.
export function weekCutoff(now = Date.now()) {
  const local = new Date(now - 3 * 3600000);
  const monday = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate())
    - ((local.getUTCDay() + 6) % 7) * DAY + 12 * 3600000;
  return now < monday ? monday - 7 * DAY : monday;
}

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

export function buildWeeklyForecast(data, now = Date.now()) {
  const cutoff = weekCutoff(now);
  const all = Object.entries(data.matchs || {}).map(([id, m]) => ({ ...m, id }))
    .sort((a, b) => (a.d_i || Infinity) - (b.d_i || Infinity) || a.id.localeCompare(b.id));
  const history = all.filter(m => finished(m) && validScore(m) && m.team1 && m.team2 && m.team1 !== m.team2
    && Number.isFinite(m.d_i) && m.d_i < cutoff
    && (!Number.isFinite(m.finished) || m.finished < cutoff));
  const first = all.find(m => !finished(m) && Number.isFinite(m.d_i) && m.d_i > now);
  const upcoming = first ? all.filter(m => !finished(m) && m.d_i > now && m.fs === first.fs
    && (first.m_set ? m.m_set === first.m_set : Math.floor((m.d_i - 10800000) / DAY) === Math.floor((first.d_i - 10800000) / DAY))) : [];
  const fingerprint = hash(history.map(m => `${m.id}:${m.team1}:${m.team2}:${m.dt.qt_g1}:${m.dt.qt_g2}`).join('|')).toString(16);
  const average = history.length ? history.reduce((n, m) => n + m.dt.qt_g1 + m.dt.qt_g2, 0) / (history.length * 2) : null;
  const strength = id => {
    const games = history.filter(m => m.team1 === id || m.team2 === id).slice(-TEAM_WINDOW);
    const gf = games.reduce((n, m) => n + (m.team1 === id ? m.dt.qt_g1 : m.dt.qt_g2), 0);
    const ga = games.reduce((n, m) => n + (m.team1 === id ? m.dt.qt_g2 : m.dt.qt_g1), 0);
    const base = Math.max(average, 0.1);
    return { games: games.length, attack: (gf + PRIOR_MATCHES * base) / (games.length + PRIOR_MATCHES),
      defense: (ga + PRIOR_MATCHES * base) / (games.length + PRIOR_MATCHES) };
  };
  const predictions = upcoming.map(m => {
    const identity = { matchId: m.id, team1: m.team1 || null, team2: m.team2 || null, startsAt: m.d_i };
    if (!m.team1 || !m.team2 || !data.teams?.[m.team1] || !data.teams?.[m.team2] || m.team1 === m.team2)
      return { ...identity, status: 'awaiting_teams' };
    if (!history.length) return { ...identity, status: 'insufficient_history' };
    const h = strength(m.team1), a = strength(m.team2), base = Math.max(average, 0.1);
    const homeMean = Math.max(0.05, Math.min(15, h.attack * a.defense / base));
    const awayMean = Math.max(0.05, Math.min(15, a.attack * h.defense / base));
    const simulation = simulate(homeMean, awayMean, `${MODEL_VERSION}:${cutoff}:${fingerprint}:${m.id}`);
    return { ...identity, status: 'ready', ...simulation, expectedGoals: [homeMean, awayMean],
      teamGames: [h.games, a.games], limitedHistory: history.length < 30 || Math.min(h.games, a.games) < 5 };
  });
  return { modelVersion: MODEL_VERSION, cutoff, nextUpdate: cutoff + 7 * DAY, historyCount: history.length,
    historyFingerprint: fingerprint, leagueGoalsPerTeam: average, trials: TRIALS,
    priorMatches: PRIOR_MATCHES, teamWindow: TEAM_WINDOW, roundId: first?.m_set || null,
    phaseId: first?.fs || null, predictions };
}

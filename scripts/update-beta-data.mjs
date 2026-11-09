// Atualiza os dados da aba Teste (beta) a cada rodada encerrada.
// Rode DEPOIS de `node scripts/update-forecast.mjs` (que atualiza dist/data.json).
//
// Regenera, a partir das súmulas oficiais do Copa Fácil:
//   - as 12 campanhas -ciddy em src/app/core/historical-team-statistics-data.ts
//     (estatísticas, duplas, cartões e os cinco rankings cruzados);
//   - as artilharias e os cartões por edição da LaLiga VIW 2026 (top 10);
//   - as campanhas em andamento e os totais das wikis do Edvaldo, Yurick e Andrews.
//
// Regras de desempate reproduzidas do arquivo histórico original:
//   ranking: pontos, vitórias, saldo, gols pró (todos decrescentes)
//   attackRank: gols pró, saldo, nome
//   defenseRank: gols contra por jogo, gols contra, nome
//   duoRank: gols da dupla, gols do 1º da dupla, gols do 2º, nome
//   cardRank: cartões, vermelhos, amarelos, nome (mais carteado primeiro)
import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const EVENT_KEY = '-ciddy';
const CHAMPIONSHIP = 'LALIGA VIW 2026 🇪🇸';
const WIKIS = [
  { file: 'src/app/core/wiki-data.ts', playerId: '1789172821599', label: 'Edvaldo', style: 'position' },
  { file: 'src/app/core/yurick-wiki-data.ts', playerId: '1789257892581', label: 'Yurick', style: 'position' },
  { file: 'src/app/core/andrews-wiki-data.ts', playerId: '1789257897307', label: 'Andrews', style: 'finish' },
];

const norm = (s) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toUpperCase();
const byName = (a, b) => norm(a).localeCompare(norm(b));

function parseConstArray(src, name) {
  const start = src.indexOf(`export const ${name}`);
  if (start < 0) throw new Error(`${name} não encontrado`);
  const equals = src.indexOf('=', start);
  const open = src.indexOf('[', equals);
  let depth = 0, inString = false, quote = '', escape = false;
  for (let i = open; i < src.length; i++) {
    const c = src[i];
    if (inString) {
      if (escape) escape = false;
      else if (c === '\\') escape = true;
      else if (c === quote) inString = false;
      continue;
    }
    if (c === '"' || c === "'") { inString = true; quote = c; continue; }
    if (c === '[') depth++;
    if (c === ']' && --depth === 0) {
      return { start, open, end: i + 1, value: eval(src.slice(open, i + 1)) };
    }
  }
  throw new Error(`Array ${name} não fechado`);
}

const data = JSON.parse(await readFile(new URL('dist/data.json', root), 'utf8'));
const teamName = (id) => data.teams[id]?.name?.trim().toUpperCase() ?? id;
const finished = Object.entries(data.matchs || {})
  .filter(([, m]) => (Number(m.st) === 3 || m.finished) && Number.isInteger(m.dt?.qt_g1) && Number.isInteger(m.dt?.qt_g2) && m.team1 !== m.team2)
  .sort((a, b) => (a[1].d_i || 0) - (b[1].d_i || 0));

// Estatísticas coletivas por equipe e eventos individuais das súmulas.
const teams = new Map();
const playerEvents = new Map();
for (const [mid, match] of finished) {
  for (const [tid, gf, ga] of [[match.team1, match.dt.qt_g1, match.dt.qt_g2], [match.team2, match.dt.qt_g2, match.dt.qt_g1]]) {
    const t = teams.get(tid) || { m: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0, cleanSheets: 0, failedToScore: 0, bigWin: 0, bigLoss: 0, streak: 0, maxStreak: 0, yellow: 0, red: 0, blue: 0, scorers: new Map() };
    t.m++; t.gf += gf; t.ga += ga;
    if (ga === 0) t.cleanSheets++;
    if (gf === 0) t.failedToScore++;
    if (gf > ga) { t.w++; t.pts += 3; t.bigWin = Math.max(t.bigWin, gf - ga); t.streak++; t.maxStreak = Math.max(t.maxStreak, t.streak); }
    else if (gf < ga) { t.l++; t.bigLoss = Math.max(t.bigLoss, ga - gf); t.streak = 0; }
    else { t.d++; t.pts++; t.streak++; t.maxStreak = Math.max(t.maxStreak, t.streak); }
    teams.set(tid, t);
  }
  for (const ev of Object.values(data.matchDetails?.[mid]?.data?.list || {})) {
    const t = teams.get(ev.team1);
    const ac = Number(ev.ac);
    const pid = ev.pl_id1 && String(ev.pl_id1);
    if (pid) {
      const p = playerEvents.get(pid) || { goals: 0, yellow: 0, red: 0, blue: 0, ownGoals: 0 };
      if (ac === 1) p.goals++;
      if (ac === 3) p.yellow++;
      if (ac === 4) p.red++;
      if (ac === 5) p.blue++;
      if (ac === 8) p.ownGoals++;
      playerEvents.set(pid, p);
    }
    if (!t) continue;
    if (ac === 1 && pid) {
      const name = (data.player?.[pid]?.name || '?').trim().toUpperCase();
      t.scorers.set(name, (t.scorers.get(name) || 0) + 1);
    }
    if (ac === 3) t.yellow++;
    if (ac === 4) t.red++;
    if (ac === 5) t.blue++;
  }
}

// Classificação oficial: pontos, vitórias, saldo, gols pró (mesma regra da evolução).
const standings = [...teams.entries()].sort((a, b) =>
  b[1].pts - a[1].pts || b[1].w - a[1].w || (b[1].gf - b[1].ga) - (a[1].gf - a[1].ga) || b[1].gf - a[1].gf || a[0].localeCompare(b[0]));
const positionOf = new Map(standings.map(([tid], i) => [tid, i + 1]));

// ---- historical-team-statistics-data.ts ----
const histFile = new URL('src/app/core/historical-team-statistics-data.ts', root);
const histSrc = await readFile(histFile, 'utf8');
const stats = parseConstArray(histSrc, 'HISTORICAL_TEAM_STATISTICS');
const discipline = parseConstArray(histSrc, 'HISTORICAL_DISCIPLINE_EDITIONS');
const scoring = parseConstArray(histSrc, 'HISTORICAL_SCORING_EDITIONS');
const rows = stats.value;
if (!rows.length || !discipline.value.length || !scoring.value.length) {
  throw new Error('Falha ao interpretar os arrays históricos; arquivo não foi alterado.');
}

const editionTeamId = new Map(rows.filter((r) => r.eventKey === EVENT_KEY).map((r) => [r.team, r.editionTeamId]));
for (const row of rows) {
  if (row.eventKey !== EVENT_KEY) continue;
  const tid = [...teams.keys()].find((id) => teamName(id) === row.team);
  const t = tid && teams.get(tid);
  if (!t) throw new Error(`Equipe sem partidas: ${row.team}`);
  const duo = [...t.scorers.entries()].sort((a, b) => b[1] - a[1] || byName(a[0], b[0])).slice(0, 2)
    .map(([name, goals]) => ({ name, goals }));
  Object.assign(row, {
    matches: t.m, wins: t.w, draws: t.d, losses: t.l,
    goalsFor: t.gf, goalsAgainst: t.ga, goalDifference: t.gf - t.ga, points: t.pts,
    duo, duoGoals: duo.reduce((n, p) => n + p.goals, 0),
    unbeatenStreak: t.maxStreak, cleanSheets: t.cleanSheets, failedToScore: t.failedToScore,
    biggestWinMargin: t.bigWin, biggestLossMargin: t.bigLoss,
    yellowCards: t.yellow, redCards: t.red, blueCards: t.blue, totalCards: t.yellow + t.red + t.blue,
  });
}
[...rows].sort((a, b) => b.points - a.points || b.wins - a.wins || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor)
  .forEach((r, i) => { r.ranking = i + 1; });
[...rows].sort((a, b) => b.goalsFor - a.goalsFor || b.goalDifference - a.goalDifference || byName(a.team, b.team))
  .forEach((r, i) => { r.attackRank = i + 1; });
[...rows].sort((a, b) => a.goalsAgainst / a.matches - b.goalsAgainst / b.matches || a.goalsAgainst - b.goalsAgainst || byName(a.team, b.team))
  .forEach((r, i) => { r.defenseRank = i + 1; });
[...rows].sort((a, b) => b.duoGoals - a.duoGoals || b.duo[0].goals - a.duo[0].goals || b.duo[1].goals - a.duo[1].goals || byName(a.team, b.team))
  .forEach((r, i) => { r.duoRank = i + 1; });
[...rows].sort((a, b) => b.totalCards - a.totalCards || b.redCards - a.redCards || b.yellowCards - a.yellowCards || byName(a.team, b.team))
  .forEach((r, i) => { r.cardRank = i + 1; });
// A página renderiza na ordem do array: mantenha-o alinhado ao ranking.
rows.sort((a, b) => a.ranking - b.ranking);

const scoringLeaders = [...playerEvents.entries()]
  .map(([pid, p]) => ({ pid, name: (data.player?.[pid]?.name || '?').trim().toUpperCase(), team: teamName(data.player?.[pid]?.team), goals: p.goals }))
  .filter((p) => p.goals > 0)
  .sort((a, b) => b.goals - a.goals || byName(a.name, b.name))
  .slice(0, 10)
  .map((p, i) => ({ position: i + 1, name: p.name, team: p.team, editionTeamId: editionTeamId.get(p.team), goals: p.goals }));
const disciplineLeaders = [...playerEvents.entries()]
  .map(([pid, p]) => ({ pid, name: (data.player?.[pid]?.name || '?').trim().toUpperCase(), team: teamName(data.player?.[pid]?.team), yellowCards: p.yellow, redCards: p.red, blueCards: p.blue, totalCards: p.yellow + p.red + p.blue }))
  .filter((p) => p.totalCards > 0)
  .sort((a, b) => b.totalCards - a.totalCards || b.redCards - a.redCards || b.yellowCards - a.yellowCards || byName(a.name, b.name))
  .slice(0, 10)
  .map((p, i) => ({ position: i + 1, name: p.name, team: p.team, editionTeamId: editionTeamId.get(p.team), yellowCards: p.yellowCards, redCards: p.redCards, blueCards: p.blueCards, totalCards: p.totalCards }));
for (const edition of [...discipline.value, ...scoring.value]) {
  if (edition.eventKey !== EVENT_KEY) continue;
  edition.leaders = edition === discipline.value.find((e) => e.eventKey === EVENT_KEY) ? disciplineLeaders : scoringLeaders;
}

// Remonta o arquivo preservando os comentários e interfaces do cabeçalho.
let out = histSrc.slice(0, stats.start);
out += `export const HISTORICAL_TEAM_STATISTICS: HistoricalTeamStatistic[] = ${JSON.stringify(rows, null, 2)};\n\n`;
out += `export const HISTORICAL_DISCIPLINE_EDITIONS: HistoricalDisciplineEdition[] = ${JSON.stringify(discipline.value, null, 2)};\n\n`;
out += `export const HISTORICAL_SCORING_EDITIONS: HistoricalScoringEdition[] = ${JSON.stringify(scoring.value, null, 2)};\n`;
await writeFile(histFile, out);

// ---- Wikis ----
function playerCampaign(playerId) {
  const myTeam = data.player[playerId].team;
  const c = { m: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, goals: 0, yellow: 0, red: 0, blue: 0, ownGoals: 0, scoringMatches: 0, cleanSheets: 0, hatTricks: 0, braces: 0, opponents: new Set(), bigWin: null, bigLoss: null };
  for (const [mid, match] of finished) {
    let present = false, goalsInMatch = 0;
    for (const ev of Object.values(data.matchDetails?.[mid]?.data?.list || {})) {
      if (String(ev.pl_id1) !== playerId) continue;
      const ac = Number(ev.ac);
      if (ac === 7 && Number(ev.val1 ?? 0) === 0) present = true;
      if (ac === 1) { c.goals++; goalsInMatch++; }
      if (ac === 3) c.yellow++;
      if (ac === 4) c.red++;
      if (ac === 5) c.blue++;
      if (ac === 8) c.ownGoals++;
    }
    if (!present) continue;
    const home = match.team1 === myTeam;
    const gf = home ? match.dt.qt_g1 : match.dt.qt_g2, ga = home ? match.dt.qt_g2 : match.dt.qt_g1;
    c.m++; c.gf += gf; c.ga += ga;
    c.opponents.add(home ? match.team2 : match.team1);
    if (goalsInMatch > 0) c.scoringMatches++;
    if (goalsInMatch >= 3) c.hatTricks++;
    if (goalsInMatch === 2) c.braces++;
    if (ga === 0) c.cleanSheets++;
    if (gf > ga) { c.w++; if (!c.bigWin || gf - ga > c.bigWin.margin) c.bigWin = { margin: gf - ga, score: `${gf}–${ga}`, opponent: home ? match.team2 : match.team1 }; }
    else if (gf < ga) { c.l++; if (!c.bigLoss || ga - gf > c.bigLoss.margin) c.bigLoss = { margin: ga - gf, score: `${gf}–${ga}`, opponent: home ? match.team2 : match.team1 }; }
    else c.d++;
  }
  c.points = 3 * c.w + c.d;
  c.position = positionOf.get(myTeam);
  return c;
}

function replaceFields(block, values) {
  let result = block;
  for (const [key, value] of Object.entries(values)) {
    const re = new RegExp(`(${key}:\\s*)("(?:[^"\\\\]|\\\\.)*"|\\d+)`);
    if (!re.test(result)) throw new Error(`Campo ${key} não encontrado no bloco`);
    result = result.replace(re, `$1${typeof value === 'string' ? JSON.stringify(value) : value}`);
  }
  return result;
}

const wikiNotes = [];
for (const wiki of WIKIS) {
  const file = new URL(wiki.file, root);
  const src = await readFile(file, 'utf8');
  const c = playerCampaign(wiki.playerId);
  // Bloco da campanha -ciddy: do "{" que antecede o eventKey até o "}" de fechamento.
  const keyIndex = src.indexOf(`eventKey: "${EVENT_KEY}"`);
  if (keyIndex < 0) throw new Error(`Campanha ${EVENT_KEY} não encontrada em ${wiki.file}`);
  const blockStart = src.lastIndexOf('{', keyIndex);
  let depth = 0, end = -1;
  for (let i = blockStart; i < src.length; i++) {
    if (src[i] === '{') depth++;
    if (src[i] === '}' && --depth === 0) { end = i + 1; break; }
  }
  const oldBlock = src.slice(blockStart, end);
  const readNum = (key) => Number(oldBlock.match(new RegExp(`${key}:\\s*(\\d+)`))?.[1] ?? 0);
  const old = { matches: readNum('matches'), wins: readNum('wins'), draws: readNum('draws'), losses: readNum('losses'), goals: readNum('goals'), yellowCards: readNum('yellowCards'), redCards: readNum('redCards'), goalsFor: readNum('goalsFor'), goalsAgainst: readNum('goalsAgainst'), points: readNum('points'), scoringMatches: readNum('scoringMatches'), cleanSheets: readNum('cleanSheets'), opponents: readNum('opponents') };
  const positionLabel = `${c.position}º lugar atual`;
  const campaignValues = wiki.style === 'finish'
    ? { finish: positionLabel, matches: c.m, wins: c.w, draws: c.d, losses: c.l, points: c.points, goals: c.goals, scoringMatches: c.scoringMatches, cleanSheets: c.cleanSheets, goalsFor: c.gf, goalsAgainst: c.ga, opponents: c.opponents.size }
    : { position: c.position, positionLabel, matches: c.m, wins: c.w, draws: c.d, losses: c.l, goals: c.goals, yellowCards: c.yellow, redCards: c.red, goalsFor: c.gf, goalsAgainst: c.ga };
  const newBlock = replaceFields(oldBlock, campaignValues);
  let updated = src.replace(oldBlock, newBlock);

  // Totais da carreira: aplica o delta da campanha apenas quando ela mudou,
  // tornando a execução idempotente (rodar duas vezes não duplica pontos).
  if (newBlock !== oldBlock) {
    const summaryMatch = src.match(/summary:\s*\{[\s\S]*?\n  \}/);
    if (!summaryMatch) throw new Error(`summary não encontrado em ${wiki.file}`);
    const oldSummary = summaryMatch[0];
    const delta = { matches: c.m - old.matches, wins: c.w - old.wins, draws: c.d - old.draws, losses: c.l - old.losses, goals: c.goals - old.goals, yellowCards: c.yellow - old.yellowCards, redCards: c.red - old.redCards, goalsFor: c.gf - old.goalsFor, goalsAgainst: c.ga - old.goalsAgainst, points: c.points - old.points, scoringMatches: c.scoringMatches - old.scoringMatches, cleanSheets: c.cleanSheets - old.cleanSheets, opponents: c.opponents.size - old.opponents };
    // Hat-tricks e braces não constam na campanha: com menos de 3 gols acumulados, não havia nenhum.
    const hasCareerBraces = /hatTricks:\s*\d+/.test(oldSummary) || /braces:\s*\d+/.test(oldSummary);
    const oldHat = old.goals >= 3 ? null : 0, oldBrace = old.goals >= 2 ? null : 0;
    if (hasCareerBraces && (oldHat === null || oldBrace === null)) wikiNotes.push(`${wiki.label}: revise hatTricks/braces manualmente (campanha já tinha ${old.goals} gols).`);
    delta.hatTricks = c.hatTricks - (oldHat ?? 0);
    delta.braces = c.braces - (oldBrace ?? 0);
    delta.blueCards = c.blue;
    delta.ownGoals = c.ownGoals;
    const summaryValues = {};
    for (const key of Object.keys(delta)) {
      const m = oldSummary.match(new RegExp(`${key}:\\s*(\\d+)`));
      if (m) summaryValues[key] = Number(m[1]) + delta[key];
    }
    updated = updated.replace(oldSummary, replaceFields(oldSummary, summaryValues));
  }
  if (updated !== src) await writeFile(file, updated);
  wikiNotes.push(`${wiki.label}: ${old.matches}→${c.m} jogos, ${old.goals}→${c.goals} gols, ${positionLabel}`);
  if (wiki.style === 'finish') {
    const record = src.match(/biggestWin:\s*"[^"]*?(\d+)–(\d+)[^"]*?"/);
    if (record && c.bigWin && c.bigWin.margin > Math.abs(Number(record[1]) - Number(record[2]))) {
      wikiNotes.push(`${wiki.label}: ATENÇÃO — novo recorde de maior goleada (${c.bigWin.score} vs ${teamName(c.bigWin.opponent)}), atualize records manualmente.`);
    }
  }
}

console.log(JSON.stringify({ teamsUpdated: 12, standings: standings.map(([tid], i) => `${i + 1}º ${teamName(tid)}`), wikis: wikiNotes }, null, 2));

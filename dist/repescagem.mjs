// A repescagem é criada no Copa Fácil como "5° x 12°" ainda sem equipes.
// Com a Primeira Fase encerrada, a classificação final define os confrontos.
// Nesta fase não existe pênalti: o empate classifica o time de melhor campanha.
export const FIRST_PHASE = '1780479913323';
export const REPESCAGEM_PHASE = '1780479913324';

const finished = m => Number(m?.st) === 3 || Boolean(m?.finished);
const validScore = m => [m.dt?.qt_g1, m.dt?.qt_g2].every(v => Number.isInteger(v) && v >= 0 && v <= 100);

// Ordem da Primeira Fase: a colocação oficial (col, base 0) quando completa;
// caso contrário, a classificação calculada com os desempates da competição.
export function firstPhaseSeeding(data) {
  const teams = data?.teams || {};
  const games = Object.values(data?.matchs || {}).filter(m => m?.fs === FIRST_PHASE);
  const ids = new Set(Object.keys(teams).filter(id => teams[id]?.dt?.[FIRST_PHASE]));
  for (const m of games) {
    if (teams[m.team1]) ids.add(m.team1);
    if (teams[m.team2]) ids.add(m.team2);
  }
  const rows = [...ids].map(id => ({ id, col: teams[id]?.dt?.[FIRST_PHASE]?.col, pts: 0, wins: 0, gf: 0, ga: 0 }));
  const byId = new Map(rows.map(row => [row.id, row]));
  for (const m of games) {
    if (!finished(m) || !validScore(m)) continue;
    const home = byId.get(m.team1), away = byId.get(m.team2);
    if (!home || !away) continue;
    const h = m.dt.qt_g1, a = m.dt.qt_g2;
    home.gf += h; home.ga += a; away.gf += a; away.ga += h;
    if (h > a) { home.pts += 3; home.wins++; } else if (h < a) { away.pts += 3; away.wins++; } else { home.pts++; away.pts++; }
  }
  const name = id => String(teams[id]?.name || '').trim().toLocaleLowerCase('pt-BR');
  const official = rows.length > 0 && rows.every(row => Number.isInteger(row.col));
  return rows.sort((a, b) => official
    ? a.col - b.col
    : b.pts - a.pts || b.wins - a.wins || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf || name(a.id).localeCompare(name(b.id), 'pt-BR'));
}

export function repescagemSeeds(title) {
  const found = String(title || '').match(/(\d+)\s*[°º]\s*x\s*(\d+)\s*[°º]/);
  return found ? [Number(found[1]), Number(found[2])] : null;
}

// Preenche as equipes dos confrontos pendentes da repescagem pela classificação
// final. Nunca sobrescreve nem complementa lados definidos oficialmente.
export function defineRepescagem(data) {
  const matchs = data?.matchs || {};
  const games = Object.values(matchs).filter(m => m?.fs === FIRST_PHASE);
  const pending = Object.entries(matchs).filter(([, m]) =>
    m?.fs === REPESCAGEM_PHASE && !finished(m) && !m.team1 && !m.team2);
  if (!pending.length || !games.length || games.some(m => !finished(m))) return matchs;
  const seeding = firstPhaseSeeding(data);
  let changed = false;
  const result = { ...matchs };
  for (const [id, m] of pending) {
    const seeds = repescagemSeeds(m.title);
    if (!seeds) continue;
    const [home, away] = seeds.map(seed => seeding[seed - 1]?.id);
    if (!home || !away || home === away) continue;
    result[id] = { ...m, team1: home, team2: away };
    changed = true;
  }
  return changed ? result : matchs;
}

// Lado beneficiado pelo empate: o de melhor campanha na Primeira Fase.
// O título "5° x 12°" já coloca a melhor campanha como mandante.
export function drawAdvantage(data, match) {
  if (match?.fs !== REPESCAGEM_PHASE || !match.team1 || !match.team2) return null;
  const col = id => data?.teams?.[id]?.dt?.[FIRST_PHASE]?.col;
  const [home, away] = [col(match.team1), col(match.team2)];
  if (Number.isInteger(home) && Number.isInteger(away) && home !== away) return home < away ? 'team1' : 'team2';
  return 'team1';
}

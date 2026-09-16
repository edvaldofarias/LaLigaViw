// Event action codes verified in Copa Fácil's public match UI:
// 1 goal, 3 yellow card, 4 red card, 5 blue card, 8 own goal.
// Player aggregate statistic codes (0/14/16) are a different dictionary.
const ACTIONS = { 1:'goals', 3:'yellow', 4:'red', 5:'blue', 8:'ownGoals' };
export function summarizeMatch(raw, match, playerById = {}) {
  const rows = new Map();
  const totals = { goals:0, yellow:0, red:0, blue:0, ownGoals:0 };
  const goalsByTeam = { [match.team1]:0, [match.team2]:0 };
  let unassigned = 0;
  for (const [eventId, event] of Object.entries(raw?.list || {})) {
    if (!event || typeof event !== 'object') continue;
    const kind = ACTIONS[event.ac];
    if (!kind) continue;
    totals[kind]++;
    // Keep the team actually recorded on this match, even after a transfer.
    const teamId = [match.team1, match.team2].includes(event.team1) ? event.team1 : null;
    if (!teamId) unassigned++;
    if (kind === 'goals' && teamId) goalsByTeam[teamId]++;
    const playerId = event.pl_id1 || null;
    const key = `${teamId || 'unknown'}:${playerId || eventId}`;
    if (!rows.has(key)) rows.set(key, { teamId, playerId,
      name: playerById[playerId]?.name || 'Jogador não identificado',
      goals:0, yellow:0, red:0, blue:0, ownGoals:0 });
    rows.get(key)[kind]++;
  }
  const players = [...rows.values()].sort((a,b)=>b.goals-a.goals||b.red-a.red||b.yellow-a.yellow||a.name.localeCompare(b.name,'pt-BR'));
  const score = [match.dt?.qt_g1,match.dt?.qt_g2];
  const scoreTotal = score.every(Number.isFinite) ? score[0]+score[1] : null;
  const recordedGoals = totals.goals+totals.ownGoals;
  return { players, totals, goalsByTeam, unassigned, recordedGoals,
    scoreTotal, goalDifference:scoreTotal==null?null:scoreTotal-recordedGoals,
    hasSheet:raw!=null, hasEvents:players.length>0 };
}

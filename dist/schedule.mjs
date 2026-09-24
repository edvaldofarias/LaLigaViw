export const MATCH_DAY_INTERVAL = 10 * 60 * 1000;
export const REST_DAY_INTERVAL = 12 * 60 * 60 * 1000;
const dayFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit'
});

export function brasiliaDate(timestamp) {
  if (!Number.isFinite(timestamp)) return null;
  const date = new Date(timestamp);
  if (!Number.isFinite(date.getTime())) return null;
  const parts = Object.fromEntries(dayFormatter.formatToParts(date).map(p => [p.type, p.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function refreshPolicy(matches, now = Date.now()) {
  const today = brasiliaDate(now);
  const matchDay = matches.some(m => brasiliaDate(m.d_i) === today);
  // A late game can end after midnight. Keep checking its final score for six
  // hours after kickoff instead of switching immediately to a twelve-hour wait.
  const awaitingFinal = matches.some(m => Number.isFinite(m.d_i) && m.d_i <= now && now-m.d_i < 6*3600000 &&
    !((Number(m.st)===3||m.finished) && [m.dt?.qt_g1,m.dt?.qt_g2].every(n=>Number.isInteger(n)&&n>=0)));
  return { matchDay, interval: matchDay || awaitingFinal ? MATCH_DAY_INTERVAL : REST_DAY_INTERVAL,
    label: matchDay ? 'Atualização a cada 10 min · Dia de jogos' : awaitingFinal ? 'Atualização a cada 10 min · Aguardando placares finais' : 'Atualização a cada 12 h · Hoje sem jogos' };
}

export function nextPolicyCheck(matches, lastAttempt, now = Date.now()) {
  const policy = refreshPolicy(matches, now);
  const [year, month, day] = brasiliaDate(now).split('-').map(Number);
  // Brasília is UTC-3 for the competition calendar. Re-evaluate at midnight
  // even when the 12-hour interval would otherwise extend into a match day.
  const midnight = Date.UTC(year, month - 1, day + 1, 3);
  return Math.min(lastAttempt + policy.interval, midnight);
}

export function courtLabel(value) {
  return String(value ?? '').trim().replace(/\bQ([12])\b/gi, 'Quadra $1');
}

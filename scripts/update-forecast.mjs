import { writeFile, rename } from 'node:fs/promises';
import { buildWeeklyForecast } from '../dist/forecast.mjs';

const root = new URL('../dist/', import.meta.url);
const base = 'https://copafacil-web.firebaseio.com/events/-ciddy/';
const now = Date.now();
const entries = await Promise.all(['matchs', 'teams', 'player'].map(async key => {
  const response = await fetch(`${base}${key}.json`, { signal: AbortSignal.timeout(20000), cache: 'no-store' });
  if (!response.ok) throw new Error(`${key}: HTTP ${response.status}`);
  const value = await response.json();
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${key}: unavailable data; preserving previous files`);
  return [key, value];
}));
const data = { ...Object.fromEntries(entries), fetchedAt: new Date(now).toISOString() };
const forecast = buildWeeklyForecast(data, now);
for (const [filename, value] of [['data.json', data], ['forecast.json', forecast]]) {
  const destination = new URL(filename, root), temporary = new URL(filename + '.tmp', root);
  await writeFile(temporary, JSON.stringify(value, null, filename === 'forecast.json' ? 2 : undefined));
  await rename(temporary, destination);
}
console.log(JSON.stringify({ cutoff: new Date(forecast.cutoff).toISOString(),
  historyMatches: forecast.historyCount, nextRound: forecast.predictions.length,
  forecasts: forecast.predictions.filter(p => p.status === 'ready').length }));

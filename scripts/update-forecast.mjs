import { normalizeCompetition } from '../dist/match-data.mjs';
import { readFile, writeFile, rename } from 'node:fs/promises';
import { buildForecast } from '../dist/forecast.mjs';

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
const data = normalizeCompetition({ ...Object.fromEntries(entries), fetchedAt: new Date(now).toISOString() });
let previous={},previousForecast;
try{previousForecast=JSON.parse(await readFile(new URL('forecast.json',root),'utf8'))}catch{}
try{previous=JSON.parse(await readFile(new URL('data.json',root),'utf8')).matchDetails||{}}catch{}
const completed=Object.entries(data.matchs).filter(([,m])=>m.st===3||m.finished).map(([id])=>id);
data.matchDetails={};
let cursor=0,detailFailures=0;
await Promise.all(Array.from({length:Math.min(4,completed.length)},async()=>{
  while(cursor<completed.length){
    const id=completed[cursor++];
    try{
      const response=await fetch(`${base}details/${encodeURIComponent(id)}.json`,{signal:AbortSignal.timeout(20000),cache:'no-store'});
      if(!response.ok)throw new Error(`HTTP ${response.status}`);
      const sheet=await response.json();
      if(sheet!==null&&(typeof sheet!=='object'||Array.isArray(sheet)))throw new Error('Invalid match sheet');
      data.matchDetails[id]={data:sheet,fetchedAt:Date.now(),error:false};
    }catch{
      detailFailures++;
      if(previous[id])data.matchDetails[id]={...previous[id],error:true};
    }
  }
}));
const forecast = buildForecast(data, now);
const changed=JSON.stringify(previousForecast)!==JSON.stringify(forecast);
if(changed)for (const [filename, value] of [['data.json', data], ['forecast.json', forecast]]) {
  const destination = new URL(filename, root), temporary = new URL(filename + '.tmp', root);
  await writeFile(temporary, JSON.stringify(value, null, filename === 'forecast.json' ? 2 : undefined));
  await rename(temporary, destination);
}
console.log(JSON.stringify({ changed, projection:forecast.qualification.status, cutoffs:forecast.qualification.cutoffs, cutoff: forecast.cutoff ? new Date(forecast.cutoff).toISOString() : null,
  historyMatches: forecast.historyCount, nextRound: forecast.predictions.length,
  forecasts: forecast.predictions.filter(p => p.status === 'ready').length,
  matchSheets:Object.keys(data.matchDetails).length,detailFailures }));
